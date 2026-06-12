# ARBITRATION — June 2026 deep-research cycle
**Date:** 2026-06-12 · **Registry context:** v2.81 (group_43 §887, group_52 amulets, ARITHMETIC_MAP deferrals §390/§435) · **Verifier:** canon-first pass against `assets/fb2_remake.fb2` + `src/remake_data.js` (1221 ¶, baseline 1197 reachable)

## 1. Inputs & independence
| Tag | File | Size | Format compliance | Independence |
|---|---|---|---|---|
| G1 | gemini_session_1_report.md | 42.5 KB | ✗ none (essay) | independent run |
| G2 | gemini_session_2_report.md | 17.8 KB | ✗ none; pivoted to "researching the 2018 remake" | same-chat follow-up (secondary) |
| C1 | chatgpt_session_1_report.md | 20.4 KB | ✓ full | independent run (repo via ZIP w/o `originals/`) |
| C2 | chatgpt_session_2_report.md | 24.2 KB | ✓ full | same-chat follow-up (secondary) |
| CL1 | claude_session_1_report.md | 20.1 KB | ✓ full | independent run (attachments) |
| CL2 | claude_session_2_report.md | 20.5 KB | ✓ full | same-chat follow-up (secondary) |

G1/G2 carry near-zero case value (no FOUND/[SOURCE: structure, no § anchors). Salvage: URL leads (quest-book.ru, faqs.org.ru, old-games.ru, samlib.ru) and one nugget — quest-book.ru/forum/topic/342/50: «непонятный момент с едой для беглецов — в первом издании, кажется, её нельзя было получить».

**Echo-risk note:** the decisive C/CL quotes cite EXTERNAL early-edition texts whose content *differs* from our remake (свисток vs амулет; −25 vs −35) — i.e. they are not echoes of our attached case files.

## 2. Edition genealogy (cross-confirmed)
- 1991 first edition = **617 ¶**; 1995 second edition = **651 ¶**, renumbered, with «секретные коды» (hidden ± arithmetic). Sources: tesera.ru/article/95286, imaginaria.ru, quest-book.ru/forum/topic/342. CL1: the 1995 edition has its own off-by-one misprint (¶ ≥ 590).
- **Recorded contradiction:** the "617-section" online witnesses (thelib.ru / knijky.ru) *contain* arithmetic («вычтите 25», «прибавьте 30», «(+156)/(−83)/(+59)») — so either those texts are mislabeled later editions, or "arithmetic = 1995 invention" is imprecise. Unresolved; does not affect our wiring (the remake's own arithmetic is the spec).
- lib.ru `blacktower_game.txt`: CL1 identifies as 1995 (ЛОВКОСТЬ/СИЛА/ОБАЯНИЕ stats) — treat as 1995 despite C-sessions calling it "early family".
- CL2 surfaced community-reported transition bugs *of the remake itself* («пункт 339 ведёт в 425 — хождение по кругу»; «в 562 надо „Заплатите (315)“, а стоит (562)») → **backlog candidates** for a separate internal audit.

## 3. CASE 1 — §887 face-6 → §734
**Verdict: externally UNRESOLVED.** No report recovered the original six-outcome list, the original face-6 target, or errata for this misprint (4× NOT FOUND). Context recovered: C2 — in the early text the castle-gate dice mention is a failing bluff («Орки даже не знают такой игры»; correct bluff = «карты»); CL1/CL2 — the actual dice den is the сторожка in the courtyard (topic/386). CL2 inference (plausible, unproven): the face-6→§734 jump is a **remake-era routing error** (same class as the community-reported remake transition bugs).
**Decision:** keep registry group_43 **option A (FB2-faithful)**; candidate repair → §769 stays documented. Resolution path: `black_tower_91.pdf` scan (quest-book read/pdf/2095, password-protected), 2023 5th edition (gamebooks.ru, claims 1991 text), DOS adaptation / «Игровая Матрица» CD.

## 4. CASE 2 — amulets / зеркальце / пропуск
- **Q2.1 (§625 original wording): NOT FOUND** in any report → stays open; our strict «золотым амулетом» re-gate stands (it is the remake's own wording).
- **Fugitives' gift:** early text gives «зеркальце и **золотой свисток**» (knijky p.57, verbatim) and the found-camp variant «золотой свисток (+156), зеркальце (−83), эмблему… (+59)» (thelib/lib.ru; C2+CL1+CL2 concur). The remake **substituted** these with «Золотой амулет (вычтете 333)» (§390/§500 internal check). C1 trace «Это Золотой амулет (+ 217)» (lib.ru, Medium) — unresolved tension; the golden whistle exists in the remake separately (§311 pouch; used §142 etc.).
- **Bear-fur amulet:** confirmed original (verbatim summon text; one-of-three reward амулет/пояс/шкура; tesera: a moral test). No tradability anywhere → Q2.2 negative.
- **Pass systems: TWO, both canon.** Early text has the зеркальце-as-пропуск knight scene verbatim AND a separate paper «пропуск» («Предъявляете пропуск, и Гоблины… — 323»; «Вы показываете пропуск, и она тает в воздухе»). Internal: the remake keeps both — §175 («тает в воздухе») and the §954 knight list («Золотое кольцо? Бронзовый свисток? Четки?» — четки exist, §475 monk). CL2's "single password system" inference **refuted** by C2 verbatims. → group_52 Q4 answered.
- Mirror −13 stationary-mirrors secret confirmed (topic/386 quote; early target −465) — matches our B3 wiring.

## 5. CASE 3 — fugitives' friend: **SOLVED INTERNALLY** (headline result)
The reports supplied the keys («Трое из Эвенло», камердинер lead, the −25 note); the remake FB2 supplied the proof:
- **−35 (password delivery), TWO sites verified:**
  - **§1080 − 35 = §1045** — escort corridor → true delivery: «Вы тихо шепчете старику: „Трое из Эвенло“. Он вздрагивает… отдаёт вам свечу… вы свободны» → exits (1146 / 930). Matches the early-text delivery scene almost verbatim → cross-edition continuity proven. §1045 (and its §1146 chain) currently **inbound NONE**.
  - **§766 − 35 = §731** — the library: wrong старик; «Сейчас я принесу то, что вам нужно» → **§701 trap** («Библиотекарь обманул вас… поднять тревогу»). §731 currently **inbound NONE**.
- **+30 (name letter-sum), REFRAMED & solved:** §435 (via §223 ← §319) concerns the **bandits'** acquaintance, *not* the fugitives' friend. The name is **ГИЕНА** — the talking Hyena met at §337/§458 («просит передать привет разбойникам»). Sum Г4+И10+Е6+Н15+А1 = **36**; 36+30 = **§66**: «Так вы и в самом деле встречали Гиену?» — bandits release the hero for free **and gift «гребень из слоновой кости»** (item grant currently missing). §66 currently **inbound NONE**.
- **Refutations (for the remake line):** friend ≠ Хэрнок (remake has Хэрнок as lore only, §330/§996 — one of the three wizards, the two rings); C1's КАМЕРДИНЕР=105→135 reconstruction lands on the stone-rats ¶ (wrong); the камердинер/серебряный-свисток subplot is real but separate and **already wired** (§819→§947→§1030).
- **−25 vs −35:** the early text says «вычтите 25» (C2, knijky p.57 verbatim) — the remaster rescaled the offset for its renumbering. Q3.6: the mechanics predate the remake in some lineage; exact 1991 form still unproven (the recorded §2 contradiction).

## 6. Implementation plan (next batch — data-only, group_18/group_53 patterns)
1. **§435** → riddle `{modifier:30, valid_targets:[66], fail_target:100, fail_target_label:'Самому начать бой (100)', max_attempts:3, alphabet_mode:'ru_standard'}`; choices → [].
2. **§390** → auto_items token **«Пароль «Трое из Эвенло»»**.
3. **§1080** → gated choice «Шепнуть старику: «Трое из Эвенло» (1045)» (inventory_condition = token).
4. **§766** → gated choice «Сказать старику: «Трое из Эвенло» (731)» (token).
5. **§66** → auto_items «Гребень из слоновой кости» (+ sweep «гребень» for downstream uses before commit).
6. Registry **group_55**; update group_43 (research outcome, stays option A) and group_52 (answers above; Q2.1 open). Baseline 1197 → +4 minimum (66, 731, 1045, 1146 + chain).
7. Harness: riddle ГИЕНА→66 / fail→100; token gating both sites; §66 comb grant; §1131/§992/§439/§67/§95/§1113 riddles regression.

## 7. Optional web spot-verification shortlist (Deep Research, one pass)
Liveness + quote-accuracy audit of FOUND claims (NOT needed for the Case-3 wiring — proven internally): thelib.ru …read-2/4/5/7/8/9/10; knijky.ru …?page=57; lib.ru blacktower_game.txt; quest-book.ru topics 386, 342(+/50,/125), read/pdf/2095 & 2094; tesera.ru/article/95286 + user/Jumangee/thought/417299; imaginaria.ru article; gamebooks.ru 5th-edition blog; gamebooks.org/Item/7881.
