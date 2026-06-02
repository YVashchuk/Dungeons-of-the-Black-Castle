# Session handoff — research-report re-audit (2026-06-02)

**Cycle:** ChatGPT (2 reports) + Claude (2 diagnostic audits) + Gemini (1 visual/spatial audit), re-audited through the **canon → code → Node-harness** funnel.
**Registry:** `assets/text_corrections.json` v2.50, `group_31_research_reports_item_spell_chains_2026_06_02`.
**Engine change this cycle:** none. All 9 fixes are data-only in `src/remake_data.js`. The pre-existing **F-1 luck-cap** in `src/game_logic.js` is still **uncommitted** in the working tree (reserved for Yuriy).
**Push:** none performed. Yuriy pushes.

---

## What each provider's report turned out to be

- **ChatGPT — NOT confabulated.** Both reports leaned on `book_text.md` (whose `**Выборы:**` lists are stale), so the *risk* was high, but per-claim verification against the live `remake_data.js` confirmed real bugs in 9 clusters. Two Claude diagnostic audits the same day had reported "0 P0/P1/P2" — they were wrong *by omission*: they inspected only **structured** `inventory_condition` gates and per-paragraph data, and never looked at **text-only gates** (e.g. «Если у вас есть шкура лисы» in prose with both branches as plain choices) or **per-choice `spell:` tags**. That blind spot is exactly where the ChatGPT findings lived.
- **Claude — useful as a clean bill on the structured layer**, and its single P3 (F-1 luck-cap) is correct and applied (uncommitted).
- **Gemini — no code-actionable bug.** Details under "Gemini verdict" below.

---

## Commits (local; not pushed)

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

**Whole-repo regression after all commits:** `node --check src/game_logic.js` OK; GD parses, 1221 paragraphs contiguous; 2157 choice edges, **0 dangling targets**; BFS reachability **54 → 53** unreachable (only delta: **§249 became reachable** via the §1078 retarget — no new orphan).

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

**Still open (deliberately):** §402 and §614 phrase it as «Левитации **ИЛИ** Плавания» on a **single** destination. A choice can carry only one `spell:` id, so those need an engine `spell_any:[…]` extension — deferred (see below).

---

## Gemini verdict (visual/spatial audit) — no code change

- **"map_module.js pathfinding may crash on nodes > index 1221" — FALSE for the real file.** The only integers >1221 in `src/map_module.js` (1290/1310/1360/1440/1600) are SVG **x-coordinates** and the 1600-px canvas **width**, not paragraph refs; paragraph-binding fields are all ≤1221. Same error-class as the rejected group_24 topology fabrication (reasoned a risk without reading the file).
- **"35 location nodes / 34 encounter markers" — stale.** Live `BC_MAP_DEF` has **40** `kind`-tagged location nodes (74 ids total). Gemini's density math is built on outdated counts.
- **Confirms** the «Барлад» antagonist name, the group_24 rejection, and the 107/56/132 art-coverage baseline — independent corroboration, no action.
- **Net-new value for Yuriy (not bugs):** 6 proposed colour-illustration candidates (§1, §10, §22, §105, §210, §1221) with dark-Slavic MJ prompts → Midjourney queue; and P3 map-UX ideas (nested transit nodes, dynamic junction highlight, desaturate-cleared encounters).

---

## Deferred to Yuriy (design / architecture — intentionally NOT auto-committed)

1. **§132 forest-trader shop** — genuinely non-functional (live GD has only «Уйти 354» / «Поговорить 314», no purchase mechanism) although canon describes a full priced merchant ending «…Если вы что-то хотите купить — покупайте», and §63 promises post-kill access («Загляните ещё раз в параграф 132»). **Verified real in live data — not a stale-`book_text.md` artifact.** Needs a decision: do food buys grant carried items or heal on the spot? The food core can mirror §340's `purchase:true` schema, but the 7-gold **9-slot bag upgrade** and the **flask refill** (4g full / 2g half / free water) have **no engine mechanism** — those need engine work. Highest-value finding; held for your call on scope.
2. **§950 HEALING** — canon «заклятие Силы и Исцеления», but HEALING is HUD-only and barred from combat ("но не во время сражения"); the combat modal only renders COPY/FORCE/WEAKNESS. Stop-list records §950=[FORCE] as intentional. Architecture decision.
3. **R2-3 pre-cast combat buffs** — §308/§667/§655/§470 say «прибавьте/вычтите 2 … и сражайтесь» then route into a combat, but the ±2 only applies via the in-combat modal buttons (group_19). A naive `pending_combat_mod` risks **double-application** (bridge buff + modal button). Architecture decision.
4. **§402 / §614 dual-spell** — single choice can't carry two spell ids; needs engine `spell_any:[…]`.
5. **§340 dead-weight items** (Попона, Золотая устрица) — no downstream consumer found; possible gold-traps. P3 balance note (canon sells them as «могут пригодиться», so not a bug).
6. **Spell rebalance** — ILLUSION sparse, HEALING low-count; a character-creation hint would help. P3 design.

**Flagged but NOT closed:** **R2-1** — §58/§617/§823/§994 etc. canon-forbid spells but those combats aren't `combat_spells_allowed:[]`. Real faithfulness gap, but it's a per-paragraph sweep (canon-classify every spell-forbidding combat) best done as its own cycle.

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
