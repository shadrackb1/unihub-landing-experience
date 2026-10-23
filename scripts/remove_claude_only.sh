#!/usr/bin/env bash
# Targeted cleanup: Remove ONLY "claude" from Co-Authored-By footers
# Keeps lovable-dev[bot] and ishiidoc96-ship-it authors intact

set -e

REPO="/c/Users/ADMIN/unihub-landing-experience"
cd "$REPO"

# Stash any unstaged changes
git stash

echo "=== Phase 1: Remove Co-Authored-By: Claude footers ==="
# Use filter-branch with a message filter that only removes claude lines
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force \
  --msg-filter 'sed "/Co-Authored-By:.*claude/I d"' \
  --tag-name-filter cat -- --all

echo "=== Phase 2: Verify claude is gone from commit messages ==="
CLAUDE_REFS=$(git log --all --grep="claude" --oneline | wc -l)
echo "Commits mentioning claude: $CLAUDE_REFS"

if [ "$CLAUDE_REFS" -gt 0 ]; then
    echo "Still found:"
    git log --all --grep="claude" --oneline
else
    echo "SUCCESS: No commits reference claude"
fi

echo "=== Phase 3: Verify authors unchanged (lovable/ishiidoc preserved) ==="
git log --format="%an" --all | sort | uniq -c | sort -rn

# Restore stashed changes
git stash pop

echo "=== Phase 4: Force push ==="
git push --force --all origin

echo "Complete! Check GitHub contributors - claude should be gone, lovable/ishiidoc preserved."