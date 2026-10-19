import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';
import {
  fetchLandlordProfile,
  type LandlordProfile,
  type ProfileResult,
} from '@/features/landlord/services/landlordService';

export type ProfileState = 'loading' | 'ok' | 'missing' | 'unavailable';

interface LandlordContextType {
  user: User | null;
  authLoading: boolean;
  profile: LandlordProfile | null;
  profileState: ProfileState;
  profileMessage: string;
  /** Re-fetch the profile for the current user (retry button). */
  refreshProfile: () => void;
}

const LandlordContext = createContext<LandlordContextType | null>(null);

/**
 * Holds Firebase auth state plus the signed-in landlord's profile.
 *
 * The `loadedFor` guard: right after sign-in (or an auth-state replay) a
 * stale in-flight profile read must not clobber the new user's state, and a
 * signed-out frame must never render "profile missing" for the previous
 * user. Profile state is only ever applied for the uid it was requested for.
 */
export function LandlordProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<LandlordProfile | null>(null);
  const [profileState, setProfileState] = useState<ProfileState>('loading');
  const [profileMessage, setProfileMessage] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  // Which uid the current profile state belongs to.
  const loadedForRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser?.uid !== loadedForRef.current) {
        // New (or signed-out) identity: invalidate whatever we hold.
        loadedForRef.current = null;
        setProfile(null);
        setProfileState(nextUser ? 'loading' : 'ok');
        setProfileMessage('');
      }
      setUser(nextUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    let live = true;
    const uid = user.uid;
    loadedForRef.current = uid;
    setProfileState('loading');

    void fetchLandlordProfile(uid).then((result: ProfileResult) => {
      if (!live || loadedForRef.current !== uid) return;
      if (result.state === 'ok') {
        setProfile(result.profile);
        setProfileState('ok');
        setProfileMessage('');
      } else if (result.state === 'missing') {
        setProfile(null);
        setProfileState('missing');
        setProfileMessage('');
      } else {
        setProfile(null);
        setProfileState('unavailable');
        setProfileMessage(result.message);
      }
    });

    return () => {
      live = false;
    };
  }, [user, reloadToken]);

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
    throw new Error('useLandlord must be used within a LandlordProvider');
  }
  return context;
}
