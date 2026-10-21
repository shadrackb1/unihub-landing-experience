"""Replace em/en dashes in the three consent-form generators.

The generators disagree on how they spell the character: create_consent_bw.py
writes the six-character escape \\u2014 inside its literals, while the other two
carry the real U+2014. Each pattern is therefore applied twice, once per form.

Replacements are contextual, not a blanket swap to commas, so the legal
register survives. Nothing is written unless every pattern lands and zero
dashes remain, in both forms, anywhere in the file.
"""

import io
import sys

SCRIPTS = [
    "C:/Users/ADMIN/unihub-landing-experience/scripts/create_consent_bw.py",
    "C:/Users/ADMIN/unihub-landing-experience/scripts/create_consent_professional.py",
    "C:/Users/ADMIN/unihub-landing-experience/scripts/create_consent_times.py",
]

EM = "\u2014"
EN = "\u2013"
ESC = chr(92)
ESC_EM = ESC + "u2014"
ESC_EN = ESC + "u2013"

# (pattern, replacement, expected hits per file). {D} is an em dash, {N} an en dash.
RAW = [
    ("UniHub {D} Verified Student Housing Platform", "UniHub: Verified Student Housing Platform", 1),
    ("KLS 126 {D} Data Science for Lawyers", "KLS 126: Data Science for Lawyers", 1),
    ("Internal {D} For CAT Submission", "Internal (For CAT Submission)", 1),
    ("(Founder) {D} shadrack@unihub.ke", "(Founder), shadrack@unihub.ke", 1),
    ("GitHub (US) {D} SCCs + supplementary", "GitHub (US), SCCs + supplementary", 1),
    ("None {D} no profiling", "None: no profiling", 1),
    ("verification only {D} <b>never shown publicly</b>", "verification only, <b>never shown publicly</b>", 1),
    ("verification only {D} never shown publicly", "verification only, never shown publicly", 1),
    ("(request times, errors) {D} no personal data", "(request times, errors), no personal data", 1),
    ("open external apps {D} UniHub does ", "open external apps. UniHub does ", 1),
    ("no personal data {D} property attributes only", "no personal data, property attributes only", 1),
    ("Not processors {D} no personal data transmitted", "Not processors: no personal data transmitted", 1),
    ("by design {D} UniHub facilitates", "by design. UniHub facilitates", 1),
    ("data minimisation {D} only public business listings", "data minimisation: only public business listings", 1),
    ("access/portability {D} well within", "access/portability, well within", 1),
    # rights list, times script only
    ("Data Protection Act, 2019 {D} Sections 26, 29{N}32",
     "Data Protection Act, 2019, Sections 26 and 29 to 32", 1),
    ("Right to be informed {D} this form", "Right to be informed: this form", 1),
    ("Right of access {D} request a copy", "Right of access: request a copy", 1),
    ("Right to rectification {D} request correction", "Right to rectification: request correction", 1),
    ("Right to erasure {D} request account closure", "Right to erasure: request account closure", 1),
    ("Right to object {D} object to processing", "Right to object: object to processing", 1),
    ("Right to data portability {D} receive your listing data", "Right to data portability: receive your listing data", 1),
    ("Right to withdraw consent {D} at any time", "Right to withdraw consent: at any time", 1),
    # en dashes
    ("Sections 26, 29{N}32 of the Data Protection Act 2019",
     "Sections 26 and 29 to 32 of the Data Protection Act 2019", 1),
    ("Data Protection Act, 2019 {D} Sections 26, 29{N}32",
     "Data Protection Act, 2019, Sections 26 and 29 to 32", 1),
]


def variants(pattern):
    """Yield the pattern with each dash placeholder replaced, in both the
    literal and the escaped spelling. A pattern holding both {D} and {N}
    needs all four combinations, so expand them independently."""
    outs = [pattern]
    if "{D}" in pattern:
        outs = [p.replace("{D}", ch) for p in outs for ch in (EM, ESC_EM)]
    if "{N}" in pattern:
        outs = [p.replace("{N}", ch) for p in outs for ch in (EN, ESC_EN)]
    return outs


def count_any(src, needle):
    n = 0
    for old in variants(needle):
        n += src.count(old)
    return n


def process(path, dry):
    src = io.open(path, encoding="utf-8").read()
    original = src
    report = []

    for pattern, replacement, expected in RAW:
        hits = 0
        for old in variants(pattern):
            n = src.count(old)
            if n:
                src = src.replace(old, replacement)
                hits += n
        if hits:
            report.append((pattern, hits, expected))

    left_em = src.count(EM) + src.count(ESC_EM)
    left_en = src.count(EN) + src.count(ESC_EN)

    name = path.rsplit("/", 1)[-1]
    print("=== %s ===" % name)
    for pattern, hits, expected in report:
        label = pattern.replace("{D}", "<em>").replace("{N}", "<en>")
        flag = "ok " if hits == expected else "FAIL"
        print("  [%s] x%d %s" % (flag, hits, label[:70]))
    print("  em remaining: %d   en remaining: %d" % (left_em, left_en))

    if left_em or left_en or not report:
        for i, line in enumerate(src.split("\n"), 1):
            if EM in line or EN in line or ESC_EM in line or ESC_EN in line:
                print("    LEFTOVER %4d: %s" % (i, line.encode("ascii", "replace").decode("ascii")))
        print("  ABORT: %s not clean" % name)
        return False

    if not dry and src != original:
        io.open(path, "w", encoding="utf-8", newline="").write(src)
        print("  written")
    return True


def main():
    dry = "--check" in sys.argv
    ok = True
    for p in SCRIPTS:
        ok = process(p, dry) and ok
    if dry:
        print("\n--check only.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
