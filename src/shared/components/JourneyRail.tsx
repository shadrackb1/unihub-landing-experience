import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { usePrefersReducedMotion } from "@/shared/components/VideoPanel";

export const ACTS = [
  { id: "top", label: "I · Arrive" },
  { id: "how-it-works", label: "II · Orient" },
  { id: "trust", label: "III · Believe" },
  { id: "residences", label: "IV · Witness" },
  { id: "listings", label: "V · Choose" },
  { id: "locations", label: "VI · Place" },
  { id: "close", label: "VII · Move" },
] as const;

export type ActId = (typeof ACTS)[number]["id"];

export function JourneyRail() {
  const [active, setActive] = useState<ActId>(ACTS[0]!.id);
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
        if (visible?.target.id) {
          setActive(visible.target.id as ActId);
        }
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
