# BRIEF — Gemini 4 Carbon: independent full re-check (November 2026)

**Project.** «Подземелья Чёрного замка» (Dungeons of the Black Castle) — a browser remake of Dmitry Braslavsky's 1991 gamebook: 1,221 paragraphs, Russian canon, English / French / Ukrainian translations, a JavaScript engine with fights, luck tests, spells, items, riddles, dice mini-games and a map. **State under review:** commit `7fdf978` of `main`, registry `v2.207 -> v2.208` (`assets/text_corrections.json`). **Reviewer:** Gemini 4 Carbon in Google AI Studio. **Date:** November 2026.

## Why this review

The game is finished and heavily audited. More than a hundred adjudication groups are closed. In a real browser, everything passes: 17 harnesses and 6 build checks, 27 live smoke checks, 28 gate probes, 7 branch probes and 77 fidelity probes. An automated playthrough reaches the victory paragraph.

On 2 November Gemini 4 Argon swept all 1,221 paragraphs for one kind of defect: *the text promises something the engine does not do*. It reported 45 findings, and 40 were fixed. It also reviewed the engine (7 findings, all fixed).

Two weeks later a live auditor (ChatGPT 6.2 Astra) still found defects of classes that sweep had missed:
- dead ends that froze the screen instead of ending the adventure;
- an optional luck test that let the reader take the lucky branch without rolling;
- victory rewards handed out before the fight;
- a toll whose «pay four more» exit ignored the coin just paid on entering;
- a watermelon that exists in the bag in two forms, of which the pass accepted only one.

**Your job is to be the next independent pair of eyes.** Find what every earlier reviewer missed, and check that the repairs of the last three weeks broke nothing. A short report with three real defects is worth more than a long one with thirty doubtful ones.

## 0. How the work is organised

The review runs in separate chats, one track per chat, because each track needs different files:

| Track | Chat | Task | Bundle folder |
|---|---|---|---|
| 1 | one chat | Fidelity sweep: what every paragraph promises vs the data and the engine | `1_fidelity` |
| 2 | one chat | Engine, saved state and data integrity; documents vs code | `2_engine` |
| 3 | one chat per language | Translation check of EN, FR or UK against the Russian reference | `3_translation_en`, `3_translation_fr`, `3_translation_uk` |

The first message of each chat names the track. Read sections 0–4 (common to all tracks) and the section of your track. Ignore the other tracks.

**The bundle.**
- Every file is a plain-text copy of a repository file. It sits between a `##### BEGIN FILE …` line and an `##### END FILE …` line.
- Large files are split into parts. The BEGIN line says which part it is and which paragraphs it holds.
- `src/game_structure.js` and the `src/locale.*.js` files are reformatted for reading: one paragraph (or one key) per line. The data are identical to the repository files.
- Quote these files by key (`GD["730"].choices[1]`, `LOCALE_RU.p["389"].t`), not by line number.

## 1. Pre-flight — mandatory, before any analysis

1. List every uploaded file and quote its `##### END FILE …` line exactly. A file without its END line is truncated: **stop and name it.** An earlier reviewer analysed a data file that had been cut off half-way, and the whole report had to be discarded.
2. Quote exactly, for your track:
   - **Track 1:**
     - `LOCALE_RU.p["1141"].c` (all labels);
     - `GD["1221"]` in full;
     - the first sentence of `LOCALE_RU.p["1220"].t`;
     - the name of the last top-level `function` in `src/game_logic.js`;
     - the last line of `REGISTRY_DIGEST.md` before its END line.
   - **Track 2:**
     - the first 80 characters of the line that starts `function postCombatStats(`;
     - `GD["90"]` in full;
     - the name of the last top-level `function` in `src/game_logic.js`;
     - `ui.ui_btn_crossbow` in all four languages from the locale-maps file;
     - the last line of `REGISTRY_DIGEST.md` before its END line.
   - **Track 3:**
     - `p["1141"].c` and `p["1221"].c` in both `LOCALE_RU` and the locale under review;
     - the first sentence of `p["1220"].t` in both;
     - the last line of `REGISTRY_DIGEST.md` before its END line.
