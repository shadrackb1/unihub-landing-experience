/**
 * Extraction of hostel records from a published accommodation notice.
 *
 * The notice format is the plain-text list published by university student
 * affairs offices. One record per line:
 *
 *   <name> - <category> - <campus> - KSh <rent> - <capacity> students - <distance> km
 *
 * A line is only turned into a record when the fields that make a record
 * usable are present: name, category, campus and rent. Capacity and distance
 * are optional. Lines that are prose, duplicated entries, or lines missing a
 * required field are rejected and reported, so the accuracy of the extractor
 * can be measured rather than assumed.
 *
 * The accuracy of this extractor is measured against a hand-labelled sample;
 * see `docs/EXTRACTION_ACCURACY.md`.
 */

export interface ExtractedRecord {
  hostelName: string;
  category: string;
  campus: string;
  rentKsh: number;
  capacity: number | null;
  distanceKm: number | null;
  sourceLine: string;
  lineNumber: number;
  /** Share of the expected fields that were found, 0–1. */
  confidence: number;
}

export interface RejectedLine {
  lineNumber: number;
  text: string;
  reason: string;
}

export interface ExtractionResult {
  records: ExtractedRecord[];
  rejected: RejectedLine[];
}

const CATEGORIES = ["Hostel", "Bedsitter", "Single Room", "Studio", "Shared Apartment"];

const FIELD_SEP = /\s+-\s+/;

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const value = Number.parseFloat(digits);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}

function parseDistance(raw: string): number | null {
  const match = /(\d+(?:\.\d+)?)\s*km/i.exec(raw);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) ? value : null;
}

/**
 * Extract hostel records from the text of an accommodation notice.
 */
export function extractHostelRecords(
  text: string,
  sourceFile: string,
): ExtractionResult {
  const records: ExtractedRecord[] = [];
  const rejected: RejectedLine[] = [];
  const seen = new Set<string>();

  const lines = text.split(/\r?\n/);
  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line) return;

    // A record line starts with a list number, e.g. "12. Harbour Hostel - ..."
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (!numbered) {
      if (/\bhostel\b|\bstudent\b|\bnotice\b/i.test(line)) {
        rejected.push({ lineNumber, text: line, reason: "prose line, not a listing" });
      }
      return;
    }

    const body = numbered[1].trim();
    const parts = body.split(FIELD_SEP).map((part) => part.trim());

    if (parts.length < 4) {
      rejected.push({
        lineNumber,
        text: line,
        reason: `expected at least 4 fields, found ${parts.length}`,
      });
      return;
    }

    const [firstField, categoryRaw, campusRaw, ...rest] = parts;
    const restText = rest.join(" - ");

    // A line whose name is missing begins with a bare "-", e.g.
    // "11. - Hostel - Main Campus - KSh 5,000 ...".
    const hostelName = firstField.startsWith("-") ? "" : firstField;

    if (!hostelName) {
      rejected.push({ lineNumber, text: line, reason: "missing hostel name" });
      return;
    }

    const category = CATEGORIES.find(
      (known) => known.toLowerCase() === categoryRaw.toLowerCase(),
    );
    if (!category) {
      rejected.push({
        lineNumber,
        text: line,
        reason: `unknown category "${categoryRaw}"`,
      });
      return;
    }

    if (!campusRaw) {
      rejected.push({ lineNumber, text: line, reason: "missing campus" });
      return;
    }

    // The rent must carry the currency marker. Without that requirement a
    // line such as "Capacity 30 students" would be read as a KSh 30 rent.
    const rentMatch = /ksh\s*([0-9][0-9,.]*)/i.exec(restText);
    const rentKsh = rentMatch ? parseMoney(rentMatch[1]) : null;
    if (rentKsh === null) {
      rejected.push({ lineNumber, text: line, reason: "missing or unreadable rent" });
      return;
    }

    const capacityMatch = /(\d+)\s*(?:students?|beds?|rooms?)/i.exec(restText);
    const capacity = capacityMatch ? Number.parseInt(capacityMatch[1], 10) : null;
    const distanceKm = parseDistance(restText);

    const key = `${hostelName.toLowerCase()}::${campusRaw.toLowerCase()}`;
    if (seen.has(key)) {
      rejected.push({ lineNumber, text: line, reason: "duplicate of an earlier entry" });
      return;
    }
    seen.add(key);

    const filled = [hostelName, category, campusRaw, rentKsh].length +
      (capacity !== null ? 1 : 0) +
      (distanceKm !== null ? 1 : 0);
    const confidence = Math.round((filled / 6) * 100) / 100;

    records.push({
      hostelName,
      category,
      campus: campusRaw,
      rentKsh,
      capacity,
      distanceKm,
      sourceLine: line,
      lineNumber,
      confidence,
    });
  });

  void sourceFile;
  return { records, rejected };
}

