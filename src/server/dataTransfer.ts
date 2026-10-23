/**
 * Import and export of platform data.
 *
 * Exports are written as CSV so a person exercising the right to data
 * portability (Act, 2019 s.38) receives a structured, commonly used and
 * machine-readable file, and so an administrator can move data between
 * environments.
 *
 * Two rules are enforced here rather than left to the caller:
 *   1. A field that is never published — the national ID number, the review
 *      note, the session details — is never written to an export.
 *   2. An import is validated before anything is stored. A row that fails
 *      validation is reported and skipped; it is never stored half-made.
 */
import { prisma } from "@/server/db";
import { consentToCsv, listConsentForEmail } from "@/server/consent";

// Re-export consent functions for the data export API
export { consentToCsv, listConsentForEmail };

const ESCAPE_NEEDED = /[",\n\r]/;

export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return ESCAPE_NEEDED.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(headers: readonly string[], rows: Record<string, unknown>[]): string {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvCell(row[header])).join(","));
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const LISTING_EXPORT_COLUMNS = [
  "id",
  "title",
  "category",
  "location",
  "priceKsh",
  "depositKsh",
  "university",
  "distanceFromCampus",
  "amenities",
  "status",
  "isVerified",
  "createdAt",
] as const;

export const EXTRACTED_EXPORT_COLUMNS = [
  "id",
  "hostelName",
  "campus",
  "category",
  "rentKsh",
  "capacity",
  "distanceKm",
  "sourceFile",
  "sourceLine",
  "confidence",
  "importedAt",
] as const;

interface ListingRow {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  deposit: number;
  university: string | null;
  distanceFromCampus: string | null;
  amenities: string;
  status: string;
  isVerified: boolean;
  createdAt: Date;
}

/**
 * Listings as CSV. Only fields a student can already see are included.
 * The landlord's national ID number and review notes are deliberately absent.
 */
export async function exportListingsCsv(): Promise<string> {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      category: true,
      location: true,
      price: true,
      deposit: true,
      university: true,
      distanceFromCampus: true,
      amenities: true,
      status: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return toCsv(
    LISTING_EXPORT_COLUMNS,
    listings.map((listing: ListingRow) => ({
      id: listing.id,
      title: listing.title,
      category: listing.category,
      location: listing.location,
      priceKsh: listing.price,
      depositKsh: listing.deposit,
      university: listing.university ?? "",
      distanceFromCampus: listing.distanceFromCampus ?? "",
      amenities: listing.amenities,
      status: listing.status,
      isVerified: listing.isVerified,
      createdAt: listing.createdAt,
    })),
  );
}

