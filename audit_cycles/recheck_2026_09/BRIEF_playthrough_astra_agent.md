# BRIEF — READER PLAYTHROUGH by an agent with a browser AND the repository archive (ChatGPT 6 Astra, recheck cycle 2026-09)

**Build under test:** `https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/dungeons-of-the-black-castle.html` (GitHub Pages, branch `main`). Stay on this URL and its `#N` anchors; no other web use.
**Archive:** the attached ZIP is `main` at the commit named in its root folder (`Dungeons-of-the-Black-Castle-<hash>`), with `assets/illustrations/` removed. It is your reference library, read-only: the canon text, the game data, the engine, the registry of everything already found and fixed. You may read it and run scripts against it in your sandbox; you never modify it and you never use it to alter the running game.

**What you are.** A careful first reader of an interactive book who also happens to have the author's manuscript and the engine source on the desk. You play in the browser exactly as a player would — only clicks, typed riddle answers and the keyboard — and whenever the story and the interface disagree you check the manuscript and the data before writing the finding.

**Hard rules.**
1. No DevTools, no console, no editing of `localStorage`, no `S.…` manipulation. The game state changes only through the interface.
2. Hash entry (`#N`) is allowed **only** for (a) starting over at `#1` as the tester hero after your created hero died three times, and (b) the smoke rows in Task 2. Never to skip forward in a playthrough.
3. Every claim in the report quotes either the on-screen Russian text or the archive (`assets/book_text.md` = the corrected canon, `src/game_structure.js` = `GD`, `src/game_logic.js`, `assets/text_corrections.json`); label claims *observed* / *verified in archive* / *suspected*. Do not re-report anything the registry lists as DONE (groups 81–85) unless you saw it misbehave.
4. Screenshot every anomaly and every gate checkpoint below (`PL-01.png`, `G-03.png` …).

---

## 1. Pre-flight (opens the report)
- Archive root folder name; the last key of `version_history` in `assets/text_corrections.json` (expected `v2.170 -> v2.171`); `GD` parses to 1221 paragraphs; quote the first sentence of §1 from `assets/book_text.md`.
- Build signatures in the browser: `#1131` shows the riddle input with «Ответить»; on `#1` the sidebar has the mini-map card with «Открыть»; on `#585` collect the coconuts, open ☰ Меню, switch to English — the bag must read «Coconut (food: +3)» (a build older than 2026-09-05 shows «Кокос»). Then switch back to Russian and open a **new private window** so the playthrough starts clean.
- State what your browser can do: private window, reload, viewport size, keyboard.

## 2. Interface (short; full glossary in `audit_cycles/recheck_2026_09/SMOKE_BRIEF_chatgpt.md` §1)
Title screen → «Начать» → hero creation (dice for МАСТЕРСТВО / ВЫНОСЛИВОСТЬ / УДАЧА, name, then **10 spell charges** spread over eight spells with +/−; the line «N из 10 выбрано»). Sidebar: stats, «Заклятия», «Заплечный мешок» (7 slots; knowledge such as «Пароль в замок» is listed without buttons and weighs nothing), «Записки», mini-map, «☰ Меню», «📜 Журнал». Story column: `§ N`, text, «Ваш выбор» with the choice buttons. Fights: «⚔ Вступить в бой» → «⚔ Бой!» dialog: enemy cards (click to target), «Удар!», spell buttons, «Продолжить» / «✦ …» exits. «🎲 Проверить удачу», «🎲 Бросить кубик», offer dialog «+ Взять» / «Съесть сразу», riddles: input + «Ответить». Dying shows «Конец приключения»; the menu has «Начать заново».

## 3. Task 1 — the playthrough
**Goal:** reach paragraph 1220 having **both** woken the Princess and defeated Barlad Dert, starting from the title screen with a created hero.

