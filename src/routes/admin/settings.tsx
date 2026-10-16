import { createFileRoute } from '@tanstack/react-router';
import { AdminSettingsPage, routeOptions } from '@/features/admin/pages/AdminSettingsPage';

export const Route = createFileRoute('/admin/settings')({
  loader: routeOptions.loader as any,
  component: AdminSettingsPage,
});