/**
 * Test bootstrap.
 *
 * Runs before every test file (node --test passes the same execArgv to its
 * child processes). It points the app at an isolated SQLite file so a test
 * run can never touch the development database, applies the migrations and
 * seeds the synthetic test accounts.
 *
 * Each test file gets its own database file. node --test runs the files in
 * parallel, so a single shared file would let one process delete the
 * database another process is still using.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

// The test file currently being run, e.g. "tests/consent.test.ts".
const testFile = process.argv[1] ?? "tests";
const suffix = path.basename(testFile).replace(/\.[^.]+$/, "");
const dbFile = path.join(repoRoot, "prisma", `test-${suffix}.db`);
const dbPath = dbFile.replace(/\\/g, "/");
process.env.DATABASE_URL = `file:${dbPath}`;

const prismaCli = path.join(repoRoot, "node_modules", "prisma", "build", "index.js");
const env = { ...process.env };

function run(args: string[]) {
  execFileSync(process.execPath, args, {
    cwd: repoRoot,
    env,
    stdio: "ignore",
  });
}

// Start from an empty database every run so the tests never depend on rows
// left behind by a previous run.
for (const extra of ["", "-journal", "-wal", "-shm"]) {
  fs.rmSync(`${dbFile}${extra}`, { force: true });
}

// Apply the schema, then load the synthetic accounts the tests sign in with.
run([prismaCli, "migrate", "deploy"]);
run([path.join(repoRoot, "node_modules", "tsx", "dist", "cli.mjs"), "prisma/seed.ts"]);
