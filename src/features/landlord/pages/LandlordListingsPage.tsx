import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  MapPin,
  Plus,
  Loader2,
  AlertTriangle,
  Megaphone,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { LandlordShell } from "@/features/landlord/components/LandlordShell";
import { useApprovedLandlord } from "@/features/landlord/hooks/useApprovedLandlord";
import {
  deleteListing,
  formatKes,
  isAdLive,
  listLandlordListings,
  updateListingStatus,
  type MarketListing,
} from "@/features/marketplace/services";
import { cn } from "@/shared/lib/utils";

type Feedback = { kind: "success" | "error"; message: string } | null;

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  published: "Live",
  hidden: "Hidden",
  rejected: "Rejected",
  draft: "Draft",
};

function StatusBadge({ status }: { status?: string | undefined }) {
  const key = status ?? "pending";
  const tone =
    key === "published"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
      : key === "rejected"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : key === "hidden"
          ? "border-border bg-accent text-muted-foreground"
          : "border-amber-500/30 bg-amber-500/10 text-amber-700";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone,
      )}
    >
      {STATUS_LABEL[key] ?? key}
    </span>
  );
}

export const LandlordListingsPage = () => {
  const { uid, isApproved, profileState, profileMessage } = useApprovedLandlord();
  const navigate = useNavigate();

  const [listings, setListings] = useState<MarketListing[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!uid) return;
    setLoadError("");
    try {
      const rows = await listLandlordListings(uid);
      setListings(rows);
    } catch (error) {
      console.error("Failed to load listings:", error);
      setListings([]);
      setLoadError("We could not load your listings. Check your connection and try again.");
    }
  }, [uid]);

  useEffect(() => {
    if (profileState === "loading") return;
    void load();
  }, [load, profileState]);

  const runAction = async (id: string, action: () => Promise<void>, successMessage: string) => {
    setBusyId(id);
    setFeedback(null);
    try {
      await action();
      setFeedback({ kind: "success", message: successMessage });
    } catch (error) {
      console.error("Listing action failed:", error);
      setFeedback({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "That action did not go through. Please try again.",
      });
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const handleToggleVisibility = (listing: MarketListing) => {
    const nextStatus = listing.status === "hidden" ? "published" : "hidden";
    void runAction(
      listing.id,
      async () => {
        await updateListingStatus(listing.id, nextStatus);
        setListings((prev) =>
          (prev ?? []).map((l) => (l.id === listing.id ? { ...l, status: nextStatus } : l)),
        );
      },
      nextStatus === "hidden" ? "Listing hidden from search." : "Listing published again.",
    );
  };

  const handleDelete = (listing: MarketListing) => {
    void runAction(
      listing.id,
      async () => {
        await deleteListing(listing.id);
        setListings((prev) => (prev ?? []).filter((l) => l.id !== listing.id));
      },
      `“${listing.title ?? "Listing"}” was deleted.`,
    );
  };

  const loading = listings === null && !loadError;

  return (
    <LandlordShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-medium">Listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything you have submitted to UniHub, and what students currently see.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </button>
            <Link
              to="/landlord/listings/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Plus className="h-4 w-4" />
              New listing
            </Link>
          </div>
        </header>

        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-sm",
              feedback.kind === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
                : "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            {feedback.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="ml-auto text-xs underline underline-offset-4 opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {!isApproved && (
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
            <p>
              Your account is still under review, so listings cannot go live yet. They publish once
              an admin approves your account.
            </p>
          </div>
        )}

        {loadError && (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <span>{loadError}</span>
            <button
              type="button"
              onClick={() => {
                setListings(null);
                void load();
              }}
              className="rounded-full border border-destructive/40 px-4 py-1.5 text-xs font-semibold"
            >
              Try again
            </button>
            {profileState === "unavailable" && (
              <span className="text-xs opacity-80">{profileMessage}</span>
            )}
          </div>
        )}

        {loading && (
          <div
            className="flex items-center justify-center rounded-2xl border border-border bg-card py-20"
            role="status"
          >
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="sr-only">Loading your listings</span>
          </div>
        )}

        {!loading && listings && listings.length === 0 && !loadError && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
            <h2 className="mt-4 font-display text-lg font-medium">No listings yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Add your first property. It goes to review, then students can find it near campus.
            </p>
            <Link
              to="/landlord/listings/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Plus className="h-4 w-4" />
              Add a listing
            </Link>
          </div>
        )}

        {!loading && listings && listings.length > 0 && (
          <ul className="space-y-3">
            {listings.map((listing) => {
              const busy = busyId === listing.id;
              const boosting = isAdLive(listing);
              const awaitingBoost = listing.adStatus === "requested";
              const cover = listing.images?.[0];

              return (
                <li
                  key={listing.id}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl border border-border bg-accent sm:w-32">
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <Building2 className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-medium">
                          {listing.title ?? "Untitled listing"}
                        </h2>
                        <StatusBadge status={listing.status} />
                        {boosting && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            <Megaphone className="h-3 w-3" /> Boosted
                          </span>
                        )}
                        {awaitingBoost && (
                          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Boost in review
                          </span>
                        )}
                      </div>

                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        {listing.campus && (
                          <span className="font-medium text-foreground">{listing.campus}</span>
                        )}
                        {listing.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {listing.location}
                          </span>
                        )}
                        {typeof listing.price === "number" && (
                          <span>
                            {formatKes(listing.price)} <span className="text-xs">/ month</span>
                          </span>
                        )}
                      </p>

                      {listing.status === "rejected" && (
                        <p className="mt-2 text-sm text-destructive">
                          This listing was rejected. Update the details and resubmit, or contact
                          support.
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void navigate({
                              to: "/landlord/ads/new",
                              search: { listingId: listing.id },
                            })
                          }
                          disabled={busy || awaitingBoost}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent disabled:opacity-50"
                        >
                          <Megaphone className="h-3.5 w-3.5" />
                          {boosting ? "Extend boost" : awaitingBoost ? "Boost requested" : "Boost"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(listing)}
                          disabled={
                            busy || listing.status === "pending" || listing.status === "rejected"
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent disabled:opacity-50"
                        >
                          {listing.status === "hidden" ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                          )}
                          {listing.status === "hidden" ? "Publish" : "Hide"}
                        </button>

                        {confirmId === listing.id ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-xs">
                            <span className="font-semibold text-destructive">
                              Delete permanently?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete(listing)}
                              disabled={busy}
                              className="font-semibold text-destructive underline underline-offset-2 disabled:opacity-50"
                            >
                              Yes, delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(null)}
                              disabled={busy}
                              className="text-muted-foreground underline underline-offset-2"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmId(listing.id)}
                            disabled={busy}
                            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}

                        {busy && (
                          <Loader2
                            className="h-4 w-4 animate-spin text-muted-foreground"
                            aria-label="Working"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </LandlordShell>
  );
};
