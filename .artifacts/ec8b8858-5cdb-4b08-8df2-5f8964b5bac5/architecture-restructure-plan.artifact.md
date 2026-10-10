# UniHub Landing Experience — Architecture Restructure Plan

> **Status:** Planning Phase — Do Not Implement Yet
> **Target:** Feature-based modular architecture with clear layer separation
> **Stack:** React 19, TanStack Router/Start, TypeScript, Tailwind CSS v4, Vite

---

## 1. Current State Analysis

### Existing Structure
```
src/
├── components/           # Mixed: UI primitives + feature components
│   ├── ui/              # 40+ Radix-based UI primitives (Button, Card, Dialog, etc.)
│   ├── Logo.tsx
│   ├── CampusMap.tsx
│   ├── Experience.tsx
│   ├── VideoPanel.tsx
│   ├── ListingGrid.tsx
│   ├── LetterReveal.tsx
│   ├── MarketingChrome.tsx
│   ├── PlaceholderPage.tsx
│   └── ResidenceVideoGallery.tsx
├── routes/              # TanStack Router file-based routes (page components)
│   ├── index.tsx        # 701 lines — massive landing page
│   ├── about.tsx
│   ├── listings.tsx
│   ├── list-property.tsx
│   ├── contact.tsx
│   ├── terms.tsx
│   ├── privacy.tsx
│   └── __root.tsx
├── data/
│   └── listings.ts      # Sample listing data + types
├── hooks/
│   └── use-mobile.tsx   # Single hook
├── lib/
│   ├── utils.ts         # cn() helper
│   ├── error-page.ts
│   ├── error-capture.ts
│   └── error-reporting.ts
├── assets/              # 15 media files (images/videos)
├── styles.css           # 528 lines global styles + Tailwind
├── router.tsx           # Router configuration
├── routeTree.gen.ts     # Generated
├── start.ts             # TanStack Start entry
└── server.ts            # Server entry
```

### Pain Points Identified
| Issue | Impact |
|-------|--------|
| **Monolithic `index.tsx` (701 lines)** | Hard to maintain, test, collaborate |
| **Mixed `components/`** | UI primitives mixed with feature-specific components |
| **No domain layer** | Types, schemas, constants scattered |
| **Single `data/` file** | Will not scale with API integration |
| **No barrel exports** | Deep import paths (`@/components/VideoPanel`) |
| **Limited path aliases** | Only `@/*` mapped to `./src/*` |
| **No feature boundaries** | Cross-coupling between unrelated features |

---

## 2. Target Architecture

### 2.1 High-Level Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│  src/app/                    (App providers, routing, layout)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FEATURE LAYER                             │
│  src/features/                                                            │
│  ├── home/                 Landing page sections                  │
│  ├── listings/             Browse/search/filter listings          │
│  ├── property/             Property details, listing creation     │
│  ├── campus/               Campus map, area exploration           │
│  ├── residence/            Video gallery, residence showcases     │
│  ├── contact/              Contact forms, WhatsApp integration    │
│  ├── auth/                 (Future) User accounts, saved listings │
│  └── marketing/            SEO, analytics, A/B testing            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                             │
│  src/domain/                                                           │
│  ├── types/                Core TypeScript interfaces             │
│  ├── schemas/              Zod validation schemas                 │
│  ├── constants/            App-wide constants, enums, config      │
│  └── utils/                Pure domain utilities                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                        │
│  src/infrastructure/                                                    │
│  ├── api/                  API clients, TanStack Query hooks      │
│  ├── storage/              LocalStorage, IndexedDB, session       │
│  ├── media/                Image/video optimization, CDN helpers  │
│  ├── analytics/            Event tracking, consent management     │
│  ├── mapping/              MapLibre integration, geo utilities    │
│  └── messaging/            WhatsApp, email, notification helpers  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SHARED LAYER                             │
│  src/shared/                                                           │
│  ├── ui/                   Design system primitives (Radix wraps) │
│  ├── components/           Shared composite components            │
│  ├── hooks/                Generic reusable hooks                 │
│  ├── utils/                Generic utilities (cn, formatters)     │
│  ├── styles/               Global styles, Tailwind config         │
│  └── types/                Shared type utilities                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. New Directory Structure

