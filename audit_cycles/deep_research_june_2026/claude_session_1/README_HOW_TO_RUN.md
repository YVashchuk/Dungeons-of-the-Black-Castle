# How to run the Claude Fable 5 session (for Yuriy — do NOT attach this file)

## Independence first
- Launch in a **NEW chat OUTSIDE this project** (plain new conversation, not inside the Dungeons project). A fresh chat has none of the project's context or memory — that keeps the third run genuinely independent.
- Do not mention the Gemini or ChatGPT sessions, and do not attach their reports.

## Launch
1. New Claude chat (Claude Fable 5), enable **Research** (Deep Research).
2. Attach FIVE files:
   - `claude_session_1/00_BRIEF_CLAUDE.md` (this folder)
   - `gemini_session_1/01_PROJECT_CONTEXT.md`
   - `gemini_session_1/02_CASE_887_betting.md`
   - `gemini_session_1/03_CASE_amulets_mirror_pass.md`
   - `gemini_session_1/04_CASE_fugitives_friend.md`
   (The case files are session-agnostic — the same set served all three sessions, so the arbitration compares like with like.)
3. Paste the kickoff prompt below and start.

## Kickoff prompt (copy–paste)

```
Five briefing files are attached (00_BRIEF_CLAUDE.md, 01_PROJECT_CONTEXT.md, 02–04 case files). Read all five in full, then run Deep Research to fulfil 00_BRIEF_CLAUDE.md.

Hard rules: search Russian-language sources; NEVER match paragraphs across editions by number — match scenes by the verbatim quotes provided; every FOUND claim needs a working source URL plus a verbatim quote; identify the edition behind every quote; separate FOUND vs INFERRED vs NOT FOUND exactly as the brief's Mandatory Output Format specifies; walkthroughs («прохождение») are first-class evidence. Do not report the modern remastered FB2 as a finding — the project already has it; the target is the 1991 first edition and evidence about it. This is an independent run: do not look up or reuse other AI research reports on this task.
```

## Afterwards
- Save Claude's full report **verbatim** as `claude_session_1_report.md` in THIS folder and tell Claude in the project chat.
- All three reports (Gemini + ChatGPT + Claude) then go to the arbitration pass in the project chat: per-claim URL/quote verification + canon-first check (FB2 → data) before anything changes in the repo.
