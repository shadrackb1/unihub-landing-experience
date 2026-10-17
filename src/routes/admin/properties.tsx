import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertiesPage, routeOptions } from '@/features/admin/pages/AdminPropertiesPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/properties')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminPropertiesPage,
});
