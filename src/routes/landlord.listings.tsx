import { createFileRoute } from '@tanstack/react-router';
import { LandlordListingsPage } from '@/features/landlord/pages/LandlordListingsPage';

export const Route = createFileRoute('/landlord/listings')({
  component: LandlordListingsPage,
});