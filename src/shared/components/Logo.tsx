import * as React from "react";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/shared/components/LogoMark";

export const Logo = ({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) => {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-3 rounded-xl ${className}`}
      aria-label="UniHub home"
    >
      <LogoMark className="size-10 text-foreground" />
      <span className="flex flex-col gap-0.5">
        <span className="font-display text-xl font-medium leading-none tracking-normal">
          Uni<span className="text-muted-foreground">Hub</span>
        </span>
        {showTagline ? (
          <span className="instrument hidden text-[0.58rem] opacity-80 sm:block">
            Campus housing · Kenya
          </span>
        ) : null}
      </span>
    </Link>
  );
};
