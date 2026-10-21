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
    os.path.join(output_dir, "Group8_CAT2_Consent.pdf"),
    pagesize=A4,
    rightMargin=2*cm, leftMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle('CustomTitle', parent=styles['Title'],
    fontSize=18, leading=22, spaceAfter=6, alignment=TA_CENTER,
    textColor=HexColor('#1a1a2e'), fontName='Helvetica-Bold')

subtitle_style = ParagraphStyle('CustomSubtitle', parent=styles['Normal'],
    fontSize=11, leading=14, spaceAfter=12, alignment=TA_CENTER,
    textColor=HexColor('#4a4a6a'), fontName='Helvetica')

heading1_style = ParagraphStyle('Heading1Custom', parent=styles['Heading1'],
    fontSize=14, leading=18, spaceBefore=16, spaceAfter=8,
    textColor=HexColor('#1a1a2e'), fontName='Helvetica-Bold')

heading2_style = ParagraphStyle('Heading2Custom', parent=styles['Heading2'],
    fontSize=12, leading=16, spaceBefore=12, spaceAfter=6,
    textColor=HexColor('#2d2d5e'), fontName='Helvetica-Bold')

body_style = ParagraphStyle('BodyCustom', parent=styles['Normal'],
    fontSize=10, leading=14, spaceAfter=6, alignment=TA_JUSTIFY,
    fontName='Helvetica')

bullet_style = ParagraphStyle('BulletCustom', parent=styles['Normal'],
    fontSize=10, leading=14, spaceAfter=4, leftIndent=20, bulletIndent=8,
    fontName='Helvetica')

checkbox_style = ParagraphStyle('CheckboxCustom', parent=styles['Normal'],
    fontSize=10, leading=14, spaceAfter=4, leftIndent=20, bulletIndent=8,
    fontName='Helvetica')

small_style = ParagraphStyle('SmallCustom', parent=styles['Normal'],
    fontSize=9, leading=12, spaceAfter=4, fontName='Helvetica',
    textColor=HexColor('#666666'))

story = []

# Group members
members = [
    ("Maureen Jepyator Kibet", "LAW/M/1184/05/26"),
    ("Winnie Murugi Kihara", "LAW/M/1288/05/26"),
    ("Kipkoech Faith Jepkurui", "LAW/M/1316/05/26"),
    ("Abigael Waliaula", "LAW/M/1428/05/26"),
    ("Sugut Jemeli Michelle", "LAW/M/1618/05/26"),
    ("Franklin Ouma Ochieng", "LAW/M/1190/05/26"),
    ("Reagan Kibet Kugun", "LAW/M/1575/05/26"),
    ("Cynthia Kangogo", "LAW/M/1554/05/25"),
    ("John Wangengi Ngigi", "LAW/M/1409/05/26"),
    ("Mufutu Paul Mukania V W", "LAW/M/1751/05/26"),
    ("Shadrack Baraka Mwahanga", "LAW/M/1716/05/26"),
    ("Stancy Wanjiru Waweru", "LAW/M/1332/05/26"),
    ("Leiro Edwin Lesirito", "LAW/M/1246/05/26"),
]

# Cover Page
story.append(Spacer(1, 3*cm))
story.append(Paragraph("UNIHUB", title_style))
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("Consent Form for Landlord Registration", subtitle_style))
story.append(Spacer(1, 2*cm))

cover_info = [
    ["Project:", "UniHub — Verified Student Housing Platform"],
    ["Course:", "KLS 126 — Data Science for Lawyers"],
    ["Institution:", "Kabarak University, School of Law"],
    ["Group Number:", "Group 8"],
    ["Date:", "21st October 2026"],
    ["Version:", "1.0"],
]
cover_table = Table(cover_info, colWidths=[4*cm, 10*cm])
cover_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#4a4a6a')),
    ('TEXTCOLOR', (1, 0), (1, -1), HexColor('#1a1a2e')),
    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(cover_table)

story.append(Spacer(1, 2*cm))
story.append(Paragraph("Group Members", heading2_style))
story.append(Spacer(1, 0.5*cm))

member_table_data = [["Name", "Registration Number"]]
for name, reg in members:
    member_table_data.append([name, reg])

member_table = Table(member_table_data, colWidths=[8*cm, 6*cm])
member_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
story.append(member_table)

story.append(Spacer(1, 2*cm))
story.append(Paragraph("Signatures", heading2_style))
story.append(Spacer(1, 1*cm))

sig_table_data = [
    ["Member Name", "Registration No.", "Signature", "Date"],
]
for name, reg in members:
    sig_table_data.append([name, reg, "", ""])

sig_table = Table(sig_table_data, colWidths=[5*cm, 4*cm, 4*cm, 3*cm])
sig_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#f0f0f5')),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(sig_table)

story.append(PageBreak())

