import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { siteConfig } from "@/config/site";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
    .use(remarkRehype, {
    allowDangerousHtml: true,
    // כותרת הערות השוליים נשלטת מ-siteConfig.footnotesTitle; כשהיא ריקה הכותרת מוסתרת ויזואלית
    footnoteLabel: siteConfig.footnotesTitle || "הערות שוליים",
    footnoteLabelProperties: { className: [siteConfig.footnotesTitle ? "footnotes-title" : "sr-only"] },
    footnoteBackLabel: (ref, reref) => `חזרה להפניה ${ref + 1}${reref > 1 ? ` (${reref})` : ""}`,
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

/** ממיר Markdown ל-HTML בזמן build (התוכן נכתב ע"י בעל האתר, לכן HTML גולמי מותר) */
export async function markdownToHtml(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}
