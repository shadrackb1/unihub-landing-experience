"""Remove AI traces and tool metadata from the DPIA .docx.

Three passes:
  1. Prose  - em dashes, en dashes and curly quotes replaced with plain
              punctuation. Every replacement is asserted, so a pattern that
              silently stops matching fails the run instead of passing quietly.
  2. Metadata - keep dc:creator (the real author), drop the LibreOffice
              application string, its embedded git hash, TotalTime, revision
              counter and lastModifiedBy.
  3. Package - drop docProps/custom.xml entirely (LibreOffice writes
              Converter/Producer/Creator/Created/LastSaved there) and remove
              its Content_Types override and .rels relationship so the
              package stays valid.

Nothing here is destructive: the original is copied to a backup first.
Every print is ASCII-only because this shell is cp1252.
"""

import io
import os
import re
import shutil
import sys
import zipfile

SRC = "C:/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group1_CAT3_DPIA.docx"
BACKUP_DIR = "C:/Users/ADMIN/.claude/jobs/d5eade3d/tmp/docx_backup"
EM = "\u2014"
EN = "\u2013"

# ---------------------------------------------------------------- prose pass
# Each entry is (pattern, replacement, expected_hits). Patterns must sit inside
# a single <w:t> text node. Verified: no dash in this document is split across
# runs, so plain substring replacement is safe.
REPLACEMENTS = [
    # --- cover / control table
    ("UniHub " + EM + " Verified Student Housing Platform",
     "UniHub: Verified Student Housing Platform", 1),
    ("Founder &amp; Developer " + EM + " shadrack@unihub.ke",
     "Founder &amp; Developer (shadrack@unihub.ke)", 1),
    ("1.0 " + EM + " Internal review prior to public launch",
     "1.0 (Internal review prior to public launch)", 1),
    ("Internal " + EM + " KLS 126 CAT Submission",
     "Internal (KLS 126 CAT Submission)", 1),

    # --- screening criteria
    ("number of data subjects " + EM + " potentially large",
     "number of data subjects: potentially large", 1),
    ("range of data items " + EM + " minimal",
     "range of data items: minimal", 1),
    ("(c) duration " + EM + " listing data retained",
     "(c) duration: listing data retained", 1),
    ("geographical extent " + EM + " Kenya-wide",
     "geographical extent: Kenya-wide", 1),

    # --- part 1 description
    ("UniHub " + EM + " Verified student housing discovery platform",
     "UniHub: Verified student housing discovery platform", 1),
    ("Students browsing " + EM + " no personal data collected",
     "Students browsing: no personal data collected", 1),
    ("listings are published " + EM + " data provided off-platform",
     "listings are published: data provided off-platform", 1),
    ("Website visitors " + EM + " no personal data collected",
     "Website visitors: no personal data collected", 1),
    ("~6" + EN + "50 live listings", "~6-50 live listings", 1),
    ("and Esri (US) " + EM + " public, keyless, no auth",
     "and Esri (US): public, keyless, no auth", 1),

    # --- principles
    ("(section 30(1)(f)) " + EM + " data is business contact",
     "(section 30(1)(f)): data is business contact", 1),
    ("deposit, images) " + EM + " all public-facing by design",
     "deposit, images), all public-facing by design", 1),

    # --- alternatives considered
    ("wa.me: links " + EM + " handled by browser",
     "wa.me: links, handled by browser", 1),
    ("external contact " + EM + " Selected", "external contact (Selected)", 1),
    ("accounts/payments " + EM + " Rejected:", "accounts/payments (Rejected):", 1),
    ("Aggregator scraping " + EM + " Rejected:", "Aggregator scraping (Rejected):", 1),
    ("Lead-generation " + EM + " Rejected:", "Lead-generation (Rejected):", 1),
    ("GitHub PR/review " + EM + " audit trail via Git",
     "GitHub PR/review, with an audit trail via Git", 1),

    # --- processors
    ("not processors " + EM + " public, keyless", "not processors: public, keyless", 1),
    ("Vercel: processor " + EM + " hosting",
     "Vercel: processor for hosting", 1),
    ("GitHub: processor " + EM + " source control",
     "GitHub: processor for source control", 1),
    ("not processors " + EM + " public tile servers",
     "not processors: public tile servers", 1),
    ("data subjects " + EM + " provide property data off-platform",
     "data subjects who provide property data off-platform", 1),

    # --- transfers
    ("Vercel (US/iad1) " + EM + " listing data",
     "Vercel (US/iad1) for listing data", 1),
    ("GitHub (US) " + EM + " source code + listings",
     "GitHub (US) for source code + listings", 1),
    ("Map tile CDNs (global) " + EM + " public requests",
     "Map tile CDNs (global) for public requests", 1),
    ("published publicly " + EM + " that is its purpose",
     "published publicly. That is its purpose", 1),
    ("search being visible " + EM + " but UniHub does not see",
     "search being visible, but UniHub does not see", 1),

    # --- risk register
    ("remains live " + EM + " property rented", "remains live: property rented", 1),
    ("account compromise " + EM + " attacker modifies",
     "account compromise: attacker modifies", 1),
    ("wa.me/ and mailto: " + EM + " student sees destination",
     "wa.me/ and mailto:, so the student sees the destination", 1),
    ("uses platform " + EM + " though no data collected",
     "uses platform: though no data collected", 1),

    # --- version history
    ("Initial assessment " + EM + " updated with comprehensive",
     "Initial assessment, updated with comprehensive", 1),

    # --- residual scores
    ("are 1" + EN + "2 (Low)", "are 1-2 (Low)", 1),
]

