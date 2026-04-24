# Midjourney Prompts Catalog

Complete prompts and reference URLs for all **43 illustrations** in
*Dungeons of the Black Castle* (remake 1991, 1221-paragraph edition).

**Status:** 36 illustrations generated (with CDN ref URL), 7 pending
generation (Batch 4 below — prompts ready, awaiting Midjourney render).

## Hero character reference

Use this URL as `--cref` in ALL re-generations to keep the same hooded
protagonist across scenes:

```
https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
```

## Default parameters

Append to every `/imagine` prompt:

```
--cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6
--no cartoon, anime, modern clothing, CGI, text, watermark
```

## Shared style suffix

Append after the scene-specific description in each prompt:

> dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting

---

## Illustrations

Grouped by batch (generation order). Each entry shows the scene, target
paragraphs in the 1221-paragraph remake, the full prompt, and the CDN URL
of the winning render (usable as `--cref` to re-generate variations).

### Batch 1 — Core hero journey

#### `art25_cover_hero_castle` — COVER / Character reference (title screen)

- **Remake (1221) paragraphs:** *(title/end screen only)*
- **Original (583) paragraphs:** *(n/a)*
- **Reference URL:** https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png

**Prompt:**

```
/imagine lone traveler in medieval cloak gazing at a dark gothic castle from misty ridge, vast autumn landscape, cinematic composition, book cover quality, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art01_enchanted_forest_start` — Enchanted forest, hero begins his journey

- **Remake (1221) paragraphs:** §1, §14
- **Original (583) paragraphs:** §1
- **Reference URL:** https://cdn.midjourney.com/67f4893a-d0eb-491e-9f88-11a2efddc915/0_0.png

**Prompt:**

```
/imagine lone traveler in medieval dark cloak walking into an ancient enchanted slavic forest, forked dirt path, twisted oaks with gnarled roots, morning sunlight piercing canopy, far silhouette of black castle spires on horizon, autumn mood, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art02_black_castle_first_view` — First view of the Black Castle

- **Remake (1221) paragraphs:** §244, §250, §330
- **Original (583) paragraphs:** §118
- **Reference URL:** https://cdn.midjourney.com/d9243b7e-8f11-467b-ae6f-0d7aa4947378/0_0.png

**Prompt:**

```
/imagine massive black gothic castle looming over misty valley seen from hillside, hooded traveler standing on ridge observing, autumn forest below, heavy fog, distant tower spires piercing clouds, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art05_dragon_castle` — Dragon at castle base

- **Remake (1221) paragraphs:** §188, §440, §532, §1136
- **Original (583) paragraphs:** §37, §41
- **Reference URL:** https://cdn.midjourney.com/6bcfbfd6-e589-40b9-a636-2d8e0fce5c24/0_0.png

**Prompt:**

```
/imagine massive ancient dragon coiled around the base of a dark stone castle, glowing amber eye, smoke rising from arched gateway, hooded hero in dark cloak approaching cautiously, small compared to the beast, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art09_sleeping_princess` — Sleeping princess on crystal bed (pre-victory)

- **Remake (1221) paragraphs:** §1072
- **Original (583) paragraphs:** §617
- **Note:** §1220 (victory scene) was moved to `art52_princess_rescue` in Batch 4.
- **Reference URL:** https://cdn.midjourney.com/f2d46e42-cd9f-48a5-8a49-0e57bef87e56/0_0.png

**Prompt:**

```
/imagine beautiful young slavic princess with fair pale skin lying on ornate bed, eyes closed in enchanted sleep, dark cloaked hooded figure watching over her from the background, cathedral castle interior, candles and autumn leaves, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art10_victory_hero_throne` — Victory — hero returning triumphant

- **Remake (1221) paragraphs:** *(title/end screen only)*
- **Original (583) paragraphs:** §617
- **Reference URL:** https://cdn.midjourney.com/972647bf-375c-4040-a8b8-71c7721287f6/0_0.png

**Prompt:**

