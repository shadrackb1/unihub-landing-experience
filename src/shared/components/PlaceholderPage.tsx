import { Link } from "@tanstack/react-router";
import { MarketingShell } from "@/shared/components/MarketingChrome";

export function PlaceholderPage({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: "/listings" | "/list-property" | "/contact" | "/";
}) {
  return (
    <MarketingShell>
      <section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-5 py-20 md:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {body}
        </p>
        <div className="mt-9">
          <Link
            to={ctaTo}
            className="cta-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}