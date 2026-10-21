"""Scrub AI traces from the three consent PDFs.

Removes/overwrites:
  - Info dict: /Producer, /Creator -> replaced with neutral strings
  - Header comment after %PDF-1.x: "%ReportLab Generated PDF document"
  - Trailer comment: "% ReportLab generated PDF document -- digest ..."
  - XMP /Metadata stream (none present but strip if found)
  - Keeps /Title and /Author (set to real author)

Uses pypdf for structural rewrite to avoid xref corruption.
"""

import sys
import fitz  # pymupdf
from pypdf import PdfReader, PdfWriter

PDFS = [
    "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_CAT2_Consent_BW.pdf",
    "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_CAT2_Consent_Professional.pdf",
    "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_CAT2_Consent.pdf",
]

AUTHOR = "Shadrack Baraka Mwahanga"
TITLE = "UniHub Consent Form — KLS 126 CAT2"


def inspect(path):
    """Print raw bytes around header/trailer and the Info dict."""
    with open(path, "rb") as f:
        data = f.read()
    # header + first 200 bytes
    print("  header:", data[:200].replace(b"\r", b"").replace(b"\n", b"|"))
    # last 400 bytes
    print("  trailer tail:", data[-400:].replace(b"\r", b"").replace(b"\n", b"|"))
    # xref and trailer keywords
    for kw in [b"/Producer", b"/Creator", b"/Author", b"/Title", b"/ID", b"%ReportLab"]:
        idx = data.find(kw)
        if idx >= 0:
            print("    %s at %d: %s" % (kw.decode(), idx, data[idx:idx+120].replace(b"\r", b"").replace(b"\n", b"|")))


def sanitize(path, dry):
    # --- 1. pymupdf: rewrite Info dict, drop XMP
    doc = fitz.open(path)
    meta = doc.metadata
    meta["producer"] = "PDF 1.4"
    meta["creator"] = "PDF 1.4"
    meta["title"] = TITLE
    meta["author"] = AUTHOR
    doc.set_metadata(meta)
    # drop XMP if any (pymupdf raises when there is none, so probe by xref)
    try:
        xref = doc.xref_xml_metadata()
        if xref:
            doc.delete_xml_metadata()
    except Exception:
        pass
    if not dry:
        out = path + ".tmp"
        doc.save(out, garbage=4, deflate=True)
        doc.close()

        # --- 2. pypdf: structural rewrite to drop header/trailer comments
        rdr = PdfReader(out)
        wrt = PdfWriter()
        for page in rdr.pages:
            wrt.add_page(page)
        # preserve updated info dict
        if rdr.metadata:
            wrt.add_metadata({
                "/Title": TITLE,
                "/Author": AUTHOR,
                "/Producer": "PDF 1.4",
                "/Creator": "PDF 1.4",
            })
        wrt.write(path + ".final")
        import os
        os.replace(path + ".final", path)
    else:
        doc.close()
        out = path  # for dry-run reporting

    # --- 3. verify
    doc2 = fitz.open(path if not dry else out)
    m2 = doc2.metadata
    print("  %s" % ("ok " if "ReportLab" not in (m2.get("producer") or "") else "FAIL"), "producer:", m2.get("producer"))
    print("  %s" % ("ok " if "ReportLab" not in (m2.get("creator") or "") else "FAIL"), "creator:", m2.get("creator"))
    print("  %s" % ("ok " if m2.get("author") == AUTHOR else "FAIL"), "author:", m2.get("author"))
    print("  %s" % ("ok " if m2.get("title") == TITLE else "FAIL"), "title:", m2.get("title"))
    with open(path if not dry else out, "rb") as f:
        raw = f.read()
    has_header = b"%ReportLab" in raw[:200]
    has_trailer = b"% ReportLab" in raw[-400:]
    print("  %s header comment" % ("ok " if not has_header else "FAIL"))
    print("  %s trailer comment" % ("ok " if not has_trailer else "FAIL"))
    doc2.close()
    return not (has_header or has_trailer or "ReportLab" in (m2.get("producer") or "") or "ReportLab" in (m2.get("creator") or ""))


def main():
    dry = "--check" in sys.argv
    for p in PDFS:
        print("=== %s ===" % p.rsplit("/", 1)[-1])
        inspect(p)
        if sanitize(p, dry):
            print("  clean")
        else:
            print("  DIRTY")
    if dry:
        print("\n--check only.")


if __name__ == "__main__":
    sys.exit(main())