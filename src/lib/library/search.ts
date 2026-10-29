/**
 * חיפוש בצד הלקוח: נירמול עברית, התאמת מאמרים, קטעי טקסט והדגשה.
 * ללא תלות ב-React / fs, כך שאפשר לבדוק אותו בנפרד.
 */
import { GENERAL_TOPIC, type LibraryArticle } from "./types";

/* ───────── נירמול ───────── */

const FINAL_LETTERS: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };
/** גרשיים וגרש בכל צורותיהם נמחקים, כך ש-י"ח = י”ח = יח */
const DROPPED = new Set(["'", '"', "’", "‘", "“", "”", "„", "׳", "״", "`", "´"]);
const WHITESPACE = /\s/;

/** ניקוד וטעמים */
function isMark(c: number): boolean {
  return (c >= 0x591 && c <= 0x5bd) || c === 0x5bf || c === 0x5c1 || c === 0x5c2 || c === 0x5c4 || c === 0x5c5 || c === 0x5c7;
}

/** מנרמל טקסט (בלי ניקוד, אותיות סופיות, גרשיים, רווחים, אותיות לטיניות קטנות) ושומר מיפוי למיקום המקורי */
export function normalizeWithMap(text: string): { norm: string; map: Int32Array } {
  const out: string[] = [];
  const map = new Int32Array(text.length);
  let n = 0;
  let lastSpace = true;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    let ch = text[i];
    if (isMark(code) || DROPPED.has(ch)) continue;
    if (code === 0x5be || WHITESPACE.test(ch)) {
      if (lastSpace) continue;
      ch = " ";
      lastSpace = true;
    } else {
      lastSpace = false;
      ch = FINAL_LETTERS[ch] ?? ch;
      const lower = ch.toLowerCase();
      if (lower.length === 1) ch = lower;
    }
    out.push(ch);
    map[n++] = i;
  }
  return { norm: out.join(""), map };
}

/** מילות החיפוש אחרי נירמול. exact = כל הביטוי כיחידה אחת */
export function getSearchTerms(query: string, exact: boolean): string[] {
  const norm = normalizeWithMap(query).norm.trim();
  if (!norm) return [];
  return exact ? [norm] : Array.from(new Set(norm.split(" ")));
}

/* ───────── אינדקס ───────── */

export type PreparedIndex = Record<string, { text: string; norm: string }>;

export function prepareIndex(raw: Record<string, string>): PreparedIndex {
  const out: PreparedIndex = {};
  for (const id of Object.keys(raw)) out[id] = { text: raw[id], norm: normalizeWithMap(raw[id]).norm };
  return out;
}

function countOccurrences(norm: string, term: string): number {
  let count = 0;
  for (let from = 0; ; ) {
    const i = norm.indexOf(term, from);
    if (i < 0) return count;
    count++;
    from = i + term.length;
  }
}

/** טווחי ההתאמה [התחלה, סוף) בטקסט המקורי, ממוזגים וממוינים */
export function findRanges(text: string, terms: string[]): [number, number][] {
  const { norm, map } = normalizeWithMap(text);
  const raw: [number, number][] = [];
  for (const term of terms) {
    if (!term) continue;
    for (let from = 0; ; ) {
      const i = norm.indexOf(term, from);
      if (i < 0) break;
      let end = map[i + term.length - 1] + 1;
      while (end < text.length && isMark(text.charCodeAt(end))) end++; // כולל ניקוד שאחרי האות האחרונה
      raw.push([map[i], end]);
      from = i + term.length;
    }
  }
  raw.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const merged: [number, number][] = [];
  for (const r of raw) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  return merged;
}

/* ───────── חיפוש ───────── */

export type Segment = { text: string; hit: boolean };

export type SearchResult = {
  id: string;
  titleSegments: Segment[];
  snippets: Segment[][];
  /** מספר ההופעות בטקסט (לא כולל הכותרת) */
  matches: number;
};

export type SearchRequest = {
  query: string;
  exact: boolean;
  /** שמות נושאים ראשיים; null = בכל הנושאים */
  scope: string[] | null;
};

export type SearchState = {
  id: number;
  status: "loading" | "ready" | "error";
  request: SearchRequest;
  terms: string[];
  results: SearchResult[];
};

const SNIPPET_BEFORE = 80;
const SNIPPET_AFTER = 120;
const MAX_SNIPPETS = 3;

