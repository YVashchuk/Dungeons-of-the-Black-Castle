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


---

## Increment 5a — item registry foundation (coupling #3, part a) \u00b7 2026-06-18
**File:** `src/registries/items.json` (NEW). Additive — **not** concatenated by `build.sh`
(`build_shell.py` references it 0 times), so the dist is byte-unchanged and there is **zero** behavior
change. This is the foundation + safety net for the 5b-5e item/food/save flip.

**What:** materialized the frozen 98-item table as the canonical registry: **82 item/flag + 16 food**.
Shape — `slug -> { legacyRu, kind, size?, ally?, defaultStamina?, legacyRaw? }`:
- `kind` \u2208 `item` | `food` | `flag` (6 flags: treasure_lore/throne_lore/mirror_secret/fish_help/
  castle_password/password_evenlo — intangibles, treated as size-1 items in Phase 1; `kind` is
  informational).
- `size` only on `diving_suit`:2, `flying_carpet`:3 (for `ITEM_SIZES`).
- `ally` only on `magic_bell`:"bear", `bear_amulet`:"she_bear" (for `COMBAT_ALLIES`).
- Food carries `defaultStamina` where unambiguous; **banana** is intentionally left without one (its
  per-site stamina varies 2/3 in the data — the grant site governs).
- The two suffixed foods keep a clean `legacyRu` (`Бутылка вина`/`Печень дракона`) plus `legacyRaw`
  (`Бутылка вина (еда: +4)` / `Печень дракона (еда: +9)`) so the registry alone maps the exact data
  string (used by the bijection check and the future save migration).
- Canon resolutions baked in: `card_deck` (not "cards"), `golden_orange` (artifact) distinct from food
  `orange`, `watermelon` = item (not food).

**Validation (the safety net):** re-extracted every item string from the live data across all 10
item-bearing fields (`auto_items.items`/`.food[].name`, section+choice `grants_items`,
`bet_payout.items`/`.food[].name`, choice `inventory_condition`/`consume_on_use`/`acquires`/
`grants_food.name`; str | `{all,item}` | list shapes). Result: **98 data strings (82 non-food + 16
food), every one resolves to exactly one slug; 98 distinct slugs used; 0 registry slugs absent from
data — bijective.** Plus internal consistency (unique slugs/legacyRu, valid kinds, size/ally only on the
expected slugs, flag set == the 6). Harness: `_audit_tmp/p1_items_build_validate.py` (a committed
data↔registry validator will accompany 5b, once the data references slugs).

**Verification:** `items.json` is valid JSON (98 keys, node-parsed); spot-checked; dist unchanged
(not in build). Single commit (no dist rebuild needed).

**Next (5b):** re-key all data item references RU->slug (all 10 fields), then a committed validator that
asserts every data slug \u2208 registry.


---

## Increment 5b — logic-side item normalization via canonItem (coupling #3, part b) \u00b7 2026-06-18
**Files:** `src/game_logic.js`.

**What:** added the registry infrastructure and routed all item *logic* through it, while data and
`S.inventory` stay Russian.
- New (generated from `items.json`): `const RU_TO_SLUG` / `const SLUG_TO_RU` (98 each), `stripFoodSuffix`,
  `canonItem(x)` (Russian name OR carried-food «name (еда:+N)» string -> slug; idempotent on slugs;
  passthrough for unknown/hand-typed), `itemName(slug)` (-> Russian display; passthrough), `invDisplay`
  (inventory entry -> display string, resolves slug + preserves food suffix).
- Re-keyed `ITEM_SIZES` (`diving_suit`:2, `flying_carpet`:3) and `COMBAT_ALLIES` (`magic_bell`,
  `bear_amulet`) from Russian names to slugs (values unchanged).
- Routed all ~14 comparison/size/ally sites through `canonItem`: `getItemSize`, `passesInventoryCheck`
  `baseEq`, `applyChoiceConsume` removeOne, `applyChoiceAcquires`/auto_items/`takeItem`/grants dedup,
  the inventory-modal in-bag check, bet stake/payout/stake-picker, the (dead) `auto_items.lose` match,
  and the summon ally + `summonsUsed` checks.

