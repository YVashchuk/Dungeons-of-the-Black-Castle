# FIDELITY_REPORT.md — Gemini 4 Argon, Part 1 (text-vs-engine fidelity sweep)

*Delivered in the Gemini app on 2026-11-02 (model Gemini 4 Argon, thinking level Medium) against the brief `audit_cycles/recheck_2026_11/BRIEF_code_review_gemini4.md`. Reproduced here as delivered (the table, which arrived as broken lines in the chat export, is restored as Markdown). The maintainer's adjudication of every finding is in `README.md` next to this file and in the registry, group `group_100_2026_11_02_argon_fidelity`.*

## 1. Pre-flight verification summary

**`src/locale.ru.js`** (4 split parts verified to end with END OF PART):
- First sentence of `LOCALE_RU.p["1"].t`: «Вы быстро идете вперед и вскоре оказываетесь в лесу.»
- First sentence of `LOCALE_RU.p["1220"].t`: «Итак, путешествие подошло к концу.»
- Keys in `LOCALE_RU.p`: 1,221 (248 + 316 + 319 + 338)
- Keys in `LOCALE_RU.ui`: 369

**`src/game_structure.js`:**
- `GD["1221"]`: `{"id":1221,"choices":[{"target":357,"luck_type":"lucky"},{"target":628,"luck_type":"unlucky"}],"enemies":[],"has_luck":true,"scene":"castle"}`
- `GD["127"].auto_items`: `{"items":["golden_snake"]}`

**`src/game_logic.js`:**
- Line starting `function useSnakeInCombat`: `function useSnakeInCombat(){`
- Last top-level function name: `initVisualPolishV1`

**`REGISTRY_DIGEST.md`:** last line `END OF DIGEST — 284 items with id and status + 82 legacy entries, registry v2.196 -> v2.197`

*Maintainer's note: every value matched the reference values computed from the tree before the run.*

## 2. Batch coverage (1–1221)

| Batch | Paragraphs read | Findings | Finding IDs |
|---|---|---|---|
| 1–100 | 100 / 100 | 3 | F-001 (§10), F-002 (§74), F-003 (§76) |
| 101–200 | 100 / 100 | 3 | F-004 (§129), F-005 (§143), F-006 (§162) |
| 201–300 | 100 / 100 | 0 | — (§252 skull grant is tracked with its consumer chain in F-031) |
| 301–400 | 100 / 100 | 3 | F-007 (§340), F-008 (§358), F-009 (§385) |
| 401–500 | 100 / 100 | 4 | F-010 (§427), F-011 (§442), F-012 (§454), F-013 (§499) |
| 501–600 | 100 / 100 | 4 | F-014 (§505), F-015 (§542/§553), F-016 (§252/§1116 skull), F-017 (§597) |
| 601–700 | 100 / 100 | 5 | F-018 (§636), F-019 (§648), F-020 (§649), F-021 (§684), F-022 (§689) |
| 701–800 | 100 / 100 | 6 | F-023 (§702/§658), F-024 (§719), F-025 (§791), F-026 (§736), F-027 (§748), F-028 (§769) |
| 801–900 | 100 / 100 | 5 | F-029 (§804), F-030 (§826), F-031 (§842), F-032 (§854), F-033 (§859) |
| 901–1000 | 100 / 100 | 5 | F-034 (§913), F-035 (§944/§1054), F-036 (§951), F-037 (§957/§1038), F-038 (§981) |
| 1001–1100 | 100 / 100 | 2 | F-039 (§1052), F-040 (§1099) |
| 1101–1200 | 100 / 100 | 4 | F-041 (§1119), F-042 (§1125), F-043 (§882), F-044 (§1171) |
| 1201–1221 | 21 / 21 | 1 | F-045 (§1205) |
| **Total** | **1,221 / 1,221** | **45** | — |

## 3. Counts by class and severity (as reported)

