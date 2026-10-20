import { createFileRoute } from '@tanstack/react-router';
import { AdminAgentsPage, routeOptions } from '@/features/admin/pages/AdminAgentsPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/agents')({
  head: () => ({ meta: [{ title: "Agents · UniHub Admin" }, { name: "robots", content: "noindex" }] }),
  loader: () => guardedLoader(routeOptions.loader, { agents: [] }),
  component: AdminAgentsPage,
});
