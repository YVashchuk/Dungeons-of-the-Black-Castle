# SMOKE BRIEF — live acceptance run of the built game (recheck cycle 2026-09)
## For ChatGPT (agent mode with a browser) — or as the evaluator of screenshots taken by a human

**What this is.** `MANUAL_SMOKE_CHECKS.md` in the repository is the human acceptance checklist of the JS gamebook remake «Подземелья Чёрного замка»: 41 live checks (A1–A17 combat mechanics, B1–B5 interface, C1–C19 verification cycle) that no automated harness covers because they need a real browser (layout, fonts, focus, reloads). Your job is to **perform** them (Mode A) or **judge** them from screenshots (Mode B) and deliver `SMOKE_REPORT.md`. You do not change anything; you observe and report. Findings are hypotheses; the maintainer adjudicates.

**Build under test:** the `main` branch build hosted on GitHub Pages:
`https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html`
(the human will confirm the exact URL in the first message). The game is one HTML page; art loads from `dist/art/` next to it.

**Rules.** Stay on that URL (plus its `#N` anchors); no other web use. Report only what you saw; if a step cannot be performed in your environment, mark the check `BLOCKED` with the reason — never guess. One screenshot per check at the decisive moment (two if the check has a before/after). Keep the interface in Russian unless a check says otherwise (C14 switches languages).

---

## 1. How the game works (what you need to drive it)

- **Hash entry.** Appending `#N` to the URL and loading it opens paragraph N directly. With no saved game in the browser it creates a **tester hero**: name «Тестер», МАСТЕРСТВО 12, ВЫНОСЛИВОСТЬ 24, УДАЧА 12, 15 gold, flask 2 sips, spells 🔥 Огонь 2 · 💚 Исцеление 2 · 💪 Сила 2 · 🫀 Слабость 2 · 👤 Копия 1 · 🌊 Плавание 1, and it applies the paragraph's first-visit effects (items given by that paragraph). With a saved game present, hash entry **reuses the save** and only jumps to N — state (bag, spells, gold) carries over between checks. To get a clean tester hero again: open the URL in a **new private/incognito window** (fresh storage). Reloading the page (F5) keeps the save — that is exactly what several checks test.
- **Layout (desktop).** Left sidebar: hero stats («Мастерство / Выносливость / Удача»), «Заклятия» (spells with charges), «Заплечный мешок» (bag; each item has 🍴 eat for food and 🗑 drop), «Записки», the mini-map card with «Открыть», bottom buttons «☰ Меню» and «📜 Журнал». Main column: paragraph number `§ N`, illustration, text, then the heading «Ваш выбор» with the choice buttons in the same scroll. Bottom-left dock: pills «🌫 Атмосфера» / «🖼 Иллюстрации». Menu (☰): language picker, «💾 Экспорт сохранения», «📂 Импорт сохранения», «Начать заново», «← Закрыть», plus a line «Автосохранение: §N · HH:MM».
- **Combat.** A paragraph with enemies shows «⚔ Вступить в бой». The combat dialog «⚔ Бой!» has enemy cards (click a card to choose the target; the chosen one shows a gold ring and the line «🎯 Цель: …»; waiting enemies show «ожидает», dead «повержен», fled «убежал»), the round button «Удар!», spell buttons «👤 Заклятие Копии [n]», «💪 Заклятие Силы [n]», «🫀 Заклятие Слабости [n]», sometimes «🕷 Разломить личинку [n]», and a combat log. Victory shows «✦ Победа!» and «Продолжить»; special exits show a «✦ …» button. «⏳ Оставшиеся противники выжидают — вы переводите дух…» means the fight is open with only waiting enemies.
- **Luck.** «🎲 Проверить удачу» opens the luck dialog; after the roll it shows the result and a continue button (or «Конец приключения» on a fatal outcome).
- **Dice.** «🎲 Бросить кубик» renders the result and «Продолжить» (or «🕷 Подобрать личинок (n)» for larvae).
- **Items offered.** Some paragraphs open the offer dialog with «+ Взять», «Съесть сразу» for food, and the bag contents with 🗑; «✓ В мешке» marks an already-carried item.
- **Riddles.** A riddle paragraph shows an input field, «Ответить» and sometimes an exit button; a wrong answer shows «Неверно. Осталось попыток: N».
- **Keyboard.** Tab/Shift+Tab move between controls, Enter/Space activate, Esc closes the topmost dialog (never combat/luck/death), **M** toggles the map (only on the game screen and only when no other dialog is open).

