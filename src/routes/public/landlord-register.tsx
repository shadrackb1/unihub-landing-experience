import { createFileRoute } from '@tanstack/react-router';
import { LandlordRegisterPage } from '@/features/landlord/pages/LandlordRegisterPage';

export const Route = createFileRoute('/public/landlord-register')({
  component: LandlordRegisterPage,
});