# Provider Brief — Claude Research/Diagnostic — 2026-06-04
## Full implementation-correctness re-audit of «Подземелья Чёрного замка» (remake)

## 0. Your role
You are running a **fresh, deep diagnostic audit** of a single-file HTML
gamebook engine — a faithful digital adaptation of **Д. Браславский,
«Подземелья Чёрного замка» (римейк / новая редакция)** — *Dungeons of the Black
Castle*. Author: **Дмитрий Браславский**; remake/new edition by **Александр
Морозов (2018)**, based on the 1st edition (1991). **1221 paragraphs; the
winning paragraph is §1220.** The game text and the whole project are in
**Russian**.

**Diagnostic pass — produce a report, do NOT commit code changes** unless the
human explicitly asks you to act on a verified finding. (You have the tools to
fix things; this round is about *finding* and *verifying*.) Your report will be
cross-checked by a separate Claude verification session before any commit.

**Focus of THIS cycle = implementation correctness** (NOT art, NOT audio). The
same *classes* of bug have been fixed several times and each pass still finds a
fresh instance — so this round must be **exhaustive** about whether the engine
faithfully implements every canon rule, including local rule-overrides, and about
gates/spells that live **only in the prose** and were never encoded. See §5.

---

## 1. Your environment & access — CONFIRM IT, don't ask about it
- You run in the **Claude Windows App** with **full local filesystem access via
  MCP** to the project folder:
  **`C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle`**
- You also have **GitHub access** to the private repo
  **`YVashchuk/Dungeons-of-the-Black-Castle`** (branch `main`).
- You can run **PowerShell** and **Python** locally, and **`node --check`** is
  available for syntax validation and behavioural harnesses.

**Previous sessions wasted turns asking the user "do you have the files?" instead
of just checking.** Do not do that: **open the folder yourself via MCP and
confirm access** (list `src/` and `assets/`, read one line of
`src/remake_data.js`). Only if that genuinely fails should you raise it. Because
you have the real files + code execution, **verify your own findings to the same
standard the downstream verifier would** — a finding you've already checked
against canon + a Node harness is worth ten unverified guesses.

### Files to read first (local path ↔ GitHub path — same files)
| Local (MCP) | GitHub | What it is |
|---|---|---|
| `assets\fb2_remake.fb2` | `assets/fb2_remake.fb2` | canonical Russian text, **final arbiter** (~904 KB) |
| `assets\book_text.md` | `assets/book_text.md` | 1:1 MD mirror of the FB2 prose, corrections applied (~904 KB) |
| `src\remake_data.js` | `src/remake_data.js` | actual game data `const GD={…}` — **source of truth** for wiring (~978 KB) |
| `src\game_logic.js` | `src/game_logic.js` | the engine (~114 KB) |
| `src\game_shell_top.html` | `src/game_shell_top.html` | UI shell incl. character-creation & rules screens (~51 KB) |
| `assets\text_corrections.json` | `assets/text_corrections.json` | the correction registry, **v2.59, 31 groups** (~255 KB) |

If you prefer to seed the chat with attachments, attach them by their **bare
names** (`game_logic.js`, `remake_data.js`, `book_text.md`, `text_corrections.json`)
— do **not** write the folder path next to an attachment (a prior run *ignored*
an attached `game_logic.js` because the message referred to it as
`\src\game_logic.js`). The bare attachment and the path above are the same file.

### Canon source note
- **`assets/fb2_remake.fb2` is identical to `assets/book_text.md`** (the `.md` is
  a 1:1 mirror of the FB2 **prose**, 1221 paragraphs, **corrections applied**).
  Good for fast text analysis; the FB2 is the final arbiter.
- ⚠ The per-paragraph **`**Выборы:**` machine-lists** in `book_text.md` are
  **STALE** — for current choice wiring use **`src/remake_data.js`**, not those
  lists.
- **Read `assets/text_corrections.json` first** (v2.59, 31 groups). Its
  `version_history` + every group entry enumerate all already-fixed and
  already-rejected items, including **already-corrected typos / spelling fixes**.
  Re-flagging something listed there is the #1 failure mode (see §6).

