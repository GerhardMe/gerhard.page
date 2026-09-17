// Drawing state and logic

import { addAction, state, DRAW_COLOR } from "./state.ts";

let isDrawing = false;
let brushSize = 3;
let ctx: CanvasRenderingContext2D;
let getCoords: (e: { clientX: number; clientY: number }) => { x: number; y: number };
let currentStroke: { x: number; y: number }[] = [];
let currentBrushSize = 3;
// The single pointer currently drawing. Any other pointer that arrives while
// this is set (e.g. a second finger) is ignored so the browser can pinch/pan.
let activePointerId: number | null = null;

export function initDrawing(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  coordsFn: (e: { clientX: number; clientY: number }) => { x: number; y: number }
) {
  ctx = context;
  getCoords = coordsFn;

  // Pointer events cover mouse, touch and pen with one code path.
  // No preventDefault anywhere: the canvas has `touch-action: pinch-zoom`,
  // so single-finger gestures reach us as pointer events while two-finger
  // gestures are taken by the browser (which fires pointercancel on ours).
  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerCancel);
}

function applyStrokeStyle(size: number) {
  ctx.lineWidth = size;
  ctx.strokeStyle = DRAW_COLOR;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
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
  applyStrokeStyle(currentBrushSize);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function endStroke() {
  if (isDrawing) {
    // A tap with no movement becomes a dot: duplicate the point (with a
    // tiny offset so every canvas renders the round cap).
    if (currentStroke.length === 1) {
      const { x, y } = currentStroke[0];
      continueStroke(x + 0.01, y);
    }
    addAction({
      type: "stroke",
      points: [...currentStroke],
      brushSize: currentBrushSize,
    });
  }
  isDrawing = false;
  currentStroke = [];
  activePointerId = null;
}

// Drop the in-progress stroke and erase its pixels (used when the browser
// takes over the gesture, e.g. a second finger starts a pinch).
function cancelStroke() {
  const hadInk = isDrawing && currentStroke.length > 1;
  isDrawing = false;
  currentStroke = [];
  activePointerId = null;
  if (hadInk) {
    (window as any).guestbook?.redrawActions();
  }
}

function handlePointerDown(e: PointerEvent) {
  if ((window as any).guestbookMode !== "draw") return;
  // Ignore secondary pointers (second finger) and non-primary mouse buttons.
  if (activePointerId !== null || !e.isPrimary) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;

  activePointerId = e.pointerId;
  // Keep receiving moves even if the pointer leaves the canvas.
  try {
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
  } catch {
    /* capture is best-effort */
  }
  const { x, y } = getCoords(e);
  startStroke(x, y);
}

function handlePointerMove(e: PointerEvent) {
  if (!isDrawing || e.pointerId !== activePointerId) return;

  // Phones sample touch faster than they dispatch events; the coalesced
  // list gives us the intermediate positions for smoother lines.
  const events =
    typeof e.getCoalescedEvents === "function" && e.getCoalescedEvents().length
      ? e.getCoalescedEvents()
      : [e];
  for (const ev of events) {
    const { x, y } = getCoords(ev);
    continueStroke(x, y);
  }
}

function handlePointerUp(e: PointerEvent) {
  if (e.pointerId !== activePointerId) return;
  endStroke();
}

function handlePointerCancel(e: PointerEvent) {
  if (e.pointerId !== activePointerId) return;
  cancelStroke();
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
  
  applyStrokeStyle(action.brushSize);
  ctx.beginPath();
  ctx.moveTo(action.points[0].x, action.points[0].y);
  
  for (let i = 1; i < action.points.length; i++) {
    ctx.lineTo(action.points[i].x, action.points[i].y);
  }
  ctx.stroke();
}