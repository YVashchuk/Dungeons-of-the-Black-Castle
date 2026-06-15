# Claude brief — per-claim canon verification & engine correctness (June 2026 external review)
**Read `00_BRIEF.md` first.** Use NORMAL mode (not Deep Research). HEAD 4f59e49 · registry v2.89.

## Access
Attach the repo or the source files: `assets/fb2_remake.fb2`, `src/remake_data.js`, `src/game_logic.js`, `src/game_shell_top.html`, `assets/text_corrections.json`, `assets/book_1991_extracted.txt`. No image files needed.

## Your focus: rigorous per-claim verification + engine-edge correctness (your strength in past cycles)
You are the verification backstop. Where ChatGPT (balance) and Gemini (graph/art) generate findings, your job is to **independently confirm or refute against canon**, and to stress the engine for correctness bugs the others might miss. Apply the copyright/quoting discipline: short canon quotes only, paraphrase otherwise.

### Task 1 — Re-derive the combat-summon engine correctness (group_61)
Read `useAllyInCombat()`, `summonAllyAvailable()`, `startCombat()` (the `#btn-summon-ally` block), `endCombat()`, and `normalizeSave()` in `game_logic.js`. Verify:
- **Guard completeness:** can the ally be summoned twice in one fight, or after `S.summonsUsed` already lists it, via ANY path (including the §1175 early-return, or a save exported mid-combat then re-imported)? Trace the state.
- **`combatState.ally` lifecycle:** it is set but the UI is log-only — confirm nothing reads `ally` expecting a persistent HP card that doesn't exist (no undefined-field crash).
- **Scope check:** `isInsideCastle(S.section)` is read at summon time — confirm `S.section` is the *current* combat paragraph at that moment (not stale).
- **`normalizeSave` backfill:** old saves without `summonsUsed` get `[]` — confirm, and confirm `initState` seeds it.
- **§612 grant + §84 rename:** confirm §612 `auto_items.items` now contains 'Волшебный колокольчик', and that renaming §84's amulet to 'Медвежий амулет' did NOT orphan any inventory_condition elsewhere (every other amulet reference should be 'Золотой амулет'). Quote the GD entries.

### Task 2 — Adjudicate group_60 independently (you are the tie-breaker)
- §562: we changed the pay-choice **label** from "(562)" to "(315)" while keeping `target:315`. Confirm §315 is the canon pay-outcome (quote FB2 §562 and §315; cross-check 1991 §186/§456 in `book_1991_extracted.txt`).
- §339↔425 "loop": we refuted it (425→184/360, forward). Confirm from `GD` that no loop §425→§339 exists, and that 1991's twin (§462) likewise goes forward. Agree/disagree.

### Task 3 — Verify the vestigial-islands reasoning (group_57 context)
- Read `reachability_audit_june_2026/TIER_BC_VESTIGIAL_FINDING.md`. For a sample of the 16 "vestigial" islands, independently confirm their successors are reachable WITHOUT the island (so wiring a parent would be redundant), OR find one that genuinely gates unique content. This guards against us having dismissed a real bug.
- Confirm the 3 we DID wire (§945→954, §854→938, §260→600) each restore something real: a unique successor, a hard-dead-end fix, or unique loot. Quote FB2.

## Output format
For each task, a numbered list. Each finding: **claim → short FB2 quote (paragraph N, <15 words) or 1991 quote → GD field / engine function → CONFIRM / REFUTE / NEEDS-FIX**. Be explicit when you AGREE with our existing conclusion (that is a useful signal too). Flag anything you could not verify from the provided files rather than guessing.
