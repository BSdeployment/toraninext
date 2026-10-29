import { getArticleHtml } from "@/lib/library/build";

export const dynamic = "force-static";

/** תוכן ה-HTML של כל המאמרים להצגה בעמוד "ספריית תוכן" (נטען בפתיחת המאמר הראשון) */
export async function GET() {
  return Response.json(await getArticleHtml());
}
