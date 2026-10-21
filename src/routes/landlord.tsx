import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { AuthProvider, useAuth } from "@/shared/context/AuthContext";
import { LandlordProvider, useLandlord } from "@/shared/context/LandlordContext";
import { homeForStatus } from "@/features/landlord/services/landlordService";
import { formatWhatsAppNumber, SUPPORT_LABEL } from "@/shared/contact";
import { SupportLink } from "@/shared/components/SupportLink";

export const Route = createFileRoute("/landlord")({
  head: () => ({
    meta: [{ title: "UniHub Landlord Portal" }, { name: "robots", content: "noindex" }],
  }),
  ssr: false,
  component: LandlordRoot,
});

const PUBLIC_PREFIXES = ["/landlord/login", "/landlord/register"];
const STATUS_PAGES = ["/landlord/pending", "/landlord/rejected", "/landlord/suspended"];

function LandlordRoot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-6 animate-spin text-highlight" aria-label="Loading" />
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
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <h1 className="font-display text-xl font-medium leading-snug">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-6">{children}</div>
        <SupportLink
          message="Hi UniHub, I need help accessing the landlord portal"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-highlight hover:underline"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {SUPPORT_LABEL}
          {formatWhatsAppNumber() ? ` (${formatWhatsAppNumber()})` : ""}
        </SupportLink>
      </div>
    </div>
  );
}

function LandlordGate({ pathname }: { pathname: string }) {
  const { loading } = useAuth();
  const { user, profile, profileState, profileMessage, refreshProfile } = useLandlord();

  if (loading || !user || profileState === "loading") {
    if (!loading && !user) return <Redirect to="/landlord/login" />;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-highlight" aria-label="Loading your account" />
      </div>
    );
  }

  if (profileState === "unavailable") {
    return (
      <GateScreen title="Can't verify your profile" body={profileMessage}>
        <button
          onClick={refreshProfile}
          className="mb-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Try again
        </button>
      </GateScreen>
    );
  }

  if (profileState === "missing" || !profile) {
    return (
      <GateScreen
        title="No landlord profile found"
        body="This account has no landlord profile yet. Register as a landlord to continue, or contact support if you believe this is a mistake."
      >
        <a
          href="/landlord/register"
          className="mb-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Register as a landlord
        </a>
      </GateScreen>
    );
  }

  const isStatusPage = STATUS_PAGES.includes(pathname);

  if (profile.status !== "approved" && !isStatusPage) {
    return <Redirect to={homeForStatus(profile.status)} />;
  }
  if (profile.status === "approved" && isStatusPage) {
    return <Redirect to="/landlord" />;
  }

  return <Outlet />;
}
