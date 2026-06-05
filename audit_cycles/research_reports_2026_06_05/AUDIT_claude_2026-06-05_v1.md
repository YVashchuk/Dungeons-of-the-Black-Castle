# Implementation-Correctness Audit — «Подземелья Чёрного замка» (remake)

**Diagnostic cycle:** 2026-06-05
**Scope:** implementation correctness only (NOT art, NOT audio), per `PROVIDER_BRIEF_CLAUDE_2026-06-04.md`.
**Game:** Д. Браславский, «Подземелья Чёрного замка» (remake / А. Морозов, 2018). 1221 paragraphs; victory = §1220. All game text is Russian.
**Result type:** report only — **no code was committed.**

---

## 0. Environment note (deviation from the brief — read this first)

The brief assumes the **Claude Windows App with MCP filesystem access** to `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle` and the private GitHub repo. **This session does not have that.** It ran in a **Linux code sandbox** against the four files uploaded directly into the chat:

| Used | Role |
|---|---|
| `remake_data.js` (~978 KB) | `const GD={…}` — **source of truth for wiring**. `node --check` passes. |
| `game_logic.js` (~114 KB) | the engine. Read line-by-line; line numbers cited below. |
| `book_text.md` (~908 KB) | 1:1 prose mirror of the FB2 — canon prose reference. |
| `text_corrections.json` (v2.59, 31 groups) | the do-not-re-flag registry. |

Two consequences, both honoured throughout:

1. **`assets/fb2_remake.fb2` is the final arbiter and was *not* uploaded.** All canon quotes below are taken from `book_text.md`, which the brief states is a corrected 1:1 mirror of the FB2 prose. Where the FB2 could in principle differ, that is flagged.
2. **`src/game_shell_top.html` was *not* uploaded.** Therefore the **character-creation screen and the 10-spell-budget UI (§3.4) could not be verified.** This is the single coverage gap in this audit — see §“Not verified” at the end. Everything checkable from `game_logic.js` + `remake_data.js` + `book_text.md` was checked.

All findings were verified to the downstream-verifier standard: canon prose → `remake_data.js` wiring → a Node behavioural harness or a Python prose-vs-data cross-reference. The methods are named per finding.

---

## 1. Methodology & validated tooling

- **Prose↔data cross-reference (Python, `-X utf8`).** `GD` parsed with `json.loads`; prose parsed by splitting `book_text.md` on `^### §N` headings and **discarding the stale `**Выборы:**` machine-lists** (the brief warns these are not current wiring). Used for Findings #1, #2, #3 and the non-bug confirmations.
- **Entry-effects harness (Node, `_harness_full.js`).** Stubs DOM/`window`/`localStorage`/`Audio`/timers; rewrites `const GD`→`var GD`; stubs `MJ_MAP/MJ_DATA/ILLUST_MAP={}`; `eval`s both files. The engine’s `let S` does **not** leak, so state is driven through `window.S` (the engine bridges via `Object.defineProperty`, ~line 35). **Validated against known controls** §25 (−2 stamina) and §1122 (−5 stamina) before trusting any result.
- **Combat harness (Node, `_trace3.js`).** Critical lesson: intercepting `crypto.getRandomValues` does **not** control the dice (the engine captures `d6` at eval time). The reliable method is to **textually replace `function d6(){…}` with a queue-driven stub** in the source string before `eval`, and to expose the module-local `combatState` by appending `window.__cs=()=>combatState;`. Validated against §240 (`damage:3`) and §36 (`damage:4`).

---

## 2. VERIFIED BUGS

### Finding #1 — Deterministic entry stat-changes are silently dropped *(HEADLINE / highest confidence)*

**Severity:** sub-findings range **P1–P2** (see breakdown). **Verification:** entry-effects harness — for every paragraph below the harness navigated in on a first visit and observed the stat delta. **Every flagged paragraph produced delta = 0 where canon mandates a non-zero change.** Harness validated on §25/§1122 controls first.

