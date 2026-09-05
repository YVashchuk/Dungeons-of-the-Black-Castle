# GATE_PROBES_REPORT.md - live probes of the story-state gates (groups 83/85)

- URL: http://localhost:8001/dist/dungeons-of-the-black-castle.html - 2026-09-05T20:31:07.202Z
- Method: tester hero via hash entry; the state (flags, items, origin, spell charges) is prepared through S and the paragraph re-rendered; the observation is the rendered UI (visible enabled choice buttons by target, bag text and buttons, death overlay). One screenshot per probe.

| id | verdict | observation |
|---|---|---|
| G-01 | PASS | sec.81 without the Princess: targets=623,797,411,850,297 |
| G-02 | PASS | sec.81 with princess_awake: targets=1220 |
| G-03 | PASS | sec.976 Barlad alive: targets=1120 inv=princess_awake |
| G-04 | PASS | sec.976 Barlad dead: targets=1220 |
| G-05 | PASS | flag granted=true bag="" used=0 |
| G-06a | PASS | sec.297 first inspection: targets=797,850,411 inv=study_mirror |
| G-06b | PASS | sec.297 after the other three: targets=797,850,411,489 |
| G-06c | PASS | sec.797 (new exit) after the other three: targets=297,850,411,489 |
| G-07a | PASS | sec.56 no password: targets=1201,37,516,700 |
| G-07b | PASS | sec.56 with password: targets=146 |
| G-08a | PASS | from 205: targets=933 |
| G-08b | PASS | from 56: targets=1054 |
| G-08c | PASS | origin unknown (hash entry): targets=933,1054 |
| G-09a | PASS | sec.740 without greeting: targets=824 |
| G-09b | PASS | sec.740 with greeting: targets=824,612 |
| G-09c | PASS | sec.281: targets=669 inv=bear_greeting |
| G-10a | PASS | sec.835 no Levitation, no Pegasus: death overlay=true targets= greyed=🌬️ Если у вас есть еще  |
| G-10b | PASS | sec.835 after sec.534 (Pegasus befriended), no Levitation: death=false targets=1138 inv=pegasus_friend |
| G-10c | PASS | sec.534: targets=750 inv=pegasus_friend |
| G-11a | PASS | sec.412 fresh: targets=214,424 |
| G-11b | PASS | sec.412 after the cliff: targets=424 |
| G-11c | PASS | sec.1098 fresh: targets=94 |
| G-11d | PASS | sec.1098 after the cupboard: targets=1196 |
| G-12a | PASS | correct answer without hyena_met -> sec 100 |
| G-12b | PASS | correct answer with hyena_met -> sec 66 |
| G-13a | PASS | sec.94 Barlad alive: targets=989,1098,1196 |
| G-13b | PASS | sec.94 Barlad dead: targets=1098,1196 |
| G-14 | PASS | used=1 (only the apple) bag="Пароль в замокМеч «Смерть Орков»🗑Рыцарский щит🗑Яблоко🗑" drop buttons=3 (password has none) |
| G-15 | PASS | covered by the automated smoke (C10 dice, C11 loot, C12 scripted luck, C13 purchase/batch, C18-203 luck, C19 mid-fight reload, C21 betting) - 25/25 on this build |

## Counts

- PASS: 29
