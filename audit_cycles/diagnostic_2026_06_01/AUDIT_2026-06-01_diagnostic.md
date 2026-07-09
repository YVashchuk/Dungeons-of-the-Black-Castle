# Diagnostic Audit — *Подземелья Чёрного замка* (1221 §)

**Date:** 2026-06-01
**Build audited:** `src/remake_data.js` (`const GD`, 1221 paragraphs) + `src/game_logic.js` (2051 lines)
**Registry state:** `assets/text_corrections.json` — v2.49, 30 groups
**Auditor session:** Claude Windows App, full filesystem + PowerShell/Python/Node toolchain
**Scope:** Diagnostic only. No code committed. Findings below are either harness-executed or engine-code-traced, labelled per finding.

---

## Method & verification standard

Reachability, item-lifecycle, economy, and persistence checks were **executed** with Python (`-X utf8`) over the live-parsed `GD` object — harness-grade, reproducible. Combat/luck/spell findings were **traced directly in `game_logic.js` source and cross-checked against `GD` data**; the combat loop is DOM-coupled, so it was verified by code reading + data assertions rather than a live browser session (a Node math-harness for Monte-Carlo numeric confirmation is available on request, but the logic trace is conclusive). Canonical text was read verbatim from `assets/fb2_remake.fb2`.

Corpus integrity gate (executed): `GD` parses as valid JSON; **exactly 1221 paragraphs**, keys `"1"`–`"1221"`, no gaps, no stray keys. Cyrillic round-trips cleanly under UTF-8.

---

## Headline

**No P0 / P1 / P2 defects found.** Every previously-tracked concern carried in prior session notes (`group_1` gold signs, `group_2` passive effects, `group_5` fatal-unlucky dead-ends, `group_7` Vodyanoy paradox, `group_8` infinite-arrow loot, `group_21` free-payment softlocks) is **closed and confirmed in the live data**, not merely marked done in the registry. The remaining findings are one verified P3 (engine luck-cap asymmetry) plus three optional/cosmetic P3 items.

---

## Dimension-by-dimension results

### 1 — Reachability & graph integrity ✅
- **0 dangling targets** across all 2156 `choice.target` edges — none points to a non-existent paragraph.
- Edge model verified complete: navigation is `choices[].target` + 2 `riddle` objects (`§992`, `§1131`); the 4 `combat_script` paragraphs route to targets already present in their `choices`. No hidden numeric goto field exists.
- BFS from `§1` over (choice + riddle) edges → **1167 reachable / 54 unreachable**.
- The unreachable set is **byte-identical** to `group_29`'s enumerated 54 (zero difference in either direction), confirming the registry's reachability map is current and reflects all post-`group_6` wiring.
- The brief's specific concern (a genuine orphan hiding among the 54) was checked by attacking `group_29`'s weakest classification — its 16-entry `unclassified_mostly_mechanic_reached` bucket. Every entry resolves to a real mechanic-entry, either chain-dependent on a classified root (e.g. `§1037`←`§1023` candle, `§1133`←`§661` key) or an unmistakable mechanic landing from its own canon text (`§342`/`§875` key-conditional, `§731` password answer, `§736` copper-key horse loot, `§713` fish-help rescue, `§1188` Fire-spell cast).
- `group_29`'s falsifiable "zero FB2 reference" claim for `§831` / `§968` / `§1114` / `§1131` / `§106` was re-tested → **0 reference-like hits each**, confirmed.

**Verdict:** `group_29`'s conclusion holds under independent re-verification. The 54 are intentional conditional/arithmetic mechanic-entries; wiring any as a plain choice would break gating. No genuine orphan.

### 2 — Combat / luck / spell / flee ✅
Traced in `game_logic.js`:
- **Combat math** (`combatRound`, lines ~1510–1605): player Сила Удара = `2d6 + S.skill + playerMod (+2 if FORCE)`; enemy = `2d6 + enemy.skill (−2 if WEAKNESS)`. Win → enemy `hp −2` and `wounds++`; loss → player `stamina − enemy.dmg` (`dmg` defaults to 2); tie → no damage. Matches Fighting-Fantasy canon.
- **Luck check** (`doLuckCheck`, ~1777): `lucky = roll ≤ S.luck`, then `S.luck = max(0, S.luck − 1)`. Comparison uses the pre-decrement value; decrement is correct.
- **Spell budget**: every cast path routes through `useSpell` (`sp.remaining--`, button disabled at 0): in-narrative spell choices (`makeChoiceBtn`), and the three combat spells `useCopyInCombat` / `useForceInCombat` / `useWeaknessInCombat`.
- **Flee penalty** (−2 stamina): fires only via the pre-combat choice path (`makeChoiceBtn(..., duringCombat=true, ...)` at line 1347) when the label matches the flee regex. Correct.
- **`combat_condition:"wound_2"`** (`§532` → `§437`): surfaced once `cs.wounds >= 2` (line 1588). Verified the only such choice in the data.
- **Scripted combats**: all four trace correctly — `§21` (`sec21_pre_luck`, −2), `§368` (`sec368_optional_pre_luck`, −1), `§436` (`sec436_pre_luck` spider, including the `S.sec436_force` persistent-flag Force round-trip §436→§526→§436 at +1, and the `only_after_unlucky` FORCE→§526 / WEAKNESS→§448 navigation), `§1175` (`sec1175_canon_orcs` reinforcement + flee-luck script).
- **Enemy stats**: 0 enemies missing `skill`/`stamina` (a missing value would crash the round math). Damage overrides present and sane (`{3: 6, 4: 1}`).

