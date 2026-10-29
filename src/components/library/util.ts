import type { MouseEvent } from "react";

/** לחיצה רגילה (לא Ctrl/⌘/Shift/אמצעית) – רק אז מנווטים בתוך האפליקציה ולא בדפדפן */
export function isPlainClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : `${n} ${many}`;
}

export const articlesLabel = (n: number) => (n === 0 ? "אין מאמרים" : plural(n, "מאמר אחד", "מאמרים"));
