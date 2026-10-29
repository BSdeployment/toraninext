/** עזרי טקסט (בטוחים גם לצד הלקוח) */

/** מוריד סימוני Markdown בסיסיים לטקסט נקי (לתקצירים) */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateWords(text: string, count: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  return words.length <= count ? text : words.slice(0, count).join(" ") + "...";
}
