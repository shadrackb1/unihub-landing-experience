/**
 * Shared server-side database client.
 *
 * The app already talks to SQLite through the libsql adapter (see
 * `src/lib/auth/index.ts`). This module exposes a single PrismaClient for
 * the server routes so every server-side read/write goes through one
 * connection and can be reused by the consent, import and export services.
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error("DATABASE_URL is not set. Server routes need the SQLite/libsql database URL.");
  }
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

/**
 * The client is created on first use, not when this module is imported. The module is
 * pulled into the server bundle that renders every page, so connecting (or throwing on a
 * missing DATABASE_URL) at import time took the whole site down. Now only the routes that
 * actually query the database fail when it is misconfigured.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(client) : value;
  },
});
