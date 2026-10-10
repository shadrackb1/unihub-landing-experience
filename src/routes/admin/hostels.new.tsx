import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm } from '@/features/admin/pages/AdminPropertyForm';

export const Route = createFileRoute('/admin/hostels/new')({
  component: () => <div className="p-8 text-center text-zinc-400">Hostel form coming soon...</div>,
});