```
src/
├── app/                           # Application bootstrap & providers
│   ├── providers/
│   │   ├── QueryProvider.tsx      # TanStack Query client
│   │   ├── ThemeProvider.tsx      # Theme/color-scheme
│   │   └── index.ts               # Barrel: compose all providers
│   ├── router/
│   │   ├── routes/                # Route tree definition
│   │   │   ├── __root.tsx
│   │   │   ├── index.tsx
│   │   │   ├── listings.tsx
│   │   │   ├── listings.$slug.tsx
│   │   │   ├── list-property.tsx
│   │   │   ├── about.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── terms.tsx
│   │   │   └── privacy.tsx
│   │   ├── routeTree.gen.ts       # Generated
│   │   └── router.tsx             # createRouter instantiation
│   ├── layout/
│   │   ├── MarketingLayout.tsx    # Header + Footer wrapper
│   │   └── AuthLayout.tsx         # (Future) Authenticated layout
│   └── index.ts                   # App entry exports
│
├── features/                      # Feature modules (vertical slices)
│   ├── home/
│   │   ├── components/            # Home-page specific components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   ├── ResidencesSection.tsx
│   │   │   ├── FeaturedListingsSection.tsx
│   │   │   ├── LocationsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useHomeData.ts     # Data fetching for home
│   │   ├── types/
│   │   │   └── home.ts            # Home-specific types
│   │   └── index.ts               # Feature barrel export
│   │
│   ├── listings/
│   │   ├── components/
│   │   │   ├── ListingGrid.tsx
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingFilters.tsx
│   │   │   ├── ListingSort.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useListings.ts     # TanStack Query hook
│   │   │   ├── useFilters.ts      # Filter state management
│   │   │   └── useListing.ts      # Single listing fetch
│   │   ├── types/
│   │   │   └── listing.ts         # Listing-specific types
│   │   ├── schemas/
│   │   │   └── listing.zod.ts     # Zod schemas for validation
│   │   └── index.ts
│   │
│   ├── property/
│   │   ├── components/
│   │   │   ├── PropertyDetail.tsx
│   │   │   ├── PropertyGallery.tsx
│   │   │   ├── PropertyContact.tsx
│   │   │   ├── ListPropertyForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useProperty.ts
│   │   │   └── useListProperty.ts
│   │   ├── types/
│   │   │   └── property.ts
│   │   ├── schemas/
│   │   │   └── property.zod.ts
│   │   └── index.ts
│   │
│   ├── campus/
│   │   ├── components/
│   │   │   ├── CampusMap.tsx
│   │   │   ├── CampusSelector.tsx
│   │   │   ├── CampusChip.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useCampuses.ts
│   │   ├── types/
│   │   │   └── campus.ts
│   │   ├── data/
│   │   │   └── campuses.ts        # Static campus data
│   │   └── index.ts
│   │
│   ├── residence/
│   │   ├── components/
│   │   │   ├── ResidenceVideoGallery.tsx
│   │   │   ├── CoolVideoCard.tsx
│   │   │   ├── PortraitVideo.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useResidenceClips.ts
│   │   ├── types/
│   │   │   └── residence.ts
│   │   ├── data/
│   │   │   └── residenceClips.ts  # Static clip data
│   │   └── index.ts
│   │
│   ├── contact/
│   │   ├── components/
│   │   │   ├── ContactForm.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useContactForm.ts
│   │   ├── schemas/
│   │   │   └── contact.zod.ts
│   │   └── index.ts
│   │
│   ├── marketing/
│   │   ├── components/
│   │   │   ├── SEOHead.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useAnalytics.ts
│   │   ├── utils/
│   │   │   └── seo.ts
│   │   └── index.ts
│   │
│   └── index.ts                   # Features barrel export
│
├── domain/                        # Pure domain logic (no React deps)
│   ├── types/
│   │   ├── common.ts              # Base types (Result, Pagination, etc.)
│   │   ├── listing.ts             # Core Listing interface
│   │   ├── property.ts            # Core Property interface
│   │   ├── campus.ts              # Core Campus interface
│   │   ├── residence.ts           # Core ResidenceClip interface
│   │   ├── user.ts                # (Future) User types
│   │   └── index.ts
│   ├── schemas/
│   │   ├── listing.zod.ts         # Zod schemas matching domain types
│   │   ├── property.zod.ts
│   │   ├── campus.zod.ts
│   │   ├── residence.zod.ts
│   │   ├── contact.zod.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── app.ts                 # App name, version, URLs
│   │   ├── routes.ts              # Route path constants
│   │   ├── whatsapp.ts            # WhatsApp numbers, templates
│   │   ├── pricing.ts             # Price formatting, currency
│   │   ├── categories.ts          # Listing categories enum
│   │   ├── breakpoints.ts         # Responsive breakpoints
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatting.ts          # Price, date, phone formatting
│   │   ├── validation.ts          # Reusable validators
│   │   ├── slug.ts                # Slug generation
│   │   └── index.ts
│   └── index.ts
│
├── infrastructure/                # External concerns & adapters
│   ├── api/
│   │   ├── client.ts              # Fetch wrapper with interceptors
│   │   ├── endpoints.ts           # API endpoint definitions
│   │   ├── queryKeys.ts           # TanStack Query key factory
│   │   ├── listings.api.ts        # Listings API calls
│   │   ├── property.api.ts        # Property API calls
│   │   ├── campus.api.ts
│   │   └── index.ts
│   ├── storage/
│   │   ├── localStorage.ts        # Typed localStorage wrapper
│   │   ├── sessionStorage.ts
│   │   ├── favorites.ts           # Favorites persistence
│   │   └── index.ts
│   ├── media/
│   │   ├── optimization.ts        # Image/video optimization helpers
│   │   ├── cdn.ts                 # CDN URL builders
│   │   ├── placeholders.ts        # Blur placeholders, LQIP
│   │   └── index.ts
│   ├── analytics/
│   │   ├── events.ts              # Event name constants
│   │   ├── tracker.ts             # Analytics provider (GA4, Plausible, etc.)
│   │   ├── consent.ts             # Cookie consent management
│   │   └── index.ts
│   ├── mapping/
│   │   ├── maplibre.ts            # MapLibre initialization
│   │   ├── markers.ts             # Custom marker components
│   │   ├── geocoding.ts           # Address ↔ coordinates
│   │   └── index.ts
│   ├── messaging/
│   │   ├── whatsapp.ts            # WhatsApp deep links, templates
│   │   ├── email.ts               # Mailto generators
│   │   └── index.ts
│   └── index.ts
│
├── shared/                        # Truly shared, reusable code
│   ├── ui/                        # Design system primitives
│   │   ├── primitives/            # Raw Radix wrappers (40+ components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── ...                # All existing ui/ files
│   │   │   └── index.ts
│   │   ├── composites/            # Composed components using primitives
│   │   │   ├── FormField.tsx      # Label + Input + Error
│   │   │   ├── DataTable.tsx      # Table + Pagination + Sort
│   │   │   ├── Modal.tsx          # Dialog + Portal + FocusTrap
│   │   │   ├── PageHeader.tsx     # Title + Description + Actions
│   │   │   ├── Section.tsx        # Consistent section wrapper
│   │   │   └── index.ts
│   │   ├── patterns/              # Common UI patterns
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── index.ts
│   │   └── index.ts               # UI barrel export
│   │
│   ├── components/                # Shared composite components
│   │   ├── Logo.tsx
│   │   ├── MarketingChrome.tsx    # Header + Footer (moved from components/)
│   │   ├── LetterReveal.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── Reveal.tsx
│   │   ├── VideoPanel.tsx
│   │   ├── Experience.tsx         # Act, JourneyRail
│   │   └── index.ts
│   │
│   ├── hooks/                     # Generic reusable hooks
│   │   ├── useIsMobile.ts         # Moved from hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                  # Moved from lib/utils.ts
│   │   ├── formatters.ts          # Date, currency, phone
│   │   ├── classNames.ts          # Additional className utilities
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── globals.css            # Moved from styles.css
│   │   ├── tailwind.css           # Tailwind v4 import + custom properties
│   │   ├── variables.css          # CSS custom properties (colors, spacing)
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── react.ts               # React type utilities
│   │   ├── utility.ts             # Type utilities (Prettify, etc.)
│   │   └── index.ts
│   │
│   └── index.ts                   # Shared barrel export
│
├── assets/                        # Static assets (unchanged)
│   ├── images/
│   │   ├── hero/
│   │   ├── listings/
│   │   ├── residences/
│   │   └── campus/
│   └── videos/
│       ├── hero/
│       ├── walkthrough/
│       ├── documentary/
│       └── residences/
│
└── index.ts                       # Root barrel export
```

