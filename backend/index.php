<?php
/**
 * Guestbook Backend API
 *
 * GET  /api/guestbook?page=N  - Returns composited PNG for page
 * POST /api/guestbook         - Saves new drawing layer
 */

// ========== CONFIGURATION ==========
define('DATA_DIR', __DIR__ . '/data/pages');
define('CANVAS_WIDTH', 1240);
define('CANVAS_HEIGHT', 1754);
define('MAX_IMAGE_SIZE', 5 * 1024 * 1024); // 5MB

// Ink color for displayed entries (RGB, 0-255)
define('INK_COLOR_R', 0);
define('INK_COLOR_G', 26);
define('INK_COLOR_B', 255);

// Page fullness threshold (0.0 - 1.0)
// When a page exceeds this, a new page becomes available
define('PAGE_FULL_THRESHOLD', 0.15); // 15% coverage = page is "full"
// ====================================

// Ensure GD is available
if (!extension_loaded('gd')) {
    http_response_code(500);
    die('GD extension required');
}

// Get client IP
function getClientIP(): string {
    return $_SERVER['HTTP_X_REAL_IP']
        ?? explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0]
        ?? $_SERVER['REMOTE_ADDR']
        ?? 'unknown';
}

// Generate random ID
function randomId(): string {
    return bin2hex(random_bytes(3));
}

// Sanitize IP for filename
function sanitizeIP(string $ip): string {
    return str_replace(['.', ':'], '-', trim($ip));
}

// Create blank transparent image
function createBlankImage(): GdImage {
    $img = imagecreatetruecolor(CANVAS_WIDTH, CANVAS_HEIGHT);
    imagesavealpha($img, true);
    imagealphablending($img, false);
    $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
    imagefill($img, 0, 0, $transparent);
    return $img;
}

// Convert image to grayscale while preserving alpha
function toGrayscale(GdImage $img): GdImage {
    $width = imagesx($img);
    $height = imagesy($img);

    $gray = imagecreatetruecolor($width, $height);
    imagesavealpha($gray, true);
    imagealphablending($gray, false);

    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
            $rgba = imagecolorat($img, $x, $y);
            $r = ($rgba >> 16) & 0xFF;
            $g = ($rgba >> 8) & 0xFF;
            $b = $rgba & 0xFF;
            $a = ($rgba >> 24) & 0x7F; // GD alpha: 0=opaque, 127=transparent

            // Convert to grayscale (luminance)
            $grayVal = (int)(0.299 * $r + 0.587 * $g + 0.114 * $b);

            $color = imagecolorallocatealpha($gray, $grayVal, $grayVal, $grayVal, $a);
            imagesetpixel($gray, $x, $y, $color);
        }
    }

    return $gray;
}

// Colorize grayscale image with ink color
function colorize(GdImage $img): GdImage {
    $width = imagesx($img);
    $height = imagesy($img);

    $colored = imagecreatetruecolor($width, $height);
    imagesavealpha($colored, true);
    imagealphablending($colored, false);

    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
            $rgba = imagecolorat($img, $x, $y);
            $gray = ($rgba >> 16) & 0xFF; // R channel (grayscale)
            $originalAlpha = ($rgba >> 24) & 0x7F; // GD: 0=opaque, 127=transparent

            // Darker gray = more visible ink
            // Convert GD alpha (0-127) to opacity (0-1), apply gray intensity, convert back
            $opacity = (127 - $originalAlpha) / 127;
            $intensity = (255 - $gray) / 255;
            $finalOpacity = $opacity * $intensity;
            $finalAlpha = (int)(127 - ($finalOpacity * 127));

            $color = imagecolorallocatealpha(
                $colored,
                INK_COLOR_R,
                INK_COLOR_G,
                INK_COLOR_B,
                $finalAlpha
            );
            imagesetpixel($colored, $x, $y, $color);
        }
    }

    return $colored;
}

// Composite source onto destination with alpha
function compositeOver(GdImage $dest, GdImage $src): void {
    imagealphablending($dest, true);
    imagecopy($dest, $src, 0, 0, 0, 0, imagesx($src), imagesy($src));
    imagealphablending($dest, false);
}

// Get head file info (cached composite)
function getHeadInfo(string $pageDir): ?array {
    $heads = glob($pageDir . '/head_*.png');
    if (empty($heads)) {
        return null;
    }
    $headFile = $heads[0];
    // Extract timestamp from filename: head_1234567890123.png
    if (preg_match('/head_(\d+)\.png$/', $headFile, $matches)) {
        return [
            'file' => $headFile,
            'timestamp' => (int)$matches[1]
        ];
    }
    return null;
}

