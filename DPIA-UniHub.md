# DATA PROTECTION IMPACT ASSESSMENT

## UniHub — Verified Student Housing Platform

### Kenya Student Housing Discovery Service

**Conducted in accordance with section 31 of the Data Protection Act, No. 24 of 2019 and the Office of the Data Protection Commissioner Guidance Note on Data Protection Impact Assessment. Reported on the template at Part 5 of that Guidance Note.**

---

## Document control

| Detail                      | Entry                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Project**                 | UniHub — Verified Student Housing Platform (web application)                                                   |
| **Data controller**         | UniHub Kenya (operating as UniHub)                                                                             |
| **Assessment conducted by** | Shadrack Biwott, Founder & Developer — shadrack@unihub.ke                                                      |
| **Date of assessment**      | 15th January 2026                                                                                              |
| **Version**                 | 1.0 — Internal review prior to public launch                                                                   |
| **Status**                  | PRE-LAUNCH. No live student personal data has been collected. All development and testing uses synthetic data. |
| **Next review**             | Before public launch; thereafter quarterly, and on any material change to dataset, platform, or purpose.       |

---

## A. Screening — is a DPIA required?

Section 31 of the Data Protection Act ("Act") requires a Data Protection Impact Assessment ("DPIA") where a processing operation is likely to result in a high risk to the rights and freedoms of a data subject. Paragraph 9(A) of the Data Protection Impact Assessment Guidance Note ("Guidance Note") sets out the criteria to be considered. The project has been screened against each.

**Context framing the assessment:**

- UniHub is a **discovery and contact platform**. It does not process tenancy agreements, collect rent, hold deposits, or manage property.
- **No mandatory accounts**. Students browse listings freely without signup. The only personal data a student voluntarily provides is when they choose to click a WhatsApp or email link to contact a landlord/agent — at which point the communication leaves UniHub's environment.
- **Landlord/agent onboarding** is initiated via a WhatsApp chat (external to the platform); UniHub collects no landlord personal data through the web application itself.
- **Map tiles** are fetched from keyless, public tile providers (OpenFreeMap, Esri World Imagery) with no authentication or user identification.
- **All media assets** (videos, images) are self-hosted and served from the same origin.

| Criterion (Guidance Note, para. 9A)                                                | Does it apply? — assessment                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I. Automated decision-making with legal or similar significant effect**          | **DOES NOT APPLY.** The application makes no decisions about any student. No profiling, scoring, matching algorithms, or automated eligibility determinations exist.                                                                                                                                                                                                                                                    |
| **II. Systematic monitoring**                                                      | **DOES NOT APPLY.** No tracking, analytics, cookies, fingerprinting, or behavioural monitoring is implemented. No location data is collected. Map interaction is anonymous and ephemeral.                                                                                                                                                                                                                               |
| **III. Sensitive personal data or data of a private nature**                       | **DOES NOT APPLY.** No special category data (health, biometric, ethnic, religious, political, genetic, criminal) is processed. The platform handles only property listing data (public-facing) and voluntary contact initiations.                                                                                                                                                                                      |
| **IV. Data processed on large volumes or large scales**                            | **DOES NOT APPLY.** Assessed against the four Guidance Note factors: (a) number of data subjects — potentially large (students), but **no personal data is collected from them** during browsing; (b) volume and range of data items — minimal (listing metadata only); (c) duration — listing data retained until manually removed; (d) geographical extent — Kenya-wide campus towns, but no personal data footprint. |
| **V. Matching or combining datasets**                                              | **DOES NOT APPLY.** No datasets are combined. Listing data is standalone. No integration with university records, credit bureaus, or identity systems.                                                                                                                                                                                                                                                                  |
| **VI. Data concerning vulnerable data subjects**                                   | **APPLIES IN A LIMITED SENSE.** University students may face housing insecurity, but the platform does not exploit this. No data is collected from vulnerable subjects without consent; browsing is anonymous. The power imbalance (student vs. landlord) is mitigated by verification and direct contact transparency.                                                                                                 |
| **VII. Innovative use, or applying new technological or organisational solutions** | **DOES NOT APPLY.** The stack (React, TanStack, MapLibre, Vercel) is standard web technology. No AI, biometrics, blockchain, or novel processing.                                                                                                                                                                                                                                                                       |
| **VIII. Processing that prevents data subjects from exercising a right**           | **DOES NOT APPLY.** Browsing requires no consent. Rights (access, rectification, erasure, objection) are trivial to exercise because almost no personal data is held.                                                                                                                                                                                                                                                   |

