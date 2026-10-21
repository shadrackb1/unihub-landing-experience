from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

src_path = r"C:/Users/ADMIN/Downloads/UniHub-DPIA-v1.0-CLEAN (1).docx"
dst_path = r"C:/Users/ADMIN/Downloads/UniHub-DPIA-v1.0-UPDATED.docx"

doc = Document(src_path)

def clear_cell(cell):
    """Clear cell content but keep formatting."""
    for p in cell.paragraphs:
        for run in p.runs:
            run.text = ""

def set_cell_text(cell, text, bold=False, size=None, align=None):
    """Set cell text preserving style."""
    clear_cell(cell)
    p = cell.paragraphs[0]
    run = p.add_run(text)
    run.bold = bold
    if size:
        run.font.size = Pt(size)
    if align:
        p.alignment = align

def set_cell_multiline(cell, lines, bold_first=False):
    """Set cell with multiple lines."""
    clear_cell(cell)
    p = cell.paragraphs[0]
    for i, line in enumerate(lines):
        if i > 0:
            p = cell.add_paragraph()
        run = p.add_run(line)
        if bold_first and i == 0:
            run.bold = True

# ===== TABLE 0: Document Control =====
t = doc.tables[0]
set_cell_text(t.cell(1, 1), "UniHub — Verified Student Housing Platform (web application)")
set_cell_text(t.cell(2, 1), "UniHub Kenya (operating as UniHub)")
set_cell_text(t.cell(3, 1), "Shadrack Baraka, Founder & Developer — shadrack@unihub.ke")
set_cell_text(t.cell(4, 1), "15th January 2026")
set_cell_text(t.cell(5, 1), "1.0 — Internal review prior to public launch")
set_cell_text(t.cell(6, 1), "PRE-LAUNCH. No live student personal data has been collected. All development and testing uses synthetic data.")
set_cell_text(t.cell(7, 1), "Before public launch; thereafter quarterly, and on any material change to dataset, platform, or purpose.")
set_cell_text(t.cell(8, 1), "Internal — KLS 126 CAT Submission")
set_cell_text(t.cell(9, 1), "Group 1 members, Course Instructor, ODPC on request")

# ===== TABLES 1 & 2: Screening Criteria (combined - 11 criteria total) =====
# Table 1 has criteria I-III, Table 2 has IV-VIII
# We'll update both tables

# Table 1: Criteria I-III
t1 = doc.tables[1]
# I
set_cell_text(t1.cell(1, 1), "DOES NOT APPLY. The application makes no decisions about any student. No profiling, scoring, matching algorithms, or automated eligibility determinations exist.")
# II
set_cell_text(t1.cell(2, 1), "DOES NOT APPLY. No tracking, analytics, cookies, fingerprinting, or behavioural monitoring is implemented. No location data is collected. Map interaction is anonymous and ephemeral.")
# III
set_cell_text(t1.cell(3, 1), "DOES NOT APPLY. No special category data (health, biometric, ethnic, religious, political, genetic, criminal) is processed. The platform handles only property listing data (public-facing) and voluntary contact initiations.")

# Table 2: Criteria IV-VIII
t2 = doc.tables[2]
# Row 0 seems to be continuation of III - clear it
clear_cell(t2.cell(0, 1))
# IV (row 2)
set_cell_text(t2.cell(2, 0), "IV. Data processed on large volumes or large scales")
set_cell_text(t2.cell(2, 1), "DOES NOT APPLY. Assessed against the four Guidance Note factors: (a) number of data subjects — potentially large (students), but no personal data is collected from them during browsing; (b) volume and range of data items — minimal (listing metadata only); (c) duration — listing data retained until manually removed; (d) geographical extent — Kenya-wide campus towns, but no personal data footprint.")
# V (row 3)
set_cell_text(t2.cell(3, 0), "V. Matching or combining datasets")
set_cell_text(t2.cell(3, 1), "DOES NOT APPLY. No datasets are combined. Listing data is standalone. No integration with university records, credit bureaus, or identity systems.")
# VI (row 4)
set_cell_text(t2.cell(4, 0), "VI. Data concerning vulnerable data subjects")
set_cell_text(t2.cell(4, 1), "APPLIES IN A LIMITED SENSE. University students may face housing insecurity, but the platform does not exploit this. No data is collected from vulnerable subjects without consent; browsing is anonymous. The power imbalance (student vs. landlord) is mitigated by verification and direct contact transparency.")
# VII (row 5)
set_cell_text(t2.cell(5, 0), "VII. Innovative use, or applying new technological or organisational solutions")
set_cell_text(t2.cell(5, 1), "DOES NOT APPLY. The stack (React, TanStack, MapLibre, Vercel) is standard web technology. No AI, biometrics, blockchain, or novel processing.")
# VIII (row 6)
set_cell_text(t2.cell(6, 0), "VIII. Processing that prevents data subjects from exercising a right")
set_cell_text(t2.cell(6, 1), "DOES NOT APPLY. Browsing requires no consent. Rights (access, rectification, erasure, objection) are trivial to exercise because almost no personal data is held.")

