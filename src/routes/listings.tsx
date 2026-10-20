import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Search, X } from "lucide-react";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { ListingGrid } from "@/features/listings/components/ListingGrid";
import { Reveal } from "@/shared/components/VideoPanel";
import { useListings } from "@/features/listings/hooks/useListings";

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
  const listings = useListings();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesCategory = category === "All" || listing.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      // Students search by campus town, room type, or a rent ceiling ("under 10k").
      const haystack = `${listing.title} ${listing.location} ${listing.category} ${listing.price} ${listing.deposit}`.toLowerCase();
      return q.split(/\s+/).every((token) => haystack.includes(token));
    });
  }, [listings, query, category]);

  const activeFilters = category !== "All" || query.trim().length > 0;

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
              Sample verified homes students shortlist first. Open any home to ask about it — no
              account required to browse.
            </p>
          </Reveal>

          <Reveal
            className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
            delay={80}
          >
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-border bg-accent/60 px-4 focus-within:ring-2 focus-within:ring-ring">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="listing-search" className="sr-only">
                Search listings
              </label>
              <input
                id="listing-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try: JKUAT, bedsitter under 10k…"
                className="min-h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setCategory(filter)}
                  aria-pressed={category === filter}
                  className={
                    category === filter
                      ? "rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                      : "campus-chip !min-h-0 !py-2 text-xs"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground" aria-live="polite">
            <span>
              {visible.length} {visible.length === 1 ? "home" : "homes"}
              {category !== "All" ? ` in ${category}` : ""}
              {query.trim() ? ` matching “${query.trim()}”` : ""}
            </span>
            {activeFilters && (
              <button
                type="button"
                onClick={() => { setQuery(""); setCategory("All"); }}
                className="text-xs font-medium underline underline-offset-4 hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>

          {visible.length > 0 ? (
            <ListingGrid listings={visible} />
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <p className="font-display text-lg font-medium">No listings match that yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try a campus town like Juja or Kahawa, a room type, or clear the filters.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCategory("All"); }}
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
                >
                  Clear filters
                </button>
                <Link
                  to="/contact"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Ask us for options
                </Link>
              </div>
            </div>
          )}

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


