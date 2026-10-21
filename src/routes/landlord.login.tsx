import { createFileRoute } from "@tanstack/react-router";
import { LandlordLoginPage } from "@/features/landlord/pages/LandlordLoginPage";

export const Route = createFileRoute("/landlord/login")({
  head: () => ({
    meta: [{ title: "Sign in · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }],
  }),
  component: LandlordLoginPage,
});
