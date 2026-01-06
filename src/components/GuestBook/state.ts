// Shared state between guestbook components

// ========== CONFIGURABLE COLOR ==========
// Change this to set the color for all drawing and text
export const DRAW_COLOR = "#000000";
// ========================================

export type StrokeAction = {
  type: "stroke";
  points: { x: number; y: number }[];
  brushSize: number;
};

export type TextAction = {
  type: "text";
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
};

export type Action = StrokeAction | TextAction;

export const state = {
  mode: "draw" as "draw" | "text",
  brushSize: 3,
  fontSize: 24,
  drawingCtx: null as CanvasRenderingContext2D | null,
  guestbookCtx: null as CanvasRenderingContext2D | null,
  canvasWidth: 1240,
  canvasHeight: Math.round(1240 * 1.4142),
  actions: [] as Action[],
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

export function addAction(action: Action) {
  state.actions.push(action);
  notify();
}

export function undo(): Action | undefined {
  const action = state.actions.pop();
  notify();
  return action;
}

export function clearActions() {
  state.actions = [];
  notify();
}