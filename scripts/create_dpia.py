from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
import os

output_dir = "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials"
os.makedirs(output_dir, exist_ok=True)

doc = SimpleDocTemplate(
    os.path.join(output_dir, "Group8_CAT3_DPIA.pdf"),
    pagesize=A4,
    rightMargin=2*cm, leftMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle('CustomTitle', parent=styles['Title'],
    fontSize=16, leading=20, spaceAfter=4, alignment=TA_CENTER,
    textColor=HexColor('#1a1a2e'), fontName='Helvetica-Bold')

subtitle_style = ParagraphStyle('CustomSubtitle', parent=styles['Normal'],
    fontSize=10, leading=13, spaceAfter=10, alignment=TA_CENTER,
    textColor=HexColor('#4a4a6a'), fontName='Helvetica')

heading1_style = ParagraphStyle('Heading1Custom', parent=styles['Heading1'],
    fontSize=13, leading=17, spaceBefore=14, spaceAfter=6,
    textColor=HexColor('#1a1a2e'), fontName='Helvetica-Bold')

heading2_style = ParagraphStyle('Heading2Custom', parent=styles['Heading2'],
    fontSize=11, leading=14, spaceBefore=10, spaceAfter=4,
    textColor=HexColor('#2d2d5e'), fontName='Helvetica-Bold')

heading3_style = ParagraphStyle('Heading3Custom', parent=styles['Heading3'],
    fontSize=10, leading=13, spaceBefore=8, spaceAfter=4,
    textColor=HexColor('#3a3a6e'), fontName='Helvetica-Bold')

body_style = ParagraphStyle('BodyCustom', parent=styles['Normal'],
    fontSize=9, leading=12, spaceAfter=4, alignment=TA_JUSTIFY,
    fontName='Helvetica')

bullet_style = ParagraphStyle('BulletCustom', parent=styles['Normal'],
    fontSize=9, leading=12, spaceAfter=3, leftIndent=18, bulletIndent=6,
    fontName='Helvetica')

small_style = ParagraphStyle('SmallCustom', parent=styles['Normal'],
    fontSize=8, leading=10, spaceAfter=3, fontName='Helvetica',
    textColor=HexColor('#666666'))

table_header_style = ParagraphStyle('TableHeader', parent=styles['Normal'],
    fontSize=8, leading=10, fontName='Helvetica-Bold',
    textColor=HexColor('#ffffff'))

table_cell_style = ParagraphStyle('TableCell', parent=styles['Normal'],
    fontSize=8, leading=10, fontName='Helvetica',
    textColor=HexColor('#1a1a2e'))

story = []

# Cover Page
story.append(Spacer(1, 3*cm))
story.append(Paragraph("DATA PROTECTION IMPACT ASSESSMENT", title_style))
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("UniHub — Verified Student Housing Platform", subtitle_style))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph("Kenya Student Housing Discovery Service", subtitle_style))
story.append(Spacer(1, 2*cm))

