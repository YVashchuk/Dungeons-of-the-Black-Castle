# Session handoff — research-report re-audit (2026-06-02)

**Status:** updated 2026-06-02 after the F-1 commit, report archival, and the §132 shop core. This reflects the **final** state of the session's committed work; the remaining items are architecture/design tasks awaiting Yuriy's direction (see deferred queue).

**Cycle:** ChatGPT (2 reports) + Claude (2 diagnostic audits) + Gemini (1 visual/spatial audit), re-audited through the **canon → code → Node-harness** funnel.
**Registry:** `assets/text_corrections.json` v2.50, `group_31_research_reports_item_spell_chains_2026_06_02`.
**Engine change this cycle:** one — the **F-1 luck-cap** in `src/game_logic.js` (committed `766e0d8`). All other fixes are data-only in `src/remake_data.js`.
**Push:** as of 2026-06-02, commits **through `d6fe11a` are pushed**. **Pending push:** `fd729ea` (§402/§614 spell_any) and the registry/handoff doc commit that records it. Yuriy pushes.

---

## What each provider's report turned out to be

- **ChatGPT — NOT confabulated.** Both reports leaned on `book_text.md` (whose `**Выборы:**` lists are stale), so the *risk* was high, but per-claim verification against the live `remake_data.js` confirmed real bugs in 9 clusters. Two Claude diagnostic audits the same day had reported "0 P0/P1/P2" — they were wrong *by omission*: they inspected only **structured** `inventory_condition` gates and per-paragraph data, and never looked at **text-only gates** (e.g. «Если у вас есть шкура лисы» in prose with both branches as plain choices) or **per-choice `spell:` tags**. That blind spot is exactly where the ChatGPT findings lived.
- **Claude — useful as a clean bill on the structured layer**, and its single P3 (F-1 luck-cap) is correct and now committed (`766e0d8`).
- **Gemini — no code-actionable bug.** Details under "Gemini verdict" below.

---

## Why the 2026-06-01 Claude diagnostic audits missed all of this (lessons for future briefs)

This matters for brief-writing, so it's worth being precise. The two Claude diagnostic audits (`AUDIT_2026-06-01_diagnostic.md` / `_FINAL.md`) were **not lazy** — they were rigorous *within their frame*: harness-grade Python over the live-parsed `GD`, a 200k-trial Monte-Carlo combat harness, exact-string gate↔grant matching, full BFS reachability, persistence/`auto_items`-key coverage. They concluded **0 P0/P1/P2**. ChatGPT then found 10+ real bugs in the same build. The gap was the **frame**, not the rigor.

**Root cause:** the Claude audits verified **structure** (does every `choice.target` resolve? is every paragraph reachable?) and **mechanism** (does the combat math hold? does the spell budget decrement? does the allowlist filter correctly?) — but never ran a **per-paragraph canon-vs-data diff at the choice/field level**. They implicitly assumed the data faithfully encodes the canon and then audited the *engine over that data*. A correct engine faithfully executing canon-divergent data yields a spotless mechanism audit and wrong gameplay.

Four concrete blind spots, each tied to findings above:

1. **Text-only conditions were invisible.** The audits enumerated only **structured** fields (`inventory_condition`, `spell:`). Items and gates expressed in **prose** — «Если у вас есть шкура лисы» / «Если у вас есть Оберег» / «Есть ли у вас Песочные часы?» — with the branches rendered as *plain choices* never entered the audit's item universe. So «Шкура лисы», «Оберег», «Песочные часы» were absent entirely, and the proud "28 gating item-names, every one has a grant, zero problem gates" was true **only within the structured subset**, which was incomplete. (→ §84/§496, §345/§1201, §506, §941/§749, §1078.)

