import { useEffect, useRef } from "react";
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
import { SiteFooter, SiteHeader, WHATSAPP_URL } from "@/shared/components/MarketingChrome";
import {
  PortraitVideo,
  Reveal,
  VideoPanel,
  usePrefersReducedMotion,
} from "@/shared/components/VideoPanel";
import { Act, JourneyRail, ScrollProgress } from "@/shared/components/Experience";
import { CampusMap } from "@/features/campus/components/CampusMap";
import { LetterReveal } from "@/shared/components/LetterReveal";
import {
  CoolVideoCard,
  ResidenceVideoGallery,
  type ResidenceClip,
} from "@/features/residence/components/ResidenceVideoGallery";
import { useListings } from "@/features/listings/hooks/useListings";
import apartmentImage from "@/assets/listing-apartment.jpg";
import heroImage from "@/assets/unihub-hero.jpg";
import heroVideo from "@/assets/unihub-hero.mp4";
import heroPoster from "@/assets/unihub-hero-poster.jpg";
import walkthroughVideo from "@/assets/unihub-site-walkthrough.mp4";
import walkthroughPoster from "@/assets/unihub-walkthrough-poster.jpg";
import documentaryVideo from "@/assets/unihub-qwetu-documentary.mp4";
import documentaryPoster from "@/assets/unihub-qwetu-poster.jpg";
import studentRoomsVideo from "@/assets/listing-video-student-rooms.mp4";
import studentRoomsPoster from "@/assets/listing-video-student-rooms-poster.jpg";
import femaleHostelVideo from "@/assets/listing-video-female-hostel.mp4";
import femaleHostelPoster from "@/assets/listing-video-female-hostel-poster.jpg";
import maisonVideo from "@/assets/listing-video-maison.mp4";
import maisonPoster from "@/assets/listing-video-maison-poster.jpg";

