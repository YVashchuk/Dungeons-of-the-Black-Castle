# Midjourney Prompts — Dungeons of the Black Castle

Каталог промптов для **43 иллюстраций** (36 сгенерированных + 7 ожидающих генерации).

- **Программный каталог:** [`art-pack/metadata/art_catalog.py`](../art-pack/metadata/art_catalog.py)
- **Runtime метаданные:** `MJ_META` в [`src/mj_art.js`](../src/mj_art.js)

## Hero Character Reference (`--cref`)

Используется во всех промптах для согласованной внешности героя:

```
https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
```

## Стилистический суффикс

Применяется ко всем сценам:

> _dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting_

**Default Midjourney params:** `--cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6`
**Default negatives:** `--no cartoon, anime, modern clothing, CGI, text, watermark`

---

## Согласованность внешности персонажей

В Batch 4 (апрель 2026) все человеческие персонажи **кроме нежити, орков, гоблинов, водных духов и зверей** получили явное указание **славянской внешности** (Eastern European facial features) и **восточноевропейских средневековых народных костюмов**. Это касается:
- героя (art01, art10, art25)
- рыцарей-людей (art20, art41)
- старушек (art21, art36)
- старика-мудреца (art32)
- разбойников (art31, art35)
- лесорубов (art37)
- хозяйки замка (art29)
- Барлада Дэрта (art51 — он человек-маг)
- Принцессы (art52)

Орки, гоблины, скелеты, духи и звери оставлены без славянских уточнений (они изначально не люди).

---

## Каталог по batches

## Batch 1 — Core hero journey (6)

### `art01_enchanted_forest_start` — Enchanted forest, hero begins his journey

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §1, §14  
**Original paragraphs (583):** §1  
**Ref URL:** `https://cdn.midjourney.com/67f4893a-d0eb-491e-9f88-11a2efddc915/0_0.png`

**Prompt:**

```
lone slavic traveler with Slavic facial features and Eastern European medieval folk costume in medieval dark cloak walking into an ancient enchanted slavic forest, forked dirt path, twisted oaks with gnarled roots, morning sunlight piercing canopy, far silhouette of black castle spires on horizon, autumn mood
```

### `art02_black_castle_first_view` — First view of the Black Castle

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §244, §250, §330  
**Original paragraphs (583):** §118  
**Ref URL:** `https://cdn.midjourney.com/d9243b7e-8f11-467b-ae6f-0d7aa4947378/0_0.png`

**Prompt:**

```
massive black gothic castle looming over misty valley seen from hillside, hooded traveler standing on ridge observing, autumn forest below, heavy fog, distant tower spires piercing clouds
```

### `art05_dragon_castle` — Dragon at castle base

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §188, §440, §532, §1136  
**Original paragraphs (583):** §37, §41  
**Ref URL:** `https://cdn.midjourney.com/6bcfbfd6-e589-40b9-a636-2d8e0fce5c24/0_0.png`

**Prompt:**

```
massive ancient dragon coiled around the base of a dark stone castle, glowing amber eye, smoke rising from arched gateway, hooded hero in dark cloak approaching cautiously, small compared to the beast
```

### `art09_sleeping_princess` — Sleeping princess on crystal bed (pre-victory)

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §1072  
**Original paragraphs (583):** §617  
**Ref URL:** `https://cdn.midjourney.com/f2d46e42-cd9f-48a5-8a49-0e57bef87e56/0_0.png`

**Prompt:**

```
beautiful young slavic princess with fair pale skin lying on ornate bed, eyes closed in enchanted sleep, dark cloaked hooded figure watching over her from the background, cathedral castle interior, candles and autumn leaves
```

### `art10_victory_hero_throne` — Victory — hero returning triumphant

**Status:** ✅ Generated  
**Original paragraphs (583):** §617  
**Ref URL:** `https://cdn.midjourney.com/972647bf-375c-4040-a8b8-71c7721287f6/0_0.png`

**Prompt:**

```
young slavic hero with Slavic facial features and Eastern European medieval folk costume in dark hooded cloak standing triumphant in golden autumn courtyard of castle, soft evening light, arched gothic window glowing, sword held low, quiet victory
```

### `art25_cover_hero_castle` — COVER / Character reference (title screen)

**Status:** ✅ Generated  
**Ref URL:** `https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png`

**Prompt:**

