# 🏰 Подземелья Чёрного замка

Цифровая адаптация книги-игры Дмитрия Браславского «Подземелья Чёрного замка» (серия «Путь Героя», 1-е издание 1991 г., ремейк 2018 г.).

Одна из первых русскоязычных книг-игр, вдохновлённая серией Fighting Fantasy. Игрок отправляется в Зачарованный лес, сражается с Гоблинами и Орками, проникает в Чёрный замок злого волшебника Барлада Дэрта и спасает Принцессу.

> ℹ️ **Важно:** проект работает с **ремейком 1-го издания 1991 г.** (1221 параграф, победа в §1220). Подробности о соответствии с оригинальной нумерацией — в [`PROJECT_NOTES.md`](PROJECT_NOTES.md).

## 🎮 Играть

Откройте [`dist/podzemelye-chyornogo-zamka-remake.html`](dist/podzemelye-chyornogo-zamka-remake.html) в браузере (Chrome, Edge или Firefox).

Игра работает **полностью offline** — никаких внешних зависимостей, никаких установок. Один самодостаточный HTML-файл (~9.3 MB).

## ✨ Возможности

### Механика (по канонам Fighting Fantasy)
- **Характеристики:** Мастерство (1d6+6), Выносливость (2d6+12), Удача (1d6+6)
- **Бой:** 2d6 + Мастерство против врага, урон 2 (или кастомный — яд змей ×3, орки ×1)
- **Мульти-враги:** атака только первого, все живые могут ранить
- **Проверка Удачи:** 2d6 ≤ текущей Удачи, −1 после каждой проверки
- **Бегство из боя:** автоматический штраф −2 выносливости
- **8 заклятий Майлина:** Огонь, Плавание, Левитация, Иллюзия, Сила, Слабость, Копия, Исцеление

### UI/UX
- 🖼 **36 цветных иллюстраций Midjourney** в едином стиле (dark Slavic fantasy) + 7 подготовленных промптов к новым артам
- 🖼 **28 чёрно-белых иллюстраций** из издания 1991 г. (fallback когда нет MJ-арта)
- 🗺 **Интерактивная карта** с fog-of-war (клавиша `M`)
- 🎒 **Автоматический инвентарь** — 56 параграфов с NLP-парсингом предметов и золота
- 📜 **Журнал событий** — полная история находок, боёв, проверок удачи
- 💾 **Сохранение** в localStorage, экспорт/импорт JSON
- 🎲 **Анимация бросков кубиков**
- 🔊 **Звуковые эффекты** через Web Audio API (процедурные)
- 🎨 **Lineart титул** — всадник и стилизованная надпись

### Навигация
- **URL hash navigation:** `файл.html#372` — прямой переход к параграфу
- **Клавиша M** — открыть/закрыть карту
- **Mini-map в боковой панели** — показывает текущий узел

## 📊 Статистика

| Параметр | Значение |
|---|---|
| Параграфов | 1221 |
| Выборов | 2156 |
| Боёв | 76 |
| Проверок удачи | 22 |
| Концовок | 60 |
| Автоматических предметов | 56 параграфов |
| Узлов на карте | 35 |
| Цветных MJ-иллюстраций | 36 (+7 pending) |
| Ч/б иллюстраций (1991) | 28 |
| Параграфов покрыто MJ-артом | 91 (112 после Batch 4) |

## 🏗 Структура репозитория

```
Dungeons-of-the-Black-Castle/
├── README.md                           # Этот файл
├── PROJECT_NOTES.md                    # Контекст: ремейк 1991 / 1221 параграф
├── QUICKSTART.md                       # Быстрый старт для разработчика
├── LICENSE                             # Лицензия
├── .gitignore
├── build.sh                            # Скрипт сборки src/* → dist/
│
├── dist/                               # 🎮 Играбельный билд
│   ├── podzemelye-chyornogo-zamka-remake.html   # Single-file игра (~9.3 MB)
│   ├── manifest.webmanifest            # (prepared) PWA install metadata
│   ├── sw.js                           # (prepared) Service Worker
│   ├── icons/                          # (prepared) PWA icons
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── icon-maskable-512.png       # Android adaptive icon
│   └── sounds/                         # (prepared) Procedural OGG fallback pack
│       ├── ui/, combat/, spells/, ambience/, events/   # 20 OGG files, 700 KB
│       ├── credits.txt
│       └── sounds_manifest.json
│
├── src/                                # Исходники (собираются в dist)
│   ├── game_shell_top.html             # HTML+CSS оболочка
│   ├── remake_data.js                  # GD = 1221 параграф (синк с dist)
│   ├── mj_art.js                       # 36 Midjourney иллюстраций (base64 + MJ_META)
│   ├── illustrations.js                # 28 ч/б иллюстраций 1991 (fallback)
│   ├── title_art.js                    # Lineart титула
│   ├── map_module.js                   # Модуль карты (fog-of-war)
│   ├── game_logic.js                   # Игровая логика (MJ приоритет над ILLUST)
│   ├── mobile.css                      # (prepared) Pixel 7a / iPhone 15 + safe-area-inset
│   └── fonts/                          # (prepared) Self-hosted шрифты (149 KB Latin/Cyrillic + 28 KB Slavic)
│       ├── fonts.css                   # @font-face: Cinzel, Cormorant, Veles, Cyrillic Old Face
│       ├── Cinzel-lat.woff2 + CinzelDecorative-lat.woff2 + 4× CormorantGaramond
│       ├── VelesRedone.woff2           # Slavic ornamental, для drop-caps
│       └── CyrillicOldFace.woff2       # Slavic-flavoured body text alternative
│
├── assets/                             # Источники (текст + PDF + арт)
│   ├── fb2_remake.fb2                  # Каноничный источник (1221 параграф)
│   ├── fb2_original_1991.fb2           # Справочно: сырой 1991 (583 параграфа)
│   ├── epub_remake.epub
│   ├── epub_original_1991.epub
│   ├── pdf_original_1991.pdf           # Скан 1-го издания
│   ├── original_errors.txt             # Известные ошибки 1991 г.
│   ├── analytical_report.pdf           # Аналитический отчёт (Windows + Android)
│   ├── book_text.md                    # Полный текст + corrections log (для Gemini/AI)
│   └── illustrations/
│       ├── originals/                  # 36 PNG в полном разрешении (НЕ ТРОГАТЬ)
│       └── web/                        # 36 JPEG 900px Q82 (производные копии)
│
├── art-pack/
│   └── metadata/
│       └── art_catalog.py              # Python-каталог: 43 арта, промпты + CDN URL + маппинг
│
├── docs/
│   ├── MIDJOURNEY_PROMPTS.md           # Все 43 промпта (36 generated + 7 pending) + hero --cref
│   ├── GRAPH_AUDIT.md                  # Граф-аудит 1221 параграфа (от Gemini G-2)
│   └── PWA_IMPLEMENTATION.md           # План активации PWA (от ChatGPT C-1)
│
├── scripts/                            # Git push helpers
│
└── _handoff/                           # Briefs для передачи контекста в новые AI-сессии
    ├── PROJECT_BRIEF.md
    ├── TASKS_CHATGPT.md
    └── TASKS_GEMINI.md
```

