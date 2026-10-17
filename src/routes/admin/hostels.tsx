import { createFileRoute } from '@tanstack/react-router';
import { AdminHostelsPage, routeOptions } from '@/features/admin/pages/AdminHostelsPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/hostels')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminHostelsPage,
});