```
lone slavic traveler with Slavic facial features and Eastern European medieval folk costume in medieval cloak gazing at a dark gothic castle from misty ridge, vast autumn landscape, cinematic composition, book cover quality
```

---

## Batch 2 — Supporting scenes (18)

### `art03_hut_baba_yaga` — Baba Yaga style talking hut on giant chicken legs

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §163, §284, §371, §381  
**Original paragraphs (583):** §16, §120  
**Ref URL:** `https://cdn.midjourney.com/bd29d478-7997-461a-9a9d-11e3535911e8/0_0.png`

**Prompt:**

```
Baba Yaga hut standing on two giant bird legs with clawed feet, dark wooden architecture with carved beams and skull-topped fence posts, hooded hero approaches in autumn forest
```

### `art04_goblins` — Two goblins in the forest

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §8, §43, §99, §752  
**Original paragraphs (583):** §8, §40  
**Ref URL:** `https://cdn.midjourney.com/7f61de3d-a241-4d11-911a-4e4265f72f56/0_0.png`

**Prompt:**

```
two hideous goblin warriors in dark enchanted forest, grotesque green-skinned humanoids with jagged weapons, crude leather armor, threatening the hooded hero, yellow autumn canopy
```

### `art06_vampire` — Vampire woman in castle

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §481, §685, §707, §773  
**Original paragraphs (583):** §65, §93  
**Ref URL:** `https://cdn.midjourney.com/df10760e-bfee-4d1a-84a8-39af377ceec4/0_0.png`

**Prompt:**

```
beautiful but terrifying slavic vampire woman in dark castle arched cloister, black hooded gown with gold trim, pale face with red lips, piercing stare, gothic stone arches behind
```

### `art07_corridor` — Grand castle corridor/hall

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §393, §833, §1013, §1097  
**Original paragraphs (583):** §39, §100  
**Ref URL:** `https://cdn.midjourney.com/b78cf00d-75ff-4896-9f66-e3a7398e3cff/0_0.png`

**Prompt:**

```
interior of a dark medieval castle great hall, massive stone arches, tall gothic windows with stained glass glowing, hooded hero from behind walking between columns, golden autumn leaves drifting in through broken windows
```

### `art08_library` — Ancient castle library

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §441, §701, §718, §766  
**Original paragraphs (583):** §22, §350  
**Ref URL:** `https://cdn.midjourney.com/d819bd84-a825-4ff6-8fd3-f586f8c55d0c/0_0.png`

**Prompt:**

```
ancient dark castle library filled floor to ceiling with books, gothic architecture, massive arched shelves lit by candles, huge reading desk with stacked tomes, hooded figure in foreground
```

### `art11_swamp` — Treacherous swamp

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §93, §309, §329, §521  
**Original paragraphs (583):** §99  
**Ref URL:** `https://cdn.midjourney.com/8652cee4-2fdd-4875-97f8-f36867daa711/0_0.png`

**Prompt:**

```
dark treacherous swamp in enchanted forest, misty murky water with half-submerged figure in dark hooded cloak, twisted dead trees, distant castle silhouette in fog, will-o-wisps
```

### `art12_camp` — Refugees hidden campfire in forest

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §390, §1045  
**Original paragraphs (583):** §3  
**Ref URL:** `https://cdn.midjourney.com/47f202ec-b6f3-407b-8d2b-f626c30c8146/0_0.png`

**Prompt:**

```
small hidden campfire in dark enchanted forest clearing, group of hooded figures sitting around flames, black castle silhouette looming through autumn trees, secretive mood
```

### `art13_bear` — Protective mother bear ally

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §84, §197, §281, §415  
**Original paragraphs (583):** §457  
**Ref URL:** `https://cdn.midjourney.com/09fe0594-6371-47f1-bf27-d878d18334e4/0_0.png`

**Prompt:**

```
massive protective mother bear standing guard in mossy forest glade, golden glowing eyes, hooded hero in dark cloak watching respectfully, castle spires in distance, autumn atmosphere
```

### `art14_throne` — Dark sorcerer on throne

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §688  
**Original paragraphs (583):** §577  
**Ref URL:** `https://cdn.midjourney.com/125601e1-ec85-48e8-bdb9-f9d9ed2d8a13/0_0.png`

**Prompt:**

