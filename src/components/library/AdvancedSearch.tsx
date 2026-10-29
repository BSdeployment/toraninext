"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { getSearchTerms, type SearchRequest } from "@/lib/library/search";
import type { TopicNode } from "@/lib/library/types";
import Icon from "./Icon";

function Chip({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className={`lib-chip${checked ? " is-checked" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <Icon name="check" size={18} className="lib-chip__check" />
      <span>{children}</span>
    </label>
  );
}

/** חיפוש מתקדם: טקסט חופשי + בחירת נושאים ראשיים (או הכל) */
export default function AdvancedSearch({
  topics,
  busy,
  onSearch,
}: {
  topics: TopicNode[];
  busy: boolean;
  onSearch: (request: SearchRequest) => void;
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [exact, setExact] = useState(false);
  const [selected, setSelected] = useState<string[]>([]); // ריק = הכל

  const canSearch = getSearchTerms(query, exact).length > 0 && !busy;

  function toggleTopic(name: string, on: boolean) {
    setSelected((cur) => (on ? [...cur, name] : cur.filter((n) => n !== name)));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSearch) return;
    onSearch({ query: query.trim(), exact, scope: selected.length ? selected : null });
  }

  return (
    <form className="lib-card lib-search" role="search" onSubmit={submit}>
      <h2 className="lib-card__title">חיפוש מתקדם</h2>

      <label className="lib-field" htmlFor={inputId}>
        <Icon name="search" className="lib-field__icon" />
        <input
          id={inputId}
          type="text"
          className="lib-field__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפשו מילה או ביטוי בתוך המאמרים"
          enterKeyHint="search"
          autoComplete="off"
        />
        {query && (
          <button type="button" className="lib-icon-btn" aria-label="ניקוי החיפוש" onClick={() => setQuery("")}>
            <Icon name="close" size={20} />
          </button>
        )}
      </label>

      <fieldset className="lib-fieldset">
        <legend>היקף החיפוש</legend>
        <div className="lib-chips">
          <Chip checked={selected.length === 0} onChange={() => setSelected([])}>
            לחפש בהכל
          </Chip>
          {topics.map((topic) => (
            <Chip key={topic.key} checked={selected.includes(topic.name)} onChange={(on) => toggleTopic(topic.name, on)}>
              {topic.name}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div className="lib-search__actions">
        <Chip checked={exact} onChange={setExact}>
          ביטוי מדויק
        </Chip>
        <button type="submit" className="lib-btn lib-btn--filled" disabled={!canSearch}>
          <Icon name="search" size={20} />
          חיפוש
        </button>
      </div>
    </form>
  );
}
