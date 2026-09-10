**UK translation review — complete; corrections required**

Commit: `6c7b511e1a7f26af03337608672bb57e628a3b30`. Target: `src/locale.uk.js`; reference: `src/locale.ru.js`.

The review covers every paragraph, choice label and existing Ukrainian text field. `UK_REVIEW.json` contains **1,782 validated replacement records**; `UK_REVIEW_DOUBTFUL.md` contains **39 author-decision entries**. A separate riddle-answer defect and six absent fallback labels require additions outside the text-only patch schema.

**Pre-flight and coverage.** The full translation brief was read. The archive was extracted with read-only file permissions. No web access or repository edits were used.

- Archive SHA-256: `b5f11089fdd4e7f12ea537150cd281c2744c86c291a9b71c20b9bcd85e7275cf`.
- All **439 extracted files** match their initial SHA-256 manifest after the review.
- RU and UK each have **1,221 paragraph texts, 2,221 labels and 364 UI keys**. Paragraph keys, UI keys, label counts and positional target numbers match. No original UK label exceeds 80 characters.
- Read all **4,048 existing UK string fields**: 1,221 paragraph texts; 2,221 labels; 364 UI strings; 18 spell strings; 4 ally strings; 107 item names; 67 enemy names; 43 map names; preface, pregame and language name.
- RU has 120 item keys; UK has 107. The **13 absent keys are intentionally hidden story flags**, documented in correction groups 84–85, and are not classified as translation defects. All 107 present item names were reviewed.
- Six additional RU `rfl` strings are absent in UK. Unlike hidden flags, these have visible Russian fallback paths; see below.

**Method.** Six complete, non-sampled parallel reading passes covered §§1–204, 205–408, 409–612, 613–816, 817–1020 and 1021–1221. Every paragraph and label was compared with RU for meaning, conditions, numbers and directions. The other sections received a separate full comparison, with local runtime inspection for concatenated UI strings. The 592-entry `RU_PROOFREAD.json` and relevant registry groups 84–88 were consulted; current RU remained authoritative. Independent label checks corrected proposed wording that could lose a condition, direction or numerical effect.

Automated checks covered key/label parity, all numeral sequences, final label targets and lengths, Russian-only letters, in-word apostrophes, UI boundary spaces and replacement applicability. No Russian-only letters or noncanonical in-word apostrophes were found. HTML attribute quotation marks were preserved. Proper-name transliteration was retained; genuine inconsistencies such as Дерд/Дерт and the false friend часовий/вартовий were corrected.

**Replacement counts.** One record may combine several changes to the same field so patches do not overlap. Counts below use each record’s primary class; mixed classes are identified in its note.

| Class | Records |
|---|---:|
| fidelity | 49 |
| grammar | 137 |
| typography | 741 |
| terminology | 24 |
| label | 821 |
| ui | 10 |
| **Total** | **1,782** |

Confidence: 1,780 high; 2 medium. Changed fields: 881 paragraph texts, 866 labels and 35 other strings. The large label count includes the brief’s action-and-object requirement and inherited clipped narrative labels; it does not mean that every such label was a mistranslation. The typography pass inserts 1,355 NBSPs before em dashes across 862 fields, including fields with substantive corrections. Leading/trailing UI-fragment spaces remain exact.

**Top 20 fidelity corrections.** The table quotes short excerpts; the JSON carries the exact unique replacement span. Meaning-changing label repairs retain class `label` where appropriate.

