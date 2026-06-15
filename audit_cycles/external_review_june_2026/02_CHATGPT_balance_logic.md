# ChatGPT brief — balance, logic & gameplay (June 2026 external review)
**Read `00_BRIEF.md` first.** Use NORMAL mode (not Deep Research). HEAD 4f59e49 · registry v2.89.

## Access (IMPORTANT — operational notes)
- **CONTEXT-WINDOW NOTE (read this):** `src/remake_data.js` is a single ~1 MB line and will likely overflow your context if loaded whole (this is exactly what blocked Gemini). If your tools return only a fragment of it, **do NOT parse the raw file** — instead use the small pre-extracted pack in `audit_cycles/external_review_june_2026/gemini_data/` (despite the name it is model-agnostic): `01_paragraphs_part1..5.jsonl` (the full game, one JSON object per paragraph, in readable shards), `02_graph_facts.json` (precomputed reachability/dangling/combat list/mismatches), `03_combat_paragraphs_for_castle_review.jsonl` (the 76 combat paragraphs with inbound text), `04_art_coverage.json`. The paragraph `text` fields are the FB2 canon text, usable for quoting.
- **First try connecting to the GitHub repo directly** (github.com/YVashchuk/Dungeons-of-the-Black-Castle). In a previous cycle ChatGPT could NOT reach GitHub; if that is still the case, Yuriy will upload a **ZIP archive exported from GitHub WITHOUT the original images** (the `assets/` art/scan binaries are stripped to keep the archive small — you do not need images for this review). Either way you get the source files that matter: `assets/fb2_remake.fb2`, `src/remake_data.js`, `src/game_logic.js`, `assets/text_corrections.json`, `assets/book_1991_extracted.txt`.
- If you only have the no-images archive, that is fine: this brief needs **no** image files.

## Your focus: gameplay balance, combat logic, economy, reachability of *content* (your strength in past cycles)
Funnel every finding through canon (FB2 quote) + `GD` field + engine function — see 00_BRIEF "Verification discipline".

### Task 1 — Combat-summon balance & correctness (group_61, the headline feature)
- The bell summons Медведь (Мастерство 11 / Выносливость 9, anywhere); the amulet summons Медведица (Мастерство 8 / Выносливость 10, outside the castle only). Both run a side-fight in `useAllyInCombat()` (game_logic.js): `2d6 + ally.skill` vs `2d6 + enemy.skill`, ±2 Выносливость per round, ally HP = its own stamina; ally win → enemy.hp=0, ally loss → enemy survives weakened.
- **Check:** Is this faithful to the canon rule "по тем же правилам, по которым сражается Копия"? Compare against `useCopyInCombat()` in the same file. Does the ally correctly target the **strongest** alive enemy in multi-enemy fights, and what happens to the *other* enemies (the summon only resolves one)? Is that the intended/canon behaviour, or should a strong ally sweep more?
- **Check once-per-journey:** `S.summonsUsed` enforces "Один раз за все путешествие"; the item is NOT consumed. Is there any path where the guard fails (e.g. save/reload mid-combat, or the §1175 milestone early-return in `useAllyInCombat`)?
- **Balance question (judgment, your strength):** does a guaranteed-ish bear win trivialize any *specific* hard fight? List the toughest enemies (by skill×stamina) where the bell removes all challenge, and say whether that matches the book's intent (the bell is a one-shot reward, so some trivialization is canon — but flag outliers like the final fights).

### Task 2 — Economy / obtainability closure (groups 58/59)
- We added the Флакончик духов grant at §866 and gate+consume at §1063→773. Verify there is no *second* use-site or a double-grant.
- We proved the "six orphan gates" (Банан, Блестящий кусок металла, Красивый кусочек дерева, Песочные часы, Серебряный браслет, Фигурный ключ) are all obtainable. **Re-derive independently:** scan ALL FIVE grant mechanisms and report any inventory_condition item that is genuinely never granted by any of them. (Don't re-report the six unless you can show otherwise.)
- Gold economy: spot-check that priced shop buys at §340 deduct gold correctly and that no item is free.

### Task 3 — Reachability of *content* (group_57)
- We wired §945→954, §854→938 (was a hard dead-end: empty choices), §260→600 (restores Водяной loot). Verify each target is the canon continuation (quote FB2).
- Independently look for any *other* paragraph whose `choices` array is empty or whose only exits are unreachable — a hard dead-end like §854 was. Report with FB2 evidence.

## Output format
A numbered list of findings. For each: **claim → FB2 quote (paragraph N) → GD field / engine function → suggested action (or "working as intended")**. Mark confidence. Group "no issue found — verified" items separately so we know what you checked. Avoid prose essays; we funnel each claim individually.
