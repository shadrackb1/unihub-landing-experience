/**
 * Consent service tests.
 *
 * These run against the isolated test database prepared by `tests/setup.ts`.
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  consentToCsv,
  grantConsent,
  listConsentForEmail,
  listConsentLedger,
  summarise,
  withdrawConsent,
} from "@/server/consent";
import { CONSENT_WORDING_VERSION, purposeWording } from "@/shared/consentPurposes";

const EMAIL = "landlord.test@unihub.ke";

test("a grant stores one record per purpose with the wording and a timestamp", async () => {
  const rows = await grantConsent({
    email: EMAIL,
    name: "Test Landlord",
    purposes: ["IDENTITY_VERIFICATION", "PUBLIC_CONTACT_DETAILS"],
  });

  assert.equal(rows.length, 2);
  for (const row of rows) {
    assert.equal(row.email, EMAIL);
    assert.equal(row.status, "GRANTED");
    assert.equal(row.wordingVersion, CONSENT_WORDING_VERSION);
    assert.equal(row.purposeText, purposeWording(row.purpose));
    assert.ok(row.grantedAt);
    assert.equal(row.withdrawnAt, null);
  }
});

test("purposes are not bundled: one tick creates exactly one record", async () => {
  const rows = await grantConsent({
    email: EMAIL,
    name: "Test Landlord",
    purposes: ["LISTING_PUBLICATION"],
  });
  assert.equal(rows.length, 1);
  assert.ok(rows[0]);
  assert.equal(rows[0]!.purpose, "LISTING_PUBLICATION");
});

test("a repeated grant does not create a second open record", async () => {
  await grantConsent({
    email: EMAIL,
    name: "Test Landlord",
    purposes: ["IDENTITY_VERIFICATION"],
  });
  await grantConsent({
    email: EMAIL,
    name: "Test Landlord",
    purposes: ["IDENTITY_VERIFICATION"],
  });

  const open = (await listConsentForEmail(EMAIL)).filter(
    (row) => row.purpose === "IDENTITY_VERIFICATION" && row.status === "GRANTED",
  );
  assert.equal(open.length, 1);
  assert.ok(open[0]);
  assert.equal(open[0]!.purpose, "IDENTITY_VERIFICATION");
});

test("an unknown purpose is rejected rather than stored", async () => {
  await assert.rejects(
    () =>
      grantConsent({
        email: EMAIL,
        name: "Test Landlord",
        purposes: ["NOT_A_PURPOSE"],
      }),
    /Unknown consent purpose/,
  );
});

test("an empty selection is rejected", async () => {
  await assert.rejects(
    () => grantConsent({ email: EMAIL, name: "Test Landlord", purposes: [] }),
    /At least one purpose/,
  );
});

test("withdrawal marks the record withdrawn with a date and time and keeps the history", async () => {
  await grantConsent({
    email: EMAIL,
    name: "Test Landlord",
    purposes: ["PLATFORM_COMMUNICATIONS"],
  });

  const withdrawn = await withdrawConsent(EMAIL, ["PLATFORM_COMMUNICATIONS"]);
  assert.equal(withdrawn.length, 1);
  assert.ok(withdrawn[0]);
  assert.equal(withdrawn[0]!.status, "WITHDRAWN");
  assert.ok(withdrawn[0]!.withdrawnAt);

  const all = await listConsentForEmail(EMAIL);
  const rows = all.filter((row) => row.purpose === "PLATFORM_COMMUNICATIONS");
  assert.equal(rows.length, 1);
  assert.ok(rows[0]);
  assert.equal(rows[0]!.status, "WITHDRAWN");
});

test("withdrawing everything closes every open purpose", async () => {
  await grantConsent({
    email: EMAIL,
    name: "Test Landlord",
    purposes: ["IDENTITY_VERIFICATION", "LISTING_PUBLICATION", "PUBLIC_CONTACT_DETAILS"],
  });

  const withdrawn = await withdrawConsent(EMAIL, undefined, "all");
  assert.equal(withdrawn.length, 3);
  for (const row of withdrawn) assert.equal(row.status, "WITHDRAWN");
});

test("re-granting after a withdrawal creates a new open record", async () => {
  await grantConsent({ email: EMAIL, name: "Test Landlord", purposes: ["LISTING_PUBLICATION"] });
  await withdrawConsent(EMAIL, ["LISTING_PUBLICATION"]);
  await grantConsent({ email: EMAIL, name: "Test Landlord", purposes: ["LISTING_PUBLICATION"] });

  const summary = summarise(await listConsentForEmail(EMAIL));
  const publication = summary.find((entry) => entry.purpose === "LISTING_PUBLICATION");
  assert.equal(publication?.record?.status, "GRANTED");
});

test("the summary reports the current state of every purpose", async () => {
  const summary = summarise(await listConsentForEmail(EMAIL));
  assert.equal(summary.length, 4);
  assert.ok(summary.some((entry) => entry.purpose === "IDENTITY_VERIFICATION"));
});

test("the ledger can be filtered by status and lists every record", async () => {
  const ledger = await listConsentLedger();
  assert.ok(ledger.length > 0);
  const granted = await listConsentLedger({ status: "GRANTED" });
  assert.ok(granted.every((row) => row.status === "GRANTED"));
});

test("the CSV export carries the wording, the version and both timestamps", async () => {
  const rows = await listConsentForEmail(EMAIL);
  const csv = consentToCsv(rows);
  const lines = csv.split("\n");
  assert.ok(lines[0]?.includes("purposeText"));
  assert.ok(lines[0]?.includes("withdrawnAt"));
  assert.equal(lines.length, rows.length + 1);
  assert.ok(csv.includes("IDENTITY_VERIFICATION"));
});
