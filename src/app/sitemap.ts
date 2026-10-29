import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${siteConfig.url}${siteConfig.basePath}`;
  const pages = ["/", "/articles/", "/content/", "/books/", "/media/", "/contact/"].map((p) => ({ url: `${base}${p}` }));
  const posts = getAllPosts().map((post) => ({
    url: `${base}/articles/${encodeURIComponent(post.slug)}/`,
    lastModified: post.date,
  }));
  return [...pages, ...posts];
}
