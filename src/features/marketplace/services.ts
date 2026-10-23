/**
 * Marketplace service layer.
 *
 * Landlord listings, moderation, boost requests and landlord vetting all live
 * in the Prisma database and are reached through the API. The previous version
 * talked to Firestore, whose project is not reachable from this deployment, so
 * every screen that loaded data ended in a connection error.
 *
 * The exported shapes are unchanged (lowercase statuses, prices in KES) so the
 * screens keep working; the server owns ownership checks and validation.
 */

export interface AdPlan {
  id: string;
  label: string;
  price: number;
  days: number;
}

export const AD_PLANS: AdPlan[] = [
  { id: "free", label: "Free", price: 0, days: 7 },
  { id: "basic", label: "Basic", price: 500, days: 14 },
  { id: "pro", label: "Pro", price: 900, days: 30 },
  { id: "premium", label: "Premium", price: 1500, days: 90 },
];

export type AdPlanId = AdPlan["id"];

export function formatKes(amount: number): string {
  if (amount >= 1e6) return "KES " + (amount / 1e6).toFixed(1) + "m";
  if (amount >= 1e3) return "KES " + (amount / 1e3).toFixed(1) + "k";
  return "KES " + amount.toLocaleString("en-KE");
}

export const AD_BOOST_OPTIONS = [
  { id: "week", label: "7-day boost", price: 500, days: 7 },
  { id: "fortnight", label: "14-day boost", price: 900, days: 14 },
  { id: "month", label: "30-day boost", price: 1500, days: 30 },
] as const;

export type MarketListing = {
  id: string;
  title?: string;
  type?: string;
  category?: string;
  location?: string;
  campus?: string;
  price?: number;
  deposit?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  landlordName?: string;
  ownerUid?: string;
  landlordId?: string;
  inquiries?: number;
  status?:
    | "draft"
    | "pending"
    | "published"
    | "rejected"
    | "hidden"
    | "live"
    | "requested"
    | "expired"
    | "inactive";
  adStatus?: "live" | "requested" | "expired" | "inactive";
  adPlan?: string;
  adExpiresAt?: unknown;
  featured?: boolean;
  reviewNote?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type LandlordStatus = "pending" | "approved" | "rejected" | "suspended";
export type ListingStatus = "pending" | "published" | "rejected" | "hidden";

export type LandlordProfile = {
  id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  idNumber?: string;
  areas?: string;
  propertyCount?: number;
  status: LandlordStatus;
  reviewNote?: string;
};

async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: init?.method ?? "GET",
      credentials: "include",
      ...(init?.body === undefined
        ? {}
        : { headers: { "content-type": "application/json" }, body: JSON.stringify(init.body) }),
    });
  } catch {
    throw new Error("We could not reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    let message = "The request could not be completed. Please try again.";
    try {
      const payload: unknown = await response.json();
      if (payload && typeof payload === "object") {
        const error = (payload as { error?: unknown }).error;
        if (typeof error === "string" && error.trim()) message = error;
      }
    } catch {
      // Keep the generic message for a non-JSON body.
    }
    if (response.status === 401) message = "Sign in again to continue.";
    throw new Error(message);
  }

  return (await response.json()) as T;
}

/** Re-hydrate ISO strings so the screens can sort and compare dates. */
function hydrate(listing: MarketListing): MarketListing {
  const asDate = (value: unknown): Date | undefined => {
    if (typeof value === "string") {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? undefined : date;
    }
    return value instanceof Date ? value : undefined;
  };
  return {
    ...listing,
    createdAt: asDate(listing.createdAt),
    updatedAt: asDate(listing.updatedAt),
    adExpiresAt: asDate(listing.adExpiresAt),
  };
}

export function isAdLive(listing: { adStatus?: string; adExpiresAt?: unknown }): boolean {
  if (listing.adStatus !== "live") return false;
  if (!listing.adExpiresAt) return true;
  return new Date(listing.adExpiresAt as Date) > new Date();
}

function byCreatedAtDesc(a: MarketListing, b: MarketListing): number {
  const toMs = (value: unknown) => (value instanceof Date ? value.getTime() : 0);
  return toMs(b.createdAt) - toMs(a.createdAt);
}

/** Listings owned by the signed-in landlord (the server scopes the query). */
export async function listLandlordListings(ownerUid?: string): Promise<Array<MarketListing>> {
  if (ownerUid === "") return [];
  const payload = await api<{ listings: MarketListing[] }>("/api/landlord/listings");
  return payload.listings.map(hydrate).sort(byCreatedAtDesc);
}

export type CreateListingInput = {
  title: string;
  campus: string;
  location: string;
  type: string;
  price: number;
  deposit: number;
  description: string;
  amenities: string[];
  images: string[];
  landlordName?: string;
};

/** Create a listing awaiting admin review, owned by the signed-in landlord. */
export async function createListing(_ownerUid: string, input: CreateListingInput): Promise<string> {
  const payload = await api<{ id: string }>("/api/landlord/listings", {
    method: "POST",
    body: input,
  });
  return payload.id;
}

export async function deleteListing(id: string): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await api(`/api/landlord/listings/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Landlord-side visibility toggle (hide a live listing, or re-publish a hidden one). */
export async function updateListingStatus(
  id: string,
  status: "published" | "hidden",
): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await api(`/api/landlord/listings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { action: "status", status },
  });
}

export async function requestAd(listingId: string, planId: string): Promise<void> {
  if (!listingId || !planId) return;
  await api(`/api/landlord/listings/${encodeURIComponent(listingId)}`, {
    method: "PATCH",
    body: { action: "requestAd", plan: planId },
  });
}

/** Every listing, for admin moderation. Newest first. */
export async function listAllListings(): Promise<MarketListing[]> {
  const payload = await api<{ listings: MarketListing[] }>("/api/admin/listings");
  return payload.listings.map(hydrate).sort(byCreatedAtDesc);
}

export async function moderateListing(
  id: string,
  status: ListingStatus,
  note?: string,
): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await api(`/api/admin/listings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { action: "moderate", status, ...(note === undefined ? {} : { note }) },
  });
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await api(`/api/admin/listings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { action: "feature", featured },
  });
}

export async function reviewAd(listing: MarketListing, approved: boolean): Promise<void> {
  if (!listing.id) return;
  await api(`/api/admin/listings/${encodeURIComponent(listing.id)}`, {
    method: "PATCH",
    body: { action: "reviewAd", approved },
  });
}

/** Every landlord profile, for the admin vetting queue. */
export async function listLandlords(): Promise<LandlordProfile[]> {
  const payload = await api<{ landlords: LandlordProfile[] }>("/api/admin/landlords");
  return payload.landlords;
}

export async function reviewLandlord(
  id: string,
  status: LandlordStatus,
  note?: string,
): Promise<void> {
  if (!id) throw new Error("Missing landlord id.");
  await api(`/api/admin/landlords/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { status, ...(note === undefined ? {} : { note }) },
  });
}
