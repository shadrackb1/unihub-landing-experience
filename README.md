# UniHub

Verified student housing platform for Kenyan university campuses.

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick_Start-4CAF50?style=for-the-badge&logo=rocket&logoColor=white" alt="Quick Start" /></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-2196F3?style=for-the-badge&logo=diagram&logoColor=white" alt="Architecture" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-FF9800?style=for-the-badge&logo=layers&logoColor=white" alt="Tech Stack" /></a>
  <a href="#deployment"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy to Vercel" /></a>
  <a href="https://github.com/shadrackb1/unihub-landing-experience"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" /></a>
  <a href="#license--contact"><img src="https://img.shields.io/badge/License-Private-informational?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TanStack_Start-1.168-000000?style=flat&logo=tanstack&logoColor=white" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Better_Auth-1.7-FF6B35?style=flat&logo=auth0&logoColor=white" alt="Better Auth" />
  <img src="https://img.shields.io/badge/MapLibre_GL-5.24-FF6B00?style=flat&logo=maplibre&logoColor=white" alt="MapLibre GL" />
</p>

---

## Quick Start

### Prerequisites

- Node.js 20.11.0 or higher
- npm 10+

### Install

```bash
git clone https://github.com/shadrackb1/unihub-landing-experience.git
cd unihub-landing-experience
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:

```env
# Database (SQLite file)
DATABASE_URL="file:./dev.db"

# Better Auth (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-64-char-secret"
BETTER_AUTH_URL="http://localhost:5173"

# App
VITE_APP_URL="http://localhost:5173"
VITE_WHATSAPP_NUMBER="254700000000"
VITE_ADMIN_EMAILS="admin@unihub.ke"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates dev.db with schema)
npx prisma migrate dev --name init

# Seed test accounts (7 users across 5 roles)
npm run db:seed
```

Seeded test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@unihub.ke | TestAdmin2024! |
| Landlord (Pending) | landlord.pending@unihub.ke | TestLandlord2024! |
| Landlord (Approved) | landlord.approved@unihub.ke | TestLandlord2024! |
| Landlord (Rejected) | landlord.rejected@unihub.ke | TestLandlord2024! |
| Landlord (Suspended) | landlord.suspended@unihub.ke | TestLandlord2024! |
| Student / Tenant | student@unihub.ke | TestStudent2024! |
| University Admin | university@unihub.ke | TestUniversity2024! |

> Change passwords after first login.

### Run Development Server

```bash
npm run dev
```

Server starts at **http://localhost:5173** with HMR.

---

## Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio (GUI)
npm run db:seed          # Seed test accounts

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
```

---

## Project Structure

