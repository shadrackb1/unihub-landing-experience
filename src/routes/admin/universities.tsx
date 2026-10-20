import { createFileRoute } from '@tanstack/react-router';
import { AdminUniversitiesPage, routeOptions } from '@/features/admin/pages/AdminUniversitiesPage';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/universities')({
  head: () => ({ meta: [{ title: "Universities · UniHub Admin" }, { name: "robots", content: "noindex" }] }),
  loader: () => guardedLoader(routeOptions.loader, { universities: [] }),
  component: AdminUniversitiesPage,
});
