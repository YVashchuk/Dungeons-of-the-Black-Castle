# tests/ — verification battery

Portable, version-controlled battery for the remake. Everything resolves paths
relative to the repo, so it works from any clone location.

## Run
    cd tests && npm install     # once (acorn for the AST-based harnesses)
    node tests/run_all.js       # 16 harnesses + reachability baseline (expect ALL GREEN, 1205 reachable)

Dist spot-checks (run after `bash build.sh` when relevant): `node tests/_dist_*.js`.

## Layout
- `*_harness.js` — 16 active harnesses (i18n phases, items, signet, engine hygiene, riddle i18n, ...)
- `goldens/` — golden fixtures/manifests the harnesses compare against
- `regen_fixtures.js` — rebuilds the 6b/6d/6e1/6e2 goldens from current sources (use ONLY after
  an intentional change to the guarded values; other goldens are maintained by hand per increment)
- `verify_reach3.py` — BFS reachability baseline (1205/1221, 16 documented islands)
- `run_all.js` — runner

## Do not delete
Goldens are load-bearing: removing them breaks the battery (see registry group_73 for the
2026-07-09 incident). `node_modules/` is git-ignored; `package.json` pins the only dependency.
