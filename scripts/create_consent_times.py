from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Register Times New Roman
times_path = "C:/Windows/Fonts/times.ttf"
times_bold_path = "C:/Windows/Fonts/timesbd.ttf"
times_italic_path = "C:/Windows/Fonts/timesi.ttf"
times_bold_italic_path = "C:/Windows/Fonts/timesbi.ttf"

for p, name in [(times_path, "TimesNewRoman"), (times_bold_path, "TimesNewRoman-Bold"),
                (times_italic_path, "TimesNewRoman-Italic"), (times_bold_italic_path, "TimesNewRoman-BoldItalic")]:
    if os.path.exists(p):
        pdfmetrics.registerFont(TTFont(name, p))

output_dir = "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials"
os.makedirs(output_dir, exist_ok=True)

doc = SimpleDocTemplate(
    os.path.join(output_dir, "Group1_CAT2_Consent.pdf"),
    pagesize=A4,
    rightMargin=2.5*cm, leftMargin=2.5*cm,
    topMargin=2.5*cm, bottomMargin=2.5*cm
)

styles = getSampleStyleSheet()

# Color palette
DARK_NAVY = HexColor('#1B1B3A')
MID_BLUE = HexColor('#2D3E6B')
ACCENT_GOLD = HexColor('#C8A951')
LIGHT_GREY = HexColor('#F5F5F0')
MED_GREY = HexColor('#E8E8E0')
TEXT_DARK = HexColor('#2C2C2C')
TEXT_MED = HexColor('#4A4A4A')

title_style = ParagraphStyle('CustomTitle', parent=styles['Title'],
    fontSize=22, leading=28, spaceAfter=8, alignment=TA_CENTER,
    textColor=DARK_NAVY, fontName='TimesNewRoman-Bold', tracking=2)

subtitle_style = ParagraphStyle('CustomSubtitle', parent=styles['Normal'],
    fontSize=12, leading=16, spaceAfter=6, alignment=TA_CENTER,
    textColor=MID_BLUE, fontName='TimesNewRoman-Italic')

heading1_style = ParagraphStyle('Heading1Custom', parent=styles['Heading1'],
    fontSize=15, leading=20, spaceBefore=18, spaceAfter=10,
    textColor=DARK_NAVY, fontName='TimesNewRoman-Bold',
    borderWidth=0, borderPadding=0)

heading2_style = ParagraphStyle('Heading2Custom', parent=styles['Heading2'],
    fontSize=13, leading=18, spaceBefore=14, spaceAfter=8,
    textColor=MID_BLUE, fontName='TimesNewRoman-Bold')

heading3_style = ParagraphStyle('Heading3Custom', parent=styles['Heading3'],
    fontSize=11, leading=15, spaceBefore=10, spaceAfter=6,
    textColor=TEXT_DARK, fontName='TimesNewRoman-Bold')

body_style = ParagraphStyle('BodyCustom', parent=styles['Normal'],
    fontSize=11, leading=16, spaceAfter=8, alignment=TA_JUSTIFY,
    fontName='TimesNewRoman', textColor=TEXT_DARK,
    firstLineIndent=0)

body_indent_style = ParagraphStyle('BodyIndentCustom', parent=body_style,
    leftIndent=1.5*cm, firstLineIndent=0)

bullet_style = ParagraphStyle('BulletCustom', parent=styles['Normal'],
    fontSize=11, leading=16, spaceAfter=5, leftIndent=1.5*cm, bulletIndent=0.5*cm,
    fontName='TimesNewRoman', textColor=TEXT_DARK)

checkbox_style = ParagraphStyle('CheckboxCustom', parent=styles['Normal'],
    fontSize=11, leading=17, spaceAfter=5, leftIndent=1.5*cm, bulletIndent=0.5*cm,
    fontName='TimesNewRoman', textColor=TEXT_DARK)

small_style = ParagraphStyle('SmallCustom', parent=styles['Normal'],
    fontSize=9, leading=12, spaceAfter=4, fontName='TimesNewRoman',
    textColor=TEXT_MED, alignment=TA_CENTER)

