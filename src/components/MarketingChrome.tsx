import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Menu, MessageCircle, X } from "lucide-react";

export const WHATSAPP_URL =
  "https://wa.me/254700000000?text=Hi%20UniHub%2C%20I%27d%20like%20help%20finding%20verified%20student%20housing";

const NAV_LINKS = [
  { label: "Listings", to: "/listings" },
  { label: "Hostels", to: "/listings" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

function Wordmark() {
  return (
    <Link
      to="/"
      className="font-display text-xl font-medium tracking-normal"
      aria-label="UniHub home"
    >
      Uni<span className="text-muted-foreground">Hub</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-background/65 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8"
        aria-label="Main navigation"
      >
        <Wordmark />

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/listings"
            className="hidden min-h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Browse Listings
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-foreground hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/listings"
              className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
              onClick={() => setOpen(false)}
            >
              Browse Listings
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-panel">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Verified student housing near Kenyan campuses. Browse freely, then
              talk directly to the people listing it.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-highlight"
              aria-label="Contact UniHub support on WhatsApp"
            >
              <MessageCircle className="size-4" /> WhatsApp support
            </a>
          </div>
          <FooterColumn
            title="Product"
            links={[
              ["Listings", "/listings"],
              ["Hostels", "/listings"],
              ["Map", "/#locations"],
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Become a partner", "/list-property"],
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Email us", "/contact"],
            ]}
          />
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 UniHub — Premium student housing in Kenya</p>
          <p className="flex items-center gap-2">
            <Mail className="size-3.5" /> hello@unihub.ke
          </p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">{children}</main>
      <SiteFooter />
    </div>
  );
}
