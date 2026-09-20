# UniHub Landing Experience

Build a high-converting marketing landing page for **UniHub** — a premium student housing platform for Kenya. Students browse verified hostels, bedsitters, and rentals near university campuses, then contact landlords/agents directly via WhatsApp or email. Browsing should not require an account.

## Product & audience

- Brand name: UniHub (also known as UniHUbKe)

- Tagline direction: “Find your perfect home.”

- Audience: Kenyan university students (and parents) who are tired of scams, fake listings, and scattered info

- Core promise: safe, verified, campus-adjacent housing with transparent pricing and direct agent contact

- Trust pillars (must appear on the page):

  1. Verified Listings — every listing and landlord is vetted

  2. Renter-Focused — housing options built for student life and short commutes

  3. Direct Contact — WhatsApp/email, no account required to find a home

- User journey to reinforce visually: Find home → Browse verified listings → Pick a listing → Chat with an agent

- Pricing context: properties have price + optional deposit; show sample cards with realistic Kenyan student-housing formats (e.g. “KES 8,500 / month”, “Bedsitter near JKUAT”, “Hostel room — shared facilities”)

- Sample featured categories: Hostels, Bedsitters, Single rooms, Shared apartments, University-area rentals

- Sample universities/campuses to mention: University of Nairobi, JKUAT, Kenyatta University, Moi, Egerton, Strathmore — use as social proof / “popular near campus” chips, not as hard claims

## Page goal & CTAs

Primary CTA: **Browse Listings** (pill button, high contrast)

Secondary CTA: **List your property** / **Become a partner** (for landlords/agents)

Tertiary: WhatsApp contact for support

Primary conversion path: land → trust → proof → browse

## Design system (match UniHub’s existing brand)

- Style anchor: premium dark marketplace — Apple-adjacent restraint + fintech trust; NOT colorful student-portal energy

- Background: near-black #0A0A0A / #030303; elevated cards on #121212 / glass white/5

- Ink: pure white primary text; muted body at white/50–70

- Accent: monochrome white CTAs (black text on white pills). Optional single soft accent glow only if needed for map/highlight — keep it scarce

- Surfaces: glassmorphism (backdrop blur, white/5 fill, white/10 borders), large soft blurred orbs, subtle film grain

- Typography:

  - Display / headings: Space Grotesk (medium weight), large scale, tight tracking

  - Body / UI: Inter

  - Hero headline should be huge (display scale), short, period-ended: “Find your perfect home.”

- Components: rounded-3xl cards, pill CTAs with subtle shine/sweep on hover, soft white outer glow on primary button

- Motion: refined entrance fades/up-staggers; parallax or gentle scroll reveals on hero media; no gimmicky bounce

- Mood: premium, calm, trustworthy, campus-real — not corporate real-estate brochure

## Sections (build in this order)

1. **Nav**

   - Logo wordmark “UniHub”

   - Links: Listings, Hostels, About, Contact

   - CTA: Browse Listings (pill)

   - Sticky, translucent on scroll

2. **Hero**

   - Full-viewport dark hero with soft background media treatment (campus housing / student life imagery at low opacity + dark gradient + grain)

   - H1: “Find your perfect home.”

   - Sub: “Verified student hostels, bedsitters, and rentals near campus — without the scams.”

   - Primary CTA: Browse Listings

   - Secondary text link: How it works

   - Optional trust strip under CTA: “Verified landlords · No account to browse · Contact via WhatsApp”

3. **How it works** (4 steps, horizontal on desktop)

   - 01 Find your perfect home

   - 02 Browse through verified listings

   - 03 Pick a listing

   - 04 Chat with an agent

   - Clean numbered cards on dark glass; keep copy short

4. **Trust / value props**

   - Heading: “Designed for students. Built for trust.”

   - 3 cards:

     - Verified Listings

     - Renter Focused

     - Direct Contact

   - Use simple line icons (shield, graduation cap, message)

5. **Featured listings**

   - Heading: “Featured near campus”

   - “View all listings →” link

   - 3–6 property cards (placeholder data is fine if not wired to a backend):

     - Image, title, location, category tag, price/month, status badge (Available)

     - Card hover lift

     - CTA on card: View details

   - Example data:

     - “Modern Bedsitter — Juja Town” · Near JKUAT · KES 9,500/mo

     - “Secure Hostel Room — Gendered wing” · Near UoN · KES 7,200/mo

     - “Spacious Single Room — Kahawa” · Near Kenyatta University · KES 8,000/mo

6. **Map / locations teaser**

   - Heading: “Housing near your campus”

   - City/university chips: Nairobi, Juja, Thika, Eldoret, Nakuru…

   - Static map visual or abstract dark map card with pins — even if non-interactive

   - CTA: Explore listings by location

7. **Social proof / anti-scam statement**

   - Short bold line: “No more housing scams.”

   - Supporting paragraph on vetting process + tenant safety

   - Optional stats placeholders: “X+ verified listings”, “Y campuses covered”, “Direct agent contact”

8. **For landlords / agents**

   - Split section: “List property. Reach students who are ready to move.”

   - Bullets: verified badge, direct WhatsApp leads, campus-targeted exposure

   - CTA: List your property

9. **Final CTA band**

   - Large centered: “Your next home is already listed.”

   - Button: Browse Listings

   - Microcopy: Free to browse · Contact agents directly

10. **Footer**

    - UniHub mark + short blurb

    - Columns: Product (Listings, Hostels, Map), Company (About, Contact), Legal (Privacy, Terms)

    - Social / WhatsApp

    - © UniHub — Premium student housing in Kenya

## Copy voice

- Short, confident, calm

- Prefer concrete student language over generic real-estate jargon

- Always reinforce safety + speed + no-account browsing

- Use “campus”, “hostel”, “bedsitter”, “landlord/agent”, “verified”

## Technical / Lovable build notes

- Single-page marketing landing page (React + Tailwind is fine)

- Fully responsive: mobile-first; hero and cards must look premium on phone

- Semantic HTML, accessible buttons/links, good contrast on dark UI

- Smooth scroll anchors for nav items

- Google Fonts: Space Grotesk + Inter

- Dark mode only (match brand)

- Use high-quality stock imagery style: real student housing exteriors/interiors, East African campus-adjacent vibe if possible — avoid cliché Western dorm clichés

- Placeholder links for now: /listings, /about, /contact, /list-property

- No backend required for v1; static featured listings with hardcoded sample data

- Optional later: wire featured cards to a real listings API

## Do / Don’t

- DO keep whitespace generous and headlines large

- DO keep CTAs obvious and repeated (hero, mid-page, footer)

- DO feel premium and trustworthy

- DON’T use bright multicolor gradients or childish illustrations

- DON’T require signup CTAs above the fold

- DON’T invent fake reviews with real-looking full names unless clearly sample

- DON’T clutter the hero with search filters on v1 (browse CTA is enough; search can come later)

Deliver a polished, production-feeling landing page that could ship as UniHub’s public homepage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6df20188-3834-4b7d-b8ba-fbcff9e78846).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
