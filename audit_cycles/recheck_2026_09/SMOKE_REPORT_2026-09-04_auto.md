# SMOKE_REPORT.md - automated live smoke (Playwright over the installed Chrome, headless)

- URL: http://localhost:8001/dist/podzemelye-chyornogo-zamka-remake.html
- Date: 2026-09-04T23:27:48.787Z - run time 113 s
- Viewports: desktop 1440x900; phone 412x915 (isMobile, touch); landscape 915x412
- Mode: grey-box - real buttons/keys/F5 through the DOM, assertions through the DOM and the game globals (S, combatState); screenshots <id>.png next to this file

| id | verdict | observation |
|---|---|---|
| S0 | PASS | title screen rendered, document.title=Подземелья Чёрного замка |
| S1 | PASS | #1131 riddle input=true answer button=true heading=Ваш выбор hero=Тестер |
| S2 | PASS | #1 sidebar mini-map visible=true open-button=true svg=true |
| S3 | PASS | menu on=true note="Автосохранение: §1 · 19:26" z=101 role=dialog |
| C14 | PASS | Forum loaded=true Cinzel=true Cormorant=true menu h2 family=Cinzel, Forum, "Cormorant Garamond", serif weight=400 loaded=Cinzel, Cormorant Garamond, Forum |
| C15-132 | PASS | reader 859px, gaps 131/131, choices=25 heading=Ваш выбор inFlow=true lastReachable=true |
| C15-340 | PASS | reader 859px, gaps 131/131, choices=15 heading=Ваш выбор inFlow=true lastReachable=true |
| C16 | PASS | portrait: hud=true (72px) sidebar=false fab=false btns=6; sheet=true inv+flask=true title="Заплечный мешок (0/7)"; after Esc: closed=true nodesHome=true; landscape 915: hud=false sidebar=true (260px) |
| C17-phone | PASS | CA-17 gate: M over an open sheet opens the map=false (expected false); Esc closes the sheet=true; then M opens the map=true; Esc closes it=true |
| B5 | PASS | tap targets eat=44x44 drop=44x44 tags=BUTTON/BUTTON aria="Выбросить: Яблоко (еда: +2)" |
| C17-keyboard | PASS | tabbed to BUTTON aria="Выбросить: Яблоко (еда: +2)" focus-visible=true outline=solid 2px; Enter dropped item: 2->1 focus now=inv-remove |
| C19 | PASS | F5 mid-fight (hp 11/11, round 1) -> modal open=false, re-enter hp=11 round=0; Esc keeps combat=true; M blocked over combat=true; RU-layout M opens map=true; log: open=true focus=event-log-close -> Esc closed=true focus=event-log-btn; SR status="— Раунд 1 — · Вы: 2к6(6) + 12 = 18 · ГОБЛИН: 2к6(11) + 8 = 19 · → ГОБЛИН ранил в" |
| C18-131 | PASS | goblin killed by Copy -> eagle active=true joined=true waiting-branch=false log tail=" на ГОБЛИН!Копия: Мастерство 8, Выносливость 11👤 Копия победила ГОБЛИН! Враг повержен.✦ Орел-часовой вылетает из ниши над вашей головой и присоединяется к бою!" |
| C18-203 | PASS | roll {"a":4,"b":4,"lucky":true} (luck dialog=true); after F5 record={"a":4,"b":4,"lucky":true} luck button offered again=false death overlay=false choices=1 |
| C10 | PASS | roll {"a":5,"b":1,"ok":false,"tgt":126} -> after F5 {"a":5,"b":1,"ok":false,"tgt":126} roll button=false continue=true text="🎲 5 + 1 = 6Продолжить" |
| C11 | PASS | n=2 after F5 n=2 pickup offered=true reroll=false; refused -> revisit: done=true pickup=false continue=true |
| C12 | PASS | unlucky roll persisted=true; F5 after roll: reroll offered=false choices="⚔ Драться с пауком на дереве \| 💪 Однако вы можете воспользоваться заклятиями либо Силы (5"; clicked "💪 Однако вы можете воспользоваться заклятиями либо Силы (526) [2]" -> section=526 flag=true; back on 436 + F5: flag=true fight+1 button=true reroll=false |
| C13 | PASS | buy "💰 Купить красивый кусочек дерева — 1 зол." gold 50->49, after F5 gold=49 shopBought={"340":[6]} disabled="✓ Купить красивый кусочек дерева — 1 зол"; batch "Сорвать два кокоса (+3 ВЫН каждый)" -> after F5 batchPicked={"585:0":true} done=true bag=wood_piece,coconut,coconut |
| C1 | PASS | modal=true found="НАЙДЕНО:Арбуз (еда: +4) 🍴 Съесть сразу+ Взять" eatNow=true; full stamina -> 24 notice="🎒 МешокВыносливость уже полная"; at 10 -> 14 take disabled=true |
| C2 | PASS | bag="Кокос (еда: +3)🍴🗑Кокос (еда: +3)🍴🗑" slugs visible=false |
| C3-A2-C8 | PASS | 553 take: inv=whole_sword used=0; 71: inv=death_of_orcs used=0 modal=false notice="🎒 Мешок · − Целый меч — оставлен взамен нового · + Меч «Смерть Орков»"; 1213: inv=death_of_orcs,knight_shield used=0 modal=false; 617 with DoO: orc hp=0 goblin active=true flee buttons="✦ Попробовать убежать (165)" |
| B2 | PASS | cards=3 waiting pill=true hp elements=18 aria-pressed= |
| B3 | PASS | art shown=true pressed=true -> toggled hidden=true pressed=false |
| C4 | PASS | lion killed by Copy -> lioness active=true join line=true premature Continue=false |

## Counts

- PASS: 24

## Anomalies (page errors / console errors during the run)

- none
