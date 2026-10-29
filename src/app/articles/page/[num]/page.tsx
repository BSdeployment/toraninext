import type { Metadata } from "next";
import ArticlesBrowser from "@/components/ArticlesBrowser";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { topics } from "@/data/topics";

export const dynamicParams = false;

function totalPagesOf(count: number) {
  return Math.max(1, Math.ceil(count / siteConfig.postsPerPage));
}

/**
 * עמודים 1..N. עמוד 1 הקנוני הוא /articles/ (כאן הוא נוצר רק כי ייצוא סטטי
 * דורש לפחות route אחד, והקנוני מצביע ל-/articles/).
 */
export function generateStaticParams() {
  const total = totalPagesOf(getAllPosts().length);
  return Array.from({ length: total }, (_, i) => ({ num: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ num: string }> }): Promise<Metadata> {
  const { num } = await params;
  return {
    title: num === "1" ? "מאמרים" : `מאמרים – עמוד ${num}`,
    description: "כל המאמרים באתר אבן שלמה",
    alternates: { canonical: num === "1" ? "/articles/" : `/articles/page/${num}/` },
  };
}

export default async function ArticlesPaged({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const posts = getAllPosts();
  return (
    <div className="container">
      <h1 className="page-title">מאמרים</h1>
      <ArticlesBrowser
        posts={posts}
        topics={topics}
        page={Number(num)}
        totalPages={totalPagesOf(posts.length)}
        perPage={siteConfig.postsPerPage}
      />
    </div>
  );
}
