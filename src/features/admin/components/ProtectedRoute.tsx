import { useEffect, useState } from 'react';
import { Navigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { isAdminUser } from '@/features/marketplace/services';
import { AdminLayout } from './AdminLayout';

export const ProtectedRoute = () => {
  const { user, loading, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) { setIsAdmin(null); return; }
    let live = true;
    isAdminUser(user.uid, user.email).then((ok) => live && setIsAdmin(ok));
    return () => { live = false; };
  }, [user]);

  if (loading || (user && isAdmin === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
        <h1 className="font-display text-2xl font-medium">Admins only</h1>
        <p className="max-w-sm text-sm text-muted-foreground">This account doesn't have admin access. Landlords can manage listings from their own dashboard.</p>
        <button onClick={() => logout().catch(() => {})} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Sign out</button>
      </div>
    );
  }
  return <AdminLayout />;
};