---

## 4. Domain Layer Separation

### 4.1 Domain Types (`src/domain/types/`)

```typescript
// domain/types/common.ts
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// domain/types/listing.ts
export interface Listing {
  id: string;
  title: string;
  location: string;
  campusId: string;
  category: ListingCategory;
  price: number;           // In smallest currency unit (cents)
  priceFormatted: string;  // "KES 9,500"
  deposit: string;
  description: string;
  amenities: string[];
  images: ListingImage[];
  agent: AgentContact;
  verified: boolean;
  availableFrom: Date;
  coordinates?: GeoCoordinates;
  createdAt: Date;
  updatedAt: Date;
}

export type ListingCategory =
  | 'hostel'
  | 'bedsitter'
  | 'single-room'
  | 'studio'
  | 'apartment'
  | 'shared-apartment';

export interface ListingImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
}

export interface AgentContact {
  name: string;
  phone: string;
  email?: string;
  whatsappUrl: string;
  verified: boolean;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// domain/types/campus.ts
export interface Campus {
  id: string;
  code: string;        // "UoN", "JKUAT"
  name: string;        // "University of Nairobi"
  town: string;        // "Nairobi", "Juja"
  coordinates: GeoCoordinates;
  region: CampusRegion;
}

export type CampusRegion =
  | 'nairobi'
  | 'central'
  | 'rift-valley'
  | 'western'
  | 'coast'
  | 'eastern'
  | 'north-eastern';

// domain/types/residence.ts
export interface ResidenceClip {
  id: string;
  title: string;
  meta: string;
  blurb: string;
  src: string;
  poster: string;
  ariaLabel: string;
  duration?: number;
  tags?: string[];
}
```

