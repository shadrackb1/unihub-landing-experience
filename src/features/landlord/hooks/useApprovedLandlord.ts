import { useMemo } from "react";
import { useLandlord } from "@/shared/context/LandlordContext";
import type { LandlordProfile, LandlordStatus } from "@/features/marketplace/services";

interface ApprovedLandlordReturn {
  profile: LandlordProfile | null;
  isApproved: boolean;
  status: LandlordStatus;
  uid: string;
  profileState: "loading" | "ok" | "missing" | "unavailable";
  profileMessage: string;
}

function toMarketplaceProfile(
  p: ReturnType<typeof useLandlord>["profile"],
): LandlordProfile | null {
  if (!p) return null;
  return {
    id: p.uid,
    fullName: p.fullName,
    businessName: p.businessName ?? "",
    email: p.email,
    phone: p.phone,
    whatsapp: p.whatsappNumber,
    idNumber: p.nationalId ?? "",
    areas: p.targetCampuses.join(", "),
    propertyCount: p.estimatedProperties,
    status: p.status,
    reviewNote: p.reviewNote ?? "",
  };
}

/**
 * Approved-landlord hook for the landlord portal.
 *
 * LandlordContext exposes the upstream landlord-service shape
 * (uid, whatsappNumber, nationalId, targetCampuses, estimatedProperties…).
 * The marketplace services expect their own LandlordProfile shape
 * (id, whatsapp, idNumber, areas, propertyCount…).
 *
 * This hook bridges the two without touching either provider or service.
 * Pages that read from or write to the marketplace collection use this hook
 * so they always hand a marketplace-shaped profile to the service layer.
 */
export function useApprovedLandlord(): ApprovedLandlordReturn {
  const { user, profile, profileState, profileMessage } = useLandlord();

  const profileOrNull = useMemo<LandlordProfile | null>(
    () => toMarketplaceProfile(profile),
    [profile],
  );

  const isApproved = profile?.status === "approved";

  return {
    profile: profileOrNull,
    isApproved,
    status: (profile?.status ?? "pending") as LandlordStatus,
    uid: user?.uid ?? "",
    profileState,
    profileMessage,
  };
}
