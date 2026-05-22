# Session Handoff — Post-Group-6 Roadmap Progress (May 2026)

> **For the original Group-6 chat.** This document summarizes a full working
> session that picked up the POST_GROUP6_ROADMAP and closed several items. All
> work is committed and **pushed to `main`** (GitHub: `YVashchuk/Dungeons-of-the-Black-Castle`).
> HEAD = `8ddbf81`. Nothing is left uncommitted.

---

## TL;DR — what got done this session

| # | Item | Roadmap | Status | Commit |
|---|------|---------|--------|--------|
| 1 | **group_17** — 9 P0 player-cast spell-hook bugs | A.1 | ✅ DONE | `082cdb8` |
| 2 | **group_19** — combat-modal spell engine (FORCE + WEAKNESS in combat) | A.1 | ✅ DONE | `ba13de5` |
| 3 | **Midjourney art prompts bundle** (2 re-gens + 6 new) | A.2 | ✅ READY (awaits MJ) | `8eb3c37` |
| 4 | **Legacy B&W illustration audit** — root cause + 14 regen targets | A.2 | ✅ DONE (awaits MJ) | `d1d2bfc` |
| 5 | **B.3 Save/restore robustness** — `normalizeSave()` | B.3 | ✅ DONE | `8ddbf81` |

All 8 spells are now canonically functional in and out of combat. The save
system is verified robust. Two art audits are complete and waiting only on the
user's Midjourney subscription (lapsed; will regenerate at project end).

---

## 1. group_17 — Spell-hook coverage (commit `082cdb8`)

**Problem investigated:** Gemini's external audit claimed only "30% spell
coverage" and that `applyChoiceConsume`/`useSpell` were absent.

**Reality (after full manual FB2 classification of all 132 spell mentions):**
Gemini was **wrong** — both functions have existed since commit `aeebe69`. The
true picture across the 8 spells (FORCE / FIRE / LEVITATION / ILLUSION /
WEAKNESS / COPY / HEALING / SWIMMING):
- 57 mentions already correctly wired
- **9 fixable P0 bugs** (player-cast choices missing the `spell:"X"` field, so
  the spell count never decremented on click)
- 26 combat-modal cases (deferred → fixed in group_19, item 2)
- ~29 narrative-only mentions (no mechanic needed)
- = 66/132 = **50% real coverage** (not 30%)

**The 9 fixes** (added `spell:"X"` to the choice object so the budget decrements):
- LEVITATION: §93→130, §329→432, §521→326, §705→905, §935→469
- FORCE: §308→1175
- SWIMMING: §596→57, §698→813
- HEALING: §415→84 — also repaired a malformed label
  (`"Использовать Золотой браслет (84)"` → `"Истратить заклятие Исцеления на медвежонка (84)"`)

**Verification:** smoke-test 112→121 scenarios, 90→99 paths, 22 manual unchanged.
Archived: `audit_cycles/spell_economy_may_2026/CLAUDE_MANUAL_CLASSIFICATION.md`.

---

## 2. group_19 — Combat-modal spell engine (commit `ba13de5`)

**What:** Extended the existing COPY-in-combat pattern to FORCE and WEAKNESS,
resolving all 26 combat-modal spell cases deferred from group_17.

**Engine (`src/game_logic.js`, +91 lines):**
- `useForceInCombat()` — +2 СИЛА УДАРА persistent buff for the fight
- `useWeaknessInCombat()` — −2 enemy attack persistent debuff for the fight
- `startCombat` sets up buttons per an allow-list; `combatRound` applies
  `pMod += forceBuff?2:0` and `enemyMod = weaknessDebuff?-2:0`; `endCombat`
  hides the buttons
- New `combatState` fields `forceBuff` / `weaknessDebuff` (one-shot per combat)
- New combat-modal buttons `#btn-force-spell` (💪) and `#btn-weakness-spell` (🫀)

**New data field `sec.combat_spells_allowed`** (optional array): when present,
only the listed spells get buttons in that fight. Wired per canon:
§506 werewolf = `["COPY"]`, §950 arena goblin = `["FORCE"]`; 20 other combats
use the default (all three).

**Note:** FIRE and HEALING are deliberately NOT combat-modal — FIRE is a
narrative pre-combat escape, HEALING is the global non-combat HUD button.

**Verification:** smoke-test 121→126 scenarios, 99→104 paths, 22 manual unchanged.

---

## 3. Midjourney art prompts bundle (commit `8eb3c37`)

**Deliverable:** `audit_cycles/art_prompts_may_2026/MIDJOURNEY_PROMPTS_BUNDLE.md`
- **R1** `art30_two_headed_dragon` (§449) — re-gen to fix the single-headed render
- **R2** `art47_stone_rats` (§1003) — re-gen to fix organic→stone look
- **N1–N6** new generations: art55 vodyanoi taverna (§600), art56 kikimora,
  art57 throne room barlad (§1141), art58 arena combat (§950), art59 treasure
  chamber (§1023), art60 spider riddle chamber (§1131/§992)

Common style suffix + params (cref, `--ar 3:2 --stylize 250 --v 6`) included.
Corrected an outdated memory note: §1 and §311 **already** have arts (art54, art53).
Coverage at time of writing: 107/1221 paragraphs illustrated (8.8%).

**Status:** awaiting the user's Midjourney run.

