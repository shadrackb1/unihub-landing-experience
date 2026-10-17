import { createFileRoute } from '@tanstack/react-router';
import { AdminUniversitiesPage, routeOptions } from '@/features/admin/pages/AdminUniversitiesPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/universities')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminUniversitiesPage,
});
