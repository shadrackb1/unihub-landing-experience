import {
  createFileRoute,
  Outlet,
  useRouterState,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { AuthProvider, useAuth } from '@/shared/context/AuthContext';
import { LandlordProvider, useLandlord } from '@/shared/context/LandlordContext';
import { homeForStatus } from '@/features/landlord/services/landlordService';
import { waLink, formatWhatsAppNumber } from '@/shared/contact';

export const Route = createFileRoute('/landlord')({
  head: () => ({
    meta: [
      { title: 'UniHub Landlord Portal' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  ssr: false,
  component: LandlordRoot,
});

const PUBLIC_PREFIXES = ['/landlord/login', '/landlord/register'];
const STATUS_PAGES = ['/landlord/pending', '/landlord/rejected', '/landlord/suspended'];

function LandlordRoot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  return (
    <AuthProvider>
      <LandlordProvider>
        {isPublic ? <Outlet /> : <LandlordGate pathname={pathname} />}
      </LandlordProvider>
    </AuthProvider>
  );
}

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: to as never, replace: true });
  }, [navigate, to]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
    </div>
  );
}

function GateScreen({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{body}</p>
        {children}
        <a
          href={waLink('Hi UniHub, I need help accessing the landlord portal')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp support ({formatWhatsAppNumber()})
        </a>
      </div>
    </div>
  );
}

function LandlordGate({ pathname }: { pathname: string }) {
  const { loading } = useAuth();
  const { user, profile, profileState, profileMessage, refreshProfile } = useLandlord();

  if (loading || !user || profileState === 'loading') {
    if (!loading && !user) return <Redirect to="/landlord/login" />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (profileState === 'unavailable') {
    return (
      <GateScreen title="Can't verify your profile" body={profileMessage}>
        <button
          onClick={refreshProfile}
          className="mb-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Try again
        </button>
      </GateScreen>
    );
  }

  if (profileState === 'missing' || !profile) {
    return (
      <GateScreen
        title="No landlord profile found"
        body="This account has no landlord profile yet. Register as a landlord to continue, or contact support if you believe this is a mistake."
      >
        <a
          href="/landlord/register"
          className="mb-4 block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Register as a landlord
        </a>
      </GateScreen>
    );
  }

  const isStatusPage = STATUS_PAGES.includes(pathname);

  if (profile.status !== 'approved' && !isStatusPage) {
    return <Redirect to={homeForStatus(profile.status)} />;
  }
  if (profile.status === 'approved' && isStatusPage) {
    return <Redirect to="/landlord" />;
  }

  return <Outlet />;
}
