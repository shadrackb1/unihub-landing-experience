from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
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
    os.path.join(output_dir, "Group1_CAT2_Consent_Professional.pdf"),
    pagesize=A4,
    rightMargin=2.5*cm, leftMargin=2.5*cm,
    topMargin=2.5*cm, bottomMargin=2.5*cm
)

styles = getSampleStyleSheet()

# Color palette - Professional legal document colors
DARK_NAVY = HexColor('#1A1A2E')
MID_BLUE = HexColor('#2D3E6B')
ACCENT_GOLD = HexColor('#C8A951')
LIGHT_GREY = HexColor('#F5F5F0')
MED_GREY = HexColor('#E8E8E0')
TEXT_DARK = HexColor('#2C2C2C')
TEXT_MED = HexColor('#4A4A4A')
WHITE = HexColor('#FFFFFF')

title_style = ParagraphStyle('CustomTitle', parent=styles['Title'],
    fontSize=24, leading=30, spaceAfter=6, alignment=TA_CENTER,
    textColor=DARK_NAVY, fontName='TimesNewRoman-Bold', tracking=1)

subtitle_style = ParagraphStyle('CustomSubtitle', parent=styles['Normal'],
    fontSize=13, leading=17, spaceAfter=4, alignment=TA_CENTER,
    textColor=MID_BLUE, fontName='TimesNewRoman-Italic')

heading1_style = ParagraphStyle('Heading1Custom', parent=styles['Heading1'],
    fontSize=16, leading=22, spaceBefore=20, spaceAfter=10,
    textColor=DARK_NAVY, fontName='TimesNewRoman-Bold',
    borderWidth=0, borderPadding=0)

heading2_style = ParagraphStyle('Heading2Custom', parent=styles['Heading2'],
    fontSize=13, leading=18, spaceBefore=14, spaceAfter=8,
    textColor=MID_BLUE, fontName='TimesNewRoman-Bold')

body_style = ParagraphStyle('BodyCustom', parent=styles['Normal'],
    fontSize=11, leading=17, spaceAfter=8, alignment=TA_JUSTIFY,
    fontName='TimesNewRoman', textColor=TEXT_DARK)

bullet_style = ParagraphStyle('BulletCustom', parent=styles['Normal'],
    fontSize=11, leading=17, spaceAfter=5, leftIndent=1.5*cm, bulletIndent=0.5*cm,
    fontName='TimesNewRoman', textColor=TEXT_DARK)

checkbox_style = ParagraphStyle('CheckboxCustom', parent=styles['Normal'],
    fontSize=11, leading=18, spaceAfter=6, leftIndent=1.5*cm, bulletIndent=0.5*cm,
    fontName='TimesNewRoman', textColor=TEXT_DARK)

small_style = ParagraphStyle('SmallCustom', parent=styles['Normal'],
    fontSize=9, leading=12, spaceAfter=4, fontName='TimesNewRoman',
    textColor=TEXT_MED, alignment=TA_CENTER)

table_header_style = ParagraphStyle('TableHeader', parent=styles['Normal'],
    fontSize=10, leading=13, fontName='TimesNewRoman-Bold',
    textColor=WHITE, alignment=TA_CENTER)

table_cell_style = ParagraphStyle('TableCell', parent=styles['Normal'],
    fontSize=10, leading=14, fontName='TimesNewRoman',
    textColor=TEXT_DARK, alignment=TA_LEFT)

table_cell_center = ParagraphStyle('TableCellCenter', parent=table_cell_style,
    alignment=TA_CENTER)

# Left-hand label column: bold dark text. The white header style must not be
# used here - on the light table background the labels become invisible.
table_label_style = ParagraphStyle('TableLabel', parent=table_cell_style,
    fontName='TimesNewRoman-Bold', textColor=DARK_NAVY)

