/** טיפוסים משותפים של "ספריית התוכן" (בטוחים לשרת וללקוח) */

/** שם הנושא הווירטואלי למאמרים שיושבים ישירות ב-content/posts (בלי תיקיית נושא) */
export const GENERAL_TOPIC = "נושאים כלליים";

export type LibraryArticle = {
  /** ה-slug של המאמר (זהה לכתובת בעמוד /articles/) */
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  tags: string[];
  excerpt: string;
  pdfLink?: string;
  /** שמות התיקיות: [נושא ראשי, תת-נושא, ...] */
  topicPath: string[];
};

export type TopicNode = {
  /** מזהה יציב = הנתיב מחובר ב-"/" */
  key: string;
  name: string;
  path: string[];
  /** מאמרים שיושבים ישירות בנושא זה (לא בתתי-נושאים) */
  articleIds: string[];
  children: TopicNode[];
  /** סך המאמרים בנושא ובכל תתי-הנושאים שלו */
  total: number;
};

export type LibraryData = {
  topics: TopicNode[];
  articles: Record<string, LibraryArticle>;
};

export const topicKey = (path: readonly string[]) => path.join("/");
