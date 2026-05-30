# Provider Brief — Claude 4.8 Research Mode (Max effort, adaptive thinking) — 2026-05-29

## Your role
You are running a **fresh deep diagnostic audit** of a single-file HTML gamebook
engine — a digital adaptation of D. Braslavsky's 1991 **Russian-language**
gamebook *«Подземелья Чёрного замка»* (Dungeons of the Black Castle), **1221
paragraphs**. **Diagnostic pass — produce a report, do NOT commit code changes**
unless the human explicitly asks you to act on a verified finding. (You have the
tools to fix things; this round is about *finding* and *verifying*.)

## Your environment (you are the most capable session — use it)
- You run in the **Claude Windows App** with **full filesystem access** to the
  project folder: `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle`
- You also have **GitHub access** to `YVashchuk/Dungeons-of-the-Black-Castle`.
- You can run **PowerShell** and **Python** locally, and **`node --check`** is
  available for syntax validation and behavioural harnesses.
- Because you have the real files + code execution, **you can verify your own
  findings to the same standard the downstream verifier would** — please do.
  A claim you've already checked against canon + a Node harness is worth ten
  unverified guesses.

## Language rules (important)
- **Write your report in English** — most precise for inter-session comms.
- **Keep all quoted game text, choice labels, item names, and search strings in
  the original Russian, verbatim** (e.g. `«Заплатить (562)»`, `«Золотой ключ»`).
  The verification pipeline runs regex/substring search over the Russian source;
  English paraphrases won't match. The **game stays Russian**; English is only
  our working language.

## Tooling notes (hard-won — saves you hours)
- Read/grep Cyrillic via **Python `-X utf8` in a `.py` file**. Do NOT inline
  Cyrillic/regex in `python -c` from PowerShell, and do NOT `Select-String` the
  single-line JSON (both mangle Cyrillic).
- Parse data: `GD = json.loads(re.match(r'\s*const\s+GD\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S).group(1))`.
- `goTo()` in the engine **resets `sectionPrepState={}` every navigation** —
  mirror that in any harness. Persistent per-run flags live on `S` (backfilled in
  `normalizeSave`): `shopBought`, `riddle_attempts`, `sec436_force`.

## Source-of-truth hierarchy
1. `assets/fb2_remake.fb2` — canonical Russian text, **final arbiter**.
2. `assets/book_text.md` — MD mirror of the FB2 **prose** (1:1, 1221 paragraphs),
   **with corrections applied**. Good for fast text analysis. ⚠ Its per-paragraph
   `**Выборы:**` machine-lists are STALE — for current choice wiring use
   `src/remake_data.js`, not those lists.
3. `src/remake_data.js` — actual game data (`const GD`). Source of truth for
   choices/enemies/gold/items/conditions.
4. `src/game_logic.js` — the engine.
5. `assets/text_corrections.json` — the registry (**v2.49, 30 groups**).
   **Read `version_history` + every group before reporting** — it enumerates all
   already-fixed and already-rejected items.

## What to audit (broadest scope — you have everything)
For each finding: quote the **Russian canon line**, name the **paragraph(s)**,
state what code does now vs what canon requires, and (ideally) **the result of a
quick verification** you ran.

1. **Reachability & graph integrity** — a full audit already exists (`group_29`):
   1167/1221 reachable via `choice.target`+riddle edges, the other 54 are
   intentional mechanic-entries. **Re-verify the conclusion and look for anything
   it missed** — e.g. a `choice.target` that points to a non-existent paragraph,
   a paragraph reachable only via a mechanic that is itself broken, or a genuine
   orphan hiding among the 54 (cross-check against `group_29`'s classification).
2. **Combat/luck/spell correctness end-to-end** — pick 3–4 representative combats
   (incl. multi-enemy, `combat_condition:"wound_2"` at §532, the §436 spider
   script) and trace them in the engine: damage application, luck decrement,
   spell-budget decrement, flee penalty (−2). Flag any divergence from canon.
3. **Item lifecycle** — for each item that gates a later choice
   (`inventory_condition`), confirm there is a reachable grant (`auto_items` /
   `acquires`) and, where canon says the item is consumed, a `consume_on_use`.
   (Recently fixed, do NOT re-flag: §984, §972, §746, §140, §804.)
4. **Economy** — gold sources vs sinks across the book; shop §340 (start 15
   gold); any softlock where all visible choices are gold-gated with no escape
   (the §1092/§630 case was fixed in `group_21` Variant A — confirm no others).
5. **State persistence** — `normalizeSave` backfills; confirm every persistent
   flag the engine reads is backfilled (so an old save can't crash a new build).

## Output format (feeds an automated verifier)
- Numbered findings; each with **severity P0–P3**, paragraph(s), current vs
  required, a **Russian canon quote**, and your verification result if you ran one.
- Separate clearly: **verified bugs** / **suspected (unverified)** / **confirmed
  non-bugs you checked**.
- End with a summary count and your highest-confidence finding.

## Do-not-re-flag quick list (full detail in `text_corrections.json`)
§992 riddle ✓ · §562 self-loop ✓ · §140 gold-key ✓ · §972/§746 ✓ · F2 gold
gating ✓ · F8 necklace §984 ✓ · §436 spider all branches ✓ · §1128 night (NOT a
bug, `group_28`) · the 54 "unreachable" paragraphs (intentional, `group_29`) ·
§13/§140 are inventory tokens, not arithmetic · §416/§849 body-text "1366/1830"
are cosmetic FB2 typos (choices route correctly) · §38/§41 art correct · §372
ambience toggle · §240 `damage:3` · the symbiont.games topology PDF claims
(`group_24`, fabricated).