footer_style = ParagraphStyle('FooterCustom', parent=styles['Normal'],
    fontSize=8.5, leading=11, fontName='TimesNewRoman-Italic',
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
story.append(Spacer(1, 3*cm))

# Decorative line
story.append(HRFlowable(width="70%", thickness=2.5, color=ACCENT_GOLD, spaceAfter=14, spaceBefore=0, hAlign='CENTER'))

story.append(Paragraph("UNIHUB", title_style))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph("Consent Form for Landlord & Agent Registration", subtitle_style))
story.append(Spacer(1, 0.2*cm))
story.append(Paragraph("Verified Student Housing Platform", ParagraphStyle('SubSub', parent=subtitle_style, fontSize=11, textColor=TEXT_MED)))

story.append(Spacer(1, 0.7*cm))
story.append(HRFlowable(width="50%", thickness=1, color=ACCENT_GOLD, spaceAfter=18, spaceBefore=0, hAlign='CENTER'))

# Document info table
cover_info = [
    ["Project", "UniHub: Verified Student Housing Platform"],
    ["Course", "KLS 126: Data Science for Lawyers"],
    ["Institution", "Kabarak University, School of Law"],
    ["Group", "Group 1"],
    ["Date", "21st October 2026"],
    ["Version", "1.0"],
    ["Classification", "Internal (For CAT Submission)"],
]
cover_table = Table(cover_info, colWidths=[4*cm, 12*cm])
cover_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'TimesNewRoman'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('FONTNAME', (0, 0), (0, -1), 'TimesNewRoman-Bold'),
    ('TEXTCOLOR', (0, 0), (0, -1), MID_BLUE),
    ('TEXTCOLOR', (1, 0), (1, -1), TEXT_DARK),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('LINEBELOW', (0, 0), (-1, -2), 0.5, MED_GREY),
]))
story.append(cover_table)

story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="50%", thickness=1, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0, hAlign='CENTER'))

# Group Members Section
story.append(Paragraph("Group Members", heading2_style))
story.append(Spacer(1, 0.5*cm))

member_table_data = [
    [Paragraph("<b>Name</b>", table_header_style), Paragraph("<b>Registration Number</b>", table_header_style)]
]
for name, reg in members:
    member_table_data.append([Paragraph(name, table_cell_style), Paragraph(reg, table_cell_center)])

member_table = Table(member_table_data, colWidths=[9*cm, 7*cm])
member_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('FONTNAME', (0, 0), (-1, 0), 'TimesNewRoman-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
]))
story.append(member_table)

story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="50%", thickness=1, color=ACCENT_GOLD, spaceAfter=12, spaceBefore=0, hAlign='CENTER'))

# Signatures on cover
story.append(Paragraph("Signatures of Group Members", heading2_style))
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

sig_table = Table(sig_table_data, colWidths=[5.5*cm, 3.5*cm, 4.5*cm, 3*cm])
sig_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('FONTNAME', (0, 0), (-1, 0), 'TimesNewRoman-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9.5),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
]))
story.append(sig_table)

story.append(PageBreak())

# ===== TABLE OF CONTENTS =====
story.append(Paragraph("Table of Contents", heading1_style))
story.append(Spacer(1, 0.5*cm))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=14, spaceBefore=0))

toc_items = [
    ("1.", "About UniHub"),
    ("2.", "Key Information at a Glance"),
    ("3.", "What Personal Data Is Collected"),
    ("4.", "Purpose and Lawful Basis for Processing"),
    ("5.", "Data Sharing, Processors & International Transfers"),
    ("6.", "Data Retention & Deletion"),
    ("7.", "Your Rights Under the Data Protection Act 2019"),
    ("8.", "Consent Declaration"),
    ("", "Signature & Acknowledgement"),
]

toc_style = ParagraphStyle('TOC', parent=body_style, fontSize=11, leading=20, leftIndent=1*cm, fontName='TimesNewRoman')
for num, title in toc_items:
    if num:
        story.append(Paragraph(f"<b>{num}</b>  {title}", toc_style))
    else:
        story.append(Paragraph(f"     {title}", ParagraphStyle('TOCSub', parent=toc_style, fontName='TimesNewRoman-Italic')))

