# UniHub — Design & System Blueprint

**Document type:** Architecture + design specification  
**Product:** UniHub — verified student housing for Kenyan campuses  
**Audience:** Engineers, designers, product owners, Lovable/Vercel operators  
**Status:** Living spec for the landing experience (v1)

---

## 0. Executive brief

UniHub helps university students in Kenya find **verified** hostels, bedsitters, rooms, and shared apartments near campus, then contact landlords or agents on WhatsApp. The marketing site’s only job is to move a visitor from uncertainty to **Browse Listings** while proving the inventory is real and safer than random WhatsApp groups.

Primary conversion: **Browse Listings**  
Secondary: **List your property** (landlords/agents)  
Tertiary: WhatsApp support  

---

## 1. Product context (why this system exists)

| Problem | System response |
| --- | --- |
| Fake listings / scam agents | Verification workflow + “Vetted” stamps + anti-scam band |
| Scattered Facebook/WhatsApp groups | Single catalog + campus map |
| No account friction for search | Browse without signup; contact is external (WhatsApp) |
| Students pick by commute | Campus-first IA (UoN, JKUAT, KU, Moi, Egerton…) |
| Trust needs proof | Residence video, walkthrough, real map tiles |

**Non-goals (v1):** in-app chat, payments, deposits escrow, live availability sync, landlord CMS. Those are phase 2.

---

## 2. Experience architecture (page as a system)

The homepage is a **seven-act funnel**, not a pile of sections.

```
[ Nav: Journey · Listings · About · Contact · List property ]

ACT I    Arrive     Hero video + letter headline + campus rail
         ↓
ACT II   Orient     4-step journey + full site walkthrough
         ↓
ACT III  Believe    Verified / Renter-focused / Direct contact
         ↓
ACT IV   Witness    Residence films (Qwetu + room/hostel clips)
         ↓
ACT V    Choose     Featured listings + KES pricing + room video
         ↓
ACT VI   Place      Live campus map (MapLibre, keyless tiles)
         ↓
         Proof      Anti-scam statement (trust checkpoint)
         ↓
ACT VII  Move       Landlord CTA + final Browse band
         ↓
[ Footer · WhatsApp · legal ]
```

**Supporting routes**

```
/listings        sample catalog + filter UI
/about           brand pillars
/contact         WhatsApp + email + coverage
/list-property   landlord onboarding path
/privacy /terms  legal stubs
```

---

## 3. Visual foundations (design tokens)

Defined in `src/styles.css` (oklch → Tailwind theme).

| Token | Value / role |
| --- | --- |
| `--background` | Near-black site canvas |
| `--panel` / `--card` | Section elevation / glass cards |
| `--foreground` | Primary ink (white) |
| `--muted-foreground` | Secondary copy |
| `--primary` | White CTA fill (text black) |
| `--highlight` | Mint accent — verification only, scarce |
| `--status` | Available badge green |
| `--border` | White @ ~10–12% |
| `--radius` | 1.5rem base → 3xl cards |
| Fonts | Display **Space Grotesk** · Body **Inter** |

**Logo system**

- Roofline + **U** monogram + mint verification seal  
- Assets: `public/logo.svg`, `logo-mark.svg`, `favicon.svg`  
- React: `src/components/Logo.tsx`

**Motion rules**

- Hero letters: staggered rise + unblur once on load  
- Sections: one-shot scroll reveal (`useInView`)  
- Video: muted autoplay when in viewport; pause when out  
- All gated by `prefers-reduced-motion`

---

## 4. Technical architecture

### 4.1 Runtime stack

```
Browser
  └── React 19 + TanStack Router (file routes)
        └── TanStack Start (SSR)
              └── Vite 8 build
                    └── Nitro
                          ├── preset: vercel  →  .vercel/output
                          └── (optional) node-server / static for offline USB
```

| Layer | Technology |
| --- | --- |
| UI | React 19, Tailwind 4, lucide-react |
| Routing | TanStack Router `src/routes/*` |
| SSR | TanStack Start + custom `src/server.ts` error wrapper |
| Map | MapLibre GL (client-only dynamic import) |
| Tiles | OpenFreeMap dark + Esri World Imagery (no API keys) |
| Media | Local MP4/JPG under `src/assets/` |
| Hosting | Vercel Build Output API |
| Editor sync | Lovable-connected GitHub `main` |

### 4.2 Source map

```
src/
  assets/           media (hero, listings, videos)
  components/
    MarketingChrome.tsx   nav + footer + WHATSAPP_URL
    Experience.tsx        acts, journey rail, scroll progress
    CampusMap.tsx         MapLibre + campus pins
    VideoPanel.tsx        scroll autoplay + Reveal
    LetterReveal.tsx      hero letter animation
    Logo.tsx              brand mark
    ListingGrid.tsx
    ResidenceVideoGallery.tsx
  data/listings.ts  sample inventory
  routes/           pages
  styles.css        tokens + utilities
public/             logo, favicon, ads/*
```

