# Midjourney Prompts — Dungeons of the Black Castle

**Ревизия v2 · 2026-07-10.** Каталог промптов, синхронизированный с истиной привязок — `MJ_MAP` в [`src/mj_art.js`](../src/mj_art.js).

**Состояние:** сгенерировано **45 артов** (`dist/art/mj/`, Batch 1–4 + art53/54) · очередь **перегенераций: 2** (дефекты июльского аудита) · **новые арты-замены: 5** (art55–59) · **Batch 5 — замена legacy ч/б сканов книги: 20 промптов** (28 файлов в `art/legacy/`, 21 сцена привязана, 7 файлов без привязок).

- **Программный каталог:** [`art-pack/metadata/art_catalog.py`](../art-pack/metadata/art_catalog.py)
- **Runtime метаданные:** `MJ_META` в [`src/mj_art.js`](../src/mj_art.js) — ⚠ поле `remakeParagraphs` устарело у 9 артов, истина = `MJ_MAP` (см. «Несоответствия» внизу)
- **Legacy ч/б:** `ILLUST_DATA`/`ILLUST_MAP` в [`src/illustrations.js`](../src/illustrations.js)

## Hero Character Reference (`--cref`)

Используется во всех промптах для согласованной внешности героя:

```
https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
```

## Стилистический суффикс

Применяется ко всем сценам (в Batch 1–3 и 5 промпты хранятся «сценой», суффикс добавляется при генерации; в Batch 4 промпты записаны полностью):

> _dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting_

**Default Midjourney params:** `--cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6`
**Default negatives:** `--no cartoon, anime, modern clothing, CGI, text, watermark`

> ⚠ **Версия модели.** Весь существующий сет генерирован на `--v 6`. Для перегенераций и Batch 5 держим `--v 6` ради стилевой однородности; переход на `--v 7` — только после тест-пары (одна перегенерация в v6 и v7 рядом) и решения автора.

## Согласованность внешности персонажей

Все человеческие персонажи (кроме нежити, орков, гоблинов, водных духов и зверей) — **славянская внешность** (Eastern European facial features) и **восточноевропейский средневековый народный костюм**. Правило действует и для всех новых промптов ниже.

---

# ОЧЕРЕДЬ ПЕРЕГЕНЕРАЦИЙ (июльский аудит 2026, group_71)

### `art30_two_headed_dragon` — §449 · дефект: **отрендерена одна голова**

**Status:** ⚠ REGENERATE

**Prompt (ужесточён):**

```
enormous dragon with exactly TWO separate heads on two long serpentine necks, both heads clearly visible side by side with glowing eyes, landing in enchanted forest clearing, massive wings spread wide, hooded hero stands small on rocky outcrop, autumn leaves and embers
```

**Params add-on:** `--no single head, one neck, three heads`

### `art47_stone_rats` — §1003, §1110 · дефект: **существа отрендерены органическими, не каменными**

**Status:** ⚠ REGENERATE

**Prompt (ужесточён):**

```
swarm of rat-shaped creatures carved entirely from cracked grey granite, stone golems in rat form, chipped mineral bodies with glowing red eye-sockets, no fur anywhere, gnashing stone fangs, scurrying over damp slate dungeon floor, hooded hero swinging a pale-green glowing steel sword through them
```

**Params add-on:** `--no fur, flesh, organic rats, whiskers`

### Ретушь (Photoshop, без перегенерации)

- `art51_barlad_dert_boss` — свитки/карты на столе содержат псевдотекст-артефакты → замазать.
- `art08_library` — корешки книг с артефактами надписей → замазать.

---

# НОВЫЕ АРТЫ-ЗАМЕНЫ (art55–59) — сцены, которым текущие привязки не соответствуют

После генерации каждого — перепривязка в `MJ_MAP` (указано у каждого арта); реестр group_71.

### `art55_empty_throne` — §688 (сейчас там art14 «колдун на троне» — сцене не соответствует: в §688 трон ПУСТ, тайник в подлокотнике)

```
ancient empty wooden throne standing in a shadowed alcove of a gothic chamber, ornate carved armrests, one armrest slightly ajar revealing a hidden secret drawer, dust motes in candlelight, hooded hero reaching toward it cautiously, no people on the throne
```

`--no person sitting, sorcerer, occupant` · **Remap:** §688 → art55; `art14_throne` уходит в резерв (пригодится для тронного зала при будущем расширении).

### `art56_two_mounted_knights` — §46 (аудит: в сцене ДВА КОННЫХ зелёных рыцаря; art33 — трое пеших)

```
two imposing knights in deep green plate armor riding armored warhorses toward the viewer on a misty forest road, lances raised, hooded hero standing his ground, autumn leaves swirling under hooves
```

**Remap:** §46 → art56.

### `art57_single_green_knight` — §96 (аудит: в сцене ОДИН рыцарь)

