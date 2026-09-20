import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/unihub-hero.jpg";
import bedsitterImage from "@/assets/listing-bedsitter.jpg";
import hostelImage from "@/assets/listing-hostel.jpg";
import apartmentImage from "@/assets/listing-apartment.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniHub — Verified Student Housing in Kenya" },
      { name: "description", content: "Browse verified hostels, bedsitters, and rentals near Kenyan university campuses. No account required—contact landlords directly." },
      { property: "og:title", content: "UniHub — Find your perfect home." },
      { property: "og:description", content: "Safe, verified student housing near campus with transparent pricing and direct agent contact." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const listings = [
  { title: "Modern Bedsitter — Juja Town", location: "Near JKUAT", category: "Bedsitter", price: "KES 9,500", deposit: "Deposit: 1 month", image: bedsitterImage },
  { title: "Secure Hostel Room — Gendered wing", location: "Near University of Nairobi", category: "Hostel", price: "KES 7,200", deposit: "Shared facilities", image: hostelImage },
  { title: "Spacious Single Room — Kahawa", location: "Near Kenyatta University", category: "Single room", price: "KES 8,000", deposit: "Deposit: KES 8,000", image: apartmentImage },
  { title: "Furnished Studio — Madaraka", location: "Near Strathmore University", category: "Studio", price: "KES 14,500", deposit: "Water included", image: bedsitterImage },
  { title: "Twin Hostel Room — Kesses", location: "Near Moi University", category: "Hostel", price: "KES 6,500", deposit: "Per student / month", image: hostelImage },
  { title: "Shared Apartment — Njoro", location: "Near Egerton University", category: "Shared apartment", price: "KES 8,500", deposit: "Wi-Fi ready", image: apartmentImage },
];

const journey = [
  ["01", "Find your perfect home", "Start with the campus or area that works for you."],
  ["02", "Browse verified listings", "Compare clear prices, photos, and amenities."],
  ["03", "Pick a listing", "Choose the room that feels right for student life."],
  ["04", "Chat with an agent", "Message the verified contact directly."],
];

const trust = [
  { icon: ShieldCheck, title: "Verified Listings", copy: "Every listing and landlord is vetted before appearing on UniHub." },
  { icon: GraduationCap, title: "Renter-Focused", copy: "Housing selected for student routines, practical budgets, and short commutes." },
  { icon: MessageCircle, title: "Direct Contact", copy: "Use WhatsApp or email. No account required to find your next home." },
];

const campuses = ["University of Nairobi", "JKUAT", "Kenyatta University", "Moi University", "Egerton University", "Strathmore"];

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-highlight">{children}<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></a>;
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="cta-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><span>{children}</span><ArrowRight className="size-4" aria-hidden="true" /></a>;
}

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-background/65 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main navigation">
          <a href="#top" className="font-display text-xl font-medium tracking-normal" aria-label="UniHub home">Uni<span className="text-muted-foreground">Hub</span></a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#listings" className="nav-link">Listings</a><a href="#listings" className="nav-link">Hostels</a><a href="#trust" className="nav-link">About</a><a href="#contact" className="nav-link">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#listings" className="hidden min-h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 sm:inline-flex">Browse Listings</a>
            <a href="#listings" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground md:hidden" aria-label="Browse listings"><Menu className="size-4" aria-hidden="true" /></a>
          </div>
        </nav>
      </header>

      <main>
        <section id="top" className="relative flex min-h-[94svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-8">
          <img src={heroImage} alt="Modern student residences near a leafy Kenyan campus" width={1600} height={1008} className="hero-image absolute inset-0 h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0" aria-hidden="true" /><div className="noise absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8"><div className="max-w-4xl">
            <div className="reveal reveal-1 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-secondary-foreground backdrop-blur-xl"><ShieldCheck className="size-4" aria-hidden="true" />Verified student housing across Kenya</div>
            <h1 className="reveal reveal-2 max-w-4xl font-display text-5xl font-medium leading-[0.98] tracking-normal sm:text-7xl lg:text-[6.8rem]">Find your perfect home.</h1>
            <p className="reveal reveal-3 mt-7 max-w-2xl text-base leading-relaxed text-secondary-foreground sm:text-xl">Verified student hostels, bedsitters, and rentals near campus — without the scams.</p>
            <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-5"><PrimaryLink href="#listings">Browse Listings</PrimaryLink><ArrowLink href="#how-it-works">How it works</ArrowLink></div>
            <div className="reveal reveal-4 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm">
              <span className="flex items-center gap-2"><Check className="size-4 text-foreground" /> Verified landlords</span><span className="flex items-center gap-2"><Check className="size-4 text-foreground" /> No account to browse</span><span className="flex items-center gap-2"><Check className="size-4 text-foreground" /> Contact via WhatsApp</span>
            </div>
          </div></div>
        </section>

        <section id="how-it-works" className="section-shell border-y border-border bg-panel"><div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="section-heading"><p className="eyebrow">The simple way home</p><h2>From campus search to agent chat.</h2></div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">{journey.map(([number, title, copy]) => <li key={number} className="group min-h-64 bg-card p-7 transition-colors duration-500 hover:bg-accent md:p-8"><span className="font-display text-sm text-muted-foreground">{number}</span><h3 className="mt-16 font-display text-xl font-medium">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p></li>)}</ol>
        </div></section>

        <section id="trust" className="section-shell"><div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="section-heading max-w-3xl"><p className="eyebrow">Why UniHub</p><h2>Designed for students.<br />Built for trust.</h2><p>Less uncertainty, fewer dead ends, and no signup wall between you and a genuine place to live.</p></div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">{trust.map(({ icon: Icon, title, copy }) => <article key={title} className="glass-card group p-7 sm:p-9"><div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-accent transition-colors group-hover:bg-secondary"><Icon className="size-5" strokeWidth={1.7} aria-hidden="true" /></div><h3 className="mt-12 font-display text-2xl font-medium">{title}</h3><p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{copy}</p></article>)}</div>
        </div></section>

        <section id="listings" className="section-shell bg-panel"><div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex items-end justify-between gap-6"><div className="section-heading"><p className="eyebrow">Freshly verified</p><h2>Featured near campus</h2></div><div className="hidden sm:block"><ArrowLink href="/listings">View all listings</ArrowLink></div></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{listings.map((listing) => <article key={listing.title} className="listing-card group overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative aspect-[4/3] overflow-hidden"><img src={listing.image} alt={listing.title} width={1200} height={912} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /><span className="absolute left-4 top-4 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md">{listing.category}</span><span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-status px-3 py-1.5 text-xs font-semibold text-status-foreground"><span className="size-1.5 rounded-full bg-status-dot" /> Available</span></div>
            <div className="p-6"><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" /> {listing.location}</div><h3 className="mt-3 min-h-14 font-display text-xl font-medium leading-snug">{listing.title}</h3><div className="mt-6 flex items-end justify-between border-t border-border pt-5"><div><p className="font-display text-xl font-medium">{listing.price}<span className="text-sm text-muted-foreground"> / month</span></p><p className="mt-1 text-xs text-muted-foreground">{listing.deposit}</p></div><a href="/listings" aria-label={`View details for ${listing.title}`} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-accent transition-colors hover:bg-primary hover:text-primary-foreground"><ArrowRight className="size-4" aria-hidden="true" /></a></div></div>
          </article>)}</div><div className="mt-8 sm:hidden"><ArrowLink href="/listings">View all listings</ArrowLink></div>
        </div></section>

        <section id="locations" className="section-shell"><div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="section-heading"><p className="eyebrow">Popular areas</p><h2>Housing near your campus</h2><p>Explore student-friendly options around the places where campus life happens.</p><div className="mt-8 flex flex-wrap gap-2">{campuses.map((campus) => <span key={campus} className="campus-chip">{campus}</span>)}</div><div className="mt-9"><PrimaryLink href="/listings">Explore by location</PrimaryLink></div></div>
          <div className="map-card relative min-h-[28rem] overflow-hidden rounded-3xl border border-border bg-card">
            <div className="absolute left-[11%] top-[14%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">Nairobi</div><div className="absolute left-[42%] top-[31%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">Juja</div><div className="absolute right-[11%] top-[18%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">Thika</div><div className="absolute bottom-[18%] left-[19%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">Nakuru</div><div className="absolute bottom-[12%] right-[18%] rounded-full border border-border bg-background/85 px-4 py-2 text-xs backdrop-blur-md">Eldoret</div>
            <MapPin className="map-pin left-[36%] top-[19%]" /><MapPin className="map-pin right-[26%] top-[42%]" /><MapPin className="map-pin bottom-[31%] left-[43%]" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-border bg-background/80 p-4 backdrop-blur-xl"><div><p className="text-xs text-muted-foreground">Browse by campus</p><p className="mt-1 font-display font-medium">Verified places, closer to class.</p></div><div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><MapPin className="size-4" /></div></div>
          </div>
        </div></section>

        <section className="border-y border-border bg-foreground text-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div><p className="font-display text-4xl font-medium leading-tight sm:text-6xl lg:text-7xl">No more housing scams.</p><p className="mt-6 max-w-2xl text-base leading-relaxed text-background/65 sm:text-lg">Listings are checked before they go live. We verify property details and landlord or agent contacts so you can make your next move with more confidence.</p></div>
          <div className="grid grid-cols-3 gap-3 border-t border-background/15 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"><div><ShieldCheck className="size-5" /><p className="mt-4 text-sm font-semibold">Vetted listings</p></div><div><Building2 className="size-5" /><p className="mt-4 text-sm font-semibold">Campus focused</p></div><div><MessageCircle className="size-5" /><p className="mt-4 text-sm font-semibold">Direct contact</p></div></div>
        </div></section>

        <section className="section-shell bg-panel"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
          <div className="min-h-[26rem] overflow-hidden"><img src={heroImage} alt="Student residence ready to welcome new tenants" width={1600} height={1008} loading="lazy" className="h-full w-full object-cover object-right opacity-75 transition-transform duration-700 hover:scale-[1.03]" /></div>
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16"><p className="eyebrow">For landlords & agents</p><h2 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-5xl">List property. Reach students ready to move.</h2><ul className="mt-8 space-y-4 text-sm text-secondary-foreground"><li className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0" /> Earn a verified badge students can trust</li><li className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0" /> Receive direct WhatsApp and email leads</li><li className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0" /> Reach renters searching around your campus area</li></ul><div className="mt-9"><PrimaryLink href="/list-property">List your property</PrimaryLink></div></div>
        </div></section>

        <section className="relative overflow-hidden px-5 py-24 text-center md:px-8 md:py-36"><div className="cta-orb absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" /><div className="relative z-10 mx-auto max-w-4xl"><Sparkles className="mx-auto size-6 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" /><h2 className="mt-6 font-display text-4xl font-medium leading-tight sm:text-6xl lg:text-7xl">Your next home is already listed.</h2><div className="mt-9"><PrimaryLink href="/listings">Browse Listings</PrimaryLink></div><p className="mt-5 text-sm text-muted-foreground">Free to browse · Contact agents directly</p></div></section>
      </main>

      <footer id="contact" className="border-t border-border bg-panel"><div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><p className="font-display text-xl font-medium">Uni<span className="text-muted-foreground">Hub</span></p><p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Verified student housing near Kenyan campuses. Browse freely, then talk directly to the people listing it.</p><a href="https://wa.me/254700000000" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-highlight" aria-label="Contact UniHub support on WhatsApp"><MessageCircle className="size-4" /> WhatsApp support</a></div><FooterColumn title="Product" links={[["Listings", "/listings"], ["Hostels", "/listings"], ["Map", "#locations"]]} /><FooterColumn title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Become a partner", "/list-property"]]} /><FooterColumn title="Legal" links={[["Privacy", "#"], ["Terms", "#"], ["Email us", "mailto:hello@unihub.co.ke"]]} /></div>
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© 2026 UniHub — Premium student housing in Kenya</p><p className="flex items-center gap-2"><Mail className="size-3.5" /> hello@unihub.co.ke</p></div>
      </div></footer>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return <div><p className="text-sm font-semibold">{title}</p><ul className="mt-5 space-y-3">{links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a></li>)}</ul></div>;
}