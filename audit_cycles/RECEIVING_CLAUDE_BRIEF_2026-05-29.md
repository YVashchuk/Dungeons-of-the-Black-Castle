# Brief for the Re-Audit **Verification** Session (fresh Claude) — v2.49 / 2026-05-29

> **Paste this whole document as the first message of a new Claude session,**
> together with the provider reports you are about to verify (ChatGPT / Claude /
> Gemini research outputs). This brief is for the Claude that **receives and
> verifies** those reports — not for the provider LLMs that generate them
> (their briefs are the three `PROVIDER_BRIEF_*_2026-05-29.md` files).
>
> **One-line job:** treat every report as a set of *hypotheses*, run each finding
> through the canon→code→harness funnel, and close only the genuinely-valid ones
> with commits.

---

## 0. The single most important instruction

**Nothing from a report goes into the code on trust.** Every finding passes the
same funnel before any commit:

1. **Canon check** — does `assets/fb2_remake.fb2` actually say this? (Quote the line.)
2. **Code check** — what does `src/remake_data.js` / `src/game_logic.js` do *today*? (The bug may already be fixed.)
3. **Behavioural check** — for engine logic, prove it with a Node harness (`node --check` + a stubbed-DOM test), not by eye.

Only after all three → commit. This is not bureaucracy. Across this project's
history, **external audits have misclassified 8+ times**. This very cycle began
with an external "topological analysis" PDF whose 7-of-8 specific claims were
fabricated, and three separate research reports were initially over-dismissed by
association before per-claim verification recovered two real bugs from them.
**Run the funnel on every claim. Do not dismiss a cluster wholesale, and do not
trust a cluster wholesale.**

---

## 1. Project state (as of 2026-05-29)

- **Game:** "Подземелья Чёрного замка" — single-file HTML PWA adaptation of
  D. Braslavsky's 1991 **Russian-language** gamebook. **1221 paragraphs.**
  The game text is and remains **Russian**; only inter-session communication is English.
- **Repo HEAD:** `44818a0`. Working tree clean, fully pushed (`main...origin/main`).
- **Registry:** `assets/text_corrections.json` at **v2.49**, **30 groups**
  (`group_1` … `group_30`).
- **Backlog:** **0 known open code bugs.** Verified three independent ways this
  cycle (research reports, topology graph, full reachability audit). The re-audit
  is a fresh diagnostic sweep — expect mostly P3 design-notes, not P0s.
- **Docs are now synced to reality** (group_26/27/30). `book_text.md`'s
  corrections-log, `README.md` stats, and `PROJECT_NOTES.md` no longer carry the
  stale "TODO" markers that caused repeat false-positives. `docs/GRAPH_AUDIT.md`
  carries a "HISTORICAL / superseded" banner.

### Sources of truth (authority order)
| Domain | Authoritative file | Note |
|--------|-------------------|------|
| Canon text | `assets/fb2_remake.fb2` | 1221-paragraph remaster. **Final arbiter** for any narrative/mechanic claim. |
| Canon text (AI-friendly) | `assets/book_text.md` | MD mirror of the FB2 **prose** (1:1, 1221 paragraphs). ⚠ Its per-paragraph `**Выборы:**` machine-lists are STALE (exported from an older data file) — do NOT treat those lists as current; use `remake_data.js`. |
| Game data | `src/remake_data.js` | `const GD = {...}` keyed by paragraph. Single long line. |
| Engine | `src/game_logic.js` | All combat/luck/spell/riddle/shop logic. |
| Art mapping | `src/mj_art.js` (`MJ_MAP`) | Colour-art source of truth. |
| B&W fallback | `src/illustrations.js` (`ILLUST_MAP`) | Second art layer — any coverage count must use BOTH. |
| Audit ledger | `assets/text_corrections.json` | History + closed findings. Read before acting. |

---

## 2. Do NOT re-flag these — they are DONE & verified

If a report raises any of these, it is **stale — reject it** (cite the registry group).

**From earlier cycles (still true):**
1. **§992 second-riddle chain** — DONE (`group_18`, verified v2.38). «кладбище»=76+916→§992; «смерть»=107+825→§932.
2. **Bronze-whistle naming + post-combat loot** — DONE (`group_12`).
3. **group_6 arithmetic items + renames** — DONE. §13 fish & §140 gold-key were re-architected from "+N arithmetic" to **reusable inventory tokens** ("Помощь рыбки"; "Золотой ключ" with static §1085 gating). The arithmetic approach is intentionally abandoned.
4. **§436 spider fight (all branches)** — DONE (luck-escape→§456, Force round-trip +1 via `S.sec436_force`, allowlists).
5. **group_17 spell hooks + group_19 combat-modal FORCE/WEAKNESS** — DONE.

