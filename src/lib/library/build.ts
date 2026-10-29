import { getLibraryEntries, shortExcerpt } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { stripMarkdown } from "@/lib/markdown-text";
import { GENERAL_TOPIC, topicKey, type LibraryArticle, type LibraryData, type TopicNode } from "./types";

/** קוד שרת בלבד (קורא קבצים בזמן build). */

const byName = (a: string, b: string) => a.localeCompare(b, "he");

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** טקסט נקי של מאמר לצורך חיפוש */
export function toSearchText(markdown: string): string {
  return decodeEntities(stripMarkdown(markdown)).replace(/\s+/g, " ").trim();
}

let cached: LibraryData | null = null;

/** בונה את עץ הנושאים משמות התיקיות ב-content/posts */
export function getLibraryData(): LibraryData {
  if (cached) return cached;

  const entries = getLibraryEntries();
  const articles: Record<string, LibraryArticle> = {};
  const orders = new Map<string, number | undefined>();
  const roots: TopicNode[] = [];

  function ensureNode(path: string[]): TopicNode {
    let level = roots;
    let node: TopicNode | undefined;
    for (let i = 0; i < path.length; i++) {
      const sub = path.slice(0, i + 1);
      node = level.find((n) => n.name === path[i]);
      if (!node) {
        node = { key: topicKey(sub), name: path[i], path: sub, articleIds: [], children: [], total: 0 };
        level.push(node);
      }
      level = node.children;
    }
    return node as TopicNode;
  }

  for (const { meta, topicPath, order } of entries) {
    const path = topicPath.length ? topicPath : [GENERAL_TOPIC];
    articles[meta.slug] = {
      id: meta.slug,
      title: meta.title,
      date: meta.date,
      tags: meta.tags,
      excerpt: shortExcerpt(meta, 30),
      pdfLink: meta.pdfLink,
      topicPath: path,
    };
    orders.set(meta.slug, order);
    ensureNode(path).articleIds.push(meta.slug);
  }

  const compareArticles = (a: string, b: string) => {
    const oa = orders.get(a);
    const ob = orders.get(b);
    if (oa !== ob) return (oa ?? Infinity) - (ob ?? Infinity);
    return byName(articles[a].title, articles[b].title);
  };

  function finish(nodes: TopicNode[], isRoot: boolean): number {
    nodes.sort((a, b) => {
      if (isRoot && (a.name === GENERAL_TOPIC) !== (b.name === GENERAL_TOPIC)) return a.name === GENERAL_TOPIC ? 1 : -1;
      return byName(a.name, b.name);
    });
    let sum = 0;
    for (const node of nodes) {
      node.articleIds.sort(compareArticles);
      node.total = node.articleIds.length + finish(node.children, false);
      sum += node.total;
    }
    return sum;
  }
  finish(roots, true);

  cached = { topics: roots, articles };
  return cached;
}

/** { id: טקסט נקי } – נטען בצד הלקוח רק כשמבצעים חיפוש */
export function getSearchIndex(): Record<string, string> {
  return Object.fromEntries(getLibraryEntries().map((e) => [e.meta.slug, toSearchText(e.markdown)]));
}

/** { id: HTML } – נטען בצד הלקוח כשפותחים מאמר */
export async function getArticleHtml(): Promise<Record<string, string>> {
  const entries = getLibraryEntries();
  const html = await Promise.all(entries.map((e) => markdownToHtml(e.markdown)));
  return Object.fromEntries(entries.map((e, i) => [e.meta.slug, html[i]]));
}
