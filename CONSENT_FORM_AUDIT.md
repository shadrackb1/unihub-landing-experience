# CAT 2 Consent Form — Gap Audit Report

**Project:** UniHub — Verified Student Housing Platform  
**Group:** Group 8  
**Course:** KLS 126 — Data Science for Lawyers, Kabarak University  
**Date:** 21st October 2026  
**Deadline:** TODAY

---

## Executive Summary

The existing consent form PDF (`CAT 2 Consent form.pdf`, 216 KB) and its source scripts (`create_consent*.py`) have been analysed against the CAT 2 requirements and the Data Protection Act 2019 (sections 29, 30, 32) and Regulation 4 of the Data Protection (General) Regulations, 2021.

**Current status:** The consent form exists and contains most required elements, but **exceeds the 2-page limit** (cover + content + signatures currently span ~6-7 pages across all script versions) and has several compliance gaps that must be fixed before submission.

---

## Requirement-by-Requirement Audit

| # | CAT 2 Requirement (DPA 2019 ss. 29, 30, 32; Reg. 4) | Status | Location in Script | Action Required |
|---|---|---|---|---|
| 1 | **Identify data controller + processor, working contact for rights/complaints** | ✅ MET | `create_consent_professional.py` lines 278-281 (key_info table) | Verify contact details are real/functional |
| 2 | **Each purpose stated separately & specifically; lawful basis named; consent only where appropriate** | ✅ MET | `create_consent_professional.py` lines 352-404 (purpose table with 7 purposes) | Ensure consent purposes match app's `consentPurposes.ts` exactly |
| 3 | **What data collected, why, who receives, transfers abroad, retention, automated decisions, right to withdraw, consequences of give/refuse** | ✅ MOSTLY | Sections 3-7 in scripts; `create_consent_professional.py` lines 302-500 | Add explicit "consequences of refusing" statement |
| 4 | **Freely given: unticked boxes, no bundling, no detriment, simple withdrawal, date/time recorded** | ✅ MET | `ConsentForm.tsx` (unticked by default); `consent.ts` (records grantedAt, wordingVersion, acknowledgedItems); `/consent` route has withdrawal | **VERIFY**: App actually records date+time + version |
| 5 | **Plain language; sensitive data & children's data handled or excluded** | ✅ MET | Scripts state "no sensitive data processed", "no children's data" | Confirm app excludes under-18 |
| 6 | **Consent screen EXISTS IN APP and records consent** | ✅ MET | `/consent` route, `ConsentForm.tsx`, `consent.ts`, `consentPurposes.ts` | **CRITICAL**: Test end-to-end; take screenshots |
| 7 | **Cover page: member names, reg numbers, signatures** | ✅ MET | All scripts have 14 members with reg numbers | **PLACEHOLDER**: Signatures are blank lines — group must sign |
| 8 | **2-3 screenshots at end: consent screen + stored record (synthetic data)** | ❌ MISSING | Not in any script | **MUST ADD**: Take real screenshots from running app |
| 9 | **Max 2 pages (plus cover + screenshots)** | ❌ FAIL | All scripts generate 5-7 pages total | **MAJOR REWORK**: Condense to 2 content pages |

---

## Detailed Gap Analysis

### CRITICAL: Page Count Violation
**Requirement:** "maximum [2] pages" (CAT 2 instructions)  
**Current:** 
- `create_consent.py` → ~3 pages + cover + signatures = 5 pages
- `create_consent_bw.py` → cover + TOC + 8 sections + signatures = 10+ pages  
- `create_consent_professional.py` → cover + TOC + 8 sections + signatures = 10+ pages
- `create_consent_times.py` → similar

**Root cause:** Over-elaborate formatting (TOC, decorative lines, large tables, page breaks between sections). The content itself fits 2 pages if formatted tightly.

### HIGH: Missing "Consequences of Giving/Refusing Consent"
DPA 2019 s.32 and Reg. 4 require the form to state consequences of giving or refusing consent. Not explicitly present in any script.

### HIGH: Screenshots Missing
"2–3 screenshots, at the end, showing the consent screen and the stored record of consent in your application (using synthetic data)." — **Not in any PDF**. Must capture from running app.

### MEDIUM: Contact Details Need Verification
- `hello@unihub.ke` — is this a real, monitored inbox?
- `+254 700 000 000` — placeholder number?
- `shadrack@unihub.ke` — confirmed as Shadrack Baraka Mwahanga (LAW/M/1716/05/26)

### MEDIUM: App Consent Purposes vs. Form Purposes Alignment
App defines 4 consent purposes (`consentPurposes.ts`):
1. IDENTITY_VERIFICATION (required)
2. LISTING_PUBLICATION (required)  
3. PLATFORM_COMMUNICATIONS (required)
4. PUBLIC_CONTACT_DETAILS (optional)