```
dark sorcerer on an imposing black throne in vast gothic chamber, cave-like vaulted ceiling with stalactites, golden medallion on chest, scattered gold on floor, menacing presence
```

### `art15_prison` — Dark castle prison cell

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §41, §672, §947, §1095  
**Original paragraphs (583):** §56  
**Ref URL:** `https://cdn.midjourney.com/059b253d-893b-49f2-b933-4a3a79d8ec83/0_0.png`

**Prompt:**

```
dark medieval prison cell carved from black stone, iron barred window letting in misty light, hooded prisoner sitting on pile of straw, candle burning on wall shelf, damp atmosphere
```

### `art16_dungeon` — Underground catacomb corridor

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §258, §285, §311, §672  
**Original paragraphs (583):** §311  
**Ref URL:** `https://cdn.midjourney.com/ee176009-e4a1-4324-9981-3397cb05cc8b/0_0.png`

**Prompt:**

```
dark underground dungeon corridor carved from black stone, arched vaulted passage with dripping stalactites, candles on stone pillars, skulls in wall niches, hooded figure walks cautiously with sword
```

### `art17_bridge_goblin` — Goblin guarding bridge

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §129, §162, §182, §391  
**Original paragraphs (583):** §102  
**Ref URL:** `https://cdn.midjourney.com/7482050f-2bd5-4613-8377-81e803a275e4/0_0.png`

**Prompt:**

```
grotesque goblin guard in crude armor standing menacingly on old stone bridge, holding spiked mace, river below, autumn mist, castle looming on hill behind
```

### `art18_gate` — Hidden postern gate

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §488, §608  
**Original paragraphs (583):** §232  
**Ref URL:** `https://cdn.midjourney.com/ac5c9c95-21fa-4217-973f-e119522af0a3/0_0.png`

**Prompt:**

```
narrow hidden wooden door cut into a massive black stone castle wall, arched frame with golden rune, hooded figure crouching in overgrown brush, autumn leaves swirling
```

### `art19_tower` — Tower under starry sky

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §131  
**Original paragraphs (583):** §131  
**Ref URL:** `https://cdn.midjourney.com/c75814b0-5b56-4c8b-ba17-b98eb10f8c49/0_0.png`

**Prompt:**

```
hero in dark hooded cloak standing on narrow castle battlement under vast starry sky, ancient tower spires, sweeping view of misty valley below, candles glowing in distance
```

### `art20_amulet` — Hero reveals protective amulet to knights

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §26, §388  
**Original paragraphs (583):** §26  
**Ref URL:** `https://cdn.midjourney.com/b15fd587-113a-4b20-93e0-3bced6136e4f/0_0.png`

**Prompt:**

```
hero in dark hooded cloak holding up a glowing silver amulet in castle gateway, two slavic knights with Eastern European folk armor kneeling in respect, golden autumn leaves swirling around ancient archway
```

### `art21_oldwoman` — Begging old woman by roadside

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §76, §443, §744  
**Original paragraphs (583):** §49  
**Ref URL:** `https://cdn.midjourney.com/140bd863-5304-4c37-9e8a-fe439d6b689d/0_0.png`

**Prompt:**

```
frail elderly slavic woman in worn grey shawl and patched dress sitting by misty forest roadside, holding small tin cup, wrinkled kind-stern face, autumn leaves, distant hooded traveler approaching
```

### `art23_water_spirit` — Water spirit in tavern

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §260  
**Original paragraphs (583):** §260  
**Ref URL:** `https://cdn.midjourney.com/db99a798-1706-46b4-a41c-c1cb213826d1/0_0.png`

**Prompt:**

```
glowing translucent water creature with humanoid shape rising from flooded gothic hall, swirling luminous water, hooded hero watching, hooded monks at table by fireplace, ethereal blue light
```

### `art24_ball` — Magical glowing guide ball

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §33, §191, §315, §381, §471  
**Original paragraphs (583):** §576  
**Ref URL:** `https://cdn.midjourney.com/d21abe6b-e350-4e3c-81fe-d6fb5a097e18/0_0.png`

**Prompt:**

```
small glowing golden ball of yarn the size of a fist floating above an outstretched hand of a hooded figure, golden sparks trailing, dark castle silhouette in misty forest background, autumn leaves
```

---

## Batch 3 — Additional creatures and encounters (12)

