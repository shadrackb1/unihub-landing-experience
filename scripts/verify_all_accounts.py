"""Verify all UniHub accounts can sign in via Firebase Auth."""
import requests

API_KEY = "AIzaSyCAVhhKDyQ3EC4WaTdr8cbyQnTPsMk_MnI"
url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"

accounts = [
    ("admin@unihub.dev", "3-cZSk7iWxHtDFAqIdIaA1"),
    ("landlord@unihub.dev", "ZNAgyCpV3OczXW3uLqkaA1"),
    ("admin@unihub.ke", "TestAdmin2024!"),
    ("landlord.pending@unihub.ke", "TestLandlord2024!"),
    ("landlord.approved@unihub.ke", "TestLandlord2024!"),
    ("landlord.rejected@unihub.ke", "TestLandlord2024!"),
    ("landlord.suspended@unihub.ke", "TestLandlord2024!"),
    ("student@unihub.ke", "TestStudent2024!"),
    ("university@unihub.ke", "TestUniversity2024!"),
]

print("=== UniHub Account Verification ===")
print()

failures = 0
for email, pwd in accounts:
    try:
        r = requests.post(url, json={"email": email, "password": pwd, "returnSecureToken": True}, timeout=15)
        if r.status_code == 200:
            data = r.json()
            print(f"OK   {email} -> localId={data.get('localId')}, emailVerified={data.get('emailVerified')}")
        else:
            err = r.json().get("error", {}).get("message", r.status_code)
            print(f"FAIL {email} -> {err}")
            failures += 1
    except Exception as e:
        print(f"FAIL {email} -> {e}")
        failures += 1

print()
print(f"Summary: {len(accounts) - failures}/{len(accounts)} accounts verified")
if failures:
    print(f"Failures: {failures}")