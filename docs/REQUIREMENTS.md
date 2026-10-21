# UniHub — Requirements Specification

**Project:** UniHub — Verified Student Housing Discovery Platform  
**Group:** Group 8  
**Course:** KLS 126 — Data Science for Lawyers, Kabarak University  
**Date:** 21st October 2026  
**Version:** 1.0

---

## 1. Use Case

### 1.1 Problem Statement
Kenyan university students face significant challenges finding verified, safe, and affordable housing near campus. Current channels (WhatsApp groups, social media, word of mouth) are fragmented, unverified, and expose students to:
- Fake listings with stolen photos
- Advance-deposit fraud (paying for properties that don't exist)
- No standardised property information (price, deposit, amenities, distance to campus)
- No accountability for landlords/agents

### 1.2 Solution
UniHub is a **discovery and contact platform** that consolidates verified student housing inventory into a single campus-centric web application. It solves the trust problem through **off-platform human verification** before any listing is published.

### 1.3 Scope
- **In scope:** Listing publication, anonymous browsing, campus map visualisation, direct contact facilitation (WhatsApp/email), admin content management
- **Out of scope:** User accounts, authentication, messaging, payments, tenancy management, analytics/tracking, automated matching

---

## 2. Users

| User Class | Description | Access Level |
|------------|-------------|--------------|
| **Student (Browser)** | University student seeking housing near Kenyan campuses | Anonymous read access to all listings, map, contact links |
| **Landlord / Agent (Lister)** | Property owner or agent listing verified housing | Off-platform onboarding via WhatsApp; no web app account |
| **Admin (Founder)** | Platform operator managing listings and verification | Full write access to listing data via GitHub; deploy access to Vercel |

---

## 3. Inputs

| Input | Source | Method | Validation |
|-------|--------|--------|------------|
| Property listing data | Landlords/agents via off-platform WhatsApp chat | Manual admin entry into `src/data/listings.ts` | Pre-publication verification checklist (ownership docs, agent ID, contact confirmation, personal data scrub) |
| Campus coordinates | Public data (OpenStreetMap, university websites) | Hardcoded in `src/data/campuses.ts` | Cross-referenced with official campus locations |
| Static media (videos, images) | Self-hosted in `public/` and `src/assets/` | Committed to repo | File type/size limits; no user uploads |
| Contact initiation | Student clicking `wa.me/` or `mailto:` links | Browser/OS handles externally | No UniHub processing — link rendered, student chooses to click |

---

## 4. Outputs

| Output | Destination | Description |
|--------|-------------|-------------|
| Listing cards (title, location, category, price, deposit, images, contact links) | Student browser | Rendered via `ListingGrid` component |
| Interactive campus map | Student browser | MapLibre GL with 8 Kenyan campus pins, vector + satellite tiles |
| Contact links (WhatsApp, Email) | Student's external apps | `wa.me/` and `mailto:` — communication leaves UniHub |
| Admin deployment | Vercel (iad1) | Static build + serverless functions via `npm run build` |
| Error logs | Vercel function logs | Sanitised via `error-capture.ts` — no personal data |

---

## 5. Acceptance Tests

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| AT-01 | Student loads homepage on mobile | 7-Act funnel renders, animations respect `prefers-reduced-motion` | ✅ |
| AT-02 | Student filters listings by campus, category, price | Results update instantly, no server round-trip | ✅ |
| AT-03 | Student clicks WhatsApp link | Opens WhatsApp with pre-filled message to landlord | ✅ |
| AT-04 | Student clicks email link | Opens default mail client with landlord email | ✅ |
| AT-05 | Student views campus map | 8 campus pins load, tiles render (vector + satellite toggle) | ✅ |
| AT-06 | Student watches residence video | VideoPanel autoplays at 25% viewport visibility, pauses on leave | ✅ |
| AT-07 | Admin edits `listings.ts` and pushes to GitHub | Vercel auto-deploys, new listing appears within 2 min | ✅ |
| AT-08 | No cookies set on homepage | DevTools Application → Cookies empty | ✅ |
| AT-09 | No localStorage used for tracking | DevTools Application → LocalStorage empty (except ephemeral UI state) | ✅ |
| AT-10 | Error page does not leak request data | Induced error → Vercel logs show sanitised output only | ✅ |

---

## 6. Constraints

| Constraint | Detail |
|------------|--------|
| **Data minimisation** | Zero student personal data collected; zero landlord personal data in web app |
| **No authentication** | No auth library, no sessions, no tokens, no cookies for tracking |
| **No database** | Listings stored as static TypeScript array in repo; deployed as code |
| **No analytics** | No Google Analytics, no Plausible, no custom events, no pixels |
| **No third-party scripts** | Self-hosted fonts, icons, videos; no CDNs for code |
| **HTTPS everywhere** | Enforced by Vercel |
| **International transfers** | Listing data (public business info) + error logs (no personal data) → Vercel (US), GitHub (US) |
| **Map tiles** | Keyless public providers (OpenFreeMap, Esri) — no auth, no user IDs |
| **Kenyan legal context** | DPA 2019 sections 25, 29–33, 31; Regulations 4, 49–53 |
| **Deployment region** | Vercel `iad1` (US East) per `vercel.json` |
| **Static asset hosting** | Same origin (Vercel) — no external CDN for media |

---

## 7. Data Dictionary (Listing Schema)

Defined in `src/data/listings.ts` as `SampleListing` type:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique slug (e.g., `"karen-hostel-01"`) |
| `title` | string | Yes | Display name |
| `location` | string | Yes | Neighbourhood/town (e.g., "Karen, Nairobi") |
| `campus` | string | Yes | Nearest campus (from `Campus` enum) |
| `category` | enum | Yes | `"hostel" \| "apartment" \| "rooms" \| "bedsitter"` |
| `price` | number | Yes | Monthly rent in KES |
| `deposit` | number | Yes | Security deposit in KES |
| `description` | string | Yes | Plain text, scrubbed of personal contacts |
| `images` | string[] | Yes | Relative paths to `/assets/` or `/public/` |
| `whatsappNumber` | string | Yes | Kenya format `2547XXXXXXXXX` |
| `email` | string | No | Landlord/agent contact email |
| `verified` | boolean | Yes | Always `true` — unverified listings not published |
| `videoClip` | string | No | Relative path to MP4 in `src/assets/` |

---

## 8. Verification Checklist (Off-Platform)

Before any listing enters `src/data/listings.ts`, the admin confirms:

- [ ] Property ownership document sighted (title deed, lease, or letter from registered owner)
- [ ] Agent identity verified (ID copy, agency registration if applicable)
- [ ] Contact details tested (WhatsApp message delivered, email bounce check)
- [ ] Photos/video are of the actual property (reverse image search, video walkthrough)
- [ ] Price and deposit confirmed with landlord/agent
- [ ] **Personal data scrubbed** from description and media (no private phone numbers, ID photos, tenant names)
- [ ] Consent version recorded (landlord informed data will be published publicly)
- [ ] Listing added via GitHub PR with review — audit trail preserved

---

## 9. Roles & Access Control

| Role | Can Read Listings | Can Write Listings | Can Deploy | Can Access Admin Routes |
|------|-------------------|-------------------|------------|------------------------|
| Student | ✅ | ❌ | ❌ | ❌ |
| Landlord/Agent | ✅ (public) | ❌ (off-platform only) | ❌ | ❌ |
| Admin (Founder) | ✅ | ✅ (via GitHub PR) | ✅ (Vercel) | ✅ (Better Auth + `VITE_ADMIN_EMAILS`) |

> **Note:** Admin routes (`/admin/*`) use Better Auth with email/password and admin plugin. `requireAdmin.ts` guards all admin loaders. Firebase Auth/Firestore remains in legacy landlord portal and admin CMS — being phased out.

---

## 10. Lawful Basis Summary

| Processing Operation | Lawful Basis (DPA 2019) | Rationale |
|----------------------|-------------------------|-----------|
| Publishing verified property listings | Legitimate interest (s. 30(1)(f)) | Business contact/property data; landlords expect publication; minimal, public-facing, removable |
| Student browsing | No personal data processed | Anonymous; no collection |
| Student contact initiation | No UniHub processing | User-initiated external action (WhatsApp/email) |
| Landlord onboarding data (off-platform) | Landlord makes own data public | Voluntary disclosure with expectation of publication |
| Error logging | Legitimate interest (s. 30(1)(f)) | Technical logs, sanitised, no personal data |
| Map tile requests | No personal data transferred | Keyless, public tiles; no user identifiers |

---

## 11. Retention Schedule

| Data Category | Retention | Deletion Method |
|---------------|-----------|-----------------|
| Listing data | Until manually removed (property rented/withdrawn/expired) | Admin edits `listings.ts` → redeploy |
| Error logs | Vercel default (~30 days) | Automatic (Vercel managed) |
| Git history | Permanent (audit trail) | Not deleted |
| Vercel build artefacts | Per Vercel retention policy | Automatic |

---

## 12. Risk Summary (from DPIA)

All 10 identified risks score **Low (1–6)** after controls. Highest residual: **2/25**.  
No ODPC consultation required. Governance gate (Action A6) ensures DPIA review for any future feature adding personal data processing.

---

## 13. Sources & Authorities

- Data Protection Act, 2019 (No. 24 of 2019) — sections 25, 29–33, 30(1)(f), 31, 32
- Data Protection (General) Regulations, 2021 — regulations 4, 49–53
- ODPC Guidance Note on Data Protection Impact Assessment (Part 5 template)
- ODPC Guidance Note on Consent
- KabarakAttend DPIA (KLS 126, September 2026) — sector reference
- *UniHub DPIA (Group 8, CAT 3)* — this project's assessment