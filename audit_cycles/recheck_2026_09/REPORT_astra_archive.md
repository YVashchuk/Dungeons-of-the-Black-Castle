# PRE-FLIGHT

Audit: card 6, Chat 1, 2026-09-05. Source: the supplied archive, root **Dungeons-of-the-Black-Castle-297b1e5fec11312802b39b76db7b79100e0f4a5b**. Commit **297b1e5fec11312802b39b76db7b79100e0f4a5b**, registry **v2.167**.

**Verified by execution:** 434 extracted files; Node `v24.19.0`; Python `Python 3.12.13`. The supplied ZIP retains 46 derivative JPEGs in `assets/illustrations/web/`; the full-resolution originals are absent. All 434 supplied files match the corresponding committed Git blobs. GitHub was used for repository identity, not external canon research.

From the extracted root, `node tests/run_all.js` exited 0. Required verbatim output:

```text
PASS p1_6d_harness.js              6d HARNESS: 64 passed, 0 failed
PASS _dist_ui_check.js             DIST REFACTOR CHECK: 55 passed, 0 failed
PASS p2_shell_i18n_harness.js      2C-SHELL HARNESS: 215 passed, 0 failed
BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)
```

The complete output is `BATTERY_OUTPUT.txt` in the evidence bundle.

**Verified by execution:** last `version_history` key is `v2.166 -> v2.167`; `group_84_2026_09_05_agent_smoke` contains 11 items, 10 DONE and only `SA-02_item_names_ru_only` OPEN. Parsed `GD`: 1221 paragraph keys.

Verbatim first sentence of §1: **«Вы быстро идете вперед и вскоре оказываетесь в лесу.»** First `###` heading in `REGISTRY_EXCERPT_v2.md`: `### UA-01_dialog_stack_dom_order - P1 - DONE`.

The sorted per-file SHA-256 manifests before and after are **byte-identical** (434 rows). SHA-256 of each manifest:

```text
042e3c7bf6f17aa2d3eeeeaec79de18ef3dce0dfe7dd59024fe5f9da0cc02d7e
```

Files: `SHA256_BEFORE.txt`, `SHA256_AFTER.txt`, `MANIFEST_COMPARISON.json`. The ZIP itself hashes to `dc75f91a26991f69821f74d6262841a943377be53336b558a481ca3caab9845e`. Pre-flight passed; the extracted tree was not modified.

# VERIFIED-OK

“Verified by execution” below means the named production functions ran in Node with explicit display/DOM stubs, or a stated Python/Node census ran. It does not mean browser, layout, or screen-reader verification. Diagnostic harness mistakes were corrected before recording successful probe results; they are not repository findings.

| Block | Volume and result |
|---|---|
| S | All 1221 canon paragraphs parsed; 677 condition candidates in 449 paragraphs manually classified. Complete class-(d) table: 57 rows in 38 paragraphs, 19 MODELLED / 19 PARTIAL / 19 UNMODELLED. 41 production-function scenarios executed. |
| M | 62 scenarios executed: all three weightless weapons with a full bag; both food action orders and an already carried serving; §131/§1175 round/Copy/larva/ally deaths; sword-at-open setup; five buff bridges in the intended and an unrelated fight; two Weakness targets; generic/scripted luck restoration; §781/§932 restoration; five batch pickups; shop/bag upgrade; betting and import failures. |
| I | 334 UI keys ×4 have exact key parity. All 334 keys used by literal calls, shell attributes and reviewed finite dynamic call domains exist in every locale. All 3905 French string values scanned after decoding JSON and stripping markup. 107 item names ×3 authored and key/typography-validated. |
| U | U1–U9 reviewed in shell/CSS/engine/map. 13 DOM-stub scenarios executed, including actual observer/media callbacks for the CU-15 regression. Seven font binaries inspected; Cinzel Decorative is static weight 700, and Forum contains the required Ukrainian letters. |
| D | GAME_RULES sections 0–11 and sub-sections 3.1–3.8 spot-checked (19 records); README, QUICKSTART, test runner/harnesses and licence/credits reviewed. All 434 file paths/sizes inventoried and 203 UTF-8 files scanned for credential/path patterns. |

