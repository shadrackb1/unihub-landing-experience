import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm } from '@features/admin/pages/AdminPropertyForm';
import { requireAdmin } from '@features/admin/requireAdmin';

export const Route = createFileRoute('/admin/hostels_/new')({
  loader: async () => {
    await requireAdmin();
    return {};
  },
  component: () => <div className='p-8 text-center text-zinc-400'>Hostel form coming soon...</div>,
});
