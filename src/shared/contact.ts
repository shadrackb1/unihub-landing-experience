/**
 * Single source of truth for UniHub contact details.
 *
 * The WhatsApp number used to be hardcoded (as a placeholder) in half a
 * dozen files. Everything now derives from these values; override the number
 * per environment with VITE_WHATSAPP_NUMBER (digits only, country code first).
 */

const RAW_NUMBER = ((import.meta.env['VITE_WHATSAPP_NUMBER'] as string | undefined) || '254700000000')
  .replace(/[^0-9]/g, '');

/** Digits-only international number, e.g. 254700000000 */
export const WHATSAPP_NUMBER = RAW_NUMBER;

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Human display form, e.g. +254 700 000 000 */
export function formatWhatsAppNumber(): string {
  const n = WHATSAPP_NUMBER;
  if (n.length === 12 && n.startsWith('254')) {
    return `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`;
  }
  return `+${n}`;
}

/** Default support link used across marketing chrome. */
export const WHATSAPP_URL = waLink("Hi UniHub, I'd like help finding verified student housing");
