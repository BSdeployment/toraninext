import type { Metadata } from "next";
import ArticlesBrowser from "@/components/ArticlesBrowser";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { topics } from "@/data/topics";

export const metadata: Metadata = {
  title: "מאמרים",
  description: "כל המאמרים באתר אבן שלמה",
  alternates: { canonical: "/articles/" },
};

export default function ArticlesPage() {
  const posts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / siteConfig.postsPerPage));
  return (
    <div className="container">
      <h1 className="page-title">מאמרים</h1>
      <ArticlesBrowser
        posts={posts}
        topics={topics}
        page={1}
        totalPages={totalPages}
        perPage={siteConfig.postsPerPage}
      />
    </div>
  );
}
