// Textbox state and logic

let activeTextbox: HTMLDivElement | null = null;
let ctx: CanvasRenderingContext2D;
let canvasWrapper: HTMLElement;
let getCoords: (e: MouseEvent | Touch) => { x: number; y: number };
let canvasWidth: number;
let canvasHeight: number;

export function initTextbox(
  wrapper: HTMLElement,
  context: CanvasRenderingContext2D,
  coordsFn: (e: MouseEvent | Touch) => { x: number; y: number },
  width: number,
  height: number
) {
  canvasWrapper = wrapper;
  ctx = context;
  getCoords = coordsFn;
  canvasWidth = width;
  canvasHeight = height;
}

export function createTextbox(e: MouseEvent | Touch) {
  // Remove any existing textbox first
  removeTextbox();

  const rect = canvasWrapper.getBoundingClientRect();
  const clientX = 'clientX' in e ? e.clientX : e.clientX;
  const clientY = 'clientY' in e ? e.clientY : e.clientY;
  
  // Position relative to wrapper (as percentage for responsiveness)
  const leftPx = clientX - rect.left;
  const topPx = clientY - rect.top;

  // Create container
  const box = document.createElement("div");
  box.className = "guestbook-textbox";
  box.style.cssText = `
    position: absolute;
    left: ${leftPx}px;
    top: ${topPx}px;
    min-width: 100px;
    min-height: 40px;
    border: 2px dashed #000;
    background: rgba(255,255,255,0.9);
    cursor: move;
    display: flex;
    flex-direction: column;
  `;

  // Create textarea
  const textarea = document.createElement("textarea");
  textarea.style.cssText = `
    width: 100%;
    height: 100%;
    min-height: 60px;
    border: none;
    background: transparent;
    resize: none;
    font-family: sans-serif;
    font-size: 14px;
    padding: 4px;
    box-sizing: border-box;
  `;
  textarea.placeholder = "Type here...";

  // Create button row
  const buttons = document.createElement("div");
  buttons.style.cssText = `
    display: flex;
    gap: 4px;
    padding: 4px;
    border-top: 1px solid #ccc;
    background: #f0f0f0;
  `;

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.style.cssText = "flex: 1; padding: 4px;";
  doneBtn.addEventListener("click", () => renderTextbox());

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.cssText = "flex: 1; padding: 4px;";
  cancelBtn.addEventListener("click", () => removeTextbox());

  buttons.appendChild(doneBtn);
  buttons.appendChild(cancelBtn);

  // Create resize handle
  const resizeHandle = document.createElement("div");
  resizeHandle.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    cursor: se-resize;
    background: linear-gradient(135deg, transparent 50%, #666 50%);
  `;

  box.appendChild(textarea);
  box.appendChild(buttons);
  box.appendChild(resizeHandle);
  canvasWrapper.appendChild(box);

  activeTextbox = box;
  textarea.focus();

  // Dragging
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  box.addEventListener("mousedown", (e) => {
    if (e.target === textarea || e.target === resizeHandle || e.target === doneBtn || e.target === cancelBtn) return;
    isDragging = true;
    dragOffsetX = e.clientX - box.offsetLeft;
    dragOffsetY = e.clientY - box.offsetTop;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    let newLeft = e.clientX - dragOffsetX;
    let newTop = e.clientY - dragOffsetY;
    
    // Keep within bounds
    newLeft = Math.max(0, Math.min(newLeft, wrapperRect.width - box.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, wrapperRect.height - box.offsetHeight));
    
    box.style.left = newLeft + "px";
    box.style.top = newTop + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Resizing
  let isResizing = false;
  let startWidth = 0;
  let startHeight = 0;
  let startX = 0;
  let startY = 0;

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    startWidth = box.offsetWidth;
    startHeight = box.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const newWidth = Math.max(100, startWidth + (e.clientX - startX));
    const newHeight = Math.max(60, startHeight + (e.clientY - startY));
    box.style.width = newWidth + "px";
    textarea.style.height = (newHeight - buttons.offsetHeight) + "px";
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
}

function renderTextbox() {
  if (!activeTextbox) return;

  const textarea = activeTextbox.querySelector("textarea")!;
  const text = textarea.value;
  if (!text.trim()) {
    removeTextbox();
    return;
  }

  const wrapperRect = canvasWrapper.getBoundingClientRect();
  const boxRect = activeTextbox.getBoundingClientRect();

  // Convert position to canvas coordinates
  const scaleX = canvasWidth / wrapperRect.width;
  const scaleY = canvasHeight / wrapperRect.height;

  const x = (boxRect.left - wrapperRect.left) * scaleX;
  const y = (boxRect.top - wrapperRect.top) * scaleY;
  const width = boxRect.width * scaleX;

  // Draw text with wrapping
  ctx.font = "24px sans-serif";
  ctx.fillStyle = "#000";

  const lineHeight = 28;
  const padding = 8 * scaleX;
  const maxWidth = width - (padding * 2);

  const lines = wrapText(text, maxWidth);
  lines.forEach((line, i) => {
    ctx.fillText(line, x + padding, y + padding + lineHeight + (i * lineHeight));
  });

  removeTextbox();
}

function wrapText(text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
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
    activeTextbox.remove();
    activeTextbox = null;
  }
}

export function hasActiveTextbox() {
  return activeTextbox !== null;
}