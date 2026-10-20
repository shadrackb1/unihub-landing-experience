/**
 * Single source of truth for UniHub contact details.
 *
 * The WhatsApp number used to be hardcoded (as a placeholder) in half a
 * dozen files. Everything now derives from these values; override the number
 * per environment with VITE_WHATSAPP_NUMBER (digits only, country code first).
 *
 * If no number is configured, the site must not pretend otherwise: a
 * `254700000000`-style placeholder looks like a real contact but reaches
 * nobody. In that state every support action falls back to email and the
 * number is never printed.
 */

const PLACEHOLDER_NUMBER = "254700000000";

/** The team inbox, used whenever WhatsApp is unavailable. */
export const SUPPORT_EMAIL = "hello@unihub.ke";

function normalize(input: string): string {
  const digits = input.replace(/[^0-9]/g, "");
  // Local Kenyan format (0712 345 678) is what people usually paste.
  if (digits.length === 10 && digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

const RAW_NUMBER = normalize((import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined) || "");

/** True once a real support number is set for this deployment. */
export const WHATSAPP_CONFIGURED = RAW_NUMBER.length >= 11 && RAW_NUMBER !== PLACEHOLDER_NUMBER;

/** Digits-only international number, e.g. 254712345678. Empty when unset. */
export const WHATSAPP_NUMBER = WHATSAPP_CONFIGURED ? RAW_NUMBER : "";

/** Human display form, e.g. +254 712 345 678. Null when unconfigured. */
export function formatWhatsAppNumber(): string | null {
  const n = WHATSAPP_NUMBER;
  if (!n) return null;
  if (n.length === 12 && n.startsWith("254")) {
    return `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`;
  }
  return `+${n}`;
}

export interface SupportAction {
  href: string;
  /** Opens a different app/tab, so the anchor gets target + rel. */
  external: boolean;
  label: string;
}

/** WhatsApp deep link when configured, otherwise an email draft. */
export function waLink(message: string): string {
  if (WHATSAPP_CONFIGURED) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("UniHub support")}&body=${encodeURIComponent(message)}`;
}

/** True when `waLink` produced a wa.me link rather than the email fallback. */
export function isWhatsAppLink(href: string): boolean {
  return href.startsWith("https://wa.me/");
}

/** Label for a support action, e.g. "WhatsApp support" or "Email support". */
export const SUPPORT_LABEL = WHATSAPP_CONFIGURED ? "WhatsApp support" : "Email support";

/** Default support action used across marketing chrome and account screens. */
export const SUPPORT_ACTION: SupportAction = {
  href: waLink("Hi UniHub, I'd like help finding verified student housing"),
  external: WHATSAPP_CONFIGURED,
  label: SUPPORT_LABEL,
};

/** Default support link used across marketing chrome. */
export const WHATSAPP_URL = SUPPORT_ACTION.href;
