#!/usr/bin/env python3
"""
Script to install 200+ trending Hermes skills from various sources.
Sources: skills-sh (community), clawhub, well-known, browse-sh, github, lobehub, nvidia, openai, anthropic, huggingface, voltagent, gstack, minimax
"""
import subprocess
import time
import re
import sys

def run_cmd(cmd, capture=True):
    """Run a command and return output."""
    print(f"Running: {cmd}")
    if capture:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    else:
        result = subprocess.run(cmd, shell=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result

def get_skills_from_source(source, max_pages=3):
    """Get skill identifiers from a source by browsing pages."""
    skills = []
    for page in range(1, max_pages + 1):
        cmd = f"hermes skills browse --source {source} --page {page}"
        result = run_cmd(cmd)
        # Parse table output
        lines = result.stdout.split('\n')
        for line in lines:
            # Look for lines with the identifier column (6th column)
            if '│' in line:
                # Skip header/border lines
                if line.startswith('┌') or line.startswith('├') or line.startswith('└') or line.startswith('│ #'):
                    continue
                parts = [p.strip() for p in line.split('│')]
                if len(parts) >= 6:
                    identifier = parts[5].strip()
                    # Clean up: remove ANSI escape codes, only keep valid identifiers
                    identifier = re.sub(r'\x1b\[[0-9;]*m', '', identifier)
                    identifier = identifier.replace('\x1b', '').strip()
                    # Valid identifiers contain '/' or are known skill names
                    # Skip common table headers like "Trust", "★ official", "Source", "community", etc.
                    if (identifier and identifier != 'Identifier' and 
                        not identifier.startswith('official/') and
                        identifier not in ['Trust', '★ official', 'Source', 'community', 'official', '★', 'trusted'] and
                        ('/' in identifier or len(identifier) > 10)):
                        skills.append(identifier)
        time.sleep(0.5)
    return skills

def install_skill(identifier, force=False):
    """Install a single skill."""
    cmd = f"hermes skills install {identifier} --yes"
    if force:
        cmd += " --force"
    result = run_cmd(cmd)
    return result.returncode == 0

def main():
    print("=" * 60)
    print("Installing 200+ Trending Hermes Skills")
    print("=" * 60)
    
    # Sources to try (excluding 'official' and 'all' to avoid duplicates)
    sources = ['skills-sh', 'well-known', 'browse-sh', 'github', 'lobehub', 'nvidia', 'openai', 'huggingface', 'voltagent', 'gstack', 'minimax']
    
    all_skills = []
    for source in sources:
        print(f"\nFetching skills from {source}...")
        skills = get_skills_from_source(source, max_pages=3)
        print(f"  Found {len(skills)} skills")
        all_skills.extend(skills)
        time.sleep(1)
    
    # Deduplicate
    unique_skills = list(dict.fromkeys(all_skills))
    print(f"\nTotal unique non-official skills found: {len(unique_skills)}")
    
    # Limit to 200
    target_skills = unique_skills[:200]
    print(f"Will attempt to install {len(target_skills)} skills")
    
    installed = 0
    failed = 0
    
    for i, skill in enumerate(target_skills, 1):
        print(f"\n[{i}/{len(target_skills)}] Installing: {skill}")
        success = install_skill(skill)
        if success:
            installed += 1
            print(f"  ✓ Success")
        else:
            failed += 1
            print(f"  ✗ Failed")
        # Small delay to avoid rate limiting
        time.sleep(1)
        
        # Progress update every 10 skills
        if i % 10 == 0:
            print(f"\nProgress: {installed} installed, {failed} failed, {len(target_skills) - i} remaining")
    
    print("\n" + "=" * 60)
    print(f"Installation complete!")
    print(f"Successfully installed: {installed}")
    print(f"Failed: {failed}")
    print("=" * 60)

if __name__ == "__main__":
    main()