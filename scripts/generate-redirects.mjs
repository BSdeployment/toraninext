/**
 * יוצר out/_redirects (Cloudflare Pages / Netlify) כדי שכתובות המאמרים הישנות של Jekyll
 *   /2026/04/13/שם-המאמר.html
 * ימשיכו לעבוד ויפנו לכתובת החדשה /articles/שם-המאמר/
 * (בשרתים שלא תומכים בקובץ _redirects, כגון GitHub Pages, הקובץ פשוט מתעלמים ממנו).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { buildSlug } from "../src/lib/slug.mjs";

const postsDir = path.join(process.cwd(), "content", "posts");
const outDir = path.join(process.cwd(), "out");
if (!fs.existsSync(outDir)) process.exit(0);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

const lines = [];
for (const full of walk(postsDir)) {
  const m = /^(?:(\d{4}-\d{2}-\d{2})-)?(.+)\.mdx?$/.exec(path.basename(full));
  if (!m) continue;
  const { data } = matter(fs.readFileSync(full, "utf8"));
  const iso = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : m[1];
  if (!iso) continue;
  const [y, mo, d] = iso.split("-");
  const newSlug = buildSlug({ date: iso, fileName: m[2], frontmatterSlug: data.slug });
  // Jekyll הופך כל רצף תווים שאינו אות/ספרה למקף
  const legacySlug = m[2].replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
  // כתובת Jekyll הישנה: /YYYY/MM/DD/<שם-הקובץ>.html
  lines.push(`/${y}/${mo}/${d}/${encodeURIComponent(legacySlug)}.html /articles/${newSlug}/ 301`);
}
fs.writeFileSync(path.join(outDir, "_redirects"), lines.join("\n") + "\n");
console.log(`_redirects: ${lines.length} legacy post redirect(s)`);
