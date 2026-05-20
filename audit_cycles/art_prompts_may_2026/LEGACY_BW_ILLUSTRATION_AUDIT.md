# Legacy B&W Illustration Coverage Audit — May 2026

**Status:** 🔴 GAP IDENTIFIED & DOCUMENTED. Ready for future Midjourney regeneration (when subscription renews).

**Investigation trigger:** User noticed the game still shows black-and-white scans from the original book editions (e.g. the six-legged beast at §372), and asked why our earlier art-coverage analysis missed them.

---

## ROOT CAUSE — why we missed these before

The game has **TWO separate image layers**, and our prior coverage analysis (the Midjourney prompts bundle) only inspected ONE of them:

1. **`src/mj_art.js`** → `MJ_MAP` — the **preferred colour Midjourney illustrations** (107 paragraph mappings, 45 unique colour arts). This is the layer all our prior analysis looked at.

2. **`src/illustrations.js`** → `ILLUST_DATA` + `ILLUST_MAP` — the **legacy 1991/5th-edition black-and-white scan fallback layer** (56 paragraph mappings, 28 unique B&W scans). **This layer was never cross-referenced in our coverage work.**

### Engine precedence (confirmed in `src/game_logic.js`)

```js
// colour art is tried FIRST:
... if MJ_MAP has an art for this paragraph, use it ...
// B&W scan is only used as a FALLBACK when no colour art exists:
if(!illustHtml && typeof ILLUST_MAP!=='undefined' && typeof ILLUST_DATA!=='undefined'){ ... }
```

So a paragraph that has BOTH a colour MJ art AND a B&W scan shows the **colour** version. A paragraph with ONLY a B&W scan shows **black-and-white** — visually inconsistent with the dark-fantasy colour style of the rest of the game.

### Why the build hides it from casual inspection

`build.sh` embeds both layers, with a comment that documents the design but is easy to overlook:

```
echo "// ═══ DATA: legacy 1991 b/w scan illustrations (fallback) ═══"
cat "$SRC_DIR/illustrations.js"
...
echo "// ═══ DATA: Midjourney color illustrations (preferred) ═══"
cat "$SRC_DIR/mj_art.js"
```

The B&W layer is real, shipped, and live in `dist/` — it just sits beneath the colour layer in precedence.

---

## COVERAGE SUMMARY

| Metric | Count |
|---|---|
| Paragraphs with B&W scan (`ILLUST_MAP`) | 56 |
| Paragraphs with colour MJ art (`MJ_MAP`) | 107 |
| **B&W paragraphs already superseded by colour** | **31** (OK — colour wins) |
| **B&W paragraphs STILL showing black-and-white in-game** | **25** ← REGEN TARGETS |
| Unique B&W scans still live (need colour replacement) | **14** |

### The 31 already-superseded B&W paragraphs (no action needed)
§1, §26, §38, §46, §48, §56, §76, §100, §112, §129, §131, §154, §163, §244, §250, §260, §305, §319, §330, §352, §390, §441, §481, §685, §707, §718, §744, §811, §833, §1013, §1097

