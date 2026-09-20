import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/VideoPanel";

export const ACTS = [
  { id: "top", label: "I · Arrive" },
  { id: "how-it-works", label: "II · Orient" },
  { id: "trust", label: "III · Believe" },
  { id: "residences", label: "IV · Witness" },
  { id: "listings", label: "V · Choose" },
  { id: "locations", label: "VI · Place" },
  { id: "close", label: "VII · Move" },
] as const;

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-highlight/80 via-foreground/70 to-highlight/40 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function JourneyRail() {
  const [active, setActive] = useState(ACTS[0]!.id);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const nodes = ACTS.map((act) => document.getElementById(act.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page journey"
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col gap-3">
        {ACTS.map((act) => {
          const isActive = active === act.id;
          return (
            <li key={act.id}>
              <a
                href={`#${act.id}`}
                className={cn(
                  "group flex items-center justify-end gap-3 text-[0.68rem] uppercase tracking-[0.16em] transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "whitespace-nowrap opacity-0 transition-opacity duration-300",
                    isActive ? "opacity-100" : "group-hover:opacity-80",
                  )}
                >
                  {act.label}
                </span>
                <span
                  className={cn(
                    "h-px transition-all duration-300",
                    isActive ? "w-8 bg-highlight" : "w-4 bg-border group-hover:w-6",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

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
        tone === "panel" && "border-y border-border bg-panel/80",
        tone === "deep" && "experience-act-deep",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
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
