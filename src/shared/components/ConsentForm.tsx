import { useState } from "react";
import { CheckCircle, Loader2, ShieldCheck, Undo2, XCircle } from "lucide-react";

import {
  CONSENT_PURPOSES,
  DECLARATION_ITEMS,
  REQUIRED_DECLARATION_ITEM_IDS,
  type ConsentPurposeId,
} from "@/shared/consentPurposes";
import type { ConsentSummaryItem } from "@/shared/services/consentClient";
import { cn } from "@/shared/lib/utils";

/**
 * The consent declaration.
 *
 * Every box starts unticked. Each statement that grants consent is a
 * separate box, so a tick for one purpose is never treated as a tick for
 * another, and a person can refuse the optional statement and still use the
 * service.
 */
export interface ConsentDeclarationProps {
  ticked: Record<string, boolean>;
  onToggle: (id: string) => void;
  disabled?: boolean;
  /** Show the lawful basis printed under each consent statement. */
  showBasis?: boolean;
}

export function ConsentDeclaration({
  ticked,
  onToggle,
  disabled = false,
  showBasis = true,
}: ConsentDeclarationProps) {
  const requiredIds = new Set(REQUIRED_DECLARATION_ITEM_IDS);

  return (
    <ol className="space-y-3">
      {DECLARATION_ITEMS.map((item) => {
        const checked = Boolean(ticked[item.id]);
        const basis = item.purpose
          ? CONSENT_PURPOSES.find((purpose) => purpose.id === item.purpose)?.basis
          : undefined;
        return (
          <li key={item.id}>
            <label
              className={cn(
                "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                checked ? "border-primary/50 bg-primary/5" : "border-border bg-card/40",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(item.id)}
                aria-describedby={`consent-${item.id}-text`}
                className="mt-1 size-4 shrink-0 rounded border-border text-primary focus:ring-ring"
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="instrument text-xs tabular-nums text-muted-foreground">
                    {item.number}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  {requiredIds.has(item.id) ? (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Optional
                    </span>
                  )}
                </span>
                <span
                  id={`consent-${item.id}-text`}
                  className="mt-1.5 block text-sm leading-relaxed text-muted-foreground"
                >
                  {item.text}
                </span>
                {showBasis && basis ? (
                  <span className="mt-2 block text-xs leading-relaxed text-muted-foreground/80">
                    Lawful basis: {basis}
                  </span>
                ) : null}
              </span>
            </label>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * What is on file for this person, and the button to take it back.
 */
export interface ConsentRecordPanelProps {
  summary: ConsentSummaryItem[];
  onWithdraw: (purpose: ConsentPurposeId) => void;
  onWithdrawAll: () => void;
  busy?: boolean;
  /** Shown when there is nothing on file yet. */
  emptyMessage?: string;
}

function formatWhen(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ConsentRecordPanel({
  summary,
  onWithdraw,
  onWithdrawAll,
  busy = false,
  emptyMessage = "No consent has been recorded for this account yet.",
}: ConsentRecordPanelProps) {
  const [confirmingAll, setConfirmingAll] = useState(false);
  const active = summary.filter((item) => item.record?.status === "GRANTED");
  const hasAny = summary.some((item) => item.record);

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-medium text-foreground">
          <ShieldCheck className="size-4 text-highlight" />
          Your consent record
        </h3>
        {active.length > 0 ? (
          confirmingAll ? (
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmingAll(false);
                  onWithdrawAll();
                }}
                disabled={busy}
                className="rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground disabled:opacity-60"
              >
                Withdraw everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmingAll(false)}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground"
              >
                Keep my consent
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingAll(true)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
            >
              <Undo2 className="size-3.5" />
              Withdraw all consent
            </button>
          )
        ) : null}
      </div>

      {!hasAny ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {summary.map((item) => {
            const record = item.record;
            const granted = record?.status === "GRANTED";
            return (
              <li
                key={item.purpose}
                className="flex flex-wrap items-start justify-between gap-3 border-t border-border pt-3"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {granted ? (
                      <CheckCircle className="size-4 shrink-0 text-status" />
                    ) : (
                      <XCircle className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {record
                      ? granted
                        ? `Granted ${formatWhen(record.grantedAt)} · wording version ${record.wordingVersion}`
                        : `Withdrawn ${formatWhen(record.withdrawnAt)} · granted ${formatWhen(record.grantedAt)}`
                      : "Not given"}
                  </p>
                </div>
                {granted ? (
                  <button
                    type="button"
                    onClick={() => onWithdraw(item.purpose)}
                    disabled={busy}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
                  >
                    Withdraw
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** The button that records the ticked statements. */
export function ConsentSubmitButton({
  busy,
  disabled,
  label = "Record my consent",
}: {
  busy: boolean;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className={cn(
        "cta-shine inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-colors disabled:opacity-60",
        !busy && "hover:bg-primary/90",
      )}
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
      {busy ? "Recording…" : label}
    </button>
  );
}
