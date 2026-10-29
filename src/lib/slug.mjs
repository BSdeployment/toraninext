import { createHash } from "node:crypto";

/**
 * בונה slug בטוח ל-URL (ASCII בלבד), בלי לדרוש שום שינוי בקבצי המאמרים.
 * (Next לא מצליח להתאים פרמטרים בעברית ב-output: export – dev מחזיר "missing param",
 *  וב-build נוצרות תיקיות עם %D7 שאחסון סטטי לא מוצא.)
 *
 * תבנית:  YYYY-MM-DD-<שם>
 *   <שם> = frontmatter.slug אם קיים (אופציונלי),
 *          אחרת שם הקובץ אם הוא כולו באנגלית/מספרים,
 *          אחרת האש של 8 תווים משם הקובץ המלא (דטרמיניסטי, לא תלוי בתיקייה).
 * אותו תאריך + אותו שם קובץ = אותה כתובת, ואז ה-build נעצר עם הודעה ברורה.
 */
export function buildSlug({ date, fileName, frontmatterSlug }) {
  const clean = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const base = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  let name = frontmatterSlug ? clean(frontmatterSlug) : "";
  if (!name && /^[\x20-\x7e]+$/.test(base)) name = clean(base);
  if (!name) name = createHash("sha1").update(base).digest("hex").slice(0, 8);

  return `${date}-${name}`;
}