### Tooling notes (hard-won — saves hours)
- Read/grep Cyrillic via **Python `-X utf8` in a `.py` file**. Do NOT inline
  Cyrillic/regex in `python -c` from PowerShell, and do NOT `Select-String` the
  single-line JSON/data (both mangle Cyrillic).
- Parse data:
  `GD = json.loads(re.search(r'const\s+GD\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S).group(1))`.
- For a Node behavioural harness: stub the DOM, `eval` `remake_data.js` with
  `const GD`→`var GD`, stub `MJ_MAP/MJ_DATA/ILLUST_MAP={}`, then `eval`
  `game_logic.js`. `goTo()` **resets `sectionPrepState={}` every navigation** —
  mirror that. Persistent per-run flags live on `S` (backfilled in
  `normalizeSave`): `bagSize`, `pending_combat_buff`, `shopBought`,
  `riddle_attempts`, `sec436_force`.

---

## 2. Language rules
- **Write your entire report in English** — most precise for inter-session comms.
- **Keep every quoted game-text fragment, choice label, item name, spell name,
  and search string in the original Russian, verbatim** (e.g. `«Заплатить (562)»`,
  `«Золотой ключ»`, `«заклятие Копии»`). The verifier runs regex/substring search
  over the **Russian** source; English paraphrases won't match. The **game stays
  Russian**; English is only our working language.

---

## 3. THE GAME RULES — the verification baseline (quoted from the canon)
The rulebook the engine must implement faithfully (verbatim from the book's
preface/rules, before §1). Check the engine + data against each rule.

### 3.1 МАСТЕРСТВО / ВЫНОСЛИВОСТЬ / УДАЧА
> «Киньте один кубик. Добавьте 6 … — … МАСТЕРСТВО. Киньте оба кубика. Добавьте 12
> — … ВЫНОСЛИВОСТЬ. … Киньте кубик, прибавьте … 6 — … УДАЧА.»

Initial: **МАСТЕРСТВО 7–12** (1d6+6), **ВЫНОСЛИВОСТЬ 14–24** (2d6+12), **УДАЧА
7–12** (1d6+6). Verify `initState` / character creation.

### 3.2 Combat — БИТВЫ (7 actions) + multiple enemies
> «… Сумма отражает его СИЛУ УДАРА. … Если ваша СИЛА УДАРА больше … вам удается
> ранить его … Вычтите два из его ВЫНОСЛИВОСТИ. … Вычтите два из вашей
> ВЫНОСЛИВОСТИ … Если же они равны, то он парирует ваш удар … до тех пор, пока
> ВЫНОСЛИВОСТЬ … не станет равна нулю.»
> Multiple enemies: «… каждый, у кого СИЛА УДАРА будет больше вашей, ранит вас. Вы
> же можете ранить только вашего непосредственного противника …»
> Fleeing: «… в случае вашего бегства последний удар остается за врагом.»

Default per-hit **−2** (engine: `enemy.damage || 2`); equal = parry; flee = −2.

### 3.3 Luck — ПРОВЕРКА УДАЧИ
> «Вы кидаете два кубика. Если результат меньше или равен вашей УДАЧЕ … вы
> удачливы … Каждый раз … вы должны вычитать 1 из вашей УДАЧИ … вы не хотите …
> или ваша УДАЧА равна нулю, считайте, что вы неудачливы.»

**2d6 ≤ УДАЧА**; **−1 per test**; 0 / decline = unlucky.

### 3.4 Spells — 8 spells, budget of 10 one-time casts
> «… воспользоваться заклятиями только 10 раз … всего их должно быть не более
> десяти … каждое заклятие используется только один раз …»

**ЛЕВИТАЦИИ, ОГНЯ, ИЛЛЮЗИИ, СИЛЫ, СЛАБОСТИ, КОПИИ, ИСЦЕЛЕНИЯ, ПЛАВАНИЯ.**
СИЛА/СЛАБОСТЬ/КОПИЯ = in-combat modal (default in every fight); ИСЦЕЛЕНИЕ = +8
ВЫНОСЛИВОСТИ any time outside combat; ЛЕВИТАЦИЯ/ОГОНЬ/ПЛАВАНИЕ/ИЛЛЮЗИЯ =
navigation-cast. Every cast must decrement the remaining count.

