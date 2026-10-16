import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/shared/lib/firebase";

export type LandlordStatus = "pending" | "approved" | "rejected" | "suspended";
export type ListingStatus = "pending" | "published" | "rejected" | "hidden";
export type AdStatus = "none" | "requested" | "active" | "rejected";

export interface LandlordProfile {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  whatsapp: string;
  idNumber: string;
  areas: string;
  propertyCount: string;
  status: LandlordStatus;
  reviewNote?: string;
  createdAt?: number;
  reviewedAt?: number;
}

export interface MarketListing {
  id: string;
  landlordId: string;
  landlordName: string;
  whatsapp: string;
  title: string;
  category: string;
  location: string;
  campus: string;
  price: number;
  deposit: number;
  description: string;
  amenities: string[];
  images: string[];
  status: ListingStatus;
  reviewNote?: string;
  featured: boolean;
  adStatus: AdStatus;
  adPlan?: string;
  adExpiresAt?: number;
  createdAt?: number;
  updatedAt?: number;
}

export type ListingInput = Pick<
  MarketListing,
  "title" | "category" | "location" | "campus" | "price" | "deposit" | "description" | "amenities" | "images"
>;

export const LISTING_CATEGORIES = ["Hostel", "Bedsitter", "Single room", "Studio", "Shared apartment", "One bedroom"];

export const AD_PLANS = [
  { id: "week", label: "7-day boost", days: 7, price: 500 },
  { id: "fortnight", label: "14-day boost", days: 14, price: 900 },
  { id: "month", label: "30-day boost", days: 30, price: 1500 },
] as const;

const LANDLORDS = "landlords";
const LISTINGS = "marketListings";

function toMillis(v: unknown): number | undefined {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "number") return v;
  return undefined;
}

function mapLandlord(id: string, d: any): LandlordProfile {
  return { ...d, id, createdAt: toMillis(d.createdAt), reviewedAt: toMillis(d.reviewedAt) };
}

function mapListing(id: string, d: any): MarketListing {
  return {
    amenities: [],
    images: [],
    featured: false,
    adStatus: "none",
    ...d,
    id,
    createdAt: toMillis(d.createdAt),
    updatedAt: toMillis(d.updatedAt),
    adExpiresAt: toMillis(d.adExpiresAt),
  };
}

const newest = <T extends { createdAt?: number }>(a: T, b: T) => (b.createdAt ?? 0) - (a.createdAt ?? 0);

/* ---------- Roles ---------- */

