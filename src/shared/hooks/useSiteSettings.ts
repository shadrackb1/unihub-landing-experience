import { useEffect, useState } from "react";
import { getSiteSettings } from "@/shared/services/firestore";

export type SiteSettingsData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  ctaText?: string;
  featuredProperties?: string[];
  theme?: Record<string, string>;
  features?: { enableBlog?: boolean };
  teamMembers?: { name: string; role: string; photoUrl: string }[];
  [key: string]: any;
};

// One shared fetch per page load: every consumer (homepage hero, About team,
// etc.) hits Firestore once. Failures resolve to null so marketing pages keep
// their static defaults instead of erroring.
let cached: Promise<SiteSettingsData | null> | null = null;

function loadSiteSettings(): Promise<SiteSettingsData | null> {
  cached ??= getSiteSettings().catch((error) => {
    console.warn("Site settings unavailable, using defaults:", error);
    cached = null;
    return null;
  });
  return cached;
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