story.append(PageBreak())

# ===== SECTION 1: ABOUT UNIHUB =====
story.append(Paragraph("1. About UniHub", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

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
    "processed, and what rights you have. It asks for your consent where UniHub needs it under "
    "the Data Protection Act, 2019. A student who only browses UniHub provides no personal data "
    "and does not need to sign this form.",
    body_style
))

# ===== SECTION 2: KEY INFORMATION AT A GLANCE =====
story.append(Paragraph("2. Key Information at a Glance", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

key_info = [
    [Paragraph("Data Controller", table_label_style), Paragraph("UniHub Kenya (operating as UniHub)", table_cell_style)],
    [Paragraph("Registered Address", table_label_style), Paragraph("Kabarak University, Nakuru County, Kenya", table_cell_style)],
    [Paragraph("Contact for Data Rights Requests", table_label_style), Paragraph("hello@unihub.ke | WhatsApp: +254 700 000 000", table_cell_style)],
    [Paragraph("Data Protection Officer", table_label_style), Paragraph("Shadrack Baraka (Founder), shadrack@unihub.ke", table_cell_style)],
    [Paragraph("Lawful Basis", table_label_style), Paragraph("Legitimate Interest (s. 30(1)(f) DPA 2019) for listings; Consent (s. 32) for landlord registration", table_cell_style)],
    [Paragraph("Data Retention", table_label_style), Paragraph("Listings: until removed by admin. Landlord profile: until account closure or consent withdrawal.", table_cell_style)],
    [Paragraph("International Transfers", table_label_style), Paragraph("Vercel (US / iad1), GitHub (US), SCCs + supplementary measures in place", table_cell_style)],
    [Paragraph("Special Category Data", table_label_style), Paragraph("None processed", table_cell_style)],
    [Paragraph("Automated Decisions", table_label_style), Paragraph("None: no profiling, scoring, or automated eligibility determinations", table_cell_style)],
    [Paragraph("Supervisory Authority", table_label_style), Paragraph("Office of the Data Protection Commissioner (ODPC), Kenya", table_cell_style)],
]

key_table = Table(key_info, colWidths=[5*cm, 11*cm])
key_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
]))
story.append(key_table)