# Section 1: About UniHub
story.append(Paragraph("1. About UniHub", heading1_style))
story.append(Paragraph(
    "UniHub is a free online platform that helps university students in Kenya find verified housing "
    "near their campuses and contact landlords and agents directly. The platform lists hostels, "
    "bedsitters, single rooms, studios, and shared apartments near campus towns including Nairobi, "
    "Juja, Kahawa, Madaraka, Thika, Kesses, Njoro, and Nakuru. Students browse without creating "
    "an account. Landlords and agents register, submit property listings, and publish them once "
    "UniHub has approved them.",
    body_style
))
story.append(Paragraph(
    "UniHub is a directory and contact service only. It does not own or manage any property, "
    "collect rent or deposits, or prepare tenancy agreements. Verification by UniHub is a check of "
    "the details submitted to it; it is not a warranty that a property is available or that any "
    "landlord, agent, or student will act honestly.",
    body_style
))
story.append(Paragraph(
    "This form explains what personal data UniHub collects, why it is collected, where it is "
    "processed, and what rights you have. It asks for your consent where UniHub needs it. A "
    "student who only browses UniHub provides no personal data and does not need to sign this form.",
    body_style
))

# Section 2: Key information at a glance
story.append(Paragraph("2. Key Information at a Glance", heading1_style))

