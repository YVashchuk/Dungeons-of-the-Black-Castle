# Verification Summary — 2026-06-05 correctness re-audit

**Verifier:** Claude (this chat), against `src/remake_data.js` + `assets/fb2_remake.fb2`
(final arbiter) + `src/game_logic.js` + Python prose↔data cross-reference. Registry
baseline: `text_corrections.json` v2.59, 31 groups. **No code changed** — this is the
verification gate before any implementation cycle.

Five reports were returned (this folder). Per the brief, every report was checked,
not skimmed.

---

## Per-report verdict

| Report | Provider | Verdict | Verifiable correctness findings |
|---|---|---|---|
| `AUDIT_claude_2026-06-05_FINAL.md` | Claude Opus 4.8 | **AUTHORITATIVE — every finding independently re-verified TRUE** | Yes — see backlog below |
| `AUDIT_claude_2026-06-05_v1.md` | Claude Opus 4.8 | Superseded by FINAL (same findings minus the char-creation/§169/§491 items the renew added) | (subsumed) |
| `deep-research-report_chatgpt.md` | ChatGPT 5.5 | **OFF-BRIEF** — delivered a product/strategy/migration review, not a correctness audit; did **not** read `remake_data.js` or the FB2 | **None** (0 paragraph-level findings) |
| `Gemini_data-code-analysis.pdf` | Gemini 3.5 Flash | Competent **architecture summary** (stat/combat/luck math + engine behaviours are accurate); not a paragraph-level audit; cites only `README.md` | **None** |
| `Gemini_art-coverage_OUT-OF-SCOPE.pdf` | Gemini (unknown) | **Out of scope** (art coverage + map UX) **and partly confabulated** | **None** — see note |

**Gemini confabulation evidence:** the art PDF "quotes" §1 as «…ты отправляешься в
путь… обитель злого мага Барлада…». The real §1 (FB2/`remake_data.js`) is «Вы быстро
идете вперед и вскоре оказываетесь в лесу.» Its "verbatim scene descriptions" cannot be
trusted. (It did, however, correctly echo stop-list facts: antagonist «Барлад», the
group_24 fabricated-metrics rejection, §38/§41/§311/§449/§1003 statuses.)

