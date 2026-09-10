# BRIEF — MAP BACKGROUND ART for ChatGPT 6 Astra ULTRA with image generation (recheck cycle 2026-09, design track)

**Goal.** Three painted backgrounds for the in-game map (`src/map_module.js`, SVG overlay). Today the map is a dark green rectangle with a faint grid, dots and lines; the author's verdict: «страшно». The game draws nodes, edges, the current-position marker, the walked path and all labels itself (four languages) — so the pictures must contain **no lettering of any kind**, no numbers, no compass letters, no legend. Just terrain, mood and light.

**Style.** Aged parchment / hand-inked fantasy map in warm sepia and muted greens and blues, subtle watercolour washes, ink hatching for hills and forests, a slightly burnt vignette at the edges. Dark-fantasy mood (the book is «Подземелья Чёрного замка», 1991): the castle is black stone, the marsh is misty, the river is wide and slow. Nothing cute, nothing neon, no modern fonts. Consistent style across the three images. Avoid any resemblance to real published maps or franchises.

**Hard constraints.**
- Exact pixel sizes (or the same aspect at higher resolution): overworld **1600×1000**, castle exterior **1200×900**, castle interior **1600×1200**.
- The **relative placement** below is what matters: the SVG overlay will put dots at these coordinates, so hills, houses, the river, the bridge and the castle must sit where the table says (±60 px), and the areas around the dots must stay calm (no busy detail exactly under a node — the marker and its label go there).
- The middle of each picture must be readable when darkened by ~30 % (the game shows unexplored areas under fog).
- No text, no logos, no signatures, no borders with lettering; a plain parchment edge is fine.
- Deliver PNG (or JPEG q≥90), no watermark; state that the images are generated for this project and may be redistributed with it.

## Layer 1 — Overworld, 1600×1000 (west → east: from the starting road at bottom-left to the Black Castle at top-right)

| what | x | y | paint it as |
|---|---|---|---|
| Starting road | 140 | 820 | a dirt road entering from the left edge |
| Fork by the hill | 260 | 720 | a low hill with a fork |
| Forest merchant's hut | 430 | 630 | a small hut at the forest edge |
| Talking cottage | 300 | 470 | a lone crooked cottage in the woods, faintly magical |
| Forest crossroads | 520 | 500 | a crossroads inside a dense forest |
| Approach to the village | 700 | 470 | fields and a fence, first houses |
| Tavern | 770 | 410 | a village with a tavern |
| Marsh path | 560 | 320 | misty marsh with a narrow path (north of the forest) |
| Cliff and bypass path | 860 | 760 | a rocky cliff with a path around it |
| Palms and bananas | 930 | 860 | a small grove of palms (a strange warm pocket by the river) |
| Left riverbank | 980 | 640 | the west bank of a wide river flowing north–south through x≈1050–1150 |
| Island in the river | 1100 | 520 | an island mid-river |
| Far bank | 1220 | 640 | the east bank |
| Bridge over the ravine | 1180 | 420 | an old bridge over a dark ravine |
| First sight of the Black Castle | 1290 | 290 | a ridge with a view of the castle |
| Way to the gate | 1440 | 280 | the road ending at black castle gates at the top-right |

Paths connect: road → fork → (hut, cottage) → crossroads → (village → tavern), (marsh), (cliff → palms → far bank); village → left bank → island → far bank → bridge → castle view → gate.

## Layer 2 — Castle exterior, 1200×900

| what | x | y | paint it as |
|---|---|---|---|
| Gate and the watch | 170 | 470 | the gate from inside, a guard post |
| Gatehouse | 370 | 350 | a stone gatehouse |
| Central courtyard | 610 | 470 | a wide flagstone courtyard |
| Tall building | 870 | 250 | a tall dark tower/keep |
| Low building on the right | 900 | 610 | a squat annex |
| Wall by the river | 1020 | 780 | the outer wall with the river below |

## Layer 3 — Castle interior, 1600×1200 (a cutaway floor plan, several levels suggested by shading)

| what | x | y | paint it as |
|---|---|---|---|
| Great corridor | 220 | 200 | a long vaulted corridor (top-left) |
| Chief of the Guard's room | 430 | 170 | a guard officer's room |
| Hall of Orcs | 670 | 180 | a large hall |
| Lift and shaft | 920 | 170 | a shaft with a lift / stairs |
| Library | 470 | 390 | shelves |
| Room with beds and a mirror | 770 | 390 | a bedroom with a tall mirror |
| Room with taps | 1030 | 430 | a stone room with water taps |
| Gaming room | 230 | 620 | a den with dice tables |
| Prison block | 510 | 690 | cells |
| Caches and storerooms | 780 | 690 | storerooms |
| Princess's chambers | 1110 | 650 | a chamber with a crystal bed, many candles |
| Traps, doors, the Dragon | 1310 | 390 | a trapped corridor and a dragon's lair |
| Throne, wardrobe and mirror | 1360 | 770 | the wizard's study with a throne |

**Deliverables.** `map_overworld.png`, `map_castle_exterior.png`, `map_castle_interior.png` + one contact sheet showing each image with the node dots overlaid at the coordinates above (so we can judge placement before wiring them in). If a placement cannot be honoured, say which and why rather than moving the node.
