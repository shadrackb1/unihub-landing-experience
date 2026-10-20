import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { SupportLink } from "@/shared/components/SupportLink";
import { Reveal } from "@/shared/components/VideoPanel";
import { WHATSAPP_CONFIGURED, SUPPORT_EMAIL } from "@/shared/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · UniHub" },
      {
        name: "description",
        content:
          "Reach the UniHub team about a listing, verification, or listing your property in Kenya.",
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
              Questions about a listing, verification, or listing your property? Message us
              directly. No account required.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Reveal className="solid-card flex flex-col p-7">
              <Mail className="size-5 text-highlight" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-medium">Email</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Listing questions, verification, partnerships, and data requests.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-auto inline-flex min-h-12 w-fit items-center self-start rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                {SUPPORT_EMAIL}
              </a>
            </Reveal>
            {WHATSAPP_CONFIGURED ? (
              <Reveal className="solid-card flex flex-col p-7" delay={80}>
                <MessageCircle className="size-5 text-highlight" aria-hidden="true" />
                <h2 className="mt-6 font-display text-2xl font-medium">WhatsApp</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Fastest for listing questions and campus recommendations.
                </p>
                <SupportLink
                  message="Hi UniHub, I'd like help finding verified student housing"
                  className="mt-auto inline-flex min-h-12 w-fit items-center rounded-full border border-border bg-accent px-5 text-sm font-semibold"
                >
                  Open WhatsApp
                </SupportLink>
              </Reveal>
            ) : (
              <Reveal className="solid-card flex flex-col p-7" delay={80}>
                <Clock className="size-5 text-highlight" aria-hidden="true" />
                <h2 className="mt-6 font-display text-2xl font-medium">Response times</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  We read email on working days and usually reply within one business day. Listings
                  reported as misleading are reviewed first.
                </p>
              </Reveal>
            )}
            <Reveal className="solid-card flex flex-col p-7" delay={140}>
              <MapPin className="size-5 text-highlight" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-medium">Coverage</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Student towns across Kenya: Nairobi, Juja, Thika, Kahawa, Eldoret, Nakuru, and more.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
