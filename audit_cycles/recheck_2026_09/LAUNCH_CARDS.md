# LAUNCH CARDS — как запускать recheck-цикл 2026-09 у провайдеров

Бриф один (`BRIEF.md`, EN), треки два (A — UI/a11y, B — механики) + опциональный Track C (только стандарты, web). Комплекты файлов уже разложены:

- `_handoff/audit_upload_2026_09/trackA/` — 10 файлов, ~0.4 MB
- `_handoff/audit_upload_2026_09/trackB/` — 10 файлов, ~1.4 MB (самый тяжёлый — `book_text.md` 904 KB)

В каждом комплекте лежит копия `BRIEF.md` — прикладывать вместе с остальными, bare-именами, без путей в тексте сообщения.

**Порядок:** сначала Track A (самая свежая работа — UI этапов A/B), потом Track B. Track C — в любой момент параллельно, он не зависит от остальных. Результаты — `REPORT.md` (или PDF) на трек; отдаёшь мне, я верифицирую и открываю/пополняю group_81.

---

## 0. Статус прогонов (обновляется)

| Дата | Провайдер | Трек | Итог |
|---|---|---|---|
| 2026-09-04 | Gemini 3.1 Pro (обычный чат) | A | **принят**: `REPORT_gemini_trackA.md`, SHA-256 `d437b031…8641`; 4 находки (2 P1 + 2 P2) → group_81 UA-01…UA-04, закрыты батчем 1 (`79124a5`) |
| 2026-09-04 | Gemini 3.1 Pro | B (чистый комплект) | **не запустился**: `game_structure.js` пришёл обрезанным на §848, модель корректно остановилась по правилу пре-флайта |
| 2026-09-04 | Gemini 3.1 Pro | B (объединённый A+B) | **списан** по accuracy guard: пре-флайт назвал неверный первый заголовок выжимки (UI-01 вместо V-01), находки ссылаются на несуществующие поля/файлы (`pre_combat_exits`, `combat_paragraphs.jsonl`, `art30_three_knights`); три B-находки проверены по канону и **отвергнуты** (реестр `resolved_no_op`: UB-01/02/03). Архив: `REPORT_gemini_trackB_combined.md`, SHA-256 `bc5e456d…3659` |
| 2026-09-04 | Gemini Deep Research | C | **не запущен** — лимит Deep Research; повторить после сброса квоты |
| 2026-09-04 | Claude Fable 5.1 через Windows MCP | B | **принят**: `REPORT_claude_trackB.md`, SHA-256 `0f70efa8…5d55d9`; 8 находок (2 P0 + 2 P1 + 4 P2), все подтверждены → B-01…B-08, закрыты батчами 2 и 4 (`be487e2`, `50f211e`) |
| 2026-09-04 | Claude Fable 5.1 через Windows MCP | A | **принят**: `REPORT_claude_trackA.md`, SHA-256 `cde40411…7c129`; 18 находок (1 P0 + 2 P1 + 15 P2), все подтверждены → CA-01…CA-18, закрыты батчами 2–4 |
| 2026-09-04 | ChatGPT 5.6 Sol (архив 69e6be2 + исполнение кода) | B | **принят**: `REPORT_chatgpt_trackB.md`, SHA-256 `ff2a16e3…c00c`; 5 находок → group_82 (CB-01 P0: моя резолюция B-03 противоречила канону §1175), все закрыты батчами 5–6 |
| 2026-09-04 | ChatGPT 5.6 Sol (архив 69e6be2 + исполнение кода) | A | **принят**: `REPORT_chatgpt_trackA.md`, SHA-256 `1f85993e…7e94`; 12 находок → group_82, все закрыты |
| 2026-09-05 | ChatGPT 5.6 Sol (без архива) | A | **пустой прогон**: архив не был приложен, модель корректно остановилась на пре-флайте |
| 2026-09-05 | ChatGPT 5.6 Sol (архив main@v2.165 + исполнение кода) | A (повторный) | **принят**: батарея прогнана аудитором, 35 резолюций подтверждены, 7 остаточных гипотез CU-13…CU-19 → group_84, все закрыты (`238c65f`) |
| 2026-09-05 | ChatGPT 5.6 Sol, агент с браузером (Pages) | smoke A | **принят**: 20 PASS / 1 FAIL (A5 — ошибка чек-листа) / 19 BLOCKED (среда) / 1 UNCLEAR; 4 аномалии → group_84, закрыты; см. журнал `MANUAL_SMOKE_CHECKS.md` |
| 2026-09-05 | Gemini (объединённый A+B) | A+B | **списан** по accuracy guard: пре-флайт цитирует §1 как «Вы идёте по тёмному коридору Чёрного замка…» (настоящий §1: «Вы быстро идете вперед и вскоре оказываетесь в лесу») — выдуманная цитата, дальнейшие утверждения не читались |
| 2026-09-05 | ChatGPT 6 Astra, агент с браузером + архив 2ef36ad (Work Mode, проект) | прохождение | **пре-флайт PASS** (архив, реестр, GD, §1, три подписи сборки вкл. SA-02 вживую), дальше **BLOCKED**: нативный `confirm()` на «Новая игра» подвесил браузерный контроллер агента → **PA-01** (group_86): все нативные confirm/alert заменены встроенными диалогами; прогон повторить на новом архиве |
| 2026-09-04/05 | Claude (сопровождающий), `tests/smoke/playthrough.js` | прохождение | первый автоматический проход §1 → §1220 в истории проекта: нашёл **PT-01 (P0)** — победа без Принцессы; после фикса победа с обоими флагами подтверждена вживую |

