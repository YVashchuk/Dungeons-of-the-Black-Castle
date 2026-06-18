# ChatGPT — i18n / Localization Architecture Study (2026-06-18)
Project: «Подземелья Чёрного замка» — a single-file HTML/PWA Russian gamebook (1221 paragraphs).

## The goal (Yuriy's request)
Make the built file `podzemelye-chyornogo-zamka-remake.html` **independent of language and
encoding**, so the game can be translated and the player can switch language at runtime.
Specifically:
1. **Paragraph texts** move to a separate per-language file (Yuriy floated "located by hashing").
2. **Menu / interface texts** move to a separate file.
3. **Button texts** move to a separate file.
4. **Text-bearing images** (e.g. the stylised game-title whose letters are drawn as castle towers)
   move to a **language-bound folder**.
5. The **engine uses a language-neutral key** — an English word or a generated id — to look up the
   text/image, instead of the Russian display string. Yuriy's example:
   `Grant("Свисток")`  →  `Grant("whistle")`  or  `Grant("whistle12345")`.
- Likely a **language-specific folder** the HTML loads from based on the chosen language.
- A **language dropdown** whose options are **auto-detected** from which translations exist.
- **Instant in-game language switch**: refresh the current screen in the new language **while
  preserving the live game state** (stats / inventory / position / spells / flags).
- Possibly also move the html-encoded (base64) **images out to a folder** (e.g.
  `assets/illustrations/web/`) loaded on demand.
- Must run well on: **Windows**, **iPhone 15+**, an **iPad ~4-5 years old**, and **Google Pixel 7a+**.

This is a STRATEGY/ARCHITECTURE study. Deliver a recommended design + a concrete migration plan +
a per-platform validation. Do NOT write the full implementation; do NOT edit the repo.

