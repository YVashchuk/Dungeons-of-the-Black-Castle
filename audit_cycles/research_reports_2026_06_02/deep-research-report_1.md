# Fresh Diagnostic Audit of Dungeons of the Black Castle

## Executive summary

I read the canonical corrected text (`assets/book_text.md`), the corrections registry (`assets/text_corrections.json`), the live game data (`src/remake_data.js`), and the engine (`src/game_logic.js`). I did **not** re-flag the already-closed items listed in the registry and the user’s do-not-re-flag list. The highest-confidence fresh issue is **§132**, where the forest trader is described as a real shop with priced goods and a 9-slot bag, but the current data exposes only `«Уйти (354)»` and `«Попробовать поговорить с ним еще (314)»`; there are no purchase choices at all, so that entire merchant economy is text-only in the shipped build. fileciteturn0file0 fileciteturn0file1 fileciteturn0file3

Across the economy layer, the live data currently contains a player start of **15 gold**, **9 direct gold-source paragraphs totaling +52 gold**, and **33 direct gold-cost / gold-subtraction entries**. The economy is therefore not globally starved, but it is distorted by one missing shop implementation (§132), several broken later-use item chains, and two §340 purchases that appear to be pure dead-ends in the current data. fileciteturn0file2 fileciteturn0file3

For combat damage outliers, I found **no fresh bug** beyond the already-fixed cases. In the corrected canon text, the only explicit “non-default per-hit damage” wording I could verify is §36 (`«не 2, а 4»`) and §240 (`«не 2, а 3»`), and both are already represented in current data. fileciteturn0file0 fileciteturn0file1 fileciteturn0file3

## Scope and evidentiary notes

This report is based on the **current repo-state files supplied in the session** and cross-checked against the corrections registry header/history so that already-closed issues were not resurrected. Where I am making a derived claim such as a source/sink count or “no consumer exists anywhere in current data,” that statement is based on a direct pass over the current `GD` object and the corrected prose file, not on the stale machine `**Выборы:**` lists inside `book_text.md`. fileciteturn0file0 fileciteturn0file1 fileciteturn0file3

I verified one important negative result: I found **no `choice.target` that points to a non-existent paragraph** in the current `GD`. Fresh link problems in this report are therefore **semantic miswirings**, bogus parser-created choices, or missing gating, rather than dangling numeric targets. fileciteturn0file3

## Shop economy and gold map

The live gold economy is broad enough to support multiple spending paths, but it now has a split personality: **§340 works as a real shop**, while **§132 does not**. That matters because §132 is the first explicit full merchant paragraph in the early forest, and §63 even promises post-kill access to his goods. In practice, the player can currently buy nine things at §340, but cannot buy anything at all at §132. fileciteturn0file1 fileciteturn0file2 fileciteturn0file3

| Type | Paragraphs | Current live effect | Net |
|---|---:|---|---:|
| Start purse | pregame | Player starts with 15 gold | +15 |
| Major gold sources | §63, §335, §351, §462, §471, §482, §550, §929, §931 | Direct gold gains in current `auto_items` | +52 total |
| Informational / access payments | §2, §463, §548, §564, §562, §658, §785, §1092 | Choice-level `gold_cost` payments now wired | variable |
| Social / hospitality payments | §49, §630, §675, §695, §937, §552 | Direct bribes / gifts / food costs | variable |
| Hatch / mechanism spending | §686, §774, §903 | 1g / +4g / 5g style spend gates | variable |
| Working shop | §340 | 3 food buys + 6 inventory buys via `purchase:true` | up to −29 |
| Broken shop | §132 | No purchase mechanism in data despite priced goods in canon | 0 live spend |

This is the current §340 live item list, which is economically important because several of its items are genuine unlocks: `«Красивый кусочек дерева»` 1g, `«Фигурный ключ»` 2g, `«Блестящий кусок металла»` 3g, `«Серебряный браслет»` 4g, plus `«Попона для лошади»` 5g and `«Золотая устрица»` 8g. In current data, the first four have downstream value; the last two appear to have **no consumer anywhere in the present build**. fileciteturn0file1 fileciteturn0file3

The dominant-strategy pressure point is the trader cluster around §36 / §63. Canonically, killing him yields `«10 золотых»` and lets you `«взять с собой любой товар, который торговец предлагал»`; paying him costs 7 gold and yields only information. That is not a code bug by itself, but it is a clear **risk-reward spike** that can invalidate cautious play if the player can beat the fight. fileciteturn0file1 fileciteturn0file3

## Findings

