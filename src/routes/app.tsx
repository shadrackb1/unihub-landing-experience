import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/app")({
  component: LegacyAppRoute,
});

function LegacyAppRoute() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([import("@/legacy/App"), import("@/legacy/index.css")]).then(([mod]) => {
      if (mounted) setApp(() => mod.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return App ? <App /> : null;
}
