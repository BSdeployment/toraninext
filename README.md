# אבן שלמה – אתר Next.js (ייצוא סטטי)

המרה של אתר ה-Jekyll ל-Next.js (App Router, TypeScript). האתר נבנה לקבצים סטטיים בלבד בתיקיית `out/`.

## פקודות

```bash
npm install
npm run dev        # פיתוח מקומי: http://localhost:3000
npm run build      # בנייה סטטית ל-out/ (ויוצר גם out/_redirects)
npx serve out      # תצוגה מקומית של התוצאה הסטטית
```

## מבנה הפרויקט

```
content/posts/        המאמרים (Markdown) – YYYY-MM-DD-שם-המאמר.md
public/               קבצים סטטיים: אייקונים, favicon, sw.js, קובץ אימות Google
src/
  app/                דפים (App Router) + sitemap, robots, feed.xml, manifest
    page.tsx            עמוד הבית
    articles/           רשימת מאמרים, עימוד (page/[num]), מאמר בודד ([slug])
    books/ media/ contact/
    globals.css         נקודת כניסה ל-CSS (סדר ה-@import = סדר ה-cascade)
  components/         Header, Footer, PostCard, BookCard, ArticlesBrowser (חיפוש), Pagination...
  data/               books.json, media.json, topics.ts  ← כאן עורכים ספרים/מדיה/נושאי סינון
  config/site.ts      שם האתר, תיאור, תפריט, פרטי קשר, MailerLite  (במקום _config.yml)
  lib/                קריאת מאמרים, Markdown, תאריך עברי
  styles/             ה-CSS המקורי, מפוצל לקבצים לפי נושא (אותן מחלקות בדיוק)
  assets/             תמונות שמיובאות מהקוד (תמונת הבית)
scripts/generate-redirects.mjs   הפניות מכתובות Jekyll הישנות
```

## ספריית תוכן (`/content`)

דף עיון וחיפוש לפי נושאים. **המבנה נקבע משמות התיקיות** ב-`content/posts/`:
תיקייה ישירה = נושא ראשי, תיקיית משנה = תת-נושא (בכל עומק). מאמרים שיושבים ישירות ב-`content/posts/` מופיעים תחת "נושאים כלליים".

- סינון: עץ בתפריט הצד; לחיצה על נושא ללא תתי-נושאים מציגה במרכז את רשימת מאמריו, לחיצה על מאמר מציגה אותו במלואו.
- חיפוש: בכל הטקסט, בהכל או בנושאים ראשיים נבחרים. מתעלם מניקוד, אותיות סופיות וגרשיים (י"ח = יח), וכל המילים חייבות להופיע (אפשר "ביטוי מדויק").
- סדר מאמרים בתוך נושא: לפי שם, או לפי `order: 1` ב-frontmatter (אופציונלי).
- הנתונים נוצרים ב-build: `/content-data/articles.json` (נטען בפתיחת מאמר) ו-`/content-data/search-index.json` (נטען בחיפוש הראשון).
- קוד: `src/components/library/`, `src/lib/library/`, עיצוב ב-`src/styles/library.css`.

## משימות נפוצות

- **הוספת מאמר:** קובץ חדש ב-`content/posts/` (אפשר גם בתוך תתי-תיקיות בכל עומק, למשל `content/posts/2026/אייר/`; הסדר באתר נקבע לפי התאריך בלבד, לא לפי התיקייה) בשם `2026-05-01-שם-המאמר.md` עם frontmatter:
  ```yaml
  ---
  title: "כותרת"
  date: 2026-05-01
  tags: [הלכה, שבת]
  excerpt: "תקציר קצר (אופציונלי)"
  pdf_link: "https://..."   # אופציונלי
  # date: אופציונלי אם התאריך כבר בשם הקובץ
  published: false            # אופציונלי – להסתרת מאמר
  ---
  ```
  הכתובת תהיה `/articles/שם-המאמר/`. תגית שרוצים שתופיע ככפתור סינון – מוסיפים ל-`src/data/topics.ts`.
- **הוספת ספר/קובץ:** שורה חדשה ב-`src/data/books.json`.
- **סרטונים:** ב-`src/data/media.json` ממלאים `youtube_id`.
- **שינוי עיצוב:** עורכים את הקובץ הרלוונטי ב-`src/styles/` (צבעים ומצב כהה ב-`tokens.css`).
- **כתובת האתר / תת-נתיב:** משתני סביבה, ראו `.env.example`
  (`NEXT_PUBLIC_SITE_URL`, ו-`NEXT_PUBLIC_BASE_PATH` רק אם האתר לא בשורש הדומיין, למשל GitHub Pages `/torani`).

## פריסה

- **Cloudflare Pages:** Build command: `npm run build`, Output directory: `out`.
- **GitHub Pages / אחר:** מעלים את תוכן `out/`.