**Conclusion of screening.** No criterion applies in full. One applies in a limited sense (VI). The processing is **not likely to result in a high risk** to the rights and freedoms of data subjects, and section 31 of the Act does not compel a DPIA for it. This assessment has nonetheless been carried out as a matter of **good practice**, to document the privacy posture before public launch, and is recorded below on the template at Part 5 of the Guidance Note.

---

## Part 1: Description of the processing operations

### 1. Project Name

**UniHub** — Verified student housing discovery platform for Kenyan university campuses. Web application deployed on Vercel, built with TanStack Start (React 19, TypeScript).

### 2. Project Outline: What and why

**What the project aims to achieve:**
UniHub consolidates trusted student housing inventory into a single campus-centric platform. It solves the problem of scattered WhatsApp groups, unverified social media listings, fake photos, and risky advance deposits.

**Type of processing involved:**

- **Listing publication**: Verified property data (title, location, category, price, deposit, images) published for browsing.
- **Anonymous browsing**: Students search and filter listings without accounts, cookies, or tracking.
- **Contact initiation**: Students tap WhatsApp or email links to contact landlords/agents directly. The communication occurs **outside** UniHub (in WhatsApp/email clients).
- **Landlord onboarding**: Interested landlords/agents start onboarding via a WhatsApp link (external). No landlord data is collected via the web form.
- **Map rendering**: Campus locations displayed via MapLibre GL using public tile servers (OpenFreeMap, Esri). No user location requested or stored.
- **Error reporting**: Client-side runtime errors captured and reported to server logs for debugging (no personal data included).

**What the project does NOT do:**

- No user accounts, authentication, or profiles.
- No analytics, tracking pixels, cookies, localStorage (except ephemeral UI state).
- No payment processing, deposit holding, or tenancy management.
- No profiling, scoring, or matching algorithms.
- No third-party data sharing (WhatsApp/email are user-initiated external actions).
- No automated decision-making.

### 3. Who are the targeted data subjects?

| Data Subject Class               | Description                                              | Personal Data Processed                                                                                                                                             |
| -------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Students (browsers)**          | University students seeking housing near Kenyan campuses | **None collected during browsing.** Only if they voluntarily click WhatsApp/email links — at which point data enters the external app (WhatsApp/email), not UniHub. |
| **Landlords / Agents (listers)** | Property owners/agents listing verified housing          | **None collected via the web app.** Onboarding starts via WhatsApp chat (external). Any data shared there is processed by WhatsApp/Meta, not UniHub.                |
| **Website visitors (general)**   | Any person visiting the site                             | **None.** No analytics, no cookies, no fingerprinting.                                                                                                              |

**Vulnerable groups / children:**

