# Проект: Подземелья Чёрного замка — цифровая адаптация книги-игры

## 1. Архитектура проекта

**Стек:** Single-file HTML5 (vanilla JS, без фреймворков)
- Один файл ~4.5 MB, открывается локально в Chrome/Edge
- JavaScript модули объединены в `<script>` тег: данные игры + иллюстрации + логика
- CSS в едином `<style>` блоке с CSS-переменными для темы
- Никаких внешних зависимостей, работает offline

**Источник данных:**
- FB2-файл ремейка (Браславский + Морозов, 2018) — 1221 параграф
- Распарсен Python-скриптом в JSON-структуру:
```javascript
{
  "1": {
    id: 1,
    text: "Вы быстро идёте вперёд...",
    choices: [{target: 1219, label: "По правой дороге (1219)"}, ...],
    enemies: [{name: "ШПИОН", skill: 10, stamina: 12, damage: 2}],
    has_luck: false,
    auto_items: {items: ["Кольцо"], gold: 10},
    player_attack_mod: -2  // спец-модификаторы
  }
}
```

**Навигация:**
- Граф переходов через `goTo(paragraphId)` 
- URL hash navigation: `file.html#372` — прыжок на параграф 372
- Сохранение в localStorage (ключ `podzch_v5`, JSON)
- Экспорт/импорт save-файлов (.json)

## 2. Игровая механика (книги-игры в духе Fighting Fantasy)

**Характеристики (броски один раз):**
- Мастерство: 1d6 + 6 (диапазон 7-12)
- Выносливость: 2d6 + 12 (диапазон 14-24)
- Удача: 1d6 + 6 (диапазон 7-12)

**Боевая система:**
- Каждый раунд: Сила Удара = 2d6 + Мастерство (+ модификатор от параграфа)
- Кто выше — наносит 2 урона (или кастомный: яд змей = 3, орки = 1)
- Множественные враги: атака только первого живого, все живые враги могут ранить
- Бегство из боя: −2 выносливости автоматически

**Проверка Удачи:**
- 2d6 ≤ текущей Удачи = удача
- Удача уменьшается на 1 после каждой проверки

**Заклятия (Майлин даёт 10 зарядов):**
- 8 типов: Огонь, Плавание, Левитация, Иллюзия, Сила, Слабость, Копия, Исцеление
- Игрок распределяет 10 зарядов между заклятиями перед началом
- Эффекты обрабатываются через параграфы книги (переход на §X для эффекта)
- Исключение: Исцеление работает из сайдбара (+8 выносливости вне боя)

**Инвентарь:**
- Заплечный мешок 7 предметов макс
- Фляга: 2 глотка × 2 выносливости
- Золото (не занимает слот)
- Автоматическое добавление предметов через NLP-парсинг текста параграфа
- При переполнении — модальное окно выбора: что взять/выбросить

## 3. Визуальный стиль и UI

**Текущая тема:** Мрачное фэнтези, «пергамент и чернила»

**Палитра (CSS-переменные):**
```css
--bg: #1c1a16 (тёмно-коричневый фон)
--bg2: #252220 (панели)
--parchment: #e8dcc4 (основной текст — цвет пергамента)
--gold: #c8962a (акцент — золотая охра)
--muted: #8a7f6a (вторичный текст)
--red: #8b1a1a (враги, опасности)
--green: #4a6b3a (удача, лечение)
--border: #3d352c (рамки)
```

**Шрифты:**
- `Cormorant Garamond` для основного текста (серифный, книжный)
- `Cinzel` для заголовков и UI (классический, каменный)

**Текущие экраны:**
1. **Титульный** — стилизованная надпись + рисунок всадника (lineart, прозрачный фон)
2. **Создание персонажа** — 3 карточки характеристик с анимацией броска кубиков
3. **Выбор заклятий** — 2-колоночная сетка с кнопками +/−
4. **Предисловие** (опционально) — полный текст из книги
5. **Игра** — боковая панель (листок путешественника) + основная область (параграф + выбор)
6. **Модалы** — бой, проверка удачи, инвентарь, журнал событий

**Иллюстрации:** 28 ч/б сканов (4-е и 5-е издания) встроены как base64, отображаются над текстом параграфа

## 4. Области для дизайн-улучшений

### Приоритет 1: Цветные AI-иллюстрации
Текущие сканы — ч/б гравюры. Нужна замена цветными иллюстрациями в едином стиле.

### Приоритет 2: Атмосфера
- Более текстурированные фоны (пергамент, дерево, камень замка)
- Рамки и орнаменты в славянском/средневековом стиле
- Анимации перехода между параграфами
- Визуальный эффект при применении заклятий (огонь, вода, и т.д.)

### Приоритет 3: Типографика
- Буквица (drop-caps) в начале каждого параграфа
- Декоративные разделители между секциями
- Лучший контраст в слабо-освещённых частях экрана

## 5. DALL-E 3 Промпты для цветных иллюстраций

### Промпт 1: Зачарованный лес (параграф 1)
```
Dark fantasy book illustration, oil painting style of Ivan Bilibin and Frank Frazetta. 
Enchanted Russian forest at twilight, twisted ancient oaks with gnarled roots, 
mystical fog weaving between trunks, a forked dirt path disappearing into shadows. 
Golden autumn leaves scattered on moss. Distant black castle silhouette on horizon. 
Rich earth tones, deep greens and golds, atmospheric lighting. Book illustration, 
portrait orientation 3:4 aspect ratio.
```

