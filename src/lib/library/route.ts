/** מצב הדף נשמר ב-hash כדי שכפתור "אחורה" וקישורים ישירים יעבדו בייצוא סטטי */

export type View =
  | { kind: "home" }
  | { kind: "topic"; path: string[] }
  | { kind: "article"; id: string }
  | { kind: "search" };

export function parseHash(hash: string): View {
  const raw = hash.replace(/^#/, "");
  if (raw === "search") return { kind: "search" };
  const eq = raw.indexOf("=");
  if (eq > 0) {
    const key = raw.slice(0, eq);
    const value = raw.slice(eq + 1);
    try {
      if (key === "a" && value) return { kind: "article", id: decodeURIComponent(value) };
      if (key === "t" && value) return { kind: "topic", path: value.split("/").map(decodeURIComponent) };
    } catch {
      /* hash פגום – חוזרים לדף הראשי */
    }
  }
  return { kind: "home" };
}

export function toHash(view: View): string {
  switch (view.kind) {
    case "article":
      return `#a=${encodeURIComponent(view.id)}`;
    case "topic":
      return `#t=${view.path.map(encodeURIComponent).join("/")}`;
    case "search":
      return "#search";
    default:
      return "";
  }
}

export function viewsEqual(a: View, b: View): boolean {
  return toHash(a) === toHash(b);
}
