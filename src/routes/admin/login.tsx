import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Sign in · UniHub Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});
