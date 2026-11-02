# BRIEF — Gemini 4 Argon: text-vs-engine fidelity sweep and engine robustness review

**Project:** «Подземелья Чёрного замка» (Dungeons of the Black Castle) — a browser remake of D. Braslavsky's 1991 gamebook (1,221 paragraphs, Russian canon, EN/FR/UK translations). **Date:** November 2026. **Registry state:** `v2.197 -> v2.198`.

You are reviewing a finished, heavily audited game. 100 adjudication groups are closed (the hundredth adjudicated your own fidelity sweep); a battery of 17 harnesses, 27 live smoke checks, 28 gate probes, 7 branch probes and an automated playthrough to the victory paragraph all pass. What is still possible — and what this review is for — is the defect only a reader who also reads the data can find: **the text promises something the engine does not do.** The last one, found in September 2026, was §127: the prose hands the hero a Golden Snake that can, once per journey, summon every snake of the forest to kill any enemy except Barlad Dert; neither the item nor the ability existed in the game data.

## Attached — one code folder (11 files)

| file | content |
|---|---|
| `BRIEF_code_review_gemini4.md` | this brief |
| `src/locale.ru.js` | `const LOCALE_RU = {...}` — the Russian text the game shows: `p[N].t` prose (simple HTML allowed), `p[N].c` choice labels (positional), `p[N].rfl` the riddle's "don't know" label, `ui` interface strings, `items` / `enemies` / `spells` / `allies` / `map` names, `preface`, `pregame` |
| `src/game_structure.js` | `const GD = {...}` — the game data for every paragraph (one long JSON line) |
| `src/game_logic.js` | the engine (≈3,540 lines) |
| `src/map_module.js` | the adventure map (SVG, three layers, fog of war) |
| `src/game_shell_top.html` | the HTML shell, CSS and static UI |
| `src/mobile.css` | phone layout |
| `src/registries/items.json` | item registry: slug → `{legacyRu, kind}` with kind ∈ item / food / weapon / flag |
| `assets/GAME_RULES.md` | the living description of every mechanic and of the **deliberate deviations** from the canon |
| `REGISTRY_DIGEST.md` | one line per adjudicated decision of `assets/text_corrections.json` (one line per decision + legacy entries) |
| `HANDOFF.md` | current project state |

## 0. Pre-flight — mandatory, before any analysis

Quote exactly — copy, do not paraphrase:

1. `src/locale.ru.js` — the first sentence of `LOCALE_RU.p["1"].t` and of `LOCALE_RU.p["1220"].t`; the number of keys in `LOCALE_RU.p` and in `LOCALE_RU.ui`.
2. `src/game_structure.js` — `GD["1221"]` in full; `GD["127"].auto_items`.
3. `src/game_logic.js` — the full line that starts `function useSnakeInCombat`, and the name of the **last** top-level `function` in the file.
4. `REGISTRY_DIGEST.md` — its last line.

If any of these cannot be quoted exactly, **stop** and say which file is truncated or missing. Do not continue from memory or assumptions: an earlier reviewer analysed a data file that had been cut off half-way and the whole report had to be discarded.

## 1. How the game is modelled

**Paragraph data `GD[N]`:**
- `choices[]` — `target` (paragraph number); gates: `inventory_condition` (slug or array = ANY), `inventory_all` (array = ALL), `inventory_missing` (must NOT hold), `from_section` (only when arriving from that paragraph), `gold_condition` (≥ N gold); effects on click: `acquires` (grant), `consume_on_use` (remove), `gold_cost`, `purchase` + `grants_items` / `grants_stamina` (shop), `pickup_batch` (one button collects several items, food can be eaten at once), `spell` / `spell_any` + `spell_choice` (spends a spell charge), `combat_mod` (pre-fight buff or debuff carried into the fight), `combat_condition` (an exit available inside a fight, e.g. `wound_2`), `post_combat` (offered after victory), `luck_type` (`lucky` / `unlucky` branch of a luck test), `dice_bash` (door bashing), `retired` (kept only so that positional labels stay aligned; never shown).
- Paragraph fields — `auto_items` applied on the first visit: `items` (slugs or `{food, stamina}`), `gold`, `gold_sub`, `stamina_add/sub`, `skill_add/sub`, `luck_add/sub`, `flags` (hidden state flags), `spell_grant`, `clear_inventory`, `gold_zero`; `enemies[]` `{name, skill, stamina, joins}` with `joins` = `{round:N}` / `{after_death:K}` / `{after_deaths:M}`; `round_deadline` `{rounds, win, lose, carry_enemy}`; `has_luck`; `riddle`; `dice_check`; `dice_loot`; `post_combat_items` (trophies given only after victory); `fatal_when_stuck`; `combat_spells_allowed`.
- **Hidden flags** (`STORY_FLAGS`, `KNOWLEDGE_FLAGS` in the engine) model the canon's "if you have already done / met X": a flag is granted where the event happens and checked where the canon asks.
- Labels `LOCALE_RU.p[N].c[i]` belong to `GD[N].choices[i]` by position. All 2,221 labels have already been machine-checked against their targets — do not re-check the `(N)` numbers.

