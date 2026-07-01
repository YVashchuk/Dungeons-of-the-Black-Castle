# Phase 2 — i18n switching infrastructure

Goal: make the engine language-switchable. Phase 1 separated structure (`game_structure.js`) from
text (`locale.ru.js`). Phase 2 builds the machinery to register multiple locales, switch the active
language live (preserving game state), and pick a language in the UI — **with RU as the only registered
locale for now**. The actual EN/FR/UK translation content is deferred until after the redesign.

Conventions established (see TRANSLATION_GUIDE.md for the full how-to):
- One file per language: `src/locale.<code>.js`, defining `const LOCALE_<CODE> = { … }` with the **same
  shape** as `LOCALE_RU` (sections: spells, allies, preface, pregame, ui, enemies, map, p).
- Registered in the `LOCALES` map in `game_logic.js`; added to `build.sh` concatenation.
- Fallback chain: active locale → RU → raw key. So a partially-translated locale is always playable.

---

## Increment 2a — locale-registry indirection (ACTIVE_LOCALE + RU fallback) · 2026-06-18
**File:** `src/game_logic.js`.

**What:** introduced the locale registry and rewired all text resolvers to read the **active** locale
instead of `LOCALE_RU` directly. New block before the resolvers: `const LOCALES = {}` (RU self-registered),
`DEFAULT_LANG='ru'`, `let activeLang`, `let ACTIVE_LOCALE` (defaults to `LOCALE_RU`), plus `availableLangs()`
and `getLang()` helpers. The 7 resolvers — `pText`, `label`, `locSec` (riddle `rfl`), `spellText`,
`allyText`, `t`, `enemyName` — now resolve **active → RU → key** per key, both lookups `typeof`-guarded.

**Why behaviour-identical:** RU is the only registered locale and `ACTIVE_LOCALE` defaults to `LOCALE_RU`,
so every lookup returns the RU value exactly as before. Deliberate design point: when `ACTIVE_LOCALE` is
*undefined* (as in the standalone-eval regression harnesses), the resolvers fall straight back to
`LOCALE_RU` — so all prior harnesses pass **unmodified**.

**Verification:** `node --check` OK. **2a harness 25/25** — RU-default identity for every resolver type
(pText/label/locSec+riddle/spellText/allyText/t/enemyName) vs direct `LOCALE_RU` reads, plus per-key
fallback proven with a synthetic partial locale (active key → active value; missing keys → RU; unregistered
active locale doesn't appear in `availableLangs()`). All regressions unchanged (6a 10, 6b 16, 6c-1 8,
6c-2 5, 6d 11, 6e-1 10, 6e-2 10, Group B 21, 5f 29). Structural baseline 1205 reachable / 16 unreachable.
dist verified (`const LOCALES`, `let ACTIVE_LOCALE`, `availableLangs`, resolvers reference `ACTIVE_LOCALE` ×16).

**Next:** 2b — `setLanguage(code)` (swap `ACTIVE_LOCALE` + `activeLang`, persist to localStorage, re-resolve
map titles via `.titleKey`, re-render current view without losing state) + make `PREFACE_TEXT`/`PREGAME_TEXT`
switch-aware + load saved language on startup. Then 2c — minimal language picker in the shell (restyled in the
redesign). Then 2d — `TRANSLATION_GUIDE.md` + README update.

**Commits:** source (game_logic + log), then dist.


---

## Increment 2b — setLanguage + persistence + live re-render · 2026-06-18
**Files:** `src/game_logic.js`, `src/map_module.js`, `src/locale.ru.js`.

**What:** the actual language-switch machinery on top of 2a's `ACTIVE_LOCALE` indirection.
- `setLanguage(code)` validates the code against `LOCALES`, swaps `ACTIVE_LOCALE`+`activeLang` (via `applyLang`),
  persists the choice to `localStorage['blackcastle-lang']`, and live re-renders the current view. Exposed on
  `window` (with `availableLangs`/`getLang`/`getLangName`) for the upcoming picker.
- `applyLang(code,opts)` is the internal switch: invalid code → `DEFAULT_LANG`; `opts.silent` re-resolves map
  titles without a repaint (used at startup).
- `loadSavedLang()` reads the saved code (falls back to `DEFAULT_LANG` if unset/unregistered). Wired into
  `window.onload` BEFORE the first render so a saved language is active on load.
- Live re-render (`repaintAfterLangSwitch`): re-resolves map titles, re-injects preface/pregame, re-renders the
  current paragraph if in-game (else just the HUD).
