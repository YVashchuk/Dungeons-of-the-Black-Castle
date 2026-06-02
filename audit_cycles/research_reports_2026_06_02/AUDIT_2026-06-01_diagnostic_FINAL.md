# Diagnostic Audit — *Подземелья Чёрного замка* (1221 §) — FINAL

**Date:** 2026-06-01
**Build audited:** `src/remake_data.js` (`const GD`, 1221 paragraphs) + `src/game_logic.js` (2051 lines)
**Registry state:** `assets/text_corrections.json` — v2.49, 30 groups
**Auditor session:** Claude Windows App, full filesystem + PowerShell/Python/Node toolchain
**Status:** Diagnostic complete. One fix (F-1) **applied to the working tree and verified**, but **NOT committed** — the `git commit` is reserved for the verification chat (Yuriy). All other findings close as non-bugs.

---

## Method & verification standard

Reachability, item-lifecycle, economy, and persistence checks were **executed** with Python (`-X utf8`) over the live-parsed `GD` object — harness-grade, reproducible. Combat correctness was verified two ways: **(a)** direct trace of `game_logic.js` round logic, and **(b)** a **200,000-trial Node Monte-Carlo harness** mirroring `combatRound()` exactly. Canonical text was read verbatim from `assets/fb2_remake.fb2`.

Corpus integrity gate (executed): `GD` parses as valid JSON; **exactly 1221 paragraphs**, keys `"1"`–`"1221"`, no gaps, no stray keys. Cyrillic round-trips cleanly under UTF-8.

---

## Headline

**P0 / P1 / P2 defects: 0.** Every previously-tracked concern (`group_1` gold signs, `group_2` passive effects, `group_5` fatal-unlucky dead-ends, `group_7` Vodyanoy paradox, `group_8` infinite-arrow loot, `group_21` free-payment softlocks) is **closed and confirmed in the live data**. The audit produced exactly **one actionable finding (F-1, P3)**, now fixed and verified; all other candidates resolved to confirmed non-bugs after FB2 + harness checks.

---

## Dimension-by-dimension results

### 1 — Reachability & graph integrity ✅
- **0 dangling targets** across all 2156 `choice.target` edges.
- Edge model verified complete: navigation = `choices[].target` + 2 `riddle` objects (`§992`, `§1131`); the 4 `combat_script` paragraphs route to targets already in their `choices`. No hidden numeric goto field.
- BFS from `§1` → **1167 reachable / 54 unreachable**; the 54 are **byte-identical** to `group_29`'s enumerated set (zero diff).
- The brief's "genuine orphan among the 54" concern was tested by attacking `group_29`'s weakest cluster (its 16-entry `unclassified` bucket). Every entry resolves to a real mechanic-entry — chain-dependent on a classified root (e.g. `§1037`←`§1023`, `§1133`←`§661`) or an unmistakable mechanic landing from its own canon text (`§342`/`§875` key-conditional, `§731` password, `§736` copper-key loot, `§713` fish-help, `§1188` Fire-spell cast).
- `group_29`'s falsifiable "zero FB2 reference" claim for `§831`/`§968`/`§1114`/`§1131`/`§106` re-tested → **0 each**, confirmed.

**Verdict:** `group_29` holds under independent re-verification. No genuine orphan.

### 2 — Combat / luck / spell / flee ✅
Traced **and** simulated:
- Player Сила Удара = `2d6 + S.skill + playerMod (+2 FORCE)`; enemy = `2d6 + enemy.skill (−2 WEAKNESS)`. Win → enemy `hp −2`, `wounds++`; loss → player `−enemy.dmg`; tie → none.
- Luck test: `lucky = roll ≤ S.luck`, then `S.luck = max(0, S.luck−1)` (compare uses pre-decrement). Correct.
- Spell budget decrements on every path (`useSpell`): narrative choices + COPY/FORCE/WEAKNESS.
- Flee −2 fires only via the pre-combat choice path (`makeChoiceBtn(..., duringCombat=true)`). Correct.
- `combat_condition:"wound_2"` (`§532`→`§437`) surfaces at `cs.wounds>=2`; verified the only such choice.
- All four scripted combats trace correctly: `§21`/`§368`/`§436` spider (incl. `S.sec436_force` Force round-trip and `only_after_unlucky` FORCE→§526 / WEAKNESS→§448) / `§1175` orcs.
- Enemy stats complete (0 missing skill/stamina).

**Monte-Carlo harness (200k trials/fight, hero Skill 9 / Stamina 20):**