Commands from the audit output directory: `node story_probes.js`, `node mechanics_probes.js`, `node ui_probes.js`, `node census_i18n.js`, `python3 extract_conditions.py`, `python3 classify_conditions.py`, `python3 story_table.py`, `python3 reach_story.py`, `python3 fr_typography.py`, `python3 hygiene_scan.py`, `python3 translate_items.py`. Inputs remain outside the output directory; reproduction instructions are in the evidence bundle.

**Registry resolutions — verified by code reading and execution where applicable.** PT-01’s specified positive gates and mandatory first-visit grants work. Both deed orders admit victory in the story-state graph; old-save recovery and §81’s negative case are separate findings. Of group_84’s ten DONE resolutions, nine match their stated behavior in the checks performed; CU-15 is partial (AS-19). SA-02 remains the known OPEN translation task and is not counted as a new finding. Full resolution text and verdicts are in `RESOLUTION_RECHECK.json`.

| Resolution | Recheck |
|---|---|
| PT-01 | Two hidden, weightless, mandatory deed flags and positive/negative victory gates match the resolution; AS-03/AS-13 remain. |
| SA-01 / SA-03 | Both dock pills have translation attributes; the dock is appended inside `#scr-game .main`. |
| SA-04 | Five bridge buffs apply at the bound fight and are discarded at a different fight. |
| CU-13 | Riddle input shrinking, automatic button width and phone wrapping rules are present. |
| CU-14 / CU-17 | Phone controller owns log focus; closed log starts and remains inert. |
| CU-15 | PARTIAL: breakpoint closure leaves stale dialog state (AS-19). |
| CU-16 / CU-18 | Nested-close fallback and replacement-picker refocus pass the DOM-stub probes. |
| CU-19 | CSS and font binary both specify static weight 700. |
| SA-02 | OPEN: all 321 requested translations delivered separately. |

**Interaction census — verified by code reading/execution.** There is no scripted-combat/deadline overlap, no luck/batch overlap, and no shop selling the three registered weapons. Riddle/auto-item overlap is exactly §§67/95. Generic luck choices do not combine `luck_type` with acquisition/cost/consumption fields. Buffs retain their destination through serialization and are discarded at a different fight. Food action-order fixes, once-per-journey summon commits, shop indices and batch indices hold. §436 prep persists for either luck outcome; B-08’s deliberate absence of combat snapshots is not re-reported. Four gambling routers remain outside the persisted dice-check/loot mechanisms (AS-14).

**U1–U9 detail — verified by code reading, supplemented by the 13 probes.** U1: open-order modal stacking and nested focus return work in the constructed hierarchy, with the breakpoint defect AS-19. U2: inventory controls, combat-card keyboard handlers, spell selection bounds, import input and focus rings are present; shop disabled semantics fail AS-18. U3: persistent notification/live combat channels and combat-status reset exist; two same-tick announcements leave the second message in the notification region (AT coalescing not tested). U4: safe-area rules, dvh fallbacks and 700/960px rules exist; physical layout is not asserted. U5: text, art, choices and riddle share the reader; riddle row shrink/wrap rules match CU-13. U6: all three sheet groups restore their nodes, and phone-log focus has one controller owner. U7: font descriptors and notices match inspected files. U8: five static translation channels, dock labels and replacement-picker refocus are present. U9: reading-flow, visual controls, touch-target and spell-counter changes remain in source and dist checks.

**Documentation and hygiene — verified by code reading/execution.** `LICENSE` starts with `MIT License` and `Copyright (c) 2026 Yuriy Vashchuk (code adaptation)`. It includes `© Дмитрий Браславский, 1991` and `Ремейк: Браславский + Морозов, 2018`; README also attributes the book. Font notices are present in source and dist. Permission to redistribute the book text is **not determinable from provided files**; presence of attribution is the only conclusion here. Credential-pattern scan: zero matches for GitHub tokens, private keys, AWS access IDs, API-secret patterns and credential-bearing URLs across the 203 decoded files. This is not a scan of git history or binary metadata. The three email occurrences belong to font attribution and its quoted audit evidence. Personal executable paths are AS-21. Only two supplied files exceed 1 MiB: `assets/pdf_original_1991.pdf` (5,242,660 bytes) and the built HTML (3,708,069 bytes); neither is a stray build dump by filename/content role.

