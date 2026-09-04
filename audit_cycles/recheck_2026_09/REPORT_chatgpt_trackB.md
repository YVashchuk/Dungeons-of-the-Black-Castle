# Track B independent re-audit — audited commit `69e6be2f2039e6794282692b61d0bdf7ecb5a763`

Scope: Track B only, per `audit_cycles/recheck_2026_09/BRIEF_chatgpt_third_auditor.md` §4. The supplied archive was extracted into a separate sandbox directory and the repository was not modified. No web access was used.

## 0. PRE-FLIGHT

- Archive root: `Dungeons-of-the-Black-Castle-69e6be2f2039e6794282692b61d0bdf7ecb5a763`
- Extracted regular files: **375** (`assets/illustrations/` was absent as stated)
- Node: **v24.19.0**
- Python: **Python 3.12.13**
- Last `version_history` key in `assets/text_corrections.json`: **`v2.160 -> v2.161`**
- `pending_corrections.group_81_2026_09_04_recheck.items`: **30**, with **30/30 `DONE`**
- `GD` top-level paragraph keys, parsed programmatically from `src/game_structure.js`: **1221**
- Paragraph 1 first sentence: **«Вы быстро идете вперед и вскоре оказываетесь в лесу.»**
- First registry `###` heading: **`### UA-01_dialog_stack_dom_order - P1 - DONE`**

Mandatory command, run from the repository root:

```text
$ node tests/run_all.js
PASS p2_2a_harness.js              2a HARNESS: 25 passed, 0 failed
PASS p2_2b_harness.js              2b HARNESS: 44 passed, 0 failed
PASS p2_2c_harness.js              2c HARNESS: 35 passed, 0 failed
PASS p2_shell_i18n_harness.js      2C-SHELL HARNESS: 215 passed, 0 failed
PASS p1_6a_harness.js              6a HARNESS: 10 passed, 0 failed
PASS p1_6b_harness.js              6b HARNESS: 16 passed, 0 failed
PASS p1_6c1_harness.js             6c-1 HARNESS: 8 passed, 0 failed
PASS p1_6c2_harness.js             6c-2 HARNESS: 5 passed, 0 failed
PASS p1_6d_harness.js              6d HARNESS: 48 passed, 0 failed
PASS p1_6e1_harness.js             6e-1 HARNESS: 10 passed, 0 failed
PASS p1_6e2_harness.js             6e-2 HARNESS: 10 passed, 0 failed
PASS harness_groupB.js             HARNESS: 21 passed, 0 failed
PASS p1_items_5f_harness.js        5f HARNESS: 29 passed, 0 failed
PASS _signet_harness.js            SIGNET HARNESS: 12 passed, 0 failed
PASS _hygiene_harness.js           HYGIENE HARNESS: 13 passed, 0 failed
PASS _riddle_i18n_harness.js       RIDDLE-I18N HARNESS: 15 passed, 0 failed
PASS _dist_ui_check.js             DIST REFACTOR CHECK: 50 passed, 0 failed
PASS _dist_meta_check.js           DIST META CHECK: 7 passed, 0 failed
PASS _dist_art_check.js            DIST ART CHECK: 11 passed, 0 failed
PASS _dist_signet_check.js         DIST CHECK: 9 passed, 0 failed
PASS _dist_fr_check.js             DIST FR CHECK: 9 passed, 0 failed
PASS _dist_uk_check.js             DIST UK CHECK: 7 passed, 0 failed
PASS verify_reach3.py              Matches handoff claim of 1205 reachable: True
BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)
```

Exit status: **0**. The required proof lines are therefore **6d 48/0**, **DIST REFACTOR 50/0**, **2C-SHELL 215/0**, and the exact final line **`BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)`**.

## 1. VERIFIED-OK

### V — group_81 engine resolutions

An independent harness was written outside the repository, in the style of `tests/p1_6d_harness.js`, and run with:

```text
$ node /workspace/scratch/71c731d9f8a0/audit_work/trackB_probe.js /workspace/scratch/71c731d9f8a0/audit-trackB-D13f9A/Dungeons-of-the-Black-Castle-69e6be2f2039e6794282692b61d0bdf7ecb5a763
TRACK-B PROBE: 62 passed, 0 failed
```

The 62 assertions execute extracted production functions with DOM/state stubs and also perform structural/data checks. Results by resolution:

| Resolution | Volume and result |
|---|---|
| B-01 | **9/9 probes matched.** `getItemSize` returned 0 for both swords and the shield; a mixed bag summed correctly; a full seven-slot bag still accepted a zero-slot sword through the offer modal, §35 `applyChoiceAcquires`, a synthetic purchase, and `pickup_batch`; §932 `dice_loot` saw three free slots when the bag also held all three armaments. No current purchase choice sells a registered weapon; §132 still upgrades to nine slots. |
| B-02 | **3/3 order/state probes matched.** Take→Eat produced one carried, uneaten serving with no stamina gain; Eat→Take gave +4 once and deposited nothing; an already-carried food disabled both offer actions and direct `eatFoundItem` refused it. |
| B-03 | The soft-lock repair itself matched on **round, Copy, larva, ally, and Death-of-Orcs-relevant paths**: §131's eagle wakes after every mechanism that can actually kill its Goblin (Death of Orcs correctly does not affect a Goblin); §1175 reinforcements wake after larva and Death of Orcs. All four deadline fights (§§43/261/737/1099) have neither `combat_script` nor `joins`. The remaining §1175 timing defect is CB-01. |
| B-04 | **1/1 codepoint probe matched:** French `ui_autosave_note` has U+00A0 immediately before `:`. |
| B-05 | The current registry/map repair matched: **105 unique `legacyRu` values**, `melon` displays «Арбуз», and `watermelon` displays «Арбуз с бахчи». The legacy-save semantic hole is CB-05. |
| B-06 | **2/2 documentation checks matched:** weightless armament, non-round script joins, `weakPickIdx`, persisted generic luck, and the B-08 persistence rule agree with current code. |
| B-07 | The generic `has_luck` path matched all four promised pieces: `normalizeSave` backfill, save-at-roll, `renderChoices` restore (including fatal-unlucky death), and `goTo` clearing. Scripted luck and hash override are separate paths; see CB-02 and CB-04. |
| B-08 | The documented no-combat-snapshot rule matches code and `MANUAL_SMOKE_CHECKS.md` C19. The report does not re-flag loss of `combatState`; CB-03 concerns a journey-level field that is intended to persist. |

### V — group_80 regression spot-check

**12/12 resolutions matched**: V-01, R-02, V-02, G2-01, V-03, V-04, X-01, X-02, X-03, X-04, R-01, and R-03. The probe rechecked food normalization/eat-now; both mandatory equip shapes and the three `slotCost:0` registry entries; staged `weakPickIdx`; dice records/refusal commit; `combatResolved` coverage; condition-button cleanup and full-win Met persistence; atomic §436 Force consumption; invalid legacy one-shot-index pruning; all 105 forward/reverse item-map pairs; and the **v2.161** rules label.

### X — new × old interactions

**23 named interactions were traced; 20 were clean and three lead to CB-02/CB-03/CB-04.** Clean results:

- Dialog layering is internally ordered: event panel 95, modal base 100 with stack-assigned 101+, non-interactive notification 150, and end overlay 200. Escape consults the top dialog before the event panel; CA-03's fallback refuses to focus the story while any sheet/dialog remains open.
- CA-17's M handler blocks map opening under another top dialog and permits toggling the map when it is itself open. `returnSheetSection` restores recorded nodes in reverse order over the actual `SHEET_SECTIONS` sets.
- `startCombat` clears the log and calls `_bcCombatStatusReset`; the §1175 luck prompt appends without clearing it, so the SR mirror retains the new delta rather than replaying prior lines.
- Riddle attempts are stored in `S.riddle_attempts`; `repaintAfterLangSwitch` rerenders the current riddle without resetting that value. Normal riddle success, failure exhaustion, and the explicit exit reset it before navigation.
- No purchase sells a weapon; synthetic purchase math and §132's nine-slot upgrade coexist with B-01. No paragraph combines generic `has_luck` and `pickup_batch`.
- Save-round-trip review was clean for the §436 Force flag (saved on cast, cleared at Fight click), real shop/batch indices, §781 dice record, §932 roll/refusal record, and generic luck record. Scripted luck is CB-02.
- No engine mechanic depends on `animationend`; reduced-motion's near-zero duration therefore cannot skip mechanic completion.
- Item-offer-over-sheet is not reachable through normal controls because the sheet owns focus/input; if opened programmatically, both are modal-stack members and the later modal is topmost. Page-load hash entry begins with no open sheet and `renderGame` refreshes HUD state.
- `pickup_batch` retains original indices in all post-luck render branches. The four deadline fights have no script/waiter intersection. Script-managed §§131/1175 have no `combat_condition` choices.
- B-08's lack of a combat snapshot remains exactly the documented design. Journey-level summon persistence is not part of that accepted loss; see CB-03.

### G2 — residual reverse search

Fresh command:

```text
$ node /workspace/scratch/71c731d9f8a0/audit_work/trackB_census.js /workspace/scratch/71c731d9f8a0/audit-trackB-D13f9A/Dungeons-of-the-Black-Castle-69e6be2f2039e6794282692b61d0bdf7ecb5a763
```

