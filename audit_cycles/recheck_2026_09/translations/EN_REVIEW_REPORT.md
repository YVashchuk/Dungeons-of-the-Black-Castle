**English translation review — commit `6c7b511e1a7f26af03337608672bb57e628a3b30`**

The complete English corpus has been reviewed against the current Russian locale. The patch list contains **1,062 proposed replacements** affecting **223 paragraph texts, 794 choice labels and 7 other fields**. Correct the substantive translation and label defects before regenerating narration. **39 optional decisions** and **one confirmed interface plural issue requiring a coordinated template change** are documented separately.

**Pre-flight.** The full translation-review brief was read. The archive was extracted with read-only permissions; all 439 extracted files and the uploaded ZIP were verified unchanged after the review. No web access, source edits, game execution or live-build changes were performed. Registry history ends at **v2.186**.

ZIP SHA-256: `b5f11089fdd4e7f12ea537150cd281c2744c86c291a9b71c20b9bcd85e7275cf`.

English source SHA-256: `b6fad1ab410983e9d628c31e457a4c481c8c6345e20a3306fb7715fdafcbc452`.

Russian source SHA-256: `6b1f633b4694e67324b7bb2018f2b76e3d96ee9b6fc2457b45f89ffccb9a017f`.

| Corpus | RU | EN | Result |
| --- | --- | --- | --- |
| Numbered paragraphs | 1221 | 1221 | Identical IDs, 1–1221 |
| Choice labels | 2221 | 2221 | Count and positional destination parity in every paragraph |
| Interface keys | 364 | 364 | Exact key-set parity |
| Spells | 9 | 9 | Names and full descriptions reviewed |
| Allies | 2 | 2 | Names and verb fragments reviewed |
| Item names | 120 | 107 | 13 absent names are intentionally hidden story flags (SA-02) |
| Enemy names | 67 | 67 | Exact key-set parity |
| Map labels | 43 | 43 | Exact key-set parity |
| Preface / pregame | 2 | 2 | Both read in full |

**Method and coverage.** Six disjoint ranges covered every paragraph in full, followed by separate reading passes over every choice label. Automated checks covered all **4,048 English string fields**, including metadata, for key/count parity, numeric differences, visible foreign-script residue, quotation marks, fragment boundaries and label length. All interface strings, the preface, pregame, spell descriptions, ally fragments, item names, enemy names and map labels were also read against Russian. The current Russian text remained authoritative; `assets/text_corrections.json` groups 84–88, the subsequent registry resolutions and all 592 entries of `RU_PROOFREAD.json` informed the comparison. Relevant local runtime fragments were inspected to verify concatenation, hidden flags and riddle handling. This was a complete reading review, not a sample or an automated scan alone.

| Read range | Paragraphs | Labels |
| --- | --- | --- |
| 1–200 | 200 | 371 |
| 201–400 | 200 | 364 |
| 401–600 | 200 | 347 |
| 601–800 | 200 | 378 |
| 801–1000 | 200 | 389 |
| 1001–1221 | 221 | 372 |
| Total | 1221 | 2221 |

**Replacement counts.** Classification follows the primary defect; semantic errors in action labels generally use `label`, and interface composition defects use `ui`. Counts represent literal replacement objects, not independent gameplay bugs.

| Class | Replacements |
| --- | --- |
| fidelity | 70 |
| grammar | 115 |
| typography | 15 |
| terminology | 85 |
| label | 773 |
| ui | 4 |
| Total | 1062 |

Confidence: **1,054 high / 8 medium**. Terminology corrections use the existing locale names, including **Orc, Lesovichok, Chief of the Guard, Protective Charm, Ball of Thread, Prayer Beads** and **Ornate Key**. No transliteration scheme was replaced. Valid differences in sentence splitting, English dialect and literary register were retained or recorded as optional alternatives.

**Twenty priority fidelity findings.** The table includes semantically significant label defects; the JSON remains the exact application source. Russian quotations below normalize nonbreaking spaces for readability.

