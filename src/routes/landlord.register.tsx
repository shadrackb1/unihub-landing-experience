import { createFileRoute } from '@tanstack/react-router';
import { LandlordRegisterPage } from '@/features/landlord/pages/LandlordRegisterPage';

export const Route = createFileRoute('/landlord/register')({
  component: LandlordRegisterPage,
});