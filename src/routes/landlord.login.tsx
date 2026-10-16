import { createFileRoute } from '@tanstack/react-router';
import { LandlordLoginPage } from '@/features/landlord/pages/LandlordLoginPage';

export const Route = createFileRoute('/landlord/login')({
  component: LandlordLoginPage,
});