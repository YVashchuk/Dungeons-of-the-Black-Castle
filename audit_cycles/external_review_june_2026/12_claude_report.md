# Claude — session report (June 2026 external review, normal mode)
Raw reply archived for the record. Claude parsed GD via json.load, quoted FB2 + the 1991 original by paragraph, and built an independent reachability graph. It served as the verification backstop and (correctly) refuted ChatGPT's P1. Every item below CONFIRMED by our own re-check.

---

## Task 1 — summon engine correctness
1. §612 grants bell; 11/9 anywhere — CONFIRM (item key == COMBAT_ALLIES key).
2. §84 grants «Медвежий амулет» via `acquires` — CONFIRM, with the important note that **`acquires` is a SIXTH grant mechanism** not in 00_BRIEF's "five". (Our group_59 list said five: auto_items.items, auto_items.food, grants_items, grants_food, bet_payout.items. `acquires` is the sixth and was used throughout. No bug — but future obtainability scans must include `acquires`. We already used it in group_59's harness, so no item was mis-flagged; the BRIEF wording was incomplete, not the code.)
3. Amulet rename orphaned nothing — CONFIRM (all other amulet refs are «Золотой амулет» §390/§500/§625/§1164).
4. Re-summon guards complete on ALL paths incl. §1175 early-return and export-mid-combat — CONFIRM (this REFUTES ChatGPT P1: `summonsUsed` is written before any return, and `exportSave()` calls `saveGame()` first).
5. `combatState.ally` is log-only, never read elsewhere — CONFIRM (no crash).
6. `isInsideCastle(S.section)` reads the current combat paragraph — CONFIRM.
7. initState seeds + normalizeSave backfills `summonsUsed` — CONFIRM.
8. §1175 correctly NOT in CASTLE_SECTIONS (it's the gate fight, OUTSIDE; victory → §933 "stража пропускает") — CONFIRM (amulet rightly allowed there).

## Task 2 — group_60
1. §562 label «(562)»→«(315)» correct; 1991 §186→§456 proves §315 is the pay-outcome — CONFIRM.
2. §339↔425 no loop (425→184/360 forward; 1991 twin §462 forward) — CONFIRM.

## Task 3 — vestigial islands
1. Reachability 1205/1221 independently reproduced; 16 unreachable match — CONFIRM.
2. All 15 "leave as-is" islands vestigial (parentless, successors reachable elsewhere) — CONFIRM.
3. §954 uniquely opens §971 — CONFIRM. §661/§1133 inert loop — CONFIRM.
4. The 3 wired edges (§945→954, §854→938, §260→600) present and restore real content — CONFIRM.

## Side-note Claude raised
On §854: canon says "if you have the skull → §938, otherwise you die", but our §854→938 choice has no `inventory_condition`. ADJUDICATION: intentional — group_57 deliberately mirrored the sibling gas-puzzles §842/§859/§913, which ALSO present the skull branch unconditionally (engine convention for that family; the player self-selects honestly, same bluff-tolerance as group_56). Not a bug; documented in group_57.
