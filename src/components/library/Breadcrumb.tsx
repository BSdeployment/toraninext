import { isPlainClick } from "./util";
import { toHash } from "@/lib/library/route";

/** מיקום בעץ הנושאים. current=true: הפריט האחרון הוא המיקום הנוכחי ולא קישור */
export default function Breadcrumb({
  path,
  current = false,
  onOpenTopic,
}: {
  path: string[];
  current?: boolean;
  onOpenTopic: (path: string[]) => void;
}) {
  return (
    <nav className="lib-crumbs" aria-label="מיקום בעץ הנושאים">
      <ol>
        {path.map((name, i) => {
          const sub = path.slice(0, i + 1);
          const isCurrent = current && i === path.length - 1;
          return (
            <li key={sub.join("/")} aria-current={isCurrent ? "page" : undefined}>
              {isCurrent ? (
                name
              ) : (
                <a
                  href={toHash({ kind: "topic", path: sub })}
                  onClick={(e) => {
                    if (!isPlainClick(e)) return;
                    e.preventDefault();
                    onOpenTopic(sub);
                  }}
                >
                  {name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
