import { LandlordStatusScreen } from '@/features/landlord/components/LandlordStatusScreen';

export const LandlordSuspendedPage = () => (
  <LandlordStatusScreen
    tone="suspended"
    title="Publishing is paused on this account"
    body="A suspension stops new listings and edits while we review a report or a breach of the listing rules. Your account and existing listings are kept."
    pointsTitle="What happens now"
    points={[
      'Support will tell you the reason and what needs to change',
      'Publishing resumes as soon as the restriction is lifted',
      'Registering another account only delays the review',
    ]}
    waMessage="Hi UniHub, my landlord account is suspended and I'd like to understand why"
    waLabel="Talk to support"
  />
);
