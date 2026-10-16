import { createFileRoute } from '@tanstack/react-router';
import { LandlordRegisterPage } from '@/features/landlord/pages/LandlordRegisterPage';

export const Route = createFileRoute('/register/landlord')({
  component: LandlordRegisterPage,
});