# LAUNCH CARDS — как запускать recheck-цикл 2026-09 у провайдеров

Бриф один (`BRIEF.md`, EN), треки два (A — UI/a11y, B — механики) + опциональный Track C (только стандарты, web). Комплекты файлов уже разложены:

- `_handoff/audit_upload_2026_09/trackA/` — 10 файлов, ~0.4 MB
- `_handoff/audit_upload_2026_09/trackB/` — 10 файлов, ~1.4 MB (самый тяжёлый — `book_text.md` 904 KB)

В каждом комплекте лежит копия `BRIEF.md` — прикладывать вместе с остальными, bare-именами, без путей в тексте сообщения.

**Порядок:** сначала Track A (самая свежая работа — UI этапов A/B), потом Track B. Track C — в любой момент параллельно, он не зависит от остальных. Результаты — `REPORT.md` (или PDF) на трек; отдаёшь мне, я верифицирую и открываю group_81.

---

## 1. Gemini

### Выбор модели
| Задача | Модель | Deep Research? | Почему |
|---|---|---|---|
| Track A (UI/a11y, чтение кода) | **3.1 Pro**, обычный чат, «thinking» включён | **нет** | нужна адьюдикационная точность чтения кода и резолюций; web тут только вредит (см. accuracy guard в брифе — прошлый отчёт по веб-догадкам был отвергнут) |
| Track B (механики, 1.4 MB / ~400K токенов) | **3.1 Pro**, обычный чат | **нет** | единственная из трёх с окном под весь комплект; Flash-модели «теряют» середину `book_text.md` |
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

4. Проверить пре-флайт: первая фраза §1 из `book_text.md`, число ключей GD = 1221, первый заголовок `### ` из `REGISTRY_EXCERPT.md`.
5. При нехватке контекста убирать в порядке: `README.md` → `REPORT_2026_07_20.md` → `MANUAL_SMOKE_CHECKS.md`. `book_text.md` и `game_structure.js` — незаменимы.

### Запуск Track C (опционально)
Deep Research (3.1 Pro или 3.6 Flash). Прикрепить `fonts.css`, `mobile.css`, `game_shell_top.html` из `trackA/` и `BRIEF.md`. Сообщение:

```
Track C only, per section 10 of the attached BRIEF.md: answer the four standards questions with cited sources and deliver STANDARDS.md. Do not audit the project itself.
```

---

## 2. Claude (claude.ai)

Аудитор должен быть «слепым» к нашей рабочей истории — поэтому **не в этом проекте**.

1. Создать новый Project **«Audit recheck 2026-09»** (у него будет своя пустая память и никаких наших чатов). В инструкциях проекта ничего не писать — бриф сам всё задаёт.
2. Модель: **Claude Fable 5.1** (текущая старшая), extended thinking включён. Web search в этом чате — выключить (для треков A/B).
3. Файлы: положить комплект трека в **Project knowledge** (10 файлов из `trackA/` или `trackB/`) — так они доступны всем чатам проекта и не съедают лимит вложений одного сообщения. Альтернатива — прикрепить к первому сообщению.
4. По одному чату на трек. Первое сообщение — то же, что для Gemini (см. выше), плюс строка: `The files are in the project knowledge; treat them as the attached set.`
5. Проверять пре-флайт так же строго.
6. Опция для Claude (если включён Code Execution): можно дополнительно дать zip репозитория **без** `assets/illustrations` и `dist/art` и попросить прогнать `node tests/run_all.js` — тогда в отчёте появится реальный прогон батареи. Для паритета с Gemini это необязательно.

---

## 3. ChatGPT 6 Astra (позже, когда будет доступ)

Тот же `BRIEF.md`, те же два комплекта. Если у модели есть исполнение кода — как в цикле 2026-07-20 можно дать GitHub-архив `main @ 459d8a1` и потребовать реальный `node tests/run_all.js` (ALL GREEN, 16 харнессов + 6 dist-чеков + 1205) до начала анализа; иначе — режим «по чтению кода», как у Gemini. Первые сообщения — те же.

---

## 4. Приёмка (что делаю я)

1. Сохраняю отчёт как `audit_cycles/recheck_2026_09/REPORT_<provider>_<track>.md`, считаю SHA-256, записываю в реестр.
2. Каждая находка — гипотеза: сверяю с каноном (`book_text.md`/FB2), резолюцией и кодом; при необходимости пишу харнесс-репродукцию.
3. Подтверждённые — в `group_81_2026_09_recheck` (статусы, severity, резолюции по шаблону), затем батчи по обычной схеме (патчер → dry → write → build → батарея → коммит). Отвергнутые — в `resolved_no_op` с причиной.
