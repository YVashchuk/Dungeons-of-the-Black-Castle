# README — how to run this external-review cycle (June 2026)
**HEAD 4f59e49 · registry text_corrections.json v2.89 (60 groups) · reachability 1205/1221, 0 dangling**

## TL;DR
- **Method: NORMAL chat review with files attached. NOT Deep Research.** (Rationale in `00_BRIEF.md` → WHY NOT DEEP RESEARCH: every question is about our local canon + our code; the web cannot adjudicate it.)
- Three model-specific briefs, each with a task split matched to that model's past strengths:
  - `02_CHATGPT_balance_logic.md` — combat-summon balance, economy/obtainability, content reachability.
  - `03_GEMINI_graph_castle_art.md` — the CASTLE_SECTIONS boundary set, graph integrity, art coverage.
  - `04_CLAUDE_verification.md` — per-claim canon verification + engine-edge correctness (tie-breaker).
- Shared context for all three: `00_BRIEF.md` (read first).

## Per-model access (Yuriy's operational notes)
- **Gemini:** provide the **data folder** (same convention as the earlier `gemini_session_1` folder). Include: `assets/fb2_remake.fb2`, `src/remake_data.js`, `src/game_logic.js`, `src/game_shell_top.html`, `assets/text_corrections.json`, `assets/book_1991_extracted.txt`, and for the art task `src/mj_art.js` + the art catalog.
- **ChatGPT:** **try the GitHub repo first** (it failed to connect in a previous cycle — check if it works now). If GitHub still fails, upload the **ZIP exported from GitHub WITHOUT the original images** (as last time) — this review needs no image files. Files needed are the same source files listed for Gemini (minus the art task).
- **Claude:** attach the repo or the same source files. No images needed.

## Files to attach (none of the briefs need image binaries)
1. `assets/fb2_remake.fb2` — canon (1221 paragraphs)
2. `src/remake_data.js` — GD object (single-line ~1MB JSON; parse, don't grep)
3. `src/game_logic.js` — engine (~128 KB)
4. `src/game_shell_top.html` — shell/combat UI
5. `assets/text_corrections.json` — registry (read first; don't re-flag closed items)
6. `assets/book_1991_extracted.txt` — decoded 1991 first edition (617 paragraphs; whitespace-mangled, search space-insensitively)
7. (Gemini art task only) `src/mj_art.js` + art catalog

## What we want back
Per-claim findings, each: **claim → canon quote (FB2 paragraph N, or 1991) → GD field / engine function → action (or "verified, no issue")**. We funnel each claim independently through FB2 → remake_data.js → a Node harness here before any commit; reports that only assert without quoting are not actionable. Save each model's reply into this folder as `NN_<model>_report.md` for the record (same as the `gemini_session_*_report.md` convention).

## Scope (closed work to review for errors/omissions)
- **group_61** combat summons (bell §612 / amulet §84-511 allies; CASTLE_SECTIONS) — headline feature.
- **group_57** island-edge restorations (§945→954, §854→938, §260→600).
- **group_58/59** obtainability (Флакончик духов; the six "orphan gates" that proved false).
- **group_60** remake-bug reports (§562 label; §339↔425 refuted).

## After results come back
Bring all three reports here. We adjudicate **per claim** (canon-first), archive the raw replies in this folder, and only then implement anything confirmed — the usual data → harness → dist → registry loop, with Yuriy doing every git push.
