# Audit Cycles

This directory archives external audit artifacts from major implementation
series. Each subdirectory is one full audit cycle: the task spec given to
the external auditor, the implementation report sent as context, source
extracts to spare the auditor large binary files, and the auditor's
findings report.

These artifacts are kept for historical reference. Future audit cycles or
follow-up implementation work can read them to understand prior decisions
and verified state.

## Cycles

### `group_6_may_2026/` — Paragraph-arithmetic mechanics

Closure of 13 paragraph-arithmetic items from the canonical FB2. Audit
performed by Gemini 3.1 Pro in May 2026.

**Implementation span:** commits `9c037b3` → `fe72347` (13 commits).

**Files:**
- `GROUP6_GEMINI_AUDIT_TASK.md` — the 6-criteria audit spec
- `GROUP6_IMPLEMENTATION_REPORT.md` — what was done across the 13 commits
- `GROUP6_TOUCHED_PARAGRAPHS.md` — pretty-printed JSON for all 88 touched paragraphs (extracted from single-line `src/remake_data.js`)
- `GROUP6_ENGINE_EXTRACT.md` — focused extract of group_6-relevant engine helpers from `src/game_logic.js`
- `GRAPH_AUDIT_REPORT_POST_GROUP6.md` — Gemini's findings (5 of 6 criteria pass clean, 2 P3 narrative dissonance findings at §891 and §976)

**Outcome:** 11 status_done, 1 verification-only (gold_key), 1 status_deprecated (candle_set). Two P3 follow-up findings for consume_on_use enhancement.

**Post-audit follow-up commits** (extending the group_6 cluster):
- `aeebe69` — consume_on_use engine + fixes for sec.891 (bear_key) and sec.976 (golden_orange)
- `f19d59d` — emerald_ring (-140 fail-feedback) — item 14
- `a91d540` — bandit_tip (+910 treasure-dig) — item 15; restored sec.929 orphan
- `a71e617` — registry cleanup: canonical modifier values for 6 items
- `4e02144` — sec.929 content-fidelity: Серебряное кольцо + 1 LUCK
- `1ed6d31` — gold_ring (-52 Barlad insta-kill) — item 16; §462 content-fidelity

Final group_6 cluster: 16 items addressed (14 status_done, 1 verification-only, 1 status_deprecated).

### `spell_economy_may_2026/` — Spell economy review + spell hook audit

Comprehensive audit of all 8 canonical spells against current data hooks. Initial review by Claude (May 2026) revealed 30% data-hook coverage of canonical FB2 spell mentions. Follow-up Gemini Deep Research audit pending.

**Files:**
- `SPELL_ECONOMY_REVIEW.md` — Claude's initial review (May 2026): per-spell coverage table, HEALING engine-driven note, three recommended options for follow-up
- `SPELL_HOOKS_AUDIT_TASK.md` — task spec for Gemini 3 Thinking Deep Research mode
- `SPELL_CANDIDATE_PARAGRAPHS.md` — primary data: pre-extracted FB2 text + current remake_data.js JSON for all 132 paragraphs across 8 spells, with auto-categorization hints
- `GRAPH_AUDIT_REPORT_POST_SPELL_HOOKS.md` — Gemini's findings (PENDING — to be added after audit completion)

**Key finding to verify:** ~50-60 paragraphs have player-cast spell choices missing `spell:"X"` field (P0/P1 bug — spell budget not decrementing on click). Confirmed P0 examples: §93 LEVITATION marsh, §7 SWIMMING/LEVITATION lake, §415 HEALING bear cub.

**Status:** Audit task prepared, awaiting external LLM execution.

### `letter_riddle_engine_may_2026/` — Letter-sum riddle engine design

Design proposals for implementing the canonical letter-sum riddle mechanic at FB2 §1131 and §992. Discovered during the `bandit_tip` closure (commit `a91d540`) as out-of-scope for group_6 — requires new engine UI work.

**Files:**
- `LETTER_RIDDLE_DESIGN_BRIEF.md` — design task spec for generic extended thinking LLM (ChatGPT 5.5 Plus thinking OR Gemini 3.1 Pro extended thinking)
- `RIDDLE_DESIGN_PROPOSAL.md` — LLM's design proposals (PENDING — to be added after task completion)

**Mechanic:** Player computes letter-ordinal sum of riddle answer ("кладбище" = 76), adds canonical modifier (916 / 825), navigates to result paragraph. Wrong answer → death narrative.

**Status:** Design brief prepared, awaiting external LLM execution.
