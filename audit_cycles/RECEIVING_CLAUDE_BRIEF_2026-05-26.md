# Brief for the Re-Audit **Verification** Session (fresh Claude)

> **Paste this whole document as the first message of a new Claude session,**
> together with the two re-audit reports (ChatGPT balance + Gemini art-coverage).
> This brief is for the Claude that **receives and verifies** those reports —
> not for the provider LLMs that generate them (their instructions live in
> `_handoff/SESSION_SUMMARY_2026-05-26.md` -> "Re-audit launch instructions").
>
> **One-line job:** treat both reports as *hypotheses*, verify each finding
> against canon + code, then close only the genuinely-valid ones with commits.

---

## 0. The single most important instruction

**Nothing from an audit report goes into the code on trust.** Every finding
passes the same funnel before any commit:

1. **Canon check** - does `assets/fb2_remake.fb2` actually say this? (Quote the line.)
2. **Code check** - what does `src/remake_data.js` / `src/game_logic.js`
   actually do today? (The bug may already be fixed.)
3. **Behavioural check** - for engine logic, prove it with a Node harness
   (`node --check` + a stubbed-DOM test that exercises the path), not by eye.

Only after all three -> commit. This is not bureaucracy: across this project's
audit history, **external audits have misclassified 5+ times**, and the most
recent working session found **5 "open" notes that were already-completed work**.
Skipping the funnel means committing fixes for non-bugs.

---

## 1. Project state (as of 2026-05-26)

- **Game:** "Подземелья Чёрного замка" - single-file HTML PWA adaptation of
  D. Braslavsky's 1991 Russian gamebook. **1221 paragraphs.**
- **Repo HEAD:** `2ad9994`. Working tree clean, fully pushed (`main...origin/main`).
- **Registry:** `assets/text_corrections.json` at **v2.38**.
- **Backlog:** **0 genuinely-pending items.** The entire ChatGPT/Gemini/user
  audit backlog (registry groups 1-20) is closed. `node --check` passes on both
  source files.
- **There are currently no known open *code* bugs.** The re-audit is a fresh
  diagnostic sweep to find anything missed - expect mostly P3 design-notes and
  art-coverage gaps, not P0s.

### Sources of truth (authority order)
| Domain | Authoritative file | Note |
|--------|-------------------|------|
| Canon text | `assets/fb2_remake.fb2` | The 1221-paragraph remaster. **Final arbiter** for any narrative/mechanic claim. |
| Game data | `src/remake_data.js` | `const GD = {...}` keyed by paragraph. Single long line. |
| Engine | `src/game_logic.js` | All combat/luck/spell/riddle/shop logic. |
| Art mapping | `src/mj_art.js` (`MJ_MAP`) | **Source of truth for art.** |
| B&W fallback | `src/illustrations.js` (`ILLUST_MAP`) | **Second art layer** - any coverage count must account for BOTH. |
| Audit ledger | `assets/text_corrections.json` | History + closed findings. Read before acting. |

---

## 2. Do NOT re-flag these - they are DONE (verified this session)

These keep getting raised by audits and by skim-reads of the registry because a
description's *opening sentence* was written pre-implementation. **All are
implemented, committed, and behaviourally verified.** If a report lists any of
these as a bug, that finding is **stale - reject it**.

1. **§992 second-riddle chain** - DONE. `group_18_letter_sum_riddle`,
   `status:"closed"`. Engine: `applyRiddleAnswer`/`handleRiddleFail`/`renderRiddle`.
   Verified: «кладбище»=76 +916 => §992; «смерть»=107 +825 => §932; 9/9 Node
   assertions; exactly two input-riddles exist in canon (§1131, §992), zero
   unwired. (commit `b6cd0cb`, verified `2ad9994`)
2. **Bronze-whistle name rationalization + post-combat loot** - DONE. All grants
   use canonical «Бронзовый свисток»/«Медный ключик» via the `acquires` field on
   post-combat win-choices (§58/§69/§233/§250/§567/§717). `group_12`.
3. **group_6 dynamic-target / arithmetic items + followups** - DONE. 13/13 items;
   the six renames (thread_ball, figured_key, bear_key, spell_book, white_arrow,
   candle_set) carry `modifier_history`; emerald_ring/bandit_tip closed; +910/+916
   resolved (the +916 is the riddle above).
4. **§436 spider fight (all branches)** - DONE.
   - per-hit damage canon, `damage:4` trader §36 etc. (`1301c23`)
   - combat-modal spell allowlist (`f68caae`)
   - `sec436_pre_luck`: luck roll, lucky=>§456 equal-terms, unlucky=>tree fight
     -1 + Force(526)/Weakness(448) (`b1f5278`)
   - Force round-trip: single cast + canonical **+1** via persistent
     `S.sec436_force` flag (`478f0a5`)
5. **group_17 spell hooks (9 player-cast fixes) + group_19 combat-modal
   FORCE/WEAKNESS** - DONE & independently re-verified (`082cdb8`, `ba13de5`).

