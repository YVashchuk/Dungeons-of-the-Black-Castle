# PLAYTHROUGH_2026-09-05_auto.md - automated end-to-end runs (tests/smoke/playthrough.js)

Tool: Playwright over the installed Chrome (headless); tester hero via hash entry #1; choice buttons tagged with their targets through a wrapper around the game's own makeChoiceBtn; weighted shortest path (Dijkstra over GD, penalties for combat / luck / dice / riddles, spell edges the hero cannot cast excluded) towards a waypoint list; fights, luck rolls, dice, item offers and healing driven through the UI; localStorage checkpoints with roll-back on death / dead ends.

## Run 1 - 2026-09-04, build 9261c28 (before PT-01)

Outcome: **VICTORY in 71 steps, 0 deaths** along `1 > ... > 42 > 161 > 362 > 603 > 1015 > 1096 (Harpy) > 1164 > 823 (Barlad) > 81 > 1220` - **without ever waking the Princess**. Adjudicated as PT-01 (P0): sec.81 -> 1220 («Если уже удалось разбудить Принцессу») had no gate, and sec.627/976 offered «мертв -> 1220» without a dead Barlad. Fixed in 182943b (story flags princess_awake / barlad_dead, inventory_missing gate).

## Run 2 - 2026-09-04, build 182943b (after PT-01), no boost

Outcome: unfinished. After killing Barlad the player correctly could NOT enter 1220 and explored the study (623/797/411/850/297) - the gate held. The unboosted tester (no LEVITATION) has no spell-free route to the golden orange (sec.74): the shortest route passes sec.596, whose exits are spell-only.

## Run 3 - 2026-09-05, build 238c65f, TESTER_BOOST=1 (every spell at 2 charges - engine validation, not a sporting run), waypoints 74 > 226 > 976 > 1120 > 823 > 81 > 1220

Chunk 1 (120 steps): `1 > ... > 74` (golden_orange taken) `> ... > 226 > 976` - orange consumed, **princess_awake granted**, Barlad alive -> the game offers only «жив -> 1120» (negative gate) `> 1120 > 1044 > 1096` (Harpy defeated) `> 1164 > 823`.
Chunk 2 (22 steps, resumed from the saved state): heal at 823, Barlad defeated `> 81` (**barlad_dead granted**, sec.81 -> 1220 offered because princess_awake is present) `> 1220` - **VICTORY, 0 deaths**.

Both story flags were observed in the hero's inventory state at the expected paragraphs; the negative gate at sec.976 and the positive gate at sec.81 behaved per canon. Screenshots: tests/smoke/out (local).
