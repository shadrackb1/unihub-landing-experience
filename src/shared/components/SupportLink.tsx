import type { ReactNode } from "react";
import { isWhatsAppLink, waLink } from "@/shared/contact";

interface Props {
  /** Prefilled message for the support conversation. */
  message: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/**
 * Support action that works with or without WhatsApp configured.
 *
 * Falls back to an email draft when VITE_WHATSAPP_NUMBER is unset, so the
 * link is never a dead wa.me URL pointing at a placeholder number. Only
 * genuinely external links get target/rel.
 */
export function SupportLink({ message, className, children, ...rest }: Props) {
  const href = waLink(message);
  const external = isWhatsAppLink(href);
  return (
    <a
      href={href}
      className={className}
      aria-label={rest["aria-label"]}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
