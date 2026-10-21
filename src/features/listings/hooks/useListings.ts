import { useEffect, useState } from "react";
import { sampleListings, type SampleListing } from "@/data/listings";
import { useOnlineRefresh } from "@/shared/hooks/useOnlineRefresh";

export function useListings(): SampleListing[] {
  const [listings, setListings] = useState<SampleListing[]>(sampleListings);
  // Bumped by the browser's `online` event so listings re-fetch (and the
  // offline cache re-populates) as soon as connectivity returns.
  const onlineTick = useOnlineRefresh();

  // TODO: Re-enable when API service is implemented
  // The previous implementation used a legacy Firestore service that was removed.
  // For now, we use the static sample listings as the data source.
  useEffect(() => {
    let live = true;

    // Future: Replace with API call to /api/listings
    // const response = await fetch("/api/listings");
    // if (response.ok) {
    //   const data = await response.json();
    //   if (live) setListings(data);
    // }

    return () => {
      live = false;
    };
  }, [onlineTick]);

  return listings;
}