cover_info = [
    ["Project:", "UniHub — Verified Student Housing Platform (web application)"],
    ["Data Controller:", "UniHub Kenya (operating as UniHub)"],
    ["Assessment Conducted By:", "Shadrack Biwott, Founder & Developer — shadrack@unihub.ke"],
    ["Date of Assessment:", "15th January 2026"],
    ["Version:", "1.0 — Internal review prior to public launch"],
    ["Status:", "PRE-LAUNCH. No live student personal data collected. All development uses synthetic data."],
    ["Next Review:", "Before public launch; thereafter quarterly, and on any material change"],
    ["Legal Basis:", "Section 31, Data Protection Act No. 24 of 2019"],
    ["Guidance Note:", "ODPC Guidance Note on DPIA (Part 5 template)"],
    ["Course:", "KLS 126 — Data Science for Lawyers, Kabarak University"],
    ["Group:", "Group 8"],
]
cover_table = Table(cover_info, colWidths=[4.5*cm, 11.5*cm])
cover_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#4a4a6a')),
    ('TEXTCOLOR', (1, 0), (1, -1), HexColor('#1a1a2e')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(cover_table)

story.append(Spacer(1, 1.5*cm))
story.append(Paragraph("Prepared for: Kabarak University School of Law — CAT 3 Submission", small_style))
story.append(Paragraph("Group 8 Members:", small_style))

members = [
    "Maureen Jepyator Kibet (LAW/M/1184/05/26)",
    "Winnie Murugi Kihara (LAW/M/1288/05/26)",
    "Kipkoech Faith Jepkurui (LAW/M/1316/05/26)",
    "Abigael Waliaula (LAW/M/1428/05/26)",
    "Sugut Jemeli Michelle (LAW/M/1618/05/26)",
    "Franklin Ouma Ochieng (LAW/M/1190/05/26)",
    "Reagan Kibet Kugun (LAW/M/1575/05/26)",
    "Cynthia Kangogo (LAW/M/1554/05/25)",
    "John Wangengi Ngigi (LAW/M/1409/05/26)",
    "Mufutu Paul Mukania V W (LAW/M/1751/05/26)",
    "Shadrack Baraka Mwahanga (LAW/M/1716/05/26)",
    "Stancy Wanjiru Waweru (LAW/M/1332/05/26)",
    "Leiro Edwin Lesirito (LAW/M/1246/05/26)",
    "Titus Kimutai Chukor (LAW/M/0227/01/23)",
]
for m in members:
    story.append(Paragraph(f"• {m}", small_style))

story.append(PageBreak())

# Screening section
story.append(Paragraph("A. Screening — Is a DPIA Required?", heading1_style))
story.append(Paragraph(
    "Section 31 of the Data Protection Act (\"Act\") requires a DPIA where a processing operation "
    "is likely to result in a high risk to the rights and freedoms of a data subject. Paragraph 9(A) "
    "of the Data Protection Impact Assessment Guidance Note (\"Guidance Note\") sets out the criteria. "
    "The project has been screened against each criterion below.",
    body_style
))

story.append(Paragraph("Context framing the assessment:", body_style))
context_items = [
    "UniHub is a <b>discovery and contact platform</b>. It does not process tenancy agreements, collect rent, hold deposits, or manage property.",
    "<b>No mandatory accounts</b>. Students browse listings freely without signup. The only personal data a student voluntarily provides is when they choose to click a WhatsApp or email link to contact a landlord/agent — at which point the communication leaves UniHub's environment.",
    "<b>Landlord/agent onboarding</b> is initiated via a WhatsApp chat (external to the platform); UniHub collects no landlord personal data through the web application itself.",
    "<b>Map tiles</b> are fetched from keyless, public tile providers (OpenFreeMap, Esri World Imagery) with no authentication or user identification.",
    "<b>All media assets</b> (videos, images) are self-hosted and served from the same origin.",
]
for item in context_items:
    story.append(Paragraph(f"• {item}", bullet_style))

# Screening table
screening_data = [
    [Paragraph("<b>Criterion (Guidance Note, para. 9A)</b>", table_header_style),
     Paragraph("<b>Does it apply? — Assessment</b>", table_header_style)],
    ["I. Automated decision-making with legal or similar significant effect",
     "DOES NOT APPLY. The application makes no decisions about any student. No profiling, scoring, matching algorithms, or automated eligibility determinations exist."],
    ["II. Systematic monitoring",
     "DOES NOT APPLY. No tracking, analytics, cookies, fingerprinting, or behavioural monitoring is implemented. No location data is collected. Map interaction is anonymous and ephemeral."],
    ["III. Sensitive personal data or data of a private nature",
     "DOES NOT APPLY. No special category data (health, biometric, ethnic, religious, political, genetic, criminal) is processed. The platform handles only property listing data (public-facing) and voluntary contact initiations."],
    ["IV. Data processed on large volumes or large scales",
     "DOES NOT APPLY. Assessed against the four Guidance Note factors: (a) number of data subjects — potentially large (students), but <b>no personal data is collected from them</b> during browsing; (b) volume and range of data items — minimal (listing metadata only); (c) duration — listing data retained until manually removed; (d) geographical extent — Kenya-wide campus towns, but no personal data footprint."],
    ["V. Matching or combining datasets",
     "DOES NOT APPLY. No datasets are combined. Listing data is standalone. No integration with university records, credit bureaus, or identity systems."],
    ["VI. Data concerning vulnerable data subjects",
     "APPLIES IN A LIMITED SENSE. University students may face housing insecurity, but the platform does not exploit this. No data is collected from vulnerable subjects without consent; browsing is anonymous. The power imbalance (student vs. landlord) is mitigated by verification and direct contact transparency."],
    ["VII. Innovative use, or applying new technological or organisational solutions",
     "DOES NOT APPLY. The stack (React, TanStack, MapLibre, Vercel) is standard web technology. No AI, biometrics, blockchain, or novel processing."],
    ["VIII. Processing that prevents data subjects from exercising a right",
     "DOES NOT APPLY. Browsing requires no consent. Rights (access, rectification, erasure, objection) are trivial to exercise because almost no personal data is held."],
]

screening_table = Table(screening_data, colWidths=[5*cm, 11*cm])
screening_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(screening_table)

story.append(Paragraph(
    "<b>Conclusion of screening.</b> No criterion applies in full. One applies in a limited sense (VI). "
    "The processing is <b>not likely to result in a high risk</b> to the rights and freedoms of data subjects, "
    "and section 31 of the Act does not compel a DPIA for it. This assessment has nonetheless been carried out "
    "as a matter of <b>good practice</b>, to document the privacy posture before public launch, and is recorded "
    "below on the template at Part 5 of the Guidance Note.",
    body_style
))

story.append(PageBreak())

# Part 1: Description of processing operations
story.append(Paragraph("Part 1: Description of the Processing Operations", heading1_style))

story.append(Paragraph("1. Project Name", heading2_style))
story.append(Paragraph(
    "<b>UniHub</b> — Verified student housing discovery platform for Kenyan university campuses. "
    "Web application deployed on Vercel, built with TanStack Start (React 19, TypeScript).",
    body_style
))

story.append(Paragraph("2. Project Outline: What and Why", heading2_style))
story.append(Paragraph("<b>What the project aims to achieve:</b>", body_style))
story.append(Paragraph(
    "UniHub consolidates trusted student housing inventory into a single campus-centric platform. "
    "It solves the problem of scattered WhatsApp groups, unverified social media listings, fake photos, "
    "and risky advance deposits.",
    body_style
))
story.append(Paragraph("<b>Type of processing involved:</b>", body_style))
proc_items = [
    "<b>Listing publication</b>: Verified property data (title, location, category, price, deposit, images) published for browsing.",
    "<b>Anonymous browsing</b>: Students search and filter listings without accounts, cookies, or tracking.",
    "<b>Contact initiation</b>: Students tap WhatsApp or email links to contact landlords/agents directly. The communication occurs <b>outside</b> UniHub (in WhatsApp/email clients).",
    "<b>Landlord onboarding</b>: Interested landlords/agents start onboarding via a WhatsApp link (external). No landlord data is collected via the web form.",
    "<b>Map rendering</b>: Campus locations displayed via MapLibre GL using public tile servers (OpenFreeMap, Esri). No user location requested or stored.",
    "<b>Error reporting</b>: Client-side runtime errors captured and reported to server logs for debugging (no personal data included).",
]
for item in proc_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("<b>What the project does NOT do:</b>", body_style))
not_items = [
    "No user accounts, authentication, or profiles.",
    "No analytics, tracking pixels, cookies, localStorage (except ephemeral UI state).",
    "No payment processing, deposit holding, or tenancy management.",
    "No profiling, scoring, or matching algorithms.",
    "No third-party data sharing (WhatsApp/email are user-initiated external actions).",
    "No automated decision-making.",
]
for item in not_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("3. Who are the Targeted Data Subjects?", heading2_style))

