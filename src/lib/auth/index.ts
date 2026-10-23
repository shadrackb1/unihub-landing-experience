import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { getPrisma } from "@/server/db";

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
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    ...(process.env["BETTER_AUTH_URL"] ? [process.env["BETTER_AUTH_URL"]] : []),
  ],
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
