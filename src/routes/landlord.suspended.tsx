import { createFileRoute } from '@tanstack/react-router';
import { LandlordSuspendedPage } from '@/features/landlord/pages/LandlordSuspendedPage';

export const Route = createFileRoute('/landlord/suspended')({
  component: LandlordSuspendedPage,
});