import { createFileRoute } from '@tanstack/react-router';
import { AdminAgentsPage, routeOptions } from '@/features/admin/pages/AdminAgentsPage';

export const Route = createFileRoute('/admin/agents')({
  loader: routeOptions.loader as any,
  component: AdminAgentsPage,
});