subjects_data = [
    [Paragraph("<b>Data Subject Class</b>", table_header_style),
     Paragraph("<b>Description</b>", table_header_style),
     Paragraph("<b>Personal Data Processed</b>", table_header_style)],
    ["Students (browsers)", "University students seeking housing near Kenyan campuses",
     "None collected during browsing. Only if they voluntarily click WhatsApp/email links — at which point data enters the external app (WhatsApp/email), not UniHub."],
    ["Landlords / Agents (listers)", "Property owners/agents listing verified housing",
     "None collected via the web app. Onboarding starts via WhatsApp chat (external). Any data shared there is processed by WhatsApp/Meta, not UniHub."],
    ["Website visitors (general)", "Any person visiting the site",
     "None. No analytics, no cookies, no fingerprinting."],
]
subjects_table = Table(subjects_data, colWidths=[3.5*cm, 4.5*cm, 8*cm])
subjects_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(subjects_table)

story.append(Paragraph(
    "<b>Vulnerable groups / children:</b> The platform targets <b>university students</b> (typically 18+). "
    "No service is directed at children under 18. If a minor were to browse, no personal data is collected, "
    "so section 33 of the Act (children's data) is not engaged.",
    body_style
))

story.append(Paragraph("4. Information Flow — Collection, Use, and Deletion", heading2_style))

flow_data = [
    [Paragraph("<b>Aspect</b>", table_header_style), Paragraph("<b>Description</b>", table_header_style)],
    ["a) Source of data", "Listing data: provided by landlords/agents during off-platform WhatsApp onboarding, then manually entered by UniHub admins into the static data file (src/data/listings.ts). No automated ingestion. Student data: <b>not collected</b>."],
    ["b) Collection method", "Listings: manual admin entry after off-platform verification. Student contact: user-initiated click on mailto: or wa.me: links — handled by browser/OS, not UniHub."],
    ["c) Volume", "~6–50 live listings at any time (static dataset). Zero student personal data records. Zero landlord personal data records in the web app."],
    ["d) Storage location", "Listing data: in the application codebase (GitHub private repo) and deployed build on <b>Vercel (US East / iad1 region)</b>. No database. No CMS. Error logs: Vercel function logs (US)."],
    ["e) Retention period", "Listing data: retained until manually removed by admin (property rented, withdrawn, or expired). No fixed auto-expiry. Error logs: Vercel default retention (typically 30 days)."],
    ["f) Processing operations", "<b>Collection</b> (manual admin entry of verified listings), <b>storage</b> (static file in repo/build), <b>retrieval</b> (serving listings to browser), <b>display</b> (rendering in UI), <b>contact facilitation</b> (rendering WhatsApp/email links). <b>No</b> profiling, scoring, matching, automated decisions, or third-party disclosure."],
    ["g) Transfers", "<b>Listing data</b>: deployed to Vercel infrastructure in <b>US (iad1)</b>. This is a transfer outside Kenya. Safeguards: minimal dataset (no personal data), public-facing data only, no sensitive data, controller in Kenya. <b>Map tiles</b>: fetched from OpenFreeMap (global CDN) and Esri (US) — public, keyless, no auth. <b>Error logs</b>: Vercel US logs."],
    ["h) Individuals affected", "Potentially all university students in Kenya (hundreds of thousands), but <b>zero personal data collected</b> from them via the platform. Landlords/agents: dozens, but data collected off-platform via WhatsApp."],
]
flow_table = Table(flow_data, colWidths=[3*cm, 13*cm])
flow_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(flow_table)

story.append(Paragraph("5. Compliance with the Seven Data Protection Principles (section 25 of the Act)", heading2_style))

