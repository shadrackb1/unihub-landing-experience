import { createFileRoute } from "@tanstack/react-router";
import { LandlordRegisterPage } from "@/features/landlord/pages/LandlordRegisterPage";

export const Route = createFileRoute("/landlord/register")({
  head: () => ({
    meta: [{ title: "Register · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }],
  }),
  component: LandlordRegisterPage,
});