# ===== SECTION 3: WHAT PERSONAL DATA IS COLLECTED =====
story.append(Paragraph("3. What Personal Data Is Collected", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

story.append(Paragraph(
    "UniHub collects the following personal data <b>only when you register as a landlord or agent</b>. "
    "No data is collected from students who merely browse listings.",
    body_style
))

data_items = [
    ("Identity Data", [
        "Full legal name",
        "Email address",
        "Phone number and WhatsApp number (for student contact)",
        "National ID or passport number (for identity verification only, <b>never shown publicly</b>)",
    ]),
    ("Business Data", [
        "Business or agency name (optional)",
        "Campuses/areas you serve and estimated number of properties",
        "Any note you add for the review team",
    ]),
    ("Consent & Account Data", [
        "Consent record (date/time of consent and policy version)",
        "Account status (pending, approved, rejected, suspended)",
        "Review notes from admin verification",
    ]),
    ("Listing Data (Published)", [
        "Property listings you publish: title, location, category, price, deposit, photos, amenities",
        "Your public WhatsApp number and business email (displayed on listings for student contact)",
    ]),
    ("Technical Data (No Personal Data)", [
        "Basic technical logs from hosting provider (request times, errors), no personal data",
    ]),
]

for category, items in data_items:
    story.append(Paragraph(f"<b>{category}</b>", heading2_style))
    for item in items:
        story.append(Paragraph(f"☐  {item}", bullet_style))
    story.append(Spacer(1, 0.3*cm))

story.append(Spacer(1, 0.5*cm))
story.append(Paragraph(
    "<b>Important:</b> Students who only browse UniHub provide <b>no personal data</b>. No accounts, no cookies, "
    "no analytics, no tracking. Contact links (WhatsApp/email) open external apps. UniHub does "
    "not see or capture that communication.",
    body_style
))

# ===== SECTION 4: PURPOSE AND LAWFUL BASIS =====
story.append(Paragraph("4. Purpose and Lawful Basis for Processing", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

story.append(Paragraph(
    "Under the Data Protection Act 2019, every processing operation must have a lawful basis. "
    "UniHub relies on two lawful bases depending on the purpose:",
    body_style
))

purpose_data = [
    [Paragraph("<b>Purpose</b>", table_header_style), Paragraph("<b>Personal Data Processed</b>", table_header_style), Paragraph("<b>Lawful Basis (DPA 2019)</b>", table_header_style)],
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
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('LEFTPADDING', (0, 0), (-1, -1), 7),
    ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
]))
story.append(purpose_table)

story.append(Spacer(1, 0.5*cm))
story.append(Paragraph(
    "<b>Note on Consent:</b> Consent is used as the lawful basis for landlord/agent registration "
    "and account administration. You may withdraw your consent at any time (see Section 8). "
    "Withdrawal will not affect the lawfulness of processing based on consent before withdrawal.",
    body_style
))

# ===== SECTION 5: DATA SHARING & INTERNATIONAL TRANSFERS =====
story.append(Paragraph("5. Data Sharing, Processors & International Transfers", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

story.append(Paragraph(
    "UniHub does not sell, rent, or share your personal data with third parties for marketing. "
    "The following processors handle data on UniHub's behalf under written Data Processing Agreements:",
    body_style
))

processor_data = [
    [Paragraph("<b>Processor</b>", table_header_style), Paragraph("<b>Role</b>", table_header_style),
     Paragraph("<b>Location</b>", table_header_style), Paragraph("<b>Safeguards & Legal Basis</b>", table_header_style)],
    [Paragraph("Vercel Inc.", table_cell_style),
     Paragraph("Hosting, serverless functions, access logs", table_cell_style),
     Paragraph("US (iad1)", table_cell_center),
     Paragraph("Standard DPA with SCCs (Art. 28 GDPR / s. 41 DPA); data is public business listings only; no sensitive data", table_cell_style)],
    [Paragraph("GitHub Inc.", table_cell_style),
     Paragraph("Source control, CI/CD, repository hosting", table_cell_style),
     Paragraph("US", table_cell_center),
     Paragraph("Standard DPA with SCCs; private repository; 2FA enforced; code & listing data only", table_cell_style)],
    [Paragraph("OpenFreeMap / Esri", table_cell_style),
     Paragraph("Map tiles (public, keyless)", table_cell_style),
     Paragraph("Global CDN", table_cell_center),
     Paragraph("Not processors: no personal data transmitted; public tile requests only", table_cell_style)],
]

proc_table = Table(processor_data, colWidths=[2.8*cm, 3.5*cm, 2.2*cm, 7.5*cm])
proc_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), DARK_NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('GRID', (0, 0), (-1, -1), 0.75, MED_GREY),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('LEFTPADDING', (0, 0), (-1, -1), 7),
    ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
]))
story.append(proc_table)

story.append(Spacer(1, 0.5*cm))
story.append(Paragraph(
    "<b>Your WhatsApp number and business email are published on your listings</b> so students can "
    "contact you directly. This is by design. UniHub facilitates contact but does not intermediate. "
    "Your national ID is <b>never</b> shown to students or published.",
    body_style
))

story.append(Paragraph(
    "<b>International Transfer Safeguards:</b> Transfers to Vercel (US) and GitHub (US) rely on "
    "Standard Contractual Clauses (SCCs) incorporated in their Data Processing Addenda, supplemented by: "
    "(a) data minimisation: only public business listings and technical logs; "
    "(b) encryption in transit (TLS 1.2+); "
    "(c) access controls (2FA, branch protection); "
    "(d) no special category data. The controller (UniHub Kenya) remains in Kenya and makes all processing decisions locally.",
    body_style
))

