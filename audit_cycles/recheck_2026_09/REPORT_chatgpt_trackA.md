# REPORT_trackA.md — third-auditor Track A

Audited archive: <code>Dungeons-of-the-Black-Castle-69e6be2f2039e6794282692b61d0bdf7ecb5a763</code>. Scope is Track A only: the 22 UI-side group_81 resolutions plus the independent U1–U9 pass. The repository was treated as read-only. No web browsing was used.

## 0. PRE-FLIGHT

### Corpus identity

- **Verified by execution.** ZIP central directory: 427 entries including the archive root directory. Extraction produced 426 descendants: **375 regular files** and 51 directories; there were no symbolic links. The deliberately removed <code>assets/illustrations/</code> directory is absent as expected.
- Archive root: <code>Dungeons-of-the-Black-Castle-69e6be2f2039e6794282692b61d0bdf7ecb5a763</code>.
- <code>node --version</code>: <code>v24.19.0</code>.
- <code>python3 --version</code>: <code>Python 3.12.13</code>.

### Mandatory battery

**Verified by execution** from the repository root with <code>node tests/run_all.js</code>; exit status 0. Full output:

~~~text
PASS p2_2a_harness.js              2a HARNESS: 25 passed, 0 failed
PASS p2_2b_harness.js              2b HARNESS: 44 passed, 0 failed
PASS p2_2c_harness.js              2c HARNESS: 35 passed, 0 failed
PASS p2_shell_i18n_harness.js      2C-SHELL HARNESS: 215 passed, 0 failed
PASS p1_6a_harness.js              6a HARNESS: 10 passed, 0 failed
PASS p1_6b_harness.js              6b HARNESS: 16 passed, 0 failed
PASS p1_6c1_harness.js             6c-1 HARNESS: 8 passed, 0 failed
PASS p1_6c2_harness.js             6c-2 HARNESS: 5 passed, 0 failed
PASS p1_6d_harness.js              6d HARNESS: 48 passed, 0 failed
PASS p1_6e1_harness.js             6e-1 HARNESS: 10 passed, 0 failed
PASS p1_6e2_harness.js             6e-2 HARNESS: 10 passed, 0 failed
PASS harness_groupB.js             HARNESS: 21 passed, 0 failed
PASS p1_items_5f_harness.js        5f HARNESS: 29 passed, 0 failed
PASS _signet_harness.js            SIGNET HARNESS: 12 passed, 0 failed
PASS _hygiene_harness.js           HYGIENE HARNESS: 13 passed, 0 failed
PASS _riddle_i18n_harness.js       RIDDLE-I18N HARNESS: 15 passed, 0 failed
PASS _dist_ui_check.js             DIST REFACTOR CHECK: 50 passed, 0 failed
PASS _dist_meta_check.js           DIST META CHECK: 7 passed, 0 failed
PASS _dist_art_check.js            DIST ART CHECK: 11 passed, 0 failed
PASS _dist_signet_check.js         DIST CHECK: 9 passed, 0 failed
PASS _dist_fr_check.js             DIST FR CHECK: 9 passed, 0 failed
PASS _dist_uk_check.js             DIST UK CHECK: 7 passed, 0 failed
PASS verify_reach3.py              Matches handoff claim of 1205 reachable: True
BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)
~~~

The required checkpoints are present verbatim: 6d = 48 passed, DIST REFACTOR = 50 passed, and 2C-SHELL = 215 passed.

### Registry and proof quotes

- **Verified by execution.** Last <code>version_history</code> key in <code>assets/text_corrections.json</code>: <code>v2.160 -&gt; v2.161</code>.
- **Verified by execution.** <code>pending_corrections.group_81_2026_09_04_recheck</code>: 30 items; the only status is <code>DONE</code>.
- **Verified by code reading.** First sentence of paragraph 1 in <code>assets/book_text.md</code>: «Вы быстро идете вперед и вскоре оказываетесь в лесу.»
- **Verified by execution.** Programmatic JSON parse of <code>GD</code>: 1221 top-level paragraph keys.
- **Verified by code reading.** First <code>###</code> heading in <code>REGISTRY_EXCERPT_v2.md</code>: <code>### UA-01_dialog_stack_dom_order - P1 - DONE</code>.

