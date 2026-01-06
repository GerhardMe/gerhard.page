// Drawing state and logic

let isDrawing = false;
let brushSize = 3;
let ctx: CanvasRenderingContext2D;
let getCoords: (e: MouseEvent | Touch) => { x: number; y: number };

export function initDrawing(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  coordsFn: (e: MouseEvent | Touch) => { x: number; y: number }
) {
  ctx = context;
  getCoords = coordsFn;

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", handleMouseUp);

  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchend", handleMouseUp);
}

function handleMouseDown(e: MouseEvent) {
  if ((window as any).guestbookMode !== "draw") return;
  isDrawing = true;
  const { x, y } = getCoords(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function handleMouseMove(e: MouseEvent) {
  if ((window as any).guestbookMode !== "draw" || !isDrawing) return;
  const { x, y } = getCoords(e);
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = "#000";
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function handleMouseUp() {
  isDrawing = false;
}

function handleTouchStart(e: TouchEvent) {
  e.preventDefault();
  if ((window as any).guestbookMode !== "draw") return;
  isDrawing = true;
  const { x, y } = getCoords(e.touches[0]);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function handleTouchMove(e: TouchEvent) {
  e.preventDefault();
  if ((window as any).guestbookMode !== "draw" || !isDrawing) return;
  const { x, y } = getCoords(e.touches[0]);
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = "#000";
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

export function setBrushSize(size: number) {
  brushSize = size;
}

export function getBrushSize() {
  return brushSize;
}