- The platform targets **university students** (typically 18+). No service is directed at children under 18.
- If a minor were to browse, no personal data is collected, so section 33 of the Act (children's data) is not engaged.

### 4. Information Flow — collection, use, and deletion of personal data

| Aspect                       | Description                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **a) Source of data**        | Listing data: provided by landlords/agents during off-platform WhatsApp onboarding, then manually entered by UniHub admins into the static data file (`src/data/listings.ts`). No automated ingestion. Student data: **not collected**.                                                                                                                 |
| **b) Collection method**     | Listings: manual admin entry after off-platform verification. Student contact: user-initiated click on `mailto:` or `wa.me:` links — handled by browser/OS, not UniHub.                                                                                                                                                                                 |
| **c) Volume**                | ~6–50 live listings at any time (static dataset). Zero student personal data records. Zero landlord personal data records in the web app.                                                                                                                                                                                                               |
| **d) Storage location**      | Listing data: in the application codebase (GitHub private repo) and deployed build on **Vercel (US East / iad1 region)**. No database. No CMS. Error logs: Vercel function logs (US).                                                                                                                                                                   |
| **e) Retention period**      | Listing data: retained until manually removed by admin (property rented, withdrawn, or expired). No fixed auto-expiry. Error logs: Vercel default retention (typically 30 days).                                                                                                                                                                        |
| **f) Processing operations** | **Collection** (manual admin entry of verified listings), **storage** (static file in repo/build), **retrieval** (serving listings to browser), **display** (rendering in UI), **contact facilitation** (rendering WhatsApp/email links). **No** profiling, scoring, matching, automated decisions, or third-party disclosure.                          |
| **g) Transfers**             | **Listing data**: deployed to Vercel infrastructure in **US (iad1)**. This is a transfer outside Kenya. Safeguards: minimal dataset (no personal data), public-facing data only, no sensitive data, controller in Kenya. **Map tiles**: fetched from OpenFreeMap (global CDN) and Esri (US) — public, keyless, no auth. **Error logs**: Vercel US logs. |
| **h) Individuals affected**  | Potentially all university students in Kenya (hundreds of thousands), but **zero personal data collected** from them via the platform. Landlords/agents: dozens, but data collected off-platform via WhatsApp.                                                                                                                                          |

### 5. Compliance with the seven data protection principles (section 25 of the Act)

