# UniHub

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/shadrackb1/unihub-landing-experience/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.11.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TanStack](https://img.shields.io/badge/TanStack-Start-FF6B35?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**Verified student housing near Kenyan campuses.**

UniHub helps university students find hostels, bedsitters, single rooms, and shared apartments near campus. Listings are checked before they go live. Browse free, then message landlords or agents on WhatsApp. No account required to search.

> **Live Demo:** [unihub.vercel.app](https://unihub.vercel.app)  
> **Repository:** [github.com/shadrackb1/unihub-landing-experience](https://github.com/shadrackb1/unihub-landing-experience)

---

## Why UniHub

Finding a room near campus in Kenya often means scattered WhatsApp groups, unverified photos, and risky deposits. UniHub puts trusted inventory in one place:

| Promise | What it means |
| --- | --- |
| **Verified listings** | Landlord and property details reviewed before publish |
| **Campus-first** | Search by town and university, not generic city noise |
| **Direct contact** | WhatsApp or email to the person listing the room |
| **Free to browse** | No signup wall between a student and a home |

**User path:** Arrive → Orient → Trust → Witness → Choose → Place → Move.

---

## ✨ Features

- 🎬 **Hero Video** — Looping background with letter-reveal animation
- 🧭 **7-Act Journey** — Structured funnel from arrival to conversion
- 🗺️ **Interactive Campus Map** — MapLibre GL with 8 Kenyan campus pins (OpenFreeMap + Esri, keyless)
- 📹 **Residence Video Gallery** — Scroll-linked autoplay, mute, loop, reduced-motion support
- 🏠 **Verified Listings** — Sample inventory with KES pricing, categories, availability badges
- 📱 **Responsive** — Mobile-first, works offline (local media), PWA-ready
- ♿ **Accessible** — Skip links, focus rings, semantic HTML, prefers-reduced-motion
- 🌙 **Dark-first Design** — Custom oklch tokens, glass cards, mint verification accent

---

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| **App Framework** | TanStack Start + React | 1.168 / 19 |
| **Routing** | TanStack Router (file-based) | 1.170 |
| **Styling** | Tailwind CSS 4 + CSS Variables | 4.2 |
| **Language** | TypeScript | 5.8 |
| **Build** | Vite 8 + Nitro (Vercel preset) | 8.1 / 3.0 |
| **Map** | MapLibre GL | 5.24 |
| **Map Tiles** | OpenFreeMap (dark) + Esri World Imagery | — |
| **Video** | Native `<video>` + IntersectionObserver | — |
| **Icons** | Lucide React | 0.575 |
| **UI Primitives** | Radix UI | 1.x |
| **Hosting** | Vercel (Nitro `vercel` preset) | — |
| **Editor Sync** | Lovable (GitHub `main` branch) | — |

---

## Quick Start

### Requirements
- Node.js **≥ 20.11.0**
- npm (or bun/pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/shadrackb1/unihub-landing-experience.git
cd unihub-landing-experience

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Production build (outputs to `.vercel/output`) |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Project Structure

```
unihub-landing-experience/
├── public/                 # Static assets (logo, favicon, ads)
├── src/
│   ├── assets/             # Hero video, listing photos, MP4 clips
│   ├── components/
│   │   ├── ui/             # Reusable UI primitives (Radix-based)
│   │   ├── CampusMap.tsx   # MapLibre map with campus pins
│   │   ├── Experience.tsx  # Act sections, scroll progress, journey rail
│   │   ├── LetterReveal.tsx # Hero letter animation
│   │   ├── ListingGrid.tsx # Listing cards grid
│   │   ├── MarketingChrome.tsx # Nav, footer, WHATSAPP_URL
│   │   ├── ResidenceVideoGallery.tsx # Horizontal film strip
│   │   └── VideoPanel.tsx  # Scroll-linked video + Reveal animations
│   ├── data/
│   │   └── listings.ts     # Sample listings (KES/month)
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   └── utils.ts        # cn() class helper
│   ├── routes/             # File-based routes (TanStack Router)
│   │   ├── __root.tsx      # Root layout + providers
│   │   ├── index.tsx       # Homepage (7 acts)
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   ├── listings.tsx
│   │   ├── list-property.tsx
│   │   ├── privacy.tsx
│   │   └── terms.tsx
│   ├── styles.css          # Design tokens + Tailwind theme
│   ├── router.tsx          # Router configuration
│   ├── server.ts           # Nitro server entry
│   └── start.ts            # App bootstrap
├── .github/workflows/      # CI/CD (optional)
├── DESIGN-BLUEPRINT.md     # Architecture + design spec
├── OFFLINE-README.md       # Offline USB package docs
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── bunfig.toml
```

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Full marketing journey (7 acts) |
| `/listings` | Sample verified inventory with filters |
| `/about` | Brand story and pillars |
| `/contact` | WhatsApp + email + coverage map |
| `/list-property` | Landlord/agent onboarding |
| `/privacy` | Privacy policy (stub) |
| `/terms` | Terms of service (stub) |

---

## Homepage Acts (7-Section Funnel)

| Act | ID | Title | Key Components |
| --- | --- | --- | --- |
| **I** | `top` | **Arrive** | Hero video, `LetterReveal`, campus code rail |
| **II** | `how-it-works` | **Orient** | 4-step journey, walkthrough `VideoPanel` |
| **III** | `trust` | **Believe** | 3 trust pillars (Verified, Renter-focused, Direct) |
| **IV** | `residences` | **Witness** | Qwetu documentary + `ResidenceVideoGallery` |
| **V** | `listings` | **Choose** | Featured listings grid + `CoolVideoCard` |
| **VI** | `locations` | **Place** | `CampusMap` + location chips |
| **VII** | `close` | **Move** | Landlord CTA + final browse band |

---

## Campus Map

Free, keyless providers — **no API keys required**.

| Mode | Provider | Attribution |
| --- | --- | --- |
| **Dark (default)** | [OpenFreeMap](https://openfreemap.org) | © OpenStreetMap · OpenFreeMap |
| **Satellite** | Esri World Imagery | © Esri, Maxar, Earthstar Geographics |

**Covered campuses:** UoN (Nairobi), JKUAT (Juja), KU (Kahawa), SU (Madaraka), THK (Thika), MU (Kesses), EGU (Njoro), NKU (Nakuru).

Implementation: [`src/components/CampusMap.tsx`](src/components/CampusMap.tsx)

---

## Design System

Defined once in [`src/styles.css`](src/styles.css) using oklch color space.

| Token | Role | Value |
| --- | --- | --- |
| `--background` | Site canvas | Near-black `#0A0A0A` |
| `--panel` / `--card` | Elevation surfaces | Glass cards with border |
| `--foreground` | Primary text | White |
| `--muted-foreground` | Secondary copy | Muted white |
| `--primary` | CTA fill | White (text: black) |
| `--highlight` | Verification accent | Mint (scarce usage) |
| `--status` | Available badge | Green |
| `--border` | Dividers | White @ ~10% opacity |
| `--radius` | Corner radius | 1.5rem base → 3xl cards |
| **Display font** | Headlines | Space Grotesk |
| **Body font** | Copy | Inter |

**Motion:** Hero letter stagger, scroll reveals, viewport-linked video autoplay. All gated by `prefers-reduced-motion`.

---

## Accessibility & Quality

- ✅ Skip link + `#main` landmark
- ✅ Visible focus rings on all interactive elements
- ✅ `prefers-reduced-motion` respected (animations + video)
- ✅ Tap targets ≥ 44px on mobile
- ✅ Contrast: white on near-black, mint on large UI only
- ✅ Semantic sections, labeled controls, `aria-*` attributes
- ✅ Video controls present; decorative hero is `aria-hidden`

---

## Deployment (Vercel)

`vite.config.ts` pins Nitro to the **`vercel`** preset.

| Setting | Value |
| --- | --- |
| Framework Preset | **Other** |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `.vercel/output` |
| Node Version | 20.x or newer |

### Deploy Steps

1. Import `shadrackb1/unihub-landing-experience` in Vercel
2. Confirm settings above
3. Deploy

### Local Production Check

```bash
npm run build
# Verify .vercel/output/static + .vercel/output/functions exist
```

> **No map API keys required** on Vercel — tiles load client-side from free providers.

---

## Content & Media

```
src/assets/           # Hero video, listing photos, MP4 clips
src/data/listings.ts  # Sample listings (KES/month)
src/components/       # Chrome, map, video, experience UI
src/routes/           # Page routes
src/styles.css        # Design tokens + utilities
public/               # Logo, favicon, ads/
```

### Pre-Launch Checklist

- [ ] Replace `WHATSAPP_URL` in `src/components/MarketingChrome.tsx` (currently `254700000000`)
- [ ] Connect live listings API (replace `sampleListings`)
- [ ] Publish full `/privacy` and `/terms` pages
- [ ] Optional: Vendor map tiles for fully offline maps
- [ ] Optional: CDN-host large MP4s for mobile data savings

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Branch from `main`** — Create feature branches for all changes
2. **Keep the build green** — Run `npm run build` before pushing
3. **Write real copy** — Prefer product language over template filler
4. **Keep map providers keyless** — Unless a paid key is intentional
5. **Normal commits + pushes** — Keep Lovable in sync; avoid force-push on `main`

### Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feat/your-feature

# 2. Make changes, run dev server
npm run dev

# 3. Verify build passes
npm run build

# 4. Lint & format
npm run lint && npm run format

# 5. Commit with conventional messages
git commit -m "feat: add campus filter to listings page"

# 6. Push and open PR
git push origin feat/your-feature
```

---

## License

Private project unless a license file is added. Map data remains under [OpenStreetMap](https://www.openstreetmap.org/copyright) / [Esri](https://www.esri.com/en-us/legal/terms/full-master-agreement) terms.

---

## Contact & Support

- **WhatsApp:** Set your number in `src/components/MarketingChrome.tsx`
- **Email:** `hello@unihub.ke` (placeholder)
- **Issues:** [GitHub Issues](https://github.com/shadrackb1/unihub-landing-experience/issues)
- **Discussions:** [GitHub Discussions](https://github.com/shadrackb1/unihub-landing-experience/discussions)

---

## Acknowledgements

- **MapLibre GL** — Open-source map rendering
- **OpenFreeMap** — Free vector tile hosting
- **Esri** — World Imagery basemap
- **TanStack** — Router, Query, Start, and ecosystem
- **Radix UI** — Accessible component primitives
- **Tailwind CSS** — Utility-first styling
- **Lucide** — Beautiful icons
- **Vercel** — Hosting and edge network

---

<div align="center">

**UniHub** — Student housing in Kenya.

[⬆ Back to top](#unihub)

</div>