<h1 align=center>UniHub</h1>
<p align=center>
  <strong>Verified student housing platform for Kenyan university campuses.</strong>
  <br />
  <em>TanStack Start · React 19 · Tailwind CSS v4 · MapLibre GL · Vercel</em>
</p>

<p align=center>
  <a href=#quick-start><img src=https://img.shields.io/badge/Quick_Start-4CAF50?style=for-the-badge alt=Quick Start /></a>
  <a href=#license--contact><img src=https://img.shields.io/badge/License-Private-informational?style=for-the-badge alt=License /></a>
</p>

<p align=center>
  <img src=https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js&logoColor=white alt="Node.js" />
  <img src=https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white alt="TypeScript" />
  <img src=https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white alt="React" />
  <img src=https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white alt="Tailwind CSS" />
  <img src=https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white alt="Vite" />
  <img src=https://img.shields.io/badge/TanStack_Start-1.168-000000?style=flat&logo=tanstack&logoColor=white alt="TanStack Start" />
  <img src=https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white alt="Vercel" />
</p>

<p align=center>
  <a href=README.md>English</a>
</p>

---

## Architecture

![Architecture](docs/architecture-diagram.png)

### Route Map

<img src=docs/routes-architecture.svg alt=Route map width=100% />

### Backend and Data Layer

<img src=docs/backend-architecture.svg alt=Backend architecture width=100% />

### Legacy SPA Internals

<img src=docs/legacy-spa-architecture.svg alt=Legacy SPA architecture width=100% />

### 7-Act Funnel — Animated

<img src=docs/funnel-animated.svg alt="7-Act Funnel animated" width="100%" />

### Interactive Campus Map — Data Flow

<img src=docs/map-dataflow-animated.svg alt="Interactive Campus Map data flow" width="100%" />

### Video Panel — Viewport-Aware Autoplay

<img src=docs/video-panel-animated.svg alt="VideoPanel viewport-aware autoplay" width="100%" />

---

## Features

| Feature             | Description                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| Verified Listings   | Property and landlord details are vetted before publication to ensure authenticity.                             |
| Campus-First Search | Search structured by specific university towns (Nairobi, Juja, Kahawa, Madaraka, Thika, Kesses, Njoro, Nakuru). |
| Direct Contact      | One-tap WhatsApp or email connection to verified listing agents and landlords.                                  |
| Zero Friction       | Free to browse with no mandatory signup or paywall between students and housing.                                |
| Offline Ready       | Fully functional offline presentation package for field demos and local deployments.                            |
| Interactive Map     | Keyless MapLibre GL integration with OpenFreeMap and Esri World Imagery tiles.                                  |

---

## Quick Start

### Prerequisites

- Node.js 20.11.0 or higher
- npm 10+ or bun

### Install

```bash
git clone https://github.com/shadrackb1/unihub-landing-experience.git
cd unihub-landing-experience
npm install
```

### Run

```bash
npm run dev
```

The development server starts at `http://localhost:3000`.

---

## Project Structure

```
unihub-landing-experience/
””” public/                       # Static assets (logo, favicon, ad materials)
”‚   ””” logo.svg                  # Horizontal wordmark with monogram
”‚   ””” logo-mark.svg             # Monogram-only variant
”‚   ”””” favicon.svg               # 6464 rounded square with monogram
””” src/
”‚   ””” assets/                   # Local MP4 videos and listing images
”‚   ””” components/               # Core UI experience components
”‚   ”‚   ””” ui/                   # Reusable UI primitives (buttons, cards, dialogs)
”‚   ”‚   ””” CampusMap.tsx         # MapLibre GL keyless map with university pins
”‚   ”‚   ””” Experience.tsx        # Journey timeline and act scroll navigation
”‚   ”‚   ””” LetterReveal.tsx      # Staggered typography animations
”‚   ”‚   ””” ListingGrid.tsx       # Housing card grid component
”‚   ”‚   ””” Logo.tsx              # SVG Logo and Mark components
”‚   ”‚   ””” MarketingChrome.tsx   # Header navigation and footer chrome
”‚   ”‚   ””” ResidenceVideoGallery.tsx  # Residence video clip showcase
”‚   ”‚   ”””” VideoPanel.tsx        # Viewport-aware autoplay video container
”‚   ””” data/                     # Data definitions and mock listings
”‚   ”‚   ”””” listings.ts           # Sample verified property listings and types
”‚   ””” hooks/                    # Custom React hooks
”‚   ”‚   ”””” use-mobile.tsx        # Responsive viewport detection hook
”‚   ””” lib/                      # Utilities and error reporting
”‚   ”‚   ””” error-capture.ts      # Server-side and browser error interceptor
”‚   ”‚   ””” error-page.ts         # Standard error response formatter
”‚   ”‚   ””” error-reporting.ts    # Client-side runtime error reporting
”‚   ”‚   ”””” utils.ts              # Tailwind class merging utility (cn)
”‚   ””” routes/                   # File-based TanStack Router pages
”‚   ”‚   ””” __root.tsx            # Root layout shell (HTML, Head, Meta, Body)
”‚   ”‚   ””” index.tsx             # Homepage (7-Act experience)
”‚   ”‚   ””” listings.tsx          # Browse listings page
”‚   ”‚   ””” about.tsx             # About brand page
”‚   ”‚   ””” contact.tsx           # Contact and WhatsApp page
”‚   ”‚   ””” list-property.tsx     # Landlord onboarding page
”‚   ”‚   ””” privacy.tsx           # Privacy policy page
”‚   ”‚   ”””” terms.tsx             # Terms of service page
”‚   ””” router.tsx                # TanStack Router instance creation
”‚   ””” server.ts                 # Nitro server entrypoint with error recovery
”‚   ””” start.ts                  # TanStack Start handler
”‚   ”””” styles.css                # OKLCH design tokens and Tailwind v4 utilities
””” docs/                         # Documentation and architecture diagrams
”‚   ””” architecture-diagram.png
”‚   ””” routes-architecture.svg
”‚   ””” backend-architecture.svg
”‚   ”””” legacy-spa-architecture.svg
””” DESIGN-BLUEPRINT.md           # System design and architecture specification
””” OFFLINE-README.md             # Offline USB presentation guide
””” package.json
””” tsconfig.json
””” vite.config.ts
””” vercel.json
”””” eslint.config.js
```