## How to access the project — GitHub
Repo: `https://github.com/YVashchuk/Dungeons-of-the-Black-Castle` (latest `main`). Read:
1. `src/game_logic.js` — the engine; find EVERY language-coupled path.
2. `build.sh` + `scripts/build_shell.py` — the single-file build pipeline.
3. `PROJECT_NOTES.md` — architecture overview.
4. `src/remake_data.js` — the data (`const GD={...}`, ONE ~1 MB line — parse it, don't grep).
5. `src/mj_art.js` / `src/illustrations.js` — read ONLY their `MJ_MAP` / `ILLUST_MAP` / `MJ_META`
   sections (paragraph→art maps); SKIP the base64 blobs (megabytes) — just note their size/role.
   `src/title_art.js` holds the stylised Russian title lettering (text-bearing art).
If your reader truncates the 1 MB data line, say so and work from the schema + targeted reads.

## Current architecture (facts)
- The deliverable is ONE self-contained `~11.6 MB` HTML file, produced by `build.sh` (which calls
  `scripts/build_shell.py`): it strips the Google-Fonts `@import`, inlines 8 woff2 fonts as base64,
  injects `mobile.css`, then **concatenates JS modules in a fixed order** —
  `remake_data.js → illustrations.js → title_art.js → mj_art.js → map_module.js → game_logic.js` —
  and closes `</script></body></html>`.
- It is designed to **run fully offline by double-clicking the file (`file://`)** — everything is
  inline, there is **no `fetch`, no server, no external file**. This offline-by-double-click property
  is deliberate and is the single biggest constraint on any i18n redesign.
- **Data** `src/remake_data.js`: `const GD={...}` — ONE ~1 MB line, 1221 paragraph objects. Each has
  Russian `text`, `choices[]` (Russian `label`, numeric `target`, gating flags), optional `enemies[]`
  (Russian `name`), and item grants. **Every item is keyed by its Russian display string.**
- **Engine** `src/game_logic.js` (~2530 lines): state object `S` persisted in `localStorage['podzch_v5']`;
  **`S.inventory` stores the Russian item strings verbatim** (saved games depend on them).
- **Art**: base64 inside `mj_art.js` (6.9 MB, colour), `illustrations.js` (3.3 MB, 1991 b/w),
  `title_art.js` (~370 KB, the stylised Russian title lettering).

## Language-coupling inventory (precise — full list in `language_coupling_inventory.md` / the repo)
- **1221** Russian paragraph texts (~396k chars); **2212** choice labels; **65** enemy names.
- **~85 distinct item-identity strings** used directly as engine keys via `inventory_condition` /
  `consume_on_use` / `acquires` / `auto_items.items` / `grants_items` / `bet_payout.items` — and
  **stored verbatim in saved games** (`S.inventory`). Examples: «Корона», «Серебряный свисток»,
  «Чёрная жемчужина», «Целый меч», «Водолазный костюм», «Волшебный колокольчик».
- **7 riddles** (§67, §95, §435, §439, §992, §1113, §1131): the player types a Russian word; the
  engine sums its **letter ordinals** (`ALPHABET_RU`), adds a per-riddle `modifier`, and navigates to
  the result if it is in `valid_targets`. The modifier is tuned to the *Russian* answer's letter-sum.
  A field `alphabet_mode` ('ru_standard' | 'ru_yo_eq') already exists — the data anticipated alphabet
  variants but not full translation.
- Engine logic matched on Russian: `SPELL_KEYWORDS` (огн→FIRE…) + `getSpellId()` label fallback gated
  on /заклят|заклин/; flee detection regex /убежать|бежать|…/; carried-food strings `Название (еда: +N)`
  parsed by regex at ~12 sites; `ITEM_SIZES` and `COMBAT_ALLIES` keyed by Russian item names.
- `SPELLS` (8 names + Russian descriptions); `PREFACE_TEXT`/`PREGAME_TEXT` (big Russian blocks);
  **~293 of 2531 engine lines contain Cyrillic** — 4 `alert()`, 22 `.textContent=`, plus many
  `innerHTML` UI strings (buttons, notifications, modal/overlay/death-screen text, HUD labels).
- **Text-bearing art**: the title lettering (`TITLE_ART`/`TITLE_RIDER`), and some AI illustrations
  contain rendered text artifacts.

## The hard problems (address EACH explicitly)
1. **Item identity vs display name.** ~85 items are keyed by Russian strings across the data, the
   engine, AND saved games. A neutral, stable id per item is needed (readable English key like
   `silver_whistle`, or opaque `item_0042`/hash) with per-language display names — plus a **save
   migration** for existing `podzch_v5` saves whose `S.inventory` holds Russian strings. Recommend the
   id scheme (readable vs opaque) and justify. Note paragraphs ALREADY have stable numeric ids (§1..§1221),
   so paragraph text is the easy case; items / UI / buttons / enemies / spells need a new key space.
2. **Riddles (7).** Letter-sum→modifier→target is intrinsically Russian. Design a per-language riddle
   representation that survives translation (e.g. a normalized-answer→target map, or per-language
   modifier, or hashing the normalized answer) and that handles each language's alphabet, casing, and
   diacritics. Anti-cheat (answers must not sit in plain text) is currently a feature — preserve it.
3. **Offline `file://` vs served PWA — the pivotal trade-off.** Double-click-offline works ONLY because
   everything is inline (no fetch). Loading external locale/image files via `fetch()` FAILS under
   `file://` (CORS), notably on older iPad Safari. Weigh the options and pick one (or a hybrid):
   (a) keep single-file but build ONE BUNDLE PER LANGUAGE; (b) move to a hosted PWA (HTTP/HTTPS) +
   service-worker offline cache; (c) inline locale data as JS objects (no fetch) and externalize only
   images; (d) embed ALL languages in one file and switch at runtime. State the offline/size/perf
   consequence of your choice for EACH target platform.
4. **Text-bearing images per language.** The title lettering must be regenerated per language OR
   replaced with styled web-font HTML text. Define the per-language image folder + manifest + fallback
   to the base language when a localized image is missing.
5. **Instant in-game switch with state preservation.** Re-render the current §N + HUD + inventory in
   the new language without losing `S`. Requires `S` to hold ids (post-migration). Define behavior when
   switching mid-combat or with a modal open.
6. **Auto-detected language dropdown.** A locale manifest the UI reads to list ONLY languages that have
   a translation; define the completeness/fallback policy and how a NEW translation is added with ZERO
   engine changes (drop-in a locale file).
7. **Encoding independence.** Guarantee UTF-8 everywhere; ensure no engine branch depends on Cyrillic;
   keep locale/data files robust against the project's Cyrillic-hostile Windows/PowerShell toolchain
   (e.g. never line-grep the single-line data file; Python `-X utf8`).
8. **Performance on the target devices.** An 11.6 MB DOM on a 4-5-year-old iPad; base64 vs `<img src>`;
   lazy-loading; memory; first paint. Validate the chosen architecture against each device class.

## Target platforms (validate the chosen design against each)
- **Windows** — Chrome / Edge / Firefox (modern). Baseline.
- **iPhone 15+** — modern iOS Safari / WebKit.
- **iPad ~4-5 years old** (e.g. iPad 6th/7th-gen on an older iPadOS / older WebKit) — limited RAM,
  older JS/CSS support, strict `file://` CORS, possible localStorage quota/quirks. This is the
  most constraining target.
- **Google Pixel 7a+** — modern Chrome / Android WebView.
State, per platform, the assumed **delivery method** (double-clicked `file://` vs hosted PWA vs
installed) and whether the offline requirement still holds under your design.

## Your emphasis (you have the full code)
Lead on the **code-level migration**: the concrete **id scheme** and how the engine resolves ids
(replacing the Russian-string keys in `inventory_condition`/`acquires`/`consume_on_use`/`auto_items`/
`COMBAT_ALLIES`/`ITEM_SIZES`/`SPELL_KEYWORDS`/flee-regex/food-regex); the **7-riddle re-architecture**
(`ALPHABET_RU` letter-sum → a translation-safe scheme); the **save-format migration** for
`localStorage['podzch_v5']` (`S.inventory` holds Russian strings); and the precise **`build.sh` /
`build_shell.py`** changes (per-language bundle vs inline-locales vs served). Still produce the FULL
deliverable below.
## Deliverable (what to return)
1. A **recommended i18n architecture**: file/folder layout; the id scheme for paragraphs / items / UI /
   buttons / enemies / spells / images; exactly how the engine resolves an id → localized text/image;
   how locales are loaded (and whether via fetch, inline, or per-language build); the locale-file
   schema (show a small concrete JSON/JS example with a couple of real entries, ids + ru + a sample en).
2. A **concrete, phased migration plan** from the current single-file Russian build: how to mechanically
   extract the 1221 texts / 2212 labels / ~85 items / 65 enemies / 8 spells / 7 riddles / UI strings into
   locale file(s) and replace them with ids in the data+engine; the **save-format migration**; the
   **`build.sh` / `build_shell.py` changes**; how the Russian build stays byte-for-byte playable through
   the transition.
3. A **per-platform validation matrix** (Windows / iPhone 15+ / old iPad / Pixel 7a) for the chosen
   delivery + offline strategy, calling out the `file://`-vs-served decision explicitly.
4. **Risks / unknowns**, and your single highest-confidence recommendation.

## Run mode & language
- Use your **strongest reasoning / extended-thinking** mode. Ground every claim about THIS game in the
  provided files (engine, build, data sample, coupling inventory). You MAY use your general knowledge of
  i18n patterns (JSON catalogs, ICU/gettext-style ids, i18next, etc.) and of the target platforms' web
  capabilities (WebKit/Safari, PWA, service workers, `file://` limits).
- **Deep Research / live web crawling is NOT needed** and tends to burn quota and wander — the relevant
  platform facts are well within your training knowledge. A couple of targeted lookups to confirm a
  specific WebKit/PWA limit are acceptable only if you clearly flag them.
- Write the report in **English**. Quote code, identifiers, and Russian strings **verbatim** (e.g.
  «Серебряный свисток», `inventory_condition`, `ALPHABET_RU`) — never paraphrase an identifier.

