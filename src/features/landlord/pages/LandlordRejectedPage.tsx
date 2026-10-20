import { LandlordStatusScreen } from '@/features/landlord/components/LandlordStatusScreen';

export const LandlordRejectedPage = () => (
  <LandlordStatusScreen
    tone="rejected"
    title="We couldn't approve this account"
    body="Your account stays on file, so nothing is lost — but we can't let it publish listings until the details below are sorted out."
    pointsTitle="How to get approved"
    points={[
      'Message us with the document or detail that was missing',
      'Use the same account — do not register a second one',
      'Once we re-check your details, approval takes effect right away',
    ]}
    waMessage="Hi UniHub, my landlord application wasn't approved and I'd like to fix it"
    waLabel="Send the missing details"
  />
);
