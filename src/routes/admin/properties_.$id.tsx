import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm, routeOptions } from '@/features/admin/pages/AdminPropertyForm';

export const Route = createFileRoute('/admin/properties_/$id')({
  loader: routeOptions.loader as any,
  component: AdminPropertyForm,
});