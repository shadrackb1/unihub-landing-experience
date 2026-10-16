import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertiesPage, routeOptions } from '@/features/admin/pages/AdminPropertiesPage';

export const Route = createFileRoute('/admin/properties')({
  loader: routeOptions.loader as any,
  component: AdminPropertiesPage,
});