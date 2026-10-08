import { createFileRoute } from '@tanstack/react-router';
import { AdminHostelsPage } from '@/features/admin/pages/AdminHostelsPage';

export const Route = createFileRoute('/admin/hostels')({
  component: AdminHostelsPage,
});