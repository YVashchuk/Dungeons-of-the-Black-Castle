# BRIEF — FULL PROJECT AUDIT for ChatGPT 6 Astra (recheck cycle 2026-09, fourth auditor)
## Chat 1: repository archive + code execution · Chat 2: agent with a browser on the public build

**Audited state:** branch `main` at the commit named in your archive's root folder (`Dungeons-of-the-Black-Castle-<hash>`), registry **v2.167** (last `version_history` key `v2.166 -> v2.167`). The previous cycle briefs are in the archive and still define the vocabulary: `audit_cycles/recheck_2026_09/BRIEF.md` (blocks U1–U9 / V / X / G2 / R), `BRIEF_chatgpt_third_auditor.md` (archive pre-flight, execution rules), `SMOKE_BRIEF_chatgpt.md` (UI glossary, smoke rows). Read those three first; this brief adds what they lack.

**What happened before you (read `REGISTRY_EXCERPT_v2.md`, then the newer groups directly in `assets/text_corrections.json`):** three auditors (Gemini, Claude, ChatGPT 5.6 Sol) and two live runs (an automated Playwright smoke + a ChatGPT agent smoke) closed groups 81–84 — 70 items. The most important lesson is **PT-01 (group_83)**: the first automated end-to-end playthrough reached the victory paragraph 1220 in 71 steps **without waking the Princess**, because sec.81 «Если уже удалось разбудить Принцессу, то 1220» and sec.627/976 «если он мертв, то 1220» were modelled as unconditioned choices. All three auditors had missed it: their canon reverse searches looked for *items* the player must hold, not for *story state* («если уже…», «если вы…», «если вам удалось…»). Story flags now exist (`princess_awake`, `barlad_dead`, granted through `auto_items.flags`, gated by `inventory_condition` / the new negative `inventory_missing`). Your first job is to find every other sentence of that kind.

**Rules (both chats).** Accuracy guard as in `BRIEF.md` §1: every claim quotes the archive verbatim or is marked "not determinable"; label claims *verified by code reading* / *verified by execution* / *suspected*. No web use except the game URL in Chat 2. Do not modify the archive; write scratch files outside it. A report that fails its pre-flight or invents a quotation is discarded whole.

---

## CHAT 1 — archive audit (code execution on)

### Pre-flight (opens the report)
Archive root name + file count; `node --version`, `python3 --version`; `node tests/run_all.js` from the root — final line must be `BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)`, quote the `p1_6d_harness.js` (expected 64) and `_dist_ui_check.js` (expected 55) lines; last `version_history` key `v2.166 -> v2.167`; `pending_corrections.group_84_2026_09_05_agent_smoke` has 11 items (10 DONE, `SA-02` OPEN); first sentence of paragraph 1 in `assets/book_text.md`; 1221 keys parsed from `GD`; SHA-256 manifest of the extracted tree before and after your work (must be identical). Stop on any mismatch.

### Block S — story-state gates (priority 1, the new block)
Goal: a complete inventory of **conditional sentences in the canon that depend on what the player has done or seen**, each mapped to the engine's gate or flagged as unmodelled.
1. Parse `assets/book_text.md` paragraph by paragraph (`### §N` headings; ignore the stale `**Выборы:**` machine lists). Extract every sentence containing a condition: patterns such as «Если вы уже…», «Если вам удалось…», «Если вы (не) …», «Если у вас (есть|нет)…», «если … то N», «если же нет», «Если … победили/убили/разбудили/видели/были/знаете/прочли/слышали/получили/потеряли…», «Только если…», «В противном случае». Expect several hundred candidates; report the count and your regex set.
2. Classify each: (a) item possession (→ `inventory_condition` / `inventory_missing` / `gold_condition` / `gold_cost` in `src/game_structure.js`), (b) combat outcome (→ `combat_condition`, `post_combat`, scripts), (c) luck / dice, (d) **story state** — a deed, a visit, a piece of knowledge, a promise, a character alive or dead, a previous choice (→ story flags `STORY_FLAGS` in `src/game_logic.js` and `auto_items.flags`, or the six knowledge flags of `src/registries/items.json` such as `mirror_secret`, `throne_lore`), (e) narrative-only (no branch depends on it).
3. For every class-(d) sentence with a branch: verify the engine gates it. Deliverable: a table `§ | quote | class | engine gate (field + value) | status: MODELLED / UNMODELLED / PARTIAL | consequence if unmodelled (e.g. victory / item / death reachable without the deed)`. Every UNMODELLED row with a consequence is a finding (P0 if it changes victory or death, P1 if it changes items / stats / routes, P2 otherwise). Suggest the minimal data fix in the PT-01 pattern (flag granted where the deed happens, gate where the canon checks it, `inventory_missing` for the negative branch).
4. Reachability sanity: with the game graph and the gates you found, state which paragraphs become unreachable if the unmodelled gates were enforced (use `tests/verify_reach3.py` as a starting point; do not assert 1205 blindly).

