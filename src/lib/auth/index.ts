import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { getPrisma } from "@/server/db";

/**
 * Origins allowed to call the auth API. Better Auth rejects any sign-in whose
 * Origin header is not listed here ("Invalid origin", HTTP 403), so every host
 * the site is served from has to be covered: local dev, the configured app
 * URL, and the hostnames Vercel injects for production, branch and preview
 * deployments.
 */
function trustedOrigins(): string[] {
  const origins = new Set<string>([
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
    "https://unihub-landing-experience.vercel.app",
  ]);
  const add = (value: string | undefined) => {
    const v = value?.trim();
    if (!v) return;
    origins.add(/^https?:\/\//i.test(v) ? v.replace(/\/+$/, "") : `https://${v}`);
  };
  add(process.env["BETTER_AUTH_URL"]);
  add(process.env["VITE_APP_URL"]);
  add(process.env["VERCEL_URL"]);
  add(process.env["VERCEL_BRANCH_URL"]);
  add(process.env["VERCEL_PROJECT_PRODUCTION_URL"]);
  return [...origins];
}

function createAuth() {
  return betterAuth({
  database: prismaAdapter(getPrisma(), {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  /**
   * The offline kit signs in and out of seven accounts in quick succession
   * while demonstrating the roles, which trips the credential rate limit.
   * start.bat opts out for that copy only; deployed instances keep it on.
   */
  rateLimit:
    process.env["DISABLE_AUTH_RATE_LIMIT"] === "1"
      ? { enabled: false }
      : { enabled: true, window: 60, max: 100 },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "TENANT",
        input: false, // Don't allow setting via API
      },
    },
  },
  plugins: [
    admin({
      adminRoles: ["ADMIN"],
      defaultRole: "TENANT",
    }),
  ],
  hooks: {
    // Sign-in fallback for seeded accounts: if the account exists in the
    // database but has no usable password credential (e.g. it was seeded
    // without one, or the stored hash predates this app), the first sign-in
    // attempt adopts the account and stores the password that was provided,
    // using this app's own hashing. Existing credentials are never touched —
    // normal password checking still applies to them.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email") return;
      const body = (ctx.body ?? {}) as { email?: string; password?: string };
      const email = body.email?.trim().toLowerCase();
      const password = body.password;
      if (!email || !password) return;

      const db = getPrisma();
      const user = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!user) return;

      const credential = await db.account.findFirst({
        where: { userId: user.id, providerId: "credential" },
        select: { id: true },
      });
      if (credential) return;

      const hashPassword = (
        ctx.context as unknown as {
          password?: { hash?: (pw: string) => Promise<string> };
        }
      ).password?.hash;
      if (!hashPassword) return;

      await db.account.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          accountId: user.id,
          providerId: "credential",
          password: await hashPassword(password),
        },
      });
    }),
  },
  trustedOrigins: trustedOrigins(),
});
}

type AuthInstance = ReturnType<typeof createAuth>;

let instance: AuthInstance | undefined;

/** Built on first use so importing this module never needs the database to be reachable. */
export function getAuth(): AuthInstance {
  if (!instance) instance = createAuth();
  return instance;
}

export const auth: AuthInstance = new Proxy({} as AuthInstance, {
  get(_target, prop) {
    const real = getAuth() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(real) : value;
  },
});

export type Session = AuthInstance["$Infer"]["Session"]["session"];
export type User = AuthInstance["$Infer"]["Session"]["user"];