**Root cause.** When a paragraph’s prose states an unconditional stat change on entry, the engine can only honour it via `auto_items` (applied once, on first visit, in `renderGame` ~line 446). There is **no manual “lose N stamina” UI**. Every paragraph below has **`auto_items: None`** (or an `auto_items` that omits the relevant key), so the change is narrated but never applied. The player is systematically **stronger than canon** (most cases) or, in a few, denied a canonical gain.

This is exactly the recurring bug-class the brief calls out (§3.8 “a rule-override that lives only in prose but not in data”), and registry `g2` shows the class has been fixed before — these are fresh instances.

---

**#1-A — 45 missing stamina losses.** *Severity: **P1** (systemic balance).*

Affected paragraphs (magnitude = `потеряйте N ВЫНОСЛИВОСТ…`):

> §92 (−1), §102 (−5), §107 (−2), §109 (−1), §126 (−3), §222 (−4), §294 (−6), §304 (−3), §322 (−2), §347 (−3), §392 (−2), §407 (−4), §440 (−2), §464 (−2), §468 (−4), §477 (−6), §514 (−2), §532 (−4), §558 (−4), §559 (−3), §653 (−2), §656 (−4), §698 (−1), §701 (−2), §721 (−1), §733 (−2), §760 (−1), §762 (−2), §813 (−2), §840 (−5), §848 (−2), §852 (−3), **§908 (−16)**, §925 (−3), §965 (−2), §970 (−2), §998 (−4), §1024 (−7), §1068 (−1), §1117 (−5), §1118 (−2), §1152 (−3), §1174 (−2), §1194 (−2), §1199 (−4).

Representative canon quotes (verbatim):

- **§908** — the single most consequential instance — «Примерно на четвертые сутки все ваши силы иссякают (потеряйте 16 ВЫНОСЛИВОСТЕЙ).» … «Если вы живы, то 1007. Если вы не выдержали, и ваша ВЫНОСЛИВОСТЬ на нуле,» → §605. The −16 is the input to a **canonical death-check**: with the loss dropped, ВЫНОСЛИВОСТЬ never reaches 0, the §605 death branch is **unreachable**, and the player always survives to §1007. (Borderline P0 in effect, but it neither crashes nor softlocks, so it is rated P1 as part of the cluster.)
- **§477** — «Это растяжение — потеряйте 6 ВЫНОСЛИВОСТЕЙ.»
- **§1024** — «Потеряйте 7 ВЫНОСЛИВОСТЕЙ за укол волшебным шипом…»
- **§1117** — «Потом сильно обо что-то ударяетесь и теряете 5 ВЫНОСЛИВОСТЕЙ.»

**Pre-combat sub-cases** (the loss precedes a fight the player then enters at full canon stamina): §440, §532, §656, §760. e.g. §532 «Дохнув пламенем (потеряйте 4 ВЫНОСЛИВОСТИ), он бросается в бой.»; §656 «ударив копьем (потеряйте 4 ВЫНОСЛИВОСТИ)…». (Note: §440 and §760 also appear in registry `g31` regarding the *spell allowlist*; that is a different concern — the **stamina loss** at these paragraphs is unaddressed and is the bug here.)

**Excluded as false positives** (correctly *not* flagged): optional consumables phrased descriptively (patterns of the form *“X restores N”* / *“you may eat …”*) and conditional losses (any branch opening with «если …»). Those are not unconditional entry effects.

---

**#1-B — 5 missing forced stamina *gains*.** *Severity: **P2** (disadvantages the player; same mechanism).*

> §635 (+4), §680 (+8), §683 (+5), §691 (+4), §872 (+5).

These are unconditional, *non-optional* restorations the player is simply denied:

- **§680** — «Это микстура жизни. Прибавьте себе 8 ВЫНОСЛИВОСТЕЙ и уходите из домика — 590.»
- **§683** — «Прибавьте 5 ВЫНОСЛИВОСТЕЙ, поблагодарите Тролля…»
- **§691** — «Вода самая обычная. Восстановите себе 4 ВЫНОСЛИВОСТИ.»

(These read as fixed narrative outcomes, not “you may drink”, so they belong with the dropped-effect class rather than the optional-consumable exclusion.)

