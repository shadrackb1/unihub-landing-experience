# UniHub — Extraction Accuracy Report

**Project:** UniHub — Verified Student Housing Discovery Platform  
**Group:** Group 8  
**Course:** KLS 126 — Data Science for Lawyers, Kabarak University  
**Date:** 21st October 2026  
**Version:** 1.0

---

## 1. Source Material

**Source:** Published university accommodation notices (public records under DPA 2019 s.28(2)(a))  
**Files:** 
- `data/public-source/hostel-accommodation-notices.sample.txt` — raw text sample
- `data/public-source/hostel-accommodation-notices.labels.json` — ground-truth labels

**Domain:** Kenyan university hostel listings (hostel name, campus, category, rent, capacity, distance)

---

## 2. Extraction Method

**Module:** `src/server/extraction.ts`

**Parsing approach:** Regex-based field extraction with structured pattern matching:
- `FIELD_SEP` regex (`:`) splits label/value pairs
- `parseMoney` extracts KES amounts (handles "Ksh", "KES", commas, spaces)
- `parseDistance` extracts kilometres (handles "km", "KM", "Km")
- `rentMatch` regex captures rent line with flexible formatting
- Hostel records delimited by blank lines; each field on its own line

**Fields extracted per record:**
- `hostelName` — string (required)
- `campus` — string (required, from known campus list)
- `category` — string (enum: Hostel, Bedsitter, Single Room, Studio, Shared Apartment)
- `rentKsh` — integer (required, in KES)
- `capacity` — integer (optional)
- `distanceKm` — float (optional)
- `sourceFile` — string (source filename)
- `sourceLine` — string (line reference in source)
- `confidence` — float (heuristic: 1.0 if all required fields parsed)

---

## 3. Test Methodology

**Test suite:** `tests/extraction.test.ts`

**Ground truth:** 10 labelled records in `hostel-accommodation-notices.labels.json`

**Evaluation:** `evaluateExtraction()` function compares extracted records against labels on exact field match for required fields, with tolerance for optional fields.

---

## 4. Results on Labelled Sample

| Metric | Value |
|--------|-------|
| **Precision** | 1.00 (10/10) |
| **Recall** | 1.00 (10/10) |
| **F1 Score** | 1.00 |
| **Field-level accuracy** | 100% on required fields |

**Detailed breakdown:**
- All 10 ground-truth records extracted correctly
- 0 false positives (no spurious records)
- 0 false negatives (no missed records)
- All required fields (hostelName, campus, category, rentKsh) exact match
- Optional fields (capacity, distanceKm) parsed where present

**Test output (from `npm test`):**
```
extraction.test.ts > precision on labelled sample === 1
extraction.test.ts > recall on labelled sample === 1
extraction.test.ts > f1 score on labelled sample === 1
extraction.test.ts > field-level accuracy === 1
extraction.test.ts > no spurious predictions
extraction.test.ts > no missed records
```

All 6 extraction tests pass.

---

## 5. Limitations & Caveats

1. **Sample size:** Only 10 labelled records. Not statistically representative of all Kenyan hostel notices.
2. **Source quality:** Sample notices follow a consistent template; real-world notices may vary in formatting.
3. **Regex fragility:** Pattern matching depends on consistent label formatting (e.g., "Hostel Name:", "Campus:", "Category:", "Rent:"). Deviations (typos, alternate labels) would reduce accuracy.
4. **No ML/NLP:** Pure regex — no learned model, so no generalisation beyond observed patterns.
5. **Confidence heuristic:** Current confidence is binary (1.0 if required fields present, else not stored). A graded confidence would be more informative.

---

## 6. Recommendations for Production

1. **Expand labelled set** to 50+ records covering format variations
2. **Add fuzzy matching** for campus names and categories
3. **Implement confidence scoring** per field (not just per record)
4. **Add validation rules** (e.g., rent ranges by campus, capacity plausibility)
5. **Log extraction failures** for manual review pipeline

---

## 7. Verification

- Tests run with: `npm test` (28 tests total, all pass)
- Extraction-specific: `npm run test:extraction`
- Source code: `src/server/extraction.ts`, `tests/extraction.test.ts`
- Ground truth: `data/public-source/hostel-accommodation-notices.labels.json`

---

*Report generated for CAT 1 submission. All figures derived from automated test suite against synthetic/public labelled sample.*