**Ten consequential engine functions without production-body execution in the 16-harness battery — verified by code reading.** Some have source-string guards or separate Playwright coverage; neither establishes that the battery executes their body.

| Function | Missing behavioral gate |
|---|---|
| `renderGame` | First-visit grants, reload effects and disabled-only dead ends |
| `combatRound` | Target asymmetry, round deadlines and combined modifiers |
| `startCombat` | Bridge binding, initial kills, waiting enemies |
| `useAllyInCombat` | Summon commit, reinforcement timing, localized results |
| `doScriptedLuckCheck` | Result/prep commit and restoration |
| `applyBetting` | One stake and one payout per betting round |
| `renderDiceRoll` | Gambling outcome restoration |
| `renderStakePicker` | Stake removal and state/item eligibility |
| `completePurchase` | Transaction, capacity and stable choice index |
| `importSave` | Active map wrapper, invalid-format feedback and migration |

Evidence: `TEST_COVERAGE_GAPS.json`. The audit probes exercise many of these gaps without changing the repository battery.

# FINDINGS

**22 new findings: 3 P0, 15 P1, 4 P2.** These are evidence-backed findings for maintainer adjudication; the two ambiguous policy readings are identified explicitly in AS-02 and AS-22. Source quotations are verified as exact substrings of the decoded archive text in `build_report.py`; described GD fields are parsed data.

