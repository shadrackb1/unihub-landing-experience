import { createFileRoute } from '@tanstack/react-router';
import { LandlordNewListingPage } from '@/features/landlord/pages/LandlordNewListingPage';

export const Route = createFileRoute('/landlord/listings_/new')({
  head: () => ({ meta: [{ title: "New listing · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }] }),
  component: LandlordNewListingPage,
});