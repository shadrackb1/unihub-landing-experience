import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Building2, CheckCircle2, Clock, Megaphone, Plus, Loader2,
  AlertTriangle, ArrowRight, ClipboardList, ShieldCheck,
} from 'lucide-react';
import { LandlordShell } from '@/features/landlord/components/LandlordShell';
import { useLandlord } from '@/shared/context/LandlordContext';
import { useApprovedLandlord } from '@/features/landlord/hooks/useApprovedLandlord';
import {
  isAdLive,
  listLandlordListings,
  type MarketListing,
} from '@/features/marketplace/services';
import { cn } from '@/shared/lib/utils';

function StatCard({
  label, value, hint, icon: Icon, tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Building2;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tone)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-medium tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export const LandlordDashboard = () => {
  const { profile } = useLandlord();
  const { uid, isApproved, profileState } = useApprovedLandlord();

  const [listings, setListings] = useState<MarketListing[] | null>(null);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    if (!uid) return;
    setLoadError('');
    try {
      setListings(await listLandlordListings(uid));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setListings([]);
      setLoadError('We could not load your dashboard data. Check your connection and try again.');
    }
  }, [uid]);

  useEffect(() => {
    if (profileState === 'loading') return;
    void load();
  }, [load, profileState]);

  const stats = useMemo(() => {
    const rows = listings ?? [];
    return {
      total: rows.length,
      live: rows.filter((l) => l.status === 'published').length,
      pending: rows.filter((l) => l.status === 'pending').length,
      boosted: rows.filter((l) => isAdLive(l)).length,
    };
  }, [listings]);

  const recent = useMemo(
    () =>
      (listings ?? [])
        .slice()
        .sort((a, b) => (b.createdAt instanceof Date ? b.createdAt.getTime() : 0) - (a.createdAt instanceof Date ? a.createdAt.getTime() : 0))
        .slice(0, 3),
    [listings],
  );

  const firstName = (profile?.fullName ?? '').trim().split(' ')[0] || 'there';
  const loading = listings === null && !loadError;

  return (
    <LandlordShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl font-medium">Welcome back, {firstName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isApproved
              ? 'Your account is approved. Keep your listings fresh so students can find them.'
              : 'Your account is awaiting approval.'}
          </p>
        </header>

        {!isApproved && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <p className="flex-1">
              Approval usually takes about 24 hours. Only approved accounts can publish listings.
            </p>
            <Link to="/landlord/pending" className="rounded-full border border-amber-600/40 px-3 py-1.5 text-xs font-semibold">
              View status
            </Link>
          </div>
        )}

        {loadError && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="flex-1">{loadError}</p>
            <button
              type="button"
              onClick={() => { setListings(null); void load(); }}
              className="rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-semibold"
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Listings" value={stats.total} hint="Everything you have submitted" icon={ClipboardList} tone="bg-accent text-foreground" />
          <StatCard label="Live" value={stats.live} hint="Visible to students right now" icon={CheckCircle2} tone="bg-emerald-500/10 text-emerald-600" />
          <StatCard label="In review" value={stats.pending} hint="Waiting for admin approval" icon={Clock} tone="bg-amber-500/10 text-amber-600" />
          <StatCard label="Boosted" value={stats.boosted} hint="Paid placements currently running" icon={Megaphone} tone="bg-indigo-500/10 text-indigo-600" />
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium">Recent listings</h2>
              <Link to="/landlord/listings" className="inline-flex items-center gap-1 text-sm font-medium text-highlight hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12" role="status">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="sr-only">Loading listings</span>
              </div>
            )}

            {!loading && recent.length === 0 && (
              <div className="py-10 text-center">
                <Building2 className="mx-auto h-8 w-8 text-muted-foreground/60" aria-hidden="true" />
                <p className="mt-3 text-sm text-muted-foreground">No listings yet.</p>
                <Link
                  to="/landlord/listings/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  <Plus className="h-4 w-4" /> Add your first listing
                </Link>
              </div>
            )}

            {!loading && recent.length > 0 && (
              <ul className="mt-4 divide-y divide-border">
                {recent.map((listing) => (
                  <li key={listing.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{listing.title ?? 'Untitled listing'}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[listing.campus, listing.location].filter(Boolean).join(' · ') || 'Location not set'}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium',
                        listing.status === 'published'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                          : listing.status === 'hidden'
                            ? 'border-border bg-accent text-muted-foreground'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-700',
                      )}
                    >
                      {listing.status === 'published' ? 'Live' : listing.status === 'hidden' ? 'Hidden' : 'In review'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-medium">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Link
                to="/landlord/listings/new"
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Plus className="h-4 w-4 text-highlight" />
                Add a new listing
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </Link>
              <Link
                to="/landlord/ads/new"
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Megaphone className="h-4 w-4 text-highlight" />
                Boost a listing
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </Link>
              <Link
                to="/landlord/listings"
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <ClipboardList className="h-4 w-4 text-highlight" />
                Manage my listings
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandlordShell>
  );
};