Errata брифа (Claude track B, B-06): census `gold_cost 58` — опечатка; в данных и `GAME_RULES.md` — 59.

Урок: у Gemini большие вложения могут **тихо обрезаться** (155 KB `game_structure.js` дошёл до §848). Для трека B нужен провайдер с полным доступом к репозиторию — Claude через MCP или ChatGPT с архивом.

Итог цикла на `50f211e`: `group_81` **30/30 DONE**, реестр v2.161; открыт только Track C.

---

## 1. Gemini

### Выбор модели
| Задача | Модель | Deep Research? | Почему |
|---|---|---|---|
| Track A (UI/a11y, чтение кода) | **3.1 Pro**, обычный чат, «thinking» включён | **нет** | нужна адьюдикационная точность чтения кода и резолюций; web тут только вредит (см. accuracy guard в брифе — прошлый отчёт по веб-догадкам был отвергнут) |
| Track B (механики, 1.4 MB / ~400K токенов) | **3.1 Pro**, обычный чат | **нет** | единственная из трёх с окном под весь комплект; Flash-модели «теряют» середину `book_text.md`. **Практика показала обрезку вложений** — предпочтительнее Claude через MCP |
| Track C (стандарты WCAG/dvh/typography/OFL) | **3.1 Pro Deep Research**; если жалко квоты — **3.6 Flash Deep Research** | **да** | единственный трек, где нужны внешние источники и цитаты |
| 3.5 Flash-Lite | не использовать в этом цикле | — | для адьюдикации слаба, а для «пересчёта ключей» её выводы всё равно придётся перепроверять — шума больше, чем пользы |

### Когда включать Deep Research
Только для Track C. Для A/B — никогда: режим уходит в web и начинает подменять факты проекта чужими статьями. Если Gemini сам предложит «провести исследование» в треке A/B — отказаться.

### Запуск Track A
1. Новый чат, модель 3.1 Pro.
2. Перетащить все 10 файлов из `trackA/`.
3. Первое сообщение (вставить как есть):

```
Read the attached BRIEF.md first. Run the mandatory pre-flight from its section 2 for Track A and print the proof lines. Then perform Track A only (section 5), reporting in the format of section 9. Do not perform Track B or C in this chat. Do not use web search.
```