| Fix ID | Location | Russian reference | Current English → recommended English |
| --- | --- | --- | --- |
| T-250 | §416 t | Вернитесь на 366 | Return to 1366 → Return to 366 |
| T-369 | §562 t | Заплатите (315) или откажетесь и уйдете (541)? | Will you pay (562), refuse and leave (541)? → Will you pay (315), or refuse and leave (541)? |
| T-706, T-707, T-708, T-709 | §849 c[1–4] | На второй ↓ (1040); На второй ↑ (830); На третий ↓ (1068); На третий ↑ (869) | Four reversed arrows → down to 1040, up to 830, down to 1068, up to 869. |
| T-573 | §742 c[2] | Если перебили рыцарей — вернуться по лестнице вниз (1074) | If you have cut down the Orcs — return up the staircase (1074) → If you have killed the knights — return down the staircase (1074) |
| T-974 | §1131 t | Если ты ответишь мне, то я оставлю тебе жизнь и отпущу, иначе — смерть… | Tell me, traveler, what village is this?” → Tell me, traveler, what village is this? If you answer me, I will spare your life and let you go; otherwise—death…” |
| T-952 | §1097 t | Вы еще не заблудились? Тем лучше | Are you lost yet? So much the better → You have not lost your way yet? So much the better |
| T-740 | §882 t | Он сразу понимает, кто вы, и говорит, что идет спасать Принцессу. | says that you are going to save the Princess → says that he is going to save the Princess |
| T-375 | §570 t | Вы срываете одно из перьев лука, и оно на ваших глазах превращается в черную стрелу. | You tear one of the bow’s feathers, and before your eyes it turns into a black arrow. → You pluck one of the onion leaves, and before your eyes it turns into a black arrow. |
| T-035 | §70 c[0] | Идти к воротам (205) | Open the secret door (205) → Go to the gates (205) |
| T-105 | §200 c[0] | Немного углубиться в лес (77) | Go to the fugitives and question them (77) → Go a little deeper into the forest (77) |
| T-798 | §945 c[1] | Атаковать Зеленого рыцаря (174) | Risk offering something as a pass or… (174) → Attack the Green Knight (174) |
| T-800 | §948 c[1] | Выйти через дверь рядом с люком (771) | Your luck has abandoned you… (771) → Leave through the door beside the hatch (771) |
| T-720 | §860 c[1] | Попытаться рассмотреть рисунки без 12 глаз Зеленых рыцарей (1034) | Examine the drawing on the wall (1034) → Try to examine the drawings without 12 Green Knight eyes (1034) |
| T-246 | §411 c[4] | Если уже осмотрели шкаф, зеркало и стол — идти дальше (489) | If you have already examined the cabinet and the table, go on (489) → If you have examined the cabinet, mirror, and table, go on (489) |
| T-324 | §511 t | Амулетом можно воспользоваться в любом бою, но за пределами Черного замка. Там амулет бессилен. | The amulet can be used in any battle, but outside the Black Castle. There the amulet is powerless. → The amulet can be used in any battle, but only outside the Black Castle. Inside the castle, the amulet is powerless. |
| T-172 | §300 t | Куда? | “To whom?” → “Where?” |
| T-151 | §275 t | От заклятия, которое наложил на вас шпион, не можете увернуться | Because of the spell the spy has cast on you, you cannot dodge it, → You cannot evade the spell the spy has cast at you, |
| T-552 | §730 t | с десяток Орков и Гоблинов | a dozen Orcs and Goblins → about ten Orcs and Goblins |
| T-821 | §961 t | в стене над пропастью | in the hay above the chasm → in the wall above the chasm |
| T-1048 | §1205 c[0] | Перейти к применению бляхи с корабликом (249) | You may take it for yourself without the slightest hesitation (249) → Go to the instructions for using the Sailing Ship Badge (249) |

