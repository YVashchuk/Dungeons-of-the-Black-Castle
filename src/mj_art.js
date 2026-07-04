// ╔═══════════════════════════════════════════════════════════════════════╗
// ║  MJ_ART — Midjourney illustrations for                                ║
// ║  Dungeons of the Black Castle (Remake 1991 1st-ed, 1221 paragraphs)   ║
// ╠═══════════════════════════════════════════════════════════════════════╣
// ║  36 AI illustrations in unified dark Slavic fantasy style.            ║
// ║                                                                       ║
// ║  Originals (PNG, full resolution): assets/illustrations/originals/    ║
// ║  Web versions (JPEG 900px Q82):    assets/illustrations/web/          ║
// ║  This file embeds the WEB versions as base64 for offline play.        ║
// ║                                                                       ║
// ║  HERO REFERENCE URL (for Midjourney --cref in re-generations):        ║
// ║  https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png     ║
// ║                                                                       ║
// ║  Default Midjourney params:                                           ║
// ║  --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-28565247821     ║
// ║                                                                       ║
// ║  Style suffix (append to all prompts):                                ║
// ║  dark Slavic fantasy oil painting, Ivan Bilibin style meets Frank Fr       ║
// ║  azetta meets Viktor Vasnetsov, muted earth tones, candlelit gothic        ║
// ║  atmosphere, painterly detail, cinematic framing, golden autumn leav       ║
// ║  es drifting                                                               ║
// ╚═══════════════════════════════════════════════════════════════════════╝