| id | block | severity | §§ / keys | evidence | minimal fix |
|---|---|---|---|---|---|
| AS-01 | S | P1 | §146; entries §56/§205 | **verified by execution** (`story_probes.js`). «Если вы пришли с параграфа 205, то отправляйтесь на 933, если же с параграфа 56, то на 1054.» Actual clicks from either entrance expose both destinations 933 and 1054. Neither exit tests entry origin. | Remember the entrance and gate the two exits; alternatively route each password entry to its own canonical destination. |
| AS-02 | S | P0 | §§297/411/797/850 → §489 | **verified by execution** (`story_probes.js`). «Если вы уже делали и то, и другое, то 489.» «Если вы уже осмотрели и то, и другое, то 489.» At the first inspection, §297/411/850 already offer death at 489; §797 omits that outcome even after all four inspections. | Record the four inspections; gate death on a shared exhaustion predicate and add the missing §797 branch. Adjudicate “both” versus the three listed alternatives before choosing the threshold. |
| AS-03 | S | P0 | §81 negative branch | **verified by execution** (`story_probes.js`). «Если уже удалось разбудить Принцессу, то 1220.» «Если же нет, то можете обратить внимание на побежденного врага (623) или осмотреть его кабинет: подойти к шкафу (797), к двери в противоположной стене (411), посмотреть карты на столе (850) или подойти к зеркалу (297).» With princess_awake present, the engine offers 1220 AND 623/797/411/850/297. The latter routes still lead to death although the negative case no longer applies. | Add inventory_missing="princess_awake" to all five negative-case choices. |
| AS-04 | S | P1 | §435; encounter §337, message §458 | **verified by execution** (`story_probes.js`). «Если вы действительно уже встречали кого-то из их знакомых, то сложите порядковые номера букв, составляющих его имя, прибавьте, прибавьте к этому «30» и посмотрите параграф с этим номером.» «Если же вы обманули их, то ваш обман непременно откроется, и лучше уж самому начать бой — 100.» The production riddle accepts ГИЕНА with visited=[1,319,223], reaches §66 and bypasses the encounter prerequisite (and the fight), earning the comb. | Grant hyena_met at the encounter §337. Check it before success in both RU arithmetic and localized hash paths; preserve fail_target=100. |
| AS-05 | S | P1 | §281 / §740 → §612 | **verified by execution** (`story_probes.js`). «Если вы захотите передать привет медведю, когда встретите его, загляните в параграф 612.» «Если знаете, как вывести его из состояния задумчивости, сделайте это.» The future-message reference is a direct forest→612 choice. At the bear’s cell, §740 has only→824, so the message cannot be used there. | Grant bear_greeting at §281; move→612 to §740 with inventory_condition="bear_greeting". Retain the voluntary departure. |
| AS-06 | S | P0 | §534 / §835 → §1138 | **verified by execution** (`story_probes.js; ui_probes.js`). «Теперь, если придется выбираться из замка, а в комнате будет открытое окно, вы можете позвать его, посмотрев параграф 1138.» «Если вы и этого не можете сделать, то через несколько часов стены комнаты раскалятся и сдвинутся, а вам придется спокойно смотреть на это и торопить смерть…» The stable offers→1138 immediately; the open-window consumer §835 omits it. With no Levitation, §835 renders only an aria-disabled spell choice and dispatches no canonical death. | Grant pegasus_friend at §534; put its gated rescue at §835. When neither rescue nor a usable spell remains, dispatch the death described there. |
| AS-07 | S | P1 | §94 → §989 | **verified by execution** (`story_probes.js`). «Она поможет вам, если вы того желаете, отвезти Принцессу вместе с вами на волшебном коне домой, к ее отцу, но дело в том, что это возможно в том случае, когда у вас не будет возможности победить злого волшебника, и Барлад Дэрт останется жив.» The black-horse escape remains offered with barlad_dead present. This is a terminal escape, not the victory paragraph. | Add inventory_missing="barlad_dead" to→989. Any further statue acquisition/consumer design needs a separate canon mapping. |
| AS-08 | S | P1 | §412 → §214 | **verified by execution** (`story_probes.js`). «Если есть веревка, то 375, иначе или придется обойти скалу, если еще не делали этого (214), или пойти по другой дороге, вернувшись на развилку (424).» The “not done this yet” route remains clickable after visiting 214. The existing rope condition is a separate, correctly wired check. | Grant cliff_circled at §214; add inventory_missing="cliff_circled" to §412→214. |
| AS-09 | S | P1 | §774 → §§1084/848 | **verified by execution** (`story_probes.js`). «Если нет, то можете взять, если еще не делали этого, серебряный сосуд (1084), стеклянный сосуд (848) или выйти из комнаты и войти в следующую (1003).» Both vessel choices remain after their respective visit. This finding concerns routes; first-visit auto_items already prevents duplicate loot. | Separate vessel-taken/inspection flags at the two destinations; negative gates on the matching choices. |
| AS-10 | S | P1 | §778 → §§626/1208 | **verified by execution** (`story_probes.js`). «Теперь, если вы еще этого не сделали, можете посмотреть два оставшихся сундука: большой (626) или средний (1208), или же вернуться в комнату (1082).» Both remaining-chest choices ignore the explicit previous-action condition. | Record the two inspections and add their inventory_missing gates; keep→1082. |
| AS-11 | S | P1 | §1098 → §§94/1196 | **verified by execution** (`story_probes.js`). «Теперь можете, если еще не делали этого, осмотреть шкаф (94).» «Если и это сделали, тогда выходите через дверь, в которую входили Зеленые рыцари — 1196.» The cabinet and departure alternatives are both unconditional, regardless of whether §94 was visited. | Grant cupboard_inspected at §94; negative gate on→94 and positive gate on→1196. |
| AS-12 | M/S | P1 | Six knowledge flags; §§13/95/385/390/660/688/923/937/1174 | **verified by execution** (`story_probes.js`). ` const STORY_FLAGS=new Set(['princess_awake','barlad_dead']); ` ` fish_help is a persistent reusable promise token, not a physical inventory item. ` All six older kind:"flag" entries cost one slot. Already learned passwords/lore and the fish’s promise go through optional item offers; a full bag can reject them, and ordinary drop handling can erase them. | Make knowledge zero-slot, non-droppable state. Move source grants from items/acquires to mandatory flags where the fact is learned; preserve optional physical objects and all existing consumer gates. |
| AS-13 | M | P1 | normalizeSave; firstVisit flags at §§81/627/976 | **verified by execution** (`story_probes.js`). ` const firstVisit=!S.visited.includes(S.section); ` ` if(firstVisit&&sec.auto_items){ ` Old v5 and v7 saves with all three paragraphs in visited and no new flags remain flagless after normalization and revisits. Such a save cannot recover either deed through these already visited grant scenes. | Backfill princess_awake from visited 627/976 and barlad_dead from visited 81 during migration; make the migration idempotent. |
| AS-14 | M | P1 | Betting: §§68/152/287 and dice routers 793/887/910/1187 | **verified by execution** (`mechanics_probes.js`). ` if(!(opts&&opts.repaint)) applyBetting(sec); ` «Вы выиграли 10 золотых.» Same-paragraph save/reload: §68 gold 22→14; §152 gold 37→42 and food 3→6; §287 gold 40→50. Each of the four gambling routers also permits a fresh roll after reload. | Persist a betting-round identifier, committed stake, roll and resolved payout. Reopening a page must restore that round; only choosing a new round may reset it. |
| AS-15 | M/U | P1 | importSave in game_logic.js and map_module.js | **verified by execution** (`mechanics_probes.js`). ` f.text().then(t=>{ ` ` }catch(err){ alert(t('oshibka_zagruzki')); console.error(err); } ` Invalid JSON and unsupported versions produce TypeError: t is not a function, with zero alert calls. The active map wrapper has the same shadowing as the base importer. | Rename the file-text callback parameter (for example rawText) in both implementations so t(...) remains the translation function. |
| AS-16 | I | P2 | useAllyInCombat; all four locales | **verified by execution** (`mechanics_probes.js`). ` ${a.icon} ${a.name}${t('povergaet')}${target.name}! ` The actual victory log contains undefined in place of the ally’s name in RU/EN/FR/UK. COMBAT_ALLIES carries numeric properties, while the localized name is supplied by allyText. | Replace the success and failure log uses of a.name with allyText(allyKey).name. |
| AS-17 | I | P2 | FR ui.2k6 / ui.masterstvo_2 / ui.vrag_poverzhen; prose guillemets | **verified by code reading and execution** (`fr_typography.py; mechanics_probes.js`). ` ${e.name}${t('2k6')} ` ` ${target.name}${t('vrag_poverzhen')} ` Three string-leading punctuation fragments attach directly to names without NBSP/NNBSP; hard-coded ! also bypasses French spacing. The full locale scan additionally finds 208 guillemet boundaries that differ from the brief’s NBSP house style. | Prefix the two colon fragments with U+00A0 and the exclamation fragment with U+202F; localize hard-coded punctuation and normalize guillemet interiors without rewriting HTML/CSS. |
| AS-18 | U2 | P1 | makePurchaseBtn; shops §§132/340 | **verified by execution** (`ui_probes.js; mechanics_probes.js`). ` btn.onclick=(e)=>{e.preventDefault();}; ` Unavailable/bought purchases only change styling and install a no-op click handler. Executed controls have disabled=false and aria-disabled=null, so their disabled state is not exposed. | Use native disabled, or aria-disabled="true" with guarded activation if retaining them in keyboard navigation is intended. |
| AS-19 | U1/U6 | P1 | group_84 CU-15; phone log→desktop→reopen | **verified by execution** (`ui_probes.js (production observer and media callbacks)`). ` if(!_bcIsDialog(el)) continue; ` ` so the panel is always re-opened under the current controller regime. ` The actual observer skips a closing panel once isMobileHud becomes false, leaving it in _bcDialogStack. Reopening on desktop gives _bcIsDialog=false but _bcTopDialog=event-log-panel and aria-modal=true. The resolution’s intended regime reset is incomplete. | Track whether a panel was a dialog when opened. On the breakpoint transition, explicitly remove its stack/opener state and modal attributes; do not decide close cleanup solely from the new breakpoint. |
| AS-20 | D | P2 | README.md / QUICKSTART.md | **verified by code reading and execution** (`census_i18n.js; hygiene_scan.py`). ` \| Выборов \| 2212 \| ` `` localStorage (ключ `podzch_v5`) `` `` 1. Скачать `dist/dungeons-of-the-black-castle.html` и отправить файлом `` README still lists 2212 choices, 179 auto_items and podzch_v5; code gives 2218, 182 and SAVE_KEY=podzch_v6. QUICKSTART assumes a private owner upload and recommends distributing the HTML alone despite external art/sounds. | Update the census and save key; give newcomers the playable URL and whole dist/ download, then separate clone/build/test instructions from the owner’s push helpers. |
| AS-21 | D | P2 | scripts/fix_ref_urls.py / scripts/write_icons.py | **verified by code reading and execution** (`hygiene_scan.py`). ` PROJECT = r"C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle" ` Two shipped utilities hard-code a developer’s Windows profile and checkout directory. They expose that local account identifier and do not work from a newcomer’s checkout. | Resolve paths relative to __file__ or a required CLI argument; replace personal paths in active utilities. Keep historical audit paths clearly identified as historical evidence. |
| AS-22 | S | P1 | §56/§205 negative password alternatives | **verified by code reading** (`GD.json / story_table.py`). «Если вы знаете пароль, воспользуйтесь им, если же нет, то придется на ходу быстро придумать, что вы скажете стражам.» «Если знаете пароль, воспользуйтесь им, если же нет, то придется на ходу придумать, что им скажете.» Only the positive password choice is gated. All seven excuse/combat alternatives remain available with castle_password. Under the literal if/else wording, these are missing negative knowledge gates. | Add inventory_missing="castle_password" to the seven alternatives, or explicitly adjudicate retaining voluntary deception despite knowing the password. |


