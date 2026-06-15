# Gemini brief — graph structure, castle boundary & art coverage (June 2026 external review)
**Read `00_BRIEF.md` first.** Use NORMAL mode (not Deep Research). HEAD 4f59e49 · registry v2.89.

## Access (operational note)
Per our established workflow, **Yuriy provides a data folder for Gemini** containing the files below (the same convention as the previous `gemini_session_1` folder). You do not need GitHub access; review the provided files:
`assets/fb2_remake.fb2`, `src/remake_data.js`, `src/game_logic.js`, `src/game_shell_top.html`, `assets/text_corrections.json`, `assets/book_1991_extracted.txt`, and (for the art task) `src/mj_art.js` + the art catalog. If any of these are missing from your folder, say so explicitly rather than guessing.

## Your focus: paragraph-graph structure, the castle-boundary set, and art coverage (your strengths in past cycles)
Funnel every finding through canon (FB2 quote) + `GD` field — see 00_BRIEF "Verification discipline". NOTE: in past cycles Gemini fabricated lore terms, invented illustration counts, and cited unrelated fan sites — please **quote the actual file** for every claim; if you cannot quote it, do not assert it.

### Task 1 — The CASTLE_SECTIONS set (the highest-value check this cycle)
The bear-fur amulet (§511) is "powerless inside the Black castle". We curated a set of **26 castle-interior combat paragraphs** in `game_logic.js`:
`[43,96,131,174,388,455,481,588,618,628,684,722,742,760,788,790,805,823,915,950,1050,1096,1099,1150,1163,1177]`
We chose a curated set (not a runtime flag) because the castle has no clean graph boundary (see `combat_summon_june_2026/CASTLE_BOUNDARY_ANALYSIS.md`).
- **Check each of the 76 combat paragraphs** (paragraphs whose `GD` has an `enemies` array): for each, read its own prose AND its inbound paragraphs' prose, and classify INSIDE vs OUTSIDE the castle. Report:
  - any paragraph IN our set that is actually a **forest/road/river** fight (→ amulet wrongly blocked there), and
  - any paragraph NOT in our set that is actually **castle-interior** (→ amulet wrongly usable there).
- Pay special attention to the ones we hand-ruled: §617 (we say forest Застава, excluded), §191 (forest guide, excluded), §456 (forest spider-tree, excluded), §197 (forest she-bear den, OUTSIDE). Agree/disagree with FB2 quotes.

### Task 2 — Graph integrity (your structural strength)
- Independently compute reachability from §1 (BFS over `choices` targets + riddle `valid_targets` + `fail_target`). Confirm 1205/1221 reachable, 0 dangling. List any dangling target (a `target` with no matching paragraph) — there should be none.
- Confirm the 16 vestigial islands in `reachability_audit_june_2026/TIER_BC_VESTIGIAL_FINDING.md` are genuinely content-free duplicates (their successors reachable elsewhere). Flag any that actually carry unique content/items we should have wired.
- Look for label/target mismatches: any `choices` entry whose label's trailing "(N)" disagrees with its `target`. We fixed the only one (§562) in group_60; confirm zero remain.

### Task 3 — Art coverage (deferred work; map it, don't generate)
Art is on hold until Midjourney renews, but please audit `src/mj_art.js` (the `MJ_MAP`, source of truth) vs the art catalog for: paragraphs mapped to art that doesn't exist, art entries not mapped to any paragraph, and known-broken items already noted (§449 two-headed dragon rendered single-headed; §1003 stone-rats look organic; art51/art08 AI-text artifacts). Produce a clean coverage table (paragraph → art id → status). **Do not invent illustration counts** — count only what is in the files.

## Output format
Per task, a table or numbered list. For each finding: **claim → FB2 quote (paragraph N) or file line → suggested action**. Separate "verified, no issue" from "problem found". For Task 1, give the full 76-paragraph classification table so we can diff it against ours.