### 3 — Item lifecycle ✅ (executed)
- **28 distinct `inventory_condition` gating item-names; every one has at least one *reachable* grant** (`auto_items.items` / choice `acquires` / purchase `grants_items`). **Zero problem gates** (no NO-GRANT, no GRANT-UNREACHABLE-only).
- Gate↔grant name strings match exactly — important because the engine gates via `S.inventory.includes(name)`, so any string drift would silently kill a gate. The bronze-whistle / copper-key (`Медный ключик`) / silver-bracelet name rationalizations all hold.
- Items whose grant happens to sit in an unreachable paragraph (`§600`, `§1045`) always have a **parallel reachable grant** for the same name, so the gate is still satisfiable.
- **7 `consume_on_use`** entries (`§226` orange, `§851` copper key, `§972` ×4 hand-overs, `§1164` ring) all correspond to canonical single-use events.

### 4 — Economy ✅ (executed)
- Start gold **15** (`initState`). Reachable `auto_items` gold gains total ~52 (→ ~67 with start).
- **`group_1` gold-sign bugs fixed & confirmed in data**: `gold_sub` now present on `§552` (−1), `§675` (−2), `§686` (−1), `§695` (−4), `§903` (−1), `§937` (−6). Registry `status_done` commit `e85b351`.
- `§745` correctly carries no `auto_items`; its 10-gold cost lives on the `§1092 → 745` choice's `gold_cost` (the `group_16` mechanism moved the deduction to the choice — no double-charge).
- **Softlock scan** (paragraphs where every choice is `gold_condition`-gated with no free escape, excluding combat/luck/riddle) → **only `§630` and `§1092`, and no others.** Both are **safe**, not softlocks: the sole inbound choice to each gates *entry* on having at least the cheapest in-paragraph option (`§88 → 630` at `gold_condition:2`; `§730 → 1092` at `gold_condition:3`), so a player can never arrive too poor to act. This confirms the brief's "confirm no others" for the `group_21` Variant A fix.

### 5 — State persistence & robustness ✅ (executed)
- All **9 `auto_items` keys present in the data** (`items`, `gold`, `gold_sub`, `stamina_add`, `stamina_sub`, `skill_add`, `luck_add`, `clear_inventory`, `gold_zero`) are **handled by the engine** — no silent no-op keys.
- **`group_2` passive auto-effects present**: `§25` `stamina_sub:2`, `§484` `stamina_add:2`, `§513` `stamina_add:3`, `§927` `stamina_add:8`, `§1147` `stamina_add:4`.
- **Every `S.<field>` the engine reads (18 distinct) is covered** by `initState` ∪ `normalizeSave` — the "uncovered" set is empty. The four persistent runtime flags (`shopBought`, `riddle_attempts`, `sec436_force`, `eventLog`) are all backfilled, so an old save cannot crash a new build. v4→v5 upgrade path and the `s.v` version gate are intact.

---

## Findings

### Verified bug (code-level)

**F-1 · P3 · `auto_items.luck_add` is not capped to `luckMax`.**
`game_logic.js:507` applies `S.luck += ai.luck_add` with **no ceiling**, whereas the sibling stat grants both cap: `stamina_add` (line 503, `Math.min(S.staminaMax, …)`) and `skill_add` (line 505, `Math.min(S.skillMax, …)`). Consequently the five +1-LUCK grants in the data (e.g. `§929`) can push current Luck **above Initial Luck**, making later luck tests easier than canon intends.

