"use client";

import { Fragment, useState } from "react";
import { toHash } from "@/lib/library/route";
import type { Segment, SearchState } from "@/lib/library/search";
import type { LibraryArticle } from "@/lib/library/types";
import { articlesLabel, isPlainClick, plural } from "./util";

const PAGE_SIZE = 20;

export function Segments({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) =>
        s.hit ? (
          <mark className="lib-hit" key={i}>
            {s.text}
          </mark>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        )
      )}
    </>
  );
}

/** תוצאות חיפוש במרכז הדף: כותרת המאמר + קטעי טקסט עם ההתאמה מודגשת */
export default function SearchResults({
  state,
  articles,
  onOpen,
  onRetry,
  onClear,
}: {
  state: SearchState;
  articles: Record<string, LibraryArticle>;
  onOpen: (id: string) => void;
  onRetry: () => void;
  onClear: () => void;
}) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { request, results, status } = state;
  const scope = request.scope ? `בנושאים: ${request.scope.join(", ")}` : "בכל הנושאים";

  if (status === "loading") {
    return (
      <div role="status" aria-live="polite">
        <p className="lib-stage__sub">מחפשים “{request.query}”…</p>
        <div className="lib-progress" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="lib-empty" role="alert">
        <p>לא הצלחנו לטעון את אינדקס החיפוש. בדקו את החיבור ונסו שוב.</p>
        <button type="button" className="lib-btn lib-btn--tonal" onClick={onRetry}>
          ניסיון חוזר
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="lib-results-title">
      <div className="lib-stage__head">
        <div>
          <h2 id="lib-results-title" className="lib-stage__title">
            תוצאות חיפוש
          </h2>
          <p className="lib-stage__sub">
            {results.length === 0 ? "לא נמצאו מאמרים" : `נמצא${results.length === 1 ? "" : "ו"} ${articlesLabel(results.length)}`} עבור “
            {request.query}” · {scope}
            {request.exact ? " · ביטוי מדויק" : ""}
          </p>
        </div>
        <button type="button" className="lib-btn lib-btn--text" onClick={onClear}>
          ניקוי תוצאות
        </button>
      </div>

      {results.length === 0 ? (
        <div className="lib-empty">
          <p>נסו מילה אחרת או קצרה יותר, בטלו את “ביטוי מדויק”, או הרחיבו את החיפוש לכל הנושאים.</p>
        </div>
      ) : (
        <>
          <ul className="lib-cards">
            {results.slice(0, limit).map((r) => {
              const article = articles[r.id];
              const href = toHash({ kind: "article", id: r.id });
              return (
                <li key={r.id} className="lib-card lib-result">
                  <h3 className="lib-result__title">
                    <a
                      href={href}
                      onClick={(e) => {
                        if (!isPlainClick(e)) return;
                        e.preventDefault();
                        onOpen(r.id);
                      }}
                    >
                      <Segments segments={r.titleSegments} />
                    </a>
                  </h3>
                  <p className="lib-result__path">{article.topicPath.join(" › ")}</p>
                  {r.snippets.length > 0 ? (
                    r.snippets.map((snippet, i) => (
                      <p className="lib-result__snippet" key={i}>
                        <Segments segments={snippet} />
                      </p>
                    ))
                  ) : (
                    <p className="lib-result__snippet">{article.excerpt}</p>
                  )}
                  <p className="lib-result__foot">
                    {r.matches > 0 ? plural(r.matches, "הופעה אחת בטקסט", "הופעות בטקסט") : "נמצא בכותרת"}
                  </p>
                </li>
              );
            })}
          </ul>
          {results.length > limit && (
            <div className="lib-more">
              <button type="button" className="lib-btn lib-btn--tonal" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                הצגת עוד תוצאות ({results.length - limit})
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