// Metadata catalog — useful for "Download original" / "Re-generate" UI hooks.
const MJ_META = {
  'art01_enchanted_forest_start': {
    scene: 'Enchanted forest, hero begins his journey',
    prompt: 'lone traveler in medieval dark cloak walking into an ancient enchanted slavic forest, forked dirt path, twisted oaks with gnarled roots, morning sunlight piercing canopy, far silhouette of black castle spires on horizon, autumn mood',
    refUrl: 'https://cdn.midjourney.com/67f4893a-d0eb-491e-9f88-11a2efddc915/0_0.png',
    remakeParagraphs: [1, 14],
    originalParagraphs: [1]
  },
  'art02_black_castle_first_view': {
    scene: 'First view of the Black Castle',
    prompt: 'massive black gothic castle looming over misty valley seen from hillside, hooded traveler standing on ridge observing, autumn forest below, heavy fog, distant tower spires piercing clouds',
    refUrl: 'https://cdn.midjourney.com/d9243b7e-8f11-467b-ae6f-0d7aa4947378/0_0.png',
    remakeParagraphs: [244, 250, 330],
    originalParagraphs: [118]
  },
  'art05_dragon_castle': {
    scene: 'Dragon at castle base',
    prompt: 'massive ancient dragon coiled around the base of a dark stone castle, glowing amber eye, smoke rising from arched gateway, hooded hero in dark cloak approaching cautiously, small compared to the beast',
    refUrl: 'https://cdn.midjourney.com/6bcfbfd6-e589-40b9-a636-2d8e0fce5c24/0_0.png',
    remakeParagraphs: [188, 440, 532, 1136],
    originalParagraphs: [37, 41]
  },
  'art09_sleeping_princess': {
    scene: 'Sleeping princess on crystal bed',
    prompt: 'beautiful young slavic princess with fair pale skin lying on ornate bed, eyes closed in enchanted sleep, dark cloaked hooded figure watching over her from the background, cathedral castle interior, candles and autumn leaves',
    refUrl: 'https://cdn.midjourney.com/f2d46e42-cd9f-48a5-8a49-0e57bef87e56/0_0.png',
    remakeParagraphs: [1072],
    originalParagraphs: [617]
  },
  'art10_victory_hero_throne': {
    scene: 'Victory — hero returning triumphant',
    prompt: 'young hero in dark hooded cloak standing triumphant in golden autumn courtyard of castle, soft evening light, arched gothic window glowing, sword held low, quiet victory',
    refUrl: 'https://cdn.midjourney.com/972647bf-375c-4040-a8b8-71c7721287f6/0_0.png',
    remakeParagraphs: [],
    originalParagraphs: [617]
  },
  'art25_cover_hero_castle': {
    scene: 'COVER / Character reference (title screen)',
    prompt: 'lone traveler in medieval cloak gazing at a dark gothic castle from misty ridge, vast autumn landscape, cinematic composition, book cover quality',
    refUrl: 'https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png',
    remakeParagraphs: [],
    originalParagraphs: []
  },
  'art03_hut_baba_yaga': {
    scene: 'Baba Yaga style talking hut on giant chicken legs',
    prompt: 'Baba Yaga hut standing on two giant bird legs with clawed feet, dark wooden architecture with carved beams and skull-topped fence posts, hooded hero approaches in autumn forest',
    refUrl: 'https://cdn.midjourney.com/bd29d478-7997-461a-9a9d-11e3535911e8/0_0.png',
    remakeParagraphs: [163, 284, 371, 381],
    originalParagraphs: [16, 120]
  },
  'art04_goblins': {
    scene: 'Two goblins in the forest',
    prompt: 'two hideous goblin warriors in dark enchanted forest, grotesque green-skinned humanoids with jagged weapons, crude leather armor, threatening the hooded hero, yellow autumn canopy',
    refUrl: 'https://cdn.midjourney.com/7f61de3d-a241-4d11-911a-4e4265f72f56/0_0.png',
    remakeParagraphs: [8, 43, 99, 752],
    originalParagraphs: [8, 40]
  },
  'art06_vampire': {
    scene: 'Vampire woman in castle',
    prompt: 'beautiful but terrifying slavic vampire woman in dark castle arched cloister, black hooded gown with gold trim, pale face with red lips, piercing stare, gothic stone arches behind',
    refUrl: 'https://cdn.midjourney.com/df10760e-bfee-4d1a-84a8-39af377ceec4/0_0.png',
    remakeParagraphs: [481, 685, 707, 773],
    originalParagraphs: [65, 93]
  },
  'art07_corridor': {
    scene: 'Grand castle corridor/hall',
    prompt: 'interior of a dark medieval castle great hall, massive stone arches, tall gothic windows with stained glass glowing, hooded hero from behind walking between columns, golden autumn leaves drifting in through broken windows',
    refUrl: 'https://cdn.midjourney.com/b78cf00d-75ff-4896-9f66-e3a7398e3cff/0_0.png',
    remakeParagraphs: [393, 833, 1013, 1097],
    originalParagraphs: [39, 100]
  },
  'art08_library': {
    scene: 'Ancient castle library',
    prompt: 'ancient dark castle library filled floor to ceiling with books, gothic architecture, massive arched shelves lit by candles, huge reading desk with stacked tomes, hooded figure in foreground',
    refUrl: 'https://cdn.midjourney.com/d819bd84-a825-4ff6-8fd3-f586f8c55d0c/0_0.png',
    remakeParagraphs: [441, 701, 718, 766],
    originalParagraphs: [22, 350]
  },
  'art11_swamp': {
    scene: 'Treacherous swamp',
    prompt: 'dark treacherous swamp in enchanted forest, misty murky water with half-submerged figure in dark hooded cloak, twisted dead trees, distant castle silhouette in fog, will-o-wisps',
    refUrl: 'https://cdn.midjourney.com/8652cee4-2fdd-4875-97f8-f36867daa711/0_0.png',
    remakeParagraphs: [93, 309, 329, 521],
    originalParagraphs: [99]
  },
  'art12_camp': {
    scene: 'Refugees hidden campfire in forest',
    prompt: 'small hidden campfire in dark enchanted forest clearing, group of hooded figures sitting around flames, black castle silhouette looming through autumn trees, secretive mood',
    refUrl: 'https://cdn.midjourney.com/47f202ec-b6f3-407b-8d2b-f626c30c8146/0_0.png',
    remakeParagraphs: [390, 1045],
    originalParagraphs: [3]
  },
  'art13_bear': {
    scene: 'Protective mother bear ally',
    prompt: 'massive protective mother bear standing guard in mossy forest glade, golden glowing eyes, hooded hero in dark cloak watching respectfully, castle spires in distance, autumn atmosphere',
    refUrl: 'https://cdn.midjourney.com/09fe0594-6371-47f1-bf27-d878d18334e4/0_0.png',
    remakeParagraphs: [84, 197, 281, 415],
    originalParagraphs: [457]
  },
  'art14_throne': {
    scene: 'Dark sorcerer on throne',
    prompt: 'dark sorcerer on an imposing black throne in vast gothic chamber, cave-like vaulted ceiling with stalactites, golden medallion on chest, scattered gold on floor, menacing presence',
    refUrl: 'https://cdn.midjourney.com/125601e1-ec85-48e8-bdb9-f9d9ed2d8a13/0_0.png',
    remakeParagraphs: [688],
    originalParagraphs: [577]
  },
  'art15_prison': {
    scene: 'Dark castle prison cell',
    prompt: 'dark medieval prison cell carved from black stone, iron barred window letting in misty light, hooded prisoner sitting on pile of straw, candle burning on wall shelf, damp atmosphere',
    refUrl: 'https://cdn.midjourney.com/059b253d-893b-49f2-b933-4a3a79d8ec83/0_0.png',
    remakeParagraphs: [41, 672, 947, 1095],
    originalParagraphs: [56]
  },
  'art16_dungeon': {
    scene: 'Underground catacomb corridor',
    prompt: 'dark underground dungeon corridor carved from black stone, arched vaulted passage with dripping stalactites, candles on stone pillars, skulls in wall niches, hooded figure walks cautiously with sword',
    refUrl: 'https://cdn.midjourney.com/ee176009-e4a1-4324-9981-3397cb05cc8b/0_0.png',
    remakeParagraphs: [258, 285, 311, 672],
    originalParagraphs: [311]
  },
  'art17_bridge_goblin': {
    scene: 'Goblin guarding bridge',
    prompt: 'grotesque goblin guard in crude armor standing menacingly on old stone bridge, holding spiked mace, river below, autumn mist, castle looming on hill behind',
    refUrl: 'https://cdn.midjourney.com/7482050f-2bd5-4613-8377-81e803a275e4/0_0.png',
    remakeParagraphs: [129, 162, 182, 391],
    originalParagraphs: [102]
  },
  'art18_gate': {
    scene: 'Hidden postern gate',
    prompt: 'narrow hidden wooden door cut into a massive black stone castle wall, arched frame with golden rune, hooded figure crouching in overgrown brush, autumn leaves swirling',
    refUrl: 'https://cdn.midjourney.com/ac5c9c95-21fa-4217-973f-e119522af0a3/0_0.png',
    remakeParagraphs: [488, 608],
    originalParagraphs: [232]
  },
  'art19_tower': {
    scene: 'Tower under starry sky',
    prompt: 'hero in dark hooded cloak standing on narrow castle battlement under vast starry sky, ancient tower spires, sweeping view of misty valley below, candles glowing in distance',
    refUrl: 'https://cdn.midjourney.com/c75814b0-5b56-4c8b-ba17-b98eb10f8c49/0_0.png',
    remakeParagraphs: [131],
    originalParagraphs: [131]
  },
  'art20_amulet': {
    scene: 'Hero reveals protective amulet to knights',
    prompt: 'hero in dark hooded cloak holding up a glowing silver amulet in castle gateway, two armored knights kneeling in respect, golden autumn leaves swirling around ancient archway',
    refUrl: 'https://cdn.midjourney.com/b15fd587-113a-4b20-93e0-3bced6136e4f/0_0.png',
    remakeParagraphs: [26, 388],
    originalParagraphs: [26]
  },
  'art21_oldwoman': {
    scene: 'Begging old woman by roadside',
    prompt: 'frail elderly slavic woman in worn grey shawl and patched dress sitting by misty forest roadside, holding small tin cup, wrinkled kind-stern face, autumn leaves, distant hooded traveler approaching',
    refUrl: 'https://cdn.midjourney.com/140bd863-5304-4c37-9e8a-fe439d6b689d/0_0.png',
    remakeParagraphs: [76, 443, 744],
    originalParagraphs: [49]
  },
  'art23_water_spirit': {
    scene: 'Water spirit in tavern',
    prompt: 'glowing translucent water creature with humanoid shape rising from flooded gothic hall, swirling luminous water, hooded hero watching, hooded monks at table by fireplace, ethereal blue light',
    refUrl: 'https://cdn.midjourney.com/db99a798-1706-46b4-a41c-c1cb213826d1/0_0.png',
    remakeParagraphs: [260],
    originalParagraphs: [260]
  },
  'art24_ball': {
    scene: 'Magical glowing guide ball',
    prompt: 'small glowing golden ball of yarn the size of a fist floating above an outstretched hand of a hooded figure, golden sparks trailing, dark castle silhouette in misty forest background, autumn leaves',
    refUrl: 'https://cdn.midjourney.com/d21abe6b-e350-4e3c-81fe-d6fb5a097e18/0_0.png',
    remakeParagraphs: [33, 191, 315, 381, 471],
    originalParagraphs: [576]
  },
  'art26_crystal_sarcophagus': {
    scene: 'Crystal sarcophagus with enchanted figure',
    prompt: 'transparent crystal sarcophagus lying flat on a stone pedestal in a cavern, glowing ethereal blue light from within, surrounded by tall candles, hooded figure kneeling before it, dark castle visible through cave opening',
    refUrl: 'https://cdn.midjourney.com/bcab9377-e428-47d4-b541-46178c03a194/0_0.png',
    remakeParagraphs: [45, 1072],
    originalParagraphs: [241]
  },
  'art27_monkey': {
    scene: 'Aggressive monkey in the forest',
    prompt: 'aggressive large monkey descending from ancient oak tree, bared fangs, golden autumn leaves whirling, hooded hero facing it in enchanted forest with castle silhouette far behind',
    refUrl: 'https://cdn.midjourney.com/f6656da1-99a0-4c7a-8ed8-daf230d88b90/0_0.png',
    remakeParagraphs: [38, 154, 168, 237, 510],
    originalParagraphs: [525]
  },
  'art28_king_statue': {
    scene: 'Ancient stone statue of the king',
    prompt: 'ancient stone statue of a king seated on a throne inside a vaulted stone sarcophagus chamber, golden medallion hanging from the neck, hooded figure in black cloak standing before it, cathedral cave interior',
    refUrl: 'https://cdn.midjourney.com/475add50-07fa-470e-88ed-df0882f5acdb/0_0.png',
    remakeParagraphs: [662],
    originalParagraphs: [84]
  },
  'art29_beautiful_hostess': {
    scene: 'Beautiful hostess in luxurious castle parlor',
    prompt: 'beautiful elegant woman in light summer dress with thin capricious face in luxurious castle sitting room, ornate folding screen, gold-framed paintings, plush sofas, hero in dark hooded cloak watches from aside, deceptive comfort',
    refUrl: 'https://cdn.midjourney.com/017ec4ab-a99d-48ed-812c-580ef2b4f882/0_0.png',
    remakeParagraphs: [707, 773],
    originalParagraphs: [556]
  },
  'art30_two_headed_dragon': {
    scene: 'Two-headed dragon landing in clearing',
    prompt: 'enormous two-headed dragon landing in enchanted forest clearing, massive wings spread, glowing eyes on both heads, hooded hero stands small on rocky outcrop, autumn leaves and embers',
    refUrl: 'https://cdn.midjourney.com/b3708188-37b5-4b8f-b4da-9ccb79845f1e/0_0.png',
    remakeParagraphs: [449],
    originalParagraphs: [412]
  },
  'art31_bandit_road': {
    scene: 'Injured bandit by roadside trap',
    prompt: 'injured ragged bandit lying on forest road edge in tattered clothes, feigning helplessness, hooded traveler approaches cautiously, autumn leaves, foggy castle behind',
    refUrl: 'https://cdn.midjourney.com/592ffe4f-4fd5-4711-a9a4-32884d785b63/0_0.png',
    remakeParagraphs: [19, 155],
    originalParagraphs: [110]
  },
  'art32_wise_elder': {
    scene: 'Wise elder at cottage door',
    prompt: 'kind frail old man with long white beard and wise eyes opening the door of an ornate carved wooden cottage, hooded black cloak, candle in niche, misty autumn forest, castle spires visible in background',
    refUrl: 'https://cdn.midjourney.com/225f5af3-0dea-4e39-8fcc-99704a1267cd/0_0.png',
    remakeParagraphs: [48, 76, 371, 487, 1045],
    originalParagraphs: [221]
  },
  'art33_green_knights': {
    scene: 'Three green-armored knights blocking path',
    prompt: 'three imposing green-armored knights standing guard blocking forest road, hooded cloaks over armor, misty castle behind, autumn leaves swirling, one holds a bow, one a great sword, one a spear',
    refUrl: 'https://cdn.midjourney.com/c25fb21d-b792-405c-be7b-ba1ef096ab8b/0_0.png',
    remakeParagraphs: [46, 96, 112],
    originalParagraphs: [45]
  },
  'art34_orcs': {
    scene: 'Three orc guards at castle gate',
    prompt: 'three massive green-skinned orc warriors in heavy black iron armor blocking an ancient stone castle gate, torches burning, one holds a halberd, snow drifting, arched passageway',
    refUrl: 'https://cdn.midjourney.com/b87a7233-ec87-45f4-9e2f-310dda9f5cfa/0_0.png',
    remakeParagraphs: [37, 56, 65, 71, 645],
    originalParagraphs: [319]
  },
  'art35_bandits_ambush': {
    scene: 'Bandits ambushing on forest clearing',
    prompt: 'three rough medieval bandits with daggers and clubs ambushing hooded traveler at forest clearing crossroads, hooded cloaks, autumn leaves, misty gothic castle in distance',
    refUrl: 'https://cdn.midjourney.com/989a7e5d-53a2-49ae-90a8-7bdabd7defbd/0_0.png',
    remakeParagraphs: [100, 305, 319],
    originalParagraphs: [181]
  },
  'art36_old_woman_stone': {
    scene: 'Tiny old woman materializing from castle wall',
    prompt: 'tiny hunched old woman in grey rags with a crooked back emerging from bare stone castle wall, empty chamber with three doorways leading to darkness, hooded hero stepping back startled, candlelight',
    refUrl: 'https://cdn.midjourney.com/1ede985f-3563-4613-8b0c-651b69344a85/0_0.png',
    remakeParagraphs: [215],
    originalParagraphs: [323]
  },
  'art37_lumberjacks': {
    scene: 'Lumberjacks attack in enchanted forest',
    prompt: 'two muscular lumberjacks with axes attacking in enchanted forest, bundles of firewood on their shoulders, hooded hero raises sword, golden autumn leaves whirling, black castle looms behind',
    refUrl: 'https://cdn.midjourney.com/b2a764b8-55e6-44c4-9043-c092035bb51c/0_0.png',
    remakeParagraphs: [247],
    originalParagraphs: [6]
  },
  'art40_giant_spider_web': {
    scene: 'Giant spider descends from web trap',
    prompt: 'monstrous giant black spider descending from thick white glowing webs in a dark dead forest, hooded hero trapped in sticky web, struggling with a sword, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
    refUrl: 'https://cdn.midjourney.com/7f611350-e63a-4206-91f4-79278a724bdd/0_0.png',
    remakeParagraphs: [436, 448],
    originalParagraphs: []
  },
  'art41_green_knight_mounted': {
    scene: 'Mounted knight in dark blue cloak with sword',
    prompt: 'towering menacing slavic knight in ornate deep green heavy plate armor riding a black warhorse on misty forest road, hooded hero preparing to fight, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
    refUrl: 'https://cdn.midjourney.com/5262d54e-b9f6-4da0-97e8-70cb7c9899a6/0_0.png',
    remakeParagraphs: [656],
    originalParagraphs: []
  },
  'art42_crypt_skeletons': {
    scene: 'Undead skeletons rising in a crypt',
    prompt: 'three terrifying undead skeletons in tattered medieval rags rising from ancient stone sarcophagi, glowing blue eyes, rusted swords, hooded hero holding a torch, underground crypt, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
    refUrl: 'https://cdn.midjourney.com/df9aed0f-a9a5-4aad-88b8-f109c17a6422/0_0.png',
    remakeParagraphs: [733, 811, 1108],
    originalParagraphs: []
  },
  'art46_giant_snake': {
    scene: 'Giant snake with strangely human-shaped head',
    prompt: 'colossal venomous snake with shimmering green and black scales coiled around a dead twisted tree, dripping fangs, hooded hero defensive with sword drawn, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
    refUrl: 'https://cdn.midjourney.com/b7217d53-ce7b-4e17-80db-c9465ed9531a/0_0.png',
    remakeParagraphs: [421, 528],
    originalParagraphs: []
  },
  'art47_stone_rats': {
    scene: 'Swarm of petrified stone rats attacking in dungeon',
    prompt: 'swarm of menacing stone-rat creatures with partially petrified bodies, cracked granite skin, glowing red eye-sockets, hooded hero swinging a glowing pale-green steel sword, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
    refUrl: 'https://cdn.midjourney.com/08722381-b984-41fc-b55d-3e383ea15830/0_0.png',
    remakeParagraphs: [1003, 1110],
    originalParagraphs: []
  },
  'art51_barlad_dert_boss': {
    scene: 'Final duel: Barlad Dert in his study',
    prompt: 'two figures facing each other in gothic candlelit study, hooded dark-cloaked hero sword drawn facing ancient frail sorcerer Barlad Dert with white beard, skeletal hands crackling with dark magic, black robes, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
    refUrl: 'https://cdn.midjourney.com/97989923-bf4a-449c-8dd1-aaf55bbabf7a/0_0.png',
    remakeParagraphs: [823, 1096, 1164],
    originalParagraphs: []
  },
  'art52_princess_rescue': {
    scene: 'Victory — Barlad Dert is slain, Princess is free',
    prompt: "hero in dark hooded cloak gently holding the hand of a beautiful slavic princess in torn white folk gown, tearful grateful eyes, soft dawn light, crumbling castle hall, Barlad Dert's black robes collapsed on floor, dark Slavic fantasy oil painting, Bilibin x Frazetta x Vasnetsov --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6",
    refUrl: 'https://cdn.midjourney.com/f4e8ed07-2f5c-436e-96e3-904e3ec262a3/0_0.png',
    remakeParagraphs: [1220],
    originalParagraphs: [617]
  },
  'art53_six_legged_beast': {
    scene: "Hero kneels by the corpse of a slain six-legged beast in a quiet forest, examining a small leather pouch from its neck containing gold whistle and diamond.",
    prompt: "A lone medieval Slavic hero kneeling beside the corpse of a slain six-legged beast in a quiet enchanted forest clearing, gently examining a small leather pouch hidden around the beast's neck disguised to match its hide, tiny gold whistle and a sparkling cut diamond spilling out onto moss, the beast sprawled peacefully on its side with all six legs visible, dappled golden sunlight filtering through tall pine canopy, leather armor with embroidered Slavic ornaments, sword sheathed at the hip, atmospheric mood of quiet discovery after combat, oil painting on canvas, painterly brushwork visible --no panoramic landscape, hilltop overlook, open valley, sweeping vista, sparse trees, gore, blood splatter, text, logo, frame, border --ar 4:5 --style raw --v 6.1 --stylize 250 --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --cw 40",
    refUrl: 'https://cdn.midjourney.com/fb6c0fa3-6b88-4fee-b232-c0287edc2284/0_0.png',
    remakeParagraphs: [311],
    originalParagraphs: []
  },
  'art54_forest_path': {
    scene: "Hooded hero in a Slavic-ornamented cape walking forward into a deceptively peaceful enchanted autumn forest at the start of his journey.",
    prompt: "A lone medieval Slavic hero walking forward into a deceptively peaceful enchanted forest at early morning, viewed from behind and slightly above, the hero entering the treeline with steady determined gait, soft golden morning mist drifting between tall ancient pine trunks, dappled warm light catching the path ahead, the forest appearing calm and ordinary on the surface but with subtle hints of darkness in the deeper distance, leather armor with embroidered Slavic ornaments, sword at the hip, cape catching light wind, oil painting on canvas, painterly brushwork visible, atmospheric chiaroscuro --no panoramic landscape, hilltop overlook, open valley, sweeping vista, sparse trees, dramatic combat, visible monsters, text, logo, frame, border --ar 4:5 --style raw --v 6.1 --stylize 250 --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --cw 50",
    refUrl: 'https://cdn.midjourney.com/a787c691-d98d-44cc-8cc5-da5a5846eb92/0_0.png',
    remakeParagraphs: [1],
    originalParagraphs: []
  },
};

