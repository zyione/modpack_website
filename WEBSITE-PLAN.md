# BCG website plan

Planning date: October 29, 2026. Scope: a cozy, scenic landing page for the user's customized BigChadGuys Plus installation, followed by a practical player guide. This document is a proposal; it does not build or publish the website.

## 1. Purpose and direction

Help a visitor answer three questions: What can I do here? What makes this version special? How do I start playing?

Keep the approved prototype's sunset Minecraft scenery, cream backgrounds, forest-green accents, warm yellow primary buttons, generous spacing, and light multiplayer humor. Lead with the experience of playing together. Explain mod names beside concrete things players can do.

The first release should be a complete landing page with useful onboarding and a small curated guide. Expand the guide as content is verified. Avoid a huge encyclopedia before the main page is ready.

Treat this as this community's edition of BCG. Local additions and development ports must not be presented as features of every public BCG release. Confirm the community/server name before finalizing branding. Do not describe the website as official without confirmation.

## 2. Local evidence and limits

The active .minecraft/mods folder was inspected, along with selected embedded mod metadata, English translations, local configs, and options. The existing MODLIST.md is useful background but differs from the current folder, so it should not supply a public mod count or the final published inventory.

Confirmed present locally:

- Dragons of Berk: HTTYD-themed attraction. Its installed metadata describes an incomplete Fabric port in development. Feature-specific promises need checks against this installed version.
- Icy's Better Horses 2.1.7: metadata describes bonding, commands, utility gear, and travel upgrades. Local settings enable multiriding, breeding, horse management, revival, combat, and class/breed abilities.
- Create, Steam 'n' Rails, Slice & Dice, Crafts & Additions, and other Create additions.
- Beacon Flight 1.0.0: installed metadata describes survival flight within an active beacon's normal range, independently of Origins. Local source also exists for a newer version; do not copy its precise behavior into a guide for the older installed version without verification.
- Carry On: settings allow player pickup and use explicit block/entity allowlists. Do not promise every block or mob can be carried.
- Crawl, FTB Ultimine, Wraith Waystones, Sophisticated Backpacks, Traveler's Backpack, EMI, Jade, and JourneyMap.
- Farmer's Delight and the Let's Do cooking/drink mods; Fabric Seasons.
- Origins, Medieval Origins, Origins Classes, and several spell/combat classes.
- Chipped, Handcrafted, Macaw's building mods, Bits and Chisels, and furniture/decor mods.
- Terralith, BetterEnd, YUNG's structures, and other exploration mods.
- Simple Voice Chat, Emotecraft, Camerapture, Exposure, and Simple Radio.

Presence and local settings do not prove server availability or successful gameplay. Final public copy needs a check against the actual distributable pack and server configuration.

Unresolved wording: "shift sneak" could mean Carry On pickup, repeated sneaking for crop growth, or something else. Carry On and Crawl are installed. Repeated-sneak crop growth has not been established by this inspection. Keep the exact perk and control unpublished until identified.

## 3. Landing page structure

### A. Navigation

Left: community wordmark. Links: The Pack, Little Perks, Gallery, How to Play. Primary button: Start Playing. On the landing page these can jump to sections. On mobile, use a compact accessible menu. Keep navigation short.

### B. Hero

Use the approved scene direction: a welcoming farm and home, distant mountains, and friends heading out together. The final asset should ideally be a genuine screenshot from this pack, with dragons or horses included only if they work naturally in the scene.

Headline:

> A little farming.
> A little adventure.
> A lot of getting distracted.

Supporting copy: "Build your home, discover your next obsession, and bring your friends along."

Buttons: Start Playing and Explore the Pack. Start Playing opens the onboarding section; Explore the Pack goes to featured mods. Optional tiny caption: "Just one more quest."

Keep the headline as real website text. The generated prototype is a visual reference, not a single image to use as the whole webpage.

### C. Find your next obsession

Four quick experience cards: Build, Explore, Collect, Hang Out. Each has a real screenshot, one line of copy, and a relevant link. Their job is to help visitors find a playstyle before reading about individual mods.

### D. The mods you'll make plans around

Give Dragons of Berk, Icy's Better Horses, and Create the three most prominent feature cards. Each gets a large image, a short hook, three verified highlights, and an Explore button. At desktop size, use three cards or alternate image-and-text rows if the screenshots need more space. Stack them on mobile.

Three additional compact cards can cover cozy cooking, building/decor, and origins/classes. Put broader exploration content in a small related feature or the guide rather than expanding the landing page indefinitely.

### E. Little things you'll love

A visually distinct, forest-green section with cream text and warm accents. These are small discoveries and conveniences that make playing pleasant. Show six cards initially; link to the full tips page.

Each card needs an action-led title, one-sentence benefit, a small screenshot or click-to-play clip, and a How it works disclosure. Display the source mod and relevant restrictions in the details. Show key combinations only when verified for the distributed pack.

