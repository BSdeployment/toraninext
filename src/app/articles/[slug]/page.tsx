import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HebrewDate from "@/components/HebrewDate";
import { getAllPosts, getPostBySlug, shortExcerpt } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** פרמטרים עם תווים לא-לטיניים יכולים להגיע מקודדים (%D7...) */
function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPostBySlug(decodeSlug((await params).slug));
  if (!post) return {};
  const description = shortExcerpt(post, 40);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/articles/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.date,
      tags: post.tags,
      url: `/articles/${post.slug}/`,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug(decodeSlug((await params).slug));
  if (!post) notFound();

  return (
    <article className="post-full">
      <header className="post-full__header">
        <h1>{post.title}</h1>

        <HebrewDate date={post.date} />

        {post.tags.length > 0 && (
          <div className="post-full__tags">
            {post.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.pdfLink && (
          <div className="post-pdf-link">
            להורדה וצפייה בפורמט PDF{" "}
            <a target="_blank" rel="noopener" href={post.pdfLink}>
              לחץ כאן
            </a>
          </div>
        )}
      </header>
      <div className="post-full__body prose post-content-font" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