**Bottom line:** only the Claude report performed the requested audit. ChatGPT and both
Gemini reports contributed **no verifiable correctness findings**. (Their operational
observations — doc drift, localization architecture, PWA/`localStorage` baseline — are
real but out of this cycle's scope.)

---

## VERIFIED bug backlog (Claude's findings, all re-confirmed by independent check)

Each line below was re-verified: canon mandates the effect (FB2) **and** the data lacks
the field. Ready for an implementation cycle (pending Yuriy's go-ahead; the `luck_sub`
item needs an engine decision).

### A. Dropped deterministic entry stat-changes — 64 paragraphs *(P1/P2)*
Engine applies entry effects only via `auto_items`; these paragraphs narrate a change
but carry no matching key. Handlers `stamina_sub` / `stamina_add` / `skill_sub` **exist**
(pure data gaps); `luck_sub` **does not exist** (needs engine work).

- **45 stamina losses** (add `auto_items.stamina_sub:N`): §92(1) §102(5) §107(2) §109(1)
  §126(3) §222(4) §294(6) §304(3) §322(2) §347(3) §392(2) §407(4) §440(2) §464(2) §468(4)
  §477(6) §514(2) §532(4) §558(4) §559(3) §653(2) §656(4) §698(1) §701(2) §721(1) §733(2)
  §760(1) §762(2) §813(2) §840(5) §848(2) §852(3) **§908(16)** §925(3) §965(2) §970(2)
  §998(4) §1024(7) §1068(1) §1117(5) §1118(2) §1152(3) §1174(2) §1194(2) §1199(4).
  **§908 is highest-impact:** the dropped −16 makes the §605 death-check unreachable
  (player always survives to §1007).
- **5 stamina gains** (add `stamina_add:N`): §635(4) §680(8) §683(5) §691(4) §872(5).
- **7 МАСТЕРСТВО losses** (add `skill_sub:1`): §263 §478 §543 §626 §776 §843 §896.
- **7 УДАЧА losses** — **needs engine `luck_sub` handler first**, then `luck_sub:1`:
  §63 §206 §217 §446 §486 §939 §1185.

### B. Text-only item gates rendered unconditionally — 5 *(P1/P2)*
Prose gates the branch on an item, but the choice has no `inventory_condition`, so the
"have-item" branch shows for everyone. Each item is gated correctly elsewhere (or the
canon spells out the «иначе» fallback), so the engine is capable — pure data gap.

- **§608 ch→728** needs `inventory_condition:'Серебряный сосуд'` (else free escape from 2 Зелёных рыцаря; gated at §388/§742/§972/§1210).
- **§893 ch→1079** needs `'Золотая стрела'` (else free progress toward Barlad's office; gated at §411).
- **§430 ch→396** needs `'Водолазный костюм'` (its only gate).
- **§592 ch→653** needs `'Ковер самолет'` (canon: «если нет … 955»).
- **§787 ch→660** needs `'Шкура оленя'` (canon: «если же нет … 740»).

### C. Uncharged gold / dropped luck reward — 4 *(P2/P3)*
- **§442 ch→186** needs `gold_cost:3` (free hay-cart ride into the castle; canon §186 «Вы платите деньги…»). *P2.*
- **§937** charges gold (`gold_sub:6`) but **omits `luck_add:1`** (canon «Добавьте себе 1 УДАЧУ»). *P2.*
- **§873 ch→767** needs `gold_cost:2` (free water; canon §767 «Вы платите 2 золотых»). *P3.*
- **§825 ch→552/695/937** lack `gold_condition` (give-gold options selectable with insufficient gold; **safe** — gold clamps at 0). *P3.*

### D. §491 whistle trade — item not consumed + gold not charged *(P2, FB2-arbitrated)*
FB2 §491: accepting means «отдать деньги и свисток». The accept branch **§491 ch→188**
has no `consume_on_use` and no `gold_cost`, and §188 grants nothing ⇒ player keeps the
whistle and the 2 gold. Because **§725 ch→142** re-gates on `'Золотой свисток'`, the
un-consumed whistle is **duplicated** (spent at §491, still satisfies §725). Fix: add
`consume_on_use:'Золотой свисток'` + `gold_cost:2` to §491 ch→188. (Entry gate §535
ch→491 and grant §311 are correct.)

### Severity tally (verified)
**P0:** 0 · **P1:** 3 clusters (45 stamina losses; 7 skill losses; §608+§893) · **P2:** 7
(5 stamina gains; 7 luck losses + engine gap; §430/§592/§787; §442; §937; §491) · **P3:** 2
(§873; §825).

---

## Design calls (not blocked on data — Yuriy decides)
- **`luck_sub` engine handler.** Needed before the 7 УДАЧА losses can be honoured
  (`auto_items` currently honours `luck_add` only). Architectural → Yuriy.
- **§574→§154 banana gate.** Real ungated gate, but the banana is stored as a
  self-describing food string «Банан (еда: +N)»; `inventory_condition` uses exact
  equality, so a plain gate won't match — needs substring/food-aware matching.
- **§1083 ch→903** lacks `gold_condition:1`; harmless (gold clamps at 0). Optional.

## Confirmed NON-bugs this cycle (do not re-open)
Char-creation + the exactly-10 spell budget; §169 watermelon (FB2: two unconditional
choices); link/target integrity (0 bad targets, 1168/1221 reachable, the 53 unreached ⊂
group_29's 54 intentional mechanic-entries, 0 new orphans); per-paragraph spell tags (0
untagged); combat/luck mechanics (§240 `damage:3`, §36 `damage:4`, par-on-tie, multi-enemy
sum, flee −2); flask/backpack/food incl. §132 7→9; state persistence; `g1` gold-signs.

---

## Recommended next step
Authorize an **implementation cycle** for backlog A–D. Suggested batching: (1) data-only
adds A-stamina + A-skill + B + C + D in scoped per-paragraph edits with a Node
entry-effects harness + full regression; (2) a separate small engine change for `luck_sub`
+ the 7 УДАЧА paragraphs; (3) defer §574 (food-string) and §1083 as design calls. Each
batch validated (harness + "only intended paragraphs changed") before commit; Yuriy pushes.
