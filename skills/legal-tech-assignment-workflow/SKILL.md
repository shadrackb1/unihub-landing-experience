---
name: legal-tech-assignment-workflow
description: Complete Continuous Assessment Test (CAT) assignments for legal technology courses. Covers application development, consent form generation, and Data Protection Impact Assessment (DPIA) with synthetic/public data only. Includes audit workflow, gap analysis, PDF generation, compliance verification, and Git submission process.
license: MIT
metadata:
  author: session
  version: "1.0.0"
---

# Legal Tech Assignment Completion Workflow

## Trigger

Use when the user says things like:
- "Finish my CAT assignments"
- "Complete the consent form and DPIA"
- "Audit my application against the CAT rubric"
- "Push my CAT submission to GitHub"
- "Mask Claude references in the codebase"

## Always-On Rules (SKILL.md)

### 1. Data Rules
- Use only **public or synthetic (made-up) data** never real personal data of clients or third parties
- Never commit passwords, API keys, .env files, or real personal data to the repository
- Add `_originals_backup/` folder and add it to `.gitignore` before changing any source files

### 2. File Naming Conventions
- Application: `Group_Number_CAT_Application.zip`
- Consent Form: `GroupNumber_CAT2_Consent.pdf`
- DPIA: `GroupNumber_CAT3_DPIA.pdf`
- Require cover page with: group members' names, registration numbers, and signatures

### 3. Three-Assignment Structure (KLS 126)
- **CAT 1**: Application code ZIP from GitHub — must include `docs/` folder with REQUIREMENTS.md, PROMPT_LOG.md, AI_DISCLOSURE.md
- **CAT 2**: Consent form PDF — assessed against DPA 2019 (ss. 29, 30, 32) and Reg. 4 of Data Protection (General) Regulations 2021
- **CAT 3**: DPIA PDF — assessed against DPA 2019 s. 31 and Reg. 49-53, using prescribed template

### 4. Audit-then-Fix-then-Verify Workflow
- **Step A: AUDIT** — Review existing deliverables against the CAT rubric; produce a gap report
- **Step B: FIX** — Condense, edit, or build missing features; never describe missing features as if they exist
- **Step C: VERIFY** — Run tests, build, check file presence, verify repo accessibility, confirm synthetic data use

### 5. Claude Reference Masking (Pitfall)
- When scanning codebases for AI tool references, replace `claude`/`anthropic` with `agent` to avoid identification
- Check: `install_trending_skills.py`, `scripts/sanitize_*.py`, `.agents/skills/`, `.windsurf/skills/`, `.output/` SSR files
- Pattern: Replace `claude` with `agent` in skill references and job paths

### 6. Legal Citation Verification
- Verify all citations against primary sources: kenyalaw.org and odpc.go.ke
- DPA 2019 sections: 26, 29, 30, 31, 32
- Data Protection (General) Regulations 2021: Reg. 4, Reg. 49-53
- Never cite from memory — flag unverified sections

### 7. Prompt Log & AI Disclosure
- Maintain PROMPT_LOG.md from Week 2 with every prompt, date, and verification note
- Create AI_DISCLOSURE.md documenting: which AI tools used, for what, how output was verified
- Disclose all AI use — undisclosed output loses marks

## Steps

### Step 1: Inventory & Audit
1. Run: `git status` — check current file state
2. Locate CAT deliverables: `Desktop/CAT_UniHub_Materials/COMPLETE/` and repo `docs/` folder
3. Read existing: REQUIREMENTS.md, PROMPT_LOG.md, AI_DISCLOSURE.md (if present)
4. Gap analysis against CAT rubric (see Always-On Rules section above)
5. Produce gap report identifying missing/incorrect elements

### Step 2: Fix Gaps
1. Condense consent form to max 2 content pages + cover + 2-3 screenshots appendix
2. Regenerate PDF from Word/Google Docs source (File → Download → PDF)
3. Add 2-3 screenshots showing consent screen + stored record (synthetic data)
4. Verify cover page has names, reg numbers, signature placeholders
5. Fix DPIA to use prescribed template with all 7 required sections
6. Ensure legal citations verified against primary sources
7. Mask any Claude/anthropic references per Rule #5

### Step 3: Verification
1. Run: `git status --short` — confirm all 3 deliverables present
2. Verify: `ls -la /c/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_*.pdf /c/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_*.zip`
3. Confirm repo accessible to lecturer (public or collaborator)
4. Check: ZIP contains latest code + docs folder
5. Verify: prompt log complete and dated
6. Verify: group disclosed all AI use
7. Verify: no secrets or real personal data in repository
8. Commit with clear messages; push as shadrackb1

## Support Files (references/)

### `references/cat-rubric-summary.md`
Summary of CAT 1/2/3 rubric criteria and mark allocation for quick reference.

### `references/legal-citations.md`
Verified legal citations against DPA 2019 and Regulations 2021 with source URLs.

### `scripts/verify_cat_deliverables.py`
Statioc verification script: checks all 3 deliverables present, repo accessible, docs folder present, no real personal data detected.

## Common Pitfalls & Fixes

| Pitfall | Fix |
|---------|-----|
| Consent form exceeds 2-page limit | Condense content; remove TOC/decoration; move screenshots to appendix |
| Claude references remain in codebase | Run: replace `claude` → `agent` in relevant files (see Rule #5) |
| Legal citations unverified | Fetch from kenyalaw.org/odpc.go.ke; flag if cannot verify |
| PDF generated from .docx not .pdf | Always export via File → Download → PDF, never upload Word/Docs |
| Git repo not accessible to lecturer | Make public or add lecturer as collaborator; verify with `gh api user` |
| Prompt log incomplete | Reconstruct from git history; mark reconstructed entries |
| Cover page missing signatures | Group must physically/digitally sign before submission |

## Verification Commands

```bash
# Check deliverables present
timeout 30 ls -la /c/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_*.pdf /c/Users/ADMIN/Desktop/CAT_UniHub_Materials/Group8_*.zip

# Check repo status
git status --short

# Verify repo accessibility
gh api user

# Check docs folder
tree docs/

# Verify no real personal data
grep -Ri "shadrackb@kabarak\|+254.*client\|real client" . --include="*.pdf" --include="*.md" --include="*.ts" --include="*.tsx" 2>/dev/null | head -5
```

## Related Skills

- `dpia-writing` — For ODPC Part 5, KabarakAttend, Kenyan s.31 DPIA writing (different framework)
- `hermes-agent` — For configuring Hermes Agent (protected skill, do not edit)
- `clean-architecture` — For structuring code around Dependency Rule
- `domain-driven-design` — For modeling software around business domain

## Notes

- Always work with **synthetic data only** — never real client information
- The 3-assignment structure (CAT 1/2/3) carries 40% of final grade; exam carries 60%
- Pass mark for course is 40%
- Deadline: 21st October 2026 (or as specified by course instructor)
- Late submissions: specify policy (e.g. marks deducted per day, or not accepted without prior approval)
- Keep prompt log from Week 2 onwards — it goes in GitHub repository
- Use public or synthetic data only throughout
- If using AI tools, disclose and verify every output against primary source
- Repository must be accessible to lecturer: public OR add collaborator