> **(prepared)** — файлы подготовлены, но ещё не активированы в билде.
> См. [`docs/PWA_IMPLEMENTATION.md`](docs/PWA_IMPLEMENTATION.md) для плана активации PWA.

## 🔨 Сборка

```bash
bash build.sh
```

Склеивает 7 файлов из `src/` в единый HTML в `dist/`. Порядок модулей определён в `build.sh`.

## 🎨 Иллюстрации

Все 36 сгенерированных Midjourney-артов выполнены в единой стилистике (dark Slavic fantasy, Ivan Bilibin × Frank Frazetta × Viktor Vasnetsov) с общим референсом героя (hooded traveler). Подготовлены 7 дополнительных промптов для Batch 4 — ключевые боссы и сцены (спайдер, рыцарь на коне, скелеты в склепе, змея, каменные крысы, финал с Барладом, освобождение принцессы).

Для перегенерации или добавления новых сцен:

- Промпты → [`docs/MIDJOURNEY_PROMPTS.md`](docs/MIDJOURNEY_PROMPTS.md)
- Hero `--cref` URL → `https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png`
- Python-каталог (программный доступ) → `art-pack/metadata/art_catalog.py`

**Приоритет при рендеринге** (в `src/game_logic.js`):
1. `MJ_MAP` → `MJ_DATA` (цветной AI-арт) — предпочтительно
2. `ILLUST_MAP` → `ILLUST_DATA` (ч/б скан 1991 г.) — fallback
3. Без изображения — только текст

## 🧭 Дальше

- [x] Граф-аудит игровой логики (см. [`docs/GRAPH_AUDIT.md`](docs/GRAPH_AUDIT.md))
- [x] Подготовка PWA (см. [`docs/PWA_IMPLEMENTATION.md`](docs/PWA_IMPLEMENTATION.md))
- [x] Самостоятельные шрифты + 2 славянских шрифта (Veles Redone, Cyrillic Old Face)
- [x] Sound pack (procedural fallback, 20 OGG в `dist/sounds/`)
- [x] Markdown-экспорт текста книги для Gemini Project (`assets/book_text.md`)
- [x] Орфография в Midjourney промптах + явная славянская внешность для не-нежити персонажей
- [ ] Сгенерировать 7 артов Batch 4 в Midjourney (промпты готовы в `docs/MIDJOURNEY_PROMPTS.md`)
- [ ] Активировать PWA (требует HTTPS хостинг — см. план активации)
- [ ] Заменить procedural sounds на real CC0/CC-BY OGG/WAV
- [ ] Полное тестовое прохождение §1 → §1220
- [ ] Custom combat conditions (wound_2 для Дракона §532)
- [ ] Динамическая математика (§13 рыбка +15, §140 Золотой ключ +30)
- [ ] Локализация на EN/FR с переключателем языка (кроме боя)
- [ ] Визуальная проверка всех MJ артов на соответствие сцене (после Batch 4)

## 📜 Источники

- **Ремейк (основной):** Браславский + Морозов, 2018 — 1221 параграф
- **Оригинальные издания:** 1991, 1995, 2010, 2014, 2023
- **Ч/б иллюстрации 1991:** из сканов 1-го издания
- **Цветные иллюстрации:** Midjourney v6 (2026), промпты в `docs/MIDJOURNEY_PROMPTS.md`

## 🛠 Технологии

- Vanilla JavaScript (без фреймворков)
- Single-file HTML5 (~9.3 MB с иллюстрациями)
- CSS3 + CSS Variables
- SVG для карты и fog-of-war
- Web Audio API для звуков
- localStorage (ключ `podzch_v5`)

## 📄 Лицензия

См. [LICENSE](LICENSE). Книга-игра — © Дмитрий Браславский. Код адаптации — MIT.

---

Разработано с использованием Claude Opus 4.7 (Anthropic), ChatGPT 5.5 Extended и Gemini 3.1 Pro.
