/**
 * Extraction tests.
 *
 * The extractor is pure, so these tests need no database. The accuracy
 * assertions run against the hand-labelled sample in
 * `data/public-source/hostel-accommodation-notices.labels.json`, which is
 * the same sample the accuracy report in `docs/EXTRACTION_ACCURACY.md`
 * quotes.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateExtraction,
  extractHostelRecords,
  type LabelledRecord,
} from "@/server/extraction";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const samplePath = path.join(
  repoRoot,
  "data/public-source/hostel-accommodation-notices.sample.txt",
);
const labelsPath = path.join(
  repoRoot,
  "data/public-source/hostel-accommodation-notices.labels.json",
);

const sampleText = readFileSync(samplePath, "utf8");
const labels = JSON.parse(readFileSync(labelsPath, "utf8")) as {
  records: LabelledRecord[];
};

const result = extractHostelRecords(sampleText, samplePath);

test("extracts one record per labelled hostel", () => {
  assert.equal(result.records.length, labels.records.length);
});

test("rejects the duplicate entry, the nameless line and the rentless line", () => {
  const reasons = result.rejected.map((entry) => entry.reason);
  assert.ok(reasons.some((reason) => reason.includes("duplicate")));
  assert.ok(reasons.some((reason) => reason.includes("missing hostel name")));
  assert.ok(reasons.some((reason) => reason.includes("rent")));
});

test("reads the rent written as 'Ksh 17,500/-' and as 'KSh 7,500 per year'", () => {
  const university = result.records.find(
    (record) => record.hostelName === "University Hostel",
  );
  assert.equal(university?.rentKsh, 17500);

  const lowerKabete = result.records.find(
    (record) => record.hostelName === "Lower Kabete Hostel",
  );
  assert.equal(lowerKabete?.rentKsh, 7500);
});

test("leaves a missing distance as null instead of guessing", () => {
  const harbour = result.records.find(
    (record) => record.hostelName === "Harbour Hostel",
  );
  assert.equal(harbour?.distanceKm, null);
  assert.equal(harbour?.capacity, 120);
});

test("keeps a campus name that contains a comma", () => {
  const annex = result.records.find(
    (record) => record.hostelName === "Muthangari Annex",
  );
  assert.equal(annex?.campus, "Kikuyu, Thika Road");
});

test("never invents a record from a prose line", () => {
  const names = result.records.map((record) => record.hostelName);
  assert.ok(!names.includes("Note: Payment must be made within 14 days of allocation."));
  assert.ok(!names.some((name) => name.includes("Payment")));
});

test("scores full precision and recall on the labelled sample", () => {
  const report = evaluateExtraction(result.records, labels.records);
  assert.equal(report.truePositives, labels.records.length);
  assert.equal(report.falsePositives, 0);
  assert.equal(report.falseNegatives, 0);
  assert.equal(report.precision, 1);
  assert.equal(report.recall, 1);
  assert.equal(report.f1, 1);
});

test("every field of every matched record is correct", () => {
  const report = evaluateExtraction(result.records, labels.records);
  for (const [field, stats] of Object.entries(report.fieldAccuracy)) {
    assert.equal(stats.correct, stats.checked, `field ${field} has an error`);
  }
});

test("a spurious prediction lowers precision and is reported", () => {
  const withSpurious = [
    ...result.records,
    {
      ...result.records[0],
      id: "spurious" as never,
      hostelName: "Ghost Hostel",
      campus: "Nowhere Campus",
    },
  ];
  const report = evaluateExtraction(withSpurious, labels.records);
  assert.equal(report.falsePositives, 1);
  assert.equal(report.truePositives, labels.records.length);
  assert.ok(report.precision < 1);
  assert.ok(report.unmatchedPredictions.some((entry) => entry.includes("Ghost Hostel")));
});

test("a record the extractor misses lowers recall and is reported", () => {
  // The extractor fails to find one of the labelled records.
  const reduced = result.records.filter(
    (record) => record.hostelName !== "Muthangari Annex",
  );
  const report = evaluateExtraction(reduced, labels.records);
  assert.equal(report.falseNegatives, 1);
  assert.equal(report.falsePositives, 0);
  assert.ok(report.recall < 1);
  assert.equal(report.missedRecords.length, 1);
  assert.ok(report.missedRecords[0].includes("Muthangari Annex"));
});
