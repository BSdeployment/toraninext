import { getSearchIndex } from "@/lib/library/build";

export const dynamic = "force-static";

/** אינדקס טקסט מלא לחיפוש בספריית התוכן (נוצר ב-build, נטען רק בחיפוש הראשון) */
export function GET() {
  return Response.json(getSearchIndex());
}
