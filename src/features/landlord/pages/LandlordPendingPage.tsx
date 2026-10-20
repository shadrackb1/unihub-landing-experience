import { LandlordStatusScreen } from '@/features/landlord/components/LandlordStatusScreen';

export const LandlordPendingPage = () => (
  <LandlordStatusScreen
    tone="pending"
    title="Your application is with our review team"
    body="We check every landlord before their listings go live, so students only deal with verified hosts. Most applications are decided within one working day."
    pointsTitle="What we check"
    points={[
      'That your name and national ID match',
      'That your phone and WhatsApp numbers reach you',
      'Your business details, if you gave any',
      'Anything that looks off — we ask on WhatsApp rather than reject outright',
    ]}
    waMessage="Hi UniHub, I'd like an update on my landlord application"
    waLabel="Ask for an update"
  />
);
