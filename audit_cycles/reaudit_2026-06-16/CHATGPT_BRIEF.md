# ChatGPT Re-Audit Brief — Dungeons of the Black Castle (2026-06-16)

You are auditing a digital adaptation of D. Braslavsky's 1991 **Russian-language** gamebook
*«Подземелья Чёрного замка»* (1221 paragraphs, victory §1220). **Diagnostic only — produce a
report, do NOT edit anything.** A Claude session will verify your findings before any change.

## Run mode (important)
**Do NOT use Deep Research / autonomous web-browsing mode.** This is a *closed-corpus*
audit — everything you need is the project's own files. Web browsing would pull in
unrelated gamebook info and has previously produced confabulations (an external
"topology" PDF invented metrics; an earlier Gemini invented characters). Use your
**strongest reasoning / extended-thinking mode reading ONLY the provided sources.**

## How to access the project — GitHub
Repo: `https://github.com/YVashchuk/Dungeons-of-the-Black-Castle` (read the latest `main`).
Read, in priority order:
1. `assets/book_text.md` — full Russian text + corrections-log header. **Use as your text
   source** so you don't re-flag already-fixed typos/dead-ends/loops. ⚠ Ignore its per-paragraph
   `**Выборы:**` machine-lists (stale export); for current wiring trust `src/remake_data.js`.
2. `assets/text_corrections.json` — the authoritative registry (**v2.92, 63 groups**). **Read
   `version_history` + the group entries FIRST** so you don't re-flag closed work.
3. `src/remake_data.js` — the actual game data (`const GD = {...}`, ONE long line — parse it,
   don't grep). Source of truth for choices/enemies/gold/items/conditions.
4. `src/game_logic.js` — the engine (combat, luck, spells, summons, post_combat, shop, riddle).
Skip the base64 art files (`src/mj_art.js`, `src/illustrations.js`) — not needed for balance/logic.
If your reader truncates the 1 MB `remake_data.js`, say so and work from `book_text.md` +
targeted reads rather than guessing.

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

## What to audit (your focus: balance + logic — you have the full code)
1. **Economy** — gold sources vs sinks across the book (shop §340, start 15 gold). Dominant
   strategy? Gold starvation? Any softlock where all visible exits are gold-gated with no escape?
2. **Combat balance & correctness** — damage outliers vs canon («вычитайте не 2, а N»); the
   `combat_condition:"wound_2"` Dragon at §532; multi-enemy handling; the summon side-fights
   (fact #1 — they are NOT Copy). Flag divergences from canon.
3. **Spell economy** — 8 spells, budget chosen at start. Re-value each by how many paragraphs
   use it; flag must-pick or dead-weight (mark P3 design-notes).
4. **Item/state gating** — choices that consume/require an item but miss
   `inventory_condition`/`consume_on_use`; narrative grants missing across the SIX mechanisms
   (fact #4); post_combat-bypass risks (fact #3).
5. **Link integrity** — any `choice.target` to a wrong/nonexistent paragraph. (Note: §416 body
   "1366" and §849 "1830" are known cosmetic FB2 typos; the choices route correctly — don't re-flag.)

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