table_header_style = ParagraphStyle('TableHeader', parent=styles['Normal'],
    fontSize=10, leading=13, fontName='TimesNewRoman-Bold',
    textColor=white, alignment=TA_CENTER)

table_cell_style = ParagraphStyle('TableCell', parent=styles['Normal'],
    fontSize=10, leading=13, fontName='TimesNewRoman',
    textColor=TEXT_DARK, alignment=TA_LEFT)

table_cell_center = ParagraphStyle('TableCellCenter', parent=table_cell_style,
    alignment=TA_CENTER)

footer_style = ParagraphStyle('FooterCustom', parent=styles['Normal'],
    fontSize=9, leading=12, fontName='TimesNewRoman-Italic',
    textColor=TEXT_MED, alignment=TA_CENTER)

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

# ===== COVER PAGE =====
story.append(Spacer(1, 3.5*cm))

# Decorative line
story.append(HRFlowable(width="60%", thickness=2, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0, hAlign='CENTER'))

story.append(Paragraph("UNIHUB", title_style))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph("Consent Form for Landlord Registration", subtitle_style))
story.append(Spacer(1, 0.2*cm))
story.append(Paragraph("Verified Student Housing Platform", ParagraphStyle('SubSub', parent=subtitle_style, fontSize=11, textColor=TEXT_MED)))

story.append(Spacer(1, 0.5*cm))
story.append(HRFlowable(width="40%", thickness=1, color=ACCENT_GOLD, spaceAfter=18, spaceBefore=0, hAlign='CENTER'))

# Document info table
cover_info = [
    ["Project", "UniHub: Verified Student Housing Platform"],
    ["Course", "KLS 126: Data Science for Lawyers"],
    ["Institution", "Kabarak University, School of Law"],
    ["Group", "Group 1"],
    ["Date", "21st October 2026"],
    ["Version", "1.0"],
]
cover_table = Table(cover_info, colWidths=[4*cm, 11*cm])
cover_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'TimesNewRoman'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('FONTNAME', (0, 0), (0, -1), 'TimesNewRoman-Bold'),
    ('TEXTCOLOR', (0, 0), (0, -1), MID_BLUE),
    ('TEXTCOLOR', (1, 0), (1, -1), TEXT_DARK),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LINEBELOW', (0, 0), (-1, -2), 0.5, MED_GREY),
]))
story.append(cover_table)

story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="40%", thickness=1, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0, hAlign='CENTER'))

# Group Members Section
story.append(Paragraph("Group Members", heading2_style))
story.append(Spacer(1, 0.5*cm))

member_table_data = [
    [Paragraph("<b>Name</b>", table_header_style), Paragraph("<b>Registration Number</b>", table_header_style)]
]
for name, reg in members:
    member_table_data.append([Paragraph(name, table_cell_style), Paragraph(reg, table_cell_center)])

member_table = Table(member_table_data, colWidths=[9*cm, 6*cm])
member_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('FONTNAME', (0, 0), (-1, 0), 'TimesNewRoman-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
]))
story.append(member_table)

story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="40%", thickness=1, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0, hAlign='CENTER'))

# Signatures on cover
story.append(Paragraph("Signatures", heading2_style))
story.append(Spacer(1, 0.8*cm))

sig_table_data = [
    [Paragraph("<b>Member Name</b>", table_header_style), Paragraph("<b>Registration No.</b>", table_header_style),
     Paragraph("<b>Signature</b>", table_header_style), Paragraph("<b>Date</b>", table_header_style)],
]
for name, reg in members:
    sig_table_data.append([
        Paragraph(name, table_cell_style),
        Paragraph(reg, table_cell_center),
        Paragraph("", table_cell_style),
        Paragraph("", table_cell_center)
    ])

sig_table = Table(sig_table_data, colWidths=[5.5*cm, 3.5*cm, 4*cm, 3*cm])
sig_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('FONTNAME', (0, 0), (-1, 0), 'TimesNewRoman-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9.5),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
]))
story.append(sig_table)

