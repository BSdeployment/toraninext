import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s – ${siteConfig.title}` },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/images/newicon.ico", type: "image/x-icon" }],
    apple: "/icons/app_install_icon192.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: { types: { "application/atom+xml": "/feed.xml" } },
  openGraph: {
    siteName: siteConfig.title,
    locale: "he_IL",
    type: "website",
  },
  verification: { google: siteConfig.googleSiteVerification },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

/** מחיל מצב כהה לפני הצביעה הראשונה כדי למנוע הבהוב */
const themeInit = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.lang} dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Header />
        <main className="site-main">{children}</main>
        <Footer />

        {/* MailerLite Universal */}
        <Script id="mailerlite" strategy="afterInteractive">{`
          (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},
          l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
          (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
          ml('account', '${siteConfig.mailerLite.accountId}');
        `}</Script>
      </body>
    </html>
  );
}
