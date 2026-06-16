# Gemini Re-Audit Brief — Dungeons of the Black Castle (2026-06-16)

You are auditing a digital adaptation of D. Braslavsky's 1991 **Russian-language** gamebook
*«Подземелья Чёрного замка»* (1221 paragraphs, victory §1220). **Diagnostic only — produce a
report, do NOT edit anything.** A Claude session will verify your findings against canon+code
before any change.

## Run mode (important)
**Do NOT use Deep Research / autonomous web-browsing mode.** This is a *closed-corpus*
audit — everything you need is the project's own files. Web browsing would pull in
unrelated gamebook info and has previously produced confabulations (an external
"topology" PDF invented metrics; an earlier Gemini invented characters). Use your
**strongest reasoning / extended-thinking mode reading ONLY the provided sources.**

## ⚠ Use ONLY the files in THIS folder (the pre-extracted pack)
Your file reader silently truncates the project's real `remake_data.js` (one ~1 MB line) and
`mj_art.js` (~6.9 MB base64) — that caused a confabulation last cycle. So you are given a
context-safe pack instead. **Do not ask for or infer beyond these files; if something isn't
here, say "not determinable from provided files".**

| File | What it is |
|---|---|
| `paragraphs_0001-0300.jsonl` … `0901-1221.jsonl` | Every paragraph: full Russian `text`, `choices` (target+label+gating flags: inventory_condition/consume_on_use/gold_condition/post_combat/luck_type/combat_condition/acquires/…), `enemies`, `grants` (all 6 mechanisms), `riddle`. **This is your canon source.** |
| `graph_facts.json` | Precomputed: reachability (1205/1221), the 16 unreachable (documented backlog), dangling (none), 76 combat paragraphs, 116 post_combat flags, terminals, edge model, registry version. |
| `combat_paragraphs.jsonl` | The 76 combat paragraphs with enemies, inbound edges, and pre/post-combat exits. |
| `art_coverage.txt` | paragraph→art-id for colour (MJ_MAP) and b/w (ILLUST_MAP). NO image bytes. |
| `closed_work_digest.md` | All 63 closed registry groups — do NOT re-flag these. |

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

## What to audit (your strengths: art coverage, map/UX, graph sanity — but verify everything against the shards)
1. **Art coverage** — using `art_coverage.txt` + paragraph text, find high-traffic paragraphs
   with NO art; rank by visibility; for the top 5–10 give §number, a one-line Russian scene
   description (from the text), and a ready Midjourney prompt (dark Slavic fantasy; end every
   prompt with `--ar 3:2 --stylize 250 --v 6`). Known already-queued: §449 two-headed dragon
   renders single-headed; §1003 stone-rats look organic; art25/art29 mapped to no paragraph.
2. **Graph sanity** — `graph_facts.json` says 1205/1221 reachable, 16 documented islands, 0
   dangling. Sanity-check against the shards; only raise something if a `choices.target` points
   to a paragraph id absent from the shards, or a combat paragraph has no inbound at all.
3. **Item obtainability** — for any choice with `inventory_condition`, confirm a grant exists
   somewhere across the SIX mechanisms (see fact #4). Flag genuine "gated but never granted".

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

