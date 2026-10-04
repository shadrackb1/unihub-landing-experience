import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MarketingShell, WHATSAPP_URL } from "@/shared/components/MarketingChrome";
import { Reveal } from "@/shared/components/VideoPanel";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · UniHub" },
      {
        name: "description",
        content: "UniHub makes student housing search simple, safe, and transparent across Kenya.",
      },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified first",
    copy: "We check listings and landlord contacts before they appear, so students spend less time sorting scams from real rooms.",
  },
  {
    icon: GraduationCap,
    title: "Built around campuses",
    copy: "Housing sits near universities and student towns such as Juja, Kahawa, Eldoret, and Nakuru. It is not generic city inventory.",
  },
  {
    icon: MessageCircle,
    title: "Direct contact",
    copy: "Browse freely, then WhatsApp or email the agent. UniHub stays out of the way when you are ready to move.",
  },
];

function AboutPage() {
  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Why UniHub</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-6xl">
              Built for students. Designed for trust.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Finding a safe place near campus in Kenya should not mean endless WhatsApp groups and
              risky deposits. UniHub connects students with verified hostels, bedsitters, and
              rentals, then gets out of the way.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 90} className="solid-card p-7 sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-accent">
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h2 className="mt-8 font-display text-2xl font-medium">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-card p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-medium">Ready to look around?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with featured listings or watch the walkthrough on the homepage.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/listings"
                className="cta-shine inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Browse Listings
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-accent px-6 text-sm font-semibold"
              >
                WhatsApp support
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
