import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AD_PLANS, formatKes, isAdLive, listAllListings, listLandlords, moderateListing, reviewAd, reviewLandlord, setFeatured,
  type LandlordProfile, type LandlordStatus, type ListingStatus, type MarketListing,
} from "@/features/marketplace/services";
import { btnDanger, btnGhost, btnPrimary, errMsg, Notice, StatusBadge } from "@/features/marketplace/ui";

function useLoad<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(() => {
    setError(null);
    fn().then(setData).catch((e) => setError(errMsg(e)));
  }, [fn]);
  useEffect(reload, [reload]);
  return { data, error, reload };
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-medium tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Tabs<T extends string>({ value, options, onChange, counts }: { value: T; options: readonly T[]; onChange: (v: T) => void; counts: Record<string, number> }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} aria-pressed={value === o}
          className={`rounded-full border px-4 py-1.5 text-sm capitalize ${value === o ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>
          {o} <span className="opacity-60">({counts[o] ?? 0})</span>
        </button>
      ))}
    </div>
  );
}

const Loading = () => <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;
const Empty = ({ text }: { text: string }) => <div className="rounded-3xl border border-border p-10 text-center text-sm text-muted-foreground">{text}</div>;

/* ---------- Landlord vetting ---------- */

const LANDLORD_TABS = ["pending", "approved", "rejected", "suspended"] as const;

export function AdminLandlordsPage() {
  const { data, error, reload } = useLoad(listLandlords);
  const [tab, setTab] = useState<LandlordStatus>("pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const act = async (l: LandlordProfile, status: LandlordStatus) => {
    let note = "";
    if (status !== "approved") {
      const n = window.prompt(`Reason for ${status === "rejected" ? "rejecting" : "suspending"} ${l.fullName} (shown to them):`);
      if (n === null) return;
      note = n;
    }
    setBusy(l.id); setActionErr(null);
    try { await reviewLandlord(l.id, status, note); reload(); } catch (e) { setActionErr(errMsg(e)); } finally { setBusy(null); }
  };

  const counts = Object.fromEntries(LANDLORD_TABS.map((t) => [t, data?.filter((l) => l.status === t).length ?? 0]));
  const rows = data?.filter((l) => l.status === tab) ?? [];

  return (
    <div>
      <Header title="Landlords" sub="Vet new landlords and agents. Only approved accounts can publish listings." />
      {error && <Notice kind="error">{error}</Notice>}
      {actionErr && <div className="mb-4"><Notice kind="error">{actionErr}</Notice></div>}
      <Tabs value={tab} options={LANDLORD_TABS} onChange={setTab} counts={counts} />
      {!data && !error ? <Loading /> : rows.length === 0 ? <Empty text={`No ${tab} landlords.`} /> : (
        <div className="grid gap-4">
          {rows.map((l) => (
            <article key={l.id} className="glass-card rounded-3xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-medium">{l.fullName}{l.businessName ? ` · ${l.businessName}` : ""}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{l.email} · {l.phone}{l.whatsapp ? ` · WhatsApp ${l.whatsapp}` : ""}</p>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="text-muted-foreground">ID number</dt><dd>{l.idNumber || "—"}</dd></div>
                <div><dt className="text-muted-foreground">Areas</dt><dd>{l.areas || "—"}</dd></div>
                <div><dt className="text-muted-foreground">Properties</dt><dd>{l.propertyCount || "—"}</dd></div>
              </dl>
              {l.reviewNote && <p className="mt-3 text-sm text-muted-foreground">Note: {l.reviewNote}</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                {l.status !== "approved" && <button disabled={busy === l.id} onClick={() => act(l, "approved")} className={btnPrimary}>Approve</button>}
                {l.status === "pending" && <button disabled={busy === l.id} onClick={() => act(l, "rejected")} className={btnDanger}>Reject</button>}
                {l.status === "approved" && <button disabled={busy === l.id} onClick={() => act(l, "suspended")} className={btnDanger}>Suspend</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Listing moderation ---------- */

const LISTING_TABS = ["pending", "published", "rejected", "hidden"] as const;

function ListingRow({ l, children }: { l: MarketListing; children: React.ReactNode }) {
  return (
    <article className="glass-card flex flex-col gap-4 rounded-3xl border border-border p-4 sm:flex-row">
      {l.images[0] ? <img src={l.images[0]} alt="" className="h-32 w-full rounded-2xl object-cover sm:w-44" loading="lazy" />
        : <div className="h-32 w-full rounded-2xl bg-muted sm:w-44" />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-display text-lg font-medium">{l.title}</h2>
          <div className="flex gap-2"><StatusBadge status={l.status} />{isAdLive(l) && <StatusBadge status="active" label="Featured" />}</div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{l.category} · {l.location}{l.campus ? ` · Near ${l.campus}` : ""} · by {l.landlordName}</p>
        <p className="mt-1 text-sm">{formatKes(l.price)}/month{l.deposit ? ` · Deposit ${formatKes(l.deposit)}` : ""}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{l.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">{children}</div>
      </div>
    </article>
  );
}

export function AdminListingsPage() {
  const { data, error, reload } = useLoad(listAllListings);
  const [tab, setTab] = useState<ListingStatus>("pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const run = async (id: string, fn: () => Promise<void>) => {
    setBusy(id); setActionErr(null);
    try { await fn(); reload(); } catch (e) { setActionErr(errMsg(e)); } finally { setBusy(null); }
  };
  const reject = (l: MarketListing) => {
    const note = window.prompt("Reason for rejecting (shown to the landlord):");
    if (note !== null) run(l.id, () => moderateListing(l.id, "rejected", note));
  };

  const counts = Object.fromEntries(LISTING_TABS.map((t) => [t, data?.filter((l) => l.status === t).length ?? 0]));
  const rows = data?.filter((l) => l.status === tab) ?? [];

  return (
    <div>
      <Header title="Listing review" sub="Approve listings before students can see them. Edited listings come back here." />
      {error && <Notice kind="error">{error}</Notice>}
      {actionErr && <div className="mb-4"><Notice kind="error">{actionErr}</Notice></div>}
      <Tabs value={tab} options={LISTING_TABS} onChange={setTab} counts={counts} />
      {!data && !error ? <Loading /> : rows.length === 0 ? <Empty text={`No ${tab} listings.`} /> : (
        <div className="grid gap-4">
          {rows.map((l) => (
            <ListingRow key={l.id} l={l}>
              {l.status !== "published" && <button disabled={busy === l.id} className={btnPrimary} onClick={() => run(l.id, () => moderateListing(l.id, "published"))}>Publish</button>}
              {l.status === "pending" && <button disabled={busy === l.id} className={btnDanger} onClick={() => reject(l)}>Reject</button>}
              {l.status === "published" && <button disabled={busy === l.id} className={btnGhost} onClick={() => run(l.id, () => moderateListing(l.id, "hidden"))}>Hide</button>}
              {l.status === "published" && <button disabled={busy === l.id} className={btnGhost} onClick={() => run(l.id, () => setFeatured(l.id, !l.featured))}>{l.featured ? "Unfeature" : "Feature"}</button>}
            </ListingRow>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Ad requests ---------- */

export function AdminAdsPage() {
  const { data, error, reload } = useLoad(listAllListings);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const run = async (id: string, fn: () => Promise<void>) => {
    setBusy(id); setActionErr(null);
    try { await fn(); reload(); } catch (e) { setActionErr(errMsg(e)); } finally { setBusy(null); }
  };

  const requested = data?.filter((l) => l.adStatus === "requested") ?? [];
  const live = data?.filter(isAdLive) ?? [];

  return (
    <div>
      <Header title="Ads & boosts" sub="Confirm payment, then approve boost requests. Boosted listings appear first on the listings page." />
      {error && <Notice kind="error">{error}</Notice>}
      {actionErr && <div className="mb-4"><Notice kind="error">{actionErr}</Notice></div>}
      {!data && !error ? <Loading /> : (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-xl font-medium">Requests ({requested.length})</h2>
            {requested.length === 0 ? <Empty text="No boost requests waiting." /> : (
              <div className="grid gap-4">
                {requested.map((l) => {
                  const plan = AD_PLANS.find((p) => p.id === l.adPlan);
                  return (
                    <ListingRow key={l.id} l={l}>
                      <span className="self-center text-sm text-muted-foreground">{plan ? `${plan.label} · ${formatKes(plan.price)}` : "Unknown plan"}</span>
                      {l.status !== "published" && <span className="self-center text-xs text-destructive">Listing not yet published</span>}
                      <button disabled={busy === l.id} className={btnPrimary} onClick={() => run(l.id, () => reviewAd(l, true))}>Approve boost</button>
                      <button disabled={busy === l.id} className={btnDanger} onClick={() => run(l.id, () => reviewAd(l, false))}>Decline</button>
                    </ListingRow>
                  );
                })}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-4 font-display text-xl font-medium">Live boosts ({live.length})</h2>
            {live.length === 0 ? <Empty text="No listings are boosted right now." /> : (
              <div className="grid gap-4">
                {live.map((l) => (
                  <ListingRow key={l.id} l={l}>
                    <span className="self-center text-sm text-muted-foreground">{l.adExpiresAt ? `Ends ${new Date(l.adExpiresAt).toLocaleDateString()}` : "No end date"}</span>
                    <button disabled={busy === l.id} className={btnGhost} onClick={() => run(l.id, () => setFeatured(l.id, false))}>End boost</button>
                  </ListingRow>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
