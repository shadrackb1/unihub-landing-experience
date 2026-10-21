import { createFileRoute } from "@tanstack/react-router";
import { LandlordPendingPage } from "@/features/landlord/pages/LandlordPendingPage";

export const Route = createFileRoute("/landlord/pending")({
  head: () => ({
    meta: [
      { title: "Application under review · UniHub Landlord Portal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LandlordPendingPage,
});