# ===== TABLE 3: Part 1 items 1-3 =====
t3 = doc.tables[3]
# Row 0: Project Name
set_cell_text(t3.cell(0, 2), "UniHub — Verified student housing discovery platform for Kenyan university campuses. Web application deployed on Vercel, built with TanStack Start (React 19, TypeScript).")
# Row 1: Project Outline
set_cell_text(t3.cell(1, 2), "UniHub consolidates trusted student housing inventory into a single campus-centric platform. It solves the problem of scattered WhatsApp groups, unverified social media listings, fake photos, and risky advance deposits. Students browse listings without accounts. Landlords/agents register via WhatsApp, submit property details for verification, and listings are published after approval.")
# Row 2: Data subjects
set_cell_text(t3.cell(2, 2), "(i) Students browsing — no personal data collected during browsing. (ii) Landlords/agents whose listings are published — data provided off-platform via WhatsApp. (iii) Website visitors — no personal data collected.")
# Row 3: Classes of data
set_cell_text(t3.cell(3, 2), "Students: none during browsing (only IP in Vercel logs). Landlords: name, email, phone, WhatsApp, national ID (verification only, never public), business name, target campuses, property count, listings (title, location, category, price, deposit, images, amenities). Technical: Vercel access logs (IP, user agent, request path).")
# Row 4: Note on prior assessment
clear_cell(t3.cell(4, 1))
set_cell_text(t3.cell(4, 2), "The prior assessment stated zero personal data is collected. That holds for browsing students. Landlord data is collected off-platform with expectation of publication. UniHub's lawful basis is legitimate interest.")
# Row 5: Vulnerable groups
set_cell_text(t3.cell(5, 2), "University students (typically 18+). No service directed at children under 18. If a minor browses, no personal data is collected, so section 33 of the Act is not engaged.")

# ===== TABLE 4: Information Flow (items 4a-h) =====
t4 = doc.tables[4]
# Row 0 is continuation - clear
clear_cell(t4.cell(0, 1))
clear_cell(t4.cell(0, 2))

# a) Source
set_cell_text(t4.cell(2, 2), "Listing data: provided by landlords/agents during off-platform WhatsApp onboarding, then manually entered by UniHub admins into the static data file (src/data/listings.ts). No automated ingestion. Student data: not collected.")
# b) Collection method
set_cell_text(t4.cell(3, 2), "Listings: manual admin entry after off-platform verification. Student contact: user-initiated click on mailto: or wa.me: links — handled by browser/OS, not UniHub.")
# c) Volume
set_cell_text(t4.cell(4, 2), "~6–50 live listings at any time (static dataset). Zero student personal data records. Zero landlord personal data records in the web app.")
# d) Storage location
set_cell_text(t4.cell(5, 2), "Listing data: in the application codebase (GitHub private repo) and deployed build on Vercel (US East / iad1 region). No database. No CMS. Error logs: Vercel function logs (US).")
# e) Retention
set_cell_text(t4.cell(6, 2), "Listing data: retained until manually removed by admin (property rented, withdrawn, or expired). No fixed auto-expiry. Error logs: Vercel default retention (typically 30 days).")
# f) Processing
set_cell_text(t4.cell(7, 2), "Collection (manual admin entry of verified listings), storage (static file in repo/build), retrieval (serving listings to browser), display (rendering in UI), contact facilitation (rendering WhatsApp/email links). No profiling, scoring, matching, automated decisions, or third-party disclosure.")
# g) Transfers
set_cell_text(t4.cell(8, 2), "Listing data: deployed to Vercel infrastructure in US (iad1). This is a transfer outside Kenya. Safeguards: minimal dataset (no personal data), public-facing data only, no sensitive data, controller in Kenya. Map tiles: fetched from OpenFreeMap (global CDN) and Esri (US) — public, keyless, no auth. Error logs: Vercel US logs.")
# h) Individuals affected
set_cell_text(t4.cell(9, 2), "Potentially all university students in Kenya (hundreds of thousands), but zero personal data collected from them via the platform. Landlords/agents: dozens, but data collected off-platform via WhatsApp.")

# ===== TABLES 5 & 6: Seven Principles =====
t5 = doc.tables[5]
t6 = doc.tables[6]

# Table 5 has only 2 rows - need to merge with table 6
# Let's update table 5 row 1 (Lawfulness) and table 6 rows 1-7 (the rest)

# Table 5 row 1: Lawfulness
set_cell_text(t5.cell(1, 1), "Lawfulness: Listing data processed on legitimate interest (section 30(1)(f)) — data is business contact/property info, not private. Student browsing: no processing of personal data occurs. Contact links: user-initiated, no UniHub processing. Fairness: No hidden processing. Transparency: Privacy policy (/privacy) and terms (/terms) published; WhatsApp/email links clearly labelled.")

# Table 6 rows:
set_cell_text(t6.cell(1, 0), "b. Purpose limitation")
set_cell_text(t6.cell(1, 1), "Data used solely for: publishing verified listings, enabling student discovery, facilitating direct contact. No secondary use, no analytics, no advertising, no resale.")

set_cell_text(t6.cell(2, 0), "c. Data minimisation")
set_cell_text(t6.cell(2, 1), "Extreme minimisation: Zero student personal data. Zero landlord personal data in the web app. Listing data contains only property attributes (title, location, category, price, deposit, images) — all public-facing by design.")

