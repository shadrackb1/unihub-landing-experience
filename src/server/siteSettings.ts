/**
 * Site content managed from the admin site builder.
 *
 * One row (`global`) holds everything the public site reads from the CMS:
 * hero copy, featured listings, theme tokens, feature flags and team members.
 * JSON columns keep the stored shape identical to the `SiteSettingsData` type
 * the marketing pages consume, so the CMS, the API and the pages cannot drift.
 *
 * Reads never fail because a row is missing: the defaults below are the copy
 * the site shipped with, so a fresh install renders exactly as before anyone
 * presses Save.
 */
import { prisma } from "@/server/db";
import { HttpError } from "@/server/authz";

export interface SiteTheme {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderRadius: string;
  fontFamily: string;
}

export interface SiteTeamMember {
  name: string;
  role: string;
  photoUrl: string;
}

export interface SiteSettingsData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  ctaText: string;
  featuredProperties: string[];
  theme: SiteTheme;
  features: { enableBlog: boolean };
  teamMembers: SiteTeamMember[];
  updatedAt: string | null;
  updatedBy: string | null;
}

export const DEFAULT_THEME: SiteTheme = {
  primaryColor: "#c6f24e",
  backgroundColor: "#0d0d0f",
  surfaceColor: "#17171a",
  borderRadius: "1.5rem",
  fontFamily: "Inter",
};

export const FONT_OPTIONS = ["Inter", "Space Grotesk", "Poppins", "Roboto", "Nunito"] as const;

export const RADIUS_OPTIONS = [
  "0rem",
  "0.25rem",
  "0.5rem",
  "0.75rem",
  "1rem",
  "1.5rem",
  "2rem",
] as const;

export const DEFAULT_SETTINGS: SiteSettingsData = {
  heroTitle: "Find your perfect home.",
  heroSubtitle:
    "Browse verified hostels, bedsitters, and rentals near campus. Message landlords on WhatsApp. No account needed to search.",
  heroImage: "",
  ctaText: "Browse Listings",
  featuredProperties: [],
  theme: DEFAULT_THEME,
  features: { enableBlog: false },
  teamMembers: [],
  updatedAt: null,
  updatedBy: null,
};

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

function isUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Copy over the input limits the CMS form also enforces client-side. */
function bounded(value: string, limit: number, label: string): string {
  if (value.length > limit) {
    throw new HttpError(400, `${label} must be ${limit} characters or fewer.`);
  }
  return value;
}

function sanitiseTheme(value: unknown): SiteTheme {
  const input = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const theme: SiteTheme = {
    primaryColor: text(input["primaryColor"], DEFAULT_THEME.primaryColor),
    backgroundColor: text(input["backgroundColor"], DEFAULT_THEME.backgroundColor),
    surfaceColor: text(input["surfaceColor"], DEFAULT_THEME.surfaceColor),
    borderRadius: text(input["borderRadius"], DEFAULT_THEME.borderRadius),
    fontFamily: text(input["fontFamily"], DEFAULT_THEME.fontFamily),
  };

  for (const [key, colour] of [
    ["Primary colour", theme.primaryColor],
    ["Background colour", theme.backgroundColor],
    ["Surface colour", theme.surfaceColor],
  ] as const) {
    if (!isHexColor(colour)) {
      throw new HttpError(400, `${key} must be a hex colour such as #c6f24e.`);
    }
  }

  if (!(RADIUS_OPTIONS as readonly string[]).includes(theme.borderRadius)) {
    throw new HttpError(400, "Choose one of the available corner radii.");
  }
  if (!(FONT_OPTIONS as readonly string[]).includes(theme.fontFamily)) {
    throw new HttpError(400, "Choose one of the available fonts.");
  }
  return theme;
}

function sanitiseTeam(value: unknown): SiteTeamMember[] {
  if (!Array.isArray(value)) return [];
  if (value.length > 12) {
    throw new HttpError(400, "The team section holds at most 12 people.");
  }
  return value.map((entry, index) => {
    const member = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const name = bounded(text(member["name"], ""), 80, `Team member ${index + 1} name`);
    const role = bounded(text(member["role"], ""), 80, `Team member ${index + 1} role`);
    const photoUrl = text(member["photoUrl"], "");
    if (!name) {
      throw new HttpError(400, `Team member ${index + 1} needs a name.`);
    }
    if (!isUrl(photoUrl)) {
      throw new HttpError(
        400,
        `Team member ${index + 1} photo must be a full http(s) image URL, or left blank.`,
      );
    }
    return { name, role, photoUrl };
  });
}

function sanitiseFeatured(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (ids.length > 12) {
    throw new HttpError(400, "Feature at most 12 listings.");
  }
  for (const id of ids) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
      throw new HttpError(400, `"${id}" is not a listing id.`);
    }
  }
  return [...new Set(ids)];
}

function toPayload(row: {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string | null;
  ctaText: string;
  featuredProperties: string;
  theme: string;
  features: string;
  teamMembers: string;
  updatedAt: Date;
  updatedBy: string | null;
}): SiteSettingsData {
  const features = parseJson<{ enableBlog?: unknown }>(row.features, {});
  return {
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    heroImage: row.heroImage ?? "",
    ctaText: row.ctaText,
    featuredProperties: parseJson<string[]>(row.featuredProperties, []),
    theme: { ...DEFAULT_THEME, ...parseJson<Partial<SiteTheme>>(row.theme, {}) },
    features: { enableBlog: features.enableBlog === true },
    teamMembers: parseJson<SiteTeamMember[]>(row.teamMembers, []),
    updatedAt: row.updatedAt.toISOString(),
    updatedBy: row.updatedBy,
  };
}

/** The published site content, or the shipped defaults when nothing is saved. */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  if (!row) return DEFAULT_SETTINGS;
  return toPayload(row);
}

/** Validate and persist the CMS form. Administrator only at the route. */
export async function saveSiteSettings(
  input: unknown,
  updatedBy: string | null,
): Promise<SiteSettingsData> {
  const body = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  const heroTitle = bounded(text(body["heroTitle"], DEFAULT_SETTINGS.heroTitle), 90, "Hero title");
  const heroSubtitle = bounded(
    text(body["heroSubtitle"], DEFAULT_SETTINGS.heroSubtitle),
    220,
    "Hero subtitle",
  );
  const heroImage = bounded(text(body["heroImage"], ""), 500, "Hero image URL");
  if (!isUrl(heroImage)) {
    throw new HttpError(400, "The hero image must be a full http(s) URL, or left blank.");
  }
  const ctaText = bounded(text(body["ctaText"], DEFAULT_SETTINGS.ctaText), 40, "Button text");

  const featuresInput = (
    body["features"] && typeof body["features"] === "object" ? body["features"] : {}
  ) as Record<string, unknown>;

  const data = {
    heroTitle,
    heroSubtitle,
    heroImage: heroImage || null,
    ctaText,
    featuredProperties: JSON.stringify(sanitiseFeatured(body["featuredProperties"])),
    theme: JSON.stringify(sanitiseTheme(body["theme"])),
    features: JSON.stringify({ enableBlog: featuresInput["enableBlog"] === true }),
    teamMembers: JSON.stringify(sanitiseTeam(body["teamMembers"])),
    updatedBy,
  };

  const row = await prisma.siteSettings.upsert({
    where: { id: "global" },
    create: { id: "global", ...data },
    update: data,
  });

  return toPayload(row);
}
