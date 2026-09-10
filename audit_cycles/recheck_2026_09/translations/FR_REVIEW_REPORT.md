**FR translation review — completed**

Reviewed commit `6c7b511e1a7f26af03337608672bb57e628a3b30`. The deliverables contain **678 exact replacements (677 text fields and one riddle-answer table)**, **six required missing-label additions**, and **36 numbered editorial or coordinated-repair decisions**. The archive and Russian source remain unchanged.

**Pre-flight.** ZIP SHA-256: `b5f11089fdd4e7f12ea537150cd281c2744c86c291a9b71c20b9bcd85e7275cf`. Registry: **v2.186**. `assets/illustrations/` is absent as declared; this did not limit the text review.

| Content | RU | FR | Result |
|---|---:|---:|---|
| Paragraphs `p` | 1,221 | 1,221 | All read against each other |
| Choice labels `c` | 2,221 | 2,221 | Equal count in every paragraph; positional targets match |
| UI keys | 364 | 364 | All read; runtime fragments checked |
| Spells / allies | 9 / 2 | 9 / 2 | All names and descriptions read |
| Item names | 120 | 107 | The 13 omitted names are hidden story flags, intentionally excluded by group_84 SA-02 |
| Enemy names / map labels | 67 / 43 | 67 / 43 | All read |
| Preface / pregame | 2 | 2 | Both read in full |
| Riddle-exit labels `rfl` | 6 | 0 | Six missing translations; Russian fallback confirmed |

The 58 omitted French `c: []` properties contain no labels and cause no text omission. Existing French data contains **4,048 string values**; none contains Cyrillic residue.

**Method and coverage.** The brief was read in full. All 1,221 complete paragraph pairs and all 2,221 positional labels received a reading pass, split into six consecutive ranges with recorded coverage. Supporting text received a complete separate pass and independent review. Findings were cross-checked against the current Russian locale, relevant `RU_PROOFREAD.json` entries, and correction groups 84–88; current source wording takes precedence over older proposed corrections. Automated checks covered keys, numbers, targets, arrows, label lengths, typography, names, HTML and concatenation boundaries. Runtime code was inspected only where necessary to interpret displayed text; isolated Node probes confirmed the six Russian riddle-exit fallbacks. No web or live game was used.

**Replacement counts.** These count JSON objects, not every individual character-level defect. Multiple edits in one field are combined into one nonoverlapping replacement; its note records the component reasons, and its class records the principal issue.

| Class | Replacements |
|---|---:|
| Fidelity | 67 |
| Grammar | 150 |
| Typography | 73 |
| Terminology | 18 |
| Label | 363 |
| UI | 7 |
| **Total** | **678** |

Confidence: **666 high**, **12 medium**. Separate from these counts are the six absent-key additions below. Corrections include truncated action labels, four reversed elevator arrows in §849, restoring knights/downstairs where French §742 says Orques/upstairs, stat-point grammar, French quotation spacing, duplicate “vous” in ally messages and gender-sensitive combat fragments. Ordinary synonyms and established name-transliteration schemes were retained unless they caused a concrete naming inconsistency.

**Twenty priority fidelity corrections.** Short excerpts are shown here; the JSON supplies exact replacement spans and fuller explanations. The §149 boat reading is confirmed by incoming §639; the §508 lake clue is confirmed by its destination §291.