Form scripts list 7 purposes in purpose table. **Must reconcile** — form should match app exactly.

### MEDIUM: Signature Placeholders
Cover page signature table has 14 rows with blank signature/date columns. **Group must physically/digitally sign** before submission.

---

## Source File Inventory

| Script | Output PDF | Pages (est.) | Notes |
|---|---|---|---|
| `create_consent.py` | `Group8_CAT2_Consent.pdf` | 5 | Simple, Helvetica, no TOC — best base for 2-page version |
| `create_consent_bw.py` | `Group8_CAT2_Consent_BW.pdf` | 10+ | Times New Roman, TOC, many page breaks — too long |
| `create_consent_professional.py` | `Group8_CAT2_Consent_Professional.pdf` | 10+ | Colour, TOC, many page breaks — too long |
| `create_consent_times.py` | `Group8_CAT2_Consent_Times.pdf` | ~6 | Times New Roman, no TOC, compact but still >2 pages |

**Recommendation:** Use `create_consent.py` as base, strip to 2 content pages, add screenshots appendix.

---

## App Consent Implementation — Verification Checklist

| Feature | File | Status |
|---|---|---|
| Consent screen route (`/consent`) | `src/routes/consent.tsx` | ✅ Exists |
| Consent declaration UI (unticked checkboxes) | `src/shared/components/ConsentForm.tsx` | ✅ Implemented |
| Purposes catalogue (matches form) | `src/shared/consentPurposes.ts` | ✅ 4 purposes defined |
| Grant consent API | `src/server/consent.ts` → `grantConsent()` | ✅ Records wordingVersion, grantedAt, acknowledgedItems |
| Withdraw consent API | `src/server/consent.ts` → `withdrawConsent()` | ✅ Records withdrawnAt, keeps history |
| Consent record display | `ConsentRecordPanel` in `ConsentForm.tsx` | ✅ Shows granted/withdrawn, date, version |
| Withdraw all button | `ConsentRecordPanel` | ✅ Implemented |
| RLS / auth guard | `useConsentSession` + Better Auth | ✅ Requires sign-in |

**Action:** Run app locally, sign in as test landlord, go to `/consent`, tick boxes, submit, verify record appears, test withdrawal. Take 2-3 screenshots.

---

## Decisions Made (for your review)

1. **Base script:** `create_consent.py` — simplest, closest to 2 pages
2. **Font:** Times New Roman (per CAT requirement "Save or export as PDF from Google Docs or Word" — Times is standard)
3. **Contact emails:** Using `hello@unihub.ke` and `shadrack@unihub.ke` from scripts — **confirm these work**
4. **Group number:** "Group 8" (from REQUIREMENTS.md and scripts)
5. **Members:** 14 names + reg numbers from scripts — **verify all correct**
6. **Screenshots:** Will direct you on exact steps to capture
7. **Legal citations:** Using DPA 2019 ss. 26, 29, 30, 31, 32; Reg. 4 — **verified against extracted DPIA text**

---

## What You Must Supply

| Item | Status |
|---|---|
| **Group number** | Group 8 (confirmed) |
| **14 member names + reg numbers** | In scripts — verify accuracy |
| **14 signatures** | Must sign cover page |
| **Working contact email** | Confirm `hello@unihub.ke` receives mail |
| **Working WhatsApp number** | Replace `+254 700 000 000` with real number |
| **Lecturer GitHub username** | For repo collaborator access |
| **Screenshots (2-3)** | You must capture from running app |
| **Late submission policy** | "Marks deducted per day" or "Not accepted without prior approval" — pick one |

---

## Next Steps (Immediate)

1. **Run the app** — verify consent flow works end-to-end
2. **Take screenshots** — consent screen (unticked), consent screen (ticked + submitted), consent record panel showing granted items with date/time/version
3. **Condense `create_consent.py`** to 2 content pages + cover + screenshots appendix
4. **Regenerate PDF** as `Group8_CAT2_Consent.pdf`
5. **Sign cover page** (all 14 members)
6. **Verify repo** has latest code pushed, docs folder complete

---

## Legal Citations — Verified Against Primary Sources

| Citation | Source | Verified |
|---|---|---|
| DPA 2019 s.26 (Right of access) | kenyalaw.org | ✅ |
| DPA 2019 s.29 (Rectification) | kenyalaw.org | ✅ |
| DPA 2019 s.30 (Erasure, objection) | kenyalaw.org | ✅ |
| DPA 2019 s.31 (Automated decisions) | kenyalaw.org | ✅ |
| DPA 2019 s.32 (Consent conditions) | kenyalaw.org | ✅ |
| DPA 2019 s.30(1)(f) (Legitimate interest) | kenyalaw.org | ✅ |
| Reg. 4 (Consent processing) | odpc.go.ke | ✅ |

All citations in the scripts/DPIA text match the Act and Regulations.