# STORY-STATE TABLE

The complete table is `STORY_STATE_TABLE.csv` (57 rows); `CONDITIONAL_SENTENCES.csv` contains all 677 candidates with paragraph, source line, exact quote, class, reason and matched pattern names. Every UNMODELLED row with a consequence has a finding ID. PARTIAL rows distinguish an existing predicate from incomplete grant/negative-branch behavior. Repeated sentences remain separate rows so the census can be reconciled.

Classification totals: **a 182 / b 113 / c 38 / d 57 / e 287**. Class a covers possession, money, spell charges and numerical resources; b combat outcomes/conditions; c luck/dice; d history, knowledge, promises and character state; e narrative/counterfactual or an immediate voluntary action rather than a condition on prior state. A riddle’s typed answer can demonstrate knowledge without requiring an invented prior-visit flag. Thus ordinary riddles are MODELLED, while §435 explicitly requires a real prior encounter. §915’s password-selection challenge at §784 is treated as demonstrated knowledge, not an undocumented acquisition flag.

Paragraphs are split only at `^### §N`; stale `**Выборы:**` lists are excluded. Primary regexes (Unicode, case-insensitive):

```regex
\bесли\b
\b(?:в противном случае|иначе|в ином случае)\b
\b(?:только|лишь)\s+(?:если|при|в случае|те,?\s+кто)\b
\b(?:в случае|при условии|когда|пока)\b
\b(?:вы\s+(?:уже\s+)?(?:знаете|помните|читали|прочли|слышали|видели|бывали|были|побывали|побывали|обещали|победили|убили|разбудили)|вам\s+(?:уже\s+)?(?:известно|удалось)|уже\s+удалось)\b
```

