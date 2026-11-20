# BRIEF — full live smoke run after the Gemini 4 Carbon repairs (ChatGPT browser agent, 2026-11-19)

**Build under test:** https://yvashchuk.github.io/DotBC/ — the short link redirects to the published game and keeps `#N` anchors. Stay on that site and its `#N` anchors only. It is the build of `main` at `73d2d24` (registry v2.212).

**Archive:** the attached ZIP is the repository at the commit that carries this brief (the root folder name carries the hash; `dist/audio/` — 600 MB of narration — was stripped before packing; on the live site it is present). It is a read-only reference: read the checklist, the rules and the data there; never modify it and never use it to alter the running game.

**What changed since your last run (2026-11-17, build `81eb997`).** Three review tracks by Gemini 4 Carbon were adjudicated and fixed (registry `assets/text_corrections.json`; readable digest `audit_cycles/recheck_2026_11/REGISTRY_DIGEST.md`):
- **group_107** — the text-vs-engine sweep of all 1221 paragraphs (61 fixes): the book's arithmetic on 13 «islands» (the +40 keys, the bear key, the key «Всё»), item powers by the author's decision (the copper ring, the black pearl and the Green Knights' eyes, the flying carpet and the diving suit, the children's secret), the goldfish rescue inside the luck window (§203), the §724 set through the pick-up dialog, stakes chosen before the roll, the tavern candle with the flint;
- **group_108** — the engine audit (16 fixes): after a victory only the exits after the fight; the pick-up dialog and the trophies survive F5; an import starts from a clean state; `#146` typed in the address bar; exits follow the bag and the flask at once; Healing and Indifference do nothing after death; the riddle of §435 wants the hyena in every language;
- **group_109** — the translation sweep: a riddle answer typed with its article («la toile», «the web»), the labels of §348 and §641 in four languages, the Ukrainian §592 and §724, the French names; the author's decision: the old man's secret door opens only in the castle wall at §70, not at the gates;
- **group_110** — tests and documents only (no game change).

Rows **C58–C70** of `MANUAL_SMOKE_CHECKS.md` were written for these repairs and have never been run by an outside tester. The maintainer's automated runs pass on this build (smoke 32/32, gate probes 28, branch probes 7, fidelity probes 137); this run is the reader's view through a real browser.

## 1. Read first

- `MANUAL_SMOKE_CHECKS.md` — the checklist and the source of truth: **92 rows** (A1–A17 combat, B1–B5 interface, C1–C70 verification). Columns (Russian): «Вход» = where to start, «Подготовка» = preparation, «Шаги» = what to do, «Ожидаемо» = what must happen.
- `audit_cycles/recheck_2026_09/SMOKE_BRIEF_chatgpt.md`, sections 1–3 — how to drive the game (interface glossary), verdicts and evidence. Its tables are an older English rendering of rows A, B and C1–C19: where they differ, the Russian row wins.
- `assets/GAME_RULES.md` — the rules as the engine implements them, when a row's expectation needs context.

## 2. Pre-flight (opens your report)

1. The exact URL after the redirect, the browser, the window size, date and time.
2. Build signatures — both must hold: (a) `#641` shows exactly one exit «Продолжить (717)»; (b) open `#1`, click any choice, then type `#146` in the address bar: both exits «Если пришли с §205 — перейти к §933 (933)» and «Если пришли с §56 — перейти к §1054 (1054)» are offered and there is no «Гибель». If a signature fails, stop and report: the site serves an older build.
3. What you can do: reload keeping storage (F5); make the window narrower than 480 px; use the keyboard (Tab / Enter / Esc / M); switch the interface language (☰ Меню); upload a file. A row that needs what you cannot do is BLOCKED (say why); sound is N/A.

## 3. Heroes

- **Clean start (the tester hero).** ☰ Меню → «🗑 Новая игра» → «Да» erases the save and returns to the title; then type `#N` in the address bar: the page reloads onto paragraph N with the tester hero «Тестер» (МАСТЕРСТВО 12, ВЫНОСЛИВОСТЬ 24, УДАЧА 12; Огонь 2, Исцеление 2, Сила 2, Слабость 2, Копия 1, Плавание 1). The checklist assumes this hero unless «Подготовка» says otherwise.
- **Created hero.** When «Подготовка» names spells or their absence, create the hero from the title with those spells (10 points; put the rest into Исцеление / Сила / Слабость).
  - Block 1: **Огонь 2, Копия 2, Исцеление 2, Сила 2, Слабость 2** — no Левитация and no Плавание (C58, C60, C63).
  - Block 3: **Левитация 2, Исцеление 2, Огонь 2, Сила 2, Слабость 2** — no Копия (C47); for the `#944` part of C53 a separate hero with exactly one Плавание charge.
