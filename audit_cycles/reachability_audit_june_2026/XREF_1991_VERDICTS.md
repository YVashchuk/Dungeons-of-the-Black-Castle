# 1991 CROSS-REFERENCE — per-island verdicts (companion to REACHABILITY_AUDIT.md)
**Date:** 2026-06-12 · **Sources:** `assets/book_1991_extracted.txt` (1991 first edition, parsed clean into 617 sequential paragraphs) + remake FB2 (1221 ¶) + remake graph. **Method:** content-shingle matching remake↔1991, then 1991 inbound by written-ref AND hidden-arithmetic (`прибавьте/вычтите N`), then map the 1991 parent back to a remake paragraph by content; cross-checked with remake-side successor-convergence.

## Headline
The 1991 original is genuine ground truth for **edition lineage** but resolves fewer island-parents than hoped, because in BOTH editions most of these islands are entered through **combat-victory routing, luck checks, or item-gated branches** whose link is not a plain paragraph number a scanner can see. Net: **2 islands double-confirmed by 1991 written refs**, **1 by the remake's own explicit text**, the rest resolved (with confidence grades) by remake-side structural convergence. Several islands turn out to be **alternative-outcome twins** (the parent should point to BOTH the island and an already-reachable sibling), and a few are **remake-only** content with no 1991 origin at all.

## TIER A — confirmed, safe to wire (3)
| Island | Parent | Evidence | Fix |
|---|---|---|---|
| **§600** Водяной dead → loot (свеча/огниво/белая стрела) | **§260** | remake §260 «Если вы победили его, то 600» (only the flee edge [1209] survives); 1991 twin §573 ← 1991 §326 «Если вы победили его, то 573» — IDENTICAL structure | restore §260 victory-edge → §600 (post-combat choice) |
| **§954** baron-knight pass-list | **§945** | remake §945 «Если первое, то 954» (only [174]=attack survives); 1991 twin §355 ← 1991 §320 (written ref «…- 355») | restore §945 → §954 (the "offer pass" branch) |
| **§938** skull absorbs Black gas → 676 | **§854** | remake §854 «если у вас есть череп, то достаньте его 938» — the gated edge is simply absent (choices `[]`) | restore §854 → §938, inventory_condition «Череп» (verify item name) |

## TIER B — strong remake-side candidate (single converging reachable sibling) (6)
Each parent is reachable and is the natural scene; the island is its item-success twin. Need a 1-line confirmation read before wiring (mostly: confirm the parent should branch to the island vs already points to a sibling).
| Island | Likely parent | Relationship |
|---|---|---|
| §175 (mirror-pass «она тает в воздухе» → 607/803/323) | §1025 (or a mirror-pass scene) | §1025 also →607; §175 is a richer pass-success (3 exits). Verify which guard scene loses the §175 branch. |
| §321 (show pass to контролёр → 826/919) | gambling-hall entry (near §361/§1014) | §1014 = pay-for-pass twin →919; §321 = show-existing-pass twin. Parent is the игорный-зал gate. |
| §342 (have key → 1155) | §921 | §921 also →1155 (its own key-door); §342 is the unconditional-success twin of the same door — find the scene that should offer both. |
| §650 (key → door → 742) | §654 | §654 «открываете — 742»; §650 = "check if locked first" twin. |
| §968 (castle-key → 3-corridor hub 798/849/1117) | §533 / §624 | both converge on 849(+1117); §968 is the key-opens-door entry to that hub. |
| §1149 (Начальник стражи remembers → 215) | §1046 | §1046 = the 3-door choice (694/150/215); §1149 is a guard-remembers variant routing to the same left door. |

## TIER C — needs judgement / remake-only (no 1991 origin) (9)
- **§330** (book/manuscript reveals **the secret of the mage's death** — major plot lore): **remake-only** (best 1991 frac 0.02). Parent must be a "use the Книга/manuscript" scene; no converging candidate found — manual.
- **§661** (3-door landing 782/1133/1157): parents §285/§621 both converge on 782+1157 but NOT 1133 — §661 may be a *third* sibling; needs care (risk of mis-wiring, like the §938-gas-outcome family).
- **§1002** (key BREAKS in lock → 1075): §131/§962 converge on 1075 — but §1002 is a *failure* outcome; its parent is a key-door that should branch to §1002 on a bad-key condition. Manual.
- **§644** (show Goblin pass → 1029), **§736** (horse gives **Golden Horseshoe** luck item → 750), **§875** (have key → escape death 1060), **§713** (faint → wake on shore 590), **§1114** (stairs up → 964), **§1165** (candle knocked out → 1179): no converging reachable candidate; each is a mid-scene continuation entered via a dropped gated/forced edge. Require manual remake reading (and for §736/§330, these add an item/lore so they matter).

## Item-source gap (separate from islands)
**Флакончик духов** — used at §1063→773, granted nowhere. 1991 check: the perfume gift exists in 1991 (§551-family lists «Зеркальце/Гребень/Оберег»; the flacon appears in the vampire-woman gift list), so it SHOULD have a grant site. Likely tied to a Tier-C island or an un-audited grant. Defer with the island wiring.

## Recommendation
Wire **Tier A (3 edges)** now — two are 1991-confirmed, one is remake-explicit; zero ambiguity. Tiers B/C need short per-paragraph confirmation reads (and a couple are genuine judgement calls about twin-vs-parent). Propose: Tier A as the next small data+harness batch (raises reachability ≥ +5: §600, §938, §954, §971, and §954's own fallbacks already counted), then B and C in a reviewed second pass.
