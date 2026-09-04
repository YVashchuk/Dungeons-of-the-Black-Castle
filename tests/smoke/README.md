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
# 4. run (default URL http://localhost:8001/dist/podzemelye-chyornogo-zamka-remake.html)
node tests\smoke\smoke_run.js [url]
```

Output: `tests/smoke/out/SMOKE_REPORT.md` (table `id | verdict | observation`, counts, page/console errors) and one PNG per check. `UNCLEAR` on `C18-131` / `C4` means the Copy lost its dice fight every attempt - rerun. Record the run in the journal of `MANUAL_SMOKE_CHECKS.md`; rows not covered here (A1, A3-A17, B1, B4, C5-C9 in part) remain eye checks.
