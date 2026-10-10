import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertiesPage } from '@/features/admin/pages/AdminPropertiesPage';

export const Route = createFileRoute('/admin/properties')({
  component: AdminPropertiesPage,
});