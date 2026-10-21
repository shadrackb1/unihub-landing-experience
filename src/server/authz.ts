/**
 * Server-side authorisation.
 *
 * Roles are read from the signed-in session's user row in the database, never
 * from anything the browser sends, so a viewer cannot reach administrator
 * data by changing a request or hiding a button.
 *
 * Two roles with genuinely different access are used by the app:
 *   - ADMIN  : full access, including the consent ledger and data export.
 *   - VIEWER : read-only access to the same dashboard data, no export,
 *              no consent withdrawal on behalf of anyone else.
 */
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db";

export type AppRole = "ADMIN" | "VIEWER" | "LANDLORD" | "TENANT" | "UNIVERSITY_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Resolve the signed-in user from the request cookie.
 * Returns null when the request is not authenticated.
 */
export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;

    const email = session.user.email ?? "";
    const row = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name ?? session.user.name ?? "",
      role: (row.role as AppRole) ?? "TENANT",
    };
  } catch (error) {
    console.error("Session lookup failed:", error);
    return null;
  }
}

/** Require a signed-in user with one of the given roles. */
export async function requireRole(
  request: Request,
  roles: AppRole[],
): Promise<SessionUser> {
  const user = await getSessionUser(request);
  if (!user) {
    throw new HttpError(401, "Sign in to use this endpoint.");
  }
  if (!roles.includes(user.role)) {
    throw new HttpError(
      403,
      `This action requires the ${roles.join(" or ")} role. Your role is ${user.role}.`,
    );
  }
  return user;
}

export function jsonError(error: unknown): Response {
  if (error instanceof HttpError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status,
      headers: { "content-type": "application/json" },
    });
  }
  console.error("Unhandled server error:", error);
  return new Response(JSON.stringify({ error: "Internal server error." }), {
    status: 500,
    headers: { "content-type": "application/json" },
  });
}