```
single towering knight in ornate deep green plate armor standing alone on forest path, great sword planted before him, visor lowered, hooded hero facing him at ten paces, tense duel about to begin
```

**Remap:** §96 → art57.

### `art58_corridor_flight` — §112 (аудит: сцена — БЕГСТВО героя по коридору после провала у переговорной трубки; сейчас art33)

```
hooded hero sprinting down a dark castle corridor away from a brass speaking tube mounted on the wall, three arched passages ahead splitting right, straight and left, candle flames streaming sideways from his speed, urgency and alarm
```

**Remap:** §112 → art58 (legacy `395419_11` на §112 после этого ретирится).

### `art59_castle_main_gate` — §56 (аудит: нужен собственный арт главных ворот; сейчас §56 делит art34_orcs)

```
massive iron-bound double gates of the black castle seen from outside, towering dark stone gatehouse with murder holes, torches guttering in brackets, three orc silhouettes on guard in the archway shadow, hooded hero approaching up the causeway
```

**Remap:** §56 → art59 (art34 остаётся на §37/§65/§71/§645).

### Закрыто без действий (для истории)

- **Дубль принцессы art09/art26 на §1072 — РАЗРЕШЁН в карте:** art09 → §1072, art26 → §45. ✅
- `art53_six_legged_beast` (§311) и `art54_forest_path` (§1) — **уже сгенерированы и привязаны** (июльские добавления; в прошлой версии этого документа отсутствовали — теперь учтены в инвентаре).

---

# Batch 5 — ЗАМЕНА LEGACY Ч/Б СКАНОВ КНИГИ (20 промптов)

Цель: полный уход от сканов издания в `art/legacy/` — каждую сцену заменяет арт в фирменном стиле. Промпты — «сценой» (суффикс/параметры — стандартные). У каждой сцены указано: параграфы и **решение** — `NEW` (legacy — единственная иллюстрация этих параграфов, нужен новый арт) или `RETIRE→artNN` (параграфы уже перекрыты MJ-артом: после проверки покрытия скан просто снимается; промпт дан как опциональный вариант-дубль, генерировать не обязательно).

### `art60_dying_man_flask` — `395419_4` · §385, §566 · **NEW**

```
hooded hero kneeling beside a dying ragged man on the forest floor, offering him a leather flask, the man drinking two grateful gulps and sinking back, whispering a last secret, fallen leaves around them, quiet sorrow
```

### `art61_lesovichok_anthill` — `395419_7` · §50, §76, §79 · **NEW**

```
tiny mischievous forest spirit — a bearded old man of moss and bark — gleefully waving his hand as the world dissolves in a swirl of golden leaves, the hooded hero reappearing seated on a huge anthill at the edge of a wide sunlit clearing with no road in sight
```

### `art62_hut_secret` — `395419_8` · §163*, §284, §627 · **NEW** (§284 и §627 без MJ; §163 также у art03)

```
the talking hut on giant chicken legs leaning close as if whispering, warm light spilling from its carved windows onto the hooded hero, conspiratorial mood, the deepest secret of the black castle being revealed
```

### `art63_crypt_sarcophagi` — `395419_9` · §811*, §935, §1158 · **NEW** (§811 также у art42)

```
vast underground burial hall with two great stone sarcophagi and a lone gravestone in the far corner, one sarcophagus crowned by an equestrian statue of a crowned man in a long mantle with sword and reins, hooded hero catching his breath after battle, torch smoke curling
```

### `art64_tower_goblin_sentry` — `395419_10` · §131*, §352 · **NEW** (§131 также у art19 — вариант с часовым)

```
hooded hero stepping through a low door onto a castle watchtower beneath a vast starry sky, a goblin sentry spinning around to face him with scimitar drawn, wind-torn banners, valley lights far below
```

### `art65_beggar_coins` — `395419_13` · §49, §744*, §874 · **NEW** (§744 также у art21)

```
ragged old beggar woman on a misty forest road thrusting out a dented tin cup, hooded hero counting copper coins into it, her eyes glinting with something more than gratitude, unease in the air
```

### `art66_riverbank_goblin_ambush` — `395419_14` · §58, §129*, §220 · **NEW** (§129 также у art17)

```
goblin bursting out of riverside bushes mid-leap, sabre swinging at the startled hooded hero, pebbled riverbank, a dugout pirogue moored to a leaning tree, spray and autumn leaves
```

### `art67_river_pirogue` — `395419_15` · §429, §1189 · **NEW**

```
wide fast-flowing river crossing the forest, small dugout pirogue tied to a tree on the near bank, goblin warrior with a yataghan advancing along the waterline toward the hooded hero, castle spires beyond the far shore
```

### `art68_merchant_fight` — `2_26db…` · §36, §56*, §83 · **NEW** (§56 уйдёт на art59)

```
burly forest merchant swinging a massive cudgel at the hooded hero beside an overturned cart of wares, slow but bone-crushing blows, scattered goods on the road, autumn dust
```

