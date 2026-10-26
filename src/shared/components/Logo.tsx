import * as React from "react";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/shared/components/LogoMark";

const logoSizes = {
  sm: { mark: "size-8", text: "text-lg", tagline: "text-[0.5rem]" },
  md: { mark: "size-10", text: "text-xl", tagline: "text-[0.58rem]" },
  lg: { mark: "size-12", text: "text-2xl", tagline: "text-[0.65rem]" },
} as const;

type LogoSize = keyof typeof logoSizes;

export const Logo = ({
  className = "",
  showTagline = true,
  size = "md",
}: { className?: string; showTagline?: boolean; size?: LogoSize }) => {
  const s = logoSizes[size];
  return (
    <Link
      to="/"
      className={`group flex items-center gap-3 rounded-xl ${className}`}
      aria-label="UniHub home"
    >
      <LogoMark className={`${s.mark} text-foreground`} />
      <span className="flex flex-col gap-0.5">
        <span className={`font-display ${s.text} font-medium leading-none tracking-normal`}>
          Uni<span className="text-muted-foreground">Hub</span>
        </span>
        {showTagline ? (
          <span className={`instrument hidden ${s.tagline} opacity-80 sm:block`}>
            Campus housing Â· Kenya
          </span>
        ) : null}
      </span>
    </Link>
  );
};

