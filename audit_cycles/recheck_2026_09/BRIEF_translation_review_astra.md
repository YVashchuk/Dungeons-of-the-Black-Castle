# BRIEF — TRANSLATION REVIEW for ChatGPT 6 Astra ULTRA (one language per chat: EN, FR or UK)

**Purpose.** The game's Russian text (`src/locale.ru.js`) has just been proofread; the translations must now match it and read well, because each language will be narrated. Review ONE target language per chat — the language is named in the first message (`LANG = en | fr | uk`).

**Archive.** The attached ZIP is `main` at the commit named in its root folder, `assets/illustrations/` removed; read-only. Sources: `src/locale.ru.js` (the reference — Russian prose `p[N].t`, labels `p[N].c`, `ui`, `preface`, `pregame`, `spells`, `allies`, `enemies`, `items`, `map`) and `src/locale.<LANG>.js` (the translation, same structure, same keys, same positional label indices). `assets/text_corrections.json` documents the fixes already made (groups 84–88); `audit_cycles/recheck_2026_09/RU_PROOFREAD.json`, if present, lists the latest Russian corrections whose translations must follow.

**Check, paragraph by paragraph (all 1221), then labels, then the other sections:**
1. **Fidelity.** Meaning, numbers (paragraph links «— 750», stamina/skill/luck values, gold, dice), item and character names consistent with `items` / `enemies` / `spells` / `allies` of the same locale, conditions («если… то…», «only if…») preserved exactly, nothing added, nothing dropped, no sentence left in Russian or in another language.
2. **Grammar and idiom** of the target language; consistent register (an unhurried fantasy narrator addressing the reader as «вы» → EN "you", FR « vous », UK «ви»); consistent terminology across the book (skill / stamina / luck names, «заклятие» → one term, «Чёрный замок» → one form).
3. **Typography of the target language.** EN: straight ASCII quotes are not used — “ ” and the em dash `—`; FR: « » with NBSP inside, NBSP before `:`, narrow NBSP (`\u202f`) before `; ! ?`, « ’ » apostrophes, the dash `—`; UK: « » quotes, apostrophe `’`, dash `—` with NBSP before it, «ґ» where standard, no Russian letters (ы, э, ё, ъ) inside Ukrainian words.
4. **Labels** (`p[N].c`): same order and count as RU, an action phrase naming the object, the target number in parentheses matching the RU label, ≤ 80 characters when RU is short.
5. **Interface strings** (`ui`, 364 keys): parity with RU meaning, correct plural forms and punctuation fragments (many keys are sentence fragments concatenated at runtime — keep leading/trailing spaces and punctuation exactly as the RU key has them), FR typography as above.

**What is NOT an error.** A different sentence split that keeps the meaning; a natural idiom instead of a literal one; proper names transliterated consistently within the locale (do not change the chosen scheme — report only inconsistencies).

**Deliverables.**
1. `<LANG>_REVIEW.json` — an array of fixes, one per object, same schema as the Russian proofread: `{"id":"T-001","section":291,"field":"t","from":"<exact substring in locale.<LANG>.js, unique within the field>","to":"<replacement>","class":"fidelity|grammar|typography|terminology|label|ui","confidence":"high|medium","note":"…"}`. `field` = `t`, `c[i]`, or a dotted path (`ui.key`, `preface`, `spells.FIRE.full`, `items.apple`).
2. `<LANG>_REVIEW_DOUBTFUL.md` — stylistic alternatives the maintainer may or may not take, with both readings.
3. `<LANG>_REVIEW_REPORT.md` — pre-flight (archive hash, key counts: `p` 1221, `ui` keys, labels per paragraph equal to RU), method, coverage statement, counts per class, top 20 fidelity fixes with the RU quote beside the translation. Offer the files for download and print the report in the chat.

**Rules.** No web use. Verbatim `from` strings only (the patcher applies them literally). Do not touch the Russian text — if the Russian itself looks wrong, list it under «RU suspects» in the report instead.