3. If any value cannot be quoted exactly, stop. Do not continue from memory or assumptions.

## 2. The game in one page

**Order of truth.** The canon is the Russian text the game shows (`LOCALE_RU`). It was verified against the FB2 of the remastered edition (1,221 paragraphs), with documented corrections from the 1991 edition, and then proofread.
- `assets/GAME_RULES.md` describes every mechanic and every deliberate deviation from the book.
- `REGISTRY_DIGEST.md` lists every adjudicated decision: one line per decision, with status, paragraphs, claim and resolution.

Do not use other editions, websites or your memory of the book.

**Paragraph data — `GD[N]` in `src/game_structure.js`.**

*Choices — `GD[N].choices[i]`*
- **Target and label.** `target` is the destination paragraph. The label `LOCALE_XX.p[N].c[i]` belongs to `choices[i]` by position. A choice is never deleted: `retired: true` keeps its slot and hides it.
- **Gates.** A choice whose gate fails is hidden.
  - `inventory_condition` — a slug; an array means ANY of them; `{all:[…]}` means ALL; `{item, count}` means at least `count` of that item.
  - `inventory_all` — all of them; `inventory_missing` — must NOT be held.
  - `gold_condition` — at least N gold.
  - `from_section` — only when arriving from paragraph N.
  - `only_after_unlucky` — only after a failed scripted luck test.
  - `food_offer` — needs any food; the smallest is given away.
- **Spell exits.**
  - `spell` / `spell_any` spend one charge on click. With no charge the button is shown **disabled**, not hidden.
  - `spell_gate` needs a charge of any listed spell but spends nothing. It guards the entry into a paragraph whose every exit is a spell.
  - `spell_choice` is a cosmetic marker that the engine never reads.
- **Effects on click.**
  - `acquires` — grants an item.
  - `consume_on_use` — a slug; an array removes every listed item; `{item, count}` removes `count` of that item; `{any:[…]}` removes the first listed item that is held.
  - `gold_cost`.
  - `combat_mod` — a buff or debuff carried into the next fight.
  - Shop: `purchase` with `grants_items` / `grants_food` / `grants_stamina` / `grants_bag_size` / `flask_fill`.
  - `pickup_batch` — one button collects several items.
  - `dice_bash` — the door-bashing mini-game.
  - `die_face` — the engine rolls one die and follows the matching face.
  - `flee` — fleeing a fight costs 2 STAMINA.
- **Fights and luck.**
  - `post_combat` — offered after the victory.
  - `combat_condition` — an exit available inside a fight.
  - `luck_type` — `lucky` or `unlucky`, the two branches of a luck test. An untagged choice in a luck paragraph is offered before the roll; example: the refusal at §1141.

*Paragraph fields*
- **`auto_items`** — applied on the first visit:
  - `items` — offered in the pick-up dialog; the reader may decline.
  - `food`, `equip`.
  - `flags` — hidden state flags, granted silently.
  - `gold`, `gold_sub`, `gold_zero`, `clear_inventory`.
  - `stamina_add/sub`, `skill_add/sub`, `luck_add/sub`.
  - `flask_fill`, `flask_zero`, `spells_zero`, `spell_grant`, `dragon_strength`.
- **Fights:**
  - `enemies[]` with `{name, skill, stamina, joins}`;
  - `combat_spells_allowed`, `combat_script` (scripted fights), `round_deadline`, `player_attack_mod`, `has_copy_spell`;
  - `post_combat_items` — trophies and victory effects given once, after the win: `items`, `gold`, `luck_add`, `luck_sub`.
- **Luck, riddles, dice, betting:**
  - `has_luck`;
  - `riddle` — the answer's letter sum leads on;
  - `dice_roll`, `dice_check`, `dice_loot`;
  - `set_stake`, `bet_payout`, `stake_picker`.
- **`fatal_when_stuck`** — if no usable exit is left (a disabled spell button counts as unusable), the adventure ends with this paragraph's own text.
- `scene` — cosmetic.

**Hidden flags.** The engine's `STORY_FLAGS` (16) and `KNOWLEDGE_FLAGS` (7) model the canon's «if you have already done / met / know X». The flag is granted where the event happens and checked where the canon asks. Story flags are never shown; knowledge is learned silently.