1. **P1 — §132, §63. The forest trader’s full shop is text-only in the current build.**  
   Current data: §132 contains only `«Уйти (354)»` and `«Попробовать поговорить с ним еще (314)»`; there are no `purchase:true` choices, no `gold_cost` purchases, and no 9-slot bag transaction, even though the canon describes a full merchant inventory and explicitly says `«Если вы что-то хотите купить — покупайте»`. The bug is compounded by §63, which promises that after killing the trader the player may `«Загляните еще раз в параграф 132 и выберите то, что понравится»`, but the current §132 still cannot sell anything. This is a broken mechanic, not a balance preference. Evidence: `«Он предлагает вам свои товары: яблоко… мандарин… молоко… Если вы что-то хотите купить — покупайте»`; `«Если хотите, можете купить еще и заплечный мешок. Он стоит 7 золотых, но в него помещается больше чем в ваш: не 7, а 9 предметов»`; `«Загляните еще раз в параграф 132 и выберите то, что понравится»`. fileciteturn0file1 fileciteturn0file3

2. **P1 — §84, §496, §345, §1201. The `«шкура лисы»` chain is broken at both acquisition and consumption.**  
   Current data: §84 auto-grants `«Амулет»` immediately, even though the canon presents a mutually exclusive choice among three gifts; §496 then does **not** grant `«шкура лисы»`; and both fox-skin gate paragraphs (§345 and §1201) expose the fox-skin branch without `inventory_condition`. Canon requires a real picked item, then a gated consumer: `«Вы можете взять с собой одну из трех вещей… либо шкуру (496)»`, and later `«Если у вас есть шкура лисы, то покажите ее как образец»`. In the current build, the player can be shown fox-skin pass choices without ever obtaining the skin, while also incorrectly receiving the amulet by default. Evidence: `«Вы можете взять с собой одну из трех вещей: либо амулет (511), либо пояс (575), либо шкуру (496)»`; `«Ваш выбор падает на шкуру лисы»`; `«Если у вас есть шкура лисы, то покажите ее как образец товара»`. fileciteturn0file1 fileciteturn0file3

3. **P1 — §941, §749, §1122. The `«Песочные часы»` later-use item is not implemented as state.**  
   Current data: §941 exposes a direct clickable choice to §1122 (`«Когда они понадобятся, обратитесь к параграфу (1122)»`) instead of granting an item/token; §749 asks `«Есть ли у вас Песочные часы?»` but has no inventory-gated escape branch; §1122 exists, but it is reached by a premature direct jump rather than by possessing the item at the knife trap. Canon requires a deferred-use item chain: win `«песочные часы»`, carry them, and only later have them trigger at the trap. This is simultaneously a missing grant, a missing consumer gate, and a wrong immediate-choice exposure. Evidence: `«Вы проиграли все, что поставили, но зато выиграли песочные часы. Когда они понадобятся, обратитесь к параграфу 1122»`; `«Есть ли у вас Песочные часы?»`; `«Вдруг из мешка вылетают песочные часы и разбиваются о пол»`. fileciteturn0file1 fileciteturn0file3

4. **P1 — §1078, §1205, §249. The ship-badge consumer is miswired and mis-gated.**  
   Current data: §1205 correctly grants `«Бляха с парусным корабликом»`, but §1078 offers only one ungated choice labelled `«Попробовать открыть тайник бляхой с кораблём (634)»` and routes it to **§634**, which is the fallback corridor continuation, not the badge-use result. Canon says the badge-use result is §249: `«Если у вас есть бляха с кораблем, то попробуйте что-нибудь сделать, иначе придется идти до конца — 634»`, and §249 is the actual insertion scene: `«Вы достаете бляху и вкладываете в углубление в стене»`. So the current build loses both the required inventory gate and the correct target. Evidence: `«Вы без каких-либо сомнений можете взять ее себе (когда понадобится, обратитесь к параграфу 249)»`; `«Если у вас есть бляха с кораблем… иначе придется идти до конца — 634»`; `«Вы достаете бляху и вкладываете в углубление в стене»`. fileciteturn0file1 fileciteturn0file3

5. **P1 — §575, §1148. The mole-belt is exposed as an immediate jump instead of a later-use power.**  
   Current data: §575 shows a live clickable choice to §1148 right away, but the canon explicitly says this is a **future** use: `«Когда вы увидите замок, обратитесь к параграфу 1148»`. I also found no current item-state, token, or `consume_on_use` style handling attached to this ability. In practice, the player can invoke the mole from the bear den, long before `«увидите замок»`, which is a rules break. Evidence: `«С его помощью можете в любой момент… позвать на помощь крота»`; `«Когда вы увидите замок, обратитесь к параграфу 1148»`; `«Теперь же пора выбираться из берлоги — 281»`. fileciteturn0file1 fileciteturn0file3

6. **P1 — §511. A bogus parser-created choice sends the player to §10 from a stat line.**  
   Current data for §511 contains an extra choice `«Ее МАСТЕРСТВО — 8, а ВЫНОСЛИВОСТЬ (10)» → §10`. That is not a canonical choice; it is a stat sentence misread as navigation. Canonically the paragraph should only conclude with leaving the cave: `«Поблагодарив медведицу, вы собираетесь вылезать из берлоги — 281»`. This is a clean link/target integrity failure. Evidence: `«Ее МАСТЕРСТВО — 8, а ВЫНОСЛИВОСТЬ — 10»`; `«Поблагодарив медведицу, вы собираетесь вылезать из берлоги — 281»`. fileciteturn0file1 fileciteturn0file3