---

**#1-C — 7 missing skill (МАСТЕРСТВО) losses.** *Severity: **P1** (affects every subsequent fight: СИЛА УДАРА = 2d6 + МАСТЕРСТВО).*

> §263 (−1 МАСТ +2 ВЫН), §478 (−1 МАСТ), §543 (−1 МАСТ +2 ВЫН), §626 (−1 МАСТ +2 ВЫН), §776 (−1 МАСТ), §843 (−1 МАСТ), §896 (−1 МАСТ +4 ВЫН).

**Engine note:** the engine **does** support the key — `auto_items.skill_sub` is honoured at `game_logic.js` line 507 — but **no paragraph in `remake_data.js` uses it.** So this is purely a data gap; the fix is mechanically available.

- **§896** — «Потеряйте 1 МАСТЕРСТВО и 4 ВЫНОСЛИВОСТИ.»
- **§776** — «…ваш меч, вырванный из руки нечеловеческой силой (потеряйте 1 МАСТЕРСТВО), отлетает в другой конец комнаты.»
- **§543** — «При падении вывихиваете руку (потеряйте 1 МАСТЕРСТВО и 2 ВЫНОСЛИВОСТИ).»

---

**#1-D — 7 missing luck (УДАЧА) losses — *plus an engine gap*.** *Severity: **P2** (data gap **and** engine gap).*

> §63 (−1), §206 (−1), §217 (−1), §446 (−1), §486 (−1), §939 (−1), §1185 (−1).

**This is a double gap.** Not only is the `auto_items` effect missing in the data, but **the engine has no `luck_sub` handler at all** — `auto_items` honours `luck_add` only. So even adding `luck_sub` to these paragraphs would do nothing until the engine is extended. (Contrast `skill_sub`, which the engine already supports.)

- **§63** — «Но вы убили честного человека — потеряйте 1 УДАЧУ.» (its +10-gold reward via `auto_items.gold` *does* apply; only the УДАЧА loss is dropped).
- **§1185** — «Потеряйте 1 УДАЧУ — вы лишили радости детей.»
- **§206** — «Потеряйте 1 УДАЧУ — 193.»

---

### Finding #2 — Text-only item gates rendered unconditionally *(the gap-class the brief says prior audits missed — §5(a))*

**Severity:** **P1** for the two strongest; **P2** for the rest. **Verification:** Python sweep of every `«если у вас есть X → N»` prose branch, cross-referenced against the choice’s fields in `remake_data.js`, plus inspection of each destination to confirm it does **not** self-validate.

**Root cause.** The prose makes a branch conditional on possessing an item, but the corresponding choice carries **no `inventory_condition`** (`inventory_condition` absent ⇒ the engine renders the choice **always**, per the “without an inventory_condition the choice is always visible” path at lines 695–702). The destinations do not re-check, so a player **without** the item takes the “have-item” branch for free.

**Strongest two — the same item is correctly gated elsewhere, proving the engine knows how:**

- **§608** → ungated branch to **§728**.
  Canon: «Если у вас есть серебряный сосуд, то 728. Иначе придется биться с ними — 805.»
  Data: `§608 ch[0] → 728` with **no `inventory_condition`**. Destination **§728** is labelled «Путь свободен» and exits straight to §955 — i.e. a player with no «Серебряный сосуд» **escapes two Зелёных рыцаря (Green Knights) for free**, skipping the §805 combat.
  Proof the engine can gate it: «Серебряный сосуд» **is** gated via `inventory_condition` at **§388 (ch[1]→739), §742 (ch[1]→861), §972 (ch[2]→897), §1210 (ch[1]→556).**

- **§893** → ungated branch to **§1079**.
  Canon: «Если у вас есть золотая стрела, то 1079. Если же нет, тогда вернитесь на 980…»
  Data: `§893 ch[0] → 1079` with **no `inventory_condition`**. Destination **§1079** opens the door and routes to **§1096** — «вы входите в кабинет Барлада Дэрта» (Barlad Dert’s office) — i.e. a player with no «Золотая стрела» reaches a late-game progression node for free.
  Proof the engine can gate it: «Золотая стрела» **is** gated via `inventory_condition` at **§411 (ch[0]→1053).**