| Fight | Win rate | Avg rounds | Avg stamina lost | Notable |
|---|---|---|---|---|
| §532 Dragon (sk12/st8) | 17.6% | 12.33 | 18.75 | `wound_2` gate reached in **59.2%** of fights |
| §436 Spider unlucky (−1) | 90.9% | 10.91 | 9.70 | |
| §436 Spider FORCE-return (+1) | 99.9% | 7.52 | 3.60 | symmetric with WEAKNESS |
| §436 Spider WEAKNESS | 99.9% | 7.53 | 3.60 | confirms ±2 swing applied identically |
| §1175 Orcs (reinforcement script) | 10.8% | 10.69 | 20.13 | head-on; luck-check + spells are the intended outs |
| §760 Bats ×3 simultaneous | 99.9% | 12.51 | 3.27 | simultaneous attacks model correctly |
| §532 Dragon, strong hero (sk12/st24) | 98.3% | 8.96 | 7.94 | `wound_2` reached 99.8% |

**Findings:** Combat math is sound; no arithmetic diverges from canon. Two design confirmations (not bugs): the §532 `wound_2` escape is genuinely reachable (59.2% mid-build → 99.8% strong), and §1175's low head-on win rate is by design — the canon luck-check (third orc flees) and COPY/FORCE spells exist precisely to handle it. The FORCE-return (+1) and WEAKNESS (−2 enemy) branches land identically (99.9% / 7.5 rounds), confirming the ±2 spell swings are applied as coded.

### 3 — Item lifecycle ✅ (executed)
- **28 distinct `inventory_condition` gating item-names; every one has ≥1 *reachable* grant.** Zero problem gates.
- Gate↔grant name strings match exactly (engine gates via `S.inventory.includes(name)`). Bronze-whistle / copper-key (`Медный ключик`) / silver-bracelet rationalizations all hold.
- Items whose grant sits in an unreachable paragraph (`§600`, `§1045`) always have a parallel reachable grant.
- **7 `consume_on_use`** entries match canonical single-use events.

### 4 — Economy ✅ (executed)
- Start gold **15** (`initState`).
- **`group_1` gold-sign bugs fixed & data-confirmed**: `gold_sub` on `§552`(−1), `§675`(−2), `§686`(−1), `§695`(−4), `§903`(−1), `§937`(−6). Commit `e85b351`.
- `§745` correctly has no `auto_items`; its 10-gold cost is the `§1092→745` choice's `gold_cost` (no double-charge).
- **Softlock scan → only `§630` & `§1092`, no others.** Both **safe**: their sole inbound choices gate *entry* on having the cheapest in-paragraph option (`§88→630` at `gold_condition:2`; `§730→1092` at `gold_condition:3`). Confirms `group_21` Variant A.

### 5 — State persistence & robustness ✅ (executed)
- All **9 `auto_items` keys present in data** are handled by the engine — no silent no-ops.
- **`group_2` passive auto-effects present**: `§25`/`§484`/`§513`/`§927`/`§1147`.
- **All 18 `S.<field>` reads covered** by `initState ∪ normalizeSave`. The four runtime flags (`shopBought`, `riddle_attempts`, `sec436_force`, `eventLog`) are backfilled. v4→v5 upgrade + `s.v` gate intact.

---

## Findings

### F-1 · P3 · `auto_items.luck_add` not capped to `luckMax` — **FIXED (applied, not committed)**

**Problem:** `game_logic.js:507` applied `S.luck += ai.luck_add` with no ceiling, while the siblings `stamina_add` (L503) and `skill_add` (L505) both cap via `Math.min(...Max, ...)`. The five +1-LUCK grants (`§74`, `§220`, `§923`, `§929`, `§1050`) could therefore push current Luck **above Initial Luck**, making later luck tests easier than canon intends.

**Canon ruling (verified against `fb2_remake.fb2`):** This book uses the Fighting-Fantasy-family Luck rule the engine already half-implements — testing Luck rolls 2d6 and decrements Luck by 1 (L1129/L1779), with `luckMax` = "Начальная". The "+1 УДАЧА" events are **partial replenishment of spent Luck, not a way to exceed the starting value**. The clincher is §74's wording: «Прибавьте себе 1 УДАЧУ, **даже если вы ещё ни разу не проверяли её**» — the "even if you've never tested it" idiom is canonical FF phrasing for "add 1 but not above Initial Luck," existing precisely to cover the at-max case. **Therefore: cap at `S.luckMax`.**

**Fix applied:**
```diff
-    if(ai.luck_add){S.luck+=ai.luck_add;statNotifs.push('+ '+ai.luck_add+' удачи');}
+    if(ai.luck_add){S.luck=Math.min(S.luckMax,S.luck+ai.luck_add);statNotifs.push('+ '+ai.luck_add+' удачи');}
```

**Verification (against the live file after applying):**
- Old snippet present: 0 · new snippet present: 1 (exactly one site changed)
- `node --check src/game_logic.js` → exit 0
- Behavioural assertion harness → **7/7 PASS**: below-max grant unchanged (no regression); at-max grant now caps at `luckMax` (was overshooting to 13); one-below-max lands exactly at max; stacked grants stay capped; sibling parity with `stamina_add`.

