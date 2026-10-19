"""Verify admin + landlord accounts can sign in; prints outcomes only, never secrets."""
import configparser, os, re, sys
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDS = os.path.join(ROOT, "unihub-accounts.local")

def firebase_api_key():
    text = open(os.path.join(ROOT, "src", "shared", "lib", "firebase.ts"), encoding="utf-8").read()
    m = re.search(r"apiKey:\s*['\"]([^'\"]+)['\"]", text)
    return m.group(1) if m else None

def main():
    cp = configparser.ConfigParser()
    cp.read(CREDS, encoding="utf-8")
    key = firebase_api_key()
    if not key:
        print("FAIL: could not read apiKey from src/shared/lib/firebase.ts"); return 1
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={key}"
    failures = 0
    for section in cp.sections():
        password = cp[section].get("password", "")
        if not password:
            continue
        try:
            resp = requests.post(url, json={"email": section.split('@')[-1] and section or section, "password": password, "returnSecureToken": True}, timeout=15)
            if resp.status_code == 200:
                print(f"OK   {section}: signed in")
            else:
                print(f"FAIL {section}: {resp.json().get('error',{}).get('message', resp.status_code)}")
                failures += 1
        except Exception as exc:
            print(f"FAIL {section}: {exc}"); failures += 1
    if not any(cp[s].get('password') for s in cp.sections()):
        print("FAIL: no account sections found"); return 1
    return 1 if failures else 0

sys.exit(main())
