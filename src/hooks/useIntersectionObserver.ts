import { useEffect, useRef, useState, useCallback } from "react";

interface ObserverEntry {
  target: Element;
  isIntersecting: boolean;
  intersectionRatio: number;
}

/**
 * Shared IntersectionObserver singleton
 * Consolidates multiple observers into a single instance per (rootMargin, threshold) combo
 */
class IntersectionObserverSingleton {
  private observers: Map<string, IntersectionObserver> = new Map();
  private subscriptions: Map<string, Map<Element, Set<(entry: ObserverEntry) => void>>> = new Map();

  private getKey(rootMargin: string, threshold: number): string {
    return `${rootMargin}:${threshold}`;
  }

  private getOrCreateObserver(rootMargin: string, threshold: number): IntersectionObserver {
    const key = this.getKey(rootMargin, threshold);
    let observer = this.observers.get(key);

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          const subs = this.subscriptions.get(key);
          if (!subs) return;

          entries.forEach((entry) => {
            const callbacks = subs.get(entry.target);
            if (callbacks) {
              const observerEntry: ObserverEntry = {
                target: entry.target,
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
              };
              callbacks.forEach((cb) => cb(observerEntry));
            }
          });
        },
        { rootMargin, threshold },
      );

      this.observers.set(key, observer);
      this.subscriptions.set(key, new Map());
    }

    return observer;
  }

  subscribe(
    element: Element,
    rootMargin: string,
    threshold: number,
    callback: (entry: ObserverEntry) => void,
  ): () => void {
    const key = this.getKey(rootMargin, threshold);
    const observer = this.getOrCreateObserver(rootMargin, threshold);
    const subs = this.subscriptions.get(key)!;

    if (!subs.has(element)) {
      subs.set(element, new Set());
      observer.observe(element);
    }

    subs.get(element)!.add(callback);

    // Return unsubscribe function
    return () => {
      const elementSubs = subs.get(element);
      if (elementSubs) {
        elementSubs.delete(callback);
        if (elementSubs.size === 0) {
          subs.delete(element);
          observer.unobserve(element);
        }
      }

      // Clean up observer if no more subscriptions
      if (subs.size === 0) {
        observer.disconnect();
        this.observers.delete(key);
        this.subscriptions.delete(key);
      }
    };
  }
}

// Global singleton instance
const intersectionObserverSingleton = new IntersectionObserverSingleton();

/**
 * Hook for using the shared IntersectionObserver
 * Multiple components with same options share a single observer instance
 */
export function useSharedIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: {
    rootMargin?: string;
    threshold?: number;
    /** When true, only flips to true once and stays (for one-shot text reveals). */
    once?: boolean;
  } = {},
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const once = options?.once ?? false;

  const rootMargin = options?.rootMargin ?? "0px 0px -12% 0px";
  const threshold = options?.threshold ?? 0.35;

  const handleEntry = useCallback(
    (entry: ObserverEntry) => {
      const visible = entry.isIntersecting;
      setInView((prev) => (once && prev ? true : visible));
    },
    [once],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const unsubscribe = intersectionObserverSingleton.subscribe(
      node,
      rootMargin,
      threshold,
      handleEntry,
    );

    return unsubscribe;
  }, [rootMargin, threshold, handleEntry]);

  return { ref, inView };
}

/**
 * Batch version for observing multiple elements with same options
 * Returns a ref callback to attach to elements
 */
export function useBatchIntersectionObserver(
  options: {
    rootMargin?: string;
    threshold?: number;
    once?: boolean;
  } = {},
) {
  const [entries, setEntries] = useState<Map<Element, ObserverEntry>>(new Map());
  const once = options?.once ?? false;

  const rootMargin = options?.rootMargin ?? "0px 0px -12% 0px";
  const threshold = options?.threshold ?? 0.35;

  const handleEntry = useCallback(
    (entry: ObserverEntry) => {
      setEntries((prev) => {
        const next = new Map(prev);
        const visible = entry.isIntersecting;
        const existing = next.get(entry.target);

        if (once && existing?.isIntersecting) {
          // Already triggered and should stay true
          return next;
        }

        next.set(entry.target, {
          ...entry,
          isIntersecting: once && existing?.isIntersecting ? true : visible,
        });
        return next;
      });
    },
    [once],
  );

  const refCallback = useCallback((node: Element | null) => {
    // This will be called for each element with the ref
    // We can't easily track multiple refs with a single callback,
    // so we use the singleton directly in components that need batch observation
  }, []);

  return { entries, refCallback };
}
