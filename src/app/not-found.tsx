import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-content">
      <h1 className="page-title">הדף לא נמצא</h1>
      <p>
        <Link href="/">חזרה לעמוד הבית</Link>
      </p>
    </div>
  );
}
