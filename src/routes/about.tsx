import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — UniHub" },
      {
        name: "description",
        content:
          "UniHub makes student housing search simple, safe, and transparent across Kenya.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Why UniHub"
      title="Built for students. Designed for trust."
      body="UniHub connects Kenyan university students with verified hostels, bedsitters, and rentals near campus. We vet listings and landlord contacts so you can move with more confidence."
      ctaLabel="Browse Listings"
      ctaTo="/listings"
    />
  );
}
