import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  AlertTriangle, CheckCircle2, Clock, Loader2, LogOut, MessageCircle, RefreshCw, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useLandlord } from '@/shared/context/LandlordContext';
import { formatWhatsAppNumber, SUPPORT_EMAIL } from '@/shared/contact';
import { SupportLink } from '@/shared/components/SupportLink';
import { cn } from '@/shared/lib/utils';

export type LandlordStatusTone = 'pending' | 'rejected' | 'suspended';

const TONE = {
  pending: {
    icon: Clock,
    iconClass: 'border-amber-500/30 bg-amber-500/10 text-amber-600',
    label: 'Awaiting review',
  },
  rejected: {
    icon: AlertTriangle,
    iconClass: 'border-destructive/30 bg-destructive/10 text-destructive',
    label: 'Not approved',
  },
  suspended: {
    icon: ShieldAlert,
    iconClass: 'border-destructive/30 bg-destructive/10 text-destructive',
    label: 'Suspended',
  },
} as const;

interface Props {
  tone: LandlordStatusTone;
  title: string;
  body: string;
  /** Bullet list explaining what happens next, or the common reasons. */
  points: string[];
  pointsTitle: string;
  /** Prefilled WhatsApp message for the support/appeal action. */
  waMessage: string;
  waLabel: string;
}

/**
 * Shared screen for every non-approved landlord state.
 *
 * Previously pending/rejected/suspended were three separate, zinc-styled
 * dead ends: no sign-out (so the session kept bouncing the user back), the
 * admin's review note was never shown, and the rejected page's "Try Again"
 * pointed at a route that does not exist. This screen gives each state an
 * honest explanation, the reviewer's note when present, a way to appeal, a
 * way to re-check status, and a way to leave the session.
 */
export function LandlordStatusScreen({ tone, title, body, points, pointsTitle, waMessage, waLabel }: Props) {
  const { logout } = useAuth();
  const { profile, refreshProfile } = useLandlord();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  const meta = TONE[tone];
  const Icon = meta.icon;

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      /* already signed out */
    }
    void navigate({ to: '/landlord/login', replace: true });
  };

  const handleCheck = () => {
    setChecking(true);
    refreshProfile();
    setCheckedAt(new Date());
    window.setTimeout(() => setChecking(false), 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-lg">
        <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          UniHub · Landlord portal
        </p>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className={cn('flex size-12 items-center justify-center rounded-2xl border', meta.iconClass)}>
            <Icon className="size-5" aria-hidden="true" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {meta.label}
          </p>
          <h1 className="mt-2 font-display text-2xl font-medium leading-tight">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>

          {profile?.reviewNote ? (
            <div className="mt-5 rounded-xl border border-border bg-accent/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {tone === 'pending' ? 'The note you sent us' : 'Note from our review team'}
              </p>
              <p className="mt-1.5 text-sm">{profile.reviewNote}</p>
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-medium">{pointsTitle}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {points.map((point) => (
                <li key={point} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <SupportLink
              message={waMessage}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {waLabel}
            </SupportLink>

            {tone === 'pending' ? (
              <button
                type="button"
                onClick={handleCheck}
                disabled={checking}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-accent px-5 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
              >
                {checking ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                Check status again
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            {checkedAt
              ? `Last checked at ${checkedAt.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}. We also message you on WhatsApp once a decision is made.`
              : `Support: ${formatWhatsAppNumber() ?? SUPPORT_EMAIL} · We reply on working days.`}
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline underline-offset-4 hover:text-foreground">
            Back to UniHub
          </Link>
        </p>
      </div>
    </div>
  );
}
