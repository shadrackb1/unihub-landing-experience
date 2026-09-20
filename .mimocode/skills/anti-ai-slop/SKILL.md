---
name: anti-ai-slop
description: >-
  Bundled anti-AI-slop skill for writing and UI copy. Use on any site, README,
  product page, email, or docs where output must not read as machine-generated.
  Triggers on "anti-slop", "de-AI", "sounds like AI", "too many em dashes",
  "humanize copy", "fix AI language", or any rewrite of marketing/UI text.
---

# Anti-AI-Slop (bundled)

One skill for shipping text and interface copy that does not look generated.
Bundles writing rules (jalaalrd/anti-ai-slop-writing), verification discipline
(misbahsy/anti-ai-slop), and design-copy anti-patterns (Nutlope/hallmark).

Always load [references/banned-words.md](references/banned-words.md) before rewriting.

## Modes

- **Scrub** (default): rewrite in place. Keep meaning, facts, and brand voice.
- **Audit**: list patterns with short fixes. Do not rewrite unless asked.
- **UI pass**: product/marketing copy only. No meta-commentary about the interface.

Never claim authorship detection. Name patterns, not "this is AI."

## Hard rules

1. **Em dashes: max one per 500 words.** Prefer commas, periods, colons, parentheses.
2. **No banned words** from the references list (seamless, journey-as-marketing, elevate, leverage, delve, vibrant, robust, curated-as-filler, etc.).
3. **No "Not just X, but Y"** and no "It's not just about X — it's about Y."
4. **No rule of three by default.** Break lists into 2, 4, or uneven items when content allows.
5. **No parataxis stacks.** Connect ideas. Short. Then another. Then another. is slop.
6. **No uniform sentence length.** Mix short and long.
7. **No UI instruction copy.** Do not explain "loop," "scroll," "autoplay," or how controls work unless the user asked for help text.
8. **No fabricated metrics, testimonials, or campus claims.** Use real sample data or omit.
9. **Active voice.** "We verify listings." not "Listings are considered verified."
10. **Contractions over stiff formality** when the brand is student-facing.

## UI / design copy rules (Hallmark subset)

- No italic display headlines. Emphasis via weight or color tokens only.
- No invented social proof ("10,000+ happy students") unless real.
- CTAs name the action: Browse Listings, List your property, Open WhatsApp.
- Eyebrows are short labels, not slogans that restate the H1.
- Footer legal text stays plain.
- Page titles use a middle dot or colon if needed: `Listings · UniHub`. Not em-dash stacks.

## Scrub loop

1. Read the full draft or file set.
2. Mark facts to keep (prices, campuses, product claims).
3. Rewrite claim by claim, not sentence by sentence.
4. Replace em dashes and banned phrases.
5. Self-check:
   - Any banned word? Replace.
   - More than one em dash in this page? Cut extras.
   - Meta UI instructions? Delete.
   - Three similar short lines? Merge or vary.
   - Sounds like every SaaS landing page? Add concrete Kenya/student detail already in the product.
6. Build/lint if code changed. Ship.

## UniHub-specific notes

- Product: verified student housing in Kenya. Campuses include UoN, JKUAT, Kenyatta, Moi, Egerton, Strathmore.
- Voice: direct, student-facing, calm. Trust over hype.
- WhatsApp number is a placeholder until launch; do not invent a real one.
- Sample prices use KES with monthly format.

Apply rules silently. Do not narrate this skill in user-facing site copy.
