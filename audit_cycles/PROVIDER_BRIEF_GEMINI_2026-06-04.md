# Provider Brief — Gemini Deep Research — 2026-06-04
## Full implementation-correctness re-audit of «Подземелья Чёрного замка» (remake)

## 0. Your role
You are running a **fresh, full diagnostic audit** of a single-file HTML
gamebook engine — a faithful digital adaptation of **Д. Браславский,
«Подземелья Чёрного замка» (римейк / новая редакция)** — *Dungeons of the Black
Castle*. Author: **Дмитрий Браславский**; remake/new edition by **Александр
Морозов (2018)**, based on the 1st edition (1991). **1221 paragraphs; the
winning paragraph is §1220.** The game text and the whole project are in
**Russian**.

**Diagnostic only — produce a report, do NOT edit code.** Your findings will be
independently re-verified against canon + code + a Node harness by a separate
Claude session before anything is committed.

**Focus of THIS cycle = implementation correctness** (NOT art, NOT audio). We
have fixed the same *classes* of bug several times and each pass still finds a
fresh instance, so we want an **exhaustive** sweep of whether the data faithfully
encodes every canon rule — especially the places where the book locally
*overrides* a rule. See §5.

---

## 1. ⚠ Accuracy guard — READ FIRST
A previous Gemini audit of this exact project was **rejected wholesale as
confabulated**: it invented lore (a villain "Bardush"/"Elgariol" — the real
antagonist is **«Барлад Дэрт»**), invented illustration counts, and described
paragraph scenes that did not match the real text. A different session also
**finished its whole report on web-search guesswork because its file access had
silently failed** — and only admitted "no files were available" at the end. **Do
not let either happen again:**
- **Confirm file access BEFORE analysing anything** (see §2 — there is a
  mandatory pre-flight step).
- **Base every statement on the files actually provided to you**, quoted in
  Russian. If something is not covered by the provided files, write **"not
  determinable from provided files"** — never fill the gap from imagination or a
  web search.
- The verifier will spot-check several of your paragraph claims against the real
  data; if they don't match, the whole report is discarded.

---