### 4.2 Domain Schemas (`src/domain/schemas/`)

```typescript
// domain/schemas/listing.zod.ts
import { z } from 'zod';
import type { Listing, ListingCategory, AgentContact } from '../types/listing';

export const agentContactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email().optional(),
  whatsappUrl: z.string().url(),
  verified: z.boolean(),
});

export const listingSchema: z.ZodType<Listing> = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(120),
  location: z.string().min(2).max(100),
  campusId: z.string().min(1),
  category: z.enum([
    'hostel', 'bedsitter', 'single-room',
    'studio', 'apartment', 'shared-apartment'
  ]),
  price: z.number().positive(),
  priceFormatted: z.string(),
  deposit: z.string().min(1),
  description: z.string().min(20).max(5000),
  amenities: z.array(z.string()).min(1),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    alt: z.string(),
    width: z.number().positive(),
    height: z.number().positive(),
    blurDataUrl: z.string().url().optional(),
  })).min(1),
  agent: agentContactSchema,
  verified: z.boolean(),
  availableFrom: z.date(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createListingSchema = listingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verified: true,
});
```

### 4.3 Domain Constants (`src/domain/constants/`)

```typescript
// domain/constants/app.ts
export const APP_CONFIG = {
  name: 'UniHub',
  tagline: 'Verified Student Housing in Kenya',
  description: 'Browse verified hostels, bedsitters, and rentals near campus.',
  url: 'https://unihub.ke',
  supportEmail: 'hello@unihub.ke',
  version: '1.0.0',
} as const;

// domain/constants/routes.ts
export const ROUTES = {
  home: '/',
  listings: '/listings',
  listingDetail: (slug: string) => `/listings/${slug}`,
  listProperty: '/list-property',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const;

// domain/constants/whatsapp.ts
export const WHATSAPP_CONFIG = {
  businessNumber: '254700000000',
  defaultMessage: "Hi UniHub, I'd like help finding verified student housing",
  supportUrl: 'https://wa.me/254700000000',
  buildUrl: (message?: string) =>
    `https://wa.me/254700000000?text=${encodeURIComponent(message || WHATSAPP_CONFIG.defaultMessage)}`,
} as const;

// domain/constants/pricing.ts
export const CURRENCY = {
  code: 'KES',
  symbol: 'KES',
  locale: 'en-KE',
  format: (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount),
} as const;

export const PRICE_RANGES = [
  { min: 0, max: 5000, label: 'Under KES 5,000' },
  { min: 5000, max: 10000, label: 'KES 5,000 - 10,000' },
  { min: 10000, max: 15000, label: 'KES 10,000 - 15,000' },
  { min: 15000, max: 25000, label: 'KES 15,000 - 25,000' },
  { min: 25000, max: Infinity, label: 'Above KES 25,000' },
] as const;

// domain/constants/categories.ts
export const LISTING_CATEGORIES = [
  { value: 'hostel', label: 'Hostel', icon: 'building-2' },
  { value: 'bedsitter', label: 'Bedsitter', icon: 'home' },
  { value: 'single-room', label: 'Single Room', icon: 'door-open' },
  { value: 'studio', label: 'Studio', icon: 'layout' },
  { value: 'apartment', label: 'Apartment', icon: 'building' },
  { value: 'shared-apartment', label: 'Shared Apartment', icon: 'users' },
] as const;

// domain/constants/breakpoints.ts
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const MOBILE_BREAKPOINT = BREAKPOINTS.md;
```

---

## 5. Feature Modules with Clear Boundaries

### 5.1 Feature Module Contract

Each feature module **MUST** expose:
```typescript
// features/<feature>/index.ts
export * from './components';      // Public components
export * from './hooks';           // Public hooks
export * from './types';           // Public types
export * from './schemas';         // Public schemas (if any)
// NO direct exports from internal utils, constants, etc.
```

### 5.2 Dependency Rules

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Feature   │────▶│   Domain    │◀───│  Infra      │
│  (Home)     │     │  (Types)    │     │  (API)      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   ▲                   │
       ▼                   │                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Shared    │────▶│   Domain    │◀───│  Infra      │
│  (UI, Hooks)│     │  (Utils)    │     │  (Storage)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

| Layer | Can Import From |
|-------|-----------------|
| **Features** | Domain, Infrastructure, Shared |
| **Domain** | (Nothing — pure TypeScript) |
| **Infrastructure** | Domain, Shared |
| **Shared** | Domain (types only) |
| **App** | Features, Domain, Infrastructure, Shared |

### 5.3 Example: `features/listings/`

```typescript
// features/listings/components/ListingCard.tsx
import { ListingCardProps } from './types';
import { cn } from '@/shared/utils/cn';
import { formatPrice } from '@/domain/utils/formatting';
import { Button } from '@/shared/ui/primitives/button';
import { Badge } from '@/shared/ui/primitives/badge';

