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

![Architecture](https://gitdiagram.com/shadrackb1/unihub-landing-experience)

> **System Overview** — The diagram above visualizes the UniHub codebase architecture generated from the live repository.

### Landlord Portal
- **Landlord accounts** — `landlordService.ts` handles landlord registration, verification workflows, and profile management
- **Listing management** — `services.ts` provides CRUD for property listings, availability, and media

### Data & Identity
- **Site settings** — `useSiteSettings.ts` for global configuration
- **Firestore data access** — `firestore.ts` (legacy, retained for migration reference)
- **Authentication** — `AuthContext.tsx` with Better Auth (email/password, admin plugin, Prisma adapter)
- **Firebase services** — `firebase.ts` (legacy, being phased out)
- **Offline support** — `offlineCache.ts` for field demos

### Platform Operations
- **Admin console** — Full admin dashboard at `/admin`
- **Listing & landlord vetting** — `services.ts` for approval workflows

### Student Discovery
- **Home experience** — `index.tsx` (7-Act funnel)
- **Browse listings** — `listings.tsx` with filtering
- **Listing data** — `listings.tsx` data layer
- **Campus map** — `CampusMap.tsx` with MapLibre GL
- **Residence gallery** — Visual showcase
- **Listing details** — `listings_.$id.tsx` deep-dive pages
- **Direct contact** — `contact.tsx` with WhatsApp/email

### Shared Experience
- **Marketing navigation** — Global header/footer
- **Viewport-aware video** — `VideoPanel.tsx` autoplay logic
- **Reduced-motion handling** — Respects `prefers-reduced-motion`

### Map Tile Providers
- OpenFreeMap (default)
- Esri World Imagery

---

## Test Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@unihub.ke` | `TestAdmin2024!` | `/admin` (requires `VITE_ADMIN_EMAILS=admin@unihub.ke` in `.env`) |
| **Landlord (Pending)** | `landlord.pending@unihub.ke` | `TestLandlord2024!` | `/landlord` (pending verification) |
| **Landlord (Approved)** | `landlord.approved@unihub.ke` | `TestLandlord2024!` | `/landlord` (full dashboard) |
| **Landlord (Rejected)** | `landlord.rejected@unihub.ke` | `TestLandlord2024!` | `/landlord` (rejected state) |
| **Landlord (Suspended)** | `landlord.suspended@unihub.ke` | `TestLandlord2024!` | `/landlord` (suspended state) |
| **Student / Tenant** | `student@unihub.ke` | `TestStudent2024!` | Browse listings, favorites |
| **University Admin** | `university@unihub.ke` | `TestUniversity2024!` | University dashboard |

> ⚠️ **IMPORTANT**: Change passwords after first login!

---

## Project Structure

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

| Feature | Description |
|---|---|
| Verified Listings | Property and landlord details are vetted before publication to ensure authenticity. |
| Campus-First Search | Search structured by specific university towns (Nairobi, Juja, Kahawa, Madaraka, Thika, Kesses, Njoro, Nakuru). |
| Direct Contact | One-tap WhatsApp or email connection to verified listing agents and landlords. |
| Zero Friction | Free to browse with no mandatory signup or paywall between students and housing. |
| Offline Ready | Fully functional offline presentation package for field demos and local deployments. |
| Interactive Map | Keyless MapLibre GL integration with OpenFreeMap and Esri World Imagery tiles. |

---

## Quick Start

### Prerequisites

- Node.js 20.11.0 or higher
- npm 10+ or bun

### Install

```bash
git clone https://github.com/shadrackb1/unihub-landing-experience.git
cd unihub-landing-experience

# Install dependencies
npm install
```

### Run

```bash
npm run dev
```

The development server starts at `http://localhost:5173`.

---

## Project Structure

```
unihub-landing-experience/
├── public/                       # Static assets (logo, favicon, ad materials)
│   ├── logo.svg                  # Horizontal wordmark with monogram
│   ├── logo-mark.svg             # Monogram-only variant
│   └── favicon.svg               # 64×64 rounded square with monogram
├── src/
│   ├── assets/                   # Local MP4 videos and listing images
│   ├── components/               # Core UI experience components
│   │   ├── ui/                   # Reusable UI primitives (buttons, cards, dialogs)
│   │   ├── CampusMap.tsx         # MapLibre GL keyless map with university pins
│   │   ├── Experience.tsx        # Journey timeline and act scroll navigation
│   │   ├── LetterReveal.tsx      # Staggered typography animations
│   │   ├── ListingGrid.tsx       # Housing card grid component
│   │   ├── Logo.tsx              # SVG Logo and Mark components
│   │   ├── MarketingChrome.tsx   # Header navigation and footer chrome
│   │   ├── ResidenceVideoGallery.tsx  # Residence video clip showcase
│   │   └── VideoPanel.tsx        # Viewport-aware autoplay video container
│   ├── context/                  # React context providers
│   │   ├── AuthContext.tsx       # Better Auth state & methods
│   │   └── LandlordContext.tsx   # Landlord profile & status
│   ├── features/                 # Feature-based modules (new structure)
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── routes/
│   │   │   └── types/
│   │   ├── landlord/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── listings/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── marketplace/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── residence/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── routes/
│   │       ├── services/
│   │       └── types/
│   ├── hooks/                    # Custom React hooks
│   │   └── use-mobile.tsx        # Responsive viewport detection hook
│   ├── lib/                      # Utilities and error reporting
│   │   ├── auth/                 # Better Auth configuration
│   │   │   └── index.ts
│   │   ├── auth-client.ts        # Better Auth React client
│   │   ├── error-capture.ts      # Server-side and browser error interceptor
│   │   ├── error-page.ts         # Standard error response formatter
│   │   ├── error-reporting.ts    # Client-side runtime error reporting
│   │   └── utils.ts              # Tailwind class merging utility (cn)
│   ├── routes/                   # File-based TanStack Router pages (legacy paths)
│   │   ├── __root.tsx            # Root layout shell (HTML, Head, Meta, Body)
│   │   ├── index.tsx             # Homepage (7-Act experience)
│   │   ├── listings.tsx          # Browse listings page
│   │   ├── about.tsx             # About brand page
│   │   ├── contact.tsx           # Contact and WhatsApp page
│   │   ├── list-property.tsx     # Landlord onboarding page
│   │   ├── privacy.tsx           # Privacy policy page
│   │   └── terms.tsx             # Terms of service page
│   ├── router.tsx                # TanStack Router instance creation
│   ├── server.ts                 # Nitro server entrypoint with error recovery
│   ├── start.ts                  # TanStack Start handler
│   └── styles.css                # OKLCH design tokens and Tailwind v4 utilities
├── prisma/
│   ├── schema.prisma             # Prisma data model (SQLite)
│   ├── migrations/               # Migration history
│   ├── seed.ts                   # TypeScript database seeder
│   └── generated/                # Generated Prisma client (internal)
├── scripts/
│   └── seed-test-accounts.cjs    # CommonJS seed script (legacy)
├── docs/                         # Documentation and architecture diagrams
│   ├── architecture-diagram.png
│   ├── routes-architecture.svg
│   ├── backend-architecture.svg
│   ├── legacy-spa-architecture.svg
│   ├── funnel-animated.svg
│   ├── map-dataflow-animated.svg
│   └── video-panel-animated.svg
├── DESIGN-BLUEPRINT.md           # System design and architecture specification
├── OFFLINE-README.md             # Offline USB presentation guide
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── eslint.config.js
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| TanStack Start | Full-stack React framework with SSR |
| React 19 | UI library |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Utility-first styling with OKLCH tokens |
| MapLibre GL | Interactive campus map (no API keys) |
| Radix UI | Accessible UI primitives |
| Lucide Icons | Icon system |

### Authentication & Database

| Technology | Purpose |
|---|---|
| Better Auth | Modern auth (email/password, admin plugin) |
| Prisma ORM | Type-safe database access (SQLite) |
| @prisma/adapter-libsql | Driver adapter for SQLite |

### Build & Infrastructure

| Technology | Purpose |
|---|---|
| Vite 8 | Build tool and dev server |
| Nitro 3 | Server output and deployment preset |
| TanStack Router | File-based routing |
| Vercel | Hosting and deployment |
| ESLint + Prettier | Code quality and formatting |

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
- **WhatsApp Support** — Configurable via `WHATSAPP_URL` in `src/components/MarketingChrome.tsx`
- **Email** — `hello@unihub.ke`

---

*UniHub — Verified student housing near Kenyan campuses.*


