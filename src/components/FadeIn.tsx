"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** עוטף אלמנט באנימציית הופעה בגלילה (class "fade-in" + "visible") */
export default function FadeIn({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${className} fade-in${visible ? " visible" : ""}`.trim()}>
      {children}
    </Tag>
  );
}
