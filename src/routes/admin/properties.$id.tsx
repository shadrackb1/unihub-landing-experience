import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm } from '@/features/admin/pages/AdminPropertyForm';

export const Route = createFileRoute('/admin/properties/$id')({
  component: AdminPropertyForm,
});