**Where decisions live:** `assets/GAME_RULES.md` explains the mechanics and the deliberate deviations; `REGISTRY_DIGEST.md` lists every adjudicated decision. **Do not re-report anything the digest marks DONE, REJECTED or VERIFIED_RESOLVED** — unless the current files contradict the recorded resolution; then report it as `REGRESSION` and quote both.

## 2. Part 1 — fidelity sweep (the main task)

For every paragraph 1…1221, in order, in batches of 100 (1–100, 101–200, …, 1201–1221): read the Russian prose and labels, extract every **mechanical promise**, and check that `GD[N]` (and, where needed, the engine) keeps it.

**Classes**
- `ITEM_NOT_GRANTED` — the prose gives or lets the hero take an item, and nothing grants it (no `auto_items.items`, `acquires`, `pickup_batch`, `post_combat_items`, purchase).
- `ITEM_NOT_CONSUMED` — the prose says the item is used up, given away, lost or broken, and it stays in the bag.
- `STAT_NOT_APPLIED` — an unconditional change of stamina, skill, luck or gold in the prose has no counterpart in the data (or the sign or the amount differs).
- `CONDITION_NOT_GATED` — "only if you have X / only if you know Y" with no matching gate, so the route is open to everyone (or closed to the right hero).
- `STATE_CONDITION_MISSING` — "if you have already…" without a hidden flag and gate.
- `ABILITY_NOT_IMPLEMENTED` — an item or event that promises a special effect (a summon, an instant kill, protection, a one-time escape, a key that opens something later) and the engine has no mechanism for it. **This is the Golden Snake class — the most valuable finding.**
- `COMBAT_MISMATCH` — enemy names, count, SKILL or STAMINA in the prose differ from `GD[N].enemies`; a special rule ("after three rounds", "if he wounds you twice", "the second one joins when…", "spells will not help") is missing from `round_deadline` / `joins` / `combat_condition` / `combat_spells_allowed`.
- `SPELL_HOOK_MISSING` — the prose offers a route by a spell and the choice spends no charge (no `spell` / `spell_any`), or the spell named differs.
- `LUCK_MISMATCH` — the prose tests luck and `has_luck` / `luck_type` branches do not match.
- `ROUTE_MISMATCH` — the prose offers a destination that no choice provides, or a choice leads somewhere the prose does not offer.
- `REGRESSION` — a recorded resolution no longer holds.
- `OTHER` — anything else mechanical; explain.

**Calibration — these are NOT defects**
1. Numbers inside riddle prose (sums of letter positions) — handled by the riddle widget (`GD[N].riddle`).
2. The seven one-sided luck paragraphs 203, 289, 377, 418, 421, 436, 1186 — the missing branch is a death (GAME_RULES 3.5).
3. An honest "otherwise → N" is usually not gated — the reader chooses honestly. Report a missing gate only when the prose makes the route impossible or obligatory ("only if you have the key", "you cannot go back").
4. The 1991 book's arithmetic items ("add 40 to the paragraph number") are modelled as inventory-gated choices on the consumer paragraph (group_69) — do not report missing arithmetic.
5. Food and potions restore stamina from the bag; "eat it now or keep it" is honoured by the offer dialog and the eat-now button.
6. Russian spelling and punctuation are out of scope (proofread in September, 694 corrections).
7. Combat state is not persisted on reload; the event journal keeps the language of each entry — documented, not defects.

