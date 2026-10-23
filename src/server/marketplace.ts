/**
 * Landlord listings, listing moderation, boost requests and landlord vetting.
 *
 * Everything here reads and writes the Prisma database. The screens used to
 * call Firestore directly, against a project that is not reachable from this
 * deployment, so the dashboard could only ever show a connection error. These
 * functions keep the same shapes the screens already consume — lowercase
 * statuses, prices in KES — while the database stores cents and enum values.
 *
 * Ownership rules enforced here, not in the browser:
 *   - A landlord only ever sees and edits their own listings.
 *   - Only an APPROVED landlord can create a listing; a new listing starts as
 *     PENDING and is invisible to students until an administrator publishes it.
 *   - Moderation, featuring and boost approval require the ADMIN role at the
 *     route, and are never accepted from a landlord request.
 */
import { prisma } from "@/server/db";
import { HttpError } from "@/server/authz";

export type ListingStatusValue = "pending" | "published" | "rejected" | "hidden";
export type LandlordStatusValue = "pending" | "approved" | "rejected" | "suspended";

export interface MarketListingRow {
  id: string;
  title: string;
  type: string;
  category: string;
  campus: string;
  location: string;
  price: number;
  deposit: number;
  description: string;
  amenities: string[];
  images: string[];
  landlordName: string;
  ownerUid: string;
  landlordId: string;
  inquiries: number;
  status: ListingStatusValue;
  adStatus: "live" | "requested" | "expired" | "inactive";
  adPlan?: string;
  adExpiresAt?: string;
  featured: boolean;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandlordRow {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  whatsapp: string;
  idNumber: string;
  areas: string;
  propertyCount: number;
  status: LandlordStatusValue;
  reviewNote: string;
}

const STATUS_TO_DB = {
  pending: "PENDING",
  published: "PUBLISHED",
  rejected: "REJECTED",
  hidden: "HIDDEN",
} as const;

const STATUS_FROM_DB: Record<string, ListingStatusValue> = {
  PENDING: "pending",
  PUBLISHED: "published",
  REJECTED: "rejected",
  HIDDEN: "hidden",
  AVAILABLE: "published",
  RENTED: "hidden",
};

const LANDLORD_FROM_DB: Record<string, LandlordStatusValue> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

const LANDLORD_TO_DB = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
  suspended: "SUSPENDED",
} as const;

const CATEGORY_FROM_TYPE: Record<string, string> = {
  bedsitter: "BEDSITTER",
  studio: "STUDIO",
  "single room": "SINGLE_ROOM",
  hostel: "HOSTEL",
  "one bedroom": "SHARED_APARTMENT",
  "two bedroom": "SHARED_APARTMENT",
  "three bedroom": "SHARED_APARTMENT",
  apartment: "SHARED_APARTMENT",
};

const TYPE_FROM_CATEGORY: Record<string, string> = {
  BEDSITTER: "Bedsitter",
  STUDIO: "Studio",
  SINGLE_ROOM: "Single room",
  HOSTEL: "Hostel",
  SHARED_APARTMENT: "Apartment",
};

const AD_PLAN_DAYS: Record<string, number> = {
  free: 7,
  basic: 14,
  pro: 30,
  premium: 90,
  week: 7,
  fortnight: 14,
  month: 30,
};

function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function toRow(row: {
  id: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  category: string;
  location: string;
  university: string | null;
  images: string;
  amenities: string;
  status: string;
  isVerified: boolean;
  reviewNote: string | null;
  featured: boolean;
  inquiries: number;
  adStatus: string;
  adPlan: string | null;
  adExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  landlordId: string;
  landlord: { businessName: string; user: { id: string; name: string | null } };
}): MarketListingRow {
  return {
    id: row.id,
    title: row.title,
    type: TYPE_FROM_CATEGORY[row.category] ?? row.category,
    category: row.category,
    campus: row.university ?? "",
    location: row.location,
    price: Math.round(row.price / 100),
    deposit: Math.round(row.deposit / 100),
    description: row.description,
    amenities: parseList(row.amenities),
    images: parseList(row.images),
    landlordName: row.landlord.user.name ?? row.landlord.businessName,
    ownerUid: row.landlord.user.id,
    landlordId: row.landlordId,
    inquiries: row.inquiries,
    status: STATUS_FROM_DB[row.status] ?? "hidden",
    adStatus: (["live", "requested", "expired", "inactive"].includes(row.adStatus)
      ? row.adStatus
      : "inactive") as MarketListingRow["adStatus"],
    ...(row.adPlan ? { adPlan: row.adPlan } : {}),
    ...(row.adExpiresAt ? { adExpiresAt: row.adExpiresAt.toISOString() } : {}),
    featured: row.featured,
    ...(row.reviewNote ? { reviewNote: row.reviewNote } : {}),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const LISTING_INCLUDE = {
  landlord: { select: { businessName: true, user: { select: { id: true, name: true } } } },
} as const;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function landlordFor(userId: string): Promise<{ id: string; status: string }> {
  const profile = await prisma.landlordProfile.findUnique({
    where: { userId },
    select: { id: true, status: true },
  });
  if (!profile) {
    throw new HttpError(403, "This account has no landlord profile, so it cannot manage listings.");
  }
  return profile;
}

export async function listLandlordListings(userId: string): Promise<MarketListingRow[]> {
  const profile = await landlordFor(userId);
  const rows = await prisma.listing.findMany({
    where: { landlordId: profile.id },
    include: LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toRow);
}

export async function createListing(
  userId: string,
  input: {
    title: string;
    campus: string;
    location: string;
    type: string;
    price: number;
    deposit: number;
    description: string;
    amenities: string[];
    images: string[];
    landlordName?: string | undefined;
  },
): Promise<string> {
  const profile = await landlordFor(userId);
  if (profile.status !== "APPROVED") {
    throw new HttpError(
      403,
      "Only an approved landlord can add a listing. Your application is still being reviewed.",
    );
  }

  const title = clean(input.title);
  const location = clean(input.location);
  const campus = clean(input.campus);
  const description = clean(input.description);
  const type = clean(input.type);

  if (title.length < 5 || title.length > 120) {
    throw new HttpError(400, "Give the listing a title of 5 to 120 characters.");
  }
  if (!location) throw new HttpError(400, "Enter the specific location of the property.");
  if (!campus) throw new HttpError(400, "Choose the campus or town the property serves.");
  if (!type) throw new HttpError(400, "Choose the property type.");
  if (!Number.isFinite(input.price) || input.price < 1000) {
    throw new HttpError(400, "Enter the monthly rent in KES (at least 1,000).");
  }
  if (!Number.isFinite(input.deposit) || input.deposit < 0) {
    throw new HttpError(400, "Enter the deposit in KES, or leave it at zero.");
  }
  if (description.length < 40) {
    throw new HttpError(400, "Describe the property in at least 40 characters.");
  }

  const category = CATEGORY_FROM_TYPE[type.toLowerCase()] ?? "BEDSITTER";
  const images = Array.isArray(input.images) ? input.images.filter(Boolean).slice(0, 10) : [];
  const amenities = Array.isArray(input.amenities)
    ? input.amenities.filter(Boolean).slice(0, 20)
    : [];

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price: Math.round(input.price * 100),
      deposit: Math.round(input.deposit * 100),
      category: category as never,
      location,
      university: campus,
      images: JSON.stringify(images),
      amenities: JSON.stringify(amenities),
      status: "PENDING",
      isVerified: false,
      landlordId: profile.id,
      userId,
    },
    select: { id: true },
  });
  return listing.id;
}

