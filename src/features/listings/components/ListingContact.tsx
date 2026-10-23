import { MessageCircle, Phone } from "lucide-react";
import { listingContact, type ListingContactInfo } from "@/shared/contact";

/**
 * "Chat on WhatsApp" and "Call" actions for a listing.
 *
 * Opens the listing's own agent when the listing carries a number, otherwise UniHub's line with
 * the listing already named in the message. The WhatsApp green is the brand colour of the
 * destination app, so the button is recognisable at a glance.
 */
export function ListingContact({
  listing,
  size = "card",
}: {
  listing: ListingContactInfo;
  size?: "card" | "detail";
}) {
  const contact = listingContact(listing);
  const height = size === "detail" ? "min-h-12 px-6 text-sm" : "min-h-11 px-4 text-sm";
  const external = contact.isWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <div className={size === "detail" ? "flex flex-col gap-3" : "flex gap-2"}>
      <a
        href={contact.whatsappHref}
        {...external}
        aria-label={`${contact.isWhatsApp ? "Chat on WhatsApp" : "Email"} about ${listing.title}${contact.isWhatsApp ? " (opens WhatsApp)" : ""}`}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-black transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${height}`}
      >
        <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
        {contact.isWhatsApp ? "Chat on WhatsApp" : "Email about this place"}
      </a>
      {contact.callHref ? (
        <a
          href={contact.callHref}
          aria-label={`Call about ${listing.title}`}
          className={`inline-flex items-center justify-center gap-2 rounded-full border border-border bg-accent font-semibold text-foreground hover:bg-secondary ${height}`}
        >
          <Phone className="size-4 shrink-0" aria-hidden="true" />
          {size === "detail" ? "Call the agent" : "Call"}
        </a>
      ) : null}
      {size === "detail" && contact.display ? (
        <p className="text-center text-xs text-muted-foreground">
          {contact.direct ? "Agent" : "UniHub"} · {contact.display}
        </p>
      ) : null}
    </div>
  );
}
