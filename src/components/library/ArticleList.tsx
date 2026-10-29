import type { LibraryArticle, TopicNode } from "@/lib/library/types";
import { toHash } from "@/lib/library/route";
import HebrewDate from "@/components/HebrewDate";
import Breadcrumb from "./Breadcrumb";
import { articlesLabel, isPlainClick } from "./util";

/** רשימת המאמרים של נושא – מוצגת במרכז הדף בלחיצה על נושא */
export default function ArticleList({
  node,
  articles,
  onOpenTopic,
  onOpenArticle,
}: {
  node: TopicNode;
  articles: Record<string, LibraryArticle>;
  onOpenTopic: (path: string[]) => void;
  onOpenArticle: (id: string) => void;
}) {
  return (
    <section aria-labelledby="lib-topic-title">
      {node.path.length > 1 && <Breadcrumb path={node.path.slice(0, -1)} onOpenTopic={onOpenTopic} />}
      <h2 id="lib-topic-title" className="lib-stage__title">
        {node.name}
      </h2>
      <p className="lib-stage__sub">{articlesLabel(node.total)}</p>

      {node.children.length > 0 && (
        <div className="lib-chips lib-chips--links" aria-label="תתי-נושאים">
          {node.children.map((child) => (
            <a
              key={child.key}
              className="lib-chip"
              href={toHash({ kind: "topic", path: child.path })}
              onClick={(e) => {
                if (!isPlainClick(e)) return;
                e.preventDefault();
                onOpenTopic(child.path);
              }}
            >
              {child.name} ({child.total})
            </a>
          ))}
        </div>
      )}

      {node.articleIds.length === 0 ? (
        <div className="lib-empty">
          <p>אין מאמרים ישירות בנושא זה. בחרו תת-נושא.</p>
        </div>
      ) : (
        <ul className="lib-cards">
          {node.articleIds.map((id) => {
            const article = articles[id];
            return (
              <li key={id} className="lib-card lib-result">
                <h3 className="lib-result__title">
                  <a
                    href={toHash({ kind: "article", id })}
                    onClick={(e) => {
                      if (!isPlainClick(e)) return;
                      e.preventDefault();
                      onOpenArticle(id);
                    }}
                  >
                    {article.title}
                  </a>
                </h3>
                <HebrewDate date={article.date} />
                <p className="lib-result__snippet">{article.excerpt}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