---

## 4. Legacy B&W illustration audit (commit `d1d2bfc`)

**This directly answers a long-standing puzzle:** why some paragraphs (e.g.
the six-legged beast at §372) still show black-and-white scans from the
original book editions, despite our colour-art coverage work.

**ROOT CAUSE:** the game has **TWO image layers**, and prior coverage analysis
only checked one:
1. `src/mj_art.js` → `MJ_MAP` — preferred colour Midjourney arts (the only
   layer previously audited)
2. `src/illustrations.js` → `ILLUST_DATA` + `ILLUST_MAP` — **legacy 1991/5th-ed
   B&W scan fallback** (never cross-referenced before)

Engine precedence (confirmed in `renderGame`): colour art is tried first; the
B&W scan only renders as a fallback (`if(!illustHtml && ILLUST_MAP…)`). So a
paragraph with only a B&W scan shows black-and-white.

**Coverage findings:**
- 56 paragraphs have a B&W scan
- 31 already superseded by colour art (OK)
- **25 still show black-and-white in-game** = regen targets
- → **14 unique B&W scans** (each was extracted, visually inspected, and
  documented with a ready-to-use regeneration prompt B1–B14)

**Two distinct legacy art origins identified:**
- **"А22"-signed pen-and-ink** (10 scans) — charming, on-theme; likely 5th-ed
- **Victorian-style engravings** (4 scans: §36, §70, §83, §333/§600) — jarring
  stylistic outliers, highest replacement priority

**Deliverable:** `audit_cycles/art_prompts_may_2026/LEGACY_BW_ILLUSTRATION_AUDIT.md`
(full inventory table, root cause, prompts, post-gen wiring instructions — since
MJ_MAP wins, retiring a B&W scan needs only an `mj_art.js` edit, no
`illustrations.js` change).

**Decision deferred to user:** replace all 14, only the 4 engraving outliers, or
keep the "А22" line art as an intentional stylistic choice. The analysis is
complete so this gap will **not** need re-investigation.

---

## 5. B.3 Save/restore robustness (commit `8ddbf81`)

**Goal:** verify the save system survives state fields accumulated across
development (shopBought, riddle_attempts, eventLog, spell budget, group_6
inventory state, group_19 combat buffs) when an **older save** or a
**hand-edited/truncated** file is loaded.

**Analysis result — no bug existed.** Runtime-only fields not in `initState`
(`eventLog`, `shopBought`, `riddle_attempts`) were **already guarded** at every
read site. Combat buffs live on the ephemeral `combatState`, not saved `S`
(combat is intentionally not persisted). The spell budget is `S.spells` from
`initState` and round-trips natively. A five-vintage roundtrip simulation
(v4_legacy → v5_current) confirmed each loads cleanly; foreign formats are
correctly rejected.

**Change made (belt-and-suspenders):** added `normalizeSave(s)` so robustness is
structural rather than dependent on every future read-site remembering a guard.
It backfills core fields (`inventory`, `spells`, `visited`, `notes`, `gold`,
`flask`, `section`) and runtime fields (`eventLog`, `shopBought`,
`riddle_attempts`), is null-safe and type-strict (boolean `gold`→0, array
`shopBought`→`{}`). Wired into **all three** load entry points via one function:
`loadGame()` (covers the title-screen load button AND the deep-link `#<paragraph>`
loader) and `importSave()` (after the v4→v5 migration). A normal save is
returned unchanged in every meaningful field.

**Verification:** five-vintage roundtrip all-pass; six behavioural assertions on
`normalizeSave` all-pass; `bash build.sh` rebuilt dist with the function present;
smoke-test 126 scenarios / 104 paths / 22 manual — **unchanged** (load-logic
change does not touch the navigation graph).

**Deliverable:** `audit_cycles/B3_SAVE_ROBUSTNESS.md`.

---

## Key learnings reinforced this session

- **External audits keep misclassifying the engine.** Gemini wrongly claimed
  `applyChoiceConsume`/`useSpell` were missing and undercounted spell coverage
  (30% vs the real 50%). Always verify against `assets/fb2_remake.fb2` and the
  actual source before acting on an external finding.
- **The game has a hidden second image layer.** `src/illustrations.js`
  (`ILLUST_MAP` B&W fallback) sits beneath `MJ_MAP`. Any future art-coverage
  work must check both layers.
- **Combat is ephemeral by design** — buffs/debuffs are not and should not be
  persisted to the save.
- **`git commit -F` times out *after* succeeding** — always verify with
  `git log --oneline -1` before retrying (never double-commit).

---

## Where the roadmap stands now

**Closed this session:** A.1 (balance re-audit via group_17/19), A.2 (art
coverage via the two bundles), B.3 (save/restore).

**Still open (future sessions / user tasks):**
- **B.1** — manual playtest (user task)
- **B.2** — map nodes
- **B.4** — mobile audit
- **C.1–C.3** — font subsetting / PWA polish / localisation
- **Midjourney regeneration** — execute the two art bundles (R1/R2/N1–N6 +
  B1–B14) once the subscription renews; a future Claude session can take the
  output URLs and handle catalog + MJ_MAP wiring + base64 + build in one pass.

**Full commit range this session:** `082cdb8` → `8ddbf81` (5 commits), all on
`main`, all pushed.
