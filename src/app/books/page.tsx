import type { Metadata } from "next";
import BookCard from "@/components/BookCard";
import FadeIn from "@/components/FadeIn";
import { getBooksByCategory } from "@/lib/books";

export const metadata: Metadata = {
  title: "ספרים וקבצים",
  description: "ספרים וקבצים תורניים להורדה",
  alternates: { canonical: "/books/" },
};

export default function BooksPage() {
  return (
    <div className="container">
      <h1 className="page-title">ספרים וקבצים</h1>

      {getBooksByCategory().map(({ category, books }) => (
        <FadeIn as="section" className="section" key={category}>
          <h2 className="section-title">{category}</h2>
          <div className="card-list">
            {books.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
