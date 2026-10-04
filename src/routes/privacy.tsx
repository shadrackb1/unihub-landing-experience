import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { Reveal } from "@/shared/components/VideoPanel";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy · UniHub" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="section-shell">
        <Reveal className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">Privacy policy</h1>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              UniHub collects only what we need to help you discover housing and contact landlords
              or agents. That can include messages you send through WhatsApp links or email.
            </p>
            <p>
              We do not require an account to browse. We do not sell student personal data. Listing
              contact details are shared so you can reach property owners or agents directly.
            </p>
            <p>
              This summary will be expanded into a full policy before public launch. Questions?{" "}
              <Link to="/contact" className="text-foreground underline-offset-4 hover:underline">
                Contact UniHub
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </MarketingShell>
  );
}