CURLY = {"\u201c": '"', "\u201d": '"', "\u2019": "'", "\u2018": "'"}


def fix_text_node_text(text):
    """Return (new_text, hits) applying the ordered replacement list."""
    hits = []
    for old, new, _expected in REPLACEMENTS:
        n = text.count(old)
        if n:
            text = text.replace(old, new)
            hits.append((old, n))
    for bad, good in CURLY.items():
        if bad in text:
            n = text.count(bad)
            text = text.replace(bad, good)
            hits.append((bad, n))
    return text, hits


def patch_word_part(xml):
    """Apply prose fixes only inside <w:t> elements, never in attributes or tags."""
    applied = {}

    def repl(m):
        open_tag, inner, close_tag = m.group(1), m.group(2), m.group(3)
        new_inner, hits = fix_text_node_text(inner)
        for k, v in hits:
            applied[k] = applied.get(k, 0) + v
        return open_tag + new_inner + close_tag

    pattern = re.compile(r"(<w:t(?:\s[^>]*)?>)(.*?)(</w:t>)", re.DOTALL)
    return pattern.sub(repl, xml), applied


def patch_core(xml):
    """Keep the author, drop the machine-written fields."""
    xml = re.sub(r"<cp:lastModifiedBy\s*/>", "<cp:lastModifiedBy/>", xml)
    xml = re.sub(r"<cp:lastModifiedBy>.*?</cp:lastModifiedBy>", "<cp:lastModifiedBy/>", xml)
    xml = re.sub(r"<cp:revision>.*?</cp:revision>", "", xml)
    return xml


def patch_app(xml):
    """Strip the LibreOffice identifier, its build hash and the edit-time counter."""
    for tag in ("Application", "AppVersion", "TotalTime"):
        xml = re.sub(r"<" + tag + r">.*?</" + tag + r">", "", xml, flags=re.DOTALL)
    return xml


