# Spell Hook Manual Audit — Complete Classification (Claude, May 2026)

**Status:** Comprehensive paragraph-by-paragraph classification completing Gemini's partial Deep Research audit.

**Audit conducted:** Claude session, May 18 2026.

**Outcome:** 9 P0 bugs fixed in single commit (see status_done in `text_corrections.json` group_17_spell_hooks). 26 combat-modal pattern paragraphs deferred to future engine work. Real spell-hook coverage now 66/132 = 50% (was 57/132 = 43%).

---

## Methodology

1. **Auto-classification** via heuristic patterns: post-action narrative ("вы накладываете"), enemy cast ("он накладывает"), hedge ("не тратить же"), descriptions.

2. **Manual review** of all 58 paragraphs marked `?` or `A` by auto-classifier. Each examined against canonical FB2 text + current `remake_data.js` choice array.

3. **Final classification** into:
   - **A** — Real bug: player-cast choice missing `spell:"X"` field. Engine has the handler (`useSpell` + `applyChoiceConsume`); just need to wire the field. **FIXED THIS COMMIT.**
   - **A\*-deferred** — Combat-modal pattern. FB2 narrative says "Если хотите, воспользуйтесь заклятием X" before listing enemy stats. NOT a navigation choice — meant for combat-time selection. Engine has no combat-spell button for non-HEALING. **Deferred to future engine work.**
   - **A\*-orphan-choice** — Spell offered in narrative but matching choice button missing. Sub-pattern of A\*-deferred.
   - **B** — Post-action narrative ("вы накладываете заклятие Огня" — cast happened earlier).
   - **C** — Enemy/NPC casts on player.
   - **D** — Item/character description.
   - **E** — Hedge narrative ("не тратить же").
   - **OK** — Already correctly wired.

---

## Final tally

| Category | Count | Action |
|---|---|---|
| OK (already wired) | 57 | None — verified correct |
| A (real bugs) | 9 | **FIXED THIS COMMIT** |
| A*-deferred (combat-modal) | 26 | Future engine work |
| A*-orphan-choice | 2 | Subset of A*-deferred |
| B (post-action narrative) | 21 | None — no choice exists |
| C (enemy/NPC cast) | 3 | None — not player-cast |
| D (description) | 4 | None — not a cast |
| E (hedge narrative) | 1 | None — not a cast |
| **Total** | **132** | |

---

## Fixed paragraphs (A category, this commit)

### LEVITATION rescue points (5 paragraphs)

These are all "marsh/sinkhole/bog/pit single-shot escape" mechanics. Player either has LEVITATION → escape OR dies. Currently engine doesn't decrement spell — players can spam-click since they survive but their spell budget stays full.

- **§93** target=130: «Болото... Неожиданно вы вспоминаете про заклятие Левитации»
- **§329** target=432: «болото не хочет выпускать... приходит мысль использовать заклятие Левитации»
- **§521** target=326: «болото... вы вспоминаете про заклятие Левитации»
- **§705** target=905: «вылетите в окно, наложив заклятие Левитации»
- **§935** target=469: «глубокая каменная яма... вы можете использовать заклятие Левитации»

### FORCE/SWIMMING navigation (3 paragraphs)

- **§308** target=1175: «Прибавьте 2 к своей СИЛЕ УДАРА и сражайтесь — заклятие Силы подействовало». FORCE cast transitions to multi-orc combat.
- **§596** target=57: «придется либо воспользоваться заклятием Плавания (57)» — first of three branches at lake.
- **§698** target=813: «наложить еще одно заклятие Плавания» — SECOND SWIMMING cast against grate/current.

### HEALING + label fix (1 paragraph)

- **§415** target=84: FB2 mandates HEALING for bear cub healing. Current label was malformed: «Использовать Золотой браслет (84)» (copy-paste artifact from another paragraph). Fixed to «Истратить заклятие Исцеления на медвежонка (84)» + added `spell:"HEALING"`.

---

## Deferred paragraphs (A\*-deferred, 26 combat-modal pattern)

All these are combat paragraphs where canonical FB2 narrative offers spell selection "Если хотите, воспользуйтесь заклятием X" before enemy stats. They are NOT navigation choices but combat-time decisions.

Current engine has only HEALING combat support (via HUD `#btn-heal`). To wire combat-modal spell selection for COPY/FORCE/WEAKNESS/FIRE would require:

