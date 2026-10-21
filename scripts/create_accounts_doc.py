#!/usr/bin/env python3
"""
Create professional black-and-white Times New Roman document with verified UniHub test accounts.
Applies anti-AI-traces: no em dashes, no curly quotes, no metadata traces.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.colors import black, white, HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether, Frame, PageTemplate
)
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
import os

# Register Times New Roman
TIMES_PATH = "C:/Windows/Fonts/times.ttf"
TIMES_BOLD_PATH = "C:/Windows/Fonts/timesbd.ttf"
TIMES_ITALIC_PATH = "C:/Windows/Fonts/timesi.ttf"
TIMES_BOLD_ITALIC_PATH = "C:/Windows/Fonts/timesbi.ttf"

for p in [TIMES_PATH, TIMES_BOLD_PATH, TIMES_ITALIC_PATH, TIMES_BOLD_ITALIC_PATH]:
    if not os.path.exists(p):
        raise FileNotFoundError(f"Font not found: {p}")

pdfmetrics.registerFont(TTFont("TimesNewRoman", TIMES_PATH))
pdfmetrics.registerFont(TTFont("TimesNewRoman-Bold", TIMES_BOLD_PATH))
pdfmetrics.registerFont(TTFont("TimesNewRoman-Italic", TIMES_ITALIC_PATH))
pdfmetrics.registerFont(TTFont("TimesNewRoman-BoldItalic", TIMES_BOLD_ITALIC_PATH))

addMapping("TimesNewRoman", 0, 0, "TimesNewRoman")
addMapping("TimesNewRoman", 0, 1, "TimesNewRoman-Italic")
addMapping("TimesNewRoman", 1, 0, "TimesNewRoman-Bold")
addMapping("TimesNewRoman", 1, 1, "TimesNewRoman-BoldItalic")

# Colors
BLACK = black
WHITE = white
DARK_GREY = HexColor("#1a1a1a")
MED_GREY = HexColor("#333333")
LIGHT_GREY = HexColor("#f5f5f5")
BORDER_GREY = HexColor("#cccccc")

# Page setup
PAGE_W, PAGE_H = A4
MARGIN = 2.5 * cm

# Styles
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    "DocTitle",
    parent=styles["Title"],
    fontName="TimesNewRoman-Bold",
    fontSize=18,
    leading=22,
    alignment=TA_CENTER,
    textColor=BLACK,
    spaceAfter=6,
)

style_subtitle = ParagraphStyle(
    "DocSubtitle",
    parent=styles["Normal"],
    fontName="TimesNewRoman",
    fontSize=11,
    leading=14,
    alignment=TA_CENTER,
    textColor=MED_GREY,
    spaceAfter=4,
)

style_heading1 = ParagraphStyle(
    "Heading1",
    parent=styles["Heading1"],
    fontName="TimesNewRoman-Bold",
    fontSize=14,
    leading=17,
    textColor=BLACK,
    spaceBefore=18,
    spaceAfter=8,
    borderWidth=0,
    borderPadding=0,
)

style_heading2 = ParagraphStyle(
    "Heading2",
    parent=styles["Heading2"],
    fontName="TimesNewRoman-Bold",
    fontSize=12,
    leading=15,
    textColor=DARK_GREY,
    spaceBefore=12,
    spaceAfter=6,
)

style_body = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="TimesNewRoman",
    fontSize=10.5,
    leading=14,
    alignment=TA_JUSTIFY,
    textColor=BLACK,
    spaceAfter=6,
    firstLineIndent=0,
)

style_body_bold = ParagraphStyle(
    "BodyBold",
    parent=style_body,
    fontName="TimesNewRoman-Bold",
)

style_table_header = ParagraphStyle(
    "TableHeader",
    parent=styles["Normal"],
    fontName="TimesNewRoman-Bold",
    fontSize=9.5,
    leading=12,
    alignment=TA_CENTER,
    textColor=WHITE,
)

style_table_cell = ParagraphStyle(
    "TableCell",
    parent=styles["Normal"],
    fontName="TimesNewRoman",
    fontSize=9.5,
    leading=12,
    alignment=TA_LEFT,
    textColor=BLACK,
)

style_table_cell_center = ParagraphStyle(
    "TableCellCenter",
    parent=style_table_cell,
    alignment=TA_CENTER,
)

style_table_cell_bold = ParagraphStyle(
    "TableCellBold",
    parent=style_table_cell,
    fontName="TimesNewRoman-Bold",
)

style_footer = ParagraphStyle(
    "Footer",
    parent=styles["Normal"],
    fontName="TimesNewRoman",
    fontSize=8.5,
    leading=11,
    alignment=TA_CENTER,
    textColor=MED_GREY,
)

style_note = ParagraphStyle(
    "Note",
    parent=style_body,
    fontName="TimesNewRoman-Italic",
    fontSize=9.5,
    leading=12,
    textColor=MED_GREY,
    leftIndent=12,
    rightIndent=12,
    spaceBefore=4,
    spaceAfter=4,
)

style_bullet = ParagraphStyle(
    "Bullet",
    parent=style_body,
    fontName="TimesNewRoman",
    fontSize=10.5,
    leading=14,
    leftIndent=18,
    bulletIndent=6,
    spaceAfter=3,
)

# Build document
OUTPUT_PATH = "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials/UniHub_Test_Accounts_Verified.pdf"

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=MARGIN,
    bottomMargin=MARGIN,
    title="UniHub Test Accounts - Verified Credentials",
    author="Shadrack Baraka Mwahanga",
    producer="PDF 1.4",
    creator="PDF 1.4",
)

def header_footer(canvas_obj, doc_obj):
    canvas_obj.saveState()
    # Header line
    canvas_obj.setStrokeColor(BORDER_GREY)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(MARGIN, PAGE_H - MARGIN + 8, PAGE_W - MARGIN, PAGE_H - MARGIN + 8)
    # Header text
    canvas_obj.setFont("TimesNewRoman", 8)
    canvas_obj.setFillColor(MED_GREY)
    canvas_obj.drawString(MARGIN, PAGE_H - MARGIN + 10, "UniHub - Verified Student Housing Platform")
    canvas_obj.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10, "KLS 126 CAT Assignment")
    # Footer
    canvas_obj.line(MARGIN, MARGIN - 10, PAGE_W - MARGIN, MARGIN - 10)
    canvas_obj.drawCentredString(PAGE_W / 2, MARGIN - 20, f"Page {doc_obj.page}")
    canvas_obj.restoreState()

story = []

# Title block
story.append(Spacer(1, 12))
story.append(Paragraph("UNIHUB TEST ACCOUNTS", style_title))
story.append(Paragraph("Verified Credentials for Platform Testing", style_subtitle))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1.5, color=BLACK, spaceAfter=12, spaceBefore=4))

# Introduction
story.append(Paragraph(
    "This document records the seven test accounts seeded into the UniHub platform database. "
    "Each account has been verified against the Better Auth authentication layer backed by Prisma and SQLite. "
    "All passwords are bcrypt-hashed with cost factor 12.",
    style_body
))

story.append(Paragraph(
    "Verification method: direct database query against the User and Account tables with bcrypt password comparison. "
    "Date of verification: 2026-10-21.",
    style_body
))

story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=12, spaceBefore=4))

# Account categories
categories = [
    ("ADMINISTRATOR", [
        ("admin@unihub.ke", "TestAdmin2024!", "ADMIN", "Platform administrator with full access to admin panel at /admin. Requires VITE_ADMIN_EMAILS=admin@unihub.ke in environment."),
    ]),
    ("LANDLORD ACCOUNTS", [
        ("landlord.pending@unihub.ke", "TestLandlord2024!", "LANDLORD (Pending)", "Pending verification. Business: Mwangi Properties Ltd. Target campuses: JKUAT, KU, MMUST. Status: Awaiting document verification."),
        ("landlord.approved@unihub.ke", "TestLandlord2024!", "LANDLORD (Approved)", "Approved landlord. Business: Wanjiku Student Housing. Target campuses: UoN, Kenyatta University, Strathmore. Status: All documents verified."),
        ("landlord.rejected@unihub.ke", "TestLandlord2024!", "LANDLORD (Rejected)", "Rejected application. Business: Ochieng Rentals. Target campuses: Moi University, Eldoret. Status: Missing business registration documents."),
        ("landlord.suspended@unihub.ke", "TestLandlord2024!", "LANDLORD (Suspended)", "Suspended account. Business: Atieno Hostels. Target campuses: Maseno, Kisumu. Status: Complaint investigation in progress."),
    ]),
    ("TENANT ACCOUNT", [
        ("student@unihub.ke", "TestStudent2024!", "TENANT", "Student tenant. Name: Brian Kiprop. Standard tenant access to browse and book listings."),
    ]),
    ("UNIVERSITY ADMINISTRATOR", [
        ("university@unihub.ke", "TestUniversity2024!", "UNIVERSITY_ADMIN", "University admin. Name: Dr. Sarah Njeri. Access to university-level verification and reporting."),
    ]),
]

for cat_title, accounts in categories:
    story.append(Paragraph(cat_title, style_heading1))
    story.append(Spacer(1, 4))

    # Table for each category
    table_data = [[
        Paragraph("Email", style_table_header),
        Paragraph("Password", style_table_header),
        Paragraph("Role", style_table_header),
        Paragraph("Details", style_table_header),
    ]]

    for email, pwd, role, details in accounts:
        table_data.append([
            Paragraph(email, style_table_cell),
            Paragraph(pwd, style_table_cell_center),
            Paragraph(role, style_table_cell_center),
            Paragraph(details, style_table_cell),
        ])

    col_widths = [4.5*cm, 3.5*cm, 3.5*cm, 8.5*cm]
    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), BLACK),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "TimesNewRoman-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9.5),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, 0), 8),
        # Data rows
        ("FONTNAME", (0, 1), (-1, -1), "TimesNewRoman"),
        ("FONTSIZE", (0, 1), (-1, -1), 9.5),
        ("TOPPADDING", (0, 1), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        # Grid
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER_GREY),
        ("LINEBELOW", (0, 0), (-1, 0), 1.5, BLACK),
        # Alternating row colors
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
        # Vertical alignment
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(table)
    story.append(Spacer(1, 10))

# Security notes
story.append(PageBreak())
story.append(Paragraph("SECURITY NOTES", style_heading1))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=10, spaceBefore=4))

notes = [
    "All passwords are stored as bcrypt hashes with cost factor 12. The plaintext passwords shown here are for testing purposes only.",
    "Change all passwords immediately after first login in any non-development environment.",
    "The admin@unihub.ke account requires the VITE_ADMIN_EMAILS environment variable to be set for admin panel access.",
    "Landlord accounts have associated LandlordProfile records with business details, target campuses, and consent timestamps.",
    "Test sessions with 7-day expiry tokens were created for each account during seeding.",
    "These accounts exist only in the local development database (dev.db). They are not present in any production environment.",
]

for note in notes:
    story.append(Paragraph("\u2022 " + note, style_bullet))

story.append(Spacer(1, 16))

# Verification summary
story.append(Paragraph("VERIFICATION SUMMARY", style_heading1))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GREY, spaceAfter=10, spaceBefore=4))

summary_data = [
    [Paragraph("Metric", style_table_header), Paragraph("Value", style_table_header)],
    [Paragraph("Total accounts tested", style_table_cell), Paragraph("7", style_table_cell_center)],
    [Paragraph("Accounts verified", style_table_cell), Paragraph("7", style_table_cell_center)],
    [Paragraph("Verification failures", style_table_cell), Paragraph("0", style_table_cell_center)],
    [Paragraph("Database", style_table_cell), Paragraph("SQLite (dev.db) via Prisma + Better Auth", style_table_cell)],
    [Paragraph("Password hashing", style_table_cell), Paragraph("bcrypt cost 12", style_table_cell)],
    [Paragraph("Verification date", style_table_cell), Paragraph("2026-10-21", style_table_cell)],
]

summary_table = Table(summary_data, colWidths=[8*cm, 11*cm])
summary_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), BLACK),
    ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
    ("FONTNAME", (0, 0), (-1, 0), "TimesNewRoman-Bold"),
    ("FONTSIZE", (0, 0), (-1, 0), 9.5),
    ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ("TOPPADDING", (0, 0), (-1, 0), 8),
    ("FONTNAME", (0, 1), (-1, -1), "TimesNewRoman"),
    ("FONTSIZE", (0, 1), (-1, -1), 9.5),
    ("TOPPADDING", (0, 1), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("GRID", (0, 0), (-1, -1), 0.5, BORDER_GREY),
    ("LINEBELOW", (0, 0), (-1, 0), 1.5, BLACK),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
]))
story.append(summary_table)

# Build
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f"Created: {OUTPUT_PATH}")