**Also verified (P2):**

- **§430** → `ch[2]→396`, no `inventory_condition`. Canon «Если у вас есть водолазный костюм, то — 396.» («Водолазный костюм» is gated **nowhere else** in the data, so this missing gate is its *only* gate.)
- **§592** → `ch[0]→653`, no `inventory_condition`. Canon «Если у вас есть ковер самолет, то 653, если нет … — 955.» («ковер самолет» is gated nowhere else either.)
- **§787** → `ch[0]→660`, no `inventory_condition`. Canon «Если у вас есть шкура оленя, то 660» (the «если же нет» branch routes to §740). Supporting evidence the engine gates this *class* of item by name: «Шкура лисы» is gated at **§345 (ch[0]→933)** and **§1201 (ch[0]→1054).**

**Confirmation that destinations never self-validate** — beyond §728’s free exit and §1079→§1096 above, **§154** (the “if you have a banana” destination from §574) actively **grants a reward**: `auto_items: {items:['Гребень из слоновой кости']}`, canon «…а в ответ тоже дарит подарок: изящный гребень из слоновой кости…». So an item-less player reaching §154 *gains* an item. This rules out “the destination handles it” for the whole class.

---

### Finding #3 — Gold-payment prose not charged; one luck reward dropped

**Severity:** **P2 / P3** (see each). **Verification:** per-paragraph inbound tracing — for each payment paragraph, all inbound choices were enumerated and checked for `gold_cost`, and the paragraph itself for `auto_items.gold_sub`.

- **§442 → §186 (hay-cart ride into the castle).** *Severity: **P2.***
  Canon §442: «Тот за небольшую плату (3 золотых) соглашается спрятать вас на одном из возов под сеном и доставить в замок.» Canon §186 opens: «Вы платите деньги и прячетесь под сеном.»
  Data: `§442 ch[0]→186` has **no `gold_cost`**; `§186` has **no `auto_items`** (no `gold_sub`). The only inbound is §442 ch[0]. ⇒ the player is **transported into the Black Castle for free**, despite both paragraphs stating a payment.