### The 25 still-B&W paragraphs (REGEN TARGETS), grouped by the 14 unique scans
| B&W scan file | Paragraphs | Visual content (Claude-verified) |
|---|---|---|
| `395419_17.jpeg` | §372 | **Six-legged beast** — shaggy ape-like monster, bared fangs, 6 limbs, beside a gnarled tree. (§372 combat → win → §311 corpse, which already has colour art53.) |
| `395419_4.jpeg` | §385, §566 | Wounded/resting **bearded old warrior** slumped against a tree trunk, sword at side, forest path. |
| `395419_7.jpeg` | §50, §79 | **Long-bearded old man in a beret** at a stone arch; a fur/hide and a sword hang behind him, a horn on the wall. (Likely the weapon-master / quest-giver.) |
| `395419_8.jpeg` | §284, §627 | **Sleeping princess in a crown** on a canopied bed, surrounded by candelabra and candles. (Note: §1072 already uses colour art09 sleeping princess; consider reusing or a distinct candlelit variant.) |
| `395419_9.jpeg` | §935, §1158 | **Crypt / catacomb** with skeletons and skulls emerging from walls, scattered bones and helmets, a lit candle held in a skeletal hand. |
| `395419_11.jpeg` | §1129 | **Two armoured knights** (one dark-haired, one fair) with swords; a crowned ruler on a throne by a staircase in the background. Throne-room audience. |
| `395419_13.jpeg` | §49, §874 | **Hooded old beggar-woman** kneeling, hand outstretched, in a hall with a checkerboard floor and arched doors. |
| `395419_14.jpeg` | §58, §220 | **Three cat-faced goblin guards** with a halberd, crossbow bolts and a spear, beneath a raised portcullis. Guard post. |
| `395419_15.jpeg` | §429, §1189 | **Toad/frog-faced goblin guard** in a horned helmet and armour, seated at a table; spears and halberds on the wall. Checkpoint/gatehouse. |
| `395419_16.jpeg` | §441*, §689, §718* | **Bespectacled old librarian/scholar** in a beret among towering bookshelves, hand outstretched, books piled on a round table. (*§441 & §718 also have colour arts — so only §689 truly relies on this scan.) |
| `2_26db374703c7adf02479eb5ce9f8e4f0.jpg` | §36, §83 | **Victorian-engraving style** (NOT the "А22" artist): moustached man in a wide-brimmed hat with a rapier, in a forest. Stylistic outlier. |
| `2_37db5891e6d9f2071bc0cd3041cdc77b.jpg` | §70 | **Victorian-engraving style:** a spear-bearing warrior approaching a fortified castle with towers and a gate; guards at the entrance. |
| `2_6403779dab6dde60121feb743aec6eae.jpg` | §333, §600 | **Vodyanoi (water spirit)** — bearded, scaled water-demon hauling himself out of water in a brick-vaulted cellar. (§600 already in MJ bundle as N1 art55_vodyanoi_taverna.) |
| `2_bfd6d93f46917b7b6f8cf4624dcc8647.jpg` | §747, §829, §923 | **Pointy-eared goblin innkeeper** pouring from a tapped barrel/keg in a dim tavern. |

\* Cross-referenced caveat: §441 and §718 appear in both maps; their colour art already wins, so the regen need is driven by the OTHER paragraph(s) sharing the scan.

---

## STYLISTIC NOTE — two distinct legacy art sources

The B&W scans come from **two different origins**, visible in the artwork:

1. **"А22"-signed pen-and-ink drawings** (`395419_*.jpeg`) — clean line art, signed "А22", almost certainly the 5th-edition (modern reprint) illustrations. These are the bulk (10 of 14 scans).

2. **Victorian-style engravings** (`2_<hash>.jpg`, 4 scans) — dense crosshatched engravings in a much older European style, stylistically unrelated to both the "А22" line art AND the dark-fantasy MJ colour palette. These are the most jarring outliers and should be **highest priority** for replacement (§36, §70, §83, §333, §600 — though §600 is already in the bundle).

---

## REGENERATION PROMPTS (for future Midjourney session)

Common style suffix (match existing `art_catalog.py`):
```
dark Slavic fantasy oil painting, Ivan Bilibin × Frank Frazetta × Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, no text, no UI, no borders, no watermark
```
Common params: `--cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6`

### B1 — `art_bw01_six_legged_beast_alive` (§372)
> NOTE: distinct from the existing art53 (six-legged beast CORPSE at §311). This is the LIVING beast in combat.
```
a snarling six-legged beast charging, shaggy ape-like monster with a fanged roaring maw and six powerful clawed limbs, fur bristling, beside an enormous gnarled ancient tree in an autumn forest, dynamic threatening pose, the creature lunging toward the viewer
```

### B2 — `art_bw02_wounded_warrior_tree` (§385, §566)
```
a wounded bearded old warrior slumped against a massive tree trunk on a forest path, exhausted and pale, sword fallen at his side, worn leather armour and tall boots, dappled autumn light, melancholy atmosphere
```

### B3 — `art_bw03_weaponmaster_arch` (§50, §79)
```
a long-bearded old weapon-master standing at a vaulted stone archway, wearing a soft beret, a fur hide and a longsword hanging on the wall behind him, a hunting horn mounted on the stone, dim torchlight, a wise stern expression
```

### B4 — `art_bw04_sleeping_princess_candlelit` (§284, §627)
> Coordinate with existing art09/art26 sleeping-princess colour arts to avoid duplication; this is a candle-surrounded variant.
```
a sleeping princess wearing a golden crown lying on a canopied four-poster bed, surrounded by many tall lit candles and ornate candelabra, soft glowing candlelight, rich draped curtains, enchanted slumber atmosphere
```

