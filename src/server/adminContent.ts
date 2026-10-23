/**
 * Administrator content, backed by SQLite.
 *
 * The admin console used to read these collections straight from Firestore,
 * which meant the screens were empty whenever the browser had no network —
 * and the offline build has no network at all. Everything here goes through
 * Prisma so the console shows the same rows as the rest of the app.
 *
 * The public shapes are the ones in `@/shared/types/admin`; snake_case and
 * JSON-string columns exist only at this boundary.
 */
import { prisma } from "@/server/db";
import { HttpError } from "@/server/authz";
import type {
  Agent,
  Category,
  Hostel,
  MediaItem,
  Property,
  University,
} from "@/shared/types/admin";

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function asString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `${field} is required.`);
  }
  return value.trim();
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asMedia(value: unknown): MediaItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is MediaItem =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as MediaItem).secure_url === "string",
  );
}

/* ------------------------------------------------------------------ agents */

type AgentRow = {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  profilePhotoUrl: string | null;
  isActive: boolean;
};

function agentOut(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    whatsappNumber: row.whatsappNumber,
    ...(row.profilePhotoUrl ? { profilePhotoURL: row.profilePhotoUrl } : {}),
    isActive: row.isActive,
  };
}

export async function listAgents(): Promise<Agent[]> {
  const rows = await prisma.agent.findMany({ orderBy: { name: "asc" } });
  return rows.map(agentOut);
}

export async function createAgent(body: Record<string, unknown>): Promise<Agent> {
  const row = await prisma.agent.create({
    data: {
      name: asString(body["name"], "Name"),
      phone: asString(body["phone"], "Phone"),
      whatsappNumber: asOptionalString(body["whatsappNumber"]) ?? asString(body["phone"], "Phone"),
      profilePhotoUrl: asOptionalString(body["profilePhotoURL"]) ?? null,
      isActive: asBoolean(body["isActive"], true),
    },
  });
  return agentOut(row);
}

export async function updateAgent(id: string, body: Record<string, unknown>): Promise<Agent> {
  const row = await prisma.agent.update({
    where: { id },
    data: {
      ...(body["name"] !== undefined ? { name: asString(body["name"], "Name") } : {}),
      ...(body["phone"] !== undefined ? { phone: asString(body["phone"], "Phone") } : {}),
      ...(body["whatsappNumber"] !== undefined
        ? { whatsappNumber: asString(body["whatsappNumber"], "WhatsApp number") }
        : {}),
      ...(body["profilePhotoURL"] !== undefined
        ? { profilePhotoUrl: asOptionalString(body["profilePhotoURL"]) ?? null }
        : {}),
      ...(body["isActive"] !== undefined ? { isActive: asBoolean(body["isActive"], true) } : {}),
    },
  });
  return agentOut(row);
}

/* -------------------------------------------------------------- categories */

export async function listCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.isActive,
    order: row.sortOrder,
  }));
}

export async function createCategory(body: Record<string, unknown>): Promise<Category> {
  const name = asString(body["name"], "Name");
  const slug = asOptionalString(body["slug"]) ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const row = await prisma.category.create({
    data: {
      name,
      slug,
      isActive: asBoolean(body["isActive"], true),
      sortOrder: asNumber(body["order"]) ?? 0,
    },
  });
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.isActive,
    order: row.sortOrder,
  };
}

export async function updateCategory(id: string, body: Record<string, unknown>): Promise<Category> {
  const row = await prisma.category.update({
    where: { id },
    data: {
      ...(body["name"] !== undefined ? { name: asString(body["name"], "Name") } : {}),
      ...(body["slug"] !== undefined ? { slug: asString(body["slug"], "Slug") } : {}),
      ...(body["isActive"] !== undefined ? { isActive: asBoolean(body["isActive"], true) } : {}),
      ...(body["order"] !== undefined ? { sortOrder: asNumber(body["order"]) ?? 0 } : {}),
    },
  });
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.isActive,
    order: row.sortOrder,
  };
}

/* -------------------------------------------------------------- properties */

type PropertyRow = {
  id: string;
  title: string;
  categoryId: string;
  price: number;
  deposit: number | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  features: string;
  agentId: string;
  status: string;
  media: string;
  createdAt: Date;
  updatedAt: Date;
};

