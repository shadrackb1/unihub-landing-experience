import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboard, routeOptions } from '@/features/admin/pages/AdminDashboard';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/')({
  loader: () => guardedLoader(routeOptions.loader, { stats: { properties: 0, hostels: 0, universities: 0, agents: 0, categories: 0 }, recentProperties: [], recentHostels: [] }),
  component: AdminDashboard,
});