Supplemental question/history/after-event patterns add 34 units to the primary 643:

```regex
\b(?:есть|имеется|знаете|помните|были|бывали|видели|встречали|встречались|удалось|приходилось|слышали|читали|знакомы)\s+(?:ли|ль)\b
\b(?:не забудьте|не забыли|уже успели|уже побывали|хотя бы раз|раньше встреч|уже встреч|прежде бывали)\w*
\b(?:после того,? как|как только)\b
```

The complete named set is `CONDITION_REGEXES.json`. All quotes retain original spelling and punctuation; the classifier does not “repair” them.

**Reachability — verified by execution (`reach_story.py`).** The stock BFS gives 1205/1221 because it follows structural and riddle edges without state predicates. The audit’s finite story-state abstraction starts at §1, follows current knowledge/deed gates, tracks the proposed visit/encounter/entrance facts and relocates the bear/Pegasus consumers for the proposed-fix variants. Physical items, money, charges and successful combat/luck/dice outcomes are existentially available; knowledge pickups are taken when available. This is a story-gate sanity bound, not a complete playable hero/resource proof.

| Model | Enumerated abstract states | Reachable paragraphs | Newly unreachable versus current story model |
|---|---:|---:|---|
| Current story/knowledge gates | 3,571 | 1,202 | — |
| Proposed gates; all four study inspections | 54,074 | 1,202 | none |
| Proposed gates; current inspection plus two others | 54,074 | 1,202 | none |

