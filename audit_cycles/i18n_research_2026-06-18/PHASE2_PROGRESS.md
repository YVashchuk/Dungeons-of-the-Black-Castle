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