7. **P2 — §388, §411, §742, §1210. Several “show the item” bypasses are still missing `inventory_condition`, so they are visible before combat / instead of fallback flow.**  
   Current engine behavior matters here: while a combat paragraph is pending, `renderChoices()` still renders **all pre-combat non-`post_combat` choices** that pass gating. If a “show item” choice lacks `inventory_condition`, the player sees the bypass whether or not they own the item. I verified this pattern in at least four places: §388 (`«Если у вас есть Оберег… Если есть серебряный сосуд…»`), §411 (`«Если у вас есть золотая стрела…»`), §742 (same pass-item pattern), and §1210 (`«Если у вас есть Оберег… если есть серебряный сосуд…»`). These are not mere cosmetic labels; they are live pre-combat buttons. Evidence: `«Если у вас есть Оберег, то 26. Если есть серебряный сосуд, то 739»`; `«Если у вас есть золотая стрела, вы можете попробовать открыть дверь»`; `«Если у вас есть Оберег, то 764, если есть серебряный сосуд, то 556»`. fileciteturn0file1 fileciteturn0file2 fileciteturn0file3

8. **P3 — §340. Two merchant items appear to be pure dead-weight purchases in the current build.**  
   In the current data, I could verify downstream consumers for `«Красивый кусочек дерева»`, `«Фигурный ключ»`, `«Блестящий кусок металла»`, and `«Серебряный браслет»`, but I could not verify any consumer for `«Попона для лошади»` or `«Золотая устрица»`. Because §340 tells the player these are things that `«могут пригодиться в дороге»`, their current implementation behaves as a gold trap, not as a meaningful choice. I would treat this as a **balance/design note**, not a bug, unless the canon really intended them as total red herrings. Evidence: `«Это красивый кусочек дерева… фигурный ключ… попону для лошади… сделанную из золота устрицу… и серебряный браслет»`. fileciteturn0file1 fileciteturn0file3

9. **P3 — Combat damage outlier sweep produced no fresh bug.**  
   I verified the engine default damage rule (`enemy.damage || 2`) and re-scanned the corrected canon wording for explicit non-default per-hit damage. The only explicit cases I could verify are §36 (`«вычитайте у себя не 2, а 4 ВЫНОСЛИВОСТИ»`) and §240 (`«вычитайте не 2, а 3 ВЫНОСЛИВОСТИ»`), and both are already encoded in the current data. I found no additional fresh paragraph whose canon clearly requires a non-default `damage` field but is still left at default. fileciteturn0file1 fileciteturn0file2 fileciteturn0file3

10. **P3 — Spell economy remains visibly imbalanced, but this pass did not complete a trustworthy exact per-spell recount.**  
   The registry already classifies spell-economy concerns as a design note, not a bug, and that still looks right. What I can verify confidently is qualitative: `«Иллюзия»` and `«Исцеление»` remain weak picks relative to `«Левитация»`, `«Огонь»`, and the combat-modal trio (`«Сила»`, `«Слабость»`, `«Копия»`). The registry’s own note still describes `ILLUSION` / `HEALING` as roughly **1–2 uses each** across the book, while the broader spell audit counted **132 total spell mentions** and later combat-engine work completed the modal combat support. I am therefore comfortable keeping the balance verdict, but **not** claiming a fresh exact per-spell paragraph count from this constrained pass. fileciteturn0file0 fileciteturn0file2 fileciteturn0file3

## Spell balance notes

The one design conclusion I would preserve even without a new exact recount is that the current spell roster is **not** close to flat in pick value. `«Левитация»` and `«Огонь»` carry repeated mandatory or near-mandatory checkpoint logic; `«Сила»`, `«Слабость»`, and `«Копия»` now benefit from full in-combat support; `«Плавание»` has real route utility; while `«Иллюзия»` and `«Исцеление»` remain low-density picks. I would therefore keep any spell rebalance recommendation at **P3 only**: a character-creation warning or UI hint would fit, but changing the canon spell distribution would be a design alteration, not a correctness fix. fileciteturn0file0 fileciteturn0file2

## Open questions and limitations

I verified the highest-confidence broken chains above, but I did **not** complete a full-file manual sweep of every later-use token paragraph in the book; the fresh issues at §575, §941, and §1205 strongly suggest there may be more parser-created “future-use now” links in the same family. I also did **not** finish a clean exact per-spell usage table, so the spell section is deliberately qualitative where I could not verify counts directly in this pass. fileciteturn0file0 fileciteturn0file1 fileciteturn0file3

## Final summary

I am reporting **0 P0, 6 P1, 1 P2, and 3 P3** findings. The single highest-confidence finding is **§132**: the canon explicitly presents a full priced merchant with `«Если вы что-то хотите купить — покупайте»`, but the live data exposes no purchase mechanism there at all, making the entire shop and bag-upgrade economy non-functional in the current build. fileciteturn0file1 fileciteturn0file3