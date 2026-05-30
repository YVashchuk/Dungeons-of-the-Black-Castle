# Provider Brief — ChatGPT 5.5 Research Mode (Extended Thinking) — 2026-05-29

## Your role
You are running a **fresh diagnostic audit** of a single-file HTML gamebook
engine: a digital adaptation of D. Braslavsky's 1991 **Russian-language**
gamebook *«Подземелья Чёрного замка»* (Dungeons of the Black Castle), **1221
paragraphs**. This is a **diagnostic pass — produce a report only, do NOT edit
code.** Your findings will be independently verified against canon + code by a
separate Claude session before anything is committed.

## Language rules (important)
- **Write your entire report in English** — it is the most precise language for
  inter-session communication.
- **BUT keep all quoted game text, choice labels, item names, and search strings
  in the original Russian**, verbatim. Example: refer to the choice as
  `«Заплатить (562)»`, the item as `«Золотой ключ»`, not "Pay" or "Gold key".
  Reason: the downstream verifier runs regex / substring search over the Russian
  source files; an English paraphrase will not match and will waste a cycle.
- The **game itself is and stays Russian.** English is only our working language
  between AI sessions.

## How to access the project
You have **GitHub access**. The repository is:
`https://github.com/YVashchuk/Dungeons-of-the-Black-Castle`

**Read these files from the repo (in priority order):**
1. `assets/book_text.md` — full Russian text of all 1221 paragraphs **with
   corrections already applied** + a corrections-log header. **Use THIS as your
   text source for analysis**, not the raw FB2, so you do not re-flag
   already-fixed typos, dead-ends, or loops.
   - ⚠ Caveat: the per-paragraph `**Выборы:**` machine-lists at the foot of each
     paragraph in this file are STALE (exported from an older data revision). For
     the **current** choice wiring, trust `src/remake_data.js`, not those lists.
2. `assets/text_corrections.json` — the authoritative correction registry
   (**v2.49, 30 groups**). **Read the `version_history` and the group entries
   before reporting anything** — it lists every already-fixed and
   already-rejected item. Re-flagging something here is the #1 failure mode.
3. `src/remake_data.js` — the actual game data (`const GD = {...}`, keyed by
   paragraph). This is the source of truth for choices, enemies, gold, items,
   `auto_items`, `combat_condition`, `gold_condition`/`gold_cost`,
   `inventory_condition`/`consume_on_use`.
4. `src/game_logic.js` — the engine (combat, luck, spells, shop, riddle, render).

You may skip the large base64 art files (`src/mj_art.js`, `src/illustrations.js`)
and everything under `assets/illustrations/` — they are not relevant to a balance/
logic audit.

## What to audit (focus: balance + logic, since you have the full code)
Report findings in these areas. For each, **quote the Russian canon line** from
`book_text.md` and name the **paragraph number(s)**.

1. **Shop economy** — §340 is the merchant (player starts with **15 gold**). Map
   the gold sources and sinks across the whole book. Any dominant strategy,
   gold starvation, or item that trivialises the game?
2. **Combat damage outliers** — the engine computes per-hit enemy damage as
   `enemy.damage || 2` (default 2). Find paragraphs whose canon specifies a
   **non-default** per-hit damage («вычитайте не 2, а N…») that the data left at
   the default. (Already-fixed examples, do NOT re-flag: §240 snakes `damage:3`,
   §36 trader `damage:4`.)
3. **Spell economy** — there are **8 spells**; the player picks a budget of 10
   casts at character creation. All combat-modal spells (FORCE/WEAKNESS/COPY)
   and the ~50 narrative spell-hooks are already wired. Re-value each spell by
   how many paragraphs actually use it; flag any must-pick or dead-weight
   (ILLUSION / HEALING are suspected weak). **Mark balance suggestions as P3
   design-notes**, not bugs.
4. **State / item-gating consistency** — any choice that *consumes* or *requires*
   an item but is missing `inventory_condition` / `consume_on_use`; any narrative
   item grant missing from `auto_items`. (Recently fixed, do NOT re-flag: §984
   necklace, §972 ch[0-3], §746 grants, §140 gold-key, §562 self-loop.)
5. **Link / target integrity** — any `choice.target` that points to a wrong or
   non-existent paragraph. Note: §416 body text says "1366" and §849 says "1830"
   but both `choices` already route correctly (§366/§830) — these are known
   cosmetic FB2 typos, do NOT re-flag.

## Output format (this feeds an automated verifier)
- A numbered list of findings.
- Each finding: **severity** (P0 crash/softlock / P1 broken mechanic / P2
  notable / P3 design-note), **paragraph number(s)**, what the code/data
  currently does, what the canon or good balance requires, and a **short Russian
  canon quote** as evidence.
- If you cannot verify a claim against the files you read, say so — do not guess.
- End with a one-paragraph summary: how many P0/P1/P2/P3, and your single
  highest-confidence finding.

## Do-not-re-flag quick list (full detail in `text_corrections.json`)
§992 riddle ✓ · §562 self-loop ✓ · §140 gold-key ✓ · §972/§746 ✓ · F2 gold
gating (§2/§463/§548/§564/§49/§630/§658/§785/§1092) ✓ · F8 necklace §984 ✓ ·
§436 spider all branches ✓ · §1128 night (NOT a bug) · 54 "unreachable"
paragraphs (intentional mechanic entries, NOT bugs) · §13/§140 are tokens not
arithmetic · §38/§41 art correct · §372 ambience toggle · §240 `damage:3`.
