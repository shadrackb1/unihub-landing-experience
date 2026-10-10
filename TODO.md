# UniHub Architecture Restructure — TODO Plan

## 🎯 Goal
Complete the architecture restructure so the codebase compiles cleanly, follows the layered architecture, and has no broken files or stale directories.

---

## 📋 Task List

### Task 1: Fix broken shared components (BUGS from migration)
- [ ] 1.1 Fix `src/shared/components/LogoMark.tsx` — broken JSX `aria-hidden` attribute inside className
- [ ] 1.2 Fix `src/shared/components/Logo.tsx` — broken JSX, duplicate LogoMark import/export, restore original props signature
- [ ] 1.3 Fix `src/shared/components/MarketingChrome.tsx` — missing `useState`/`useEffect` imports
- [ ] 1.4 Fix `src/shared/components/JourneyRail.tsx` — unused import (`reduced`), duplicate of Experience.tsx content
- [ ] 1.5 Fix `src/shared/components/Act.tsx` — duplicate of Experience.tsx content
- [ ] 1.6 Fix `src/shared/components/PlaceholderPage.tsx` — check missing `children` in BreadcrumbPage-like JSX (verify)

### Task 2: Complete Domain Layer (`src/domain/`)
- [ ] 2.1 Create `src/domain/types/listing.ts` — SampleListing interface
- [ ] 2.2 Create `src/domain/types/campus.ts` — CampusPin interface
- [ ] 2.3 Create `src/domain/types/residence.ts` — ResidenceClip interface
- [ ] 2.4 Create `src/domain/types/common.ts` — shared generic types
- [ ] 2.5 Create `src/domain/types/index.ts` — barrel
- [ ] 2.6 Create `src/domain/constants/whatsapp.ts` — WHATSAPP_URL config
- [ ] 2.7 Create `src/domain/constants/routes.ts` — route constants
- [ ] 2.8 Create `src/domain/constants/index.ts` — barrel
- [ ] 2.9 Fix `src/domain/index.ts` — only export what exists

### Task 3: Complete Infrastructure Layer (`src/infrastructure/`)
- [ ] 3.1 Create `src/infrastructure/messaging/whatsapp.ts` — WhatsApp deep link builders
- [ ] 3.2 Create `src/infrastructure/messaging/index.ts` — barrel
- [ ] 3.3 Fix `src/infrastructure/error-reporting/error-capture.ts` — remove bad `Result` import, restore original logic from git history
- [ ] 3.4 Fix `src/infrastructure/error-reporting/error-page.ts` — restore original logic (check server.ts usage)
- [ ] 3.5 Fix `src/infrastructure/error-reporting/index.ts` — only export what exists

### Task 4: Migrate data & remove legacy directories
- [ ] 4.1 Move listing types to `src/domain/types/listing.ts`, keep sample data in `src/data/listings.ts` importing domain types
- [ ] 4.2 Remove `src/lib/` directory (empty)
- [ ] 4.3 Remove `src/hooks/use-mobile.tsx` (migrated to shared)
- [ ] 4.4 Remove old `src/components/ListingGrid.tsx` (migrated to features)
- [ ] 4.5 Remove old `src/components/ResidenceVideoGallery.tsx` (migrated to features)
- [ ] 4.6 Remove empty `src/components/` directory

### Task 5: Fix barrel exports
- [ ] 5.1 Create `src/shared/utils/index.ts`
- [ ] 5.2 Create `src/shared/hooks/index.ts`
- [ ] 5.3 Create `src/shared/components/index.ts`
- [ ] 5.4 Create `src/shared/styles/index.ts` (re-export styles.css)
- [ ] 5.5 Fix `src/shared/index.ts` — only export what exists
- [ ] 5.6 Fix `src/shared/ui/index.ts` — remove references to non-existent composites/patterns
- [ ] 5.7 Fix `src/shared/ui/primitives/index.ts` — export only real files with real export names

### Task 6: Update routes to use domain/infrastructure
- [ ] 6.1 Update `src/routes/__root.tsx` — verify error-reporting import works
- [ ] 6.2 Update `src/routes/index.tsx` — verify imports work
- [ ] 6.3 Update `src/routes/listings.tsx` — verify imports work
- [ ] 6.4 Verify all routes compile

### Task 7: Verification
- [ ] 7.1 Run `tsc --noEmit` — zero errors
- [ ] 7.2 Run dev server smoke test
- [ ] 7.3 Update README structure section to reflect final layout
- [ ] 7.4 Clean up progress/summary markdown files (consolidate into one)

---

## ⚠️ Constraints
- Keep Lovable integration intact (`@lovable.dev/vite-tanstack-config`, lovable error hooks)
- Routes must stay in `src/routes/` (TanStack Router file-based routing generates routeTree from there)
- Preserve app functionality — no visual/behavior changes
