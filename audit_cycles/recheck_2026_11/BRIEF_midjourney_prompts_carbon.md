# BRIEF — Gemini 4 Carbon, Track 4: the Midjourney prompts (November 2026)

## Why this review

The game ships 45 Midjourney illustrations (Batch 1–4, July 2026) and 28 black-and-white scans of the 1991 edition. All 45 were generated on Midjourney **V6** with one hero reference (`--cref`) and one style suffix. A July audit (group_71) queued 2 regenerations (defects), 5 replacement arts (art55–59) and 20 prompts that would replace the 1991 scans (Batch 5, art60–71 + variants). None of them has been generated yet: the author will take a Midjourney subscription later.

Midjourney has changed since: V8.2 is the default model (24 July 2026), `--cref` works only on V6 and Niji 6, the Edit Model replaced Omni and Character Reference on V8, and V9 is announced for December 2026. The maintainer's summary of these changes and a draft V8.2 parameter line are in `01_MIDJOURNEY_PROMPTS.txt`, section «Midjourney, ноябрь 2026» — a starting point for T2, not a decision. Your job: make the prompt set ready for the current Midjourney, keep the house style of the 45 existing arts, and make every queued scene match the book.

A short, correct prompt that matches the paragraph is worth more than a long one with every adjective.

## 0. How the work is organised

One chat. The bundle folder `4_midjourney` holds text files (each between `##### BEGIN FILE …` and `##### END FILE …`) and an `images/` folder:

| File | What it is |
|---|---|
| `00_BRIEF.txt` | this brief |
| `01_MIDJOURNEY_PROMPTS.txt` | `docs/MIDJOURNEY_PROMPTS.md` — the human catalog: style suffix, defaults, the regeneration queue, art55–59, Batch 5 |
| `02_art_catalog.txt` | `art-pack/metadata/art_catalog.py` — the 45 generated arts: scene, prompt, `ref_url` (the image on the Midjourney CDN), paragraphs |
| `03_mj_art.txt` | `src/mj_art.js` — `MJ_META` (runtime metadata) and `MJ_MAP` (paragraph → art; **the truth for bindings**) |
| `04_scenes.txt` | for every art (generated, queued, or a 1991 scan): the paragraphs it illustrates, with the Russian text (the canon) and the English translation |
| `05_art_backlog.txt` | the registry entries about art (group_71 audit, PL-23, HK-11, UI-12) |
| `images/` | `art01…art54_*.jpg` (the 45 generated arts, 900 px), `legacy/*.jpe?g` (the 28 scans of 1991), `title/` (the title art). Every image carries its file name in a black band **above** the picture («FILE: art30_two_headed_dragon.jpg») — added for this review because uploaded file names are not visible to you; the band is not part of the art: judge only the picture below it |

## 1. Pre-flight — mandatory, before any analysis

1. List the text files you received with their exact `##### END FILE …` line, and the number of images you can see by the labels of their bands (expected: 45 + 28 + 2); name any label that is missing or appears twice.
2. Quote the style suffix from `01_MIDJOURNEY_PROMPTS.txt` and the `HERO_CREF` line from `02_art_catalog.txt`.
3. Quote the first scene line of `04_scenes.txt` for `art30_two_headed_dragon` (the Russian text of §449, first sentence).

If a file has no END line or the images are fewer than expected, say so and stop.

## 2. Midjourney as of November 2026 (what the prompts must target)

Verify against Midjourney's own documentation if you can (docs.midjourney.com, midjourney.com/updates); where you cannot, say so and use this summary:

- **Models.** V8.2 — default since 24 July 2026 (aesthetics, image quality, personalization). V8.1 — available. V7 — available, the only current model with Omni Reference (`--oref`, `--ow`) and `--q`. V6 / Niji 6 — legacy, the only ones with `--cref`. V9 — announced at the 11 November Office Hours for «within 30 days», with a Thinking mode (better prompt adherence, slightly lower aesthetics, possibly double the cost); not released.
- **V8.2 parameters.** `--ar` (we use 3:2), `--s`/`--stylize` 0–1000 (default 100), `--chaos`, `--weird`, `--exp` (keep low, 10–25), `--raw` (more literal), `--no`, `--seed` (near-identical, not exact), `--sref` (URLs or codes; several allowed) with `--sw` 0–1000 (default 100), personalization `--p` / profiles and moodboards, `--iw` 0–2, `--hd` (native 2048 px), `--sd`, Draft mode (web only, 24 images at 512 px). Not on V8: `--cref`, `--oref`, `--q`, multi-prompts, Niji.
- **Edit Model (V8.1 and V8.2, open to all since 27 August 2026; masked inpainting and outpainting since 24 September).** Instruction editing of an existing image and new images built from up to 4 reference images; a masked edit changes only the selected pixels (an unmasked instruction re-reads the whole image); the base image's aspect ratio is kept. It replaced Omni Reference and Character Reference: it is the V8 way to put a known character into a scene and to fix a part of an image. Guides advise a «Keep: …» line for what must not change and branching every new image from an approved parent.
- **Prompt style for V8.** Natural sentences, the subject first, then details, setting, light, style; about 50–150 tokens; no stacks of adjectives («stunning, 8k, masterpiece»); parameters at the end; text that must appear goes in quotes (we want **no** text in our images).

