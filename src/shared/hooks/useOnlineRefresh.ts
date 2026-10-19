import { useEffect, useState } from "react";

/**
 * Returns a counter that increments every time the browser reports coming
 * back online. Data hooks include it in their effect dependencies so listings,
 * site settings and other cached reads are re-fetched (and the offline cache
 * re-populated) as soon as connectivity returns.
 */
export function useOnlineRefresh(): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bump = () => setTick((previous) => previous + 1);
    window.addEventListener("online", bump);
    return () => window.removeEventListener("online", bump);
  }, []);

  return tick;
}
