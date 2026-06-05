# Provider Brief — ChatGPT Deep Research — 2026-06-04
## Full implementation-correctness re-audit of «Подземелья Чёрного замка» (remake)

## 0. Your role
You are running a **fresh, full diagnostic audit** of a single-file HTML
gamebook engine — a faithful digital adaptation of **Д. Браславский,
«Подземелья Чёрного замка» (римейк / новая редакция)** — *Dungeons of the Black
Castle*. Author: **Дмитрий Браславский**; remake/new edition by **Александр
Морозов (2018)**, based on the 1st edition (1991). **1221 paragraphs; the
winning paragraph is §1220.** The game text and the whole project are in
**Russian**.

**This is a diagnostic pass — produce a report only, do NOT edit code.** Your
findings will be independently re-verified against canon + code + a Node harness
by a separate Claude session before anything is committed.

**Focus of THIS cycle = implementation correctness.** We are NOT auditing art or
audio this round. We have fixed the same *classes* of bug several times and each
pass still finds a fresh instance, so this time we want an **exhaustive** sweep
of: does the engine faithfully implement every canon rule, including the places
where the book locally *overrides* a rule? See §5 for the exact checklist.

---

## 1. Language rules (important)
- **Write your entire report in English** — it is the most precise language for
  inter-session communication.
- **BUT keep every quoted game-text fragment, choice label, item name, spell
  name, and search string in the original Russian, verbatim** — e.g. the choice
  `«Заплатить (562)»`, the item `«Золотой ключ»`, the spell `«заклятие Копии»`.
  **Reason:** the downstream Claude verifier runs regex / substring search over
  the **Russian** source files; an English paraphrase will not match and wastes a
  whole verification cycle. Do **not** translate quotes.
- The **game itself is and stays Russian.** English is only our working language
  between AI sessions.

---

## 2. How to access the project — confirm access FIRST
You have **GitHub access**. The repository is **private**:
`https://github.com/YVashchuk/Dungeons-of-the-Black-Castle` (branch `main`).

**Before you start the audit, confirm you can actually open the repo and read
the files below.** If a file will not load, say so explicitly and stop — do not
substitute a web search or analysis "from memory." (A previous session finished
with a report that turned out to be based on guesswork because file access had
silently failed.)

### Files to ATTACH to this chat for priming (drag them in)
Attach the files by these **bare names** (no folder path in the attachment, and
do not write the path next to the attachment — a previous run *ignored* an
attached `game_logic.js` because the message referred to it as `\src\game_logic.js`):

| Attach this file (bare name) | What it is |
|---|---|
| `game_logic.js` | the engine (~114 KB) |
| `text_corrections.json` | the correction registry (~255 KB) |
| `book_text.md` | full Russian text, corrections applied (~904 KB) |
| `README.md` | project overview (~13 KB) |

### Where those same files live in the GitHub repo (so you can match them up)
The attached bare files are **identical** to these repo paths — treat them as the
same file:
- `game_logic.js` → **`src/game_logic.js`**
- `text_corrections.json` → **`assets/text_corrections.json`**
- `book_text.md` → **`assets/book_text.md`**
- `README.md` → **`README.md`** (repo root)

### Read these directly from GitHub (too large to attach comfortably)
- **`src/remake_data.js`** (~978 KB) — the actual game data: `const GD = {…}`,
  keyed by paragraph number. **This is the source of truth** for choices,
  enemies, gold, items, `auto_items`, `combat_condition`, `combat_spells_allowed`,
  `gold_condition`/`gold_cost`, `inventory_condition`/`consume_on_use`,
  per-enemy `damage`, `spell` / `spell_any`, `combat_mod`, riddles.
  ⚠ It is a **single-line** file — parse it programmatically:
  `GD = json.loads(re.search(r'const\s+GD\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S).group(1))`.
- **`assets/fb2_remake.fb2`** (~904 KB) — the canonical FB2 source text.

You may **skip** the base64 art/audio files (`src/mj_art.js`,
`src/illustrations.js`, anything under `assets/illustrations/`) — irrelevant to a
correctness audit.