- Canon (`§929`, FB2): «…добавьте себе 1 УДАЧУ».
- **Verification:** `luck_add` occurs on 5 paragraphs; line 507 is the only application site; no other code caps `S.luck` on the upside (`doLuckCheck` only ever decrements).
- **Suggested fix (only if canon caps Luck at its initial value):** mirror the siblings → `S.luck = Math.min(S.luckMax, S.luck + ai.luck_add);`
- **Caveat:** confirm against the book's Luck rules before changing. Some Fighting-Fantasy-style books intentionally allow "+1 LUCK" events to exceed Initial Luck; if this edition's do, the current uncapped behaviour is correct-by-design and F-1 should be closed as a non-bug.

### Optional / cosmetic (P3)

**S-2 · P3 · Reusable-gate consume sweep (low residual risk).**
Several reusable gating tokens (`Помощь рыбки`, `Клубочек`, `Рубиновая звезда`, etc.) gate multiple consumers with no `consume_on_use`. The registry adjudicated these as canonically reusable. The only theoretical gap left in item lifecycle is a full sweep of FB2 "expend / lose the item" instructions to confirm none of these should be single-use. Low priority.

**S-3 · P3 · `normalizeSave` does not coerce core numeric stats.**
`normalizeSave` backfills arrays and runtime flags but not `skill` / `stamina` / `luck` (and their maxes). This is safe for every real v4/v5 save (those always contain the stats from `initState`); it is only a hand-edit or future-rename hazard. Optional defensive hardening, not a live bug.

**S-4 · P3 · `post_combat` flag inconsistency (cosmetic).**
On post-victory exits, `§1150 → 690` carries `post_combat:true` but the equivalent post-victory choices `§760 → 985` and `§1163 → 959` do not. Because those two paragraphs have no `luck_type` / `combat_condition` choices to filter against, the `combatWon` render branch shows them identically, so there is no behavioural difference today. Flag-consistency nicety only.

### Confirmed non-bugs (re-verified this pass)

- **S-1 (resolved → non-bug): the four «уйти» combat exits are NOT missing a flee penalty.** Read against FB2, `§760 → 590`, `§788 → 817`, `§1150 → 817`, `§1163 → 697` are all **post-victory** exits — each gated in canon behind «Если вы победите их…» / «Если вы его уничтожили…» / «Победить его несложно…». None is a mid-combat flight, so the −2 flee penalty must **not** apply. The engine is correct to exclude them.
- `group_29` reachability verdict (54 = intentional mechanic-entries).
- `§13` fish-help `acquires:"Помощь рыбки"` → 639 wiring.
- `§992` / `§1131` riddle chain (`valid_targets` = success edge, `modifier` = arithmetic base, not a target).
- `group_1` gold-sign conversions (data-confirmed).
- `group_2` passive auto-effects (data-confirmed).
- `group_5` `§203` / `§289` / `§377` fatal-unlucky death-overlay route (`§456` correctly left unchanged — different fault class).
- `group_7` `§642` Vodyanoy paradox (`clear_inventory:true` + `gold_zero:true`, applied before other mutations).
- `group_8` `§570` arrow bundle (fixed-N single entry).
- `group_21` `§630` / `§1092` free-payment gating (entry-gated; safe).
- `§340` peasant shop (15-gold start, `purchase` engine, 9 items: 3 consumable food + 6 inventory).
- **Doc nit:** `group_29`'s `unclassified` bucket mislabels a few entries that are in fact classifiable (`§731` password, `§736` bear-key loot, `§713` fish-help, `§1188` Fire-spell). Cosmetic registry-labelling only.

---

## Summary count

| Severity | Count | Items |
|---|---|---|
| P0 / P1 / P2 | **0** | — |
| P3 — verified | **1** | F-1 (luck cap) |
| P3 — optional / cosmetic | **3** | S-2, S-3, S-4 |
| Confirmed non-bugs (re-verified) | **11** | incl. S-1 resolution + 10 closed groups + the 54-orphan classification |

**Highest-confidence finding:** **F-1** — `auto_items.luck_add` lacks the `luckMax` cap that `stamina_add` and `skill_add` both enforce (`game_logic.js:507`). It is concrete, isolated, and the single item worth actioning — pending a one-line confirmation of the book's Luck-ceiling rule.

---

## Reproducibility

All executed results above regenerate from standalone Python scripts (parse `GD`, run the checks):
- Reachability + orphan diff vs `group_29`
- Combat-data wiring (scripts, `combat_condition`, enemy-stat completeness, flee-label scan)
- Item gate↔grant audit (exact-string matching)
- Economy (gold sources/sinks, shop, softlock scan)
- Persistence (`auto_items`-key handling, `S.<field>` coverage)

Canonical text quoted from `assets/fb2_remake.fb2`. Game text, item names, and choice labels are kept in original Russian verbatim for substring/regex compatibility with the verification pipeline.
