---
name: complete-architecture-restructure
description: Complete architecture restructure TODO items and fix compilation errors in a React/TypeScript codebase following a layered (domain-driven) structure. Uses TODO.md and PHASE1_PROGRESS.md plans, migrates components across layers, and fixes tsc --noEmit errors.
license: MIT
metadata:
  author: session
  version: "1.0.0"
---

# Completing Architecture Restructure TODO Items

## Overview

This skill covers the systematic process of completing architecture restructure TODO plans (typically derived from `TODO.md` and `PHASE1_PROGRESS.md` files) in a React/TypeScript codebase organized with layered/domain-driven architecture (`src/app/`, `src/domain/`, `src/infrastructure/`, `src/shared/`, `src/features/`).

## Trigger

Use when the user says things like:

- "Check the app progress"
- "Fix the architecture restructure TODO items"
- "Complete the domain layer"
- "Fix compilation errors from restructure"
- "Migrate components to the new structure"

## Steps

### 1. Read the TODO/Progress Files

Start by reading the project's TODO plan and phase progress report:

```bash
cat TODO.md
cat PHASE1_PROGRESS.md
```

**Why:** These files enumerate the exact remaining items, their locations, and the migration state. Skipping this step leads to redundant work or missed items.

### 2. Inventory Current State

List all TypeScript/JSX files in the source tree to understand what exists:

```bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" ! -path "*/.git/*" | sort
```

**Why:** Knowing the full file map reveals gaps (missing directories, orphaned files) and confirms what has already been migrated.

### 3. Fix Broken Shared Components (Task 1)

Address the "broken shared components" items first, as they often cause cascading import errors:

- **LogoMark.tsx:** Check for broken JSX attributes (e.g. `aria-hidden` inside `className`). Fix the JSX structure.
- **Logo.tsx:** Verify the props signature matches the expected interface; restore original props if duplicated/merged.
- **MarketingChrome.tsx:** Ensure `useState`/`useEffect` imports are present if needed; verify all imports resolve.
- **JourneyRail.tsx:** Look for unused imports (`reduced` etc.) and duplicate content; clean up.
- **Act.tsx:** May be a duplicate of Experience.tsx — verify and consolidate.
- **PlaceholderPage.tsx:** Verify children flow into BreadcrumbPage-like JSX if applicable.

### 4. Complete the Domain Layer (Task 2)

Create the domain layer directories and files that are referenced but missing:

**Create directories:**

```bash
mkdir -p src/domain/types src/domain/schemas src/domain/constants src/domain/utils
```

**Create barrel exports** for each new index:

- `src/domain/types/index.ts` — export core interfaces (e.g., `SampleListing`, `CampusPin`, `ResidenceClip`)
- `src/domain/schemas/index.ts` — Zod validation schemas if applicable
- `src/domain/constants/index.ts` — app-wide constants, enums, config (e.g., `WHATSAPP_URL`)
- `src/domain/utils/index.ts` — pure domain utilities (formatting, validation)

**Create `src/domain/index.ts` barrel** exporting only what exists:

```typescript
export * from "./types";
export * from "./schemas";
export * from "./constants";
export * from "./utils";
```

**Why:** The domain layer is the foundation — other layers (infrastructure, features) import from it. Missing directories cause `TS2307: Cannot find module` errors.

### 5. Complete the Infrastructure Layer (Task 3)

Create infrastructure directories and fix error-reporting:

**Create directories:**

```bash
mkdir -p src/infrastructure/messaging
```

**Create `src/infrastructure/messaging/whatsapp.ts`** — WhatsApp deep link builders.

**Create `src/infrastructure/messaging/index.ts`** — barrel export.

**Fix `src/infrastructure/error-reporting/error-capture.ts`** — remove bad `Result` imports, restore original logic from git history if needed.

**Fix `src/infrastructure/error-reporting/error-page.ts`** — restore original logic (check `server.ts` usage).

**Fix `src/infrastructure/error-reporting/index.ts`** — only export what exists.

### 6. Migrate Data & Remove Legacy Directories (Task 4)

