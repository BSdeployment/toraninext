import Link from "next/link";

function pageHref(n: number) {
  return n === 1 ? "/articles/" : `/articles/page/${n}/`;
}

export default function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="ניווט עמודים">
      <ul className="pagination__list">
        <li>
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="pagination__link pagination__prev" aria-label="עמוד קודם">
              הקודם →
            </Link>
          ) : (
            <span className="pagination__link pagination__prev pagination__disabled">הקודם →</span>
          )}
        </li>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span className="pagination__link pagination__current" aria-current="page">
                {n}
              </span>
            ) : (
              <Link href={pageHref(n)} className="pagination__link">
                {n}
              </Link>
            )}
          </li>
        ))}

        <li>
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} className="pagination__link pagination__next" aria-label="עמוד הבא">
              ← הבא
            </Link>
          ) : (
            <span className="pagination__link pagination__next pagination__disabled">← הבא</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