export function ListingCard({ listing, onViewDetails }: ListingCardProps) {
  return (
    <article className="listing-card group h-full ...">
      {/* ... */}
      <Button onClick={() => onViewDetails(listing.id)}>View Details</Button>
    </article>
  );
}

// features/listings/hooks/useListings.ts
import { useQuery } from '@tanstack/react-query';
import { listingsApi } from '@/infrastructure/api/listings.api';
import { queryKeys } from '@/infrastructure/api/queryKeys';
import type { ListingFilters } from '../types';

export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: queryKeys.listings(filters),
    queryFn: () => listingsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// features/listings/index.ts
export * from './components';
export * from './hooks';
export * from './types';
export * from './schemas';
```

---

## 6. Shared Infrastructure Layer

### 6.1 API Layer (`src/infrastructure/api/`)

```typescript
// infrastructure/api/client.ts
import type { Result } from '@/domain/types/common';

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: { ...this.defaultHeaders, ...options.headers },
      });

      if (!response.ok) {
        return { ok: false, error: new Error(`HTTP ${response.status}`) };
      }

      const data = await response.json();
      return { ok: true, value: data };
    } catch (error) {
      return { ok: false, error: error as Error };
    }
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint, { method: 'GET' }); }
  post<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
}

export const apiClient = new ApiClient();

// infrastructure/api/listings.api.ts
import { apiClient } from './client';
import type { Listing, PaginatedResponse } from '@/domain/types/listing';
import type { ListingFilters } from '@/features/listings/types';

export const listingsApi = {
  getAll: (filters: ListingFilters) =>
    apiClient.get<PaginatedResponse<Listing>>('/listings', { params: filters }),

  getById: (id: string) =>
    apiClient.get<Listing>(`/listings/${id}`),

  getFeatured: (limit = 6) =>
    apiClient.get<Listing[]>(`/listings/featured?limit=${limit}`),

  create: (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Listing>('/listings', data),
};

// infrastructure/api/queryKeys.ts
export const queryKeys = {
  listings: (filters?: Record<string, unknown>) => ['listings', filters] as const,
  listing: (id: string) => ['listings', id] as const,
  featuredListings: (limit: number) => ['listings', 'featured', limit] as const,
  campuses: () => ['campuses'] as const,
  campus: (id: string) => ['campuses', id] as const,
  residenceClips: () => ['residences', 'clips'] as const,
} as const;
```

### 6.2 Media Infrastructure (`src/infrastructure/media/`)

```typescript
// infrastructure/media/optimization.ts
export function getOptimizedImageUrl(
  src: string,
  options: { width?: number; height?: number; quality?: number; format?: 'webp' | 'avif' } = {}
): string {
  const params = new URLSearchParams();
  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.quality) params.set('q', String(options.quality));
  if (options.format) params.set('fm', options.format);
  return `${src}?${params.toString()}`;
}

export function generateBlurDataUrl(width: number, height: number): string {
  // Generate tiny base64 placeholder
  return `data:image/png;base64,...`;
}

// infrastructure/media/cdn.ts
export const CDN_CONFIG = {
  baseUrl: import.meta.env.VITE_CDN_URL || '',
  imageTransforms: {
    thumbnail: { width: 400, height: 300, quality: 75 },
    card: { width: 800, height: 600, quality: 80 },
    hero: { width: 1920, height: 1080, quality: 85 },
  },
} as const;

export function getImageUrl(path: string, variant: keyof typeof CDN_CONFIG.imageTransforms = 'card'): string {
  const { baseUrl, imageTransforms } = CDN_CONFIG;
  const transform = imageTransforms[variant];
  return `${baseUrl}${path}?w=${transform.width}&h=${transform.height}&q=${transform.quality}&fm=webp`;
}
```

---

## 7. Updated Path Aliases in tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./src/app/*"],
      "@features/*": ["./src/features/*"],
      "@domain/*": ["./src/domain/*"],
      "@infrastructure/*": ["./src/infrastructure/*"],
      "@shared/*": ["./src/shared/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

### 7.1 Vite Config Update (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tanstackRouter from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@features': '/src/features',
      '@domain': '/src/domain',
      '@infrastructure': '/src/infrastructure',
      '@shared': '/src/shared',
      '@assets': '/src/assets',
    },
  },
});
```