**Why behavior-identical:** data + `S.inventory` are still Russian, so for every comparison both sides
go through `canonItem(Russian)` -> the same slug, and the re-keyed tables are looked up by
`canonItem(name)` -> the same value as the old Russian key. The RU<->slug map is bijective (5a), so no
two distinct names collide. **Display is intentionally untouched** (inventory is still Russian, so the
raw strings render exactly as before); display moves to `invDisplay` in 5c, before any slug can enter
the inventory in 5d.

**Verification:** `node --check` OK. **5b harness 27/27** — incl. `canonItem` bijective+idempotent over
all 98, `itemName`/`invDisplay`/`getItemSize` correct, tables slug-keyed with values intact, and
**`passesInventoryCheck` new===old across ~300 (condition, inventory) cases** (string / `{all}` /
`{item,count}` / array / food-suffixed / custom). **Group B regression 21/21** (loader updated to
globalize the infra). Structural baseline unchanged (data untouched). dist verified (`canonItem` +
`RU_TO_SLUG` present, both tables slug-keyed, no Russian-keyed table, no fuzzy match).

**Commits:** source+log, then dist.


---

## Increment 5c — display + notifications via invDisplay/itemName (coupling #3, part c) \u00b7 2026-06-18
**Files:** `src/game_logic.js`.

**What:** routed all ~22 user-visible item-name sites through `invDisplay()` / `itemName()` so that once
a slug enters the inventory (5d) it still renders as the Russian display name:
- Renders: inventory modal row, the HUD bag row, the pickup modal (`showInventoryModal`) found-item row,
  and the stake-picker button.
- `eatFood`: the "Съедено" log + notification use `itemName(clean)`.
- Gain/loss strings: `takeItem`, `dropItemModal`, `removeItem`, `applyChoiceConsume` (log +
  `showItemNotification`), grants (`+ name`), `grants_food` (`+ foodStr`), the dice-bet stake/return/
  payout notifs + logs, the stake-picker stake log, and the (dead) `auto_items.lose` notif.

**Why behavior-identical:** `S.inventory` and all data references are still Russian, and
`invDisplay(x)===x` / `itemName(x)===x` for any string not in `SLUG_TO_RU` (every current entry: Russian
names, «name (еда:+N)» food strings, hand-typed customs). So every wrapped site renders byte-identically
today; the wrapping only changes output once slugs appear (5d). `showItemNotification` itself is
unchanged (it receives already-formatted strings; its callers wrap).

**Verification:** `node --check` OK; 5b harness 27/27 (resolvers intact: `invDisplay`/`itemName`
passthrough on Russian, slug->RU on slugs); Group B regression 21/21 (gates untouched); structural
baseline unchanged; engine + dist verified (3 inventory spans wrapped, **no raw `${item}` display span
remains**, `itemName(clean)` present).

**Commits:** source+log, then dist.


---

## Increment 5d — flip data item references RU -> slug (coupling #3, part d) \u00b7 2026-06-18
**Files:** `src/remake_data.js`.

**What:** flipped every item *name* in the data from its Russian string to its registry slug, across all
ten item-name positions, leaving everything else byte-identical:
- choice-level: `inventory_condition` (str / `{all:[...]}` / `{item,count}`), `consume_on_use`
  (str / list / `{item,count}`), `acquires` (str / list), `grants_items` (str), `grants_food.name`.
- section-level: `auto_items.items` / `auto_items.food[].name`, `bet_payout.items` /
  `bet_payout.food[].name`, `set_stake.name` (only the one `{kind:'item'}` stake).
- **307 flips total.** The two food strings that live inside `auto_items.items` keep their suffix:
  `Печень дракона (еда: +9)` -> `dragon_liver (еда: +9)` (§67), `Бутылка вина (еда: +4)` ->
  `wine_bottle (еда: +4)` (§550).

**Why behavior-identical:** `canonItem(slug) === canonItem(Russian-name-of-same-item)` for all 98 items
(proven in 5b), so replacing a condition's Russian name with its slug does not change
`canonItem(condition)`, and the inventory side is unchanged -> `passesInventoryCheck` is invariant.
Grants now push slugs into `S.inventory`; `canonItem` normalizes every comparison and `invDisplay`/
`itemName` (5c) render the Russian name, so both logic and display are unchanged. Old Russian saves keep
working even before 5e because `canonItem` bridges Russian inventory entries to slug conditions.

