# DEEP RESEARCH BRIEF — ChatGPT Session 1 (June 2026 cycle, cross-check)
## «Подземелья Чёрного замка» (Дмитрий Браславский, 1991): source recovery + three canon questions

You are supporting a source-critical restoration of the first Russian gamebook. This is an **independent cross-check session**: another research system is working the same questions in parallel. Do NOT search for, request, or reuse any other AI's research report on this task — produce independent findings. The reports will be arbitrated against each other and against the book canon afterwards.

## STEP 0 — repository access check (mandatory, before any web research)

You have access to the private GitHub repository **YVashchuk/Dungeons-of-the-Black-Castle**. Open and read these four files IN FULL:

1. `audit_cycles/deep_research_june_2026/gemini_session_1/01_PROJECT_CONTEXT.md` — the project, the verification pipeline, the book's conventions (incl. the letter-sum alphabet А=1…Я=33 with Ё=7, Й=11).
2. `audit_cycles/deep_research_june_2026/gemini_session_1/02_CASE_887_betting.md`
3. `audit_cycles/deep_research_june_2026/gemini_session_1/03_CASE_amulets_mirror_pass.md`
4. `audit_cycles/deep_research_june_2026/gemini_session_1/04_CASE_fugitives_friend.md`

These case files contain the full backgrounds and the **verbatim remake quotes that are your scene-match keys**. (The folder is named `gemini_session_1` because the same case files served the parallel session; their content is session-agnostic.)

**If you cannot read these files, STOP and report the access failure** — do not research without the match keys.

Additional canon sources in the repo, for extracting more match keys yourself if needed:
- `book_text.md` — plain-text rendering of the remastered book (convenient to search);
- `assets/fb2_remake.fb2` — the authoritative remastered FB2 (1221 paragraphs).

## MISSION

**PRIMARY — locate the text of the FIRST edition:** Дмитрий Браславский, «Подземелья Чёрного замка», Москва, 1991. Reference: https://fantlab.ru/edition25230 . Any form counts: book scans (PDF/DjVu — rutracker, archive.org, libraries), OCR text, fan re-typesets, partially photographed pages, and text fragments quoted in forums or walkthroughs. Walkthroughs («прохождение») are **first-class evidence** — they quote paragraph numbers, scene details and exact mechanics.

**SECONDARY — answer the three case question-sets** (full versions in the case files; compact restatement below): by direct verbatim quotation from the 1991 text where possible, otherwise via community errata, forum discussions and walkthroughs.

**TERTIARY — editions inventory:** every known edition/reprint (the 1991 first edition; later reprints; the modern remastered re-edition), with paragraph counts where discoverable.

## WHAT WE ALREADY HAVE — do NOT report as findings
The modern remastered re-edition (FB2, **1221 paragraphs**, the corrected text; flibusta b/532645) — it IS the repo canon you just read. The research target is the **1991 original** (or hard evidence about it), to resolve discrepancies the remaster inherited or introduced.

## METHODOLOGY (hard rules)
1. **Paragraph numbers differ between editions.** The remaster has 1221 paragraphs; the 1991 original's numbering is different/unknown. NEVER match across editions by number — match scenes by TEXT (the verbatim quotes in the case files).
2. **Verbatim or nothing.** Quote sources verbatim; never reconstruct a quote from memory; never paraphrase inside «…». If a scan page is partly unreadable, say so explicitly.
3. **Edition identification per quote** — state which edition/printing every quote comes from and how that was determined.
4. **Search in RUSSIAN.** Seed queries: «Браславский Подземелья Чёрного замка 1991 текст», «Подземелья Чёрного замка книга-игра скачать», «Подземелья Чёрного замка прохождение», «Браславский книга-игра опечатка ошибка параграф», plus case-specific phrases from the case files.
5. **Candidate venues:** fantlab.ru (edition page, author page, forums), quest-book.ru (community + archives), archive.org, rutracker.org (scans), VK communities «книги-игры», samlib.ru / lib.ru, author interviews, old forum/FIDO archives.
6. **Independence:** do not look up or incorporate other AI research reports on this task.

## THE THREE QUESTION SETS (compact — full versions with quotes are in the case files)

**CASE 1 — the Goblin dice game, face-6 anomaly** (`02_CASE_887_betting.md`)
- Q1.1 Find the original's item-stake six-outcome dice list; quote it verbatim with the original paragraph number and all six face targets.
- Q1.2 What scene does the original's face-6 target contain? Verbatim quote.
- Q1.3 Any published errata or forum discussion of this exact misprint, in any edition?
- Q1.4 Fallback: walkthrough fragments covering the Goblin gambling, verbatim with URLs.

**CASE 2 — two amulets, the little mirror, and the pass** (`03_CASE_amulets_mirror_pass.md`)
- Q2.1 The original's debt-payment paragraph: «золотым амулетом» or just «амулетом»? Verbatim.
- Q2.2 Is the bear-fur amulet ever tradable / payable / giftable in the original? Verbatim quotes.
- Q2.3 Does the original distinguish the two amulets the same way (bear-fur = she-bear summon; golden = good/evil detector that blinds the wizard)? Quote both grant scenes.
- Q2.4 The зеркальце shown to the knight «оказывается пропуском» vs the paper Пропуск issued by the Начальник стражи: one pass system or two independent ones in the original? Verbatim quotes.
- Q2.5 List every use of the зеркальце in the original (gifts, the Harpy, the knight, …), each with a verbatim quote.

**CASE 3 — the fugitives' friend** (`04_CASE_fugitives_friend.md`)
- Q3.1 Who are the беглецы in the original? Quote the meeting scene.
- Q3.2 Who is their «друг»? The **NAME verbatim** (it feeds a letter-sum) + the meeting scene with the original paragraph number.
- Q3.3 Which paragraph applies «вычтете 35» (the meeting site), and what does site−35 narrate (the delivery)? Both verbatim.
- Q3.4 What does the name-sum+30 paragraph narrate? Verbatim.
- Q3.5 What is the message about and what does delivering it change? Verbatim.
- Q3.6 Do these mechanics exist in the 1991 original at all — or were they introduced by the remaster?

## MANDATORY OUTPUT FORMAT (identical to the parallel session — required for cross-arbitration)

For each case (1–3):

```
## CASE N — <name>
### FOUND
- F<N>.<i>: <claim>. [SOURCE: <full URL>] «<verbatim quote>» — Edition: <which / how identified> — Confidence: High|Medium|Low
### INFERRED  (clearly separated from FOUND)
- <reasoning-based conclusions, each explicitly marked as inference>
### NOT FOUND
- <explicit list of what could not be located>
### LEADS
- <partial / uncertain leads worth a follow-up session>
```

Then one global section:

```
## SOURCES INVENTORY
- <every URL consulted that contains book text / scans / errata: what exactly it holds (full text? which pages? which edition?)>
```

**No fabrication.** A claim without a working URL + verbatim quote belongs in INFERRED or LEADS, never in FOUND.
