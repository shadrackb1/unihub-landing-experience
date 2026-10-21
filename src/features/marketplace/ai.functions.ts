import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  title: z.string().max(200).default(""),
  type: z.string().max(60).default(""),
  campus: z.string().max(120).default(""),
  location: z.string().max(200).default(""),
  price: z.string().max(30).default(""),
  deposit: z.string().max(30).default(""),
  amenities: z.string().max(600).default(""),
  notes: z.string().max(1200).default(""),
  tone: z.enum(["clear", "safety", "budget"]).default("clear"),
});

const TONES = {
  clear: "direct and clear",
  safety: "reassuring, emphasising security and safety",
  budget: "value-focused, emphasising affordability",
};

export const draftListingDescription = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    const facts = [
      ["Title", data.title],
      ["Type", data.type],
      ["Near campus", data.campus],
      ["Location", data.location],
      ["Rent (KES/month)", data.price],
      ["Deposit (KES)", data.deposit],
      ["Amenities", data.amenities],
      ["Landlord notes", data.notes],
    ]
      .filter(([, v]) => (v ?? "").trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    if (!facts) return { text: "", error: "Add a few property details first." };
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "You write rental listing descriptions for UniHub, a verified student housing platform in Kenya. " +
          "Write for university students and parents. Use plain, confident language, 90-150 words, 2 short paragraphs, then a short bullet list of key features. " +
          "Mention campus proximity, what's included (water, Wi-Fi, electricity tokens, security) only if provided. " +
          "Never invent facts, prices, distances or amenities not given. No emojis, no hype, no all-caps. Output plain text only.",
        input: `Tone: ${TONES[data.tone]}\n\nProperty details:\n${facts}`,
      });
      const r = res as unknown as {
        output_text?: string;
        output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
      };
      const text =
        r.output_text ??
        (r.output ?? [])
          .flatMap((o) => o.content ?? [])
          .filter((c) => c.type === "output_text")
          .map((c) => c.text ?? "")
          .join("");
      if (!text.trim())
        return { text: "", error: "The assistant returned an empty draft. Please try again." };
      return { text: text.trim(), error: null as string | null };
    } catch (e) {
      console.error("draftListingDescription failed", e);
      if (e instanceof GatewayError && e.httpStatus === 429)
        return { text: "", error: "Too many requests right now. Please wait a moment." };
      if (e instanceof GatewayError && e.httpStatus === 402)
        return { text: "", error: "AI credits are used up. Please top up to keep drafting." };
      return { text: "", error: "Couldn't draft a description. Please try again." };
    }
  });