export async function isAdminUser(uid: string, email: string | null): Promise<boolean> {
  const allow = String(import.meta.env["VITE_ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (email && allow.includes(email.toLowerCase())) return true;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() && snap.data()["role"] === "admin";
  } catch {
    return false;
  }
}

/* ---------- Landlords ---------- */

export type RegisterInput = Omit<LandlordProfile, "id" | "status" | "createdAt" | "reviewedAt" | "reviewNote"> & {
  password: string;
};

export async function registerLandlord(input: RegisterInput): Promise<void> {
  const { password, ...profile } = input;
  const cred = await createUserWithEmailAndPassword(auth, profile.email, password);
  await updateProfile(cred.user, { displayName: profile.fullName });
  await setDoc(doc(db, LANDLORDS, cred.user.uid), {
    ...profile,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, "users", cred.user.uid), {
    id: cred.user.uid,
    email: profile.email,
    name: profile.fullName,
    role: "landlord",
    createdAt: Date.now(),
  });
}

export async function getLandlord(uid: string): Promise<LandlordProfile | null> {
  const snap = await getDoc(doc(db, LANDLORDS, uid));
  return snap.exists() ? mapLandlord(snap.id, snap.data()) : null;
}

export async function listLandlords(): Promise<LandlordProfile[]> {
  const snap = await getDocs(collection(db, LANDLORDS));
  return snap.docs.map((d) => mapLandlord(d.id, d.data())).sort(newest);
}

export async function reviewLandlord(uid: string, status: LandlordStatus, reviewNote = ""): Promise<void> {
  await updateDoc(doc(db, LANDLORDS, uid), { status, reviewNote, reviewedAt: serverTimestamp() });
  if (status !== "approved") {
    // Pull a suspended/rejected landlord's live listings off the site.
    const mine = await listLandlordListings(uid);
    await Promise.all(
      mine.filter((l) => l.status === "published").map((l) => updateDoc(doc(db, LISTINGS, l.id), { status: "hidden" })),
    );
  }
}

/* ---------- Listings ---------- */

export async function listLandlordListings(uid: string): Promise<MarketListing[]> {
  const snap = await getDocs(query(collection(db, LISTINGS), where("landlordId", "==", uid)));
  return snap.docs.map((d) => mapListing(d.id, d.data())).sort(newest);
}

export async function listAllListings(): Promise<MarketListing[]> {
  const snap = await getDocs(collection(db, LISTINGS));
  return snap.docs.map((d) => mapListing(d.id, d.data())).sort(newest);
}

export function isAdLive(l: MarketListing): boolean {
  return l.featured && l.adStatus === "active" && (!l.adExpiresAt || l.adExpiresAt > Date.now());
}

export async function listPublishedListings(): Promise<MarketListing[]> {
  const snap = await getDocs(query(collection(db, LISTINGS), where("status", "==", "published")));
  return snap.docs
    .map((d) => mapListing(d.id, d.data()))
    .sort((a, b) => Number(isAdLive(b)) - Number(isAdLive(a)) || newest(a, b));
}

export async function getListing(id: string): Promise<MarketListing | null> {
  const snap = await getDoc(doc(db, LISTINGS, id));
  return snap.exists() ? mapListing(snap.id, snap.data()) : null;
}

export async function createListing(landlord: LandlordProfile, input: ListingInput): Promise<string> {
  const res = await addDoc(collection(db, LISTINGS), {
    ...input,
    landlordId: landlord.id,
    landlordName: landlord.businessName || landlord.fullName,
    whatsapp: landlord.whatsapp || landlord.phone,
    status: "pending",
    featured: false,
    adStatus: "none",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return res.id;
}

export async function updateListing(id: string, input: ListingInput): Promise<void> {
  // Edits go back through moderation.
  await updateDoc(doc(db, LISTINGS, id), { ...input, status: "pending", updatedAt: serverTimestamp() });
}

export async function deleteListing(id: string): Promise<void> {
  await deleteDoc(doc(db, LISTINGS, id));
}

export async function moderateListing(id: string, status: ListingStatus, reviewNote = ""): Promise<void> {
  await updateDoc(doc(db, LISTINGS, id), { status, reviewNote, updatedAt: serverTimestamp() });
}

export async function requestAd(id: string, planId: string): Promise<void> {
  await updateDoc(doc(db, LISTINGS, id), { adStatus: "requested", adPlan: planId, updatedAt: serverTimestamp() });
}

export async function reviewAd(listing: MarketListing, approve: boolean): Promise<void> {
  if (!approve) {
    await updateDoc(doc(db, LISTINGS, listing.id), { adStatus: "rejected", featured: false });
    return;
  }
  const plan = AD_PLANS.find((p) => p.id === listing.adPlan) ?? AD_PLANS[0];
  await updateDoc(doc(db, LISTINGS, listing.id), {
    adStatus: "active",
    featured: true,
    adExpiresAt: Date.now() + plan.days * 86_400_000,
  });
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  await updateDoc(doc(db, LISTINGS, id), featured
    ? { featured: true, adStatus: "active", adExpiresAt: null }
    : { featured: false, adStatus: "none" });
}

export async function uploadListingImage(uid: string, file: File): Promise<string> {
  const r = ref(storage, `listing-images/${uid}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export const formatKes = (n: number) => `KES ${Number(n || 0).toLocaleString()}`;
