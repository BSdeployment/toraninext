"use client";

import { useEffect, useState } from "react";

/** מעבר בין מצב בהיר/כהה. המצב נשמר ב-localStorage ומוחל מוקדם ע"י theme-init (ראו layout.tsx) */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") !== "dark";
    if (next) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      className="theme-toggle"
      id="theme-toggle"
      aria-label="מצב כהה/בהיר"
      title="מצב כהה/בהיר"
      onClick={toggle}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
