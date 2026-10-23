import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Check, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { Reveal } from "@/shared/components/VideoPanel";
import { useListings } from "@/features/listings/hooks/useListings";
import { SupportLink } from "@/shared/components/SupportLink";
import { ListingContact } from "@/features/listings/components/ListingContact";
import { WHATSAPP_CONFIGURED } from "@/shared/contact";

export const Route = createFileRoute("/listings_/$id")({
  head: () => ({ meta: [{ title: "Listing · UniHub" }] }),
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { id } = Route.useParams();
  const listings = useListings();
  const listing = listings.find((item) => item.id === id);
  const listingTitle = listing?.title;

  // The head is static because listings load client-side; keep the tab and
  // shared-link title specific to the home the visitor opened.
  useEffect(() => {
    if (!listingTitle) return;
    const previous = document.title;
    document.title = `${listingTitle} · UniHub`;
    return () => {
      document.title = previous;
    };
  }, [listingTitle]);

  if (!listing) {
    return (
      <MarketingShell>
        <section className="section-shell">
          <div className="mx-auto max-w-2xl px-5 py-20 text-center md:px-8">
            <h1 className="font-display text-3xl font-medium sm:text-4xl">
              This listing is no longer available
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              It may have been taken, or the link is out of date. Browse current verified homes near
              campus instead.
            </p>
            <Link
              to="/listings"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <ArrowLeft className="size-4" /> Back to listings
            </Link>
          </div>
        </section>
      </MarketingShell>
    );
  }

  const message = `Hi UniHub, I'm interested in "${listing.title}" (${listing.location}). Is it still available?`;

  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All listings
          </Link>

          <Reveal className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={listing.image}
                alt={listing.title}
                className="aspect-[4/3] w-full object-cover"
                width={1200}
                height={900}
              />
            </div>

            <div className="solid-card p-7 sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium">
                {listing.category}
              </span>
              <h1 className="mt-4 font-display text-3xl font-medium leading-tight">
                {listing.title}
              </h1>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden="true" /> {listing.location}
              </p>

              <div className="mt-6 border-y border-border py-5">
                <p className="font-display text-2xl font-medium">
                  {listing.price}
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{listing.deposit}</p>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-secondary-foreground">
                <li className="flex gap-2">
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-highlight"
                    aria-hidden="true"
                  />
                  Details checked before this listing went live
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                  Contact the agent directly — no account needed
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                  Always view the property before paying a deposit
                </li>
              </ul>

              <div className="mt-7 flex flex-col gap-3">
                <ListingContact listing={listing} size="detail" />
                <Link
                  to="/listings"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-accent px-6 text-sm font-semibold text-foreground"
                >
                  Compare other listings
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-10 rounded-2xl border border-border bg-card p-7 sm:p-8">
            <h2 className="font-display text-xl font-medium">What to check before you commit</h2>
            <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <p className="font-medium text-foreground">Visit in person</p>
                <p className="mt-1">Confirm the room, water, and power match the listing.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Agree the deposit in writing</p>
                <p className="mt-1">Ask what the deposit covers and when it is refundable.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Report anything odd</p>
                <p className="mt-1">
                  Message us {WHATSAPP_CONFIGURED ? "on" : "by"}{" "}
                  <SupportLink
                    message={`Hi UniHub, I want to report a listing: ${listing.title}`}
                    className="text-foreground underline underline-offset-4"
                  >
                    {WHATSAPP_CONFIGURED ? "WhatsApp" : "email"}
                  </SupportLink>{" "}
                  and we will review it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
