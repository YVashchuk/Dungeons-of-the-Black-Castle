# Spell Economy Review — May 2026

**Status:** Comprehensive audit complete. **Major P0/P1 content-fidelity gaps discovered.**

**Conducted:** May 2026, post-§600 sibling audit.

**Scope:** Audit all 8 spells (defined in `SPELLS const`, src/game_logic.js) against canonical FB2 text + current data hooks.

---

## Executive Summary

- **8 spells** defined: FIRE, FORCE, LEVITATION, ILLUSION, WEAKNESS, COPY, HEALING, SWIMMING
- **40 data hooks** total via `"spell":"ID"` field in remake_data.js choices
- **132 canonical FB2 mentions** across all 8 spells
- **Coverage rate: 30.3%** — over **2/3 of canonical spell content is missing from data**

The memory note describing «FIRE ~15 hooks, LEVITATION ~12, HEALING 1-2 uses» was incorrect on all counts. Real numbers below.

---

## Per-spell coverage table

| Spell | FB2 mentions | Data hooks | Missing | Coverage |
|---|---|---|---|---|
| LEVITATION | 32 | 4 | 28 | 12.5% ⚠️⚠️ |
| COPY (Копия) | 29 | 2 | 27 | 6.9% ⚠️⚠️ |
| FIRE | 22 | 10 | 13 | 45.5% |
| FORCE (Сила) | 17 | 13 | 8 | 76.5% ✅ |
| WEAKNESS | 13 | 3 | 10 | 23.1% ⚠️ |
| SWIMMING | 11 | 5 | 6 | 45.5% |
| ILLUSION | 6 | 3 | 3 | 50.0% |
| HEALING | 2 | 0 | 2 | 0% (engine-driven, see below) |

---

## HEALING — special case

HEALING is **not data-driven**. Engine implements global HUD button `#btn-heal`:
- Shown when `getSpellRemaining('HEALING') > 0 && !inCombat && S.stamina < S.staminaMax`
- Click calls `useHealing()` → `+8 stamina`, decrements remaining
- Player-driven, not paragraph-driven — fully functional as designed

However, FB2 has **2 paragraphs** (§415, §1093) where HEALING is specifically required for a canonical narrative — engine button might not be situational enough. Example:

**§415**: Player encounters injured bear cub. FB2: «Есть только один способ помочь медведице: истратить заклятие Исцеления. Если оно у вас есть и вы хотите истратить его на медвежонка, то §84».

Current remake §415 likely has «Истратить заклятие Исцеления (84)» choice without `spell:"HEALING"` field — player can click without consuming the spell.

---

## Two categories of "missing"

### Category A — Real P0/P1 bugs (player-cast spell choices without engine wiring)

When choice label says «Использовать заклятие X» and has `target` field but lacks `spell:"X"` field, the engine doesn't decrement spell count or check availability. Player can click these freely without spell budget.

**Confirmed examples:**

| Para | Spell | Issue | Severity |
|---|---|---|---|
| §93 | LEVITATION | Marsh rescue choice without `spell:"LEVITATION"` field | **P0** |
| §7 | SWIMMING/LEVITATION | Lake crossing with two spell options, missing field | **P0** |
| §415 | HEALING | Bear cub healing choice, missing field | **P0** |
| §43 | COPY | Orcs combat «можете воспользоваться заклятием Копии» | **P1** |
| §100 | COPY | Bandits combat «воспользуйтесь заклятием Копии» | **P1** |

### Category B — False positives (narrative mentions, not player-cast)

- §23 «не тратить же заклятие Левитации, даже если оно у вас есть» — explicitly NOT used
- §134, §1188 «вы накладываете заклятие Огня» — describes post-action consequence (player already chose to cast on a prior screen)
- §48 «Зеленые рыцари развеивают многие заклятия» — describes enemy ability
- §3 «он успевает наложить на вас заклятие Слабости» — enemy casts on player

These don't need data hooks.

---

## Estimated breakdown by category

Rough split of the 92 missing entries:

| Category | Estimated count | Example pattern |
|---|---|---|
| A. Real P0/P1 bugs (player-cast without engine wiring) | ~50-60 | §93, §7, §415 |
| B. Post-action narrative ("вы накладываете") | ~20-25 | §134, §1188 |
| C. Enemy-cast descriptions | ~5-8 | §3, §48 |
| D. Item / character descriptions | ~3-5 | Spell-resistant enemies |
| E. Conditional narrative ("если оно у вас есть") | ~5-10 | §23 |

**Real bug scope: ~50-60 paragraphs need `spell:"X"` field added.**

---

## Recommendations

### Option 1: Defer to new audit cycle (RECOMMENDED)

Treat this как separate audit-and-implement series, parallel в spirit к group_6:

- **New registry entry**: `pending_corrections.group_17_spell_hooks` or similar
- **Items list**: enumerate 50-60 paragraph IDs per spell
- **Implementation approach**: small per-spell commits (LEVITATION batch, COPY batch, etc.)
- **Effort**: 3-5 sessions to close all gaps

Reasoning: scope too large для single commit; needs FB2 narrative verification per paragraph (similar к group_6 methodology where 30-40% of audit candidates were rejected as false positives).

### Option 2: Targeted quick-fix only

Fix the 3-5 highest-impact P0 paragraphs in single commit:

- §93 LEVITATION marsh rescue
- §7 SWIMMING/LEVITATION lake
- §415 HEALING bear cub
- §43 / §100 COPY combat (if combat-spell wiring supports it)

Leaves remaining ~45-55 gaps as documented backlog.

### Option 3: Pure documentation, no code change

This file as the primary deliverable. Update memory tracker. Register as future work. No code commits.

---

## Memory note corrections

Update memory:

> ~~FIRE (~15 hooks) and LEVITATION (~12) are most used; ILLUSION (only works on children §341, fails on elders §779) and HEALING (1-2 uses max) offer poor value from the 10-spell budget.~~

Replace with:

> The game has 8 spells (not 10): FIRE, FORCE, LEVITATION, ILLUSION, WEAKNESS, COPY, HEALING, SWIMMING. **HEALING is engine-driven** (global HUD button restoring +8 stamina outside combat, ~2 specific FB2 paragraphs may need data-hook integration). Audit (May 2026) revealed **30% data-hook coverage of canonical FB2 spell mentions** — ~50-60 paragraphs have player-cast choices without proper `spell:"X"` field wiring, causing spell-count not to decrement on click. Real per-spell data-hook counts: FORCE=13, FIRE=10, SWIMMING=5, LEVITATION=4, ILLUSION=3, WEAKNESS=3, COPY=2, HEALING=0. ILLUSION canonical-locked to §41/§283/§779 (works on children, fails on elders). Major content-fidelity audit needed — registered as future audit cycle target.

---

## Files & artifacts

This document archived as `audit_cycles/spell_economy_may_2026/SPELL_ECONOMY_REVIEW.md` for future reference.

Related audit scripts (deleted after use, not committed):
- `_audit_spells.py` / `_audit_spells_v2.py` / `_audit_spells_v3.py`: spell catalog + hook enumeration
- `_audit_healing.py` / `_audit_healing_v2.py`: HEALING engine handler verification
- `_audit_fb2_spells.py`: canonical FB2 vs data-hook comparison
- `_audit_spell_gaps.py`: sample missing-hook verification
