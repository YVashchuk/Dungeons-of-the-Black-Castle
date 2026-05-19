# Midjourney Art Prompts Bundle — Phase A.2 (Roadmap)

**Status:** Ready for Midjourney generation.
**Audience:** User with active Midjourney subscription (last day).
**Source:** `art-pack/metadata/art_catalog.py` style + canonical FB2 narrative.

This bundle covers:

1. **Two re-generations** — fix broken/off-context arts identified in memory.
2. **Six new generations** — fill iconic narrative gaps (high-value, unique scenes).

All prompts follow the existing `art_catalog.py` style: dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, candlelit gothic atmosphere, hero in dark hooded cloak.

---

## Common style suffix (append to every prompt)

```
dark Slavic fantasy oil painting, Ivan Bilibin × Frank Frazetta × Viktor Vasnetsov, muted earth tones, candlelit gothic atmosphere, painterly detail, cinematic framing, golden autumn leaves drifting, no text, no UI, no borders, no watermark
```

## Common parameters

```
--cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --ar 3:2 --stylize 250 --v 6 --no cartoon, anime, modern clothing, CGI, text, watermark
```

---

## Section 1 — RE-GENERATIONS (fix broken arts)

### R1: `art30_two_headed_dragon` (§449) — BROKEN

**Issue:** Memory note says Midjourney rendered the dragon as single-headed despite the prompt explicitly asking for two heads.

**FB2 §449:** «Внезапно вы видите громадного двухголового дракона, который с шумом опускается на поляну. Он мрачно смотрит на вас одной парой глаз, в то время как вторая ищет добычу.»

**New prompt (with stronger two-head emphasis):**

```
TWO HEADS ON ONE BODY, twin-headed dragon with two distinct heads on a single muscular neck base, both heads visible facing different directions one looking forward at the hero and the second turned to the side scanning the forest, enormous wings spread, dragon descending into autumn forest clearing, four glowing amber eyes total (two per head), iridescent dark scales, hooded slavic hero stands small on rocky outcrop in foreground, dust and embers swirling from wingbeats, dramatic low-angle shot emphasizing both heads
```

**MJ parameters:** standard style suffix + `--ar 3:2 --stylize 300 --v 6 --no one-headed, single-headed, single-neck` (extra negative prompts for the two-head insurance).

**Recommended:** Generate 2-3 batches. Pick the one where both heads are unmistakably visible. If first batch still goes single-headed, try rewriting as «hydra with two distinct heads on one body» (the «hydra» token is more reliable in MJ).

---

### R2: `art47_stone_rats` (§1003) — OFF-CONTEXT

**Issue:** Memory note says creatures rendered too organic; canon requires CLEARLY petrified stone, only the Green Knight's sword can hurt them.

**FB2 §1003 / §1101 context:** Каменные крысы, сражаться можно только Зелёным мечом (Green Sword).

**New prompt (stronger stone emphasis):**

```
swarm of statues come to life shaped like rats, creatures carved entirely from cracked grey granite stone with mineral veins, no organic flesh visible anywhere, sharp jagged stone edges, dust falling from cracks as they move, empty glowing red gemstone eyes set deep in carved stone sockets, NO fur NO skin NO flesh ONLY STONE, animated petrified gargoyle-rats scurrying over damp slate dungeon floor, dark cave dungeon with arched stone ceiling, hooded slavic hero in dark cloak swinging a glowing pale-green steel SWORD that emits magical green light cutting through one rat with stone chips flying, candlelit gothic atmosphere
```

**MJ parameters:** standard style suffix + `--ar 3:2 --stylize 300 --v 6 --no fur, organic, flesh, skin, rat-like animal`

**Recommended:** Generate 3+ batches. If MJ keeps making them rat-like, try the «animated stone gargoyle» token instead of «rat».

---

## Section 2 — NEW GENERATIONS (fill iconic gaps)

### N1: `art55_vodyanoi_taverna` — §600 Vodyanoi's taverna

**FB2 §600:** Vodyanoi (water spirit) runs a hidden taverna in the swamp. Chest contains candle/flint/white arrow. Canonical encounter mid-game.

**Prompt:**

```
mossy swamp taverna interior lit by green willo-the-wisps and oil lamps, bloated wet-skinned slavic vodyanoi water-spirit with seaweed beard and webbed hands sitting behind a rough wooden counter, fishy scales on his arms, ancient wooden chest open on the floor revealing flint candle and white arrow inside, hooded slavic hero in dark cloak examining the chest, low-ceilinged log cabin with water dripping through gaps in the boards, atmosphere of damp menace masked as hospitality
```

**Target paragraph:** 600 (single).

---

### N2: `art56_kikimora_witch_corner` — Kikimora encounter

**FB2 context:** Kikimora — Slavic household-spirit witch, appears in forest. Several mentions: §371 (Baba Yaga territory may overlap), but kikimora as distinct mention.

**Prompt:**

```
ancient slavic kikimora witch crouching in dark forest hut corner, gnarled grandmother figure with wild grey hair and ragged peasant clothes, glowing yellow cat-like eyes, surrounded by hanging dried herbs and bones, small clay pot bubbling on the floor hearth, hooded slavic hero peeks in through doorway from outside, dim candlelight, atmosphere of folk magic and dread
```