## 2. Pre-flight (opens your report)
1. The exact URL you tested, the browser and viewport size, the date/time.
2. Build signatures (all three must hold — they exist only in builds from 2026-09-04 or later): (a) `#1131` shows a riddle input field with «Ответить» under the heading «Ваш выбор»; (b) on `#1` the desktop sidebar contains a mini-map card with an «Открыть» button; (c) ☰ Меню shows the line «Автосохранение: §1 · HH:MM» after at least one paragraph render. If any is missing, STOP: the deployed build is stale.
3. Whether you can (i) reload the page keeping storage, (ii) open a private window, (iii) resize/emulate a 412×915 viewport, (iv) use the keyboard (Tab/Esc/M). Checks that need what you cannot do are `BLOCKED`.

## 3. Verdicts and evidence
`PASS` — every expectation observed · `FAIL` — an expectation not met (describe exactly what you saw) · `BLOCKED` — cannot perform (reason) · `UNCLEAR` — performed but the expectation is ambiguous (explain). Attach one screenshot per check named `<id>.png` (e.g. `C18.png`), taken at the decisive moment; when a check has a before/after (F5 checks), attach both (`C10-before.png`, `C10-after.png`).

---

## 4. Block C — verification cycle (do these first)

| id | entry | preparation | steps | expected |
|---|---|---|---|---|
| C1 | `#389` | fresh tester hero (private window); then repeat with the bag full (add items via other paragraphs) and with full stamina | The offer dialog for the watermelon | Item named «Арбуз (еда: +4)» (never `[object Object]`); a «Съесть сразу» button that works even with a full bag; with full stamina — a normal notification instead; after eating, «+ Взять» is greyed |
| C2 | `#585` | — | Collect the coconuts with the gold collect button; open the bag / HUD | Bag and HUD show Russian names («Кокос» etc.), never slugs like `coconut` |
| C3 | `#71`, then `#1213` | first with the sword from `#553` (take it), then without | Just enter | Mandatory hand-out with no dialog: the sword is swapped when you have one, the shield is always given; nothing can be closed/skipped |
| C4 | `#177` | a Copy charge (tester hero has 1) | Kill the lion with «👤 Заклятие Копии» | The lioness **joins** («✦ В бой вступает: …»), the fight continues — no premature «Продолжить» |
| C5 | `#388` | — | Kill both active knights before round 11 | «⏳ Оставшиеся противники выжидают…» and the fight stays open; on round 11 the third knight joins |
| C6 | `#116` | — | Before the first «Удар!» click the **waiting** second orc | Red selection ring; round 1 log line «✦ Слабость: Второй Орк (−2)»; when he joins he attacks at −2 |
| C7 | `#617` → win → `#43` | — | Win the §617 fight completely, then go to §43 | After the win no «✦» exit next to «Продолжить»; in §43 no leftover button from the previous fight |
| C8 | `#617` | the sword «Смерть Орков» (get it via `#553` → take → `#71`) | Enter the fight | The orc falls at the start → the goblin becomes active → the «✦» flee button is available **immediately**, not a round later |
| C9 | `#532` / `#994` | a larva (from `#932`) or a Copy charge | Kill instantly (larva / Copy) | After «Продолжить» the «✦» conditional choice is offered — no empty screen |
| C10 | `#781` | — | Roll the dice, then F5; later re-enter via `#781` | After F5 the SAME result and outcome (no reroll); re-entry shows the resolved screen with «Продолжить» immediately |
| C11 | `#932` | free bag slots | Roll, F5 — same n and the unfinished pickup; then «Продолжить» without picking, re-enter | After F5 no new roll (same n visible); after refusing, re-entry shows only «Продолжить» |
| C12 | `#436` | Force ≥ 1 charge (tester hero has 2) | Fail the luck check → choose «Заклятие Силы» → come back from §526 → **F5 before clicking «Драться»** | After F5 the button «⚔ Драться (заклятие Силы: +1 к СИЛЕ УДАРА)» is still there — no second luck roll, the Force charge not burned |
| C13 | `#340` / `#585` | gold ≥ price | Buy the one-shot item, F5; on `#585` collect the batch, F5 | After F5 the purchase is marked bought (no second gold charge); the batch shows «✓ Собрано» |
| C14 | title / `#1` | language RU or UK; then EN/FR | Open the title, the menu, the map, a fight; switch languages in ☰ Меню | RU/UK headings and buttons render in an inscriptional capitals face (Forum), not a system Times; EN/FR use Cinzel; headings are regular weight (no fake bold) |
| C15 | `#132` / `#340` | desktop ≥ 1400px wide | Open the long paragraph (25 / 15 choices) | Text sits in a centred column of ~70 characters; the choices follow the text under «Ваш выбор» in one scroll; the last choice is reachable by scrolling |
| C16 | `#1` | phone ≤ 700px (or 412×915 emulation) | Open the game; tap ✨ / 🎒 / 📝 in the HUD; close the sheet; rotate to landscape | No sidebar — a top HUD (name, ⚔♥✦ chips, gold, six buttons); sections slide up as sheets and return on close (bag / spells still work inside); no floating log button |
| C17 | `#1` | keyboard; phone for the second half | Tab to the 🍴/🗑 buttons in the bag, press Enter; on a phone open a sheet, press M, then Esc, then M and Esc again | 🍴/🗑 get a focus ring and work from the keyboard; with a sheet open M does nothing (hotkey gate), Esc closes the sheet, then M opens the map and Esc closes it; during a fight the hidden status line updates after every round (accessibility tree / screen reader) |
| C18 | `#1131` / `#131` / `#203` | Copy or larva; keyboard | On `#1131` the riddle widget; on `#131` kill the goblin with Copy / larva; on `#203` roll luck and F5 | Input field and «Ответить» present; the eagle joins **immediately** after the goblin dies; after F5 the roll is not repeated (same outcome shown); after a fight focus lands on the first choice |
| C19 | `#36` / `#1` | desktop; Russian keyboard layout | Start a fight and press F5; look at the sidebar; press M in the Russian layout; open «📜 Журнал» and press Esc | The fight restarts with full enemy stamina (documented rule); the sidebar shows the mini-map card; M opens the map in any layout; Esc closes the log panel and focus returns to its button |