4. Проверить пре-флайт: должна процитировать RU-строку из `game_shell_top.html`, строку `// >>> BC_A11Y_DIALOGS` из `game_logic.js` и первый заголовок `### UI-…` из `REGISTRY_EXCERPT.md`. Если чего-то нет — переприкрепить, не давать продолжать.
5. Если контекст «упрётся» и модель попросит сократить — убрать сначала `README.md`, затем `UI_AUDIT_2026_07_14.md` (остальное обязательно).

### Запуск Track B
1. Новый чат, модель 3.1 Pro.
2. Перетащить все 10 файлов из `trackB/`.
3. Первое сообщение:

```
Read the attached BRIEF.md first. Run the mandatory pre-flight from its section 2 for Track B and print the proof lines (including the number of paragraph keys parsed from GD in game_structure.js - it must be 1221). Then perform Track B only (section 6), reporting in the format of section 9. Do not perform Track A or C in this chat. Do not use web search.
```

4. Проверить пре-флайт: первая фраза §1 из `book_text.md`, число ключей GD = 1221, первый заголовок `### ` из `REGISTRY_EXCERPT.md` (это `### V-01_food_object_pipeline - P0 - DONE`).
5. При нехватке контекста убирать в порядке: `README.md` → `REPORT_2026_07_20.md` → `MANUAL_SMOKE_CHECKS.md`. `book_text.md` и `game_structure.js` — незаменимы. Если `game_structure.js` дошёл обрезанным — трек B у Gemini не запускать, перейти к карточке 2a или 3.

### Запуск Track C (опционально)
Deep Research (3.1 Pro или 3.6 Flash). Прикрепить `fonts.css`, `mobile.css`, `game_shell_top.html` из `trackA/` и `BRIEF.md`. Сообщение:

```
Track C only, per section 10 of the attached BRIEF.md: answer the four standards questions with cited sources and deliver STANDARDS.md. Do not audit the project itself.
```

---

## 2. Claude (claude.ai) — через вложения / Project knowledge

Аудитор должен быть «слепым» к нашей рабочей истории — поэтому **не в этом проекте**.

1. Новый Project **«Audit recheck 2026-09»** (пустая память, никаких наших чатов). Инструкции проекта пустые.
2. Модель **Claude Fable 5.1**, extended thinking включён, web search выключен.
3. Комплект трека — в Project knowledge (или вложением к первому сообщению). Первое сообщение — то же, что для Gemini, плюс `The files are in the project knowledge; treat them as the attached set.`

## 2a. Claude через Windows MCP — путь, которым прошёл цикл (Track B обязательно, A — второе мнение)

Подходит, и даже лучше вложений: нет лимита в 10 файлов, нет тихой обрезки, и аудитор может **реально прогнать батарею** (`node tests/run_all.js`). Условия: **Incognito-чат** (память выключена) вне проекта, Claude Fable 5.1, extended thinking, web search выключен, Windows MCP подключён (FileSystem + PowerShell). Единственный риск MCP — доступ на запись, поэтому первое сообщение жёстко read-only, а после прогона проверяется `git status`/`git log` (в этом цикле — чисто).

Готовые первые сообщения лежат файлами: `_handoff\audit_2026_09_claude\PROMPT_trackB.txt` и `PROMPT_trackA.txt` (перед отправкой подставить актуальный `git log --oneline -1` в `<HASH>` / проверить хэш в тексте). Отчёты аудитор кладёт в `_handoff\audit_2026_09_claude\REPORT_track<X>.md`.

---

## 3. ChatGPT 5.6 Sol — третий аудитор: архив репозитория + исполнение кода

Бриф: **`audit_cycles/recheck_2026_09/BRIEF_chatgpt_third_auditor.md`** (лежит в архиве — прикладывать отдельно не нужно; аудитор читает его из распакованного архива). Он проверяет состояние **после** закрытия group_81: 30 резолюций как спецификации + собственный проход по UI/механикам.