principles_data = [
    [Paragraph("<b>Principle</b>", table_header_style), Paragraph("<b>How the Processing Complies</b>", table_header_style)],
    ["a. Lawfulness, fairness, transparency",
     "<b>Lawfulness</b>: Listing data processed on <b>legitimate interest</b> (section 30(1)(f)) — data is business contact/property info, not private. Student browsing: <b>no processing of personal data</b> occurs. Contact links: user-initiated, no UniHub processing. <b>Fairness</b>: No hidden processing. <b>Transparency</b>: Privacy policy (/privacy) and terms (/terms) published; WhatsApp/email links clearly labelled."],
    ["b. Purpose limitation", "Data used <b>solely</b> for: publishing verified listings, enabling student discovery, facilitating direct contact. No secondary use, no analytics, no advertising, no resale."],
    ["c. Data minimisation", "<b>Extreme minimisation</b>: Zero student personal data. Zero landlord personal data in the web app. Listing data contains only property attributes (title, location, category, price, deposit, images) — all public-facing by design."],
    ["d. Accuracy", "Listings verified <b>before</b> publication (off-platform). Admins can update/remove listings by editing the data file and redeploying. Students can report suspicious listings via /contact (WhatsApp/email)."],
    ["e. Storage limitation", "Listings retained while active/verifiable. No personal data to expire. Admin process: periodic review (quarterly) to remove stale listings. Error logs: Vercel-managed retention."],
    ["f. Integrity and confidentiality",
     "<b>Access control</b>: Only admins with repo write access can modify listings. Vercel deployment protected by GitHub + Vercel auth (2FA). <b>Transport</b>: HTTPS everywhere (Vercel). <b>Error logs</b>: No personal data included (validated in error-capture.ts)."],
    ["g. Accountability", "This DPIA, the privacy policy, terms of service, the verification process (off-platform), the admin access controls, and the error handling design together constitute the accountability record."],
]
principles_table = Table(principles_data, colWidths=[3.5*cm, 12.5*cm])
principles_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(principles_table)

story.append(PageBreak())

# Part 2: Necessity and proportionality
story.append(Paragraph("Part 2: Necessity and Proportionality of the Processing in Relation to the Purpose", heading1_style))

story.append(Paragraph("1. Lawful Basis for Processing", heading2_style))
story.append(Paragraph("<b>Two distinct processing operations:</b>", body_style))

lawful_data = [
    [Paragraph("<b>Operation</b>", table_header_style),
     Paragraph("<b>Lawful Basis</b>", table_header_style),
     Paragraph("<b>Rationale</b>", table_header_style)],
    ["Publishing verified property listings",
     "Legitimate interest (section 30(1)(f) of the Act)",
     "The data is <b>business contact / property information</b> — not private life data. Landlords/agents <b>expect</b> their property details to be public. The controller's interest (helping students find housing) is legitimate, necessary, and balanced: data is minimal, public-facing, verified, and removable on request. No privacy intrusion."],
    ["Student browsing & contact initiation",
     "No personal data processed by UniHub",
     "Browsing is anonymous. Clicking WhatsApp/email opens an external app — the student <b>chooses</b> to disclose their identity to the landlord/agent. UniHub does not see, capture, or process that disclosure."],
]
lawful_table = Table(lawful_data, colWidths=[4*cm, 3.5*cm, 8.5*cm])
lawful_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(lawful_table)

story.append(Paragraph("2. Consent", heading2_style))
story.append(Paragraph(
    "<b>Not used as a lawful basis</b> for any UniHub processing operation.",
    body_style
))
consent_items = [
    "Students do not consent to data processing because <b>no data is collected</b>.",
    "Landlords/agents provide property details <b>voluntarily off-platform</b> (WhatsApp chat) with the explicit understanding they will be published. This is not \"consent\" under the Act for UniHub's processing — it is the data subject (landlord) making their own data public. UniHub's basis remains legitimate interest.",
]
for item in consent_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("3. Does the Processing Achieve the Purpose?", heading2_style))
story.append(Paragraph(
    "<b>Yes.</b> Students discover verified listings near campus. They compare prices, photos, categories. "
    "They contact landlords/agents directly via WhatsApp/email. No signup barrier, no paywall, no data harvest. "
    "The <b>verification step (off-platform)</b> is the critical trust mechanism: it happens before any data enters the web app.",
    body_style
))

story.append(Paragraph("4. Is There Another Way to Achieve the Same Outcome?", heading2_style))
options_data = [
    [Paragraph("<b>Option</b>", table_header_style), Paragraph("<b>Assessment</b>", table_header_style)],
    ["Current: Static verified listings + external contact", "<b>Selected.</b> Minimal data, maximum privacy, verifiable trust."],
    ["Full marketplace with accounts, messaging, payments", "Rejected: introduces personal data, auth, payments, higher risk, scope creep."],
    ["Aggregator scraping other sites", "Rejected: no verification, copyright issues, no trust."],
    ["Lead-generation model (sell student contacts)", "Rejected: violates purpose limitation, fairness, student trust."],
]
options_table = Table(options_data, colWidths=[5*cm, 11*cm])
options_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(options_table)

story.append(Paragraph("5. Data Quality and Minimisation", heading2_style))
quality_items = [
    "Listing schema fixed in TypeScript (SampleListing type). No dynamic fields.",
    "Pre-publication verification (off-platform) ensures accuracy.",
    "Admin-only edits via GitHub PR/review — audit trail via Git.",
    "No student data to quality-check.",
    "Quarterly review of live listings for staleness (Action A1).",
]
for item in quality_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("6. Information to Individuals", heading2_style))
info_items = [
    "<b>Students</b>: Privacy policy (/privacy), terms (/terms), clear labelling of external links (WhatsApp/email icons), no dark patterns.",
    "<b>Landlords/agents</b>: Informed during off-platform WhatsApp onboarding that property details will be published publicly on UniHub. Verification checklist explained. Right to request removal communicated.",
]
for item in info_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("7. Supporting Data Subject Rights", heading2_style))
rights_data = [
    [Paragraph("<b>Right</b>", table_header_style), Paragraph("<b>Mechanism</b>", table_header_style)],
    ["Access", "Students: no data held → trivial. Landlords: request via /contact (WhatsApp/email) → admin provides copy of their listing entry."],
    ["Rectification", "Landlord requests correction via /contact → admin edits data file → redeploy."],
    ["Erasure / Withdrawal", "Landlord requests removal via /contact → admin removes listing → redeploy. Student: no data to erase."],
    ["Objection", "Landlord objects to publication → same as erasure."],
    ["Portability", "Listing data is simple JSON — provided on request."],
    ["Automated decision-making", "None exists."],
]
rights_table = Table(rights_data, colWidths=[3*cm, 13*cm])
rights_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(rights_table)