All stop-gate values matched, so the audit continued.

### Required reading and read-only check

**Verified by code reading.** I read the third-auditor brief in full first, then <code>BRIEF.md</code>, followed by <code>REGISTRY_EXCERPT_v2.md</code>, <code>assets/GAME_RULES.md</code>, the three frozen reports, <code>MANUAL_SMOKE_CHECKS.md</code>, <code>tests/README.md</code>, and the prior <code>UI_AUDIT.md</code>.

**Verified by execution.** After the audit commands, every regular file was compared by relative path and SHA-256 with a second pristine extraction. Both trees contained 375 files and had the same path-stable tree fingerprint:

~~~text
f8d186e34a58064b1375c5cf1cee14407095fe3f190fc5a28b97273da6138f67
ALL_FILE_CONTENTS_MATCH=true
~~~

## 1. VERIFIED-OK

### 1.1 V-UI — group_81 resolutions

All **22/22** UI-side resolutions match their stated specifications and their original defects are gone. Findings in §2 are new residuals or side effects; they do not re-flag the closed defect.

| item | result | evidence |
|---|---|---|
| UA-01 | MATCH | **Verified by execution.** The actual stack functions produced <code>z[101,102,103]</code>, top <code>d3</code>; closing it cleared its inline z-index and exposed <code>d2</code>. The fallback made zero background-focus queries while another dialog remained. |
| UA-02 | MATCH | **Verified by code reading.** Sidebar eat/drop controls are native <code>button type="button"</code> elements with item-specific aria-labels; the reset CSS and ≤960px target rules include both classes. |
| UA-03 | MATCH | **Verified by code reading.** <code>#combat-round-status</code> is a visually hidden <code>role=status</code>, <code>aria-live=polite</code> diff mirror rather than making the rebuilding combat log live. |
| UA-04 | MATCH | **Verified by execution.** RU/EN/FR/UK each contain 334 UI keys, with parity; HUD map/log/menu names use dedicated emoji-free keys. RU resolves to «Карта», «Журнал», «Меню». |
| CA-01 | MATCH | **Verified by code reading and execution.** <code>renderRiddle</code> targets <code>#c-list</code>; all seven parsed riddle sections are 67, 95, 435, 439, 992, 1113, 1131. |
| CA-02 | MATCH | **Verified by code reading.** Clickable combat cards receive role/button semantics, <code>tabIndex=0</code>, Enter/Space, an enemy-specific aria-label, and <code>aria-pressed</code>. Selection uses box-shadow while the global keyboard outline remains free. <code>updateCombatEnemyDisplay</code> mutates the existing card, so Weakness re-selection does not rebuild the focused node. |
| CA-03 | MATCH | **Verified by execution and code reading.** A vanished opener falls back to the first enabled <code>#c-list</code> button or <code>#s-area</code>, and aborts while any top dialog—including a sheet—remains. |
| CA-04 | MATCH | **Verified by execution.** Two same-tick calls through the actual <code>bcAnnounce</code> produced the write trace <code>["","","A","B"]</code>; the persistent live region exists and visual toasts are not independently live. Actual AT coalescing is listed in §4. |
| CA-05 | MATCH | **Verified by code reading.** All three dice renderers invoke <code>bcAnnounce</code> and focus the newly created Continue/pick control after the roll. |
| CA-06 | MATCH | **Verified by code reading.** <code>startCombat</code> invokes <code>_bcCombatStatusReset</code> immediately after clearing the combat log, so equal-or-larger intro batches start diffing at zero. |
| CA-07 | MATCH | **Verified by code reading.** The import input uses <code>class="sr-only"</code>, remains in the menu Tab order, and stays wrapped by its label. |
| CA-08 | MATCH | **Verified by code reading and static parsing.** Item names occur in eat/drop names; close/add-item controls are named; HUD numeric chips have hidden labels; unavailable spell choices expose <code>aria-disabled</code>; visual pills expose <code>aria-pressed</code>. Static shell parse: 45 buttons, zero unnamed; five form controls, all with a name source; zero broken ARIA IDREFs. |
| CA-09 | MATCH | **Verified by code reading.** Spell quantities refocus the same/sibling control; inventory removal/eating calls <code>focusInventoryRow</code>; offer-modal removal selects the next row or first enabled modal control. |
| CA-10 | MATCH | **Verified by code reading.** Event panel/FAB/visual dock use the specified safe-area offsets; the phone modal cap subtracts top and bottom insets; the panel has role/name, focus-in/out, and Escape-out behavior. |
| CA-11 | MATCH | **Verified by code reading.** Landscape and portrait intermediate bands are 701–960px; the touch-target band is ≤960px; the HUD band remains ≤700px. |
| CA-12 | MATCH | **Verified by code reading.** <code>.hud-name</code> and <code>.hud-chip</code> both set <code>line-height:1.2</code>, preserving the stated approximately 70px budget. |
| CA-13 | MATCH | **Verified by code reading.** <code>returnSheetSection</code> restores <code>home.slice().reverse()</code>; actual section sets are spells, flask+inventory, and notes. |
| CA-14 | MATCH | **Verified by execution.** <code>src/fonts/OFL.txt</code> contains all three notices (Cinzel 2020, Cormorant 2015, Forum 2011) and the OFL 1.1 body. |
| CA-15 | MATCH | **Verified by code reading.** The three selectors named by the resolution—<code>.modal h2</code>, <code>.stat-info h3</code>, <code>.event-log-header h3</code>—all explicitly set weight 400. |
| CA-16 | MATCH | **Verified by execution.** FR <code>ui_autosave_note</code> has U+00A0 before the colon; the FR UI scan found no regular spaces before <code>?!;:</code>, straight word apostrophes, or malformed guillemet spacing. The four UK map aria values consistently use <code>мапа</code>. |
| CA-17 | MATCH | **Verified by code reading.** <code>#sb-map</code> is displayed; the mini card is keyboard-operable; the M handler gates on game screen, modifier state, and the top dialog while still allowing map close. |
| CA-18 | MATCH | **Verified by code reading.** The high-specificity <code>#riddle-input</code> outline reset is absent; the shared <code>input:focus-visible</code> gold ring therefore applies. |