const MJ_MAP = {
  "1": "art54_forest_path",
  "14": "art01_enchanted_forest_start",
  "244": "art02_black_castle_first_view",
  "250": "art02_black_castle_first_view",
  "330": "art02_black_castle_first_view",
  "188": "art05_dragon_castle",
  "440": "art05_dragon_castle",
  "532": "art05_dragon_castle",
  "1136": "art05_dragon_castle",
  "352": "art05_dragon_castle",
  "1072": "art09_sleeping_princess",
  "1220": "art52_princess_rescue",
  "163": "art03_hut_baba_yaga",
    "371": "art03_hut_baba_yaga",
  "381": "art03_hut_baba_yaga",
  "8": "art04_goblins",
  "43": "art04_goblins",
  "99": "art04_goblins",
  "752": "art04_goblins",
  "481": "art06_vampire",
  "685": "art06_vampire",
  "707": "art06_vampire",
  "773": "art06_vampire",
  "393": "art07_corridor",
  "833": "art07_corridor",
  "1013": "art07_corridor",
  "1097": "art07_corridor",
  "441": "art08_library",
  "701": "art08_library",
  "718": "art08_library",
  "766": "art08_library",
  "93": "art11_swamp",
  "309": "art11_swamp",
  "329": "art11_swamp",
  "521": "art11_swamp",
  "390": "art12_camp",
  "1045": "art12_camp",
  "84": "art13_bear",
  "197": "art13_bear",
  "281": "art13_bear",
  "415": "art13_bear",
  "688": "art14_throne",
  "41": "art15_prison",
  "672": "art15_prison",
  "947": "art15_prison",
  "1095": "art15_prison",
  "258": "art16_dungeon",
  "285": "art16_dungeon",
  "129": "art17_bridge_goblin",
  "162": "art17_bridge_goblin",
  "182": "art17_bridge_goblin",
  "391": "art17_bridge_goblin",
  "488": "art18_gate",
  "608": "art18_gate",
  "131": "art19_tower",
  "26": "art20_amulet",
  "388": "art20_amulet",
  "76": "art21_oldwoman",
  "443": "art21_oldwoman",
  "744": "art21_oldwoman",
  "260": "art23_water_spirit",
  "33": "art24_ball",
  "191": "art24_ball",
  "315": "art24_ball",
  "471": "art24_ball",
  "45": "art26_crystal_sarcophagus",
  "38": "art27_monkey",
  "154": "art27_monkey",
  "168": "art27_monkey",
  "237": "art27_monkey",
  "510": "art27_monkey",
  "662": "art28_king_statue",
  "449": "art30_two_headed_dragon",
  "19": "art31_bandit_road",
  "155": "art31_bandit_road",
  "48": "art32_wise_elder",
  "487": "art32_wise_elder",
  "46": "art33_green_knights",
  "96": "art33_green_knights",
  "112": "art33_green_knights",
  "37": "art34_orcs",
  "56": "art34_orcs",
  "65": "art34_orcs",
  "71": "art34_orcs",
  "645": "art34_orcs",
  "100": "art35_bandits_ambush",
  "305": "art35_bandits_ambush",
  "319": "art35_bandits_ambush",
  "215": "art36_old_woman_stone",
  "247": "art37_lumberjacks",
  "421":  "art46_giant_snake",
  "436":  "art40_giant_spider_web",
  "448":  "art40_giant_spider_web",
  "528":  "art46_giant_snake",
  "656":  "art41_green_knight_mounted",
  "733":  "art42_crypt_skeletons",
  "811":  "art42_crypt_skeletons",
  "823":  "art51_barlad_dert_boss",
  "1003": "art47_stone_rats",
  "1096": "art51_barlad_dert_boss",
  "1108": "art42_crypt_skeletons",
  "1110": "art47_stone_rats",
  "1164": "art51_barlad_dert_boss",
  "311": "art53_six_legged_beast",
  "558": "art07_corridor",
  "846": "art07_corridor",
  "1123": "art07_corridor"
};

