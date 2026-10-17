import { createFileRoute } from '@tanstack/react-router';
import { AdminCategoriesPage, routeOptions } from '@/features/admin/pages/AdminCategoriesPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/categories')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminCategoriesPage,
});
