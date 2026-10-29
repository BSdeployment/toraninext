import { siteConfig } from "@/config/site";
import { prepareIndex, type PreparedIndex } from "./search";

/** טעינה עצלה (פעם אחת) של קבצי ה-JSON שנוצרים ב-build תחת /content-data/ */

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(`${siteConfig.basePath}/content-data/${file}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return (await res.json()) as T;
}

let indexPromise: Promise<PreparedIndex> | null = null;
let htmlPromise: Promise<Record<string, string>> | null = null;

export function loadSearchIndex(): Promise<PreparedIndex> {
  if (!indexPromise) {
    indexPromise = fetchJson<Record<string, string>>("search-index.json").then(prepareIndex);
    indexPromise.catch(() => (indexPromise = null)); // מאפשר ניסיון חוזר
  }
  return indexPromise;
}

export function loadArticleHtml(): Promise<Record<string, string>> {
  if (!htmlPromise) {
    htmlPromise = fetchJson<Record<string, string>>("articles.json");
    htmlPromise.catch(() => (htmlPromise = null));
  }
  return htmlPromise;
}
