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
| Originals of source materials | `assets/fb2_original_1991.fb2`, `assets/epub_original_1991.epub`, `assets/pdf_original_1991.pdf` |

The remake preserves the original story and mechanics but:
- Renumbers paragraphs 1–1221 (the original had 1–583).
- Fixes continuity errors and broken cross-references from the 1991 print.
- Adds clarifications in a few places.

**When referencing paragraph numbers anywhere in this project, assume REMAKE
numbering (1–1221) unless explicitly stated otherwise.**

## File structure

```
Dungeons-of-the-Black-Castle/
├── assets/                     ← Source texts + reference PDFs + illustrations
│   ├── fb2_remake.fb2          ← The canonical source (1221 paragraphs)
│   ├── fb2_original_1991.fb2   ← Reference: raw 1991 edition (583 paragraphs)
│   ├── epub_remake.epub        ← Same as FB2 but in EPUB format
│   ├── epub_original_1991.epub ← Reference 1991 edition EPUB
│   ├── pdf_original_1991.pdf   ← Scanned 1st-edition PDF
│   ├── original_errors.txt     ← Known errors in the 1991 edition
│   ├── analytical_report.pdf   ← Design analysis for Windows + Android adaptation
│   └── illustrations/
│       ├── originals/          ← 36 Midjourney PNGs, FULL RESOLUTION (kept as source)
│       └── web/                ← 36 web-optimised JPEGs (900px, Q82) for runtime
├── src/                        ← Game source (JS + HTML shell)
│   ├── game_shell_top.html     ← HTML frame + CSS (still uses Google Fonts @import)
│   ├── remake_data.js          ← GD = {1221 paragraph objects}, synced with dist
│   ├── mj_art.js               ← Midjourney illustrations (base64 + MJ_MAP + MJ_META)
│   ├── illustrations.js        ← Legacy 1991 b/w scans (fallback when no MJ art)
│   ├── title_art.js            ← Title-screen lineart
│   ├── map_module.js           ← Map / fog-of-war panel
│   ├── game_logic.js           ← Engine: combat, luck, inventory, rendering
│   ├── mobile.css              ← (PREPARED, not active) Pixel 7a layout + safe-area
│   └── fonts/                  ← (PREPARED, not active) Self-hosted woff2
│       ├── fonts.css           ← @font-face declarations (replacement for Google Fonts)
│       └── *.woff2             ← 7 files, ~149 KB
├── art-pack/
│   └── metadata/
│       └── art_catalog.py      ← Programmatic catalog: 43 arts (36 generated + 7 pending)
├── docs/
│   ├── MIDJOURNEY_PROMPTS.md   ← All 43 prompts + hero --cref URL (re-generation)
│   ├── GRAPH_AUDIT.md          ← Graph & UX audit (Gemini G-2 verified)
│   └── PWA_IMPLEMENTATION.md   ← PWA activation plan (ChatGPT C-1 verified)
├── dist/                       ← Built artifacts
│   ├── podzemelye-chyornogo-zamka-remake.html  ← BUILT single-file game (~9.3 MB)
│   ├── manifest.webmanifest    ← (PREPARED, not active) PWA install metadata
│   ├── sw.js                   ← (PREPARED, not active) Service worker
│   └── icons/                  ← (PREPARED, not active)
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png  ← Android adaptive icon
├── scripts/                    ← Git push helpers
├── _handoff/                   ← (GIT-IGNORED) Briefs for external AI sessions
├── build.sh                    ← Concatenate src/* into dist/
├── README.md
├── QUICKSTART.md
├── PROJECT_NOTES.md            ← This file
└── LICENSE
```

### "(PREPARED, not active)" files

A set of assets is ready in the repo but not yet wired into the build:

- `src/mobile.css` and `src/fonts/*` — phone layout and self-hosted fonts
- `dist/manifest.webmanifest`, `dist/sw.js`, `dist/icons/*` — PWA installation layer

These are deliberately not integrated because activation requires:
1. Modifying `src/game_shell_top.html` (remove Google Fonts @import, add manifest link, register service worker, update viewport tag).
2. Updating `build.sh` to inline/copy the new assets.
3. Deploying to an HTTPS origin (local `file://` does not support service workers).

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

```
https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
```

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

Coverage:
- **91 paragraphs** covered by 36 currently-generated Midjourney arts
- **+21 paragraphs** will be covered once Batch 4 (7 prompts ready) is generated
- Total after Batch 4: **112 paragraphs** (9.2% of 1221)
- The remaining paragraphs either fall back to 28 legacy b/w scans (1991 edition) or show text only

## Target platforms

- Windows browser (primary development target)
- Android (Pixel 7a class) — mobile layout prepared in `src/mobile.css`, PWA prepared in `dist/`, not yet deployed

## Save format

- localStorage key: `podzch_v5` (map-module may upgrade to v7 automatically)
- Fields: name, section, skill, stamina, luck, gold, flask, inventory,
  spells, notes, combatWon, visited

## Build

```bash
bash build.sh
```

The script concatenates these files in order:
1. `game_shell_top.html` — HTML+CSS frame, opens `<script>`
2. `remake_data.js` — 1221-paragraph game data
3. `illustrations.js` — legacy 1991 b/w scans (fallback)
4. `title_art.js` — title-screen lineart
5. `mj_art.js` — 36 Midjourney illustrations + metadata
6. `map_module.js` — map / fog-of-war panel
7. `game_logic.js` — engine (renders MJ first, ILLUST fallback)
8. closes `</script></body></html>`

Output: `dist/podzemelye-chyornogo-zamka-remake.html` (~9.3 MB).

> **Note:** the current `build.sh` does NOT yet include `mobile.css`, `fonts/`,
> `manifest.webmanifest`, `sw.js`, or `icons/`. They will be added when PWA is
> activated. Until then, `build.sh` produces the same self-contained HTML as before.

## Why single-file HTML?

The deliverable is one big self-contained `.html` file (~9.3 MB with all MJ
art baked in) so it plays from a local file without a server. Source files
are kept modular under `src/` for maintainability; `build.sh` concatenates
them into `dist/podzemelye-chyornogo-zamka-remake.html`.

## Known gotchas

1. **`src/remake_data.js` is synced from `dist/*.html`.** If you hand-edit `src/remake_data.js` and then rebuild, the edits will survive. But if someone improves the GD inside `dist/*.html` (e.g. ChatGPT polish pass) without updating `src/`, a subsequent rebuild from `src/` will REGRESS those improvements. Keep `src/` as the primary source of truth; re-sync from dist only when drift is detected (see `docs/GRAPH_AUDIT.md` section IV.3 for the procedure).

2. **4 orphan paragraphs** (§106, §151, §178, §277) are bird-guide hints never reached by normal gameplay. They're harmless but unreachable.

3. **Dragon §532 and dynamic-math mechanics** (§13 fish +15, §140 gold key +30) are not fully implemented — see `docs/GRAPH_AUDIT.md` sections III.8 and III.10.