**Engine behaviour you need to know** (`src/game_logic.js`).

1. **`renderGame` runs in this order:**
   1. draw the choices, or the riddle / dice / picker widget;
   2. apply the first-visit `auto_items`;
   3. apply the betting stake;
   4. if those effects changed gold, the bag or spells, draw the choices again;
   5. death if STAMINA ≤ 0;
   6. victory at §1220 (it needs both feats: the princess awake and Barlad Dert dead);
   7. the dead-end rule: no visible choice means death, except for fights, luck tests, riddles, dice and pickers.
2. **Fights.** A paragraph with enemies shows «Вступить в бой» and its pre-fight choices. The `post_combat` choices and the `post_combat_items` appear after the win.
3. **Luck test.** The roll costs 1 LUCK; it succeeds if 2d6 ≤ LUCK. Seven one-sided paragraphs (203, 289, 377, 418, 421, 436, 1186) end the adventure on failure.
4. **Dialogs.** Pick-up, fight, luck test, death and menu dialogs are modal: nothing behind them can be reached while one is open.
5. **Saves.** The game autosaves to `localStorage` (`podzch_v6`) after every change. Saves can be exported and imported as JSON. F5 restores the paragraph; a fight restarts from its beginning (documented).

The field counts are in Appendix A.

## 3. What is already settled — do not re-report

- **The digest.** Do not re-report anything in `REGISTRY_DIGEST.md` with status DONE, REJECTED, VERIFIED_RESOLVED or CONFIRMED. The exception: the current files contradict the recorded resolution. Then report it as `REGRESSION` and quote both the digest line and the current fact.
- **Calibration — these are NOT defects:**
  1. Numbers inside riddle prose (sums of letter positions). The riddle widget handles them (`GD[N].riddle`).
  2. The seven one-sided luck paragraphs. Their missing branch is a death (GAME_RULES 3.5).
  3. An honest «otherwise → N» is usually not gated: the reader chooses honestly. Report a missing gate only when the prose makes the route impossible or obligatory — «only if you have the key», «you cannot go back».
  4. The 1991 book's arithmetic items («add 40 to the paragraph number»). They are modelled as gated choices on the paragraph where the item is used (group_69).
  5. Food restores STAMINA from the bag. «Eat it now or keep it» is honoured by the pick-up dialog and its «eat now» button.
  6. Russian spelling and punctuation. The text was proofread (694 corrections).
  7. A fight is not persisted on reload, and the event journal keeps the language each line was written in. Both are documented.
  8. The 16 paragraphs that no route reaches, such as §736. They are vestiges of the original; the reachability baseline is 1,205. Report an unreachable paragraph only if a reachable route that should lead there is broken.
  9. Dialogs are modal, so the language cannot change while one is open (decisions GAME-05 and CHECK-01).
  10. §391 and §614 end the adventure when the hero has no way on. This is deliberate and documented.
  11. `spell_choice` is never read by the engine (decision AR-17c).
  12. Narration (text-to-speech), the shipped-but-unregistered PWA files, and the OpenAI key a reader may store in `localStorage` for narration. These are documented product decisions; report only a code defect in them.

## 4. Rules of evidence and delivery

- **Quotes.** Verbatim only; Russian prose up to 300 characters. Cite the file and the key or function. Give a line number only for `src/game_logic.js`, and only if you can count it reliably; otherwise quote the line.
- **Content of a finding.** Every finding states four things:
  - what the text (or the code) says;
  - what the data or engine does;
  - why that is wrong for a reader;
  - the smallest fix.
- **Inferences and confidence.** Mark every inference as one. «Could not verify» is better than a guess. Confidence is `high` when quoted evidence supports both sides, `medium` when one side is inferred.
- **The digest check.** Search the digest before reporting. Put what you found in `registry_checked`.
- **Scope.** No style comments, no refactoring, no new libraries, no web access.
- **Severity.**
  - `P0` — a reader can lose a winnable game, get stuck, crash, or corrupt a save.
  - `P1` — something the text promises is missing or wrong: an item, ability, stat change, condition, route, or the moment it applies. For translations: a mechanical fact changes.
  - `P2` — minor: label wording, cosmetic data, or a change of meaning with no mechanical effect.
