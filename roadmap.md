# Roadmap

## Current sprint — logins + page loading

- [x] Fix "This page didn't load": regenerate missing Prisma client (src/generated/prisma)
- [x] Create .env (DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, VITE_APP_URL, VITE_ADMIN_EMAILS) and load it in vite.config.ts
- [x] Apply 3 pending migrations to dev.db (site settings, emailVerified boolean fix, marketplace fields)
- [x] Sign-in fallback: any seeded account can sign in (src/lib/auth/index.ts hooks.before — adopts accounts with no credential)
- [ ] Verify all 8 seeded accounts sign in (admin + 4 landlord statuses + student + university + viewer)
- [ ] Verify UI login flows: /admin/login, /landlord/login, dashboards render after sign-in
- [ ] Verify all public pages load (/, /listings, /hostels, /about, /contact, /list-property, /privacy, /terms)

## Open items needing the user

- [ ] Firestore security rules on the user's Firebase project (console shows "Missing or insufficient permissions" for site settings reads; also needed for landlord/admin data writes)
- [ ] Real ad boost prices (KES 500 / 900 / 1,500 are invented placeholders)
- [ ] Finish admin CMS pages (landlord vetting done untested; listing review, ads, Site Builder restyle)
