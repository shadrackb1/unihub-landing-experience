#!/usr/bin/env python3
"""Sanitize a single PDF file - remove AI traces, metadata, producer strings."""

import sys
import fitz  # pymupdf
from pypdf import PdfReader, PdfWriter

def sanitize_pdf(input_path, output_path=None):
    if output_path is None:
        output_path = input_path

    TITLE = "UniHub Test Accounts - Verified Credentials"
    AUTHOR = "Shadrack Baraka Mwahanga"

    print(f"=== Sanitizing: {input_path} ===")

    # 1. pymupdf: rewrite Info dict, drop XMP
    doc = fitz.open(input_path)
    meta = doc.metadata
    meta["producer"] = "PDF 1.4"
    meta["creator"] = "PDF 1.4"
    meta["title"] = TITLE
    meta["author"] = AUTHOR
    doc.set_metadata(meta)

    # drop XMP if any
    try:
        xref = doc.xref_xml_metadata()
        if xref:
            doc.delete_xml_metadata()
    except Exception:
        pass

    tmp_path = input_path + ".tmp"
    doc.save(tmp_path, garbage=4, deflate=True)
    doc.close()

    # 2. pypdf: structural rewrite to drop header/trailer comments
    rdr = PdfReader(tmp_path)
    wrt = PdfWriter()
    for page in rdr.pages:
        wrt.add_page(page)

    if rdr.metadata:
        wrt.add_metadata({
            "/Title": TITLE,
            "/Author": AUTHOR,
            "/Producer": "PDF 1.4",
            "/Creator": "PDF 1.4",
        })

    final_path = input_path + ".final"
    wrt.write(final_path)

    import os
    os.replace(final_path, output_path)
    os.remove(tmp_path)

    # 3. verify
    doc2 = fitz.open(output_path)
    m2 = doc2.metadata
    print(f"  producer: {m2.get('producer')}")
    print(f"  creator: {m2.get('creator')}")
    print(f"  author: {m2.get('author')}")
    print(f"  title: {m2.get('title')}")

    with open(output_path, "rb") as f:
        raw = f.read()
    has_header = b"%ReportLab" in raw[:200]
    has_trailer = b"% ReportLab" in raw[-400:]
    print(f"  header comment: {'FAIL' if has_header else 'ok'}")
    print(f"  trailer comment: {'FAIL' if has_trailer else 'ok'}")
    doc2.close()

    clean = not (has_header or has_trailer or
                 "ReportLab" in (m2.get("producer") or "") or
                 "ReportLab" in (m2.get("creator") or ""))
    print(f"  Result: {'CLEAN' if clean else 'DIRTY'}")
    return clean

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python sanitize_single_pdf.py <input.pdf> [output.pdf]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    ok = sanitize_pdf(input_path, output_path)
    sys.exit(0 if ok else 1)