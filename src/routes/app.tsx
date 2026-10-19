import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/app")({
  component: LegacyAppRoute,
});

function LegacyAppRoute() {
  const [App, setApp] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    setFailed(false);
    Promise.all([import("@/legacy/App"), import("@/legacy/index.css")])
      .then(([mod]) => {
        if (mounted) setApp(() => mod.default);
      })
      .catch((error) => {
        // Without this the route used to render null forever (blank page).
        console.error("Failed to load the legacy app bundle:", error);
        if (mounted) setFailed(true);
      });
    return () => {
      mounted = false;
    };
  }, [attempt]);

  if (failed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-800">This section could not load</h1>
        <p className="text-sm text-zinc-500 max-w-md">
          Something went wrong loading this part of UniHub. Try again, or head back
          to the homepage.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setAttempt((n) => n + 1)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-100"
          >
            Go home
          </a>
        </div>
      </div>
    );
  }

  if (!App) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600 h-8 w-8" />
      </div>
    );
  }

  return <App />;
}

