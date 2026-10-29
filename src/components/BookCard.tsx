import type { Book } from "@/lib/books";

export default function BookCard({ book, showCategory = false }: { book: Book; showCategory?: boolean }) {
  return (
    <div className="card book-card">
      {showCategory && <span className="book-card__category">{book.category}</span>}
      <h3 className="card__title">{book.title}</h3>
      <p className="book-card__desc">{book.description}</p>
      <a href={book.link} target="_blank" rel="noopener" className="book-card__btn">
        הורדה / צפייה
      </a>
    </div>
  );
}
