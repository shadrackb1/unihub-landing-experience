import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function useInView<T extends HTMLElement>(options?: {
  rootMargin?: string;
  threshold?: number;
  /** When true, only flips to true once and stays (for one-shot text reveals). */
  once?: boolean;
}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const once = options?.once ?? false;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView((prev) => (once && prev ? true : visible));
      },
      {
        rootMargin: options?.rootMargin ?? "0px 0px -12% 0px",
        threshold: options?.threshold ?? 0.35,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold, once]);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "p" | "h2" | "h3" | "li" | "ol" | "ul";
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true });
  const reduced = usePrefersReducedMotion();

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(
        "scroll-reveal",
        inView || reduced ? "scroll-reveal-in" : "scroll-reveal-out",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

type VideoPanelProps = {
  src: string;
  poster: string;
  title: string;
  description: string;
  eyebrow?: string;
  id?: string;
};

function useAutoplayInView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "15% 0px 15% 0px",
  });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    if (!inView || reduced) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [inView, reduced]);

  return { videoRef, wrapRef };
}

export function VideoPanel({ src, poster, title, description, eyebrow, id }: VideoPanelProps) {
  const { videoRef, wrapRef } = useAutoplayInView();

  return (
    <div className="video-card group relative overflow-hidden rounded-[1.75rem] border border-border bg-card">
      <div ref={wrapRef} className="relative aspect-video bg-black/70">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          controls
          preload="metadata"
          poster={poster}
          aria-label={title}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </div>
      <div className="relative z-10 border-t border-white/10 p-6 sm:p-7">
        {eyebrow ? (
          <p id={id} className="eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 font-display text-2xl font-medium">{title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export function PortraitVideo({
  src,
  poster,
  ariaLabel,
  className = "",
}: {
  src: string;
  poster: string;
  ariaLabel: string;
  className?: string;
}) {
  const { videoRef, wrapRef } = useAutoplayInView();

  return (
    <div ref={wrapRef} className={className}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        controls
        preload="metadata"
        poster={poster}
        aria-label={ariaLabel}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    </div>
  );
}