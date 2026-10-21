import { createFileRoute } from "@tanstack/react-router";
import { AdminCMSPage, routeOptions } from "@/features/admin/pages/AdminCMSPage";
import { guardedLoader } from "@/features/admin/requireAdmin";

export const Route = createFileRoute("/admin/cms")({
  loader: () => guardedLoader(routeOptions.loader, { settings: null }),
  head: () => ({
    meta: [{ title: "Site builder — UniHub Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminCMSPage,
});