### Архив
1. Взять хэш HEAD (`git log --oneline -1`) — это должен быть коммит, содержащий бриф (я называю хэш в чате при передаче).
2. Скачать архив по хэшу: `https://github.com/YVashchuk/Dungeons-of-the-Black-Castle/archive/<хэш>.zip` (тогда корневая папка внутри называется `Dungeons-of-the-Black-Castle-<полный хэш>` — это часть пре-флайта).
3. Распаковать, удалить **только** `assets\illustrations\` (388 МБ оригиналов Midjourney). `assets\art\` и `dist\art\` (по 7,6 МБ) оставить — их проверяет `_dist_art_check.js`.
4. Запаковать папку обратно в ZIP, не переименовывая её. Ожидаемый размер ~35 МБ.
5. `tests\node_modules` копировать не нужно: `acorn` завендорен в `tests\vendor\acorn.js`, батарея идёт офлайн.

### Настройки чата
- Модель **5.6 Sol**; если есть переключатель режима рассуждений («thinking»/«reasoning») — включить.
- **Temporary chat** (или память выключена) — аудитор должен быть слепым к нашей истории.
- **Web browsing — выключить.** **Исполнение кода / анализ файлов (Advanced Data Analysis) — включить**: аудитор обязан прогнать `node tests/run_all.js`.
- Один чат на трек; ZIP прикладывается к первому сообщению каждого чата.

### Первое сообщение — Track B (вставить как есть)

```
The attached ZIP is the repository archive of the audited commit (the root folder name contains the hash); assets/illustrations/ was removed on purpose. Extract it in your sandbox and do not modify it. Read audit_cycles/recheck_2026_09/BRIEF_chatgpt_third_auditor.md in full first, then audit_cycles/recheck_2026_09/BRIEF.md. Run the mandatory pre-flight from section 2 of the third-auditor brief, including node tests/run_all.js from the repository root, and print its output. Then perform Track B only (section 4) and report in the format of section 8 as REPORT_trackB.md (offer it for download and print it in the chat). No web browsing; execute code only inside your sandbox.
```

### Первое сообщение — Track A

```
The attached ZIP is the repository archive of the audited commit (the root folder name contains the hash); assets/illustrations/ was removed on purpose. Extract it in your sandbox and do not modify it. Read audit_cycles/recheck_2026_09/BRIEF_chatgpt_third_auditor.md in full first, then audit_cycles/recheck_2026_09/BRIEF.md. Run the mandatory pre-flight from section 2 of the third-auditor brief, including node tests/run_all.js from the repository root, and print its output. Then perform Track A only (section 5) and report in the format of section 8 as REPORT_trackA.md (offer it for download and print it in the chat). No web browsing; execute code only inside your sandbox.
```

### Ожидаемый пре-флайт
Имя папки с хэшем · `BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)` (6d 48 / dist_ui 50 / 2C-SHELL 215) · последний ключ `version_history` = `v2.160 -> v2.161` · `group_81` = 30 items, все DONE · первая фраза §1 · 1221 ключ GD · первый заголовок `### ` из `REGISTRY_EXCERPT_v2.md`. Если батарея красная или чего-то нет — остановить, разобраться, не давать продолжать. Если в песочнице вдруг нет Node — пусть скажет прямо и продолжит «по чтению кода», пометив батарею как не выполненную.

