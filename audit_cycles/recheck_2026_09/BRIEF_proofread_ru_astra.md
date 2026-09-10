# BRIEF — RUSSIAN TEXT PROOFREAD for ChatGPT 6 Astra ULTRA (code execution, archive attached)

**Purpose.** The game's Russian text is about to be recorded as narration, so it must be clean first. Find every OCR artefact, spelling error, stray or missing space, broken word (hyphenation leftovers), and punctuation fault in the Russian text of the game — and deliver the fixes as exact, machine-applicable replacements. Nothing else: no style editing, no modernising the author's voice, no changes to paragraph numbers or links.

**Archive.** The attached ZIP is `main` at the commit named in its root folder (`Dungeons-of-the-Black-Castle-<hash>`), `assets/illustrations/` removed. Read-only. Text sources, in order of authority for *what the game shows*:
1. `src/locale.ru.js` — the text the game renders: `p[N].t` (paragraph prose, 1221 entries, may contain simple HTML), `p[N].c` (choice labels, positional), `ui` (interface strings), `preface`, `pregame`, `spells`, `allies`, `enemies`, `items`, `map`.
2. `assets/book_text.md` — the same prose as a canon mirror (`### §N` headings; ignore the stale `**Выборы:**` lists).
3. `assets/book_1991_extracted.txt` — OCR of the 1991 edition (letter-spaced, unreliable; a different paragraph numbering). Use it only as a tie-breaker when you suspect a word was mangled: if the 1991 text has the sane form, that settles it.
4. `assets/text_corrections.json` — the fix registry. Groups 87 (batches C, F, G) list 60+ text corrections already made this month; do not re-report them.

**What counts as an error (report).**
- OCR: Latin letters inside Cyrillic words (c/с, o/о, a/а, e/е, p/р, x/х, y/у, H/Н, K/К, T/Т, B/В, M/М), digit/letter confusions (0/О, 1/l/І, 3/З, 6/б), dropped or doubled letters, wrong case after a period, «ё» that turned into «е» where the meaning changes (все/всё, небо/нёбо…).
- Spaces: doubled spaces, a space before `,.;:!?…)»` or after `(«`, missing space after punctuation, missing space around the em dash where the house style requires it (see typography), tabs, non-breaking spaces in the wrong place.
- Broken words: hyphenation leftovers («про- шлого», «в стороне- »), words glued together («вернетесьна»), words split («что бы» where the conjunction «чтобы» is meant — but «что бы ни» is correct).
- Punctuation: missing or extra commas that change reading (participial/adverbial phrases, «который», addresses, «однако»/«впрочем» as parenthetical), a period after a closing quote with `!`/`?` inside, `..` instead of `…`, `?.` / `!.`, mismatched quotes or brackets, a hyphen `-` used as a dash, a comma after a closing quote that keeps its own `!`/`?`.
- Choice labels (`p[N].c`): the same classes; also a label whose number in parentheses does not match the target order in the paragraph text.

**What is NOT an error (do not report).** The author's 1991 register and archaisms («нежели», «дабы», inverted word order), names as written in the book («Барлад Дэрт», «Майлин», «Пегас»), capitalised game terms (МАСТЕРСТВО, ВЫНОСЛИВОСТЬ, УДАЧА, СИЛА УДАРА), the absence of «ё» where the meaning is unambiguous (the editions do not use it consistently — leave it), paragraph numbers, links «— 750», the HTML tags inside `t`.

**Typography house rules (the game keeps them; use them in your `to` strings).** Quotes « » with inner “ ” if nested; em dash `—` with a non-breaking space before it (`\u00a0—`) and a normal space after; the ellipsis `…` as one character; `!..` and `?..` are allowed (the book uses them); numbers of paragraphs stay as digits.

**Method.** (1) Automated scan with code over all 1221 `t`, all `c`, `ui`, `preface`, `pregame`, `spells`, `allies`, `enemies`, `items`, `map`: Latin-in-Cyrillic, double spaces, space-before-punctuation, hyphenation residue, repeated words («и и», «в в»), unbalanced quotes/brackets, `..`, ` - ` as dash, `,—`, `»,` after `!»`/`?»`. (2) Reading pass over every paragraph (all 1221 — say how you split the work), because spelling and commas need a reader. (3) For each candidate, check `book_text.md` and, when in doubt, the 1991 OCR. (4) Every reported item quotes the **exact** substring as it stands in `locale.ru.js` (after HTML tags are stripped, or including them if the error is inside a tag boundary — say which).

**Deliverables.**
1. `RU_PROOFREAD.json` — an array of objects, one per fix:
   ```json
   {"id":"R-001","section":291,"field":"t","from":"пошли а правильном","to":"пошли в правильном","class":"spelling","confidence":"high","note":"missing letter"}
   ```
   `field` is `t`, `c[i]` (i = 0-based index in `p[N].c`), or a dotted path for other sections (`ui.zol`, `preface`, `spells.FIRE.full`, `enemies.goblin`, `items.apple`). `from` must occur **exactly once** in that field's value (extend it with context if needed). `class` ∈ ocr | spelling | space | hyphen | punct | label. `confidence` ∈ high | medium; medium items go to the same file but are flagged.
2. `RU_PROOFREAD_DOUBTFUL.md` — items where the author may prefer the existing form (authorial punctuation, rare words, possible intentional archaisms) with the paragraph, the quote and both readings; not applied automatically.
3. `RU_PROOFREAD_REPORT.md` — pre-flight (archive hash, entry counts, first sentence of §1 quoted from `book_text.md`), method, coverage statement (which paragraph ranges were read, by whom/what), counts per class, and the top 20 most consequential fixes with a one-line reason each. Offer all three files for download and print the report in the chat.

**Rules.** No web use. Do not modify the archive. Verbatim quotes only — an invented or paraphrased `from` string breaks the patcher and discredits the report. If a paragraph range could not be read, say so in the coverage statement rather than skipping silently.
