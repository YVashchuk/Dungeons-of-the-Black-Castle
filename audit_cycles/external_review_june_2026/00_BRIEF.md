# External Review — June 2026 cycle (post-group_61)
**Repo:** github.com/YVashchuk/Dungeons-of-the-Black-Castle (private) · **HEAD:** 4f59e49 · **Registry:** text_corrections.json v2.89 (60 groups)
**Mode to use: NORMAL chat with the repo/files attached — NOT Deep Research.** This is a code+canon review of OUR artifacts; web search adds nothing. See WHY_NOT_DEEP_RESEARCH below.

---

## What this game is
A single-file HTML/PWA remake of D. Braslavsky's 1991 Russian gamebook *Подземелья Чёрного замка* ("Dungeons of the Black Castle"). **1221 paragraphs**, victory at §1220. Canonical source of truth: `assets/fb2_remake.fb2` (the remastered 1221-paragraph edition). A decoded copy of the **1991 first edition** (617 paragraphs) lives at `assets/book_1991_extracted.txt` and is used to adjudicate disputes about original intent.

Key files to read:
- `assets/fb2_remake.fb2` — canon text (1221 paragraphs).
- `src/remake_data.js` — the `GD` object: a single-line ~1MB JSON blob, one entry per paragraph (`{text, choices[], enemies[], auto_items, riddle, ...}`). **To inspect: parse it with JSON, do NOT line-grep (it is one line).**
- `src/game_logic.js` — the engine (~128 KB): combat, spells, luck, riddles, shop, betting, summons, save/load.
- `src/game_shell_top.html` — the HTML shell (combat modal, buttons, styles).
- `assets/text_corrections.json` — the versioned correction registry (every fix we have made, with canon quotes and `status_done`). **Read this first to see what is already done — do not re-flag closed items.**
- `audit_cycles/` — prior analyses, including `combat_summon_june_2026/` (the feature just shipped) and `reachability_audit_june_2026/`.

## Engine facts you must know before reviewing (so you don't mis-flag working code)
1. **Items are granted by FIVE mechanisms**, not one: `auto_items.items`, `auto_items.food[]`, choice/section `grants_items`, choice `grants_food`, and `bet_payout.items` (gambling winnings, materialized by `applyBetting()`). A "gated but never granted" claim is FALSE unless you have checked all five. (We already burned a cycle on this — see group_59.)
2. **`remake_data.js` is one line.** `git diff`, grep, and word-diff are useless on it. Use `json.load` + per-paragraph inspection.
3. **Reachability baseline is 1205 / 1221 reachable, 0 dangling.** 16 of the unreachable paragraphs are *vestigial* 1991-structure nodes deliberately superseded by the remaster's direct `inventory_condition` gating (see `reachability_audit_june_2026/TIER_BC_VESTIGIAL_FINDING.md`). Do not "fix" them by inventing parents.
4. **Combat in-fight helpers:** besides the **Copy spell**, the player can summon **ALLIES via held ITEMS** (NEW, group_61): the magic bell (§612 → Медведь, Мастерство 11 / Выносливость 9, works anywhere) and the bear-fur amulet (§84/§511 → Медведица, Мастерство 8 / Выносливость 10, only OUTSIDE the Black castle). These are distinct actors with their own stats that fight "по правилам Копии" (the rules, not as a copy). The "inside castle" set is the curated `CASTLE_SECTIONS` (26 combat paragraphs) in game_logic.js. Do NOT treat Copy as the only in-combat helper, and do NOT flag the amulet's castle restriction as a bug.

## Verification discipline we require of every finding
For each claim you make, please funnel it through: **(1) quote the canonical text** from `fb2_remake.fb2` (paragraph N), **(2) show the relevant `GD` field** from `remake_data.js`, **(3) if engine behaviour is involved, point at the function in `game_logic.js`.** A finding with no canon quote is not actionable. We never wholesale-accept or wholesale-reject a report — each claim is checked independently. (Past external reports have fabricated lore terms and invented counts; please cite, don't assert.)

## What we want reviewed (scope of this cycle)
The four areas closed since v2.82, looking for anything we got wrong or missed:
- **group_61 combat summons** (bell/amulet allies) — is the `CASTLE_SECTIONS` set right? any castle-interior combat we wrongly OMITTED (→ amulet wrongly usable there) or wrongly INCLUDED (→ amulet wrongly blocked in a forest fight)? Is the side-fight math faithful to canon? Edge cases (multi-enemy fights, §1175 orc milestone, fleeing enemies)?
- **group_57 island-edge restorations** (§945→954, §854→938, §260→600) — correct targets? Any *other* dropped content-bearing edge we missed?
- **group_58/59 obtainability** (Флакончик духов source; the "six orphan gates" that proved false) — any genuinely unobtainable gated item we still miss?
- **group_60 remake-bug reports** (§562 label fix; §339↔425 refuted) — agree/disagree, with canon.

Per-model task splits are in the model-specific brief files (02/03/04). Use your assigned split; findings outside it are welcome if canon-backed.

---

## WHY NOT DEEP RESEARCH
Deep Research is a web-search tool. Every question in this cycle is answered by OUR local artifacts (the FB2 canon, the 1991 original, and our two source files). There is no public web source that can adjudicate our combat engine, our paragraph graph, or our item economy. Deep Research would return generic gamebook lore, not findings about THIS codebase. So: **attach the repo (or the archive) and review in normal mode.** If a genuinely external question arises (e.g. a dispute about what the *printed* 1991/1995 editions said that our local copy can't settle), flag it explicitly and we'll handle that separately.