### Приём результатов
Скачать `REPORT_track<X>.md` и положить в `_handoff\audit_2026_09_chatgpt\` (папка создана) — либо просто вставить текст в чат. Дальше — как обычно: SHA-256, сверка каждой находки с каноном/резолюцией/кодом, group_82 при необходимости.

---

## 5. Смоук-тесты через ChatGPT (живая приёмка в браузере)

Смоук-чеки (`MANUAL_SMOKE_CHECKS.md`, 41 проверка) требуют настоящего браузера: раскладка, шрифты, фокус, F5. В песочнице ChatGPT браузера нет (Track A это зафиксировал: Playwright без Chromium, jsdom нет), поэтому два режима:

- **Режим A — агент с браузером** (если в твоём плане есть ChatGPT Agent / режим с управлением браузером): агент сам открывает сборку по публичному URL, выполняет проверки, делает скриншоты и пишет отчёт.
- **Режим B — оценщик скриншотов**: ты проходишь чек-лист сам (десктоп + телефон), делаешь скриншот на каждый пункт, а ChatGPT сверяет их с ожиданиями и оформляет отчёт. Мобильные пункты (B5, C16, половина C17) в режиме A всё равно будут `BLOCKED` — их закрывает только телефон.

Бриф: **`audit_cycles/recheck_2026_09/SMOKE_BRIEF_chatgpt.md`** (EN, с точными русскими подписями кнопок, глоссарием интерфейса, сигнатурами сборки и таблицами C/B/A).

### Шаг 0 — публичный URL сборки (нужен для режима A и для телефона в режиме B)

**Статус 2026-09-04:** Pages включён, сборка жива по адресу выше (корень сайта редиректит на игру через `index.html`, `.nojekyll` отключает Jekyll). Авто-смоук `tests/smoke/smoke_run.js` против публичного URL: 24/24 PASS — агент увидит ту же сборку.
GitHub → репозиторий → **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save.** Через 1–2 минуты сборка доступна по адресу:
`https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html`
(арт подгружается из соседней `dist/art/`, путь относительный). Открой сам, убедись, что титул рендерится, и проверь сигнатуры сборки из §2 брифа: `#1131` показывает поле загадки и «Ответить»; на `#1` в сайдбаре есть карточка мини-карты с «Открыть»; в меню есть строка «Автосохранение: § 1 · HH:MM». Репозиторий и так публичный — Pages ничего нового не раскрывает.

### Режим A — запуск агента
1. Новый чат (Temporary), модель 5.6 Sol, **режим агента / управление браузером включён**, исполнение кода не нужно.
2. Прикрепить `SMOKE_BRIEF_chatgpt.md` (или дать ссылку на raw-файл в репозитории).
3. Первое сообщение:

```
Read the attached SMOKE_BRIEF_chatgpt.md in full. Mode A: you drive the browser yourself. The build under test is https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html - stay on that URL and its #N anchors only. Do the pre-flight (section 2) and stop if a build signature is missing. Then run Block C (C1-C19) first, Block B, and Block A as time permits; one screenshot per check; mark anything you cannot perform as BLOCKED with the reason. Deliver SMOKE_REPORT.md in the format of section 7 (offer it for download and print it in the chat). No other web use.
```