### `art26_crystal_sarcophagus` — Crystal sarcophagus with enchanted figure

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §45, §1072  
**Original paragraphs (583):** §241  
**Ref URL:** `https://cdn.midjourney.com/bcab9377-e428-47d4-b541-46178c03a194/0_0.png`

**Prompt:**

```
transparent crystal sarcophagus lying flat on a stone pedestal in a cavern, glowing ethereal blue light from within, surrounded by tall candles, hooded figure kneeling before it, dark castle visible through cave opening
```

### `art27_monkey` — Aggressive monkey in the forest

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §38, §154, §168, §237, §510  
**Original paragraphs (583):** §525  
**Ref URL:** `https://cdn.midjourney.com/f6656da1-99a0-4c7a-8ed8-daf230d88b90/0_0.png`

**Prompt:**

```
aggressive large monkey descending from ancient oak tree, bared fangs, golden autumn leaves whirling, hooded hero facing it in enchanted forest with castle silhouette far behind
```

### `art28_king_statue` — Ancient stone statue of the king

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §662  
**Original paragraphs (583):** §84  
**Ref URL:** `https://cdn.midjourney.com/475add50-07fa-470e-88ed-df0882f5acdb/0_0.png`

**Prompt:**

```
ancient stone statue of a king seated on a throne inside a vaulted stone sarcophagus chamber, golden medallion hanging from the neck, hooded figure in black cloak standing before it, cathedral cave interior
```

### `art29_beautiful_hostess` — Beautiful hostess in luxurious castle parlor

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §707, §773  
**Original paragraphs (583):** §556  
**Ref URL:** `https://cdn.midjourney.com/017ec4ab-a99d-48ed-812c-580ef2b4f882/0_0.png`

**Prompt:**

```
beautiful elegant slavic woman with Eastern European facial features in light summer folk dress with thin capricious face in luxurious castle sitting room, ornate folding screen, gold-framed paintings, plush sofas, hero in dark hooded cloak watches from aside, deceptive comfort
```

### `art30_two_headed_dragon` — Two-headed dragon landing in clearing

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §449  
**Original paragraphs (583):** §412  
**Ref URL:** `https://cdn.midjourney.com/b3708188-37b5-4b8f-b4da-9ccb79845f1e/0_0.png`

**Prompt:**

```
enormous two-headed dragon landing in enchanted forest clearing, massive wings spread, glowing eyes on both heads, hooded hero stands small on rocky outcrop, autumn leaves and embers
```

### `art31_bandit_road` — Injured bandit by roadside trap

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §19, §155  
**Original paragraphs (583):** §110  
**Ref URL:** `https://cdn.midjourney.com/592ffe4f-4fd5-4711-a9a4-32884d785b63/0_0.png`

**Prompt:**

```
injured ragged slavic peasant bandit with Eastern European facial features lying on forest road edge in tattered clothes, feigning helplessness, hooded traveler approaches cautiously, autumn leaves, foggy castle behind
```

### `art32_wise_elder` — Wise elder at cottage door

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §48, §76, §371, §487, §1045  
**Original paragraphs (583):** §221  
**Ref URL:** `https://cdn.midjourney.com/225f5af3-0dea-4e39-8fcc-99704a1267cd/0_0.png`

**Prompt:**

```
kind frail slavic old man with long white beard, Eastern European facial features and wise eyes opening the door of an ornate carved wooden cottage, hooded black cloak, candle in niche, misty autumn forest, castle spires visible in background
```

### `art33_green_knights` — Three green-armored knights blocking path

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §46, §96, §112  
**Original paragraphs (583):** §45  
**Ref URL:** `https://cdn.midjourney.com/c25fb21d-b792-405c-be7b-ba1ef096ab8b/0_0.png`

**Prompt:**

```
three imposing green-armored knights standing guard blocking forest road, hooded cloaks over armor, misty castle behind, autumn leaves swirling, one holds a bow, one a great sword, one a spear
```

### `art34_orcs` — Three orc guards at castle gate

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §37, §56, §65, §71, §645  
**Original paragraphs (583):** §319  
**Ref URL:** `https://cdn.midjourney.com/b87a7233-ec87-45f4-9e2f-310dda9f5cfa/0_0.png`

**Prompt:**

```
three massive green-skinned orc warriors in heavy black iron armor blocking an ancient stone castle gate, torches burning, one holds a halberd, snow drifting, arched passageway
```