story.append(Paragraph(
    "All requests handled by admin (founder) via the published contact channels. Target: actioned within 48 hours, well within Act timelines.",
    body_style
))

story.append(Paragraph("8. Controller and Processor Compliance", heading2_style))
story.append(Paragraph("<b>Controller:</b> UniHub Kenya (Shadrack Biwott).", body_style))
story.append(Paragraph("<b>Processors:</b>", body_style))
processor_items = [
    "<b>Vercel</b> (hosting, build, logs) — Data Processing Addendum in place (Vercel standard DPA).",
    "<b>GitHub</b> (source control) — DPA in place.",
    "<b>Map tile providers (OpenFreeMap, Esri)</b> — Public, keyless, no contract. No personal data sent.",
]
for item in processor_items:
    story.append(Paragraph(f"• {item}", bullet_style))
story.append(Paragraph("<b>No other processors.</b> No analytics, no CDN for user data, no third-party scripts.", body_style))

story.append(Paragraph("9. Parties Involved", heading2_style))
parties_data = [
    [Paragraph("<b>Party</b>", table_header_style), Paragraph("<b>Role</b>", table_header_style)],
    ["UniHub Kenya (Shadrack Biwott)", "Data controller — determines purpose, means, verification, publication."],
    ["Vercel Inc.", "Processor — hosting, serverless functions, logs (US infrastructure)."],
    ["GitHub Inc.", "Processor — source control, CI/CD (US infrastructure)."],
    ["OpenFreeMap / Esri", "<b>Not processors</b> — public tile servers, no personal data transmitted, no contractual relationship."],
    ["Students", "Data subjects (browsers) — <b>no personal data processed by UniHub</b>."],
    ["Landlords / Agents", "Data subjects (listers) — provide property data off-platform; UniHub publishes on legitimate interest."],
]
parties_table = Table(parties_data, colWidths=[4*cm, 12*cm])
parties_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(parties_table)

story.append(Paragraph("10. Safeguards for Processing", heading2_style))
safeguard_items = [
    "<b>Data minimisation by architecture</b>: No database, no auth, no forms, no cookies, no tracking.",
    "<b>Verification before publication</b>: Off-platform human check of property docs, ownership, agent identity.",
    "<b>Admin access control</b>: GitHub branch protection + Vercel 2FA. Only founder has deploy access.",
    "<b>HTTPS everywhere</b>: Enforced by Vercel.",
    "<b>Error capture sanitised</b>: error-capture.ts scrubs request bodies, headers, URLs before logging.",
    "<b>No third-party scripts</b>: Self-hosted fonts, icons, videos. No Google Fonts, no analytics, no CDNs for code.",
]
for item in safeguard_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("11. Safeguards for International Transfers", heading2_style))
story.append(Paragraph("<b>Transfers occur to:</b>", body_style))
transfer_items = [
    "<b>Vercel (US / iad1)</b> — listing data (public property info) + error logs (no personal data).",
    "<b>GitHub (US)</b> — source code + listing data file (private repo).",
    "<b>Map tile CDNs (global)</b> — public tile requests, no auth, no user IDs.",
]
for item in transfer_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("<b>Safeguards:</b>", body_style))
safeguard_transfer = [
    "<b>Data nature</b>: Only <b>public property listings</b> (business data) and <b>technical logs</b> (no personal data). No student personal data. No sensitive data.",
    "<b>Controller in Kenya</b>: UniHub Kenya is the controller; decisions made locally.",
    "<b>Processor DPAs</b>: Vercel and GitHub standard DPAs incorporate SCCs (Standard Contractual Clauses).",
    "<b>Adequacy</b>: US not adequate under Kenyan law; reliance on <b>SCCs + supplementary measures</b> (data minimisation, encryption in transit, access controls, no sensitive data).",
    "<b>Map tiles</b>: Not a \"transfer\" of personal data — no personal data in tile requests.",
    "<b>Direction sought</b>: This assessment notes the transfer and the safeguards. The controller accepts residual compliance exposure given the data nature (public business listings, no personal data). If ODPC guidance changes, a local hosting alternative (e.g., AWS Nairobi, local VPS) will be evaluated (Action A2).",
]
for item in safeguard_transfer:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(PageBreak())

# Part 3: Risk Assessment
story.append(Paragraph("Part 3: Assessment of the Risks to the Rights and Freedoms of Data Subjects", heading1_style))
story.append(Paragraph(
    "The Guidance Note assessment questions are answered below. Where the answer is \"Yes\", the entry states "
    "practical steps to identify and address the resulting privacy risk.",
    body_style
))

