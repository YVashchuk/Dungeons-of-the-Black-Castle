# §511 "OUTSIDE THE CASTLE" — boundary analysis (addendum to SUMMON_SPEC.md)
**Date:** 2026-06-12 · Companion to SUMMON_SPEC.md §4.4. **No code/data changed.**
**UPDATE 2026-06-12 (post-domination analysis): Yuriy's critique is correct — the flag does NOT save enumeration work. Re-framed recommendation below.**

## Settled and ready (implement once the boundary mechanism is chosen)
- Amulet rename «Амулет»→«Медвежий амулет» is collision-free (only §84 + its label; all other amulet refs are the distinct «Золотой амулет» §390/§500/§625/§1164).
- Canon numbers verbatim: Медведица 8/10, «по правилам Копии», «Один раз за все путешествие» (→ `S.summonsUsed`), powerless inside the castle.
- §612 bell-grant bug (bell never granted, only «Медный ключик») — fix in this feature.
- Engine shape / `useAllyInCombat()` / button wiring / `COMBAT_ALLIES` / harness — per SUMMON_SPEC.md.

## The boundary problem — RESOLVED in understanding (Yuriy was right)
Yuriy's point: if the flag needs ALL castle entries/exits/transitions enumerated (incl. exotic routes — a barrel down the river, etc.), it collapses into Option 2's full enumeration. **The graph analysis confirms this exactly:**

1. **No thin neck.** Attempting to dominate the castle interior with a small entry set fails: the interior is reached through a DIFFUSE web of crossing paragraphs (§91→131, §945/954/986→174, §676/1196→266, §1135→1050, §1015/1044/1079→1096, §136→618, §1089→790, §789→1163, §96/298/604/901/971/838→45, …). These are dozens of internal corridor/door/mirror/gas-puzzle transitions, because the Black castle is a dense maze with many doors — not a building with one gate. Making a flag's entry-set *provably complete* would require enumerating essentially all of them = Option 2's work.
2. **Reachability partition also fails.** Of 76 combat paragraphs, **75 are reachable in the "forest phase"** (without committing to the castle-entry paragraphs); only **§684** is castle-exclusive. The castle interior loops back into the broader graph so thoroughly that forest and castle are NOT graph-separable. So "amulet powerless iff not-forest-reachable" would wrongly free the amulet almost everywhere.
3. **Exits are clean though.** No castle→forest edges and no "leave the castle" prose exist — the castle is a one-way endgame funnel. So *monotonicity* (once-in-always-in) is safe; the problem is purely entry-set completeness, which is large.

**Conclusion:** an ACCURATE "inside the castle" predicate requires a hand-curated paragraph set (Option 2). The flag is elegant but, here, not cheaper — Yuriy is right.

## Re-framed options (pick one)
- **Option 2 — curated `CASTLE_SECTIONS` set (now the honest baseline).** Hand-finalize the castle-interior paragraphs (start from the 15 prose-verified interior combats + classify the ~35 ambiguous via each one's preceding paragraph). The amulet checks `CASTLE_SECTIONS.has(section)`. Most accurate; one-time curation cost; must be re-checked if routing changes (rare — data is canon-frozen).
- **Option 3 — sidestep the boundary entirely (NEW, pragmatic).** Lean on the two facts we already have for free:
  - the **bell** (Медведь 11/9) works *everywhere by canon*, including the castle — so castle fights already have a summon;
  - the **amulet** is once-per-game (`summonsUsed`) and the she-bear is the *weaker* ally (8/10).
  Rather than police the exact castle boundary, gate the amulet on the **handful of castle-exclusive + clearly-interior combats** (a SHORT deny-list: §684 + the 15 prose-verified interior combats + the wizard/endgame rooms — ~18 paragraphs we can name with confidence), and accept that a few deep-interior fights reachable via forest hubs might still allow the weaker amulet. Low effort, canon-faithful in spirit ("the amulet is powerless in the castle's heart"), zero risk of wrongly disabling it in an obvious forest fight.
- **Option 1 (runtime entry flag) — WITHDRAWN** as a standalone: not provably complete without enumerating the diffuse entry web (= Option 2).

## Recommendation
Given the maze has no clean boundary, **Option 2** if we want strict canon accuracy (curate the interior set once — I'll do the per-paragraph classification and you sign off on the list), or **Option 3** if we want minimal effort with a sensible spirit-of-canon deny-list. I lean **Option 2** for a faithfulness-first project: it's a bounded one-time curation (~50 paragraphs to eyeball), fully auditable, and the data is frozen so it won't rot. The curated list will be recorded in the registry and in the future-research instructions (so Gemini/ChatGPT/Claude know the castle-interior set and the item-summon mechanic).

**Decision needed:** Option 2 (curated set — I produce the classified list for your approval) or Option 3 (short deny-list, minimal). Then implementation proceeds.
