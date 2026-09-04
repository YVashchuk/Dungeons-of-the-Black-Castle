# BRIEF — recheck cycle 2026-09 — THIRD AUDITOR (ChatGPT, full repository archive, code execution)
## Independent verification of everything the cycle produced (group_81 30/30) plus a fresh interaction / UI / canon pass

**Audited state:** branch `main` at the commit named in your archive's root folder (`Dungeons-of-the-Black-Castle-<hash>`), registry **v2.161** (last `version_history` key `v2.160 -> v2.161`). The cycle brief `audit_cycles/recheck_2026_09/BRIEF.md` (written at v2.155) still defines the block taxonomy (U1–U9 / V / X / G2 / R) — read it first; this document overrides its file-attachment mechanics and extends its scope.

**What happened before you:** Gemini 3.1 Pro audited Track A (4 findings, `REPORT_gemini_trackA.md`); its combined A+B run was discarded (`REPORT_gemini_trackB_combined.md`, see the registry group_81 comment). Claude (Fable 5.1 via Windows MCP) audited both tracks with a real battery run (`REPORT_claude_trackA.md` 18 findings, `REPORT_claude_trackB.md` 8 findings). Every accepted hypothesis became a group_81 item and was implemented in four batches (`79124a5`, `be487e2`, `490d968`, `50f211e`) — **all 30 items are DONE at your state**, with resolutions that are now the specifications. Three of them were P0: weapons were not weightless (`ITEM_SIZES[...]||1`), the sec.131 eagle never woke after a non-round kill of the goblin, and the letter-riddle renderer wrote into a container that never existed.

**Your role:** the third, independent eye. (1) Verify all 30 group_81 resolutions against canon + code — they are new code, do not assume they are right; (2) hunt side effects and interactions of those changes; (3) run your own UI / accessibility pass; (4) residual canon search; (5) regression with the battery actually executed. Findings are hypotheses; the maintainer re-verifies each against canon, resolution and code before anything is committed.

---

## 1. ⚠ Accuracy guard — READ FIRST
- **Confirm the corpus BEFORE analysing anything** (pre-flight in §2; its output opens your report).
- **Base every statement on the files in the archive**, quoting Russian text / code verbatim. Write **"not determinable from provided files"** where that is the truth. **No web browsing** in this task; a previous audit of this project that drifted to web guesswork (an invented villain, invented scenes) was discarded wholesale.
- You **may execute code** in your sandbox: run the battery, write Node scripts against the data, simulate DOM behaviour with a library **only if it is already present** in the sandbox (never install from the network; if it is absent, say so and reason by code). Work on the extracted archive; do not modify it — if a script needs to write, write to a scratch folder outside the archive.
- Label each claim: **"verified by code reading"**, **"verified by execution"** (with the command), or **"suspected"**. The maintainer spot-checks claims; mismatches discard the report.

---

## 2. Corpus and MANDATORY pre-flight
The user attached one ZIP: a GitHub archive of `main` at the audited commit with **`assets/illustrations/` removed** (388 MB of Midjourney originals, irrelevant to this audit). Everything else is present, including `dist/` (built artifact + `dist/art`), `assets/art`, the four locales, the tests and the vendored `tests/vendor/acorn.js` that lets the battery run **offline** (no `npm install` needed).

Pre-flight — print all of this at the top of your report:
1. The archive root folder name (contains the commit hash) and the total file count you extracted; `node --version`; `python3 --version` (or `python`).
2. From the repository root: `node tests/run_all.js` — the final line must read exactly `BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)`; quote it and the `p1_6d_harness.js` / `_dist_ui_check.js` / `p2_shell_i18n_harness.js` lines (expected 48 / 50 / 215 passed). If the battery is red, STOP and report which harness failed and why before doing anything else.
3. The last key of `version_history` in `assets/text_corrections.json` (expected `v2.160 -> v2.161`) and the item count of `pending_corrections.group_81_2026_09_04_recheck` (expected 30, all `DONE`).
4. Proof quotes: the first sentence of paragraph 1 in `assets/book_text.md`; the number of top-level paragraph keys parsed from `GD` in `src/game_structure.js` (must be 1221 — parse it programmatically, it is a single-line blob); the first `### ` heading of `audit_cycles/recheck_2026_09/REGISTRY_EXCERPT_v2.md` (it names a group_81 item).
5. If anything does not match, stop and say so — do not substitute guesses.

Mandatory reading (all in the archive): `audit_cycles/recheck_2026_09/BRIEF.md` (taxonomy, canon order, do-not-re-flag), `audit_cycles/recheck_2026_09/REGISTRY_EXCERPT_v2.md` (**the specifications**: every group_81 item with the auditor's hypothesis, the maintainer's adjudication note and the resolution; plus group_80 / group_79 and the graveyard), `assets/GAME_RULES.md` (living rules census, label v2.161), the three archived reports (`REPORT_claude_trackA.md`, `REPORT_claude_trackB.md`, `REPORT_gemini_trackA.md` — frozen; know what was found and how it was closed), `MANUAL_SMOKE_CHECKS.md` (C1–C19), `tests/README.md`.

