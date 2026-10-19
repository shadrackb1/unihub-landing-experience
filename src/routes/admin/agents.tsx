import { createFileRoute } from '@tanstack/react-router';
import { AdminAgentsPage, routeOptions } from '@/features/admin/pages/AdminAgentsPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/agents')({
  loader: () => guardedLoader(routeOptions.loader, { agents: [] }),
  component: AdminAgentsPage,
});