Prioritize beacon flight, the user's intended sneak perk, connected storage/backpacks, waystones, Ultimine, and social features. Final selection follows gameplay verification.

### F. A world worth staying in

Four to six community screenshots: a home, a stable, a factory, a landscape, a shared gathering, and a dragon scene if verified. Use captions and builder/photographer credit. A lightbox should support keyboard controls. Use approved images and working credits; omit empty or fabricated community claims.

### G. Get in, get settled

Three steps: install the supported launcher, import the correct pack release, join using the supplied server details. Provide the actual tested installation flow once the distribution format is chosen. Include concise requirements, updating instructions, and troubleshooting links.

If a server address exists, provide a Copy address button with clear confirmation. Do not invent addresses, download links, support links, requirements, or compatibility promises. Keep unavailable actions out of the public release.

### H. FAQ and closing invitation

Cover: exact pack/version, recommended setup, whether shaders are optional, how to update, first steps, and where to get help. Answers must follow tested pack behavior. End with a short invitation and Start Playing button. Footer includes mod creator credits, community links, and an appropriate Minecraft affiliation notice.

## 4. Featured mod shortlist and content angles

These are proposed editorial priorities, not a popularity ranking.

| Priority | Feature | Player-facing hook | Content and visual direction |
| --- | --- | --- | --- |
| Headliner | Dragons of Berk / HTTYD | Your next adventure has wings. | A dragon beside its rider and a flight scene. Document supported species, discovery, care, taming, and riding only as confirmed in this port. |
| Headliner | Icy's Better Horses | Find your horse. Build your stable. | Bonding, commands, travel equipment, and enabled breed/class abilities. Show a cozy stable and a trail ride; explain Icy's and SWEM separately if both remain in the release. |
| Headliner | Create and selected additions | Start with a water wheel. See where it goes. | Moving machinery, processing, automation, and railway builds. Use a small approachable example before a giant factory. |
| Supporting | Farmer's Delight + Let's Do | Turn a starter farm into your favorite place. | Cooking, kitchens, bakeries, drinks, and shared meals. Show actual available recipes; do not assume nutrition bonuses. |
| Supporting | Chipped + Handcrafted + Macaw's | Your starter house deserves an upgrade. | Texture choices, furniture, roofs, windows, and details. Label individual mods in the guide rather than presenting the group as one mod. |
| Supporting | Origins + RPG classes | Bring your own kind of trouble. | Explain origin choices and combat roles, with clear benefits and drawbacks. Avoid implying all classes use the same selection system. |
| Guide expansion | Terralith + BetterEnd + structures | Take the scenic route. | Landscapes, destinations, and exploration. Keep coordinates and major discoveries optional to avoid spoilers. |

## 5. Small perks shortlist

| Perk | Draft card copy | Evidence and publication check |
| --- | --- | --- |
| Beacon Flight | Your base, with a little more lift. | Installed. Explain flight inside a working beacon's range. Verify activation, boundaries, and leaving-range behavior using the shipped version. |
| Sneak-related perk | Placeholder until the intended action is identified. | Carry On and Crawl are present. Do not equate sneaking with crop growth without evidence. |
| Carry On | Some moving jobs are a hands-on affair. | Installed; configured allowlists and player pickup. Verify controls and representative allowed targets. Do not claim universal pickup. |
| Ultimine | Less time clearing. More time building. | Installed. Verify enabled shapes, limits, eligible blocks, tool rules, and distributed keybinding. |
| Waystones | Make the long way home optional. | Installed. Check activation, destinations, dimension limits, and costs before describing travel as free or unrestricted. |
| Backpacks | Room for one more thing. | Multiple backpack mods installed. Pick the recommended starter route and explain its actual recipe and controls. |
| Connected storage | Spend less time opening the wrong chest. | Tom's Simple Storage is installed. Verify the starter setup, connections, crafting support, and range. |
| Voice chat + emotes | Hear the panic. Join the bit. | Installed. Test server voice support and microphone setup; explain emotes separately. |
| Photos | Keep the moment. | Camerapture and Exposure installed. Select one beginner-friendly workflow and verify how players take/display pictures. |
| Crawl | Small gap? New entrance. | Installed. Local personal control is C, but that is not yet established as the distributed control. |
| EMI + Jade | Less guessing, more doing. | Installed. Show recipe lookup and block/item information with pack-specific screenshots and correct bindings. |

Do not crowd every perk onto the landing page. The six best verified examples should invite visitors into a searchable guide.

## 6. Guide and detail pages

Recommended expansion pages:

1. Explore the Pack: curated mod cards filtered by Dragons & Mounts, Build, Create, Food, Adventure, RPG, Social, and Quality of Life. Include search and a separate complete installed-mod list.
2. Featured mod details: what it adds, why a player might enjoy it, a short first-steps guide, controls, prerequisites, limitations, screenshots, related perks, and creator/source credit.
3. Little Perks: searchable action-based tips, such as "carry a mob" or "fly around my base." Filters: Movement, Building, Inventory, Travel, Social. Each entry has verified steps and limits.
4. How to Play: supported install process, release download, updates, requirements, joining, and troubleshooting.
5. Gallery: approved screenshots and builds, initially maintained manually.
6. Updates: readable pack changes and affected guides, added when a release/update workflow exists.

