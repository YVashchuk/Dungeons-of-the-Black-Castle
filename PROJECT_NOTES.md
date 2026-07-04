# Project Notes — Dungeons of the Black Castle

## Source text: which edition

This project is a browser adaptation of **"Подземелья Чёрного замка"** by
**Дмитрий Браславский** (Dmitry Braslavsky).

**⚠️ Важно:** мы работаем с **исправленной версией (ремейком) 1-го издания 1991 года.**

| Parameter | Value |
|---|---|
| Base edition | 1st edition, 1991 |
| Used text | Remake / corrected edition (2018, by Braslavsky + Morozov) |
| Paragraphs | **1221** (NOT 583 as in the raw 1991 edition) |
| Victory paragraph | **§1220** (NOT §617) |
| Source file | `assets/fb2_remake.fb2` |
| Original source material (REFERENCE ONLY) | `assets/pdf_original_1991.pdf` (scanned 1991 print edition, with original illustrations) |
| 1991 adjudication text | `assets/book_1991_extracted.txt` — 617 sequential paragraphs decoded from the scanned PDF (font-shift +0x228). Settles "what did the original intend?" questions locally; whitespace-mangled, so match space-insensitively. |
| Markdown export for AI tools | `assets/book_text.md` (full text + corrections log, derived from `fb2_remake.fb2`) |

The remake preserves the original story and mechanics but:
- Renumbers paragraphs 1–1221 (the original had 1–583).
- Fixes continuity errors and broken cross-references from the 1991 print.
- Adds clarifications in a few places.

**When referencing paragraph numbers anywhere in this project, assume REMAKE
numbering (1–1221) unless explicitly stated otherwise.**

### Original 1991 edition: REFERENCE ONLY

The original 1991 edition is kept only as a scanned reference:

- `assets/pdf_original_1991.pdf` — **scanned 2-pages-per-sheet** PDF of the 1991 print edition, retained for cross-checking original imagery and layout. Do NOT use as a text source — OCR quality is poor and the text has been superseded by the 2018 remake.

> The raw 1991 text files (`fb2_original_1991.fb2`, `epub_original_1991.epub`) were removed from the repo — the scanned PDF above covers the historical-reference need, and all development uses the remake. They remain in git history if ever needed.

**All development uses `assets/fb2_remake.fb2`** as the canonical source. Any AI-assisted analysis (Gemini, ChatGPT, Claude) should be fed `assets/book_text.md`, the MD export of that text whose header carries the corrections log; the authoritative correction registry is `assets/text_corrections.json`.

## File structure

