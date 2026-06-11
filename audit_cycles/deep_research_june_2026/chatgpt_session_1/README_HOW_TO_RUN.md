# How to run the ChatGPT session (for Yuriy — do NOT paste this file into ChatGPT)

## Prerequisite — PUSH FIRST
ChatGPT reads the repository from **GitHub (origin)**, not from your disk. Before launching, make sure BOTH commits are pushed:
- the Gemini package commit (`5509997` — it contains the case files ChatGPT will read), and
- this ChatGPT-brief commit.
`git push`, then verify on github.com that `audit_cycles/deep_research_june_2026/` shows both subfolders.

## Launch
1. Open ChatGPT 5.5 in the browser; enable **Deep Research** and make sure the **GitHub connector** is connected with access to `YVashchuk/Dungeons-of-the-Black-Castle`.
2. Paste the FULL contents of `00_BRIEF_CHATGPT.md` as the research prompt (the brief is self-contained; the connector is only needed for the case files and the canon).
3. Start the research.

## Notes
- The brief's STEP 0 makes ChatGPT verify repo access first and STOP with an explicit error if the connector fails — so a misconfigured connector costs nothing.
- The brief forbids reusing other AI reports (independence for cross-arbitration).

## Afterwards
- Save ChatGPT's full report **verbatim** as `chatgpt_session_1_report.md` in THIS folder and tell Claude.
- Both reports (Gemini + ChatGPT) then go through the canon-first verification pass (FB2 → data) before anything changes in the repo.