**Planning is allowed and encouraged** — you have the data. Two known routes (from the maintainer's automated runs; verify them yourself in `GD` before relying on them):
- **Orange route:** golden orange at §74 (needs **Левитация** at §596 on the shortest way) → §226 → §976 (the Princess wakes; Barlad alive → only «→ 1120» is offered) → §1120 → §1044 → §1096 (Harpy) → §1164 → §823 (Barlad; no spells in that fight) → §81 (now «→ 1220» is offered) → §1220.
- **Ring route:** kill Barlad first (§1096 → §1164 → §823 → §81: without the Princess only the study choices are offered) → the ruby signet at §1071 → §297 needs the secret of the mirrors (`mirror_secret`, learned at §660/§923/§937/§1174) → §284 → §226 → §627 (Barlad already dead → «→ 1220»).
Recommended spell split for a created hero: Левитация 2, Исцеление 2, Сила 2, Слабость 1, Копия 1, Огонь 1, Плавание 1. Fights on the orange route: six-legged beast, goblin, lion (+ lioness if the lion falls first), four knights (§226), Harpy, Barlad.

**While playing, keep a running log:** every paragraph number in order; at each, one line: what you chose and why; stats after every fight, luck check, dice roll, meal, purchase; every item gained or lost with the paragraph.

**Gate checkpoints — observe and report each (table in the report, expected vs observed, screenshot):**

| id | where | expected (registry groups 83/85) |
|---|---|---|
| G-01 | §81 without the Princess awake | no «→ 1220»; the study choices 623/797/411/850/297 are offered |
| G-02 | §81 with the Princess awake | «→ 1220» offered; the study choices are NOT offered |
| G-03 | §627 or §976 with Barlad alive | only «→ 1120»; no «→ 1220» |
| G-04 | §627 or §976 with Barlad dead | «→ 1220» offered, no «→ 1120» |
| G-05 | §976 / §627 wake-up | the golden orange / ruby signet is consumed; the bag shows no new visible item (the flag is hidden) |
| G-06 | study §297/§411/§850/§797 | the death choice «Если вы уже делали и то, и другое (489)» appears only once the other three inspections are done; each inspection can be repeated only as a visit, not as a new exit |
| G-07 | §56 / §205 with the castle password known | only the password choice; no bluffing alternatives |
| G-08 | §146 | the exit matches the entrance: from §205 → 933, from §56 → 1054 |
| G-09 | §740 (the bear) | «→ 612» only if §281 was read earlier (the greeting) |
| G-10 | §835 (the room with the open window) | «→ 1138» only if §534 was visited (Pegasus); with no Levitation charge and no Pegasus → «Конец приключения» immediately, not an empty screen |
| G-11 | §412 / §774 / §778 / §1098 | «если ещё не делали этого» choices vanish after the deed; §1098 → 1196 appears only after the cupboard (§94) |
| G-12 | §435 riddle | a correct answer without having met the hyena (§337) routes to §100 |
| G-13 | §94 with Barlad dead | no black-horse escape «→ 989» |
| G-14 | bag | passwords / lore never take a slot and cannot be dropped; the Death of Orcs sword and the knight shield never take a slot |
| G-15 | reload | F5 on a luck / dice / purchase / stake paragraph never rerolls or repays; F5 mid-fight restarts the fight with full enemy stamina (documented rule) |

Not every checkpoint lies on your route — reach the ones you can naturally; for the rest, after finishing (or after a death), you may use hash entries to visit them (rule 2b) and say so.

**Anomaly protocol.** When the text promises something the interface does not deliver (a choice the book offers, an item the story says you carry, a stat change not applied, an odd fight or luck check, broken art or layout, a typo): stop, read the canon paragraph in `assets/book_text.md`, read the paragraph's `GD` entry, search `assets/text_corrections.json` for the paragraph number, then write the row: `id PL-01… | § | what the screen shows (quote) | what the canon says (quote) | GD fields involved | class: engine / data / text / layout / expected-by-registry | severity P0/P1/P2 | minimal fix in the PT-01 pattern (flag where the deed happens, gate where the canon checks)`. Deaths from bad dice are not anomalies; a death with no way to have avoided it, or a victory that the canon forbids, is.

## 4. Task 2 — smoke rows nobody has run yet (after Task 1)
From `SMOKE_BRIEF_chatgpt.md` §6: **A6** (§43 win within 10 rounds / overtime → §1016), **A7** (§261 / §737 / §1099 deadlines), **A8** (§781 dice check), **A9** (§725 door), **A11** (§801 / §1140 / §724 batch pickups with a full bag), **A16** (§655 / §470 targeted Weakness), **A17** (§39 / §865 / §160 modifier bridges), **B4** (spell picker +/−), **C12** in a fresh private window (§436: fail the luck check → Заклятие Силы → back → F5). Hash entry is allowed here. Verdict per row: PASS / FAIL / BLOCKED (reason) / UNCLEAR, with a screenshot.

## 5. Report — `REPORT_astra_playthrough.md`
0. PRE-FLIGHT (§1) · 1. ROUTE — the paragraph list with your one-line notes, the hero's stats at each milestone (creation, each fight, each meal, the two deeds, the end) · 2. GATE CHECKPOINTS — the G-table with observed / expected / verdict · 3. ANOMALIES — the PL-table · 4. SMOKE ROWS — Task 2 verdicts · 5. COUNTS — paragraphs read (distinct), fights won/lost, deaths, luck checks, anomalies by severity · 6. NOT-CHECKED. Offer the report and the screenshots for download and print the report in the chat.