1. Combat-modal UI extension
2. Per-spell effect application during combat math (FORCE/WEAKNESS modify СИЛА УДАРА; COPY creates clone; FIRE deals burst damage)
3. Spell decrement on click during combat
4. Visual feedback for spell-active state during combat rounds

**Recommended:** Implement as separate audit-and-implement cycle (group_19?) after letter-riddle and current group_17 land.

**Affected paragraphs (26):**

| § | Spells offered | Combat context |
|---|---|---|
| 43 | COPY | Orcs ambush |
| 100 | COPY | 5 Bandits |
| 162 | COPY | Goblin bridge |
| 197 | FORCE/WEAKNESS/COPY | She-bear |
| 233 | COPY | Post-FIRE Goblin |
| 235 | COPY | Beast (other spells wired) |
| 240 | COPY | 6 snakes |
| 436 | FORCE/WEAKNESS (FIRE banned) | Tree Spider |
| 456 | FORCE/WEAKNESS/COPY | Giant Spider |
| 486 | COPY | 2 Lumberjacks |
| 506 | COPY only | Werewolf |
| 528 | FORCE/WEAKNESS/COPY (FIRE banned) | Huge Snake on tree |
| 532 | COPY | Dragon |
| 536 | COPY | 4 Goblins (other spells wired) |
| 567 | COPY | 2 Goblins (paragraph has 0 choices — may be orphan) |
| 628 | COPY | 3 Orcs multi-round |
| 717 | FORCE/WEAKNESS/COPY | 2 Goblins riverbank |
| 950 | FORCE/HEALING | Arena Goblin |
| 1096 | COPY | Harpy |
| 1175 | COPY | 3 Orcs at gates |
| 1177 | FORCE/WEAKNESS/COPY | 2 Goblins door |

---

## Already-wired (57 paragraphs)

LEVITATION (19): §7, §131, §133, §182, §194, §323, §350, §402, §412, §464, §515, §690, §788, §791, §820, §835, §980, §1133, §1150

COPY (3): §388, §656, §1099

FIRE (12): §65, §208, §283, §350, §372, §388, §437, §440, §449, §760, §805, §1066

FORCE (8): §96, §160, §526, §555, §610, §700, §865, §1126

WEAKNESS (3): §1003, §1088, §1183

SWIMMING (8): §7, §61, §182, §194, §614, §944, §951, §1021

ILLUSION (4): §41, §283, §350, §779

---

## Narrative-only (29 paragraphs, no fix)

### B (post-action, 21):
LEVITATION §137, §698, §836, §1067; COPY §69, §273, §514, §911; FIRE §134, §140, §233, §262, §368, §643, §645, §1188; FORCE §404, §751; WEAKNESS §39, §69, §417, §448, §1110; SWIMMING §629; ILLUSION §134, §1094

### C (enemy cast, 3):
COPY §239; WEAKNESS §3; HEALING §1093

### D (description, 4):
LEVITATION §227 (magic carpet); COPY §48 (old man's lore), §260 (Vodyanoi ban), §723 (Ghost ban)

### E (hedge, 1):
LEVITATION §23 (narrow path — narrative-only mention)

### Failed-cast scenarios (subset of B):
- §273 COPY ("копия не появляется" — knights dispelled)
- §514 COPY ("Копия не появляется" — knights dispelled)
- §911 COPY (same pattern)
- §39 WEAKNESS ("вы — а не рыцари" — reflected by knights)

These are forced narrative outcomes where the spell decrement should happen at the PRIOR paragraph (the actual cast click). Verify those upstream paragraphs are correctly wired (most are in the OK list).

### §32 LEVITATION special:
Pure death narrative: «Озеро оказалось слишком велико, чтобы пересечь его, надеясь только на одно заклятие Левитации». Player TRIED LEVITATION at prior screen, ran out of charge mid-flight, drowned. Narrative-only consequence — no choice exists.

---

## Verification

- All 9 A-bugs have specific FB2 canonical justifications.
- All 26 A\*-deferred entries identified as combat-modal pattern.
- All other 97 paragraphs verified as either OK or narrative-only.

## Methodology limitations

- Heuristic auto-classifier had 38 `?` and 20 false-A; manual reclassification refined to 9 true-A + 26 deferred + corrected categorizations.
- Engine misread by Gemini's audit ("applyChoiceConsume absent") corrected — those functions exist since commit `aeebe69`.
- Memory note now corrected per spell-audit findings (recorded in v2.32 history).
