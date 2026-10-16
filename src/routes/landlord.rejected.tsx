import { createFileRoute } from '@tanstack/react-router';
import { LandlordRejectedPage } from '@/features/landlord/pages/LandlordRejectedPage';

export const Route = createFileRoute('/landlord/rejected')({
  component: LandlordRejectedPage,
});