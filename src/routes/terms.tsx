import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/MarketingChrome";
import { Reveal } from "@/components/VideoPanel";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms · UniHub" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <MarketingShell>
      <section className="section-shell">
        <Reveal className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">Terms of service</h1>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              UniHub helps students discover housing listings and contact landlords or agents. We do
              not own the properties, collect rent, or guarantee availability after you speak with
              an agent.
            </p>
            <p>
              Always verify the property in person before paying a deposit. Report suspicious
              listings so we can review them.
            </p>
            <p>
              Full terms will be published before public launch. See also the{" "}
              <Link to="/privacy" className="text-foreground underline-offset-4 hover:underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </MarketingShell>
  );
}
