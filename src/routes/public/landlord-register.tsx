import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy signup URL kept alive for old links and QR codes. */
export const Route = createFileRoute("/public/landlord-register")({
  beforeLoad: () => {
    throw redirect({ to: "/landlord/register" });
  },
});
