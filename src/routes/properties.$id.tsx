import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/properties/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/app#/properties/${params.id}` });
  },
});
