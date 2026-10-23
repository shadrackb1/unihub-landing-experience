/**
 * Authorisation tests.
 *
 * These prove that the two roles have genuinely different access and that
 * the check happens on the server, using a real signed session created
 * through Better Auth — not a value the browser can set.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { auth } from "@/lib/auth";
import { HttpError, getSessionUser, requireRole } from "@/server/authz";

async function signIn(email: string, password: string): Promise<string> {
  const response = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });
  if (!response.ok) {
    throw new Error(`sign-in failed for ${email}: ${response.status}`);
  }
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) throw new Error("no session cookie returned");
  return setCookie.split(";")[0] ?? "";
}

function requestWithCookie(cookie: string): Request {
  return new Request("http://localhost/api/consent/ledger", {
    headers: { cookie },
  });
}

test("an anonymous request is refused with 401", async () => {
  await assert.rejects(
    () => requireRole(new Request("http://localhost/api/consent/ledger"), ["ADMIN"]),
    (error: unknown): error is HttpError => error instanceof HttpError && error.status === 401,
  );
});

test("an anonymous request has no session user", async () => {
  const user = await getSessionUser(new Request("http://localhost/api/consent/ledger"));
  assert.equal(user, null);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  assert.ok(user === null);
});

test("a signed-in administrator is allowed to read the ledger", async () => {
  const cookie = await signIn("admin@unihub.ke", "TestAdmin2024!");
  const user = await requireRole(requestWithCookie(cookie), ["ADMIN"]);
  assert.equal(user.role, "ADMIN");
  assert.equal(user.email, "admin@unihub.ke");
});

test("a viewer may read the dashboard but may not use the administrator endpoints", async () => {
  const cookie = await signIn("viewer@unihub.ke", "TestViewer2024!");

  const viewer = await requireRole(requestWithCookie(cookie), ["ADMIN", "VIEWER"]);
  assert.equal(viewer.role, "VIEWER");

  await assert.rejects(
    () => requireRole(requestWithCookie(cookie), ["ADMIN"]),
    (error: unknown) => error instanceof HttpError && error.status === 403,
  );
});

test("a tenant may not reach the administrator endpoints", async () => {
  const cookie = await signIn("student@unihub.ke", "TestStudent2024!");
  await assert.rejects(
    () => requireRole(requestWithCookie(cookie), ["ADMIN", "VIEWER"]),
    (error: unknown) => error instanceof HttpError && error.status === 403,
  );
});

test("a landlord may not reach the administrator endpoints", async () => {
  const cookie = await signIn("landlord.approved@unihub.ke", "TestLandlord2024!");
  await assert.rejects(
    () => requireRole(requestWithCookie(cookie), ["ADMIN"]),
    (error: unknown) => error instanceof HttpError && error.status === 403,
  );
});

test("a role cannot be escalated by anything the browser sends", async () => {
  const cookie = await signIn("student@unihub.ke", "TestStudent2024!");
  const forged = new Request("http://localhost/api/consent/ledger", {
    headers: {
      cookie,
      "x-user-role": "ADMIN",
      "x-forwarded-user": "admin@unihub.ke",
    },
  });
  await assert.rejects(
    () => requireRole(forged, ["ADMIN"]),
    (error: unknown) => error instanceof HttpError && error.status === 403,
  );
});
