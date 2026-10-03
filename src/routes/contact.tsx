import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { MarketingShell, WHATSAPP_URL } from "@/components/MarketingChrome";
import { Reveal } from "@/components/VideoPanel";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · UniHub" },
      {
        name: "description",
        content:
          "Reach UniHub on WhatsApp or email for student housing support in Kenya.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Support</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-6xl">
              Talk to UniHub.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Questions about a listing, verification, or listing your property?
              Message us directly. No account required.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Reveal className="solid-card p-7">
              <MessageCircle className="size-5 text-highlight" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-medium">WhatsApp</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Fastest for listing questions and campus recommendations.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Open WhatsApp
              </a>
            </Reveal>
            <Reveal className="solid-card p-7" delay={80}>
              <Mail className="size-5 text-highlight" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-medium">Email</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Partnerships, media, and longer requests.
              </p>
              <a
                href="mailto:hello@unihub.ke"
                className="mt-6 inline-flex min-h-12 items-center rounded-full border border-border bg-accent px-5 text-sm font-semibold"
              >
                hello@unihub.ke
              </a>
            </Reveal>
            <Reveal className="solid-card p-7" delay={140}>
              <MapPin className="size-5 text-highlight" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-medium">Coverage</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Student towns across Kenya: Nairobi, Juja, Thika, Kahawa,
                Eldoret, Nakuru, and more.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