### 3.5 IMPORTANT — spell use can change the ROUTE, not just the fight
A spell in a fight is sometimes a **navigation choice** (cast → a *different
paragraph*; there is a number after the spell name, e.g. `«заклятие Силы (286)»`),
not an in-fight cast. Such fights must **not** also offer that spell in the
in-combat modal (else double-cast / route bypass). This was just swept via
`combat_spells_allowed`; re-verify it and look for any fight still mixing the two.

### 3.6 Equipment — фляга / заплечный мешок / еда / золото
> «… 15 золотых … фляга … попить … дважды, каждый глоток вернет вам 2
> ВЫНОСЛИВОСТИ … в … мешок можно положить только 7 предметов … деньги и оружие …
> не кладутся … пищу … (она займет 1 место …) … восстановить … ВЫНОСЛИВОСТИ … (не
> во время боя).»

Start **15 gold**; flask **2×+2**; backpack **7** (gold/weapons free); food **1
slot**, heals when eaten (not in combat).

### 3.7 Backpack UPGRADE — §132 (forest merchant), stateful 7 → 9
> «… можете купить … заплечный мешок. Он стоит 7 золотых, но в него помещается
> больше чем в ваш: не 7, а 9 предметов … вы должны будете оставить его в доме у
> торговца.» (§132 also fills the flask 4 / 2 gold and sells food.)

Verify the cap is a **variable** (`getBagSize()` / `S.bagSize`) wherever checked,
not a hard-coded 7, and that `normalizeSave` backfills it.

### 3.8 The book LOCALLY OVERRIDES rules — verify each override is honoured
Canonical example **§240** (six snakes):
> «… при каждом ранении, нанесенном каждой змеей, вычитайте **не 2, а 3**
> ВЫНОСЛИВОСТИ, т. к. яд от их укусов действует не в вашу пользу.»

Correctly implemented via per-enemy **`damage:3`** (engine reads `enemy.damage ||
2`). **Verify this pattern book-wide** (poison/fire ticks, modified entry stamina,
modified luck/skill, «не 2, а N»). A rule-override that lives only in prose but
not in data is exactly the recurring bug class.

---

## 4. Scope — re-verify EVERYTHING, including this session's own fixes
Audit the whole book **including the most recent cycle's fixes** (registry groups
up to and including `group_31`, v2.59). Re-check our own recent work for
regressions or incompleteness — do not assume it's correct because it's new.

---

## 5. What to audit — and the failure mode the last Claude audits had
**Two prior Claude diagnostic audits missed real bugs because they only checked
*structured* gates (the `inventory_condition` fields present in `remake_data.js`)
and never inspected (a) *text-only* gates nor (b) *per-paragraph spell tags*.**
This cycle must close that gap. Concretely, for a comprehensive analysis you must
cross-reference the **prose** against the **data**, not just scan the data:

- **(a) Text-only gates.** Read the canon prose for conditional branches like
  «если у вас есть X», «если у вас есть N золотых», «если вы дали …» and confirm
  the corresponding choice in `remake_data.js` actually carries
  `inventory_condition` / `gold_condition` / `consume_on_use`. A branch that is
  conditional in the **text** but rendered **unconditionally** by the engine
  (because the field is missing) is the exact class to find. Do **not** assume
  "no `inventory_condition` field = no gate" — verify against the prose.
- **(b) Per-paragraph spell tags.** For every paragraph whose prose offers a spell
  cast, confirm the matching choice carries the right `spell` / `spell_any` tag
  (so the charge is spent and any routing/gating fires) and that
  `combat_spells_allowed` matches whether each combat spell is an in-fight cast or
  a routing choice (§3.5). A spell offered in the **text** but untagged in the
  **data** (charge never spent, or modal shows a spell the text routes elsewhere)
  is the second class to find.

Then the full correctness checklist (severity P0–P3 each; quote the Russian line;
name the paragraph(s); state code-now vs canon; include your verification
result):

1. **Rule-overrides not honoured** (§3.8). (Already correct: §240 `damage:3`, §36
   `damage:4`.)