```
/imagine young hero in dark hooded cloak standing triumphant in golden autumn courtyard of castle, soft evening light, arched gothic window glowing, sword held low, quiet victory, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

### Batch 2 — Supporting scenes

#### `art03_hut_baba_yaga` — Baba Yaga style talking hut on giant chicken legs

- **Remake (1221) paragraphs:** §163, §284, §371, §381
- **Original (583) paragraphs:** §16, §120
- **Reference URL:** https://cdn.midjourney.com/bd29d478-7997-461a-9a9d-11e3535911e8/0_0.png

**Prompt:**

```
/imagine Baba Yaga hut standing on two giant bird legs with clawed feet, dark wooden architecture with carved beams and skull-topped fence posts, hooded hero approaches in autumn forest, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art04_goblins` — Two goblins in the forest

- **Remake (1221) paragraphs:** §8, §43, §99, §752
- **Original (583) paragraphs:** §8, §40
- **Reference URL:** https://cdn.midjourney.com/7f61de3d-a241-4d11-911a-4e4265f72f56/0_0.png

**Prompt:**

```
/imagine two hideous goblin warriors in dark enchanted forest, grotesque green-skinned humanoids with jagged weapons, crude leather armor, threatening the hooded hero, yellow autumn canopy, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art06_vampire` — Vampire woman in castle

- **Remake (1221) paragraphs:** §481, §685, §707, §773
- **Original (583) paragraphs:** §65, §93
- **Reference URL:** https://cdn.midjourney.com/df10760e-bfee-4d1a-84a8-39af377ceec4/0_0.png

**Prompt:**

```
/imagine beautiful but terrifying slavic vampire woman in dark castle arched cloister, black hooded gown with gold trim, pale face with red lips, piercing stare, gothic stone arches behind, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art07_corridor` — Grand castle corridor/hall

- **Remake (1221) paragraphs:** §393, §833, §1013, §1097
- **Original (583) paragraphs:** §39, §100
- **Reference URL:** https://cdn.midjourney.com/b78cf00d-75ff-4896-9f66-e3a7398e3cff/0_0.png

**Prompt:**

```
/imagine interior of a dark medieval castle great hall, massive stone arches, tall gothic windows with stained glass glowing, hooded hero from behind walking between columns, golden autumn leaves drifting in through broken windows, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art08_library` — Ancient castle library

- **Remake (1221) paragraphs:** §441, §701, §718, §766
- **Original (583) paragraphs:** §22, §350
- **Reference URL:** https://cdn.midjourney.com/d819bd84-a825-4ff6-8fd3-f586f8c55d0c/0_0.png

**Prompt:**

```
/imagine ancient dark castle library filled floor to ceiling with books, gothic architecture, massive arched shelves lit by candles, huge reading desk with stacked tomes, hooded figure in foreground, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art11_swamp` — Treacherous swamp

- **Remake (1221) paragraphs:** §93, §309, §329, §521
- **Original (583) paragraphs:** §99
- **Reference URL:** https://cdn.midjourney.com/8652cee4-2fdd-4875-97f8-f36867daa711/0_0.png

**Prompt:**

```
/imagine dark treacherous swamp in enchanted forest, misty murky water with half-submerged figure in dark hooded cloak, twisted dead trees, distant castle silhouette in fog, will-o-wisps, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art12_camp` — Refugees hidden campfire in forest

- **Remake (1221) paragraphs:** §390, §1045
- **Original (583) paragraphs:** §3
- **Reference URL:** https://cdn.midjourney.com/47f202ec-b6f3-407b-8d2b-f626c30c8146/0_0.png

**Prompt:**

```
/imagine small hidden campfire in dark enchanted forest clearing, group of hooded figures sitting around flames, black castle silhouette looming through autumn trees, secretive mood, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art13_bear` — Protective mother bear ally

- **Remake (1221) paragraphs:** §84, §197, §281, §415
- **Original (583) paragraphs:** §457
- **Reference URL:** https://cdn.midjourney.com/09fe0594-6371-47f1-bf27-d878d18334e4/0_0.png

**Prompt:**

```
/imagine massive protective mother bear standing guard in mossy forest glade, golden glowing eyes, hooded hero in dark cloak watching respectfully, castle spires in distance, autumn atmosphere, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art14_throne` — Dark sorcerer on throne

- **Remake (1221) paragraphs:** §688
- **Original (583) paragraphs:** §577
- **Reference URL:** https://cdn.midjourney.com/125601e1-ec85-48e8-bdb9-f9d9ed2d8a13/0_0.png

**Prompt:**

```
/imagine dark sorcerer on an imposing black throne in vast gothic chamber, cave-like vaulted ceiling with stalactites, golden medallion on chest, scattered gold on floor, menacing presence, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art15_prison` — Dark castle prison cell

- **Remake (1221) paragraphs:** §41, §672, §947, §1095
- **Original (583) paragraphs:** §56
- **Reference URL:** https://cdn.midjourney.com/059b253d-893b-49f2-b933-4a3a79d8ec83/0_0.png

**Prompt:**

```
/imagine dark medieval prison cell carved from black stone, iron barred window letting in misty light, hooded prisoner sitting on pile of straw, candle burning on wall shelf, damp atmosphere, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art16_dungeon` — Underground catacomb corridor

- **Remake (1221) paragraphs:** §258, §285, §311, §672
- **Original (583) paragraphs:** §311
- **Reference URL:** https://cdn.midjourney.com/ee176009-e4a1-4324-9981-3397cb05cc8b/0_0.png

**Prompt:**

```
/imagine dark underground dungeon corridor carved from black stone, arched vaulted passage with dripping stalactites, candles on stone pillars, skulls in wall niches, hooded figure walks cautiously with sword, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art17_bridge_goblin` — Goblin guarding bridge

- **Remake (1221) paragraphs:** §129, §162, §182, §391
- **Original (583) paragraphs:** §102
- **Reference URL:** https://cdn.midjourney.com/7482050f-2bd5-4613-8377-81e803a275e4/0_0.png

**Prompt:**

```
/imagine grotesque goblin guard in crude armor standing menacingly on old stone bridge, holding spiked mace, river below, autumn mist, castle looming on hill behind, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art18_gate` — Hidden postern gate

- **Remake (1221) paragraphs:** §488, §608
- **Original (583) paragraphs:** §232
- **Reference URL:** https://cdn.midjourney.com/ac5c9c95-21fa-4217-973f-e119522af0a3/0_0.png

**Prompt:**

```
/imagine narrow hidden wooden door cut into a massive black stone castle wall, arched frame with golden rune, hooded figure crouching in overgrown brush, autumn leaves swirling, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art19_tower` — Tower under starry sky

- **Remake (1221) paragraphs:** §131
- **Original (583) paragraphs:** §131
- **Reference URL:** https://cdn.midjourney.com/c75814b0-5b56-4c8b-ba17-b98eb10f8c49/0_0.png

**Prompt:**

```
/imagine hero in dark hooded cloak standing on narrow castle battlement under vast starry sky, ancient tower spires, sweeping view of misty valley below, candles glowing in distance, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art20_amulet` — Hero reveals protective amulet to knights

- **Remake (1221) paragraphs:** §26, §388
- **Original (583) paragraphs:** §26
- **Reference URL:** https://cdn.midjourney.com/b15fd587-113a-4b20-93e0-3bced6136e4f/0_0.png

**Prompt:**

```
/imagine hero in dark hooded cloak holding up a glowing silver amulet in castle gateway, two armored knights kneeling in respect, golden autumn leaves swirling around ancient archway, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art21_oldwoman` — Begging old woman by roadside

- **Remake (1221) paragraphs:** §76, §443, §744
- **Original (583) paragraphs:** §49
- **Reference URL:** https://cdn.midjourney.com/140bd863-5304-4c37-9e8a-fe439d6b689d/0_0.png

**Prompt:**

```
/imagine frail elderly slavic woman in worn grey shawl and patched dress sitting by misty forest roadside, holding small tin cup, wrinkled kind-stern face, autumn leaves, distant hooded traveler approaching, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art23_water_spirit` — Water spirit in tavern

- **Remake (1221) paragraphs:** §260
- **Original (583) paragraphs:** §260
- **Reference URL:** https://cdn.midjourney.com/db99a798-1706-46b4-a41c-c1cb213826d1/0_0.png

**Prompt:**

```
/imagine glowing translucent water creature with humanoid shape rising from flooded gothic hall, swirling luminous water, hooded hero watching, hooded monks at table by fireplace, ethereal blue light, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art24_ball` — Magical glowing guide ball

- **Remake (1221) paragraphs:** §33, §191, §315, §381, §471
- **Original (583) paragraphs:** §576
- **Reference URL:** https://cdn.midjourney.com/d21abe6b-e350-4e3c-81fe-d6fb5a097e18/0_0.png

**Prompt:**

```
/imagine small glowing golden ball of yarn the size of a fist floating above an outstretched hand of a hooded figure, golden sparks trailing, dark castle silhouette in misty forest background, autumn leaves, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