### Block M — mechanics and canon (priority 2)
Verify the group_83 and group_84 engine resolutions against canon and code (registry items with their `resolution` text = the spec). Then the interaction census of `BRIEF_chatgpt_third_auditor.md` §4 on the current code (stack / sheets / flags / bridge buffs bound to their fight / luck persistence / dice persistence / purchases). Battery census at your state: paragraphs 1221 · edges 2218 · auto_items **182** · inventory_condition **134** · inventory_missing **2** · items.json **107** (food 20 / weapon 3 / item 76 / flag 8) · combat 76/120/24 · spell hooks 100+3 · gold_cost 59 · purchase 36 · ui keys 334×4 · 6d 64 · dist_ui 55 · reachable 1205.

### Block I — internationalisation (priority 3, includes a deliverable)
`SA-02` is OPEN: item names are Russian in EN/FR/UK (`itemName()` resolves through `SLUG_TO_RU` only). **Deliver `ITEM_NAMES_TRANSLATION.json`**: for all 107 slugs of `src/registries/items.json` an object `{slug: {en, fr, uk}}` — noun phrases in the register of each locale's existing UI strings (`src/locale.en.js`, `locale.fr.js`, `locale.uk.js`), French with proper typography (apostrophes ’, no double spaces), Ukrainian with correct case; keep proper nouns (e.g. «Смерть Орков» → "Death of Orcs" / « Mort des Orcs » / «Смерть Орків»). Also check that every `t()` key used in `game_logic.js` / `map_module.js` / the shell exists in all four locales (334 × 4) and that FR punctuation rules hold for every string (NNBSP before ?!;, NBSP before :).

### Block U — UI / accessibility (priority 4)
U1–U9 of `BRIEF.md` on the current shell/CSS/engine, verifying the group_84 UI resolutions (dock inside `.main`, riddle row, `inert` log panel, controller-owned phone log focus, nested dialog focus, picker refocus). Executed DOM-stub probes welcome; no browser claims.

### Block D — data, docs, tests, repository hygiene (priority 5)
`GAME_RULES.md` vs code (each numbered section spot-checked), `README.md` / `QUICKSTART.md` for a newcomer (public repo since 2026-09-04), test coverage gaps (which engine functions have no harness — name the ten most consequential), files that should not be in a public repository (personal data, tokens, absolute paths, large binaries), presence/absence of a code LICENSE and of attribution for the book text.

### Report (Chat 1): `REPORT_astra_archive.md`
Sections: PRE-FLIGHT · VERIFIED-OK (volumes per block) · FINDINGS (table `id AS-01… | block | severity | §§ / keys | evidence | minimal fix`) · STORY-STATE TABLE (Block S, complete, may be an attached CSV) · ITEM_NAMES_TRANSLATION.json (Block I) · COUNTS · NOT-CHECKED. Offer every file for download and print the report in the chat.

---

## CHAT 2 — agent with a browser on the public build

URL: `https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html` (stay on it and its `#N` anchors). Read `SMOKE_BRIEF_chatgpt.md` §1–§3 for the interface and hash entry. Two tasks:

1. **Playthrough as a reader** from the title screen (create a hero, roll the dice): reach paragraph 1220 having **both** woken the Princess and defeated Barlad Dert. Read every paragraph; log the route (numbers), your stats over time, every fight/luck/dice outcome, and every place where the text and the interface disagree (missing choice, item the story says you carry, stat change not applied, oddly behaving fight or luck check, broken art/layout, typo) — with the paragraph number, a quote and a screenshot. If you die, restart from the menu and take another route. Note explicitly whether the game ever offered you «→ 1220» before both deeds were done (it must not).
2. **Smoke rows not yet covered by automation:** A6, A7, A8, A9, A11 (§801/§1140/§724), A16 (§655/§470), A17, B4, and C12 in a fresh private session (unlucky branch at §436 → Force → back → F5). Mark BLOCKED with the reason where your environment cannot do it (phone widths, layouts).

Report: `REPORT_astra_live.md` — route + outcome, anomalies table, smoke verdict table in the `SMOKE_BRIEF_chatgpt.md` §7 format, screenshots.
