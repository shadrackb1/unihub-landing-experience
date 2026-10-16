import { createFileRoute } from '@tanstack/react-router';
import { AdminCategoriesPage, routeOptions } from '@/features/admin/pages/AdminCategoriesPage';

export const Route = createFileRoute('/admin/categories')({
  loader: routeOptions.loader as any,
  component: AdminCategoriesPage,
});