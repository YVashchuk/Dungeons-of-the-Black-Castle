# Claude Re-Audit Brief — Dungeons of the Black Castle (2026-06-16)

You are auditing a digital adaptation of D. Braslavsky's 1991 **Russian-language** gamebook
*«Подземелья Чёрного замка»* (1221 paragraphs, victory §1220). **Diagnostic pass — produce a
report; do NOT commit code** unless the human explicitly asks you to act on a verified finding.

## Run mode (important)
**Do NOT use Deep Research / autonomous web-browsing mode.** This is a *closed-corpus*
audit — everything you need is the project's own files. Web browsing would pull in
unrelated gamebook info and has previously produced confabulations (an external
"topology" PDF invented metrics; an earlier Gemini invented characters). Use your
**strongest reasoning / extended-thinking mode reading ONLY the provided sources.**

## Your environment (most capable session — use it)
You run in the Claude app **inside the project folder** `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle`
with **filesystem access**, plus **GitHub** access to `YVashchuk/Dungeons-of-the-Black-Castle`,
and can run **PowerShell / Python (`python -X utf8 script.py`) / `node --check`**. Because you
have the real files + code execution, **verify your own findings to the standard the downstream
verifier would** (canon → code → Node harness). A claim you've already checked is worth ten guesses.

### Tooling notes (hard-won)
- Read/grep Cyrillic via **Python `-X utf8` in a `.py` file**; never inline Cyrillic/regex in
  `python -c` from PowerShell, never `Select-String` the single-line JSON (both mangle Cyrillic).
- Parse data: `GD = json.loads(re.match(r'\s*const\s+GD\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S).group(1))`.
- `goTo()` resets `sectionPrepState={}` every navigation — mirror that in harnesses. Persistent
  per-run flags live on `S` (backfilled in `normalizeSave`): e.g. `summonsUsed`, `sec436_force`.

## Sources of truth
1. `assets/fb2_remake.fb2` — canonical Russian text, **final arbiter**.
2. `assets/book_text.md` — MD mirror of the prose (1:1, 1221 ¶); its `**Выборы:**` lists are STALE — use `remake_data.js` for wiring.
3. `assets/book_1991_extracted.txt` — decoded 1991 edition (617 ¶) for "what did the original intend?" adjudication.
4. `src/remake_data.js` (data) · `src/game_logic.js` (engine).
5. `assets/text_corrections.json` — registry (**v2.92, 63 groups**). Read `version_history` + groups FIRST; don't re-flag closed work.

## Language rules (strict)
- Write the **entire report in English** — the precise inter-session language.
- Keep **every quoted game string in the original Russian, verbatim**: paragraph
  text, choice labels, item names, spell names (e.g. «Заплатить (315)», «Медвежий
  амулет», «Волшебный колокольчик», «Помощь рыбки»). The downstream verifier runs
  regex/substring search over the Russian source — an English paraphrase will not
  match and wastes a whole cycle.
- The **game itself is and stays Russian**. English is only how we talk between sessions.

## Game rules (Fighting-Fantasy family; the game is in Russian)
- Hero stats: Мастерство/Skill (1d6+6), Выносливость/Stamina (2d6+12), Удача/Luck (1d6+6).
  Luck is capped at its initial value (`luckMax`); a Luck test rolls 2d6 — if ≤ current
  Luck you are lucky — then Luck decreases by 1.
- Combat: 2d6 + Skill vs enemy's 2d6 + Skill; the higher inflicts damage (default 2, or a
  per-enemy value). Multi-enemy: you strike only the first, but all living enemies can wound you.
- Fleeing a fight costs −2 Stamina.
- 8 spells of Майлин (chosen as a budget at start): Огонь, Плавание, Левитация, Иллюзия,
  Сила, Слабость, Копия, Исцеление.
- Start: 15 gold, 2 flasks. Victory is §1220. 1221 paragraphs total.