### `art69_wall_door` — `2_37db…` · §70 · **NEW**

```
forest path ending flat against the immense black wall of the castle, a small barely visible door set into the stone with a worn iron ring, impassable thicket crowding both sides, hooded hero examining the frame by lantern light
```

### `art70_vodyanoy_fight` — `2_6403…` · §260*, §333, §600 · **NEW** (§260 также у art23 — там дух ЯВЛЯЕТСЯ, тут — бой)

```
hooded hero crossing swords with the Vodyanoy — a translucent glowing water spirit — inside a flooded tavern hall, benches floating, hooded monks scrambling away from the spray, ethereal blue light against candle gold
```

### `art71_yarn_ball_lost` — `2_bfd6…` · §747, §829, §923 · **NEW**

```
the little golden ball of yarn darting off the forest path into dark undergrowth, hooded hero pushing branches aside a moment too late, finding only a small rain puddle glinting on the earth, hollow sense of loss, drifting leaves
```

### Опциональные варианты (параграфы уже перекрыты MJ — сначала снять legacy, дубль генерировать по желанию)

- `395419_3` · §833/§1013/§1097 → **RETIRE→art07**. Вариант: `vast echoing main corridor of the black castle, wrought-iron candelabra shaped like coiling serpents, ceiling lost in blackness above, two doors and two stone staircases — one descending, one ascending, hooded hero listening to his own echo`
- `395419_5` · §244/§250/§330 → **RETIRE→art02**. Вариант: `black castle revealed at dusk from the forest edge, dread radiating from its towers, hooded hero frozen at the treeline realizing the forest was only the beginning`
- `395419_6` · §100/§305/§319 → **RETIRE→art35**. Вариант: `hooded hero fighting four ragged bandits at once in a forest clearing, the nearest one already wounded and reeling, blades flashing between the trees`
- `395419_12` · §26/§46/§48 → **RETIRE→art20** (§46 уйдёт на art56). Вариант — не требуется.
- `395419_16` · §441/§689/§718 → **RETIRE→art08**. Вариант: `curious old librarian peering over his spectacles at the hooded hero, then slipping away between towering candlelit bookshelves promising to find something interesting`
- `395419_17` · §38/§154/§372 → **RETIRE→art27** (⚠ §372 в art27 не входит — добавить §372 в `MJ_MAP→art27` при снятии). Вариант: `huge snarling monkey lunging from a mossy oak at the hooded hero, claws out, sword flashing up to parry`
- `395419_18` · §481/§685/§707 → **RETIRE→art06**. Вариант: `duel with the vampire sorceress in a candlelit chamber, her black gown flaring like wings, a hidden door glimpsed behind the heavy curtain to the right`
- `2_f30a…` · §1 → **RETIRE→art54_forest_path** (уже сгенерирован). Вариант — не требуется.

### Legacy-файлы без привязок (7) — решить: подключить или снять

`395419_1.jpeg`, `2_5f9b70…`, `2_5ffff1…`, `2_236778…`, `2_a43d10…`, `2_8e334b…`, `2_d5f1e7…` — в `ILLUST_DATA` есть, в `ILLUST_MAP` не используются. Вероятно титул/карта/декор издания. Решение автора при арт-инкременте: привязать к параграфам или удалить из `ILLUST_DATA` (и из `art/legacy/`).

---

# Несоответствия `MJ_META.remakeParagraphs` ↔ `MJ_MAP` (истина — MAP)

Синхронизировать `remakeParagraphs` при арт-инкременте (метаданные для UI-хуков «Re-generate»):

| art | MAP (истина) | META (устарело) |
|---|---|---|
| art01 | 14 | 1, 14 (§1 → art54) |
| art03 | 163, 371, 381 | +284 (§284 → art62/Batch 5) |
| art05 | 188, **352**, 440, 532, 1136 | без 352 |
| art07 | 393, **558**, 833, **846**, 1013, 1097, **1123** | без коридорного fallback |
| art16 | 258, 285 | +311, 672 (§311 → art53) |
| art24 | 33, 191, 315, 471 | +381 |
| art26 | 45 | +1072 (дубль разрешён: §1072 → art09) |
| art29 | **пусто — не подключён** | 707, 773 (решить при инкременте: сцена «хозяйка до разоблачения») |
| art32 | 48, 487 | +76, 371, 1045 |

---

## Каталог Batch 1–4 (45 сгенерированных артов)

Промпты Batch 1–3 (36) и Batch 4 (art40, art41, art42, art46, art47, art51, art52 — **все сгенерированы**, статусы «⏳ PENDING» прошлой ревизии сняты) — без изменений, см. историю файла и `MJ_META` (поле `prompt` каждого арта). Новые июльские: `art53_six_legged_beast` (§311 — труп шестилапого зверя, кожаный мешочек с золотым свистком и алмазом) и `art54_forest_path` (§1 — солнечная лесная дорога, первая развилка).
