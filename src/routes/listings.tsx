import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings — UniHub" },
      {
        name: "description",
        content:
          "Browse verified hostels, bedsitters, and rentals near Kenyan university campuses.",
      },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Verified inventory"
      title="Listings are coming next."
      body="This page will host the full catalog of verified hostels, bedsitters, single rooms, and shared apartments near campus. For now, explore featured homes on the homepage."
      ctaLabel="Back to featured homes"
      ctaTo="/"
    />
  );
}