function toSegments(text: string, ranges: [number, number][], from: number, to: number): Segment[] {
  const segs: Segment[] = [];
  let pos = from;
  for (const [s, e] of ranges) {
    if (e <= from || s >= to) continue;
    const a = Math.max(s, from);
    const b = Math.min(e, to);
    if (a > pos) segs.push({ text: text.slice(pos, a), hit: false });
    segs.push({ text: text.slice(a, b), hit: true });
    pos = b;
  }
  if (pos < to) segs.push({ text: text.slice(pos, to), hit: false });
  return segs;
}

function buildSnippets(text: string, ranges: [number, number][]): Segment[][] {
  const out: Segment[][] = [];
  let lastEnd = -1;
  for (const [s, e] of ranges) {
    if (s < lastEnd) continue;
    let from = Math.max(0, s - SNIPPET_BEFORE);
    let to = Math.min(text.length, e + SNIPPET_AFTER);
    if (from > 0) {
      const sp = text.indexOf(" ", from);
      if (sp !== -1 && sp < s) from = sp + 1;
    }
    if (to < text.length) {
      const sp = text.lastIndexOf(" ", to);
      if (sp > e) to = sp;
    }
    const segs = toSegments(text, ranges, from, to);
    if (from > 0) segs.unshift({ text: "… ", hit: false });
    if (to < text.length) segs.push({ text: " …", hit: false });
    out.push(segs);
    lastEnd = to;
    if (out.length >= MAX_SNIPPETS) break;
  }
  return out;
}

const compareHe = (a: string, b: string) => a.localeCompare(b, "he");

/**
 * מחזיר מאמרים שבהם מופיעות כל המילים (בכותרת או בטקסט), בתוך ההיקף שנבחר.
 * דירוג: הופעות בכותרת קודם, ואז מספר ההופעות בטקסט.
 */
export function searchArticles(
  index: PreparedIndex,
  articles: Record<string, LibraryArticle>,
  terms: string[],
  scope: string[] | null
): SearchResult[] {
  if (terms.length === 0) return [];
  const allowed = scope ? new Set(scope) : null;
  const hits: { id: string; matches: number; score: number }[] = [];

  for (const article of Object.values(articles)) {
    if (allowed && !allowed.has(article.topicPath[0] ?? GENERAL_TOPIC)) continue;
    const entry = index[article.id];
    if (!entry) continue;
    const titleNorm = normalizeWithMap(article.title).norm;
    let matches = 0;
    let titleHits = 0;
    let ok = true;
    for (const term of terms) {
      const inText = countOccurrences(entry.norm, term);
      const inTitle = countOccurrences(titleNorm, term);
      if (!inText && !inTitle) {
        ok = false;
        break;
      }
      matches += inText;
      titleHits += inTitle;
    }
    if (ok) hits.push({ id: article.id, matches, score: titleHits * 100 + matches });
  }

  hits.sort((a, b) => b.score - a.score || compareHe(articles[a.id].title, articles[b.id].title));

  return hits.map(({ id, matches }) => {
    const article = articles[id];
    const text = index[id].text;
    return {
      id,
      matches,
      titleSegments: toSegments(article.title, findRanges(article.title, terms), 0, article.title.length),
      snippets: buildSnippets(text, findRanges(text, terms)),
    };
  });
}

/* ───────── הדגשה בתוך מאמר פתוח (DOM) ───────── */

/** עוטף כל התאמה ב-<mark class="lib-hit">. מחזיר את הראשונה (לגלילה). */
export function highlightTerms(root: HTMLElement, terms: string[]): HTMLElement | null {
  if (terms.length === 0) return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeValue && n.nodeValue.trim()) nodes.push(n as Text);
  }

  let first: HTMLElement | null = null;
  for (const node of nodes) {
    const text = node.nodeValue ?? "";
    const ranges = findRanges(text, terms);
    if (ranges.length === 0) continue;
    const frag = document.createDocumentFragment();
    let pos = 0;
    for (const [s, e] of ranges) {
      if (s > pos) frag.append(text.slice(pos, s));
      const mark = document.createElement("mark");
      mark.className = "lib-hit";
      mark.textContent = text.slice(s, e);
      frag.append(mark);
      first ??= mark;
      pos = e;
    }
    if (pos < text.length) frag.append(text.slice(pos));
    node.replaceWith(frag);
  }
  return first;
}

export function clearHighlights(root: HTMLElement): void {
  root.querySelectorAll("mark.lib-hit").forEach((m) => m.replaceWith(document.createTextNode(m.textContent ?? "")));
  root.normalize();
}