// Get layer files newer than timestamp
function getNewLayers(string $pageDir, int $afterTimestamp): array {
    $files = glob($pageDir . '/*.png');
    $layers = [];
    foreach ($files as $file) {
        $basename = basename($file);
        // Skip head files
        if (str_starts_with($basename, 'head_')) {
            continue;
        }
        // Extract timestamp from layer filename
        if (preg_match('/^(\d+)_/', $basename, $matches)) {
            $ts = (int)$matches[1];
            if ($ts > $afterTimestamp) {
                $layers[$ts] = $file;
            }
        }
    }
    ksort($layers); // Sort by timestamp
    return array_values($layers);
}

// Get all layer files (excluding head)
function getAllLayers(string $pageDir): array {
    $files = glob($pageDir . '/*.png');
    $layers = [];
    foreach ($files as $file) {
        $basename = basename($file);
        if (!str_starts_with($basename, 'head_')) {
            if (preg_match('/^(\d+)_/', $basename, $matches)) {
                $layers[(int)$matches[1]] = $file;
            }
        }
    }
    ksort($layers);
    return array_values($layers);
}

// Handle GET request - return composited page (with caching)
function handleGet(): void {
    $page = max(1, (int)($_GET['page'] ?? 1));
    $pageDir = DATA_DIR . '/' . $page;

    // If directory doesn't exist, return blank
    if (!is_dir($pageDir)) {
        $blank = createBlankImage();
        header('Content-Type: image/png');
        imagepng($blank);
        imagedestroy($blank);
        return;
    }

    $headInfo = getHeadInfo($pageDir);

    if ($headInfo) {
        // Check for new layers since head was created
        $newLayers = getNewLayers($pageDir, $headInfo['timestamp']);

        if (empty($newLayers)) {
            // Head is up-to-date, serve it directly
            header('Content-Type: image/png');
            readfile($headInfo['file']);
            return;
        }

        // Load existing head and add new layers
        $composite = @imagecreatefrompng($headInfo['file']);
        if (!$composite) {
            // Head corrupted, rebuild from scratch
            $composite = createBlankImage();
            $newLayers = getAllLayers($pageDir);
        } else {
            imagesavealpha($composite, true);
            imagealphablending($composite, false);
        }

        // Get latest timestamp for new head name
        $latestTimestamp = $headInfo['timestamp'];

    } else {
        // No head exists, build from all layers
        $composite = createBlankImage();
        $newLayers = getAllLayers($pageDir);
        $latestTimestamp = 0;
    }

    // Composite new layers
    foreach ($newLayers as $file) {
        $layer = @imagecreatefrompng($file);
        if (!$layer) {
            error_log("Skipping invalid file: $file");
            continue;
        }

        imagesavealpha($layer, true);

        // Colorize the grayscale layer
        $colored = colorize($layer);
        imagedestroy($layer);

        // Composite onto result
        compositeOver($composite, $colored);
        imagedestroy($colored);

        // Track latest timestamp
        if (preg_match('/^(\d+)_/', basename($file), $matches)) {
            $latestTimestamp = max($latestTimestamp, (int)$matches[1]);
        }
    }

    // Save new head if we processed any layers
    if (!empty($newLayers) && $latestTimestamp > 0) {
        $newHeadFile = $pageDir . '/head_' . $latestTimestamp . '.png';
        imagesavealpha($composite, true);
        imagepng($composite, $newHeadFile);

        // Delete old head
        if ($headInfo && file_exists($headInfo['file'])) {
            unlink($headInfo['file']);
        }
    }

    // Output PNG
    header('Content-Type: image/png');
    imagepng($composite);
    imagedestroy($composite);
}

// Handle POST request - save new layer
function handlePost(): void {
    // Read JSON body
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['image']) || !isset($input['page'])) {
        http_response_code(400);
        die('Missing image or page');
    }

    $page = (int)$input['page'];
    $imageData = $input['image'];

    // Validate page
    if ($page < 1) {
        http_response_code(400);
        die('Invalid page number');
    }

    // Validate image format
    if (!str_starts_with($imageData, 'data:image/png;base64,')) {
        http_response_code(400);
        die('Invalid image format');
    }

    // Decode base64
    $base64 = substr($imageData, strlen('data:image/png;base64,'));
    if (strlen($base64) > MAX_IMAGE_SIZE * 1.4) {
        http_response_code(400);
        die('Image too large');
    }

    $binary = base64_decode($base64);
    if (!$binary) {
        http_response_code(400);
        die('Invalid base64');
    }

    // Create image from string
    $img = @imagecreatefromstring($binary);
    if (!$img) {
        http_response_code(400);
        die('Invalid image data');
    }

    imagesavealpha($img, true);

    // Convert to grayscale
    $grayscale = toGrayscale($img);
    imagedestroy($img);

    // Ensure directory exists
    $pageDir = DATA_DIR . '/' . $page;
    if (!is_dir($pageDir)) {
        mkdir($pageDir, 0755, true);
    }

    // Generate filename
    $timestamp = (int)(microtime(true) * 1000);
    $id = randomId();
    $ip = sanitizeIP(getClientIP());
    $filename = "{$timestamp}_{$id}_{$ip}.png";
    $filepath = "$pageDir/$filename";

    // Save PNG
    imagesavealpha($grayscale, true);
    imagepng($grayscale, $filepath);
    imagedestroy($grayscale);

    error_log("Saved: $filename (page $page)");
    echo 'OK';
}