- **Output budget.** Each answer has a limited output budget, and your thinking counts against it. Work in batches and never cut a finding in half.
  - In each answer, deliver the new findings as **one fenced ```json block** — an array, with ids continuing from the previous answer — followed by the coverage lines.
  - End every answer with exactly one of: `CONTINUE FROM §N` (or `CONTINUE FROM <area>`), or `TRACK COMPLETE`. On a continue, I will reply `continue`.
  - The final answer adds the report.

## 5. Track 1 — fidelity sweep

**Files:**
- `LOCALE_RU` (2 parts);
- `GD`;
- `src/game_logic.js`;
- `src/registries/items.json` — slug → `{legacyRu, kind}`, where kind is item, food, weapon or flag;
- `assets/GAME_RULES.md`;
- `REGISTRY_DIGEST.md`;
- `HANDOFF.md`.

**Method.**
- Go through paragraphs 1…1221 in order, in batches of 100 (1–100, 101–200, …, 1201–1221). Deliver **one batch per answer**: with high thinking, a larger answer can spend the whole output budget on thinking and show nothing.
- Keep your thinking on the current batch; the earlier batches are already delivered.
- For each paragraph, read the prose and the labels, and list for yourself every mechanical promise.
- Check each promise against `GD[N]`, and against the engine wherever the promise depends on it.
- After each batch, write one coverage line, for example: `batch 401–500: read 100/100, findings 2`.

**Classes.**
- `ITEM_NOT_GRANTED` — the prose gives an item, or lets the hero take one, and nothing grants it.
- `ITEM_NOT_CONSUMED` — the prose says the item is used up, given away, eaten, broken, burnt or left behind, yet it stays in the bag.
- `ITEM_EQUIVALENCE` — the canon names an object generically, but a gate accepts only one of the forms in which the hero can carry it.
- `STAT_NOT_APPLIED` — an unconditional change of STAMINA, SKILL, LUCK or gold in the prose has no counterpart in the data, or its sign or amount differs.
- `CONDITION_NOT_GATED` — «only if you have X / only if you know Y» has no matching gate, or the route is closed to the hero who meets the condition.
- `STATE_CONDITION_MISSING` — «if you have already…» has no hidden flag and gate.
- `OPTIONAL_NOT_OPTIONAL` — an action the text offers as optional («если хотите», «можете») is compulsory in the game, or the reverse.
- `TIMING_MISMATCH` — a reward, cost, loss or test applies at the wrong moment: on entry instead of after the victory or the choice, or before an entry effect that the paragraph's own gate should see.
- `DEAD_END` — every exit can be unusable (no spell charge, no item, no gold) while the paragraph neither ends the adventure nor offers another way. Also the reverse: the game ends where the text goes on.
- `ABILITY_NOT_IMPLEMENTED` — an item or event promises a special effect (a summon, an instant kill, protection, a one-time escape, a key for later) and the engine has no mechanism for it.
- `COMBAT_MISMATCH` — enemy names, count, SKILL or STAMINA differ from `GD[N].enemies`, or a special rule of the fight is missing.
- `SPELL_HOOK_MISSING` — a spell route spends no charge, or the wrong spell.
- `LUCK_MISMATCH` — a luck test in the prose and `has_luck` / `luck_type` do not match.
- `ROUTE_MISMATCH` — the prose offers a destination that no choice provides, or a choice leads somewhere the prose does not offer.
- `REGRESSION` — a recorded resolution no longer holds.
- `OTHER` — explain.

**What the previous sweep missed — hunt for more of these.** All the cases below are fixed already; look for others of the same shape.

1. **Dead ends.** At §93, §329, §521, §698, §935, §1133, §614 and §391 every exit needed a spell charge or an item. Without it, the screen froze instead of ending the adventure. These now carry `fatal_when_stuck`, and the entries §398 → §350 and §889 → §1066 got a `spell_gate`. Look for paragraphs and entries of the same shape that are still unprotected, including exits gated by gold or by «if you came from».
2. **Optional made compulsory.** §1141 says «можете ПРОВЕРИТЬ СВОЮ УДАЧУ. Если не хотите её проверять, вы автоматически считаетесь неудачливым» — and had no refusal, while both branches were plain buttons. Look for «если хотите», «можете», «по желанию» attached to luck tests, fights, payments and item use.
3. **Timing.** §1050, §1172 and §486 gave their victory rewards on entry, before the fight. §686 drew «кинуть ещё 4 золотых» before taking the coin the same paragraph throws in. Look for «если вы победили», «после боя», «если удалось», «заплатив…» where `auto_items` acts on entry. Also look for entry effects that change what the same paragraph's gates read.
4. **One object, several forms.** The watermelon of §389 is food («Арбуз», slug `melon`); the one of §300 is an item («Арбуз с бахчи», slug `watermelon`). The pass at §730 / §90 accepted only the second. Look for every gate that names one form of an object the canon names generically: whistles, keys, arrows, food, potions, valuables.
5. **Consumption.** At §720 the orcs eat the watermelon, but it stayed in the bag. Look for objects the prose gives away, eats, breaks, burns, trades or leaves behind with no `consume_on_use` or loss.

**Output.**
- `CARBON_FIDELITY_FINDINGS.json` — an array; one object per finding:
  ```json
  {"id":"C1-001","section":389,"class":"ITEM_EQUIVALENCE","prose_quote":"…verbatim Russian…","engine_fact":"GD[90].choices[1].inventory_condition: \"watermelon\"","expected":"…","proposed_fix":"…","severity":"P1","confidence":"high","registry_checked":"no matching id in the digest"}
  ```
- `CARBON_FIDELITY_REPORT.md`, with:
  - the pre-flight quotes;
  - the coverage table (13 batches);
  - counts per class and severity;
  - the twenty most consequential findings, one line each;
  - the places you were unsure about, with both readings.

## 6. Track 2 — engine, saved state and data integrity

**Files:**
- `src/game_logic.js`, `src/map_module.js`, `src/game_shell_top.html`, `src/mobile.css`, `src/illustrations.js`;
- `GD` and `src/registries/items.json`;
- the locale maps of all four languages — everything except the paragraphs: `ui`, `items`, `enemies`, `spells`, `allies`, `map`, `riddles`, `preface`, `pregame`;
- `assets/GAME_RULES.md`, `REGISTRY_DIGEST.md`, `HANDOFF.md`, `README.md`;
- `tests/smoke/README.md` — what the live probes already cover.

**A. Code changed since the last engine review — highest priority.** Read these first, as you would a fresh pull request:
- `saveGame` under try/catch; Escape in the pick-up dialog with a pending continuation; import through `normalizeSave`; markup stripped from typed item names and imported saves; narration rate and stop (fixes EN-01…EN-07).
- The `hashchange` listener: a new `#N` reloads the page.
- `relabelCombatUi` — the open fight follows a language switch: cards, round button, condition and scripted buttons, the healing button.
- `doLuckCheck` — the `live` / `liveLabel` labels, and the lazy prompt / success / failure texts of the scripted checks §21, §368, §436, §1175. Its «Конец приключения» button passes the paragraph to `showDeathOverlay`.
- `makeChoiceBtn` — the `spell_gate` branch.
- The `fatal_when_stuck` wrapper around `renderChoices` (near the top of the file).
- `renderGame`:
  - `gateStateKey` and `_gateSnap`, and the redraw after the entry effects;
  - `endedHere` — no pick-up offer under a death screen;
  - the STAMINA-death guard that keeps a dead end's own text.
