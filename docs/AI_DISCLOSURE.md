# UniHub — AI Disclosure Statement

**Project:** UniHub — Verified Student Housing Discovery Platform  
**Group:** Group 1  
**Course:** KLS 126 — Data Science for Lawyers, Kabarak University  
**Submitted by:** Group 1 Representative  
**Date:** 21st October 2026  
**Version:** 1.0

---

## AI Tools Used

| Tool | Purpose | Scope of Use |
|------|---------|--------------|
| **Lovable** (lovable.dev) | Full-stack application scaffolding, component generation, routing, styling, auth integration, database setup, deployment configuration | Weeks 2–5: Initial project creation, TanStack Start setup, MapLibre integration, Better Auth + Prisma configuration, admin dashboard, landlord portal, video gallery, campus map, Tailwind v4 tokens, Vercel deployment config |
| **Python** (standard library + reportlab) | PDF generation scripts for DPIA and consent forms | Week 5: `scripts/create_dpia.py`, `scripts/create_consent_bw.py`, `scripts/create_consent_professional.py`, `scripts/create_consent_times.py` |

**Manual development**: All code reviewed, refactored, and committed via GitHub. Repository management, branching, pull requests, and deployment configuration done manually by the team.

---

## Lovable Prompts Used (Weeks 2–5)

| Week | Prompt Given to Lovable |
|------|-------------------------|
| Week 2 | "Create a student housing discovery platform for Kenyan universities with campus map, listings, and contact links" |
| Week 2 | "Add 7-act funnel homepage with scroll animations and video backgrounds" |
| Week 3 | "Set up TanStack Start with file-based routing and SSR" |
| Week 3 | "Add Better Auth with email/password, admin plugin, Prisma adapter for SQLite" |
| Week 3 | "Create admin dashboard with route guards and landlord management" |
| Week 4 | "Add landlord portal with Firebase Auth/Firestore for registration and status tracking" |
| Week 4 | "Implement interactive campus map with 8 Kenyan campuses, vector and satellite tiles" |
| Week 4 | "Create residence video gallery with viewport-aware autoplay" |
| Week 4 | "Set up Prisma 7 with SQLite via libsql driver, seed test accounts" |
| Week 5 | "Add Tailwind CSS v4 with OKLCH design tokens" |
| Week 5 | "Configure Vercel deployment with vercel.json, Node 20, iad1 region" |

---

## How AI Output Was Verified

### For Lovable (Weeks 2–5)
1. **Code review**: Every generated file was read and understood before committing
2. **Runtime testing**: `npm run dev` and `npm run build` executed after each major feature
3. **Browser verification**: Features tested manually in Chrome/Edge (responsive, map, video, auth flows)
4. **Security check**: Grepped for hardcoded secrets, API keys, real personal data — none found
5. **Lint compliance**: `npm run lint` passed (0 errors) after each session

### For Python Scripts (Week 5)
1. **Script review**: All Python scripts read line-by-line before execution
2. **Output verification**: Generated PDFs opened and checked for accuracy (member names, legal citations, formatting)
3. **Primary source verification**: Legal citations (DPA 2019, Regulations 2021, ODPC Guidance Notes) checked against official texts at kenyalaw.org and odpc.go.ke

---

## Specific Verification Actions

| Artefact | Verification Performed |
|----------|------------------------|
| `src/lib/auth/index.ts` (Better Auth config) | Checked against Better Auth v1.7 docs; ran `npx prisma generate` + migrate; seeded 7 test accounts |
| `prisma/schema.prisma` | Validated schema matches `SampleListing` type; no sensitive fields; SQLite via libsql |
| `src/features/admin/requireAdmin.ts` | Verified Firebase Auth guard logic; tested admin login flow; fixed `prefer-const` lint errors |
| `src/shared/lib/withTimeout.ts` | Confirmed generic type signature; tested with Firestore reads in `landlordService.ts` |
| `scripts/create_dpia.py` | Generated PDF; opened and verified all 14 Group 1 members on cover page; checked legal citations |
| `scripts/create_consent_*.py` | Generated consent PDFs; verified B&W Times New Roman; checked against DPA s.29,30,32 and Reg.4 |
| `README.md` | Every path, command, badge URL, and diagram reference verified against repo |
| `docs/REQUIREMENTS.md` | Cross-referenced with actual codebase, DPIA, and CAT 1 rubric |
| Duplicate component removal | Grepped for imports of `ListingGrid` and `ResidenceVideoGallery` — zero references confirmed |
| Dead code removal (`residenceClips`) | Confirmed dynamic import from `@/data/residenceClips` used instead |

---

## Compliance with CAT Rules

- ✅ **Work is our own**: Lovable used as scaffolding assistant; all code reviewed, tested, and understood by team; manual coding in GitHub for all refinements
- ✅ **Public/synthetic data only**: No real personal data in repo, ZIP, consent form, or DPIA
- ✅ **AI use disclosed**: This document and PROMPT_LOG.md detail all AI tool usage (Lovable + Python scripts)
- ✅ **Output verified**: Every AI output checked against primary sources (statutes, regulations, official docs)
- ✅ **Prompt log kept**: PROMPT_LOG.md maintained from Week 2 with dates and verification notes
- ✅ **Correct file types**: ZIP for application, PDF for consent and DPIA
- ✅ **No secrets in repo**: `.env` in `.gitignore`; no API keys, passwords, or real credentials committed

---

## Declaration

We, the members of Group 1, declare that:

1. AI tools (Lovable for application scaffolding, Python for PDF generation scripts) were used as described above
2. All AI-generated code and content was verified by human team members against primary sources
3. No undisclosed or unverified AI output was submitted
4. The prompt log (PROMPT_LOG.md) is complete and accurate
5. The repository contains no secrets, API keys, or real personal data
6. Manual development (code review, refactoring, GitHub workflow, deployment) was performed by the team

**Signed on behalf of Group 1:**

_________________________________  
**Group 1 Representative**  
21st October 2026