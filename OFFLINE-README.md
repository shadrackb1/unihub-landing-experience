# UniHub offline package (USB)

This folder makes the UniHub landing site run **without internet for site assets** (HTML, CSS, JS, photos, videos). Map background tiles still call free providers when online; everything else works from the stick.

## What’s on the stick

```
D:\UniHub-Site\
  OFFLINE-README.md          ← this file
  DESIGN-BLUEPRINT.md        ← full design + system blueprint
  docs\diagrams\             ← architecture SVGs
  offline\                   ← built site + start scripts
  project\                   ← full source (optional)
  ads\                       ← social video cuts + ad copy
```

## Run offline (recommended)

**Needs:** Node.js 20+ installed on the PC (not only on the stick).

1. Plug in the USB.
2. Open `offline\`
3. Double-click **`START-OFFLINE.bat`**  
   or in a terminal:

```bat
cd /d D:\UniHub-Site\offline
npm start
```

4. Open **http://localhost:3000** in Chrome/Edge.

Stop the server with `Ctrl+C` in that window.

## If Node is not installed

- Install Node LTS from nodejs.org, then use `START-OFFLINE.bat` again.  
- Or open `project\` on a machine that already has Node and run `npm install && npm run dev`.

## Source project

```bat
cd /d D:\UniHub-Site\project
npm install
npm run dev
```

Production / Vercel build:

```bat
npm run build
```

## Ads

`ads\` holds short landing-page clips and campus ad copy (comrades-style scripts).

## Notes

- Do not delete `offline\node_modules` if you want `START-OFFLINE.bat` without reinstall.  
- First run on a new PC: `cd offline` then `npm install` then `npm start`.  
- WhatsApp number in the UI may still be a placeholder.
