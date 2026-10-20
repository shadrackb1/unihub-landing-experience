import { createFileRoute } from "@tanstack/react-router";
import { AdminAdsPage } from "@/features/admin/pages/AdminMarketplacePages";

export const Route = createFileRoute("/admin/ads")({
  head: () => ({ meta: [{ title: "Ads & boosts — UniHub Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminAdsPage,
});