- **§937 — luck reward dropped (same class as Finding #1).** *Severity: **P2.***
  Canon: «Они поражены вашей щедростью и дают один маленький совет … Добавьте себе 1 УДАЧУ.»
  Data: `§937` correctly **charges** the gold (`auto_items: {gold_sub: 6}`) **but omits the `luck_add`**, and the inbound (§825 ch[3]) applies nothing. ⇒ the player pays the 6 gold yet is **cheated of the +1 УДАЧУ.** (The same prose also contains paragraph-arithmetic «вычтете 13 из того параграфа…», which per registry `g6`/`g25` is an inventory-token mechanic, **not** re-flagged here — only the УДАЧА loss is the bug.)

- **§873 → §767 (drink of water in the Водяной’s tavern).** *Severity: **P3.***
  Canon §767 opens: «Вы платите 2 золотых, и он подплывает к вам с пиалой…».
  Data: `§873 ch[2]→767` has **no `gold_cost`**; `§767` has **no `auto_items`**. ⇒ the water is free. (Low impact: §767 leads to a sleep-trap routing to §642 regardless, so the gold is nearly cosmetic.)

- **§825 gold-choice hub — ungated “give N gold” options.** *Severity: **P3** (softlock-class, but safe).*
  Canon §825 offers «…дать деньги женам мага. Но сколько: 1 золотой (552), 4 золотых (695), или 6 золотых (937)?». Data: `§825 ch[1]→552 / ch[2]→695 / ch[3]→937` carry **no `gold_condition`**, so a player with insufficient gold can still pick “give 6”. **Checked for softlock and found safe:** the destinations apply `gold_sub` and the engine clamps gold at 0 (no negative balance, no crash). Reported only as a minor correctness gap, not a softlock.

---

## 3. SUSPECTED (unverified / ambiguous — needs FB2 arbitration or a design call)

- **§574 → §154 (banana gate) — needs special handling, not a plain `inventory_condition`.** The gate is real and ungated (Finding #2), **but the banana is stored as a self-describing food-string** «Банан (еда: +N)» (food items live in `S.inventory` as parsed strings, ~line 1063). The engine’s `inventory_condition` uses **exact-equality** matching, so `inventory_condition:"Банан"` would **not** match the stored string. A correct fix needs substring/prefix matching or a dedicated food-check — flagged as suspected because the fix is non-trivial, not drop-in.
- **§169 (watermelon, *negative* phrasing).** Canon: «…или если у вас нет арбуза, войдете в дом, показав Хозяину свой мешок?». Both choices (§609 attack / §595 enter) are rendered unconditionally. This reads as a *narrative* justification rather than a hard branch that should *remove* an option, so it is most likely a **non-bug** — but the negative «если у вас нет» form is ambiguous against the FB2 and is left for arbitration.
- **§491 → §188 (whistle-for-gold trade).** Prose implies a «свисток» + 2 gold exchange; the consume/charge semantics are ambiguous (whether the whistle should be consumed and the gold charged). Low priority; needs FB2.
- **§1083 ch[0]→§903.** Canon «…если … у вас нет 1 золотого, поднимайтесь по лестнице (603)…» implies the throw-option needs ≥1 gold; `ch[0]` lacks `gold_condition`. Harmless in practice (§903 has `gold_sub:1`, gold clamps at 0), so suspected-minor.

---

## 4. CONFIRMED NON-BUGS (checked this cycle — do not re-open)

- **Checklist #7 — link/target integrity & reachability: CLEAN.** Full navigation graph built from `choice.target` + `riddle.valid_targets`/`fail_target`: **0 bad targets, 0 non-integer targets.** 1168/1221 reachable from §1; the 53 unreached are a **subset** of registry `group_29`’s 54 intentional mechanic-entry orphans (the set **shrank** — §1188 is now reachable — i.e. no regression, **0 genuine new orphans**). Cosmetic FB2 typos §416 “1366” / §849 “1830” route correctly to §366 / §830 and were not re-flagged.
- **Gap-class #5(b) — per-paragraph spell tags: CLEAN.** **0 untagged spell-offers**: every paragraph whose prose offers a spell carries either `spell:"X"` or a `заклят…`-keyword label, so the charge is spent. The `combat_mod` pre-cast bridges (FORCE/WEAKNESS/PLAYER_MINUS2) spend the charge **upstream at the source choice** via the `spell:` tag — verified as correct two-hop chains §235→404→235, §208→308→1175, §1126→751→260, and §39 (PLAYER_MINUS2 for a reflected WEAKNESS). Paragraphs that *narrate* «Вы накладываете заклятие…» as an accomplished fact are **destinations** (charge already spent at the inbound choice) — not bugs (e.g. §134/§137/§140/§233/§262/§368/§436/§528/§643/§645/§836). §329’s «Если у вас есть заклятие» branch (→ §432) carries `spell:"LEVITATION"`, so the navigation-cast self-gates on the remaining charge — **non-bug.**
- **Checklist #2 — combat / luck / spell mechanics: CLEAN** (combat harness, `_trace3.js`):
  - per-enemy damage override honoured: §240 `damage:3` ⇒ exactly −3; §36 `damage:4` ⇒ −4.
  - **par-on-tie**: equal СИЛА УДАРА ⇒ enemy HP and player ВЫНОСЛИВОСТЬ both unchanged.
  - **multiple enemies**: on a player loss, damage = **sum of all alive enemies’** damage (3 enemies ⇒ −6); on a player win, only `enemies[0]` is wounded (−2), enemies[1..] untouched — matches the rulebook (brief §3.2, «… можете ранить только вашего непосредственного противника» — preface text, not mirrored in `book_text.md`).
  - **§532 `combat_condition:"wound_2"`**: code-verified at `combatRound` ~line 1737 — at `cs.wounds>=2` the engine appends a working button (label = `ch.label`) to `btn-combat-round.parentElement` and routes to `ch.target` (§437). (An earlier harness “button not found” was a DOM-stub detection artifact, not an engine fault.)
  - **flee −2**: code-verified at `renderChoice` ~line 1134 — a combat-context choice whose label matches `/убежать|бежать|отступить|покинуть|сбежать|спастись бегством|бегство/i` applies `S.stamina = max(0, S.stamina−2)`, implementing the rulebook’s flee rule (brief §3.2, «… в случае вашего бегства последний удар остается за врагом» — preface text, not mirrored in `book_text.md`, which contains paragraphs only).
  - **luck**: `doScriptedLuckCheck` (~1247) rolls `d6()+d6()`, lucky iff `≤ S.luck`, then `S.luck = max(0, luck−1)` — canon-correct.
- **Checklist #6 — flask / backpack / food / capacity: CLEAN.** §132 fully wired (`grants_bag_size:9`/`gold_cost:7`; flask refill 4/2/0 gold; food eat-now vs take-along). Capacity read everywhere via `getBagSize()`/`S.bagSize` (no hard-coded 7); flask = 2 sips × +2 capped at max; food occupies 1 slot and heals only outside combat; gold and weapons do **not** occupy slots; `normalizeSave` backfills `bagSize` (≥7). The only sword *item* is «Целый меч» (quest item, §553/§757 grant, §135/§1003 gate); the starting sword is never an inventory entry.
- **Checklist #8 — state persistence: CLEAN.** Every persistent `S.<field>` the engine reads is set in `initState` or backfilled in `normalizeSave`. `pending_combat_buff` is the lone field not in `normalizeSave`, but it is initialised in `initState` and guarded at every read — **P3 cosmetic only** (an old save cannot crash a new build).
- **Registry `g1` gold-signs: CONFIRMED FIXED.** §552/§686/§695/§903 now correctly use `gold_sub`; §937’s gold is correct (its **luck** omission is Finding #3, a different field).

---

## 5. Counts & highest-confidence finding

**Findings tallied at finding-granularity** (paragraph counts in parentheses):

| Severity | Count | Items |
|---|---|---|
| **P0** | **0** | — none — no crash, softlock, or unwinnable state found; the §825 all-gold-gate softlock candidate was checked and is safe (gold clamps at 0). |
| **P1** | **3** | #1-A dropped stamina losses (45 paragraphs); #1-C dropped skill losses (7); #2-strong ungated item gates §608 + §893. |
| **P2** | **6** | #1-B dropped stamina gains (5); #1-D dropped luck losses + engine `luck_sub` gap (7); #2-medium §430/§592/§787; #2-nuanced §574 (food-string); #3 hay-cart §442/§186; #3 luck-reward §937. |
| **P3** | **2** | #3 free water §873/§767; #3 ungated gold-hub options §825. |

**Single highest-confidence finding: Finding #1 — deterministic entry stat-changes are silently dropped.** It is the strongest because it was proven *behaviourally* by a harness that was first validated on known controls (§25, §1122), then reproduced **delta = 0 across 64 paragraphs** where canon mandates a change. The single most consequential instance is **§908** — «потеряйте 16 ВЫНОСЛИВОСТЕЙ» — whose dropped loss also neutralises a canonical death-check (the §605 death branch becomes unreachable).

---

## 6. Not verified (coverage gap to close in a future cycle)

- **Character creation & the 10-spell budget (§3.1, §3.4).** `src/game_shell_top.html` was not available to this session. Initial МАСТЕРСТВО 7–12 / ВЫНОСЛИВОСТЬ 14–24 / УДАЧА 7–12, the “≤ 10 casts total, each spell once” budget, and the rules screen are **unverified here.** Re-run with that file attached.
- **FB2 as final arbiter.** All canon quotes are from `book_text.md`; the brief designates `assets/fb2_remake.fb2` as the final arbiter. The two ambiguous items (§169 negative phrasing; §491 trade semantics) specifically want FB2 confirmation before action.
