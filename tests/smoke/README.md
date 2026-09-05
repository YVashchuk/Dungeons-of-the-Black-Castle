# tests/smoke - automated live smoke (not part of the battery)

`smoke_run.js` drives the BUILT game in the locally installed Google Chrome (headless, via `playwright-core`, no browser download) and executes 24 of the `MANUAL_SMOKE_CHECKS.md` rows for real: hash entries, real button clicks, F5 reloads, keyboard (Tab / Enter / Esc / M incl. a Cyrillic-layout keydown), phone viewport 412x915 with bottom sheets, landscape 915x412, fonts, the reading column, dice / luck / purchase persistence. It is grey-box: assertions go through the DOM and the game globals (`S`, `combatState`).

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

29 deterministic probes of the checkpoints G-01..G-15 of `BRIEF_playthrough_astra_agent.md`: the tester hero is prepared through `S` (flags, items, origin, spell charges), the paragraph is re-rendered, and the rendered UI is observed (enabled choice buttons by target, bag text / buttons, death overlay). Output: `tests/smoke/out/GATE_PROBES_REPORT.md` + one PNG per probe. Run after any change to gates, flags or `passesInventoryCheck`.