| ID · § | Current RU reference | French before → recommended |
|---|---|---|
| T-132 · 416 | «Вернитесь на 366» | Revenez au 1366 → **Revenez au 366** |
| T-213 · 562 | «Заплатите (315)» | Paierez-vous (562) → **Paierez-vous (315)** |
| T-218 · 570 | «перьев лука» | plumes de l’arc → **feuilles d’oignon** |
| T-498 · 961 | «в стене» | dans le foin → **dans le mur** |
| T-516 · 984 | «Крышка сундука откидывается» | Le couvercle du coffre se rabat → **Le couvercle du coffre se soulève** |
| T-595 · 1130 | «три раза кого-нибудь убьете в бою» | trois personnes → **trois adversaires** |
| T-596 · 1131 | «я не сделаю этого» | peut-être ne le ferai-je pas → **je ne le ferai pas** |
| T-414 · 865 | «обратил ваше заклятие на себя» | contre lui-même → **à son profit** |
| T-384 · 835 | «стены комнаты раскалятся и сдвинутся» | se mettront en marche → **se rapprocheront l’un de l’autre** |
| T-365 · 811 | «под своим надгробием» | au-dessus de sa propre pierre tombale → **sous sa propre pierre tombale** |
| T-114 · 390 | «вещи принесли на поля из замка» | apportés des champs depuis le château → **apportés aux champs depuis le château** |
| T-087 · 327 | «большую деревню» | une grande ville → **un grand village** |
| T-056 · 221 | «спрашивает у вас о какой-то древней рукописи» | vous demande … un certain manuscrit ancien → **vous interroge … au sujet d’un certain manuscrit ancien** |
| T-039 · 149 | «Подплыв к берегу» | Après avoir nagé jusqu’à la berge → **Vous accostez, puis mettez pied à terre** |
| T-135 · 421 | «змея, голова которой скорее напоминает» | une tête de serpent ressemblant … à une énorme main humaine → **un serpent dont la tête ressemble … à une énorme main humaine** |
| T-308 · 716 | «заброшенных тропинок пока не попадается» | les sentiers abandonnés sont encore rares → **vous n’avez encore rencontré aucun sentier abandonné** |
| T-533 · 1027 | «раковин» | petites cuvettes décorées → **petites cuvettes servant d’éviers** |
| T-559 · 1064 | «отверстию в люке» | à l’ouverture du plancher → **à l’ouverture de la trappe** |
| T-581 · 1112 | «падает со стула» | s’effondre mort sur sa chaise → **tombe de sa chaise, raide mort** |
| T-177 · 508 | «…еро» | « …ière » → **« …ac »** |

**Six required additions outside the replacement schema.** These fields do not exist in the French source, so a truthful nonempty `from` cannot be supplied. They are definite findings (`label`, `high`), not doubtful readings. Add these properties to the corresponding French paragraph objects:

| Missing field | Recommended French value |
|---|---|
| `p[67].rfl` | Partir (53) |
| `p[95].rfl` | Partir (53) |
| `p[435].rfl` | Engager vous-même le combat (100) |
| `p[439].rfl` | Partir par le sentier qui s’éloigne de la maison (53) |
| `p[992].rfl` | Passer dans l’autre pièce (1123) |
| `p[1113].rfl` | Continuer sans connaître la réponse (1190) |

The archive’s `locSec` and `renderRiddle` functions were evaluated with French selected: all six buttons displayed Russian, and their click targets matched the numbers above.

**Coordinated localization issues.** The inventory overflow message can display “1 places”; its capacity unit needs number-aware formatting. This is documented in the doubtful file with repair choices. Ally announcement spacing is repaired in the two ally verb endings before the renderer’s appended `!`; UI boundary whitespace stays unchanged. The §435 table lacks the hash for **Hyène**; the JSON adds its verified hash-to-§66 entry while preserving the unidentified existing entry. The other six riddles have verified natural French answer routing. Across all seven riddles, the inherited alphabet-sum narration needs a coherent French adaptation: for example, MORT = 66, and 66 + 825 ≠ 932, although the existing widget correctly routes MORT to §932. No source constant was silently adapted.

**RU suspects — no Russian changes proposed.** Independent checks retained these source issues:

- **§87 → §141:** an offered Orque fight leads to an unrelated shore-arrival paragraph; the correct target was not established.
- **§353 via §§318/346:** the text presupposes a Dragon fight after peaceful gift routes.
- **§§411/850:** “и то, и другое” remains after three inspections; the three-part engine condition is already settled, and prose alignment remains open as PL-29.
- **§627:** the Princess’s quoted question refers to “her” jailer; French “Mon geôlier” correctly preserves the intended speaker.
- **§1070:** a corridor is described as tall yet passable only while crouching; the intended architecture is unresolved.
- **`ui.ui_btn_luck_roll`:** Russian says one die; the operation uses two. French plural is retained.

§950’s combat Healing permission is an implemented exception, and §1213’s shield bonus was already adjudicated; neither is reported as an unresolved rules defect.

**Validation.** Every JSON `from` occurs exactly once inside its identified serialized source field. A complete literal dry-run reparsed successfully and produced the intended French data. All paragraph digit multisets then matched RU; all choice targets and elevator arrows matched, and no French label exceeded 80 characters where RU was short. UI boundary whitespace and embedded HTML were preserved. SHA-256 checks confirmed that the ZIP and all **439 extracted reference files** are unchanged.

Apply replacements within `section` / `field` scope. Strings are literal JavaScript-source substrings: embedded line breaks and quotes retain their source escapes inside the JSON values. Do not reinterpret them as decoded paragraph text or perform an unscoped global replacement.