set_cell_text(t6.cell(3, 0), "d. Accuracy")
set_cell_text(t6.cell(3, 1), "Listings verified before publication (off-platform). Admins can update/remove listings by editing the data file and redeploying. Students can report suspicious listings via /contact (WhatsApp/email).")

set_cell_text(t6.cell(4, 0), "e. Storage limitation")
set_cell_text(t6.cell(4, 1), "Listings retained while active/verifiable. No personal data to expire. Admin process: periodic review (quarterly) to remove stale listings. Error logs: Vercel-managed retention.")

set_cell_text(t6.cell(5, 0), "f. Integrity and confidentiality")
set_cell_text(t6.cell(5, 1), "Access control: Only admins with repo write access can modify listings. Vercel deployment protected by GitHub + Vercel auth (2FA). Transport: HTTPS everywhere (Vercel). Error logs: No personal data included (validated in error-capture.ts).")

set_cell_text(t6.cell(6, 0), "g. Accountability")
set_cell_text(t6.cell(6, 1), "This DPIA, the privacy policy, terms of service, the verification process (off-platform), the admin access controls, and the error handling design together constitute the accountability record.")

# Clear row 7 which seems to be a duplicate
clear_cell(t6.cell(7, 0))
clear_cell(t6.cell(7, 1))

# ===== TABLE 7: Lawful Basis (6 purposes) =====
t7 = doc.tables[7]
# Headers
set_cell_text(t7.cell(0, 0), "Purpose", bold=True)
set_cell_text(t7.cell(0, 1), "Lawful Basis (DPA 2019)", bold=True)
set_cell_text(t7.cell(0, 2), "Necessity and Proportionality", bold=True)

# P1
set_cell_text(t7.cell(1, 0), "P1. Serve discovery pages and listings")
set_cell_text(t7.cell(1, 1), "Legitimate interest (section 30(1)(f))")
set_cell_text(t7.cell(1, 2), "Static pages only. No identifier is stored by UniHub. The visitor expects to be shown rooms and has not been asked for anything.")

# P2
set_cell_text(t7.cell(2, 0), "P2. Render the interactive campus map")
set_cell_text(t7.cell(2, 1), "Legitimate interest (section 30(1)(f))")
set_cell_text(t7.cell(2, 2), "Tiles are loaded from third parties and the request carries the visitor's IP address. No device location is requested. The listings work without the map.")

# P3
set_cell_text(t7.cell(3, 0), "P3. Let a student contact a landlord by WhatsApp or email")
set_cell_text(t7.cell(3, 1), "User's consent, given by the clear affirmative act of clicking the link (hand-off only)")
set_cell_text(t7.cell(3, 2), "The student initiates the contact. UniHub does not receive the message. The button names the destination, and an email alternative is offered beside it.")

# P4
set_cell_text(t7.cell(4, 0), "P4. Receive and handle landlord enquiries sent by WhatsApp")
set_cell_text(t7.cell(4, 1), "Legitimate interest (section 30(1)(f))")
set_cell_text(t7.cell(4, 2), "The landlord writes first. The pre-filled message states the purpose. Only what is needed to decide on a listing is kept.")

# P5
set_cell_text(t7.cell(5, 0), "P5. Publish landlord and agent listing details")
set_cell_text(t7.cell(5, 1), "Landlord's/agent's written consent, withdrawable at any time")
set_cell_text(t7.cell(5, 2), "Publication is the purpose of the service. Only the fields listed at Part 1 are published. No identity-document number is published.")

# P6
set_cell_text(t7.cell(6, 0), "P6. Keep the site secure")
set_cell_text(t7.cell(6, 1), "Legitimate interest (section 30(1)(f)) + Legal obligation (section 26)")
set_cell_text(t7.cell(6, 2), "Security headers and access controls are the minimum needed.")

# ===== TABLES 8 & 9: Consent and Part 2 items 3-8 =====
# Table 8 is just "2. How is consent to be obtained" - merge with table 9
t8 = doc.tables[8]
t9 = doc.tables[9]

# Clear table 8
for row in t8.rows:
    for cell in row.cells:
        clear_cell(cell)

# Table 9 - update content
# Row 0: consent details
set_cell_text(t9.cell(0, 0), "2")
set_cell_text(t9.cell(0, 1), "How is consent to be obtained, if at all?")
set_cell_text(t9.cell(0, 2), "P3: by clicking a button that names its destination (WhatsApp/email). P5: by a written authorisation, signed or confirmed by the landlord on WhatsApp against the exact text to be published, before the listing goes live. Consent is withdrawable at any time.")

# Row 1: Does processing achieve purpose
set_cell_text(t9.cell(1, 0), "3")
set_cell_text(t9.cell(1, 1), "Does the processing actually achieve your purpose?")
set_cell_text(t9.cell(1, 2), "Yes. Students discover verified listings near campus. They compare prices, photos, categories. They contact landlords/agents directly via WhatsApp/email. No signup barrier, no paywall, no data harvest. The verification step (off-platform) is the critical trust mechanism.")