---

## Tech Stack

### Frontend

| Technology      | Purpose                                 |
| --------------- | --------------------------------------- |
| TanStack Start  | Full-stack React framework with SSR     |
| React 19        | UI library                              |
| TypeScript      | Type-safe development                   |
| Tailwind CSS v4 | Utility-first styling with OKLCH tokens |
| MapLibre GL     | Interactive campus map (no API keys)    |
| Radix UI        | Accessible UI primitives                |
| Lucide Icons    | Icon system                             |

### Build & Infrastructure

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| Vite 8            | Build tool and dev server           |
| Nitro 3           | Server output and deployment preset |
| TanStack Router   | File-based routing                  |
| Vercel            | Hosting and deployment              |
| ESLint + Prettier | Code quality and formatting         |

---

## Deployment

### Vercel

The application deploys to Vercel using Nitro's `vercel` preset.

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

**vercel.json Configuration**

```json
{
  $schema: https://openapi.vercel.sh/vercel.json,
  framework: null,
  buildCommand: npm run build,
  outputDirectory: .vercel/output,
  installCommand: npm install,
  devCommand: npm run dev,
  regions: [iad1]
}
```

### Deployment Steps

1. Import `shadrackb1/unihub-landing-experience` into Vercel.
2. Set Node.js runtime to `20.x`.
3. Confirm build command `npm run build` and output directory `.vercel/output`.
4. Deploy. No environment variables or map API keys are required.

---

## Accessibility & Quality Gates

- **Semantic HTML** — Proper sectioning with `<header>`, `<main>`, `<section>`, `<nav>`, and `<footer>` landmarks.
- **Keyboard Navigation** — Skip-to-main-content links, visible focus rings, full keyboard control on map buttons and dialogs.
- **Motion Gated** — All scroll-linked reveals, letter animations, and video autoplays respect `prefers-reduced-motion`.
- **Target Sizes** — Interactive buttons and links meet minimum 44×44 px touch targets.
- **Code Quality** — `npm run lint` and `npm run build` must pass before merging.

---

## License & Contact

- **License** — Private project. All map data remains subject to OpenStreetMap and Esri license terms.
- **WhatsApp Support** — Configurable via `WHATSAPP_URL` in `src/shared/components/MarketingChrome.tsx`
- **Email** — `hello@unihub.ke`

---

## Recent Maintenance (2026-10-29)

### Code Quality Improvements
- **Removed all `@ts-nocheck` directives** from 40+ legacy TypeScript files
- **Fixed type safety** across core modules: Firestore services, error reporting, auth context, media optimization
- **Eliminated `any` type annotations** in shared/services, infrastructure, features, and admin pages
- **Applied Prettier formatting** to 33+ files (CRLF → LF line endings)
- **ESLint now passes with 0 errors** on the new TanStack Start landing experience (only 4 fast-refresh warnings)

### Security & Architecture
- Firebase configuration now uses environment variables (`VITE_FIREBASE_*`) in shared library
- Legacy SPA (`/app`) separated from modern landing experience (`/`) with proper mounting
- CSP-ready: no inline scripts, no `eval()`, no unsafe patterns
- All external links use `rel="noreferrer"` and proper target handling

### Build & Deployment
- ✅ Production build passes for Vercel (Nitro preset)
- ✅ TypeScript compilation clean on new architecture
- ✅ Bundle analysis: main chunks optimized, legacy code isolated

---

_UniHub — Verified student housing near Kenyan campuses._