- `postCombatStats` and the `post_combat_items` block in `renderChoices`.
- `applyChoiceConsume` — the `{any:[…]}` form.

**B. Engine robustness.**
- **Crashes in rare paths:** storage, `JSON.parse` of saves, missing DOM nodes, undefined `GD` fields, a fight or dialog opened twice.
- **State integrity:**
  - save, load and old-save migration;
  - F5 or a `#N` entry in the middle of a fight, luck roll, dice check, purchase, batch pickup or pick-up dialog;
  - double clicks before a re-render;
  - dialogs stacked over each other, and where the focus lands when one closes.
- **Async and timing:** narration tokens and the reused `Audio` element, `setTimeout` chains, map redraws.
- **Event handling:** listeners added on every render; closures that capture stale state.
- **i18n:** strings concatenated from fragments, plural forms, French spacing inside fragments.
- **Accessibility:** focus, `aria-live`, keyboard traps, Escape.
- **Performance on low-end phones:** full re-renders, ever-growing logs, large `innerHTML` writes.
- **Security:** `innerHTML` with locale or user-typed strings (the hero's name, riddle answers, item names); validation of imported saves.
- **Drift:** two code paths implementing the same rule differently.

**C. Data integrity.** Cross-checks that no single test may cover:
- **Items:** an item checked by a gate but never granted, or granted but never used (unless it is flavour); a gate whose item can only be obtained after the gated paragraph.
- **Flags:** set but never read, or read but never set.
- **Misplaced fields:**
  - `post_combat_items` on a paragraph without enemies;
  - `fatal_when_stuck` where an exit is always usable;
  - luck labels that contradict their `luck_type`;
  - `combat_spells_allowed` naming spells the engine does not know.
- **Enemy stats** that cannot be right.
- **Unused fields:** data fields the engine never reads (other than `spell_choice` and `scene`), and engine fields no data uses.

**D. Documents vs code.** Statements in `GAME_RULES.md`, `README.md` or `HANDOFF.md` that the code or data contradict: counts, behaviours, file names.

**Known and documented, not defects:**
- a fight is not persisted (F5 restarts it);
- the journal keeps each line's language;
- the PWA files are shipped but deliberately not registered;
- `tests/_static_scope_harness.js` already guarantees: no undeclared identifiers, no implicit globals, no dead top-level functions, no missing or unused interface keys.

**Output.**
- `CARBON_ENGINE_FINDINGS.json`:
  ```json
  {"id":"C2-001","area":"A","file":"src/game_logic.js","function":"renderGame","quote":"…verbatim line…","problem":"…","scenario":"exact steps a reader takes","impact":"…","proposed_patch":"minimal change","severity":"P1","confidence":"high","registry_checked":"…"}
  ```
- `CARBON_ENGINE_REPORT.md`, with:
  - method and coverage — which functions and areas you read;
  - counts;
  - the findings, ranked;
  - «looked at, found sound» for the areas with no findings.

## 7. Track 3 — translation check (one language per chat)

**Files:**
- `LOCALE_RU` (2 parts) and the locale under review (2 parts). Both are split at the same paragraph, so part 1 matches part 1;
- `TRANSLATION_GUIDE.md`;
- `src/registries/items.json`;
- `REGISTRY_DIGEST.md`.

**Context.** The translations were reviewed in September 2026 against the proofread Russian (3,808 corrections). Labels and interface strings added since then were translated by the maintainer, for example the refusal at §1141 and the combat, luck and map strings.

**Method.**
- Paragraphs 1…1221 in batches of 100, **one batch per answer**.
- Compare `p[N].t` and every `p[N].c[i]` with the Russian.
- Then compare `ui`, `items`, `enemies`, `spells`, `allies`, `map`, `riddles`, `preface` and `pregame`.
- Write one coverage line per batch.

**Classes.**
- `NUMBER_MISMATCH` — STAMINA, SKILL, LUCK, gold, counts or dice values differ.
- `REFERENCE_MISMATCH` — a paragraph number in the prose, or the «(N)» of a label, differs.
- `MISSING_TEXT` — a sentence or instruction is absent.
- `ADDED_TEXT` — an instruction or fact that the Russian does not have.
- `MEANING_CHANGED` — a mechanical instruction or a story fact is distorted: who, what, if / unless, must / may.
- `NAME_INCONSISTENT` — an item, enemy, spell or place name differs from the name maps or between paragraphs, so the reader would not recognise it where it matters.
- `UNTRANSLATED` — Russian left in the translation.
- `MARKUP` — HTML tags or entities are broken, or the emphasis on a game term is lost.
- `UI_STRING` — a missing or empty key, or a fragment that cannot be concatenated correctly.
- `OTHER` — explain.

**Calibration.**
- Literary freedom is fine.
- Follow the conventions of `TRANSLATION_GUIDE.md`: names, typography, French spaces before ; : ! ?, Ukrainian spelling.
- Do not report style, synonyms or punctuation.
- The Russian is the reference, even where it is clumsy.

**Severity.** P1 — a mechanical fact changes (numbers, references, names at a gate, a missing instruction). P2 — the meaning drifts with no mechanical effect. Do not report anything below P2.

**Output.**
- `CARBON_TRANSLATION_<LANG>_FINDINGS.json`:
  ```json
  {"id":"C3-EN-001","section":"1141","field":"c[2]","class":"MEANING_CHANGED","ru":"…","translation":"…","problem":"…","proposed_text":"…","severity":"P1","confidence":"high","registry_checked":"…"}
  ```
- `CARBON_TRANSLATION_<LANG>_REPORT.md`, with:
  - the pre-flight quotes;
  - coverage;
  - counts per class;
  - the findings, ranked;
  - the places you were unsure about.

## Appendix A — data census at `7fdf978`

- **Size:** 1,221 paragraphs; 2,224 choices.
- **Choice fields:** `inventory_condition` 154 · `post_combat` 115 · `spell_choice` 110 · `spell` 104 · `gold_cost` 59 · `consume_on_use` 50 · `purchase` 36 · `gold_condition` 34 · `luck_type` 33 · `die_face` 24 · `inventory_missing` 21 · `acquires` 15 · `combat_mod` 14 · `grants_stamina` 13 · `grants_food` 13 · `grants_items` 6 · `pickup_batch` 5 · `combat_condition` 4 · `retired` 4 · `inventory_all` 4 · `spell_any` 3 · `flask_fill` 3 · `flee` 3 · `from_section` 2 · `spell_gate` 2 · `only_after_unlucky` 2 · `food_offer` 2 · `grants_bag_size` 1 · `dice_bash` 1.
- **Paragraph fields:** `auto_items` 199 · `enemies` 77 · `combat_spells_allowed` 25 · `has_luck` 20 · `bet_payout` 18 · `player_attack_mod` 10 · `fatal_when_stuck` 9 · `post_combat_items` 8 · `riddle` 7 · `combat_script` 5 · `round_deadline` 4 · `set_stake` 4 · `dice_roll` 4 · `has_copy_spell` 1 · `dice_check` 1 · `dice_loot` 1 · `stake_picker` 1.
- **`auto_items` fields:** `items` 68 · `stamina_sub` 63 · `stamina_add` 27 · `flags` 17 · `gold` 11 · `luck_add` 9 · `skill_sub` 8 · `luck_sub` 6 · `gold_sub` 6 · `food` 4 · `flask_fill` 4 · `equip` 2 · `flask_zero` 1 · `spell_grant` 1 · `clear_inventory` 1 · `gold_zero` 1 · `spells_zero` 1 · `skill_add` 1 · `dragon_strength` 1.
- **Shapes:**
  - `inventory_condition`: string 145, array 6, `{item,count}` 2, `{all}` 1;
  - `consume_on_use`: string 46, `{item,count}` 2, array 1, `{any}` 1;
  - `post_combat_items` keys: `items` 7, `gold` 1, `luck_add` 1, `luck_sub` 1.
- **Locales:**
  - RU: `ui` 378, `items` 125, `enemies` 68, `map` 43, `spells` 9, `allies` 2;
  - EN / FR / UK: `ui` 378, `items` 111, `enemies` 68, `map` 43, `riddles` 7.
  - The 14 Russian-only item names belong to hidden flags that are never displayed.
- **Hidden flags:**
  - `KNOWLEDGE_FLAGS`: castle_password, mirror_secret, throne_lore, treasure_lore, fish_help, password_evenlo, secret_door;
  - `STORY_FLAGS`: princess_awake, barlad_dead, merchant_loot, hyena_met, bear_greeting, pegasus_friend, cliff_circled, vessel_silver_seen, vessel_glass_seen, chest_big_seen, chest_mid_seen, cupboard_seen, study_cupboard, study_door, study_maps, study_mirror.