def main():
    dry = "--check" in sys.argv
    if not os.path.exists(SRC):
        print("MISSING: " + SRC)
        return 1

    if not dry:
        os.makedirs(BACKUP_DIR, exist_ok=True)
        shutil.copy2(SRC, os.path.join(BACKUP_DIR, os.path.basename(SRC)))

    zin = zipfile.ZipFile(SRC, "r")
    names = zin.namelist()
    parts = {n: zin.read(n) for n in names}
    zin.close()

    before_t_nodes = len(re.findall(rb"<w:t[ >]", parts["word/document.xml"]))
    total_applied = {}

    # --- prose pass over every word part
    for name in names:
        if not name.startswith("word/") or not name.endswith(".xml"):
            continue
        xml = parts[name].decode("utf-8")
        new_xml, applied = patch_word_part(xml)
        for k, v in applied.items():
            total_applied[k] = total_applied.get(k, 0) + v
        parts[name] = new_xml.encode("utf-8")

    # --- metadata pass
    parts["docProps/core.xml"] = patch_core(parts["docProps/core.xml"].decode("utf-8")).encode("utf-8")
    parts["docProps/app.xml"] = patch_app(parts["docProps/app.xml"].decode("utf-8")).encode("utf-8")

    # --- report and assert the prose pass
    print("=== PROSE REPLACEMENTS ===")
    missing = []
    for old, new, expected in REPLACEMENTS:
        got = total_applied.get(old, 0)
        flag = "ok " if got == expected else "FAIL"
        if got != expected:
            missing.append((old, expected, got))
        label = old.replace(EM, "<em>").replace(EN, "<en>")
        print("  [%s] x%d expected %d  %s" % (flag, got, expected, label[:78]))
    curly_total = sum(v for k, v in total_applied.items() if k in CURLY)
    print("  [%s] curly quotes/apostrophes converted: %d" % ("ok " if curly_total == 12 else "note", curly_total))

    after_t_nodes = len(re.findall(rb"<w:t[ >]", parts["word/document.xml"]))
    if before_t_nodes != after_t_nodes:
        print("  FAIL text-node count changed: %d -> %d" % (before_t_nodes, after_t_nodes))
        return 1
    print("  ok  text-node count unchanged: %d" % before_t_nodes)

    doc = parts["word/document.xml"].decode("utf-8")
    left_em, left_en = doc.count(EM), doc.count(EN)
    print("  %s em dashes remaining: %d" % ("ok " if left_em == 0 else "FAIL", left_em))
    print("  %s en dashes remaining: %d" % ("ok " if left_en == 0 else "FAIL", left_en))

    if missing:
        print("\nABORT: %d pattern(s) did not match cleanly. Nothing written." % len(missing))
        for old, exp, got in missing:
            print("   expected %d got %d: %s" % (exp, got, old.replace(EM, "<em>")[:90]))
        return 1

    if dry:
        print("\n--check only, nothing written.")
        return 0

    # --- package pass: drop custom.xml and every reference to it
    ct = parts["[Content_Types].xml"].decode("utf-8")
    ct = re.sub(r'<Override PartName="/docProps/custom\.xml"[^>]*/>', "", ct)
    parts["[Content_Types].xml"] = ct.encode("utf-8")

    rels = parts["_rels/.rels"].decode("utf-8")
    rels = re.sub(r'<Relationship[^>]*Target="docProps/custom\.xml"[^>]*/>', "", rels)
    parts["_rels/.rels"] = rels.encode("utf-8")

    out = SRC + ".tmp"
    zout = zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED)
    for n in names:
        if n == "docProps/custom.xml":
            continue
        zout.writestr(n, parts[n])
    zout.close()
    os.replace(out, SRC)

    print("\n=== METADATA ===")
    z = zipfile.ZipFile(SRC)
    print("  parts now: %d (was %d)" % (len(z.namelist()), len(names)))
    print("  custom.xml present: %s" % ("docProps/custom.xml" in z.namelist()))
    core = z.read("docProps/core.xml").decode()
    print("  dc:creator kept: %s" % ("Shadrack Baraka Mwahanga" in core))
    print("  revision present: %s" % ("cp:revision" in core))
    app = z.read("docProps/app.xml").decode()
    print("  Application present: %s" % ("<Application>" in app))
    print("  TotalTime present: %s" % ("<TotalTime>" in app))
    z.close()
    print("\nWritten: " + SRC)
    return 0


if __name__ == "__main__":
    sys.exit(main())