### Canon source note (read carefully)
- **`assets/fb2_remake.fb2` is identical to `assets/book_text.md`** — the `.md`
  is a 1:1 mirror of the FB2 **prose** (all 1221 paragraphs) **with the
  registry's corrections already applied**. Use `book_text.md` as your text
  source so you do **not** re-flag already-fixed typos / dead-ends / loops.
- ⚠ The per-paragraph **`**Выборы:**` machine-lists** at the foot of each
  paragraph in `book_text.md` are **STALE** (exported from an older data
  revision). For the **current** choice wiring, trust **`src/remake_data.js`**,
  never those lists.
- **Read `assets/text_corrections.json` first** — `version` chain runs to
  **v2.59**, **31 correction groups**. Its `version_history` + each group entry
  enumerate every already-fixed and already-rejected item, including the
  **already-corrected typos and spelling fixes**. **Re-flagging something listed
  there is the #1 failure mode.** See §6 for the digest.

---

## 3. THE GAME RULES — the verification baseline (quoted from the canon)
Everything below is the rulebook the engine must implement faithfully. These are
verbatim from the book's preface/rules (`fb2_remake.fb2`, before §1). **Your job
is to check the engine + data against these rules, paragraph by paragraph.**

### 3.1 Determining МАСТЕРСТВО / ВЫНОСЛИВОСТЬ / УДАЧА (Skill / Stamina / Luck)
> «Киньте один кубик. Добавьте 6 к тому, что у вас выпало, — это ваше изначальное
> МАСТЕРСТВО. Киньте оба кубика. Добавьте 12 — сумма и будет вашей изначальной
> ВЫНОСЛИВОСТЬЮ. Остается УДАЧА. Киньте кубик, прибавьте к полученному 6 — в итоге
> получится ваша изначальная УДАЧА.»

So initial ranges: **МАСТЕРСТВО 7–12** (1d6+6), **ВЫНОСЛИВОСТЬ 14–24** (2d6+12),
**УДАЧА 7–12** (1d6+6). Verify the character-creation screen and `initState`
produce exactly these ranges and semantics.

### 3.2 Combat — БИТВЫ (the 7 actions)
> «Действие 1-е. Киньте оба кубика за вашего врага. Прибавьте к этому его
> МАСТЕРСТВО. Сумма отражает его СИЛУ УДАРА. Действие 2-е. Киньте оба кубика за
> себя и прибавьте … то МАСТЕРСТВО, которое будет у вас на момент боя. Это ваша
> СИЛА УДАРА. Действие 3-е. Если ваша СИЛА УДАРА больше … вам удается ранить его …
> Если же наоборот, то он ранит вас … Если же они равны, то он парирует ваш удар …
> Действие 4-е. … Вычтите два из его ВЫНОСЛИВОСТИ. Действие 5-е. … Вычтите два из
> вашей ВЫНОСЛИВОСТИ. … Действие 7-е. … до тех пор, пока ВЫНОСЛИВОСТЬ … не станет
> равна нулю. Это означает смерть.»

Default per-hit damage is **−2 ВЫНОСЛИВОСТИ** (both directions). Equal СИЛА УДАРА
= parry, no damage, repeat.

**Fleeing:** > «В некоторых специально оговоренных случаях … возможность бежать
с поля боя … в случае вашего бегства последний удар остается за врагом.» (Engine
applies a −2 flee penalty.)

**Multiple enemies — БИТВА С НЕСКОЛЬКИМИ ПРОТИВНИКАМИ:**
> «… перед каждым раундом атаки вы должны выбрать, в чью сторону вы направляете
> свой удар. Киньте кубики за каждого участника битвы … с выбранным … деретесь
> как обычно, но … вы должны сравнить вашу СИЛУ УДАРА с СИЛОЙ УДАРА всех
> остальных врагов. … каждый, у кого СИЛА УДАРА будет больше вашей, ранит вас. Вы
> же можете ранить только вашего непосредственного противника …»

