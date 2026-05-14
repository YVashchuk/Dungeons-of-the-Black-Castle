# Audit task for Gemini 3.1 Pro Deep Research — graph integrity post group_6

**Status:** post-implementation audit. Run AFTER the Group 6 Claude session has completed all 13 item implementations (or at least the first 4-5 items if they're closed in waves). Do not run before — there's nothing to audit yet.

**Source files (read these from the GitHub repo or local clone):**
- `src/remake_data.js` (the 1221-paragraph GD object)
- `src/game_logic.js` (engine, especially helpers `passesInventoryCheck`, `applyChoiceAcquires`, `applyChoiceGoldCost`, `makePurchaseBtn`)
- `assets/text_corrections.json` (registry, especially `group_6_dynamic_target_engine` items and their `status_done` annotations)
- `SMOKE_TEST_PATHS.md` (current 42-scenario smoke-test report)

**Your goal:** find graph regressions or unreachable paragraphs introduced by the group_6 implementations.

---

## Background

The Group 6 implementation closes 13 paragraph-arithmetic mechanics from the canonical FB2 text. Each mechanic was originally a "add N to current paragraph number" instruction. The implementation strategy chosen (per the warning in registry's group_6.warning_for_implementer) is per-item static gating — NOT a universal +N engine hook — because the 1221-paragraph renumbering breaks many offsets.

This means each of the 13 items now has:
1. An acquisition paragraph adding the item to `auto_items.items[]`
2. One or more consumer paragraphs with a NEW choice carrying `inventory_condition='<item name>'` and a static `target` (= consumer + modifier in the canon)
3. Possibly a `consume_on_use:true` field on the choice (if implemented)

This adds ~20-40 new conditional choices to the data. Each new choice is a potential graph regression.

---

## What to audit

### 1. Reachability of new consumer choices

For each of the 13 items, verify in the data:
- The acquisition paragraph EXISTS in GD
- The acquisition paragraph genuinely deposits the item via auto_items (no typos)
- Every consumer paragraph EXISTS in GD
- Every consumer choice has matching inventory_condition string to the auto_items.items[] string (exact match — Cyrillic / spacing / punctuation)
- The static target of each consumer choice EXISTS in GD

Output: per-item Y/N for each criterion + list any mismatches.

### 2. Victory path preservation

The canonical victory route in the remake is from §1 to §1220. Verify by BFS through the basic graph (skipping luck-only, combat-only, inventory_condition-only, and post_combat choices) that §1220 is STILL reachable.

If §1220 unreachable, find which intermediate paragraph became orphaned. Group 6 should not introduce unreachable consumer paragraphs (consumers are reached via item-gating, but the prerequisite paragraphs to BUY the item should still be reachable via basic choices).

### 3. Items spending vs replenishment balance

For each of the 13 items, count:
- Number of acquisition opportunities (paragraphs where auto_items grants the item)
- Number of consumer opportunities (paragraphs where inventory_condition asks for the item)
- Whether `consume_on_use:true` is set on consumers — if yes, the player can use the item ONCE before it disappears; if no, it persists

For each item where consume_on_use is missing AND the canon intent is one-shot (fish_help — "позвать рыбку"; golden_orange — single use; spell_book — multi-use per FB2 wording), flag as a potential bug.

### 4. Choice composition with other gates

For each new choice in §3, check:
- inventory_condition doesn't conflict with combat_condition, luck_type, post_combat, or gold_condition on the same choice
- If any consumer paragraph has BOTH a new group_6 choice AND a pre-existing choice with a different gate, the choice rendering should be correct in all 4 corner cases (player has item only / has item + lucky / has item + post-combat / has neither)

### 5. Dead-end detection

Run a reverse graph traversal from §1220 to identify any paragraph that:
- Is reachable from §1 via basic graph
- But has NO outgoing edges that lead back toward §1220

These are dead-ends. The fatal-unlucky route (commit 7a294e5) already handles §203, §289, §377 — these are EXPECTED dead-ends with death-overlay routing. Find any NEW dead-ends introduced by group_6.

### 6. Item-string discipline regression check

The audit-series convention: `inventory_condition` strings must match `auto_items.items[]` strings character-for-character. Check that group_6 implementations preserve this. Any drift between gate string and grant string silently breaks the gate.

---

## Deliverable format

Single markdown file, sections matching the 6 audit criteria above. For each finding, include:
- The specific paragraph(s) affected
- The specific commit hash (from git log) that introduced the issue
- Severity: P0 (game-breaking) / P1 (canonical-FB2-violation) / P2 (UX) / P3 (design quibble)
- Recommended fix (1-3 sentences)

---

## After delivery

Paste the markdown into a new chat with Claude. The Claude session that closed group_6 will read your audit findings and address each one in follow-up commits if needed.

If the audit finds zero issues, output a single-line "No issues found, group_6 fully closed" — that's also a valid result.