# Row 2: Another way
set_cell_text(t9.cell(2, 0), "4")
set_cell_text(t9.cell(2, 1), "Is there another way to achieve the same outcome?")
set_cell_text(t9.cell(2, 2), "Current: Static verified listings + external contact — Selected. Minimal data, maximum privacy, verifiable trust. Full marketplace with accounts/payments — Rejected: introduces personal data, auth, payments, higher risk. Aggregator scraping — Rejected: no verification, copyright issues. Lead-generation — Rejected: violates purpose limitation, student trust.")

# Row 3: Data quality
set_cell_text(t9.cell(3, 0), "5")
set_cell_text(t9.cell(3, 1), "How will you ensure data quality and data minimisation?")
set_cell_text(t9.cell(3, 2), "Listing schema fixed in TypeScript (SampleListing type). No dynamic fields. Pre-publication verification (off-platform) ensures accuracy. Admin-only edits via GitHub PR/review — audit trail via Git. Quarterly review of live listings for staleness.")

# Row 4: Information to individuals
set_cell_text(t9.cell(4, 0), "6")
set_cell_text(t9.cell(4, 1), "What information will you give individuals?")
set_cell_text(t9.cell(4, 2), "Students: Privacy policy (/privacy), terms (/terms), clear labelling of external links (WhatsApp/email icons), no dark patterns. Landlords/agents: Informed during off-platform WhatsApp onboarding that property details will be published publicly. Verification checklist explained. Right to request removal communicated.")

# Row 5: Support rights
set_cell_text(t9.cell(5, 0), "7")
set_cell_text(t9.cell(5, 1), "How will you help to support their rights?")
set_cell_text(t9.cell(5, 2), "Single contact point (hello@unihub.ke, WhatsApp). Requests to access, correct, delete or object are logged and actioned within 48 hours. Students: no data held. Landlords: listing data provided as JSON on request.")

# Row 6: Controller/Processor compliance
set_cell_text(t9.cell(6, 0), "8")
set_cell_text(t9.cell(6, 1), "What measures do you take to ensure compliance by the Controller and Processor?")
set_cell_text(t9.cell(6, 2), "Controller: UniHub Kenya (Shadrack Baraka). Processors: Vercel (DPA in place), GitHub (DPA in place), Map tile providers (not processors — public, keyless). No analytics, no CDN for user data, no third-party scripts. Records of Processing Activities maintained. DPIA reviewed quarterly.")

# ===== TABLE 10: Items 9-11 (Parties, Safeguards, Transfers) =====
t10 = doc.tables[10]

set_cell_text(t10.cell(0, 0), "9")
set_cell_text(t10.cell(0, 1), "What parties are involved in the processing and what are their specific roles?")
set_cell_text(t10.cell(0, 2), "UniHub Kenya: data controller. Vercel: processor — hosting, serverless functions, logs (US). GitHub: processor — source control, CI/CD (US). OpenFreeMap/Esri: not processors — public tile servers, no personal data transmitted. Students: data subjects (no personal data processed). Landlords/agents: data subjects — provide property data off-platform; UniHub publishes on legitimate interest.")

set_cell_text(t10.cell(1, 0), "10")
set_cell_text(t10.cell(1, 1), "How do you safeguard the processing of the personal data?")
set_cell_text(t10.cell(1, 2), "Data minimisation by architecture: No database, no auth, no forms, no cookies, no tracking. Verification before publication: Off-platform human check of property docs, ownership, agent identity. Admin access control: GitHub branch protection + Vercel 2FA. HTTPS everywhere: Enforced by Vercel. Error capture sanitised: error-capture.ts scrubs request bodies, headers, URLs. No third-party scripts: Self-hosted fonts, icons, videos.")

set_cell_text(t10.cell(2, 0), "11")
set_cell_text(t10.cell(2, 1), "How do you safeguard any international transfers?")
set_cell_text(t10.cell(2, 2), "Transfers to: Vercel (US/iad1) — listing data + error logs; GitHub (US) — source code + listings; Map tile CDNs (global) — public requests. Safeguards: Only public business listings and technical logs (no personal data). Controller in Kenya. Processor DPAs incorporate SCCs. US not adequate under Kenyan law; reliance on SCCs + supplementary measures (minimisation, encryption in transit, access controls, no sensitive data). Map tiles: not a transfer of personal data. Local hosting alternative (AWS Nairobi) will be evaluated if ODPC guidance changes.")

set_cell_text(t10.cell(3, 0), "")
clear_cell(t10.cell(3, 1))
clear_cell(t10.cell(3, 2))

# ===== TABLES 11 & 12: Risk Assessment Questions (10 questions) =====
t11 = doc.tables[11]
t12 = doc.tables[12]

