# UniHub

Verified student housing platform for Kenyan university campuses.

TanStack Start · React 19 · Tailwind CSS v4 · MapLibre GL · Vercel

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

### Auth Stack (Mid-Migration)

| Layer | Technology | Status |
|-------|------------|--------|
| Primary | Better Auth + Prisma + SQLite | Active (seeded accounts, AuthContext) |
| Legacy | Firebase Auth + Firestore | Landlord portal, admin guard, CMS settings |

**Better Auth** (`src/lib/auth/index.ts`):
- Email/password, admin plugin, 7-day session
- Prisma adapter with `@prisma/adapter-libsql`
- `AuthContext.tsx` provides `useAuth()` hook

**Firebase** (`src/shared/lib/firebase.ts`):
- Used by `LandlordContext.tsx`, `landlordService.ts`, `requireAdmin.ts`
- Firestore for landlord profiles, site settings, legacy listings
- Being phased out; new code should use Better Auth + Prisma

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
| Technology | Purpose |
|------------|---------|
| TanStack Start | Full-stack React framework with SSR |
| React 19 | UI library |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Utility-first styling with OKLCH tokens |
| MapLibre GL | Interactive campus map (no API keys) |
| Radix UI | Accessible UI primitives |
| Lucide Icons | Icon system |
| Motion | Animations |

### Authentication & Database
| Technology | Purpose |
|------------|---------|
| Better Auth | Modern auth (email/password, admin plugin) |
| Prisma ORM | Type-safe database access (SQLite) |
| @prisma/adapter-libsql | Driver adapter for SQLite |

### Build & Infrastructure
| Technology | Purpose |
|------------|---------|
| Vite 8 | Build tool and dev server |
| Nitro 3 | Server output and deployment preset |
| TanStack Router | File-based routing |
| Vercel | Hosting and deployment |
| ESLint + Prettier | Code quality and formatting |

---

## Deployment (Vercel)

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

## Accessibility & Quality Gates

- Semantic HTML — Proper landmarks (`header`, `main`, `section`, `nav`, `footer`)
- Keyboard Navigation — Skip links, visible focus rings, full keyboard control
- Motion Gated — All animations respect `prefers-reduced-motion`
- Target Sizes — Interactive elements meet 44×44 px minimum
- Code Quality — `npm run lint` and `npm run build` must pass

---

## License & Contact

- **License** — Private project. Map data subject to OpenStreetMap and Esri terms.
- **WhatsApp** — Configurable via `VITE_WHATSAPP_NUMBER`
- **Email** — hello@unihub.ke
- **Repo** — https://github.com/shadrackb1/unihub-landing-experience

---

*UniHub — Verified student housing near Kenyan campuses.*