| Principle                                 | How the processing complies                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **a. Lawfulness, fairness, transparency** | **Lawfulness**: Listing data processed on **legitimate interest** (controller's interest in publishing verified housing info; data is business contact / property info, not private). Student browsing: **no processing of personal data** occurs, so no basis needed. Contact links: user-initiated, no UniHub processing. **Fairness**: No hidden processing. **Transparency**: Privacy policy (`/privacy`) and terms (`/terms`) published; WhatsApp/email links clearly labelled. |
| **b. Purpose limitation**                 | Data used **solely** for: publishing verified listings, enabling student discovery, facilitating direct contact. No secondary use, no analytics, no advertising, no resale.                                                                                                                                                                                                                                                                                                          |
| **c. Data minimisation**                  | **Extreme minimisation**: Zero student personal data. Zero landlord personal data in the web app. Listing data contains only property attributes (title, location, category, price, deposit, images) — all public-facing by design.                                                                                                                                                                                                                                                  |
| **d. Accuracy**                           | Listings verified **before** publication (off-platform). Admins can update/remove listings by editing the data file and redeploying. Students can report suspicious listings via `/contact` (WhatsApp/email).                                                                                                                                                                                                                                                                        |
| **e. Storage limitation**                 | Listings retained while active/verifiable. No personal data to expire. Admin process: periodic review (quarterly) to remove stale listings. Error logs: Vercel-managed retention.                                                                                                                                                                                                                                                                                                    |
| **f. Integrity and confidentiality**      | **Access control**: Only admins with repo write access can modify listings. Vercel deployment protected by GitHub + Vercel auth (2FA). **Transport**: HTTPS everywhere (Vercel). **Error logs**: No personal data included (validated in `error-capture.ts`).                                                                                                                                                                                                                        |
| **g. Accountability**                     | This DPIA, the privacy policy, terms of service, the verification process (off-platform), the admin access controls, and the error handling design together constitute the accountability record.                                                                                                                                                                                                                                                                                    |

---

## Part 2: Necessity and proportionality of the processing in relation to the purpose

### 1. Lawful basis for processing

**Two distinct processing operations:**

| Operation                                 | Lawful Basis                                          | Rationale                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Publishing verified property listings** | **Legitimate interest (section 30(1)(f) of the Act)** | The data is **business contact / property information** — not private life data. Landlords/agents _expect_ their property details to be public. The controller's interest (helping students find housing) is legitimate, necessary, and balanced: data is minimal, public-facing, verified, and removable on request. No privacy intrusion. |
| **Student browsing & contact initiation** | **No personal data processed by UniHub**              | Browsing is anonymous. Clicking WhatsApp/email opens an external app — the student _chooses_ to disclose their identity to the landlord/agent. UniHub does not see, capture, or process that disclosure.                                                                                                                                    |

### 2. Consent

**Not used as a lawful basis** for any UniHub processing operation.

- Students do not consent to data processing because **no data is collected**.
- Landlords/agents provide property details **voluntarily off-platform** (WhatsApp chat) with the explicit understanding they will be published. This is not "consent" under the Act for UniHub's processing — it is the data subject (landlord) making their own data public. UniHub's basis remains legitimate interest.

### 3. Does the processing achieve the purpose?

**Yes.**

- Students discover verified listings near campus.
- They compare prices, photos, categories.
- They contact landlords/agents directly via WhatsApp/email.
- No signup barrier, no paywall, no data harvest.

The **verification step (off-platform)** is the critical trust mechanism: it happens before any data enters the web app.

### 4. Is there another way to achieve the same outcome?

| Option                                                   | Assessment                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Current: Static verified listings + external contact** | **Selected.** Minimal data, maximum privacy, verifiable trust.                |
| **Full marketplace with accounts, messaging, payments**  | Rejected: introduces personal data, auth, payments, higher risk, scope creep. |
| **Aggregator scraping other sites**                      | Rejected: no verification, copyright issues, no trust.                        |
| **Lead-generation model (sell student contacts)**        | Rejected: violates purpose limitation, fairness, student trust.               |

### 5. Data quality and minimisation

- **Listing schema fixed** in TypeScript (`SampleListing` type). No dynamic fields.
- **Pre-publication verification** (off-platform) ensures accuracy.
- **Admin-only edits** via GitHub PR/review — audit trail via Git.
- **No student data** to quality-check.
- **Quarterly review** of live listings for staleness (Action A1).

### 6. Information to individuals

- **Students**: Privacy policy (`/privacy`), terms (`/terms`), clear labelling of external links (WhatsApp/email icons), no dark patterns.
- **Landlords/agents**: Informed during off-platform WhatsApp onboarding that property details will be published publicly on UniHub. Verification checklist explained. Right to request removal communicated.

### 7. Supporting data subject rights

| Right                         | Mechanism                                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Access**                    | Students: no data held → trivial. Landlords: request via `/contact` (WhatsApp/email) → admin provides copy of their listing entry. |
| **Rectification**             | Landlord requests correction via `/contact` → admin edits data file → redeploy.                                                    |
| **Erasure / Withdrawal**      | Landlord requests removal via `/contact` → admin removes listing → redeploy. Student: no data to erase.                            |
| **Objection**                 | Landlord objects to publication → same as erasure.                                                                                 |
| **Portability**               | Listing data is simple JSON — provided on request.                                                                                 |
| **Automated decision-making** | None exists.                                                                                                                       |

All requests handled by admin (founder) via the published contact channels. Target: actioned within 48 hours, well within Act timelines.

### 8. Controller and processor compliance

- **Controller**: UniHub Kenya (Shadrack Biwott).
- **Processors**:
  - **Vercel** (hosting, build, logs) — Data Processing Addendum in place (Vercel standard DPA).
  - **GitHub** (source control) — DPA in place.
  - **Map tile providers (OpenFreeMap, Esri)** — Public, keyless, no contract. No personal data sent.
- **No other processors**. No analytics, no CDN for user data, no third-party scripts.

### 9. Parties involved

| Party                          | Role                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| UniHub Kenya (Shadrack Biwott) | Data controller — determines purpose, means, verification, publication.                                |
| Vercel Inc.                    | Processor — hosting, serverless functions, logs (US infrastructure).                                   |
| GitHub Inc.                    | Processor — source control, CI/CD (US infrastructure).                                                 |
| OpenFreeMap / Esri             | **Not processors** — public tile servers, no personal data transmitted, no contractual relationship.   |
| Students                       | Data subjects (browsers) — **no personal data processed by UniHub**.                                   |
| Landlords / Agents             | Data subjects (listers) — provide property data off-platform; UniHub publishes on legitimate interest. |

### 10. Safeguards for processing

- **Data minimisation by architecture**: No database, no auth, no forms, no cookies, no tracking.
- **Verification before publication**: Off-platform human check of property docs, ownership, agent identity.
- **Admin access control**: GitHub branch protection + Vercel 2FA. Only founder has deploy access.
- **HTTPS everywhere**: Enforced by Vercel.
- **Error capture sanitised**: `error-capture.ts` scrubs request bodies, headers, URLs before logging.
- **No third-party scripts**: Self-hosted fonts, icons, videos. No Google Fonts, no analytics, no CDNs for code.

### 11. Safeguards for international transfers

**Transfers occur to:**

1. **Vercel (US / iad1)** — listing data (public property info) + error logs (no personal data).
2. **GitHub (US)** — source code + listing data file (private repo).
3. **Map tile CDNs (global)** — public tile requests, no auth, no user IDs.

**Safeguards:**

- **Data nature**: Only **public property listings** (business data) and **technical logs** (no personal data). No student personal data. No sensitive data.
- **Controller in Kenya**: UniHub Kenya is the controller; decisions made locally.
- **Processor DPAs**: Vercel and GitHub standard DPAs incorporate SCCs (Standard Contractual Clauses).
- **Adequacy**: US not adequate under Kenyan law; reliance on **SCCs + supplementary measures** (data minimisation, encryption in transit, access controls, no sensitive data).
- **Map tiles**: Not a "transfer" of personal data — no personal data in tile requests.
- **Direction sought**: This assessment notes the transfer and the safeguards. The controller accepts residual compliance exposure given the data nature (public business listings, no personal data). If ODPC guidance changes, a local hosting alternative (e.g., AWS Nairobi, local VPS) will be evaluated (Action A2).

---

## Part 3: Assessment of the risks to the rights and freedoms of data subjects

The Guidance Note assessment questions are answered below. Where the answer is "Yes", the entry states practical steps to identify and address the resulting privacy risk.

| #      | Question                                                                                                                                                      | Answer & Explanation                                                                                                                                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**  | Will the project involve the collection of new identifiable or potentially identifiable data about data subjects?                                             | **NO.** No new data about students is collected. Listing data (property details) is provided voluntarily by landlords/agents off-platform with the expectation of publication. No student identifiers, contact details, preferences, or behaviour are captured.           |
| **2**  | Will the project compel data subjects to provide information about themselves, i.e. where they will have little awareness or choice?                          | **NO.** Browsing requires **zero** information. Contacting a landlord is a **voluntary, user-initiated** click on an external link. The student chooses whether, when, and what to disclose to the landlord/agent. UniHub is not a party to that disclosure.              |
| **3**  | Will identifiable information about data subjects be shared with other organizations or people who have not previously had routine access to the information? | **NO, not by UniHub.** Students share their own details with landlords/agents **by their own act** (opening WhatsApp/email). UniHub does not intermediate, log, or forward that communication. Listing data is published **publicly** — that is its purpose.              |
| **4**  | Are you using information about data subjects for a purpose it is not currently used for in a new way?                                                        | **NO.** Property listings are used for their **intended purpose**: public advertisement to prospective tenants. No repurposing, profiling, or secondary use.                                                                                                              |
| **5**  | Would the processing be likely to raise privacy concerns or expectations, i.e. include health, criminal, or other sensitive information?                      | **NO.** No sensitive personal data. Property listings are commercial/public data. The only "privacy concern" is a student's housing search being visible — but **UniHub does not see or record the search**. The risk is in the external WhatsApp/email apps, not UniHub. |
| **6**  | Will the project require you to contact data subjects in ways they may find intrusive (telephone, email without prior consent)?                               | **NO.** UniHub **never contacts students**. No email addresses, phone numbers, or push tokens are collected. The `/contact` page is for _students to contact UniHub_, not vice versa.                                                                                     |
| **7**  | Will the project result in decisions that can significantly impact data subjects (affect services received)?                                                  | **NO.** No decisions are made by UniHub about students. No eligibility, scoring, matching, or allocation. The platform is a **passive directory**.                                                                                                                        |
| **8**  | Does the project involve new technology perceived as privacy-intrusive (biometrics, facial recognition, automated decision-making)?                           | **NO.** Standard web stack. No AI/ML, no biometrics, no fingerprinting, no WebRTC, no camera/mic access. MapLibre GL is a standard map renderer.                                                                                                                          |
| **9**  | Is a service being transferred to a new supplier (re-contracted)?                                                                                             | **NO.** No existing service replaced. Greenfield project.                                                                                                                                                                                                                 |
| **10** | Is processing of identifiable data being moved to a new organization (same staff/processes)?                                                                  | **NO.** No prior processing of this data by another org. First publication.                                                                                                                                                                                               |

---

## Part 4: Measures envisaged to address the risks — Risk Register

**Data Controller:** UniHub Kenya  
**Project:** UniHub Verified Student Housing Platform  
**Risk Register Owner:** Shadrack Biwott, Founder

**Scoring:** Impact and Likelihood each rated 1 (very low) to 5 (very high); **Score = Impact × Likelihood**. Bands: 1–6 = Low · 8–12 = Medium · 15–25 = High.

| Risk ID | Risk Description                                                                                                                         | Consequence                                                                          | Risk Owner      | Current Controls                                                                                                                                                   | Impact (1–5) | Likelihood (1–5) | Score       | Further Actions (Owner)                                                                                                                                                                                                             | Residual |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ---------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **R1**  | **Stale or inaccurate listing remains live** — property rented, price changed, or landlord unreachable, but listing not removed/updated. | Student wastes time, loses trust, possible financial harm if they act on stale info. | Founder / Admin | Verification before publication; admin-only edits via Git; quarterly review planned.                                                                               | 2            | 2                | **4 (Low)** | **(A1)** Implement quarterly listing audit checklist: verify contact still works, price current, property available. Log review date in repo. Owner: Founder. Residual 1×1 = **1**.                                                 |
| **R2**  | **International transfer of listing data to Vercel/GitHub (US) without documented SCC assessment.**                                      | Regulatory non-compliance (Part VI of Act); potential ODPC enforcement.              | Founder         | Data is public business listings (no personal data); Vercel/GitHub DPAs include SCCs; controller in Kenya.                                                         | 2            | 2                | **4 (Low)** | **(A2)** Document transfer impact assessment: confirm data category (non-personal), SCCs in place, supplementary measures (minimisation, encryption, access control). File with this DPIA. Owner: Founder. Residual 1×1 = **1**.    |
| **R3**  | **Landlord/agent personal data inadvertently included in listing** (e.g., phone number in description, ID photo in image).               | Disclosure of private data; privacy breach for landlord.                             | Founder / Admin | Verification checklist includes "scrub personal contacts from description/images"; only public-facing agent WhatsApp/email published in designated fields.         | 2            | 1                | **2 (Low)** | **(A3)** Add explicit verification step: "Confirm no personal IDs, private phones, or sensitive docs in images/description." Owner: Founder. Residual 1×1 = **1**.                                                                  |
| **R4**  | **Error logs accidentally capture personal data** (e.g., URL with query params, request body from contact form).                         | Unintended personal data in Vercel logs (US transfer).                               | Founder         | `error-capture.ts` scrubs request bodies, headers, URLs. No contact form on site (only mailto:/wa.me: links).                                                      | 1            | 1                | **1 (Low)** | **(A4)** Add unit test for error sanitisation: confirm no query params, headers, or bodies with personal data reach logs. Owner: Founder. Residual 1×1 = **1**.                                                                     |
| **R5**  | **Map tile requests leak student IP/location to tile providers (OpenFreeMap, Esri).**                                                    | Passive tracking of student approximate location by third-party CDNs.                | Founder         | Tiles fetched client-side via MapLibre; no auth, no user ID, no cookies. Providers see only generic tile requests from Vercel IP or student IP. No UniHub linkage. | 2            | 2                | **4 (Low)** | **(A5)** Document: tile requests are standard web traffic; no personal data sent; student IP visible to CDN same as any website. Consider self-hosted vector tiles if ODPC guidance tightens. Owner: Founder. Residual 2×1 = **2**. |
| **R6**  | **Scope creep: future features add personal data processing (accounts, favourites, messages, payments) without DPIA update.**            | Unassessed high-risk processing introduced silently.                                 | Founder         | Current codebase has no auth, no DB, no forms. Architecture documented. DPIA exists as baseline.                                                                   | 3            | 2                | **6 (Low)** | **(A6)** **Governance gate**: Any PR adding auth, database, forms, analytics, payments, or user accounts **must** trigger DPIA review/update before merge. Document in `CONTRIBUTING.md`. Owner: Founder. Residual 2×1 = **2**.     |
| **R7**  | **Vercel/GitHub account compromise** — attacker modifies listings, injects malicious links, or exfiltrates repo.                         | Integrity loss; potential phishing via fake listings; reputational damage.           | Founder         | 2FA on GitHub & Vercel; branch protection; only founder has deploy access; private repo.                                                                           | 3            | 1                | **3 (Low)** | **(A7)** Enable GitHub Advanced Security (code scanning, secret scanning). Rotate Vercel tokens annually. Owner: Founder. Residual 2×1 = **2**.                                                                                     |
| **R8**  | **Student clicks malicious WhatsApp/email link** (link spoofing, landlord impersonation).                                                | Student harmed off-platform; UniHub brand trust damaged.                             | Founder         | Verification checks landlord identity & contact before listing. Links rendered as `wa.me/` and `mailto:` — student sees destination before clicking.               | 2            | 2                | **4 (Low)** | **(A8)** Add UI hint: "Verify the agent's name matches the listing before sending money." Consider displaying verified badge next to contact links. Owner: Founder. Residual 1×1 = **1**.                                           |
| **R9**  | **Child (under 18) uses platform** — though no data collected, service may not be age-appropriate.                                       | Potential section 33 issue if any data inadvertently captured.                       | Founder         | No data collected from anyone. Terms state 18+. University student target demographic.                                                                             | 1            | 1                | **1 (Low)** | **(A9)** Add age disclaimer in footer/terms: "For users 18+." Owner: Founder. Residual 1×1 = **1**.                                                                                                                                 |
| **R10** | **Data subject rights request not actioned in time** (landlord requests listing removal).                                                | Denial of right; complaint to ODPC.                                                  | Founder         | Single contact point (`/contact`); simple static file edit + deploy (< 1 hour); no complex backend.                                                                | 1            | 1                | **1 (Low)** | **(A10)** Document SLA: "Listing removal within 24 hours of verified request." Add to privacy policy. Owner: Founder. Residual 1×1 = **1**.                                                                                         |

**Summary:** Ten risks identified. All score **Low (1–6)** with current controls. Highest initial score: **4**. After actions, all fall to **1–2**. No risk is Medium or High. No referral to ODPC required.

---

## Part 5: Sign-off and record outcomes

### Outcome of the assessment

**The assessment concludes that the processing is not likely to result in a high risk to the rights and freedoms of data subjects, and that the project may proceed to public launch once the conditions below are satisfied.**

**Reasoning:**

- UniHub's core processing — publishing verified property listings — involves **only public business data** (property attributes, public contact channels).
- **Zero student personal data** is collected, stored, or processed by UniHub. Browsing is anonymous; contact is user-initiated and external.
- Landlord/agent data is provided **voluntarily off-platform** with the expectation of publication. UniHub's lawful basis is **legitimate interest**, supported by verification, minimisation, and removability.
- **International transfers** (Vercel, GitHub) involve only this non-personal listing data and technical logs. Safeguards (SCCs, minimisation, no sensitive data) are documented.
- **All risks score Low**. The highest residual risk after actions is **2/25**.
- The architecture **by design** prevents scope creep into personal data processing (no auth, no DB, no forms, no analytics).

**Conditions for launch:**

1. Actions **A1–A10** at Part 4 are complete (quarterly audit checklist documented, transfer assessment filed, verification checklist updated, error sanitisation tested, tile risk documented, governance gate in CONTRIBUTING.md, GitHub security enabled, UI hint added, age disclaimer added, removal SLA published).
2. Privacy policy (`/privacy`) and terms (`/terms`) expanded from stubs to full documents reflecting this DPIA.
3. Vercel DPA and GitHub DPA confirmed current and filed.
4. This DPIA reviewed and approved by the controller (Founder).

### Submission to the Office of the Data Protection Commissioner

Section 31 of the Act requires a DPIA where processing is likely to result in a high risk, and paragraph 9(B) of the Guidance Note provides that a DPIA is to be submitted **sixty days before processing begins**.

**This assessment concludes that the processing is not likely to result in a high risk. No obligation to submit therefore arises, and the sixty-day period does not constrain the commencement of the project.** The assessment has been carried out and recorded as a matter of good practice.

If the controller's view of the transfer question (Risk R2) changes, or if any future feature introduces high-risk processing (per Risk R6 governance gate), the Guidance Note directs that the ODPC be consulted before that processing proceeds. That course will be followed.

---

### Approval and sign-off

| Item                                       | Entry                                                                                                                                                                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Measures approved by**                   | _________________________________ (Shadrack Biwott, Founder)                                                                                                                                                                                                                 |
| **Date**                                   | _________________________________                                                                                                                                                                                                                                            |
| **Residual risks approved by**             | _________________________________ (Shadrack Biwott, Founder)                                                                                                                                                                                                                 |
| **Date**                                   | _________________________________                                                                                                                                                                                                                                            |
| **DPO advice provided**                    | N/A — No DPO appointed (not mandatory for this scale). Controller self-assessment.                                                                                                                                                                                           |
| **Date**                                   | _________________________________                                                                                                                                                                                                                                            |
| **Summary of DPO advice**                  | N/A                                                                                                                                                                                                                                                                          |
| **DPO advice accepted or overruled by**    | N/A                                                                                                                                                                                                                                                                          |
| **Date**                                   | _________________________________                                                                                                                                                                                                                                            |
| **Consultation responses reviewed by**     | Shadrack Biwott, Founder. No direct data subject consultation conducted pre-launch (no personal data collected). Student/landlord feedback will be sought post-launch via `/contact` channels; any concern bearing on this assessment will be recorded and the DPIA revised. |
| **Consultation with ODPC — response**      | Not required. To be initiated if future processing meets section 31 threshold or if ODPC guidance on international transfers of non-personal business data changes.                                                                                                          |
| **This DPIA will be kept under review by** | Shadrack Biwott, Founder. **Review points:** before public launch; on any change to dataset, platform, purpose, or processors; quarterly (aligned with listing audit); on any data subject complaint or ODPC inquiry.                                                        |

---

**Prepared and submitted by:**

---

**Shadrack Baraka** — Founder & Developer, UniHub Kenya  
**Date:** 15th January 2026

---

### Annexes (referenced, maintained separately)

1. **Verification Checklist** — Off-platform landlord/agent verification steps (property docs, ownership, agent ID, contact confirmation, personal data scrub).
2. **Quarterly Listing Audit Template** — Checklist for Action A1.
3. **International Transfer Assessment** — Documented SCC + supplementary measures analysis for Vercel/GitHub (Action A2).
4. **Error Sanitisation Test Cases** — Unit tests for `error-capture.ts` (Action A4).
5. **Governance Gate Procedure** — DPIA trigger criteria for future features (Action A6).
6. **GitHub Advanced Security Configuration** — Screenshot/config export (Action A7).
7. **Privacy Policy (Full)** — Expanded `/privacy` page content.
8. **Terms of Service (Full)** — Expanded `/terms` page content.

---

_This DPIA follows the template at Part 5 of the Office of the Data Protection Commissioner Guidance Note on Data Protection Impact Assessment, and the structure of the KabarakAttend DPIA (KLS 126, September 2026) as a Kenyan higher-education sector reference._
