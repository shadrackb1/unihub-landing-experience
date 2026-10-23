import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/shared/components/VideoPanel";
import { ListingContact } from "./ListingContact";
import type { SampleListing } from "@/data/listings";

export function ListingGrid({ listings }: { listings: SampleListing[] }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, index) => {
        const content = (
          <>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={listing.image}
                alt={listing.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="absolute left-4 top-4 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium">
                {listing.category}
              </span>
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-status px-3 py-1.5 text-xs font-semibold text-status-foreground">
                <span className="size-1.5 rounded-full bg-status-dot" /> Available
              </span>
            </div>
            <div className="p-6 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {listing.location}
                </div>
                <span className="verified-stamp">
                  <ShieldCheck className="size-3.5" aria-hidden="true" /> Vetted
                </span>
              </div>
              <h3 className="mt-3 min-h-14 font-display text-xl font-medium leading-snug">
                {listing.title}
              </h3>
              <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                <div>
                  <p className="font-display text-xl font-medium">
                    {listing.price}
                    <span className="text-sm text-muted-foreground"> / month</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{listing.deposit}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-accent transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
          </>
        );

        return (
          <Reveal
            key={`${listing.id ?? "listing"}-${listing.title}`}
            delay={(index % 3) * 80}
            className="listing-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            {listing.id ? (
              <Link
                to="/listings/$id"
                params={{ id: listing.id }}
                aria-label={`View details for ${listing.title}`}
                className="block flex-1"
              >
                {content}
              </Link>
            ) : (
              <div className="flex-1">{content}</div>
            )}
            <div className="px-6 pb-6">
              <ListingContact listing={listing} />
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