### 1.2 Independent U1–U9 pass

| block | volume and verified result |
|---|---|
| U1 — dialogs | **12 controller/interaction checks.** Open order, z-order, stale-stack filtering, initial target selection, name derivation, opener return, fallback, top-dialog guard, Escape gating, Tab/Shift+Tab wrap, end-overlay priority, and observer scope were traced. Core behavior matched; CU-01 and CU-03 are residual interactions. |
| U2 — keyboard/focus | **45 static buttons, five static form controls, two non-native inline click controls, four outline resets, and the dynamic choice/inventory/combat families.** Static controls were named and both non-native controls had role, tabindex, and Enter/Space handlers. CU-02, CU-04, CU-06, and CU-10 remain. |
| U3 — live regions | **Five channels/families:** notification, dice, luck, combat-round mirror, and deliberately non-live history logs. The intended channels exist without making rebuilding histories live. CU-05 and CU-12 remain; real AT delivery was not determinable. |
| U4 — responsive/safe area | **Five fixed-layer families and three width bands** were traced: screen/overlays, notification, FAB/panel, visual dock, sheet/modal; ≤700, 701–960 landscape/portrait, ≤960 targets. The specified code is present. Pixel geometry under non-zero device insets was not executable here. |
| U5 — reading flow | **Six renderers, seven riddles, and both long-list exemplars.** Every renderer writes to <code>#c-list</code> under «Ваш выбор» in the 72ch reader. Parsed choice counts are §132 = 25 and §340 = 15; the shared story scroller retains the whole flow. CU-01, CU-02, CU-04, CU-11, and CU-12 remain. |
| U6 — phone HUD/sheets | **Six HUD actions, three sheet kinds/four moved nodes, reverse restoration, HUD mirroring, breakpoint-exit closure, sheet/dialog interaction, language repaint, and map gating** were traced. Core resolution matched; CU-03 and CU-10 remain. |
| U7 — fonts | **Seven WOFF2 files, three family chains/notices, CSS ranges, binary charset, removed-face search, and dist packaging.** <code>fc-scan</code> reports Forum charset <code>0401–045F, 0490–0491, 04B0–04B1, 2116</code>, covering Ukrainian Є/Ї/Ґ and №. Removed faces do not survive. CU-07 and CU-08 remain. |
| U8 — i18n | **Five static channels, 334 × 4 UI-key parity, six map/HUD aria keys, autosave formatting, map refresh order, and live option text.** Static channel coverage and locale typography passed. CU-09 and CU-11 remain. |
| U9 — earlier stage A | **4/4 families rechecked:** UI-01 reading flow, UI-02 combat visuals, UI-05 targets/contrast, UI-08 spell counter/quantity states. Their source and built signatures remain, and <code>_dist_ui_check.js</code> passed 50/50. |

