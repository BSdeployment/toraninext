"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import HebrewDate from "@/components/HebrewDate";
import { loadArticleHtml } from "@/lib/library/client-data";
import { toHash } from "@/lib/library/route";
import { clearHighlights, highlightTerms } from "@/lib/library/search";
import type { LibraryArticle } from "@/lib/library/types";
import Breadcrumb from "./Breadcrumb";
import Icon from "./Icon";
import { isPlainClick } from "./util";

/**
 * הערות שוליים הן קישורי #עוגן. בדף הזה ה-hash משמש לניווט (מאמר/נושא), ולכן אסור
 * לדפדפן לשנות אותו – גוללים לעוגן ידנית ומשאירים את הכתובת כמות שהיא.
 */
function scrollToInPageAnchor(e: MouseEvent<HTMLDivElement>) {
  const href = (e.target as HTMLElement).closest("a")?.getAttribute("href");
  if (!href || !href.startsWith("#") || !isPlainClick(e)) return;
  let id = href.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* משאירים כמו שהוא */
  }
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
}

type Loaded = { id: string; html: string | null }; // html=null → שגיאת טעינה

/** מאמר מלא במרכז הדף. אם הגענו מחיפוש – המילים שחיפשו מודגשות והדף גולל אליהן */
export default function ArticleView({
  article,
  prev,
  next,
  highlight,
  onClearHighlight,
  onOpenTopic,
  onOpenArticle,
}: {
  article: LibraryArticle;
  prev: LibraryArticle | null;
  next: LibraryArticle | null;
  highlight: string[];
  onClearHighlight: () => void;
  onOpenTopic: (path: string[]) => void;
  onOpenArticle: (id: string) => void;
}) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [attempt, setAttempt] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadArticleHtml()
      .then((map) => !cancelled && setLoaded({ id: article.id, html: map[article.id] ?? "" }))
      .catch(() => !cancelled && setLoaded({ id: article.id, html: null }));
    return () => {
      cancelled = true;
    };
  }, [article.id, attempt]);

  const html = loaded?.id === article.id ? loaded.html : undefined; // undefined = בטעינה

  useEffect(() => {
    const root = bodyRef.current;
    if (!root || !html || highlight.length === 0) return;
    const first = highlightTerms(root, highlight);
    if (first) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      first.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
    return () => clearHighlights(root);
  }, [html, highlight]);

  return (
    <article className="lib-article">
      <Breadcrumb path={article.topicPath} onOpenTopic={onOpenTopic} />
      <header className="lib-article__header">
        <h2 className="lib-article__title">{article.title}</h2>
        <HebrewDate date={article.date} />
        {article.tags.length > 0 && (
          <div className="post-full__tags">
            {article.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {article.pdfLink && (
          <div className="post-pdf-link">
            להורדה וצפייה בפורמט PDF{" "}
            <a target="_blank" rel="noopener" href={article.pdfLink}>
              לחץ כאן
            </a>
          </div>
        )}
      </header>

      {highlight.length > 0 && html && (
        <div className="lib-banner" role="note">
          <span>המילים שחיפשתם מודגשות בטקסט.</span>
          <button type="button" className="lib-btn lib-btn--text" onClick={onClearHighlight}>
            הסרת ההדגשה
          </button>
        </div>
      )}

      {html === undefined && (
        <div role="status" aria-live="polite">
          <span className="lib-sr-only">טוען את המאמר…</span>
          <div className="lib-progress" />
        </div>
      )}

      {html === null && (
        <div className="lib-empty" role="alert">
          <p>לא הצלחנו לטעון את המאמר. בדקו את החיבור ונסו שוב.</p>
          <button type="button" className="lib-btn lib-btn--tonal" onClick={() => setAttempt((n) => n + 1)}>
            ניסיון חוזר
          </button>
        </div>
      )}

      {html === "" && (
        <div className="lib-empty">
          <p>תוכן המאמר לא נמצא.</p>
        </div>
      )}

      {html && (
        <div
          key={article.id}
          ref={bodyRef}
          className="lib-article__body prose post-content-font"
          onClick={scrollToInPageAnchor}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      {(prev || next) && (
        <nav className="lib-pager" aria-label="מאמרים נוספים בנושא">
          {[
            { a: prev, label: "המאמר הקודם", icon: "arrow_forward" as const },
            { a: next, label: "המאמר הבא", icon: "arrow_back" as const },
          ].map(({ a, label, icon }) =>
            a ? (
              <a
                key={label}
                className="lib-btn lib-btn--outlined"
                href={toHash({ kind: "article", id: a.id })}
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  onOpenArticle(a.id);
                }}
              >
                {icon === "arrow_forward" && <Icon name={icon} size={20} />}
                <span className="lib-pager__text">
                  <small>{label}</small>
                  {a.title}
                </span>
                {icon === "arrow_back" && <Icon name={icon} size={20} />}
              </a>
            ) : (
              <span key={label} />
            )
          )}
        </nav>
      )}
    </article>
  );
}
