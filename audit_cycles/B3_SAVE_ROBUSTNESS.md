# B.3 — Save / Restore Robustness Audit (May 2026)

**Roadmap item:** POST_GROUP6_ROADMAP § B.3
**Status:** ✅ COMPLETE — analysis done, defensive normalization added, verified.

---

## Goal

Verify that the save/restore system survives the many state fields added across
the project's development — `S.shopBought` (shop §340), `S.riddle_attempts`
(group_18 letter-riddles), `S.eventLog` (event journal), combat spell buffs
(group_19), the spell budget, and group_6 post-acquisition inventory state —
when an **older save** (created before a given field existed) is loaded, and
when a **hand-edited or truncated** save file is imported.

---

## Method

1. Read the full save/load region of `src/game_logic.js` (initState, saveGame,
   loadGame, exportSave, importSave, plus the two `loadGame()` consumers:
   the title-screen "Загрузить" button and the deep-link `#<paragraph>` loader).
2. Statically enumerated every `S.<field>` reference and classified it as a
   write (creates the field) or a read (could see `undefined` on an old save).
3. Identified the **runtime-only fields** — written somewhere but NOT part of
   `initState()`, so old saves lack them: `eventLog`, `shopBought`,
   `riddle_attempts`. (`amb_dungeon` was a false positive — it is
   `SOUND_PATHS.amb_dungeon`, not `S.amb_dungeon`.)
4. Verified every read site of those fields for a defensive guard.
5. Simulated import/load roundtrips for five realistic save "vintages".

## Findings

**Combat spell buffs do NOT touch `S`.** `forceBuff` / `weaknessDebuff`
(group_19) live on the ephemeral `combatState`, not on the saved `S`. Combat is
intentionally not persisted, so there is nothing to migrate — correct by design.

**The spell budget is already in `initState`** as `S.spells` (array of
`{id, remaining}`), so it round-trips natively.

**All runtime-only fields were already individually guarded** at every read
site:

| Field | Guard |
|---|---|
| `eventLog` | `if(!S.eventLog)S.eventLog=[]` in `logEvent`; early-return `if(!list\|\|!S\|\|!S.eventLog)return` in `renderEventLog` |
| `shopBought` | `if(!S.shopBought)S.shopBought={}` before every read in the shop-purchase logic |
| `riddle_attempts` | `S.riddle_attempts=(S.riddle_attempts\|\|0)+1` assigns before the subsequent read; `S.riddle_attempts\|\|0` elsewhere |

The five-vintage roundtrip simulation (`v4_legacy`, `v5_earliest`, `v5_mid`,
`v5_with_shop`, `v5_current`) confirmed each loads cleanly — old saves
self-heal via the guards, and a foreign format is correctly rejected with
"Несовместимый формат".

**Conclusion: the system was already crash-safe.** No data or migration bug
existed.

## Change made (belt-and-suspenders)

Although every read site was guarded, that safety relied on each *future*
read-site author remembering to add a guard. To make robustness structural
rather than per-call, a single normalization pass was added at load time.

`normalizeSave(s)` (new, in `src/game_logic.js` directly after `loadGame`):
- backfills core array/string/number fields that should always exist
  (`inventory`, `spells`, `visited`, `notes`, `gold`, `flask`, `section`) —
  this also repairs a hand-edited / truncated import file whose
  `renderGame()` would otherwise touch `S.visited.includes(...)` on a missing
  array;
- backfills the runtime-only fields (`eventLog=[]`, `shopBought={}`,
  `riddle_attempts=0`) so an old save matches the current shape immediately;
- is null-safe (returns `null` unchanged) and type-strict (a boolean `gold`
  becomes `0`, an array `shopBought` becomes `{}`).

Wired into **all three** load entry points via a single function:
- `loadGame()` — normalizes before returning (covers the title-screen load
  button **and** the deep-link loader, both of which call `loadGame()`);
- `importSave()` — normalizes after the v4→v5 migration step.

A normal current-day save is returned **unchanged** in every meaningful field;
normalization only adds what is missing or repairs a wrong type.

## Verification

- `_test_save_robust.py` — five-vintage roundtrip → **all load cleanly / correct rejection**.
- `_test_normalize_behaviour.py` — six behavioural assertions (normal save
  untouched; old saves backfilled; migrated-v4 backfilled; corrupt save
  repaired; null passthrough; boolean coercion) → **all pass**.
- `bash build.sh` → dist rebuilt, `normalizeSave` present, 3 call sites in dist.
- `scripts/find_smoke_paths.py` → **126 scenarios / 104 paths / 22 manual** —
  unchanged from before the edit (load-logic change does not affect the
  navigation graph).

## Files touched

- `src/game_logic.js` — added `normalizeSave()`; `loadGame()` and
  `importSave()` now call it. No data, no graph, no UI changes.
