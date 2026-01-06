// Textbox state and logic

let activeTextbox: HTMLDivElement | null = null;
let ctx: CanvasRenderingContext2D;
let canvasWrapper: HTMLElement;
let canvasWidth: number;
let canvasHeight: number;
let fontSize = 24;

export function initTextbox(
  wrapper: HTMLElement,
  context: CanvasRenderingContext2D,
  coordsFn: (e: MouseEvent | Touch) => { x: number; y: number },
  width: number,
  height: number
) {
  canvasWrapper = wrapper;
  ctx = context;
  canvasWidth = width;
  canvasHeight = height;

  // Escape to cancel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeTextbox) {
      removeTextbox();
    }
  });
}

export function setFontSize(size: number) {
  fontSize = size;
  if (activeTextbox) {
    const textarea = activeTextbox.querySelector("textarea")!;
    textarea.style.fontSize = fontSize + "px";
    textarea.style.lineHeight = (fontSize * 1.2) + "px";
    autoGrow(textarea);
  }
}

export function getFontSize() {
  return fontSize;
}

function autoGrow(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

export function createTextbox(e: MouseEvent | Touch) {
  removeTextbox();

  const rect = canvasWrapper.getBoundingClientRect();
  const clientX = 'clientX' in e ? e.clientX : e.clientX;
  const clientY = 'clientY' in e ? e.clientY : e.clientY;
  
  const leftPx = clientX - rect.left;
  const topPx = clientY - rect.top;

  // Create container
  const box = document.createElement("div");
  box.className = "guestbook-textbox";
  box.style.cssText = `
    position: absolute;
    left: ${leftPx}px;
    top: ${topPx}px;
    width: 200px;
    display: flex;
    cursor: move;
  `;

  // Left bracket (double line)
  const leftBracket = document.createElement("div");
  leftBracket.style.cssText = `
    width: 8px;
    flex-shrink: 0;
    display: flex;
    gap: 2px;
  `;
  const leftLine1 = document.createElement("div");
  leftLine1.style.cssText = `width: 2px; background: #000;`;
  const leftLine2 = document.createElement("div");
  leftLine2.style.cssText = `width: 2px; background: #000;`;
  leftBracket.appendChild(leftLine1);
  leftBracket.appendChild(leftLine2);

  // Text area container
  const textContainer = document.createElement("div");
  textContainer.style.cssText = `
    flex: 1;
    min-width: 50px;
    background: rgba(255,255,255,0.8);
  `;

  // Textarea
  const textarea = document.createElement("textarea");
  textarea.style.cssText = `
    width: 100%;
    border: none;
    background: transparent;
    resize: none;
    font-family: sans-serif;
    font-size: ${fontSize}px;
    line-height: ${fontSize * 1.2}px;
    padding: 2px 4px;
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
  `;
  textarea.placeholder = "Type...";
  textarea.rows = 1;

  // Auto-grow on input
  textarea.addEventListener("input", () => autoGrow(textarea));

  // Right bracket (double line, draggable for width)
  const rightBracket = document.createElement("div");
  rightBracket.style.cssText = `
    width: 8px;
    flex-shrink: 0;
    display: flex;
    gap: 2px;
    cursor: ew-resize;
  `;
  const rightLine1 = document.createElement("div");
  rightLine1.style.cssText = `width: 2px; background: #000;`;
  const rightLine2 = document.createElement("div");
  rightLine2.style.cssText = `width: 2px; background: #000;`;
  rightBracket.appendChild(rightLine1);
  rightBracket.appendChild(rightLine2);

  textContainer.appendChild(textarea);
  box.appendChild(leftBracket);
  box.appendChild(textContainer);
  box.appendChild(rightBracket);
  canvasWrapper.appendChild(box);

  activeTextbox = box;
  textarea.focus();

  // Prevent canvas click when interacting with textbox
  box.addEventListener("click", (e) => e.stopPropagation());

  // Dragging the whole box
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  box.addEventListener("mousedown", (e) => {
    if (e.target === rightBracket) return;
    isDragging = true;
    dragOffsetX = e.clientX - box.offsetLeft;
    dragOffsetY = e.clientY - box.offsetTop;
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const wrapperRect = canvasWrapper.getBoundingClientRect();
      let newLeft = e.clientX - dragOffsetX;
      let newTop = e.clientY - dragOffsetY;
      
      // Allow overflow, just keep left edge in bounds
      newLeft = Math.max(-box.offsetWidth + 20, Math.min(newLeft, wrapperRect.width - 20));
      
      box.style.left = newLeft + "px";
      box.style.top = newTop + "px";
    }
    if (isResizing) {
      const boxRect = box.getBoundingClientRect();
      const newWidth = Math.max(60, e.clientX - boxRect.left);
      box.style.width = newWidth + "px";
      autoGrow(textarea);
    }
  };

  const handleMouseUp = () => {
    isDragging = false;
    isResizing = false;
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // Store cleanup function
  (box as any)._cleanup = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Resizing width via right bracket
  let isResizing = false;

  rightBracket.addEventListener("mousedown", (e) => {
    isResizing = true;
    e.preventDefault();
    e.stopPropagation();
  });
}

export function confirmTextbox() {
  if (!activeTextbox) return;

  const textarea = activeTextbox.querySelector("textarea")!;
  const text = textarea.value;
  if (!text.trim()) {
    removeTextbox();
    return;
  }

  const wrapperRect = canvasWrapper.getBoundingClientRect();
  const boxRect = activeTextbox.getBoundingClientRect();

  const scaleX = canvasWidth / wrapperRect.width;
  const scaleY = canvasHeight / wrapperRect.height;

  const x = (boxRect.left - wrapperRect.left + 8) * scaleX; // +8 for left bracket
  const y = (boxRect.top - wrapperRect.top) * scaleY;
  const width = (boxRect.width - 16) * scaleX; // -16 for both brackets

  const scaledFontSize = fontSize * scaleX;
  ctx.font = `${scaledFontSize}px sans-serif`;
  ctx.fillStyle = "#000";

  const lineHeight = scaledFontSize * 1.2;
  const padding = 4 * scaleX;
  const maxWidth = width - (padding * 2);

  const lines = wrapText(text, maxWidth);
  lines.forEach((line, i) => {
    ctx.fillText(line, x + padding, y + scaledFontSize + (i * lineHeight));
  });

  removeTextbox();
}

function wrapText(text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    if (paragraph === "") {
      lines.push("");
      return;
    }
    const words = paragraph.split(" ");
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? currentLine + " " + word : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
}

export function removeTextbox() {
  if (activeTextbox) {
    if ((activeTextbox as any)._cleanup) {
      (activeTextbox as any)._cleanup();
    }
    activeTextbox.remove();
    activeTextbox = null;
  }
}

export function hasActiveTextbox() {
  return activeTextbox !== null;
}