/**
 * Verify all UniHub test accounts against Better Auth (Prisma/SQLite).
 * Uses the project's actual auth instance and Prisma adapter.
 * Run with: npx tsx scripts/verify_better_auth_accounts.ts
 */

import { auth } from "@/lib/auth";

interface TestAccount {
  email: string;
  password: string;
  role: string;
  description: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: "admin@unihub.ke",
    password: "TestAdmin2024!",
    role: "ADMIN",
    description: "Platform admin",
  },
  {
    email: "landlord.pending@unihub.ke",
    password: "TestLandlord2024!",
    role: "LANDLORD",
    description: "Pending landlord",
  },
  {
    email: "landlord.approved@unihub.ke",
    password: "TestLandlord2024!",
    role: "LANDLORD",
    description: "Approved landlord",
  },
  {
    email: "landlord.rejected@unihub.ke",
    password: "TestLandlord2024!",
    role: "LANDLORD",
    description: "Rejected landlord",
  },
  {
    email: "landlord.suspended@unihub.ke",
    password: "TestLandlord2024!",
    role: "LANDLORD",
    description: "Suspended landlord",
  },
  {
    email: "student@unihub.ke",
    password: "TestStudent2024!",
    role: "TENANT",
    description: "Student tenant",
  },
  {
    email: "university@unihub.ke",
    password: "TestUniversity2024!",
    role: "UNIVERSITY_ADMIN",
    description: "University admin",
  },
];

async function verifyAccount(account: TestAccount) {
  try {
    const result = await auth.api.signInEmail({
      body: { email: account.email, password: account.password },
    });

    if (result.user) {
      const userRole = (result.user as any).role;
      return {
        email: account.email,
        status: "OK",
        role: userRole || account.role,
        description: account.description,
        error: null,
      };
    }
    return {
      email: account.email,
      status: "FAIL",
      role: null,
      description: account.description,
      error: "No user returned",
    };
  } catch (error: any) {
    const msg = error?.message || error?.body?.message || String(error);
    return {
      email: account.email,
      status: "FAIL",
      role: null,
      description: account.description,
      error: msg,
    };
  }
}

async function main() {
  console.log("=== UniHub Better Auth Account Verification ===\n");
  console.log(
    `Verifying ${TEST_ACCOUNTS.length} test accounts against Better Auth (Prisma/SQLite)...\n`,
  );

  const results = [];
  for (const account of TEST_ACCOUNTS) {
    const result = await verifyAccount(account);
    results.push(result);
    const statusIcon = result.status === "OK" ? "✓" : "✗";
    console.log(`${statusIcon} ${account.email} (${account.description})`);
    if (result.status === "OK") {
      console.log(`   Role: ${result.role}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
    console.log("");
  }

  const passed = results.filter((r) => r.status === "OK").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Summary: ${passed}/${TEST_ACCOUNTS.length} accounts verified`);
  if (failed > 0) {
    console.log(`Failures: ${failed}`);
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => console.log(`  ✗ ${r.email}: ${r.error}`));
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
