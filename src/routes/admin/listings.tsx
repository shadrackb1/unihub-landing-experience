import { createFileRoute } from "@tanstack/react-router";
import { AdminListingsPage } from "@/features/admin/pages/AdminMarketplacePages";

export const Route = createFileRoute("/admin/listings")({
  head: () => ({ meta: [{ title: "Listing review — UniHub Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminListingsPage,
});