```
unihub-landing-experience/
├── public/                       # Static assets
│   ├── logo.svg                  # Horizontal wordmark
│   ├── logo-mark.svg             # Monogram-only variant
│   └── favicon.svg               # 64x64 rounded square
├── src/
│   ├── assets/                   # Local MP4 videos & images
│   ├── components/               # Shared UI components
│   │   └── ui/                   # Reusable primitives (buttons, cards, dialogs)
│   ├── data/                     # Static data (listings, residence clips)
│   ├── features/                 # Feature-based modules
│   │   ├── admin/                # Admin dashboard & guards
│   │   │   ├── components/       # Admin UI components
│   │   │   ├── routes/           # Admin routes (TanStack Router)
│   │   │   └── requireAdmin.ts   # Auth guard for admin routes
│   │   ├── auth/                 # Auth routes (login, register)
│   │   │   ├── components/
│   │   │   └── routes/
│   │   ├── campus/               # Campus map & data
│   │   │   └── components/
│   │   ├── landlord/             # Landlord portal
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   └── services/         # landlordService.ts (Firebase Auth + Firestore)
│   │   ├── listings/             # Browse & manage listings
│   │   │   ├── components/       # ListingGrid
│   │   │   ├── hooks/            # useListings
│   │   │   └── routes/
│   │   ├── marketplace/          # Properties marketplace
│   │   └── residence/            # Hostels, apartments, rooms
│   │       └── components/       # ResidenceVideoGallery, CoolVideoCard
│   ├── hooks/                    # Shared hooks
│   │   └── use-mobile.tsx
│   ├── lib/                      # Core utilities
│   │   ├── auth/                 # Better Auth server config
│   │   │   └── index.ts
│   │   ├── auth-client.ts        # Better Auth React client
│   │   ├── utils.ts              # cn() tailwind merge
│   │   └── withTimeout.ts        # Promise timeout utility
│   ├── routes/                   # File-based TanStack Router (legacy paths)
│   │   ├── __root.tsx            # Root layout (HTML, Head, Meta)
│   │   ├── index.tsx             # Homepage (7-Act funnel)
│   │   ├── listings.tsx          # Browse listings (legacy route)
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   ├── list-property.tsx
│   │   ├── privacy.tsx
│   │   └── terms.tsx
│   ├── server.ts                 # Nitro server entrypoint
│   ├── start.ts                  # TanStack Start handler
│   ├── styles.css                # OKLCH design tokens + Tailwind v4
│   ├── router.tsx                # Router instance
│   └── shared/
│       ├── components/           # Shared components
│       │   ├── Experience.tsx    # Journey timeline & act navigation
│       │   ├── LetterReveal.tsx
│       │   ├── MarketingChrome.tsx  # Header, Footer, MarketingShell
│       │   ├── SupportLink.tsx
│       │   └── VideoPanel.tsx    # Viewport-aware autoplay video
│       ├── context/              # React contexts
│       │   ├── AuthContext.tsx   # Better Auth state & methods
│       │   └── LandlordContext.tsx
│       ├── hooks/                # Shared hooks
│       │   ├── useOnlineRefresh.ts
│       │   └── useSiteSettings.ts
│       ├── lib/                  # Shared lib
│       │   └── firebase.ts       # Firebase config (legacy)
│       ├── services/             # Shared services
│       │   └── firestore.ts      # Legacy Firestore CRUD
│       └── contact.ts            # WhatsApp/email constants
├── prisma/
│   ├── schema.prisma             # Prisma data model (SQLite)
│   ├── migrations/               # Migration history
│   └── seed.ts                   # TypeScript seeder
├── scripts/                      # Utility scripts
├── docs/                         # Architecture diagrams
├── AGENT_ONBOARDING.md           # AI agent setup guide
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── eslint.config.js
```

---

## Developer Navigation Guide

| Task | File / Directory |
|------|------------------|
| Add a new page | `src/routes/` or `src/features/*/routes/` |
| Add API endpoint | `src/routes/api/` |
| Modify auth | `src/lib/auth/index.ts` |
| Modify DB schema | `prisma/schema.prisma` |
| Change UI tokens | `src/styles.css` (OKLCH colors, spacing) |
| Add test account | `prisma/seed.ts` → `TEST_ACCOUNTS` array |
| Debug landlord flow | `src/features/landlord/` |
| Debug admin guard | `src/features/admin/requireAdmin.ts` |
| Shared timeout utility | `src/shared/lib/withTimeout.ts` |
| Static listing data | `src/data/listings.ts` |
| Residence video clips | `src/data/residenceClips.ts` |

---

## Architecture