### Batch 3 — Creatures and encounters

#### `art26_crystal_sarcophagus` — Crystal sarcophagus with enchanted figure

- **Remake (1221) paragraphs:** §45, §1072
- **Original (583) paragraphs:** §241
- **Reference URL:** https://cdn.midjourney.com/bcab9377-e428-47d4-b541-46178c03a194/0_0.png

**Prompt:**

```
/imagine transparent crystal sarcophagus lying flat on a stone pedestal in a cavern, glowing ethereal blue light from within, surrounded by tall candles, hooded figure kneeling before it, dark castle visible through cave opening, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art27_monkey` — Aggressive monkey in the forest

- **Remake (1221) paragraphs:** §38, §154, §168, §237, §510
- **Original (583) paragraphs:** §525
- **Reference URL:** https://cdn.midjourney.com/f6656da1-99a0-4c7a-8ed8-daf230d88b90/0_0.png

**Prompt:**

```
/imagine aggressive large monkey descending from ancient oak tree, bared fangs, golden autumn leaves whirling, hooded hero facing it in enchanted forest with castle silhouette far behind, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art28_king_statue` — Ancient stone statue of the king

- **Remake (1221) paragraphs:** §662
- **Original (583) paragraphs:** §84
- **Reference URL:** https://cdn.midjourney.com/475add50-07fa-470e-88ed-df0882f5acdb/0_0.png