### 1.3 Additional executed probes

The principal command was:

~~~text
node /workspace/scratch/7dde74ce6ac2/trackA_probes.js /workspace/scratch/7dde74ce6ac2/extracted/Dungeons-of-the-Black-Castle-69e6be2f2039e6794282692b61d0bdf7ecb5a763
~~~

Key output:

~~~text
DIALOG_EXEC three_open=z[101,102,103] top=d3 close_d3_cleared=true next_top=d2 fallback_background_queries_with_dialog_remaining=0
ANNOUNCE_EXEC trace=["","","A","B"] final="B"
RIDDLE_DIALOG_EXEC section=95 auto_item=castle_password timer_delays=0,50 final_focus=riddle-input
MAP_I18N_EXEC before=["Внешний мир","Подходы к замку","Внутренние уровни замка"] after_refresh_en=["Внешний мир","Подходы к замку","Внутренние уровни замка"] changed=false
DIST files=103 license_files=[] html_claims_relative_ofl=true embeds_forum_woff2=true
HOTKEY_TRUTH qwerty_M=true azerty_physical_comma=true azerty_letter_M=true
~~~

Other executed checks were an <code>lxml</code> static-control/IDREF parse, the four-locale JSON parity and FR codepoint scanner, <code>fc-scan --format ... src/fonts/Forum-cyr.woff2</code>, dist license enumeration, and the pristine-tree SHA-256 comparison.

The probe also found the relevant source signatures for CU-01/02/04/05/08/09/10/11 in the built dist HTML, so those rows are not source-only drift.

## 2. FINDINGS

Every row is a hypothesis for maintainer adjudication.