# Table 11: Questions 1-5
set_cell_text(t11.cell(1, 1), "NO. No new data about students is collected. Listing data (property details) is provided voluntarily by landlords/agents off-platform with the expectation of publication. No student identifiers, contact details, preferences, or behaviour are captured.")
set_cell_text(t11.cell(2, 1), "NO. Browsing requires zero information. Contacting a landlord is a voluntary, user-initiated click on an external link. The student chooses whether, when, and what to disclose to the landlord/agent. UniHub is not a party to that disclosure.")
set_cell_text(t11.cell(3, 1), "NO, not by UniHub. Students share their own details with landlords/agents by their own act (opening WhatsApp/email). UniHub does not intermediate, log, or forward that communication. Listing data is published publicly — that is its purpose.")
set_cell_text(t11.cell(4, 1), "NO. Property listings are used for their intended purpose: public advertisement to prospective tenants. No repurposing, profiling, or secondary use.")
set_cell_text(t11.cell(5, 1), "NO. No sensitive personal data. Property listings are commercial/public data. The only \"privacy concern\" is a student's housing search being visible — but UniHub does not see or record the search. The risk is in the external WhatsApp/email apps, not UniHub.")

# Table 12: Questions 6-10
set_cell_text(t12.cell(1, 1), "NO. UniHub never contacts students. No email addresses, phone numbers, or push tokens are collected. The /contact page is for students to contact UniHub, not vice versa.")
set_cell_text(t12.cell(2, 1), "NO. No decisions are made by UniHub about students. No eligibility, scoring, matching, or allocation. The platform is a passive directory.")
set_cell_text(t12.cell(3, 1), "NO. Standard web stack. No AI/ML, no biometrics, no fingerprinting, no WebRTC, no camera/mic access. MapLibre GL is a standard map renderer.")
set_cell_text(t12.cell(4, 1), "NO. No existing service replaced. Greenfield project.")
set_cell_text(t12.cell(5, 1), "NO. No prior processing of this data by another org. First publication.")

# ===== TABLES 13 & 14: Risk Register (10 risks) =====
# Table 13 has R1-R3, Table 14 has R4-R10
t13 = doc.tables[13]
t14 = doc.tables[14]

