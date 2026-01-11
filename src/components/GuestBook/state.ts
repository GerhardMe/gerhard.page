// Shared state between guestbook components

// ========== CONFIGURABLE COLORS ==========
// Color for new drawings/text
export const DRAW_COLOR = "#ff0000";
// Color for loaded entries: configure INK_COLOR in backend/server.js
// =========================================

export const TOTAL_PAGES = 10;

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

// Store actions per page
const pageActions: Map<number, Action[]> = new Map();

export const state = {
  mode: "draw" as "draw" | "text",
  brushSize: 3,
  fontSize: 24,
  currentPage: 1,
  drawingCtx: null as CanvasRenderingContext2D | null,
  guestbookCtx: null as CanvasRenderingContext2D | null,
  canvasWidth: 1240,
  canvasHeight: Math.round(1240 * 1.4142),
  get actions(): Action[] {
    if (!pageActions.has(this.currentPage)) {
      pageActions.set(this.currentPage, []);
    }
    return pageActions.get(this.currentPage)!;
  },
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

export function setPage(page: number) {
  if (page >= 1 && page <= TOTAL_PAGES) {
    state.currentPage = page;
    notify();
  }
}

export function nextPage() {
  setPage(state.currentPage + 1);
}

export function prevPage() {
  setPage(state.currentPage - 1);
}

export function addAction(action: Action) {
  state.actions.push(action);
  notify();
}

export function undo(): Action | undefined {
  const actions = state.actions;
  const action = actions.pop();
  notify();
  return action;
}

export function clearActions() {
  const actions = state.actions;
  actions.length = 0;
  notify();
}

export function clearAllPages() {
  pageActions.clear();
  notify();
}