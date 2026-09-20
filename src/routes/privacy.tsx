import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — UniHub" },
      {
        name: "description",
        content: "How UniHub handles information on the student housing platform.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Privacy policy."
      body="We collect only what we need to help you find housing and contact landlords or agents. Full policy text will be published before public launch."
      ctaLabel="Back home"
      ctaTo="/"
    />
  );
}
