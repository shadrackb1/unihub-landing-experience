import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

const SW_UPDATE_KEY = "unihub:sw-version";
const PENDING_RELOAD_KEY = "unihub:sw-pending-reload";
const KNOWN_BADGE = "unihub:sw-update-banner";

/**
 * Registers `/sw.js` in production builds and keeps the shell fresh:
 *  - when a NEW service worker activates (a new deployment was published),
 *    schedule a one-time silent reload on the user's NEXT visit so the newly
 *    cached shell takes over without interrupting what they are doing;
 *
 * Rendered from the root so exactly one instance covers every route.
 */
export function PwaBridge() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (import.meta.env.PROD !== true || !("serviceWorker" in navigator)) return;

    let unregisterBanner: (() => void) | null = null;

    // One-shot silent reload for a previously announced update.
    try {
      if (window.localStorage.getItem(PENDING_RELOAD_KEY) === "1" && window.sessionStorage.getItem(PENDING_RELOAD_KEY) !== "1") {
        window.sessionStorage.setItem(PENDING_RELOAD_KEY, "1");
        window.localStorage.removeItem(PENDING_RELOAD_KEY);
        window.location.reload();
        return;
      }
    } catch {
      /* ignore storage failures */
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        const onActivateMessage = (event: MessageEvent) => {
          if (event.data?.type !== "SW_ACTIVATE") return;
          const version = event.data.version as string | undefined;
          let previous: string | null = null;
          try {
            previous = window.localStorage.getItem(SW_UPDATE_KEY);
            if (previous && version && previous !== version && window.localStorage.getItem(KNOWN_BADGE) !== version) {
              window.localStorage.setItem(KNOWN_BADGE, version);
              window.localStorage.setItem(PENDING_RELOAD_KEY, "1");
            }
            window.localStorage.setItem(SW_UPDATE_KEY, version ?? "unknown");
          } catch {
            /* ignore */
          }
        };
        navigator.serviceWorker.addEventListener("message", onActivateMessage);
        unregisterBanner = () => navigator.serviceWorker.removeEventListener("message", onActivateMessage);
      })
      .catch(() => {
        // SW registration failed — the app still works online.
      });

    return () => {
      unregisterBanner?.();
    };
  }, []);

  return null;
}

export default PwaBridge;
