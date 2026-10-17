import { createFileRoute } from '@tanstack/react-router';
import { AdminSettingsPage, routeOptions } from '@/features/admin/pages/AdminSettingsPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/settings')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminSettingsPage,
});