Canon note: `assets/book_text.md` mirrors `assets/fb2_remake.fb2` with the registry corrections applied; its per-paragraph `**Выборы:**` machine lists are STALE — trust `src/game_structure.js` for wiring. The FB2 intro rule that makes weapons weightless («деньги и оружие в заплечный мешок не кладутся») lives in `assets/fb2_remake.fb2` (intro), not in `book_text.md`.

---

## 3. Tracks — run as two separate chats
- **Track A (UI / accessibility):** verify the 22 UI-side group_81 resolutions (`UA-01..UA-04`, `CA-01..CA-18`) and run the independent pass U1–U9 from `BRIEF.md` §5 on the current shell, CSS and engine. Report file: `REPORT_trackA.md`.
- **Track B (mechanics):** verify the 8 engine-side group_81 resolutions (`B-01..B-08`) and spot-verify group_80; interactions (§4 below); residual canon search; regression census. Report file: `REPORT_trackB.md`.
Both tracks run the battery in their pre-flight.

---

## 4. Track B scope (priority order)
**V. Verify the group_81 engine resolutions (priority 1).** For each of B-01..B-08 confirm canon ↔ resolution ↔ code, and for the behavioural ones prefer execution: write a tiny Node harness in the style of `tests/p1_6d_harness.js` (it shows how to `eval` engine functions with stubs) and run it. Specific probes:
- **B-01** `getItemSize` numeric lookup: `getBagUsed()` with the two swords + shield in the bag; the offer modal's Take gating (`renderInvModalCurrent`), `applyChoiceAcquires` (sec.35 optional sword), `makePurchaseBtn` overflow check, `pickup_batch` free-slot math, `dice_loot` (sec.932) free-slot math — every consumer of item sizes.
- **B-03** `activateStagedJoins` script-aware activation: trace sec.131 through every kill path (round, Copy `useCopyInCombat`, larva `useLarvaInCombat`, ally `useAllyInCombat`, Death of Orcs at open in `startCombat`); sec.1175 the same, plus the timing of `promptCanon1175Luck` after a non-round first-orc kill (the resolution says one round later — is that canon-acceptable and does it still fire exactly once?); interaction with `round_deadline` fights (none of the four has scripts — confirm) and with `combat_condition` buttons.
- **B-02** take-then-eat and eat-then-take orders in the offer modal; the `_eaten` flag persisting on a bag entry; food already in the bag when the offer opens.
- **B-07** `S.luckChecks`: persisted at roll, restored in `renderChoices`, cleared in `goTo`, backfilled in `normalizeSave`; check hash entry (`#N` → `window.onload` sets `S.section` without `goTo` — can a stale record for the same section survive?), the fatal-unlucky seven (sec.203/289/377/418/421/1186 + scripted 436 — the sec.436 script uses `startScriptedLuckCheck` and `sectionPrepState`, NOT `doLuckCheck`: is it consistent that it stays unpersisted?), revisit semantics, and the luck modal's own buttons after a reload (the modal is not reopened — is the resolved outcome reachable through the story choices in every branch?).
- **B-05** the `Арбуз с бахчи` rename: saves that already carry the legacy string `Арбуз` as an item (pre-slug era) now resolve to the food `melon` — is that the right canon reading of sec.300 vs sec.389? Any `inventory_condition` on `watermelon`?
- **B-04 / B-06 / B-08** — documentation and locale correctness (NBSP codepoint, GAME_RULES sentences vs code).
- Spot-verify the twelve group_80 resolutions (they were verified last time; look only for regressions caused by batches 2–4).

**X. Interactions (priority 2).** New × old: `_bcDialogStack` z-index 100+depth vs `.end-overlay` z-index 200 vs `.item-notification` 150 vs `.event-log-panel` 95 (a modal opened while the panel is open?); CA-10 Escape closing the panel vs a modal that opens later; CA-03 focus fallback firing while a sheet is still open; CA-17 hotkey gating (`_bcTopDialog` when the map is the top dialog; combat modal open); CA-13 reverse restore with the actual `SHEET_SECTIONS`; BC_COMBAT_STATUS mirror × `_bcCombatStatusReset` × the sec.1175 luck prompt (which clears/rewrites the log?); reading flow × riddle widget × `riddle_attempts` × language switch (`repaintAfterLangSwitch` → `renderGame({repaint:true})` re-renders the riddle — attempts preserved?); B-01 × shops that sell weapons (none? confirm) × `bagSize` upgrade sec.132; B-07 × `pickup_batch` on the same paragraph; the F5 windows the cycle closed (sec.436 flag, shop index, dice records, luck record) — re-check each by save round-trip reasoning; mid-combat reload behaviour vs the documented B-08 rule.