- Move listing types to `src/domain/types/listing.ts`, keep sample data in `src/data/listings.ts` importing domain types.
- Remove `src/lib/` directory (empty or redundant).
- Remove `src/hooks/use-mobile.tsx` (migrated to shared hooks).
- Remove old `src/components/ListingGrid.tsx` (migrated to features).
- Remove old `src/components/ResidenceVideoGallery.tsx` (migrated to features).
- Remove empty `src/components/` directory.

### 7. Fix Barrel Exports (Task 5)

Create and fix shared module barrels:

- `src/shared/utils/index.ts` — utility re-exports
- `src/shared/hooks/index.ts` — hook re-exports
- `src/shared/components/index.ts` — component re-exports
- `src/shared/styles/index.ts` — re-export `styles.css`
- `src/shared/index.ts` — only export what exists; fix duplicate exports (e.g., `Select`, `Slider`, `Tabs` in `./primitives`)
- `src/shared/ui/index.ts` — remove references to non-existent composites/patterns
- `src/shared/ui/primitives/index.ts` — export only real files with real export names
- `src/shared/ui/composites/index.ts` — fix module resolution errors
- `src/shared/ui/patterns/index.ts` — fix module resolution errors

### 8. Update Routes to Use Domain/Infrastructure (Task 6)

Verify and update route files:

- `src/routes/__root.tsx` — verify error-reporting import works
- `src/routes/index.tsx` — verify imports work
- `src/routes/listings.tsx` — verify imports work
- Confirm all routes compile

### 9. Verification (Task 7)

Run the full verification suite:

```bash
npx tsc --noEmit  # zero errors target
npm run build     # verify production build succeeds
npm run lint      # verify lint passes (or address top errors)
```

**Then:**

- Update README structure section to reflect final layout
- Consolidate progress/summary markdown files into one

## Common Pitfalls & Fixes

| Pitfall                                                             | Fix                                                                                                                    |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `TS2307: Cannot find module`                                        | Create the missing directory and/or barrel export; verify the path alias `@/...` resolves correctly in `tsconfig.json` |
| `TS2308: Module ... has already exported a member`                  | In the barrel export, explicitly re-export to resolve ambiguity, or remove the duplicate from one module               |
| `TS2345: Type ... is not assignable to type ...`                    | Narrow the type (add `                                                                                                 | undefined` checks, use definite assignment assertions, or adjust the function signature) |
| `TS2694: Namespace has no exported member` (Radix UI)               | Check the `@radix-ui/react-*` version compatibility; may need to update imports or use the correct export name         |
| `context.boundary ? ... : undefined` (boundary is undefined)        | Use `context.boundary !== undefined ? ... : undefined` to satisfy the type checker                                     |
| `Property 'className' does not exist on type 'IntrinsicAttributes'` | Ensure the component's props type is correct; add `className` to IntrinsicAttributes if extending a native element     |
| `Argument of type 'string                                           | undefined' is not assignable to parameter of type 'string'`                                                            | Add a guard `ready                                                                       |     | = ''`or use`?? ''`/`String(ready)` before passing to the expected type |

## Verification Commands

```bash
# Check for compilation errors
npx tsc --noEmit

# Build the project
npm run build

# Run lint
npm run lint
```

## Related Skills

- `clean-architecture`: For structuring code around the Dependency Rule when designing new architectures
- `domain-driven-design`: For modeling software around the business domain with bounded contexts
- `working-with-legacy-code`: For safely changing untested codebases when the restructure uncovers legacy issues

## Support Files

Consider creating these reference files for the skill:

- `references/change-algorithm.md` — the five-step change algorithm from "Working Effectively with Legacy Code"
- `references/seams.md` — seam catalog for common dependency blockers in TS/React
- `references/characterization-tests.md` — golden master and snapshot test patterns

### References file creation example:

```bash
# Create the references directory
mkdir -p references

# Create a decision table for common TS/React compile errors
touch references/ts-compile-errors.md
```

## Notes

- Always work incrementally: fix one compilation error at a time, run `tsc --noEmit`, then move to the next.
- Preserve app functionality — the constraint is structural reorganization, not visual/behavior changes.
- Routes must stay in `src/routes/` because TanStack Router generates `routeTree.gen.ts` from there.
- Keep Lovable integration intact (`@lovable.dev/vite-tanstack-config`, lovable error hooks).
