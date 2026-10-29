/** טיפוסים ופונקציות עזר של מאמרים שבטוחות לשימוש גם בצד הלקוח (ללא fs) */
import { stripMarkdown, truncateWords } from "./markdown-text";

export type PostMeta = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  tags: string[];
  /** תקציר ארוך (מתוך ה-frontmatter או הפסקה הראשונה) */
  excerpt: string;
  pdfLink?: string;
};

/** תקציר קצר לכרטיסיות (מספר מילים) */
export function shortExcerpt(post: PostMeta, words: number): string {
  return truncateWords(stripMarkdown(post.excerpt), words);
}