Also genuinely-resolved-but-historical (don't mistake the prose for open work):
group_11 silver bracelet (shop-gated), group_17 figurine key (§1208 gated).

### Known **non-bugs** (audits love these false positives)
- §38 art27_monkey and §41 art15_prison are **correct** (prior audit false positives).
- The "radio static" at §372 is the **opt-in global ambience toggle**
  (`amb_dungeon.ogg`, default off), not a paragraph bug. A poor placeholder
  track, not corruption.
- §240 snakes already correctly carry `damage:3`. §506=[COPY], §950=[FORCE]
  combat allowlists are intentional.

---

## 3. What the two reports are expected to cover

**ChatGPT (balance):** shop economy (§340, 9 items, start gold 15), combat
damage outliers (engine default `enemy.damage`=2 - find canon-non-default that
data left at default), spell economy (8 spells, budget 10 - re-value now that
all hooks + combat-modal work), inventory over-equip breakpoints. Balance tweaks
should arrive flagged **P3 design-note**, not P0.

**Gemini (art coverage):** colour-art vs B&W-only vs no-illustration counts
(account for BOTH `MJ_MAP` and `ILLUST_MAP`), theme clustering by play-time
density, top candidates with ready Midjourney prompts (art_catalog.py style:
`--ar 3:2 --stylize 250 --v 6`), and prioritising the 14 legacy B&W scans (esp.
the 4 "Victorian engraving" outliers §36/§70/§83/§333+§600).

> WARNING: A previous "visual coverage audit" was **entirely confabulated** (it
> invented a sci-fi/Shakespeare game world - "Nautilus", Dunsinane, robots -
> absent from the book; per-paragraph descriptions didn't match real §-text). If
> any art report describes paragraph content, **spot-check 3-4 §-numbers against
> `remake_data.js` before trusting the whole report.** If they don't match, the
> report is fabricated - reject wholesale.

---

## 4. Verification playbook (how to actually check, on this machine)

The repo lives at `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle`.
Tooling that works here (hard-won):

- **Read/grep Cyrillic data:** Python with `-X utf8`. PowerShell `Select-String`
  renders Cyrillic as mojibake and can't match inside the single-line JSON.
- **Parse data:** `GD = json.loads(re.match(r'\s*const\s+GD\s*=\s*(\{.*\})\s*;?\s*$', raw, re.S).group(1))`.
- **Edit data safely:** per-paragraph reserialize (parse one object, mutate,
  `json.dumps(..., ensure_ascii=False, separators=(',',':'))`, splice back). A
  round-trip is byte-identical, so every other paragraph stays untouched. Never
  hand-edit the single-line file.
- **Edit registry safely:** `json.dumps(tc, ensure_ascii=False, indent=2)` with
  **no** trailing newline reproduces the file exactly.
- **Engine self-check:** `node --check src/game_logic.js` (Node is available).
  For logic, extract the function into a Node harness with stubbed
  DOM/`S`/`goTo` and assert behaviour. **Important:** real `goTo()` resets
  `sectionPrepState={}` on every navigation - mirror that in harnesses or you'll
  get false passes. Persistent per-playthrough flags live on `S` (backfilled in
  `normalizeSave`), like `shopBought`/`riddle_attempts`/`sec436_force`.
- **FB2 search:** strip tags (`re.sub(r'<[^>]+>',' ',fb)`), collapse whitespace,
  substring-search. **Read a generous window** (>=600 chars) - a truncated read
  caused a false "§250 has no whistle" conclusion this session.

### Commit discipline
- Helper scripts + `git` via Python/PowerShell (PowerShell heredocs fail on
  Cyrillic). Non-ASCII commit messages: `git commit -F msgfile.txt`.
- **`git commit -F` reliably times out *after* succeeding** - verify with
  `git log --oneline -1`, never double-commit.
- One logical fix per commit; engine+data for the same fix can share a commit.
- **The user performs every `git push`.** Never push.
- Confirm `git status --short` shows only intended files; review
  `git diff --word-diff` before staging.
- Record every closed finding in `text_corrections.json` (new group or
  subgroup) with an FB2 quote + commit ref, and bump `version_history` +
  `last_updated`. The ledger is the project's source of truth and prevents
  re-flagging.

---

## 5. Suggested working order for the verification session

1. Read `assets/text_corrections.json` (esp. the v2.x `version_history` and the
   §2 stale-note list above) so you don't re-open closed work.
2. **Art report first** if Gemini's: cheap to spot-check (3-4 §-numbers) and, if
   fabricated, saves time. Art findings are mostly Yuriy's Midjourney/Photoshop
   queue, not code.
3. **Balance report:** run each finding through the funnel. Damage/allowlist
   outliers are data-only, low-risk (mechanisms already exist - `enemy.damage`,
   `combat_spells_allowed`, `player_attack_mod`). Economy/spell *re-balance*
   numbers are P3 design-decisions -> present to Yuriy, don't auto-commit.
4. Batch valid data-only fixes into themed commits; keep engine changes separate
   and harness-tested.
5. End with a short report to Yuriy: valid-and-fixed / rejected-as-stale /
   deferred-to-Yuriy (art, design-balance, font licensing, mobile, playtest).

---

## 6. Out-of-scope for code (Yuriy's queue - don't try to "fix" these)
- **Midjourney regen:** §449 two-headed dragon (BROKEN - single head), §1003
  stone rats (off-context), §311 missing art, + the 14 legacy B&W replacements.
  Prompts ready in `audit_cycles/art_prompts_may_2026/`.
- **Needs user:** manual victory-path playtest; mobile audit (§340 = 12 shop
  buttons, heavy scroll); font licensing (Veles Redone).
- **On request only:** map_module.js enrichment, PWA manifest/ServiceWorker,
  English localisation, audio polish.

---

### TL;DR for the receiving Claude
Reports are hypotheses. Verify each against `fb2_remake.fb2` + the actual code +
(for logic) a Node harness. The §2 list is already done - reject any finding
that re-raises it. Spot-check art reports for fabrication. Commit only verified
fixes, one logical change each, record them in the ledger, and let Yuriy push.
