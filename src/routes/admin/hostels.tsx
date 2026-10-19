import { createFileRoute } from '@tanstack/react-router';
import { AdminHostelsPage, routeOptions } from '@/features/admin/pages/AdminHostelsPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/hostels')({
  loader: () => guardedLoader(routeOptions.loader, { hostels: [], universities: [] }),
  component: AdminHostelsPage,
});
