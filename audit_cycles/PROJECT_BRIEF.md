# Project Brief — Dungeons of the Black Castle

> Прикрепите этот файл к сессии любой AI-модели (Gemini, ChatGPT, Claude)
> для получения полного контекста проекта. Используйте вместе с
> `TASKS_<MODEL>.md` для конкретной модели.

---

## Что это за проект

Браузерная цифровая адаптация советской книги-игры **«Подземелья Чёрного
замка»** Дмитрия Браславского (1-е издание 1991 г., ремейк 2018 г.).
Жанр — gamebook в стиле Fighting Fantasy: игрок делает выборы, кидает
кубики, сражается, находит предметы, попадает в концовки.

- **Язык:** русский (тексты), JavaScript (код), Markdown (доки)
- **Платформа цели:** Windows-браузер (primary), Android Pixel 7a (planned)
- **GitHub:** https://github.com/YVashchuk/Dungeons-of-the-Black-Castle (приватный)
- **Локальная папка:** `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle\`

## Ключевые решения по дизайну

1. **Single-file HTML.** Один self-contained `.html` ~9 MB открывается с диска
   без сервера. Все ассеты (иллюстрации, данные, код) запечены как base64.
2. **Ремейк — каноничный источник.** Работаем с исправленной версией 2018 г.
   (1221 параграф, победа в §1220). Оригинал 1991 (583 параграфа) хранится
   для справки.
3. **Иллюстрации в два слоя.** Приоритет: 36 цветных Midjourney-артов
   (single visual style — Bilibin × Frazetta × Vasnetsov). Fallback: 28 ч/б
   сканов 1991 г. Если нет ни того ни другого — текст без картинки.
4. **Модульные исходники, склеиваемый билд.** `src/` содержит 7 модулей,
   `build.sh` конкатенирует их в `dist/podzemelye-chyornogo-zamka-remake.html`.
5. **Vanilla JS.** Никаких фреймворков, зависимостей, сборщиков. Ни npm, ни webpack.

## Игровая механика (Fighting Fantasy)

- **Характеристики (бросаются 1 раз):** Мастерство `1d6+6`, Выносливость `2d6+12`, Удача `1d6+6`
- **Бой:** каждый раунд — `2d6 + Мастерство` против `2d6 + Мастерство врага`;
  кто выше — бьёт. Урон обычно 2, но бывают спец-правила (яд змей ×3, орки ×1).
- **Мульти-враги:** игрок атакует только первого; все живые могут ранить.
- **Удача:** проверка `2d6 ≤ текущей Удачи`; после каждой проверки `−1`.
- **Инвентарь:** 7 слотов + фляга (2 глотка ×+2 Выносливости).
- **8 заклятий Майлина:** Огонь, Плавание, Левитация, Иллюзия, Сила,
  Слабость, Копия, Исцеление. На старте выдаётся до 10 charges.
- **Сохранение:** `localStorage['podzch_v5']`, JSON export/import.

## Структура репозитория

```
Dungeons-of-the-Black-Castle/
├── README.md                  Общее описание
├── PROJECT_NOTES.md           Проектные правила (ремейк 1991, 1221 пар)
├── QUICKSTART.md              Git push инструкции
├── LICENSE                    MIT (код) + copyright Браславского (текст)
├── build.sh                   Склейка src/*.js → dist/*.html
├── .gitignore
│
├── assets/                    5 MB — source тексты и PDF
│   ├── fb2_remake.fb2               ← каноничный источник (1221 пар)
│   ├── fb2_original_1991.fb2        ← справочно, 583 пар
│   ├── epub_remake.epub, epub_original_1991.epub
│   ├── pdf_original_1991.pdf        ← скан 1-го издания
│   ├── original_errors.txt          ← известные ошибки 1991 г.
│   ├── analytical_report.pdf        ← 14 MB PDF — анализ Windows+Android
│   └── illustrations/
│       ├── originals/               ← 36 PNG (Midjourney), full-res, НЕ трогать
│       └── web/                     ← 36 JPEG 900px Q82, производные
│
├── art-pack/metadata/art_catalog.py ← Python-каталог промптов + CDN URL
│
├── docs/MIDJOURNEY_PROMPTS.md       ← Все 36 промптов + hero --cref URL
│
├── src/                             Исходные модули игры
│   ├── game_shell_top.html    HTML+CSS, открывает <script>
│   ├── remake_data.js         GD = {1221 paragraph objects} (~1 MB)
│   ├── illustrations.js       Legacy 1991 b/w scans (fallback, base64)
│   ├── title_art.js           Title-screen SVG/Canvas lineart
│   ├── mj_art.js              5 MB — MJ_DATA (base64) + MJ_MAP + MJ_META
│   ├── map_module.js          Панель карты + fog-of-war
│   └── game_logic.js          ~77 KB — combat, luck, inventory, render engine
│
├── dist/podzemelye-chyornogo-zamka-remake.html   9.3 MB — playable
│
└── scripts/   init/update/push helpers для Git
```

### Структура данных параграфа (GD)

```javascript
{
  "1": {
    id: 1,
    text: "Вы быстро идёте вперёд...",
    choices: [
      {target: 1219, label: "По правой дороге (1219)"},
      {target: 872,  label: "По левой дороге (872)"}
    ],
    enemies: [{name: "ШПИОН", skill: 10, stamina: 12, damage: 2}],
    has_luck: false,
    auto_items: {items: ["Кольцо"], gold: 10},
    player_attack_mod: -2
  },
  // ... 1221 entries
}
```

### Статистика игры

| Метрика | Значение |
|---|---|
| Параграфов | 1221 |
| Выборов | 2120 |
| Боёв | 76 |
| Проверок удачи | 22 |
| Концовок | 60 |
| Параграфов с auto-items | 56 |
| Узлов на карте | 35 |
| Цветных MJ-артов | 36 |
| Ч/б legacy-артов | 28 |
| Параграфов с MJ-покрытием | 91 |

## Рендер-приоритет иллюстраций (`game_logic.js`)

```javascript
// 1) MJ (preferred, colored AI art)
if (MJ_MAP[String(S.section)] && MJ_DATA[artId]) {
  illustHtml = `<img class="mj-art" src="${MJ_DATA[artId]}" />`;
}
// 2) Legacy 1991 b/w scan (fallback)
else if (ILLUST_MAP[String(S.section)] && ILLUST_DATA[imgFile]) {
  illustHtml = `<img class="legacy-scan" src="data:image/jpeg;base64,${ILLUST_DATA[imgFile]}" />`;
}
// 3) Text only
```

## Маппинг original(583) → remake(1221)

MJ-арты заказаны под оригинальную нумерацию 583, но на этапе интеграции
перемаплены на ремейк 1221. Каждый `MJ_META` содержит оба поля:
`originalParagraphs` и `remakeParagraphs`.

Примеры маппинга:
| Сцена | original §(583) | remake §(1221) |
|---|---|---|
| Opening forest | 1 | 1, 14 |
| Black Castle first view | 118 | 244, 250, 330 |
| Dragon | 37, 41 | 188, 440, 532, 1136 |
| Sleeping Princess | 617 | 1072, 1220 |
| Library | 22, 350 | 441, 701, 718, 766 |

Полный каталог (91 параграф покрыт) в `art-pack/metadata/art_catalog.py`
или `src/mj_art.js` → `MJ_META`.

## Hero character reference

Единый `--cref` URL для всех новых MJ-генераций, чтобы герой выглядел
идентично в новых артах:

```
https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
```

## Стилистика MJ-промптов

**Style suffix (добавляется к каждому промпту):**
```
dark Slavic fantasy oil painting in the style of Ivan Bilibin meets
Frank Frazetta meets Viktor Vasnetsov, rich muted earth tones, burnt
sienna, deep forest green, oxblood red, gold leaf accents, candlelit
gothic atmosphere, textured brushwork, no text, no UI, no borders,
no watermark, painterly detail, cinematic framing
--style raw --ar 3:2 --stylize 250 --v 6
```

## Что уже сделано ✅

- Распарсены 1221 параграф из FB2 ремейка
- Движок: чаракреация, бой, удача, инвентарь, 8 заклятий, 60 концовок
- Fog-of-war карта с 35 узлами, клавиша `M`
- Сохранения в localStorage + JSON export/import
- Анимации кубиков, процедурные звуки (Web Audio API)
- 36 Midjourney-иллюстраций сгенерированы в едином стиле и интегрированы
- Приоритет MJ > legacy b/w в рендере
- Полная документация: README, PROJECT_NOTES, QUICKSTART, MIDJOURNEY_PROMPTS
- Удалён старый/неактуальный мусор из проекта
- `build.sh` корректно склеивает 7 модулей в `dist/` (9.3 MB)

## Что ЕЩЁ НЕ сделано ⏳

- [ ] **Полное тестовое прохождение §1 → §1220** (QA на баги)
- [ ] **Мобильная адаптация** — layout, touch-targets, Pixel 7a viewport
- [ ] **PWA manifest + Service Worker** для установки на главный экран Android
- [ ] Реальные WAV/OGG звуки (сейчас процедурные)
- [ ] Буквица в начале параграфа (drop-cap)
- [ ] Анимация перехода между параграфами
- [ ] Визуальные эффекты заклятий (огонь, иллюзия, сила)
- [ ] Google Drive sync сохранений
- [ ] Modular refactor (dist 9 MB — рассмотреть lazy-loading MJ-артов)
- [ ] Ambience layer (фоновые звуки локаций)
- [ ] Дополнительные MJ-арты для непокрытых сцен (~1130 параграфов без арта)

## Важные правила

1. **Ремейк (1221) — каноничный.** Оригинал 1991 (583) — только для справки.
2. **Originals never modified.** `assets/illustrations/originals/*.png` — source of truth.
3. **MJ-арт — приоритет.** Legacy ч/б — fallback для непокрытых сцен.
4. **Промпты живут в трёх местах** и должны быть синхронизированы: `src/mj_art.js`
   (`MJ_META`), `docs/MIDJOURNEY_PROMPTS.md`, `art-pack/metadata/art_catalog.py`.
5. **Нельзя ломать single-file принцип.** Никаких внешних CDN, fetch, import.
6. **Нельзя вводить фреймворки.** Vanilla JS, никаких React/Vue/jQuery.
7. **Save-key `podzch_v5`** — если меняете формат, пишите миграцию.
