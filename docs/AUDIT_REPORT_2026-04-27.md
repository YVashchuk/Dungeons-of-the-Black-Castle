# Аудиторский отчёт — апрель 2026

> **Источник:** Independent ChatGPT 5.5 Research mode audit + verification by Claude Opus 4.7  
> **Дата:** 27 апреля 2026  
> **Контекст:** Полный пересмотр проекта по запросу пользователя после жалоб на сломанную карту, плохой звук и неудачный UX.

---

## TL;DR — Что найдено

ChatGPT 5.5 нашёл **5 критических архитектурных проблем**, **все 5 подтверждены** прямым чтением кода. Это **независимое второе мнение**, совпавшее с Session 8 audit Claude. Список проблем:

| # | Баг | Файл | Severity | Подтверждено? |
|---|---|---|---|---|
| 1 | Карта не работает (`let S` vs `window.S`) | `src/game_logic.js:28` + `src/map_module.js` × 20 | 🔴 P0 | ✅ ChatGPT + Claude |
| 2 | OCR артефакты в прологе/предисловии | `src/game_logic.js` строки 22, 24 | 🔴 P0 | ✅ ChatGPT + Claude |
| 3 | Sound pack отключён, играют только oscillators | `src/game_logic.js` (7 osc, 0 Audio()) | 🟡 P1 | ✅ ChatGPT + Claude |
| 4 | `mobile.css` и `fonts.css` не доезжают в build | `build.sh` REQUIRED_FILES | 🟡 P1 | ✅ ChatGPT + Claude |
| 5 | 9+ независимых scroll-контейнеров + max-width 1200px | `src/game_shell_top.html` | 🟡 P1 | ✅ ChatGPT + Claude |
| 6 | Нет paragraph-level corrections файла (canonical pipeline разорван) | `assets/` | 🟡 P1 | ✅ ChatGPT |

ChatGPT также подтвердил то, что я уже знал:
- ✅ `mj_art.js` (6.3 MB) и `illustrations.js` (3.3 MB) **НЕ пусты** — это была ошибка GitHub raw API truncation в прошлом аудите
- ✅ 43 MJ_DATA entries уже в `mj_art.js` (Batch 4 интегрирован параллельно в другом чате)

---

## Детально по каждому багу

### 🔴 #1 — Карта сломана архитектурно

**Симптом:** "Нажимаю Открыть на карте — ничего не происходит."

**Причина:** В `src/game_logic.js:28` объявлено `let S=null;` — это **top-level let**, который **НЕ создаёт `window.S`** (это поведение `let` в браузерах). Но `src/map_module.js` использует `window.S` **20 раз**: `if(!window.S) return;`, `if(window.S) renderGameMap();`, `openMapModal()` сразу выходит если `window.S` отсутствует.

**В результате:** карта молча выходит во всех своих хуках, потому что её источник состояния — `window.S` — вечно `undefined`. Это ломает не только кнопку Открыть, но и:
- мини-карту в panel
- синхронизацию узлов на новых параграфах
- реакцию на клавишу `M`
- фиксацию прогресса между сессиями

**Минимальный фикс (рекомендация ChatGPT — корректная):**

В `src/game_logic.js` после `let S=null;` (или в начале файла) добавить bridge:
```javascript
// Bridge: expose S to map_module.js which uses window.S
Object.defineProperty(window, 'S', {
  get() { return S; },
  set(v) { S = v; },
  configurable: false
});
```

**Лучший долгосрочный фикс:** убрать зависимость `map_module.js` от `window.S` и передавать состояние явно через `GameMap.sync(S, previousSection)`. Но это бо́льший рефактор.

---

### 🔴 #2 — OCR артефакты в прологе

**Симптом:** В тексте предисловия и пролога остались дефекты OCR.

**Причина:** `src/game_logic.js` имеет на строках 22 и 24 два **hardcoded** константы:
```javascript
const PREFACE_TEXT = '...';
const PREGAME_TEXT = '...';
```

Эти строки **не извлекались** из FB2/EPUB, они были введены вручную с какой-то OCR-копии и содержат артефакты:

| Артефакт | Должно быть | Местоположение |
|---|---|---|
| `кто Такие Гоблины и Орки` | `кто такие гоблины и орки` | PREGAME_TEXT |
| `Из мало кто видел` | `Их мало кто видел` | PREGAME_TEXT |
| `противостоятьвашим заклятиям` | `противостоять вашим заклятиям` | PREGAME_TEXT |

**В прошлом аудите я ошибочно указал что они в `remake_data.js`** — на самом деле они в `game_logic.js`. **Ни одного OCR артефакта в `remake_data.js` нет.**

**Фикс:** 6 простых `str_replace` в `src/game_logic.js`. Время — 5 минут.

---

### 🟡 #3 — Sound pack отключён

**Симптом:** "Звуки игры если честно ужасны. Очень примитивны."

**Причина:** `src/game_logic.js` использует **7 вызовов** `createOscillator` / `AudioContext` для процедурной генерации сигналов. Реальных `new Audio()` или ссылок на `.ogg` файлы — **0** во всём `src/game_logic.js` И **0** в `dist/podzemelye-chyornogo-zamka-remake.html`.

**Это значит:** 20 OGG файлов в `dist/sounds/` (700 KB) лежат как мёртвый груз. Игрок никогда их не слышит.

**Фикс:** Заменить oscillator-функции на `new Audio()` с относительными путями к OGG файлам:

```javascript
// ВМЕСТО:
function playClickSound() {
  const osc = audioCtx.createOscillator();
  // ... 30 строк осцилляторной магии
}

// СТАЛО:
const SOUNDS = {
  click: new Audio('./sounds/ui/click.ogg'),
  hover: new Audio('./sounds/ui/hover.ogg'),
  swordHit: new Audio('./sounds/combat/sword_hit.ogg'),
  // ... все 20 ключей из dist/sounds/sounds_manifest.json
};

function playClickSound() {
  const s = SOUNDS.click.cloneNode();
  s.volume = 0.5;
  s.play().catch(() => {}); // silent fail if blocked
}
```

**Замечание:** procedural fallback пакет от ChatGPT C-2 на самом деле тоже не очень — это упрощённые синтетические звуки, не реальные SFX. Но даже они **многократно лучше** того что слышит игрок сейчас. Долгосрочно — заменить на CC0 пакет с OpenGameArt/Freesound (мой план в Session 8 описывал какие именно).

---

### 🟡 #4 — `mobile.css` не в build

**Симптом:** "Раздражает дизайн. Полузаполненные фрагменты экрана, скроллер на странице..."

**Причина:** `build.sh` имеет:
```bash
REQUIRED_FILES=(
  game_shell_top.html
  remake_data.js
  illustrations.js
  title_art.js
  mj_art.js
  map_module.js
  game_logic.js
)
```

`src/mobile.css` и `src/fonts/fonts.css` **не входят** в этот список. `bash build.sh` склеивает только перечисленные файлы → `dist/podzemelye-chyornogo-zamka-remake.html` **не содержит** ни mobile-стилей, ни self-hosted fonts.

В результате:
- Mobile layout (Pixel 7a / iPhone 15) **не активен**
- Self-hosted шрифты **не подключены** — игра пытается тянуть Google Fonts через `@import` в `game_shell_top.html` (что ломает offline-обещание)
- Slavic шрифты Veles Redone и Cyrillic Old Face добавлены в проект но **в самой игре их нет**

**Фикс:** обновить `build.sh` чтобы он:
1. Читал `src/mobile.css` → инжектил перед `</style>` в `game_shell_top.html`
2. Читал `src/fonts/fonts.css` → так же инжектил перед `</style>`
3. Заменял `@import url('https://fonts.googleapis.com/...')` на пустую строку
4. Опционально: встраивал woff2 файлы как base64 data: URLs внутрь @font-face

Я могу написать этот фикс build.sh — это ~30 строк bash. Время — 15 минут.

---

### 🟡 #5 — Множественные scroll-контейнеры и нерациональный layout

**Симптом:** "Скроллер на странице, хотя есть место в экране."

**Найдено в `src/game_shell_top.html`:**

