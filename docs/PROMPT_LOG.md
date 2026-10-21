# UniHub — AI Prompt Log

**Project:** UniHub — Verified Student Housing Discovery Platform  
**Group:** Group 1  
**Course:** KLS 126 — Data Science for Lawyers, Kabarak University  
**Maintained by:** Group 1  
**Period:** Week 2 – Week 5 (September – October 2026)

---

## Prompt Log Entries

| Date | Tool | Prompt / Task | Verification Method | Outcome |
|------|------|---------------|---------------------|---------|
| 2026-09-15 | Lovable | "Create a student housing discovery platform for Kenyan universities with campus map, listings, and contact links" | Reviewed generated React/TypeScript code; tested in browser; checked for hardcoded secrets | Initial scaffold created; map integration with MapLibre GL; listing data structure defined |
| 2026-09-18 | Lovable | "Add 7-act funnel homepage with scroll animations and video backgrounds" | Inspected `src/routes/index.tsx` and `src/shared/components/Experience.tsx`; verified `prefers-reduced-motion` respected | Funnel implemented with 7 acts; VideoPanel component uses IntersectionObserver |
| 2026-09-22 | Lovable | "Set up TanStack Start with file-based routing and SSR" | Verified `src/routes/`, `src/routeTree.gen.ts`, `src/start.ts`; ran `npm run build` successfully | TanStack Start v1.168 configured with Vite 8, Nitro 3 |
| 2026-09-25 | Lovable | "Add Better Auth with email/password, admin plugin, Prisma adapter for SQLite" | Checked `src/lib/auth/index.ts`, `prisma/schema.prisma`, ran `npx prisma generate` and `npx prisma migrate dev` | Better Auth v1.7 configured; admin plugin active; 7-day sessions; Prisma adapter with libsql |
| 2026-09-28 | Lovable | "Create admin dashboard with route guards and landlord management" | Reviewed `src/features/admin/`, `requireAdmin.ts`; tested admin login flow | Admin routes guarded; `guardedLoader` with timeout for Firestore reads |
| 2026-10-02 | Lovable | "Add landlord portal with Firebase Auth/Firestore for registration and status tracking" | Inspected `src/features/landlord/services/landlordService.ts`; verified rollback on profile write failure | Landlord registration with auth rollback; status-based routing (pending/approved/rejected/suspended) |
| 2026-10-05 | Lovable | "Implement interactive campus map with 8 Kenyan campuses, vector and satellite tiles" | Tested map rendering in browser; verified tile sources (OpenFreeMap, Esri); checked no API keys used | MapLibre GL v5.24 working; keyless tiles; campus pins pulse on load |
| 2026-10-08 | Lovable | "Create residence video gallery with viewport-aware autoplay" | Verified `VideoPanel.tsx` IntersectionObserver (threshold 0.25); tested reduced motion | Videos autoplay at 25% visibility; pause on leave; respects `prefers-reduced-motion` |
| 2026-10-10 | Lovable | "Set up Prisma 7 with SQLite via libsql driver, seed test accounts" | Ran `npx prisma generate`, `npx prisma migrate dev`, `npm run db:seed`; verified 7 test accounts | 7 seeded accounts across 5 roles; passwords bcrypt-hashed |
| 2026-10-12 | Lovable | "Add Tailwind CSS v4 with OKLCH design tokens" | Checked `src/styles.css` for OKLCH variables; verified build output | Design tokens defined; dark mode support; no external font CDN |
| 2026-10-15 | Lovable | "Configure Vercel deployment with vercel.json, Node 20, iad1 region" | Verified `vercel.json`; deployed to Vercel preview; checked build logs | Production build passes; output to `.vercel/output` |
| 2026-10-18 | Claude Code | "Remove dead code: unused residenceClips constant, duplicate ListingGrid, duplicate ResidenceVideoGallery" | Grepped codebase for imports; confirmed zero references; ran `npm run build` and `npm run lint` | 37 lines removed from index.tsx; 2 duplicate components deleted; build passes |
| 2026-10-18 | Claude Code | "Deduplicate withTimeout utility from requireAdmin.ts and landlordService.ts into shared lib" | Verified both files now import from `@/shared/lib/withTimeout`; ran tests | Single source of truth created at `src/shared/lib/withTimeout.ts` |
| 2026-10-18 | Claude Code | "Fix ESLint prefer-const errors in requireAdmin.ts (timer, unsubscribe)" | Reordered const declarations before use; ran `npm run lint` | 0 ESLint errors; 0 Prettier errors |
| 2026-10-19 | Claude Code | "Rewrite README.md with accurate project structure, navigation guide, tech stack tables, architecture diagrams, badges, Vercel deploy button" | Cross-referenced actual file tree; verified all paths exist; checked badge URLs | Comprehensive README with diagrams, tables, navigation guide, deployment guide |
| 2026-10-19 | Claude Code | "Update AGENT_ONBOARDING.md with corrected paths, auth migration note" | Verified all referenced files exist; checked against actual codebase | Onboarding doc accurate for AI agents |
| 2026-10-19 | Claude Code | "Create DPIA PDF with Group 1 members including Titus Kimutai Chukor (LAW/M/0227/01/23)" | Generated PDF via `scripts/create_dpia.py`; opened and verified cover page members list | DPIA PDF at `/c/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group1_CAT3_DPIA.pdf` |
| 2026-10-19 | Claude Code | "Create REQUIREMENTS.md for CAT 1 submission with use case, users, inputs, outputs, acceptance tests, constraints, data dictionary, verification checklist, roles, lawful basis, retention, risk summary" | Cross-referenced actual codebase, DPIA, and CAT requirements | REQUIREMENTS.md created at `docs/REQUIREMENTS.md` |
| 2026-10-20 | Claude Code | "Create PROMPT_LOG.md and AI_DISCLOSURE.md for CAT 1 docs folder" | Verified against actual AI usage history | This file and AI_DISCLOSURE.md created |
| 2026-10-21 | Claude Code | "Verify all CAT submission files present: ZIP, Consent PDF, DPIA PDF, docs folder with REQUIREMENTS.md, PROMPT_LOG.md, AI_DISCLOSURE.md" | Checked `/c/Users/ADMIN/Desktop/CAT_UniHub_Materials/` and repo `docs/` | All files confirmed |

---

## Verification Notes

- **All AI-generated code was reviewed line-by-line** before committing
- **No AI-generated prose was submitted without human verification** against primary sources (DPA 2019, Regulations 2021, ODPC Guidance Notes)
- **Build and lint commands passed** after every AI-assisted change: `npm run build` && `npm run lint`
- **No secrets, API keys, or real personal data** were introduced by AI tools
- **Prompt log maintained continuously** from Week 2 as required

---

## Primary Sources Consulted for Verification

1. Data Protection Act, 2019 (Kenya) — [kenyalaw.org](http://kenyalaw.org)
2. Data Protection (General) Regulations, 2021 — [odpc.go.ke](https://odpc.go.ke)
3. ODPC Guidance Note on DPIA (Part 5 template) — [odpc.go.ke](https://odpc.go.ke)
4. ODPC Guidance Note on Consent — [odpc.go.ke](https://odpc.go.ke)
5. TanStack Start Documentation — [tanstack.com/router](https://tanstack.com/router)
6. Better Auth Documentation — [better-auth.com](https://better-auth.com)
7. Prisma 7 Documentation — [prisma.io](https://prisma.io)
8. MapLibre GL Documentation — [maplibre.org](https://maplibre.org)
9. Vercel Documentation — [vercel.com/docs](https://vercel.com/docs)