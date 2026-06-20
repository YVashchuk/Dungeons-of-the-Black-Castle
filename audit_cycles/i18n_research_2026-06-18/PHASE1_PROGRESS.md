# Phase 1 — implementation progress log

RU-only, behavior-identical migration toward the neutral-structure + inline-locale architecture
(see SYNTHESIS.md / PHASE1_SPEC.md). Executed as small, independently-verified increments; each
goes through the full pipeline (byte-identical splice / exact str_replace -> `node --check` ->
behavior-equivalence proof -> Node harness -> structural regression 1221/1205/0/76/116 -> build ->
dist verify) and is committed separately. The RU build stays behaviorally identical at every step.

## Increment roadmap
1. [DONE] **flee** — data-drive the combat flee penalty (coupling #2).
2. [ ] **spell** — explicit `spell` on the 6 fallback-reliant choices, then delete the
   `SPELL_KEYWORDS` + `/заклят|заклин/` label fallback (coupling #1). NOTE: §1088 ch[0] is a
   `combat_mod` choice (Group A) whose label still says «заклятие Слабости» — the fallback detects
   WEAKNESS but `combat_mod` precedes it, so it is a FALSE POSITIVE and must NOT be tagged `spell`.
3. [ ] **scene** — add `scene` to every paragraph (derived once by the current classifier) and make
   `setAtmosphericBg` read it instead of scanning Russian text (coupling #4; cosmetic gradient).
4. [ ] **item-ID registry + inventory/food/save flip** — materialize `items.json` (82 non-food + 16
   food, frozen table), re-key data conditions/grants + engine `ITEM_SIZES`/`COMBAT_ALLIES` to slugs,
   convert food to structured form (coupling #3), `S.inventory` holds slugs, `v6` save migration.
5. [ ] **text extraction + resolvers** — `extract_i18n.py` -> `locale.ru.js`; engine reads via
   `t()/pText()/label()/itemName()/enemyName()/spellText()`.
6. [ ] **rename** `remake_data.js` -> `game_structure.js`; build.sh locale concatenation + modes.

---

## Increment 1 — flee penalty data-driven (coupling #2) · 2026-06-18
**Files:** `src/remake_data.js`, `src/game_logic.js`.

**Before:** `makeChoiceBtn()` L1226 applied the -2-stamina flee penalty via
`duringCombat && /убежать|бежать|отступить|покинуть|сбежать|спастись бегством|бегство/i.test(ch.label)`
- a Cyrillic-label coupling that would break once labels move to locale files.

**Change:**
- Tagged `flee:true` on exactly the **18** choices whose label matches that regex
  (paras 10/74/143/260/340/437/442/455/617/636/689/702/719/769/804/981/1119/1171), byte-identical splice.
- Engine: replaced the regex test with `const isFleeChoice=duringCombat&&ch.flee===true;` (the
  `duringCombat` gate is unchanged); updated the adjacent comment.

**Behavior-identity proof:** `flee:true` is set IFF the label matches the original regex, and the
`duringCombat` gate is untouched, so `duringCombat && ch.flee===true` is equivalent to
`duringCombat && regex.test(label)` for every choice. (3 of the 18 are in combat paragraphs -
260/455/617; the other 15 are inert under the gate, exactly as before.)

**Verification:** only those 18 paragraphs changed bytes; `node --check` OK on both files; structural
baseline unchanged (1221 / 1205 reachable / 0 dangling / 76 combat / 116 post_combat); flee harness 8/8;
Group B regression harness 21/21 (engine intact); `build.sh` -> dist 11.6 MB; dist verified
(`ch.flee===true` present, Cyrillic flee regex absent, 18 x `"flee":true`).

**Commits:** source+log, then dist.