| ID · § / field | RU reference | Current UK → recommended UK |
|---|---|---|
| T-570 · §416 `t` | Вернитесь на 366 | Поверніться на 1366 → **Поверніться на 366** |
| T-735 · §562 `t` | Заплатите (315) | Заплатите (562) → **Заплатите (315)** |
| T-1013 · §742 `c[2]` | Если перебили рыцарей — вернуться по лестнице вниз (1074) | Якщо перебили Орків — повернутися сходами нагору (1074) → **Якщо перебили лицарів — повернутися сходами вниз (1074)** |
| T-1207 · §849 `c[1]` | На второй ↓ (1040) | На другий ↑ (1040) → **Спуститися на другий поверх ↓ (1040)** |
| T-1208 · §849 `c[2]` | На второй ↑ (830) | На другий ↓ (830) → **Піднятися на другий поверх ↑ (830)** |
| T-1209 · §849 `c[3]` | На третий ↓ (1068) | На третій ↑ (1068) → **Спуститися на третій поверх ↓ (1068)** |
| T-1210 · §849 `c[4]` | На третий ↑ (869) | На третій ↓ (869) → **Піднятися на третій поверх ↑ (869)** |
| T-563 · §411 `c[4]` | Если уже осмотрели шкаф, зеркало и стол — идти дальше (489) | Якщо вже оглянули шафу і стіл — іти далі (489) → **Якщо вже оглянули шафу, дзеркало й стіл — іти далі (489)** |
| T-1232 · §860 `c[1]` | Попытаться рассмотреть рисунки без 12 глаз Зеленых рыцарей (1034) | Розглянути малюнок на стіні (1034) → **Спробувати розглянути малюнки без 12 очей Зелених лицарів (1034)** |
| T-120 · §70 `c[0]` | Идти к воротам (205) | Відчинити потайні дверцята (205) → **Іти до воріт (205)** |
| T-272 · §200 `c[0]` | Немного углубиться в лес (77) | Піти до втікачів і розпитати їх (77) → **Трохи заглибитися в ліс (77)** |
| T-1370 · §945 `c[1]` | Атаковать Зеленого рыцаря (174) | Ризикнути запропонувати щось як пропуск або… (174) → **Атакувати Зеленого лицаря (174)** |
| T-1375 · §948 `c[1]` | Выйти через дверь рядом с люком (771) | Удача вас покинула… (771) → **Вийти через двері поруч із люком (771)** |
| T-104 · §54 `t` | над вами по мосту идет дорога | над вами, схоже, йде дорога → **над вами по мосту йде дорога** |
| T-744 · §570 `t` | Вы срываете одно из перьев лука | Ви зриваєте одну з пір’їн лука → **Ви зриваєте одне з пер цибулі** |
| T-795 · §610 `t` | Да поднявший этот камень сможет стать рыбой… | Так піднявши цей камінь зможе стати рибою… → **Нехай той, хто підніме цей камінь, зможе стати рибою…** |
| T-1128 · §811 `t` | скелет скрывается под своим надгробием | скелет ховається над своїм надгробком → **скелет ховається під своїм надгробком** |
| T-1407 · §961 `t` | потайного хода в стене над пропастью | потайного ходу в сіні над прірвою → **потайного ходу в стіні над прірвою** |
| T-1456 · §989 `t` | победить волшебника | побелити чарівника → **перемогти чарівника** |
| T-1607 · §1093 `t` | он говорит, что сейчас наложит на вас заклятие Исцеления | що ви не в силах підвестися, що зараз накладе → **що ви не в силах підвестися, вона каже, що зараз накладе** |

Other confirmed fixes include “dusty” mistranslated as «пильно» (§§150/227), an omitted verb in §381, missing «очі» in §407, «Голова майже минулася» for a subsiding headache (§889), and the duplicated «Ви ви…» in both ally-summoning messages. The proposed victory-screen text consistently addresses the player as «ви».

**Findings requiring work beyond literal string replacement.**

1. **§435 rejects the correct Ukrainian answer.** The locale stores hash `2124663179`; the unchanged engine calculates `1409238223` for «гієна». Its Russian fallback strips «і/є» and produces 20 + 30 = 50 instead of 66. This was independently reproduced from the local engine/hash algorithms; no browser playthrough is claimed. After the required prior encounter, the correctly spelled Ukrainian answer still cannot match either answer path. Add a Ukrainian answer entry `{"h":1409238223,"target":66}` to `riddles["435"]`, retaining any intentionally accepted alternative. This is numeric metadata, so no fictitious text `from` was created.

2. **All seven riddle arithmetic instructions need one localization policy.** They retain Russian alphabet arithmetic while presenting Ukrainian answers. The following table uses the full 33-letter Ukrainian alphabet, including ґ, є, і and ї. Six riddles accept Ukrainian words through localized hashes despite the misleading arithmetic; §435 does not.

| § | Ukrainian answer | Printed arithmetic using Ukrainian letter positions | Required target | Hash route |
|---|---|---:|---:|---|
| 67 | пароль | 108 + 0 = 108 | 95 | Accepted |
| 95 | совість | 132 + 50 = 182 | 163 | Accepted |
| 95 | сумління | 160 + 50 = 210 | 163 | Accepted |
| 435 | гієна | 43 + 30 = 73 | 66 | Fails |
| 439 | дракон | 80 + 0 = 80 | 67 | Accepted |
| 992 | смерть | 121 + 825 = 946 | 932 | Accepted |
| 1113 | павутина | 101 + 1046 = 1147 | 1131 | Accepted |
| 1113 | павутиння | 151 + 1046 = 1197 | 1131 | Accepted |
| 1131 | кладовище | 108 + 916 = 1024 | 992 | Accepted |
| 1131 | цвинтар | 104 + 916 = 1020 | 992 | Accepted |

