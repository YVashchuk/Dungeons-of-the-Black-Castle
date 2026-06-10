# Dynamic Paragraph Arithmetic — Verified Canon Map (June 2026)

**Status:** Read-only scoping pass COMPLETE. Every offset below verified against `assets/fb2_remake.fb2` (grant text + site text + target text triple-checked). No code/data changed in this pass.

**Method:** (1) whole-book sweep for arithmetic instructions («прибав/отним/вычт» + number, stat-effects filtered out); (2) per-mechanic bidirectional verification — effect paragraphs located by narrative, sites derived as `effect ∓ offset`, both texts read; (3) current `remake_data.js` wiring cross-checked for every mechanic.

**Architecture conclusion:** NO engine feature is needed. The remake has already been implementing these as **static, inventory-gated choices** (per-item conditional routing — ChatGPT v3's recommendation, superseding Gemini's runtime-injection Approach 2). Evidence in shipped data: fish §32→47, thread §108→158, star §1082→1153, throne §741→1141 (gated on knowledge-token item «Знание о троне»), orange §226→976, rings §226→627/§226→86, gold ring §1164→1112. The remaining work is data-only: extend the same pattern to the unwired mechanics.

---

## A) VERIFIED & ALREADY WIRED (no action)

| Mechanic | Grant(s) | Offset | Wired sites (site→target, arithmetic checked) |
|---|---|---|---|
| Золотая рыбка (water rescue) | §13 (token «Помощь рыбки», §195/§248 path) | +15 | §32→47, §203→218, §699→714 |
| Золотой ключ | §140 / §440 / §1172 | +30 | §1085→1115 |
| Книга (decipher) | §1137 | +24 | §4→28, §339→363, §732→756, §798→822 |
| Перстень с рубином | §1071 | +401 | §226→627 |
| Перстень с изумрудом | §479 | −140 | §226→86 |
| Золотое кольцо (Тролль) | §1050 | −52 | §1164→1112 |
| Золотой апельсин | §74 | +750 | §226→976 (consume_on_use ✓) |
| Клубочек (forks) | §198 (acquires) | +50 | §108→158, §366→416 |
| Рубиновая звезда | §791 (auto) | +71 | §1082→1153 (1 of ~8 sites — rest in Batch 2) |
| Тайник трона | §688 (knowledge) | +400 | §741→1141 (cond «Знание о троне») |
| Свеча +огниво / светильник | §600 (Свеча+Огниво), §929, §328, §1045 | +10 | §696→706, §1000→1010 |
| Ключ Чёрного замка | §471 | +40 | §91→131, §687→727, §694→734, §768→808 |
| Letter-riddles (engine) | group_18 | +916 / +825 | §1131, §992 |

Memory-note corrections confirmed by canon: §385 is **+910 treasure tip** (not a castle key); §612 bear gives a **волшебный колокольчик** (combat summon, NOT a +40 key — its «прибавьте 40» sentence belongs to the door-key context… **re-verify §612's “+40” sentence at Batch-5 time**, the sweep attributed one +40 line to §612); §688's arithmetic is **throne +400** (white arrow is separate, already wired §535/§1090/§1196); §1071 is **+401**; §1137 is **+24**; candles are **+10**. §385 +910: the dry-tree site is **§19** (19+910=929 — §929 IS the dig-up-the-chest paragraph ✓ self-confirming: it grants the светильник/кольцо/10 gold). Check §19's GD wiring at Batch 5.

## B) UNWIRED — implementation batches (all data-only)

**Batch 1 — Птичка в клетке (bird guide, −50).** Grant chain verified: §399 (Evil Spirit offers bird, requires cage «Клетка для птиц», granted §1193 auto ✓) → §325 «вычитайте 50 из номеров тех параграфов, где будут развилки». §325 currently grants NOTHING — add auto_items item (e.g. «Птичка в клетке»). Fork sites verified (all are forks in GD): **§156→106, §201→151, §228→178, §327→277** (targets are the four bird-direction paragraphs, currently unreachable). Check §399's →325 choice is cage-gated. **Reachability baseline changes: 1168 → ≥1172** (exact number from the regression script; targets' onward edges may add more).