| id | block | severity | §§ / keys / selectors | evidence (exact code or Russian quote) | suggested minimal fix |
|---|---|---:|---|---|---|
| CU-01 | U1 / U5 | **P0** | §95; <code>renderGame</code>; <code>renderRiddle</code>; <code>#modal-inventory</code>; <code>#riddle-input</code> | **Verified by execution and code reading.** <code>renderGame</code> calls <code>renderRiddle(sec)</code> before processing first-visit <code>auto_items</code>. §95 has <code>items:["castle_password"]</code>, displayed as «Пароль в замок», so <code>showInventoryModal</code> opens an aria-modal dialog during the same render. The dialog schedules initial focus at 0ms, but the actual riddle renderer has <code>setTimeout(function(){inp.focus();},50);</code>. The probe using both actual functions returned <code>timer_delays=0,50 final_focus=riddle-input</code>: focus ends behind the open modal. The same unconditional timer can move focus behind an already open menu when its language selector repaints any riddle. This breaks the dialog focus model rather than re-flagging CA-01. | Guard the delayed callback: focus only if the input is still connected and <code>_bcTopDialog()</code> is null. Prefer doing this only for a genuine paragraph entry, not a language repaint. |
| CU-02 | U2 / U5 | **P1** | All ordinary navigation; <code>goTo</code>; <code>renderGame</code>; <code>renderChoices</code>; <code>#c-list</code>; <code>#s-num</code> | **Verified by code reading.** Keyboard activation of an ordinary choice calls <code>goTo</code> → <code>renderGame()</code>; the latter replaces story content and <code>renderChoices</code> begins with <code>list.innerHTML=''</code>, destroying the focused button. <code>goTo</code> contains no focus transfer. CA-03 handles this only when a dialog closes; ordinary primary-flow navigation falls outside that hook. | Give the paragraph marker/heading a programmatic focus target and focus it after a genuine section change, or focus the first new choice after announcing the new section. Do not move focus on <code>{repaint:true}</code>. |
| CU-03 | U1 / U4 / U6 | **P2** | <code>#event-log-panel</code>; <code>_bcIsDialog</code>; global keydown handler; ≤700px | **Verified by code reading.** The panel is <code>role="dialog"</code> and becomes <code>width:100%</code> on phones, but it is neither aria-modal nor recognized by <code>_bcIsDialog</code>, whose predicate accepts only <code>.modal-overlay</code>/<code>.end-overlay</code>. The shared Tab trap therefore never uses it as <code>top</code>; <code>toggleEventLog</code> only focuses the close control on entry and returns focus on exit. A phone keyboard user can Tab from the visually full-screen panel into obscured page/dock controls. The specified focus-in/out and Escape behavior itself is present. | On ≤700px only, give the panel a small focus trap (and modal semantics/background inertness), or integrate it into the controller with an explicit close callback. Keep the desktop side panel non-modal. |
| CU-04 | U2 / U5 | **P2** | §932; <code>renderDiceLoot</code>; pickup and «Продолжить» buttons | **Verified by code reading.** CA-05 correctly focuses the newly rendered pickup button after the roll. Activating it later executes <code>pick.remove();</code>; no subsequent focus call targets the still-present «Продолжить» button. Thus the second keyboard step recreates the focus-loss pattern CA-05 fixed for the first step. | After removal, focus the remaining Continue button with <code>preventScroll:true</code>. |
| CU-05 | U3 | **P2** | All combats, e.g. §36; <code>#combat-round-status</code>; <code>_bcCombatStatusReset</code> | **Verified by code reading.** The reset hook is exactly <code>window._bcCombatStatusReset=function(){ seen=0; };</code>; it does not clear <code>st.textContent</code>. <code>startCombat</code> clears <code>#combat-log</code> and calls the hook, but an ordinary fight with no modifier/script intro appends no new status immediately. The live node can therefore retain the previous fight's final round text inside the newly opened combat dialog until the first new round. | Clear the status node in the reset hook as well as <code>seen</code>; if a pending 0ms mirror write can exist, invalidate it with a generation token. |
| CU-06 | U2 | **P2** | Menu import label; <code>input.sr-only</code>; global <code>input:focus-visible</code> | **Suspected visible-focus failure; verified by code reading.** CA-07 makes the file input reachable, but <code>.sr-only</code> clips it to a 1px rectangle and the focus outline is applied to that clipped input. The visible label has no <code>:focus-within</code> rule, so there is no explicit visible focus treatment on the visible import control. Pixel painting could not be browser-tested here. | Add a gold <code>label.menu-btn:focus-within</code> outline (or an equivalent class-specific rule) while retaining the hidden native input. |
| CU-07 | U7 | **P2** | <code>src/fonts/OFL.txt</code>; <code>dist/</code>; <code>build.sh</code> | **Verified by execution.** The source OFL has 3/3 notices and says redistributed copies must contain the copyright notice and license. The built HTML embeds the WOFF2 data and comments <code>license text in ./OFL.txt</code>, but enumeration of all 103 dist files found no OFL/license/copying file; <code>build.sh</code> does not copy one. A distribution consisting of the documented <code>dist/</code> folder therefore points to a nonexistent license. | Copy <code>src/fonts/OFL.txt</code> to <code>dist/OFL.txt</code> in the build and add a dist assertion for its notices/license body. |
| CU-08 | U7 | **P2** | <code>.menu-content h2</code>; <code>#menu-modal-title</code> | **Verified by code reading.** CA-15's three named selectors correctly set weight 400, but the separate rule <code>.menu-content h2{font-family:var(--font-ui);color:var(--gold);margin-bottom:24px;}</code> does not. <code>#menu-modal-title</code> is an actual h2 outside <code>.modal</code>; the UA bold default requests a weight Forum does not ship, leaving this fourth Cyrillic UI heading eligible for synthetic bold. | Add <code>font-weight:400</code> to <code>.menu-content h2</code> and pin it in the dist UI check. |
| CU-09 | U8 | **P2** | <code>#map-layer-select</code>; <code>initMapUi</code>; <code>bcRefreshMapLanguage</code> | **Verified by execution.** <code>initMapUi</code> returns when <code>sel.options.length</code> is nonzero. <code>bcRefreshMapLanguage</code> updates layer objects but never existing option text. Executing the actual map module produced Russian options «Внешний мир», «Подходы к замку», «Внутренние уровни замка»; refreshing to EN left all three unchanged although EN locale values differed. This also affects a saved non-RU startup because map DOMContentLoaded initialization precedes <code>window.onload</code>'s saved-language application. | On every map-language refresh, synchronize each existing option's text by its value; alternatively make <code>initMapUi</code> update-or-create rather than returning once populated. |
| CU-10 | U2 / U6 | **P2** | M shortcut; <code>ev.code==='KeyM'</code> OR <code>ev.key.toLowerCase()==='m'</code> | **Suspected for a physical AZERTY keyboard; condition verified by execution with the brief's event tuples.** The truth-table probe returns true for QWERTY M, AZERTY's physical comma position (<code>code=KeyM, key=','</code>), and AZERTY's actual letter M (<code>code=Semicolon, key='m'</code>). Thus both comma and M can toggle the map while the UI advertises only «Открыть карту (клавиша M)». No real keyboard/browser event was available here. | Preserve the code fallback only for non-Latin/non-punctuation key values, or choose key-based semantics and document the layout tradeoff; add an event-tuple test so one physical layout does not get two shortcuts. |
| CU-11 | U5 / U8 | **P2** | <code>repaintAfterLangSwitch</code>; <code>renderGame({repaint:true})</code>; <code>#s-area</code> | **Verified by code reading.** A language change in-game calls <code>renderGame({repaint:true})</code>, but <code>renderGame</code> unconditionally executes <code>document.getElementById('s-area').scrollTop=0;</code>. The option suppresses betting side effects only. Closing the menu after changing language therefore loses the reader's position in a long current paragraph even though no navigation occurred. | Reset scroll only when <code>opts.repaint</code> is false; preserve the existing scroll position for locale-only repaint. |
| CU-12 | U3 / U5 | **P1** | Seven riddle §§; <code>#riddle-feedback</code>; <code>handleRiddleFail</code> | **Verified by code reading.** A wrong answer keeps focus in <code>#riddle-input</code> and visually reveals «Неверно. Осталось попыток: …», but the feedback node is a plain div with no role/live semantics and <code>handleRiddleFail</code> merely changes its class and counter text. There is no programmatic status channel for the error or dwindling attempts on a primary navigation mechanic. | Make the persistent feedback node <code>role="status" aria-live="polite"</code>, or send the complete localized error/remaining-attempt text through <code>bcAnnounce</code>. |

