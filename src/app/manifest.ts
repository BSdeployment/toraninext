import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = siteConfig.basePath;
  return {
    name: siteConfig.title,
    short_name: siteConfig.title,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: `${base}/icons/app_install_icon192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icons/app_install_icon.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/icons/app_install_icon.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
