import express from "express";
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data", "pages");
const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 1754;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// ========== CONFIGURABLE INK COLOR ==========
// Color for displayed guestbook entries (RGB, 0-255)
const INK_COLOR = { r: 0, g: 26, b: 255 }; // Blue (#001aff)
// ============================================

const app = express();
app.use(express.json({ limit: "10mb" }));

// Get client IP from proxy headers or direct connection
function getClientIP(req) {
  return (
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

// Generate random ID
function randomId() {
  return crypto.randomBytes(3).toString("hex");
}

// Sanitize IP for filename (replace dots/colons with dashes)
function sanitizeIP(ip) {
  return ip.replace(/[.:]/g, "-");
}

// GET /api/guestbook?page=N - Return composited image for page
app.get("/api/guestbook", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  if (page < 1) {
    return res.status(400).send("Invalid page number");
  }

  const pageDir = join(DATA_DIR, String(page));

  try {
    // Create blank transparent image
    const createBlank = () =>
      sharp({
        create: {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toBuffer();

    // Check if page directory exists
    if (!existsSync(pageDir)) {
      const blank = await createBlank();
      res.type("image/png").send(blank);
      return;
    }

    // Read and sort layer files
    const files = await readdir(pageDir);
    const pngFiles = files.filter((f) => f.endsWith(".png")).sort();

    if (pngFiles.length === 0) {
      const blank = await createBlank();
      res.type("image/png").send(blank);
      return;
    }

    // Start with transparent background
    let composite = sharp({
      create: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    // Build composite inputs by colorizing each grayscale layer
    const compositeInputs = [];
    for (const file of pngFiles) {
      const filePath = join(pageDir, file);
      try {
        // Load grayscale image and get raw pixels
        const { data, info } = await sharp(filePath)
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        // Colorize: grayscale value becomes alpha, RGB becomes ink color
        const colorized = Buffer.alloc(info.width * info.height * 4);
        for (let i = 0; i < info.width * info.height; i++) {
          const gray = data[i * 4]; // Grayscale value (R channel)
          const originalAlpha = data[i * 4 + 3];
          // Combine: darker gray = more opaque ink
          const alpha = Math.round(((255 - gray) / 255) * originalAlpha);

          colorized[i * 4] = INK_COLOR.r;
          colorized[i * 4 + 1] = INK_COLOR.g;
          colorized[i * 4 + 2] = INK_COLOR.b;
          colorized[i * 4 + 3] = alpha;
        }

        const colorizedPng = await sharp(colorized, {
          raw: { width: info.width, height: info.height, channels: 4 },
        })
          .png()
          .toBuffer();

        compositeInputs.push({
          input: colorizedPng,
          top: 0,
          left: 0,
          blend: "over",
        });
      } catch (err) {
        console.warn(`Skipping invalid file: ${file}`, err.message);
      }
    }

    // Composite all colorized layers
    const result = await composite
      .composite(compositeInputs)
      .png()
      .toBuffer();

    res.type("image/png").send(result);
  } catch (err) {
    console.error("Error loading guestbook:", err);
    res.status(500).send("Error loading guestbook");
  }
});

// POST /api/guestbook - Save new layer
app.post("/api/guestbook", async (req, res) => {
  const { image, page } = req.body;

  // Validate page
  const pageNum = parseInt(page);
  if (!pageNum || pageNum < 1) {
    return res.status(400).send("Invalid page number");
  }

  // Validate image
  if (!image || !image.startsWith("data:image/png;base64,")) {
    return res.status(400).send("Invalid image format");
  }

  // Check image size (base64 is ~33% larger than binary)
  const base64Data = image.replace(/^data:image\/png;base64,/, "");
  if (base64Data.length > MAX_IMAGE_SIZE * 1.4) {
    return res.status(400).send("Image too large");
  }

  try {
    // Get client IP and generate filename
    const ip = getClientIP(req);
    const timestamp = Date.now();
    const id = randomId();
    const filename = `${timestamp}_${id}_${sanitizeIP(ip)}.png`;

    // Ensure page directory exists
    const pageDir = join(DATA_DIR, String(pageNum));
    await mkdir(pageDir, { recursive: true });

    // Decode and convert to grayscale while preserving alpha
    const buffer = Buffer.from(base64Data, "base64");

    // Convert to grayscale but keep alpha channel
    // This preserves transparency so overlapping entries show through
    const grayscale = await sharp(buffer)
      .grayscale()
      .png()
      .toBuffer();

    await writeFile(join(pageDir, filename), grayscale);

    console.log(`Saved: ${filename} (page ${pageNum})`);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error saving entry:", err);
    res.status(500).send("Error saving entry");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Guestbook backend running on port ${PORT}`);
});
