import { createFileRoute } from '@tanstack/react-router';
import { AdminUniversitiesPage, routeOptions } from '@/features/admin/pages/AdminUniversitiesPage';

export const Route = createFileRoute('/admin/universities')({
  loader: routeOptions.loader as any,
  component: AdminUniversitiesPage,
});