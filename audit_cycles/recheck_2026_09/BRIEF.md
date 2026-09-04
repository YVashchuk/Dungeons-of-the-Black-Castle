# BRIEF — recheck cycle 2026-09 — «Подземелья Чёрного замка» (JS remake)
## Verification of the group_80 engine fixes and the group_79 UI rebuild (stages A/B)

**Audited state:** branch `main`, commit **`459d8a1`**, registry **v2.155** (80 groups).
**Previous cycle:** `audit_cycles/recheck_2026_07_20/` (main @ `2179619`, v2.139). Everything that cycle asked for has been implemented since: **group_80 closed 12/12** (food pipeline, mandatory equip + weightless weapons, the combat lifecycle cluster, staged Weakness targeting, dice persistence, atomic sec.436 Force spend, choice-index plumbing, GAME_RULES label guard) and **group_79 UI closed 11/12** (stage A: UI-09 map i18n + aria channel, UI-10 reduced-motion / pressed states / autosave note, UI-06 viewport + safe-area, UI-04 a11y foundation; stage B: UI-07 Forum Cyrillic display font, UI-11 72ch reading column with choices in the reading flow, UI-03 phone HUD bar + bottom sheets). UI-12 is deferred by the author's decision.

**Mode:** strictly read-only, diagnostic. Deliverable: one `REPORT.md` per track (format in §9). Findings are **hypotheses**; a separate maintainer session re-verifies every one against canon + code + the Node battery before anything is committed.

**The work is split into two independent tracks** (run them as two separate chats; each has its own 10-file attachment set):
- **Track A — UI / accessibility re-audit** of the stage A/B rebuild (code-level review of the shell, CSS and the UI parts of the engine).
- **Track B — mechanics regression recheck** of the group_80 fixes and their interactions, plus the residual reverse search against the canon text.
- **Track C (optional, web-grounded)** — external-standards questions only (see §10). This is the ONLY track where web research is welcome.

---

## 1. ⚠ Accuracy guard — READ FIRST
A previous audit of this exact project was **rejected wholesale as confabulated** (it invented a villain "Bardush"/"Elgariol" — the real antagonist is **«Барлад Дэрт»** — and described paragraph scenes that do not exist), and another session **wrote its whole report from web guesswork because its file access had silently failed**. Therefore:
- **Confirm file access BEFORE analysing anything** — the pre-flight in §2 is mandatory and its proof lines must open your report.
- **Base every statement on the attached files**, quoting Russian text / code verbatim. If something is not covered by the files, write **"not determinable from provided files"** — never fill the gap from imagination or the web (Tracks A/B).
- The maintainer will spot-check several of your claims against the real data; if they do not match, the whole report is discarded.
- You cannot run the game or the Node battery in this mode. Reason from code and data; label every runtime claim as **"by code reading"**. Do not claim to have "tested" anything.

---

## 2. Files — attach by BARE NAME, then pre-flight
Attach the files **by these bare names**, without folder paths in the message (a previous run ignored an attached `game_logic.js` because the prompt referred to it as `\src\game_logic.js`). The human has each track staged in one folder — select all files in the folder and drag them in. Each set is **10 files**, which is the per-prompt cap of some providers — attach nothing else.

### Track A set (staged as `_handoff/audit_upload_2026_09/trackA/`, ~0.4 MB)
| Bare name | What it is (repo location) |
|---|---|
| `game_shell_top.html` | the UI shell: markup for every screen and overlay, all CSS custom properties and the desktop CSS (`src/game_shell_top.html`, ~65 KB) |
| `mobile.css` | phone / tablet overrides, injected into the same `<style>` after the shell CSS (`src/mobile.css`) |
| `fonts.css` | `@font-face` declarations (`src/fonts/fonts.css`); the woff2 binaries are NOT attached and are not needed |
| `game_logic.js` | the engine, incl. the static-i18n localizer (`applyStaticI18n`), the dialog controller (`BC_A11Y_DIALOGS`), the phone HUD/sheet code (`BC_MOBILE_SHEETS`), the autosave note and every renderer that writes into `#c-list` (`src/game_logic.js`, ~167 KB) |
| `map_module.js` | the adventure map module (toolbar handlers, mini-map) (`src/map_module.js`) |
| `MANUAL_SMOKE_CHECKS.md` | the living manual acceptance checklist, C1–C16 (root) |
| `REGISTRY_EXCERPT.md` | extract of the adjudication ledger: changelog v2.139→v2.155 and the group_79 / group_80 items with their **resolutions = the specifications you verify against** |
| `UI_AUDIT_2026_07_14.md` | the previous UI audit (frozen) — the origin of UI-01…UI-12; use it to judge whether each item's resolution honours the original finding |
| `README.md` | project overview (root) |
| `BRIEF.md` | this brief |