### 4.3 Data contracts (v1 sample)

```ts
type Listing = {
  title: string;        // "Modern Bedsitter in Juja Town"
  location: string;     // "Near JKUAT"
  category: string;     // Hostel | Bedsitter | ...
  price: string;        // "KES 9,500"
  deposit: string;
  image: string;
};

type CampusPin = {
  code: string;   // "JKUAT"
  name: string;
  town: string;   // "Juja"
  lng: number;
  lat: number;
};
```

Phase 2 replaces `sampleListings` with an API without changing card UI.

### 4.4 Request flow (production)

```
GET /
  → Nitro/Vercel function SSR
  → TanStack Router match "/"
  → HTML shell + CSS + JS chunks
  → Client hydrate
  → Hero video + map load on client
Static: /assets/* (images, MP4) from CDN edge
Map tiles: third-party free providers (browser → OpenFreeMap / Esri)
WhatsApp: browser → wa.me (external)
```

### 4.5 Offline USB package (this drop)

```
D:\UniHub-Site\
  offline\          built site + start scripts
  project\          full source (optional local dev)
  DESIGN-BLUEPRINT.md
  OFFLINE-README.md
```

Offline goal: run Node on any PC, open site from the stick with **all media local** (no CDN for photos/videos). Map tiles still need internet unless you vendor tiles later.

---

## 5. Accessibility & quality gates

- Skip link + `#main` landmark  
- Focus-visible rings on controls  
- Reduced-motion: no letter/slide animation; videos stay paused  
- Tap targets ≥ 44px on mobile nav  
- Contrast: white body on near-black; mint used sparingly on large UI  
- Video: controls present; decorative hero `aria-hidden`  

---

## 6. Voice & copy

| Do | Don’t |
| --- | --- |
| Concrete towns, KES prices, campus names | Empty SaaS slogans |
| Short active sentences | Em-dash stacks, “not just X but Y” |
| Product facts | Explaining loops/scroll UI to the user |

Ad voice for campus posts may use **comrades / DM** register (see `public/ads/AD-COPY.md`). Product UI stays calm and clear.

---

## 7. Anti-patterns (explicit refusals)

- Purple-blue SaaS gradient heroes  
- Six identical icon cards without hierarchy  
- Invented metrics (“10,000+ happy students”)  
- Signup wall before browse  
- Explanatory chrome (“loop on scroll”)  
- Paid map keys required for v1  
- Force-pushing `main` while Lovable is connected  

---

## 8. Decision-making (how to extend this system)

1. Reuse tokens; do not invent a second palette for a new page.  
2. New content types need a data shape first, then a card.  
3. Any new animation needs a reduced-motion branch.  
4. Map markers come from `campusPins`, not hard-coded JSX pins.  
5. WhatsApp number lives in **one** constant.  
6. Before launch: real number, live listings API, full legal pages.  

---

## 9. Workflow

| Step | Owner | Tool |
| --- | --- | --- |
| Spec | Design | This document |
| Implement | Dev | TanStack + Tailwind |
| Preview | Dev | `npm run dev` / Lovable |
| Ship | Dev | Vercel from GitHub `main` |
| Offline demo | Support | USB `D:\UniHub-Site` |
| Campus ads | Growth | `public/ads/*` |

---

## 10. System diagram (logical)

```
                    ┌─────────────────────┐
                    │   Visitor (student) │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  UniHub landing SSR │
                    │  (Vercel / USB)     │
                    └──────────┬──────────┘
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
  Local media            Sample listings        External free
  (MP4 / JPG)            src/data/listings.ts   map tiles
         │                     │                     │
         └──────────┬──────────┘                     │
                    ▼                                │
             Browse Listings  ◄──────────────────────┘
                    │
                    ▼
              WhatsApp agent  (outside product)
```

---

## 11. Campus pin reference (map)

| Code | Institution / belt | Town |
| --- | --- | --- |
| UoN | University of Nairobi | Nairobi |
| JKUAT | Jomo Kenyatta University | Juja |
| KU | Kenyatta University | Kahawa |
| SU | Strathmore University | Madaraka |
| THK | Thika student belt | Thika |
| MU | Moi University | Kesses |
| EGU | Egerton University | Njoro |
| NKU | Nakuru campus belt | Nakuru |

---

## 12. Launch checklist

- [ ] Replace `254700000000` with real WhatsApp number  
- [ ] Connect live listings API  
- [ ] Publish full privacy + terms  
- [ ] Optional: vendor map tiles for fully offline maps  
- [ ] Optional: CDN for large MP4s on mobile data  

---

*End of blueprint. Implementation lives in the UniHub repository; offline copy ships on the USB package alongside this file.*
