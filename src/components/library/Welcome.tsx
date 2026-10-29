import type { TopicNode } from "@/lib/library/types";
import Icon from "./Icon";
import { articlesLabel } from "./util";

/** מסך פתיחה: מפת הנושאים הראשיים */
export default function Welcome({ topics, onPickTopic }: { topics: TopicNode[]; onPickTopic: (node: TopicNode) => void }) {
  if (topics.length === 0) {
    return (
      <div className="lib-empty">
        <p>עדיין אין מאמרים בספרייה.</p>
      </div>
    );
  }
  return (
    <section aria-labelledby="lib-welcome-title">
      <h2 id="lib-welcome-title" className="lib-stage__title">
        איך מתחילים?
      </h2>
      <p className="lib-stage__sub">חפשו טקסט בכל המאמרים, או בחרו נושא ללימוד ועיון.</p>
      <div className="lib-topic-grid">
        {topics.map((node) => (
          <button type="button" key={node.key} className="lib-topic-card" onClick={() => onPickTopic(node)}>
            <Icon name="folder" size={28} />
            <span className="lib-topic-card__name">{node.name}</span>
            <span className="lib-topic-card__count">{articlesLabel(node.total)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
