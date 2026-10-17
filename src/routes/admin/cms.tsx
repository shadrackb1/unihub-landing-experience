import { createFileRoute } from '@tanstack/react-router';
import { AdminCMSPage, routeOptions } from '@/features/admin/pages/AdminCMSPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/cms')({
  loader: async () => {
    await requireAdmin();
    return routeOptions.loader?.();
  },
  component: AdminCMSPage,
});