### `art35_bandits_ambush` — Bandits ambushing on forest clearing

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §100, §305, §319  
**Original paragraphs (583):** §181  
**Ref URL:** `https://cdn.midjourney.com/989a7e5d-53a2-49ae-90a8-7bdabd7defbd/0_0.png`

**Prompt:**

```
three rough slavic peasant bandits with Eastern European folk costume and daggers and clubs ambushing hooded traveler at forest clearing crossroads, hooded cloaks, autumn leaves, misty gothic castle in distance
```

### `art36_old_woman_stone` — Tiny old woman materializing from castle wall

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §215  
**Original paragraphs (583):** §323  
**Ref URL:** `https://cdn.midjourney.com/1ede985f-3563-4613-8b0c-651b69344a85/0_0.png`

**Prompt:**

```
tiny hunched slavic old woman with wrinkled Eastern European face in grey peasant rags with a crooked back emerging from bare stone castle wall, empty chamber with three doorways leading to darkness, hooded hero stepping back startled, candlelight
```

### `art37_lumberjacks` — Lumberjacks attack in enchanted forest

**Status:** ✅ Generated  
**Remake paragraphs (1221):** §247  
**Original paragraphs (583):** §6  
**Ref URL:** `https://cdn.midjourney.com/b2a764b8-55e6-44c4-9043-c092035bb51c/0_0.png`

**Prompt:**

```
two muscular slavic peasant lumberjacks in Eastern European folk costume with axes attacking in enchanted forest, bundles of firewood on their shoulders, hooded hero raises sword, golden autumn leaves whirling, black castle looms behind
```

---

## Batch 4 — New key encounters (PENDING generation, 7)

### `art40_giant_spider_web` — Giant spider descends from web trap (rope-ladder scene)

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §436, §448  

**Prompt:**

```
monstrous giant black spider descending from thick white glowing webs in a dark dead forest, hooded hero in dark cloak trapped in a sticky rope-ladder-like web, struggling with a sword, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

### `art41_green_knight_mounted` — Green Knight on horseback with lance

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §656  

**Prompt:**

```
towering menacing slavic knight in ornate deep green heavy plate armor with Eastern European medieval design wielding a massive lance, riding a black warhorse on misty forest road, black dragon silhouette on shield, hooded hero in dark cloak preparing to fight, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

### `art42_crypt_skeletons` — Undead skeletons rising in a crypt

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §733, §811, §1108  

**Prompt:**

```
three terrifying undead skeletons in tattered medieval rags rising from ancient stone sarcophagi, glowing blue eyes, rusted swords, hooded hero in dark cloak holding a torch, underground crypt with burial chambers, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

### `art46_giant_snake` — Giant snake with strangely human-shaped head

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §421, §528  

**Prompt:**

```
colossal venomous snake with shimmering green and black scales coiled around a dead twisted tree, the serpent head unsettlingly resembling a human hand, dripping fangs, hooded hero in dark cloak standing defensive with sword drawn, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

### `art47_stone_rats` — Swarm of petrified stone rats attacking in dungeon

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §1003, §1110  

**Prompt:**

```
swarm of menacing stone-rat creatures with partially petrified bodies, cracked granite skin showing veins of muscle, glowing red eye-sockets, gnashing stone fangs scurrying over damp slate dungeon floor, hooded hero in dark cloak swinging a glowing pale-green steel sword to cut through them, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

### `art51_barlad_dert_boss` — Final duel: Barlad Dert with glowing sword in his study

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §823, §1096, §1164  

**Prompt:**

```
epic final duel against a small slight tired-looking slavic dark sorcerer with gaunt Eastern European face in black robes, glowing pale magical longsword in his hand, massive writing desk covered in maps and scrolls behind him, gothic study lit by candles, hooded hero in dark cloak rushing him with bare hands before drawing sword, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

### `art52_princess_rescue` — Victory — Barlad Dert is slain, Princess is free

**Status:** ⏳ PENDING  
**Remake paragraphs (1221):** §1220  
**Original paragraphs (583):** §617  

**Prompt:**

```
hooded hero in dark cloak holding the hand of a beautiful sad young slavic princess with Eastern European features in a torn medieval folk gown, standing together in a grand castle hall at dawn, soft divine light breaking through tall gothic windows, Barlad Dert’s black robes crumpled on the floor behind them, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6
```

---
