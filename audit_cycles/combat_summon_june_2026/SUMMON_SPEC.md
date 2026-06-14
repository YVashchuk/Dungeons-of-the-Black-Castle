# COMBAT-SUMMON FEATURE — Technical Specification (Variant C: distinct ally actor)
**Date:** 2026-06-12 · **Status:** PROPOSAL for Yuriy's review · **Scope:** design only, no code/data changed yet
**Canon:** §612 bell-bear (Мастерство 11 / Выносливость 9, anywhere in castle, one use) · §511 bear-fur amulet she-bear (Мастерство 8 / Выносливость 10, "по правилам Копии", one use, OUTSIDE the Black castle only)

---

## 1. Decision recap
Both summons are **distinct allies with their own Skill/Stamina** (not copies of the player or enemy). §511 says it fights "по тем же *правилам*, что Копия" — the **rules** (a side-fight resolved by repeated СИЛА УДАРА rolls), but with the she-bear's **own** stats (8/10), not the enemy's. So one shared "ally side-fight" engine serves both, parameterised by `{skill, stamina}`. This is Variant C as Yuriy framed it.

## 2. How the engine works today (grounding)
- Combat lives in `combatState` (game_logic.js ~L1955): `{enemies[], round, wounds, sec, playerMod, forceBuff, weaknessDebuff, enemyAttackMod, special}`. No ally actor exists.
- **The exact template is `useCopyInCombat()` (L1987).** Copy already runs a self-contained side-fight: pick the strongest alive enemy, then `while(copyHp>0 && enemyHp>0)` roll `2d6+enemySkill` for both sides, ±2 HP/round; on win set `target.hp=0`, else leave the enemy weakened. Afterwards it re-checks the §1175 milestone and `getAliveCombatEnemies()===0 -> endCombat(true)`. **The bear-summon is structurally identical, except the ally rolls `2d6 + ALLY_skill` and has `ALLY_stamina` HP of its own** (Copy borrowed the enemy's skill/hp; the bear uses 11/9 or 8/10).
- **In-combat ability buttons** have a fixed idiom: a DOM button `#btn-<x>-spell` is shown/hidden inside `startCombat()` based on `sec.combat_spells_allowed` (default `['COPY','FORCE','WEAKNESS']`) plus availability, and wired to a `use<X>InCombat()` handler that appends to `#combat-log`, calls `updateCombatEnemyDisplay`, re-checks 1175, and `endCombat(true)` if all enemies fall. FORCE/WEAKNESS/HEALING all follow this.
- **Per-paragraph gating** is `sec.combat_spells_allowed`. There is also a global `S.spells` budget model, but summons are **item-driven**, not spell-budget — so they need their own availability source (the item + a once-per-game flag).
- Win/lose: `endCombat(won)` sets `combatDone[section]`, swaps the round button to Continue/Конец.
- Save shape: `initState()` + `normalizeSave()`. New persistent flags must be added to `normalizeSave()` so old saves stay well-formed (precedent: `sec436_force`, `shopBought`, `riddle_attempts`).

## 3. Data model (proposal)
**(a) The summon items** — granted where canon grants them:
- §612 currently grants only `auto_items:{items:['Медный ключик']}`. **Bug to fix in this feature:** the bell itself is never granted. -> add the bell: `auto_items:{items:['Медный ключик','Волшебный колокольчик']}`.
- §511 grants the amulet via §84's choice `acquires:"Амулет"`. The amulet already enters the bag. (Generic name; see §6 open-Q on disambiguation.)

**(b) A per-item summon descriptor** — a small const table in game_logic.js (NOT in remake_data.js, since it is engine behaviour keyed by item name):
```
const COMBAT_ALLIES = {
  'Волшебный колокольчик': {name:'Медведь',   skill:11, stamina:9,  scope:'anywhere',       verb:'звоните в колокольчик'},
  'Амулет':                {name:'Медведица', skill:8,  stamina:10, scope:'outside_castle', verb:'зовёте медведицу'}
};
```
Rationale: numbers/rules are behaviour; an item->ally map mirrors the existing `ITEM_SIZES` / `SPELL_STYLE_BY_ID` engine tables. (Alternative: put the descriptor on the paragraph data — see §6.)

**Scope:** `'anywhere'` (bell) vs `'outside_castle'` (amulet). The "Black castle" boundary must be defined — §4.4.

## 4. Engine changes
### 4.1 New state
- `combatState.ally` — `null` until summoned; once used holds `{name, skill, stamina, hp}` for display. One ally per fight.
- `combatState.allyUsedThisFight` — guard against two summons in one combat.
- `S.summonsUsed` — **persistent** list of item names already spent (enforces "один раз за всё путешествие"). Add to `initState()` (`summonsUsed:[]`) and backfill in `normalizeSave()`.

### 4.2 New handler `useAllyInCombat(itemName)` (models on `useCopyInCombat`)
1. Guards: `combatState` exists; item still in `S.inventory`; `!combatState.allyUsedThisFight`; `!S.summonsUsed.includes(itemName)`; ally `scope` permits this paragraph (§4.4); >=1 alive enemy.
2. `COMBAT_ALLIES[itemName]` -> `{name, skill, stamina}`.
3. Target: strongest alive enemy (same sort as Copy).
4. **Side-fight ("по правилам Копии") with the ally's OWN stats:**
   ```
   let allyHp = ALLY.stamina, enemyHp = target.hp, round=0;
   while(allyHp>0 && enemyHp>0 && round<50){
     round++;
     const allyStr  = d6()+d6()+ALLY.skill;
     const enemyStr = d6()+d6()+target.skill;
     if(allyStr>enemyStr) enemyHp-=2;
     else if(enemyStr>allyStr) allyHp-=2;
   }
   ```
   - Ally wins (`enemyHp<=0`) -> `target.hp=0`.
   - Ally loses (`allyHp<=0`) -> `target.hp=Math.max(1,enemyHp)` (enemy survives weakened, exactly like Copy's lose branch).
5. Mark spent: `combatState.allyUsedThisFight=true`; `S.summonsUsed.push(itemName)`. **Do NOT remove the item** (canon keeps the bell/amulet; they just can't be re-used — model via `summonsUsed`, not consume).
6. Post: `updateCombatEnemyDisplay`; re-check 1175 milestone (copy the block from `useCopyInCombat`); if `getAliveCombatEnemies()===0` -> `endCombat(true)`; `updateHUD`; scroll log; hide the ally button.

### 4.3 Button wiring in `startCombat()` (mirror Copy/Force)
- Add DOM button `#btn-summon-ally` (single button; label from the matching item).
- Show when: player holds a `COMBAT_ALLIES` item AND it is NOT in `S.summonsUsed` AND its `scope` permits this paragraph AND `sec.summon_allowed!==false`.
- Text e.g. `🐻 Позвать медведя [колокольчик]` / `🐻 Позвать медведицу [амулет]`.
- onClick -> `useAllyInCombat(itemName)`. Hide in `endCombat()` with the other ability buttons.

### 4.4 The "outside the Black castle" rule (§511)
Need `isInsideCastle(section)`. Options: (i) derive the castle paragraph set offline and bake a `CASTLE_SECTIONS` Set into the engine; (ii) `in_castle:true` flag on castle paragraphs in data; (iii) curated landmark list. **Recommendation: (i)** — derive offline, single Set in engine. The bell works inside by design; only the amulet checks this.

### 4.5 UI
v1 recommendation: **log-only** (like Copy) — no persistent ally card, minimal surface. A live ally HP card can be a follow-up.

## 5. Testing (harness plan)
- Unit: side-fight deterministic under seeded d6 — ally(11/9) beats a mid enemy; ally(8/10) outcome; lose branch leaves enemy weakened.
- Guards: 2nd summon in one fight blocked; summon after `summonsUsed` blocked; amulet blocked inside castle / allowed outside; bell allowed both.
- Grants: §612 grants bell (and still key); §84->§511 amulet acquired.
- Integration: summon kills last enemy -> `endCombat(true)`; summon mid-1175 re-checks the orc milestone; save round-trips `summonsUsed`.
- Regression: Copy/Force/Weakness/Healing untouched; `combat_spells_allowed` still gates.

## 6. Open questions for Yuriy (decide before coding)
1. **Descriptor location:** engine `COMBAT_ALLIES` map (recommended) vs paragraph data (`sec.summon`).
2. **Amulet name:** §84 grants generic `"Амулет"`. Rename to `"Медвежий амулет"` at grant (safer, avoids clash with the Golden amulet) — small extra data edit. Recommend yes.
3. **Respect a forbid-flag?** Scripted fights that bar Copy (e.g. §436 "Копии негде поместиться") should likely bar the bear too -> `sec.summon_allowed:false` opt-out (default allow). Recommend yes.
4. **Lose branch:** keep Copy-style "enemy survives weakened", or make summon a guaranteed win? Recommend keep the loop (honest, matches Copy).
5. **UI depth:** log-only (recommended v1) vs live ally HP card.
6. **"Outside castle" mechanism** (§4.4 i/ii/iii).

## 7. Estimated change surface
- `remake_data.js`: §612 bell grant (+ maybe §84 amulet rename) — tiny.
- `game_logic.js`: `COMBAT_ALLIES`, `useAllyInCombat()`, button wiring in `startCombat`/`endCombat`, `isInsideCastle`/`CASTLE_SECTIONS`, `initState`+`normalizeSave` for `summonsUsed`. Medium, self-contained, mirrors Copy/Force.
- Harness + dist + registry group.
No change to `combatRound` (the player's per-round loop) — the ally resolves as a self-contained side-fight like Copy, which is why this is medium- not high-risk.
