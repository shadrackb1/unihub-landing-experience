import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — UniHub" },
      {
        name: "description",
        content: "Terms of using UniHub to browse student housing listings.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Terms of service."
      body="UniHub helps students discover housing and connect with landlords or agents. Full terms will be published before public launch."
      ctaLabel="Back home"
      ctaTo="/"
    />
  );
}