risk_q_data = [
    [Paragraph("<b>#</b>", table_header_style),
     Paragraph("<b>Question</b>", table_header_style),
     Paragraph("<b>Answer & Explanation</b>", table_header_style)],
    ["1", "Will the project involve the collection of new identifiable or potentially identifiable data about data subjects?",
     "<b>NO.</b> No new data about students is collected. Listing data (property details) is provided voluntarily by landlords/agents off-platform with the expectation of publication. No student identifiers, contact details, preferences, or behaviour are captured."],
    ["2", "Will the project compel data subjects to provide information about themselves, i.e. where they will have little awareness or choice?",
     "<b>NO.</b> Browsing requires <b>zero</b> information. Contacting a landlord is a <b>voluntary, user-initiated</b> click on an external link. The student chooses whether, when, and what to disclose to the landlord/agent. UniHub is not a party to that disclosure."],
    ["3", "Will identifiable information about data subjects be shared with other organizations or people who have not previously had routine access to the information?",
     "<b>NO, not by UniHub.</b> Students share their own details with landlords/agents <b>by their own act</b> (opening WhatsApp/email). UniHub does not intermediate, log, or forward that communication. Listing data is published <b>publicly</b> — that is its purpose."],
    ["4", "Are you using information about data subjects for a purpose it is not currently used for in a new way?",
     "<b>NO.</b> Property listings are used for their <b>intended purpose</b>: public advertisement to prospective tenants. No repurposing, profiling, or secondary use."],
    ["5", "Would the processing be likely to raise privacy concerns or expectations, i.e. include health, criminal, or other sensitive information?",
     "<b>NO.</b> No sensitive personal data. Property listings are commercial/public data. The only \"privacy concern\" is a student's housing search being visible — but <b>UniHub does not see or record the search</b>. The risk is in the external WhatsApp/email apps, not UniHub."],
    ["6", "Will the project require you to contact data subjects in ways they may find intrusive (telephone, email without prior consent)?",
     "<b>NO.</b> UniHub <b>never contacts students</b>. No email addresses, phone numbers, or push tokens are collected. The /contact page is for <b>students to contact UniHub</b>, not vice versa."],
    ["7", "Will the project result in decisions that can significantly impact data subjects (affect services received)?",
     "<b>NO.</b> No decisions are made by UniHub about students. No eligibility, scoring, matching, or allocation. The platform is a <b>passive directory</b>."],
    ["8", "Does the project involve new technology perceived as privacy-intrusive (biometrics, facial recognition, automated decision-making)?",
     "<b>NO.</b> Standard web stack. No AI/ML, no biometrics, no fingerprinting, no WebRTC, no camera/mic access. MapLibre GL is a standard map renderer."],
    ["9", "Is a service being transferred to a new supplier (re-contracted)?",
     "<b>NO.</b> No existing service replaced. Greenfield project."],
    ["10", "Is processing of identifiable data being moved to a new organization (same staff/processes)?",
     "<b>NO.</b> No prior processing of this data by another org. First publication."],
]
risk_q_table = Table(risk_q_data, colWidths=[0.8*cm, 5*cm, 10.2*cm])
risk_q_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(risk_q_table)

story.append(PageBreak())

# Part 4: Risk Register
story.append(Paragraph("Part 4: Measures Envisaged to Address the Risks — Risk Register", heading1_style))
story.append(Paragraph("<b>Data Controller:</b> UniHub Kenya", body_style))
story.append(Paragraph("<b>Project:</b> UniHub Verified Student Housing Platform", body_style))
story.append(Paragraph("<b>Risk Register Owner:</b> Shadrack Biwott, Founder", body_style))
story.append(Paragraph(
    "<b>Scoring:</b> Impact and Likelihood each rated 1 (very low) to 5 (very high); <b>Score = Impact × Likelihood</b>. "
    "Bands: 1–6 = Low · 8–12 = Medium · 15–25 = High.",
    body_style
))

