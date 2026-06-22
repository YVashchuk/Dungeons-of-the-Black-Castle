# Phase 1 — implementation progress log

RU-only, behavior-identical migration toward the neutral-structure + inline-locale architecture
(see SYNTHESIS.md / PHASE1_SPEC.md). Executed as small, independently-verified increments; each
goes through the full pipeline (byte-identical splice / exact str_replace -> `node --check` ->
behavior-equivalence proof -> Node harness -> structural regression 1221/1205/0/76/116 -> build ->
dist verify) and is committed separately. The RU build stays behaviorally identical at every step.

## Increment roadmap
1. [DONE] **flee** — data-drive the combat flee penalty (coupling #2).
2. [DONE] **spell / getSpellId** — explicit `spell` on the one plain fallback-reliant choice; delete
   `SPELL_KEYWORDS` + the `/заклят|заклин/` label fallback in `getSpellId` (coupling #1, part a).
3. [DONE] **spell / renderChoices filter** — the post-combat-victory branch hides spell choices via
   `spellChoiceRe=/заклят|заклин/i` on the label (coupling #1, part b). A field-based check is NOT
   equivalent (6 combat-paragraph choices differ — §131/§1150 post_combat levitation moves have spell
   fields but no «заклят» label; §174/§994 match the label but have no spell field), so this needs a
   label-derived `spell_choice:true` flag (like flee) to stay behavior-identical.
4. [DONE] **scene** — add `scene` to every paragraph (derived once by the current classifier) and make
   `setAtmosphericBg` read it instead of scanning Russian text (coupling #4; cosmetic gradient).
5. [ ] **item-ID registry + inventory/food/save flip** — materialize `items.json` (82 non-food + 16
   food, frozen table), re-key data conditions/grants + engine `ITEM_SIZES`/`COMBAT_ALLIES` to slugs,
   convert food to structured form (coupling #3), `S.inventory` holds slugs, `v6` save migration.
6. [ ] **text extraction + resolvers** — `extract_i18n.py` -> `locale.ru.js`; engine reads via
   `t()/pText()/label()/itemName()/enemyName()/spellText()`.
7. [ ] **rename** `remake_data.js` -> `game_structure.js`; build.sh locale concatenation + modes.

---

## Increment 1 — flee penalty data-driven (coupling #2) · 2026-06-18
**Files:** `src/remake_data.js`, `src/game_logic.js`.
Tagged `flee:true` on the 18 choices whose label matched the combat flee regex; replaced the engine's
Cyrillic label test with `duringCombat && ch.flee===true` (gate unchanged). `flee:true` is set iff the
old regex matched, so behavior is identical. Verified: only 18 paragraphs changed; `node --check` OK;
1221/1205/0/76/116; flee harness 8/8; Group B regression 21/21; dist verified (18 x `"flee":true`,
Cyrillic regex gone). Commits: 312b507 (source+log), 6c23fe6 (dist).

---

## Increment 2 — spell / getSpellId label fallback removed (coupling #1a) · 2026-06-18
**Files:** `src/remake_data.js`, `src/game_logic.js`.

**Before:** `getSpellId(ch)` returned `ch.spell` if present, else parsed the Russian label
(`SPELL_KEYWORDS` map gated on `/заклят|заклин/`). `makeChoiceBtn` branch order is
**spell_any (L1182) -> combat_mod (L1203) -> getSpellId (L1208)**, so `getSpellId` is only reached by
choices with neither `spell_any` nor `combat_mod`.

**Analysis:** of the 8 choices whose label-fallback differs from `ch.spell`, 7 are bypassed before
`getSpellId` runs — §160/§192/§286 (`combat_mod:"FORCE"`), §865 (`combat_mod:"ENEMY_PLUS2"`), §1088
(`combat_mod:"PLAYER_MINUS2"`, the Group A case), §402/§614 (`spell_any`). Only **§526 ch[0]** is a
plain choice that actually reaches `getSpellId` (old fallback -> FORCE).

**Change:**
- Data: `§526 ch[0] += spell:"FORCE"` (only paragraph changed).
- Engine: deleted `SPELL_KEYWORDS`; `getSpellId(ch)` is now `return ch.spell||null;` (no label parsing).

**Behavior-identity proof:** for every choice that *reaches* `getSpellId` (not `spell_any`, not
`combat_mod`), new `getSpellId` == old `getSpellId`; the 7 bypassed choices never consult it. Verified
by harness running the new `getSpellId` against the old logic over all 2212 choices.

**Verification:** `node --check` OK (both files); 1221/1205/0/76/116; spell harness 12/12; Group B
regression 21/21; dist verified (`SPELL_KEYWORDS` gone, `getSpellId` returns `ch.spell||null`, §526
serialization embedded). One `/заклят|заклин/` remains — the `renderChoices` post-combat filter,
handled in Increment 3.

**Commits:** source+log, then dist.


---

## Increment 3 — spell / renderChoices post-combat filter data-driven (coupling #1b) · 2026-06-18
**Files:** `src/remake_data.js`, `src/game_logic.js`.

**Before:** `renderChoices()` combat-won branch hid spell choices via `spellChoiceRe=/заклят|заклин/i`
tested on `ch.label` (`!spellChoiceRe.test(ch.label)`).

**Why a flag (not the spell fields):** measured in the 76 combat paragraphs — a field-based check
`(ch.spell||ch.spell_any)` would differ from the regex on 6 choices: §131 ch[2/3/4] and §1150 ch[2]
are `post_combat` levitation moves that have spell fields but no «заклят» in the label (the regex shows
them post-victory; a field check would wrongly hide them), and §174/§994 match the label but have no
spell field. So a label-derived flag is required to stay behavior-identical.

**Change:**
- Data: tagged `spell_choice:true` on the **112** choices (across 76 paragraphs) whose label matches
  `/заклят|заклин/` — the same global-equivalence pattern used for `flee`.
- Engine: removed `const spellChoiceRe=...`; the filter is now `!ch.spell_choice && !ch.luck_type && ...`.

**Behavior-identity proof:** `ch.spell_choice===true` IFF the label matches `/заклят|заклин/`, for every
choice (harness asserts this globally), so `!ch.spell_choice` ≡ `!spellChoiceRe.test(ch.label)`.
Spot-checked the 6 distinguishing cases (§131×3 + §1150 stay shown; §174 + §994 stay hidden).

**Verification:** `node --check` OK (both files); 1221/1205/0/76/116; spell-filter harness 11/11; Group
B regression 21/21; dist verified (`spellChoiceRe` absent, `!ch.spell_choice` present, no
`/заклят|заклин/` regex, 112 × `"spell_choice":true`).

**Coupling #1 (spell) is now fully removed from engine LOGIC.** The 8 remaining «заклят/заклин» in the
engine are confirmed UI strings/comments (SPELLS `full:` descriptions, `PREGAME_TEXT`, the "choose 10
spells" alert, one button label, one comment) — handled in the text-extraction increment, not logic.

**Commits:** source+log, then dist.


---

## Increment 4 — atmospheric scene classifier data-driven (coupling #4) · 2026-06-18
**Files:** `src/remake_data.js`, `src/game_logic.js`.

**Before:** `setAtmosphericBg(text)` lowercased the paragraph text and chose one of 8 background
gradients by Russian-substring `includes()` (forest/castle/river/combat/dungeon/field/night/else);
`generateSceneImage(sec.text)` called it on each section change. Cosmetic only (a `#scene-bg`
radial-gradient at opacity .25).

**Change:**
- Data: added `scene` to **every paragraph** (1221), derived once by the engine's exact if/elif over
  `sec.text` -> one of `forest|castle|river|combat|dungeon|field|night|default`. Written via a verified
  byte-identical round-trip of the GD blob (each paragraph gains only `scene`). Distribution: default
  368, forest 346, dungeon 161, combat 141, castle 99, river 83, night 18, field 5.
- Engine: added a `SCENE_GRADIENTS` table (the 8 gradient strings, extracted verbatim from the old
  classifier); `setAtmosphericBg(scene)` now does `SCENE_GRADIENTS[scene]`; `generateSceneImage` passes
  `(GD[S.section]&&GD[S.section].scene)||'default'` (its `!text` / section-change guard unchanged).

**Behavior-identity proof:** for all 1221 paragraphs, `SCENE_GRADIENTS[stored_scene]` equals the
gradient the old classifier would compute from `sec.text` (checked at the gradient-string level, with
the stored scene independently re-derived from the text in the harness).

**Verification:** GD round-trips byte-identically; only `scene` added per paragraph; `node --check` OK
(both files); 1221/1205/0/76/116; scene harness 8/8; Group B regression 21/21; dist verified
(`SCENE_GRADIENTS` present, lookup in `setAtmosphericBg`, `t.includes('лес')` gone, 1221 `"scene":`).

**Milestone:** three of the four Cyrillic engine couplings are now removed — #1 spell (getSpellId +
post-combat filter), #2 flee, #4 scene. The engine no longer reads Russian *paragraph or label* text in
any logic branch. The FOURTH coupling, **#3 item/food identity**, is still present and is the big
Increment 5: `S.inventory` holds Russian item names, `ITEM_SIZES`/`COMBAT_ALLIES` are Russian-keyed, and
food is parsed via the `(еда:` regex. So the remaining Cyrillic in the engine is item/food logic + UI
strings (+ riddle answer-matching), all handled in later increments.

**Commits:** source+log, then dist.
