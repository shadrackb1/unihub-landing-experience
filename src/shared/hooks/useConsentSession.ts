/**
 * Who the browser is, for the purposes of a consent record.
 *
 * Two sign-in systems exist in the app: the platform session (used by the
 * console) and Firebase (used by the landlord portal). Either one is enough
 * to be identified, so the consent screen asks both. The credential is only
 * used to prove who the person is; it is never used to decide which email
 * the consent is filed under — that is the server's job.
 */
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { authClient } from "@/lib/auth-client";
import { auth } from "@/shared/lib/firebase";

export interface ConsentSession {
  mode: "session" | "firebase";
  email: string;
  name: string;
  /** The Firebase ID token, when Firebase is the credential in use. */
  getToken: () => Promise<string | null>;
}

export interface ConsentSessionState {
  status: "loading" | "signed-out" | "signed-in";
  session: ConsentSession | null;
}

export function useConsentSession(): ConsentSessionState {
  const [state, setState] = useState<ConsentSessionState>({
    status: "loading",
    session: null,
  });

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const listenForFirebase = () => {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (cancelled) return;
          if (user) {
            setState({
              status: "signed-in",
              session: {
                mode: "firebase",
                email: user.email ?? "",
                name: user.displayName || user.email || "",
                getToken: async () => user.getIdToken(),
              },
            });
          } else {
            setState({ status: "signed-out", session: null });
          }
        },
        () => {
          if (!cancelled) setState({ status: "signed-out", session: null });
        },
      );
    };

    const checkPlatformSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (cancelled) return;
        if (data?.user?.email) {
          setState({
            status: "signed-in",
            session: {
              mode: "session",
              email: data.user.email,
              name: data.user.name || data.user.email,
              getToken: async () => null,
            },
          });
          return;
        }
      } catch {
        // No platform session; fall through to Firebase.
      }
      if (!cancelled) listenForFirebase();
    };

    void checkPlatformSession();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return state;
}
