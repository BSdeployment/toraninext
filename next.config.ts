import type { NextConfig } from "next";

/**
 * ייצוא סטטי מלא: `npm run build` יוצר תיקיית `out/` שאפשר להעלות לכל אחסון סטטי.
 * בתת-נתיב (GitHub Pages) מגדירים DEPLOY_TARGET=github או NEXT_PUBLIC_BASE_PATH=/שם-המאגר
 */
const basePath =
  process.env.DEPLOY_TARGET === "github" ? "/toraninext" : process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /articles/ => articles/index.html (כמו ב-Jekyll)
  basePath,
  images: { unoptimized: true }, // נדרש לייצוא סטטי
  // מעביר את הנתיב הסופי גם לקוד שרץ בדפדפן (siteConfig.basePath)
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;