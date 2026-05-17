# Audit task for Gemini 3 Thinking + Deep Research mode — Spell Hook Coverage Audit

**Status:** Pre-implementation audit. Conducted AFTER the spell economy review (May 2026) revealed only 30% data-hook coverage of canonical FB2 spell mentions. Goal: categorize the 132 candidate paragraphs so Claude can implement targeted fixes in a future cycle.

**Source files (all attached to this request — Gemini does NOT need GitHub access):**

1. `SPELL_ECONOMY_REVIEW.md` — context: what the issue is, why it matters
2. `SPELL_CANDIDATE_PARAGRAPHS.md` — **PRIMARY DATA**: pre-extracted FB2 text + current remake_data.js JSON for all 132 paragraphs across 8 spells
3. `GROUP6_ENGINE_EXTRACT.md` — engine context: how `applyChoiceConsume`, `useSpell`, and the spell-hook engine work
4. This task spec

**Your goal:** classify each of the 132 paragraphs into one of 5 categories (A/B/C/D/E) or confirm OK status. Output a structured deliverable Claude can use directly.

---

## Background

The game has 8 spells: FIRE, FORCE, LEVITATION, ILLUSION, WEAKNESS, COPY, HEALING, SWIMMING.

The engine consumes a spell charge ONLY when a choice has the `spell:"<SPELL_ID>"` field set. Click on a choice without this field navigates normally without decrementing the spell budget — meaning the player can spam-use the spell for free.

Audit found:
- 132 canonical FB2 paragraphs mention spells
- 40 have proper `spell:"X"` field wired in remake_data.js
- **92 are missing the field**

But not all 92 are bugs! Many are narrative descriptions (post-action, enemy casts, hedge phrases) that don't represent player-cast choices. Your job: tell Claude which are real bugs (Category A) vs noise (B/C/D/E).

**HEALING is special**: it's engine-driven via a global HUD button (`#btn-heal`), not data hooks. The 2 HEALING paragraphs (§415, §1093) may still need either data-hook wiring OR a note that engine button handles them.

---

## What to audit — 6 criteria per paragraph

For each of the 132 paragraphs in `SPELL_CANDIDATE_PARAGRAPHS.md`:

### Criterion 1: Category classification

Pick exactly one:

- **A — Player-cast spell choice, missing `spell:"X"` field**: This is a REAL P0/P1 BUG. The current remake_data.js paragraph has a choice with label like «Использовать заклятие X (target)» but no `spell:"X"` field on that choice. Player can click without spell decrement.
  - **Recommendation needed**: which existing choice (by target ID) should get the `spell:"<ID>"` field added? Include the spell ID.

- **B — Post-action narrative**: The FB2 text describes the player ALREADY having cast the spell on a prior screen ("Вы накладываете заклятие Огня…", "Вы произнесли…"). This is a NARRATIVE consequence paragraph, not a player choice. The actual cast happened earlier (likely already wired). No fix needed here.

- **C — Enemy/character casts on player**: The FB2 text describes someone OTHER than the player casting ("он накладывает на вас заклятие Слабости…"). Not a player choice. No fix needed.

- **D — Item/character description**: Spell mentioned generically in NPC description, lore, or item description ("Зеленые рыцари развеивают многие заклятия"). Not a choice point. No fix needed.

- **E — Conditional/hedge narrative**: FB2 explicitly says NOT to use the spell ("не тратить же заклятие…даже если оно у вас есть"). Not a real offer. No fix needed.

- **OK** — already wired correctly (auto-marked in the extract; verify and confirm).

### Criterion 2: Confidence

Mark each classification as:
- **High** — narrative pattern is unambiguous
- **Medium** — narrative is suggestive but could go either way
- **Low** — needs human re-review

### Criterion 3: For Category A only — implementation hint

When you classify as A, specify:
- The `target` ID of the choice that needs the `spell:"<ID>"` field added
- Whether spell-cast is conditional on stat threshold, combat state, or item ownership (rare but happens)
- Whether multiple spells are offered at this paragraph (e.g., §7 lake crossing offers SWIMMING OR LEVITATION — both need wiring)

### Criterion 4: HEALING special handling

For §415 (bear cub) and §1093: decide whether
- (a) Engine HUD button is sufficient (player can click "Исцеление" anytime outside combat), OR
- (b) The paragraph specifically needs a choice with `spell:"HEALING"` because the canonical interaction is tied to a specific narrative moment (e.g., the bear cub healing should consume the spell at that specific click).

### Criterion 5: Identify any patterns

If you notice clusters (e.g., all combat-trigger COPY paragraphs follow same pattern «Если хотите, воспользуйтесь заклятием Копии»), call them out so Claude can implement bulk fixes.

### Criterion 6: Identify any orphan paragraphs

If you see a paragraph that appears unreachable from current remake state (e.g., its target ID is never linked from any choice), flag it. This may indicate the paragraph itself needs to be wired as a target before any spell choice points to it.

---

## Deliverable format

Single markdown file. Structure:

```
# Spell Hook Audit Findings — Gemini 3 Thinking Deep Research

## Summary
- Category A (real bugs): N paragraphs
- Category B: N paragraphs  
- Category C: N paragraphs
- Category D: N paragraphs
- Category E: N paragraphs
- OK (already wired): N paragraphs

## Pattern observations
[Bullet list of any patterns you noticed]

## Category A — Implementation backlog

### LEVITATION (X paragraphs need wiring)
- §93: add `spell:"LEVITATION"` to choice target=130 (marsh rescue). Confidence: High.
- §7: add `spell:"LEVITATION"` to choice target=259 AND `spell:"SWIMMING"` to choice target=72 (lake crossing). Confidence: High.
- §[NNN]: ... 

### FIRE (X paragraphs need wiring)
- §[NNN]: ...

[etc for each spell]

## HEALING special handling
- §415: [your verdict — engine button sufficient OR needs data-hook wiring with reasoning]
- §1093: [same]

## Category B (post-action narrative — NO fix)
§134, §388, §1188, ... [paragraph IDs only, brief justification at start]

## Category C (enemy/character cast — NO fix)
§3, §48, ... [paragraph IDs only]

## Category D (descriptions — NO fix)
[paragraph IDs only]

## Category E (conditional/hedge — NO fix)
§23, ... [paragraph IDs only]

## Orphan flags
[any paragraphs that may need orphan-target restoration before spell wiring matters]

## Notes
[any other observations, edge cases, ambiguities]
```

---

## Why Gemini 3 Thinking Deep Research mode

The audit is methodical paragraph-by-paragraph reading. Deep Research mode is exactly suited for this — systematic verification against canonical text, pattern recognition across similar narrative structures, no creative work needed. The same approach succeeded for the group_6 audit cycle (commit `5c61c6b`).

Standard Gemini 3.1 Pro could also do this but the 132-paragraph batch is at the edge of comfortable single-context audit volume. Deep Research mode will systematically traverse the bundle rather than risk missing entries.

ChatGPT Deep Research could be a second-opinion run if you want triangulation — same methodology, possibly different false-positive rate.

---

## After delivery

Paste the markdown into a new Claude chat. Claude will:
1. Verify each Category A claim against the FB2 file directly
2. Implement bulk per-spell commits (similar to group_6 per-item pattern)
3. Archive Gemini's findings as `audit_cycles/spell_hooks_<date>/` alongside the implementation report

If the audit finds ZERO Category A entries, output a single-line "All 92 missing-hook entries are non-bug categories" — that's a valid result (means the spell economy is actually fine and only the documentation was misleading).
