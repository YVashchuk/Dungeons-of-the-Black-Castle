# §511 "OUTSIDE THE CASTLE" — boundary analysis (addendum to SUMMON_SPEC.md)
**Date:** 2026-06-12 · Companion to SUMMON_SPEC.md §4.4. **No code/data changed.** This resolves every spec item EXCEPT the castle-boundary mechanism, which is the one remaining fork for Yuriy.

## What's already settled (implementing now once the fork is picked)
- **Amulet rename is safe.** The bear amulet «Амулет» appears in GD structure at exactly TWO sites: §84 `acquires:"Амулет"` + its label. Every other amulet reference is the distinct «Золотой амулет» (Golden amulet: §390/§500/§625/§1164), matched by exact string — zero collision. Rename §84 → «Медвежий амулет».
- **Canon numbers verified verbatim** (§511): Медведица Мастерство 8 / Выносливость 10, «по тем же правилам… Копия», «**Один раз за все путешествие**» (→ `S.summonsUsed`), «в любом бою, но за пределами Чёрного замка. Там амулет бессилен.»
- **Bell (§612):** Медведь 11/9, anywhere, one use; the bell item is currently NOT granted (only «Медный ключик») — fix: add «Волшебный колокольчик» to §612 auto_items.
- Engine shape, `useAllyInCombat()`, button wiring, `COMBAT_ALLIES`, harness — all per SUMMON_SPEC.md, unaffected by the fork.

## The fork: how to know a combat is "inside the Black castle"
Two robust candidates, both analyzed against the data. Prose-only auto-classification was tested and REJECTED (35 of 76 combat paragraphs are "ambiguous" because the fight text rarely restates the location — it was set in the preceding paragraph). So:

### Option 1 — runtime "entered castle" flag (RECOMMENDED)
Set a persistent `S.enteredCastle=true` the first time the player visits a castle-entry paragraph, and treat the amulet as powerless whenever `S.enteredCastle` is true. Castle entries (threshold prose): **§1145** (courtyard — «проскальзываете во двор замка»), **§888** (climbing the outer wall, 3rd floor), **§722** (flying to the watchtower), **§1150** (watchtower), **§70** (path meets the castle wall → forces the wall/tower route).
- **Evidence:** blocking those 5 entries makes **14 of 15** unambiguous castle-interior combats unreachable from §1 — i.e. you essentially cannot reach a castle fight without passing an entry. Matches the narrative meaning of "inside the castle" exactly, needs no per-paragraph list, and is future-proof.
- **Caveat:** §684 (a castle room reachable by a second route) leaks past the 5 entries — add its specific inbound (or §684 itself) to the entry set, OR accept it. One-line fix once confirmed.
- **Cost:** `S.enteredCastle` in initState + normalizeSave; set it in `goTo`/`renderGame` when `CASTLE_ENTRIES.has(section)`; amulet button checks `!S.enteredCastle`. Tiny.

### Option 2 — curated `CASTLE_SECTIONS` Set
Bake an explicit set of castle-interior paragraphs into the engine; amulet powerless iff `CASTLE_SECTIONS.has(section)`.
- **Unambiguous interior combats (prose-verified):** §131, §174, §191, §455, §481, §618, §684, §722, §790, §823, §950, §1050, §1096, §1099, §1163.
- **Plus** the inside-castle subset of the 35 "ambiguous" combats, which must be hand-finalized by reading each one's *preceding* paragraph (e.g. §628/§742/§805/§96/§1150/§1177 read as interior; §260/§440/§532/§448/§456 read as forest). ~20 paragraphs total once finalized.
- **Downside:** static; must be maintained if routing changes; the hand-finalization of the ambiguous set is a judgment pass with some risk of a wrong call that mis-gates one fight.

## Recommendation
**Option 1 (runtime flag).** It is the most faithful to the canon phrasing ("за пределами замка" = a state you're in once you've entered), the most robust (one near-perfect dominator set, vs. classifying ~20 paragraphs), and the cheapest to maintain. Resolve the §684 leak by including its inbound in `CASTLE_ENTRIES`. If you prefer an explicit auditable list instead, Option 2 with the verified 15 + a finalized ambiguous subset.

**Decision needed:** Option 1 or Option 2. Everything else in the summon feature is ready to implement immediately on your word.
