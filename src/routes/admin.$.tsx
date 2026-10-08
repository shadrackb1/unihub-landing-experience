import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/$")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/app#/admin/${params._splat ?? ""}` });
  },
});