Avoid accounts, live maps, shops, screenshot submission systems, and live server status in the first release unless separately requested. These introduce ongoing maintenance beyond the landing page's immediate purpose.

## 7. Content maintenance

Store feature content separately from page styling so updates do not require rewriting layouts. Each entry should record: title, slug, category, short hook, benefits, first steps, controls, prerequisites, restrictions, related mods, image and alt text, creator/source link, pack version checked, verification date, evidence, and publication status.

Useful internal statuses: installed, locally configured, verified in game, verified on server, ready to publish. These are editorial records, not badges to clutter the player interface. Major mod changes trigger review of related guides.

Use plain player language. A perk's title should describe what the player gains. Put technical names and recipes where they help the player perform the action. Humor belongs in hooks and captions; instructions should be precise.

## 8. Visual assets and interaction

Asset checklist: one hero scene, three headliner shots, four playstyle crops, six perk thumbnails or short clips, and four to six gallery images. Images may be reused carefully where appropriate. Capture from the actual release with consistent lighting and a mix of scenic and ordinary gameplay views. Credit community contributions. Do not substitute stock mod imagery for evidence that a custom port works.

Use subtle hover/focus states and restrained transitions. Avoid parallax that interferes with reading. Clips load only when requested; no autoplay sound. Provide reduced-motion behavior. The hero keeps clear negative space for text and uses a separate mobile crop if needed.

## 9. Mobile, accessibility, and performance

- Keep text and navigation as real page elements, with semantic headings and meaningful links.
- Use readable contrast over images, visible keyboard focus, descriptive alt text, and large tap targets.
- Stack headliners and cards naturally on narrow screens. No essential information depends on hover.
- Support keyboard navigation for menus, disclosures, dialogs, and the gallery; return focus when dialogs close.
- Provide an explicit copy confirmation and an understandable fallback for copying a server address.
- Resize/compress screenshots, reserve image space, lazy-load below-fold images, and prioritize the hero.
- Use a small font set and lightweight effects; do not require WebGL or video to understand the page.
- Check at phone, tablet, and desktop widths with real content and long titles.

## 10. Delivery sequence

Phase 1 — Content and structure: settle community branding, confirm the intended sneak perk, select the three headliners and six initial perks, and build a pack-specific fact sheet. Identify missing install/download/server information without inventing it.

Phase 2 — Full landing-page design: extend the approved hero prototype through the feature cards, perks, gallery, onboarding, FAQ, and footer. Prepare desktop and mobile layouts. Use the actual featured mods to make the visual identity more specific to this pack.

Phase 3 — Working landing page: build responsive sections, anchors, menus, feature disclosures, and gallery behavior. Use a maintainable content source. Replace placeholder actions with tested destinations before release.

Phase 4 — Starter guide: add the three headliner detail pages, the verified little-perks entries, and the installation guide. Add creator links and record which pack version each guide describes.

Phase 5 — Verification and release preparation: review public claims against the shipped pack/server, test the complete first-time-player route, check all links and controls, check keyboard/mobile behavior, optimize images, and prepare a reviewable preview. Publishing is a separate step when requested.

Later — Expand guides, gallery, changelog, and optionally server status as the community needs them.

## 11. Completion criteria

- A new visitor understands the cozy/social direction and the three main attractions quickly.
- Dragons of Berk, Icy's Better Horses, and Create are easy to find and have concrete, verified descriptions.
- Major features and little perks have distinct sections and do not repeat identical content.
- The intended sneak perk is identified; no invented crop-growth mechanic or inaccurate control is published.
- Local customizations are described as part of this edition, with no implication that all public BCG releases include them.
- The final install/join journey works with the actual release and server details.
- All visible links and buttons work, key content is usable on mobile and by keyboard, and no invented numbers or testimonials appear.
- Public screenshots match the supported gameplay, and mod/creator credits are present.

## 12. Evidence locations

Local instance root: C:/Users/PC/Desktop/mmc-cracked-win32/UltimMC/instances/BigChadGuysPlus

- .minecraft/mods/: installed filenames and embedded fabric.mod.json metadata; selected English translations.
- .minecraft/config/icys-better-horses.json: enabled horse features.
- .minecraft/config/dragonsofberk-config.toml: selected dragon settings.
- .minecraft/config/carryon-common.json: pickup allowlists and settings.
- .minecraft/options.txt: this user's current bindings, not guaranteed release defaults.
- patches/beacon-flight/src/main/java/local/bcg/beaconflight/BeaconFlight.java: newer local implementation, distinct from installed 1.0.0.
- MODLIST.md: historical background; do not assume it matches the current installation.
