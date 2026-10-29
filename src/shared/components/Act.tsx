import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { usePrefersReducedMotion } from "@/shared/components/VideoPanel";

export function Act({
  id,
  index,
  title,
  children,
  className = "",
  tone = "base",
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  tone?: "base" | "panel" | "deep";
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id={id}
      data-act={index}
      className={cn(
        "relative",
        tone === "panel" ? "border-y border-border bg-panel/80" : "",
        tone === "deep" ? "experience-act-deep" : "",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="experience-orb" />
        {!reduced ? <div className="noise absolute inset-0 opacity-[0.07]" /> : null}
      </div>
      <div className="relative z-10">
        <div className="mx-auto mb-10 flex max-w-7xl items-center gap-4 px-5 md:mb-12 md:px-8">
          <span className="instrument text-highlight/80">{index}</span>
          <span className="h-px w-10 bg-border md:w-16" />
          <span className="instrument">{title}</span>
        </div>
        {children}
      </div>
    </section>
  );
}