key_info = [
    ["Data Controller", "UniHub Kenya (operating as UniHub)"],
    ["Contact for Rights Requests", "hello@unihub.ke | WhatsApp: +254 700 000 000"],
    ["Data Protection Officer", "Shadrack Baraka (Founder) — shadrack@unihub.ke"],
    ["Lawful Basis", "Legitimate Interest (section 30(1)(f) DPA 2019) for listings; Consent for landlord registration"],
    ["Data Retention", "Listings: until removed by admin. Landlord profile: until account closure or withdrawal."],
    ["International Transfers", "Vercel (US / iad1), GitHub (US) — SCCs + supplementary measures in place"],
    ["Special Category Data", "None processed"],
    ["Automated Decisions", "None"],
]
key_table = Table(key_info, colWidths=[5*cm, 11*cm])
key_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#4a4a6a')),
    ('TEXTCOLOR', (1, 0), (1, -1), HexColor('#1a1a2e')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#e0e0e0')),
    ('BACKGROUND', (0, 0), (-1, -1), HexColor('#fafafa')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(key_table)

# Section 3: What personal data is collected
story.append(Paragraph("3. What Personal Data Is Collected", heading1_style))
story.append(Paragraph("UniHub collects the following personal data only when you register as a landlord or agent:", body_style))

data_items = [
    "Full name",
    "Email address",
    "Phone number and WhatsApp number (for student contact)",
    "National ID or passport number (for identity verification only — never shown publicly)",
    "Business or agency name (optional)",
    "Campuses/areas you serve and estimated number of properties",
    "Any note you add for the review team",
    "Consent record (date/time of consent and policy version)",
    "Property listings you publish: title, location, category, price, deposit, photos, amenities",
    "Basic technical logs from hosting provider (request times, errors) — no personal data",
]
for item in data_items:
    story.append(Paragraph(f"☐  {item}", bullet_style))

story.append(Paragraph(
    "<b>Students who only browse UniHub provide no personal data.</b> No accounts, no cookies, "
    "no analytics, no tracking. Contact links (WhatsApp/email) open external apps — UniHub does "
    "not see or capture that communication.",
    body_style
))

# Section 4: Purpose and lawful basis
story.append(Paragraph("4. Purpose and Lawful Basis", heading1_style))

purpose_data = [
    ["Purpose", "Personal Data", "Lawful Basis (DPA 2019)"],
    ["Verify landlord/agent identity before publishing", "Name, email, phone, WhatsApp, national ID, business name", "Consent (section 32) + Legitimate Interest (section 30(1)(f))"],
    ["Publish property listings for student discovery", "Listing details (no personal data — property attributes only)", "Legitimate Interest (section 30(1)(f))"],
    ["Enable student contact via WhatsApp/email", "Landlord's public WhatsApp/email (provided by landlord)", "Legitimate Interest (section 30(1)(f))"],
    ["Administer landlord accounts and status", "Registration data, consent record, review notes", "Consent (section 32)"],
    ["Respond to data subject rights requests", "Account data, listing data", "Legal obligation (section 26)"],
    ["Platform security and error debugging", "Technical logs (no personal data)", "Legitimate Interest (section 30(1)(f))"],
]
purpose_table = Table(purpose_data, colWidths=[5*cm, 5.5*cm, 5.5*cm])
purpose_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 8.5),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(purpose_table)

# Section 5: Data sharing and international transfers
story.append(Paragraph("5. Data Sharing and International Transfers", heading1_style))
story.append(Paragraph(
    "UniHub does not sell, rent, or share your personal data with third parties for marketing. "
    "The following processors handle data on UniHub's behalf:",
    body_style
))

processor_data = [
    ["Processor", "Role", "Location", "Safeguards"],
    ["Vercel Inc.", "Hosting, serverless functions, logs", "US (iad1)", "Standard DPA with SCCs; data is public business listings only"],
    ["GitHub Inc.", "Source control, CI/CD", "US", "Standard DPA with SCCs; private repo, 2FA enforced"],
    ["OpenFreeMap / Esri", "Map tiles (public, keyless)", "Global CDN", "Not processors — no personal data transmitted"],
]
proc_table = Table(processor_data, colWidths=[3.5*cm, 4*cm, 3*cm, 5.5*cm])
proc_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(proc_table)

story.append(Paragraph(
    "<b>Your WhatsApp number and business email are published on your listings</b> so students can "
    "contact you directly. This is by design — UniHub facilitates contact but does not intermediate. "
    "Your national ID is <b>never</b> shown to students or published.",
    body_style
))

# Section 6: Retention
story.append(Paragraph("6. Data Retention", heading1_style))
retention_items = [
    "Landlord profile and listings: retained while your account is active and listings are current. "
    "Removed within 24 hours of a verified removal request from you.",
    "Consent record: retained for the life of the account + 2 years for compliance evidence.",
    "Technical logs: managed by Vercel (typically 30 days). No personal data included.",
    "You may request deletion at any time by emailing hello@unihub.ke.",
]
for item in retention_items:
    story.append(Paragraph(f"•  {item}", bullet_style))

# Section 7: Your rights
story.append(Paragraph("7. Your Rights (Data Protection Act, 2019 — Sections 26, 29–32)", heading1_style))
rights = [
    "Right to be informed — this form and the privacy policy at /privacy",
    "Right of access — request a copy of your data via hello@unihub.ke",
    "Right to rectification — request correction of inaccurate data",
    "Right to erasure — request account closure and data deletion",
    "Right to object — object to processing based on legitimate interest",
    "Right to data portability — receive your listing data in JSON format",
    "Right to withdraw consent — at any time, without penalty (see Section 4)",
    "Right to complain to the Office of the Data Protection Commissioner (ODPC)",
]
for right in rights:
    story.append(Paragraph(f"☐  {right}", bullet_style))

# Section 8: Consent declaration
story.append(Paragraph("8. Consent Declaration", heading1_style))
story.append(Paragraph(
    "Please read each statement carefully and tick every box that applies to you.",
    body_style
))

consent_statements = [
    "I confirm that I am 18 years of age or older.",
    "I have read and understood this consent form and the UniHub Privacy Policy.",
    "I consent to UniHub collecting and processing my personal data as described in Section 3 for the purposes in Section 4.",
    "I consent to my WhatsApp number and business email being published on my property listings so students can contact me directly.",
    "I confirm that the information I provide (identity, contact details, property details) is accurate and I will keep it updated.",
    "I understand that my national ID/passport number is used for verification only and will never be shown publicly.",
    "I understand that I may withdraw my consent at any time by emailing hello@unihub.ke, which will close my account and remove my listings.",
    "I understand that my data is processed on servers outside Kenya (Vercel in the US) under Standard Contractual Clauses.",
    "I have had the opportunity to ask questions and they have been answered to my satisfaction.",
]
for i, stmt in enumerate(consent_statements, 1):
    story.append(Paragraph(f"☐  {i}. {stmt}", checkbox_style))

story.append(Spacer(1, 1*cm))

# Signature block
story.append(Paragraph("Signature", heading2_style))
sig_block = [
    ["Landlord/Agent Name:", "________________________________________", "Date:", "______________"],
    ["Signature:", "________________________________________", "", ""],
    ["", "", "", ""],
    ["For UniHub (Tutor/Reviewer):", "________________________________________", "Date:", "______________"],
    ["Signature:", "________________________________________", "", ""],
]
sig_block_table = Table(sig_block, colWidths=[4*cm, 7*cm, 2*cm, 3*cm])
sig_block_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LINEBELOW', (1, 0), (1, 0), 1, HexColor('#000000')),
    ('LINEBELOW', (1, 1), (1, 1), 1, HexColor('#000000')),
    ('LINEBELOW', (3, 0), (3, 0), 1, HexColor('#000000')),
    ('LINEBELOW', (1, 3), (1, 3), 1, HexColor('#000000')),
    ('LINEBELOW', (1, 4), (1, 4), 1, HexColor('#000000')),
]))
story.append(sig_block_table)

story.append(Spacer(1, 1*cm))
story.append(Paragraph(
    "Version 1.0  |  KLS 126 UniHub Project  |  Data Protection Act 2019 Compliant  |  "
    "Review before public launch; quarterly thereafter",
    small_style
))

doc.build(story)
print(f"Consent form created at {output_dir}/Group8_CAT2_Consent.pdf")