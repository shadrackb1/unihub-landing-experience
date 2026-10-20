import { createFileRoute } from '@tanstack/react-router';
import { LandlordNewAdsPage } from '@/features/landlord/pages/LandlordNewAdsPage';

/**
 * Optional `listingId` deep-link: the listings page sends landlords here with
 * the property they chose to boost. Declaring it on the route keeps the value
 * in the typed search contract instead of reading `window.location`, which
 * broke client-side navigation and page refresh.
 */
export const Route = createFileRoute('/landlord/ads_/new')({
  head: () => ({ meta: [{ title: "New boost · UniHub Landlord Portal" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (search: Record<string, unknown>): { listingId?: string } => {
    const listingId = search['listingId'];
    return typeof listingId === 'string' && listingId.length > 0 ? { listingId } : {};
  },
  component: LandlordNewAdsPage,
});