risk_reg_data = [
    [Paragraph("<b>Risk ID</b>", table_header_style),
     Paragraph("<b>Risk Description</b>", table_header_style),
     Paragraph("<b>Consequence</b>", table_header_style),
     Paragraph("<b>Risk Owner</b>", table_header_style),
     Paragraph("<b>Current Controls</b>", table_header_style),
     Paragraph("<b>Impact</b>", table_header_style),
     Paragraph("<b>Likelihood</b>", table_header_style),
     Paragraph("<b>Score</b>", table_header_style),
     Paragraph("<b>Further Actions</b>", table_header_style),
     Paragraph("<b>Residual</b>", table_header_style)],

    ["R1",
     "Stale or inaccurate listing remains live — property rented, price changed, or landlord unreachable, but listing not removed/updated.",
     "Student wastes time, loses trust, possible financial harm if they act on stale info.",
     "Founder / Admin",
     "Verification before publication; admin-only edits via Git; quarterly review planned.",
     "2", "2", "4 (Low)",
     "(A1) Implement quarterly listing audit checklist: verify contact still works, price current, property available. Log review date in repo. Owner: Founder.",
     "1 (Low)"],

    ["R2",
     "International transfer of listing data to Vercel/GitHub (US) without documented SCC assessment.",
     "Regulatory non-compliance (Part VI of Act); potential ODPC enforcement.",
     "Founder",
     "Data is public business listings (no personal data); Vercel/GitHub DPAs include SCCs; controller in Kenya.",
     "2", "2", "4 (Low)",
     "(A2) Document transfer impact assessment: confirm data category (non-personal), SCCs in place, supplementary measures (minimisation, encryption, access control). File with this DPIA. Owner: Founder.",
     "1 (Low)"],

    ["R3",
     "Landlord/agent personal data inadvertently included in listing (e.g., phone number in description, ID photo in image).",
     "Disclosure of private data; privacy breach for landlord.",
     "Founder / Admin",
     "Verification checklist includes \"scrub personal contacts from description/images\"; only public-facing agent WhatsApp/email published in designated fields.",
     "2", "1", "2 (Low)",
     "(A3) Add explicit verification step: \"Confirm no personal IDs, private phones, or sensitive docs in images/description.\" Owner: Founder.",
     "1 (Low)"],

    ["R4",
     "Error logs accidentally capture personal data (e.g., URL with query params, request body from contact form).",
     "Unintended personal data in Vercel logs (US transfer).",
     "Founder",
     "error-capture.ts scrubs request bodies, headers, URLs. No contact form on site (only mailto:/wa.me: links).",
     "1", "1", "1 (Low)",
     "(A4) Add unit test for error sanitisation: confirm no query params, headers, or bodies with personal data reach logs. Owner: Founder.",
     "1 (Low)"],

    ["R5",
     "Map tile requests leak student IP/location to tile providers (OpenFreeMap, Esri).",
     "Passive tracking of student approximate location by third-party CDNs.",
     "Founder",
     "Tiles fetched client-side via MapLibre; no auth, no user ID, no cookies. Providers see only generic tile requests from Vercel IP or student IP. No UniHub linkage.",
     "2", "2", "4 (Low)",
     "(A5) Document: tile requests are standard web traffic; no personal data sent; student IP visible to CDN same as any website. Consider self-hosted vector tiles if ODPC guidance tightens. Owner: Founder.",
     "2 (Low)"],

    ["R6",
     "Scope creep: future features add personal data processing (accounts, favourites, messages, payments) without DPIA update.",
     "Unassessed high-risk processing introduced silently.",
     "Founder",
     "Current codebase has no auth, no DB, no forms. Architecture documented. DPIA exists as baseline.",
     "3", "2", "6 (Low)",
     "(A6) <b>Governance gate</b>: Any PR adding auth, database, forms, analytics, payments, or user accounts <b>must</b> trigger DPIA review/update before merge. Document in CONTRIBUTING.md. Owner: Founder.",
     "2 (Low)"],

    ["R7",
     "Vercel/GitHub account compromise — attacker modifies listings, injects malicious links, or exfiltrates repo.",
     "Integrity loss; potential phishing via fake listings; reputational damage.",
     "Founder",
     "2FA on GitHub & Vercel; branch protection; only founder has deploy access; private repo.",
     "3", "1", "3 (Low)",
     "(A7) Enable GitHub Advanced Security (code scanning, secret scanning). Rotate Vercel tokens annually. Owner: Founder.",
     "2 (Low)"],

    ["R8",
     "Student clicks malicious WhatsApp/email link (link spoofing, landlord impersonation).",
     "Student harmed off-platform; UniHub brand trust damaged.",
     "Founder",
     "Verification checks landlord identity & contact before listing. Links rendered as wa.me/ and mailto: — student sees destination before clicking.",
     "2", "2", "4 (Low)",
     "(A8) Add UI hint: \"Verify the agent's name matches the listing before sending money.\" Consider displaying verified badge next to contact links. Owner: Founder.",
     "1 (Low)"],

    ["R9",
     "Child (under 18) uses platform — though no data collected, service may not be age-appropriate.",
     "Potential section 33 issue if any data inadvertently captured.",
     "Founder",
     "No data collected from anyone. Terms state 18+. University student target demographic.",
     "1", "1", "1 (Low)",
     "(A9) Add age disclaimer in footer/terms: \"For users 18+.\" Owner: Founder.",
     "1 (Low)"],

    ["R10",
     "Data subject rights request not actioned in time (landlord requests listing removal).",
     "Denial of right; complaint to ODPC.",
     "Founder",
     "Single contact point (/contact); simple static file edit + deploy (< 1 hour); no complex backend.",
     "1", "1", "1 (Low)",
     "(A10) Document SLA: \"Listing removal within 24 hours of verified request.\" Add to privacy policy. Owner: Founder.",
     "1 (Low)"],
]

risk_reg_table = Table(risk_reg_data, colWidths=[0.7*cm, 2.2*cm, 2*cm, 1.5*cm, 2.2*cm, 0.8*cm, 0.8*cm, 0.8*cm, 2.5*cm, 1*cm])
risk_reg_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
    ('FONTSIZE', (0, 0), (-1, -1), 7),
]))
story.append(risk_reg_table)

story.append(Paragraph(
    "<b>Summary:</b> Ten risks identified. All score <b>Low (1–6)</b> with current controls. Highest initial score: <b>4</b>. "
    "After actions, all fall to <b>1–2</b>. No risk is Medium or High. No referral to ODPC required.",
    body_style
))

story.append(PageBreak())

# Part 5: Sign-off and record outcomes
story.append(Paragraph("Part 5: Sign-off and Record Outcomes", heading1_style))

