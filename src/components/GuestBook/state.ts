// Shared state between guestbook components

export const state = {
  mode: "draw" as "draw" | "text",
  brushSize: 3,
  fontSize: 24,
  drawingCtx: null as CanvasRenderingContext2D | null,
  guestbookCtx: null as CanvasRenderingContext2D | null,
  canvasWidth: 1240,
  canvasHeight: Math.round(1240 * 1.4142),
};

type Listener = () => void;
const listeners: Listener[] = [];

export function subscribe(fn: Listener) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function notify() {
  listeners.forEach(fn => fn());
}

export function setMode(mode: "draw" | "text") {
  state.mode = mode;
  (window as any).guestbookMode = mode; // for drawing.ts compatibility
  notify();
}

export function setBrushSize(size: number) {
  state.brushSize = size;
  notify();
}

export function setFontSize(size: number) {
  state.fontSize = size;
  notify();
}