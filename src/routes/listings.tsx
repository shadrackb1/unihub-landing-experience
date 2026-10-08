import { createFileRoute } from "@tanstack/react-router";
import { Check, Search } from "lucide-react";
import { MarketingShell } from "@/components/MarketingChrome";
import { ListingGrid } from "@/components/ListingGrid";
import { Reveal } from "@/components/VideoPanel";
import { sampleListings } from "@/data/listings";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings · UniHub" },
      {
        name: "description",
        content:
          "Browse verified hostels, bedsitters, and rentals near Kenyan university campuses.",
      },
    ],
  }),
  component: ListingsPage,
});

const filters = ["All", "Hostel", "Bedsitter", "Single room", "Studio", "Shared apartment"];

function ListingsPage() {
  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Verified inventory</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-6xl">
              Listings near campus.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Sample verified homes students shortlist first. Contact agents on WhatsApp when you
              are ready. No account required to browse.
            </p>
          </Reveal>

          <Reveal
            className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
            delay={80}
          >
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-border bg-accent/60 px-4">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">
                Try: JKUAT, UoN, bedsitter under 10k…
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <span
                  key={filter}
                  className={
                    index === 0
                      ? "rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                      : "campus-chip !min-h-0 !py-2 text-xs"
                  }
                >
                  {filter}
                </span>
              ))}
            </div>
          </Reveal>

          <ListingGrid listings={sampleListings} />

          <Reveal className="solid-card mt-12 flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-medium">Need a room this semester?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us your campus and budget. We will point you to verified options.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-secondary-foreground">
              {["Vetted landlords", "WhatsApp first", "Clear monthly pricing"].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-highlight" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