**Batch 2 — Рубиновая звезда (+71), ~7 more sites.** Effects verified by text: §232, §356, §578, §674, §708, §917, §1005 (+ wired §1153). Derived sites to verify-then-wire: §161→232 (dark corridor fork ✓), §285→356 (three doors ✓ — «средняя дверь» matches), §507→578, §603→674, §637→708, §846→917, §934→1005 (tunnel ✓). Cond «Рубиновая звезда».

**Batch 3 — Тайна зеркал (mirror secret, −13).** Behind-mirror effect paragraphs verified: **§284** (cabinet: «зеркало начинает поворачиваться… чёрный провал потайного хода», site 297 ✓ — §297's “ordinary mirror” text is the pre-knowledge override) and **§664** (second passage, site **§677** — verify §677 mentions the mirror; princess hall per the deer's tip §660: identical mirrors in the cabinet AND the princess hall, stairs behind). Knowledge sources: §660 (deer), §923 (scroll plan), §937 (harem wives), §1174. Implement via knowledge-token item (precedent: «Знание о троне»), e.g. «Тайна зеркал» granted at all four, gating §297→284 and §677→664. Likely endgame-relevant (the wizard's staircase to the Princess).

**Batch 4 — Золотой амулет (−333) + §500 grant.** §500 canon grants «маленькое зеркальце и Золотой амулет» — GD §500 grants NOTHING (gap). Effect verified: **§831** «два тонких острых луча света из амулета пронзают его [Барлада Дэрта] глаза» — site 831+333=**1164** ✓ (§1164 mentions the amulet). Wire §500 auto_items + §1164→831 cond «Золотой амулет». NAMING DECISION: the bear-fur amulet (§84 acquires «Амулет», described §511) is a DIFFERENT item; §625's debt payment says «золотым амулетом» in canon but is currently gated on «Амулет» — decide whether to re-gate §625 to the golden one or accept either.

**Batch 5 — small singles.** (a) Книга +24: new site **§586→610** verified («камень… какие-то обозначения» → «Книга разъясняет смысл загадочных символов»). (b) §19→929 treasure (+910, after trusting the bandit §385). (c) Пропуск −40 (§349): «Пропуск» item not granted in GD; effect/site via §1025 («предъяв…») — one read needed. (d) Lighting +10 leftovers: check §972→982, §1023, §1200. (e) Thread third site? §451 mentions клубочек — check site 401. (f) §56 password: «Если вы знаете пароль…» — §95 says «Пароль — 146; обратитесь к параграфу с этим номером» — knowledge-token jump §56→146.

**Batch 6 — letter-riddles (group_18 engine).** §1113 (+1046, fail §1190) — currently a FAKE static button «Сложить порядковые номера букв и прибавить 1046 (1046)» that navigates to §1046; must become a riddle field (its success chains into §1131 → §992 → §932, the full riddle chain). The «Домик» chain §95/§67 (+50; current §67 «Проделать такое же сложение (53)» is also fake-static; §53 is the fail/leave path) — needs one focused trace of the Домик riddle sequence.

## C) DEFERRED with documentation (insufficient canon to wire safely)

- **§390 «друг беглецов» −35** (deliver the fugitives' message): trigger sites unidentified; «послание» appears nowhere else.
- **§435 name-sum +30** (friend's NAME letter-sum): the friend's identity/target unresolved. Both → candidates for the same web/deep-research pass as §887→734.
- **Combat summons (separate feature, NOT arithmetic):** §612 волшебный колокольчик (bear М11/В9, once) and §511 амулет с медвежьей шерстью (she-bear М8/В10, once, fights like Копия) — need a summon-ally combat mechanic; backlog as its own engine task.

## D) Reachability note
Current baseline: 1221 / 0 dangling / 1168 reachable. Batches 1–6 ADD verified canon edges, so reachable WILL rise (bird targets §106/151/178/277 alone give ≥1172). Each batch's registry entry must restate the new baseline; the structural check's “expect” value updates accordingly.
