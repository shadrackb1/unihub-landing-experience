#!/usr/bin/env bash
# Complete rebase script to rewrite all commit authors to shadrackb1
# and remove Co-Authored-By footers

set -e

REPO="/c/Users/ADMIN/unihub-landing-experience"
cd "$REPO"

# Stash any unstaged changes
git stash

# Use git filter-repo (more modern) if available, else filter-branch
if command -v git-filter-repo &> /dev/null; then
    echo "Using git-filter-repo..."
    # Create mailmap for author rewriting
    cat > /tmp/author-map.txt << 'EOF'
ishiidoc96-ship-it <ishiidoc96-ship-it@example.com> ==> shadrackb1 <shadrackb@kabarak.ac.ke>
ishiidoc96-ship-it <ishiidoc96@gmail.com> ==> shadrackb1 <shadrackb@kabarak.ac.ke>
gpt-engineer-app[bot] <gpt-engineer-app@users.noreply.github.com> ==> shadrackb1 <shadrackb@kabarak.ac.ke>
EOF

    git filter-repo --force --mailmap /tmp/author-map.txt \
        --message-callback 'return re.sub(b"^Co-Authored-By:.*\n?", b"", message, flags=re.MULTILINE)' \
        --tag-rename 'refs/tags/*:refs/tags/*' \
        --refs 'refs/heads/*'
else
    echo "Using git filter-branch..."
    FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --env-filter '
OLD_EMAILS="ishiidoc96-ship-it@example.com ishiidoc96@gmail.com gpt-engineer-app@users.noreply.github.com"
OLD_NAMES="ishiidoc96-ship-it gpt-engineer-app"
CORRECT_NAME="shadrackb1"
CORRECT_EMAIL="shadrackb@kabarak.ac.ke"

for OLD_EMAIL in $OLD_EMAILS; do
  if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ] || [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
  fi
done

for OLD_NAME in $OLD_NAMES; do
  if [ "$GIT_COMMITTER_NAME" = "$OLD_NAME" ] || [ "$GIT_AUTHOR_NAME" = "$OLD_NAME" ]; then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
  fi
done
' --msg-filter 'sed "/^Co-Authored-By:/d"' --tag-name-filter cat -- --all
fi

# Restore stashed changes
git stash pop

# Verify
echo "=== Verification ==="
git log --format="%H|%an|%ae" --all | head -30

echo "=== Checking for bad authors ==="
BAD=$(git log --format="%an" --all | sort -u | grep -v -E "(shadrackb1|Shadrack Baraka Mwahanga)")
if [ -z "$BAD" ]; then
    echo "SUCCESS: All commits authored by shadrackb1"
else
    echo "FAIL: Found bad authors:"
    echo "$BAD"
    exit 1
fi

# Force push
echo "Force pushing..."
git push --force --all origin

echo "Complete!"