// MJ_DATA - relative paths to externalized binaries (group_70, 2026-07-01).
// Payloads live in art/mj/ next to the built HTML (see MJ_META for scene/prompt/ref).
const MJ_DATA = {
  'art01_enchanted_forest_start': 'art/mj/art01_enchanted_forest_start.jpg',
  'art02_black_castle_first_view': 'art/mj/art02_black_castle_first_view.jpg',
  'art05_dragon_castle': 'art/mj/art05_dragon_castle.jpg',
  'art09_sleeping_princess': 'art/mj/art09_sleeping_princess.jpg',
  'art10_victory_hero_throne': 'art/mj/art10_victory_hero_throne.jpg',
  'art25_cover_hero_castle': 'art/mj/art25_cover_hero_castle.jpg',
  'art03_hut_baba_yaga': 'art/mj/art03_hut_baba_yaga.jpg',
  'art04_goblins': 'art/mj/art04_goblins.jpg',
  'art06_vampire': 'art/mj/art06_vampire.jpg',
  'art07_corridor': 'art/mj/art07_corridor.jpg',
  'art08_library': 'art/mj/art08_library.jpg',
  'art11_swamp': 'art/mj/art11_swamp.jpg',
  'art12_camp': 'art/mj/art12_camp.jpg',
  'art13_bear': 'art/mj/art13_bear.jpg',
  'art14_throne': 'art/mj/art14_throne.jpg',
  'art15_prison': 'art/mj/art15_prison.jpg',
  'art16_dungeon': 'art/mj/art16_dungeon.jpg',
  'art17_bridge_goblin': 'art/mj/art17_bridge_goblin.jpg',
  'art18_gate': 'art/mj/art18_gate.jpg',
  'art19_tower': 'art/mj/art19_tower.jpg',
  'art20_amulet': 'art/mj/art20_amulet.jpg',
  'art21_oldwoman': 'art/mj/art21_oldwoman.jpg',
  'art23_water_spirit': 'art/mj/art23_water_spirit.jpg',
  'art24_ball': 'art/mj/art24_ball.jpg',
  'art26_crystal_sarcophagus': 'art/mj/art26_crystal_sarcophagus.jpg',
  'art27_monkey': 'art/mj/art27_monkey.jpg',
  'art28_king_statue': 'art/mj/art28_king_statue.jpg',
  'art29_beautiful_hostess': 'art/mj/art29_beautiful_hostess.jpg',
  'art30_two_headed_dragon': 'art/mj/art30_two_headed_dragon.jpg',
  'art31_bandit_road': 'art/mj/art31_bandit_road.jpg',
  'art32_wise_elder': 'art/mj/art32_wise_elder.jpg',
  'art33_green_knights': 'art/mj/art33_green_knights.jpg',
  'art34_orcs': 'art/mj/art34_orcs.jpg',
  'art35_bandits_ambush': 'art/mj/art35_bandits_ambush.jpg',
  'art36_old_woman_stone': 'art/mj/art36_old_woman_stone.jpg',
  'art37_lumberjacks': 'art/mj/art37_lumberjacks.jpg',
  'art40_giant_spider_web': 'art/mj/art40_giant_spider_web.jpg',
  'art41_green_knight_mounted': 'art/mj/art41_green_knight_mounted.jpg',
  'art42_crypt_skeletons': 'art/mj/art42_crypt_skeletons.jpg',
  'art46_giant_snake': 'art/mj/art46_giant_snake.jpg',
  'art47_stone_rats': 'art/mj/art47_stone_rats.jpg',
  'art51_barlad_dert_boss': 'art/mj/art51_barlad_dert_boss.jpg',
  'art52_princess_rescue': 'art/mj/art52_princess_rescue.jpg',
  'art53_six_legged_beast': 'art/mj/art53_six_legged_beast.jpg',
  'art54_forest_path': 'art/mj/art54_forest_path.jpg',
};

// Attach to window so game_logic.js can read them uniformly.
if(typeof window!=='undefined'){window.MJ_META=MJ_META;window.MJ_MAP=MJ_MAP;window.MJ_DATA=MJ_DATA;}