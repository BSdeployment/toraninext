import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import PostCard from "@/components/PostCard";
import BookCard from "@/components/BookCard";
import { getAllPosts } from "@/lib/posts";
import { books } from "@/lib/books";
import heroImage from "@/assets/hero.png";

export const metadata: Metadata = {
  title: "בית",
  description: "אור התורה – אתר תורני עם מאמרים, שיעורים וספרים להורדה",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-box">
          <h1 className="hero-title hero-title--xl">אבן שלמה</h1>
          <p className="hero-subtitle hero-subtitle--dark">
            מקום לעיון, לימוד והעמקה בדברי תורה.
            <br />
            מאמרים, שיעורים וספרים — הכל במקום אחד.
          </p>

          <Image className="img-circle" src={heroImage} alt="Image" priority />

          <p className="hero-memorial">
            <b>לע&quot;נ מור אבי שלמה בן חסיבה זצ&quot;ל</b>
          </p>
        </div>
      </section>

      <FadeIn as="section" className="section">
        <h2 className="section-title">מאמרים אחרונים</h2>
        <div className="card-list">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} variant="home" excerptWords={25} />
          ))}
        </div>
      </FadeIn>

      <FadeIn as="section" className="section">
        <h2 className="section-title">ספרים וקבצים</h2>
        <div className="card-list">
          {featuredBooks.map((book) => (
            <BookCard key={book.title} book={book} showCategory />
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