// Build head for a page (used when head doesn't exist)
function buildHead(string $pageDir): ?string {
    $layers = getAllLayers($pageDir);
    if (empty($layers)) {
        return null;
    }

    $composite = createBlankImage();
    $latestTimestamp = 0;

    foreach ($layers as $file) {
        $layer = @imagecreatefrompng($file);
        if (!$layer) {
            continue;
        }

        imagesavealpha($layer, true);
        $colored = colorize($layer);
        imagedestroy($layer);

        compositeOver($composite, $colored);
        imagedestroy($colored);

        if (preg_match('/^(\d+)_/', basename($file), $matches)) {
            $latestTimestamp = max($latestTimestamp, (int)$matches[1]);
        }
    }

    if ($latestTimestamp > 0) {
        $headFile = $pageDir . '/head_' . $latestTimestamp . '.png';
        imagesavealpha($composite, true);
        imagepng($composite, $headFile);
        imagedestroy($composite);
        return $headFile;
    }

    imagedestroy($composite);
    return null;
}

// Calculate page usage (0.0 - 1.0) by sampling pixels
function getPageUsage(int $page): float {
    $pageDir = DATA_DIR . '/' . $page;

    if (!is_dir($pageDir)) {
        return 0.0;
    }

    // Try to use head file for fast calculation
    $headInfo = getHeadInfo($pageDir);
    if (!$headInfo) {
        // No head - check if layers exist and build head
        $layers = getAllLayers($pageDir);
        if (empty($layers)) {
            return 0.0;
        }
        // Build the head now
        $headFile = buildHead($pageDir);
        if (!$headFile) {
            return 0.0;
        }
        $headInfo = ['file' => $headFile];
    }

    // Load head and sample pixels
    $img = @imagecreatefrompng($headInfo['file']);
    if (!$img) {
        return 0.0;
    }

    $width = imagesx($img);
    $height = imagesy($img);

    // Sample every 10th pixel for speed
    $sampleStep = 10;
    $sampledPixels = 0;
    $nonTransparentPixels = 0;

    for ($y = 0; $y < $height; $y += $sampleStep) {
        for ($x = 0; $x < $width; $x += $sampleStep) {
            $rgba = imagecolorat($img, $x, $y);
            $alpha = ($rgba >> 24) & 0x7F;
            // Count pixels that are not fully transparent
            if ($alpha < 127) {
                $nonTransparentPixels++;
            }
            $sampledPixels++;
        }
    }

    imagedestroy($img);

    if ($sampledPixels === 0) {
        return 0.0;
    }

    return $nonTransparentPixels / $sampledPixels;
}

// Get total number of available pages
function getTotalPages(): int {
    // Start with at least 1 page
    $totalPages = 1;

    // Find existing page directories
    if (is_dir(DATA_DIR)) {
        $dirs = glob(DATA_DIR . '/*', GLOB_ONLYDIR);
        foreach ($dirs as $dir) {
            $pageNum = (int)basename($dir);
            if ($pageNum > 0) {
                $totalPages = max($totalPages, $pageNum);
            }
        }
    }

    // Check if the last page is full enough to warrant a new one
    $lastPageUsage = getPageUsage($totalPages);
    if ($lastPageUsage >= PAGE_FULL_THRESHOLD) {
        $totalPages++;
    }

    return $totalPages;
}

// Handle GET /api/guestbook/info - return page count
function handleGetInfo(): void {
    header('Content-Type: application/json');
    echo json_encode([
        'pages' => getTotalPages()
    ]);
}

// Router
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'] ?? '';

// Check for /info endpoint
if ($method === 'GET' && (str_contains($path, '/info') || ($_GET['action'] ?? '') === 'info')) {
    handleGetInfo();
} elseif ($method === 'GET') {
    handleGet();
} elseif ($method === 'POST') {
    handlePost();
} else {
    http_response_code(405);
    die('Method not allowed');
}
