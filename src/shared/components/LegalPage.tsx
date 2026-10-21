import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { Reveal } from "@/shared/components/VideoPanel";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface Props {
  title: string;
  updated: string;
  /** One-sentence summary a reader can act on without scrolling. */
  summary: string;
  sections: LegalSection[];
  /** The sibling document, linked at the foot of the page. */
  related?: { to: "/privacy" | "/terms"; label: string };
}

/**
 * Shared shell for the privacy and terms pages: a readable measure, numbered
 * sections and a consistent footer note, so neither page reads like a
 * placeholder paragraph.
 */
export function LegalPage({ title, updated, summary, sections, related }: Props) {
  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Legal</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Last updated {updated}
            </p>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">{summary}</p>
          </Reveal>

          <div className="mt-10 border-t border-border">
            {sections.map((section, index) => (
              <Reveal key={section.heading} className="border-b border-border py-7">
                <h2 className="flex items-baseline gap-3 font-display text-xl font-medium">
                  <span className="instrument shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {section.body}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Something here unclear, or a request about your data?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/contact"
                className="inline-flex min-h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                Contact UniHub
              </Link>
              {related ? (
                <Link
                  to={related.to}
                  className="inline-flex min-h-10 items-center rounded-full border border-border bg-accent px-5 text-sm font-semibold"
                >
                  {related.label}
                </Link>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}

/** Bulleted list that matches the legal pages' body copy. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-highlight" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
