import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboard, routeOptions } from '@/features/admin/pages/AdminDashboard';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminDashboard,
});
