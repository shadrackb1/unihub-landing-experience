# UniHub

**Verified student housing near Kenyan campuses.**

UniHub helps university students find hostels, bedsitters, single rooms, and shared apartments near campus. Listings are checked before they go live. Browse free, then message landlords or agents on WhatsApp. No account required to search.

Live repo: [github.com/shadrackb1/unihub-landing-experience](https://github.com/shadrackb1/unihub-landing-experience)

---

## Why UniHub

Finding a room near campus in Kenya often means scattered WhatsApp groups, unverified photos, and risky deposits. UniHub puts trusted inventory in one place:

| Promise | What it means |
| --- | --- |
| Verified listings | Landlord and property details reviewed before publish |
| Campus-first | Search by town and university, not generic city noise |
| Direct contact | WhatsApp or email to the person listing the room |
| Free to browse | No signup wall between a student and a home |

**User path:** Arrive → orient → trust → watch rooms → choose a listing → see the map → move.

---

## Product surface

| Route | What ships |
| --- | --- |
| `/` | Full marketing journey (hero, walkthrough, trust, films, listings, map, landlords) |
| `/listings` | Sample verified inventory with filters |
| `/about` | Brand story and pillars |
| `/contact` | WhatsApp + email |
| `/list-property` | Landlord and agent onboarding |
| `/privacy` · `/terms` | Legal stubs (expand before launch) |

### Homepage acts

1. **Arrive** — looping hero video, letter-animated headline, campus codes  
2. **Orient** — four-step flow + site walkthrough video  
3. **Believe** — verified / renter-focused / direct contact  
4. **Witness** — residence film strip  
5. **Choose** — featured listings + room video  
6. **Place** — live campus map  
7. **Move** — landlord CTA + final browse band  

---

## Tech stack

| Layer | Choice |
| --- | --- |
| App | TanStack Start + React 19 + TypeScript |
| Styling | Tailwind CSS 4, custom design tokens in `src/styles.css` |
| Routing | TanStack Router (file-based `src/routes/`) |
| Map | MapLibre GL — OpenFreeMap dark + Esri World Imagery (**no API keys**) |
| Video | Local MP4 assets, muted autoplay when in view |
| Hosting | Vercel (Nitro `vercel` preset → `.vercel/output`) |

Repo is connected to a [Lovable](https://lovable.dev) project. Commits on `main` sync to the editor. Do not rewrite published history.

---

## Quick start

**Requirements:** Node.js 20.11+ and npm.

```sh
git clone https://github.com/shadrackb1/unihub-landing-experience.git
cd unihub-landing-experience
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Use |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build (Vercel output) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Design system

Defined once in `src/styles.css` (oklch tokens).

| Token role | Direction |
| --- | --- |
| Background | Near-black (`#0A0A0A` family) |
| Primary CTA | White pill, black label, soft glow |
| Highlight | Scarce mint for verification accents |
| Display type | Space Grotesk |
| Body type | Inter |
| Surfaces | Glass cards, thin white borders, soft grain / orbs |

Motion is deliberate: hero letter reveal, scroll-linked section reveals, video play on enter. Everything respects `prefers-reduced-motion`.

**Copy rules:** plain product language. No UI instructions about loops or scroll. No empty marketing filler.

---

## Campus map

Free, keyless providers only:

| Mode | Provider |
| --- | --- |
| Dark (default) | [OpenFreeMap](https://openfreemap.org) dark vector style |
| Satellite | Esri World Imagery public tiles |

Markers cover Nairobi (UoN, Strathmore), Juja (JKUAT), Kahawa (Kenyatta), Thika, Kesses (Moi), Njoro (Egerton), and Nakuru. Attribution is required and shown on the map.

Implementation: `src/components/CampusMap.tsx`.

---

## Content & media

```
src/assets/          hero + listing photos + MP4 clips
src/data/listings.ts sample listings (KES / month)
src/components/      chrome, map, video, experience UI
src/routes/          pages
src/styles.css       tokens + utilities
```

Before launch:

1. Replace `WHATSAPP_URL` in `src/components/MarketingChrome.tsx`
2. Wire listings to live inventory
3. Finish privacy and terms
4. Optionally CDN-host large MP4s if mobile data is a concern

---

## Deploy (Vercel)

`vite.config.ts` pins Nitro to the **`vercel`** preset.

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Install | `npm install` |
| Build | `npm run build` |
| Output | `.vercel/output` |
| Node | 20.x or newer |

1. Import `shadrackb1/unihub-landing-experience` in Vercel  
2. Confirm the settings above  
3. Deploy  

Local check:

```sh
npm run build
# .vercel/output/static + .vercel/output/functions should exist
```

No map API keys are required on Vercel.

---

## Accessibility & quality

- Skip link and main landmark
- Visible focus rings
- Reduced-motion branch for animation and video autoplay
- Semantic sections and labeled controls
- Dark UI contrast on primary body copy

---

## Contributing

1. Branch from `main`
2. Keep the build green: `npm run build`
3. Prefer real product copy over template language
4. Keep map providers keyless unless a paid key is intentional
5. Normal commits + pushes keep Lovable in sync; avoid force-push on `main`

---

## License

Private project unless a license file is added. Map data remains under OpenStreetMap / Esri terms.

---

## Contact

- WhatsApp: set your number in `MarketingChrome.tsx`
- Email: `hello@unihub.ke` (placeholder)

UniHub — student housing in Kenya.
