# BRIEF — live smoke run of the November 2026 repairs (ChatGPT browser agent)

**Build under test:** https://yvashchuk.github.io/DotBC/ (short link; it redirects to the full Pages URL and keeps `#N` anchors). Stay on that site and its `#N` anchors only.

**Archive:** the repository ZIP of the commit under test is attached for reference (root folder name carries the hash; `dist/audio/` was stripped before packing — on the live site it is present). Extract read-only.

**What changed.** In November 2026 a fidelity review by Gemini 4 Argon compared all 1,221 Russian paragraphs with the game data; 40 findings were repaired (registry `assets/text_corrections.json`, group `group_100_2026_11_02_argon_fidelity`; the review itself is archived in `audit_cycles/recheck_2026_11/argon/`). Every repair has a live check: rows **C32–C47** of `MANUAL_SMOKE_CHECKS.md`; the engine review that followed (group `group_101_2026_11_02_argon_engine`) adds rows **C48–C52**. The maintainer's deterministic probes already pass (`tests/smoke/fidelity_probes.js`, 49/49); this run is the reader's view: does the screen show what the text promises.

## How to run

- Read `MANUAL_SMOKE_CHECKS.md` rows C32–C52 (Russian: «Вход» = where to start, «Шаги» = what to click, «Ожидаемо» = what must happen) and `SMOKE_BRIEF_chatgpt.md` sections 1–3 (interface glossary).
- **Create the hero once from the title screen** with these spells: Левитация 2, Исцеление 2, Огонь 2, Сила 2, Слабость 2, Копия 0 (for C47 the hero must have Levitation and no Copy). Then use `#N` to jump (typing a new `#N` in the address bar of the open tab reloads the page onto that paragraph by itself); the save persists between jumps, so an item taken at one paragraph is still in the bag at another. Start a new game only where a row says «новая игра».
- Work block by block in the order below. After each block write its result into the report draft and print a one-line progress note. If the browser connection dies, do not retry: deliver the partial report and name the remaining blocks.
- About 15 browser actions per block; one screenshot per finding plus one per block.
- Only clicks, typed answers and the keyboard — no DevTools, no console, no storage editing. You have no audio, no private window and no phone emulation: mark those aspects N/A.
- Report only what you saw. Quote the screen verbatim. Zero findings in a block is a valid result.

## Blocks

| Block | Rows | Theme |
|---|---|---|
| A | C32, C33 | the skull and the gas traps; «Готово» in the pick-up dialog now continues the route |
| B | C34, C35 | the crossbow: one shot per fight, not against Barlad Dert, not through ghosts |
| C | C36, C37, C47 | the fight against your own Copy; spells forgotten; Levitation charges at the tower; the Chief of the Guard without Copy |
| D | C38, C39 | two flasks: sips, springs, the merchant |
| E | C40, C41, C46 | gates: the spy's gifts, food for the fugitives, the helmet, the liver, the shiny metal |
| F | C42, C43, C44, C45 | routes and items: the river plaque, the old man's secret and the hidden door, the green gas and the silver vessel, trophies after fights |
| G | C48, C49, C50, C52 | engine fixes of group_101: Escape in the pick-up dialog, a language switch in the middle of a fight and of a luck check, a typed item name with markup, export and import of a save (C52: BLOCKED if you cannot upload a file; C51 needs sound — N/A) |

## Continuation runs

If the maintainer's first message names a subset of rows, create the hero as above and run only those rows; everything else in this brief applies unchanged. Rows already accepted in an earlier run are not repeated.

## Deliverable

`REPORT_astra_smoke_2026-11.md` — per row: PASS / FAIL / BLOCKED (reason) / N/A with a one-line observation; a findings table `id | row | § | screen quote | expected | class | severity`; an anomalies JSON in the schema `{id, section, screen_quote, canon_quote, class, severity, fix}`; the screenshots. Offer them for download and print the report in the chat.
