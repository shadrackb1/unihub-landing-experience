import * as React from "react";

export const LogoMark = ({ className }: { className?: string }) => {
  return (
    <span className={`inline-flex shrink-0 ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
        <rect width="64" height="64" rx="14" className="fill-card" />
        <path
          d="M12 28.5L32 12l20 16.5"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.5 26.5V46.5c0 1.1.9 2 2 2h27c1.1 0 2-.9 2-2V26.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 31.5v8.2c0 4.2 3.2 6.8 8 6.8s8-2.6 8-6.8v-8.2"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="46" cy="20" r="4.25" className="fill-card" stroke="#6EE7B7" strokeWidth="2" />
        <path
          d="M44.2 20l1.3 1.35 2.4-2.7"
          stroke="#6EE7B7"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

