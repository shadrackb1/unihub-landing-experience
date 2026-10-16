import { createFileRoute } from '@tanstack/react-router';
import { LandlordNewListingPage } from '@/features/landlord/pages/LandlordNewListingPage';

export const Route = createFileRoute('/landlord/listings/new')({
  component: LandlordNewListingPage,
});