- `PREFACE_TEXT`/`PREGAME_TEXT` consts → `prefaceText()`/`pregameText()` functions (active→RU); the two inject
  sites now call shared `renderPregameText()`/`renderPrefaceText()` helpers (reused by the repaint path).
- Map titles: `window.bcRefreshMapLanguage(activeLocale)` added INSIDE the map IIFE (where `BC_MAP_DEF` is
  closure-scoped) — re-resolves every layer/node/encounter `.title` from `.titleKey` (active→RU→key) and
  re-renders the map if its overlay is open.
- Endonym: language display name lives in the locale as `LOCALE_RU.langName="Русский"` (each future locale brings
  its own); `getLangName(code)` reads `LOCALES[code].langName`. Keeps the engine Cyrillic-free.

**Two correctness points:**
- `renderGame(opts)` — `applyBetting(sec)` (which runs on EVERY visit, committing stakes / paying out) is now
  guarded by `if(!(opts&&opts.repaint))`, so a language-switch repaint can't double-charge a gambling paragraph.
  `auto_items` is already first-visit-gated, so it's safe on repaint.
- Mid-combat enemy-name switching is NOT supported (combatState stores resolved RU names, slug discarded at
  startCombat). Moot — the picker (start screen + menu) is unreachable behind the combat overlay. Documented as a
  known limitation for the 2c rework.

**Verification:** `node --check` both files OK. **2b harness 44/44** (switch/validity/persistence, loadSavedLang
fallback, synthetic-locale switch + per-key RU fallback, endonym from locale, window exposures, repaint dispatch,
+ structural guards). All regressions green after updating two scratch harnesses for the 2b shape (2a: window
stubs since its slice now spans the 2b block; 6b: reads the new `prefaceText()`/`pregameText()`): 2a 25, 6a 10,
6b 16, 6c-1 8, 6c-2 5, 6d 11, 6e-1 10, 6e-2 10, Group B 21, 5f 29. Structural 1205. dist verified
(setLanguage / bcRefreshMapLanguage / renderGame(opts) / betting-guard / onload-load / langName all present; no LANG_NAMES).

**Known follow-up:** check whether the HTML shell (`game_shell_top.html`) has hardcoded Russian (title-screen
buttons etc.) outside the locale system — if so it won't language-switch (a Phase-1-completeness gap, not a 2b blocker).

**Next:** 2c — minimal visible language picker (start screen + menu), per option #1, plus a registry TODO that it
must later be reworked more functionally.

**Commits:** source (game_logic + map_module + locale.ru.js + log), then dist.


---

## Increment 2c — minimal language picker (start screen + menu) · 2026-06-18
**Files:** `src/game_logic.js`, `src/game_shell_top.html`, `assets/text_corrections.json`.

