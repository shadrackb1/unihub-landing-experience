const { PrismaClient } = require("../node_modules/.prisma/client/client");
const bcrypt = require("bcryptjs");

const adapter = { url: "file:./dev.db" };
const prisma = new PrismaClient({ adapter });

async function verify() {
  const accounts = [
    { email: "admin@unihub.ke", password: "TestAdmin2024!" },
    { email: "landlord.pending@unihub.ke", password: "TestLandlord2024!" },
    { email: "landlord.approved@unihub.ke", password: "TestLandlord2024!" },
    { email: "landlord.rejected@unihub.ke", password: "TestLandlord2024!" },
    { email: "landlord.suspended@unihub.ke", password: "TestLandlord2024!" },
    { email: "student@unihub.ke", password: "TestStudent2024!" },
    { email: "university@unihub.ke", password: "TestUniversity2024!" },
  ];

  console.log("=== UniHub Better Auth Account Verification ===\n");

  let passed = 0;
  let failed = 0;

  for (const acc of accounts) {
    const user = await prisma.user.findUnique({
      where: { email: acc.email },
      include: { accounts: true },
    });
    if (user) {
      // Find the email/password account
      const credAccount = user.accounts.find((a) => a.providerId === "email");
      if (credAccount && credAccount.password) {
        const match = await bcrypt.compare(acc.password, credAccount.password);
        if (match) {
          console.log("OK   " + acc.email + " -> role: " + user.role);
          passed++;
        } else {
          console.log("FAIL " + acc.email + " -> password mismatch");
          failed++;
        }
      } else {
        console.log("FAIL " + acc.email + " -> no password in account");
        failed++;
      }
    } else {
      console.log("FAIL " + acc.email + " -> user not found");
      failed++;
    }
  }

  console.log("\n" + "=".repeat(45));
  console.log("Summary: " + passed + "/" + accounts.length + " accounts verified");
  if (failed > 0) {
    console.log("Failures: " + failed);
  }
  console.log("=".repeat(45));

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

verify().catch(console.error);