// ---------------------------------------------------------------------------
// Accuracy measurement
// ---------------------------------------------------------------------------

export interface LabelledRecord {
  hostelName: string;
  category: string;
  campus: string;
  rentKsh: number;
  capacity: number | null;
  distanceKm: number | null;
}

export interface AccuracyReport {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1: number;
  fieldAccuracy: Record<keyof LabelledRecord, { correct: number; checked: number }>;
  unmatchedPredictions: string[];
  missedRecords: string[];
}

function sameText(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function sameNumber(
  a: number | null,
  b: number | null,
): boolean | null {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return Math.abs(a - b) < 0.01;
}

/**
 * Compare extracted records against a hand-labelled sample.
 *
 * A prediction is a true positive when it matches a labelled record on the
 * key fields (name, category and campus). Field-level accuracy is then
 * measured across the matched pairs, including the fields that are only
 * present in one of the two.
 */
export function evaluateExtraction(
  predictions: ExtractedRecord[],
  labels: LabelledRecord[],
): AccuracyReport {
  const matchedLabels = new Set<number>();
  const fieldAccuracy: AccuracyReport["fieldAccuracy"] = {
    hostelName: { correct: 0, checked: 0 },
    category: { correct: 0, checked: 0 },
    campus: { correct: 0, checked: 0 },
    rentKsh: { correct: 0, checked: 0 },
    capacity: { correct: 0, checked: 0 },
    distanceKm: { correct: 0, checked: 0 },
  };

  let truePositives = 0;
  const unmatchedPredictions: string[] = [];

  for (const prediction of predictions) {
    const index = labels.findIndex(
      (label, labelIndex) =>
        !matchedLabels.has(labelIndex) &&
        sameText(label.hostelName, prediction.hostelName) &&
        sameText(label.category, prediction.category) &&
        sameText(label.campus, prediction.campus),
    );

    if (index === -1) {
      unmatchedPredictions.push(
        `${prediction.hostelName} (${prediction.campus}) — line ${prediction.lineNumber}`,
      );
      continue;
    }

    matchedLabels.add(index);
    truePositives += 1;
    const label = labels[index];

    const checks: Array<[keyof LabelledRecord, boolean]> = [
      ["hostelName", sameText(label.hostelName, prediction.hostelName)],
      ["category", sameText(label.category, prediction.category)],
      ["campus", sameText(label.campus, prediction.campus)],
      ["rentKsh", sameNumber(label.rentKsh, prediction.rentKsh) === true],
      ["capacity", sameNumber(label.capacity, prediction.capacity) === true],
      ["distanceKm", sameNumber(label.distanceKm, prediction.distanceKm) === true],
    ];
    for (const [field, ok] of checks) {
      fieldAccuracy[field].checked += 1;
      if (ok) fieldAccuracy[field].correct += 1;
    }
  }

  const falsePositives = unmatchedPredictions.length;
  const missedRecords = labels
    .map((label, index) => ({ label, index }))
    .filter(({ index }) => !matchedLabels.has(index))
    .map(({ label }) => `${label.hostelName} (${label.campus})`);
  const falseNegatives = missedRecords.length;

  const precision =
    truePositives + falsePositives === 0
      ? 0
      : truePositives / (truePositives + falsePositives);
  const recall =
    truePositives + falseNegatives === 0
      ? 0
      : truePositives / (truePositives + falseNegatives);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return {
    truePositives,
    falsePositives,
    falseNegatives,
    precision: Math.round(precision * 1000) / 1000,
    recall: Math.round(recall * 1000) / 1000,
    f1: Math.round(f1 * 1000) / 1000,
    fieldAccuracy,
    unmatchedPredictions,
    missedRecords,
  };
}