**Target paragraph:** Verify §163/§381 (current Baba Yaga arts) for overlap — kikimora may need different scene OR consider whether this is needed at all (Baba Yaga already covers similar territory).

**Recommendation:** Skip if you don't already see a specific kikimora paragraph that's distinct from Baba Yaga. Generate only if confirmed canonically distinct.

---

### N3: `art57_throne_room_barlad` — §1141 Barlad Dert's throne

**FB2 §1141:** Final approach to Barlad Dert in his throne room. Canonical victory-path scene.

**Prompt:**

```
massive gothic throne room interior of dark castle, towering pointed-arch ceiling, banners with black sun heraldry, raised stone throne at far end with shadowy figure of Barlad Dert the dark wizard seated in black robes with hooded cowl, golden tray on small table beside throne containing mysterious objects, candelabras with dripping black candles, hooded slavic hero approaches from the foreground walking down long carpeted aisle, dust motes in beam of light from rose window above, atmosphere of final confrontation
```

**Target paragraphs:** 1141 (throne room approach), maybe 198 too (throne narrative).

---

### N4: `art58_arena_combat` — §950 Arena Goblin

**FB2 §950:** Arena fight in Black Castle. Goblin arena combat. Canon canonically allows FORCE/HEALING. Pivotal combat scene.

**Prompt:**

```
gothic arena interior of dark castle, circular stone pit with bleachers above, hooded slavic hero in dark cloak with drawn sword facing off against single hulking goblin warrior wielding heavy notched cleaver, arena floor covered in old straw and bloodstains, torches blazing in iron sconces lining walls, distant shadowy spectators on stone bleachers, beams of light from high windows, atmosphere of doomed combat
```

**Target paragraph:** 950 (combat at arena).

---

### N5: `art59_treasure_chamber` — §1023 / treasure cache

**FB2 §1023:** Treasure room with emerald and other gemstones — currently unillustrated despite being one of the most iconic gold-mountain moments.

**Prompt:**

```
hidden treasure chamber in dark castle dungeon, massive piles of gold coins spilling across stone floor, scattered emeralds rubies and ancient jeweled goblets glinting in candlelight, ornate wooden chests overflowing with silver, ancient swords and crowns stacked against walls, hooded slavic hero standing in awe at entrance arch, dust motes in rays of dim light from high slit windows, atmosphere of forbidden wealth and danger
```

**Target paragraph:** 1023 (and possibly 471 which also describes treasure caches).

---

### N6: `art60_spider_riddle_chamber` — §1131 / §992 spider riddles

**FB2 §1131, §992:** Cave with giant spider posing riddles. New letter-riddle engine just shipped (commit `b6cd0cb`); this is the canonical riddle setting.

**Prompt:**

```
dark cave chamber lit by phosphorescent fungus on walls, enormous brown-furred slavic forest spider the size of a horse with eight glowing yellow eyes sitting on a massive cobweb throne stretched across the room, the spider's mandibles open as if speaking, hooded slavic hero stands cautiously below holding sword and lantern, smaller dead silk-wrapped victims hanging from ceiling cobwebs in shadowy background, atmosphere of ancient ritual and intelligence
```

**Target paragraphs:** 1131 + 992 (both riddle paragraphs).

---

## Section 3 — Post-generation steps

Once Midjourney returns the URLs:

1. **Update `art-pack/metadata/art_catalog.py`** — add new entries `art55..art60` with the new ref_urls and prompts. Update broken art30 / art47 ref_urls with the regenerated CDN links.

2. **Update `src/mj_art.js`** — add MJ_MAP entries pointing the new arts to their target paragraphs. Update existing art30/art47 entries with new ref_urls.

3. **Re-encode base64** — `assets/illustrations.js` and/or `assets/mj_art.js` (depending on which already contains base64). The build script `build.sh` may handle this automatically.

4. **Rebuild** — `bash build.sh` → produces new `dist/podzemelye-chyornogo-zamka-remake.html` with embedded images.

5. **Commit** — single commit covering all regenerations + new generations, registry update, and rebuilt dist.

I (Claude in a new session) can do steps 1-5 once you provide the new MJ output URLs. Just paste the URLs + I'll wire everything.

---

## Priority order (if limited time/credits)

If you only have credits for 4-5 generations:

1. **R1** art30 dragon (P0 — currently shipping broken art)
2. **R2** art47 stone rats (P0 — currently shipping wrong-looking art)
3. **N3** throne room §1141 (P1 — victory path narrative)
4. **N6** spider riddle chamber §1131/§992 (P1 — just-shipped new mechanic deserves its illustration)
5. **N5** treasure chamber §1023 (P2 — iconic but optional)

Skip if low priority: N2 kikimora (overlaps with Baba Yaga), N4 arena, N1 Vodyanoi taverna.

---

## After your MJ run

Open a new Claude session with:
- The MJ output URLs (paste 2-6 URLs depending on what you generated)
- This bundle file as context

I'll handle the catalog updates, MJ_MAP wiring, base64 re-encoding, build, and commit in one session.