`
Dungeons-of-the-Black-Castle/
├── assets/                     ← Source texts + reference PDFs + illustrations
│   ├── fb2_remake.fb2          ← The canonical source (1221 paragraphs)
│   ├── pdf_original_1991.pdf   ← Scanned 1st-edition PDF (historical reference only)
│   ├── book_1991_extracted.txt ← Decoded 1991 text (617 paragraphs) — adjudication source
│   ├── book_text.md            ← Full text + corrections log (for Gemini/AI tools, MD format)
│   ├── text_corrections.json   ← Authoritative correction registry (versioned; now v2.100, 70 groups)
│   ├── analytical_report.pdf   ← Design analysis for Windows + Android adaptation
│   ├── art/                    ← Canonical runtime art binaries (75 files, 7.6 MB) → copied to dist/art
│   └── illustrations/
│       ├── originals/          ← 46 Midjourney PNGs, FULL RESOLUTION (kept as source)
│       └── web/                ← 46 web-optimised JPEGs (900px, Q82) for runtime
├── src/                        ← Game source (JS + HTML shell)
│   ├── game_shell_top.html     ← HTML frame + CSS (still uses Google Fonts @import)
│   ├── game_structure.js          ← GD = {1221 paragraph objects}, synced with dist
│   ├── locale.ru.js            ← LOCALE_RU: all game text (1221 paragraphs + labels + UI), reference locale
│   ├── mj_art.js               ← MJ_META/MJ_MAP + relative-path map (binaries: assets/art/mj)
│   ├── illustrations.js        ← Path map for legacy 1991 b/w scans (binaries: assets/art/legacy)
│   ├── title_art.js            ← Title-art paths (binaries: assets/art/title)
│   ├── map_module.js           ← Map / fog-of-war panel
│   ├── game_logic.js           ← Engine: combat, luck, inventory, rendering, ally-summons, post-combat gating
│   ├── mobile.css              ← Mobile layout (injected into the shell <style> by the build)
│   └── fonts/                  ← Self-hosted woff2 (inlined as base64 by the build)
│       ├── fonts.css           ← @font-face declarations (replacement for Google Fonts)
│       └── *.woff2             ← 7 files, ~149 KB
├── art-pack/
│   └── metadata/
│       └── art_catalog.py      ← Programmatic catalog: 45 art entries
├── docs/
│   ├── MIDJOURNEY_PROMPTS.md   ← All Midjourney prompts (incl. Batch 4) + hero --cref URL
│   └── PWA_IMPLEMENTATION.md   ← PWA activation plan (ChatGPT C-1 verified)
├── dist/                       ← Built artifacts
│   ├── podzemelye-chyornogo-zamka-remake.html  ← BUILT game HTML (~1.5 MB)
│   ├── art/                    ← Runtime art copied from assets/art (75 files, 7.6 MB)
│   ├── manifest.webmanifest    ← (PREPARED, not active) PWA install metadata
│   ├── sw.js                   ← (PREPARED, not active) Service worker
│   └── icons/                  ← (PREPARED, not active)
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png  ← Android adaptive icon
├── scripts/                    ← Git push helpers
├── audit_cycles/               ← Historical audit archive (per-cycle briefs/reports; tracked)
├── _handoff/                   ← (GIT-IGNORED) Briefs for external AI sessions
├── build.sh                    ← Concatenate src/* into dist/
├── README.md
├── QUICKSTART.md
├── PROJECT_NOTES.md            ← This file
└── LICENSE
`

### "(PREPARED, not active)" files

Still pending activation:

- `dist/manifest.webmanifest`, `dist/sw.js`, `dist/icons/*` — PWA installation layer

`src/mobile.css` and `src/fonts/*` are ACTIVE: the build injects `mobile.css` into the shell `<style>` and inlines the woff2 fonts as base64 (no Google Fonts at runtime). PWA remains deliberately unintegrated because activation requires adding the manifest link and service-worker registration to the shell and deploying to an HTTPS origin (`file://` does not support service workers).

See `docs/PWA_IMPLEMENTATION.md` for the step-by-step activation guide.

## Illustrations — important rules

1. **Originals are never modified.** Full-resolution PNGs from Midjourney live
   in `assets/illustrations/originals/` and are treated as the source of truth.
2. **Web versions are derivative.** If runtime needs to shrink an image, it
   goes in `assets/illustrations/web/` as a separate copy. Never downscale
   an original in-place.
3. **Prompts and reference URLs are preserved in three places** for every
   image — each is authoritative in its own way:
   - `src/mj_art.js` → `MJ_META` — runtime metadata (JavaScript)
   - `docs/MIDJOURNEY_PROMPTS.md` — human-readable catalog
   - `art-pack/metadata/art_catalog.py` — programmatic Python catalog
   This allows re-generation with consistent style using `--cref <HERO_REF_URL>`.
4. **Runtime precedence** in `game_logic.js` (`renderGame()`):
   1. Midjourney colored art (`MJ_MAP` → `MJ_DATA`) — preferred
   2. Legacy 1991 b/w scans (`ILLUST_MAP` → `ILLUST_DATA`) — fallback
   3. No image — text only

## Hero character reference

When generating new Midjourney art, use this URL as `--cref` to keep the
hero's appearance consistent across all scenes:

`
https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
`

## Paragraph mapping: original (583) → remake (1221)

Because the Midjourney images were originally commissioned against the
583-paragraph original numbering, every `MJ_META` entry carries BOTH:
- `remakeParagraphs`: where the image is shown in-game (1221-numbering)
- `originalParagraphs`: the 583-numbering scene it was designed for (reference only)

Examples:
| Scene | Original (583) | Remake (1221) |
|---|---|---|
| Opening forest | §1 | §1, §14 |
| Black Castle first view | §118 | §244, §250, §330 |
| Dragon | §37, §41 | §188, §440, §532, §1136 |
| Sleeping Princess | §617 | §1072 (§1220 moved to art52) |
| Library | §22, §350 | §441, §701, §718, §766 |
| Final duel (Batch 4) | — | §823, §1096, §1164 |
| Victory (Batch 4) | §617 | §1220 |

