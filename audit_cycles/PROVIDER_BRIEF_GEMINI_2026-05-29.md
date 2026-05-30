# Provider Brief — Gemini 3.5 Flash Research Mode (Extended Thinking) — 2026-05-29

## Your role
You are running a **fresh diagnostic audit** of a digital adaptation of
D. Braslavsky's 1991 **Russian-language** gamebook *«Подземелья Чёрного замка»*
(Dungeons of the Black Castle), **1221 paragraphs**. **Diagnostic only — produce
a report, do NOT edit code.** Your findings will be independently verified
against canon + code by a Claude session before anything is committed.

## ⚠ Accuracy guard — read first
A previous Gemini audit of this exact project was **rejected wholesale as
confabulated**: it invented lore ("Elgariol", a villain "Bardush" — the real
antagonist is **«Барлад»**), claimed 428 colour illustrations (actual ~42), and
described per-paragraph scenes that did not match the real text. **Do not let
that happen again.** Concretely:
- **Base every statement on the files actually attached to this chat.** If you
  describe what a paragraph contains, it must come from the attached
  `book_text.md`, quoted in Russian.
- If you are unsure or the attachments don't cover something, **say "not
  determinable from provided files"** — do not fill the gap from imagination.
- The downstream verifier will spot-check 3–4 of your paragraph claims against
  the real data; if they don't match, your whole report is discarded.

## Language rules (important)
- **Write your report in English** — most precise for inter-session comms.
- **Keep all quoted game text, paragraph titles, scene descriptions drawn from
  the text, choice labels, and item names in the original Russian, verbatim**
  (e.g. `«Чёрный замок»`, `«Золотой ключ»`). The verifier runs substring search
  over the Russian source; English paraphrases won't match. The **game stays
  Russian**; English is only our working language.

## Your environment & how to get the files
You run **in the browser**: **no disk access**, with **attachment size/count
limits**, and **limited/unreliable GitHub access**. So we hand you a small,
curated file set rather than the whole repo.

### Files to ATTACH to this chat (small, text-only — well within limits)
1. **`assets/book_text.md`** (~900 KB) — full Russian text of all 1221
   paragraphs, corrections already applied. **Your primary source.** ⚠ Ignore the
   per-paragraph `**Выборы:**` machine-lists at the foot of each paragraph — they
   are stale; use the prose.
2. **`assets/text_corrections.json`** (~206 KB) — the correction registry
   (**v2.49, 30 groups**). Read its `version_history` and group entries so you do
   not re-flag already-fixed or already-rejected items.
3. **`src/map_module.js`** (~35 KB) — `BC_MAP_DEF` location/encounter map nodes,
   if you want the spatial structure.
4. *(optional, if attachable)* **`art-pack/metadata/art_catalog.py`** (~31 KB) —
   the Midjourney prompt-style reference (`--ar 3:2 --stylize 250 --v 6`).

### Do NOT attach / do NOT fetch (size — will blow your limits)
- ❌ `assets/illustrations/originals/*` — **383 MB** of full-res PNGs.
- ❌ `src/mj_art.js` (6.6 MB) and `src/illustrations.js` (3.2 MB) — these are
  almost entirely base64 image data. **You do not need the image bytes.**
- If you need the art→paragraph mapping, ask the human for a base64-stripped
  extract of `MJ_MAP` + `ILLUST_MAP` (a few KB) — do not try to pull the full files.
- If GitHub access fails for any file, **skip it and note the gap** rather than
  guessing its contents.

## What to audit (focus: art coverage + map/UX — plays to your strengths)
Ground every claim in the attached `book_text.md`. **Verified art numbers you
should treat as the current baseline** (do not contradict without evidence):
**107 paragraphs** have colour Midjourney art (**42 distinct art-ids / 45 image
files**); **56 paragraphs** have a 1991 B&W fallback (**21 files**); **132
paragraphs total** have some art. The rest are text-only.

1. **Coverage gaps by play-time density** — using the text, identify clusters of
   paragraphs that a player passes through often but that have **no art**, and
   rank them by how visible they'd be in a typical playthrough. Group by visual
   theme (combat, monsters, rooms, NPCs, items, transitions).
2. **Top illustration candidates** — pick the 5–10 highest-value uncovered
   paragraphs. For each: the **paragraph number**, a **one-line Russian scene
   description quoted/derived from `book_text.md`**, and a **ready Midjourney
   prompt** in the catalog's style (dark Slavic fantasy; end every prompt with
   `--ar 3:2 --stylize 250 --v 6`). Base the prompt on the actual text.
3. **Map/UX** (if you attached `map_module.js`) — do the 35 location nodes +
   34 encounter markers reasonably cover the journey? Any obviously missing
   location a player visits a lot? (Structural suggestion only — P3.)

## Output format (feeds an automated verifier)
- Start with the coverage analysis (themes + density ranking).
- Then a ranked candidate list; each entry: **paragraph number**, **Russian
  scene description (from the text)**, and the **Midjourney prompt**.
- Mark everything **P3** unless you find an actual broken reference in the
  attached files (then P1/P2 with the Russian quote).
- For anything not determinable from the attachments, write "not determinable
  from provided files."

## Do-not-re-flag quick list (detail in `text_corrections.json`)
The antagonist is **«Барлад»** (not "Bardush"/"Elgariol"). Art baseline is
42 art-ids / 107 paragraphs / 21 B&W / 132 total (NOT 428). §449 two-headed
dragon, §1003 stone rats, §311 missing-art are already on the human's regen
queue. §38/§41 existing art is correct. Do not re-raise the rejected
"topological analysis" claims (max-index 1366 / 1233 nodes / BFS 222 — all
fabricated, `group_24`).
