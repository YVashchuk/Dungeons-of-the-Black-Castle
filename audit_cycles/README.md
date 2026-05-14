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
