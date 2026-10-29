import Link from "next/link";
import { shortExcerpt, type PostMeta } from "@/lib/post-utils";
import HebrewDate from "./HebrewDate";

/** כרטיס מאמר. variant="home" - ללא תגיות (כמו בעמוד הבית המקורי) */
export default function PostCard({
  post,
  variant = "list",
  excerptWords = 30,
  highlight,
}: {
  post: PostMeta;
  variant?: "home" | "list";
  excerptWords?: number;
  highlight?: string;
}) {
  const href = `/articles/${post.slug}/`;
  return (
    <div className={variant === "list" ? "card post-card" : "card"}>
      <h3 className="card__title">
        <Link href={href}>{highlight ? <Highlight text={post.title} query={highlight} /> : post.title}</Link>
      </h3>
      {variant === "home" ? (
        <HebrewDate date={post.date} />
      ) : (
        <div className="card__meta">
          <HebrewDate date={post.date} />
          {post.tags.length > 0 && (
            <>
              {"· "}
              {post.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>
      )}
      <p className="card__excerpt">{shortExcerpt(post, excerptWords)}</p>
      <Link href={href} className="card__link">
        קרא עוד ←
      </Link>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}
