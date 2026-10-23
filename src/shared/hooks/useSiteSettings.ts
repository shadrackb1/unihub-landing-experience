import { useEffect, useState } from "react";

/**
 * The site content published from the admin site builder.
 *
 * `updatedAt` is null until an administrator saves something, which is how the
 * pages know to fall back to the copy they shipped with (and the theme loader
 * knows not to repaint the design system with default CMS tokens).
 */
export type SiteSettingsData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  ctaText?: string;
  featuredProperties?: string[];
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    surfaceColor?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
  features?: { enableBlog?: boolean };
  teamMembers?: { name: string; role: string; photoUrl: string }[];
  updatedAt?: string | null;
  updatedBy?: string | null;
};

// One shared fetch per page load: every consumer (homepage hero, About team,
// theme) hits the API once. Failures resolve to null so marketing pages keep
// their static defaults instead of erroring.
let cached: Promise<SiteSettingsData | null> | null = null;

export async function fetchSiteSettings(): Promise<SiteSettingsData | null> {
  const response = await fetch("/api/site-settings", {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Site settings request failed with ${response.status}`);
  }
  const payload = (await response.json()) as { settings?: SiteSettingsData };
  return payload.settings ?? null;
}

function loadSiteSettings(): Promise<SiteSettingsData | null> {
  cached ??= fetchSiteSettings().catch((error) => {
    console.warn("Site settings unavailable, using defaults:", error);
    cached = null;
    return null;
  });
  return cached;
}

/** Drop the page-load cache (used after the CMS saves). */
export function invalidateSiteSettings(): void {
  cached = null;
}

export function useSiteSettings(): SiteSettingsData | null {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    let live = true;
    void loadSiteSettings().then((data) => {
      if (live) setSettings(data);
    });
    return () => {
      live = false;
    };
  }, []);

  return settings;
}