story.append(PageBreak())

# ===== TABLE OF CONTENTS =====
story.append(Paragraph("Table of Contents", heading1_style))
story.append(Spacer(1, 0.5*cm))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0))

toc_items = [
    ("1.", "About UniHub", "3"),
    ("2.", "Key Information at a Glance", "3"),
    ("3.", "What Personal Data Is Collected", "4"),
    ("4.", "Purpose and Lawful Basis", "5"),
    ("5.", "Data Sharing and International Transfers", "6"),
    ("6.", "Data Retention", "7"),
    ("7.", "Your Rights", "7"),
    ("8.", "Consent Declaration", "8"),
    ("", "Signature Block", "9"),
]

toc_style = ParagraphStyle('TOC', parent=body_style, fontSize=11, leading=18, leftIndent=1*cm, fontName='TimesNewRoman')
for num, title, page in toc_items:
    if num:
        story.append(Paragraph(f"<b>{num}</b>  {title}", toc_style))
    else:
        story.append(Paragraph(f"     {title}", ParagraphStyle('TOCSub', parent=toc_style, fontName='TimesNewRoman-Italic')))

story.append(PageBreak())

# ===== SECTION 1: ABOUT UNIHUB =====
story.append(Paragraph("1. About UniHub", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

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

# ===== SECTION 2: KEY INFORMATION AT A GLANCE =====
story.append(Paragraph("2. Key Information at a Glance", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

key_info = [
    [Paragraph("<b>Data Controller</b>", table_header_style), Paragraph("UniHub Kenya (operating as UniHub)", table_cell_style)],
    [Paragraph("<b>Contact for Rights Requests</b>", table_header_style), Paragraph("hello@unihub.ke | WhatsApp: +254 700 000 000", table_cell_style)],
    [Paragraph("<b>Data Protection Officer</b>", table_header_style), Paragraph("Shadrack Baraka (Founder), shadrack@unihub.ke", table_cell_style)],
    [Paragraph("<b>Lawful Basis</b>", table_header_style), Paragraph("Legitimate Interest (s. 30(1)(f) DPA 2019) for listings; Consent for landlord registration", table_cell_style)],
    [Paragraph("<b>Data Retention</b>", table_header_style), Paragraph("Listings: until removed by admin. Landlord profile: until account closure or withdrawal.", table_cell_style)],
    [Paragraph("<b>International Transfers</b>", table_header_style), Paragraph("Vercel (US / iad1), GitHub (US), SCCs + supplementary measures in place", table_cell_style)],
    [Paragraph("<b>Special Category Data</b>", table_header_style), Paragraph("None processed", table_cell_style)],
    [Paragraph("<b>Automated Decisions</b>", table_header_style), Paragraph("None", table_cell_style)],
]

key_table = Table(key_info, colWidths=[4.5*cm, 11.5*cm])
key_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('GRID', (0, 0), (-1, -1), 0.5, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(key_table)

# ===== SECTION 3: WHAT PERSONAL DATA IS COLLECTED =====
story.append(Paragraph("3. What Personal Data Is Collected", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

story.append(Paragraph(
    "UniHub collects the following personal data only when you register as a landlord or agent:",
    body_style
))

data_items = [
    "Full name",
    "Email address",
    "Phone number and WhatsApp number (for student contact)",
    "National ID or passport number (for identity verification only, never shown publicly)",
    "Business or agency name (optional)",
    "Campuses/areas you serve and estimated number of properties",
    "Any note you add for the review team",
    "Consent record (date/time of consent and policy version)",
    "Property listings you publish: title, location, category, price, deposit, photos, amenities",
    "Basic technical logs from hosting provider (request times, errors), no personal data",
]

for item in data_items:
    story.append(Paragraph(f"☐  {item}", bullet_style))

story.append(Spacer(1, 0.5*cm))
story.append(Paragraph(
    "<b>Students who only browse UniHub provide no personal data.</b> No accounts, no cookies, "
    "no analytics, no tracking. Contact links (WhatsApp/email) open external apps. UniHub does "
    "not see or capture that communication.",
    body_style
))

# ===== SECTION 4: PURPOSE AND LAWFUL BASIS =====
story.append(Paragraph("4. Purpose and Lawful Basis", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

purpose_data = [
    [Paragraph("<b>Purpose</b>", table_header_style), Paragraph("<b>Personal Data</b>", table_header_style), Paragraph("<b>Lawful Basis (DPA 2019)</b>", table_header_style)],
    [Paragraph("Verify landlord/agent identity before publishing", table_cell_style),
     Paragraph("Name, email, phone, WhatsApp, national ID, business name", table_cell_style),
     Paragraph("Consent (s. 32) + Legitimate Interest (s. 30(1)(f))", table_cell_style)],
    [Paragraph("Publish property listings for student discovery", table_cell_style),
     Paragraph("Listing details (no personal data, property attributes only)", table_cell_style),
     Paragraph("Legitimate Interest (s. 30(1)(f))", table_cell_style)],
    [Paragraph("Enable student contact via WhatsApp/email", table_cell_style),
     Paragraph("Landlord's public WhatsApp/email (provided by landlord)", table_cell_style),
     Paragraph("Legitimate Interest (s. 30(1)(f))", table_cell_style)],
    [Paragraph("Administer landlord accounts and status", table_cell_style),
     Paragraph("Registration data, consent record, review notes", table_cell_style),
     Paragraph("Consent (s. 32)", table_cell_style)],
    [Paragraph("Respond to data subject rights requests", table_cell_style),
     Paragraph("Account data, listing data", table_cell_style),
     Paragraph("Legal obligation (s. 26)", table_cell_style)],
    [Paragraph("Platform security and error debugging", table_cell_style),
     Paragraph("Technical logs (no personal data)", table_cell_style),
     Paragraph("Legitimate Interest (s. 30(1)(f))", table_cell_style)],
]

purpose_table = Table(purpose_data, colWidths=[5*cm, 5.5*cm, 5.5*cm])
purpose_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
]))
story.append(purpose_table)

# ===== SECTION 5: DATA SHARING AND INTERNATIONAL TRANSFERS =====
story.append(Paragraph("5. Data Sharing and International Transfers", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

story.append(Paragraph(
    "UniHub does not sell, rent, or share your personal data with third parties for marketing. "
    "The following processors handle data on UniHub's behalf:",
    body_style
))

processor_data = [
    [Paragraph("<b>Processor</b>", table_header_style), Paragraph("<b>Role</b>", table_header_style),
     Paragraph("<b>Location</b>", table_header_style), Paragraph("<b>Safeguards</b>", table_header_style)],
    [Paragraph("Vercel Inc.", table_cell_style),
     Paragraph("Hosting, serverless functions, logs", table_cell_style),
     Paragraph("US (iad1)", table_cell_center),
     Paragraph("Standard DPA with SCCs; data is public business listings only", table_cell_style)],
    [Paragraph("GitHub Inc.", table_cell_style),
     Paragraph("Source control, CI/CD", table_cell_style),
     Paragraph("US", table_cell_center),
     Paragraph("Standard DPA with SCCs; private repo, 2FA enforced", table_cell_style)],
    [Paragraph("OpenFreeMap / Esri", table_cell_style),
     Paragraph("Map tiles (public, keyless)", table_cell_style),
     Paragraph("Global CDN", table_cell_center),
     Paragraph("Not processors: no personal data transmitted", table_cell_style)],
]

proc_table = Table(processor_data, colWidths=[3*cm, 3.5*cm, 2.5*cm, 7*cm])
proc_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
]))
story.append(proc_table)

story.append(Spacer(1, 0.5*cm))
story.append(Paragraph(
    "<b>Your WhatsApp number and business email are published on your listings</b> so students can "
    "contact you directly. This is by design. UniHub facilitates contact but does not intermediate. "
    "Your national ID is <b>never</b> shown to students or published.",
    body_style
))

# ===== SECTION 6: RETENTION =====
story.append(Paragraph("6. Data Retention", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

retention_items = [
    "Landlord profile and listings: retained while your account is active and listings are current. "
    "Removed within 24 hours of a verified removal request from you.",
    "Consent record: retained for the life of the account + 2 years for compliance evidence.",
    "Technical logs: managed by Vercel (typically 30 days). No personal data included.",
    "You may request deletion at any time by emailing hello@unihub.ke.",
]
for item in retention_items:
    story.append(Paragraph(f"•  {item}", bullet_style))

# ===== SECTION 7: YOUR RIGHTS =====
story.append(Paragraph("7. Your Rights (Data Protection Act, 2019, Sections 26 and 29 to 32)", heading1_style))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

rights = [
    "Right to be informed: this form and the privacy policy at /privacy",
    "Right of access: request a copy of your data via hello@unihub.ke",
    "Right to rectification: request correction of inaccurate data",
    "Right to erasure: request account closure and data deletion",
    "Right to object: object to processing based on legitimate interest",
    "Right to data portability: receive your listing data in JSON format",
    "Right to withdraw consent: at any time, without penalty (see Section 4)",
    "Right to complain to the Office of the Data Protection Commissioner (ODPC)",
]
for right in rights:
    story.append(Paragraph(f"☐  {right}", bullet_style))

# ===== SECTION 8: CONSENT DECLARATION =====
story.append(PageBreak())
story.append(Paragraph("8. Consent Declaration", heading1_style))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0))

story.append(Paragraph(
    "Please read each statement carefully and tick every box that applies to you. "
    "Your consent is voluntary and you may withdraw it at any time.",
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
    story.append(Paragraph(f"☐  <b>{i}.</b> {stmt}", checkbox_style))

story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="60%", thickness=1, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0, hAlign='CENTER'))

# Signature block
story.append(Paragraph("Signature", heading2_style))
story.append(Spacer(1, 0.8*cm))

sig_block = [
    [Paragraph("<b>Landlord/Agent Name:</b>", table_cell_style), Paragraph("________________________________________", table_cell_style),
     Paragraph("<b>Date:</b>", table_cell_style), Paragraph("______________", table_cell_style)],
    [Paragraph("<b>Signature:</b>", table_cell_style), Paragraph("________________________________________", table_cell_style),
     Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
    [Paragraph("", table_cell_style), Paragraph("", table_cell_style),
     Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
    [Paragraph("<b>For UniHub (Tutor/Reviewer):</b>", table_cell_style), Paragraph("________________________________________", table_cell_style),
     Paragraph("<b>Date:</b>", table_cell_style), Paragraph("______________", table_cell_style)],
    [Paragraph("<b>Signature:</b>", table_cell_style), Paragraph("________________________________________", table_cell_style),
     Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
]

sig_block_table = Table(sig_block, colWidths=[4*cm, 7.5*cm, 2*cm, 3*cm])
sig_block_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'TimesNewRoman'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ('LINEBELOW', (1, 0), (1, 0), 1.5, DARK_NAVY),
    ('LINEBELOW', (1, 1), (1, 1), 1.5, DARK_NAVY),
    ('LINEBELOW', (3, 0), (3, 0), 1.5, DARK_NAVY),
    ('LINEBELOW', (1, 3), (1, 3), 1.5, DARK_NAVY),
    ('LINEBELOW', (1, 4), (1, 4), 1.5, DARK_NAVY),
]))
story.append(sig_block_table)

story.append(Spacer(1, 2*cm))
story.append(HRFlowable(width="80%", thickness=0.5, color=MED_GREY, spaceAfter=8, spaceBefore=0, hAlign='CENTER'))
story.append(Paragraph(
    "Version 1.0  |  KLS 126 UniHub Project  |  Data Protection Act 2019 Compliant  |  "
    "Review before public launch; quarterly thereafter",
    footer_style
))

doc.build(story)
print(f"Consent form created at {output_dir}/Group1_CAT2_Consent.pdf")