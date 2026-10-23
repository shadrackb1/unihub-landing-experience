/**
 * Pre-publication checklist.
 *
 * Before UniHub takes a landlord live, every line below has to be true. The
 * checklist is generated from the same source as `docs/PRE_PUBLICATION_CHECKLIST.md`
 * and the admin page, so the document and the app cannot drift apart.
 *
 * Citations are to the Data Protection Act, 2019 (Act No. 24 of 2019) and the
 * Data Protection (General) Regulations, 2021 (Legal Notice No. 263 of 2021).
 */

export type ChecklistStatus = "met" | "partly" | "not-met";

export interface ChecklistItem {
  id: string;
  requirement: string;
  /** Where the Act or Regulations require this. */
  authority: string;
  /** What the platform does about it. */
  control: string;
  /** The file in the repository that shows the control. */
  evidence: string;
  status: ChecklistStatus;
}

export const PRE_PUBLICATION_CHECKLIST: ChecklistItem[] = [
  {
    id: "lawful-basis",
    requirement:
      "Every processing operation has one lawful basis, and a second basis is not leaned on for the same operation.",
    authority: "Act s.30(1); Regulations reg. 5(2)",
    control:
      "Each consent purpose states its lawful basis. Legitimate interests are cited as s.30(1)(b)(vii), not as a sub-paragraph that does not exist.",
    evidence: "src/shared/consentPurposes.ts",
    status: "met",
  },
  {
    id: "purpose-limitation",
    requirement:
      "Personal data is collected for explicit, specified purposes and is not further processed incompatibly with them.",
    authority: "Act s.25(c); s.30(2)",
    control:
      "The four consent purposes are fixed in one catalogue, and the catalogue is also what is written to every consent record.",
    evidence: "src/shared/consentPurposes.ts",
    status: "met",
  },
  {
    id: "data-minimisation",
    requirement: "Only the personal data that is necessary for the stated purpose is collected.",
    authority: "Act s.25(d)",
    control:
      "The national ID number is held for verification only, is never published, and is excluded from every export.",
    evidence: "src/shared/dataDictionary.ts; src/server/dataTransfer.ts",
    status: "met",
  },
  {
    id: "accuracy",
    requirement:
      "Personal data is accurate and kept up to date, and inaccurate data is rectified without delay.",
    authority: "Act s.25(f); s.40",
    control:
      "Landlords confirm the accuracy of their details on the consent screen and can update them; reviewers can suspend an account whose details do not match.",
    evidence: "src/routes/consent.tsx; prisma/schema.prisma",
    status: "met",
  },
  {
    id: "storage-limitation",
    requirement:
      "Personal data is kept no longer than is necessary, and is deleted at the end of the retention period.",
    authority: "Act s.25(g); s.39",
    control:
      "Every field in the data dictionary carries a retention period, and the export tooling states the retention for each dataset it writes.",
    evidence: "src/shared/dataDictionary.ts",
    status: "met",
  },
  {
    id: "transfers",
    requirement:
      "Personal data is not transferred outside Kenya without proof of adequate safeguards or the data subject's consent.",
    authority: "Act s.25(h); s.48; s.49",
    control:
      "The consent screen states the transfer risks and the safeguards relied on, and names the processors and the locations.",
    evidence: "src/routes/consent.tsx",
    status: "met",
  },
  {
    id: "notice",
    requirement:
      "Before collecting personal data, the person is told the rights, the purposes, the third parties, the security measures and the consequences of not providing the data.",
    authority: "Act s.29(a)–(h)",
    control:
      "Each of the eight items in s.29 is answered on the consent screen and in the written consent form.",
    evidence: "src/routes/consent.tsx; docs/CONSENT_FORM.md",
    status: "met",
  },
  {
    id: "consent-specific",
    requirement:
      "Consent is specific to each purpose, freely given, and never bundled across purposes.",
    authority: "Act s.32; Regulations reg. 4(3)–(4)",
    control:
      "Every purpose has its own tick box, pre-ticked boxes are not accepted by the server, and a grant writes one record per purpose.",
    evidence: "src/shared/consentPurposes.ts; src/server/consent.ts; tests/consent.test.ts",
    status: "met",
  },
  {
    id: "consent-proof",
    requirement: "The controller can show that consent was given, and when.",
    authority: "Act s.32(1); s.32(3)",
    control:
      "Each record stores the exact wording shown, the version of that wording, the date and time of the grant, and the date and time of any withdrawal. A withdrawal is recorded rather than deleted.",
    evidence: "src/server/consent.ts; prisma/schema.prisma",
    status: "met",
  },
  {
    id: "consent-withdrawal",
    requirement:
      "Consent can be withdrawn at any time, and withdrawing one part of the processing restricts that part.",
    authority: "Act s.32(2)–(3); Regulations reg. 4(5)",
    control:
      "The consent screen has a withdraw control for every purpose and for all purposes at once, and each withdrawal is timestamped.",
    evidence: "src/server/consent.ts; src/routes/consent.tsx",
    status: "met",
  },
  {
    id: "rights",
    requirement:
      "The person can be informed of the use, access their data, object, have false data corrected, and have data erased.",
    authority: "Act s.26(a)–(e); s.36; s.40",
    control:
      "The consent screen and the privacy policy set out each right with its section number, and the access, export and deletion routes are served to the signed-in person.",
    evidence: "src/routes/privacy.tsx; src/routes/api/consent.ts",
    status: "met",
  },
  {
    id: "portability",
    requirement:
      "The person can receive their data in a structured, commonly used, machine-readable format.",
    authority: "Act s.38",
    control:
      "The export route writes CSV for the person's own consent records and for the platform data an administrator is allowed to export.",
    evidence: "src/server/dataTransfer.ts; src/routes/api/data/export.ts",
    status: "met",
  },
  {
    id: "complaint",
    requirement: "The person can complain to the Data Commissioner.",
    authority: "Act s.56",
    control:
      "The privacy policy and the consent form name the Office of the Data Protection Commissioner and how to reach it.",
    evidence: "src/routes/privacy.tsx; docs/CONSENT_FORM.md",
    status: "met",
  },
  {
    id: "privacy-by-design",
    requirement:
      "Appropriate technical and organisational measures are designed into the processing.",
    authority: "Act s.41; s.42",
    control:
      "Role checks run on the server for every protected route, the role is read from the database rather than the request, and the database file is not published with the source code.",
    evidence: "src/server/authz.ts; tests/authz.test.ts",
    status: "met",
  },
  {
    id: "breach",
    requirement:
      "A breach of security of personal data is notified to the Data Commissioner and communicated to affected people.",
    authority: "Act s.43; Regulations regs. 37–38",
    control:
      "The breach procedure is written down in the privacy policy: who decides, what is notified and within what period.",
    evidence: "docs/DPIA-UniHub.md; src/routes/privacy.tsx",
    status: "partly",
  },
  {
    id: "no-automated-decisions",
    requirement: "No decision is taken about a person by automated means alone.",
    authority: "Act s.35",
    control:
      "The platform does not profile, score or auto-approve a landlord; every approval is a human decision recorded in the review note.",
    evidence: "prisma/schema.prisma; src/features/admin",
    status: "met",
  },
  {
    id: "children",
    requirement: "A child's data is not processed without the parent's or guardian's consent.",
    authority: "Act s.33",
    control:
      "The consent screen asks the person to confirm they are 18 or over, and the platform refuses to accept a consent from anyone under 18.",
    evidence: "src/routes/consent.tsx",
    status: "met",
  },
  {
    id: "children-not-targeted",
    requirement: "The service is not directed at children and no child is knowingly onboarded.",
    authority: "Act s.33(1); Regulations reg. 13",
    control:
      "The platform is a student housing service for university students; the age confirmation is a required tick box, not an optional one.",
    evidence: "src/routes/consent.tsx",
    status: "partly",
  },
  {
    id: "public-source-collection",
    requirement: "Data collected from a source other than the person is justified.",
    authority: "Act s.28(2)–(3)",
    control:
      "The only indirect collection is from published university accommodation notices, which are public records under s.28(2)(a). The importer keeps the source file and line for every value it stores.",
    evidence: "src/server/extraction.ts; data/public-source",
    status: "met",
  },
  {
    id: "secrets",
    requirement: "No secret is committed to the repository.",
    authority: "Act s.41",
    control:
      "The environment file is ignored, an example file lists the variables without values, and the secret scan runs as part of the checks.",
    evidence: ".gitignore; .env.example; scripts/secrets-scan.mjs",
    status: "met",
  },
];

/** The checklist rendered as a markdown table, used to write the document. */
export function checklistToMarkdown(): string {
  const header = "| # | Requirement | Authority | Control | Evidence | Status |";
  const divider = "| --- | --- | --- | --- | --- | --- |";
  const rows = PRE_PUBLICATION_CHECKLIST.map(
    (item, index) =>
      `| ${index + 1} | ${item.requirement} | ${item.authority} | ${item.control} | \`${item.evidence}\` | ${item.status} |`,
  );
  return [header, divider, ...rows].join("\n");
}
