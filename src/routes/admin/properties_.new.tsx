import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm, routeOptions } from '@/features/admin/pages/AdminPropertyForm';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/properties_/new')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader({ params: {} });
  },
  component: AdminPropertyForm,
});