/** Imported hostel records as CSV. */
export async function exportExtractedRecordsCsv(): Promise<string> {
  const records = await prisma.extractedHostelRecord.findMany({
    orderBy: [{ campus: "asc" }, { hostelName: "asc" }],
  });

  return toCsv(
    EXTRACTED_EXPORT_COLUMNS,
    records.map((record) => ({
      id: record.id,
      hostelName: record.hostelName,
      campus: record.campus,
      category: record.category,
      rentKsh: record.rentKsh,
      capacity: record.capacity ?? "",
      distanceKm: record.distanceKm ?? "",
      sourceFile: record.sourceFile,
      sourceLine: record.sourceLine,
      confidence: record.confidence ?? "",
      importedAt: record.importedAt,
    })),
  );
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export interface ImportRowError {
  line: number;
  reason: string;
  value: string;
}

export interface ImportResult {
  /** Rows that were stored or updated. */
  accepted: number;
  /** Rows that were skipped, with the reason. */
  rejected: number;
  errors: ImportRowError[];
}

const IMPORT_COLUMNS = [
  "hostelName",
  "campus",
  "category",
  "rentKsh",
  "capacity",
  "distanceKm",
  "sourceFile",
  "sourceLine",
] as const;

const VALID_CATEGORIES = new Set([
  "Hostel",
  "Bedsitter",
  "Single Room",
  "Studio",
  "Shared Apartment",
]);

/** Split one CSV line, honouring quoted fields that contain a comma. */
export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (inQuotes) {
      if (character === '"') {
        if (line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += character;
      }
      continue;
    }
    if (character === '"') {
      inQuotes = true;
      continue;
    }
    if (character === ",") {
      cells.push(current);
      current = "";
      continue;
    }
    current += character;
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function toOptionalNumber(value: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Import hostel records from CSV.
 *
 * The header row is required and must name the expected columns; extra
 * columns are ignored, missing ones are an error. Every row is validated
 * before it is stored.
 */
export async function importExtractedRecordsCsv(csv: string): Promise<ImportResult> {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const result: ImportResult = { accepted: 0, rejected: 0, errors: [] };
  if (lines.length === 0) {
    result.errors.push({ line: 0, reason: "the file is empty", value: "" });
    result.rejected += 1;
    return result;
  }

  const firstLine = lines[0] ?? "";
  const header = parseCsvLine(firstLine).map((cell) => cell.toLowerCase());
  const missing = IMPORT_COLUMNS.filter((column) => !header.includes(column.toLowerCase()));
  if (missing.length > 0) {
    result.errors.push({
      line: 1,
      reason: `missing required column(s): ${missing.join(", ")}`,
      value: firstLine,
    });
    result.rejected += 1;
    return result;
  }

  const indexOf = (column: string) => header.indexOf(column.toLowerCase());

  for (let offset = 1; offset < lines.length; offset += 1) {
    const lineNumber = offset + 1;
    const cells = parseCsvLine(lines[offset] ?? "");

    const getValue = (column: string): string => cells[indexOf(column)] ?? "";

    const hostelName = getValue("hostelName");
    const campus = getValue("campus");
    const category = getValue("category");
    const rentKshValue = getValue("rentKsh");
    const rentKsh = toOptionalNumber(rentKshValue);

    if (!hostelName) {
      result.rejected += 1;
      const lineValue = lines[offset] ?? "";
      result.errors.push({
        line: lineNumber,
        reason: "the hostel name is missing",
        value: lineValue,
      });
      continue;
    }
    if (!campus) {
      result.rejected += 1;
      const lineValue = lines[offset] ?? "";
      result.errors.push({ line: lineNumber, reason: "the campus is missing", value: lineValue });
      continue;
    }
    if (!VALID_CATEGORIES.has(category)) {
      result.rejected += 1;
      const lineValue = lines[offset] ?? "";
      result.errors.push({
        line: lineNumber,
        reason: `unknown category "${category}"`,
        value: lineValue,
      });
      continue;
    }
    if (rentKsh === null || rentKsh <= 0) {
      result.rejected += 1;
      const lineValue = lines[offset] ?? "";
      result.errors.push({
        line: lineNumber,
        reason: "the rent is missing or is not a number",
        value: lineValue,
      });
      continue;
    }

    const capacityValue = toOptionalNumber(getValue("capacity"));
    const distanceKmValue = toOptionalNumber(getValue("distanceKm"));

    const createData: Record<string, unknown> = {
      hostelName,
      campus,
      category,
      rentKsh: Math.round(rentKsh),
      sourceFile: getValue("sourceFile") || "import",
      sourceLine: getValue("sourceLine") || `line ${lineNumber}`,
      confidence: 1,
    };
    if (capacityValue !== null) createData["capacity"] = capacityValue;
    if (distanceKmValue !== null) createData["distanceKm"] = distanceKmValue;

    const updateData: Record<string, unknown> = {
      category,
      rentKsh: Math.round(rentKsh),
      sourceFile: getValue("sourceFile") || "import",
      sourceLine: getValue("sourceLine") || `line ${lineNumber}`,
    };
    if (capacityValue !== null) updateData["capacity"] = capacityValue;
    if (distanceKmValue !== null) updateData["distanceKm"] = distanceKmValue;

    await prisma.extractedHostelRecord.upsert({
      where: { hostelName_campus: { hostelName, campus } },
      create: createData as Parameters<typeof prisma.extractedHostelRecord.upsert>[0]["create"],
      update: updateData as Parameters<typeof prisma.extractedHostelRecord.upsert>[0]["update"],
    });

    result.accepted += 1;
  }

  return result;
}