<p align="center">
  <a href="docs/diagrams/system-overview.json"><img src="https://img.shields.io/badge/View-System_Overview-2196F3?style=for-the-badge&logo=diagram&logoColor=white" alt="System Overview" /></a>
  <a href="docs/diagrams/auth-flow.json"><img src="https://img.shields.io/badge/View-Auth_Flow-4CAF50?style=for-the-badge&logo=shield&logoColor=white" alt="Auth Flow" /></a>
  <a href="docs/diagrams/data-flow.json"><img src="https://img.shields.io/badge/View-Data_Flow-FF9800?style=for-the-badge&logo=database&logoColor=white" alt="Data Flow" /></a>
  <a href="docs/diagrams/deployment-pipeline.json"><img src="https://img.shields.io/badge/View-Deployment_Pipeline-9C27B0?style=for-the-badge&logo=rocket&logoColor=white" alt="Deployment Pipeline" /></a>
  <a href="docs/diagrams/funnel-flow.json"><img src="https://img.shields.io/badge/View-7_Act_Funnel-EC4899?style=for-the-badge&logo=chart&logoColor=white" alt="7-Act Funnel" /></a>
  <a href="docs/diagrams/map-dataflow.json"><img src="https://img.shields.io/badge/View-Campus_Map_Flow-06B6D4?style=for-the-badge&logo=map&logoColor=white" alt="Campus Map Flow" /></a>
  <a href="docs/diagrams/video-panel.json"><img src="https://img.shields.io/badge/View-Video_Panel-9C27B0?style=for-the-badge&logo=video&logoColor=white" alt="Video Panel" /></a>
  <a href="docs/diagrams/admin-guards.json"><img src="https://img.shields.io/badge/View-Admin_Guards-607D8B?style=for-the-badge&logo=security&logoColor=white" alt="Admin Guards" /></a>
  <a href="docs/diagrams/landlord-portal.json"><img src="https://img.shields.io/badge/View-Landlord_Portal-FF5722?style=for-the-badge&logo=home&logoColor=white" alt="Landlord Portal" /></a>
  <a href="docs/diagrams/er-diagram.json"><img src="https://img.shields.io/badge/View-ER_Diagram-3F51B5?style=for-the-badge&logo=data&logoColor=white" alt="ER Diagram" /></a>
  <a href="docs/diagrams/data-processing.json"><img src="https://img.shields.io/badge/View-Data_Processing-009688?style=for-the-badge&logo=privacy&logoColor=white" alt="Data Processing" /></a>
  <a href="docs/diagrams/security-boundaries.json"><img src="https://img.shields.io/badge/View-Security_Boundaries-F44336?style=for-the-badge&logo=lock&logoColor=white" alt="Security Boundaries" /></a>
  <a href="docs/diagrams/transfer-assessment.json"><img src="https://img.shields.io/badge/View-Transfer_Assessment-795548?style=for-the-badge&logo=globe&logoColor=white" alt="Transfer Assessment" /></a>
</p>

### System Overview

