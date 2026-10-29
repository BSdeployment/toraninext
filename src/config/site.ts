/** הגדרות כלליות של האתר (מחליף את _config.yml) */
export const siteConfig = {
  name: "אבן שלמה",
  title: "אבן שלמה מאמרי תורה",
  description:
    "אבן שלמה - מאמרי תורה מקיפים, מדיה וקבצים לעילוי נשמת שלמה בן חסיבה, אור התורה שלמה בן חסיבה",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ortora.pages.dev",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  lang: "he",
  postsPerPage: 15,
  /** כותרת אזור הערות השוליים בתחתית מאמר. "" = לא להציג כותרת (נשארת רק לקוראי מסך) */
  footnotesTitle: "הערות שוליים",
  googleSiteVerification: "BDqILt9yjQH8JkhxxE_Fal84Crogj00kZSlPwbBX4gA",
  mailerLite: { accountId: "2584082", formId: "36oFaW" },
  contact: {
    name: "בניהו סויסה",
    email: "w0583253532@gmail.com",
    buttonEmail: "info@or-hatorah.co.il",
  },
  nav: [
    { href: "/", label: "בית" },
    { href: "/articles", label: "מאמרים" },
    { href: "/content", label: "ספריית תוכן" },
    { href: "/books", label: "ספרים וקבצים" },
    { href: "/media", label: "מדיה" },
    { href: "/contact", label: "הרשמה ויצירת קשר" },
  ],
} as const;
