import { createFileRoute } from "@tanstack/react-router";
import { LandlordRejectedPage } from "@/features/landlord/pages/LandlordRejectedPage";

export const Route = createFileRoute("/landlord/rejected")({
  head: () => ({
    meta: [
      { title: "Application not approved · UniHub Landlord Portal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LandlordRejectedPage,
});
