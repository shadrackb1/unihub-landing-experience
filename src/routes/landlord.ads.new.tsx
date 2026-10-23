import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landlord/ads/new")({
  component: () => <div>New Landlord Ad</div>,
});
