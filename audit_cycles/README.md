# Audit Cycles

This directory archives external audit artifacts from major implementation
series. Each subdirectory is one full audit cycle: the task spec given to
the external auditor, the implementation report sent as context, source
extracts to spare the auditor large binary files, and the auditor's
findings report.

These artifacts are kept for historical reference. Future audit cycles or
follow-up implementation work can read them to understand prior decisions
and verified state.

## Cycles

### `group_6_may_2026/` — Paragraph-arithmetic mechanics ✅ CLOSED

Closure of 13 paragraph-arithmetic items from the canonical FB2. Audit
performed by Gemini 3.1 Pro in May 2026.

**Implementation span:** commits `9c037b3` → `fe72347` (13 commits).

**Post-audit follow-up commits** (extending the group_6 cluster to 16 items):
- `aeebe69` — consume_on_use engine + fixes for sec.891 and sec.976
- `f19d59d` — emerald_ring (-140 fail-feedback) — item 14
- `a91d540` — bandit_tip (+910 treasure-dig) — item 15; restored sec.929 orphan
- `a71e617` — registry cleanup: canonical modifier values for 6 items
- `4e02144` — sec.929 content-fidelity: Серебряное кольцо + 1 LUCK
- `1ed6d31` — gold_ring (-52 Barlad insta-kill) — item 16; §462 content-fidelity

**Final state:** 16 items addressed (14 status_done, 1 verification-only, 1 status_deprecated).

### `spell_economy_may_2026/` — Spell economy + spell hooks audit ✅ CLOSED

Comprehensive audit of all 8 canonical spells against current data hooks. Initial review revealed apparent 30% data-hook coverage; manual classification corrected to 50% real coverage after rebutting Gemini's "applyChoiceConsume absent" claim. Three implementation commits closed the audit:

- `082cdb8` — **group_17:** 9 P0 navigation-time spell hook bugs fixed (§93, §329, §521, §705, §935 LEVITATION; §308 FORCE; §596, §698 SWIMMING; §415 HEALING + label fix)
- `b6cd0cb` — **group_18:** letter-sum riddle engine implemented (§1131 cemetery + §992 column riddle chain)
- `ba13de5` — **group_19:** combat-modal spell engine extending COPY pattern with FORCE/WEAKNESS + per-paragraph allowlist (§506 werewolf, §950 arena goblin)

**Files in this cycle:**
- `SPELL_ECONOMY_REVIEW.md` — Claude's initial review
- `SPELL_HOOKS_AUDIT_TASK.md` — task spec for Gemini
- `SPELL_CANDIDATE_PARAGRAPHS.md` — pre-extracted FB2 + remake JSON for all 132 paragraphs
- `GRAPH_AUDIT_REPORT_POST_SPELL_HOOKS.md` — Gemini's partial findings + Claude annotations
- `CLAUDE_MANUAL_CLASSIFICATION.md` — final 132-paragraph classification (9 fixed + 26 combat-modal + 57 OK + 29 narrative-only)

**Final state:** All 8 spells canonically functional. Navigation-time (LEVITATION/SWIMMING/ILLUSION/FIRE), engine-global (HEALING HUD button), combat-modal (FORCE/WEAKNESS/COPY).

### `letter_riddle_engine_may_2026/` — Letter-sum riddle engine ✅ CLOSED

Design proposals for canonical letter-sum riddle mechanic. Implemented as group_18 (commit `b6cd0cb`).

**Files:**
- `LETTER_RIDDLE_DESIGN_BRIEF.md` — design task spec
- `RIDDLE_DESIGN_PROPOSAL.md` — ChatGPT 5.5 Plus thinking design proposal (excellent quality; anti-cheat by one-way-hash insight)

**Mechanic shipped:** Player types Russian answer, engine computes letter-ordinal sum, adds modifier (916/825), navigates to result if in valid_targets allowlist. Anti-cheat: answer string never in code/data. §1131 → §992 (cemetery) → §932 (death) chain functional.

### `art_prompts_may_2026/` — Midjourney art prompts bundle 🎨 READY FOR USER

Phase A.2 from POST_GROUP6_ROADMAP.md — visual art coverage gap analysis. Per-prompt bundle ready for Midjourney generation with active subscription.

**Files:**
- `MIDJOURNEY_PROMPTS_BUNDLE.md` — 2 re-generations (broken art30/art47) + 6 new generations (iconic gaps) with full prompts in `art_catalog.py` style + post-generation integration steps

**Status:** Awaiting user's Midjourney run. After generation, a new Claude session can paste the output URLs and handle catalog updates + MJ_MAP wiring + base64 re-encoding + build + commit in one session.


**Files:**
- `MIDJOURNEY_PROMPTS_BUNDLE.md` — 2 re-generations (broken art30/art47) + 6 new generations (iconic gaps) with full prompts in `art_catalog.py` style + post-generation integration steps
- `LEGACY_BW_ILLUSTRATION_AUDIT.md` — **NEW (May 2026):** root-cause + full inventory of the legacy 1991/5th-edition black-and-white scan fallback layer (`src/illustrations.js` → `ILLUST_DATA`/`ILLUST_MAP`) that our earlier coverage analysis missed. 56 paragraphs have a B&W scan; 31 are already superseded by colour MJ art; **25 still show black-and-white in-game (14 unique scans)**. Each of the 14 scans was viewed and visually documented, with a ready-to-use regeneration prompt (B1–B14). Includes engine-precedence confirmation (MJ_MAP wins, ILLUST_MAP is fallback) so future wiring needs only `mj_art.js` edits.

**Status:** Awaiting user's Midjourney run (subscription lapsed; user will regenerate at end of project with a new subscription). After generation, a new Claude session can paste the output URLs and handle catalog updates + MJ_MAP wiring + base64 re-encoding + build + commit in one session. The B&W audit means we will NOT need to re-investigate this gap — the analysis is complete and the targets are documented.
