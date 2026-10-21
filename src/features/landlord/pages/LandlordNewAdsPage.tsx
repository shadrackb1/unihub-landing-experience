import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Megaphone,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { LandlordShell } from "@/features/landlord/components/LandlordShell";
import { useApprovedLandlord } from "@/features/landlord/hooks/useApprovedLandlord";
import {
  AD_PLANS,
  formatKes,
  listLandlordListings,
  requestAd,
  type MarketListing,
} from "@/features/marketplace/services";
import { waLink } from "@/shared/contact";
import { cn } from "@/shared/lib/utils";

const PAID_PLANS = AD_PLANS.filter((plan) => plan.price > 0);

export const LandlordNewAdsPage = () => {
  const { uid, profileState } = useApprovedLandlord();
  const navigate = useNavigate();
  const { listingId: preselectedId } = useSearch({ from: "/landlord/ads_/new" });

  const [listings, setListings] = useState<MarketListing[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [selectedListing, setSelectedListing] = useState(preselectedId ?? "");
  const [planId, setPlanId] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    if (!uid) return;
    setLoadError("");
    try {
      setListings(await listLandlordListings(uid));
    } catch (error) {
      console.error("Failed to load listings for boost:", error);
      setListings([]);
      setLoadError("We could not load your listings. Check your connection and try again.");
    }
  }, [uid]);

  useEffect(() => {
    if (profileState === "loading") return;
    void load();
  }, [load, profileState]);

  const boostable = useMemo(
    () => (listings ?? []).filter((l) => l.status === "published" || l.status === "hidden"),
    [listings],
  );

  const chosenListing = boostable.find((l) => l.id === selectedListing);
  const chosenPlan = PAID_PLANS.find((p) => p.id === planId);

  const goToStepTwo = () => {
    const next: Record<string, string> = {};
    if (!selectedListing) next["listing"] = "Choose the property you want to boost.";
    if (!planId) next["plan"] = "Choose how long the boost should run.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setStep(2);
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      goToStepTwo();
      return;
    }
    if (!selectedListing || !planId) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await requestAd(selectedListing, planId);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to request boost:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your boost request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <LandlordShell>
        <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl font-medium text-emerald-900">
            Boost requested
          </h1>
          <p className="mt-2 text-sm text-emerald-800">
            We&apos;ve recorded your request for {chosenListing?.title ?? "your listing"} on the{" "}
            {chosenPlan?.label ?? "selected"} plan. Our team confirms payment and activates it —
            usually within a few hours on working days.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={waLink(
                "Hi UniHub, I just requested a listing boost and want to complete payment",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <MessageCircle className="h-4 w-4" /> Arrange payment
            </a>
            <Link
              to="/landlord/ads"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              Back to boosts
            </Link>
          </div>
        </div>
      </LandlordShell>
    );
  }

  const loading = listings === null && !loadError;

  return (
    <LandlordShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <Link
            to="/landlord/ads"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to boosts
          </Link>
          <h1 className="mt-3 font-display text-2xl font-medium">Boost a listing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Boosted listings appear above standard results on campus searches. Requests are reviewed
            and activated by our team.
          </p>
        </header>

        <ol className="flex items-center gap-3 text-sm" aria-label="Boost steps">
          <li
            className={cn(
              "flex items-center gap-2 font-medium",
              step === 1 ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                step === 1 ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              1
            </span>
            Choose listing &amp; plan
          </li>
          <li className="h-px flex-1 bg-border" aria-hidden="true" />
          <li
            className={cn(
              "flex items-center gap-2 font-medium",
              step === 2 ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                step === 2 ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              2
            </span>
            Confirm
          </li>
        </ol>

        {loadError && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="flex-1">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setListings(null);
                void load();
              }}
              className="rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-semibold"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div
            className="flex items-center justify-center rounded-2xl border border-border bg-card py-16"
            role="status"
          >
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="sr-only">Loading your listings</span>
          </div>
        )}

        {!loading && boostable.length === 0 && !loadError && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <Megaphone className="mx-auto h-9 w-9 text-muted-foreground/60" aria-hidden="true" />
            <h2 className="mt-4 font-display text-lg font-medium">Nothing to boost yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              You can boost a listing once it is live. Publish a listing first, then come back.
            </p>
            <Link
              to="/landlord/listings"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              Go to my listings
            </Link>
          </div>
        )}

        {!loading && boostable.length > 0 && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
            noValidate
          >
            {step === 1 && (
              <>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium">Property to boost</legend>
                  <div className="space-y-2">
                    {boostable.map((listing) => (
                      <label
                        key={listing.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                          selectedListing === listing.id
                            ? "border-primary bg-accent"
                            : "border-border hover:bg-accent/60",
                        )}
                      >
                        <input
                          type="radio"
                          name="listing"
                          value={listing.id}
                          checked={selectedListing === listing.id}
                          onChange={() => {
                            setSelectedListing(listing.id);
                            setErrors((prev) => ({ ...prev, listing: "" }));
                          }}
                          className="h-4 w-4"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {listing.title ?? "Untitled listing"}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {[listing.campus, listing.location].filter(Boolean).join(" · ") ||
                              "Location not set"}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors["listing"] && (
                    <p className="mt-2 text-xs text-destructive">{errors["listing"]}</p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">Boost length</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PAID_PLANS.map((plan) => (
                      <label
                        key={plan.id}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 text-center transition-colors",
                          planId === plan.id
                            ? "border-primary bg-accent"
                            : "border-border hover:bg-accent/60",
                        )}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={planId === plan.id}
                          onChange={() => {
                            setPlanId(plan.id);
                            setErrors((prev) => ({ ...prev, plan: "" }));
                          }}
                          className="sr-only"
                        />
                        <span className="block text-sm font-semibold">{plan.label}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {plan.days} days
                        </span>
                        <span className="mt-2 block font-display text-lg font-medium">
                          {formatKes(plan.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors["plan"] && (
                    <p className="mt-2 text-xs text-destructive">{errors["plan"]}</p>
                  )}
                </fieldset>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <Link
                    to="/landlord/ads"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    onClick={goToStepTwo}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
                  >
                    Review request <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3 rounded-xl border border-border bg-background p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Listing</span>
                    <span className="text-right font-medium">{chosenListing?.title ?? "—"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="text-right font-medium">
                      {chosenPlan ? `${chosenPlan.label} · ${chosenPlan.days} days` : "—"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-right font-display text-lg font-medium">
                      {chosenPlan ? formatKes(chosenPlan.price) : "—"}
                    </span>
                  </div>
                </div>

                <p className="rounded-xl border border-border bg-accent/50 p-4 text-sm text-muted-foreground">
                  Submitting records the request. Our team sends M-Pesa or bank details on WhatsApp
                  and activates the boost after payment is confirmed. Nothing is charged
                  automatically.
                </p>

                {submitError && (
                  <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Megaphone className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Submitting…" : "Submit boost request"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        <button
          type="button"
          onClick={() => void navigate({ to: "/landlord/ads" })}
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          I&apos;ll choose a listing later
        </button>
      </div>
    </LandlordShell>
  );
};