**Prompt:**

```
/imagine ancient stone statue of a king seated on a throne inside a vaulted stone sarcophagus chamber, golden medallion hanging from the neck, hooded figure in black cloak standing before it, cathedral cave interior, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art29_beautiful_hostess` — Beautiful hostess in luxurious castle parlor

- **Remake (1221) paragraphs:** §707, §773
- **Original (583) paragraphs:** §556
- **Reference URL:** https://cdn.midjourney.com/017ec4ab-a99d-48ed-812c-580ef2b4f882/0_0.png

**Prompt:**

```
/imagine beautiful elegant woman in light summer dress with thin capricious face in luxurious castle sitting room, ornate folding screen, gold-framed paintings, plush sofas, hero in dark hooded cloak watches from aside, deceptive comfort, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art30_two_headed_dragon` — Two-headed dragon landing in clearing

- **Remake (1221) paragraphs:** §449
- **Original (583) paragraphs:** §412
- **Reference URL:** https://cdn.midjourney.com/b3708188-37b5-4b8f-b4da-9ccb79845f1e/0_0.png

**Prompt:**

```
/imagine enormous two-headed dragon landing in enchanted forest clearing, massive wings spread, glowing eyes on both heads, hooded hero stands small on rocky outcrop, autumn leaves and embers, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art31_bandit_road` — Injured bandit by roadside trap

- **Remake (1221) paragraphs:** §19, §155
- **Original (583) paragraphs:** §110
- **Reference URL:** https://cdn.midjourney.com/592ffe4f-4fd5-4711-a9a4-32884d785b63/0_0.png

**Prompt:**

```
/imagine injured ragged bandit lying on forest road edge in tattered clothes, feigning helplessness, hooded traveler approaches cautiously, autumn leaves, foggy castle behind, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art32_wise_elder` — Wise elder at cottage door

