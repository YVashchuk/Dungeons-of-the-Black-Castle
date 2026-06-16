# Re-audit cycle — 2026-06-16 (post groups 55-64)

Three external review sessions on the CURRENT code, then a Claude verification session, then
(later) a ChatGPT Agent-Mode live playthrough.

## Run mode for ALL three: NOT Deep Research / web mode
Closed-corpus task. Use each model's strongest reasoning/extended-thinking mode reading ONLY the
provided sources. Deep Research browses the web → confabulation risk + burns quota.

## Providers & how to feed them
- **Gemini** — paste `GEMINI_BRIEF.md` and ATTACH the external pack folder
  `C:\Users\I828868\Downloads\gemini_pack_2026-06-16\` (pre-extracted shards; the raw 1 MB
  data line and 6.9 MB base64 art overflow Gemini's reader). Built fresh from current sources;
  NOT committed to the repo.
- **ChatGPT** — paste `CHATGPT_BRIEF.md`; it reads the repo from GitHub (no Gemini folder there).
- **Claude** — run inside the project; paste `CLAUDE_BRIEF.md` (filesystem + GitHub + PowerShell/Python/node).

## Then
Collect the three reports → fresh Claude verification session (canon→code→harness per claim) →
fix only verified findings → Yuriy pushes. The Agent-Mode playthrough (§1→§1220, dice/stats/
inventory/combat/luck vs text) is the final step; save it for after fixes land (≈5 agent
sessions/month).