## 2. Your environment & how to get the files — CONFIRM ACCESS FIRST
You run **in the browser**: **no local-disk access**, and you most likely
**cannot read the private GitHub repo**. Therefore the human exports the entire
project folder **`\Dungeons-of-the-Black-Castle\`** to **Google Drive** and adds
it as a **source** to this Gemini project / notebook.

### ✅ MANDATORY pre-flight (do this before any analysis)
1. Confirm you can see the **Google Drive folder** `\Dungeons-of-the-Black-Castle\`
   as a source, **and** that the priming files below are readable.
2. **Open `src/remake_data.js` and `assets/book_text.md` from the Drive folder
   and quote one short Russian line from each back to the user as proof of
   access.**
3. **If you cannot open them, STOP and tell the user** — do not start the audit,
   and do not substitute a web search. We would rather restart access than
   receive another "Captain Nemo" report written without the files.

### Files to ATTACH to this chat for priming (drag them in)
Attach by these **bare names** (no folder path in the attachment, and do not
write the path next to the attachment — a previous run *ignored* an attached
`game_logic.js` because the message referred to it as `\src\game_logic.js`):

| Attach this file (bare name) | What it is |
|---|---|
| `book_text.md` | full Russian text, corrections applied (~904 KB) — your primary text source |
| `text_corrections.json` | the correction registry (~255 KB) |
| `game_logic.js` | the engine (~114 KB) |

### Where those same files live in the Google Drive folder (so you can match them up)
The attached bare files are **identical** to these Drive paths — treat them as
the same file, and read the larger files directly from the Drive folder:
- `book_text.md` → **`\Dungeons-of-the-Black-Castle\assets\book_text.md`**
- `text_corrections.json` → **`\Dungeons-of-the-Black-Castle\assets\text_corrections.json`**
- `game_logic.js` → **`\Dungeons-of-the-Black-Castle\src\game_logic.js`**
- **`\Dungeons-of-the-Black-Castle\src\remake_data.js`** (~978 KB) — the actual
  game data (`const GD = {…}`, keyed by paragraph). **Source of truth** for
  choices/enemies/gold/items/conditions/`combat_spells_allowed`/per-enemy
  `damage`/`spell`/`spell_any`. Read it from the Drive folder.
- **`\Dungeons-of-the-Black-Castle\assets\fb2_remake.fb2`** (~904 KB) — canonical
  FB2 source.

**Do NOT fetch** the base64 art/audio files (`src\mj_art.js`,
`src\illustrations.js`, `assets\illustrations\…`) — huge and irrelevant to a
correctness audit; skip them and note the skip.

### Canon source note (read carefully)
- **`assets/fb2_remake.fb2` is identical to `assets/book_text.md`** — the `.md`
  is a 1:1 mirror of the FB2 **prose** (1221 paragraphs) **with the registry's
  corrections already applied**. Use `book_text.md` as your text source so you do
  **not** re-flag already-fixed typos / dead-ends / loops.
- ⚠ The per-paragraph **`**Выборы:**` machine-lists** at the foot of each
  paragraph in `book_text.md` are **STALE**. For current choice wiring trust
  **`src/remake_data.js`**, never those lists.
- **Read `assets/text_corrections.json` first** — `version` chain runs to
  **v2.59**, **31 correction groups**; its `version_history` + group entries list
  every already-fixed and already-rejected item, including **already-corrected
  typos / spelling fixes**. Re-flagging something listed there is the #1 failure
  mode (see §6).

---

## 3. THE GAME RULES — the verification baseline (quoted from the canon)
The rulebook the data must encode faithfully (verbatim from the book's
preface/rules, before §1). Your job is to check the data against these rules,
paragraph by paragraph, **from the text** (you are not running the engine, so
focus on text-vs-data consistency).

### 3.1 МАСТЕРСТВО / ВЫНОСЛИВОСТЬ / УДАЧА (Skill / Stamina / Luck)
> «Киньте один кубик. Добавьте 6 … — это ваше изначальное МАСТЕРСТВО. Киньте оба
> кубика. Добавьте 12 — … ВЫНОСЛИВОСТЬ. … Киньте кубик, прибавьте … 6 — … УДАЧА.»

Initial: **МАСТЕРСТВО 7–12**, **ВЫНОСЛИВОСТЬ 14–24**, **УДАЧА 7–12**.

### 3.2 Combat — БИТВЫ
> «… Сумма отражает его СИЛУ УДАРА. … Если ваша СИЛА УДАРА больше … вам удается
> ранить его … Вычтите два из его ВЫНОСЛИВОСТИ. … Вычтите два из вашей
> ВЫНОСЛИВОСТИ. … до тех пор, пока ВЫНОСЛИВОСТЬ … не станет равна нулю. Это
> означает смерть.»

Default per-hit damage **−2** (both ways); equal СИЛА УДАРА = parry. Fleeing
leaves the last hit to the enemy. **Multiple enemies:** every enemy whose СИЛА
УДАРА exceeds yours wounds you each round, but you wound only your chosen target.

### 3.3 Luck — ПРОВЕРКА УДАЧИ
> «Вы кидаете два кубика. Если результат меньше или равен вашей УДАЧЕ … вы
> удачливы … Каждый раз … вы должны вычитать 1 из вашей УДАЧИ … вы не хотите …
> или ваша УДАЧА равна нулю, считайте, что вы неудачливы.»

Luck test = **2d6 ≤ current УДАЧА**; **−1 УДАЧА per test**; 0 / decline = unlucky.

### 3.4 Spells — выбор заклятий
**8 spells**, budget of **10 one-time casts** total:
> «… воспользоваться заклятиями только 10 раз … всего их должно быть не более
> десяти … каждое заклятие используется только один раз …»

Spells: **ЛЕВИТАЦИИ, ОГНЯ, ИЛЛЮЗИИ, СИЛЫ, СЛАБОСТИ, КОПИИ, ИСЦЕЛЕНИЯ, ПЛАВАНИЯ.**
СИЛА/СЛАБОСТЬ/КОПИЯ are combat spells; ИСЦЕЛЕНИЕ heals +8 outside combat;
ЛЕВИТАЦИЯ/ОГОНЬ/ПЛАВАНИЕ/ИЛЛЮЗИЯ are navigation-cast. Every cast spends one
charge.

### 3.5 IMPORTANT — spell use can change the ROUTE, not just the fight
A spell in a fight is sometimes a **navigation choice** (casting sends the player
to a *different paragraph* — there is a number after the spell name, e.g.
`«заклятие Силы (286)»`), not an in-fight cast. In those fights the in-combat
spell menu must **not** also offer that spell (else double-cast / route bypass).
When you read a combat's spell options in the text, distinguish "cast here" from
"cast → go to paragraph N".

### 3.6 Equipment — фляга, заплечный мешок, еда, золото
> «… 15 золотых. … фляга … попить … дважды, каждый глоток вернет вам 2
> ВЫНОСЛИВОСТИ. … в … мешок можно положить только 7 предметов … деньги и оружие
> … не кладутся … пищу … (она займет 1 место …) … восстановить … ВЫНОСЛИВОСТИ …
> (не во время боя).»

Start **15 gold**; flask **2 sips × +2**; backpack **7 items** (gold/weapons
don't count); food **1 slot**, heals when eaten (not in combat).

### 3.7 The backpack can be UPGRADED — §132 (forest merchant)
> «… можете купить еще и заплечный мешок. Он стоит 7 золотых, но в него помещается
> больше чем в ваш: не 7, а 9 предметов. … вы должны будете оставить его в доме у
> торговца.» (§132 also fills the flask for 4 / 2 gold and sells food.)

So the inventory cap is **stateful: 7 → 9** after the §132 purchase.

### 3.8 The book LOCALLY OVERRIDES rules — verify each override is encoded
Canonical example **§240** (six snakes):
> «… при каждом ранении, нанесенном каждой змеей, вычитайте **не 2, а 3**
> ВЫНОСЛИВОСТИ, т. к. яд от их укусов действует не в вашу пользу.»

Correctly encoded as per-enemy **`damage:3`** in the data. **Verify this pattern
book-wide:** any prose that says «вычитайте не 2, а N…», «теряете N ВЫНОСЛИВОСТИ»,
a poison/fire tick, a one-time entry effect, a modified luck/skill, etc. — confirm
the data field exists. A rule-override present only in the prose but absent from
the data is exactly the bug class we keep finding.

---

## 4. Scope — re-verify EVERYTHING, including this session's own fixes
Audit the whole book **including the most recent cycle's fixes** (registry groups
up to and including `group_31`, v2.59). Re-check our own recent work too — don't
assume it's correct because it's new.

## 5. What to audit (correctness focus — play to systematic text scanning)
Ground every claim in the provided files; quote the Russian line and name the
paragraph(s). For each finding give **severity P0–P3**.

1. **Text-vs-data rule-overrides** (§3.8) — scan `book_text.md` for prose that
   modifies a rule («не 2, а N», entry stamina loss, poison/fire, modified luck)
   and check `remake_data.js` encodes it. (Already correct, do NOT re-flag: §240
   `damage:3`, §36 `damage:4`.)
2. **Spell gating & routing** (§3.4–3.5) — for each fight that mentions a spell,
   read whether it's an in-fight cast or a routing choice, and check the data's
   `combat_spells_allowed` / `spell` tags match.
3. **Item gating — structured AND text-only** — flag prose "если у вас есть X"
   gates that exist only in the text and were never encoded as
   `inventory_condition`; and any gated item with no reachable grant.
4. **Gold / economy** — prose that costs or gives gold vs the data's
   `gold_cost` / `auto_items.gold_sub` / `gold`.
5. **Link / target integrity & reachability** — `choice.target` (or the text's
   stated destination) pointing somewhere wrong; cross-check the known **54
   intentionally-unreachable mechanic-entry** set (`group_29`) — flag only
   genuine new orphans. (Cosmetic FB2 typos, do NOT re-flag: §416 "1366", §849
   "1830" — choices already route to §366 / §830.)

If you wish to comment on map/structure you may, but **mark it P3** — the focus
is correctness, not art or UX this cycle.

---

## 6. Do-not-re-flag — already fixed/verified across 31 registry groups
Full detail in `assets/text_corrections.json` (v2.59). All of the following are
**DONE / verified / intentional** — do **not** re-report; treat as established
truth:

- **Antagonist is «Барлад Дэрт»** (not "Bardush"/"Elgariol").
- **g1** gold-sign prefixes · **g2** passive auto-effects · **g3** item grants ·
  **g4** conditional gating · **g5** dead-end luck softlocks · **g6**
  paragraph-arithmetic → inventory **tokens** (§13, §140 are tokens, NOT `+N`
  arithmetic) · **g7** inventory/gold-loss · **g8** infinite-loot · **g11/g17**
  silver-bracelet & figured-key are **shop purchases** (§340) · **g12**
  bronze-whistle name · **g14** shop engine · **g15** post-combat grants · **g16**
  `gold_condition` (§774) · **g18** §774 four options · **g18 letter-riddle** ·
  **g17 spell-hooks** (ILLUSION sparsity is *genuine*, not missing hooks) · **g19**
  combat-modal FORCE/WEAKNESS · **g20** combat-canon balance · **g21**
  free-payment clusters · **g22** §984/§972/§1169 necklace · **g23** §972/§746
  dark-room · **g24** the **symbiont.games "topological analysis" PDF is
  fabricated** (1366 / 1233 nodes / BFS 222 — false); do NOT reuse it · **g25**
  §562 / §140 · **g26/27/30** doc/README/registry sync · **g28** §1128 night is
  **NOT a bug** · **g29** reachability (the **54 "unreachable" are intentional**
  mechanic entries).
- **g31 (this just-closed cycle)** — item-chain & spell-usage audit: fixed real
  broken item chains, free combat/door bypasses, dropped spell branches; **§455**
  forbids all combat spells; the allowlist sweep set
  **§96/§110/§174/§388/§656/§1050 → no modal spells**, **§536/§1096 → Copy-only**;
  a non-spoiler spell-selection hint was added. Re-verify if you like, but treat
  as fixed.
- Established non-bugs: §38/§41 art correct; §372 ambience toggle.

---

## 7. Output format
- Deliver a report the user will **export to PDF**.
- Numbered findings; each: **severity P0–P3**, **paragraph number(s)**, what the
  data does now vs what canon requires, and a **short verbatim Russian canon
  quote** as evidence.
- **Report prose in English; all game quotes in Russian.**
- For anything not determinable from the provided files, write **"not
  determinable from provided files."** Separate **verified** vs **suspected**.
- End with counts of P0/P1/P2/P3 and your single highest-confidence finding.

The user will export your report to PDF and return it to the Claude verification
session for final checking before any commit.
