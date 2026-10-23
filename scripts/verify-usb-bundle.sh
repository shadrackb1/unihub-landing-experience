set -euo pipefail
# Verify a previously-created USB bundle at /path/to/mountpoint/UniHub-landing-experience.
# This is intentionally separate from the copy script so the user can re-check a
# bundle after eject/replug without re-running the whole copy flow.
SOURCE_DIR="${1:?Usage:  verify-usb-bundle  /path/to/mountpoint/UniHub-landing-experience}"
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Not a directory: $SOURCE_DIR" >&2
  exit 2
fi

echo "Checking bundle: $SOURCE_DIR"
echo

OK=0
for required in \
  "package.json" \
  "package-lock.json" \
  "pnpm-lock.yaml" \
  "tsconfig.json" \
  "src" \
  "public" \
  "prisma" \
  "README.md" \
  ; do
  if [ ! -e "$SOURCE_DIR/$required" ]; then
    echo "MISSING expected entry: $required"
    OK=1
  fi
done

# node_modules is intentionally optional: it is excluded from the default bundle
# because it is large and reconstructible from the lockfile. Do NOT treat its
# absence as a failure — that would make this verifier wrong on the very bundle
# we intend to ship. Same for scripts/ and the large zip.
OPTIONAL=(
  "node_modules"
  "scripts"
  "Group_8_CAT_Application.zip"
  "_originals_backup"
)
echo "Optional (may be absent by design):"
for optional in "${OPTIONAL[@]}"; do
  if [ -e "$SOURCE_DIR/$optional" ]; then
    echo "  present : $optional"
  else
    echo "  absent  : $optional  (expected in the default bundle)"
  fi
done

if [ "$OK" -ne 0 ]; then
  echo
  echo "Verdict: BUNDLE MISSING EXPECTED ENTRIES" >&2
  exit 2
else
  echo
  echo "Verdict: bundle structure looks coherent (optional items excluded by design)" 
fi
