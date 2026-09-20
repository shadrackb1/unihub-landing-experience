import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteFooter, SiteHeader, WHATSAPP_URL } from "@/components/MarketingChrome";
import { PortraitVideo, Reveal, VideoPanel } from "@/components/VideoPanel";
import heroImage from "@/assets/unihub-hero.jpg";
import bedsitterImage from "@/assets/listing-bedsitter.jpg";
import hostelImage from "@/assets/listing-hostel.jpg";
import apartmentImage from "@/assets/listing-apartment.jpg";
import studioImage from "@/assets/listing-studio.jpg";
import twinHostelImage from "@/assets/listing-twin-hostel.jpg";
import sharedImage from "@/assets/listing-shared.jpg";
import walkthroughVideo from "@/assets/unihub-site-walkthrough.mp4";
import walkthroughPoster from "@/assets/unihub-walkthrough-poster.jpg";
import documentaryVideo from "@/assets/unihub-qwetu-documentary.mp4";
import documentaryPoster from "@/assets/unihub-qwetu-poster.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniHub — Verified Student Housing in Kenya" },
      {
        name: "description",
        content:
          "Browse verified hostels, bedsitters, and rentals near Kenyan university campuses. No account required—contact landlords directly.",
      },
      { property: "og:title", content: "UniHub — Find your perfect home." },
      {
        property: "og:description",
        content:
          "Safe, verified student housing near campus with transparent pricing and direct agent contact.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const listings = [
  {
    title: "Modern Bedsitter — Juja Town",
    location: "Near JKUAT",
    category: "Bedsitter",
    price: "KES 9,500",
    deposit: "Deposit: 1 month",
    image: bedsitterImage,
  },
  {
    title: "Secure Hostel Room — Gendered wing",
    location: "Near University of Nairobi",
    category: "Hostel",
    price: "KES 7,200",
    deposit: "Shared facilities",
    image: hostelImage,
  },
  {
    title: "Spacious Single Room — Kahawa",
    location: "Near Kenyatta University",
    category: "Single room",
    price: "KES 8,000",
    deposit: "Deposit: KES 8,000",
    image: apartmentImage,
  },
  {
    title: "Furnished Studio — Madaraka",
    location: "Near Strathmore University",
    category: "Studio",
    price: "KES 14,500",
    deposit: "Water included",
    image: studioImage,
  },
  {
    title: "Twin Hostel Room — Kesses",
    location: "Near Moi University",
    category: "Hostel",
    price: "KES 6,500",
    deposit: "Per student / month",
    image: twinHostelImage,
  },
  {
    title: "Shared Apartment — Njoro",
    location: "Near Egerton University",
    category: "Shared apartment",
    price: "KES 8,500",
    deposit: "Wi-Fi ready",
    image: sharedImage,
  },
];

const journey = [
  ["01", "Find your perfect home", "Start with the campus or area that works for you."],
  ["02", "Browse verified listings", "Compare clear prices, photos, and amenities."],
  ["03", "Pick a listing", "Choose the room that feels right for student life."],
  ["04", "Chat with an agent", "Message the verified contact directly."],
] as const;

const trust = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    copy: "Every listing and landlord is vetted before appearing on UniHub.",
  },
  {
    icon: GraduationCap,
    title: "Renter-Focused",
    copy: "Housing selected for student routines, practical budgets, and short commutes.",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    copy: "Use WhatsApp or email. No account required to find your next home.",
  },
];

const campusCodes = [
  { code: "UoN", name: "Nairobi" },
  { code: "JKUAT", name: "Juja" },
  { code: "KU", name: "Kahawa" },
  { code: "MU", name: "Kesses" },
  { code: "EGU", name: "Njoro" },
  { code: "SU", name: "Madaraka" },
];

const campuses = campusCodes.map((campus) => campus.name);