The scan parsed **1221** prose sections, removed generated Battle/Choices lists, and searched the brief's arithmetic/condition/deadline/action stems together with stat/gold/round vocabulary. It produced **202 candidates**: **188** had a mechanic at the same GD section and **14** residuals were manually inspected: §§45, 59, 284, 305, 324, 330, 511, 524, 542, 714, 767, 831, 996, 1023.

- §§45/59/284/305/324/330/524/831/996/1023 are lexical/narrative hits such as «лишь», «действительно», «не слишком удачен», «потерпел», or non-transactional gold prose.
- §542's actual order, **«Когда будете драться мечом Зеленого рыцаря, то прибавляйте себе каждый раз 1 МАСТЕРСТВО»**, is wired by the upstream `whole_sword` grant and `playerEquipMod`.
- §511's once-per-journey summon rule is implemented by `summonsUsed` (its save timing is separately CB-03); §714 is reached through §699's `fish_help` gate; §767 is reached through §873's `gold_condition:2` + `gold_cost:2` choice.

Result: **0 new provably unwired canon orders outside the excerpt's §5–6 exclusions.**

### R — regression census

The same script independently recomputed the requested census. Every value matched the third-auditor brief:

| Metric | Actual |
|---|---:|
| Paragraphs / navigation edges | 1221 / 2218 |
| `auto_items` sections | 179 |
| Combat paragraphs / enemy entries / multi-enemy | 76 / 120 / 24 |
| `spell` hooks / `spell_any` | 100 / 3 |
| `inventory_condition` / `acquires` | 131 / 15 |
| `gold_condition` / `gold_cost` / `purchase` | 34 / 59 / 36 |
| `pickup_batch` / riddles / dice sections | 5 / 7 / 6 |
| `round_deadline` / `player_attack_mod` / `combat_condition` | 4 / 10 / 4 |
| `consume_on_use` | 32 |
| Items total (`food` / `weapon` / `item` / `flag`) | 105 (20 / 3 / 76 / 6) |
| UI keys RU / EN / FR / UK | 334 / 334 / 334 / 334; exact key parity |
| Locale dimensions, each language | enemies 66, spells 8, allies 2, map 43, paragraphs 1221 |
| 6d / `_dist_ui_check` / 2C-SHELL / reachable | 48 / 50 / 215 / 1205 |

The fresh visible-string scan found **0** French UI violations for U+202F before `?!;`, U+00A0 before `:`, typographic apostrophe `’`, or NBSP inside guillemets. The mandatory battery independently confirmed the built FR/UK artifacts and all reachability baselines.

## 2. FINDINGS

Every row below is a hypothesis for maintainer adjudication.

