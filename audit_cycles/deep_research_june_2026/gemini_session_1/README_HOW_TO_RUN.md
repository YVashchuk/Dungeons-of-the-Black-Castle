# How to run Session 1 (for Yuriy — do NOT upload this file to Gemini)

1. Open Gemini 3.1 Pro and switch to **Deep Research**.
2. Attach the five files: `00_BRIEF.md`, `01_PROJECT_CONTEXT.md`, `02_CASE_887_betting.md`, `03_CASE_amulets_mirror_pass.md`, `04_CASE_fugitives_friend.md`.
3. Paste the kickoff prompt below and start the research.

## Kickoff prompt (copy–paste)

```
You are supporting a source-critical restoration of the 1991 Russian gamebook «Подземелья Чёрного замка» (Дмитрий Браславский). Five briefing files are attached (00…04). Read all five in full, then run Deep Research to fulfil 00_BRIEF.md.

Hard rules: search Russian-language sources; NEVER match paragraphs across editions by number — match scenes by the verbatim quotes provided; every FOUND claim needs a working source URL plus a verbatim quote; identify the edition behind every quote; separate FOUND vs INFERRED vs NOT FOUND exactly as the brief's Mandatory Output Format specifies; walkthroughs («прохождение») are first-class evidence. Do not report the modern remastered FB2 as a finding — we already have it; the target is the 1991 first edition and evidence about it.
```

## If Deep Research refuses attachments
Paste the contents of `00_BRIEF.md` as the research prompt, then paste the contents of `01–04` into the same message (they are plain text; the total is tiny relative to the 1M context).

## Afterwards
- Save Gemini's full report **verbatim** as `gemini_session_1_report.md` in this same folder and tell Claude.
- Research-mode outputs are non-deterministic: every claim will go through the canon-first verification pass (FB2 → data) before anything changes in the repo.
- Quota note (Google AI Pro): up to 20 Deep Research reports/day — weak cases can simply be re-run as narrower follow-up sessions.
