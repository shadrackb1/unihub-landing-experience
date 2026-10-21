// @ts-nocheck
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/shared/lib/firebase";
import { useApprovedLandlord } from "@/features/landlord/hooks/useApprovedLandlord";
import { LandlordShell } from "@/features/landlord/components/LandlordShell";
import {
  listLandlordListings,
  AD_PLANS,
  formatKes,
  requestAd,
  isAdLive,
  type MarketListing,
} from "@/features/marketplace/services";
import { cn } from "@/shared/lib/utils";
import {
  Loader2,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  ClipboardList,
  Zap,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

type View = "select-listing" | "select-plan";

function ListingOption({ listing }: { listing: MarketListing }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border p-4 transition-colors cursor-pointer border-border bg-card hover:border-foreground/50">
      <input
        type="radio"
        name="listingId"
        value={listing.id}
        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-ring"
      />
      <div>
        <p className="font-medium truncate max-w-[20rem]">{listing.title ?? "Untitled listing"}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {listing.category && listing.location
            ? `${listing.category} · ${listing.location}`
            : (listing.location ?? listing.category ?? "No details")}
          {listing.campus ? ` · Near ${listing.campus}` : ""}
        </p>
        <p className="mt-1 text-sm font-medium">{formatKes(listing.price)}/month</p>
      </div>
    </label>
  );
}