| id | block | severity | §§ / keys / selectors | evidence | suggested minimal fix |
|---|---|---|---|---|---|
| CB-01 | V / B-03 | **P0** | §1175; `activateStagedJoins`; `combatRound`; `useLarvaInCombat`; Death of Orcs | **Verified by execution and code reading.** The production-function probe killed the First Orc with a larva: Orcs 2–3 activated immediately, but `promptCanon1175Luck` remained at 0 and `firstDeathHandled` remained false. Calling `combatRound` then executed a complete extra attack exchange and only afterward raised the prompt; a second round did not duplicate it. The Death-of-Orcs opening path leaves the same pending state. Code confirms `activateStagedJoins` deliberately leaves `firstDeathHandled` untouched (lines 2776–2791) and the prompt exists only after the strike loop (2691–2705). Canon says: **«После того, как первый Орк все же будет повержен, если хотите, ПРОВЕРЬТЕ СВОЮ УДАЧУ.»** The registered resolution explicitly says: **“firstDeathHandled is left untouched so the sec.1175 luck prompt still fires from the after-strike block one round later.”** That extra round lets the Third Orc attack before the canonically immediate option can make it flee, so the resolution contradicts canon. | Route all first-enemy deaths through one idempotent §1175 milestone helper. After waking Orcs 2–3, set `firstDeathHandled` and offer/skip luck immediately, before another `combatRound`; have round, Copy, ally, larva, and Death of Orcs call the same helper. |
| CB-02 | V / B-07; X | **P1** | §§21, 368, 436; `doScriptedLuckCheck`; `sectionPrepState`; `S.luckChecks` | **Verified by execution.** An unlucky production `doScriptedLuckCheck` at §436 saved the decremented Luck but its save snapshot contained neither a `luckChecks["436"]` record nor `sectionPrepState`; resetting runtime state reproduced a fresh-roll screen. Code stores the outcomes for §§21/368/436 only in runtime `sectionPrepState` (lines 1862–1953), while `doScriptedLuckCheck` saves only `S` after invoking those callbacks (1827–1845). The B-07 resolution promises that an F5 between roll and choice cannot reroll, but its implementation covers only generic `doLuckCheck`/`renderChoices`. All three pre-combat scripted checks can therefore be rerolled after F5 at the cost of another Luck point; §436 is the scripted member of the fatal seven explicitly named by the brief. | Persist the scripted result at roll time (either a typed record beside `S.luckChecks` or the minimal derived prep fields), restore it before `renderCanonCombatChoices`, and clear it on normal `goTo`. Keep §1175 mid-combat behavior under the separately accepted B-08 rule. |
| CB-03 | X / persistence | **P1** | `S.summonsUsed`; `useAllyInCombat`; GAME_RULES §5 | **Verified by execution and code reading.** `useAllyInCombat` pushes the ally key into `S.summonsUsed` at lines 2957–2960, but has no `saveGame()` anywhere before any return or at its tail (2950–3018). The probe observed live `summonsUsed:["magic_bell"]` and **0 save calls**; simulated F5 restored the pre-summon `[]`, allowing reuse despite canon/rules saying **«один раз за путешествие»**. This disagrees with the June adjudication: **“Refuted: ChatGPT P1 (save/reload summon reuse) — … `summonsUsed` is written before any early-return and `exportSave()` saves first.”** That reasoning proves export/import, not F5: writing only to RAM before a return does not update localStorage. | Call `saveGame()` immediately after committing `allyUsedThisFight`/`summonsUsed`, before the side-fight dice loop and §1175 early return. This is a narrow, intended mid-combat side effect under B-08, not combat-state snapshotting. |
| CB-04 | V / B-07; X | **P1** | `window.onload`; `#N`; `S.luckChecks` | **Verified by code reading plus state simulation.** `goTo` clears `S.luckChecks` (2355–2359), but hash load restores the save and then directly overwrites `S.section` (3188–3196) without the equivalent clear. A saved unlucky §203 record survives `#203 -> #1 -> #203`: each hash render autosaves the new section while retaining `luckChecks["203"]`, so the final entry restores the stale outcome instead of revisit semantics (“a revisit rolls again”). Same-section F5 must retain the record; only a hash target different from the saved `sv.section` should clear it. | In `window.onload`, parse `target` once; when a loaded save has `sv.section !== target`, clear paragraph-scoped `sv.luckChecks` before assigning `sv.section=target`. Preserve it for same-section F5. Add a two-hop hash regression test. |
| CB-05 | V / B-05 | **P2** | §§300, 389; legacy inventory string `Арбуз`; `normalizeSave`; `canonItem` | **Verified by execution and canon/code reading.** `normalizeSave({inventory:["Арбуз"]})` retains the raw string, and current `RU_TO_SLUG` maps it to food `melon`; there is no `inventory_condition` on `watermelon`. But the project's pre-slug specification states **“`watermelon` «Арбуз» = ITEM, not food. §300 the peasant gives it («забирай его себе»)”**. Canon distinguishes §300 **«Мне арбуза то не жалко, забирай его себе»** from §389 **«Если хотите, можете съесть сразу. Он добавит 4 ВЫНОСЛИВОСТИ.»** The §389 structured food was introduced later, so a pre-slug raw inventory string denotes the §300 item. Current behavior misidentifies it, suppresses the §389 food offer by dedupe, and fails to dedupe a later §300 `watermelon`. The B-05 rename fixed current keys but not old saves. | During legacy normalization, convert a raw inventory string exactly equal to `Арбуз` to slug `watermelon`; do not alter structured `{kind:"food",id:"melon"}` entries. Apply the same targeted rule to any legacy item-valued wager field if supported. Add a migration assertion. |

## 3. COUNTS

- **P0: 1**
- **P1: 3**
- **P2: 1**
- **Total hypotheses: 5**
- **Single highest-confidence finding: CB-02.** It is reproduced directly with the production luck function and a captured save snapshot: the Luck decrement persists while the outcome needed to resume §§21/368/436 does not.

## 4. NOT-CHECKED

- Track A was not performed, per instruction. UI details were considered only where Track B §4 explicitly required an interaction trace.
- No live browser or JSDOM render was run. `jsdom` is not installed in the archive/runtime, and the task prohibited browsing; focus, paint, and real-layout observations are therefore source/harness conclusions rather than visual acceptance. The repository's own DOM/dist harnesses did run and were green.
- `assets/illustrations/` was intentionally absent, so illustration originals were not checked; Track B does not require them.
- The probe reproduces CB-01 through supported state setup (import/hash/add-item style state), but did not establish a normal choice-graph route that carries the larva or Death of Orcs to §1175. A simple navigation BFS found no path from §§71/932/1123 to §1175; this limits natural-play exposure, not the canon contradiction or the executable state bug.
- No external canon or web material was consulted.