- **Remake (1221) paragraphs:** §48, §76, §371, §487, §1045
- **Original (583) paragraphs:** §221
- **Reference URL:** https://cdn.midjourney.com/225f5af3-0dea-4e39-8fcc-99704a1267cd/0_0.png

**Prompt:**

```
/imagine kind frail old man with long white beard and wise eyes opening the door of an ornate carved wooden cottage, hooded black cloak, candle in niche, misty autumn forest, castle spires visible in background, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art33_green_knights` — Three green-armored knights blocking path

- **Remake (1221) paragraphs:** §46, §96, §112
- **Original (583) paragraphs:** §45
- **Reference URL:** https://cdn.midjourney.com/c25fb21d-b792-405c-be7b-ba1ef096ab8b/0_0.png

**Prompt:**

```
/imagine three imposing green-armored knights standing guard blocking forest road, hooded cloaks over armor, misty castle behind, autumn leaves swirling, one holds a bow, one a great sword, one a spear, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art34_orcs` — Three orc guards at castle gate

- **Remake (1221) paragraphs:** §37, §56, §65, §71, §645
- **Original (583) paragraphs:** §319
- **Reference URL:** https://cdn.midjourney.com/b87a7233-ec87-45f4-9e2f-310dda9f5cfa/0_0.png

**Prompt:**

```
/imagine three massive green-skinned orc warriors in heavy black iron armor blocking an ancient stone castle gate, torches burning, one holds a halberd, snow drifting, arched passageway, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art35_bandits_ambush` — Bandits ambushing on forest clearing

- **Remake (1221) paragraphs:** §100, §305, §319
- **Original (583) paragraphs:** §181
- **Reference URL:** https://cdn.midjourney.com/989a7e5d-53a2-49ae-90a8-7bdabd7defbd/0_0.png

**Prompt:**

```
/imagine three rough medieval bandits with daggers and clubs ambushing hooded traveler at forest clearing crossroads, hooded cloaks, autumn leaves, misty gothic castle in distance, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art36_old_woman_stone` — Tiny old woman materializing from castle wall

- **Remake (1221) paragraphs:** §215
- **Original (583) paragraphs:** §323
- **Reference URL:** https://cdn.midjourney.com/1ede985f-3563-4613-8b0c-651b69344a85/0_0.png

**Prompt:**

```
/imagine tiny hunched old woman in grey rags with a crooked back emerging from bare stone castle wall, empty chamber with three doorways leading to darkness, hooded hero stepping back startled, candlelight, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

#### `art37_lumberjacks` — Lumberjacks attack in enchanted forest

- **Remake (1221) paragraphs:** §247
- **Original (583) paragraphs:** §6
- **Reference URL:** https://cdn.midjourney.com/b2a764b8-55e6-44c4-9043-c092035bb51c/0_0.png

**Prompt:**

```
/imagine two muscular lumberjacks with axes attacking in enchanted forest, bundles of firewood on their shoulders, hooded hero raises sword, golden autumn leaves whirling, black castle looms behind, dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

### Batch 4 — New key encounters (pending generation)

> **Status:** These 7 illustrations have vetted prompts and verified
> paragraph targets, but Midjourney renders are NOT YET generated. After
> running the prompts, paste the winning CDN URLs into each entry's
> **Reference URL** below and into `art-pack/metadata/art_catalog.py`
> (`CATALOG[art_id]['ref_url']`).
>
> All paragraph numbers were cross-checked against `assets/fb2_remake.fb2` —
> every scene corresponds to an actual encounter in the remake.

#### `art40_giant_spider_web` — Giant spider descends from web trap

- **Remake (1221) paragraphs:** §436, §448
- **Scene context:** §436 — the "rope ladder" turns out to be a giant spider web; §448 — combat with the giant spider (Skill 5, Stamina 8).
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine monstrous giant black spider descending from thick white glowing webs in a dark dead forest, hooded hero in dark cloak trapped in a sticky rope-ladder-like web, struggling with a sword, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

#### `art41_green_knight_mounted` — Green Knight on horseback with lance