**What:** a minimal, visible language picker (per option #1), data-driven from the locale registry.
- `renderLangPicker(containerId)` (game_logic.js): renders a 🌐 marker + one button per `availableLangs()` code,
  labelled with `getLangName(code)` (the locale's endonym), highlighting the current language; clicking a
  non-current language calls `setLanguage(code)` then re-renders. `renderAllLangPickers()` refreshes both
  pickers. Both exposed on `window`.
- Two containers in the shell: `#lang-pick-title` in `.t-text-col` (after the start buttons) and
  `#lang-pick-menu` at the top of `.menu-content`.
- Hooks: rendered at startup (`window.onload`, after `initTitle`) and refreshed on every switch (added to
  `repaintAfterLangSwitch`). Auto-populates as locales register — only RU shows today.
- The picker adds **no new hardcoded Russian**: the marker is a globe glyph (escape, not a literal) and the
  labels are endonyms from the locale, so the 6c-1 no-Cyrillic-in-engine invariant holds.

**Registry (`group_68_2026_06_18_i18n_phase2c_picker_and_shell`):** two OPEN follow-ups recorded —
1. `picker_functional_rework` — the picker is intentionally minimal; rework it (dropdown, accessibility,
   placement, styling) during the UI redesign. Auto-populates as locales register, so no data change needed.
2. `shell_chrome_i18n_gap` — **discovered during 2c:** `src/game_shell_top.html` still hardcodes ~93 Cyrillic
   runs of UI chrome (title author/subtitle/description, creation-screen labels + stat descriptions,
   spell-screen text, sidebar labels, combat/luck/inventory/map/menu modal text, input placeholders, death/win
   screens). Phase 1 item 6 externalized only the JS (game_logic.js + map_module.js), not the HTML shell. These
   do NOT language-switch and must be extracted into `LOCALE_RU.ui` (with resolvers / data-i18n hooks applied at
   render) before any non-RU locale is published. **Recommended next i18n increment.**

**Verification:** `node --check` OK; registry re-parses as valid JSON. **2c harness 30/30** (picker renders globe
+ endonym buttons from availableLangs; current highlighted; two-locale render; click switches language +
re-highlights + persists; missing-container guard; + structural guards on hooks/containers/registry). All
regressions green (2a 25, 2b 44, 6a 10, 6b 16, 6c-1 8, 6c-2 5, 6d 11, 6e-1 10, 6e-2 10, Group B 21, 5f 29).
Structural 1205. dist verified (picker fns + window exposure + both shell containers present).

**Next:** 2d — `TRANSLATION_GUIDE.md` + root README update (documents the finished scheme). The shell-chrome
extraction (`group_68` item 2) is the recommended increment before publishing a 2nd locale; sequencing is Yuriy's call.

**Commits:** source (game_logic + shell + registry + log), then dist.


---

## Increment 2c-shell — static UI-chrome i18n (data-i18n) · 2026-06-18
**Files:** `src/game_shell_top.html`, `src/locale.ru.js`, `src/game_logic.js`, `assets/text_corrections.json`.

**What:** externalized the hardcoded UI chrome discovered during 2c so it language-switches. Mechanism:
`data-i18n` attributes resolved by a new `applyStaticI18n()`.
- **Shell:** 76 hooks across all screens — `data-i18n` (textContent, 67 occurrences / 66 unique keys),
  `data-i18n-html` (innerHTML for markup: the 3 stat descriptions with `<br>` + the spell-screen intro block, 4),
  `data-i18n-ph` (placeholders: hero name, add-item, notes, 3), `data-i18n-title` (title attrs: inventory
  add-item, map-mini-card, 2). RU text is KEPT inline as the fallback; the locale is the source of truth.
- **locale.ru.js:** 77 new `ui_*` keys under `LOCALE_RU.ui`, **harvested verbatim from the HTML** by the
  extraction script (so locale == shell — no transcription drift, no mojibake). Includes `ui_doc_title`
  (browser-tab title), which has no element hook.
- **game_logic.js (`BC_I18N_2C_SHELL` markers):** `applyStaticI18n()` walks the four attribute families and sets
  textContent / innerHTML / placeholder / title from `t(key)`, guarded by `v!==k` (a missing key leaves the
  inline RU fallback); also sets `document.title` from `ui_doc_title` and `documentElement.lang` from `getLang()`.
  Called at startup (onload, right after `renderAllLangPickers()`) and on every switch (added to
  `repaintAfterLangSwitch`).
- **Intentionally NOT hooked** (JS sets them dynamically — verified against game_logic.js): `btn-combat-round`
  and the combat spell buttons (`btn-force/weakness/copy/heal-spell`), `btn-heal`, `s-num`, `sb-name`,
  `inv-count`, the map mini-meta / state-note (map module), and `death-text` (per-death message).
  `btn-summon-ally` / `btn-summon-ally2` share one key (`ui_btn_summon_ally`).
- The new-game `confirm()` string was converted from a literal to `t('ui_confirm_new_game')`. **No new
  hardcoded Russian in the engine** — 6c-1 still 8/8.

**Registry:** `group_68` item `shell_chrome_i18n_gap` -> **DONE** (resolution recorded). `picker_functional_rework`
remains OPEN.

**Verification:** `node --check` OK; locale re-parses (298 ui keys, 77 `ui_`-prefixed). **New 2c-shell harness
157/157** — every `data-i18n*` key exists in `LOCALE_RU.ui`; the real `applyStaticI18n` (eval'd between its
markers) round-trips against DOM stubs (text / html / placeholder / title + document.title + documentElement.lang);
structural guards on the def + window export + both hooks. All regressions green (2a 25, 2b 44, 2c 30, 6a 10,
6b 16, 6c-1 8, 6c-2 5, 6d 11, 6e-1 10, 6e-2 10, Group B 21, 5f 29). Structural 1205. dist verified (67/4/3/2 attrs
+ `applyStaticI18n` + 77 `ui_` keys + onload hook present).

**Next:** 2d — `TRANSLATION_GUIDE.md` + root README (now that the scheme, including the shell `data-i18n` layer, is
complete). Then translations (EN/FR/UK): each new `LOCALE_<CODE>` mirrors the RU shape incl. its `langName` and the
`ui_*` chrome keys, registers in `LOCALES`, and is added to `build.sh`.

**Commits:** source (shell + locale.ru.js + game_logic + registry + log), then dist.
