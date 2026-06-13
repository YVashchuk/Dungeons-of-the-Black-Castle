# TIER B/C RESOLUTION — the vestigial-paragraph finding (June 2026)
**Date:** 2026-06-12 · Companion to REACHABILITY_AUDIT.md + XREF_1991_VERDICTS.md. **This supersedes the Tier B/C wiring recommendation.**

## The decisive test
For each of the 18 islands, I checked whether its **successors are already reachable without it**, and whether it carries **unique content** (item grants / a successor reachable ONLY through it). Result:

- **16 of 18 islands are VESTIGIAL.** Every successor is already richly reachable through other paragraphs (inbound counts of 6–24 are typical). These are leftover **1991-edition structure paragraphs** that the remaster SUPERSEDED with its direct-gating pattern: where 1991 routed «have key → [intermediate 'you open the door' ¶] → destination», the remaster wires the locked-door scene's `inventory_condition` branch **straight to the destination** (confirmed across §91→131, §687→727, §768→808, §1085→1115, §1065→1025, etc.). The intermediate "you open the door / show the pass / Водяной mort" paragraphs survived in the data but nothing points to them anymore — and nothing should, because re-wiring would create redundant duplicate paths.
- **Only 2 islands unlock an otherwise-unreachable successor**, and on inspection both are inert:
  - **§954 → §971** (rosary-pass success): genuine, and FIXED by Tier A (§945→§954, 1991-confirmed §320→§355). ✓
  - **§661 → §1133** (stair-breaks trap): §1133 is a dead-end that loops back to §621 — and §621 is already reachable (via §285), offering the very same two doors (§782/§1157) that §661 offers. §661 is a near-duplicate of the §285/§621 landing (both = 1991's three-door scene). Re-wiring adds a trap-loop, no content. **Leave vestigial.**

## The one content exception
**§600** (Водяной dead → loot chest) is vestigial for *connectivity* (§716 has 6 other inbounds) BUT uniquely grants **Огниво + Свеча + Белая стрела** from the chest. The 1991 original confirms §260→§600 is a real dropped combat-victory edge (1991 §326 «Если вы победили его, то 573»). So §600 is worth restoring **for the item content**, not for the graph.

## Revised fix list (evidence-based, replaces "wire 18 edges")
Only **3 edges genuinely merit restoration**, all already in or adjacent to Tier A:
1. **§945 → §954** (1991-confirmed) — unlocks the baron-knight pass-list + its unique §971.
2. **§854 → §938** (remake-explicit «достаньте его 938») — completes the Black-gas/skull puzzle branch (§938 → §676, the canonical "leave the skull" outcome; even though §676 is otherwise reachable, §854's gas scene currently has an EMPTY choices array, i.e. a hard dead-end for skull-holders — this is a real UX bug, not just vestigial).
3. **§260 → §600** (1991-confirmed) — restores the Водяной loot (Огниво/Свеча/Белая стрела), genuine item content.

**§938 priority note:** §854 is the most clear-cut bug of all — its `choices` array is literally `[]`, so a player who opens that cran with a skull hits a dead-end overlay instead of §938. That's the strongest single fix in the whole audit.

## The other 15 islands — verdict: INTENTIONAL LEGACY, leave as-is
§175, §321, §330, §342, §644, §650, §661, §713, §736, §875, §968, §1002, §1114, §1149, §1165 — vestigial 1991-structure paragraphs superseded by the remaster's direct-gating. They are harmless (unreachable, so they never render), and "fixing" them by inventing parents would (a) duplicate existing paths and (b) risk mis-parenting in the dense hub scenes (gambling hall, mendicant room, corridor maze) where many siblings converge. Documented here so a future audit doesn't re-flag them as bugs.

NB the earlier "Tier A = 3 / B = 6 / C = 9" framing in XREF_1991_VERDICTS.md was based on graph-orphanhood alone; THIS document refines it with the content/vestigial test and is the authoritative conclusion.

## Recommended action
Wire the **3 content-bearing edges** (§945→954, §854→938, §260→600) as one small data+harness batch (reachability 1201 → ~1205, plus restored items and the §854 dead-end fix). Leave the 15 vestigial nodes documented and untouched. The Флакончик-духов item-source gap (perfume used at §1063→773, granted nowhere; present in the 1991 vampire-woman gift list) stays open as a separate content-decision item — none of the 18 islands grants it, so it needs a deliberate grant-site choice, not an island fix.
