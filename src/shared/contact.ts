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

/**
 * UniHub's own WhatsApp line. VITE_WHATSAPP_NUMBER overrides it per deployment
 * (for example on Vercel) without a code change.
 */
const DEFAULT_WHATSAPP_NUMBER = "0746063175";

const RAW_NUMBER = normalize(
  (import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined) || DEFAULT_WHATSAPP_NUMBER,
);

/**
 * Turns what people type (0746 063 175, +254 746 063 175, 746063175) into the digits-only
 * international form 254746063175, or null when it is not a Kenyan mobile number.
 */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = normalize(input.trim());
  return /^254[17][0-9]{8}$/.test(digits) ? digits : null;
}

/** Display form for a stored number, e.g. +254 746 063 175. Falls back to the raw text. */
export function formatKenyanPhone(input: string): string {
  const n = normalizeKenyanPhone(input);
  return n ? `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}` : input;
}

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


export interface ListingContactInfo {
  title: string;
  location: string;
  price?: string;
  whatsapp?: string;
  phone?: string;
}

export interface ListingContact {
  /** wa.me link to the agent, to UniHub's line, or an email draft as the last resort. */
  whatsappHref: string;
  /** True when the link opens WhatsApp (as opposed to the email fallback). */
  isWhatsApp: boolean;
  /** tel: link, only when the listing has its own agent phone number. */
  callHref: string | null;
  /** Number shown to the visitor, e.g. +254 746 063 175. Null when nothing is configured. */
  display: string | null;
  /** True when the visitor is writing to the listing's own agent rather than to UniHub. */
  direct: boolean;
}

/** Everything a listing card or page needs to let a student contact the agent. */
export function listingContact(listing: ListingContactInfo): ListingContact {
  const agentWa = normalizeKenyanPhone(listing.whatsapp ?? "") ?? normalizeKenyanPhone(listing.phone ?? "");
  const agentPhone = normalizeKenyanPhone(listing.phone ?? "") ?? agentWa;
  const where = listing.location ? ` (${listing.location})` : "";
  const cost = listing.price ? ` listed at ${listing.price} per month` : "";
  const message = `Hi, I found "${listing.title}"${where}${cost} on UniHub. Is it still available?`;

  if (agentWa) {
    return {
      whatsappHref: `https://wa.me/${agentWa}?text=${encodeURIComponent(message)}`,
      isWhatsApp: true,
      callHref: agentPhone ? `tel:+${agentPhone}` : null,
      display: formatKenyanPhone(agentWa),
      direct: true,
    };
  }
  const href = waLink(message);
  return {
    whatsappHref: href,
    isWhatsApp: isWhatsAppLink(href),
    callHref: null,
    display: formatWhatsAppNumber(),
    direct: false,
  };
}