---

## 8. Barrel Exports Strategy

### 8.1 Layer Barrels

```typescript
// src/domain/index.ts
export * from './types';
export * from './schemas';
export * from './constants';
export * from './utils';

// src/infrastructure/index.ts
export * from './api';
export * from './storage';
export * from './media';
export * from './analytics';
export * from './mapping';
export * from './messaging';

// src/shared/index.ts
export * from './ui';
export * from './components';
export * from './hooks';
export * from './utils';
export * from './styles';
export * from './types';

// src/features/index.ts
export * from './home';
export * from './listings';
export * from './property';
export * from './campus';
export * from './residence';
export * from './contact';
export * from './marketing';
```

### 8.2 Feature Barrels

```typescript
// src/features/listings/index.ts
export { ListingGrid, ListingCard, ListingFilters, ListingSort, Pagination } from './components';
export { useListings, useFilters, useListing } from './hooks';
export type { ListingFilters, ListingSortOption, ListingViewMode } from './types';
export { listingSchema, createListingSchema } from './schemas';
```

### 8.3 Shared UI Barrels

```typescript
// src/shared/ui/primitives/index.ts
// Re-export all 40+ Radix wrappers
export { Button, buttonVariants } from './button';
export { Card, CardHeader, CardContent, CardFooter } from './card';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
// ... all primitives

// src/shared/ui/composites/index.ts
export { FormField } from './FormField';
export { DataTable } from './DataTable';
export { Modal } from './Modal';
export { PageHeader } from './PageHeader';
export { Section } from './Section';

// src/shared/ui/patterns/index.ts
export { LoadingSkeleton } from './LoadingSkeleton';
export { EmptyState } from './EmptyState';
export { ErrorBoundary } from './ErrorBoundary';
export { ConfirmDialog } from './ConfirmDialog';
```

### 8.4 Import Examples After Restructure

```typescript
// BEFORE (current)
import { ListingGrid } from '@/components/ListingGrid';
import { cn } from '@/lib/utils';
import { sampleListings } from '@/data/listings';
import { useIsMobile } from '@/hooks/use-mobile';
import { VideoPanel, PortraitVideo, Reveal } from '@/components/VideoPanel';

// AFTER (restructured)
import { ListingGrid, ListingCard } from '@/features/listings';
import { cn } from '@/shared/utils';
import { formatPrice } from '@/domain/utils/formatting';
import { useIsMobile } from '@/shared/hooks';
import { VideoPanel, PortraitVideo, Reveal } from '@/shared/components';
import { WHATSAPP_CONFIG } from '@/domain/constants/whatsapp';
import { LISTING_CATEGORIES } from '@/domain/constants/categories';
import { queryKeys } from '@/infrastructure/api/queryKeys';
import { getOptimizedImageUrl } from '@/infrastructure/media/optimization';
```

---

## 9. Migration Strategy

### 9.1 Phase 1: Foundation (Week 1) — **Zero Risk**

| Task | Description | Verification |
|------|-------------|--------------|
| 1.1 | Create new directory structure (empty dirs + index.ts) | `tsc --noEmit` passes |
| 1.2 | Update `tsconfig.json` with new path aliases | All imports resolve |
| 1.3 | Update `vite.config.ts` aliases | Dev server starts |
| 1.4 | Move `src/lib/utils.ts` → `src/shared/utils/cn.ts` | No broken imports |
| 1.5 | Move `src/hooks/use-mobile.tsx` → `src/shared/hooks/useIsMobile.ts` | No broken imports |
| 1.6 | Move `src/styles.css` → `src/shared/styles/globals.css` | Styles apply correctly |
| 1.7 | Move `src/components/ui/` → `src/shared/ui/primitives/` | All UI components work |

**Deliverable:** Working app with new aliases, old paths still functional via `@/*`

### 9.2 Phase 2: Domain Layer (Week 1-2) — **Low Risk**

| Task | Description | Verification |
|------|-------------|--------------|
| 2.1 | Create `src/domain/types/` with core interfaces | Types compile |
| 2.2 | Create `src/domain/schemas/` with Zod schemas | Validation works |
| 2.3 | Create `src/domain/constants/` with app constants | Constants usable |
| 2.4 | Create `src/domain/utils/` with pure utilities | Utils testable |
| 2.5 | Move `src/data/listings.ts` types → `domain/types/listing.ts` | Types match |
| 2.6 | Create barrel exports for domain layer | `@domain/*` imports work |

**Deliverable:** Pure TypeScript domain layer, zero React dependencies

### 9.3 Phase 3: Infrastructure Layer (Week 2) — **Medium Risk**

