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
