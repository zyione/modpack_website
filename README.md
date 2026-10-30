# BigChadGuys+ community website

A responsive, static Minecraft community website inspired by the approved cozy BCG design. Features a Night Fury illustration, featured-mod guides, searchable/filterable mod and perks directories, an accessible artwork lightbox, onboarding checklist, and FAQs.

## Run locally

Install Node.js **22.12+** (Node 24 LTS recommended), then run from this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173). No database, API key, or environment variables are required.

```sh
npm run check    # JavaScript syntax and content/search tests
npm run build    # production files in dist/
npm run preview  # serve the production build locally
```

## Deploy on Vercel

1. Import `zyione/modpack_website` into Vercel.
2. Use the repository root as the root directory and the Vite framework preset.
3. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Subsequent pushes to the production branch trigger updates.

`vercel.json` supplies these build settings. There is no server process or backend to configure. Any static host can also serve `dist/`.

## Add your release and server details

Edit **public/site-config.json**:

| Field | Purpose |
| --- | --- |
| `communityName` | Header/footer branding |
| `downloadUrl` | HTTP(S) URL for your pack release |
| `serverAddress` | Address copied by the server button |
| `discordUrl` | HTTP(S) community invite |
| `packVersion` | Public release version label |
| `minecraftVersion`, `loader` | Version labels and setup text |

Missing download/invite/address values are intentionally empty: the site shows an honest host-contact message and a working checklist rather than fake buttons. Setting values enables their corresponding actions automatically. No secrets belong in this public file. Rebuild/redeploy after edits.

## Migration field guide

Open **`/migration/`** for the NeoForge 1.21.1 planning explorer. The homepage links to it in the navigation and footer. It includes all 429 distinct audited client/server mods and defaults to the 338 installed server mods.

Search by name, ID, installed filename or target option. Combine availability, category, installation, importance, difficulty and removal-effect filters; sort results; open a mod for its full finding and checked source. Filters and the selected mod are encoded in shareable page URLs. CSV export includes the entire filtered result, across all pages.

`public/migration/audit.json` is a static research snapshot, checked 30 October 2026. It intentionally contains only reviewed public fields—no server credentials, player records, log contents or local paths. Native/unofficial availability is separate from verified world conversion. Difficulty is an estimate, and the chunk evidence is a small presence sample.

To refresh from a newly reviewed local audit:

```sh
python scripts/import-migration-audit.py /absolute/path/to/classified.json
npm run check
npm run build
```

The importer validates the current snapshot's expected count; revise that assertion deliberately if a new audit changes the inventory. Update snapshot labels and counts in the importer/page alongside a future audit. Vite builds both the homepage and `migration/index.html`; Vercel serves the latter at `/migration/`.

## Edit content and images

- `src/content.js`: featured mods, searchable perks, first steps, caveats, gallery captions.
- `src/main.js`: page sections and accessible dialog interactions.
- `src/style.css`: responsive layout, palette, typography, and motion preferences.
- `public/images/hero.webp`: sunset landscape.
- `public/images/scenes.webp`: four-panel Night Fury / stable / Create / campfire illustration. CSS shows each quarter without editing the source artwork.
- `WEBSITE-PLAN.md`: content and implementation brief.

The generated illustrations are explicitly labeled as concept artwork, not real screenshots or community builds. Replace them with approved gameplay captures when available. A four-panel replacement must retain the same arrangement, or update the `.scene-*` styles. Google Fonts is optional; the page falls back to system sans-serif if it cannot load.

## Content accuracy

Written for this user's customized local BCG installation, not every public BCG release. The dragon mod is a development Fabric port. Server-specific recipes, controls, and behavior need checking before stronger claims are published. No crop-growth-by-sneaking claim or fabricated player statistics are included. The installed Beacon Flight version is 1.0.0; newer local source behavior was not assumed. Mod authors retain their rights; see the website's Credits dialog.

## Accessibility and verification

Semantic landmarks, skip link, keyboard-operated native dialogs with focus return, labeled search, filter pressed states, live result counts, reduced-motion support, responsive mobile navigation, and native FAQ disclosures are included. The image scenes have nearby descriptive titles and are decorative within their labeled controls. Verify changes with `npm run check`, a production build, and desktop/mobile browser interaction checks.