### 3.3 Luck — ПРОВЕРКА УДАЧИ
> «Вы кидаете два кубика. Если результат меньше или равен вашей УДАЧЕ … то вы
> удачливы … Если же результат выше … вам не повезло … Каждый раз, когда вам будет
> предлагаться ПРОВЕРИТЬ ВАШУ УДАЧУ, вы должны вычитать 1 из вашей УДАЧИ … Каждый
> раз, когда … вы не хотите этого делать или ваша УДАЧА равна нулю, считайте, что
> вы неудачливы.»

So a luck test = **2d6 ≤ current УДАЧА**, and **every test decrements УДАЧА by 1**
(whether or not it succeeds; and УДАЧА=0 or declining counts as unlucky). Verify
the engine decrements luck on every test and treats 0 / decline as failure.

### 3.4 Spells — выбор заклятий (Maylin's magic)
There are **8 spells**. The player gets a budget of exactly **10 casts** to
distribute across them at character creation; **each cast is one-time** (spent on
use):
> «уровень вашего МАСТЕРСТВА позволяет воспользоваться заклятиями только 10 раз …
> вы можете выбрать любые заклятия и любом количестве, но всего их должно быть не
> более десяти … каждое заклятие используется только один раз, после этого вам
> придется его вычеркнуть …»

The eight spells (canon descriptions, verbatim):
- **ЛЕВИТАЦИЯ** — «подняться в воздух и перелететь … препятствие … действует не
  слишком долго…»
- **ОГНЯ** — «создать … огненный шар и направить его на врагов. Но в закрытых
  помещениях … осмотрительно, чтобы не устроить пожар.»
- **ИЛЛЮЗИИ** — «создадите у вашего врага … иллюзию и сможете спастись в тех
  ситуациях, из которых другого выхода не будет … иллюзия рассеивается …»
- **СИЛЫ** — «прибавит вам силу и увеличит вашу СИЛУ УДАРА.»
- **СЛАБОСТИ** — «сделает вашего врага неуклюжим … ослабит СИЛУ его УДАРА.»
- **КОПИИ** — «создать точную Копию вашего противника … МАСТЕРСТВО и ВЫНОСЛИВОСТЬ
  которой … равны его … Если … противников было несколько, а Копию … только одну,
  то придется драться и с остальными.»
- **ИСЦЕЛЕНИЯ** — «в любой момент (но не во время сражения) добавит вам 8
  ВЫНОСЛИВОСТЕЙ.»
- **ПЛАВАНИЯ** — «сможете переплыть любую водную преграду … как только вы вступите
  на землю, заклятие утратит свою силу.»

**Engine model to verify against:** the three *combat* spells (СИЛА / СЛАБОСТЬ /
КОПИЯ) are offered as in-combat modal buttons by default in every fight; ИСЦЕЛЕНИЕ
is castable any time **outside** combat (+8 ВЫНОСЛИВОСТИ); ЛЕВИТАЦИЯ / ОГОНЬ /
ПЛАВАНИЕ / ИЛЛЮЗИЯ are navigation-cast (they appear as choices). **Every cast must
decrement the spell's remaining count.**

### 3.5 IMPORTANT — spell use can change the ROUTE, not just the current fight
A spell offered in a fight is sometimes presented as a **navigation choice**
(casting it sends the player to a *different paragraph* — detectable by a number
after the spell name, e.g. `«заклятие Силы (286)»`) rather than an in-fight modal
cast. In those fights the in-combat modal must **not** also offer that spell, or
the player double-casts / bypasses the book's special routing. We just completed
a sweep of exactly this (`combat_spells_allowed` per fight). **When you audit a
combat's spell options, read whether each spell is an in-fight cast or a routing
choice — they are different and must not be conflated.**

### 3.6 Equipment — фляга, заплечный мешок, еда, золото
> «С вами только ваш испытанный меч, за спиной — заплечный мешок, а в кармане — 15
> золотых. Да еще к поясу пристегнута фляга с водой — вы можете попить из нее
> дважды, каждый глоток вернет вам 2 ВЫНОСЛИВОСТИ.»
>
> «… в ваш заплечный мешок можно положить только 7 предметов. … в любой момент
> (кроме времени битвы) вы можете все … вынуть … деньги и оружие в заплечный мешок
> не кладутся … Эту пищу вы можете либо сразу съесть, любо взять с собой (она
> займет 1 место … ) и … восстановить столько ВЫНОСЛИВОСТИ, сколько она позволяет
> … (опять же только не во время боя).»