**Verification:** the apply step asserts the JSON round-trip is byte-identical *before* writing, that
every flipped value resolves to a registry slug, and that **no Russian name remains in any item
position**; structural baseline unchanged (1221/1205/0/76/116). `node --check` OK. **5d harness: 523
cases, 0 mismatches** -- for every real `inventory_condition`, engine `passesInventoryCheck` on the NEW
slug condition equals the OLD Russian-string semantics over inventories built from the condition's actual
items (present / absent / decoy / food-suffixed, and the AND / count / OR shapes). 5b harness 27/27;
Group B regression 21/21 (its five item-identity assertions were made `canonItem`-robust so they pass
against slug data and survive future renames). dist verified (slug conditions present, suffixed food
preserved, no Russian condition value, `SLUG_TO_RU` display map intact).

**Commits:** data+log, then dist.


---

## Increment 5f — structured food objects; drop the (еда:) regex; SAVE_KEY bump (coupling #3, part f) · 2026-06-18
**Files:** `src/remake_data.js`, `src/game_logic.js`.

**What:** the final flip sub-step — carried food is now a structured object instead of a
self-describing string, removing the last Cyrillic parsing coupling.
- **Storage shape:** food inventory entries are `{id, kind:'food', stamina}` objects; non-food items
  stay slug strings. `S.inventory` is now `(string | {id,kind:'food',stamina})[]`.
- **Construction (3 sites → objects):** `auto_items.food`, `grants_food`, `bet_payout.food` now push a
  fresh `{id:f.name, kind:'food', stamina:f.stamina}` per copy (no `(еда:` string built).
- **Consumption / display / sizing read object fields:** `eatFood` uses `item.stamina`/`item.id`; the HUD
  shows the eat button on `item.kind==='food'`; `canonItem(foodObj)→id`, `invDisplay(foodObj)→
  itemName(id)+' (еда: +N)'`, `getItemSize(foodObj)→1`. `passesInventoryCheck`, `applyChoiceConsume`,
  `getBagUsed`, the pickup modal and stake handling needed no change — they already route through
  `canonItem`/`getItemSize`/`invDisplay`.
- **Removed `stripFoodSuffix` and every `(еда:` parsing regex.** The only `(еда: +N)` left in the engine
  is the *display* string produced by `invDisplay` (localizable later); the only other `еда:` in the
  bundle is the unrelated word «беда:» in §295 prose.
- **Data normalization:** moved §67 and §550's suffixed food out of `auto_items.items` into
  `auto_items.food` as `{name, stamina}`, so *all* food flows through the object path and no `(еда:`
  string remains in data.
- **Saves:** bumped `SAVE_KEY` `podzch_v5`→`podzch_v6` (any stale string-food save is simply ignored —
  fresh start, as intended; there are no saves to preserve) and widened the inner `loadGame` gate from
  `v4/v5` to `v4–v7`. The gate widening also resolves a pre-existing reload mismatch: the map layer
  stamps `S.v=7` on save, but the inner gate accepted only v4/v5, so a freshly-saved game could fail to
  reload. New-format saves now round-trip correctly.

**Why it satisfies the acceptance criterion (save/load on the new code):** food objects serialize to JSON
and deserialize back as objects; `canonItem`/`invDisplay`/`getItemSize`/`getBagUsed` and the count/AND/OR
gates all operate correctly on the loaded objects; the widened gate accepts the `v7` the map layer writes.

**Verification:** `node --check` on both files. **5f harness 29/29** — food objects through
`canonItem`/`invDisplay`/`getItemSize`/`getBagUsed`/`passesInventoryCheck` (single / `{item,count}` incl.
6-banana / `{all}` / mixed bag), `stripFoodSuffix` gone, and a **save/load JSON round-trip** proving food
objects survive and stay functional with the `v7` gate. **Group B regression 21/21** (non-food gates
untouched; its loader updated to drop the removed `stripFoodSuffix`). Structural baseline unchanged
(1221/1205/0/76/116 — targets untouched). dist verified (`SAVE_KEY=podzch_v6`, gate `v>=4&&v<=7`,
food-object construction present, `stripFoodSuffix` absent, §67 food moved). (The 5b/5d harnesses are
string-era proofs for those increments and are not re-run; the object model is covered by the 5f harness.)

