"use client";

import type { LibraryArticle, TopicNode } from "@/lib/library/types";
import { toHash } from "@/lib/library/route";
import Icon from "./Icon";
import { isPlainClick } from "./util";

type Props = {
  topics: TopicNode[];
  articles: Record<string, LibraryArticle>;
  expanded: ReadonlySet<string>;
  activeTopicKey: string | null;
  activeArticleId: string | null;
  onTopicClick: (node: TopicNode) => void;
  onOpenArticle: (id: string) => void;
};

/** עץ ניווט: נושא > תת-נושא > מאמרים. לחיצה על נושא פותחת/סוגרת אותו */
export default function SidebarTree({ topics, ...rest }: Props) {
  return (
    <ul className="lib-tree">
      {topics.map((node) => (
        <TopicItem key={node.key} node={node} {...rest} />
      ))}
    </ul>
  );
}

function TopicItem({ node, ...props }: { node: TopicNode } & Omit<Props, "topics">) {
  const { articles, expanded, activeTopicKey, activeArticleId, onTopicClick, onOpenArticle } = props;
  const open = expanded.has(node.key);
  const active = activeTopicKey === node.key;

  return (
    <li>
      <button
        type="button"
        className={`lib-tree__row${active ? " is-active" : ""}`}
        aria-expanded={open}
        onClick={() => onTopicClick(node)}
      >
        <Icon name="expand_more" size={20} className={`lib-tree__chevron${open ? " is-open" : ""}`} />
        <span className="lib-tree__label">{node.name}</span>
        <span className="lib-tree__count" aria-label={`${node.total} מאמרים`}>
          {node.total}
        </span>
      </button>

      {open && (
        <ul className="lib-tree__nested">
          {node.children.map((child) => (
            <TopicItem key={child.key} node={child} {...props} />
          ))}
          {node.articleIds.map((id) => {
            const article = articles[id];
            return (
              <li key={id}>
                <a
                  href={toHash({ kind: "article", id })}
                  className={`lib-tree__row lib-tree__row--article${activeArticleId === id ? " is-active" : ""}`}
                  aria-current={activeArticleId === id ? "page" : undefined}
                  onClick={(e) => {
                    if (!isPlainClick(e)) return;
                    e.preventDefault();
                    onOpenArticle(id);
                  }}
                >
                  <Icon name="article" size={18} className="lib-tree__icon" />
                  <span className="lib-tree__label">{article.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