| Селектор | Строка | Сорт overflow |
|---|---|---|
| `#scr-create` | 72 | `overflow-y:auto` |
| `#scr-spells` | 95 | `overflow-y:auto` |
| `.sidebar` | 123 | `overflow-y:auto` |
| `.story-area` | 191 | `overflow-y:auto` (max-width:1200px!) |
| `.modal` | 214 | `overflow-y:auto` |
| `.combat-log` | 219 | `overflow-y:auto` |
| `.event-log-panel` | 307 | `overflow-y:auto` |
| `.map-modal-side` | 338 | `overflow:auto` |
| `.map-svg-wrap` | 352 | `overflow:auto` |
| `.s-text` (#preface) | 439 | `overflow-y:auto` |

**Это 10 независимых скроллеров.** Хуже того:
- `.story-area`: `max-width:1200px` + `padding:48px 80px 24px` → на FullHD остаётся ~580px воздуха слева/справа
- `.sidebar`: жёстко зафиксирован на 320px
- `.choices-area`: тоже max-width:1200px + padding:20px 80px 36px → ещё больше воздуха

**Симптом для пользователя:**
- Текст узкий, по бокам пусто, но при этом надо скроллить внутри узкой колонки
- Story-area, sidebar, event-log, choices-area все прокручиваются независимо
- Карта и модалки тоже имеют свои оси прокрутки

**Фикс — большая дизайн-ревизия.** Варианты:
1. **Минимум:** убрать `overflow-y:auto` со всех контейнеров кроме одного главного (например `.story-area`)
2. **Лучше:** превратить layout в CSS Grid с `grid-template-columns: 320px 1fr` и одним общим скроллом на body
3. **Идеально:** дизайн-pass со ставкой на читабельность, без жёстких max-width в основной story-area

Это работа на отдельную сессию — не моментально решается.

---

### 🟡 #6 — Нет paragraph-level corrections файла

**Симптом:** Каждый раз правки текста "теряются" между парсингами FB2.

**Причина:** Текущий пайплайн:
```
fb2_remake.fb2 (immutable)  →  ручные правки  →  remake_data.js (текущий runtime)
                              ↑
                              эти правки нигде не зафиксированы
```

**Что нужно** (рекомендация ChatGPT, я с ней полностью согласен):

```
fb2_remake.fb2 (immutable, эталон)
         ↓
    (parse)
         ↓
    text_corrections.json (editable, paragraph-level overrides)
         ↓
   (apply corrections)
         ↓
    book_text.md (editable canonical)
         ↓
   (regenerate)
         ↓
    remake_data.js (runtime)
```

**Структура `assets/text_corrections.json`:**

```json
{
  "version": 1,
  "last_updated": "2026-04-27",
  "corrections": {
    "849": {
      "field": "text",
      "original": "...На второй — 1830...",
      "corrected": "...На второй — 830...",
      "comment": "Параграф 1830 не существует. Gemini G-2 audit",
      "source": "gemini_g2_2026_04"
    },
    "849_choices": {
      "field": "choices.label",
      "original": ["На второй", "На третий"],
      "corrected": ["На второй ↑", "На третий ↓"],
      "comment": "Disambiguate elevator floors with arrows"
    }
  },
  "preface_text": {
    "field": "src/game_logic.js:PREFACE_TEXT",
    "corrections": [
      {"original": "кто Такие Гоблины", "corrected": "кто такие гоблины", "type": "ocr"},
      {"original": "Из мало кто видел", "corrected": "Их мало кто видел", "type": "ocr"},
      {"original": "противостоятьвашим", "corrected": "противостоять вашим", "type": "missing_space"}
    ]
  }
}
```

Этот файл становится **источником истины** для всех правок. После его создания:
1. Любая новая правка идёт сначала в `text_corrections.json`
2. Затем применяется к `remake_data.js` через скрипт
3. Затем (опционально) применяется к `book_text.md`

Это решает проблему "правки теряются" окончательно.

---

## Что НЕ нужно чинить

ChatGPT правильно отметил, но я уточняю — в **этой сессии не делать**:

- ❌ Image-by-image MJ QA — пользователь сейчас этим занимается **в другом чате** с Batch 4
- ❌ Активацию PWA — требует HTTPS хостинг, отдельная задача
- ❌ Локализацию EN/FR — большая задача
- ❌ Combat conditions / dynamic math (§532, §13, §140)

---

## Проверенный текущий состав репозитория

```
Размеры ключевых файлов:
  src/mj_art.js:        6.3 MB  (43 MJ_DATA entries — Batch 4 интегрирован)
  src/illustrations.js: 3.3 MB  (legacy ч/б, не пусто)
  src/remake_data.js:   964 KB  (1221 параграф, без OCR артефактов)
  src/game_logic.js:    ~75 KB  (★ содержит PREFACE_TEXT/PREGAME_TEXT с OCR хвостами)
  src/map_module.js:    ★ использует window.S 20 раз
  
build.sh REQUIRED_FILES (НЕ включает):
  ❌ mobile.css
  ❌ fonts/fonts.css

Pipeline integrity:
  ✅ Batch 4 интегрирован пользователем в параллельном чате (43 MJ_DATA)
  ✅ Шрифты на диске: Veles + Cyrillic Old Face + Cinzel + Cormorant
  ✅ Sound pack на диске: 20 OGG в dist/sounds/
  ✅ book_text.md: 915 KB, 1221 параграф
  ❌ text_corrections.json: НЕ СУЩЕСТВУЕТ
  ❌ window.S bridge: НЕ СУЩЕСТВУЕТ
  ❌ new Audio() handlers: НЕ СУЩЕСТВУЮТ
```

---

## Рекомендуемый порядок работ

### Сессия следующего раунда (после Batch 4)

В этом порядке (от самого критичного):

**P0 — обязательно перед следующим релизом:**
1. **Map fix** — добавить `Object.defineProperty(window, 'S', ...)` bridge в `game_logic.js`. Тестировать: новая игра, продолжение, открытие модалки, клавиша M
2. **OCR fix в game_logic.js** — 6 целевых `str_replace` на строках 22 и 24 (PREFACE_TEXT, PREGAME_TEXT)
3. **Создать `assets/text_corrections.json`** — зафиксировать все известные правки как single source of truth

**P1 — для качества UX:**
4. **Fix build.sh** — добавить mobile.css и fonts.css в финальный HTML, удалить Google Fonts @import
5. **Hookup sound pack** — заменить oscillator вызовы на `new Audio()` с реальными OGG
6. **Design ревизия** — collapse 10 scroll контейнеров до 1, убрать лишние max-width на широких экранах

**P2 — после Batch 4 закончен:**
7. Visual MJ QA по всем 43 артам с таблицей `paragraph → image → verdict`
8. Регенерация неподходящих артов с уточнёнными промптами

---

## Финальный диагноз

> **Проект не сломан целиком, но несколько ключевых слоёв не доведены до рабочего стыка друг с другом.**
> — ChatGPT 5.5 Research mode

Это формулировка точная. У нас:
- ✅ Большие данные собраны (1221 параграф, 43 MJ арта, шрифты, sound pack)
- ✅ Документация качественная (PROJECT_NOTES, GRAPH_AUDIT, MIDJOURNEY_PROMPTS, PWA_IMPLEMENTATION)
- ❌ Несколько критичных склеек не работают (карта, mobile.css, sound, OCR)
- ❌ Нет canonical corrections pipeline

Все эти 6 проблем имеют **простые** фиксы (от 5 минут до 1 часа на каждую), кроме design ревизии (отдельная сессия) и `text_corrections.json` (требует осмысленного дизайна структуры).

Я готов в следующей сессии **поочерёдно закрыть P0 + P1** в одной итерации (примерно 2-3 часа работы), если вы дадите команду "continue".

---

## Что делать пользователю

1. **Сейчас** — продолжать работу с Batch 4 в другом чате (визуальная QA, регенерация если нужно)
2. **Когда Batch 4 закончится** — открыть новую сессию с Claude и сказать: "Прочитай `_handoff/AUDIT_REPORT_2026-04-27.md` и начни с P0"
3. **Параллельно** — этот отчёт можно показать пользователю в Gemini Project как контекст для дальнейшей работы

Никаких изменений в коде в этой сессии **не делал** — только верификация и отчёт.
