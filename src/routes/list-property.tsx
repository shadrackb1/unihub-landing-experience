import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/list-property")({
  head: () => ({
    meta: [
      { title: "List your property — UniHub" },
      {
        name: "description",
        content:
          "List hostels, bedsitters, and rentals on UniHub and reach students searching near campus.",
      },
    ],
  }),
  component: ListPropertyPage,
});

function ListPropertyPage() {
  return (
    <PlaceholderPage
      eyebrow="For landlords & agents"
      title="List your property on UniHub."
      body="Reach students actively searching near campus, earn a verified badge, and receive direct WhatsApp leads. Property onboarding form is coming soon."
      ctaLabel="Contact us about listing"
      ctaTo="/contact"
    />
  );
}
