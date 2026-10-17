import { createFileRoute } from '@tanstack/react-router';
import { AdminAgentsPage, routeOptions } from '@/features/admin/pages/AdminAgentsPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/agents')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminAgentsPage,
});
