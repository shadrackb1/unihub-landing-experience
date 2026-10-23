import { Navigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";
import { isAdminRole } from "../requireAdmin";
import { AdminLayout } from "./AdminLayout";

/**
 * Admin subtree guard.
 *
 * Rendered by the `/admin` route for every path except `/admin/login`.
 * It must render `<AdminLayout />`, which owns the admin chrome and the
 * `<Outlet />` for child routes.
 *
 * The admin check reads the role the session was issued for and shares
 * `isAdminRole` with the route loaders, so the navigation a loader permits and
 * the navigation the layout permits can never disagree.
 */
export const ProtectedRoute = () => {
  const { user, loading, logout } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Checking admin access"
      >
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
        <ShieldAlert className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <h1 className="font-display text-2xl font-medium">Admins only</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This account doesn&apos;t have admin access. Landlords can manage their listings from the
          landlord dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => logout().catch(() => {})}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Sign out
          </button>
          <a
            href="/landlord"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
          >
            Go to landlord portal
          </a>
        </div>
      </div>
    );
  }

  return <AdminLayout />;
};
