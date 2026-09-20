import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { MarketingShell, WHATSAPP_URL } from "@/components/MarketingChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — UniHub" },
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
      <section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-5 py-20 md:px-8">
        <p className="eyebrow">Support</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-6xl">
          Talk to UniHub.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Questions about a listing, verification, or listing your property?
          Message us directly — no account required.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="cta-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            support
          </a>
          <a
            href="mailto:hello@unihub.ke"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            hello@unihub.ke
          </a>
        </div>
      </section>
    </MarketingShell>
  );
}
