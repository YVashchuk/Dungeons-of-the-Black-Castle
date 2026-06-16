# ADJUDICATION — June 2026 external review (Gemini / ChatGPT / Claude)
**Date:** 2026-06-12 · HEAD at review: 5277665 · registry v2.89. Every external claim funneled through FB2 canon (+ 1991 original) + the engine. Reports archived as 10/11/12_*.md.

## Verdict at a glance
- **Confirmed our work is correct:** groups 57, 58, 59, 60, 61 all stand. Reachability 1205/1221 independently reproduced by Claude AND ChatGPT. The summon side-fight, the CASTLE_SECTIONS set, the obtainability closure, and the §562/§339-425 calls were all validated.
- **One genuine NEW bug found (ChatGPT, valid, broader than reported):** post-victory exits not flagged `post_combat:true` on **6 combat paragraphs** → they render as clickable combat-bypasses. Plus a label error at §388→94. **Queued as group_62, pending Yuriy's go.** NOT part of the summon feature.
- **One minor UX item (ChatGPT P2):** if the player holds BOTH summon items outside the castle, only the bell is offered (first in COMBAT_ALLIES). Low impact; deferred as optional polish.
- **Refuted:** ChatGPT P1 (save/reload summon reuse) — Claude + our trace show `summonsUsed` is written before any early-return and `exportSave()` saves first. Gemini's entire Task-1 "problem found" set — it inferred castle-membership from art-mapping (hit its context limit) and every item is forest/non-combat per canon.
- **Doc nit (Claude, valid):** `acquires` is a SIXTH grant mechanism; 00_BRIEF said "five". Code was always correct (group_59's harness already used `acquires`); only the brief wording was incomplete. Recorded so future scans include it.

---

## GENUINE BUG → group_62 (post_combat flags) — awaiting Yuriy
The engine (`renderChoices`, `hasPendingCombat` branch) shows the «⚔ Вступить в бой» button PLUS every choice lacking `post_combat`/`luck_type`/`combat_condition`. So a post-victory continuation with no `post_combat` flag renders as a clickable button DURING the pending fight — the player can click it and skip combat (and still get the loot/continuation the canon gates behind victory).

Verified affected paragraphs (canon prose gates each behind «Если вы убили/победили/перебили»):
- **§129** → 568 (kill the bridge Гоблин; loot bronze whistle). Single exit, unflagged.
- **§177** → 181 (defeat Лев + Львица). Single exit, unflagged.
- **§182** → 841/904/1004/589 (kill both Гоблины, THEN choose how to cross the river). Four exits, all should be post_combat.
- **§388** → 94/1098/1196 (perbili the Green Knights, THEN search the room/leave). The pre-combat options (§26 Оберег, §739 сосуд, §450 fire, §911 copy) correctly stay visible; only 94/1098/1196 need post_combat.
- **§628** → 1054 (survive the 3 orcs, enter the gate). Single exit, unflagged. [in CASTLE_SECTIONS]
- **§1050** → 383 (defeat the Тролль, take the ring, leave). Single exit, unflagged. [in CASTLE_SECTIONS]

PLUS a **label bug at §388**: choice →94 is labelled «Осмотреть бумаги на столе (94)» but §94 is the **шкаф** (a black-crystal winged-horse statuette). §94's label should read шкаф/статуэтка. (→1098 «К бумагам на столе» is correct — §1098 IS the papers.)

**Proposed fix (group_62, data-only):** add `post_combat:true` to those exits (4 paragraphs single-exit: §129/§177/§628/§1050; §182 four exits; §388 three room-exits), and fix the §388→94 label. Then harness: assert those choices are hidden during `hasPendingCombat` and shown after `combatDone`. Reachability unchanged. Needs a `post_combat` sweep across ALL combat paragraphs to be sure these 6 are the complete set (the heuristic caught cond-win prose; a full read confirms).

## DEFERRED — ChatGPT P2 (summon picker)
Outside the castle a player could hold both the bell and the amulet; `startCombat()` offers only the first available (the bell). Canon gives each its own once-per-journey use, so ideally the player chooses. Low impact (a summon is still offered). Optional: render one button per available ally, or a small picker. Not scheduled.

## DEFERRED — art (Gemini Task 3, valid)
`art25_cover_hero_castle` and `art29_beautiful_hostess` are catalogued but mapped to no paragraph. Bind art29 to a hostess scene (§602/§866) and use art25 as cover/panorama when Midjourney renews. Added to the art backlog.

## NO-CHANGE confirmations (recorded, all three reports agree with us)
group_57 (3 edges correct; no new dead-end), group_58 (Флакончик single-grant/use), group_59 (zero orphan gates; re-derived independently), group_60 (§562 + §339↔425), group_61 (summon math, guards, scope, §1175, balance). §854 unconditional skull branch is intentional (mirrors §842/§859/§913). Reachability 1205/1221, 0 dangling.