Full mapping lives in `src/mj_art.js` (`MJ_META.<art_id>.remakeParagraphs`)
and mirrored in `art-pack/metadata/art_catalog.py`.

Coverage (current, verified against `src/mj_art.js` / `src/illustrations.js`, registry v2.46+):
- **107 paragraphs** covered by Midjourney colour art (42 art-ids / 45 runtime images; 46 source PNGs incl. title art and Batch 4)
- **56 paragraphs** covered by 21 legacy 1991 b/w scans (fallback when no MJ art)
- **132 paragraphs total** have art; the rest show text only
- Batch 4 (spider, mounted knight, crypt skeletons, snake, stone rats, Barlad finale, princess rescue) has been generated and integrated

## Target platforms

- Windows browser (primary development target)
- Android (Pixel 7a / iPhone 15 class) — mobile layout prepared in `src/mobile.css`, PWA prepared in `dist/`, not yet deployed

## Save format

- localStorage key: `podzch_v5` (map-module may upgrade to v7 automatically)
- Fields: name, section, skill, stamina, luck (+ luckMax), gold, flask, inventory,
  spells, notes, combatWon, visited, summonsUsed (combat-ally summon, once per journey)
- `normalizeSave()` backfills any missing field so an old save can't crash a newer build.

## Build

`bash
bash build.sh
`

The script builds the shell (injecting `mobile.css` + inlined fonts), then concatenates these modules in order:
1. `game_shell_top.html` — HTML+CSS frame, opens `<script>`
2. `game_structure.js` — 1221-paragraph game data
3. `locale.ru.js` — LOCALE_RU (all game text; reference locale)
4. `illustrations.js` — path map for legacy 1991 b/w scans (fallback)
5. `title_art.js` — title-art paths
6. `mj_art.js` — MJ_META/MJ_MAP + path map (42 art-ids)
7. `map_module.js` — map / fog-of-war panel
8. `game_logic.js` — engine (renders MJ first, ILLUST fallback)
9. closes `</script></body></html>` and copies `assets/art/` → `dist/art/` (75 files)

Output: `dist/podzemelye-chyornogo-zamka-remake.html` (~1.5 MB) + `dist/art/` (7.6 MB).

> **Note:** `mobile.css` and `fonts/` ARE included (injected/inlined by the build).
> `manifest.webmanifest`, `sw.js`, and `icons/` are still NOT wired — they join when
> PWA is activated (HTTPS origin required).

## Distribution model: lean HTML + art/ folder

Since 2026-07-01 (registry group_70) the art payloads are NOT baked into the
HTML. The deliverable is the `dist/` folder: a ~1.5 MB `.html` plus `art/`
(75 binaries, 7.6 MB) next to it. It still plays from a local file without a
server — images load through relative `<img src>` paths, which work under
`file://` (no fetch/CORS involved). Keep `art/` next to the HTML when moving
or sharing the game (zip the whole `dist/`). Source files stay modular under
`src/`; `build.sh` assembles the HTML and copies the art.

## Engine features beyond basic Fighting-Fantasy mechanics

These are the non-obvious mechanics a maintainer (or external auditor) must know.
Authoritative detail lives in `assets/text_corrections.json` (the ledger, v2.100)
and the per-topic audits under `audit_cycles/`.

### Combat ally summons (item-summoned, NOT the Copy spell)
Some held ITEMS let the player summon an ally mid-combat. The ally is a DISTINCT
actor with its OWN Skill/Stamina — it only borrows the **resolution rules** of the
Copy spell (a self-contained 2d6+Skill side-fight, +/-2 HP per round, ally HP = its
own Stamina). It is NOT a copy of the enemy.
- **Волшебный колокольчик** (granted §612) -> summons **Медведь** (Skill 11,
  Stamina 9), usable **anywhere, including inside the castle**.
- **Медвежий амулет** (granted §84 via the `acquires` edge to §511) -> summons
  **Медведица** (Skill 8, Stamina 10), usable **only OUTSIDE the Black Castle**.