export const LandlordAdsPage = () => {
  const { isApproved, status: profileStatus } = useApprovedLandlord();
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("select-listing");
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [actionInFlight, setActionInFlight] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );

  const loadListings = async () => {
    if (!auth.currentUser) return;
    try {
      const mine = await listLandlordListings(auth.currentUser.uid);
      setListings(mine);
    } catch (e) {
      console.error("Failed to load listings:", e);
      setError(e instanceof Error ? e.message : "Could not load your listings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    if (view !== "select-listing") setActionMsg(null);
  }, [view]);

  const selectedListing = listings.find((l) => l.id === selectedListingId);
  const plansForListing = selectedListingId ? AD_PLANS : [];
  const activeBoosts = listings.filter(isAdLive);
  const requested = listings.filter((l) => l.adStatus === "requested");

  const handleRequestAd = async () => {
    if (!selectedListingId || !selectedPlanId) return;
    setActionInFlight(selectedListingId);
    setActionMsg(null);
    try {
      await requestAd(selectedListingId, selectedPlanId);
      await loadListings();
      setActionMsg({
        kind: "success",
        text: "Boost request sent. We will confirm payment details on WhatsApp.",
      });
      setSelectedListingId(null);
      setSelectedPlanId(null);
      setView("select-listing");
    } catch (e) {
      console.error("Ad request failed:", e);
      setActionMsg({
        kind: "error",
        text: e instanceof Error ? e.message : "Could not request the boost. Try again.",
      });
    } finally {
      setActionInFlight(null);
    }
  };

  if (!isApproved && profileStatus !== "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="solid-card p-6 max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="font-display text-lg font-medium">Portal access restricted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is {profileStatus}. You will be able to use the portal once your status
            changes.
          </p>
          <Link
            to="/landlord"
            className="mt-5 cta-shine block w-full rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Back to portal home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <LandlordShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Ad boosts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Boost a published listing so it appears first when students browse.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedListingId(null);
            setSelectedPlanId(null);
            setView("select-listing");
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New boost
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionMsg && (
        <div
          className={cn(
            "mb-5 flex items-start gap-3 rounded-xl p-4 text-sm transition-opacity",
            actionMsg.kind === "success"
              ? "border-border bg-accent text-secondary-foreground"
              : "border-destructive/30 bg-destructive/10 text-destructive",
          )}
          role={actionMsg.kind === "error" ? "alert" : "status"}
        >
          {actionMsg.kind === "success" ? (
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-status" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {view === "select-listing" && (
        <>
          <div className="mb-6">
            <h2 className="font-display text-lg font-medium">Choose a listing to boost</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only published listings can be boosted.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-8 flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <ClipboardList className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                No listings yet. Create one first, then come back to boost it.
              </p>
              <Link
                to="/landlord/listings/new"
                className="cta-shine inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create a listing
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingOption key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {selectedListingId && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">
                  {listings.find((l) => l.id === selectedListingId)?.title ?? "this listing"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedListingId(null);
                  setView("select-plan");
                }}
                className="cta-shine inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
              >
                Choose a plan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {view === "select-plan" && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium">Choose a plan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Boosts run for the chosen period and stop automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView("select-listing")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Change listing
            </button>
          </div>

          {selectedListing && (
            <div className="mb-6 rounded-xl border border-border bg-card/60 p-4">
              <p className="text-sm text-muted-foreground">Boosting</p>
              <p className="mt-0.5 font-medium">{selectedListing.title ?? "Untitled listing"}</p>
              <p className="text-sm text-muted-foreground">
                {selectedListing.category && selectedListing.location
                  ? `${selectedListing.category} · ${selectedListing.location}`
                  : (selectedListing.location ?? selectedListing.category ?? "No details")}
                {selectedListing.campus ? ` · Near ${selectedListing.campus}` : ""}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {plansForListing.map((plan) => (
              <button
                key={plan.id}
                type="button"
                disabled={actionInFlight !== null}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "relative flex flex-col gap-3 rounded-xl border p-5 text-left transition-colors",
                  selectedPlanId === plan.id
                    ? "border-foreground bg-foreground/5 text-background"
                    : "border-border bg-card hover:border-foreground/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{plan.label}</span>
                  {selectedPlanId === plan.id && (
                    <span className="text-xs text-highlight">Selected</span>
                  )}
                </div>
                <p className="text-2xl font-display font-medium">{formatKes(plan.price)}</p>
                <p className="text-xs text-muted-foreground">{plan.days} days · no hidden fees</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-medium text-foreground">
                {selectedPlanId
                  ? formatKes(AD_PLANS.find((p) => p.id === selectedPlanId)?.price ?? 0)
                  : "—"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("select-listing")}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedPlanId || actionInFlight !== null}
                onClick={handleRequestAd}
                className={cn(
                  "cta-shine inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50",
                  !selectedPlanId || actionInFlight !== null ? "" : "hover:bg-primary/90",
                )}
              >
                {actionInFlight ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending request…
                  </>
                ) : (
                  <>
                    Request boost
                    <Zap className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {(activeBoosts.length > 0 || requested.length > 0) && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-medium">Your boosts</h2>

          {requested.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ClipboardList className="h-4 w-4" />
                Waiting for confirmation ({requested.length})
              </h3>
              <ul className="divide-y divide-border">
                {requested.map((listing) => {
                  const plan = AD_PLANS.find((p) => p.id === listing.adPlan);
                  return (
                    <li key={listing.id} className="py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium truncate max-w-sm">
                            {listing.title ?? "Untitled listing"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {plan ? `${plan.label}` : "Unknown plan"}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatKes(plan?.price ?? 0)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {activeBoosts.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Zap className="h-4 w-4" />
                Active boosts ({activeBoosts.length})
              </h3>
              <ul className="divide-y divide-border">
                {activeBoosts.map((listing) => {
                  const plan = AD_PLANS.find((p) => p.id === listing.adPlan);
                  return (
                    <li key={listing.id} className="py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium truncate max-w-sm">
                            {listing.title ?? "Untitled listing"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {listing.adExpiresAt
                              ? `Ends ${new Date(listing.adExpiresAt).toLocaleDateString("en-KE")}`
                              : "No end date"}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatKes(plan?.price ?? 0)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {listings.length === 0 && !isLoading && (
        <div className="mt-8 flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <ImageIcon className="h-5 w-5" />
          </div>
          <p className="text-sm text-muted-foreground">No listings yet.</p>
        </div>
      )}
    </LandlordShell>
  );
};