**Severity:** `P0` — the reader can lose a winnable game, get stuck, or crash; `P1` — an item, ability, stat change, condition or route promised by the text is missing or wrong; `P2` — minor (label wording against the prose, cosmetic data).

**Method:** read each batch completely; for every finding quote the Russian prose verbatim (≤ 300 characters) and state the data fact (`GD[N].auto_items: absent`, `GD[N].choices[2].inventory_condition: "rope"`, …); search the digest before reporting; after each batch write one coverage line (`batch 401–500: read 100/100, findings 3`). Never invent a paragraph you did not read; if you run out of space, stop at a batch boundary and say where to continue.

**Output of Part 1**
1. `FIDELITY_FINDINGS.json` — an array; one object per finding:
   ```json
   {"id":"F-001","section":127,"class":"ABILITY_NOT_IMPLEMENTED","prose_quote":"…verbatim Russian…","engine_fact":"GD[127].auto_items: absent","expected":"one-time summon that kills any enemy except Barlad Dert","proposed_fix":"items.json + golden_snake; GD[127].auto_items.items += ['golden_snake']; combat button …","severity":"P1","confidence":"high","registry_checked":"no matching id in the digest"}
   ```
2. `FIDELITY_REPORT.md` — the pre-flight quotes, the coverage table (12 batches), counts per class and severity, the twenty most consequential findings with one-line reasons, and a list of places you were unsure about (with both readings).

## 3. Part 2 — engine robustness review (after Part 1 is delivered)

Read `src/game_logic.js`, `src/map_module.js`, `src/game_shell_top.html` and `src/mobile.css` as a senior reviewer looking for defects that real players can hit:
- **Crashes in rare paths** — exceptions around storage, `JSON.parse` of saves, missing DOM nodes, undefined `GD` fields, a fight or dialog opened twice.
- **State integrity** — save/load (`localStorage`, key `podzch_v6`), old-save migration, F5 or a `#N` hash entry in the middle of a fight, luck roll, dice check, purchase or batch pickup; switching the language mid-fight or mid-dialog; rapid double clicks (re-entrancy before a re-render).
- **Async and timing** — narration (`bcSpeak*`, the token that cancels stale requests, the reused `Audio` element, `speechSynthesis`), `setTimeout` chains, map redraws.
- **Event handlers** — listeners added on every render, closures that capture stale state.
- **i18n** — strings concatenated from interface fragments, plural forms, French spacing inside fragments.
- **Accessibility** — focus after a dialog closes, `aria-live`, keyboard traps in overlays, Escape handling.
- **Performance on low-end phones** — full re-renders, ever-growing combat logs, large `innerHTML` writes.
- **Security and privacy** — `innerHTML` with locale or user-typed strings (hero name, riddle answers), the OpenAI API key kept in `localStorage`, validation of imported saves.
- **Drift** — two code paths implementing the same rule differently.

Known and documented, not defects: combat state is not persisted (F5 mid-fight restarts the paragraph); the journal keeps each entry's language; the PWA files (`sw.js`, manifest) are shipped but deliberately not registered; the static scope harness already guarantees no undeclared identifiers, no implicit globals, no dead top-level functions and no missing or unused interface keys.

**Output of Part 2**
1. `ENGINE_FINDINGS.json` — `{"id":"E-001","file":"src/game_logic.js","function":"…","quote":"…verbatim line…","problem":"…","scenario":"exact steps a player takes","impact":"…","proposed_patch":"minimal change","severity":"P0|P1|P2","confidence":"high|medium"}`
2. `ENGINE_REPORT.md` — method, coverage (which functions and areas you read), counts, the findings ranked, and "looked at, found sound" for the areas with no findings.

## 4. Rules
- Verbatim quotes only. Cite the file and the function; give a line number only if you can count it reliably, otherwise quote the line.
- Mark every inference as an inference; "could not verify" is better than a guess.
- No style comments, no refactoring proposals, no new libraries — minimal patches only.
- No web access is needed or wanted.
- Deliver each JSON in one fenced code block (and as a downloadable file if the interface offers it), then the report. If an answer would be too long, deliver per batch and name the exact continuation point.
