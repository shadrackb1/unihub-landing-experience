import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/ads")({
  component: () => <div>Landlord Ads</div>,
});
