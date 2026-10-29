import { siteConfig } from "@/config/site";
import { getAllPosts, shortExcerpt } from "@/lib/posts";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Atom feed (מחליף jekyll-feed) */
export function GET() {
  const base = `${siteConfig.url}${siteConfig.basePath}`;
  const posts = getAllPosts().slice(0, 20);
  const updated = posts[0] ? `${posts[0].date}T00:00:00Z` : new Date().toISOString();

  const entries = posts
    .map((post) => {
      const url = `${base}/articles/${encodeURIComponent(post.slug)}/`;
      return `  <entry>
    <title>${esc(post.title)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <published>${post.date}T00:00:00Z</published>
    <updated>${post.date}T00:00:00Z</updated>
    <summary>${esc(shortExcerpt(post, 40))}</summary>
${post.tags.map((t) => `    <category term="${esc(t)}"/>`).join("\n")}
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="he">
  <title>${esc(siteConfig.title)}</title>
  <subtitle>${esc(siteConfig.description)}</subtitle>
  <link href="${base}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${base}/" rel="alternate" type="text/html"/>
  <id>${base}/</id>
  <updated>${updated}</updated>
${entries}
</feed>
`;
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
