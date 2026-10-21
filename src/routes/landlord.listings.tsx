import { createFileRoute } from "@tanstack/react-router";
import { LandlordListingsPage } from "@/features/landlord/pages/LandlordListingsPage";

export const Route = createFileRoute("/landlord/listings")({
  head: () => ({
    meta: [{ title: "Listings · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }],
  }),
  component: LandlordListingsPage,
});