## 3. COUNTS

- **P0: 1**
- **P1: 2**
- **P2: 9**
- **Total: 12 hypotheses**

The single highest-confidence finding is **CU-01**: §95's parsed auto-item data plus the actual 0ms/50ms focus callbacks deterministically leave focus on the background riddle input after the inventory dialog opens.

## 4. NOT-CHECKED

- **Browser layout and real focus painting:** not determinable from the provided runtime. The installed Playwright package had no Chromium executable (<code>Executable doesn't exist at .../chromium_headless_shell-1234/...</code>), and <code>jsdom</code>, <code>happy-dom</code>, and <code>puppeteer</code> were absent. Per the brief, nothing was installed. Therefore exact 320/360/412/915/960/1366px geometry, non-zero safe-area inset behavior, visible clipping/overlap, and the C14/C15 font appearance were not claimed as executed.
- **Assistive technology:** whether a particular screen reader coalesces the same-tick <code>bcAnnounce</code> writes, announces a body-level live region while aria-modal is open, or treats retained combat status text on dialog entry is not determinable from code alone. The DOM write order was executed; AT delivery was not.
- **Native picker and physical keyboard behavior:** Enter opening the OS file picker and actual AZERTY event tuples were not exercised. Only reachability/source semantics and a synthetic event truth table were checked.
- **Manual smoke checks:** browser-dependent UI rows B1–B5 and C14–C19 in <code>MANUAL_SMOKE_CHECKS.md</code> remain visually unexecuted; their structural preconditions were inspected.
- **Out of scope:** Track B mechanics/canon adjudication, Track C standards research, UI-12, art quality, and the deliberately absent <code>assets/illustrations/</code>.
- **Web:** no browsing or network research was performed.