- **Remake (1221) paragraphs:** §656
- **Scene context:** A mounted Green Knight appears on the road with a lance and a shield bearing a black dragon silhouette. Different from `art33_green_knights` (three dismounted knights on foot).
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine towering menacing knight in ornate deep green heavy plate armor wielding a massive lance, riding a black warhorse on misty forest road, black dragon silhouette on shield, hooded hero in dark cloak preparing to fight, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

#### `art42_crypt_skeletons` — Undead skeletons rising in a crypt

- **Remake (1221) paragraphs:** §733, §811, §1108
- **Scene context:** §733 — a skeleton blocks a doorway; §811 — victory over a skeleton, two sarcophagi nearby; §1108 — underground tomb of the dead.
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine three terrifying undead skeletons in tattered medieval rags rising from ancient stone sarcophagi, glowing blue eyes, rusted swords, hooded hero in dark cloak holding a torch, underground crypt with burial chambers, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

#### `art46_giant_snake` — Giant snake with strangely human-shaped head

- **Remake (1221) paragraphs:** §421, §528
- **Scene context:** §421 — a serpent appears with a head resembling a huge human hand; §528 — combat (Skill 8, Stamina 6).
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine colossal venomous snake with shimmering green and black scales coiled around a dead twisted tree, the serpent head unsettlingly resembling a human hand, dripping fangs, hooded hero in dark cloak standing defensive with sword drawn, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

#### `art47_stone_rats` — Swarm of petrified stone rats (not ordinary rats!)

- **Remake (1221) paragraphs:** §1003, §1110
- **Scene context:** Rats in this book are made of **stone** — fire spells don't work on them; only the Green Knight's sword can cut them; the Weakness spell makes them too heavy to move. This is not generic vermin.
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine swarm of menacing stone-rat creatures with partially petrified bodies, cracked granite skin showing veins of muscle, glowing red eye-sockets, gnashing stone fangs scurrying over damp slate dungeon floor, hooded hero in dark cloak swinging a glowing pale-green steel sword to cut through them, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

#### `art51_barlad_dert_boss` — Final duel: Barlad Dert with glowing sword in his study

- **Remake (1221) paragraphs:** §823, §1096, §1164
- **Scene context:** §1096 — first meeting: Barlad is a small, tired-looking man at a desk covered in maps; he animates a statue/gargoyle to deal with the hero. §1164 — Barlad talks condescendingly, revealing he watched the whole journey. §823 — the actual duel: the hero rushes him barehanded, then Barlad draws a glowing sword (Skill 13, Stamina 13, no spells allowed).
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine epic final duel against a small slight tired-looking dark sorcerer in black robes, glowing pale magical longsword in his hand, massive writing desk covered in maps and scrolls behind him, gothic study lit by candles, hooded hero in dark cloak rushing him with bare hands before drawing sword, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

#### `art52_princess_rescue` — Victory — Barlad Dert is slain, Princess is free

- **Remake (1221) paragraphs:** §1220 (final ending)
- **Original (583) paragraphs:** §617
- **Scene context:** The journey ends. The hero has killed Barlad Dert, and the Princess is freed. All the castle's evil servants flee. Previously this paragraph was mapped to `art09_sleeping_princess` — reassigned here for a more triumphant visual.
- **Reference URL:** *(pending)*

**Prompt:**

```
/imagine hooded hero in dark cloak holding the hand of a beautiful young princess in a torn medieval gown, standing together in a grand castle hall at dawn, soft divine light breaking through tall gothic windows, Barlad Derts black robes crumpled on the floor behind them, relief on the princesss face, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

---

## File locations on disk

- **Originals (full-resolution PNG):** `assets/illustrations/originals/<art_id>.png`
- **Web-optimised (JPEG 900px Q82):** `assets/illustrations/web/<art_id>.jpg`
- **Base64-embedded runtime copy:** `src/mj_art.js` → `MJ_DATA.<art_id>`
- **Programmatic metadata:** `src/mj_art.js` → `MJ_META.<art_id>` (`scene`, `prompt`, `refUrl`, `remakeParagraphs`, `originalParagraphs`)
