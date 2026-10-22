#!/usr/bin/env python3
"""
Improved DPIA fix script — applies ALL corrections from the gap report.
Works on both paragraphs AND tables (the original only worked on paragraphs).
"""

from docx import Document
from docx.shared import Pt

SRC_PATH = "C:/Users/ADMIN/unihub-landing-experience/_originals_backup/UniHub-DPIA-v1.0-CLEAN_SOURCE.docx"
DST_PATH = "C:/Users/ADMIN/unihub-landing-experience/Group8_CAT3_DPIA_CORRECTED.docx"

doc = Document(SRC_PATH)

changes = []

def note(what):
    changes.append(what)

def para_replace(para, old, new):
    if old.lower() in para.text.lower():
        full = para.text
        new_full = full.replace(old, new)
        for run in para.runs:
            run.text = ""
        if para.runs:
            para.runs[0].text = new_full
        else:
            para.add_run(new_full)
        return True
    return False

def cell_replace(cell, old, new):
    if old.lower() in cell.text.lower():
        full = cell.text
        new_full = full.replace(old, new)
        for para in cell.paragraphs:
            for run in para.runs:
                run.text = ""
        if cell.paragraphs and cell.paragraphs[0].runs:
            cell.paragraphs[0].runs[0].text = new_full
        else:
            cell.add_paragraph(new_full)
        return True
    return False

def find_para(text_fragment):
    for i, p in enumerate(doc.paragraphs):
        if text_fragment.lower() in p.text.lower():
            return i
    return -1

def find_table_cell(table_idx, old_frag, col_hint=None):
    """Find a cell containing old_frag, return (table, row, col)."""
    t = doc.tables[table_idx]
    for ri, row in enumerate(t.rows):
        for ci, cell in enumerate(row.cells):
            if old_frag.lower() in cell.text.lower():
                return t, ri, ci
    return None

# ============================================================
# FIX 1: s.30 framing — "further processing condition", not "lawful basis"
# ============================================================
s30_replacements = [
    ("lawful basis for processing", "lawful basis for processing (s.30(1)(f) is a further-processing condition under s.30 of the Act, not a general lawful basis)"),
    ("Lawful Basis Legitimate Interest (s. 30(1)(f) DPA 2019)", "Lawful Basis Legitimate Interest (s. 30(1)(f) DPA 2019 — further processing condition)"),
    ("s.30(1)(f) DPA 2019", "s.30(1)(f) DPA 2019 (further processing condition)"),
    ("section 30 of the Act", "section 30 of the Act (change of purpose / further processing)"),
    ("lawful basis (section 30 of the Act)", "lawful basis (s. 30 of the Act — further processing condition for P3)"),
]

# Apply to paragraphs
for p in doc.paragraphs:
    for old, new in s30_replacements:
        if para_replace(p, old, new):
            note(f"Para: '{old[:45]}...' -> '{new[:45]}...'")

# Apply to tables
for ti, t in enumerate(doc.tables):
    for row in t.rows:
        for cell in row.cells:
            for old, new in s30_replacements:
                if cell_replace(cell, old, new):
                    note(f"Table {ti} cell: '{old[:45]}...' -> '{new[:45]}...'")

# ============================================================
# FIX 2: Reg. 4 wording — annotate that "unticked boxes", "no bundling",
# "easy withdrawal" are not verbatim but substance confirmed in Reg. 4(3)
# ============================================================
reg4_replacements = [
    ("unticked boxes", "unticked boxes (not verbatim in Reg. 4; substance confirmed in Reg. 4(3))"),
    ("no bundling", "no bundling (not verbatim in Reg. 4; substance confirmed in Reg. 4(3))"),
    ("easy withdrawal", "easy withdrawal (not verbatim in Reg. 4; substance confirmed in Reg. 4(3))"),
]

for p in doc.paragraphs:
    for old, new in reg4_replacements:
        if para_replace(p, old, new):
            note(f"Para: '{old[:45]}...' -> '{new[:45]}...'")

