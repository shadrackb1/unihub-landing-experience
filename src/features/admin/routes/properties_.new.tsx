import { createFileRoute } from '@tanstack/react-router';
import { AdminPropertyForm, routeOptions } from '@/features/admin/pages/AdminPropertyForm';
import { guardedLoader } from '@/features/admin/requireAdmin';

export const Route = createFileRoute('/admin/properties_/new')({
  head: () => ({ meta: [{ title: "New property · UniHub Admin" }, { name: "robots", content: "noindex" }] }),
  loader: () =>
    guardedLoader(() => routeOptions.loader({ params: {} }), { property: null, categories: [], agents: [] }),
  component: AdminPropertyForm,
});
