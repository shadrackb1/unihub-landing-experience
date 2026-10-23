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
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Resolves the database URL.
 *
 * - A hosted libsql URL (libsql://..., https://...) is always used as given.
 * - Locally, `file:` URLs are used as given.
 * - On Vercel the deployed filesystem is read-only and does not contain
 *   `dev.db`, so a `file:` URL (or a missing one) would leave the site with no
 *   accounts and every write failing. The build copies the seeded database
 *   next to the server function as `seed.db`; it is copied to /tmp (the only
 *   writable location) on first use. That keeps the seeded accounts working
 *   until a hosted database is configured. /tmp is per-instance and not
 *   permanent, so set DATABASE_URL to a hosted libsql database for real data.
 */
function resolveDatabaseUrl(): string {
  const configured = process.env["DATABASE_URL"];
  const onVercel = Boolean(process.env["VERCEL"]);

  if (configured && !(onVercel && configured.startsWith("file:"))) return configured;
  if (!onVercel) {
    throw new Error("DATABASE_URL is not set. Server routes need the SQLite/libsql database URL.");
  }

  const target = "/tmp/unihub.db";
  if (!existsSync(target)) {
    const here = dirname(fileURLToPath(import.meta.url));
    const candidates = [
      resolve(process.cwd(), "seed.db"),
      join(here, "seed.db"),
      join(here, "..", "seed.db"),
      join(here, "..", "..", "seed.db"),
      "/var/task/seed.db",
    ];
    const seed = candidates.find((candidate) => existsSync(candidate));
    if (!seed) {
      throw new Error(
        "No database available: DATABASE_URL is not a hosted libsql URL and the bundled seed.db was not found.",
      );
    }
    copyFileSync(seed, target);
  }
  return `file:${target}`;
}

function createClient(): PrismaClient {
  const adapter = new PrismaLibSql({ url: resolveDatabaseUrl() });
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