For the electronic edition, the recommended author decision is to instruct readers to enter the answer as a word. Keeping manual book arithmetic instead requires a chosen Ukrainian alphabet, canonical answers and coordinated constants; synonyms have different sums. These changes are discussed in the doubtful file, not silently applied to printed numbers.

3. **Six missing riddle-failure labels fall back to Russian** through `locSec()`. Add the following existing-reference fields; empty or invented `from` strings are deliberately absent from the JSON.

| Missing UK path | Recommended value |
|---|---|
| `p.67.rfl` | Доведеться піти (53) |
| `p.95.rfl` | Доведеться піти (53) |
| `p.435.rfl` | Самому розпочати бій (100) |
| `p.439.rfl` | Піти доріжкою від будиночка (53) |
| `p.992.rfl` | Піти до іншої кімнати (1123) |
| `p.1113.rfl` | Продовжити, якщо не знаєте відповіді (1190) |

4. **The overflow-inventory sentence still needs runtime plural agreement.** `renderInvModalHeader()` can produce «Знайдено 1 предмет (займають 1 місць)…». The item noun already selects 1 / 2–4 / 5+ forms, but `zanimayut_tail` and `mest_no_v_meshke_tolko` do not. Extend plural handling to the verb and slot noun, or redesign the complete sentence as a count label. A single fixed fragment cannot cover all counts while preserving the brief’s boundary-space and punctuation contract. The separate 2/3-slot item-button fragment `ui.mest` is corrected in the JSON.

**RU suspects — reference left unchanged.** These are source ambiguities or inconsistencies, not reasons to copy defective Russian into Ukrainian.

| Location | Source concern |
|---|---|
| §107 | Missing comma after the parenthetical ending «…с костюмом?)» before «и возмущенно». |
| §165 | Label names a road; prose names another path. |
| §§265/389 | A path has a «подножие»; whether this means its end needs an author decision. |
| §302 | «широкого, но настолько узкого отверстия» leaves the dimensions unclear; the bag/carpet relative clause also misplaces the three-slot antecedent. |
| §§335/434; §1205 | Future item-use paragraph codes appear as immediate choices. The Centaur figurine’s description also changes to a winged, lion-bodied figure in §434. |
| §353 | Presupposes a Dragon fight even after peaceful gift routes. |
| §§411/850 | Three objects are listed, followed by «и то, и другое»; the registry already records the related study-gate ambiguity. |
| §§415/464/574/592/672/781/787 | Generic «Удача вас покинула…» labels describe inventory conditions, refusal or a target throw rather than a Luck test. Proposed UK labels follow the actual prose conditions. |
| §483 | Label «тропинка отрывается» conflicts with the prose’s «отходит»; UK already has the correct direction verb. |
| §511 | «Там амулет бессилен» has an ambiguous antecedent after “outside the castle”. |
| §627 | Quoted speech asks about «ее тюремщик» rather than the speaker’s “my”; direct versus reported speech needs a choice. |
| §800 | «Вы продули свою ставку, но зато вы выиграли…» needs outcome clarification. |
| §§969/1084 | Choice questions are terminated as statements in the reference. |
| §1070 | The corridor is described as high yet requires walking bent over; geometry is unclear. |
| §1172 | Fire cauterizes the detached Dragon head rather than the wound; the intended image needs author confirmation. |
| §§1212/1219 | RU mixes incompatible complements: «поставить … деньги … уходить» and «вас … найти … напасть». UK grammar is repaired without changing the actions. |
| `ui.ui_btn_luck_roll`; overflow header | RU says one die although the Luck routine rolls two; the shared overflow template also lacks complete number agreement. UK’s two-dice label was retained. |

**Validation and limits.** Every JSON `from` occurs exactly once in its designated original field after JSON decoding, and its escaped representation exists in the original JS source. Applying all records to an in-memory copy succeeds with no overlaps. Paragraph/UI keys and label counts remain unchanged; every final label target matches RU and every replacement label fits 80 characters. All UI leading/trailing whitespace is preserved. Only the two confirmed prose-link digits change (§416: 1366→366; §562: 562→315); no combat statistic, gold amount or printed riddle constant is silently altered.

This is a complete source-text review with targeted local runtime checks, not a browser or audio acceptance test. The original archive and extracted reference remain unchanged. The riddle metadata, missing fields, overflow pluralization and author-dependent source ambiguities remain explicit follow-up work.