[View System Overview Diagram](docs/diagrams/system-overview.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*High-level component architecture showing frontend (TanStack Start, React 19), backend (Better Auth, Prisma, SQLite), legacy Firebase stack, MapLibre GL, and external services (Vercel, GitHub, Tile Providers).*

### Authentication Flow — Better Auth (Primary) + Firebase (Legacy)

[View Auth Flow Diagram](docs/diagrams/auth-flow.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*Dual auth stack during mid-migration: Better Auth for admin routes with requireAdmin guard, Firebase Auth/Firestore for legacy landlord portal. Shows session validation, admin email checks, Firestore profile fetch, and status-based routing.*

### Data Flow — Static Listings to Browser

[View Data Flow Diagram](docs/diagrams/data-flow.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*How listing data flows from static TypeScript files (listings.ts, residenceClips.ts, campuses.ts) through TanStack Start components (ListingGrid, CampusMap, VideoPanel) to student browser. All filtering/sorting client-side; contact links open external apps.*

### Deployment Pipeline — GitHub to Vercel

[View Deployment Pipeline Diagram](docs/diagrams/deployment-pipeline.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*CI/CD flow: local dev → git push → GitHub webhook → Vercel build (prisma generate, type-check, lint) → preview deployment → production deployment (main branch). Configured via vercel.json with iad1 region.*

### 7-Act Funnel — Homepage Experience

[View 7-Act Funnel Diagram](docs/diagrams/funnel-flow.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*Student journey through 7 acts: Arrive → Orient → Believe → Witness → Choose → Place → Move. Scroll-triggered transitions, prefers-reduced-motion gating, campus pin interaction, video autoplay, filter changes, contact link clicks.*

### Interactive Campus Map — Data Flow

[View Campus Map Data Flow Diagram](docs/diagrams/map-dataflow.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*MapLibre GL initialisation with custom style JSON (vector + raster sources), OpenFreeMap/Esri tile requests, 8 campus pins with pulse animation, layer toggle control, pin click → listing filter, cleanup on unmount.*

### Video Panel — Viewport-Aware Autoplay

[View Video Panel Diagram](docs/diagrams/video-panel.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*VideoPanel component: prefers-reduced-motion check → IntersectionObserver (threshold 0.25, rootMargin -10%) → autoplay on enter, pause on leave → user click toggles play/pause/unmute → cleanup on unmount.*

### Admin Dashboard — Route Guards & Data Loading

[View Admin Guards Diagram](docs/diagrams/admin-guards.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*TanStack Router loaders: SSR check → waitForUser (8s timeout) → Firebase auth state → admin email validation → guardedLoader with 6s Firestore timeout → graceful fallback on error → admin UI render.*

### Landlord Portal — Registration, Sign-In & Status Routing

[View Landlord Portal Diagram](docs/diagrams/landlord-portal.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*Firebase Auth registration with auth rollback on Firestore write failure → sign-in with parallel profile fetch (8s timeout) → profile state handling (ok/missing/unavailable) → status-based routing (pending/approved/rejected/suspended).*

### Entity Relationship Diagram — Prisma Schema

[View ER Diagram](docs/diagrams/er-diagram.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*Core models: User (Better Auth), LandlordProfile, Listing, Favorite, University, Hostel, HostelRoom, Apartment, Room, plus Better Auth tables (Session, Account, VerificationToken). Cardinalities shown.*

### Data Processing & Transfers — DPIA-Aligned

[View Data Processing Diagram](docs/diagrams/data-processing.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*Personal data flows per DPA 2019: student browsing (anonymous), contact links (external), landlord onboarding (off-platform), admin entry → build/deploy → Vercel/GitHub (US). Transfer assessment: non-personal data only, SCCs + supplementary measures.*

### Security Boundaries

[View Security Boundaries Diagram](docs/diagrams/security-boundaries.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*Defense-in-depth: HTTPS/TLS, CSP, Better Auth (bcrypt, CSRF), Prisma (SQL injection prevention), Firebase legacy rules, admin guards, env var separation, error sanitisation, zero tracking, self-hosted assets, 2FA on GitHub/Vercel.*

### International Transfer Assessment

[View Transfer Assessment Diagram](docs/diagrams/transfer-assessment.json) — *Paste JSON into [Diagrammer](https://diagrammer.dev) for interactive view*

*DPA 2019 Part VI compliance: transfers to Vercel (US), GitHub (US), Map CDNs (global). Data categories: public listings, sanitised logs, source code. US not adequate → SCCs (Vercel/GitHub DPAs) + supplementary measures (minimisation, encryption, access control, no sensitive data). Residual risk: LOW.*

### Routing

- **TanStack Router** file-based: `src/routes/` (legacy) + `src/features/*/routes/` (new)
- Route tree generated at `src/routeTree.gen.ts`
- Server functions via `createServerFn` in `src/start.ts`

### Data

- **Prisma 7** with `@prisma/adapter-libsql` (SQLite driver)
- Generated client at `node_modules/.prisma/client/client`
- Run via `tsx` for scripts (`npx tsx scripts/...`)

---

## Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| TanStack Start | Full-stack React framework with SSR | 1.168 |
| React | UI library | 19 |
| TypeScript | Type-safe development | 5.8 |
| Tailwind CSS | Utility-first styling with OKLCH tokens | v4 |
| MapLibre GL | Interactive campus map (no API keys) | 5.24 |
| Radix UI | Accessible UI primitives | 1.1-1.2 |
| Lucide Icons | Icon system | 0.575 |
| Motion | Animations | 14.0 |

### Authentication & Database

| Technology | Purpose | Version |
|------------|---------|---------|
| Better Auth | Modern auth (email/password, admin plugin) | 1.7 |
| Prisma ORM | Type-safe database access (SQLite) | 7.10 |
| @prisma/adapter-libsql | Driver adapter for SQLite | 7.10 |

### Build & Infrastructure

| Technology | Purpose | Version |
|------------|---------|---------|
| Vite | Build tool and dev server | 8.1 |
| Nitro | Server output and deployment preset | 3.0 |
| TanStack Router | File-based routing | 1.170 |
| Vercel | Hosting and deployment | — |
| ESLint + Prettier | Code quality and formatting | 9.32 / 3.7 |

---

## Deployment (Vercel)

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/shadrackb1/unihub-landing-experience"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
</p>

```bash
npm run build
npm run preview
```

**vercel.json:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": ".vercel/output",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["iad1"]
}
```

Deploy steps:
1. Import `shadrackb1/unihub-landing-experience` into Vercel
2. Set Node.js runtime to `20.x`
3. Confirm build command and output directory
4. Deploy (no env vars or map API keys required)

---

## Architecture Diagrams (All in `/docs/diagrams`)

| Diagram | Description | Format |
|---------|-------------|--------|
| `system-overview.json` | High-level system component architecture | JSON (Diagrammer) |
| `auth-flow.json` | Better Auth + Firebase dual stack flow | JSON (Diagrammer) |
| `data-flow.json` | Static listings → components → browser | JSON (Diagrammer) |
| `deployment-pipeline.json` | GitHub → Vercel CI/CD pipeline | JSON (Diagrammer) |
| `funnel-flow.json` | 7-Act homepage funnel experience | JSON (Diagrammer) |
| `map-dataflow.json` | MapLibre GL tile sources + campus pins | JSON (Diagrammer) |
| `video-panel.json` | IntersectionObserver viewport autoplay | JSON (Diagrammer) |
| `admin-guards.json` | TanStack Router loaders + requireAdmin | JSON (Diagrammer) |
| `landlord-portal.json` | Firebase Auth + Firestore registration/sign-in | JSON (Diagrammer) |
| `er-diagram.json` | Prisma schema entity relationships | JSON (Diagrammer) |
| `data-processing.json` | DPIA-aligned personal data flows | JSON (Diagrammer) |
| `security-boundaries.json` | Defense-in-depth security controls | JSON (Diagrammer) |
| `transfer-assessment.json` | International transfer DPA 2019 Part VI | JSON (Diagrammer) |
| `experience-funnel.svg` | 7-Act funnel (animated, legacy) | SVG |
| `technical-architecture.svg` | Technical architecture (legacy) | SVG |
| `routes-architecture.svg` | TanStack + Legacy SPA routes (legacy) | SVG |
| `backend-architecture.svg` | Services + Firebase/Cloud (legacy) | SVG |
| `legacy-spa-architecture.svg` | Legacy SPA internals (legacy) | SVG |
| `map-dataflow-animated.svg` | Campus MapLibre flow (animated, legacy) | SVG |
| `video-panel-animated.svg` | VideoPanel logic (animated, legacy) | SVG |
| `funnel-animated.svg` | 7-Act funnel (animated, legacy) | SVG |

> **New diagrams** (JSON format) render in the [Diagrammer viewer](https://diagrammer.dev) — paste the JSON to view interactive, zoomable diagrams.
> **Legacy diagrams** (SVG) open directly in browser for animations and hover effects.

---

## Accessibility & Quality Gates

- **Semantic HTML** — Proper landmarks (`header`, `main`, `section`, `nav`, `footer`)
- **Keyboard Navigation** — Skip links, visible focus rings, full keyboard control
- **Motion Gated** — All animations respect `prefers-reduced-motion`
- **Target Sizes** — Interactive elements meet 44×44 px minimum
- **Code Quality** — `npm run lint` and `npm run build` must pass

---

## License & Contact

- **License** — Private project. Map data subject to OpenStreetMap and Esri terms.
- **WhatsApp** — Configurable via `VITE_WHATSAPP_NUMBER`
- **Email** — hello@unihub.ke
- **Repo** — https://github.com/shadrackb1/unihub-landing-experience

---

*UniHub — Verified student housing near Kenyan campuses.*