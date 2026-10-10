import { createFileRoute } from '@tanstack/react-router';
import { AdminUniversitiesPage } from '@/features/admin/pages/AdminUniversitiesPage';

export const Route = createFileRoute('/admin/universities')({
  component: AdminUniversitiesPage,
});