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
| 2026-09-04 | Gemini 3.1 Pro (обычный чат) | A | **принят**: `REPORT_gemini_trackA.md`, SHA-256 `d437b031…8641`; 4 находки (2 P1 + 2 P2) → group_81 UA-01…UA-04 |
| 2026-09-04 | Gemini 3.1 Pro | B (чистый комплект) | **не запустился**: `game_structure.js` пришёл обрезанным на §848, модель корректно остановилась по правилу пре-флайта |
| 2026-09-04 | Gemini 3.1 Pro | B (объединённый A+B) | **списан** по accuracy guard: пре-флайт назвал неверный первый заголовок выжимки (UI-01 вместо V-01), находки ссылаются на несуществующие поля/файлы (`pre_combat_exits`, `combat_paragraphs.jsonl`, `art30_three_knights`); три B-находки проверены по канону и **отвергнуты** (реестр `resolved_no_op`: UB-01/02/03). Архив: `REPORT_gemini_trackB_combined.md`, SHA-256 `bc5e456d…3659` |
| 2026-09-04 | Gemini Deep Research | C | **не запущен** — лимит Deep Research; повторить после сброса квоты |
| — | Claude Fable 5.1 через Windows MCP | B (обязательно), A (второе мнение) | см. карточку 2a |

Урок: у Gemini большие вложения могут **тихо обрезаться** (155 KB `game_structure.js` дошёл до §848). Для трека B нужен провайдер с полным доступом к репозиторию — Claude через MCP.

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
5. При нехватке контекста убирать в порядке: `README.md` → `REPORT_2026_07_20.md` → `MANUAL_SMOKE_CHECKS.md`. `book_text.md` и `game_structure.js` — незаменимы. Если `game_structure.js` дошёл обрезанным — трек B у Gemini не запускать, перейти к карточке 2a.

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

## 2a. Claude через Windows MCP — РЕКОМЕНДУЕМЫЙ путь для Track B (и второе мнение по Track A)

Подходит, и даже лучше вложений: нет лимита в 10 файлов, нет тихой обрезки, и аудитор может **реально прогнать батарею** (`node tests/run_all.js`). Условия: новый чат **вне проекта**, Claude Fable 5.1, extended thinking, web search выключен, Windows MCP подключён (FileSystem + PowerShell).

Единственный риск MCP — доступ на запись. Поэтому в первом сообщении жёстко прописан read-only, а после прогона я проверяю `git status` и `git log` (должно быть чисто и на том же HEAD).

**Первое сообщение для Track B** (перед отправкой подставь актуальный хэш из `git log --oneline -1`):

```
You are the external auditor for the recheck cycle 2026-09 of the JS gamebook remake "Подземелья Чёрного замка". The repository is on this machine at C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle and you have Windows MCP tools (FileSystem + PowerShell).

Rules:
1. READ-ONLY. Do not create, modify or delete anything inside the repository. Only read-only git commands (git rev-parse, git log, git status, git diff). Never run build.sh. The ONLY writable places are %TEMP% (scratch scripts) and the git-ignored folder C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle\_handoff\audit_2026_09_claude\ (your report).
2. No web search and no search of past chats. Base every statement on the repository files; quote Russian text and code verbatim; write "not determinable from provided files" where applicable.
3. First read audit_cycles\recheck_2026_09\BRIEF.md in full. Its Track B attachment table maps to these repository paths: src\game_structure.js, src\game_logic.js, src\registries\items.json, assets\GAME_RULES.md, assets\book_text.md, audit_cycles\recheck_2026_09\REGISTRY_EXCERPT.md, MANUAL_SMOKE_CHECKS.md, audit_cycles\recheck_2026_07_20\REPORT.md, README.md. Read the large ones with the file tools; parse the GD blob in game_structure.js with a Node script written to %TEMP% (it is a single line - do not eyeball it).
4. Pre-flight (brief section 2, adapted): print git rev-parse --short HEAD (expected: <HASH>) and git status --short (expected: empty), then the Track B proof quotes: the first sentence of paragraph 1 from book_text.md, the number of top-level paragraph keys parsed from GD (must be 1221), and the first "### " heading of REGISTRY_EXCERPT.md. If anything does not match, stop and report.
5. Run the verification battery once: node tests\run_all.js from the repository root (it is read-only) and quote its final line in your report.
6. Perform Track B only (brief section 6) and report in the format of section 9. Save the report as _handoff\audit_2026_09_claude\REPORT_trackB.md and also print it in the chat.
```

**Для Track A** — то же сообщение с заменами: пути трека A (`src\game_shell_top.html, src\mobile.css, src\fonts\fonts.css, src\game_logic.js, src\map_module.js, MANUAL_SMOKE_CHECKS.md, audit_cycles\recheck_2026_09\REGISTRY_EXCERPT.md, audit_cycles\full_audit_2026_07_14\UI_AUDIT.md, README.md`), пре-флайт трека A (RU-строка `data-i18n` из шелла, строка `// >>> BC_A11Y_DIALOGS`, первый заголовок `### UI-…`), «Track A only (brief section 5)», файл `REPORT_trackA.md`. В сообщение для трека A добавь строку: `Findings UA-01..UA-04 of the Gemini Track A report are already recorded in the registry as group_81 - re-verify them briefly, then look beyond them.`

После прогона: пришли мне путь к отчёту (или сам отчёт) — я сверю каждую находку с каноном/резолюцией/кодом.

---

## 3. ChatGPT 6 Astra (позже, когда будет доступ)

Тот же `BRIEF.md`, те же два комплекта. Если у модели есть исполнение кода — как в цикле 2026-07-20 можно дать GitHub-архив `main` и потребовать реальный `node tests/run_all.js` (ALL GREEN, 16 харнессов + 6 dist-чеков + 1205) до начала анализа; иначе — режим «по чтению кода». Первые сообщения — те же.

---

## 4. Приёмка (что делаю я)

1. Сохраняю отчёт как `audit_cycles/recheck_2026_09/REPORT_<provider>_<track>.md`, считаю SHA-256, записываю в реестр.
2. Каждая находка — гипотеза: сверяю с каноном (`book_text.md`/FB2), резолюцией и кодом; при необходимости пишу харнесс-репродукцию.
3. Подтверждённые — в `group_81_2026_09_04_recheck` (статусы, severity, резолюции по шаблону), затем батчи по обычной схеме (патчер → dry → write → build → батарея → коммит). Отвергнутые — в `resolved_no_op` с причиной и цитатой канона.
