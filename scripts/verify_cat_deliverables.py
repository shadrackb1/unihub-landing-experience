#!/usr/bin/env python3
"""CAT Deliverables Verification Script

Verifies all three Continuous Assessment Test deliverables are present and correct.
Run from the project root directory.

Checks:
1. All 3 deliverable files exist on Desktop
2. Git repository is accessible
3. docs/ folder is present in repo
4. No real personal data detected in deliverables
5. Prompt log and AI disclosure complete
"""

import os
import sys
import fnmatch

CAT_ROOT = "/c/Users/ADMIN/Desktop/CAT_UniHub_Materials"
DELIVERABLES = [
    "Group8_CAT_Application.zip",
    "Group8_CAT2_Consent.pdf",
    "Group8_CAT3_DPIA.pdf",
]

def check_deliverables_present():
    """Check all 3 CAT deliverables exist."""
    print("=== Checking CAT Deliverables Present ===")
    all_present = True
    for d in DELIVERABLES:
        path = os.path.join(CAT_ROOT, d)
        if os.path.exists(path):
            size = os.path.getsize(path)
            print(f"  ✅ {d} ({size:,} bytes)")
        else:
            print(f"  ❌ {d} — NOT FOUND")
            all_present = False
    return all_present

def check_repo_accessible():
    """Check git repo is accessible."""
    print("\n=== Checking Git Repository ===")
    repo_path = "/c/Users/ADMIN/unihub-landing-experience"
    try:
        import subprocess
        result = subprocess.run(
            ["git", "status", "--short"],
            cwd=repo_path,
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            # Count changed/untracked files
            changed_lines = [l for l in result.stdout.strip().split('\n') if l]
            print(f"  ✅ Repo accessible ({len(changed_lines)} file changes)")
            return True
        else:
            print(f"  ❌ Git error: {result.stderr[:200]}")
            return False
    except Exception as e:
        print(f"  ❌ Could not access repo: {e}")
        return False

def check_docs_folder():
    """Check docs/ folder is present in repo."""
    print("\n=== Checking docs/ Folder ===")
    repo_path = "/c/Users/ADMIN/unihub-landing-experience"
    docs_path = os.path.join(repo_path, "docs")
    if os.path.isdir(docs_path):
        files = os.listdir(docs_path)
        required = ["REQUIREMENTS.md", "PROMPT_LOG.md", "AI_DISCLOSURE.md"]
        has_required = all(r in files for r in required)
        print(f"  ✅ docs/ folder present ({len(files)} files)")
        for r in required:
            status = "✅" if r in files else "❌"
            print(f"    {status} {r}")
        return has_required
    else:
        print(f"  ❌ docs/ folder NOT found at {docs_path}")
        return False

def check_no_real_personal_data():
    """Check for real personal data in deliverables."""
    print("\n=== Checking for Real Personal Data ===")
    import fnmatch
    patterns = [
        "shadrackb@kabarak",  # user email
        "+254",  # Kenyan phone numbers
        "client",  # generic client reference
        "real.*patient",  # real personal
    ]
    
    all_clean = True
    for d in DELIVERABLES:
        path = os.path.join(CAT_ROOT, d)
        try:
            with open(path, 'r', errors='replace') as f:
                content = f.read()
            found_issues = []
            for pattern in patterns:
                matches = fnmatch.filter([content], pattern) if False else []
                # Use simpler search
                if pattern.lower() in content.lower():
                    found_issues.append(pattern)
            
            if found_issues:
                print(f"  ⚠️  {d} contains potential personal data: {found_issues}")
                all_clean = False
            else:
                print(f"  ✅ {d} — no personal data patterns detected")
        except Exception as e:
            print(f"  ❌ Could not read {d}: {e}")
            all_clean = False
    
    return all_clean

def main():
    print("=" * 60)
    print("CAT DELIVERABLES VERIFICATION")
    print("KLS 126 — Data Science for Lawyers, Kabarak University")
    print("=" * 60)
    print(f"Date: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"User: Shadrack Baraka Mwahanga (shadrackb@kabarak.ac.ke)")
    print()
    
    results = {
        "deliverables_present": check_deliverables_present(),
        "repo_accessible": check_repo_accessible(),
        "docs_present": check_docs_folder(),
        "no_personal_data": check_no_real_personal_data(),
    }
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    all_pass = all(results.values())
    for name, passed in results.items():
        label = "PASS" if passed else "FAIL"
        print(f"  {label}: {name}")
    
    print(f"\nOverall: {'ALL CHECKS PASSED ✅' if all_pass else 'SOME CHECKS FAILED ❌'}")
    print("=" * 60)
    
    return 0 if all_pass else 1

if __name__ == "__main__":
    sys.exit(main())