**By severity:** P0 — 5 (F-031, F-032, F-033, F-034, F-045); P1 — 19 (F-003, F-008, F-009, F-010, F-012, F-013, F-015, F-016, F-017, F-019, F-020, F-021, F-025, F-027, F-029, F-037, F-040, F-042 — eighteen listed); P2 — 21.

**By class:** CONDITION_NOT_GATED 10 (F-012, F-013, F-017, F-023, F-030, F-031, F-032, F-033, F-034, F-045); ITEM_NOT_GRANTED 8 (F-003, F-004, F-006, F-008, F-014, F-015, F-037, F-039); STAT_NOT_APPLIED 5 (F-009, F-010, F-019, F-027, F-042); SPELL_HOOK_MISSING 4 (F-021, F-025, F-036, F-040); ABILITY_NOT_IMPLEMENTED 2 (F-020, F-026); ITEM_NOT_CONSUMED 1 (F-029, plus silver_vessel and ship_plaque inside F-037 and F-045); ROUTE_MISMATCH 1 (F-035); OTHER 14 (F-016 skull item missing from the registry + 12 dead `flee:true` flags on non-combat paragraphs + F-043).

## 4. Top 20 most consequential findings (as ranked by the reviewer)

1. **F-045** (§1205, P0) — a live button teleports from the river into §249 inside the castle dungeon; the text only names the paragraph to use later (§1078).
2. **F-031 / F-016** (§252, §1116, §842, P0) — the skull of §252 and §1116 does not exist; the Black Death trap of §842 lets everyone survive.
3. **F-032** (§854, P0) — Black Death tap ungated.
4. **F-033** (§859, P0) — Yellow Death jug ungated.
5. **F-034** (§913, P0) — Yellow Death tap ungated.
6. **F-020** (§649, P1) — the crossbow and arrows promise a kill-without-fight (not Barlad, not ghosts or spirits); nothing implements it.
7. **F-037** (§957 & §1038, P1) — filling a container with green gas is ungated, the container never turns into the silver vessel, and the silver vessel is never spent at §739 / §728 / §861 / §775.
8. **F-019** (§648, P1) — «вы забываете начисто все заклятия» has no effect.
9. **F-012** (§454 & §221, P1) — the spy's offers are open without the manuscript, book or feather.
10. **F-040** (§1099, P1) — a Copy charge is required on the victory exit to 894.
11. **F-021** (§684, P1) — the three windows require another Levitation but spend none.
12. **F-025** (§791, P1) — only one of the three aerial exits requires Levitation.
13. **F-003** (§76, P1) — the deer hide is lost when taking the hidden-door exit.
14. **F-008** (§358, P1) — the card deck cannot be taken.
15. **F-015** (§553 & §542, P1) — the sword is granted at §553 before the choice; §542 grants nothing.
16. **F-029** (§804, P1) — the shiny metal is not spent.
17. **F-009** (§385, P1) — the flask is not emptied for the dying bandit.
18. **F-010, F-027, F-042** (§427, §748, §1125, P1) — flask refills do nothing.
19. **F-013 & F-017** (§499 & §597, P1) — food for the fugitives is not required or spent.
20. **F-004, F-006, F-014** (§129, §162, §505, P2) — the bronze whistle is granted before the goblin fight.

## 5. Places with two possible readings (as reported)

1. **§882** (F-043) — «Вы должны чем-нибудь отблагодарить человека, спасшего вашу жизнь…». Reading A: a mandatory payment of a spell, an item or gold. Reading B: narrative; enforcing it could strand a survivor who has nothing left after the four-day trap (§908).
2. **§462** — the Orc's second flask is an inert item without sips; reading A keeps it, reading B makes it drinkable like the first flask.
3. **§239** — the Copy of the hero: a fight against an enemy with the hero's own SKILL and STAMINA is described but `GD[239].enemies` is empty; a small mirror rule would be needed.
4. **§1054 vs §944** — «К палаткам? — 915» against «идите к палаткам — 715»; almost certainly a slip of the original, preserved in the fb2.

*The reviewer closed with an offer to proceed to Part 2 (engine robustness), which runs in a separate chat.*