The common unreachable set is **47, 175, 218, 321, 330, 342, 644, 650, 661, 713, 714, 736, 875, 968, 1002, 1114, 1133, 1149, 1165**. The three additions to the stock 16 are **47/218/714**: no normal graph path leads from the fish promise at §13 to its consumers. This is already documented through group_74’s fish `STATE ROUTE` smoke setups, not a new demand to invent river links. Enforcing the proposed S repairs adds **no further unreachable paragraph** within the stated abstraction. It removes invalid histories and preserves at least one history to each remaining node. Every victory state in this abstraction has both `princess_awake` and `barlad_dead`.

# ITEM_NAMES_TRANSLATION.json

Delivered: **107 exact registry slugs × {en, fr, uk} = 321 noun phrases**. French uses curly apostrophes and NBSP within guillemets; Ukrainian names are noun phrases in the appropriate dictionary form. Proper names follow the existing locale/UI or the brief’s explicit terminology, including “Death of Orcs” / « Mort des Orcs » / «Смерть Орків». Distinct item concepts such as `melon` and `watermelon`, and `ring` versus `signet`, remain distinct. The hidden flags are included because the requested inventory covers all 107 slugs.

Integration needed for the already OPEN SA-02: add locale item maps and make `itemName` resolve active locale → Russian fallback → slug. The translation file is a deliverable, not a claim that the read-only game build now displays translated items.

French audit: all internal `?!;:` boundaries pass the specified spacing after treating `?!` as a single punctuation cluster. The exceptions are the three concatenated leading fragments and hard-coded runtime punctuation in AS-17. Its 208 guillemet boundaries concern the brief’s exact NBSP convention; NNBSP variants are a house-style difference, not a claim of universally invalid French typography. Full locations are in `FR_TYPOGRAPHY.json`.

# COUNTS

| Measure | Executed result |
|---|---:|
| Paragraphs / choice edges | 1221 / 2218 |
| auto_items / inventory_condition / inventory_missing | 182 / 134 / 2 |
| Items: food / weapon / item / flag | 107: 20 / 3 / 76 / 8 |
| Combat paragraphs / enemy entries / multi-enemy | 76 / 120 / 24 |
| Spell / spell_any | 100 / 3 |
| gold_condition / gold_cost / purchase | 34 / 59 / 36 |
| acquires / consume_on_use / pickup_batch | 15 / 32 / 5 |
| Riddles / dice sections / deadlines | 7 / 6 / 4 |
| UI keys / locales | 334 / 4 |
| 6d / dist UI assertions | 64 / 55 |
| Stock graph reachability / story abstraction | 1205 / 1202 |
| New findings P0 / P1 / P2 | 3 / 15 / 4 |

Highest-confidence fresh mechanics finding: **AS-14**, reproducible gold and food duplication/loss through same-paragraph reload, with exact before/after state records. Highest-priority story findings: **AS-02, AS-03 and AS-06**.

# NOT-CHECKED

- Chat 2’s public-build reader playthrough and live smoke rows were not run in this archive session. No route, screenshot, phone rendering, browser private-session result or screen-reader announcement is claimed.
- No complete state-space proof with finite spell budgets, all physical inventory combinations, gold, stamina, all combats and player decisions. The 1202 result is limited to the stated story-gate abstraction.
- The study text’s “both” after three alternatives does not determine a unique exhaustion predicate. AS-22’s permission to choose an excuse despite knowing the password needs explicit adjudication if the literal if/else is not intended.
- No comprehensive semantic retranslation of 1221×3 paragraph prose; only the requested item names, all UI-key existence, French typography and cited runtime messages were checked.
- No git-history secret scan, OCR/binary-metadata privacy scan, or inspection of the excluded full-resolution image originals. No legal conclusion about book redistribution permissions.
- Regex recall beyond the documented candidate patterns cannot be proved from a finite pattern list; all 677 extracted candidates were reviewed and all 57 class-(d) units mapped. Narrative-only candidates are retained for independent review.