| Task | Description | Verification |
|------|-------------|--------------|
| 3.1 | Create API client with Result<T> pattern | Network calls work |
| 3.2 | Define query keys factory | Query keys consistent |
| 3.3 | Create media optimization helpers | Images load correctly |
| 3.4 | Extract WhatsApp/email helpers | Links work |
| 3.5 | Create MapLibre adapter | Map renders |
| 3.6 | Add analytics event constants | Events fire |

**Deliverable:** Infrastructure ready for feature consumption

### 9.4 Phase 4: Shared UI Reorganization (Week 2-3) — **Medium Risk**

| Task | Description | Verification |
|------|-------------|--------------|
| 4.1 | Split `shared/ui` into primitives/composites/patterns | All components render |
| 4.2 | Move `MarketingChrome` → `shared/components/` | Header/Footer render |
| 4.3 | Move `VideoPanel`, `Experience`, `LetterReveal` → `shared/components/` | Animations work |
| 4.4 | Create composite components (FormField, Modal, Section) | Used in features |
| 4.5 | Create pattern components (LoadingSkeleton, EmptyState) | Used in features |

**Deliverable:** Clean shared UI layer with clear separation

### 9.5 Phase 5: Feature Extraction (Week 3-4) — **High Risk**

> **Strategy:** Extract one feature at a time, verify, then proceed.

| Feature | Source Files | Target Location | Priority |
|---------|--------------|-----------------|----------|
| **home** | `routes/index.tsx` (sections) | `features/home/` | 1 |
| **listings** | `routes/listings.tsx`, `components/ListingGrid.tsx` | `features/listings/` | 2 |
| **property** | `routes/list-property.tsx`, `routes/listings.tsx` (detail) | `features/property/` | 3 |
| **campus** | `components/CampusMap.tsx`, campus codes in `index.tsx` | `features/campus/` | 4 |
| **residence** | `components/ResidenceVideoGallery.tsx`, clips data | `features/residence/` | 5 |
| **contact** | `routes/contact.tsx`, WhatsApp links | `features/contact/` | 6 |
| **marketing** | SEO meta in routes, analytics | `features/marketing/` | 7 |

**Extraction Pattern per Feature:**
```bash
# 1. Create feature directory structure
mkdir -p src/features/home/{components,hooks,types,schemas}

# 2. Move components (one at a time, verify each)
# 3. Create feature hooks for data fetching
# 4. Define feature-specific types (extend domain types)
# 5. Create feature barrel export
# 6. Update route to use feature components
# 7. Run lint + typecheck + visual regression
```

### 9.6 Phase 6: Route Restructure (Week 4) — **Medium Risk**

```typescript
// New route structure using TanStack Router v1 file-based routes
src/app/router/routes/
├── __root.tsx                 # Root layout + providers
├── index.tsx                  # Home page (thin, uses features/home)
├── listings.tsx               # Listings index (uses features/listings)
├── listings.$slug.tsx         # Listing detail (uses features/property)
├── list-property.tsx          # List property form (uses features/property)
├── about.tsx                  # Static page
├── contact.tsx                # Contact page (uses features/contact)
├── terms.tsx
└── privacy.tsx
```

### 9.7 Phase 7: Cleanup & Optimization (Week 5) — **Low Risk**

| Task | Description |
|------|-------------|
| 7.1 | Delete old `src/components/` (except `ui/` already moved) |
| 7.2 | Delete old `src/data/`, `src/hooks/`, `src/lib/` |
| 7.3 | Delete old `src/styles.css` |
| 7.4 | Remove `@/*` alias, keep only namespaced aliases |
| 7.5 | Add ESLint rules to enforce layer boundaries |
| 7.6 | Update import statements across codebase |
| 7.7 | Run full test suite + visual regression |
| 7.8 | Document new architecture in `ARCHITECTURE.md` |

---

## 10. Validation Checklist

### Pre-Migration
- [ ] All tests pass
- [ ] Visual regression baseline captured
- [ ] Bundle size recorded
- [ ] Lint/typecheck clean

### Per-Phase
- [ ] `pnpm lint` passes
- [ ] `pnpm tsc --noEmit` passes
- [ ] Dev server starts without errors
- [ ] Key user flows work (browse, search, contact)
- [ ] Visual regression matches baseline (±1%)

### Post-Migration
- [ ] All phases complete
- [ ] No `@/components/*` imports remain (except `ui/primitives`)
- [ ] No `@/data/*`, `@/hooks/*`, `@/lib/*` imports remain
- [ ] All imports use namespaced aliases (`@features/*`, `@domain/*`, etc.)
- [ ] Bundle size ≤ pre-migration
- [ ] Build time improved
- [ ] Architecture decision record (ADR) created

---