### Track B set (staged as `_handoff/audit_upload_2026_09/trackB/`, ~1.4 MB)
| Bare name | What it is (repo location) |
|---|---|
| `game_structure.js` | **the game data** — `const GD = {…}` keyed by paragraph (1221 entries): choices / targets / enemies / `auto_items` / `inventory_condition` / `gold_cost` / `spell` / riddles / dice / deadlines / joins (`src/game_structure.js`; formerly `remake_data.js`). Single-line blob — parse it programmatically, do not eyeball it. |
| `game_logic.js` | the engine (`src/game_logic.js`) |
| `items.json` | the item registry (105 entries: food 20, weapon 3, item 76, flag 6) (`src/registries/items.json`) |
| `GAME_RULES.md` | the LIVING rules census, label v2.155 (`assets/GAME_RULES.md`) — the catalogue of every mechanic; your baseline for blocks V/X |
| `book_text.md` | the full Russian text of all 1221 paragraphs, registry corrections applied — your text source (`assets/book_text.md`, 1:1 mirror of `assets/fb2_remake.fb2` prose) |
| `REGISTRY_EXCERPT.md` | as above — group_80 resolutions are the specifications for block V |
| `MANUAL_SMOKE_CHECKS.md` | as above |
| `REPORT_2026_07_20.md` | your predecessor's report (frozen) — the 12 findings it raised became group_80 |
| `README.md` | project overview |
| `BRIEF.md` | this brief |

### ✅ MANDATORY pre-flight (before any analysis; its output opens your report)
1. List the attached files you can actually read, with their approximate sizes.
2. Proof of access — quote back verbatim: **Track A:** one Russian `data-i18n` default string from `game_shell_top.html` (e.g. the text inside `<h2 id="menu-modal-title" …>`), the comment line that starts with `// >>> BC_A11Y_DIALOGS` from `game_logic.js`, and the first `### UI-…` heading of `REGISTRY_EXCERPT.md`. **Track B:** the first sentence of paragraph 1 from `book_text.md`, the number of top-level paragraph keys you parsed from `GD` in `game_structure.js` (must be 1221), and the first `### ` heading of `REGISTRY_EXCERPT.md`.
3. **If any file did not load, STOP and say so** — do not start the audit and do not substitute a web search. We would rather re-attach.

---

## 3. Canon and the order of truth
The Russian book is the source of truth. Hierarchy: `assets/text_corrections.json` (the adjudication ledger — represented here by `REGISTRY_EXCERPT.md`; it has priority) → `assets/fb2_remake.fb2` (= `book_text.md`) → `assets/book_1991_extracted.txt`. Translations are checked against the RU locale.
- ⚠ The per-paragraph **`**Выборы:**` machine lists** at the foot of each paragraph in `book_text.md` are **STALE**. For the current wiring trust `game_structure.js`, never those lists.
- **Closed adjudications are not re-litigated without new evidence.** `REGISTRY_EXCERPT.md` §5 lists the `VERIFIED_RESOLVED` items and §4 the graveyard; see also §8 of this brief.

---