- Once per journey (`S.summonsUsed`); the item is **retained**, not consumed.
- Engine: `COMBAT_ALLIES` map + `useAllyInCombat()` / `summonAllyAvailable()` +
  `#btn-summon-ally` / `#btn-summon-ally2` (the 2nd button appears when the player
  holds both summon items outside the castle).
- The "inside the castle" predicate is the hand-curated **`CASTLE_SECTIONS`** set of
  26 interior combat paragraphs (forest/castle phases are NOT graph-separable, so a
  curated set is used). Only the amulet is disabled inside that set — the bell works
  inside by canon. This is intended, not a bug.

### Two distinct amulets — keep them apart
- **Медвежий амулет** (§84) -> summons Медведица (above).
- **Золотой амулет** (§390/§500/§625/§1164) -> blinds Барлад Дэрт in the finale.

Matched by exact item string; never conflate them.

### post_combat gating
A choice with `post_combat:true` is **hidden while a fight is pending** and shown
only **after victory** (`renderChoices`). Post-victory continuations MUST carry this
flag or they become combat-bypasses (grab the reward without fighting). There are
116 such flags after the June sweep; any new combat paragraph needs the same
treatment. PRE-combat choices (cast a spell, show an item, flee, give a password)
are intentionally left visible.

### Item grants come from SIX mechanisms
A "gated but never granted" claim is FALSE unless all six are checked:
`auto_items.items`, `auto_items.food[]`, choice/section `grants_items`, choice
`grants_food`, `bet_payout.items` (materialised by `applyBetting()`), and `acquires`
(via `applyChoiceAcquires()`). Example: the bear amulet is granted only via
`acquires` on §84 — invisible to an `auto_items`-only scan.

### Paragraph-jumping items = static inventory-gated choices (NOT a runtime engine)
Several items make a later fork's destination `currentParagraph +/- N` in the printed
book (fish +15, castle key +40, Book +24, ruby ring +401, orange +750, club +50,
candles +10, bird-guide −50, …). The remake ships these as **static, inventory-gated
parallel choices** (per-item conditional routing) — there is NO runtime arithmetic
engine, and one must NOT be added (1221-renumbering puts some offsets out of range;
each needs its own remap). Full verified table:
`audit_cycles/dynamic_arithmetic_june_2026/ARITHMETIC_MAP.md` (Section A = wired,
Section B = data-only backlog).

## Known gotchas

1. **`src/game_structure.js` is synced from `dist/*.html`.** If you hand-edit `src/game_structure.js` and then rebuild, the edits will survive. But if someone improves the GD inside `dist/*.html` (e.g. ChatGPT polish pass) without updating `src/`, a subsequent rebuild from `src/` will REGRESS those improvements. Keep `src/` as the primary source of truth; re-sync from dist only when drift is detected (see `audit_cycles/archive_2026_04/GRAPH_AUDIT.md` section IV.3 for the procedure).

2. **Static-unreachable ≠ unreachable in play.** A naive BFS over `choice.target` under-reports reachability, because several paragraphs are entered only via mechanics it cannot see (riddle `valid_targets`/`modifier` jumps, bird-guide −50, inventory-gated parallel exits). The current full audit (`audit_cycles/reachability_audit_june_2026/REACHABILITY_AUDIT.md`) finds **1205 / 1221 reachable**; the remaining **16** are documented Tier B/C "island" paragraphs (success-halves of conditional gates whose parent edge was dropped in the 1991→remaster renumbering) awaiting per-scene 1991 cross-ref before re-wiring — deliberately NOT auto-wired, to avoid mis-parenting twin outcomes.

3. **Dragon §532 and the "dynamic-math" mechanics are implemented.** §532 uses `combat_condition:"wound_2"` (engine routes to §437 after two wounds). The former "+N arithmetic" items (fish §13, gold key §140, Book, ruby ring, …) ship as static inventory-gated choices — see the *Engine features* section above and `audit_cycles/dynamic_arithmetic_june_2026/ARITHMETIC_MAP.md`. `audit_cycles/archive_2026_04/GRAPH_AUDIT.md` is the original (now historical) Gemini audit; `assets/text_corrections.json` (v2.100) is the authoritative current state.
