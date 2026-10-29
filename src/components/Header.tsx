"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import ThemeToggle from "./ThemeToggle";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="site-logo">
          {siteConfig.name}
        </Link>
        <button
          className={`menu-toggle${open ? " open" : ""}`}
          aria-label="תפריט"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`site-nav${open ? " open" : ""}`} id="site-nav">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${isActive(pathname, item.href) ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="header-actions">
            <ThemeToggle />
            <button
              className="theme-toggle theme-toggle--print"
              onClick={() => window.print()}
              aria-label="הדפסת מאמר"
              title="הדפסה"
            >
              🖨️
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
