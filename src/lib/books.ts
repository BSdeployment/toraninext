import booksData from "@/data/books.json";

export type Book = { title: string; description: string; category: string; link: string };

export const books: Book[] = booksData;

/** מקבץ ספרים לפי קטגוריה, בסדר הופעת הקטגוריות הראשונה ב-books.json */
export function getBooksByCategory(): { category: string; books: Book[] }[] {
  const categories = [...new Set(books.map((b) => b.category))];
  return categories.map((category) => ({ category, books: books.filter((b) => b.category === category) }));
}