So: start **15 gold**; **flask = 2 sips, +2 ВЫНОСЛИВОСТИ each**; backpack holds
**7 items** (gold and weapons do NOT occupy slots); food occupies **1 slot** and
heals its rated ВЫНОСЛИВОСТИ when eaten (not in combat).

### 3.7 The backpack can be UPGRADED — §132 (the forest merchant)
At **§132** the player may buy a larger backpack (and fill the flask / buy food):
> «Если хотите, можете купить еще и заплечный мешок. Он стоит 7 золотых, но в него
> помещается больше чем в ваш: не 7, а 9 предметов. Однако два заплечных мешка
> нести неудобно … вы должны будете оставить его в доме у торговца.»
> «За 4 золотых он предлагает наполнить вашу флягу целиком или за 2 — наполовину.
> Воды торговец может дать бесплатно столько, сколько поместится в вашей фляге.»

So the **inventory cap is stateful** (7 → 9 after the §132 purchase). Verify the
engine's cap is a variable (not hard-coded 7) everywhere it is checked, and that
the §132 flask-fill / food / bag-upgrade behave per the text.

### 3.8 The book LOCALLY OVERRIDES rules — verify each override is honoured
The prose sometimes changes a rule for a specific paragraph. The canonical
example is **§240** (six snakes):
> «… при каждом ранении, нанесенном каждой змеей, вычитайте **не 2, а 3**
> ВЫНОСЛИВОСТИ, т. к. яд от их укусов действует не в вашу пользу.»

This is correctly implemented via per-enemy **`damage:3`** on each snake (the
engine reads `enemy.damage || 2`). **This is the pattern to verify across the
whole book:** any paragraph whose prose says «вычитайте не 2, а N…», «теряете N
ВЫНОСЛИВОСТИ», a one-time entry damage, a modified luck/skill effect, a poison /
fire / cold tick, etc. — confirm the data encodes it (`damage:N`, `auto_items`,
`combat_condition`, etc.) and the engine applies it. A rule-override that lives
only in the prose but not in the data is exactly the bug class we keep finding.

---

## 4. Scope — re-verify EVERYTHING, including this session's own fixes
Audit the whole book **including the fixes made in the most recent cycle**
(registry groups up to and including `group_31`, v2.59). We explicitly want you
to re-check our own recent work for regressions or incompleteness — not assume it
is correct because we just did it.

## 5. What to audit — the recurring bug classes (the checklist)
For every finding: **severity** (P0 crash/softlock · P1 broken mechanic · P2
notable · P3 design-note), the **paragraph number(s)**, what the data/engine does
now, what the canon requires, and a **short Russian canon quote** as evidence.

1. **Rule-overrides not honoured** (§3.8) — prose changes per-hit damage, entry
   stamina, luck/skill effect, etc., but the data left the default. (Already
   correct, do NOT re-flag: §240 snakes `damage:3`, §36 trader `damage:4`.)
2. **Combat correctness end-to-end** — pick representative fights incl.
   multi-enemy and `combat_condition` cases; verify damage application, par on
   tie, flee −2, win/lose transitions.
3. **Spell gating & routing** (§3.4–3.5) — every player-cast spell choice should
   (a) consume a charge and (b) be either an in-fight modal cast **or** a routing
   choice, never silently both. Check `combat_spells_allowed` per fight against
   the prose; check that navigation spell choices carry the right `spell` tag.
4. **Item lifecycle / gating — structured AND text-only** — any choice that
   *requires* or *consumes* an item must have `inventory_condition` /
   `consume_on_use`; **also check the prose for "если у вас есть X" gates that
   exist only in the text and were never encoded** (these are easy to miss).
   Every gated item must have a reachable grant (`auto_items` / shop).
5. **Gold economy & gold-signs** — choices that cost/give gold must use the right
   field (`gold_cost` / `auto_items.gold_sub` for spending, `gold` for receiving);
   no softlock where every visible choice is gold-gated with no escape.
6. **Passive auto-effects on entry** — paragraphs whose prose gives a
   deterministic stat change on arrival must carry the matching `auto_items`.