## 4. What changed since the last cycle (orientation)
- **Engine (group_80, v2.143→v2.149):** food objects normalised to `{kind:'food',id,stamina}` + slot-free "eat now"; `auto_items.equip` mandatory equip/swap (sec.71/1213) and weightless weapons (`slotCost:0`); `combatResolved(cs)` as the single victory primitive, idempotent `updateCombatConditionButtons`, instant-kill Met for every non-flee win; `cs.weakPickIdx` staged-waiter targeting for Weakness; persisted fate rolls sec.781/932 (records committed BEFORE the outcome is shown); sec.436 Force spend moved into the fight onclick; the four post-luck `renderChoices` branches now pass the original choice index (`withIdx`) so `shopBought` / `batchPicked` key by real indices; `normalizeSave` prunes legacy `[null]` / `':undefined'` markers (lenient by design); GAME_RULES label guard.
- **UI stage A (v2.150→v2.151):** map toolbar localised, new `data-i18n-aria` channel in `applyStaticI18n` (five channels now), map refresh moved after the static pass in `repaintAfterLangSwitch`; `prefers-reduced-motion` global rule; `:active` pressed states; autosave note in the menu (`lastAutosaveAt`, `renderAutosaveNote`); dialog controller `BC_A11Y_DIALOGS` (MutationObserver on the `on` class of `.modal-overlay` / `.end-overlay`: role/aria-modal/labelledby, initial focus, focus return, Escape only when the dialog contains a `closeModal(` control, Tab trap); `:focus-visible` gold ring; live regions on item notifications (`role=status`) and the luck result; `viewport-fit=cover`; safe-area insets moved from `body` to `.scr` / `.modal-overlay` / `.end-overlay`; dvh fallbacks; `clamp()` paddings on preface/pregame; `max-height:600px` title-screen rule.
- **UI stage B (v2.152→v2.154):** font chains `Cinzel / Cinzel Decorative → Forum (Cyrillic range only) → Cormorant Garamond → serif`, Veles Redone / Cyrillic Old Face removed; `.reader` wrapper (`max-width:72ch`) with `.choices-area` moved INTO the reading flow under a `Ваш выбор` heading (the UI-01 scroll cap retired); phone HUD bar `#hud-bar` (chips `hb-*`, six buttons) and bottom sheet `#overlay-sheet` (`openSheet(kind)` MOVES the live sidebar nodes `#sb-spells` / `#sb-flask`+`#sb-inv` / `#sb-notes` into the sheet and `returnSheetSection()` puts them back on `closeModal('overlay-sheet')`; `syncHudBar` wraps `updateHUD`; the event-log FAB is hidden on phones via `isMobileHud()`); landscape sidebar rule scoped to 701–900 px.
- **Tests:** `run_all.js` now includes the six `_dist_*_check.js` (16 harnesses + 6 dist checks + baseline 1205); 6d guards 42; `_dist_ui_check` 42; 2C-SHELL harness 213; smoke checks C1–C16 (C14–C16 cover the stage-B visuals and are still pending the author's eyes).

---

## 5. Track A scope — UI / accessibility (priority order)
Verify each stage A/B item **against its resolution in `REGISTRY_EXCERPT.md`** (the resolution is the spec) and against the original finding in `UI_AUDIT_2026_07_14.md`. For every block report VERIFIED-OK or a finding.

- **U1 Dialog controller** (`BC_A11Y_DIALOGS`): trace `_bcDialogOpened` / `_bcDialogClosed` / `_bcTopDialog` / the keydown handler by code reading. Check: initial-focus target choice; focus return when the opener was re-rendered; Tab / Shift+Tab wrap; Escape gating by the presence of a `[onclick*="closeModal("]` control (combat / luck / death / item-offer dialogs must NOT be dismissible); `aria-labelledby` derivation from the first heading; the MutationObserver's scope (`attributes` on `document.body` subtree — cost during combat re-renders?). **Hot spot to trace:** `_bcTopDialog()` returns the LAST `.on` overlay in DOM order, not in opening order — `#overlay-sheet` sits at the end of `<body>`, after `#modal-inventory` and `#overlay-map`. Can two dialogs be open at once (e.g. the `M` hotkey opening the map while a sheet is open, or an item-offer modal opening under a sheet), and if so which one receives Escape / the Tab trap / the paint order (all `.modal-overlay` share `z-index:100`)?
- **U2 Keyboard reachability and focus visibility:** the `:focus-visible` rule versus every `outline:none` reset in the shell (list them with specificity); every interactive element reachable by keyboard (the `inv-add` span, the mini-map card, HUD buttons, sheet close, map controls, riddle input, dice widgets); inline `onkeydown` handlers on the span/div controls.
- **U3 Live regions:** `role=status` + `aria-live=polite` on item notifications, `aria-live` on `#luck-result`; the combat log and the event log are deliberately NOT live (they rebuild via `innerHTML`; a stage-B refactor is noted) — assess whether that leaves keyboard/SR users without essential combat feedback and, if so, propose the minimal live channel.
- **U4 Responsive / safe area:** `viewport-fit=cover`; insets on `.scr` / `.modal-overlay` / `.end-overlay` (and the `+40px` base on `.end-overlay`); the item-notification offsets; every remaining `position:fixed` element (event-log panel, event-log FAB, anything else) — is any still under a notch / home indicator? dvh fallbacks; the `max-height:600px` title rule (auto-margin centring); `clamp()` paddings; the breakpoint split `≤700px` (HUD layout, both orientations) vs `701–900px landscape` (sidebar) vs desktop — any width/orientation combination with no coherent layout?
- **U5 Reading flow (UI-11 A):** `.reader{max-width:72ch}` — confirm the ch unit is computed from the body face (the wrapper sets `font-family`/`font-size`); the `Ваш выбор` heading and `#c-list` for every renderer that writes there (`renderChoices`, `renderRiddle`, `renderDiceRoll`, `renderDiceCheck`, `renderDiceLoot`, `renderStakePicker`, post-combat re-render, shop re-render) — does the heading make sense for each? scroll reset on paragraph change; long choice lists (sec.132 = 25, sec.340 = 15) reachable; `hide-inline-art` toggle; the illustration inside the capped column.
- **U6 Phone HUD + bottom sheets (UI-03 A):** the node reparenting (`_bcSheetHome` next-sibling logic when two nodes move, e.g. `sb-flask` + `sb-inv`); `.sb-section-title` hidden inside the sheet and the sheet title snapshot; `syncHudBar` timing (wrapper installed after `updateHUD` is declared; any `updateHUD` call path that bypasses the global binding?); `showScr` FAB gating + the `matchMedia` change listener (sheet closed when leaving the phone breakpoint); HUD height budget (target 56–72 px) on a 360-px-wide phone with the six 36-px buttons; the flask button living in the bag sheet; the sheet and the `M` hotkey; language switch while a sheet is open.
- **U7 Fonts (UI-07 B):** `fonts.css` Forum block — unicode-range coverage for Ukrainian (є ї ґ) and `№`; per-glyph fallback order in both chains (`--font-ui`, `--font-title`); `font-display:swap` implications; uppercase + letter-spacing button styles with Forum metrics; `.end-title` at 42 px; removed faces truly gone from every CSS reference; OFL attribution (`OFL.txt`).
- **U8 i18n channels:** the five `data-i18n*` channels in `applyStaticI18n` and the `data-i18n-aria` keys on HUD/map/sheet controls; aria-label quality where a key carrying an emoji is reused (`ui_lbl_map`, `ui_btn_log`, `ui_btn_menu` — known, P2 at most); the map topbar placeholder (`ui_map_topbar_hint`) vs the runtime layer line ordering; the autosave note format per locale.
- **U9 Regression of the earlier stage-A items** (UI-01/02/05/08 — done in July) — quick re-verification against their resolutions.

Do not propose redesigns beyond the resolutions; UI-12 (launcher icon, inline-style extraction) is deferred by the author.

---

## 6. Track B scope — mechanics (priority order)
- **V. Verify the 12 group_80 resolutions (priority 1).** For each item in `REGISTRY_EXCERPT.md` §2 confirm the triple "canon (`book_text.md`) ↔ resolution ↔ code/data": V-01/R-02 food pipeline (normalisation site, eat-now, slug maps); V-02/G2-01 `auto_items.equip` at sec.71 / sec.1213 and `slotCost:0` weapons; X-01/X-02/X-03 (`combatResolved`, `updateCombatConditionButtons`, instant-kill Met for all non-flee wins — trace every victory path: normal, Copy, larva, Death-of-Orcs wipe, deadline win); V-03 `weakPickIdx` (staged waiters clickable pre-round-1, consumption preference, debuff riding a waiter — sec.1175 / sec.628); V-04 sec.781 / sec.932 persisted records (written BEFORE display; restore on reload / revisit; Continue-without-pick commits the refusal); X-04 sec.436 (flag consumed in the fight onclick, pre-luck flow unreachable until the fight starts); R-01 (original index through the four post-luck branches; `normalizeSave` pruning — assess the lenient migration for exploits, e.g. a hand-edited save re-arming one-shot purchases); R-03 (label guard).
- **X. Interactions (priority 2).** Pairwise pass over the mechanics of `GAME_RULES.md` §§2–8 with special attention to the NEW combinations: reading flow × post-combat choices (`combatWon` branch renders into `#c-list` inside the scroller); dialog controller × combat modal (initial focus on `Удар!`, Escape no-op, Tab trap with dynamically shown spell buttons); sheets × item-offer modal (`showItemOffer` / `modal-inventory` opening while a sheet is open — reachable?); HUD sync × every path that mutates stats without `updateHUD`; hash entry (`#N`) × sheet / HUD state; F5 windows that the previous cycle closed — sec.436, shop index, dice records — verify by save round-trip reasoning; autosave note × reload (timestamp not persisted — by design) ; reduced-motion × any `animationend`-driven logic; language switch × combat modal / sheets; `pickup_batch` × the new index plumbing.
- **G2. Residual reverse search (priority 3).** The June 2026 arithmetic sweep and the July G2 pass are considered exhaustive; only report a canon order («вычтите/прибавьте/только если/не успеете/за N раундов/предмет действует…») that is provably unwired in `game_structure.js` AND absent from `REGISTRY_EXCERPT.md` §4–5.
- **R. Regression A–F.** Structural / i18n / doc checks as in the previous cycle. Current census at `459d8a1` (compare deltas with the changelog, not with the previous report): paragraphs 1221 · navigation edges 2218 · `auto_items` sections 179 · combat pids 76 / enemy entries 120 / multi-enemy 24 · spell hooks 100 + 3 `spell_any` · `inventory_condition` 131 · `acquires` 15 · `gold_condition` 34 · `gold_cost` 58 · `purchase` 36 · `pickup_batch` 5 · riddles 7 · dice sections 6 · `round_deadline` 4 · `player_attack_mod` 10 · `combat_condition` 4 · items.json 105 (food 20, weapon 3, item 76, flag 6) · ui keys **331 ×4** (RU/EN/FR/UK parity mandatory) · 6d guards 42 · dist_ui_check 42 · 2C-SHELL 213. FR punctuation (NNBSP before `?!;`, NBSP before `:`), apostrophes `’` and guillemets with NBSP apply to the NEW ui keys too.

---

## 7. Severity
P0 — a fix contradicts canon or its resolution, or an interaction breaks navigation / data / the dialog focus model; P1 — a mechanic or UI behaviour with a noticeable effect, an undocumented deviation, a WCAG 2.2 AA failure on a primary flow; P2 — cosmetics, docs, tests, aria-name quality.

---

## 8. Do-not-re-flag (established truth)
- Everything in `REGISTRY_EXCERPT.md` §4 (graveyard, incl. `memory_backlog_reconciliation_2026_09_04`: spell decrement, paragraph arithmetic, bird guide, Vodyanoy, infinite arrows, sec.688, gold signs, passive effects, luck dead-ends, Green Sword, Gold Key, offer/text gates, Magic Belt, the stat list) and §5 (`VERIFIED_RESOLVED`).
- Deliberate design points of stages A/B: Escape does not dismiss dialogs without an explicit close control; combat/event logs are not live regions (refactor noted); `≤700px` in both orientations uses the HUD layout; the lenient legacy-save migration; emoji-bearing keys reused as aria-labels; the sheet title snapshot; the map topbar placeholder is overwritten at runtime by design; UI-12 deferred (launcher icon, inline-style extraction); art quality and Midjourney backlog out of scope.
- The 54 intentionally unreachable mechanic entries (group_29); FB2 typos sec.416 "1366" / sec.849 "1830" (choices already route correctly); the antagonist is «Барлад Дэрт».
- The previous cycle's closed adjudications: sec.526 regression pinned; sec.482 feather granted; sec.932 / group_18 attribution; RU sec.1113 / sec.1131 "FB2-faithful, no change".

---

## 9. Report format
One `REPORT.md` per track (English prose, all game quotes in Russian, no external web canon in Tracks A/B):
0. **PRE-FLIGHT** — the proof lines of §2.
1. **VERIFIED-OK** — per block (A: U1–U9; B: V/X/G2/R) with volumes: how many items were checked and matched.
2. **FINDINGS** — table `id | block | severity | §§ / keys / selectors | evidence (exact code or Russian quote; when disagreeing with a resolution, quote the resolution) | suggested minimal fix`. Every row is a hypothesis; mark "verified by code reading" vs "suspected".
3. **COUNTS** — P0/P1/P2 and your single highest-confidence finding.
4. **NOT-CHECKED** — what you could not determine from the provided files, and why.

Export the report to Markdown (PDF is acceptable); the maintainer archives it with its SHA-256 next to this brief and opens the next registry group from the accepted findings.

---

## 10. Track C (optional, web-grounded) — standards questions only
Run this ONLY as a separate research task where web sources are expected; cite them. Attach `fonts.css`, `mobile.css` and `game_shell_top.html` for context. Questions: (1) WCAG 2.2 AA criteria applicable to modal dialogs and focus management (2.1.2, 2.4.3, 2.4.7, 2.4.11/12, 4.1.3) and whether a MutationObserver-driven controller with Escape gating and a Tab trap satisfies them; (2) current browser support and pitfalls of `dvh`/`svh`, `env(safe-area-inset-*)` with `viewport-fit=cover`, and `prefers-reduced-motion` global resets; (3) typographic evidence for the 66–75-character line-length band and the `ch`-unit caveat across fonts; (4) Forum (Denis Masharov, SIL OFL 1.1) glyph coverage for Ukrainian and the licensing obligations when embedding it as base64 in a single-file HTML. Deliverable: `STANDARDS.md` with sources — no project findings in this track.