## 3. What is settled — do not re-open

- The bindings in `MJ_MAP` are the truth (the «Несоответствия» table lists stale `MJ_META` fields — not your task).
- Every human character except the undead, orcs, goblins, water spirits and beasts has Slavic (Eastern European) features and Eastern European medieval folk costume.
- The hero is a hooded traveller; his look comes from the hero reference image (`HERO_CREF`).
- The scene content of the queue was checked against the book in July (group_71). Re-check it against `04_scenes.txt`, but do not change a scene unless the paragraph contradicts it — then quote the paragraph.
- The author's decision of 19 November: the old man's secret door is the small door in the castle wall at §70 (`art69_wall_door`), not at the gates.

## 4. The tasks

**T1 — the 45 generated arts.** Look at every image in `images/` next to its paragraphs in `04_scenes.txt`. For each: `keep`, `regenerate` (the image contradicts the paragraph — say what and quote the text), or `edit` (one part is wrong and the Edit Model can fix it: say which part and how). The July audit already flagged art30 (one head instead of two), art47 (the stone rats look organic), art51 and art08 (pseudo-text on scrolls and book spines), art14 at §688 (the throne must be empty), art33 at §46 / §112, art34 at §56. Confirm or correct them, and add only what you can see.

**T2 — the style system for V8.2.**
- Choose 2–3 of the 45 arts whose image best carries the house style (palette, brushwork, light) as `--sref` anchors (give their `ref_url` from `02_art_catalog.txt`), and propose `--sw` and `--s`.
- Rewrite the style suffix for V8 as one natural sentence. Decide whether to keep the three named painters (Bilibin, Frazetta, Vasnetsov) or describe the style instead, and say why.
- Propose the default parameter line for V8.2 (and the V6 fallback line with `--cref`, unchanged, for an author who keeps V6 for an exact match).
- The hero on V8.2: describe his canonical look in one sentence (from the hero reference image) and give the Edit Model recipe that keeps him consistent (which images as references, what instruction).

**T3 — the queued prompts.** Rewrite for V8.2 every prompt that is still to be generated: the regenerations art30 and art47, the replacements art55–59, Batch 5 art60–71 and the optional variants. For each: the paragraph(s) it illustrates, a one-line quote of the Russian text that the scene follows, the V8.2 prompt (natural sentences, 50–150 tokens), the parameter line, the `--no` list if needed, and — where it applies — an Edit Model alternative (an existing art + an instruction) that would be cheaper than a new generation. Counting and material constraints (exactly two heads; rats of stone) go first in the prompt; use `--raw` where literal adherence matters.

**T4 — the fixes by editing.** For art51 and art08 (pseudo-text) and any `edit` verdict of T1: the Edit Model instruction, the region to select, and what must not change.

**T5 — a test plan.** The cheapest way for the author to decide V6 vs V8.2 (the July plan was «one test pair»): which art to regenerate twice, with which prompts and parameters, in Draft mode first, and what to compare.

## 5. Rules of evidence and delivery

- Quote the paragraph text (Russian) for every scene decision; mark inferences.
- No living person's likeness, no text in images, no copyrighted characters.
- Do not invent scenes, characters or objects that the paragraph does not have.
- Answers, in this order (one per message, end each with `CONTINUE FROM …` or `TRACK COMPLETE`):
  1. Pre-flight + T2 (the style system);
  2. T1 (the 45 arts) as one table;
  3. T3 for art30, art47, art55–59 + T4;
  4. T3 for Batch 5 (art60–71) and the optional variants;
  5. `MJ_PROMPTS_V8.json` (one object per art: `id`, `paragraphs`, `verdict` (`keep` / `regenerate` / `edit` / `new`), `prompt_v8`, `params_v8`, `no`, `edit_instruction`, `prompt_v6_fallback`, `quote_ru`, `rationale`) and `MJ_PROMPTS_V8_REPORT.md` (the style system, the decisions for the author, the test plan, the open questions), then `TRACK COMPLETE`.