**Commit status:** **NOT committed.** The change is in the working tree only; `git commit` is reserved for the verification chat (Yuriy).

### Confirmed non-bugs (re-verified this pass)

- **S-1 → non-bug: the four «уйти» combat exits do NOT need a flee penalty.** Read against FB2, `§760→590`, `§788→817`, `§1150→817`, `§1163→697` are all **post-victory** exits, gated in canon behind «Если вы победите их…» / «Если вы его уничтожили…» / «Победить его несложно…». None is a mid-combat flight, so the −2 penalty must not apply. Engine is correct.
- **S-2 → non-bug: no reusable gate is missing `consume_on_use`.** All 12 reusable gating tokens were scanned in FB2 for expend/destroy/lose language. Two flags resolved as reusable on inspection: §725's «сломали дверь» is *door*-breaking on the no-whistle path (the whistle merely opens it via §142, not consumed); the white arrow at §535/§1090/§1196 is **offered or inserted-in-place** to open a door, never lost. Registry adjudication holds.
- **S-3 → safe/optional: `normalizeSave` doesn't coerce core numeric stats** (`skill`/`stamina`/`luck` + maxes). Safe for every real v4/v5 save; only a hand-edit/future-rename hazard. Optional hardening, not a live bug.
- **S-4 → cosmetic: `post_combat` flag inconsistency.** `§1150→690` carries `post_combat:true` but the equivalent post-victory `§760→985` and `§1163→959` do not. No behavioural difference today (those paragraphs have no `luck_type`/`combat_condition` choices to filter against, so the `combatWon` branch renders them identically). Flag-consistency nicety only.
- `group_29` reachability verdict (54 = intentional mechanic-entries).
- `§13` fish-help `acquires:"Помощь рыбки"`→639 wiring.
- `§992`/`§1131` riddle chain (`valid_targets`=success edge, `modifier`=arithmetic base, not a target).
- `group_1` gold-sign conversions (data-confirmed).
- `group_2` passive auto-effects (data-confirmed).
- `group_5` `§203`/`§289`/`§377` fatal-unlucky death-overlay (`§456` correctly left unchanged).
- `group_7` `§642` Vodyanoy (`clear_inventory:true` + `gold_zero:true`, applied before other mutations).
- `group_8` `§570` arrow bundle (fixed-N single entry).
- `group_21` `§630`/`§1092` free-payment gating (entry-gated; safe).
- `§340` peasant shop (15-gold start, `purchase` engine, 9 items).
- **Doc nit:** `group_29`'s `unclassified` bucket mislabels a few entries that are in fact classifiable (`§731` password, `§736` bear-key, `§713` fish-help, `§1188` Fire-spell). Cosmetic registry-labelling only.

---

## Summary count

| Severity | Count | Items |
|---|---|---|
| P0 / P1 / P2 | **0** | — |
| P3 — fixed (applied, not committed) | **1** | F-1 (luck cap) |
| Confirmed non-bugs (re-verified) | **11+** | S-1, S-2, S-3, S-4 + 10 closed groups + the 54-orphan classification |

**Highest-confidence finding:** **F-1** — now resolved. The luck-cap asymmetry at `game_logic.js:507` is fixed to mirror its `stamina_add`/`skill_add` siblings, verified by FB2 canon (§74 idiom), a 7/7 assertion harness, and `node --check` against the live file. Awaiting `git commit` in the verification chat.

---

## Reproducibility

All results regenerate from standalone scripts:
- Reachability + orphan diff vs `group_29` (Python)
- Combat-data wiring + **200k-trial Monte-Carlo harness** (Node)
- Item gate↔grant audit, exact-string matching (Python)
- Economy: gold sources/sinks, shop, softlock scan (Python)
- Persistence: `auto_items`-key handling, `S.<field>` coverage (Python)
- F-1: dry-run diff + 7/7 behavioural assertion + `node --check` (Node)

Canonical text quoted from `assets/fb2_remake.fb2`. Game text, item names, and choice labels kept in original Russian verbatim for substring/regex compatibility with the verification pipeline.

---

## Outstanding item for the verification chat

**F-1 `git commit`.** The one-line fix is applied to `src/game_logic.js` and fully verified, but intentionally uncommitted. Suggested commit message:

```
fix(engine): cap auto_items.luck_add at luckMax (§74/§220/§923/§929/§1050)

luck_add applied S.luck+=N with no ceiling, unlike its already-capped
stamina_add/skill_add siblings. Per FB2 canon (§74 "даже если вы ещё ни
разу не проверяли её" — the FF "add 1 but not above Initial Luck" idiom),
the five +1 LUCK events are partial replenishment, not a way to exceed
Initial Luck. Now: S.luck=Math.min(S.luckMax,S.luck+ai.luck_add).
node --check OK; 7/7 behavioural assertions pass.
```
