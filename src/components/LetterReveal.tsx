import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/VideoPanel";

export function LetterReveal({
  text,
  className,
  delayStepMs = 36,
  startDelayMs = 120,
}: {
  text: string;
  className?: string;
  delayStepMs?: number;
  startDelayMs?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setReady(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const letters = Array.from(text);

  return (
    <h1
      ref={ref}
      className={cn(
        "max-w-4xl font-display text-5xl font-medium leading-[0.98] tracking-normal sm:text-7xl lg:text-[6.8rem]",
        className,
      )}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline">
        {letters.map((char, index) => {
          if (char === " ") {
            return (
              <span key={`space-${index}`} className="inline-block w-[0.28em]" />
            );
          }

          return (
            <span
              key={`${char}-${index}`}
              className={cn(
                "letter-reveal inline-block",
                ready || reduced ? "letter-reveal-in" : "letter-reveal-out",
              )}
              style={{
                transitionDelay: `${startDelayMs + index * delayStepMs}ms`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
