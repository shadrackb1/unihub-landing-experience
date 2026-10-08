import { createRootRoute } from '@tanstack/react-router';
import { AuthProvider } from '@/shared/context/AuthContext';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute';

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    </AuthProvider>
  ),
});