- After that, a `#N` typed in the address bar keeps the hero and the bag: an item taken at one paragraph is still in the bag at the next. A row that says «новая игра» starts clean. Items are offered in the pick-up dialog — take them with «+ Взять».

## 4. Blocks (in this order)

| Block | Rows | Theme |
|---|---|---|
| 1 | C58–C70 | the Carbon repairs: the goldfish after a failed roll (§203); the §724 set through the pick-up dialog; the +40 keys and the key «Всё»; the copper ring; the black pearl and the Green Knights' eyes; the flying carpet and the diving suit; the spell picker, the stakes, the flight at §455; the exits after a victory (§388); the pick-up dialog across F5; `#146`; the eaten food (§597); the hyena in English; the French answers with their articles |
| 2 | M1–M3 | the maintainer's tasks (section 5) |
| 3 | C32–C57 | the November rows, run again because groups 107–109 changed the pick-up dialog, the gates, the flasks, the trophies and the old man's door (C43 is new: the door only at §70) |
| 4 | C1–C31 | the verification cycle and the interface (C14 — the four languages; C16, C17 — the phone parts are BLOCKED without a narrow window; C27, C28 — sound, N/A) |
| 5 | A1–A17 | combat mechanics |
| 6 | B1–B5 | the interface |

## 5. The maintainer's tasks (block 2)

- **M1 — the translated labels of group_109.** Switch the language in ☰ Меню and look: `#641` — «Continue (717)» / «Continuer (717)» / «Продовжити (717)»; Ukrainian `#19` — «Присісти відпочити (167)»; Ukrainian `#724` — «Повернутися й оглянути ще щось у спальні (980)»; French `#54`, `#79`, `#198`, `#747` — the Lesovichok is «Petit Homme des Bois» everywhere (at `#198` the exit reads «Dire adieu au Petit Homme des Bois et poursuivre la route (54)»); French `#16` and `#182` — the diving suit is «scaphandre»; French `#144` — «salle du conseil». Return to Russian at the end.
- **M2 — a narrow window** (only if you can make the window narrower than 480 px; otherwise BLOCKED): with the ring «Кольцо» (`#88`) and «Чёрная жемчужина» (`#457`) in the bag, `#96` — two power buttons; `#76` — the spell picker; `#455` → «⚔ Вступить в бой» — the flee button; `#1214` — the pick-up dialog, then F5. Every button fully visible and at least about 44 px high, no horizontal scroll.
- **M3 — the old man's road as a reader** (after blocks 1 and 3, if time allows): a clean start at `#76`; take what the old man gives (the deer hide; «Тайна потайной дверцы» appears in the bag); `#452` → «Направо по лесу…» → §70 → «Открыть потайную дверцу, о которой рассказал старичок (1145)» → §1145; then read on through the castle for about 20 paragraphs, choosing as a reader would. Report every place where the screen contradicts the text: an exit the text forbids, an item the text gives that the bag lacks, a fight the text does not have.

## 6. Rules

- Only clicks, typed answers and the keyboard — no DevTools, no console, no storage editing, no URL other than the game and its `#N`.
- Report only what you saw; quote the screen verbatim (Russian, or the language the row uses). Zero findings in a block is a valid result.
- Not defects (documented behaviour): F5 during a fight restarts it with full enemy stamina (C19); a language cannot be switched inside an open combat, luck or pick-up dialog — enter each language separately (CHECK-01); §391 without Плавание, Левитация or the diving suit ends the adventure, as in the book.
- One screenshot per FAIL or UNCLEAR at the decisive moment, plus one per block.
- After each block, write its results into the report draft and print a one-line progress note.
- If the browser dies or the session runs out, do not retry: deliver the partial report and list the rows not run. A continuation run (first message «Continue: …») creates its heroes again and does not repeat rows already PASS.

## 7. Deliverable

`REPORT_chatgpt_smoke_2026-11-19.md`:
1. the pre-flight;
2. one line per row and task: `id | verdict (PASS / FAIL / BLOCKED (reason) / UNCLEAR / N/A) | one-line observation`;
3. a findings table `id | row | § | screen quote | expected | class (game / checklist / environment) | severity (P0–P3)`;
4. an anomalies JSON — `[{id, row, section, screen_quote, expected, class, severity, fix}]`;
5. the screenshots in one ZIP.

Offer the files for download and print the report in the chat.
