// Drawing state and logic

import { addAction, state, DRAW_COLOR } from "./state.ts";

let isDrawing = false;
let brushSize = 3;
let ctx: CanvasRenderingContext2D;
let getCoords: (e: MouseEvent | Touch) => { x: number; y: number };
let currentStroke: { x: number; y: number }[] = [];
let currentBrushSize = 3;

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

  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd);
}

function startStroke(x: number, y: number) {
  isDrawing = true;
  currentStroke = [{ x, y }];
  currentBrushSize = brushSize;
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function continueStroke(x: number, y: number) {
  currentStroke.push({ x, y });
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = DRAW_COLOR;
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function endStroke() {
  if (isDrawing && currentStroke.length > 1) {
    addAction({
      type: "stroke",
      points: [...currentStroke],
      brushSize: currentBrushSize,
    });
  }
  isDrawing = false;
  currentStroke = [];
}

// Cancel stroke without saving (used when multi-touch detected)
function cancelStroke() {
  isDrawing = false;
  currentStroke = [];
}

function handleMouseDown(e: MouseEvent) {
  if ((window as any).guestbookMode !== "draw") return;
  const { x, y } = getCoords(e);
  startStroke(x, y);
}

function handleMouseMove(e: MouseEvent) {
  if ((window as any).guestbookMode !== "draw" || !isDrawing) return;
  const { x, y } = getCoords(e);
  continueStroke(x, y);
}

function handleMouseUp() {
  endStroke();
}

function handleTouchStart(e: TouchEvent) {
  if ((window as any).guestbookMode !== "draw") return;
  
  // Multi-touch: cancel any drawing and let browser handle zoom/pan
  if (e.touches.length > 1) {
    cancelStroke();
    return; // Don't preventDefault - allow pinch zoom
  }
  
  e.preventDefault();
  const { x, y } = getCoords(e.touches[0]);
  startStroke(x, y);
}

function handleTouchMove(e: TouchEvent) {
  if ((window as any).guestbookMode !== "draw") return;
  
  // Multi-touch: cancel drawing and let browser handle zoom/pan
  if (e.touches.length > 1) {
    cancelStroke();
    return; // Don't preventDefault - allow pinch zoom
  }
  
  if (!isDrawing) return;
  
  e.preventDefault();
  const { x, y } = getCoords(e.touches[0]);
  continueStroke(x, y);
}

function handleTouchEnd(e: TouchEvent) {
  // Only end stroke if no more touches remain
  if (e.touches.length === 0) {
    endStroke();
  }
}

export function setBrushSize(size: number) {
  brushSize = size;
}

export function getBrushSize() {
  return brushSize;
}

// Redraw a single stroke action
export function drawStroke(action: { points: { x: number; y: number }[]; brushSize: number }) {
  if (action.points.length < 2) return;
  
  ctx.lineWidth = action.brushSize;
  ctx.strokeStyle = DRAW_COLOR;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(action.points[0].x, action.points[0].y);
  
  for (let i = 1; i < action.points.length; i++) {
    ctx.lineTo(action.points[i].x, action.points[i].y);
  }
  ctx.stroke();
}