**Interface and typography findings.** The ally-log composition currently repeats the subject: **“You you ring…” / “You you clutch…”**. Two verb-fragment fixes remove the duplicate. The Eagle interface message incorrectly adds **“beneath”** the niche, and the door action needs **“break down”**. The remaining plural issue produces **“taking up 1 slots”** for a one-slot overflow; see I-01 in the doubtful file. English `item/items` selection itself is correct.

Visible English strings contain **no Cyrillic residue and no straight double quotation marks**; HTML attribute quotes were excluded from that typography check. Corrections address missing dialogue punctuation, malformed parentheses and other local defects. The five original labels exceeding 80 characters while their Russian counterparts were short (§§140, 159, 223, 225, 875) are corrected. Existing em-dash spacing and accepted English ellipsis styles were not mechanically standardized.

**RU suspects.** These are inherited source questions, not authorization to change Russian. English has been kept faithful where the source reading remains uncertain; label-only repairs follow the explicit paragraph action where available.

| Source location | Question retained for the maintainer |
| --- | --- |
| §88 | «проходите мимо через препятствие» is unclear about passing an obstacle versus passing through it; the ring is described as granting invisibility. |
| §131 / ui.orel_chasovoy_vyletaet_iz_nishi | Prose says the Eagle comes «из-под ниши», while the current UI says «из ниши». The English UI fix follows its own Russian key; the prose remains unchanged. |
| §§265, 389 | «у подножия» refers to a path; §265 also describes that path as ending and then continuing behind the house. |
| §§297, 411, 797, 850 | “Both” wording coexists with three inspection objects. Already documented as OPEN PL-29; §411’s explicit three-object label is followed. |
| §§335, 434 | The stone figure is a half-horse Centaur in §335, but has a human head, lion body and bird wings in §434. |
| §335 labels | “Take” labels point to later-use references described in the prose. Confirm the intended label wording across languages. |
| §353 | “After the fight with the Dragon” also follows routes where the Dragon accepts a gift peacefully. |
| §483 c[0] | «тропинка отрывается влево» differs from prose «отходит влево»; the English correctly conveys a branching path. |
| §627 | The Princess asks about «ее тюремщик» inside her own direct speech. The English repair uses indirect speech without changing the question. |
| §§672, 781, 787, 893 labels | Luck-style outcome labels describe inventory absence or a crossbow roll rather than a LUCK test; English labels identify the actual condition. |
| §§542, 1213 | Weapon-bonus wording («каждый раз 1 МАСТЕРСТВО»; «изначальное МАСТЕРСТВО не изменялось») merits clarification against the maintained rule before changing its meaning. |
| §1013 | Wandering “until death” and “until you lose your mind” has an unclear temporal relationship in Russian too. |
| §1070 | A «высокий» corridor is described as requiring a stooped posture. |
| §1172 | The severed Dragon head, rather than the neck stump, is said to be cauterized. |
| §1198 | «начинают вылезать ниши» describes recesses projecting outward; the intended magical steps/ledges remain unclear. |

**Unresolved localization choice.** All seven English riddles retain Russian alphabet-position arithmetic. Local code confirms that accepted English answer hashes are checked before the Russian sum fallback, so English input is supported. The narrator’s arithmetic directions still need a maintainer choice: preserve the historical calculation with a Russian-alphabet qualification, or narrate English answer-entry instructions. No offsets or riddle hashes have been silently changed.

**Validation.** Every JSON `from` is nonempty, occurs verbatim in the archived English JavaScript and exactly once within its specified field. All replacement spans are non-overlapping, and a sequential dry run on detached in-memory data succeeded. All label counts, order and final `(N)` destinations remain aligned with Russian; every label subject to the 80-character rule meets it. The seven edited metadata fields preserve their fragment boundaries. Re-serialization and JSON parsing succeeded. These checks validate the proposed patch data; they are not a claim of a browser playthrough or narration audition.

Use `section` plus `field` to locate each replacement; uniqueness is field-scoped, as required by the brief. `section: null` identifies metadata fields. The source archive remains unchanged.
