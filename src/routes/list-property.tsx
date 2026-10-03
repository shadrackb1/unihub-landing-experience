import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MarketingShell, WHATSAPP_URL } from "@/components/MarketingChrome";
import { Reveal } from "@/components/VideoPanel";

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
              Put hostels, bedsitters, and rentals in front of students actively
              searching near campus. Onboarding starts with a short WhatsApp chat.
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
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-shine inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Start on WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center rounded-full border border-border bg-accent px-6 text-sm font-semibold"
                >
                  Email UniHub
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
                  <p className="mt-1 text-foreground">Your listing goes live for campus searchers.</p>
                </li>
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