7. **Flask / backpack / food / capacity** (§3.6–3.7) — flask sips, 7→9 stateful
   cap, food slots & healing, gold/weapons not occupying slots.
8. **Luck tests** (§3.3) — decrement on every test; 0 / decline = unlucky; no
   luck branch that softlocks on failure.
9. **Link / target integrity & reachability** — any `choice.target` pointing to a
   wrong/nonexistent paragraph; cross-check the known "54 intentionally
   unreachable mechanic-entry" set (`group_29`) — flag only genuine new orphans.
   (Known cosmetic FB2 body-text typos, do NOT re-flag: §416 "1366", §849 "1830"
   — the choices already route to §366 / §830.)

---

## 6. Do-not-re-flag — already fixed/verified across 31 registry groups
Full detail is in `assets/text_corrections.json` (v2.59). High level, all of the
following are **DONE / verified / intentional** — do **not** re-report them; use
them as established truth:

- **Antagonist is «Барлад Дэрт»** (not "Bardush"/"Elgariol" — those were a
  rejected confabulation).
- **g1** gold-sign prefixes fixed · **g2** missing passive auto-effects added ·
  **g3** missing item grants added · **g4** conditional choice-gating
  (`inventory_condition`) · **g5** dead-end luck softlocks fixed · **g6**
  paragraph-arithmetic converted to inventory **tokens** (§13 fish-help, §140
  gold-key are tokens, **not** `+N` arithmetic — do NOT re-raise as arithmetic) ·
  **g7** inventory/gold-loss honoured · **g8** infinite-loot · **g11/g17**
  silver-bracelet & figured-key are **shop purchases** (§340), not free grants ·
  **g12** bronze-whistle name unified · **g14** shop purchase engine · **g15**
  post-combat item grants · **g16** `gold_condition` gating (§774 etc.) · **g18**
  §774 four hatch-opening options · **g18 letter-riddle** engine · **g17
  spell-hooks** (full 132-mention spell audit; ILLUSION's sparsity is *genuine*,
  not missing hooks) · **g19** combat-modal FORCE/WEAKNESS · **g20** combat-canon
  balance (per-hit damage, allowlists, gates) · **g21** free-payment clusters
  given `gold_cost` · **g22** §984/§972/§1169 golden-necklace chain · **g23**
  §972/§746 dark-room offerings/grants · **g24** the **symbiont.games
  "topological analysis" PDF is fabricated** (max-index 1366, 1233 nodes, BFS 222
  — all false) — do NOT reuse it · **g25** §562 self-loop & §140 grant · **g26/27/30**
  doc/README/registry sync · **g28** §1128 night re-trigger is **NOT a bug** ·
  **g29** reachability (1167/1221 reachable; the other **54 are intentional
  mechanic entries**, not orphans).
- **g31 (most recent, this just-closed cycle)** — item-chain & spell-usage audit:
  fixed real broken item chains, free combat/door bypasses, and dropped spell
  branches; **§455** Spirit-of-the-Dead now forbids all combat spells; the
  partial-permissive combat-spell allowlist sweep set **§96/§110/§174/§388/§656/§1050
  → no modal spells** and **§536/§1096 → Copy-only**; a non-spoiler
  spell-selection hint was added. (You may still re-verify these for regressions,
  but treat them as fixed, not as new findings.)
- Other established non-bugs: §38/§41 art correct; §372 ambience toggle; §95/§146
  castle password works.

---

## 7. Output format (this feeds an automated verifier)
- Deliver a **Markdown (.md) report**.
- A numbered list of findings; each: **severity P0–P3**, **paragraph number(s)**,
  what the data/engine does now, what canon requires, and a **short Russian canon
  quote** (verbatim) as evidence.
- Separate **verified** vs **suspected (unverified)** clearly. If you cannot
  verify a claim against the files you actually read, say so — do not guess.
- End with a one-paragraph summary: counts of P0/P1/P2/P3 and your single
  highest-confidence finding.
- Remember: **report prose in English, all game quotes in Russian.**

The user will return your `.md` report to the Claude verification session for
final checking before any commit.
