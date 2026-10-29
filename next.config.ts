import type { NextConfig } from "next";

/**
 * ייצוא סטטי מלא: `npm run build` יוצר תיקיית `out/` שאפשר להעלות לכל אחסון סטטי
 * (Cloudflare Pages, GitHub Pages, Netlify, S3...).
 *
 * אם האתר יושב בתת-נתיב (למשל GitHub Pages: /torani) הגדירו NEXT_PUBLIC_BASE_PATH=/torani
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /articles/ => articles/index.html (כמו ב-Jekyll)
  basePath,
  images: { unoptimized: true }, // נדרש לייצוא סטטי
};

export default nextConfig;