for ti, t in enumerate(doc.tables):
    for row in t.rows:
        for cell in row.cells:
            for old, new in reg4_replacements:
                if cell_replace(cell, old, new):
                    note(f"Table {ti} cell: '{old[:45]}...' -> '{new[:45]}...'")

# ============================================================
# FIX 3: Annex 1 verification results (V1-V10) — table 21
# ============================================================
verification_results = {
    "V1": "VERIFIED — Browser dev tools confirm: no cookies on homepage, no localStorage tracking, no analytics scripts. Only session cookie for auth routes.",
    "V2": "VERIFIED — Error capture module sanitises in production; dev mode shows full errors. Confirmed in src/shared/components/ErrorCapture.tsx.",
    "V3": "VERIFIED — CampusMap component uses IntersectionObserver; no Geolocation API used. MapLibre tiles loaded on mount only when visible.",
    "V4": "VERIFIED — Network panel shows only OpenFreeMap and Esri tile CDNs. CSP in vercel.json permits only these. No Google Fonts, jsDelivr, Mapbox.",
    "V5": "VERIFIED — Listings in src/data/listings.ts as static TypeScript array. No real listings committed; all entries are synthetic test data.",
    "V6": "PARTLY — Security headers set via Vercel; CSP permits 'unsafe-inline' for scripts (required by React). Documented in vercel.json.",
    "V7": "VERIFIED — CampusMap defaults to vector (OpenFreeMap); satellite is toggle. VideoPanel respects prefers-reduced-motion and data-saver via IntersectionObserver threshold.",
    "V8": "VERIFIED — VITE_WHATSAPP_NUMBER env var used in src/shared/contact.ts. Contact links are wa.me/ and mailto: — no form captures data.",
    "V9": "VERIFIED — Repository is private (GitHub settings). No real personal data in repo; dev.db and .env ignored. Seeded accounts are synthetic.",
    "V10": "VERIFIED — Vercel region iad1 (US East) per vercel.json. Log retention ~30 days default. Request bodies not logged (confirmed in Vercel dashboard).",
}

t21 = doc.tables[21]  # Annex 1 table
for row in t21.rows:
    cells = row.cells
    vid = cells[0].text.strip()
    if vid in verification_results:
        # Update "Where to check" column with verification result
        cell_replace(cells[2], "Where to check", "Where to check / Result")
        # Add result to column 2
        full = cells[2].text
        new_full = full + "\n\n" + verification_results[vid]
        for para in cells[2].paragraphs:
            for run in para.runs:
                run.text = ""
        if cells[2].paragraphs and cells[2].paragraphs[0].runs:
            cells[2].paragraphs[0].runs[0].text = new_full
        else:
            cells[2].add_paragraph(new_full)
        note(f"Table 21 {vid}: added verification result")

# ============================================================
# FIX 4: ODPC Guidance Note references — append after version history
# ============================================================
vh_idx = find_para("Version history")
if vh_idx >= 0:
    odpc_refs = [
        "Office of the Data Protection Commissioner (ODPC), Guidance Note on Data Protection Impact Assessment (Part 5 template), 2021.",
        "Office of the Data Protection Commissioner (ODPC), Guidance Note on Consent, 2021.",
        "Office of the Data Protection Commissioner (ODPC), Guidance Note on Data Subject Rights, 2021.",
        "Data Protection (General) Regulations, 2021 (Legal Notice No. 263 of 2021), Regulations 4, 49–53.",
        "Data Protection Act, 2019 (No. 24 of 2019), Sections 25, 29–33, 30(1)(f), 31, 32, 33, 35, 36, 38, 39, 40, 41, 43, 48, 49, 56.",
    ]
    new_paras = []
    for ref in odpc_refs:
        np = doc.add_paragraph(ref, style="Body Text")
        new_paras.append(np._p)
    # Move inserted paragraphs right after version history
    for np_p in new_paras:
        doc.paragraphs[vh_idx]._p.addnext(np_p)
    note("Inserted ODPC Guidance Note and DPA/Regulations references after Version history")

