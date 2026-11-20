# tests/smoke - automated live smoke (not part of the battery)

`smoke_run.js` drives the BUILT game in the locally installed Google Chrome (headless, via `playwright-core`, no browser download) and executes 33 checks for real (rows of `MANUAL_SMOKE_CHECKS.md` plus the automation-only S-TITLE, S-EAT and - after the Gemini 4 Carbon tracks, group_110 - S-POWERS-PHONE, S-PICKER-PHONE, S-FLEE-PHONE, S-PICKUP-F5, S-DOOR70: the item powers, the spell picker and the flee button on a phone, the pick-up dialog across F5, the secret door only at §70; group_111 - S-MAP-CLOSE-PHONE, and S-PICKUP-F5 by real taps with «Готово» untaken): hash entries, real button clicks, F5 reloads, keyboard (Tab / Enter / Esc / M incl. a Cyrillic-layout keydown), phone viewport 412x915 with bottom sheets, landscape 915x412, fonts, the reading column, dice / luck / purchase persistence. It is grey-box: assertions go through the DOM and the game globals (`S`, `combatState`).

## Run

```powershell
# 1. build
bash build.sh
# 2. serve the repository root (any static server)
python -m http.server 8001
# 3. once: playwright-core next to the script (needs network; Chrome must be installed)
cd tests\smoke; npm init -y; npm i playwright-core; cd ..\..
# 4. run (default URL http://localhost:8001/dist/dungeons-of-the-black-castle.html)
node tests\smoke\smoke_run.js [url]
```

Output: `tests/smoke/out/SMOKE_REPORT.md` (table `id | verdict | observation`, counts, page/console errors) and one PNG per check. `UNCLEAR` on `C18-131` / `C4` means the Copy lost its dice fight every attempt - rerun. Record the run in the journal of `MANUAL_SMOKE_CHECKS.md`; rows not covered here (A1, A3-A17, B1, B4, C5-C9 in part) remain eye checks.

## playthrough.js - automated end-to-end run

```powershell
# from the repository root, server as above
$env:TESTER_BOOST='1'; $env:MAX_STEPS='120'; node tests\smoke\playthrough.js        # chunk 1
$env:RESUME='1';        node tests\smoke\playthrough.js                                # next chunks (state in tests/smoke/out/play-save.json)
```

`WAYPOINTS` (default `74,226,976,1120,823,81,1220` - golden orange, wake the Princess, Barlad alive, Barlad, victory) and `MAX_STEPS` are environment variables. `TESTER_BOOST=1` gives the tester every spell at 2 charges: this validates the engine's gates, it is not a sporting playthrough (the unboosted tester cannot reach sec.74 - its shortest route needs Levitation at sec.596). Output: `tests/smoke/out/PLAYTHROUGH_REPORT.md` (route, stats, log) and screenshots every 25 steps. Keep chunks under ~2 minutes when driven through an MCP tool.

## gate_probes.js - live probes of the story-state gates (groups 83/85)

```powershell
node tests\smoke\gate_probes.js [url]
```

28 deterministic probes of the checkpoints G-01..G-14 (G-15, reload behaviour, is reported as EXTERNAL and covered by `smoke_run.js`) of `BRIEF_playthrough_astra_agent.md`: the tester hero is prepared through `S` (flags, items, origin, spell charges), the paragraph is re-rendered, and the rendered UI is observed (enabled choice buttons by target, bag text / buttons, death overlay). Output: `tests/smoke/out/GATE_PROBES_REPORT.md` + one PNG per probe. Run after any change to gates, flags or `passesInventoryCheck`.

## branch_probes.js - deterministic probes of the dice / deadline branches

```powershell
node tests\smoke\branch_probes.js [url]
```

Seven probes of the branches that a live run reaches only by luck: overtime of #43 (-> 1016, a death ending), #261 (-> 8) and #737 (-> 182 with the wounded goblin carried over and the big goblin waiting), the door of #725 (a double -> 1215, death when the last stamina point is spent, the Golden Whistle gate -> 142) and the first collection at #582 with a full bag (nothing taken, «✓ Собрано» survives a reload). The tester hero is prepared through `S` and `d6()` is replaced by a scripted sequence; every result is read after real clicks. Output: `tests/smoke/out/BRANCH_PROBES_REPORT.md` + one PNG per probe.

## fidelity_probes.js - the repairs of groups 100-109 (text vs engine, engine reliability, live-run and audit findings)

```powershell
node tests\smoke\fidelity_probes.js [url]          # all probes; exit code 1 if any fails
$env:ONLY="crossbow"; node tests\smoke\fidelity_probes.js   # only probes whose id contains the text
```

Skull traps (death without a skull, survival and loss with one, the skull taken at #252 and offered at #1116), the crossbow (a shot kills and spends one arrow, the bag shows what is left, no button against Barlad, an arrow passes through a ghost unspent), the mirror fight at #239, spells forgotten at #648, the flask filled at #427 and emptied at #385, the spy's gates at #454, food for the fugitives at #597, the retired river teleport at #1205 and the plaque spent at #1078, the old man's secret at #76 and the hidden door in the wall of #70 (not at the gates #56 / #205 - the author's decision, group_109), the green gas that silvers the bronze jug at #957, the single-use silver vessel at #608, the whistle offered only after the fight at #129, and the Chief of the Guard won without a Copy charge at #1099. Later blocks: the engine repairs of group_101 (`engine-*`), the live-run findings of groups 102-104 (hash navigation; the combat modal and luck checks follow a language switch on screen - `*-ASTRA02`, `*-ASTRA04`) and the audit of 2026-11-17 (group_105, `*-GAME0N`: dead ends end the adventure, entries that need a spell or an item, the optional luck check at #1141, rewards only after the win, the toll at #686, the death text after a failed roll, the arena healing button, the pick-up dialog covering the menu) and its recheck (group_106, `*-ASTRA05`: either watermelon opens the pass at #730 / #90, and the orcs eat one); the Gemini 4 Carbon fidelity sweep (group_107, `*-C1NNN`: the book's arithmetic, the copper ring, the black pearl, the carpet and the diving suit, the children's secret, stakes before the roll, the luck window's rescue, the batch pick-up) and its engine audit (group_108, `*-C2NNN`: the restart with blocked storage, an imported save forgets the fight won and cannot smuggle markup, a typed #146 keeps both gates, eaten food closes its gate, no way from before the fight after the win, the pick-up dialog and the trophies survive a reload, no healing or Indifference for the dead, the batch's eat button, the orcs of #1175, the preface back button in English, the hyena riddle in English, the forest dragon off the castle map and the victory markers) and its translation sweep (group_109, `*-C3NNN`: the spider's answers typed with their articles, as §28 teaches them). Output: `tests/smoke/out/FIDELITY_PROBES_REPORT.md`. Every script in this folder exits with code 1 when a check fails (`playthrough.js`: 2 when a chunk ends before the victory), so a CI runner can rely on the exit status.
