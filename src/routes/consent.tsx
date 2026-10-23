import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Info, XCircle } from "lucide-react";

import { MarketingShell } from "@/shared/components/MarketingChrome";
import { Reveal } from "@/shared/components/VideoPanel";
import {
  ConsentDeclaration,
  ConsentRecordPanel,
  ConsentSubmitButton,
} from "@/shared/components/ConsentForm";
import { useConsentSession } from "@/shared/hooks/useConsentSession";
import {
  ConsentRequestError,
  grantConsentItems,
  loadConsent,
  withdrawConsentItems,
  type ConsentState,
} from "@/shared/services/consentClient";
import { CONSENT_WORDING_VERSION } from "@/shared/consentPurposes";
import type { ConsentPurposeId } from "@/shared/consentPurposes";

export const Route = createFileRoute("/consent")({
  head: () => ({
    meta: [
      { title: "Your consent · UniHub" },
      {
        name: "description",
        content:
          "Give, review and withdraw your consent for the personal data UniHub holds about your landlord or agent account.",
      },
    ],
  }),
  component: ConsentPage,
});

function ConsentPage() {
  const { status, session } = useConsentSession();
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<ConsentState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = useCallback(async () => {
    if (!session) return null;
    return session.mode === "firebase" ? session.getToken() : null;
  }, [session]);

  const refresh = useCallback(async () => {
    try {
      const idToken = await token();
      const next = await loadConsent(idToken);
      setState(next);
      setError("");
    } catch (caught) {
      setError(
        caught instanceof ConsentRequestError
          ? caught.message
          : "We could not reach the server. Please try again.",
      );
    }
  }, [token]);

  useEffect(() => {
    if (status !== "signed-in") return;
    void refresh();
  }, [status, refresh]);

  const handleToggle = (id: string) => {
    setNotice("");
    setTicked((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const idToken = await token();
      const tickedIds = Object.entries(ticked)
        .filter(([, value]) => value)
        .map(([id]) => id);
      const result = await grantConsentItems(tickedIds, idToken);
      setState((previous) =>
        previous ? { ...previous, records: result.records, summary: previous.summary } : previous,
      );
      setTicked({});
      setNotice(
        "Your consent has been recorded. We keep the wording you agreed to, the date and time, and the version of the form.",
      );
      await refresh();
    } catch (caught) {
      setError(
        caught instanceof ConsentRequestError
          ? caught.message
          : "We could not record your consent. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleWithdraw = async (purpose: ConsentPurposeId) => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const idToken = await token();
      await withdrawConsentItems([purpose], idToken);
      setNotice("That consent has been withdrawn, and the withdrawal has been recorded.");
      await refresh();
    } catch (caught) {
      setError(
        caught instanceof ConsentRequestError
          ? caught.message
          : "We could not withdraw your consent. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleWithdrawAll = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const idToken = await token();
      await withdrawConsentItems("all", idToken);
      setNotice("All of your consent has been withdrawn, and the withdrawals have been recorded.");
      await refresh();
    } catch (caught) {
      setError(
        caught instanceof ConsentRequestError
          ? caught.message
          : "We could not withdraw your consent. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <MarketingShell>
      <section className="section-shell">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Consent</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Your consent
            </h1>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              This is the consent form for UniHub landlord and agent accounts. Every statement is
              separate, so you can agree to one thing and not another, and you can take your consent
              back at any time. Students who only browse UniHub give us no personal data and do not
              need this form.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Form version {CONSENT_WORDING_VERSION} · Data Protection Act, 2019 s.32
            </p>
          </Reveal>

          {status === "loading" ? (
            <Reveal className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Checking who you are…
            </Reveal>
          ) : status === "signed-out" ? (
            <Reveal className="mt-10 rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-medium text-foreground">
                <Info className="size-4 text-highlight" />
                Sign in to see your consent
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We can only keep a consent record against an account we can check. Sign in with the
                landlord account you registered, and the form will show what you have already agreed
                to.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/landlord/login"
                  className="inline-flex min-h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Sign in as a landlord
                </Link>
                <Link
                  to="/privacy"
                  className="inline-flex min-h-10 items-center rounded-full border border-border bg-accent px-5 text-sm font-semibold"
                >
                  Read the privacy policy
                </Link>
              </div>
            </Reveal>
          ) : (
            <>
              {error ? (
                <div className="mt-8 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  <XCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
              {notice ? (
                <div className="mt-8 flex items-start gap-3 rounded-xl border border-status/30 bg-status/10 p-4 text-sm text-foreground">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-status" />
                  <span>{notice}</span>
                </div>
              ) : null}

              {state ? (
                <Reveal className="mt-8">
                  <ConsentRecordPanel
                    summary={state.summary}
                    onWithdraw={handleWithdraw}
                    onWithdrawAll={handleWithdrawAll}
                    busy={busy}
                  />
                </Reveal>
              ) : null}

              <Reveal className="mt-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    Consent declaration
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Please read each statement and tick every box that applies to you. Nothing is
                    ticked for you.
                  </p>
                  <ConsentDeclaration ticked={ticked} onToggle={handleToggle} disabled={busy} />
                  <div className="flex flex-wrap items-center gap-4">
                    <ConsentSubmitButton busy={busy} />
                    <p className="text-xs text-muted-foreground">
                      Signing in as {session?.email}. Your consent is stored against this address.
                    </p>
                  </div>
                </form>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