function propertyOut(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    categoryId: row.categoryId,
    price: row.price,
    ...(row.deposit === null ? {} : { deposit: row.deposit }),
    location: row.location,
    ...(row.latitude === null || row.longitude === null
      ? {}
      : { coordinates: { lat: row.latitude, lng: row.longitude } }),
    description: row.description,
    features: parseJson<string[]>(row.features, []),
    agentId: row.agentId,
    status: row.status as Property["status"],
    media: parseJson<MediaItem[]>(row.media, []),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(propertyOut);
}

export async function getProperty(id: string): Promise<Property | null> {
  const row = await prisma.property.findUnique({ where: { id } });
  return row ? propertyOut(row) : null;
}

export async function createProperty(body: Record<string, unknown>): Promise<Property> {
  const coordinates = (body["coordinates"] ?? {}) as { lat?: unknown; lng?: unknown };
  const row = await prisma.property.create({
    data: {
      title: asString(body["title"], "Title"),
      categoryId: asString(body["categoryId"], "Category"),
      price: asNumber(body["price"]) ?? 0,
      deposit: asNumber(body["deposit"]) ?? null,
      location: asString(body["location"], "Location"),
      latitude: asNumber(coordinates.lat) ?? null,
      longitude: asNumber(coordinates.lng) ?? null,
      description: asOptionalString(body["description"]) ?? "",
      features: JSON.stringify(asStringArray(body["features"])),
      agentId: asOptionalString(body["agentId"]) ?? "",
      status: asOptionalString(body["status"]) ?? "available",
      media: JSON.stringify(asMedia(body["media"])),
    },
  });
  return propertyOut(row);
}

export async function updateProperty(id: string, body: Record<string, unknown>): Promise<Property> {
  const coordinates = body["coordinates"] as { lat?: unknown; lng?: unknown } | undefined;
  const row = await prisma.property.update({
    where: { id },
    data: {
      ...(body["title"] !== undefined ? { title: asString(body["title"], "Title") } : {}),
      ...(body["categoryId"] !== undefined
        ? { categoryId: asString(body["categoryId"], "Category") }
        : {}),
      ...(body["price"] !== undefined ? { price: asNumber(body["price"]) ?? 0 } : {}),
      ...(body["deposit"] !== undefined ? { deposit: asNumber(body["deposit"]) ?? null } : {}),
      ...(body["location"] !== undefined
        ? { location: asString(body["location"], "Location") }
        : {}),
      ...(coordinates?.lat !== undefined ? { latitude: asNumber(coordinates.lat) ?? null } : {}),
      ...(coordinates?.lng !== undefined ? { longitude: asNumber(coordinates.lng) ?? null } : {}),
      ...(body["description"] !== undefined
        ? { description: asOptionalString(body["description"]) ?? "" }
        : {}),
      ...(body["features"] !== undefined
        ? { features: JSON.stringify(asStringArray(body["features"])) }
        : {}),
      ...(body["agentId"] !== undefined
        ? { agentId: asOptionalString(body["agentId"]) ?? "" }
        : {}),
      ...(body["status"] !== undefined
        ? { status: asOptionalString(body["status"]) ?? "available" }
        : {}),
      ...(body["media"] !== undefined ? { media: JSON.stringify(asMedia(body["media"])) } : {}),
    },
  });
  return propertyOut(row);
}

/* ------------------------------------------------------------ universities */

type UniversityRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  location: string;
  contactEmail: string | null;
  contactPhone: string | null;
  description: string;
  verified: boolean;
  adminUserId: string | null;
  status: string;
  foundedYear: number | null;
  studentCount: number | null;
  createdAt: Date;
  updatedAt: Date;
};

