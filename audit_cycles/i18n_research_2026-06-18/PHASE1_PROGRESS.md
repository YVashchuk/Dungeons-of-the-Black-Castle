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
3. [ ] **spell / renderChoices filter** — the post-combat-victory branch hides spell choices via
   `spellChoiceRe=/заклят|заклин/i` on the label (coupling #1, part b). A field-based check is NOT
   equivalent (6 combat-paragraph choices differ — §131/§1150 post_combat levitation moves have spell
   fields but no «заклят» label; §174/§994 match the label but have no spell field), so this needs a
   label-derived `spell_choice:true` flag (like flee) to stay behavior-identical.
4. [ ] **scene** — add `scene` to every paragraph (derived once by the current classifier) and make
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
