import type { ReactNode } from "react";
import type { Lang } from "./catalog";
export function Link({
  to,
  lang,
  children,
  className = "",
}: {
  to: string;
  lang: Lang;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={`/${lang}/${to}`}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
          return;
        e.preventDefault();
        history.pushState({}, "", `/${lang}/${to}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }}
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}
export function Ornament({ word = "التواصل" }: { word?: string }) {
  return (
    <div className="calligraphy" aria-hidden="true">
      <svg viewBox="0 0 240 100">
        <path
          d="M8 75Q45 20 78 60Q112 100 145 45Q175 5 218 65M12 82Q35 57 52 78M186 69Q206 45 232 77"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M25 54q-8-24 13-28q8 16-13 28M190 41q-10-30 15-31q7 20-15 31"
          fill="currentColor"
          opacity=".25"
        />
      </svg>
      <span lang="ar" dir="rtl">
        {word}
      </span>
    </div>
  );
}
export function PageTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="page-title">
      <Ornament word="المعرفة" />
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
    </div>
  );
}
export const localGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
export const localSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Learning remains usable without storage. */
  }
};
