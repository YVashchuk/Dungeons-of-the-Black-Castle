# ChatGPT — session report (June 2026 external review, normal mode)
Raw reply archived for the record. ChatGPT read the sources, computed Copy-style win probabilities, and re-derived reachability/obtainability. Its standout contribution is a real combat-flow bug (post_combat) verified against canon. See ADJUDICATION.md for verdicts.

---

## Findings it raised
1. **P1 — summon not saved immediately (save/reload reuse).** ADJUDICATION: **REFUTED.** `S.summonsUsed.push` happens BEFORE the §1175 early-return, and `exportSave()` calls `saveGame()` first, so a reload cannot restore an "unused" summon. Claude traced the same paths and agrees. (An extra `saveGame()` would be harmless belt-and-suspenders, but there is no bug.)
2. **P2 — when holding BOTH summon items, the UI only exposes the bell (first in COMBAT_ALLIES); the amulet is shadowed.** ADJUDICATION: **VALID, minor.** `startCombat()` picks the first available ally and stops. In practice the only place both could be held AND usable is OUTSIDE the castle (amulet's scope); inside, only the bell is offered anyway. Low impact (the player still gets a summon; just not the choice of which). Deferred as a small UX polish, NOT shipped in this cycle — would need a one-button-per-ally render or a picker.
3. **#3 — §388 post-victory exits visible before combat + §94 label wrong.** ADJUDICATION: **VALID and broader than §388.** Confirmed real bug; see ADJUDICATION.md "post_combat sweep" — affects §129, §177, §182, §388, §628, §1050 (post-victory continuations lack `post_combat:true`, so they render as clickable bypasses during the fight), plus §388→94 is mislabelled «бумаги на столе» when §94 is the шкаф (statuette). Queued as its own batch (group_62) pending Yuriy's go.

## No-issue verifications it provided (all CONFIRMED by us)
- Summon side-fight math faithful to Copy; multi-enemy one-target behaviour correct; §1175 mirrored.
- CASTLE_SECTIONS targeted review: no wrong inclusion/omission found.
- Balance: bell erases guard-tier fights but not Барлад (≈1.1%) or the captain gauntlet — matches a one-shot reward.
- group_57 restorations correct; no new §854-like dead-end; Флакончик single-grant/single-use; groups 58/59 zero orphan gates (re-derived); §340 economy fine; group_60 §562 + §339↔425 correct.