**Milestone:** coupling #3 (item/food identity) is complete (5a–5f), so **all four Cyrillic engine
couplings are now removed** (#1 spell, #2 flee, #3 item/food, #4 scene). Phase 1 still has the
text-extraction (locale + resolvers) and the `remake_data.js`→`game_structure.js` rename remaining.

**Commits:** source (data+engine+log), then dist.


---

## Increment 6a — extract paragraph text + choice labels into locale.ru.js (text extraction, part a) · 2026-06-18
**Files:** `src/locale.ru.js` (new), `src/remake_data.js`, `src/game_logic.js`, `build.sh`.

**What:** the first text-extraction step — the Russian display text is split out of the data structure.
- **New `src/locale.ru.js`:** `const LOCALE_RU = { p: { "N": {t:"<paragraph text>", c:["<labels>"]}, … } }`
  for all 1221 paragraphs — **1221 paragraph texts + 2212 choice labels** (873 KB), one paragraph-entry
  per line for readable diffs / future translation.
- **Slimmed `remake_data.js`:** removed `text` from every paragraph and `label` from every choice. The
  data file drops 1,035,668 → 160,139 bytes — it is now essentially the language-neutral structure
  (targets, slugs, scene, enemy stats, riddle logic, flags). (Enemy names and `riddle.fail_target_label`
  remain for a later sub-step.)
- **Resolvers in `game_logic.js`:** `pText(n)` → `LOCALE_RU.p[n].t`; `label(n,i)` → `LOCALE_RU.p[n].c[i]`;
  and `locSec(n)` returns the structural paragraph **hydrated** with its localized text + per-choice
  labels (`Object.assign` copy, shallow).
- **Hydration at the two `sec` acquisition points** — `renderGame` and `completePurchase` now do
  `const sec=locSec(S.section)`. `sec` flows as a parameter into every render path (`renderChoices` →
  `renderCanonCombatChoices`/`startCombat`→`cs.sec`/`startLuckCheck`, the riddle/dice/picker dispatch,
  `makeChoiceBtn`/`makePurchaseBtn`, and `showDeathOverlay({sec})`), so **all downstream `sec.text` /
  `ch.label` reads are unchanged** — no per-read rewrite, no index threading.
- **build.sh:** `locale.ru.js` added to REQUIRED_FILES and concatenated right after `remake_data.js`.

**Why behavior-identical:** the locale holds the exact original strings (verified byte-for-byte against a
pre-removal capture), and `locSec` merges them back onto the structure, so the rendered paragraph text
and every choice label are identical to before. `generateSceneImage(sec.text)` still works (it only uses
the text as a truthiness guard; the gradient comes from the `scene` field).

**Verification:** `node --check` on data, locale, and engine. **6a harness 10/10** — `pText` reproduces
all 1221 paragraph texts, `label` all 2212 choice labels, `locSec` reproduces text+labels **and**
preserves structural fields (target/scene/enemies), plus missing-paragraph safety (empty string, no
crash). Group B 21/21 (loads the slimmed data fine). 5f harness 29/29 (food unaffected). Structural
baseline unchanged (1221/1205/0/76/116). dist verified (`LOCALE_RU` + `pText`/`locSec` present, `sec`
hydrated ×2, §1 prose present in the bundle via the locale, size unchanged).

**Remaining text extraction:** 6b engine static text (SPELLS/COMBAT_ALLIES/PREFACE/PREGAME), 6c engine UI
strings, 6d enemy names + `riddle.fail_target_label`, 6e map strings; then item 7 the
`remake_data.js`→`game_structure.js` rename.

**Commits:** source (data+locale+engine+build+log), then dist.


---

## Increment 6b — extract engine static text (spells/allies/preface/pregame) into locale.ru.js (text extraction, part b) · 2026-06-18
**Files:** `src/locale.ru.js`, `src/game_logic.js`.

**What:** moved the Russian text that lived inline in the engine into `LOCALE_RU`.
- **SPELLS:** `name` + `full` (8 spells) → `LOCALE_RU.spells[id] = {name, full}`. The `SPELLS` const is
  slimmed to `[{id, icon}]` (the emoji icon is language-neutral, kept).
- **COMBAT_ALLIES:** `name` + `verb` (2 allies) → `LOCALE_RU.allies[key] = {name, verb}`. The const is
  slimmed to `{skill, stamina, scope, icon}` (structural + emoji).
- **PREFACE_TEXT / PREGAME_TEXT** → `LOCALE_RU.preface` / `.pregame`. Both engine consts are now
  locale-sourced (`const PREFACE_TEXT=(typeof LOCALE_RU!=='undefined'&&LOCALE_RU.preface)||''`), so their
  readers (`startGame`, the preface button) are unchanged.
- **Resolvers:** `spellText(id)` → `{name, full}`, `allyText(key)` → `{name, verb}` (both with safe
  empty defaults). Repointed the 8 read sites: `renderSpellSel` (name+full), the HUD spell tag and
  `useSpell` log (name), the combat ally button / `cs.ally` / summon log / fight line (name+verb).
- `locale.ru.js` reorganized: `spells` / `allies` / `preface` / `pregame` keys precede the per-line `p`
  block.

**Why behavior-identical:** the locale holds the exact original strings (evaluated from the source via
Node, so multi-line descriptions, emoji and apostrophes are byte-exact), and the resolvers return them;
the slim consts keep every structural field (id/icon, skill/stamina/scope/icon) verbatim.

**Verification:** `node --check` engine + locale. **6b harness 16/16** — slim `SPELLS`/`COMBAT_ALLIES`
equal the originals' structural projection, `spellText` reproduces all 8 names + full descriptions,
`allyText` reproduces both names + verbs, locale-sourced `PREFACE_TEXT`/`PREGAME_TEXT` equal the
originals, icons/stats preserved, unknown-key safety. 6a harness 10/10, Group B 21/21, 5f 29/29 (all
unaffected). dist verified (`LOCALE_RU.spells`/`.allies` blocks present, spell/ally names + preface text
in the bundle via locale, `SPELLS`/`COMBAT_ALLIES` consts slimmed).

**Remaining text extraction:** 6c engine UI strings (~500), 6d enemy names + `riddle.fail_target_label`,
6e map strings; then item 7 the `remake_data.js`→`game_structure.js` rename.

**Commits:** source (locale+engine+log), then dist.


---

## Increment 6c-1 — extract engine UI string literals into locale.ru.js (text extraction, part c-1) · 2026-06-18
**Files:** `src/game_logic.js`, `src/locale.ru.js`. Scratch tool: `acorn` (in `_audit_tmp`, never in the repo).

**What:** moved the **208 Cyrillic UI string literals** (144 distinct) that were inline in the engine into
`LOCALE_RU.ui`, accessed via a new resolver `t('key')`.
- **Parser:** the earlier regex tokenizer mis-parsed around JS **regex literals** (a `"`/`'` inside
  `/.../ ` corrupts string-boundary detection — it reported 169 plain + garbage). Switched to the **acorn**
  AST parser for accurate string-`Literal` ranges. Each whole literal's source range is spliced → `t('key')`.
- **Keys:** transliteration-slug of the Russian (HTML stripped for *key derivation* but kept in the value);
  identical strings share one key (e.g. `' золотых'` ×17 → `t('zolotyh')`); slug collisions between distinct
  strings get `_2`/`_3` (e.g. `'+ еда ×'`→`eda`, `' (еда: +'`→`eda_2`).
- **Resolver:** `t(k)` returns `LOCALE_RU.ui[k]`, or the key itself on a miss (visible, not blank).
- **Excluded (correctly left inline):** `SLUG_TO_RU` values + `RU_TO_SLUG` keys (item locale, generated
  from items.json in phase 5); `ALPHABET_RU` and the `'Е'` ё→е target (riddle letter-ordinal **logic**,
  not display); all object **property keys**. Regex Cyrillic (`/[^А-ЯЁ]/g`, `/Ё/g`) is not a string literal
  so acorn never reported it.

**Why behavior-identical:** the apply script asserts `ui[key] === literal value` for every occurrence, and
reconstructs the original source byte-for-byte from the edit ranges + raw literals before writing (proving
only the targeted literals changed) — aborting untouched on any mismatch. `t(key)` returns the exact
original string at each site.

**Verification:** `node --check` engine + locale. **6c-1 harness 8/8** — `LOCALE_RU.ui` has all 144 keys
with exact values; `t(key)` reproduces every value; **re-parsing the new engine with acorn confirms the
only Cyrillic string literals remaining are the intended exclusions** (item maps + the two logic constants),
i.e. nothing was missed. 6a 10/10, 6b 16/16, Group B 21/21, 5f 29/29 (5f harness updated: provide
`LOCALE_RU`+`t()` to the eval'd `invDisplay`; the food display suffix `' (еда: +'` is now `t('eda_2')` in
locale, so the old "suffix is an inline literal" check became "suffix in locale + invDisplay uses t()").
Structural baseline 1205 reachable / 16 unreachable (remake_data.js untouched). dist verified (`t()`
resolver + `LOCALE_RU.ui` in bundle, UI strings resolve via `t()`, `ALPHABET_RU` + item names stay inline).

**Remaining text extraction:** 6c-2 (79 template-literal quasis → `${t('key')}`, tag-split for clean
values), 6d (enemy names + `riddle.fail_target_label`), 6e (map_module.js strings); then item 7 the
`remake_data.js`→`game_structure.js` rename.

**Commits:** source (engine+locale+log), then dist.


---

## Increment 6c-2 — extract engine UI template quasis into locale.ru.js (text extraction, part c-2) · 2026-06-18
**Files:** `src/game_logic.js`, `src/locale.ru.js`. Scratch tool: `acorn`.

**What:** completed 6c by moving the Russian text inside **template literals** into `LOCALE_RU.ui`. Re-parsed
the post-6c-1 engine with acorn (positions had shifted), collected the **79 Cyrillic quasis** (static text
between `${…}` expressions), split each by HTML tags (`<[^>]*>`), and replaced every Cyrillic **text-run**
with `${t('key')}` — leaving HTML tags and `${expr}` verbatim. 87 fragment edits (some quasis hold multiple
text-runs), **68 new keys**; 19 fragments reused 6c-1 keys for identical values (e.g. `' зол.'`). `ui` now
has **212 keys** total. Covers the combat enemy card, combat-log round lines, the luck panel, dice/luck
modals, copy/ally summon lines, the orc-fight messages, and the inventory/notification templates.

**Caveat (minor, deferred):** a few values carry tag-syntax fragments where an HTML tag or attribute spans a
`${}` boundary (e.g. the title `<img … alt="…">`, the `)">+ Взять` button text) — the quasi begins/ends
mid-tag, so its Cyrillic run includes adjacent markup. Behavior-identical (the value reproduces exactly);
can be hand-cleaned later if desired.

**Why behavior-identical:** the apply asserts `ui[key] === fragment value` for every edit and reconstructs
the original source byte-for-byte from the edit ranges + raw fragments before writing (aborting untouched on
mismatch). Each `${t('key')}` sits inside the same backticks it replaced text in, so the template emits the
identical string at runtime. (A verification-only off-by-one in the key-slice — `slice(5,-2)` vs `-3` —
tripped the abort guard on the first run; fixing it to `-3` let the asserts pass. The transform/edits were
never wrong; the guard did its job.)

**Verification:** `node --check` engine + locale. **6c-2 harness 5/5** — all 68 new keys resolve via
`t()`; **re-parsing the new engine confirms ZERO Cyrillic quasis remain** (nothing missed, incl. no
Cyrillic-inside-a-complete-tag cases). 6c-1 8/8 (its ui-length check relaxed to a subset, since ui legitimately
grows), 6a 10/10, 6b 16/16, Group B 21/21, 5f 29/29. Structural 1205 reachable. dist verified (`${t('…')}`
interpolations in bundle, combat labels via `t()`, all 68 new key/value pairs serialized).

**6c complete — the engine's UI text is fully externalized into `LOCALE_RU.ui` (212 keys).**

**Remaining text extraction:** 6d (enemy names + `riddle.fail_target_label`, in remake_data.js), 6e
(map_module.js strings); then item 7 the `remake_data.js`→`game_structure.js` rename.

**Commits:** source (engine+locale+log), then dist.


---

## Increment 6d — enemy names + riddle.fail_target_label into locale.ru.js (text extraction, part d) · 2026-06-18
**Files:** `src/remake_data.js`, `src/locale.ru.js`, `src/game_logic.js`.

**What:** moved the last Russian text out of the structure file.
- **Enemy names:** `enemies[].name` (118 occurrences, **65 distinct**, e.g. `ГОБЛИН` ×18) → `LOCALE_RU.enemies`
  as `{slug: "RU NAME"}` (translit-slug keys, same scheme as 6c). In `remake_data.js`, `enemies[].name` now
  holds the slug. New resolver `enemyName(slug)`. Names are resolved **at combat-init** (`startCombat`): the
  raw "Враги: …" log line (`enemies.map(e=>enemyName(e.name))`) and the `combatState` build
  (`{...e, name:enemyName(e.name), …}`), so `combatState.enemies[].name` carries the resolved RU string and
  every downstream display site (enemy card, combat-log lines, copy/ally `target.name`) is unchanged. This
  mirrors 6b, where `cs.ally.name` already stores the resolved RU ally name.
- **riddle.fail_target_label:** 6 occurrences (¶67, 95, 435, 439, 992, 1113) → `LOCALE_RU.p[n].rfl`; removed
  from `GD`. `locSec(n)` hydrates it back onto a **copy** of the riddle object
  (`out.riddle=Object.assign({},s.riddle,{fail_target_label:Lp.rfl})`) only when present, so `renderRiddle`
  reads `sec.riddle.fail_target_label` unchanged and `GD` is never mutated.
- **`remake_data.js` is now 100% Cyrillic-free** — a fully language-neutral structure file.

**Why behavior-identical:** the GD JSON round-trip was verified byte-identical to the original *before*
applying (so the diff is only the slug/label changes, no reformatting); the apply asserts no Cyrillic
remains in GD and every engine replacement is unique. `enemyName(slug)` returns the exact original name;
`locSec` hydration reproduces the exact original label.

**Verification:** `node --check` remake_data + locale + engine. **6d harness 11/11** — GD has zero Cyrillic;
`LOCALE_RU.enemies` has all 65 with exact values and `enemyName` reproduces them; every `GD` enemy slug is
resolvable; no `fail_target_label` left in GD; `LOCALE_RU.p[n].rfl` present for all 6; `locSec` hydrates the
label for all 6 **without mutating GD**. 6c-1 8/8, 6c-2 5/5, 6a 10/10, 6b 16/16, Group B 21/21, 5f 29/29.
Structural baseline 1205 reachable (targets untouched). dist verified (`LOCALE_RU.enemies` + `enemyName`
present, combat resolves via `enemyName`, GD uses slugs with no Cyrillic, 6 `rfl` entries, labels hydrated).

**Remaining text extraction:** 6e (`map_module.js` strings); then item 7 the
`remake_data.js`→`game_structure.js` rename. Also pending (deferred, on request): hand-cleaning the few 6c-2
quasi values that carry tag-syntax fragments.

**Commits:** source (remake_data+locale+engine+log), then dist.


---

## Increment 6e-1 — map data titles into locale.ru.js (text extraction, part e-1) · 2026-06-18
**Files:** `src/map_module.js`, `src/locale.ru.js`.

**What:** externalized the map's display titles. `BC_MAP_DEF` (the map metadata const) holds **43 distinct
layer/node/encounter `.title` strings** (e.g. "Внешний мир", "Покои Принцессы"). Moved them to
`LOCALE_RU.map` as `{slug: "RU"}`; in `map_module.js` each `.title` now holds the slug (targeted
`"title": "<RU>"` → `"title": "<slug>"` replacement — titles are all unique, so no JSON reformat needed:
`BC_MAP_DEF` was Python-`json.dumps`-formatted with `": "`/`", "` separators that a Node round-trip
wouldn't reproduce). A **resolve-at-load IIFE** (inserted right before `BC_MAP_STATE_TEMPLATE`) runs when
`map_module.js` loads — `locale.ru.js` precedes it in build order, so `LOCALE_RU` is available — and sets
each `.title = LOCALE_RU.map[slug]` while preserving the slug in `.titleKey` (for future language switching
/ re-resolution). Titles are **display-only** (read at the status pill, SVG label, layer dropdown, meta and
note panels; never compared in logic), so resolving them in place is safe and every display site is
unchanged.

**Dev notes left as-is:** `BC_MAP_DEF.meta.notes` (3 strings) and `BC_MAP_STATE_TEMPLATE.notes` (1) are
developer metadata, never rendered — left in the data (not translation content). Noted for optional later
cleanup.

**Why behavior-identical:** the resolve loop restores the exact original RU title at load; display reads
`.title` unchanged. Per-title replacement asserts each `"title": "<RU>"` occurs exactly once.

**Verification:** `node --check` map + locale. **6e-1 harness 10/10** — `LOCALE_RU.map` complete; all source
titles are Cyrillic-free slugs present in `LOCALE_RU.map`; **executing the resolve loop restores the exact
RU titles and sets `.titleKey` to the slug** for every layer/node/encounter; dev notes untouched. 6a 10/10,
6b 16/16, 6c-1 8/8, 6c-2 5/5, 6d 11/11, Group B 21/21, 5f 29/29. Structural 1205 (remake_data.js untouched).
dist verified (`LOCALE_RU.map` + resolve loop present, `BC_MAP_DEF` uses slugs, no Cyrillic titles in data).

**Remaining text extraction:** 6e-2 (map UI render strings — 9 quasis + `'Герой'`/save-error literals → `t()`,
reusing 6c-1 keys where identical); then item 7 the `remake_data.js`→`game_structure.js` rename.

**Commits:** source (map+locale+log), then dist.


---

## Increment 6e-2 — map UI render strings into locale.ru.js (text extraction, part e-2) · 2026-06-18
**Files:** `src/map_module.js`, `src/locale.ru.js`. Scratch tool: `acorn`.

**What:** moved the map's runtime UI text into `LOCALE_RU.ui` via `t()` (map render runs after game_logic.js
defines `t()`). 12 edits: **9 template-quasi fragments** (tag-split → `${t('key')}`: "Текущий узел: ",
" · открыто узлов: ", "Слой: ", "Узел:", "Открыто:", "Слой:", "Текущий узел:", "Открыто узлов:", and the
fog-of-war legend) → 9 new ui keys; plus **3 literals** (`'Герой'`, `'Несовместимый формат'`,
`'Ошибка загрузки'`) that **reuse existing 6c-1 keys** by value (no new keys). `ui` now has **221 keys**. The
`BC_MAP_DEF`/`BC_MAP_STATE_TEMPLATE` ranges are excluded so the dev notes stay untouched.

**Why behavior-identical:** gap-reconstruction from edit ranges is byte-identical to the original;
`ui[key] === value` asserted per edit; `t()` returns the exact string at each site.

**Verification:** `node --check` map + locale. **6e-2 harness 10/10** — all 9 new keys + the 3 reused-literal
keys resolve via `t()`; **re-parsing map_module.js confirms ZERO Cyrillic UI string literals (outside the
data consts) and ZERO Cyrillic quasis remain**; dev notes still present in the data. 6e-1 10/10, 6d 11/11,
6c-1 8/8, 6c-2 5/5, 6a 10/10, 6b 16/16, Group B 21/21, 5f 29/29. dist verified (`${t('sloy')}` interpolation,
`t('geroy')` fallback, legend in locale, no bare map UI text).

---

## ✅ Item 6 (text externalization) COMPLETE
All user-facing Russian text now lives in `src/locale.ru.js`:
- `p[n].{t,c,rfl}` — paragraph text, choice labels, riddle fail-labels (6a, 6d)
- `spells`, `allies`, `preface`, `pregame` — engine static text (6b)
- `ui` (221 keys) — engine + map UI strings via `t()` (6c, 6e-2)
- `enemies` (65) — combat enemy names via `enemyName()` (6d)
- `map` (43) — map titles, resolved at load (6e-1)

`remake_data.js` is fully Cyrillic-free. The **only** Cyrillic remaining in the codebase is non-display:
the 4 `map_module.js` dev-metadata notes and source comments.

**Remaining Phase 1 work:** item 7 — rename `remake_data.js` → `game_structure.js` (+ build.sh wiring; the
locale header already references the new name). **Deferred (on request):** hand-clean the 6c-2 quasi values
that carry tag-syntax fragments; optionally relocate the map dev notes.

**Commits:** source (map+locale+log), then dist.
