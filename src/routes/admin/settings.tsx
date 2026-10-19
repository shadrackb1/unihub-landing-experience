import { createFileRoute } from '@tanstack/react-router';
import { AdminSettingsPage, routeOptions } from '@/features/admin/pages/AdminSettingsPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/settings')({
  loader: () => guardedLoader(routeOptions.loader, { settings: null }),
  component: AdminSettingsPage,
});
