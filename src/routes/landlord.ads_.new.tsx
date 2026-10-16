import { createFileRoute } from '@tanstack/react-router';
import { LandlordNewAdsPage } from '@/features/landlord/pages/LandlordNewAdsPage';

export const Route = createFileRoute('/landlord/ads_/new')({
  component: LandlordNewAdsPage,
});