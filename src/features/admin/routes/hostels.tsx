import { createFileRoute } from "@tanstack/react-router";
import { AdminHostelsPage, routeOptions } from "@/features/admin/pages/AdminHostelsPage";
import { guardedLoader } from "@/features/admin/requireAdmin";

export const Route = createFileRoute("/admin/hostels")({
  head: () => ({
    meta: [{ title: "Hostels · UniHub Admin" }, { name: "robots", content: "noindex" }],
  }),
  loader: () => guardedLoader(routeOptions.loader, { hostels: [], universities: [] }),
  component: AdminHostelsPage,
});
