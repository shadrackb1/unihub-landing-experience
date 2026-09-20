# UniHub Landing Experience

Marketing site for **UniHub**: verified student housing near Kenyan campuses. Students browse hostels, bedsitters, and rentals, then contact landlords or agents directly. No account required to browse.

## Stack

- TanStack Start + React 19 + TypeScript
- Tailwind CSS 4
- TanStack Router (file-based routes)
- MapLibre GL + CARTO dark OSM tiles (free, no API key) for the campus map
- Lovable-synced repo (`AGENTS.md` — do not force-push history)

## Run

```sh
npm i
npm run dev
```

```sh
npm run build
npm run lint
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Immersive landing journey |
| `/listings` | Sample verified listings |
| `/about` | Brand story |
| `/contact` | WhatsApp + email |
| `/list-property` | Landlord / agent onboarding |
| `/privacy` · `/terms` | Legal stubs |

## Experience model

The homepage is organized as a scroll journey (not instructional UI chrome):

1. Arrive — hero video + headline  
2. Orient — how it works + walkthrough  
3. Believe — trust pillars  
4. Witness — residence films  
5. Choose — listings  
6. Place — campus map  
7. Move — landlords + final CTA  

Motion: letter reveal on the hero title, scroll-linked text reveals, muted video autoplay when in view. All respect `prefers-reduced-motion`.

## Design tokens

Defined in `src/styles.css` (oklch):

- Background near-black, white primary CTAs  
- Display: Space Grotesk · Body: Inter  
- Scarce mint highlight (`--highlight`) for verification accents  
- Glass cards, pill CTAs, soft grain / orbs  

## Content model

- Sample listings: `src/data/listings.ts`  
- Residence clips: homepage `residenceClips` + `src/assets/listing-video-*.mp4`  
- WhatsApp number: `WHATSAPP_URL` in `src/components/MarketingChrome.tsx` (placeholder — replace before launch)

## Project layout

```
src/
  assets/          # hero, listing, and video media
  components/      # MarketingChrome, Experience, VideoPanel, galleries
  data/            # sample listings
  routes/          # file-based pages
  styles.css       # design tokens + motion utilities
```

Anti-slop skills live under `.mimocode/skills/`:
- `anti-ai-slop` — bundled writing + UI copy rules (use this)
- `anti-ai-slop-writing` — source writing skill from GitHub
- Bundled skill vendors key refs from jalaalrd writing, misbahsy anti-ai-slop, and Nutlope hallmark design copy rules

Global install: `~/.config/mimocode/skills/anti-ai-slop/`

## Lovable

Continue in the [Lovable editor](https://lovable.dev/projects/6df20188-3834-4b7d-b8ba-fbcff9e78846). Commits pushed to `main` sync back into Lovable.

## Launch checklist

- [ ] Replace WhatsApp placeholder number  
- [ ] Wire listings to real inventory / API  
- [ ] Finalize privacy & terms  
- [ ] Compress or CDN-host large videos if needed  
