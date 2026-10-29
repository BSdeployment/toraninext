"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadSearchIndex } from "@/lib/library/client-data";
import { parseHash, toHash, viewsEqual, type View } from "@/lib/library/route";
import { getSearchTerms, searchArticles, type SearchRequest, type SearchState } from "@/lib/library/search";
import { topicKey, type LibraryData, type TopicNode } from "@/lib/library/types";
import AdvancedSearch from "./AdvancedSearch";
import ArticleList from "./ArticleList";
import ArticleView from "./ArticleView";
import Icon from "./Icon";
import SearchResults from "./SearchResults";
import SidebarTree from "./SidebarTree";
import Welcome from "./Welcome";

const MOBILE_QUERY = "(max-width: 900px)";

function indexTopics(nodes: TopicNode[], map = new Map<string, TopicNode>()): Map<string, TopicNode> {
  for (const node of nodes) {
    map.set(node.key, node);
    indexTopics(node.children, map);
  }
  return map;
}

/**
 * ספריית תוכן: סינון לפי נושא (עץ תיקיות), חיפוש טקסט חכם ותצוגת מאמרים.
 * המצב (מאמר / נושא / תוצאות) נשמר ב-hash של הכתובת.
 */
export default function ContentLibrary({ data }: { data: LibraryData }) {
  const { topics, articles } = data;
  const topicIndex = useMemo(() => indexTopics(topics), [topics]);

  const [view, setView] = useState<View>({ kind: "home" });
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState<SearchState | null>(null);
  const [highlight, setHighlight] = useState<string[]>([]);
  const searchSeq = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  /* ---- ניווט (hash + היסטוריה) ---- */
  useEffect(() => {
    const sync = () => setView(parseHash(window.location.hash));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const go = useCallback((next: View) => {
    navigated.current = true;
    window.history.pushState(null, "", window.location.pathname + window.location.search + toHash(next));
    setView(next);
  }, []);

  useEffect(() => {
    if (!navigated.current) return;
    const el = stageRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
  }, [view]);

  /* ---- פתיחת הענפים של הנושא/מאמר הפעיל בעץ ---- */
  useEffect(() => {
    const path = view.kind === "topic" ? view.path : view.kind === "article" ? articles[view.id]?.topicPath : undefined;
    if (!path) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      for (let i = 1; i <= path.length; i++) next.add(topicKey(path.slice(0, i)));
      return next;
    });
  }, [view, articles]);

  /* ---- מגירת הסינון במובייל ---- */
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen]);

  /* ---- פעולות ---- */
  const openTopic = useCallback(
    (path: string[]) => {
      setDrawerOpen(false);
      go({ kind: "topic", path });
    },
    [go]
  );

  const openArticle = useCallback(
    (id: string, terms: string[] = []) => {
      setHighlight(terms);
      setDrawerOpen(false);
      go({ kind: "article", id });
    },
    [go]
  );

  const handleTopicClick = useCallback(
    (node: TopicNode) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (!next.delete(node.key)) next.add(node.key);
        return next;
      });
      // נושא ללא תתי-נושאים: מציגים את רשימת מאמריו במרכז הדף
      if (node.children.length === 0) {
        setDrawerOpen(false);
        const target: View = { kind: "topic", path: node.path };
        if (!viewsEqual(view, target)) go(target);
      }
    },
    [go, view]
  );

  const pickFromWelcome = useCallback(
    (node: TopicNode) => {
      if (node.children.length === 0) return openTopic(node.path);
      setExpanded((prev) => new Set(prev).add(node.key));
      if (window.matchMedia(MOBILE_QUERY).matches) setDrawerOpen(true);
    },
    [openTopic]
  );

  const reset = useCallback(() => {
    setExpanded(new Set());
    setDrawerOpen(false);
    go({ kind: "home" });
  }, [go]);

  const runSearch = useCallback(
    async (request: SearchRequest) => {
      const id = ++searchSeq.current;
      const terms = getSearchTerms(request.query, request.exact);
      setSearch({ id, status: "loading", request, terms, results: [] });
      go({ kind: "search" });
      try {
        const index = await loadSearchIndex();
        await new Promise((resolve) => setTimeout(resolve, 0)); // נותן לדפדפן לצייר את מצב הטעינה
        if (id !== searchSeq.current) return;
        const results = searchArticles(index, articles, terms, request.scope);
        setSearch({ id, status: "ready", request, terms, results });
      } catch {
        if (id === searchSeq.current) setSearch({ id, status: "error", request, terms, results: [] });
      }
    },
    [articles, go]
  );

  /* ---- מה מוצג במרכז ---- */
  let stage: ReactNode;
  if (view.kind === "article" && articles[view.id]) {
    const article = articles[view.id];
    const siblings = topicIndex.get(topicKey(article.topicPath))?.articleIds ?? [];
    const i = siblings.indexOf(article.id);
    stage = (
      <ArticleView
        article={article}
        prev={i > 0 ? articles[siblings[i - 1]] : null}
        next={i >= 0 && i < siblings.length - 1 ? articles[siblings[i + 1]] : null}
        highlight={highlight}
        onClearHighlight={() => setHighlight([])}
        onOpenTopic={openTopic}
        onOpenArticle={openArticle}
      />
    );
  } else if (view.kind === "topic" && topicIndex.has(topicKey(view.path))) {
    stage = (
      <ArticleList
        node={topicIndex.get(topicKey(view.path)) as TopicNode}
        articles={articles}
        onOpenTopic={openTopic}
        onOpenArticle={openArticle}
      />
    );
  } else if (view.kind === "search" && search) {
    stage = (
      <SearchResults
        key={search.id}
        state={search}
        articles={articles}
        onOpen={(id) => openArticle(id, search.terms)}
        onRetry={() => runSearch(search.request)}
        onClear={() => {
          setSearch(null);
          go({ kind: "home" });
        }}
      />
    );
  } else {
    stage = <Welcome topics={topics} onPickTopic={pickFromWelcome} />;
  }

  const activeTopicKey = view.kind === "topic" ? topicKey(view.path) : null;
  const activeArticleId = view.kind === "article" ? view.id : null;

  return (
    <div className="lib">
      <header className="lib-hero">
        <h1>מאמרים ותוכן</h1>
        <p>חיפוש ועיון מתקדם בכל המאמרים</p>
      </header>

      <div className="lib-layout">
        <aside className={`lib-sidebar${drawerOpen ? " is-open" : ""}`} aria-label="סינון לפי נושא">
          <div className="lib-sidebar__head">
            <h2>סינון לפי נושא</h2>
            {view.kind !== "home" && (
              <button type="button" className="lib-btn lib-btn--text" onClick={reset}>
                איפוס
              </button>
            )}
            <button type="button" className="lib-icon-btn lib-sidebar__close" aria-label="סגירת התפריט" onClick={() => setDrawerOpen(false)}>
              <Icon name="close" size={22} />
            </button>
          </div>
          {topics.length === 0 ? (
            <p className="lib-sidebar__empty">אין נושאים עדיין.</p>
          ) : (
            <SidebarTree
              topics={topics}
              articles={articles}
              expanded={expanded}
              activeTopicKey={activeTopicKey}
              activeArticleId={activeArticleId}
              onTopicClick={handleTopicClick}
              onOpenArticle={openArticle}
            />
          )}
        </aside>
        {drawerOpen && <div className="lib-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

        <div className="lib-main">
          <button type="button" className="lib-btn lib-btn--tonal lib-filter-btn" onClick={() => setDrawerOpen(true)}>
            <Icon name="filter_list" size={20} />
            סינון לפי נושא
          </button>

          <AdvancedSearch topics={topics} busy={search?.status === "loading"} onSearch={runSearch} />

          <div className="lib-stage" ref={stageRef}>
            {stage}
          </div>
        </div>
      </div>
    </div>
  );
}
