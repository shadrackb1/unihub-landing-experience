import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  fetchLandlordProfile,
  type LandlordProfile,
  type ProfileResult,
} from "@/features/landlord/services/landlordService";

export type ProfileState = "loading" | "ok" | "missing" | "unavailable";

export interface LandlordUser {
  id: string;
  email: string;
  name: string | null;
}

interface LandlordContextType {
  user: LandlordUser | null;
  authLoading: boolean;
  profile: LandlordProfile | null;
  profileState: ProfileState;
  profileMessage: string;
  /** Re-fetch the profile for the current user (retry button). */
  refreshProfile: () => void;
}

const LandlordContext = createContext<LandlordContextType | null>(null);

/**
 * Holds the signed-in landlord's session (from the platform AuthProvider) plus
 * their landlord profile, read from `/api/landlord/profile`.
 *
 * The `loadedFor` guard: right after sign-in a stale in-flight profile read
 * must not clobber the new user's state, and a signed-out frame must never
 * render "profile missing" for the previous user. Profile state is only ever
 * applied for the user it was requested for.
 */
export function LandlordProvider({ children }: { children: React.ReactNode }) {
  const { user: sessionUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<LandlordProfile | null>(null);
  const [profileState, setProfileState] = useState<ProfileState>("loading");
  const [profileMessage, setProfileMessage] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  // Which user the current profile state belongs to.
  const loadedForRef = useRef<string | null>(null);

  const user: LandlordUser | null = sessionUser
    ? { id: sessionUser.id, email: sessionUser.email, name: sessionUser.name }
    : null;

  useEffect(() => {
    if (authLoading) return;

    if (!sessionUser) {
      loadedForRef.current = null;
      setProfile(null);
      setProfileState("ok");
      setProfileMessage("");
      return;
    }

    let live = true;
    const userId = sessionUser.id;
    loadedForRef.current = userId;
    setProfileState("loading");

    void fetchLandlordProfile().then((result: ProfileResult) => {
      if (!live || loadedForRef.current !== userId) return;
      if (result.state === "ok") {
        setProfile(result.profile);
        setProfileState("ok");
        setProfileMessage("");
      } else if (result.state === "missing") {
        setProfile(null);
        setProfileState("missing");
        setProfileMessage("");
      } else {
        setProfile(null);
        setProfileState("unavailable");
        setProfileMessage(result.message);
      }
    });

    return () => {
      live = false;
    };
  }, [sessionUser, authLoading, reloadToken]);

  const refreshProfile = useCallback(() => setReloadToken((n) => n + 1), []);

  return (
    <LandlordContext.Provider
      value={{
        user,
        authLoading,
        profile,
        profileState,
        profileMessage,
        refreshProfile,
      }}
    >
      {children}
    </LandlordContext.Provider>
  );
}

export function useLandlord(): LandlordContextType {
  const context = useContext(LandlordContext);
  if (!context) {
    throw new Error("useLandlord must be used within a LandlordProvider");
  }
  return context;
}