**New this cycle (groups 21–30):**
6. **§562 self-loop** — FIXED (`group_25`, commit 4573325). Pay-choice now → §315 (+gold gate), was target:562.
7. **§140 gold-key grant** — FIXED (`group_25`). `auto_items` now grants "Золотой ключ".
8. **F2 free-payment clusters** — FIXED (`group_21`). 15 choices across 11 paragraphs (§2/§463/§548/§564/§49/§630/§658/§785/§1092) now gold-gated; §745 double-charge removed; §1092/§630 upstream pay-choices gated so no death-screen (`group_21` Variant A).
9. **F8 golden necklace** — FIXED (`group_22`). §984 grants it; §972 ch[3] gated+consumed.
10. **§972/§746 dark-room offers** — FIXED (`group_23`). §746 grants Подсвечник/Кнут/Верёвка (restored the §464→§530 rope path); §972 ch[0/1/2] gated; ch[0] label corrected.
11. **§1128 "night re-trigger / infinite stamina"** — VERIFIED NOT A BUG (`group_28`). The path is a strict forward chain; rest nodes are acyclic; §1128(+2) and §15→§453(+3) are two distinct canonical nights. Adding a once-only flag would WRONGLY block the second legitimate rest.
12. **"54/55 unreachable paragraphs"** — NOT BUGS (`group_29`). Full reachability audit: 1167/1221 reachable by static `choice.target`+riddle edges; the other 54 are intentional conditional/arithmetic-mechanic entries (bird-guide −50, speaking-house riddle +50, password/star/key/candle/amulet inventory-gates, post-combat-win). Wiring them as plain choices would BREAK the gating.

**External-source confabulations already rejected (`group_24`):** the
symbiont.games "topology PDF" claims — max-index 1366, 145 missing numbers, 1233
logical nodes, BFS-depth 222 (actual 31), longest-path 211, "§18→23 hidden from
parser" (§18 is correctly wired →23/→124), "§86 cut content" (indeg=1). All
fabricated or refuted; the PDF analysed a simplified fan-map (`.gv`), not the code.

### Known **non-bugs** (audits love these false positives)
- §38 art27_monkey and §41 art15_prison are **correct**.
- §372 "radio static" is the **opt-in ambience toggle** (`amb_dungeon.ogg`, default off).
- §240 snakes correctly carry `damage:3`. §506=[COPY], §950=[FORCE] allowlists intentional.
- §416 "Вернитесь на 1366" and §849 "на второй — 1830" are **FB2 body-text typos**; the `choices` already route correctly to §366/§830. Cosmetic only — do not "fix" the routing.

---

## 3. Verification playbook (this machine)

Repo: `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle`. Hard-won tooling:

- **Cyrillic:** Python with `-X utf8` in a **`.py` file**, run via PowerShell. Never inline Cyrillic/regex in `python -c` from PowerShell (the shell mangles `"`, `[`, `\`), and never `Select-String` the single-line JSON (mojibake).
- **Parse data:** `GD = json.loads(re.match(r'\s*const\s+GD\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S).group(1))`.
- **Edit data safely:** per-paragraph reserialize (parse one object, mutate, `json.dumps(..., ensure_ascii=False, separators=(',',':'))`, splice back) — byte-identical round-trip; never hand-edit the single-line file.
- **Edit registry safely:** `json.dumps(tc, ensure_ascii=False, indent=2)` with **no** trailing newline.
- **Engine self-check:** `node --check src/game_logic.js`. For logic, extract the function into a Node harness with stubbed DOM/`S`/`goTo`. **`goTo()` resets `sectionPrepState={}` on every navigation** — mirror that or you get false passes. Persistent per-run flags live on `S` (backfilled in `normalizeSave`): `shopBought`, `riddle_attempts`, `sec436_force`.
- **FB2 search:** strip tags, collapse whitespace, read a **≥600-char** window (a truncated read once produced a false "§250 has no whistle").

### Commit discipline
- Non-ASCII commit messages via `git commit -F msgfile.txt`. **`git commit -F` reliably times out *after* succeeding** — verify with `git log --oneline -1`, never double-commit.
- One logical fix per commit; engine+data for the same fix can share a commit.
- **Yuriy performs every `git push`. Never push.**
- Review `git status --short` + `git diff --word-diff` before staging.
- Record every closed finding in `text_corrections.json` (new group) with an FB2 quote + commit ref; bump `version_history` + `last_updated`.

---

## 4. Working order

1. Read `assets/text_corrections.json` `version_history` + the §2 stop-list so you don't re-open closed work.
2. **Spot-check each report for fabrication first** (3–4 §-numbers vs `remake_data.js`). If scene/paragraph descriptions don't match, the report is confabulated — reject wholesale and say so.
3. For surviving findings, run the funnel. Data-only fixes (damage/allowlist/gating) are low-risk; **economy/spell re-balance numbers are P3 design decisions → present to Yuriy, don't auto-commit.**
4. Keep engine changes separate and harness-tested.
5. End with a short report: valid-and-fixed / rejected-as-stale-or-confabulated / deferred-to-Yuriy.

---

## 5. Out-of-scope for code (Yuriy's queue)
- **Midjourney regen:** §449 two-headed dragon (renders single head), §1003 stone rats (off-context), §311 missing art, legacy B&W replacements. Prompts in `audit_cycles/art_prompts_may_2026/`.
- **`book_text.md` `Выборы:` regeneration** from current `remake_data.js` (flagged `group_30`) — removes the last stale-data surface; medium effort, not yet done.
- **Live playthrough validation** §1→§1220 (dice/stats/inventory/combat/luck vs text) — to be done via ChatGPT Agent Mode next.
- **Needs user:** mobile audit, font licensing, PWA HTTPS deploy.

---

### TL;DR
Reports are hypotheses. Spot-check for fabrication, then funnel every surviving
claim (canon → code → Node harness). The §2 list is done — reject re-raises with
a registry cite. Commit only verified fixes, one logical change each, record in
the ledger, and let Yuriy push. The game is Russian; keep quoted text in Russian.