function universityOut(row: UniversityRow): University {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ...(row.logoUrl ? { logo_url: row.logoUrl } : {}),
    location: row.location,
    ...(row.contactEmail ? { contact_email: row.contactEmail } : {}),
    ...(row.contactPhone ? { contact_phone: row.contactPhone } : {}),
    description: row.description,
    verified: row.verified,
    ...(row.adminUserId ? { admin_user_id: row.adminUserId } : {}),
    status: row.status === "inactive" ? "inactive" : "active",
    metadata: {
      ...(row.foundedYear === null ? {} : { founded_year: row.foundedYear }),
      ...(row.studentCount === null ? {} : { student_count: row.studentCount }),
    },
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listUniversities(): Promise<University[]> {
  const rows = await prisma.university.findMany({ orderBy: { name: "asc" } });
  return rows.map(universityOut);
}

export async function createUniversity(body: Record<string, unknown>): Promise<University> {
  const name = asString(body["name"], "Name");
  const metadata = (body["metadata"] ?? {}) as { founded_year?: unknown; student_count?: unknown };
  const row = await prisma.university.create({
    data: {
      name,
      slug: asOptionalString(body["slug"]) ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      logoUrl: asOptionalString(body["logo_url"]) ?? null,
      location: asOptionalString(body["location"]) ?? "",
      contactEmail: asOptionalString(body["contact_email"]) ?? null,
      contactPhone: asOptionalString(body["contact_phone"]) ?? null,
      description: asOptionalString(body["description"]) ?? "",
      verified: asBoolean(body["verified"]),
      adminUserId: asOptionalString(body["admin_user_id"]) ?? null,
      status: asOptionalString(body["status"]) ?? "active",
      foundedYear: asNumber(metadata.founded_year) ?? null,
      studentCount: asNumber(metadata.student_count) ?? null,
    },
  });
  return universityOut(row);
}

export async function updateUniversity(
  id: string,
  body: Record<string, unknown>,
): Promise<University> {
  const metadata = (body["metadata"] ?? {}) as { founded_year?: unknown; student_count?: unknown };
  const row = await prisma.university.update({
    where: { id },
    data: {
      ...(body["name"] !== undefined ? { name: asString(body["name"], "Name") } : {}),
      ...(body["slug"] !== undefined ? { slug: asString(body["slug"], "Slug") } : {}),
      ...(body["logo_url"] !== undefined
        ? { logoUrl: asOptionalString(body["logo_url"]) ?? null }
        : {}),
      ...(body["location"] !== undefined
        ? { location: asOptionalString(body["location"]) ?? "" }
        : {}),
      ...(body["contact_email"] !== undefined
        ? { contactEmail: asOptionalString(body["contact_email"]) ?? null }
        : {}),
      ...(body["contact_phone"] !== undefined
        ? { contactPhone: asOptionalString(body["contact_phone"]) ?? null }
        : {}),
      ...(body["description"] !== undefined
        ? { description: asOptionalString(body["description"]) ?? "" }
        : {}),
      ...(body["verified"] !== undefined ? { verified: asBoolean(body["verified"]) } : {}),
      ...(body["admin_user_id"] !== undefined
        ? { adminUserId: asOptionalString(body["admin_user_id"]) ?? null }
        : {}),
      ...(body["status"] !== undefined ? { status: asString(body["status"], "Status") } : {}),
      ...(metadata.founded_year !== undefined
        ? { foundedYear: asNumber(metadata.founded_year) ?? null }
        : {}),
      ...(metadata.student_count !== undefined
        ? { studentCount: asNumber(metadata.student_count) ?? null }
        : {}),
    },
  });
  return universityOut(row);
}

/* ----------------------------------------------------------------- hostels */

type HostelRow = {
  id: string;
  universityId: string;
  name: string;
  location: string;
  description: string;
  hostelType: string;
  images: string;
  amenities: string;
  wardenName: string | null;
  wardenPhone: string | null;
  wardenEmail: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

function hostelOut(row: HostelRow): Hostel {
  return {
    id: row.id,
    universityId: row.universityId,
    name: row.name,
    location: row.location,
    description: row.description,
    hostel_type: row.hostelType as Hostel["hostel_type"],
    images: parseJson<MediaItem[]>(row.images, []),
    amenities: parseJson<string[]>(row.amenities, []),
    ...(row.wardenName ? { warden_name: row.wardenName } : {}),
    ...(row.wardenPhone ? { warden_phone: row.wardenPhone } : {}),
    ...(row.wardenEmail ? { warden_email: row.wardenEmail } : {}),
    status: row.status === "inactive" ? "inactive" : "active",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listHostels(universityId?: string): Promise<Hostel[]> {
  const rows = await prisma.hostel.findMany({
    ...(universityId ? { where: { universityId } } : {}),
    orderBy: { name: "asc" },
  });
  return rows.map(hostelOut);
}

export async function createHostel(body: Record<string, unknown>): Promise<Hostel> {
  const row = await prisma.hostel.create({
    data: {
      universityId: asString(body["universityId"], "University"),
      name: asString(body["name"], "Name"),
      location: asOptionalString(body["location"]) ?? "",
      description: asOptionalString(body["description"]) ?? "",
      hostelType: asOptionalString(body["hostel_type"]) ?? "mixed",
      images: JSON.stringify(asMedia(body["images"])),
      amenities: JSON.stringify(asStringArray(body["amenities"])),
      wardenName: asOptionalString(body["warden_name"]) ?? null,
      wardenPhone: asOptionalString(body["warden_phone"]) ?? null,
      wardenEmail: asOptionalString(body["warden_email"]) ?? null,
      status: asOptionalString(body["status"]) ?? "active",
    },
  });
  return hostelOut(row);
}

export async function updateHostel(id: string, body: Record<string, unknown>): Promise<Hostel> {
  const row = await prisma.hostel.update({
    where: { id },
    data: {
      ...(body["universityId"] !== undefined
        ? { universityId: asString(body["universityId"], "University") }
        : {}),
      ...(body["name"] !== undefined ? { name: asString(body["name"], "Name") } : {}),
      ...(body["location"] !== undefined
        ? { location: asOptionalString(body["location"]) ?? "" }
        : {}),
      ...(body["description"] !== undefined
        ? { description: asOptionalString(body["description"]) ?? "" }
        : {}),
      ...(body["hostel_type"] !== undefined
        ? { hostelType: asOptionalString(body["hostel_type"]) ?? "mixed" }
        : {}),
      ...(body["images"] !== undefined ? { images: JSON.stringify(asMedia(body["images"])) } : {}),
      ...(body["amenities"] !== undefined
        ? { amenities: JSON.stringify(asStringArray(body["amenities"])) }
        : {}),
      ...(body["warden_name"] !== undefined
        ? { wardenName: asOptionalString(body["warden_name"]) ?? null }
        : {}),
      ...(body["warden_phone"] !== undefined
        ? { wardenPhone: asOptionalString(body["warden_phone"]) ?? null }
        : {}),
      ...(body["warden_email"] !== undefined
        ? { wardenEmail: asOptionalString(body["warden_email"]) ?? null }
        : {}),
      ...(body["status"] !== undefined ? { status: asString(body["status"], "Status") } : {}),
    },
  });
  return hostelOut(row);
}

/* ---------------------------------------------------------------- settings */

export interface SiteSettingsView {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  updatedAt?: string;
}

export async function getAdminSettings(): Promise<SiteSettingsView> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  if (!row) {
    return {
      siteName: "UniHub",
      siteUrl: "",
      adminEmail: "",
      maintenanceMode: false,
      maintenanceMessage: "We are currently performing scheduled maintenance.",
      heroTitle: "",
      heroSubtitle: "",
      ctaText: "",
    };
  }
  return {
    siteName: row.siteName,
    siteUrl: row.siteUrl,
    adminEmail: row.adminEmail,
    maintenanceMode: row.maintenanceMode,
    maintenanceMessage: row.maintenanceMessage,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    ctaText: row.ctaText,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function updateAdminSettings(
  body: Record<string, unknown>,
): Promise<SiteSettingsView> {
  const current = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  const data = {
    siteName: asOptionalString(body["siteName"]) ?? current?.siteName ?? "UniHub",
    siteUrl: typeof body["siteUrl"] === "string" ? body["siteUrl"] : (current?.siteUrl ?? ""),
    adminEmail:
      typeof body["adminEmail"] === "string" ? body["adminEmail"] : (current?.adminEmail ?? ""),
    maintenanceMode: asBoolean(body["maintenanceMode"], current?.maintenanceMode ?? false),
    maintenanceMessage:
      asOptionalString(body["maintenanceMessage"]) ??
      current?.maintenanceMessage ??
      "We are currently performing scheduled maintenance.",
  };

  if (current) {
    await prisma.siteSettings.update({ where: { id: "global" }, data });
  } else {
    await prisma.siteSettings.create({
      data: {
        id: "global",
        ...data,
        heroTitle: "Find student housing near your campus",
        heroSubtitle: "Verified hostels, bedsitters and apartments across Kenya.",
        ctaText: "Browse listings",
      },
    });
  }

  return getAdminSettings();
}
