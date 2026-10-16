import { createFileRoute } from '@tanstack/react-router';
import { AdminHostelsPage, routeOptions } from '@/features/admin/pages/AdminHostelsPage';

export const Route = createFileRoute('/admin/hostels')({
  loader: routeOptions.loader as any,
  component: AdminHostelsPage,
});