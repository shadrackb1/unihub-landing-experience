import { createFileRoute } from "@tanstack/react-router";
import { LandlordDashboard } from "@/features/landlord/pages/LandlordDashboard";

export const Route = createFileRoute("/landlord/")({
  head: () => ({
    meta: [{ title: "Dashboard · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }],
  }),
  component: LandlordDashboard,
});
