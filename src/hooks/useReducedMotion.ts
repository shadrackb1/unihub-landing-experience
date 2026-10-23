import { useSyncExternalStore } from "react";

// Module-level singleton state
let reducedMotionState = false;
const subscribers = new Set<() => void>();

// Initialize media query listener once
if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotionState = media.matches;

  const handleChange = () => {
    reducedMotionState = media.matches;
    subscribers.forEach((cb) => cb());
  };

  media.addEventListener("change", handleChange);

  // Cleanup function (for testing or if needed)

  const cleanup = () => media.removeEventListener("change", handleChange);
}

/**
 * Subscribe to reduced motion changes
 */
function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

/**
 * Get current reduced motion state
 */
function getSnapshot(): boolean {
  return reducedMotionState;
}

/**
 * Get server snapshot (always false for SSR)
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Shared hook for prefers-reduced-motion using useSyncExternalStore
 * Single media query listener shared across all components
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
