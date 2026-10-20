import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { MarketingShell } from "@/shared/components/MarketingChrome";
import { reportError } from "@/infrastructure/error-reporting";
import { useOnlineRefresh } from "@/shared/hooks/useOnlineRefresh";
import PwaBridge from "@/shared/components/PwaBridge";
import InstallAppButton from "@/shared/components/InstallAppButton";

function NotFoundComponent() {
  // The root head has no title of its own, so an unknown URL used to open a
  // blank tab title alongside a chrome-less dead end.
  useEffect(() => {
    document.title = "Page not found · UniHub";
  }, []);

  return (
    <MarketingShell>
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-16 md:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          The link may be out of date, or the listing behind it has been taken. Everything below is
          live and reachable.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/listings"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
          >
            Browse listings
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-accent px-5 text-sm font-semibold text-foreground"
          >
            Contact the team
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Home
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

function ErrorComponent({ error, reset }: { error: any; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset?.();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "UniHub · Verified student housing in Kenya" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0A0A0A" },
      { name: "author", content: "UniHub" },
      { property: "og:site_name", content: "UniHub" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "apple-touch-icon",
        href: "/pwa/apple-touch-icon.png",
        sizes: "180x180",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function CmsTheme() {
  const onlineTick = useOnlineRefresh();
  useEffect(() => {
    let live = true;
    import("@/shared/services/firestore")
      .then(async (m) => {
        try {
          const settings = await m.getSiteSettings();
          if (!live || !settings?.theme) return;
          const root = document.documentElement;
          const theme = settings.theme as any;
          if (theme.primaryColor) root.style.setProperty("--color-brand-500", theme.primaryColor);
          if (theme.backgroundColor) root.style.setProperty("--color-surface-900", theme.backgroundColor);
          if (theme.surfaceColor) root.style.setProperty("--color-surface-800", theme.surfaceColor);
          if (theme.fontFamily) root.style.setProperty("--CMS-font-family", `"${theme.fontFamily}", sans-serif`);
          if (theme.borderRadius) root.style.setProperty("--CMS-border-radius", theme.borderRadius);
        } catch {
          // offline or no CMS settings — keep default theme
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [onlineTick]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CmsTheme />
      <PwaBridge />
      <InstallAppButton />
      <Outlet />
    </QueryClientProvider>
  );
}