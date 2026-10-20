import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { SupportLink } from "@/shared/components/SupportLink";
import { SUPPORT_LABEL } from "@/shared/contact";
import { Reveal } from "@/shared/components/VideoPanel";

export const Route = createFileRoute("/list-property")({
  head: () => ({
    meta: [
      { title: "List your property · UniHub" },
      {
        name: "description",
        content:
          "List hostels, bedsitters, and rentals on UniHub and reach students searching near campus.",
      },
    ],
  }),
  component: ListPropertyPage,
});

const benefits = [
  "Verified badge students can trust",
  "Direct WhatsApp and email leads",
  "Campus-targeted exposure",
  "You keep pricing and availability control",
];

function ListPropertyPage() {
  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">For landlords & agents</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-6xl">
              List property. Reach students ready to move.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Put hostels, bedsitters, and rentals in front of students actively searching near
              campus. Create a landlord account, get verified, then publish listings yourself.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal className="solid-card p-7 sm:p-10">
              <h2 className="font-display text-2xl font-medium">What you get</h2>
              <ul className="mt-6 space-y-4 text-sm text-secondary-foreground">
                {benefits.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-highlight" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/landlord/register"
                  className="cta-shine inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Create a landlord account
                </Link>
                <SupportLink
                  message="Hi UniHub, I have a question about listing my property"
                  className="inline-flex min-h-12 items-center rounded-full border border-border bg-accent px-6 text-sm font-semibold"
                >
                  {SUPPORT_LABEL === "WhatsApp support" ? "Ask on WhatsApp" : "Email us"}
                </SupportLink>
                <Link
                  to="/landlord"
                  className="inline-flex min-h-12 items-center rounded-full px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Already registered? Sign in
                </Link>
              </div>
            </Reveal>
            <Reveal className="solid-card p-7 sm:p-8" delay={100}>
              <p className="eyebrow">How onboarding works</p>
              <ol className="mt-6 space-y-5 text-sm text-muted-foreground">
                <li>
                  <span className="font-display text-highlight">01</span>
                  <p className="mt-1 text-foreground">Share location, room types, and pricing.</p>
                </li>
                <li>
                  <span className="font-display text-highlight">02</span>
                  <p className="mt-1 text-foreground">We verify property details and contacts.</p>
                </li>
                <li>
                  <span className="font-display text-highlight">03</span>
                  <p className="mt-1 text-foreground">
                    Once approved, add listings from your dashboard. They go live after review.
                  </p>
                </li>
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
