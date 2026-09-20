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

  const words = text.trim().split(/\s+/);

  let letterIndex = 0;

  return (
    <h1
      ref={ref}
      className={cn(
        "max-w-4xl font-display text-5xl font-medium leading-[0.98] tracking-normal sm:text-7xl lg:text-[6.8rem]",
        className,
      )}
      aria-label={text}
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const index = letterIndex++;
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
            {wordIndex < words.length - 1 ? (
              <span className="inline-block w-[0.28em]" />
            ) : null}
          </span>
        ))}
      </span>
    </h1>
  );
}
