import { createFileRoute } from "@tanstack/react-router";
import { LandlordAdsPage } from "@/features/landlord/pages/LandlordAdsPage";

export const Route = createFileRoute("/landlord/ads")({
  head: () => ({
    meta: [{ title: "Ad boosts · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }],
  }),
  component: LandlordAdsPage,
});
