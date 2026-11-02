# ENGINE_REPORT.md — Gemini 4 Argon, Part 2 (engine robustness review)

*Delivered in the Gemini app on 2026-11-02 (Gemini 4 Argon) against Part 2 of `audit_cycles/recheck_2026_11/BRIEF_code_review_gemini4.md`, with the 7-file kit `part2_engine` (engine at commit `aaceb31`, registry `v2.198 -> v2.199`). Reproduced as delivered, with the Markdown-export escapes removed. The maintainer's adjudication is in `README.md` next to this file and in the registry, group `group_101_2026_11_02_argon_engine`.*

## 0. Pre-flight

- `src/game_logic.js` — line starting `function useSnakeInCombat`: `function useSnakeInCombat(){`
- `src/game_logic.js` — last top-level function: `initVisualPolishV1`
- `REGISTRY_DIGEST.md` — last line: `END OF DIGEST — 304 items with id and status + 82 legacy entries, registry v2.198 -> v2.199`

*Maintainer's note: all three match the kit the reviewer received.*

## 1. Method and coverage

A static robustness and runtime-path review of all four files:

- **`src/game_logic.js`** (the full file, 85 top-level functions and 9 IIFEs): state initialization and persistence (`initState`, `saveGame`, `renderAutosaveNote`, `normalizeSave`, `loadGame`, `exportSave`, `importSave`); screen, modal and accessibility controllers (`showScr`, `closeModal`, `openMenu`, the `BC_A11Y_DIALOGS` stack, `BC_MOBILE_SHEETS`, `BC_COMBAT_STATUS`, `bcConfirm`, `bcNotice`, `bcAnnounce`, `showItemNotification`, `showDeathOverlay`); narration and audio (`BC_VOICE` with the device, pack and OpenAI engines, `preloadSounds`, `playSound*`, `initVisualPolishV1`); character creation and i18n (`initTitle`, `renderSpellSel`, `startGame`, `applyLang`, `setLanguage`, `repaintAfterLangSwitch`, `applyStaticI18n`, `locSec`, `fmtText`, `updateHUD`); inventory, shops, riddles, dice and betting (`showInventoryModal`, `takeItem`, `dropItemModal`, `closeInvModal`, `canonItem`, `invDisplay`, `flaskMax`, `useFlask`, `addItem`, `removeItem`, the choice gates and costs, the riddle functions, `makePurchaseBtn`, `makeBatchBtn`, `makeBashBtn`, `makeChoiceBtn`, the dice renderers, `applyBetting`, `renderStakePicker`, `renderChoices`, `goTo`); combat and summons (`startCombat`, `combatRound`, `endCombat`, `endCombatRouted`, `activateStagedJoins`, `combatResolved`, the condition buttons, the scripted luck checks, `playerEquipMod`, every special kill path, the spell buttons, `startLuckCheck`, `doLuckCheck`).
- **`src/map_module.js`** (the full IIFE): the map state, node and edge functions, `renderMapSvg`, the map UI, and the monkey-patched wrappers for `initState`, `loadGame`, `saveGame`, `importSave`, `renderGame`, `endCombat`, `showScr`, `initVisualPolishV1` and `__initMap`.
- **`src/game_shell_top.html`** and **`src/mobile.css`**: DOM structure, ARIA attributes, overlays, breakpoints, safe-area insets, scroll containers.

## 2. Findings by severity (as reported)

| Severity | Count | Findings |
|---|---|---|
| P0 (crash or progression block in a rare environment) | 1 | E-001 |
| P1 (state integrity, dialog trap, save normalization bypass) | 2 | E-002, E-003 |
| P2 (mid-modal language switch, dropped-bundle counter, unescaped manual item, narration stop and rate) | 4 | E-004, E-005, E-006, E-007 |
| **Total** | **7** | |

## 3. Findings ranked by impact (as reported)

1. **E-001** — `saveGame()` writes to `localStorage` without try/catch; blocked or full storage aborts game start, choices and pickups.
2. **E-003** — the map module's `window.importSave` replaces the engine's and skips `normalizeSave(s)`: no structural normalization, no legacy migration, no story-flag backfill on import.
3. **E-002** — Escape cannot close the pick-up dialog; the navigation hook stays on «Готово» if the dialog closes any other way.
4. **E-004** — a language switch during a fight or a luck roll leaves the open modal in the previous language.
5. **E-005** — dropping a partly used arrow bundle leaves a stale `S.arrowsLeft` count.
6. **E-006** — a typed item name reaches `innerHTML` and attributes unescaped (self-XSS; save-file XSS when saves are shared).
7. **E-007** — stopping narration can leave the playback promise unsettled (a leaked Blob URL for OpenAI audio); the speed setting is ignored by the bundled pack.

## 4. Looked at, found sound (as reported)

- The `window.S` bridge between `game_logic.js` and `map_module.js`.
- The dialog stack and focus management (nested dialogs, the event-log panel on breakpoint changes, visibility via `getClientRects`).
- The mobile bottom sheets (live DOM nodes moved and restored in reverse order).
- Anti-reroll persistence on F5 and hash jumps: luck checks, scripted luck, dice checks, dice loot and betting commit their outcome to `S` before rendering; betting uses a round id and a ledger; a hash jump clears stale luck records while F5 keeps them.
- The combat lifecycle: every non-round kill path calls `activateStagedJoins` and checks `combatResolved`, so staged joins cannot soft-lock.
- Stamina clamping and death handling, including `fatal_when_stuck`.
- Event listeners: rebuilt containers with direct `.onclick` properties; global listeners registered once.