const residenceClips: ResidenceClip[] = [
  {
    id: "student-rooms",
    title: "Spacious student rooms",
    meta: "From KES 15,000",
    blurb: "Own kitchen and bathroom even when you share. Free gym and lounges for campus life.",
    src: studentRoomsVideo,
    poster: studentRoomsPoster,
    ariaLabel: "Spacious student rooms tour with kitchen bathroom and gym",
  },
  {
    id: "female-hostel",
    title: "Female hostel in Kigamboni",
    meta: "Student-focused",
    blurb:
      "Modern women’s hostel near ferry routes. Built for students around IFM, CBE, TIA, UTUMISHI, and nearby colleges. Free Wi‑Fi.",
    src: femaleHostelVideo,
    poster: femaleHostelPoster,
    ariaLabel: "Luxury female hostel for students in Kigamboni",
  },
  {
    id: "maison",
    title: "Maison Bauchart suites",
    meta: "Premium stays",
    blurb: "Tailored suites for short stays above typical hostel budgets.",
    src: maisonVideo,
    poster: maisonPoster,
    ariaLabel: "Maison Bauchart tailored suites hospitality video",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniHub · Verified Student Housing in Kenya" },
      {
        name: "description",
        content:
          "Browse verified hostels, bedsitters, and rentals near Kenyan university campuses. No account required. Contact landlords directly.",
      },
      { property: "og:title", content: "UniHub · Find your perfect home." },
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
      className="cta-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span>{children}</span>
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

function Index() {
  const listings = useListings();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    if (reduced) {
      video.pause();
      return;
    }
    void video.play().catch(() => {});
  }, [reduced]);

  return (
    <div className="page-frame min-h-screen overflow-x-hidden bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader />
      <JourneyRail />

      <main id="main">
        <section
          id="top"
          className="relative flex min-h-[94svh] items-end overflow-hidden pb-10 pt-28 md:items-center md:pb-8"
        >
          <video
            ref={heroVideoRef}
            className="hero-image absolute inset-0 h-full w-full object-cover object-center"
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster || heroImage}
            aria-hidden="true"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay absolute inset-0" aria-hidden="true" />
          <div className="noise absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
            <div className="max-w-4xl">
              <div className="reveal reveal-1 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-secondary-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
                UniHub · Verified campus housing in Kenya
              </div>
              <LetterReveal text="Find your perfect home." />
              <p className="reveal reveal-3 mt-7 max-w-2xl text-base leading-relaxed text-secondary-foreground sm:text-xl">
                Browse verified hostels, bedsitters, and rentals near campus. Message landlords on
                WhatsApp. No account needed to search.
              </p>
              <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-5">
                <PrimaryLink href="/listings">Browse Listings</PrimaryLink>
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-highlight"
                >
                  How UniHub works
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <div className="reveal reveal-4 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm">
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" /> Vetted listings
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" /> Free to browse
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" /> WhatsApp with agents
                </span>
              </div>

              <div className="reveal reveal-4 mt-12 max-w-3xl">
                <p className="instrument mb-3 text-highlight/80">Search by campus</p>
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

              <div className="reveal reveal-4 mt-14">
                <span className="scroll-cue" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <Act id="how-it-works" index="II" title="Orient" tone="panel" className="section-shell">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="section-heading">
              <p className="eyebrow">The simple way home</p>
              <h2>From campus search to agent chat.</h2>
            </Reveal>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
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
                  <h3 className="relative z-10 mt-16 font-display text-xl font-medium">{title}</h3>
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
                  description="Browse listings, shortlist a place, and contact an agent."
                  src={walkthroughVideo}
                  poster={walkthroughPoster}
                />
              </Reveal>
              <Reveal className="solid-card p-7 sm:p-9" delay={120}>
                <p className="eyebrow">The path</p>
                <h3 className="mt-3 font-display text-2xl font-medium">
                  Same path as the four steps.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Find a campus area, open verified listings, pick a room, then message the agent.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-secondary-foreground">
                  {[
                    "Browse without signing up",
                    "Compare price and location",
                    "Contact via WhatsApp",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-highlight" /> {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Act>

        <Act id="trust" index="III" title="Believe" className="section-shell">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="section-heading max-w-3xl">
              <p className="eyebrow">Why UniHub</p>
              <h2>
                Designed for students.
                <br />
                Built for trust.
              </h2>
              <p>
                Less uncertainty, fewer dead ends, and no signup wall between you and a genuine
                place to live.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-4 md:grid-rows-[1fr_1fr]">
              <Reveal
                key="verified"
                delay={0}
                className="solid-card group p-7 sm:p-9 md:col-span-2 md:row-span-2"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-accent transition-colors group-hover:bg-secondary">
                  <ShieldCheck className="size-6" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3 className="mt-10 font-display text-3xl font-medium leading-tight sm:text-4xl">
                  Verified Listings
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Every listing and landlord is vetted before appearing on UniHub. We check property
                  details, ownership documents, and agent contacts so you spend less time sorting
                  scams from real rooms.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm text-secondary-foreground">
                  {[
                    "Property documents checked",
                    "Landlord identity verified",
                    "Agent contacts confirmed",
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-highlight" />
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal key="renter" delay={120} className="solid-card group p-7 sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-accent transition-colors group-hover:bg-secondary">
                  <GraduationCap className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-display text-xl font-medium">Renter-Focused</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                  Housing selected for student routines, practical budgets, and short commutes.
                </p>
              </Reveal>

              <Reveal key="direct" delay={200} className="solid-card group p-7 sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-accent transition-colors group-hover:bg-secondary">
                  <MessageCircle className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-display text-xl font-medium">Direct Contact</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                  Use WhatsApp or email. No account required to find your next home.
                </p>
              </Reveal>
            </div>
          </div>
        </Act>

        <Act id="residences" index="IV" title="Witness" tone="panel" className="section-shell">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="section-heading max-w-3xl">
              <p className="eyebrow">Housing on the ground</p>
              <h2>See the residences behind the listings.</h2>
              <p>
                Student housing footage from residences across the region: rooms, hostels, and
                premium stays.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card">
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
                    <ShieldCheck className="size-3.5" aria-hidden="true" /> Campus housing spotlight
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Best student hostels in Kenya · Qwetu Qejani
                  </p>
                </div>
              </Reveal>
              <Reveal className="solid-card p-7 sm:p-10" delay={120}>
                <p className="eyebrow">Why this matters</p>
                <h3 className="mt-3 font-display text-3xl font-medium leading-tight">
                  Trust starts with seeing the place.
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Students and parents often ask where it is safe to stay while visiting or studying
                  in Kenya. Real residence footage helps you judge space, security, and vibe before
                  you message an agent.
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
            <ResidenceVideoGallery clips={residenceClips} />
          </div>
        </Act>

        <Act id="listings" index="V" title="Choose" className="section-shell">
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

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <CoolVideoCard clip={residenceClips[0]!} delay={0} />
              <Reveal className="solid-card flex flex-col justify-center p-7 sm:p-10" delay={100}>
                <p className="eyebrow">Featured rooms</p>
                <h3 className="mt-3 font-display text-3xl font-medium leading-tight">
                  Rooms you can almost walk into.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Spacious student rooms from <span className="text-foreground">KES 15,000</span>.
                  Private kitchen and bathroom options, free gym and lounges.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <PrimaryLink href="/listings">Open listings</PrimaryLink>
                  <a
                    href="#residences"
                    className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-foreground hover:text-highlight"
                  >
                    More residence clips
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing, index) => (
                <Reveal key={listing.title} delay={(index % 3) * 90} className="h-full">
                  <article className="listing-card group h-full overflow-hidden rounded-2xl border border-border bg-card">
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
                        <span className="size-1.5 rounded-full bg-status-dot" /> Available
                      </span>
                    </div>
                    <div className="p-6">
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
        </Act>

        <Act id="locations" index="VI" title="Place" tone="panel" className="section-shell">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <Reveal className="section-heading">
              <p className="eyebrow">Popular areas</p>
              <h2>Housing keyed to campus.</h2>
              <p>
                Search by the town you already know (Juja, Kahawa, Kesses), then shortlist places
                that keep the commute short.
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
            <Reveal className="min-h-[28rem]" delay={100}>
              <CampusMap className="h-full min-h-[28rem]" />
            </Reveal>
          </div>

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8">
            <CoolVideoCard clip={residenceClips[1]!} />
            <Reveal className="solid-card flex flex-col justify-center p-7 sm:p-9" delay={100}>
              <p className="eyebrow">Campus corridors</p>
              <h3 className="mt-3 font-display text-2xl font-medium">
                Female hostels students actually ask for.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Modern hostels with Wi‑Fi for learners around IFM, CBE, TIA, UTUMISHI, and nearby
                colleges. See the space before you message an agent.
              </p>
            </Reveal>
          </div>
        </Act>

        <section className="border-y border-border bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <Reveal>
              <p className="font-display text-4xl font-medium leading-tight sm:text-6xl lg:text-7xl">
                No more housing scams.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/65 sm:text-lg">
                Listings are checked before they go live. We verify property details and landlord or
                agent contacts so you can make your next move with more confidence.
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

        <Act id="close" index="VII" title="Move" tone="deep" className="section-shell">
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
                  <Check className="mt-0.5 size-4 shrink-0" /> Earn a verified badge students can
                  trust
                </li>
                <li className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0" /> Receive direct WhatsApp and email
                  leads
                </li>
                <li className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0" /> Reach renters searching around your
                  campus area
                </li>
              </ul>
              <div className="mt-9">
                <PrimaryLink href="/list-property">List your property</PrimaryLink>
              </div>
            </Reveal>
          </div>
          <div className="mx-auto mt-10 max-w-md">
            <CoolVideoCard clip={residenceClips[2]!} />
          </div>
        </Act>

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
              <MessageCircle className="size-4" aria-hidden="true" /> Or chat on WhatsApp
            </a>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