function ArrowLink({
  href,
  children,
}: {
  href: "/listings" | "#how-it-works" | "/";
  children: React.ReactNode;
}) {
  return (
    <Link
      to={href as "/listings"}
      className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-highlight"
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: "/listings" | "/list-property";
  children: React.ReactNode;
}) {
  return (
    <Link
      to={href}
      className="cta-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span>{children}</span>
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        <section
          id="top"
          className="relative flex min-h-[94svh] items-end overflow-hidden pb-10 pt-28 md:items-center md:pb-8"
        >
          <img
            src={heroImage}
            alt="Modern student residences near a leafy Kenyan campus"
            width={1600}
            height={1008}
            className="hero-image absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" aria-hidden="true" />
          <div className="noise absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
            <div className="max-w-4xl">
              <div className="reveal reveal-1 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-secondary-foreground backdrop-blur-xl">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Verified student housing across Kenya
              </div>
              <h1 className="reveal reveal-2 max-w-4xl font-display text-5xl font-medium leading-[0.98] tracking-normal sm:text-7xl lg:text-[6.8rem]">
                Find your perfect home.
              </h1>
              <p className="reveal reveal-3 mt-7 max-w-2xl text-base leading-relaxed text-secondary-foreground sm:text-xl">
                Verified student hostels, bedsitters, and rentals near campus —
                without the scams.
              </p>
              <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-5">
                <PrimaryLink href="/listings">Browse Listings</PrimaryLink>
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-highlight"
                >
                  How it works
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <div className="reveal reveal-4 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm">
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" /> Verified
                  landlords
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" /> No account to
                  browse
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" /> Contact via
                  WhatsApp
                </span>
              </div>

              {/* Signature: campus instrument rail — housing keyed to campus codes */}
              <div className="reveal reveal-4 mt-12 max-w-3xl">
                <p className="instrument mb-3 text-highlight/80">
                  Live campus coverage
                </p>
                <div className="campus-rail">
                  {campusCodes.map((campus) => (
                    <span key={campus.code} className="campus-code">
                      {campus.code}
                      <span className="font-normal tracking-normal text-muted-foreground normal-case">
                        {campus.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="section-shell border-y border-border bg-panel"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="section-heading">
              <p className="eyebrow">The simple way home</p>
              <h2>From campus search to agent chat.</h2>
            </Reveal>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">
              {journey.map(([number, title, copy], index) => (
                <Reveal
                  key={number}
                  as="li"
                  delay={index * 80}
                  className="journey-step group min-h-64 bg-card p-7 transition-colors duration-500 hover:bg-accent md:p-8"
                >
                  <span className="relative z-10 font-display text-sm text-highlight">
                    {number}
                  </span>
                  <h3 className="relative z-10 mt-16 font-display text-xl font-medium">
                    {title}
                  </h3>
                  <p className="relative z-10 mt-3 text-sm leading-relaxed text-muted-foreground">
                    {copy}
                  </p>
                </Reveal>
              ))}
            </ol>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <Reveal>
                <VideoPanel
                  id="walkthrough"
                  eyebrow="Site walkthrough"
                  title="See how to navigate UniHub."
                  description="A quick screen recording of browsing listings, shortlisting a place, and reaching out — no account wall in the way."
                  src={walkthroughVideo}
                  poster={walkthroughPoster}
                />
              </Reveal>
              <Reveal className="glass-card p-7 sm:p-9" delay={120}>
                <p className="eyebrow">Prefer to watch?</p>
                <h3 className="mt-3 font-display text-2xl font-medium">
                  Same path as the four steps.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Find a campus area, open verified listings, pick a room, then
                  message the agent. The walkthrough shows that flow end to end
                  on the live interface.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-secondary-foreground">
                  {["Browse without signing up", "Compare price and location", "Contact via WhatsApp"].map(
                    (item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-highlight" />{" "}
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="trust" className="section-shell">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="section-heading max-w-3xl">
              <p className="eyebrow">Why UniHub</p>
              <h2>
                Designed for students.
                <br />
                Built for trust.
              </h2>
              <p>
                Less uncertainty, fewer dead ends, and no signup wall between
                you and a genuine place to live.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {trust.map(({ icon: Icon, title, copy }, index) => (
                <Reveal
                  key={title}
                  delay={index * 100}
                  className="glass-card group p-7 sm:p-9"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-accent transition-colors group-hover:bg-secondary">
                    <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                  </div>
                  <h3 className="mt-12 font-display text-2xl font-medium">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
                    {copy}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="residences" className="section-shell">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="section-heading max-w-3xl">
              <p className="eyebrow">Housing on the ground</p>
              <h2>See student residences, not just listings.</h2>
              <p>
                A short documentary on Qwetu Qejani residences — the kind of
                safe, campus-adjacent housing international and local students
                ask about most.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative aspect-[9/16] bg-black/60">
                  <PortraitVideo
                    className="h-full w-full"
                    src={documentaryVideo}
                    poster={documentaryPoster}
                    ariaLabel="Qwetu Qejani student residences documentary"
                  />
                </div>
                <div className="p-5">
                  <p className="verified-stamp">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />{" "}
                    Campus housing spotlight
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Best student hostels in Kenya · Qwetu Qejani
                  </p>
                </div>
              </Reveal>
              <Reveal className="glass-card p-7 sm:p-10" delay={120}>
                <p className="eyebrow">Why this matters</p>
                <h3 className="mt-3 font-display text-3xl font-medium leading-tight">
                  Trust starts with seeing the place.
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Students and parents often ask where it is safe to stay while
                  visiting or studying in Kenya. Real residence footage helps
                  you judge space, security, and vibe before you message an
                  agent.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <PrimaryLink href="/listings">Browse listings</PrimaryLink>
                  <a
                    href="#how-it-works"
                    className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-foreground hover:text-highlight"
                  >
                    How UniHub works
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="listings" className="section-shell bg-panel">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="flex items-end justify-between gap-6">
              <div className="section-heading">
                <p className="eyebrow">Freshly verified</p>
                <h2>Featured near campus</h2>
              </div>
              <div className="hidden sm:block">
                <ArrowLink href="/listings">View all listings</ArrowLink>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing, index) => (
                <Reveal key={listing.title} delay={(index % 3) * 90} className="h-full">
                  <article className="listing-card group h-full overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      width={1200}
                      height={912}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                      {listing.category}
                    </span>
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-status px-3 py-1.5 text-xs font-semibold text-status-foreground">
                      <span className="size-1.5 rounded-full bg-status-dot" />{" "}
                      Available
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" /> {listing.location}
                      </div>
                      <span className="verified-stamp">
                        <ShieldCheck className="size-3.5" aria-hidden="true" />{" "}
                        Vetted
                      </span>
                    </div>
                    <h3 className="mt-3 min-h-14 font-display text-xl font-medium leading-snug">
                      {listing.title}
                    </h3>
                    <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                      <div>
                        <p className="font-display text-xl font-medium">
                          {listing.price}
                          <span className="text-sm text-muted-foreground">
                            {" "}
                            / month
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {listing.deposit}
                        </p>
                      </div>
                      <Link
                        to="/listings"
                        aria-label={`View details for ${listing.title}`}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-accent transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 sm:hidden">
              <ArrowLink href="/listings">View all listings</ArrowLink>
            </div>
          </div>
        </section>

        <section id="locations" className="section-shell">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <Reveal className="section-heading">
              <p className="eyebrow">Popular areas</p>
              <h2>Housing keyed to campus.</h2>
              <p>
                Search by the town you already know — Juja, Kahawa, Kesses —
                then shortlist places that keep the commute short.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {campusCodes.map((campus) => (
                  <span key={campus.code} className="campus-chip">
                    <span className="mr-2 text-highlight">{campus.code}</span>
                    {campus.name}
                  </span>
                ))}
              </div>
              <div className="mt-9">
                <PrimaryLink href="/listings">Explore by location</PrimaryLink>
              </div>
            </Reveal>
            <Reveal className="map-card relative min-h-[28rem] overflow-hidden rounded-3xl border border-border bg-card" delay={100}>
              <div className="absolute left-[11%] top-[14%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">
                Nairobi
              </div>
              <div className="absolute left-[42%] top-[31%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">
                Juja
              </div>
              <div className="absolute right-[11%] top-[18%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">
                Thika
              </div>
              <div className="absolute bottom-[18%] left-[19%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">
                Nakuru
              </div>
              <div className="absolute bottom-[12%] right-[18%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">
                Eldoret
              </div>
              <MapPin className="map-pin left-[36%] top-[19%]" />
              <MapPin className="map-pin right-[26%] top-[42%]" />
              <MapPin className="map-pin bottom-[31%] left-[43%]" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-border bg-background/80 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Browse by campus
                  </p>
                  <p className="mt-1 font-display font-medium">
                    Verified places, closer to class.
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="size-4" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-border bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <Reveal>
              <p className="font-display text-4xl font-medium leading-tight sm:text-6xl lg:text-7xl">
                No more housing scams.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/65 sm:text-lg">
                Listings are checked before they go live. We verify property
                details and landlord or agent contacts so you can make your
                next move with more confidence.
              </p>
            </Reveal>
            <Reveal
              className="grid grid-cols-3 gap-3 border-t border-background/15 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              delay={100}
            >
              <div>
                <ShieldCheck className="size-5" />
                <p className="mt-4 text-sm font-semibold">Vetted listings</p>
              </div>
              <div>
                <Building2 className="size-5" />
                <p className="mt-4 text-sm font-semibold">Campus focused</p>
              </div>
              <div>
                <MessageCircle className="size-5" />
                <p className="mt-4 text-sm font-semibold">Direct contact</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-shell bg-panel">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
            <Reveal className="min-h-[26rem] overflow-hidden">
              <img
                src={apartmentImage}
                alt="Student residence ready to welcome new tenants"
                width={1200}
                height={912}
                loading="lazy"
                className="h-full w-full object-cover object-right opacity-75 transition-transform duration-700 hover:scale-[1.03]"
              />
            </Reveal>
            <Reveal className="flex flex-col justify-center p-7 sm:p-12 lg:p-16" delay={100}>
              <p className="eyebrow">For landlords & agents</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-5xl">
                List property. Reach students ready to move.
              </h2>
              <ul className="mt-8 space-y-4 text-sm text-secondary-foreground">
                <li className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0" /> Earn a verified
                  badge students can trust
                </li>
                <li className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0" /> Receive direct
                  WhatsApp and email leads
                </li>
                <li className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0" /> Reach renters
                  searching around your campus area
                </li>
              </ul>
              <div className="mt-9">
                <PrimaryLink href="/list-property">List your property</PrimaryLink>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 py-24 text-center md:px-8 md:py-36">
          <div
            className="cta-orb absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <Reveal className="relative z-10 mx-auto max-w-4xl">
            <Sparkles
              className="mx-auto size-6 text-muted-foreground"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h2 className="mt-6 font-display text-4xl font-medium leading-tight sm:text-6xl lg:text-7xl">
              Your next home is already listed.
            </h2>
            <div className="mt-9">
              <PrimaryLink href="/listings">Browse Listings</PrimaryLink>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Free to browse · Contact agents directly
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-highlight"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> Or chat on
              WhatsApp
            </a>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