### B5 — `art_bw05_crypt_skeletons_candle` (§935, §1158)
```
a torchlit crypt catacomb, skeletons and grinning skulls emerging from cracks in the stone walls, scattered bones rusted helmets and weapons on the floor, a single lit candle held in a skeletal hand casting eerie light, claustrophobic underground horror
```

### B6 — `art_bw06_throne_audience_knights` (§1129)
```
two armoured knights one dark-haired one fair standing with hands on sword hilts in a grand throne hall, a crowned ruler seated on a raised throne at the top of a wide stone staircase in the background, banners and gothic arches, tense audience scene
```

### B7 — `art_bw07_beggar_woman_hall` (§49, §874)
```
a hooded old beggar-woman in a tattered grey cloak kneeling on a checkerboard stone floor, one bony hand outstretched in supplication, tall arched wooden doors behind her, a vast dim castle hall, pleading sorrowful mood
```

### B8 — `art_bw08_goblin_guards_portcullis` (§58, §220)
```
three cat-faced goblin guards standing beneath a raised iron portcullis at a castle gate, armed with a halberd a quiver of crossbow bolts and a spear, mismatched scavenged armour, comical yet menacing, torchlit stone gateway
```

### B9 — `art_bw09_goblin_guard_table` (§429, §1189)
```
a toad-faced goblin guard in a horned helmet and plate armour seated at a heavy wooden table at a gatehouse checkpoint, spears and halberds racked on the stone wall behind, bored watchful expression, dim guardroom
```

### B10 — `art_bw10_librarian_scholar` (§689) [§441/§718 already colour]
```
a bespectacled old librarian-scholar in a soft beret reaching for a tome among towering bookshelves crammed with ancient leather books, a pile of heavy volumes on a round table, dusty candlelit library, scholarly atmosphere
```

### B11 — `art_bw11_castle_gate_approach` (§70) [Victorian-engraving replacement — HIGH PRIORITY outlier]
```
a lone spear-bearing warrior approaching a towering fortified castle with sharp slate roofs and a gatehouse, guards visible at the open gate, dramatic stormy sky, a winding path up to the walls
```

### B12 — `art_bw12_rapier_man_forest` (§36, §83) [Victorian-engraving replacement — HIGH PRIORITY outlier]
```
a moustached swordsman in a wide-brimmed feathered hat standing in a dense forest, hand resting on a rapier at his belt, confident stance, dappled woodland light
```

### B13 — `art_bw13_vodyanoi_cellar` (§333, §600) [overlaps bundle N1 art55]
> Already covered by N1 in MIDJOURNEY_PROMPTS_BUNDLE.md (art55_vodyanoi_taverna). Generate once, wire to §333 AND §600.
```
a bearded scaled vodyanoi water-spirit hauling himself out of dark water in a brick-vaulted underground cellar, webbed hands gripping the stone edge, seaweed in his hair and beard, menacing grin, eerie reflections on the water
```

### B14 — `art_bw14_goblin_innkeeper_barrel` (§747, §829, §923)
```
a pointy-eared goblin innkeeper pouring ale from a tapped wooden barrel into a mug, dim cluttered tavern interior, fur-trimmed jerkin, sly grin, warm hearth light in the background
```

---

## POST-GENERATION WIRING (for the future Claude session)

After generating, for EACH new colour art:
1. Add an entry to `art-pack/metadata/art_catalog.py` (scene, ref_url, remake_paragraphs).
2. Add the paragraph→art mappings to `MJ_MAP` in `src/mj_art.js` — because MJ_MAP wins over ILLUST_MAP, this automatically retires the B&W scan with NO need to touch `illustrations.js`.
3. Re-encode base64 into the web JPGs / mj_art.js, run `bash build.sh`.
4. Re-run `python -X utf8 scripts/find_smoke_paths.py` (no path changes expected — image-only).
5. Single commit.

**Decision deferred to user:** whether to (a) replace all 14, (b) replace only the 4 jarring Victorian-engraving outliers first (§36, §70, §83 + §333/§600 already bundled), or (c) leave the "А22" line art as an intentional stylistic choice for a Russian gamebook and replace only the engravings. The "А22" drawings are actually quite charming and on-theme; the Victorian engravings are the real eyesores.

---

## ARTEFACTS

The 14 extracted B&W scans were viewed and documented during this audit. They live embedded in `src/illustrations.js` (`ILLUST_DATA`); no separate files are committed (they're already in source). The temporary extraction folder `_bw_extract/` is git-ignored / deleted after this audit.
