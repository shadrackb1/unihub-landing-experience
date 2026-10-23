import { createFileRoute } from "@tanstack/react-router";
import { AdminLandlordsPage } from "@/features/admin/pages/AdminMarketplacePages";

export const Route = createFileRoute("/admin/landlords")({
  head: () => ({
    meta: [{ title: "Landlords — UniHub Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLandlordsPage,
});
