import { createFileRoute } from '@tanstack/react-router';
import { LandlordPendingPage } from '@/features/landlord/pages/LandlordPendingPage';

export const Route = createFileRoute('/landlord/pending')({
  component: LandlordPendingPage,
});