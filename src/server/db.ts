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
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Server routes need the SQLite/libsql database URL.",
    );
  }
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