**G2. Residual reverse search (priority 3).** As in `BRIEF.md` §6 — only orders provably unwired in `game_structure.js` and absent from the excerpt's §5–6.

**R. Regression.** Battery executed (mandatory). Census at the audited state (compare deltas with the changelog): paragraphs **1221** · navigation edges **2218** · `auto_items` **179** · combat pids **76** / enemy entries **120** / multi **24** · spell hooks **100** + **3** `spell_any` · `inventory_condition` **131** · `acquires` **15** · `gold_condition` **34** · `gold_cost` **59** · `purchase` **36** · `pickup_batch` **5** · riddles **7** · dice sections **6** · `round_deadline` **4** · `player_attack_mod` **10** · `combat_condition` **4** · `consume_on_use` **32** · items.json **105** (food 20, weapon 3, item 76, flag 6) · ui keys **334 ×4** (RU/EN/FR/UK parity mandatory) · 6d guards **48** · `_dist_ui_check` **50** · 2C-SHELL **215** · reachable **1205**. FR: NNBSP before `?!;`, NBSP before `:` (incl. the new keys), apostrophes `’`, guillemets with NBSP.

---

## 5. Track A scope (priority order)
**V-UI.** For each of `UA-01..UA-04` and `CA-01..CA-18` confirm that the code at the audited state matches its resolution in `REGISTRY_EXCERPT_v2.md` and that the original defect is gone; probe side effects. Specific probes: the dialog stack (`_bcDialogStack`) with three dialogs; `_bcDialogClosed` fallback when the top dialog is a sheet; the combat cards' `aria-pressed` / focus ring vs the box-shadow selection and vs `updateCombatEnemyDisplay` re-renders during the Weakness pick; `bcAnnounce` timing (cleared then set in `setTimeout 0`) when two announcements arrive in one tick (dice + item); the `#bc-notif-live` region while a `.modal-overlay` is open; the riddle widget inside `.reader` (heading «Ваш выбор», focus on the input, `#riddle-input` ring); the event-log panel as a dialog (`role`, focus in / out, Escape) while a HUD sheet is open on a phone; `focusInventoryRow` after the last item is removed; the vendored `sr-only` file input inside the label (click + keyboard); HUD chip `sr-only` labels vs `data-i18n` on both the sidebar and the chip (duplicate keys are fine — confirm the harness); the 960px bounds vs the `≤700px` HUD block for widths 701–960 in portrait (tablets); `#sb-map` now visible — sidebar height / scroll on 1366×768 desktops; `ev.code==='KeyM'` on layouts where the physical key differs (AZERTY: KeyM is `,`? — reason about it); OFL.txt notices; `font-weight:400` headings vs Cinzel Decorative titles.
**U1–U9.** The independent pass from `BRIEF.md` §5 on the current state (do not repeat the closed items; look beyond them).

---

## 6. Severity
P0 — a fix contradicts canon or its resolution, or breaks navigation / data / the dialog focus model; P1 — noticeable mechanic or UI defect, undocumented deviation, WCAG 2.2 AA failure on a primary flow; P2 — cosmetics, docs, tests, aria-name quality.

## 7. Do-not-re-flag
- The original findings behind every group_81 item (they are fixed at your state — verify, do not re-report); everything in `REGISTRY_EXCERPT_v2.md` §5–6 (graveyard incl. the rejected `UB-01..UB-03` and the memory-backlog reconciliation; `VERIFIED_RESOLVED` items).
- Deliberate design points: B-08 (no combat persistence, documented); combat / event logs are not live regions (the BC_COMBAT_STATUS mirror is the SR channel); lenient legacy-save migration; `≤700px` in both orientations uses the HUD layout; Escape never dismisses dialogs without an explicit close control; the sheet title snapshot; UI-12 deferred; art quality / Midjourney backlog out of scope; the 54 intentionally unreachable mechanic entries; FB2 typos sec.416 «1366» / sec.849 «1830»; the antagonist is «Барлад Дэрт».

## 8. Report format
One `REPORT_trackA.md` / `REPORT_trackB.md` (English prose, all game quotes in Russian, no web):
0. **PRE-FLIGHT** — everything §2 asks for, incl. the battery's final line.
1. **VERIFIED-OK** — per block with volumes (items checked / matched; scripts you ran, with their commands).
2. **FINDINGS** — table `id | block | severity | §§ / keys / selectors | evidence (exact code or Russian quote; when disagreeing with a resolution, quote it) | suggested minimal fix`; every row a hypothesis, labelled "verified by code reading" / "verified by execution" / "suspected". Use ids `CB-01…` (Track B) and `CU-01…` (Track A).
3. **COUNTS** — P0/P1/P2 and the single highest-confidence finding.
4. **NOT-CHECKED** — what you could not determine, and why.
Save the file in your sandbox and offer it for download; also print it in the chat. The maintainer archives it with its SHA-256 next to this brief and adjudicates every row.
