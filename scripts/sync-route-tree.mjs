/**
 * Copy the generated route tree into place.
 *
 * The TanStack router generator writes the new tree to `.tanstack/tmp` and
 * then renames it over `src/routeTree.gen.ts`. On this machine the rename is
 * refused with EPERM because something else holds a handle on the
 * destination, which leaves the route tree stale and the new pages missing
 * from the router.
 *
 * This script copies the newest generated file over the destination instead,
 * which works even when the rename is blocked. Run it after starting the
 * dev server, or whenever a new route file is added.
 *
 *   node scripts/sync-route-tree.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const tmpDir = path.join(root, ".tanstack", "tmp");
const destination = path.join(root, "src", "routeTree.gen.ts");

if (!fs.existsSync(tmpDir)) {
  console.error("No generated route tree found in .tanstack/tmp.");
  process.exit(1);
}

const candidates = fs
  .readdirSync(tmpDir)
  .map((name) => {
    const file = path.join(tmpDir, name);
    return { file, mtime: fs.statSync(file).mtimeMs };
  })
  .sort((a, b) => b.mtime - a.mtime);

if (candidates.length === 0) {
  console.error("No generated route tree found in .tanstack/tmp.");
  process.exit(1);
}

const source = candidates[0].file;
const generated = fs.readFileSync(source, "utf8");
const current = fs.existsSync(destination) ? fs.readFileSync(destination, "utf8") : "";

if (generated === current) {
  console.log("Route tree is already up to date.");
  process.exit(0);
}

fs.copyFileSync(source, destination);
console.log(`Route tree updated from ${path.basename(source)}.`);