### Промпт 2: Чёрный замок (параграф 244)
```
Dark fantasy gamebook illustration in the style of Frank Frazetta meets Russian folk art. 
Ominous gothic black castle on jagged rocky cliff, multiple twisted spires piercing 
storm clouds, black banners whipping in wind. Lightning in purple-grey sky. Forest 
mists curl around the base. Dramatic chiaroscuro lighting with gold highlights. 
Villainous, foreboding atmosphere. Portrait orientation 3:4.
```

### Промпт 3: Шестилапый зверь (параграф 372)  
```
Dark fantasy creature illustration inspired by Russian bestiary. Six-legged shaggy beast 
with matted fur, crouched aggressively on forest path, red gleaming eyes, fanged maw 
snarling. Muscular body hybrid of wolf and bear. Surrounded by tall dark trees, 
shafts of dusty light. Ivan Bilibin meets Brom artistic style. Earthy brown tones 
with blood-red accents. Portrait orientation 3:4.
```

### Промпт 4: Спящая Принцесса (параграф 627)
```
Ethereal fantasy illustration in Russian fairy tale style. Beautiful sleeping princess 
on ornate canopied bed, flowing golden hair, wearing silver crown, pale peaceful face. 
Gothic chamber with medieval candelabras, flickering candles casting warm glow. 
Heavy brocade curtains, intricate tapestries. Magic sparkles in air. Bilibin-meets-
Klimt style. Rich golds, deep reds, ivory. Portrait orientation 3:4.
```

### Промпт 5: Герой-путешественник (главный герой)
```
Dark fantasy adventurer portrait, Russian folk hero archetype. Young warrior in 
traveling cloak, chain mail glimpsing beneath, sword at hip, weathered leather 
satchel. Strong but not arrogant expression, determined eyes. Forest path background 
with distant castle spires. Oil painting texture, Frank Frazetta meets Viktor 
Vasnetsov style. Rich earth tones, dramatic rim lighting. Portrait orientation 3:4.
```

### Промпт 6: Титульный экран / обложка
```
Epic dark fantasy book cover illustration. Young heroic warrior on rearing white horse 
charges toward ominous black gothic castle with twisted spires. Stormy sky with 
lightning. Enchanted forest of twisted trees frames composition. Dramatic swords 
and magical glowing runes floating around edges. Ivan Bilibin meets Frank Frazetta 
meets Alan Lee style. Title text space at top/right. Rich cinematic colors: deep 
purples, golds, blacks, crimson accents. Landscape or portrait orientation suitable 
for book cover.
```

## 6. Полировка — незакрытые задачи

### Баги/мелкие проблемы:
- **537 подписей кнопок** всё ещё содержат «…», «:», «;» — требуется ручной аудит (файл `label_audit.html` с прямыми ссылками)
- Несколько параграфов с плохими контекстными подписями (§267, §1193 уже исправлены вручную)
- Автоинвентарь охватывает только 41 параграф из ~150 с предметами

### Полировка UX:
- Нет звуковых эффектов из реальных файлов (только Web Audio осцилляторы)
- Нет анимации перехода между параграфами
- Иллюстрации появляются резко (можно добавить fade-in + Ken Burns эффект)
- Боевой модал не имеет визуальной индикации здоровья (только числа)
- Нет мини-карты / графа посещённых параграфов

### Визуальные улучшения приоритет:
1. Заменить ч/б сканы на цветные AI-иллюстрации
2. Добавить декоративные рамки вокруг иллюстраций
3. Буквица в начале параграфа
4. Текстурированные фоны для разных локаций (лес, замок, подземелье)
5. Анимации для боя (удар, парирование, урон)
6. Эффекты частиц для заклятий

### Мобильная адаптация (отложено):
- Текущая вёрстка десктоп-only (1920×1200 таргет)
- Боковая панель 320px фиксирована
- Планируется Android Pixel 7a таргет

## 7. Важные файлы

- `podzemelye-chyornogo-zamka-remake.html` — главный playable файл (~4.5 MB)
- `remake_1221_paragraphs.json` — распарсенные данные (~900 KB)
- `label_audit.html` — интерактивный аудит подписей (прямые ссылки на параграфы)

## 8. Ключевые исходники

- FB2 ремейка: 1221 параграф (Браславский + Морозов, 2018)
- Оригинальные издания 1991, 1995, 2010, 2014, 2023
- 11 иллюстраций 4-го издания (Никулушкин/Чуваший, 2014)
- 19 иллюстраций 5-го издания (Никулушкин, 2022, цветная обложка Емельянов 2023)

## 9. Текущая статистика игры

- **Параграфов:** 1221
- **Выборов:** 2120  
- **Боёв:** 76
- **Проверок удачи:** 22
- **Концовок:** 60 (включая победу §1220)
- **Параграфов с иллюстрациями:** 56
- **Автоматического инвентаря:** 41 параграф
- **Помеченных заклятий:** 95
- **Помеченных "если победили":** 48
- **Кастомного урона:** 10 врагов
- **Модификаторов атаки:** 3 параграфа

## 10. Рекомендация для ChatGPT

**Фокусы для визуального улучшения:**
1. Сгенерировать 5-10 цветных AI-иллюстраций по промптам выше и интегрировать в игру вместо/дополнительно к сканам
2. Улучшить титульный экран (сейчас lineart + текст — можно сделать полноценную цветную обложку)
3. Добавить декоративные рамки к блокам текста и иллюстрациям
4. Разработать визуальную систему для разных локаций (лес vs замок vs подземелье)
5. Предложить анимации для ключевых моментов (бросок кубиков, удар в бою, проверка удачи, получение предмета)

**НЕ трогать в ChatGPT:**
- Парсинг FB2 и структуру данных
- Игровую логику (механика боя, удачи, заклятий)
- URL hash navigation
- Event log
- Auto-inventory NLP

Эти системы работают стабильно, изменения в них могут сломать баланс.
