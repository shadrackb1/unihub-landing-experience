import { createFileRoute } from '@tanstack/react-router';
import { LandlordDashboard } from '@/features/landlord/pages/LandlordDashboard';

export const Route = createFileRoute('/landlord/')({
  component: LandlordDashboard,
});