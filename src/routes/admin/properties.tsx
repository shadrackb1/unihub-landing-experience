import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertiesPage, routeOptions } from '@/features/admin/pages/AdminPropertiesPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/properties')({
  loader: () => guardedLoader(routeOptions.loader, { properties: [] }),
  component: AdminPropertiesPage,
});