# ===== SECTION 6: RETENTION =====
story.append(Paragraph("6. Data Retention & Deletion", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

retention_items = [
    "<b>Landlord profile and listings:</b> retained while your account is active and listings are current. Removed within 24 hours of a verified removal request from you.",
    "<b>Consent record:</b> retained for the life of the account + 2 years for compliance evidence (s. 27 DPA).",
    "<b>Technical logs:</b> managed by Vercel (typically 30 days default). No personal data included.",
    "<b>Verification documents (off-platform):</b> retained for 1 year after last listing publication, then securely destroyed.",
    "<b>Right to deletion:</b> You may request deletion at any time by emailing hello@unihub.ke. We will action within 48 hours.",
]
for item in retention_items:
    story.append(Paragraph(f"•  {item}", bullet_style))

# ===== SECTION 7: RIGHTS =====
story.append(Paragraph("7. Your Rights Under the Data Protection Act 2019", heading1_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=10, spaceBefore=0))

story.append(Paragraph(
    "As a data subject, you have the following rights under Sections 26 and 29 to 32 of the Data Protection Act 2019:",
    body_style
))

rights = [
    ("Right to be Informed", "You have the right to be informed about the collection and use of your personal data. This form and the privacy policy at /privacy fulfill this obligation."),
    ("Right of Access (s. 26)", "You may request a copy of your personal data held by UniHub. We will provide it within 30 days in a commonly used format (JSON/PDF)."),
    ("Right to Rectification (s. 29)", "You may request correction of inaccurate or incomplete personal data. We will correct it within 48 hours."),
    ("Right to Erasure / Right to be Forgotten (s. 30)", "You may request deletion of your personal data. For landlords, this closes your account and removes your listings. Students have no data to erase."),
    ("Right to Object (s. 31)", "You may object to processing based on legitimate interest (e.g., listing publication). We will cease unless we demonstrate compelling legitimate grounds."),
    ("Right to Data Portability", "You may receive your listing data in a structured, commonly used, machine-readable format (JSON) and transmit it to another controller."),
    ("Right to Withdraw Consent (s. 32)", "Where consent is the lawful basis, you may withdraw it at any time, without penalty. Withdrawal does not affect lawfulness of prior processing."),
    ("Right to Complain to ODPC", "You may lodge a complaint with the Office of the Data Protection Commissioner if you believe your rights have been infringed."),
]

for right_name, right_desc in rights:
    story.append(Paragraph(f"<b>☐  {right_name}</b>", checkbox_style))
    story.append(Paragraph(f"    {right_desc}", body_indent_style := ParagraphStyle('BodyIndent', parent=body_style, leftIndent=2*cm, firstLineIndent=0)))
    story.append(Spacer(1, 0.2*cm))

story.append(Paragraph(
    "All requests are handled by the Data Protection Officer (Founder) via the published contact channels. "
    "Target response time: 48 hours for rectification/erasure, 30 days for access/portability, well within statutory timelines.",
    body_style
))

# ===== SECTION 8: CONSENT DECLARATION =====
story.append(PageBreak())
story.append(Paragraph("8. Consent Declaration", heading1_style))
story.append(HRFlowable(width="100%", thickness=2.5, color=ACCENT_GOLD, spaceAfter=14, spaceBefore=0))

story.append(Paragraph(
    "Please read each statement carefully and tick every box that applies to you. "
    "Your consent is <b>voluntary</b>, <b>specific</b>, <b>informed</b>, and <b>unambiguous</b> "
    "(per Section 32 of the Data Protection Act 2019). You may withdraw it at any time.",
    body_style
))

consent_statements = [
    ("Age & Capacity", "I confirm that I am 18 years of age or older and have the legal capacity to provide this consent."),
    ("Understanding", "I have read and understood this consent form and the UniHub Privacy Policy (available at /privacy)."),
    ("Core Consent", "I consent to UniHub collecting and processing my personal data as described in Section 3 for the purposes in Section 4."),
    ("Public Contact Details", "I consent to my WhatsApp number and business email being published on my property listings so students can contact me directly."),
    ("Accuracy", "I confirm that the information I provide (identity, contact details, property details) is accurate and I will keep it updated."),
    ("National ID Protection", "I understand that my national ID/passport number is used for verification only and will <b>never</b> be shown publicly or shared with students."),
    ("Withdrawal Right", "I understand that I may withdraw my consent at any time by emailing hello@unihub.ke, which will close my account and remove my listings."),
    ("International Transfer", "I understand that my data is processed on servers outside Kenya (Vercel in the US, GitHub in the US) under Standard Contractual Clauses as safeguards."),
    ("No Automated Decisions", "I understand that no automated decision-making or profiling is applied to my data."),
    ("Opportunity to Ask", "I have had the opportunity to ask questions and they have been answered to my satisfaction."),
]

for i, (label, stmt) in enumerate(consent_statements, 1):
    story.append(Paragraph(f"☐  <b>{i}. {label}:</b> {stmt}", checkbox_style))

story.append(Spacer(1, 1.5*cm))
story.append(HRFlowable(width="70%", thickness=1.5, color=ACCENT_GOLD, spaceAfter=14, spaceBefore=0, hAlign='CENTER'))

# Signature block
story.append(Paragraph("Signature & Acknowledgement", heading2_style))
story.append(Spacer(1, 1*cm))

story.append(Paragraph(
    "By signing below, I confirm that I have read and understood this consent form, "
    "and I freely give my consent to the processing of my personal data as described herein.",
    body_style
))

story.append(Spacer(1, 0.8*cm))

sig_block = [
    [Paragraph("<b>Landlord/Agent Name:</b>", table_cell_style), Paragraph("", table_cell_style),
     Paragraph("<b>Date:</b>", table_cell_style), Paragraph("", table_cell_style)],
    [Paragraph("<b>Signature:</b>", table_cell_style), Paragraph("", table_cell_style),
     Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
    [Paragraph("", table_cell_style), Paragraph("", table_cell_style),
     Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
    [Paragraph("<b>For UniHub (Authorised Officer):</b>", table_cell_style), Paragraph("", table_cell_style),
     Paragraph("<b>Date:</b>", table_cell_style), Paragraph("", table_cell_style)],
    [Paragraph("<b>Signature:</b>", table_cell_style), Paragraph("", table_cell_style),
     Paragraph("", table_cell_style), Paragraph("", table_cell_style)],
]

# Ruled lines are drawn as cell borders. Underscore runs are wider than the
# cell and wrap, which broke these lines in the previous build.
sig_block_table = Table(sig_block, colWidths=[5*cm, 6*cm, 2*cm, 3*cm], rowHeights=[1.5*cm]*5)
sig_block_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'TimesNewRoman'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('LINEBELOW', (1, 0), (1, 0), 1, DARK_NAVY),
    ('LINEBELOW', (1, 1), (1, 1), 1, DARK_NAVY),
    ('LINEBELOW', (3, 0), (3, 0), 1, DARK_NAVY),
    ('LINEBELOW', (1, 3), (1, 3), 1, DARK_NAVY),
    ('LINEBELOW', (3, 3), (3, 3), 1, DARK_NAVY),
    ('LINEBELOW', (1, 4), (1, 4), 1, DARK_NAVY),
]))
story.append(sig_block_table)

story.append(Spacer(1, 2.5*cm))
story.append(HRFlowable(width="80%", thickness=0.5, color=MED_GREY, spaceAfter=10, spaceBefore=0, hAlign='CENTER'))
story.append(Paragraph(
    "Version 1.0  |  KLS 126 UniHub Project  |  Data Protection Act 2019 Compliant  |  "
    "Review before public launch; quarterly thereafter",
    footer_style
))

doc.build(story)
print(f"Professional consent form created at {output_dir}/Group1_CAT2_Consent_Professional.pdf")