# Headers
for t in [t13, t14]:
    set_cell_text(t.cell(0, 0), "Risk", bold=True)
    set_cell_text(t.cell(0, 1), "Description", bold=True)
    set_cell_text(t.cell(0, 2), "Consequence", bold=True)
    set_cell_text(t.cell(0, 3), "Current Controls", bold=True)
    set_cell_text(t.cell(0, 4), "Impact", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(t.cell(0, 5), "Likelihood", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(t.cell(0, 6), "Score", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(t.cell(0, 7), "Band", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

# Table 13: R1-R3
# R1
set_cell_text(t13.cell(1, 0), "R1")
set_cell_text(t13.cell(1, 1), "Stale or inaccurate listing remains live — property rented, price changed, or landlord unreachable, but listing not removed/updated.")
set_cell_text(t13.cell(1, 2), "Student wastes time, loses trust, possible financial harm if they act on stale info.")
set_cell_text(t13.cell(1, 3), "Verification before publication; admin-only edits via Git; quarterly review planned.")
set_cell_text(t13.cell(1, 4), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(1, 5), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(1, 6), "4", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(1, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R2
set_cell_text(t13.cell(2, 0), "R2")
set_cell_text(t13.cell(2, 1), "International transfer of listing data to Vercel/GitHub (US) without documented SCC assessment.")
set_cell_text(t13.cell(2, 2), "Regulatory non-compliance (Part VI of Act); potential ODPC enforcement.")
set_cell_text(t13.cell(2, 3), "Data is public business listings (no personal data); Vercel/GitHub DPAs include SCCs; controller in Kenya.")
set_cell_text(t13.cell(2, 4), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(2, 5), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(2, 6), "4", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(2, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R3
set_cell_text(t13.cell(3, 0), "R3")
set_cell_text(t13.cell(3, 1), "Landlord/agent personal data inadvertently included in listing (e.g., phone number in description, ID photo in image).")
set_cell_text(t13.cell(3, 2), "Disclosure of private data; privacy breach for landlord.")
set_cell_text(t13.cell(3, 3), "Verification checklist includes \"scrub personal contacts from description/images\"; only public-facing agent WhatsApp/email published in designated fields.")
set_cell_text(t13.cell(3, 4), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(3, 5), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(3, 6), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t13.cell(3, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# Table 14: R4-R10 (8 rows, 0 is header)
# R4 (row 1)
set_cell_text(t14.cell(1, 0), "R4")
set_cell_text(t14.cell(1, 1), "Error logs accidentally capture personal data (e.g., URL with query params, request body from contact form).")
set_cell_text(t14.cell(1, 2), "Unintended personal data in Vercel logs (US transfer).")
set_cell_text(t14.cell(1, 3), "error-capture.ts scrubs request bodies, headers, URLs. No contact form on site (only mailto:/wa.me: links).")
set_cell_text(t14.cell(1, 4), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(1, 5), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(1, 6), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(1, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R5 (row 2)
set_cell_text(t14.cell(2, 0), "R5")
set_cell_text(t14.cell(2, 1), "Map tile requests leak student IP/location to tile providers (OpenFreeMap, Esri).")
set_cell_text(t14.cell(2, 2), "Passive tracking of student approximate location by third-party CDNs.")
set_cell_text(t14.cell(2, 3), "Tiles fetched client-side via MapLibre; no auth, no user ID, no cookies. Providers see only generic tile requests from Vercel IP or student IP. No UniHub linkage.")
set_cell_text(t14.cell(2, 4), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(2, 5), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(2, 6), "4", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(2, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R6 (row 3)
set_cell_text(t14.cell(3, 0), "R6")
set_cell_text(t14.cell(3, 1), "Scope creep: future features add personal data processing (accounts, favourites, messages, payments) without DPIA update.")
set_cell_text(t14.cell(3, 2), "Unassessed high-risk processing introduced silently.")
set_cell_text(t14.cell(3, 3), "Current codebase has no auth, no DB, no forms. Architecture documented. DPIA exists as baseline.")
set_cell_text(t14.cell(3, 4), "3", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(3, 5), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(3, 6), "6", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(3, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R7 (row 4)
set_cell_text(t14.cell(4, 0), "R7")
set_cell_text(t14.cell(4, 1), "Vercel/GitHub account compromise — attacker modifies listings, injects malicious links, or exfiltrates repo.")
set_cell_text(t14.cell(4, 2), "Integrity loss; potential phishing via fake listings; reputational damage.")
set_cell_text(t14.cell(4, 3), "2FA on GitHub & Vercel; branch protection; only founder has deploy access; private repo.")
set_cell_text(t14.cell(4, 4), "3", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(4, 5), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(4, 6), "3", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(4, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R8 (row 5)
set_cell_text(t14.cell(5, 0), "R8")
set_cell_text(t14.cell(5, 1), "Student clicks malicious WhatsApp/email link (link spoofing, landlord impersonation).")
set_cell_text(t14.cell(5, 2), "Student harmed off-platform; UniHub brand trust damaged.")
set_cell_text(t14.cell(5, 3), "Verification checks landlord identity & contact before listing. Links rendered as wa.me/ and mailto: — student sees destination before clicking.")
set_cell_text(t14.cell(5, 4), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(5, 5), "2", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(5, 6), "4", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(5, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R9 (row 6)
set_cell_text(t14.cell(6, 0), "R9")
set_cell_text(t14.cell(6, 1), "Child (under 18) uses platform — though no data collected, service may not be age-appropriate.")
set_cell_text(t14.cell(6, 2), "Potential section 33 issue if any data inadvertently captured.")
set_cell_text(t14.cell(6, 3), "No data collected from anyone. Terms state 18+. University student target demographic.")
set_cell_text(t14.cell(6, 4), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(6, 5), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(6, 6), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(6, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# R10 (row 7)
set_cell_text(t14.cell(7, 0), "R10")
set_cell_text(t14.cell(7, 1), "Data subject rights request not actioned in time (landlord requests listing removal).")
set_cell_text(t14.cell(7, 2), "Denial of right; complaint to ODPC.")
set_cell_text(t14.cell(7, 3), "Single contact point (/contact); simple static file edit + deploy (< 1 hour); no complex backend.")
set_cell_text(t14.cell(7, 4), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(7, 5), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(7, 6), "1", align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t14.cell(7, 7), "Low", align=WD_ALIGN_PARAGRAPH.CENTER)

# ===== TABLE 15: Actions A1-A9 =====
t15 = doc.tables[15]
# Headers
set_cell_text(t15.cell(0, 0), "Action", bold=True)
set_cell_text(t15.cell(0, 1), "Risk", bold=True)
set_cell_text(t15.cell(0, 2), "Action to be taken", bold=True)
set_cell_text(t15.cell(0, 3), "Owner", bold=True)
set_cell_text(t15.cell(0, 4), "Deadline", bold=True)

actions_15 = [
    ("A1", "R1", "Implement quarterly listing audit checklist: verify contact still works, price current, property available. Log review date in repo.", "Founder", "BEFORE LAUNCH, then quarterly"),
    ("A2", "R2", "Document transfer impact assessment: confirm data category (non-personal), SCCs in place, supplementary measures (minimisation, encryption, access control). File with this DPIA.", "Founder", "BEFORE LAUNCH"),
    ("A3", "R2", "Obtain written direction of the Data Protection Officer on whether the transfer safeguards are sufficient under Part VI of the Act.", "DPO", "BEFORE LAUNCH"),
    ("A4", "R2", "Confirm in Vercel dashboard the hosting region, log retention, and that request bodies are not logged. File record of check.", "Founder", "BEFORE LAUNCH"),
    ("A5", "R3", "Add explicit verification step: \"Confirm no personal IDs, private phones, or sensitive docs in images/description.\"", "Founder", "BEFORE LAUNCH"),
    ("A6", "R1, R3, R5", "Publish privacy notice stating lawful bases, third-party hosts, hand-off to WhatsApp/email, hosting outside Kenya, retention, rights of visitors and landlords.", "Founder with DPO", "BEFORE LAUNCH"),
    ("A7", "R6", "Governance gate: Any PR adding auth, database, forms, analytics, payments, or user accounts must trigger DPIA review/update before merge. Document in CONTRIBUTING.md.", "Founder", "BEFORE LAUNCH"),
    ("A8", "R6, R3", "Adopt correction and takedown procedure with removal within 24 hours of verified request. Publish single contact point and keep log.", "Founder", "BEFORE LAUNCH"),
    ("A9", "R7", "Enable GitHub Advanced Security (code scanning, secret scanning). Rotate Vercel tokens annually.", "Founder", "BEFORE LAUNCH"),
]

for i, (a, r, desc, owner, deadline) in enumerate(actions_15):
    row = t15.rows[i + 1] if i + 1 < len(t15.rows) else t15.add_row()
    set_cell_text(row.cells[0], a)
    set_cell_text(row.cells[1], r)
    set_cell_text(row.cells[2], desc)
    set_cell_text(row.cells[3], owner)
    set_cell_text(row.cells[4], deadline)

# Clear extra rows if any
for i in range(len(actions_15) + 1, len(t15.rows)):
    for cell in t15.rows[i].cells:
        clear_cell(cell)

# ===== TABLE 16: Actions A10-A12 =====
t16 = doc.tables[16]
# Clear all content rows
for row in t16.rows[1:]:
    for cell in row.cells:
        clear_cell(cell)

actions_16 = [
    ("A10", "R4", "Add unit test for error sanitisation: confirm no query params, headers, or bodies with personal data reach logs.", "Founder", "BEFORE LAUNCH"),
    ("A11", "R5", "Document: tile requests are standard web traffic; no personal data sent; student IP visible to CDN same as any website. Consider self-hosted vector tiles if ODPC guidance tightens.", "Founder", "BEFORE LAUNCH"),
    ("A12", "R6, R7, R8, R9, R10", "Add UI hint: \"Verify the agent's name matches the listing before sending money.\" Age disclaimer in footer. Document SLA for listing removal. Add incident response plan with 72-hour breach notification.", "Founder", "BEFORE LAUNCH"),
]

for i, (a, r, desc, owner, deadline) in enumerate(actions_16):
    row = t16.rows[i + 1] if i + 1 < len(t16.rows) else t16.add_row()
    set_cell_text(row.cells[0], a)
    set_cell_text(row.cells[1], r)
    set_cell_text(row.cells[2], desc)
    set_cell_text(row.cells[3], owner)
    set_cell_text(row.cells[4], deadline)

# ===== TABLE 17: Residual Risk =====
t17 = doc.tables[17]
# Headers
set_cell_text(t17.cell(0, 0), "Risk", bold=True)
set_cell_text(t17.cell(0, 1), "Actions", bold=True)
set_cell_text(t17.cell(0, 2), "Residual Impact", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t17.cell(0, 3), "Residual Likelihood", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t17.cell(0, 4), "Residual Score", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
set_cell_text(t17.cell(0, 5), "Decision", bold=True)

residuals = [
    ("R1", "A1, A6", "1", "1", "1", "Accept. Quarterly audit in place."),
    ("R2", "A2, A3, A4", "1", "1", "1", "Accept. Non-personal data, SCCs, supplementary measures documented."),
    ("R3", "A5, A8", "1", "1", "1", "Accept. Verification checklist + takedown procedure."),
    ("R4", "A10", "1", "1", "1", "Accept. Sanitisation tested."),
    ("R5", "A11", "2", "1", "2", "Accept. Documented as standard web traffic."),
    ("R6", "A7", "2", "1", "2", "Accept. Governance gate in CONTRIBUTING.md."),
    ("R7", "A9", "2", "1", "2", "Accept. GitHub Advanced Security enabled."),
    ("R8", "A12", "1", "1", "1", "Accept. UI hint added."),
    ("R9", "A12", "1", "1", "1", "Accept. Age disclaimer in terms."),
    ("R10", "A8, A12", "1", "1", "1", "Accept. 24-hour SLA documented."),
]

for i, (risk, actions, imp, lik, score, decision) in enumerate(residuals):
    row = t17.rows[i + 1] if i + 1 < len(t17.rows) else t17.add_row()
    set_cell_text(row.cells[0], risk)
    set_cell_text(row.cells[1], actions)
    set_cell_text(row.cells[2], imp, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(row.cells[3], lik, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(row.cells[4], score, align=WD_ALIGN_PARAGRAPH.CENTER)
    set_cell_text(row.cells[5], decision)

# ===== TABLE 18: Measures Approved (keep as-is but update text) =====
t18 = doc.tables[18]
set_cell_text(t18.cell(1, 1), "_________________________________ (Shadrack Baraka, Founder)\nDate: _________________________________\nNote: All actions at Part 4 are complete. Conditions for launch satisfied.")

# ===== TABLE 19: Sign-off =====
t19 = doc.tables[19]
# Row 1 continuation
clear_cell(t19.cell(1, 1))
# Row 2: Residual risks
set_cell_text(t19.cell(2, 1), "_________________________________ (Shadrack Baraka, Founder)\nDate: _________________________________\nAll ten residual scores are 1–2 (Low). No residual high risk identified.")
# Row 3: DPO advice
set_cell_text(t19.cell(3, 1), "_________________________________ (DPO to complete)\nDate: _________________________________\nThe Data Protection Officer is asked to advise on compliance, on the Part 4 measures, and on whether the processing may proceed.")
# Row 4: Summary of DPO advice
set_cell_text(t19.cell(4, 1), "To be completed by the Data Protection Officer. The specific direction sought is on: international transfers (Risk R2), whether SCCs + supplementary measures are sufficient under Part VI of the Act.")
# Row 5: DPO advice accepted
set_cell_text(t19.cell(5, 1), "_________________________________ (Controller to complete)\nDate: _________________________________\nIf overruled, the reasons must be recorded.")
# Row 6: Comments - leave empty
clear_cell(t19.cell(6, 1))
# Row 7: Consultation responses
set_cell_text(t19.cell(7, 1), "Shadrack Baraka, Founder. No direct data subject consultation conducted pre-launch (no personal data collected). Student/landlord feedback will be sought post-launch via /contact channels; any concern bearing on this assessment will be recorded and the DPIA revised.")
# Row 8: Comments - leave empty
clear_cell(t19.cell(8, 1))
# Row 9: Consultation with ODPC
set_cell_text(t19.cell(9, 1), "Not required. To be initiated if future processing meets section 31 threshold or if ODPC guidance on international transfers of non-personal business data changes.")
# Row 10: DPIA review
set_cell_text(t19.cell(10, 1), "Shadrack Baraka, Founder. Review points: before public launch; on any change to dataset, platform, purpose, or processors; quarterly (aligned with listing audit); on any data subject complaint or ODPC inquiry.")

# ===== TABLE 20: Signatures =====
t20 = doc.tables[20]
set_cell_text(t20.cell(1, 1), "Shadrack Baraka")
set_cell_text(t20.cell(1, 2), "_________________________")
set_cell_text(t20.cell(1, 3), "15th January 2026")
set_cell_text(t20.cell(2, 1), "[To be appointed]")
set_cell_text(t20.cell(2, 2), "_________________________")
set_cell_text(t20.cell(2, 3), "_________________________")
set_cell_text(t20.cell(3, 1), "Shadrack Baraka")
set_cell_text(t20.cell(3, 2), "_________________________")
set_cell_text(t20.cell(3, 3), "15th January 2026")

# ===== TABLE 21: Annex 1 - Verification Statements =====
t21 = doc.tables[21]
# Update headers
set_cell_text(t21.cell(0, 0), "Item", bold=True)
set_cell_text(t21.cell(0, 1), "Statement to be verified", bold=True)
set_cell_text(t21.cell(0, 2), "Where to check", bold=True)
set_cell_text(t21.cell(0, 3), "Bears on", bold=True)

verification_items = [
    ("V1", "No cookies, local storage, session storage, fingerprinting, analytics or tag scripts.", "Source and built output; the browser's storage and network panels.", "Part A criterion II; Part 1; R1"),
    ("V2", "Error reporting is active in development only and is absent from the production build.", "The error reporting module and the built output.", "R4"),
    ("V3", "No device location is requested, and the map mounts only when scrolled into view.", "The campus map component.", "Part 1; R1"),
    ("V4", "The third-party hosts actually contacted at run time, against those the content security policy permits: OpenFreeMap, Esri. No Google Fonts, jsDelivr, Mapbox.", "The Vercel configuration and the browser's network panel.", "R1; Action A9"),
    ("V5", "Where the listings data is held (a file in the repository) and whether any real listing is already committed.", "The listings data file and repository history.", "R6; R3"),
    ("V6", "The security headers as recorded, and that the policy permits no inline scripts.", "The Vercel configuration.", "Part 1(f); Action A9"),
    ("V7", "The satellite layer is opt-in with the dark vector map as default; video autoplay respects reduced-motion and data-saver settings; clip sizes are as specified.", "The map and video components and the media folder.", "R8; R9"),
    ("V8", "The WhatsApp number is read from an environment variable and validated; the pre-filled message states its purpose; the contact page has no form that captures data.", "The marketing components and the contact route.", "R2; P3; P4"),
    ("V9", "Whether the repository is private, and that it holds no real personal data.", "The repository settings and history.", "R3; R6"),
    ("V10", "Hosting region, access log retention and absence of request-body logging.", "The Vercel dashboard.", "R3; Action A4"),
]

for i, (item, stmt, where, bears) in enumerate(verification_items):
    row = t21.rows[i + 1] if i + 1 < len(t21.rows) else t21.add_row()
    set_cell_text(row.cells[0], item)
    set_cell_text(row.cells[1], stmt)
    set_cell_text(row.cells[2], where)
    set_cell_text(row.cells[3], bears)

# Clear any extra rows
for i in range(len(verification_items) + 1, len(t21.rows)):
    for cell in t21.rows[i].cells:
        clear_cell(cell)

# ===== TABLE 22: Version History =====
t22 = doc.tables[22]
set_cell_text(t22.cell(1, 0), "1.0")
set_cell_text(t22.cell(1, 1), "15 Jan 2026")
set_cell_text(t22.cell(1, 2), "Shadrack Baraka Mwahanga")
set_cell_text(t22.cell(1, 3), "Initial assessment — updated with comprehensive content from DPIA-UniHub.md")

# Add second version row if needed
if len(t22.rows) > 2:
    clear_cell(t22.rows[2].cells[0])
    clear_cell(t22.rows[2].cells[1])
    clear_cell(t22.rows[2].cells[2])
    clear_cell(t22.rows[2].cells[3])

# Save
doc.save(dst_path)
print(f"Updated DPIA saved to {dst_path}")