story.append(Paragraph("Outcome of the Assessment", heading2_style))
story.append(Paragraph(
    "<b>The assessment concludes that the processing is not likely to result in a high risk to the rights "
    "and freedoms of data subjects, and that the project may proceed to public launch once the conditions "
    "below are satisfied.</b>",
    body_style
))
story.append(Paragraph("<b>Reasoning:</b>", body_style))
reasoning_items = [
    "UniHub's core processing — publishing verified property listings — involves <b>only public business data</b> (property attributes, public contact channels).",
    "<b>Zero student personal data</b> is collected, stored, or processed by UniHub. Browsing is anonymous; contact is user-initiated and external.",
    "Landlord/agent data is provided <b>voluntarily off-platform</b> with the expectation of publication. UniHub's lawful basis is <b>legitimate interest</b>, supported by verification, minimisation, and removability.",
    "<b>International transfers</b> (Vercel, GitHub) involve only this non-personal listing data and technical logs. Safeguards (SCCs, minimisation, no sensitive data) are documented.",
    "<b>All risks score Low</b>. The highest residual risk after actions is <b>2/25</b>.",
    "The architecture <b>by design</b> prevents scope creep into personal data processing (no auth, no DB, no forms, no analytics).",
]
for item in reasoning_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("<b>Conditions for launch:</b>", body_style))
launch_items = [
    "Actions <b>A1–A10</b> at Part 4 are complete (quarterly audit checklist documented, transfer assessment filed, verification checklist updated, error sanitisation tested, tile risk documented, governance gate in CONTRIBUTING.md, GitHub security enabled, UI hint added, age disclaimer added, removal SLA published).",
    "Privacy policy (<b>/privacy</b>) and terms (<b>/terms</b>) expanded from stubs to full documents reflecting this DPIA.",
    "Vercel DPA and GitHub DPA confirmed current and filed.",
    "This DPIA reviewed and approved by the controller (Founder).",
]
for item in launch_items:
    story.append(Paragraph(f"• {item}", bullet_style))

story.append(Paragraph("Submission to the Office of the Data Protection Commissioner", heading2_style))
story.append(Paragraph(
    "Section 31 of the Act requires a DPIA where processing is likely to result in a high risk, and "
    "paragraph 9(B) of the Guidance Note provides that a DPIA is to be submitted <b>sixty days before "
    "processing begins</b>.",
    body_style
))
story.append(Paragraph(
    "<b>This assessment concludes that the processing is not likely to result in a high risk. "
    "No obligation to submit therefore arises, and the sixty-day period does not constrain the "
    "commencement of the project.</b> The assessment has been carried out and recorded as a matter of "
    "good practice.",
    body_style
))
story.append(Paragraph(
    "If the controller's view of the transfer question (Risk R2) changes, or if any future feature "
    "introduces high-risk processing (per Risk R6 governance gate), the Guidance Note directs that the "
    "ODPC be consulted before that processing proceeds. That course will be followed.",
    body_style
))

story.append(Paragraph("Approval and Sign-off", heading2_style))

signoff_data = [
    [Paragraph("<b>Item</b>", table_header_style), Paragraph("<b>Entry</b>", table_header_style)],
    ["Measures approved by", "_________________________________ (Shadrack Biwott, Founder)"],
    ["Date", "_________________________________"],
    ["Residual risks approved by", "_________________________________ (Shadrack Biwott, Founder)"],
    ["Date", "_________________________________"],
    ["DPO advice provided", "N/A — No DPO appointed (not mandatory for this scale). Controller self-assessment."],
    ["Date", "_________________________________"],
    ["Summary of DPO advice", "N/A"],
    ["DPO advice accepted or overruled by", "N/A"],
    ["Date", "_________________________________"],
    ["Consultation responses reviewed by", "Shadrack Biwott, Founder. No direct data subject consultation conducted pre-launch (no personal data collected). Student/landlord feedback will be sought post-launch via /contact channels; any concern bearing on this assessment will be recorded and the DPIA revised."],
    ["Consultation with ODPC — response", "Not required. To be initiated if future processing meets section 31 threshold or if ODPC guidance on international transfers of non-personal business data changes."],
    ["This DPIA will be kept under review by", "Shadrack Biwott, Founder. <b>Review points:</b> before public launch; on any change to dataset, platform, purpose, or processors; quarterly (aligned with listing audit); on any data subject complaint or ODPC inquiry."],
]
signoff_table = Table(signoff_data, colWidths=[5*cm, 11*cm])
signoff_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#fafafa'), HexColor('#ffffff')]),
]))
story.append(signoff_table)

story.append(Spacer(1, 1*cm))
story.append(Paragraph("Prepared and submitted by:", body_style))
story.append(Spacer(1, 1*cm))
story.append(Paragraph("_________________________________", body_style))
story.append(Paragraph("<b>Shadrack Baraka</b> — Founder & Developer, UniHub Kenya", body_style))
story.append(Paragraph("<b>Date:</b> 15th January 2026", body_style))

story.append(Spacer(1, 1*cm))
story.append(Paragraph("Annexes (referenced, maintained separately)", heading2_style))
annexes = [
    "1. Verification Checklist — Off-platform landlord/agent verification steps (property docs, ownership, agent ID, contact confirmation, personal data scrub).",
    "2. Quarterly Listing Audit Template — Checklist for Action A1.",
    "3. International Transfer Assessment — Documented SCC + supplementary measures analysis for Vercel/GitHub (Action A2).",
    "4. Error Sanitisation Test Cases — Unit tests for error-capture.ts (Action A4).",
    "5. Governance Gate Procedure — DPIA trigger criteria for future features (Action A6).",
    "6. GitHub Advanced Security Configuration — Screenshot/config export (Action A7).",
    "7. Privacy Policy (Full) — Expanded /privacy page content.",
    "8. Terms of Service (Full) — Expanded /terms page content.",
]
for a in annexes:
    story.append(Paragraph(f"• {a}", bullet_style))

story.append(Spacer(1, 1*cm))
story.append(Paragraph(
    "*This DPIA follows the template at Part 5 of the Office of the Data Protection Commissioner "
    "Guidance Note on Data Protection Impact Assessment, and the structure of the KabarakAttend DPIA "
    "(KLS 126, September 2026) as a Kenyan higher-education sector reference.*",
    small_style
))

doc.build(story)
print(f"DPIA PDF created at {output_dir}/Group8_CAT3_DPIA.pdf")