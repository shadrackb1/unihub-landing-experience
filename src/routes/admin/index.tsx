import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboard, routeOptions } from '@/features/admin/pages/AdminDashboard';

export const Route = createFileRoute('/admin/')({
  loader: routeOptions.loader as any,
  component: AdminDashboard,
});