# i18n / Localization — Synthesis & Decision of Record
**Date:** 2026-06-18 · **Status:** design locked, implementation not started · **Registry baseline:** v2.95 (66 groups), 1205/1221 reachable

## Inputs
Three independent architecture studies (briefs in this folder), each grounded in the real source, then verified by the main session against the code:
- **Gemini** — `<script>`-injection locales + physical `<img src>` assets + folder distribution.
- **Detailed migration study** — neutral structure + per-language locale files; readable English IDs; v6 save migration; hashed riddles; precise engine-coupling replacement list; **flagged the map module**.
- **"4 %" study** (most rigorous) — quantified that text is ~4 % of the bundle (art ~90 %); found the art layer is **already neutral**; **discovered a 4th Cyrillic coupling** the others missed; noted the served PWA is already scaffolded.

## Verification verdict (main session, against live code)
All three are technically sound. Confirmed first-hand:
- **4th coupling is REAL:** `game_logic.js` L2336-2348 is a scene/ambiance classifier that scans the **Russian paragraph text** (`t.includes('лес')|'замок'|'река'|'бой'|'подземел'|'поля'|'ночь'`, 25 Cyrillic `.includes()`), used to pick art/mood. Breaks under translation -> must become an explicit per-paragraph `scene` field.
- **PWA already scaffolded:** `dist/manifest.webmanifest` (1197 B) + `dist/sw.js` (3839 B) exist; the built dist links the manifest; SW registration not yet wired.
- **Text ~4 %:** art = 10.15 MB (90 % of source JS); all paragraph text + choice labels ≈ 0.45 MB of chars. Art is the weight; **text is cheap**.
- `map_module.js` accepts save `v∈{4,5,6,7}` and bumps to 7; fonts.css has the lat/cyr `unicode-range` split **and** the real Veles Redone placeholder-copyright caveat; **65 distinct enemies / 118 instances**.

**Corrections to the reports:** the detailed study's extraction list named a field `auto_items.lose` that **does not exist** (real removal fields are `clear_inventory`, `gold_zero`). And a `§340` "single-letter items" scare was a **bug in our own first extraction** (iterating a string-valued `grants_items` char-by-char), not a data defect — §340 is a normal shop; the corrected pass yields **82 non-food + 16 food = 98 items**.

## Decision — the synthesized architecture (improves on each report)
Embed locale **text inline as JS objects**, and because text is only ~4 %, **embed several languages in the one file** -> instant in-game switching + offline-by-double-click + zero `fetch`, on every device incl. the old iPad. For **dropping in a new language without a rebuild**, use Gemini's `<script src="locales/xx.js">` injection (script tags load under `file://` where `fetch` is blocked) + a one-line manifest edit. **Keep art inline base64** for the single file (it is the 90 % — externalizing it is a separate memory lever, not i18n); the **art layer needs no key migration** (already neutral) — only the **title** is text-bearing -> styled web-font text or a per-language image. Layer the **already-scaffolded served PWA** on top as the primary mobile/installable path and the future art-externalization enabler — **additive, never required**.

Why this beats each alone: it keeps a single shareable file (dissolves Gemini's zip friction), needs no capability-split between two builds (script-injection gives drop-in even under `file://`), and rides the "art is the weight, not text" reframe so the whole migration is low-risk.

**Agreed core (all three):** readable English snake_case IDs mirroring the existing `artNN_*` convention; paragraphs stay numeric; spells + art keys already neutral; neutral structure + per-language text; legacy-RU->ID save migration (v6); never `fetch()` under `file://`; replace the Cyrillic-coupled engine logic with data fields; UTF-8 + `python -X utf8` + pretty-printed (one-key-per-line) locale files; partial translations stay playable via base-language fallback.

**Riddles:** tiny synchronous hash (DJB2/FNV — `file://`-safe, no async WebCrypto) + salt/namespace `bc-riddle-v1|locale|riddle_id|normalized_answer`; per-locale answer->target maps; per-locale normalizer (`ru-word`: strip to [а-я], ё->е; `latin-word`: strip diacritics). Riddle config (`valid_targets`/`fail_target`/`max_attempts`) stays in neutral structure.

## Verified full migration scope
1. **Items** — 82 non-food + 16 food -> readable slugs + `legacyRu` (full table in PHASE1_SPEC.md); **save migration v6**.
2. **Four Cyrillic engine couplings** -> data: spell-keyword fallback (`spell:` already on 103 choices) , flee regex (`flee:true`), food string `(еда:+N)` (`grants_food:{item,stamina}`), **scene classifier (`scene:"forest"|…`)**.
3. **Riddles (7)** — §67/§95/§435/§439/§992/§1113/§1131 -> hashed answer maps.
4. **UI / shell strings** — ~254 in engine + 93 Cyrillic shell lines incl. 39 buttons and the dice notation «1к6» -> catalog keys.
5. **Map module** — `BC_MAP_DEF` ~54 Russian node titles (low priority).
6. **Title art** — web-font text or per-language image.
7. **Diligence:** reconcile the save-version split (`game_logic` `podzch_v5` vs `map_module` v7) at implementation; resolve **Veles Redone** licensing before any *public* deploy.

## Open decisions for Yuriy
1. **Title:** auto-localizing web-font text (simpler, loses bespoke castle-tower lettering) vs per-language title image (preserves art).
2. **Timing of served-PWA + art-externalization** (the real old-iPad memory win) — recommended **after** the inline i18n lands (orthogonal).

The distribution fork is resolved: single-file (now multi-language) stays primary + script-injection drop-in + PWA additive; `file://` double-click preserved.

## Next
Phase 1 only (RU-only, behavior-identical): extract RU text to `locales/`, convert engine to ID lookups + v6 save migration, prove the RU build is byte/behavior-identical (golden smoke tests + the harness pattern). Translation and a 2nd language come after. See PHASE1_SPEC.md.
