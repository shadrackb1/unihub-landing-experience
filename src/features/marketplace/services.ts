import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";

const COLLECTIONS = {
  listings: "listings",
  landlords: "landlords",
} as const;

/**
 * Firestore promises can hang forever when the backend is unreachable (the
 * SDK retries the listen/commit stream instead of rejecting). Every screen
 * that awaits a read or write would then sit on a spinner or a disabled
 * button with no explanation, so bound each call and surface a real error.
 */
function withTimeout<A>(promise: Promise<A>, ms = 8000, what = "The database"): Promise<A> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new Error(`${what} did not respond in time. Check your connection and try again.`),
          ),
        ms,
      );
    }),
  ]).finally(() => clearTimeout(timer));
}

function timestampToDate(data: any): any {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(timestampToDate);
  if (typeof data !== "object" || data === null) return data;

  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else if (value && typeof value === "object") {
      result[key] = timestampToDate(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function dateToTimestamp(data: any): any {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(dateToTimestamp);
  if (typeof data !== "object" || data === null) return data;

  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      result[key] = Timestamp.fromDate(value);
    } else if (value && typeof value === "object") {
      result[key] = dateToTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

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

export async function requestAd(listingId: string, planId: string): Promise<void> {
  if (!listingId || !planId) return;
  const listingRef = doc(db, COLLECTIONS.listings, listingId);
  await withTimeout(
    updateDoc(
      listingRef,
      dateToTimestamp({
        adStatus: "requested",
        adPlan: planId,
        requestedAt: new Date(),
      }),
    ),
    8000,
    "Sending your boost request",
  );
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

/**
 * Listings owned by one landlord.
 *
 * Owner-scoped on purpose: the previous version ordered every listing in the
 * collection with no `where`, so one landlord's dashboard could show another
 * landlord's properties. New documents carry `ownerUid`; older ones written by
 * the legacy form carry `landlordId`, so we read both and merge.
 *
 * Sorting happens in memory so this never needs a composite index.
 */
export async function listLandlordListings(ownerUid: string): Promise<Array<MarketListing>> {
  if (!ownerUid) return [];

  const [byOwner, byLandlord] = await withTimeout(
    Promise.all([
      getDocs(query(collection(db, COLLECTIONS.listings), where("ownerUid", "==", ownerUid))),
      getDocs(query(collection(db, COLLECTIONS.listings), where("landlordId", "==", ownerUid))),
    ]),
    8000,
    "Loading your listings",
  );

  const merged = new Map<string, MarketListing>();
  for (const snap of [...byOwner.docs, ...byLandlord.docs]) {
    merged.set(snap.id, { id: snap.id, ...timestampToDate(snap.data()) } as MarketListing);
  }
  return [...merged.values()].sort(byCreatedAtDesc);
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
export async function createListing(ownerUid: string, input: CreateListingInput): Promise<string> {
  if (!ownerUid) throw new Error("You need to be signed in to create a listing.");

  const ref = await withTimeout(
    addDoc(collection(db, COLLECTIONS.listings), {
      ...input,
      ownerUid,
      landlordId: ownerUid, // legacy field kept in sync for older readers
      category: input.type,
      status: "pending",
      adStatus: "inactive",
      inquiries: 0,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    }),
    8000,
    "Saving your listing",
  );
  return ref.id;
}

export async function deleteListing(id: string): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await withTimeout(deleteDoc(doc(db, COLLECTIONS.listings, id)), 8000, "Deleting the listing");
}

/** Landlord-side visibility toggle (hide a live listing, or re-publish a hidden one). */
export async function updateListingStatus(
  id: string,
  status: "published" | "hidden",
): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await withTimeout(
    updateDoc(doc(db, COLLECTIONS.listings, id), {
      status,
      updatedAt: Timestamp.fromDate(new Date()),
    }),
    8000,
    "Updating the listing",
  );
}

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
  createdAt?: unknown;
  updatedAt?: unknown;
};

// ---- admin marketplace exports needed by AdminMarketplacePages ----

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

/** Every landlord profile, for the admin vetting queue. */
export async function listLandlords(): Promise<LandlordProfile[]> {
  const snapshot = await withTimeout(
    getDocs(collection(db, COLLECTIONS.landlords)),
    8000,
    "Loading landlord profiles",
  );
  return snapshot.docs
    .map((snap) => {
      const data = timestampToDate(snap.data());
      return {
        id: snap.id,
        fullName: data.fullName ?? "",
        businessName: data.businessName ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        whatsapp: data.whatsappNumber ?? data.whatsapp ?? "",
        idNumber: data.nationalId ?? data.idNumber ?? "",
        areas: Array.isArray(data.targetCampuses)
          ? data.targetCampuses.join(", ")
          : (data.areas ?? ""),
        propertyCount:
          typeof data.estimatedProperties === "number" ? data.estimatedProperties : undefined,
        status: (data.status ?? "pending") as LandlordStatus,
        reviewNote: data.reviewNote ?? "",
      } satisfies LandlordProfile;
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function reviewLandlord(
  id: string,
  status: LandlordStatus,
  note?: string,
): Promise<void> {
  if (!id) throw new Error("Missing landlord id.");
  await withTimeout(
    updateDoc(doc(db, COLLECTIONS.landlords, id), {
      status,
      reviewNote: note ?? "",
      reviewedAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    }),
    8000,
    "Updating the landlord",
  );
}

/** Every listing, for admin moderation. Newest first. */
export async function listAllListings(): Promise<MarketListing[]> {
  const snapshot = await withTimeout(
    getDocs(collection(db, COLLECTIONS.listings)),
    8000,
    "Loading listings",
  );
  return snapshot.docs
    .map((snap) => ({ id: snap.id, ...timestampToDate(snap.data()) }) as MarketListing)
    .sort(byCreatedAtDesc);
}

export async function moderateListing(
  id: string,
  status: ListingStatus,
  note?: string,
): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await withTimeout(
    updateDoc(doc(db, COLLECTIONS.listings, id), {
      status,
      ...(note === undefined ? {} : { reviewNote: note }),
      updatedAt: Timestamp.fromDate(new Date()),
    }),
    8000,
    "Updating the listing",
  );
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  if (!id) throw new Error("Missing listing id.");
  await withTimeout(
    updateDoc(doc(db, COLLECTIONS.listings, id), {
      featured,
      updatedAt: Timestamp.fromDate(new Date()),
    }),
    8000,
    "Updating the listing",
  );
}

export async function reviewAd(listing: MarketListing, approved: boolean): Promise<void> {
  if (!listing.id) return;
  const listingRef = doc(db, COLLECTIONS.listings, listing.id);
  if (approved) {
    // Determine boost duration from the adPlan
    const plan = AD_PLANS.find((p) => p.id === listing.adPlan);
    const days = plan ? plan.days : 7; // default to 7 days
    await withTimeout(
      updateDoc(
        listingRef,
        dateToTimestamp({
          adStatus: "live" as const,
          adPlan: listing.adPlan,
          adExpiresAt: addDays(days),
        }),
      ),
      8000,
      "Approving the boost",
    );
  } else {
    await withTimeout(
      updateDoc(
        listingRef,
        dateToTimestamp({
          adStatus: "inactive" as const,
          adPlan: undefined,
          adExpiresAt: undefined,
        }),
      ),
      8000,
      "Declining the boost",
    );
  }
}

function addDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