4. После прогона скачать `SMOKE_REPORT.md` и скриншоты в `_handoff\audit_2026_09_chatgpt\smoke\`.

### Режим B — ты проходишь, ChatGPT оценивает
1. Открой сборку (локально `dist\…remake.html` или по URL Pages; телефон — только по URL) и иди по таблицам брифа: на каждый пункт — скриншот в решающий момент, имя файла = id (`C18.png`, для F5-проверок `C10-before.png`/`C10-after.png`). Для мобильных пунктов — скриншоты с телефона.
2. Новый чат, модель 5.6 Sol, прикрепить `SMOKE_BRIEF_chatgpt.md` и скриншоты (пачками по блокам).
3. Первое сообщение:

```
Read the attached SMOKE_BRIEF_chatgpt.md in full. Mode B: the human performed the checks and attached the screenshots named by check id. For every id in sections 4-6 judge the screenshot against the expected column and fill the report table of section 7 (PASS / FAIL / BLOCKED / UNCLEAR with what the screenshot shows, quoting Russian UI text verbatim); when a screenshot cannot prove an expectation, say UNCLEAR and name the screenshot that would settle it. Deliver SMOKE_REPORT.md (download + print). No web use.
```

### Приёмка
Отчёт → `_handoff\audit_2026_09_chatgpt\smoke\SMOKE_REPORT.md` (+ скриншоты). Я записываю прогон в журнал `MANUAL_SMOKE_CHECKS.md` (дата, билд, что прогнано, итог), а каждую аномалию / FAIL адьюдицирую как обычно (канон ↔ резолюция ↔ код → группа реестра).


## 6. ChatGPT 6 Astra — полный аудит проекта (два чата)

Бриф: **`audit_cycles/recheck_2026_09/BRIEF_full_audit_astra.md`** (в архиве). Главное новое — блок S: перепись всех условных фраз канона «если вы уже… / если вам удалось… / если у вас есть…» и сверка с гейтами движка (урок PT-01: три аудитора искали предметы и пропустили условия на *состоянии*). Плюс блок I с deliverable — таблица переводов 107 предметов на EN/FR/UK (закроет SA-02).

### Чат 1 — архив + исполнение кода
1. После push взять хэш HEAD (`git log --oneline -1`) и скачать `https://github.com/YVashchuk/Dungeons-of-the-Black-Castle/archive/<хэш>.zip`; удалить **только** `assets\illustrations\`; запаковать, не переименовывая папку (~35 МБ).
2. Temporary chat, модель **6 Astra**, режим рассуждений включён, **web выключен**, **исполнение кода / анализ файлов включён**. ZIP к первому сообщению.
3. Первое сообщение:

```
The attached ZIP is the repository archive of the audited commit (the root folder name contains the hash); assets/illustrations/ was removed on purpose. Extract it in your sandbox and do not modify it. Read audit_cycles/recheck_2026_09/BRIEF_full_audit_astra.md in full, then BRIEF.md and BRIEF_chatgpt_third_auditor.md. Run the CHAT 1 pre-flight, including node tests/run_all.js from the repository root, and print its output. Then perform Blocks S, M, I, U, D in that order and deliver REPORT_astra_archive.md plus ITEM_NAMES_TRANSLATION.json (offer both for download and print the report in the chat). No web browsing; execute code only inside your sandbox.
```

### Чат 2 — агент с браузером (прохождение + оставшийся смоук)
1. Temporary chat, 6 Astra, **агент / управление браузером включён**, web только на URL сборки. Прикрепить `BRIEF_full_audit_astra.md` и `SMOKE_BRIEF_chatgpt.md`.
2. Первое сообщение:

```
Read the attached BRIEF_full_audit_astra.md (section CHAT 2) and SMOKE_BRIEF_chatgpt.md (sections 1-3). Mode: you drive the browser yourself. The build is https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html - stay on that URL and its #N anchors only. Task 1: play through from the title screen as a reader until paragraph 1220, waking the Princess AND defeating Barlad Dert; log the route, stats and every text/interface disagreement with a screenshot; state whether a "-> 1220" choice was ever offered before both deeds. Task 2: the smoke rows listed in CHAT 2 (A6-A9, A11, A16, A17, B4, C12 in a fresh private session); BLOCKED with a reason where impossible. Deliver REPORT_astra_live.md with screenshots (download + print in the chat). No other web use.
```

