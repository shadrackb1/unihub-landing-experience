import { createFileRoute } from '@tanstack/react-router';
import { AdminCMSPage } from '@/features/admin/pages/AdminCMSPage';

export const Route = createFileRoute('/admin/cms')({
  head: () => ({ meta: [{ title: 'Site builder — UniHub Admin' }, { name: 'robots', content: 'noindex' }] }),
  component: AdminCMSPage,
});