## 5. Block B — interface

| id | entry | preparation | steps | expected |
|---|---|---|---|---|
| B1 | `#132` and `#340` | desktop + phone | Scroll the choices | 25 / 15 buttons in one scroll with the text; the first visible at once, the last reachable; no nested scroll trap |
| B2 | `#628` | — | Open the fight | Status pills for all four states (в бою / повержен / ожидает / убежал) and visible HP bars with a red gradient |
| B3 | any paragraph with art, e.g. `#38` | — | Bottom-left dock «🌫 Атмосфера / 🖼 Иллюстрации» | The illustrations toggle really hides/shows the picture; active pills glow gold |
| B4 | spell selection screen | new game (title → create hero) | Press + / − | Live line «N из 10 выбрано»; minus disabled at zero, all pluses disabled at ten; big buttons (44×44) |
| B5 | mobile view ≤ 900px | phone / emulation | Tap 🍴/🗑 in the bag and the map buttons | Tap targets ≥ 44px; muted text and red are clearly readable |

## 6. Block A — combat mechanics (if time permits, in this order)

| id | entry | preparation | steps | expected |
|---|---|---|---|---|
| A1 | `#240` | — | Six snakes: click different cards between rounds | Gold ring on the chosen one, line «🎯 Цель: …», the chosen one takes the wounds; snake damage ×3 in the log |
| A2 | `#553` → «Взять меч» → `#71` | — | Take the whole sword, then enter the storeroom §71 | Notifications «− Целый меч — оставлен взамен нового» and «+ Меч «Смерть Орков»»; the bag lost no slots (weapons are weightless) |
| A3 | `#628` | «Смерть Орков» in hand (A2) | Start the orc fight | The leader falls **before round 1** («⚔️ «Смерть Орков» разит…»), the two others join immediately |
| A4 | `#1213` | — | Enter and take the shield | The shield is guaranteed in hand (automatic; the dialog cannot be closed/skipped) |
| A5 | `#1130`, then any fight | sword (A2) + shield (A4) ideally | Drink the potion, start a fight | The roll line contains «+7» (sword + shield + potion); after **three own kills** — «Зелье потеряло силу» (Copy / bear kills do not count) |
| A6 | `#43` | — | Two orcs: (a) win within 10 rounds; (b) drag it out | (a) automatic route to §1082; (b) at the start of round 11 — «время вышло», exit to §1016 |
| A7 | `#261` / `#737` / `#1099` | — | Same as A6 for deadlines 3 / 5 / 3 | §261: win→520, lose→8; §737: win→391, lose→182 (fight continues); §1099: overtime = death overlay |
| A8 | `#781` | — | Dice check | Honest 2d6 widget, threshold ≥ 10: success → 863, fail → 126; no free choice of outcome |
| A9 | `#725` | — | Bash the door several times | Each roll −1 ВЫН in the log; success on a double 1 or 6 → 1215; death at 0; exits → 393 / 246 and the Golden Whistle gate → 142 present |
| A10 | `#932` | free slots | Roll, pick larvae; then in any fight press «🕷 Разломить личинку» | d6 larvae limited by free slots; in a fight the larva instantly kills the **current target** |
| A11 | `#582` / `#585` / `#801` / `#1140` / `#724` | bag at various fill levels | Press the gold collect button | Hand-out up to the free slots (round-robin on §582), «мешок полон» on overflow, the button becomes «✓ Собрано» and stays so after F5 / re-entry |
| A12 | `#812` | gold < 2 and ≥ 2 | Look at the «попросить накормить» choice | With < 2 gold the choice to §675 is hidden; with ≥ 2 — entry, −2 gold, +5 ВЫН on §675 |
| A13 | `#873` | gold ≥ 1 | Buy the fish (goes to §922) | −1 gold on the edge; §922 gives +2 ВЫН |
| A14 | `#46` | — | Defeat one of the two knights | A «✦» conditional exit → 98 appears (log «вы сразили одного противника») |
| A15 | `#617` | — | Phase 1: no fleeing; kill the orc → the goblin joins | The «✦» flee (−2 ВЫН) is available only in phase 2; after a full win no flee button |
| A16 | `#116` / `#655` / `#470` | — | Go through the targeted-Weakness bridges | In round 1 the −2 debuff lands on the chosen target (see C6), log «Заклятие Слабости: …(−2)»; changing the target afterwards does not move the debuff |
| A17 | `#39` / `#865` / `#160` | — | Modifier bridges | §39→46: player −2; §865→96: enemy +2 (backfire); §160→46: Force +2 without spending in the fight (the charge was spent at the source) |

---

## 7. Report format — `SMOKE_REPORT.md`
0. **ENVIRONMENT** — URL, browser, viewport(s), date; the three build signatures; your capabilities (reload / private window / emulation / keyboard).
1. **RESULTS** — table `id | mode (A agent / B human-run) | verdict | what you observed (one or two sentences, Russian UI text quoted verbatim) | screenshot | notes`. Every id from §4–§6 must appear (`BLOCKED` with a reason is fine).
2. **ANOMALIES** — anything unexpected outside the checklist (errors, layout breaks, wrong text, dead buttons), each with steps to reproduce and a screenshot.
3. **COUNTS** — PASS / FAIL / BLOCKED / UNCLEAR.
Mode B evaluators: fill the same table from the screenshots the human provides, quoting what the screenshot shows; mark `UNCLEAR` when the screenshot cannot prove the expectation, and list what additional screenshot would settle it.