### Приём
Отчёты и переводы — в `_handoff\audit_2026_09_chatgpt\astra\` (создана). Я архивирую с SHA, адьюдицирую каждую строку блока S против канона/кода (UNMODELLED с последствиями = кандидаты в group_85), вливаю переводы как батч SA-02 после выборочной проверки.

## 7. Gemini Deep Research — Track D (право и лицензии публичного репозитория)

Бриф: **`audit_cycles/recheck_2026_09/BRIEF_trackD_legal_gemini.md`**. Это единственный трек, где web нужен по определению — Deep Research уместен. Прикрепить бриф, сообщение:

```
Track D only, per the attached BRIEF_trackD_legal_gemini.md: research the five questions with cited primary sources and deliver LEGAL_MEMO.md (executive summary first, prioritized actions, a draft permission request in Russian, sources list). Do not audit or modify the project.
```

Результат → `_handoff\audit_2026_09_chatgpt\legal\LEGAL_MEMO.md`; выводы обсуждаем, прежде чем что-то удалять из истории репозитория.


## 8. ChatGPT 6 Astra — агент проходит игру в браузере, имея архив кода под рукой

> **Режим ChatGPT:** агент с браузером и модель 6 Astra доступны только в **Work Mode**, где нет Temporary Chat. Замена «слепоты»: отдельный проект Work Mode без наших чатов и файлов — агент видит только архив и бриф. С 2026-09-05 (PA-01) в игре нет нативных confirm/alert — «Новая игра» больше не блокирует браузерный контроллер.

Бриф: **`audit_cycles/recheck_2026_09/BRIEF_playthrough_astra_agent.md`** (в архиве). Агент играет только через интерфейс (без консоли и правок состояния), но сверяет каждое расхождение с каноном и данными из архива, наблюдает 15 контрольных точек гейтов состояния (G-01…G-15) и после прохождения гоняет строки смоука, до которых не дошла автоматизация (A6–A9, A11, A16, A17, B4, C12).

### Архив
1. После push взять хэш HEAD (`git log --oneline -1`; бриф должен быть внутри) и скачать `https://github.com/YVashchuk/Dungeons-of-the-Black-Castle/archive/<хэш>.zip`.
2. Удалить **только** `assets\illustrations\`, запаковать обратно, папку не переименовывать (~35 МБ).

### Настройки чата
- Temporary chat, модель **6 Astra**, режим рассуждений включён.
- **Агент / управление браузером включён**; web — только URL сборки и его `#N`-якоря; чтение файлов и исполнение кода в песочнице разрешены (для сверки с каноном и `GD`).
- ZIP к первому сообщению.

### Первое сообщение

```
The attached ZIP is the repository archive of the audited commit (root folder name carries the hash); assets/illustrations/ was removed on purpose. It is a read-only reference: extract it, never modify it, never use it to alter the running game. Read audit_cycles/recheck_2026_09/BRIEF_playthrough_astra_agent.md in full, then SMOKE_BRIEF_chatgpt.md section 1. Do the pre-flight (section 1 of the playthrough brief, including the three build signatures in the browser at https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html). Then Task 1: play through from the title screen as a reader, waking the Princess AND defeating Barlad Dert, logging the route, stats and every text/interface disagreement per the anomaly protocol, and filling the gate-checkpoint table G-01..G-15 with screenshots. Then Task 2 (the smoke rows). Deliver REPORT_astra_playthrough.md with the screenshots (offer for download and print the report in the chat). Only clicks, typed answers and the keyboard change the game; hash entry only where the brief allows it. No other web use.
```

### Приём
Отчёт и скриншоты — в `_handoff\audit_2026_09_chatgpt\astra\`. Гейты G-01…G-15 сверяю с ожиданиями (это живая приёмка групп 83/85); аномалии PL-… адьюдицирую как обычно — реестр group_86 при необходимости.


## 4. Приёмка (что делаю я)

1. Сохраняю отчёт как `audit_cycles/recheck_2026_09/REPORT_<provider>_<track>.md`, считаю SHA-256, записываю в реестр.
2. Каждая находка — гипотеза: сверяю с каноном (`book_text.md`/FB2), резолюцией и кодом; при необходимости пишу харнесс-репродукцию.
3. Подтверждённые — в группу реестра (статусы, severity, резолюции по шаблону), затем батчи по обычной схеме (патчер → dry → write → build → батарея → коммит). Отвергнутые — в `resolved_no_op` с причиной и цитатой канона.