## 11. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing imports during alias migration | High | High | Keep `@/*` alias during transition; migrate imports incrementally |
| Circular dependencies between features | Medium | High | Enforce dependency rules with ESLint `import/no-restricted-paths` |
| TanStack Router route tree conflicts | Low | High | Generate route tree after each feature extraction |
| Lost styling during component moves | Medium | Medium | Use visual regression testing; preserve CSS module structure |
| Performance regression from over-abstraction | Low | Medium | Profile bundle size; tree-shaking should eliminate unused code |
| Team friction with new patterns | Medium | Low | Pair program first feature; document patterns in `CONTRIBUTING.md` |

---

## 12. Tooling & Enforcement

### 12.1 ESLint Rules for Layer Boundaries

```javascript
// eslint.config.js additions
{
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/features/*',
            from: './src/features/*',
            except: ['./src/features/*/index.ts'],
            message: 'Features cannot import from other features directly. Use domain/infrastructure/shared.',
          },
          {
            target: './src/domain/*',
            from: './src/domain/*',
            message: 'Domain layer cannot have internal dependencies. Keep it flat.',
          },
          {
            target: './src/infrastructure/*',
            from: './src/features/*',
            message: 'Features should import infrastructure via barrel exports.',
          },
        ],
      },
    ],
  },
}
```

### 12.2 TypeScript Project References (Optional Future)

```json
// tsconfig.domain.json
{
  "compilerOptions": { "composite": true, "declaration": true },
  "include": ["src/domain/**/*"],
  "references": []
}

// tsconfig.features.json
{
  "compilerOptions": { "composite": true },
  "include": ["src/features/**/*"],
  "references": [{ "path": "./tsconfig.domain.json" }]
}
```

---

## 13. Appendix: File Mapping Reference

### Component Migration Map

| Current Path | New Path | Layer |
|--------------|----------|-------|
| `src/components/ui/*` | `src/shared/ui/primitives/*` | Shared |
| `src/components/MarketingChrome.tsx` | `src/shared/components/MarketingChrome.tsx` | Shared |
| `src/components/VideoPanel.tsx` | `src/shared/components/VideoPanel.tsx` | Shared |
| `src/components/Experience.tsx` | `src/shared/components/Experience.tsx` | Shared |
| `src/components/LetterReveal.tsx` | `src/shared/components/LetterReveal.tsx` | Shared |
| `src/components/CampusMap.tsx` | `src/features/campus/components/CampusMap.tsx` | Feature |
| `src/components/ResidenceVideoGallery.tsx` | `src/features/residence/components/ResidenceVideoGallery.tsx` | Feature |
| `src/components/ListingGrid.tsx` | `src/features/listings/components/ListingGrid.tsx` | Feature |
| `src/components/Logo.tsx` | `src/shared/components/Logo.tsx` | Shared |
| `src/components/PlaceholderPage.tsx` | `src/shared/components/PlaceholderPage.tsx` | Shared |

### Data/Logic Migration Map

| Current Path | New Path | Layer |
|--------------|----------|-------|
| `src/data/listings.ts` (types) | `src/domain/types/listing.ts` | Domain |
| `src/data/listings.ts` (sample data) | `src/features/listings/data/sampleListings.ts` | Feature |
| `src/data/listings.ts` (data) | `src/features/residence/data/residenceClips.ts` | Feature |
| `src/hooks/use-mobile.tsx` | `src/shared/hooks/useIsMobile.ts` | Shared |
| `src/lib/utils.ts` | `src/shared/utils/cn.ts` | Shared |
| `src/lib/error-*.ts` | `src/infrastructure/error-reporting/` | Infrastructure |
| `src/styles.css` | `src/shared/styles/globals.css` | Shared |

### Route Migration Map

| Current Route | New Route | Feature |
|---------------|-----------|---------|
| `src/routes/index.tsx` | `src/app/router/routes/index.tsx` | home |
| `src/routes/listings.tsx` | `src/app/router/routes/listings.tsx` | listings |
| `src/routes/list-property.tsx` | `src/app/router/routes/list-property.tsx` | property |
| `src/routes/about.tsx` | `src/app/router/routes/about.tsx` | marketing |
| `src/routes/contact.tsx` | `src/app/router/routes/contact.tsx` | contact |
| `src/routes/terms.tsx` | `src/app/router/routes/terms.tsx` | marketing |
| `src/routes/privacy.tsx` | `src/app/router/routes/privacy.tsx` | marketing |

---

## 14. Next Steps

1. **Review this plan** with team stakeholders
2. **Approve Phase 1** (Foundation) to begin implementation
3. **Set up visual regression testing** (Playwright + Pixelmatch)
4. **Create ADR** documenting architectural decisions
5. **Schedule weekly check-ins** during migration

---

*Document Version: 1.0*
*Created: 2025*
*Author: Architecture Planning Agent*