async function ownedListing(userId: string, id: string) {
  const profile = await landlordFor(userId);
  const listing = await prisma.listing.findFirst({
    where: { id, landlordId: profile.id },
    select: { id: true, status: true },
  });
  if (!listing) {
    throw new HttpError(404, "That listing is not on your account.");
  }
  return listing;
}

export async function deleteListing(userId: string, id: string): Promise<void> {
  await ownedListing(userId, id);
  await prisma.listing.delete({ where: { id } });
}

export async function updateListingStatus(
  userId: string,
  id: string,
  status: "published" | "hidden",
): Promise<void> {
  const listing = await ownedListing(userId, id);
  if (listing.status === "PENDING" || listing.status === "REJECTED") {
    throw new HttpError(
      403,
      "A listing that is awaiting review or was rejected cannot be published from the portal.",
    );
  }
  await prisma.listing.update({
    where: { id },
    data: { status: status === "published" ? "PUBLISHED" : "HIDDEN" },
  });
}

export async function requestAd(userId: string, id: string, planId: string): Promise<void> {
  if (!AD_PLAN_DAYS[planId]) {
    throw new HttpError(400, "Choose one of the available boost plans.");
  }
  await ownedListing(userId, id);
  await prisma.listing.update({
    where: { id },
    data: { adStatus: "requested", adPlan: planId, adExpiresAt: null },
  });
}

export async function listAllListings(): Promise<MarketListingRow[]> {
  const rows = await prisma.listing.findMany({
    include: LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toRow);
}

export async function moderateListing(
  id: string,
  status: ListingStatusValue,
  note?: string,
): Promise<void> {
  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });
  if (!listing) throw new HttpError(404, "That listing does not exist.");
  await prisma.listing.update({
    where: { id },
    data: {
      status: STATUS_TO_DB[status] as never,
      isVerified: status === "published",
      ...(note === undefined ? {} : { reviewNote: note }),
    },
  });
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });
  if (!listing) throw new HttpError(404, "That listing does not exist.");
  await prisma.listing.update({ where: { id }, data: { featured } });
}

export async function reviewAd(id: string, approved: boolean): Promise<void> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { id: true, adPlan: true },
  });
  if (!listing) throw new HttpError(404, "That listing does not exist.");

  if (!approved) {
    await prisma.listing.update({
      where: { id },
      data: { adStatus: "inactive", adPlan: null, adExpiresAt: null },
    });
    return;
  }

  const days = AD_PLAN_DAYS[listing.adPlan ?? ""] ?? 7;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  await prisma.listing.update({
    where: { id },
    data: { adStatus: "live", adExpiresAt: expires },
  });
}

export async function listLandlords(): Promise<LandlordRow[]> {
  const rows = await prisma.landlordProfile.findMany({
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows
    .map((row) => ({
      id: row.id,
      fullName: row.user.name ?? "",
      businessName: row.businessName,
      email: row.user.email,
      phone: row.phone,
      whatsapp: row.whatsappNumber,
      idNumber: row.nationalId ?? "",
      areas: parseList(row.targetCampuses).join(", "),
      propertyCount: row.estimatedProperties,
      status: LANDLORD_FROM_DB[row.status] ?? "pending",
      reviewNote: row.reviewNote ?? "",
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function reviewLandlord(
  id: string,
  status: LandlordStatusValue,
  note?: string,
): Promise<void> {
  const profile = await prisma.landlordProfile.findUnique({ where: { id }, select: { id: true } });
  if (!profile) throw new HttpError(404, "That landlord profile does not exist.");
  await prisma.landlordProfile.update({
    where: { id },
    data: {
      status: LANDLORD_TO_DB[status] as never,
      ...(note === undefined ? {} : { reviewNote: note }),
    },
  });
}
