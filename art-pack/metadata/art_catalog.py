"""
Complete catalog of Midjourney illustrations for
Dungeons of the Black Castle (Remake 1221-paragraph edition).

Each entry contains:
  - prompt: original Midjourney prompt (for re-generation)
  - ref_url: Midjourney CDN URL (for --cref reference in new generations)
  - remake_paragraphs: list of paragraph IDs in the 1221-paragraph REMAKE
  - original_paragraphs: list of paragraph IDs in the 583-paragraph ORIGINAL (reference)
  - scene: brief description
"""

HERO_CREF = 'https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png'

STYLE_SUFFIX = (
    'dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Frazetta '
    'meets Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, '
    'painterly detail, cinematic framing, golden autumn leaves drifting'
)
DEFAULT_PARAMS = f'--cref {HERO_CREF} --ar 3:2 --stylize 250 --v 6'
DEFAULT_NEG = '--no cartoon, anime, modern clothing, CGI, text, watermark'

CATALOG = {
    # ─── BATCH 1: Core hero journey (6 images) ───
    'art01_enchanted_forest_start': {
        'scene': 'Enchanted forest, hero begins his journey',
        'prompt': 'lone slavic traveler with Slavic facial features and Eastern European medieval folk costume in medieval dark cloak walking into an ancient enchanted slavic forest, forked dirt path, twisted oaks with gnarled roots, morning sunlight piercing canopy, far silhouette of black castle spires on horizon, autumn mood',
        'ref_url': 'https://cdn.midjourney.com/67f4893a-d0eb-491e-9f88-11a2efddc915/0_0.png',
        'remake_paragraphs': [14],
        'original_paragraphs': [1],
    },
    'art02_black_castle_first_view': {
        'scene': 'First view of the Black Castle',
        'prompt': 'massive black gothic castle looming over misty valley seen from hillside, hooded traveler standing on ridge observing, autumn forest below, heavy fog, distant tower spires piercing clouds',
        'ref_url': 'https://cdn.midjourney.com/d9243b7e-8f11-467b-ae6f-0d7aa4947378/0_0.png',
        'remake_paragraphs': [244, 250, 330],
        'original_paragraphs': [118],
    },
    'art05_dragon_castle': {
        'scene': 'Dragon at castle base',
        'prompt': 'massive ancient dragon coiled around the base of a dark stone castle, glowing amber eye, smoke rising from arched gateway, hooded hero in dark cloak approaching cautiously, small compared to the beast',
        'ref_url': 'https://cdn.midjourney.com/6bcfbfd6-e589-40b9-a636-2d8e0fce5c24/0_0.png',
        'remake_paragraphs': [188, 352, 440, 532, 1136],
        'original_paragraphs': [37, 41],
    },
    'art09_sleeping_princess': {
        'scene': 'Sleeping princess on crystal bed (pre-victory)',
        'prompt': 'beautiful young slavic princess with fair pale skin lying on ornate bed, eyes closed in enchanted sleep, dark cloaked hooded figure watching over her from the background, cathedral castle interior, candles and autumn leaves',
        'ref_url': 'https://cdn.midjourney.com/f2d46e42-cd9f-48a5-8a49-0e57bef87e56/0_0.png',
        'remake_paragraphs': [1072],  # §1220 will move to art52_princess_rescue once that art is generated.
        # ┌─ TRANSITIONAL STATE (2026-04) ─────────────────────────────┐
        # │ Current runtime (src/mj_art.js + dist/*.html) still has   │
        # │ [1072, 1220] for art09 because art52 isn't generated yet. │
        # │ When you generate art52: ALSO remove 1220 from the        │
        # │ MJ_META.art09 array in src/mj_art.js, then rebuild dist.  │
        # └────────────────────────────────────────────────────────────┘
        'original_paragraphs': [617],
    },
    'art10_victory_hero_throne': {
        'scene': 'Victory — hero returning triumphant',
        'prompt': 'young slavic hero with Slavic facial features and Eastern European medieval folk costume in dark hooded cloak standing triumphant in golden autumn courtyard of castle, soft evening light, arched gothic window glowing, sword held low, quiet victory',
        'ref_url': 'https://cdn.midjourney.com/972647bf-375c-4040-a8b8-71c7721287f6/0_0.png',
        'remake_paragraphs': [],  # title/end screen, not inline
        'original_paragraphs': [617],
    },
    'art25_cover_hero_castle': {
        'scene': 'COVER / Character reference (title screen)',
        'prompt': 'lone slavic traveler with Slavic facial features and Eastern European medieval folk costume in medieval cloak gazing at a dark gothic castle from misty ridge, vast autumn landscape, cinematic composition, book cover quality',
        'ref_url': 'https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png',
        'remake_paragraphs': [],  # title screen only
        'original_paragraphs': [],
    },

    # ─── BATCH 2: Supporting scenes (18 images) ───
    'art03_hut_baba_yaga': {
        'scene': 'Baba Yaga style talking hut on giant chicken legs',
        'prompt': 'Baba Yaga hut standing on two giant bird legs with clawed feet, dark wooden architecture with carved beams and skull-topped fence posts, hooded hero approaches in autumn forest',
        'ref_url': 'https://cdn.midjourney.com/bd29d478-7997-461a-9a9d-11e3535911e8/0_0.png',
        'remake_paragraphs': [163, 371, 381],
        'original_paragraphs': [16, 120],
    },
    'art04_goblins': {
        'scene': 'Two goblins in the forest',
        'prompt': 'two hideous goblin warriors in dark enchanted forest, grotesque green-skinned humanoids with jagged weapons, crude leather armor, threatening the hooded hero, yellow autumn canopy',
        'ref_url': 'https://cdn.midjourney.com/7f61de3d-a241-4d11-911a-4e4265f72f56/0_0.png',
        'remake_paragraphs': [8, 43, 99, 752],
        'original_paragraphs': [8, 40],
    },
    'art06_vampire': {
        'scene': 'Vampire woman in castle',
        'prompt': 'beautiful but terrifying slavic vampire woman in dark castle arched cloister, black hooded gown with gold trim, pale face with red lips, piercing stare, gothic stone arches behind',
        'ref_url': 'https://cdn.midjourney.com/df10760e-bfee-4d1a-84a8-39af377ceec4/0_0.png',
        'remake_paragraphs': [481, 685, 707, 773],
        'original_paragraphs': [65, 93],
    },
    'art07_corridor': {
        'scene': 'Grand castle corridor/hall',
        'prompt': 'interior of a dark medieval castle great hall, massive stone arches, tall gothic windows with stained glass glowing, hooded hero from behind walking between columns, golden autumn leaves drifting in through broken windows',
        'ref_url': 'https://cdn.midjourney.com/b78cf00d-75ff-4896-9f66-e3a7398e3cff/0_0.png',
        'remake_paragraphs': [393, 558, 833, 846, 1013, 1097, 1123],
        'original_paragraphs': [39, 100],
    },
    'art08_library': {
        'scene': 'Ancient castle library',
        'prompt': 'ancient dark castle library filled floor to ceiling with books, gothic architecture, massive arched shelves lit by candles, huge reading desk with stacked tomes, hooded figure in foreground',
        'ref_url': 'https://cdn.midjourney.com/d819bd84-a825-4ff6-8fd3-f586f8c55d0c/0_0.png',
        'remake_paragraphs': [441, 701, 718, 766],
        'original_paragraphs': [22, 350],
    },
    'art11_swamp': {
        'scene': 'Treacherous swamp',
        'prompt': 'dark treacherous swamp in enchanted forest, misty murky water with half-submerged figure in dark hooded cloak, twisted dead trees, distant castle silhouette in fog, will-o-wisps',
        'ref_url': 'https://cdn.midjourney.com/8652cee4-2fdd-4875-97f8-f36867daa711/0_0.png',
        'remake_paragraphs': [93, 309, 329, 521],
        'original_paragraphs': [99],
    },
    'art12_camp': {
        'scene': 'Refugees hidden campfire in forest',
        'prompt': 'small hidden campfire in dark enchanted forest clearing, group of hooded figures sitting around flames, black castle silhouette looming through autumn trees, secretive mood',
        'ref_url': 'https://cdn.midjourney.com/47f202ec-b6f3-407b-8d2b-f626c30c8146/0_0.png',
        'remake_paragraphs': [390, 1045],
        'original_paragraphs': [3],
    },
    'art13_bear': {
        'scene': 'Protective mother bear ally',
        'prompt': 'massive protective mother bear standing guard in mossy forest glade, golden glowing eyes, hooded hero in dark cloak watching respectfully, castle spires in distance, autumn atmosphere',
        'ref_url': 'https://cdn.midjourney.com/09fe0594-6371-47f1-bf27-d878d18334e4/0_0.png',
        'remake_paragraphs': [84, 197, 281, 415],
        'original_paragraphs': [457],
    },
    'art14_throne': {
        'scene': 'Dark sorcerer on throne',
        'prompt': 'dark sorcerer on an imposing black throne in vast gothic chamber, cave-like vaulted ceiling with stalactites, golden medallion on chest, scattered gold on floor, menacing presence',
        'ref_url': 'https://cdn.midjourney.com/125601e1-ec85-48e8-bdb9-f9d9ed2d8a13/0_0.png',
        'remake_paragraphs': [688],
        'original_paragraphs': [577],
    },
    'art15_prison': {
        'scene': 'Dark castle prison cell',
        'prompt': 'dark medieval prison cell carved from black stone, iron barred window letting in misty light, hooded prisoner sitting on pile of straw, candle burning on wall shelf, damp atmosphere',
        'ref_url': 'https://cdn.midjourney.com/059b253d-893b-49f2-b933-4a3a79d8ec83/0_0.png',
        'remake_paragraphs': [41, 672, 947, 1095],
        'original_paragraphs': [56],
    },
    'art16_dungeon': {
        'scene': 'Underground catacomb corridor',
        'prompt': 'dark underground dungeon corridor carved from black stone, arched vaulted passage with dripping stalactites, candles on stone pillars, skulls in wall niches, hooded figure walks cautiously with sword',
        'ref_url': 'https://cdn.midjourney.com/ee176009-e4a1-4324-9981-3397cb05cc8b/0_0.png',
        'remake_paragraphs': [258, 285, 672],
        'original_paragraphs': [311],
    },
    'art17_bridge_goblin': {
        'scene': 'Goblin guarding bridge',
        'prompt': 'grotesque goblin guard in crude armor standing menacingly on old stone bridge, holding spiked mace, river below, autumn mist, castle looming on hill behind',
        'ref_url': 'https://cdn.midjourney.com/7482050f-2bd5-4613-8377-81e803a275e4/0_0.png',
        'remake_paragraphs': [129, 162, 182, 391],
        'original_paragraphs': [102],
    },
    'art18_gate': {
        'scene': 'Hidden postern gate',
        'prompt': 'narrow hidden wooden door cut into a massive black stone castle wall, arched frame with golden rune, hooded figure crouching in overgrown brush, autumn leaves swirling',
        'ref_url': 'https://cdn.midjourney.com/ac5c9c95-21fa-4217-973f-e119522af0a3/0_0.png',
        'remake_paragraphs': [488, 608],
        'original_paragraphs': [232],
    },
    'art19_tower': {
        'scene': 'Tower under starry sky',
        'prompt': 'hero in dark hooded cloak standing on narrow castle battlement under vast starry sky, ancient tower spires, sweeping view of misty valley below, candles glowing in distance',
        'ref_url': 'https://cdn.midjourney.com/c75814b0-5b56-4c8b-ba17-b98eb10f8c49/0_0.png',
        'remake_paragraphs': [131],
        'original_paragraphs': [131],
    },
    'art20_amulet': {
        'scene': 'Hero reveals protective amulet to knights',
        'prompt': 'hero in dark hooded cloak holding up a glowing silver amulet in castle gateway, two slavic knights with Eastern European folk armor kneeling in respect, golden autumn leaves swirling around ancient archway',
        'ref_url': 'https://cdn.midjourney.com/b15fd587-113a-4b20-93e0-3bced6136e4f/0_0.png',
        'remake_paragraphs': [26, 388],
        'original_paragraphs': [26],
    },
    'art21_oldwoman': {
        'scene': 'Begging old woman by roadside',
        'prompt': 'frail elderly slavic woman in worn grey shawl and patched dress sitting by misty forest roadside, holding small tin cup, wrinkled kind-stern face, autumn leaves, distant hooded traveler approaching',
        'ref_url': 'https://cdn.midjourney.com/140bd863-5304-4c37-9e8a-fe439d6b689d/0_0.png',
        'remake_paragraphs': [76, 443, 744],
        'original_paragraphs': [49],
    },
    'art23_water_spirit': {
        'scene': 'Water spirit in tavern',
        'prompt': 'glowing translucent water creature with humanoid shape rising from flooded gothic hall, swirling luminous water, hooded hero watching, hooded monks at table by fireplace, ethereal blue light',
        'ref_url': 'https://cdn.midjourney.com/db99a798-1706-46b4-a41c-c1cb213826d1/0_0.png',
        'remake_paragraphs': [260],
        'original_paragraphs': [260],
    },
    'art24_ball': {
        'scene': 'Magical glowing guide ball',
        'prompt': 'small glowing golden ball of yarn the size of a fist floating above an outstretched hand of a hooded figure, golden sparks trailing, dark castle silhouette in misty forest background, autumn leaves',
        'ref_url': 'https://cdn.midjourney.com/d21abe6b-e350-4e3c-81fe-d6fb5a097e18/0_0.png',
        'remake_paragraphs': [33, 191, 315, 471],
        'original_paragraphs': [576],
    },

    # ─── BATCH 3: Additional creatures and encounters (12 images) ───
    'art26_crystal_sarcophagus': {
        'scene': 'Crystal sarcophagus with enchanted figure',
        'prompt': 'transparent crystal sarcophagus lying flat on a stone pedestal in a cavern, glowing ethereal blue light from within, surrounded by tall candles, hooded figure kneeling before it, dark castle visible through cave opening',
        'ref_url': 'https://cdn.midjourney.com/bcab9377-e428-47d4-b541-46178c03a194/0_0.png',
        'remake_paragraphs': [45],
        'original_paragraphs': [241],
    },
    'art27_monkey': {
        'scene': 'Aggressive monkey in the forest',
        'prompt': 'aggressive large monkey descending from ancient oak tree, bared fangs, golden autumn leaves whirling, hooded hero facing it in enchanted forest with castle silhouette far behind',
        'ref_url': 'https://cdn.midjourney.com/f6656da1-99a0-4c7a-8ed8-daf230d88b90/0_0.png',
        'remake_paragraphs': [38, 154, 168, 237, 510],
        'original_paragraphs': [525],
    },
    'art28_king_statue': {
        'scene': 'Ancient stone statue of the king',
        'prompt': 'ancient stone statue of a king seated on a throne inside a vaulted stone sarcophagus chamber, golden medallion hanging from the neck, hooded figure in black cloak standing before it, cathedral cave interior',
        'ref_url': 'https://cdn.midjourney.com/475add50-07fa-470e-88ed-df0882f5acdb/0_0.png',
        'remake_paragraphs': [662],
        'original_paragraphs': [84],
    },
    'art29_beautiful_hostess': {
        'scene': 'Beautiful hostess in luxurious castle parlor',
        'prompt': 'beautiful elegant slavic woman with Eastern European facial features in light summer folk dress with thin capricious face in luxurious castle sitting room, ornate folding screen, gold-framed paintings, plush sofas, hero in dark hooded cloak watches from aside, deceptive comfort',
        'ref_url': 'https://cdn.midjourney.com/017ec4ab-a99d-48ed-812c-580ef2b4f882/0_0.png',
        'remake_paragraphs': [],
        'original_paragraphs': [556],
    },
    'art30_two_headed_dragon': {
        'scene': 'Two-headed dragon landing in clearing',
        'prompt': 'enormous two-headed dragon landing in enchanted forest clearing, massive wings spread, glowing eyes on both heads, hooded hero stands small on rocky outcrop, autumn leaves and embers',
        'ref_url': 'https://cdn.midjourney.com/b3708188-37b5-4b8f-b4da-9ccb79845f1e/0_0.png',
        'remake_paragraphs': [449],
        'original_paragraphs': [412],
    },
    'art31_bandit_road': {
        'scene': 'Injured bandit by roadside trap',
        'prompt': 'injured ragged slavic peasant bandit with Eastern European facial features lying on forest road edge in tattered clothes, feigning helplessness, hooded traveler approaches cautiously, autumn leaves, foggy castle behind',
        'ref_url': 'https://cdn.midjourney.com/592ffe4f-4fd5-4711-a9a4-32884d785b63/0_0.png',
        'remake_paragraphs': [19, 155],
        'original_paragraphs': [110],
    },
    'art32_wise_elder': {
        'scene': 'Wise elder at cottage door',
        'prompt': 'kind frail slavic old man with long white beard, Eastern European facial features and wise eyes opening the door of an ornate carved wooden cottage, hooded black cloak, candle in niche, misty autumn forest, castle spires visible in background',
        'ref_url': 'https://cdn.midjourney.com/225f5af3-0dea-4e39-8fcc-99704a1267cd/0_0.png',
        'remake_paragraphs': [48, 487],
        'original_paragraphs': [221],
    },
    'art33_green_knights': {
        'scene': 'Three green-armored knights blocking path',
        'prompt': 'three imposing green-armored knights standing guard blocking forest road, hooded cloaks over armor, misty castle behind, autumn leaves swirling, one holds a bow, one a great sword, one a spear',
        'ref_url': 'https://cdn.midjourney.com/c25fb21d-b792-405c-be7b-ba1ef096ab8b/0_0.png',
        'remake_paragraphs': [46, 96, 112],
        'original_paragraphs': [45],
    },
    'art34_orcs': {
        'scene': 'Three orc guards at castle gate',
        'prompt': 'three massive green-skinned orc warriors in heavy black iron armor blocking an ancient stone castle gate, torches burning, one holds a halberd, snow drifting, arched passageway',
        'ref_url': 'https://cdn.midjourney.com/b87a7233-ec87-45f4-9e2f-310dda9f5cfa/0_0.png',
        'remake_paragraphs': [37, 56, 65, 71, 645],
        'original_paragraphs': [319],
    },
    'art35_bandits_ambush': {
        'scene': 'Bandits ambushing on forest clearing',
        'prompt': 'three rough slavic peasant bandits with Eastern European folk costume and daggers and clubs ambushing hooded traveler at forest clearing crossroads, hooded cloaks, autumn leaves, misty gothic castle in distance',
        'ref_url': 'https://cdn.midjourney.com/989a7e5d-53a2-49ae-90a8-7bdabd7defbd/0_0.png',
        'remake_paragraphs': [100, 305, 319],
        'original_paragraphs': [181],
    },
    'art36_old_woman_stone': {
        'scene': 'Tiny old woman materializing from castle wall',
        'prompt': 'tiny hunched slavic old woman with wrinkled Eastern European face in grey peasant rags with a crooked back emerging from bare stone castle wall, empty chamber with three doorways leading to darkness, hooded hero stepping back startled, candlelight',
        'ref_url': 'https://cdn.midjourney.com/1ede985f-3563-4613-8b0c-651b69344a85/0_0.png',
        'remake_paragraphs': [215],
        'original_paragraphs': [323],
    },
    'art37_lumberjacks': {
        'scene': 'Lumberjacks attack in enchanted forest',
        'prompt': 'two muscular slavic peasant lumberjacks in Eastern European folk costume with axes attacking in enchanted forest, bundles of firewood on their shoulders, hooded hero raises sword, golden autumn leaves whirling, black castle looms behind',
        'ref_url': 'https://cdn.midjourney.com/b2a764b8-55e6-44c4-9043-c092035bb51c/0_0.png',
        'remake_paragraphs': [247],
        'original_paragraphs': [6],
    },

    # ─── BATCH 4: New key encounters (proposed by Gemini, paragraphs verified) ───
    # Status: prompts ready, Midjourney generation PENDING.
    # 'ref_url' will be filled in after the arts are generated.
    'art40_giant_spider_web': {
        'scene': 'Giant spider descends from web trap (rope-ladder scene)',
        'prompt': 'monstrous giant black spider descending from thick white glowing webs in a dark dead forest, hooded hero in dark cloak trapped in a sticky rope-ladder-like web, struggling with a sword, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/7f611350-e63a-4206-91f4-79278a724bdd/0_0.png',  # TO BE FILLED after MJ generation
        'remake_paragraphs': [436, 448],
        'original_paragraphs': [],
    },
    'art41_green_knight_mounted': {
        'scene': 'Green Knight on horseback with lance',
        'prompt': 'towering menacing slavic knight in ornate deep green heavy plate armor with Eastern European medieval design wielding a massive lance, riding a black warhorse on misty forest road, black dragon silhouette on shield, hooded hero in dark cloak preparing to fight, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/5262d54e-b9f6-4da0-97e8-70cb7c9899a6/0_0.png',
        'remake_paragraphs': [656],
        'original_paragraphs': [],
    },
    'art42_crypt_skeletons': {
        'scene': 'Undead skeletons rising in a crypt',
        'prompt': 'three terrifying undead skeletons in tattered medieval rags rising from ancient stone sarcophagi, glowing blue eyes, rusted swords, hooded hero in dark cloak holding a torch, underground crypt with burial chambers, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/df9aed0f-a9a5-4aad-88b8-f109c17a6422/0_0.png',
        'remake_paragraphs': [733, 811, 1108],
        'original_paragraphs': [],
    },
    'art46_giant_snake': {
        'scene': 'Giant snake with strangely human-shaped head',
        'prompt': 'colossal venomous snake with shimmering green and black scales coiled around a dead twisted tree, the serpent head unsettlingly resembling a human hand, dripping fangs, hooded hero in dark cloak standing defensive with sword drawn, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/b7217d53-ce7b-4e17-80db-c9465ed9531a/0_0.png',
        'remake_paragraphs': [421, 528],
        'original_paragraphs': [],
    },
    'art47_stone_rats': {
        # NOTE: prompt rewritten — in the book they are STONE rats, only the Green Knight's sword hurts them
        'scene': 'Swarm of petrified stone rats attacking in dungeon',
        'prompt': 'swarm of menacing stone-rat creatures with partially petrified bodies, cracked granite skin showing veins of muscle, glowing red eye-sockets, gnashing stone fangs scurrying over damp slate dungeon floor, hooded hero in dark cloak swinging a glowing pale-green steel sword to cut through them, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/08722381-b984-41fc-b55d-3e383ea15830/0_0.png',
        'remake_paragraphs': [1003, 1110],
        'original_paragraphs': [],
    },
    'art51_barlad_dert_boss': {
        'scene': 'Final duel: Barlad Dert with glowing sword in his study',
        'prompt': 'two figures facing each other in gothic candlelit study, left: hooded dark-cloaked slavic hero with Slavic facial features sword drawn, right: ancient frail slavic sorcerer Barlad Dert with deeply wrinkled gaunt Eastern European face, long unkempt white beard, hollow burning eyes, skeletal hands crackling with dark magical energy, black robes, massive writing desk covered in maps and scrolls between them, crumbling castle interior, tall arched windows, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/97989923-bf4a-449c-8dd1-aaf55bbabf7a/0_0.png',
        'remake_paragraphs': [823, 1096, 1164],
        'original_paragraphs': [],
    },
    'art52_princess_rescue': {
        'scene': 'Victory — Barlad Dert is slain, Princess is free',
        'prompt': 'hero in dark hooded cloak gently holding the hand of a beautiful slavic princess in a torn white folk gown, her long golden hair visible, she turns slightly toward viewer with tearful grateful eyes, soft dawn light breaking through gothic arched windows, crumbling castle hall strewn with autumn leaves, Barlad Dert\'s black robes collapsed on the floor, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'ref_url': 'https://cdn.midjourney.com/f4e8ed07-2f5c-436e-96e3-904e3ec262a3/0_0.png',
        'remake_paragraphs': [1220],
        'original_paragraphs': [617],
    },
    'art53_six_legged_beast': {
        'scene': 'Hero kneels by the slain six-legged beast in a quiet forest, examining the leather pouch from its neck containing a gold whistle and a diamond.',
        'prompt': "A lone medieval Slavic hero kneeling beside the corpse of a slain six-legged beast in a quiet enchanted forest clearing, gently examining a small leather pouch hidden around the beast's neck disguised to match its hide, tiny gold whistle and a sparkling cut diamond spilling out onto moss, the beast sprawled peacefully on its side with all six legs visible, dappled golden sunlight filtering through tall pine canopy, leather armor with embroidered Slavic ornaments, sword sheathed at the hip, atmospheric mood of quiet discovery after combat, oil painting on canvas, painterly brushwork visible --no panoramic landscape, hilltop overlook, open valley, sweeping vista, sparse trees, gore, blood splatter, text, logo, frame, border --ar 4:5 --style raw --v 6.1 --stylize 250 --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --cw 40",
        'ref_url': 'https://cdn.midjourney.com/fb6c0fa3-6b88-4fee-b232-c0287edc2284/0_0.png',
        'remake_paragraphs': [311],
        'original_paragraphs': [],
    },
    'art54_forest_path': {
        'scene': 'Hooded hero in a Slavic-ornamented cape walking forward into a deceptively peaceful enchanted autumn forest at the start of his journey.',
        'prompt': "A lone medieval Slavic hero walking forward into a deceptively peaceful enchanted forest at early morning, viewed from behind and slightly above, the hero entering the treeline with steady determined gait, soft golden morning mist drifting between tall ancient pine trunks, dappled warm light catching the path ahead, the forest appearing calm and ordinary on the surface but with subtle hints of darkness in the deeper distance, leather armor with embroidered Slavic ornaments, sword at the hip, cape catching light wind, oil painting on canvas, painterly brushwork visible, atmospheric chiaroscuro --no panoramic landscape, hilltop overlook, open valley, sweeping vista, sparse trees, dramatic combat, visible monsters, text, logo, frame, border --ar 4:5 --style raw --v 6.1 --stylize 250 --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --cw 50",
        'ref_url': 'https://cdn.midjourney.com/a787c691-d98d-44cc-8cc5-da5a5846eb92/0_0.png',
        'remake_paragraphs': [1],
        'original_paragraphs': [],
    },
    # ─── TITLE SCREEN: hero rider (splash, not paragraph-bound) ───
    'art_title_rider': {
        'scene': 'Title screen splash — hero on horseback riding away into a dark forest toward the distant Black Castle',
        'prompt': "A lone medieval Slavic hero on horseback riding away from the viewer along a narrow path INTO the depths of a dense dark enchanted pine forest at twilight, side-back three-quarter view, massive towering ancient tree trunks crowding both sides of the path and filling most of the frame, dense forest canopy overhead, cape flowing in the wind, sword at the hip, leather armor with embroidered Slavic ornaments, the horse caparisoned in dark cloth, tiny distant silhouette of a black castle barely visible far in the background glimpsed between the trees, narrow gap of star-filled sky above the treetops, atmospheric moonlight filtering down through branches catching the rider's profile and the horse's flank, dramatic chiaroscuro, oil painting on canvas, painterly brushwork visible, deep blacks, warm gold rim-light on the rider, cool deep-violet midtones in the forest --no panoramic landscape, hilltop overlook, open valley, sweeping vista, sparse trees, text, logo, frame, border --ar 4:5 --style raw --v 6.1 --stylize 250 --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --cw 40",
        'ref_url': '',  # not generated via Ace Data Cloud — saved manually as art_title_rider.png
        'remake_paragraphs': [],  # title screen only
        'original_paragraphs': [],
    },

}

if __name__ == '__main__':
    import json
    print(f"Total illustrations: {len(CATALOG)}")
    generated = sum(1 for v in CATALOG.values() if v.get('ref_url'))
    pending = len(CATALOG) - generated
    print(f"Already generated (have ref_url): {generated}")
    print(f"Pending generation (no ref_url):  {pending}")
    mapped = sum(1 for v in CATALOG.values() if v['remake_paragraphs'])
    print(f"With paragraph mapping: {mapped}")
    total_remake_paras = sum(len(v['remake_paragraphs']) for v in CATALOG.values())
    print(f"Total remake paragraph coverage: {total_remake_paras}")

    # Check for duplicate paragraph assignments
    from collections import defaultdict
    para_owners = defaultdict(list)
    for art_id, data in CATALOG.items():
        for p in data['remake_paragraphs']:
            para_owners[p].append(art_id)
    conflicts = {p: arts for p, arts in para_owners.items() if len(arts) > 1}
    if conflicts:
        print("\n⚠ CONFLICTS (same paragraph assigned to multiple arts):")
        for p, arts in sorted(conflicts.items()):
            print(f"  §{p}: {', '.join(arts)}")
    else:
        print("\n✓ No paragraph conflicts")
