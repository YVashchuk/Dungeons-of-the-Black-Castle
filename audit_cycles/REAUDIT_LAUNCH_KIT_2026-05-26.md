# Re-Audit Launch Kit (provider prompts + upload checklist) — 2026-05-26

This is what to run BEFORE the verification session. Two independent diagnostic
audits, one per provider. Run them in **parallel**. Neither LLM should edit
code — they produce **reports only**. Bring both reports + the
`RECEIVING_CLAUDE_BRIEF_2026-05-26.md` into a fresh Claude session for the
canon->code->harness verification.

Repo: `C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle`

---

## AUDIT A.1 — ChatGPT (Deep Research mode, NOT Agent) — BALANCE

### Files to upload (4)
1. `src/remake_data.js`            (~973 KB — game data, all 1221 paragraphs)
2. `src/game_logic.js`             (~105 KB — engine: combat/luck/spell/shop)
3. `assets/text_corrections.json`  (~159 KB — audit ledger; what's already fixed)
4. `assets/fb2_remake.fb2`         (~904 KB — canonical 1221-paragraph text)

> All four are normal text/JSON and upload fine. No extraction needed.

### Prompt to paste
```
You are auditing the BALANCE of a single-file HTML gamebook engine — a Russian-
language adaptation of D. Braslavsky's 1991 "Dungeons of the Black Castle"
(1221 paragraphs). This is a DIAGNOSTIC audit: produce a report only, do NOT
rewrite code.

I've uploaded: remake_data.js (game data, `const GD={...}` keyed by paragraph),
game_logic.js (engine), text_corrections.json (the ledger of already-applied
fixes — read it so you don't re-flag closed items), and fb2_remake.fb2 (the
canonical text — the final authority for any "the book says X" claim).

Analyse these four balance dimensions and report findings:

1. SHOP ECONOMY — §340 sells 9 items; the player starts with 15 gold. Map the
   purchase options and gold sources/sinks. Are there dominant strategies or
   balance-breakers (an item that trivialises the game, or gold inflation/
   starvation)?

2. COMBAT DAMAGE — the engine computes per-hit enemy damage as
   `dmg = enemy.damage || 2` (default 2). Find paragraphs where the FB2 canon
   specifies a NON-default per-hit damage ("вычитайте не 2, а N ВЫНОСЛИВОСТИ")
   but the data left it at the default. (Known-correct examples already fixed:
   §240 snakes damage:3, §36 trader damage:4 — find any others still wrong.)
   Quote the FB2 line for each.

3. SPELL ECONOMY — there are 8 spells; the player picks a budget of 10 casts at
   character creation. All combat-modal spells (FORCE/WEAKNESS/COPY) and the
   ~50 narrative spell-hooks are now wired. Re-value each spell by how many
   paragraphs actually use it. Are ILLUSION and HEALING still poor value? Is any
   spell a must-pick? Recommend rebalancing or a character-creation warning IF
   warranted (flag these as design-notes, not bugs).

4. INVENTORY ECONOMY — with the shop plus post-combat item pickups, is the
   player over- or under-equipped at key difficulty breakpoints?

OUTPUT FORMAT (important — this feeds an automated verification step):
- A numbered list of findings.
- Each finding: severity (P0 crash/softlock / P1 broken mechanic / P2 notable /
  P3 design-note), the paragraph number(s), what the code/data currently does,
  what the canon or good balance requires, and a one-line FB2 quote where the
  claim is canon-based.
- Pure balance-tuning suggestions (not canon violations) must be labelled P3
  design-note.
- If you can't verify a claim against the uploaded FB2, say so — don't guess.
```

---

## AUDIT A.2 — Gemini (Deep Research) — ART COVERAGE

### Files to upload (4)
1. `_audit_tmp/for_gemini/mj_art_MAPPING_ONLY.js`     (~27 KB — colour-art map MJ_MAP + MJ_META, base64 images stripped)
2. `_audit_tmp/for_gemini/illustrations_MAP_ONLY.js`  (~2 KB — B&W fallback map ILLUST_MAP, base64 stripped)
3. `art-pack/metadata/art_catalog.py`                 (~31 KB — STYLE_SUFFIX / prompt style reference)
4. `src/remake_data.js`                               (~973 KB — paragraph text, to judge what each scene depicts)

> IMPORTANT: do NOT upload the raw `src/mj_art.js` (6.7 MB) or
> `src/illustrations.js` (3.3 MB) — they're 90%+ embedded base64 image data that
> will blow the upload/size limit and waste context. Use the two MAPPING_ONLY
> extracts above instead (already generated for you in `_audit_tmp/for_gemini/`).
> They contain the full §->art mappings, which is all the audit needs.

### Prompt to paste
```
You are auditing the ART COVERAGE of a single-file HTML gamebook — a Russian
adaptation of Braslavsky's 1991 "Dungeons of the Black Castle" (1221 paragraphs,
dark Slavic fantasy). DIAGNOSTIC only: produce a report, do NOT edit code.

I've uploaded: mj_art_MAPPING_ONLY.js (MJ_MAP — the colour Midjourney art, §->art
mapping; base64 stripped), illustrations_MAP_ONLY.js (ILLUST_MAP — a SECOND,
B&W-scan fallback layer; base64 stripped), art_catalog.py (the Midjourney prompt
STYLE reference), and remake_data.js (the paragraph text, `const GD={...}`, so
you can see what each scene actually depicts).

Tasks:

1. COVERAGE COUNT — across all 1221 paragraphs, classify each as: has colour art
   (in MJ_MAP) / B&W-only (in ILLUST_MAP but not MJ_MAP) / no illustration
   (neither). Give totals and percentages. Account for BOTH layers — a paragraph
   with only a B&W fallback is NOT "uncovered".

2. THEME CLUSTERING — group the uncovered (or B&W-only) paragraphs by visual
   theme (combat, monsters, rooms, NPCs, items, transitions). Rank clusters by
   how often the player is likely to pass through them (play-time density), so
   the most-seen gaps surface first.

3. TOP CANDIDATES — pick the 5-10 highest-value paragraphs to illustrate next.
   For each, write a ready-to-use Midjourney prompt in the SAME style as
   art_catalog.py (dark Slavic fantasy; end each with `--ar 3:2 --stylize 250
   --v 6`). Base the prompt on the actual paragraph text.

4. LEGACY B&W REPLACEMENT — there are ~14 legacy B&W scans in ILLUST_MAP. Flag
   which to replace first; pay special attention to ~4 that look like
   out-of-style "Victorian engraving" scans (candidates: §36, §70, §83, §333,
   §600). Verify against the paragraph text what each should depict.

OUTPUT FORMAT:
- The coverage table/totals first.
- Then a ranked candidate list; each entry: paragraph number, one-line scene
  description (from the actual text), and the ready Midjourney prompt.
- IMPORTANT honesty check: base every scene description on the uploaded
  remake_data.js text for that exact paragraph number. Do not invent scene
  content. (A previous art audit fabricated paragraph contents wholesale.)
```

---

## After both reports come back
Start a fresh Claude session, paste `RECEIVING_CLAUDE_BRIEF_2026-05-26.md` +
both reports, and let it run the verification funnel. It will spot-check art
descriptions against the real §-text and reject any fabricated report, verify
each balance finding against FB2 + code, and commit only the genuinely-valid
fixes (you push).

## File locations recap
- Brief for the verifier: `audit_cycles/RECEIVING_CLAUDE_BRIEF_2026-05-26.md`
- Gemini upload extracts: `_audit_tmp/for_gemini/mj_art_MAPPING_ONLY.js`, `_audit_tmp/for_gemini/illustrations_MAP_ONLY.js`
- This kit: `audit_cycles/REAUDIT_LAUNCH_KIT_2026-05-26.md`
