import { createFileRoute } from '@tanstack/react-router';
import { LandlordLoginPage } from '@/features/landlord/pages/LandlordLoginPage';

export const Route = createFileRoute('/login/landlord')({
  component: LandlordLoginPage,
});