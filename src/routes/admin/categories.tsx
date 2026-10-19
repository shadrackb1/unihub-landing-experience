import { createFileRoute } from '@tanstack/react-router';
import { AdminCategoriesPage, routeOptions } from '@/features/admin/pages/AdminCategoriesPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/categories')({
  loader: () => guardedLoader(routeOptions.loader, { categories: [] }),
  component: AdminCategoriesPage,
});
