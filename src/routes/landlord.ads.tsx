import { createFileRoute } from '@tanstack/react-router';
import { LandlordAdsPage } from '@/features/landlord/pages/LandlordAdsPage';

export const Route = createFileRoute('/landlord/ads')({
  component: LandlordAdsPage,
});