2. **Combat / luck / spell correctness end-to-end** — trace representative fights
   (multi-enemy, `combat_condition:"wound_2"` §532, the §436 spider script,
   `combat_mod` pre-cast buff bridges) in the engine: damage, par-on-tie, flee
   −2, luck decrement, spell-charge decrement.
3. **Item lifecycle — structured AND text-only** (see (a)): every gated item has a
   reachable grant; consumed items have `consume_on_use`.
4. **Gold economy & gold-signs** — `gold_cost` / `auto_items.gold_sub` for
   spending vs `gold` for receiving; no all-gold-gated softlock with no escape.
5. **Passive auto-effects on entry** — deterministic prose stat change ⇒ matching
   `auto_items`.
6. **Flask / backpack / food / capacity** (§3.6–3.7) — sips, stateful 7→9 cap,
   food slots & healing, gold/weapons not occupying slots, `normalizeSave`
   backfill.
7. **Link / target integrity & reachability** — wrong/nonexistent `choice.target`;
   cross-check the **54 intentionally-unreachable mechanic-entry** set
   (`group_29`) and flag only genuine new orphans. (Cosmetic FB2 typos, do NOT
   re-flag: §416 "1366", §849 "1830" — choices route to §366 / §830.)
8. **State persistence** — every persistent flag the engine reads is backfilled in
   `normalizeSave` so an old save can't crash a new build.

---

## 6. Do-not-re-flag — already fixed/verified across 31 registry groups
Full detail in `assets/text_corrections.json` (v2.59). All **DONE / verified /
intentional** — do **not** re-report; treat as established truth:

- **Antagonist is «Барлад Дэрт»** (not "Bardush"/"Elgariol").
- **g1** gold-sign prefixes · **g2** passive auto-effects · **g3** item grants ·
  **g4** conditional gating · **g5** dead-end luck softlocks · **g6**
  paragraph-arithmetic → inventory **tokens** (§13, §140 tokens, NOT `+N`) ·
  **g7** inventory/gold-loss · **g8** infinite-loot · **g11/g17** silver-bracelet
  & figured-key are **§340 shop purchases** · **g12** bronze-whistle name ·
  **g14** shop engine · **g15** post-combat grants · **g16** `gold_condition`
  (§774) · **g18** §774 four hatch options · **g18 letter-riddle** engine ·
  **g17 spell-hooks** (ILLUSION sparsity *genuine*, not missing hooks) · **g19**
  combat-modal FORCE/WEAKNESS · **g20** combat-canon balance · **g21**
  free-payment clusters · **g22** §984/§972/§1169 necklace · **g23** §972/§746
  dark-room · **g24** symbiont.games "topological analysis" PDF is **fabricated**
  (1366 / 1233 nodes / BFS 222 — false) · **g25** §562 / §140 · **g26/27/30**
  doc/README/registry sync · **g28** §1128 night is **NOT a bug** · **g29**
  reachability (the **54 "unreachable" are intentional** mechanic entries).
- **g31 (this just-closed cycle)** — item-chain & spell-usage audit: fixed real
  broken item chains, free combat/door bypasses, dropped spell branches; **§455**
  Spirit forbids all combat spells; the partial-permissive allowlist sweep set
  **§96/§110/§174/§388/§656/§1050 → no modal spells**, **§536/§1096 → Copy-only**
  (§440 dragon-head, §760 bats left at default Fire-navigation by design); a
  non-spoiler spell-selection hint was added. Re-verify for regressions, but treat
  as fixed, not as new findings.
- Established non-bugs: §38/§41 art correct; §372 ambience toggle.

---

## 7. Output format
- Deliver a **Markdown (.md) report**.
- Numbered findings; each: **severity P0–P3**, **paragraph number(s)**, code-now
  vs canon, a **verbatim Russian canon quote**, and **your verification result**
  (the harness / grep you ran).
- Separate clearly: **verified bugs** / **suspected (unverified)** / **confirmed
  non-bugs you checked**.
- **Report prose in English; all game quotes in Russian.**
- End with counts of P0/P1/P2/P3 and your single highest-confidence finding.

The user will return your `.md` report to the Claude verification session for
final checking before any commit.