## KEY ENGINE FACTS — the easy-to-mis-flag mechanics (read before reporting)
1. **Item-summoned combat allies are NOT the Copy spell.** Some held ITEMS summon an
   ally mid-fight that has its OWN Skill/Stamina and only borrows the Copy *resolution
   rules* (a self-contained 2d6+Skill side-fight, ±2 HP/round, ally HP = its own Stamina):
   - «Волшебный колокольчик» (granted §612) → Медведь (Skill 11, Stamina 9), usable **anywhere incl. inside the castle**.
   - «Медвежий амулет» (granted §84, via the choice's `acquires` to §511) → Медведица (Skill 8, Stamina 10), usable **only OUTSIDE the Black Castle**.
   Once per journey (`S.summonsUsed`); the item is **retained**, not consumed. The amulet
   being powerless inside the castle is **canon, not a bug** — the boundary is the curated
   `CASTLE_SECTIONS` set of 26 interior combat paragraphs.
2. **Two distinct amulets — never conflate:** «Медвежий амулет» (§84, summons Медведица)
   vs «Золотой амулет» (§390/§500/§625/§1164, blinds Барлад Дэрт in the finale).
3. **`post_combat:true`** on a choice = hidden during a pending fight, shown only after
   victory. Post-victory continuations MUST carry it or they become combat-bypasses. 116
   such flags exist. PRE-combat choices (cast spell / show item / flee / password) stay visible.
4. **Items are granted by SIX mechanisms** — a "gated but never granted" claim is FALSE
   unless ALL six are checked: `auto_items.items`, `auto_items.food[]`, `grants_items`,
   `grants_food`, `bet_payout.items`, and `acquires`. (The bear amulet is granted ONLY via
   `acquires` — invisible to an `auto_items`-only scan.)
5. **Paragraph-jumping items** (fish +15, castle key +40, Book +24, ruby ring +401, orange
   +750, club +50, candles +10, bird-guide −50, …) ship as **static, inventory-gated parallel
   choices** (per-item conditional routing). There is **NO runtime arithmetic engine and one
   must NOT be proposed** (1221-renumbering puts some offsets out of range; each needs its own
   remap). Do not "fix" these or flag them as missing.
6. **The antagonist is «Барлад Дэрт» (Barlad).** There is no "Bardush"/"Elgariol"/"Nautilus".

## What to audit (broadest scope — you have everything)
1. **Reachability re-verify** — the committed audit (`audit_cycles/reachability_audit_june_2026/`)
   says 1205/1221 reachable over choices + riddle `valid_targets`/`fail_target`; 16 documented
   Tier B/C islands remain. Reproduce it; look for anything missed (a `choice.target` to a
   nonexistent ¶; a paragraph reachable only via a broken mechanic; a genuine orphan among the 16).
2. **Combat/luck/spell end-to-end** — trace 3–4 representative fights in the engine (incl. §532
   wound_2, the §436 spider script, a summon side-fight): damage, luck decrement, spell-budget
   decrement, flee −2, `post_combat` gating. Confirm the summon is a distinct actor, not a Copy.
3. **Item lifecycle** — every `inventory_condition` has a reachable grant across the SIX
   mechanisms (fact #4); `consume_on_use` present where canon consumes the item.
4. **Economy & softlocks** — gold sources/sinks; no all-gated-no-escape paragraphs.
5. **Save/state** — `normalizeSave` backfills every persistent flag the engine reads (incl.
   `summonsUsed`) so an old save can't crash a new build.

## Method & output (this feeds an automated verifier)
- **Every finding needs a Russian canon quote** (paragraph N) as evidence.
- Output a numbered list. Each finding: **severity (P0 crash/softlock · P1 broken mechanic ·
  P2 notable · P3 design-note)**, **paragraph number(s)**, what the data/engine does now, what
  canon/good design requires, and the **short Russian quote**.
- If something is not determinable from the provided sources, write **"not determinable from
  provided files"** — never guess.
- Do NOT re-flag closed work — see `closed_work_digest.md` (and the full ledger
  `assets/text_corrections.json` on GitHub). End with a count of P0/P1/P2/P3 and your single
  highest-confidence finding.

## If you DO find a verified bug
Apply the project workflow: canon-verify → Node harness → record in `text_corrections.json` as a
new group → **leave the `git push` to Yuriy**. But for THIS pass, default to reporting; only edit
on explicit go-ahead.
