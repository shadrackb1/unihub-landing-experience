# UniHub — AI Agent Onboarding Guide

Quick-start reference for AI agents setting up and running the UniHub landing experience locally.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20.11.0+ | `winget install OpenJS.NodeJS` or [nodejs.org](https://nodejs.org) |
| npm | 10+ | Included with Node |
| Git | latest | `winget install Git.Git` |

**Windows note:** This project is developed in Git Bash (POSIX shell). Use `/c/Users/ADMIN/...` paths, not `C:\Users\ADMIN\...`.

---

## 1. Clone & Install

```bash
cd /c/Users/ADMIN
git clone https://github.com/shadrackb1/unihub-landing-experience.git
cd unihub-landing-experience
npm install
```

---

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables in `.env`:

```env
# Database (SQLite file)
DATABASE_URL="file:./dev.db"

# Better Auth (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-64-char-secret"
BETTER_AUTH_URL="http://localhost:5173"

# App
VITE_APP_URL="http://localhost:5173"
VITE_WHATSAPP_NUMBER="254700000000"
VITE_ADMIN_EMAILS="admin@unihub.ke"   # comma-separated for multi-admin
```

---

## 3. Database Setup

```bash
# Generate Prisma client (runs automatically on first dev/build, but safe to run)
npx prisma generate

# Run migrations (creates dev.db with schema)
npx prisma migrate dev --name init

# Seed test accounts (7 users across 5 roles)
npm run db:seed
```

**Seeded test accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@unihub.ke | TestAdmin2024! |
| Landlord (Pending) | landlord.pending@unihub.ke | TestLandlord2024! |
| Landlord (Approved) | landlord.approved@unihub.ke | TestLandlord2024! |
| Landlord (Rejected) | landlord.rejected@unihub.ke | TestLandlord2024! |
| Landlord (Suspended) | landlord.suspended@unihub.ke | TestLandlord2024! |
| Student/Tenant | student@unihub.ke | TestStudent2024! |
| University Admin | university@unihub.ke | TestUniversity2024! |

> ⚠️ Change passwords after first login.

---

## 4. Run Development Server

```bash
npm run dev
```

- Server starts at **http://localhost:5173**
- Hot module replacement (HMR) enabled
- TanStack Start handles SSR + client hydration

---

## 5. Key Commands

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
npm run typecheck        # TypeScript (if configured)

# Utility
npx tsx prisma/seed.ts   # Run seed directly with tsx
```

---

## 6. Project Structure (Feature-Based)

```
src/
├── components/          # Shared UI components
├── context/             # React contexts (Auth, Landlord)
├── features/            # Feature modules (NEW structure)
│   ├── admin/           # Admin dashboard
│   ├── auth/            # Auth routes (login, register, landlord-register)
│   ├── landlord/        # Landlord portal
│   ├── listings/        # Browse & manage listings
│   ├── marketplace/     # Properties marketplace
│   └── residence/       # Hostels, apartments, rooms
├── hooks/               # Shared hooks (use-mobile)
├── lib/                 # Core utilities
│   ├── auth/            # Better Auth config (server)
│   ├── auth-client.ts   # Better Auth React client
│   ├── auth/index.ts    # Auth server instance
│   └── utils.ts         # cn() tailwind merge
├── routes/              # TanStack Router (file-based)
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Home (7-Act funnel)
│   ├── listings.tsx     # Browse listings
│   └── ...              # about, contact, list-property, etc.
├── router.tsx           # Router instance
├── server.ts            # Nitro server entry
├── start.ts             # TanStack Start handler
└── styles.css           # OKLCH tokens + Tailwind v4

prisma/
├── schema.prisma        # Data models
├── migrations/          # Migration history
└── seed.ts              # TypeScript seeder
```

---

## 7. Authentication (Better Auth)

- **Provider:** Email/password (no OAuth yet)
- **Admin plugin:** `ADMIN` role gated by `VITE_ADMIN_EMAILS`
- **Session:** 7-day expiry, cookie-based
- **Database adapter:** Prisma + libsql (SQLite driver adapter for Prisma 7)

Key files:
- `src/lib/auth/index.ts` — Server auth instance
- `src/lib/auth-client.ts` — Client hooks (`useSession`, `signIn`, `signUp`, `signOut`)
- `src/context/AuthContext.tsx` — React context wrapper

---

## 8. Landlord Verification Flow

1. Landlord registers at `/landlord-register`
2. Account created with `status: PENDING`
3. Admin approves/rejects/suspends via `/admin`
4. Approved landlords access dashboard at `/landlord`

---

## 9. Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `Cannot find module '.prisma/client/default'` | Run `npx prisma generate` — ensures client output matches schema's `output` path |
| `PrismaClient was instantiated without any options` | Prisma 7 requires driver adapter. `src/lib/auth/index.ts` and `prisma/seed.ts` use `@prisma/adapter-libsql` |
| `tsx: command not found` | `npm install -D tsx` (in devDependencies) |
| Port 5173 in use | Kill existing process: `lsof -ti:5173 \| xargs kill -9` |
| SQLite lock / migration fails | Delete `dev.db` and `prisma/migrations/`, re-run `npx prisma migrate dev` |
| Better Auth "trustedOrigins" error | Add `http://localhost:5173` to `trustedOrigins` in `src/lib/auth/index.ts` |

---

## 10. Useful Endpoints

| Route | Purpose |
|-------|---------|
| `/` | Homepage (7-Act funnel) |
| `/listings` | Browse all listings |
| `/listings/:id` | Listing detail |
| `/landlord-register` | Landlord onboarding |
| `/landlord` | Landlord dashboard (role-gated) |
| `/admin` | Admin console (email-gated) |
| `/contact` | WhatsApp/email contact |
| `/about`, `/privacy`, `/terms` | Static pages |

---

## 11. Git Workflow

```bash
# Check status
git status

# Stage & commit (user.name = shadrackb1, user.email = shadrackb@kabarak.ac.ke)
git add -A
git commit -m "type: description

Co-Authored-By: Claude Code <noreply@anthropic.com>"

# Push to origin/main
git push origin main
```

---

## 12. Quick Health Check

```bash
# 1. Lint passes
npm run lint

# 2. Build succeeds
npm run build

# 3. Dev server responds
curl -s http://localhost:5173 | grep -q "UniHub" && echo "✅ Server OK"

# 4. DB seeded
sqlite3 dev.db "SELECT email, role FROM User;"
```

---

## 13. Where to Look First

| Task | File |
|------|------|
| Add a new page | `src/routes/` or `src/features/*/routes/` |
| Add a new API endpoint | `src/routes/api/` |
| Modify auth | `src/lib/auth/index.ts` |
| Modify DB schema | `prisma/schema.prisma` |
| Change UI tokens | `src/styles.css` (OKLCH colors, spacing) |
| Add a test account | `prisma/seed.ts` → `TEST_ACCOUNTS` array |
| Debug landlord flow | `src/features/landlord/` |

---

## 14. Notes for AI Agents

- **Don't edit generated files** — `node_modules/.prisma/client/`, `src/generated/prisma/` are generated by `prisma generate`
- **Use `tsx` for running TypeScript scripts** — `prisma/seed.ts` uses ES modules and needs tsx
- **Prisma 7 requires driver adapter** — Always wrap `new PrismaClient({ adapter })` with `PrismaLibSql`
- **Feature-based routes live in `src/features/*/routes/`** — Legacy routes in `src/routes/` still work but new work goes in features
- **Environment variables are Vite-prefixed** — `VITE_*` for client, non-prefixed for server (`.env` only)
- **SQLite limitations** — No `String[]` arrays; use `String` + `JSON.stringify`/`parse`

---

## 15. Support

- **Repo:** https://github.com/shadrackb1/unihub-landing-experience
- **Issues:** GitHub Issues
- **Email:** hello@unihub.ke

---

*Generated for AI agent onboarding. Keep this file updated as the project evolves.*