2. **No canon-vs-choice diff** — in either direction. "Every target resolves" (no dangling) was checked; "the data's choices *match what canon says should be here*" was not. That misses **extra** choices (§511 stat-line «ВЫНОСЛИВОСТЬ — 10» parsed into a jump to §10 — §10 exists, so it passed the dangling check), **wrong** targets (§1078→634 instead of →249 — 634 exists), **wrong** tags (§283 tagged ILLUSION where canon says «заклятие Огня»), and **missing** choices/branches (§700's dropped FIRE→1188; §749's missing hourglass escape; §244's missing belt option). None of these is detectable structurally.

3. **Mechanism-verified ≠ data-verified.** For combat/spells the audits proved the *engine* is correct (Monte-Carlo win-rates, budget decrement, `combat_spells_allowed` filtering — they even cite the allowlist). They did **not** check the *data* is canon-faithful: which combats canon says forbid magic (R2-1: §58/§481/§617/§618/§742/§823/§994 all left at the all-3 default), which choice should carry which spell (§131/§980/§944/§951 untagged siblings). "The allowlist mechanism works" and "the allowlist values are right" are different claims; only the first was tested.

4. **Structural reachability ≠ semantic correctness.** BFS confirmed *which paragraphs* are reachable and validated the 54-orphan set as intentional. But node-level reachability says nothing about whether a reachable paragraph's **internal choices** are correct. §749 was "reachable" and looked like a normal leaf/ending — the audit had no signal that canon grants the hourglass-holder an escape there.

**Why ChatGPT caught them:** it started from the **canon prose** (reading `book_text.md` paragraph by paragraph) and asked, per paragraph, "does the data *do what this paragraph says*?" — which *is* the canon-vs-data diff. (Its own risk was the opposite: `book_text.md`'s machine `**Выборы:**` lists are stale, so it could have mis-stated the data's *current* choices. The findings held because its reading of the **prose** was sound — and we re-verified every one against live `remake_data.js`, not the stale lists.)

**Recommendations for the next brief** (make these explicit asks, not assumptions):
- Require a **per-paragraph canon↔data diff at the choice/field level**, not just structural integrity and not just mechanism correctness. For each §: do the data's choices (targets + labels + `spell:` tags + gates + `acquires`/`auto_items`) match the options, conditions, and effects the canon prose states — with **nothing extra and nothing missing**?
- Require **prose-level extraction**: grep the canon (and choice labels) for «Если (у вас )?есть …», «заклятие … (N)», «добавьте/вычтите … УДАЧУ/ВЫНОСЛИВОСТ…», and stat-lines («МАСТЕРСТВО — N» / «ВЫНОСЛИВОСТЬ — N») that may have been mis-parsed into choices. Build the item/condition universe from **prose**, then confirm each has the right structured encoding.
- Treat **"the engine is correct"** and **"the data is canon-faithful"** as **separate deliverables**, each independently verified. A clean Monte-Carlo / reachability / gate↔grant pass is necessary but **not** sufficient.
- When two sources disagree on a list (here: the combat-forbid set), **run an independent sweep AND union the sources** — in this cycle sweep#1 missed §58/§823/§994, ChatGPT missed §481; only the union was complete.

---

## Commits (this cycle — newest at bottom; see Push line for what's pushed)

| Commit | Finding | Source |
|---|---|---|
| `6f80089` | §511 — delete misparsed stat-line choice (`target:10` from the bear's "ВЫНОСЛИВОСТЬ — 10") | ChatGPT r1 #6 |
| `5436322` | §84/§496 — three-gifts: stop auto-granting the amulet on entry; grant the *chosen* gift (amulet via `acquires`, fox-skin via `auto_items`) | ChatGPT r1 #2 |
| `d52c1aa` | §575/§244 — Magic Belt: grant «Волшебный пояс» + `luck_add:1` on entry; move the §1148 mole-summon to the castle-sighting §244 (gated) | ChatGPT r1 #5 |
| `274d468` | §345/§1201 — gate the fox-skin "show as sample" bypass on «Шкура лисы» | ChatGPT r1 #2 (consumer) |
| `856aa1b` | §1078 — ship-badge: split into gated →249 (insertion scene) + ungated →634 fallback | ChatGPT r1 #4 |
| `11a0d81` | §941/§749 — hourglass: grant at §941, gate+consume the §749 escape →1122; non-holders hit the death overlay | ChatGPT r1 #3 |
| `6ec996b` | §283/§700 — FIRE hooks: retag §283→779 to FIRE; split the dropped FIRE→1188 branch back out of §700 | ChatGPT r2 #4 |
| `044b38a` | §506 + §388/§742/§411/§1210 — restore the never-granted «Оберег» (§506 werewolf loot) and gate the talisman/vessel/arrow bypasses | ChatGPT r1 #7 |
| `f8932e0` | §131/§980/§944/§951 — tag the untagged sibling spell-exits (LEVITATION / SWIMMING) | ChatGPT r2 #5 (single-spell subset) |
| `06118c2` | registry group_31 (v2.50) documenting all of the above + Gemini adjudication | — |
| `09f04d7` | this session handoff doc | — |
| `ee911c6` | archive the 5 original provider reports (incl. Gemini PDF) | — |
| `766e0d8` | **F-1** — engine luck-cap `Math.min(luckMax, luck+luck_add)` (`game_logic.js`) | Claude FINAL |
| `259cd85` | §132 — make the forest-trader shop functional (10 food purchases, §340 schema) | ChatGPT r1 #1 |
| `b5cdbc7` | close §132 in group_31 + finalize this handoff | — |
| `b6e0324` | **R2-1** — `combat_spells_allowed:[]` for 7 spell-forbidding combats (§58/§481/§617/§618/§742/§823/§994) | ChatGPT r2 R2-1 |
| `f3b4a98` | registry R2-1 close (v2.51) + "why Claude missed it" handoff section | — |
| `d6fe11a` | handoff: Gemini access-preflight lessons for future briefs | — |
| `fd729ea` | **§402/§614** — engine `spell_any:[ids]` + data; dual-spell single-destination crossings (closes R2-5) | ChatGPT r2 #5 |
| _(pending)_ | registry §402/§614 close (v2.52) + this handoff refresh | — |

**Whole-repo regression after all commits:** `node --check src/game_logic.js` OK; GD parses, 1221 paragraphs contiguous; **2167** choice edges, **0 dangling targets**; BFS reachability **54 → 53** unreachable (only delta: **§249 became reachable** via the §1078 retarget — no new orphan; §132's self-loop purchases added 10 edges and changed no reachability).

---

## Mechanics clarifications (answers to Yuriy's questions)

### Three-gifts (§84) — how "one of three" is enforced
It is **not** a multi-select combobox and it is **not** "pick one, others grey out in the backpack." The backpack UI has no such logic. The exclusivity is **structural / navigational**:

- §84 renders four ordinary choice buttons — amulet→511, belt→575, fox-skin→496, refuse→281.
- Clicking one **navigates you down that single branch** and grants only that branch's item (amulet via `acquires` on the §84→511 transition; belt/fox-skin via `auto_items` on entering §575/§496).
- The other gifts are simply the **roads not taken** — they are never rendered again.

**Proven safe against farming:** §84's only inbound is §415, and a forward-reachability scan shows that from every exit (§511/§575/§496/§281) you **cannot get back** to §84 or §415. So you physically cannot return to collect a second gift. (Backpack-full caveat: all three grants flow through `showInventoryModal`/`takeItem`, which respects the 7-slot cap, so a full bag can block a pickup — canon-consistent with «если есть лишнее место» elsewhere.)

### Spell-gated movement (§944/§951, also §131/§980) — gray-out behavior
Each spell option is an **independent button tagged `spell:"X"`**, rendered by `makeChoiceBtn` (`game_logic.js` ~997–1011):

- **0 charges of that spell → the button is disabled and greyed** (`opacity .35`, `cursor:not-allowed`, title "Заклятие недоступно", no navigation). Harness-confirmed: clicking a 0-charge spell choice does nothing and does not navigate.
- **≥1 charge → the button shows the remaining count `[N]`, and clicking it consumes one charge (`useSpell`) and navigates.**

So at §944 «либо Плавания (1217), либо Левитации (956)»: the two are separate buttons, each gated on *its own* spell. Have Swimming but not Levitation → Swimming active, Levitation greyed. Have neither → **both greyed** (exactly the "if you have no spells they must be greyed" requirement). You don't "pick one and the other greys" — you pick whichever spell you actually own; picking it navigates away, so the other is moot. Same pattern for §951 (1021 SWIMMING / 571 LEVITATION) and the LEVITATION exits at §131/§980.

**Still open (deliberately):** §402 and §614 phrase it as «Левитации **ИЛИ** Плавания» on a **single** destination — NOW CLOSED (commit `fd729ea`) via the new engine `spell_any:[ids]` field: the button is enabled if *either* listed spell has a charge and spends one from the first available, greyed if neither. (§449/§1003/§1066 route each spell to a distinct target and were already correct — untouched.)

---

## Gemini verdict (visual/spatial audit) — no code change

- **"map_module.js pathfinding may crash on nodes > index 1221" — FALSE for the real file.** The only integers >1221 in `src/map_module.js` (1290/1310/1360/1440/1600) are SVG **x-coordinates** and the 1600-px canvas **width**, not paragraph refs; paragraph-binding fields are all ≤1221. Same error-class as the rejected group_24 topology fabrication (reasoned a risk without reading the file).
- **"35 location nodes / 34 encounter markers" — stale.** Live `BC_MAP_DEF` has **40** `kind`-tagged location nodes (74 ids total). Gemini's density math is built on outdated counts.
- **Confirms** the «Барлад» antagonist name, the group_24 rejection, and the 107/56/132 art-coverage baseline — independent corroboration, no action.
- **Net-new value for Yuriy (not bugs):** 6 proposed colour-illustration candidates (§1, §10, §22, §105, §210, §1221) with dark-Slavic MJ prompts → Midjourney queue; and P3 map-UX ideas (nested transit nodes, dynamic junction highlight, desaturate-cleared encounters).

### Brief-improvement notes for the NEXT Gemini run (access pre-flight) — fold these into the Gemini provider brief next cycle
Yuriy's field observation (2026-06-02): a Gemini research run spent ~15 min, then reported it had **no access to the attached files**, and in the meantime produced **off-topic confabulations** ("Captain Nemo"-style tangents unrelated to the project). It appeared to treat the brief's *path strings* (e.g. `src/game_logic.js`) as something to "go find," never matched them to the actually-attached `game_logic.js`, and filled the void with invention. Yuriy now also uploads the whole `Dungeons-of-the-Black-Castle/` folder to **Google Drive** and adds it to the chat's sources before starting. Lessons to bake into the next Gemini brief (deliberately recorded HERE, not retro-edited into the dated 2026-05-29 brief):

1. **Mandatory access pre-flight (STEP 0, before any analysis).** Instruct Gemini to first open each expected source and **quote one verbatim Russian line from each** as proof of access (e.g. the opening of §1 from `book_text.md`). No quote ⇒ no access.
2. **Fail loud, don't confabulate.** If any source is unreadable, Gemini must **STOP and ask the human to re-share** (attachment or Drive) and name exactly which files it cannot see — a "can't see X, please re-share" reply is the *success* outcome; 15 min of analysis on unopened files is the failure.
3. **Match by bare filename + content, NOT the path string.** The brief lists repo paths (`src/…`, `assets/…`) only to show where files live; attachments/Drive expose them as `game_logic.js`, `book_text.md`, possibly under a `Dungeons-of-the-Black-Castle/` Drive folder. The `src/`/`assets/` prefix is not part of the name to search for. A file attached as `game_logic.js` **is** `src/game_logic.js`.
4. **State the real environment plainly:** Gemini has **no GitHub access and no disk access** — it must never claim to have "checked the repo/codebase." Every claim must trace to a file it actually opened ("no quote, no claim").
5. **Note the Google-Drive path** explicitly as the primary share channel, with bare filenames mapping 1:1 to the brief's repo paths.

(These are also the likely root cause of the earlier wholesale-confabulation incident — "Elgariol"/"Bardush", 428 illustrations: an audit run with no real file access defaults to invention. The access pre-flight attacks the cause, not just the symptom.)

---

## Deferred to Yuriy (design / architecture — intentionally NOT auto-committed)

1. **§132 shop SUB-FEATURES** — the shop **core is now DONE** (commit `259cd85`: 10 food purchases mirroring §340, harness 9/9). Food is `grants_stamina` (eat-on-the-spot, repeatable) because **no eat-from-inventory action exists** in the engine — `grants_items` food would be permanent dead weight (§340 has the same limitation). Still NOT implemented, each needing net-new engine mechanism: the 7-gold **9-slot bag upgrade**, the **flask refill** (4g full / 2g half / free water), and **«взять с собой» carried food**. Engine work for a future cycle.
2. **§950 HEALING** — canon «заклятие Силы и Исцеления», but HEALING is HUD-only and barred from combat ("но не во время сражения"); the combat modal only renders COPY/FORCE/WEAKNESS. Stop-list records §950=[FORCE] as intentional. Architecture decision.
3. **R2-3 pre-cast combat buffs** — §308/§667/§655/§470 say «прибавьте/вычтите 2 … и сражайтесь» then route into a combat, but the ±2 only applies via the in-combat modal buttons (group_19). A naive `pending_combat_mod` risks **double-application** (bridge buff + modal button). Architecture decision.
4. **§402 / §614 dual-spell** — CLOSED 2026-06-02 (commit `fd729ea`) via the new engine `spell_any:[ids]` field. (Was deferred as needing an engine extension; done. Closes ChatGPT R2-5 entirely.)
5. **§340 dead-weight items** (Попона, Золотая устрица) — no downstream consumer found; possible gold-traps. P3 balance note (canon sells them as «могут пригодиться», so not a bug).
6. **Spell rebalance** — ILLUSION sparse, HEALING low-count; a character-creation hint would help. P3 design.

**Now CLOSED (were flagged-not-closed in earlier passes):** **R2-1** spell-forbidding combats — done, commit `b6e0324` (7 paragraphs). The narrower **partial-permissive** allowlist tightening (combats that name only SOME spells but show all 3 modal buttons) remains a separate P3 sweep for a future cycle.

---

## Reproduction / tooling notes

- All data edits used a per-paragraph reserialize-and-splice helper (compact separators `,`/`:`, byte-exact round-trip; whole-file re-parse + "only this paragraph changed" guard). Never hand-edit the single-line `remake_data.js`.
- Behavioural proofs used a **stubbed-DOM Node harness** that appends the test program *inside* the engine's eval scope (so `S` is the engine's `S`). Two gotchas learned: (a) the DOM stub's `innerHTML=''` must clear `_children` or choice-button counts accumulate across tests; (b) `auto_items.items` grants via `showInventoryModal` → the player's "Взять" (`takeItem`) deposits the item — a harness must simulate that click, it is not auto-pushed.
- Per-cluster harness results: hourglass **15/15**, Оберег+bypass **10/10**, spell-gating **8/8**, combined item-grant **15/15**.

---

## Report files in this folder

The original provider reports (Yuriy's attachments) belong here for provenance:
- `deep-research-report_1.md` — ChatGPT item-chain audit
- `deep-research-report_2.md` — ChatGPT spell-usage audit
- `AUDIT_2026-06-01_diagnostic.md` — Claude diagnostic (draft)
- `AUDIT_2026-06-01_diagnostic_FINAL.md` — Claude diagnostic (final, + Monte-Carlo)
- `Gamebook_Audit__Art_Coverage___Map.pdf` — Gemini visual/spatial audit
