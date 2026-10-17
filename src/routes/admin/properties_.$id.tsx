import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm, routeOptions } from '@/features/admin/pages/AdminPropertyForm';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/properties_/$id')({
  loader: async ({ params }) => {
    await requireAdmin();
    return routeOptions.loader({ params });
  },
  component: AdminPropertyForm,
});
