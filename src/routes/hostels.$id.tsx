import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hostels/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/app#/hostels/${params.id}` });
  },
});

