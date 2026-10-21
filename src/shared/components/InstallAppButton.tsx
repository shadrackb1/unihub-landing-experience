import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "unihub:install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Floating "Install UniHub" pill shown when the browser fires
 * `beforeinstallprompt`. Makes the app download-able/installable on Android
 * and desktop Chrome/Edge; iOS users can still add to home screen manually.
 */
export function InstallAppButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!installEvent || dismissed || installed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0">
      <div
        className="flex items-center gap-2 rounded-full bg-foreground/95 px-4 py-2 text-background shadow-xl backdrop-blur"
        role="region"
        aria-label="Install app"
      >
        <button
          onClick={async () => {
            try {
              await installEvent.prompt();
              const choice = await installEvent.userChoice;
              if (choice.outcome === "accepted") setInstalled(true);
              setInstallEvent(null);
            } catch {
              setInstallEvent(null);
            }
          }}
          className="flex items-center gap-1.5 text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Install UniHub app
        </button>
        <button
          aria-label="Dismiss install prompt"
          onClick={() => {
            setDismissed(true);
            try {
              window.localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="text-background/60 hover:text-background"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default InstallAppButton;
