import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard, ClipboardList, Megaphone, Plus, LogOut,
  Menu, X, Building2, Mail, MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useLandlord } from '@/shared/context/LandlordContext';
import { cn } from '@/shared/lib/utils';
import { SUPPORT_LABEL, WHATSAPP_CONFIGURED, SUPPORT_EMAIL } from '@/shared/contact';
import { SupportLink } from '@/shared/components/SupportLink';

interface ShellProps {
  children: React.ReactNode;
}

const NAV = [
  { to: '/landlord', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/landlord/listings', label: 'Listings', icon: ClipboardList },
  { to: '/landlord/ads', label: 'Ad boosts', icon: Megaphone },
] as const;

export function LandlordShell({ children }: ShellProps) {
  const { logout } = useAuth();
  const { profile } = useLandlord();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname }).replace(/\/$/, '') || '/';
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch { /* already signed out */ }
    navigate({ to: '/landlord/login', replace: true });
  };

  const activeFor = (item: typeof NAV[number]) => {
    if ('end' in item && item.end) return pathname === item.to;
    return pathname.startsWith(item.to);
  };

  const displayName = profile?.fullName ?? 'Landlord';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile header */}
      <header className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md md:hidden">
        <Link to="/landlord" className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="h-4 w-4 text-highlight" />
          Landlord portal
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/landlord/listings/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New listing
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex h-full w-64 flex-col border-r border-border bg-card md:relative md:translate-x-0 transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/landlord" className="flex items-center gap-2 text-sm font-display font-medium">
            <Building2 className="h-4 w-4 text-highlight" />
            Landlord portal
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = activeFor(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="rounded-xl border border-border bg-card/60 p-3">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {profile?.status === 'approved'
                ? 'Approved landlord'
                : profile?.status ? String(profile.status) : 'Not yet approved'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <SupportLink
            message="Hi UniHub, I need help in the landlord portal"
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={`${SUPPORT_LABEL} — ${WHATSAPP_CONFIGURED ? 'opens WhatsApp' : SUPPORT_EMAIL}`}
          >
            {WHATSAPP_CONFIGURED ? <MessageCircle className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            {SUPPORT_LABEL}
          </SupportLink>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-background/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 pb-10 pt-16 md:pt-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