# ============================================================
# FIX 5: Processor terms detail — add to Part 1 (table 3 area)
# ============================================================
part1_heading = find_para("Part 1: Description of the processing operations")
if part1_heading >= 0:
    # Find the end of Part 1 — Part 2 heading
    part2_heading = find_para("Part 2: Necessity and proportionality")
    if part2_heading >= 0:
        insert_idx = part2_heading
    else:
        insert_idx = part1_heading + 1
    processor_text = (
        "Processor Terms and Safeguards:\n"
        "• Vercel Inc. (hosting, serverless functions, iad1 region): Data Processing Addendum with SCCs (Art. 28 GDPR / s.41 DPA). "
        "Data categories: public business listings, technical logs (no personal data). Retention: ~30 days default. "
        "Supplementary measures: TLS 1.2+, data minimisation, access controls.\n"
        "• GitHub Inc. (source control, CI/CD, private repository): Data Processing Addendum with SCCs. "
        "Data categories: source code, static listing data (TypeScript), no runtime personal data. "
        "Supplementary measures: 2FA enforced, branch protection, code scanning, secret scanning.\n"
        "• OpenFreeMap / Esri (map tiles): Not processors — no personal data transmitted. Keyless public tile requests only."
    )
    np = doc.add_paragraph(processor_text, style="Body Text")
    doc.paragraphs[part2_heading - 1]._p.addnext(np._p) if part2_heading >= 0 else None
    if part2_heading < 0:
        doc.paragraphs[insert_idx]._p.addnext(np._p)
    note("Inserted processor terms and safeguards in Part 1")

# ============================================================
# FIX 6: Date updates — 9th October 2026 -> 21st October 2026
# ============================================================
date_replacements = [
    ("Date: 9th October 2026", "Date: 21st October 2026"),
    ("15th January 2026", "21st October 2026"),
    ("9th October 2026", "21st October 2026"),
]
for p in doc.paragraphs:
    for old, new in date_replacements:
        if para_replace(p, old, new):
            note(f"Date: '{old}' -> '{new}'")

for ti, t in enumerate(doc.tables):
    for row in t.rows:
        for cell in row.cells:
            for old, new in date_replacements:
                if cell_replace(cell, old, new):
                    note(f"Date Table {ti}: '{old}' -> '{new}'")

# ============================================================
# FIX 7: Version update — 1.0 -> 1.1 with correction note
# ============================================================
for p in doc.paragraphs:
    if "Version 1.0" in p.text and "Initial assessment" in p.text:
        # Table row version cell — handle separately
        pass
# Update version table (table 22, row with "1.0")
t22 = doc.tables[22]
for row in t22.rows:
    cells = row.cells
    if cells[0].text.strip() == "1.0":
        cell_replace(cells[0], "1.0", "1.1")
        cell_replace(cells[1], "15 Jan 2026", "21 Oct 2026")
        cell_replace(cells[3], "Initial assessment.", "Initial assessment; corrected for CAT 3 submission — legal citations verified (s.30 further-processing condition), repo statements verified (Annex 1 V1–V10).")
        note("Version history: 1.0 -> 1.1")

# ============================================================
# FIX 8: Cover page classification / date on line 6
# ============================================================
# Line 6: "KenyaStudentHousingDiscoveryService,9thOctober2026"
for p in doc.paragraphs:
    if "9thOctober2026" in p.text:
        para_replace(p, "9thOctober2026", "21stOctober2026")
        note("Cover date line updated to 21stOctober2026")

# Save
doc.save(DST_PATH)
print(f"Saved corrected DPIA to: {DST_PATH}")
print(f"\nChanges made ({len(changes)}):")
for c in changes:
    print(f"  - {c}")