"use client";

import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/post-utils";
import PostCard from "./PostCard";
import Pagination from "./Pagination";

type Mode = "title" | "tags";

/**
 * רשימת מאמרים עם חיפוש וסינון לפי נושאים.
 * ללא סינון: מוצג עמוד אחד (עם ניווט עמודים). עם סינון: חיפוש גלובלי בכל המאמרים.
 */
export default function ArticlesBrowser({
  posts,
  topics,
  page,
  totalPages,
  perPage,
}: {
  posts: PostMeta[];
  topics: readonly string[];
  page: number;
  totalPages: number;
  perPage: number;
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("title");
  const [selected, setSelected] = useState<string[]>([]);

  const q = query.trim().toLowerCase();
  const hasFilter = q !== "" || selected.length > 0;

  const filtered = useMemo(() => {
    if (!hasFilter) return null;
    return posts.filter((post) => {
      const tags = post.tags.map((t) => t.toLowerCase());
      let searchMatch = true;
      if (q) {
        searchMatch = mode === "title" ? post.title.toLowerCase().includes(q) : tags.some((t) => t.includes(q));
      }
      const topicMatch = selected.length === 0 || selected.some((t) => tags.includes(t.toLowerCase()));
      return searchMatch && topicMatch;
    });
  }, [posts, q, mode, selected, hasFilter]);

  const visible = filtered ?? posts.slice((page - 1) * perPage, page * perPage);

  function toggleTopic(topic: string) {
    setSelected((cur) => (cur.includes(topic) ? cur.filter((t) => t !== topic) : [...cur, topic]));
  }

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          id="search-input"
          className="search-bar__input"
          placeholder="חפש מאמרים..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-bar__controls">
          <button
            className={`search-mode-btn${mode === "title" ? " active" : ""}`}
            onClick={() => setMode("title")}
          >
            לפי כותרת
          </button>
          <button
            className={`search-mode-btn${mode === "tags" ? " active" : ""}`}
            onClick={() => setMode("tags")}
          >
            לפי תגיות
          </button>
        </div>
        <div className="topic-tags" id="topic-tags">
          {topics.map((topic) => (
            <button
              key={topic}
              className={`topic-tag${selected.includes(topic) ? " active" : ""}`}
              onClick={() => toggleTopic(topic)}
            >
              {topic}
            </button>
          ))}
          {selected.length > 0 && (
            <button className="topic-clear" onClick={() => setSelected([])}>
              נקה בחירה ✕
            </button>
          )}
        </div>
      </div>

      <div className="card-list" id="posts-list">
        {visible.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            excerptWords={30}
            highlight={hasFilter && q && mode === "title" ? q : undefined}
          />
        ))}
      </div>

      {hasFilter && visible.length === 0 && (
        <div className="search-no-results search-no-results--visible">
          לא נמצאו תוצאות.
        </div>
      )}

      {!hasFilter && <Pagination page={page} totalPages={totalPages} />}
    </>
  );
}
