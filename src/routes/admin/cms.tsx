import { createFileRoute } from '@tanstack/react-router';
import { AdminCMSPage } from '@/features/admin/pages/AdminCMSPage';
import { requireAdmin } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/cms')({
  loader: async () => {
    const { user } = await requireAdmin();
    return { user };
  },
  component: AdminCMSPage,
});