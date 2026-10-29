import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";
import { stripMarkdown } from "./markdown-text";
import type { PostMeta } from "./post-utils";
import { buildSlug } from "./slug.mjs";

export type { PostMeta };
export { shortExcerpt } from "./post-utils";

/**
 * המאמרים נשמרים כקבצי Markdown ב-content/posts (וגם בכל תיקיית משנה, בכל עומק), בפורמט:  YYYY-MM-DD-שם-המאמר.md
 * (הכתובת: /articles/YYYY-MM-DD-<שם-באנגלית או האש>/ – ראו slug.mjs; אפשר לקבוע שם עם `slug:` ב-frontmatter)
 */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
/** שם קובץ: [YYYY-MM-DD-]שם.md  (התאריך בשם הקובץ אופציונלי אם יש date ב-frontmatter) */
const FILE_RE = /^(?:(\d{4}-\d{2}-\d{2})-)?(.+)\.mdx?$/;

/** מחזיר נתיבים (יחסיים ל-POSTS_DIR) של כל קבצי ה-md בכל עומק של תתי-תיקיות */
function listPostFiles(dir = POSTS_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name.startsWith(".") ? [] : listPostFiles(full);
    return FILE_RE.test(entry.name) && entry.name.toLowerCase() !== "readme.md"
      ? [path.relative(POSTS_DIR, full)]
      : [];
  });
}

export type Post = PostMeta & { html: string };

/** מאמר טעון: מטא-דאטה, תוכן ה-Markdown, התיקיות שמעליו (= נושא ותתי-נושאים) וסדר ידני אופציונלי */
type LoadedPost = { meta: PostMeta; content: string; topicPath: string[]; order?: number };

function toIsoDate(value: unknown, fallback: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return fallback;
}

function readPostFile(file: string): LoadedPost | null {
  const m = FILE_RE.exec(path.basename(file));
  if (!m) return null;
  const [, fileDate = "", name] = m;
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (data.published === false) return null;

  const plain = stripMarkdown(
    content.replace(/^\s*#\s+.*$/m, "") // בלי הכותרת הראשית
  );
  const excerpt = typeof data.excerpt === "string" && data.excerpt.trim() ? data.excerpt.trim() : plain;

  const date = toIsoDate(data.date, fileDate || fs.statSync(path.join(POSTS_DIR, file)).mtime.toISOString().slice(0, 10));
  const slug = buildSlug({
    date,
    fileName: name,
    frontmatterSlug: typeof data.slug === "string" ? data.slug : undefined,
  });

  return {
    content,
    // שמות התיקיות שבין content/posts לקובץ = נושא ראשי, תת-נושא וכו'
    topicPath: path.dirname(file).split(/[\\/]/).filter((part) => part && part !== "."),
    order: typeof data.order === "number" ? data.order : undefined,
    meta: {
      slug,
      title: String(data.title ?? name.replace(/-/g, " ")),
      date,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      excerpt,
      pdfLink: typeof data.pdf_link === "string" ? data.pdf_link : undefined,
    },
  };
}

let cache: LoadedPost[] | null = null;

/** טוען את כל הפוסטים מכל תתי-התיקיות (פעם אחת לכל build) */
function loadAll() {
  if (cache) return cache;
  const seen = new Map<string, string>();
  cache = listPostFiles()
    .map((file) => {
      const parsed = readPostFile(file);
      if (!parsed) return null;
      const dup = seen.get(parsed.meta.slug);
      if (dup) throw new Error(`slug כפול "${parsed.meta.slug}": ${dup} ו-${file}`);
      seen.set(parsed.meta.slug, file);
      return parsed;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
  return cache;
}

/** כל המאמרים (מטא-דאטה בלבד), מהחדש לישן לפי תאריך הפוסט – ללא קשר לתיקייה */
export function getAllPosts(): PostMeta[] {
  return loadAll()
    .map((p) => p.meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug, "he")));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const found = loadAll().find((p) => p.meta.slug === slug);
  return found ? { ...found.meta, html: await markdownToHtml(found.content) } : null;
}

export type LibraryEntry = {
  meta: PostMeta;
  /** שמות התיקיות מעל המאמר; מערך ריק = המאמר יושב ישירות ב-content/posts */
  topicPath: string[];
  /** `order:` מה-frontmatter (אופציונלי) – קובע סדר מאמרים בתוך נושא */
  order?: number;
  markdown: string;
};

/** כל המאמרים עם מיקומם בעץ התיקיות – מקור הנתונים של דף "ספריית תוכן" */
export function getLibraryEntries(): LibraryEntry[] {
  return loadAll().map(({ meta, topicPath, order, content }) => ({ meta, topicPath, order, markdown: content }));
}
