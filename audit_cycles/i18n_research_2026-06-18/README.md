# i18n / Localization architecture research — 2026-06-18

Goal: make the single-file game language- and encoding-independent (separate per-language text/UI/button
files + language-bound text-bearing images + a language-neutral engine key scheme + an auto-detected
language dropdown + instant state-preserving in-game language switch), runnable on Windows, iPhone 15+,
an ~4-5-year-old iPad, and Pixel 7a+. Three independent design studies, then a Claude synthesis.

## Run mode for ALL three: strong reasoning, NOT Deep Research
Closed-corpus over our files + the model's own i18n/platform knowledge. Deep Research / live web crawl
is not needed (burns quota, wanders). Report in English; quote identifiers and Russian strings verbatim.

## What to load into each LLM
- **Gemini** — paste `GEMINI_BRIEF.md` and ATTACH the external pack folder
  `C:\Users\I828868\Downloads\gemini_i18n_pack_2026-06-18\` (game_logic.js, build.sh, build_shell.py,
  PROJECT_NOTES.md, remake_data_SAMPLE.json, art_maps.txt, language_coupling_inventory.md). Do NOT upload
  the raw base64 files (mj_art.js / illustrations.js / title_art.js) or the full 1 MB remake_data.js —
  Gemini's reader truncates them.
- **ChatGPT** — paste `CHATGPT_BRIEF.md`; it reads the repo from GitHub. Tell it to read game_logic.js /
  build.sh / build_shell.py / PROJECT_NOTES.md / remake_data.js (parse, don't grep) and only the MAP
  sections of mj_art.js / illustrations.js (skip the base64).
- **Claude** — run in the DESKTOP app (windows-mcp); paste `CLAUDE_BRIEF.md`. Full local access + can run
  Python/node to quantify. NOT a claude.ai web session (private repo + no disk).

## Then
Collect the three studies → a Claude synthesis session picks/merges the best architecture, then a phased
implementation (separate green-light). The Gemini data pack is built fresh and is NOT committed.
