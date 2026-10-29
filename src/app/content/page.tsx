import type { Metadata } from "next";
import ContentLibrary from "@/components/library/ContentLibrary";
import { getLibraryData } from "@/lib/library/build";

export const metadata: Metadata = {
  title: "ספריית תוכן",
  description: "עיון וחיפוש מתקדם בכל המאמרים לפי נושאים ותתי-נושאים",
  alternates: { canonical: "/content/" },
};

export default function ContentPage() {
  return <ContentLibrary data={getLibraryData()} />;
}
