# REACHABILITY / ORPHAN-PARAGRAPH AUDIT — June 2026
**Date:** 2026-06-12 · **Data:** src/remake_data.js (1221 ¶) · **Method:** forward BFS from §1 over choices + riddle valid/fail targets; combat verified NOT to add hidden edges (post-combat shows the paragraph's own filtered `choices`, no separate win-target). Baseline confirmed: **1221 / 0 dangling / 1201 reachable**.

## Summary
- **20 paragraphs unreachable from §1.** Of these, **18 are "islands"** (zero inbound edges) and 2 are reachable only *from* an island (§971←§954, §1133←§661).
- Every island is a coherent, non-garbage scene — almost all are the **success half of a conditional gate** («Вы показываете пропуск…», «есть чем открыть дверь…», «Вы вставляете ключ…») or a **combat-victory continuation**. This is the signature of edges DROPPED during the 1991→remaster renumbering: the paragraph survived, the choice pointing to it did not.
- **No fix applied** — each island needs its true parent identified against canon (the 1991 original has different numbering, so this is per-scene reading, not number-matching). Auto-wiring from structural candidates would mis-parent the "sibling outcome" cases (see Tier C).

## Confirmed parent->island drops (Tier A — high confidence, canon-explicit)
These parents' **own canon prose names the island as the success branch**, but the GD choice edge is missing:

| Island | True parent | Canon evidence in parent | Current parent choices |
|---|---|---|---|
| §600 (Водяной dead -> loot chest) | **§260** | «Если вы победили его, то **600**» | only [1209]=flee (the victory edge dropped) |
| §938 (skull absorbs Black gas) | **§854** | «если у вас есть череп, то достаньте его **938**» | [] (empty — the conditional edge dropped) |
| §954 (pass-list to the baron's knight) | **§945** | «Если первое, то **954**, если второе — 174» | only [174]=attack (the "offer pass" edge dropped) |

For these three the parent literally writes the island's number — the safest possible fix. (§954 also retro-justifies group_56: once §945->§954 is restored, the Чётки/ring gates added there become live, and §971 becomes reachable.)

## Strong structural candidates (Tier B — need 1991 confirmation before wiring)
Parent reachable, shares the scene's key noun, and converges on the island's own successors:

| Island | Top candidate | Note |
|---|---|---|
| §175 (mirror-pass, «она тает в воздухе») | §1025? | both are pass-success -> §607; but §175 has 3 exits (607/803/323) vs §1025's single 607 — likely DIFFERENT pass-gates; verify |
| §321 (pay контролёр -> жетон) | §1014 | §1014 «протягиваете контролёру деньги… пропуск-жетон» -> §919; §321 is the *show-existing-pass* twin -> needs the gambling-hall parent (§361?) |
| §342 (open door, have key -> §1155) | §921 | both key-door -> §1155; §342 is the unconditional-success twin |
| §650 (key -> door -> §742) | §654 | §654 «открываете — 742»; §650 is the "check if locked" twin |
| §661 (3-door landing) | §285 / §621 | converge on 782+1157; §661 likely the post-unlock view |
| §968 (key -> 3-corridor hub) | §533 / §799 | converge on 849(+1117); castle-key door |
| §1002 (key BREAKS in lock) | §131 / §962 | converge on §1075; the "key fails" branch of a key-door |
| §1149 (Начальник стражи -> дверь 215) | §1046 | §1046 is the 3-door choice (694/150/215); §1149 is a remembered-guard variant |

## No structural candidate (Tier C — pure manual 1991 cross-ref)
§330 (book reveals the mage's death-secret — major lore!), §644 (show Goblin pass -> 1029), §713 (faint -> wake on shore -> 590), §736 (horse gives Golden Horseshoe — a luck item!), §875 (door -> escape death 1060), §1114 (stairs up -> 964), §1165 (light knocked out -> 1179). Also the "sibling-outcome" confusions to AVOID auto-wiring: §938-class (§1027/§957/§1038 are parallel gas outcomes, NOT parents of each other).

## Other findings
- **Orphan item — Флакончик духов:** used at §1063->773 but granted by NO paragraph (confirmed in group_56). Genuine content gap; needs a source decision (which scene should hand it over) — likely tied to one of the unreachable paragraphs above.
- **Terminal paragraphs:** 52 zero-outgoing paragraphs; all spot-checked are legitimate (victory §1220, deaths, and narrative dead-ends like broken-leg/quicksand). No action.
- **§971** becomes reachable automatically once §954 is reattached (Tier A via §945).

## Recommended approach
Tier A (3 edges) is safe to wire now — parents name the islands explicitly. Tier B (8) should be wired after a focused pass through `assets/book_1991_extracted.txt` to confirm each parent (the 1991 scene order disambiguates twin/sibling cases). Tier C (7) needs the same 1991 reading plus a judgment call per paragraph. Recommend: **commit this audit doc**, then do **Tier A as one small data+harness batch**, then tackle B+C in a second batch after the 1991 cross-ref. All are data-only (restoring dropped choice edges); each will raise the reachability baseline.
