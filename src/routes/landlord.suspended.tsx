import { createFileRoute } from '@tanstack/react-router';
import { LandlordSuspendedPage } from '@/features/landlord/pages/LandlordSuspendedPage';

export const Route = createFileRoute('/landlord/suspended')({
  head: () => ({ meta: [{ title: "Account suspended · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }] }),
  component: LandlordSuspendedPage,
});