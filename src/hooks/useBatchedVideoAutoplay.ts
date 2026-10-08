import { useEffect, useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface VideoEntry {
  video: HTMLVideoElement;
  element: HTMLElement;
  options?: {
    rootMargin?: string;
    threshold?: number;
  };
}

/**
 * Batched video autoplay manager using a single IntersectionObserver
 * and rAF loop for checking visibility
 */
class BatchedVideoManager {
  private static instance: BatchedVideoManager | null = null;
  private observer: IntersectionObserver | null = null;
  private entries: Map<HTMLVideoElement, VideoEntry> = new Map();
  private rafId: number | null = null;
  private reducedMotion: boolean = false;

  private constructor() {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reducedMotion = media.matches;
      media.addEventListener("change", (e) => {
        this.reducedMotion = e.matches;
      });
    }
  }

  static getInstance(): BatchedVideoManager {
    if (!BatchedVideoManager.instance) {
      BatchedVideoManager.instance = new BatchedVideoManager();
    }
    return BatchedVideoManager.instance;
  }

  register(
    video: HTMLVideoElement,
    element: HTMLElement,
    options?: VideoEntry["options"],
  ): () => void {
    if (this.entries.has(video)) {
      return () => this.unregister(video);
    }

    this.entries.set(video, { video, element, options });

    if (!this.observer) {
      this.observer = new IntersectionObserver(
        (entries) => {
          // Entries are handled in the rAF loop
        },
        {
          rootMargin: options?.rootMargin ?? "15% 0px 15% 0px",
          threshold: options?.threshold ?? 0.35,
        },
      );
    }

    this.observer.observe(element);

    // Start the rAF loop if not already running
    if (this.rafId === null) {
      this.startLoop();
    }

    return () => this.unregister(video);
  }

  unregister(video: HTMLVideoElement): void {
    const entry = this.entries.get(video);
    if (entry) {
      this.observer?.unobserve(entry.element);
      this.entries.delete(video);
    }

    // Stop the loop if no more entries
    if (this.entries.size === 0 && this.rafId !== null) {
      this.stopLoop();
    }
  }

  private startLoop(): void {
    const checkVisibility = () => {
      if (this.entries.size === 0) {
        this.stopLoop();
        return;
      }

      this.entries.forEach((entry) => {
        const { video, element } = entry;
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView && !this.reducedMotion) {
          if (video.paused) {
            void video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });

      this.rafId = requestAnimationFrame(checkVisibility);
    };

    this.rafId = requestAnimationFrame(checkVisibility);
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  cleanup(): void {
    this.stopLoop();
    this.observer?.disconnect();
    this.observer = null;
    this.entries.clear();
  }
}

/**
 * Hook for batched video autoplay
 * Uses a single IntersectionObserver and rAF loop for all videos
 */
export function useBatchedVideoAutoplay(options?: { rootMargin?: string; threshold?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const elementRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const manager = BatchedVideoManager.getInstance();

  useEffect(() => {
    const video = videoRef.current;
    const element = elementRef.current;

    if (!video || !element) return;

    // For videos that don't use IntersectionObserver, we check manually in rAF
    const unregister = manager.register(video, element, options);

    return unregister;
  }, [options?.rootMargin, options?.threshold]);

  // Expose refs for the video element and its wrapper
  return { videoRef, elementRef };
}

/**
 * Alternative: hook that uses IntersectionObserver directly but batched
 * This is more efficient for many videos on the page
 */
export function useIntersectionVideoAutoplay(options?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const elementRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    const element = elementRef.current;

    if (!video || !element) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry?.isIntersecting ?? false;

        if (isInView && !reduced) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        rootMargin: options?.rootMargin ?? "15% 0px 15% 0px",
        threshold: options?.threshold ?? 0.35,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [reduced, options?.rootMargin, options?.threshold]);

  return { videoRef, elementRef };
}
