# 0. PRE-FLIGHT

**Track A — UI/accessibility re-audit, 2026-09-05.** Target: the user-supplied latest project archive, registry **v2.165**. Read-only diagnostic review; every finding below is a hypothesis for maintainer adjudication.

**Verified by execution.** Archive: <code>Dungeons-of-the-Black-Castle-main(3).zip</code>, 32,350,196 bytes; root: <code>Dungeons-of-the-Black-Castle-main</code>; **430 regular files extracted**. The root contains no commit hash and the ZIP comment is empty. The Git commit and its correspondence to live GitHub are **not determinable from provided files**. This report follows the user's instruction to continue against this archive; it does not represent the older v2.161 benchmark as the current state.

Archive SHA-256:

~~~text
bab757158e921838872742ccbec10b724678255065ae8c0e52007b8a5843d7ad
~~~

**Verified by execution:** <code>node --version</code> → <code>v24.19.0</code>; <code>python3 --version</code> → <code>Python 3.12.13</code>.

The following principal sources loaded successfully. Sizes are rounded KiB (1 KiB = 1,024 bytes); paths below are relative to the extracted root.

| Readable source | KiB |
|---|---:|
| src/game_shell_top.html | 65.6 |
| src/mobile.css | 7.0 |
| src/fonts/fonts.css | 4.7 |
| src/game_logic.js | 176.0 |
| src/map_module.js | 36.4 |
| src/game_structure.js | 157.6 |
| assets/book_text.md | 904.1 |
| assets/GAME_RULES.md | 17.5 |
| assets/text_corrections.json | 687.1 |
| audit_cycles/recheck_2026_09/REGISTRY_EXCERPT_v2.md | 85.2 |
| MANUAL_SMOKE_CHECKS.md | 15.5 |
| README.md | 18.5 |

The cycle briefs, tests/README.md, original July UI audit, frozen Claude A/B and Gemini A reports, and the archived ChatGPT A report were also available and reviewed. Current adjudications were taken from <code>assets/text_corrections.json</code>, including the changes after the frozen excerpt.

**Proof of access — verified by code reading / data parsing:**

- Paragraph 1 begins: «Вы быстро идете вперед и вскоре оказываетесь в лесу.»
- Programmatic JSON parsing of <code>GD</code> returned **1,221 top-level paragraph keys**.
- First excerpt heading: <code>### UA-01_dialog_stack_dom_order - P1 - DONE</code>.
- Shell default: <code>&lt;h2 id="menu-modal-title" data-i18n="ui_menu_title"&gt;Меню&lt;/h2&gt;</code>.
- Engine comment: <code>// &gt;&gt;&gt; BC_A11Y_DIALOGS (UI-04, group_79): shared dialog controller &gt;&gt;&gt;</code>.
- Last registry history key: <code>v2.164 -> v2.165</code>.
- Group 81: **30/30 DONE**. Group 82: **18/18 DONE**, including SM-01.

**Mandatory battery — verified by execution.** From the extracted repository root, <code>node tests/run_all.js</code> exited **0**. Required output lines, verbatim:

~~~text
PASS p2_shell_i18n_harness.js      2C-SHELL HARNESS: 215 passed, 0 failed
PASS p1_6d_harness.js              6d HARNESS: 56 passed, 0 failed
PASS _dist_ui_check.js             DIST REFACTOR CHECK: 53 passed, 0 failed
BATTERY: ALL GREEN (16 harnesses + 6 dist checks + baseline)
~~~

The full run also reported the **1,205 reachable-paragraph baseline**. The old brief's 48/50/215 checkpoints are superseded here by **56/53/215**; these are the actual outputs, not copied expectations. No packages were installed.

**Source integrity — verified by execution.** SHA-256 comparison against the manifest taken before the audit: **430 files before, 430 after; 0 changed, 0 added, 0 removed**. Audit scripts and outputs were written outside the extracted tree.

# 1. VERIFIED-OK

“Verified by code reading” means a source trace, not a browser test. “Verified by execution” below distinguishes the repository battery, static parsing/font inspection, and production functions executed with explicit DOM stubs. No browser executable was available; no native keyboard, layout, or screen-reader results are claimed.

## 1.1 Resolution verification

**Volume: all 22 group_81 UI resolutions inspected.** The specified implementation changes are present in all 22. The table identifies residual qualifications instead of treating implementation presence as proof of every interaction.

Unless marked otherwise, entries are **verified by code reading**.

| Item | Matched implementation / qualification |
|---|---|
| UA-01 | Explicit opening-order stack and modal z-index assignment. **Verified by execution:** three modal overlays received 101/102/103; closing the newest exposed the preceding one. |
| UA-02 | Inventory eat/drop controls are native buttons with item-specific accessible names and shared focus/target CSS. |
| UA-03 | The combat modal contains the polite status mirror; the rebuilding combat history itself stays non-live. |
| UA-04 | Dedicated emoji-free HUD map/log/menu names. **Verified by execution:** 334 UI keys in each of four locales, with exact key parity. |
| CA-01 | All seven riddles target the existing <code>#c-list</code>. The missing-container defect is closed; see CU-13 for a separate sizing interaction. |
| CA-02 | Targetable combat cards have role, tabindex, Enter/Space handling, name and pressed state; selection uses box-shadow. Updates retain existing card nodes. |
| CA-03 | Missing-opener fallback reaches choices when no dialog remains and avoids focusing the story under a sheet. See CU-16 for the remaining-dialog case. |
| CA-04 | Persistent notification live node; clear-then-deferred-write in <code>bcAnnounce</code>. **Verified by execution:** two same-tick calls finish with the second message; AT delivery was not measured. |
| CA-05 | All three dice-renderer families announce clicked results and focus the new action; restored results do not perform that click-only focus transfer. |
| CA-06 | Combat start explicitly resets the mirror counter after clearing the log. Group_82 additionally clears its text. |
| CA-07 | Import input uses <code>.sr-only</code> inside its label, without the former display:none exclusion. |
| CA-08 | Item-specific action names, HUD hidden stat labels, unavailable-spell aria-disabled and visual-toggle aria-pressed are present. |
| CA-09 | Quantity/inventory/offer rebuild paths select replacement controls. An empty inventory falls back to the add-item control. |
| CA-10 | Fixed-layer safe-area changes and explicit event-log focus-in/out are present. Desktop fixed-FAB return passed the focused probe; phone return remains qualified by CU-14. |
| CA-11 | Both intermediate orientation bands and the touch-target band end at 960px. |
| CA-12 | HUD name/chip line-height is 1.2; the specified six 36px buttons remain. Actual 360px-device height was not measured. |
| CA-13 | Reverse restoration preserves node order. **Verified by execution:** flask+inventory returned to their original order; leaving the phone breakpoint closed the sheet and restored both nodes. |
| CA-14 | All three font copyright notices and the OFL body are present. Source and dist license files are byte-identical, 4,721 bytes. |
| CA-15 | The three named heading selectors explicitly use weight 400. This closes their earlier synthetic-bold issue. |
| CA-16 | FR autosave colon uses U+00A0; UK map aria terminology is consistent. Checked against locale data. |
| CA-17 | Sidebar mini-map is displayed; map shortcut is gated on game state, modifiers and other open dialogs. Group_82 narrows its layout fallback. |
| CA-18 | The high-specificity riddle outline reset is removed; the global focus-visible rule can apply. |

**Subsequent closures: 13/13 group_82 UI changes inspected** — CU-01 through CU-12 and SM-01. Their specified changes are present:

- **Verified by execution in the focused model:** CU-01's delayed riddle focus respects an open inventory dialog; CU-02 focuses the paragraph marker on ordinary entry; CU-11 preserves scroll on locale repaint; SM-01 recognizes the fixed FAB and the desktop log returns focus to it.
- **Verified by code reading, with battery/static corroboration:** CU-04 focuses the remaining action after larva pickup; CU-05 clears combat status text; CU-06 styles the visible import label through focus-within; CU-07 ships the license in dist; CU-08 sets menu heading weight 400; CU-09 relabels existing map options; CU-10 accepts the letter M and limits physical-key fallback; CU-12 supplies live riddle feedback.
- **CU-03 is qualified:** opening the event panel at a stable phone width registers it with the controller. CU-14 and CU-15 cover focus ownership and subsequent breakpoint changes.

These are **35 resolution checks in total**. New IDs continue at CU-13 because CU-01–CU-12 already identify closed findings in this archive.

## 1.2 Independent U1–U9 pass

| Block | Volume, verified result and limits |
|---|---|
| U1 — dialogs | Traced open/close/top-dialog/keydown/observer paths; executed a three-overlay stack, both Tab-wrap directions, mandatory-dialog Escape gating, phone/desktop log cases and nested §1175 luck. The observer filters class attributes, then dialog targets; combat innerHTML replacement does not itself request childList observation in this controller. Cost was not profiled. Residuals: CU-14–CU-16. |
| U2 — keyboard/focus | Parsed **123 shell IDs and 45 static buttons**: no duplicate IDs or broken static label/ARIA references. Reviewed four outline resets, two non-native inline controls, and dynamic inventory/combat/dice/riddle controls. Add-item and mini-map controls have tabindex and Enter/Space handlers. Residuals: CU-17/CU-18. |
| U3 — live regions | Reviewed notification, dice, luck, combat mirror and riddle-feedback channels. Essential combat feedback has the dedicated mirror; event/combat histories remain deliberately non-live. Same-tick notification execution confirms writes, not what AT announces. |
| U4 — responsive/safe area | Reviewed fixed screens/overlays, notifications, log panel/FAB and visual dock; phone and both intermediate orientation bands. Insets, end-overlay base padding, dvh fallbacks, short-title overflow rule and clamp paddings are present. Layout rules cover ≤700px in both orientations and 701–960px in each orientation. CU-15 concerns state across those bands. |
| U5 — reading flow | Reviewed **six renderer families**, all **seven riddle sections**, and both long lists: §132 = **25** choices; §340 = **15**. Choices, widgets and illustration share the story scroller under «Ваш выбор». The reader explicitly sets the body face at 25px for its 72ch cap; that is not a measured 72-character line. Entry/repaint behavior passed the focused model. CU-13 is the widget-width residual. |
| U6 — phone HUD/sheets | Reviewed **six HUD actions, three sheet kinds and four moved nodes**. Reverse restoration, breakpoint sheet closure and global updateHUD wrapping are present; no cached call to the original updateHUD was identified outside its wrapper. Stat updates write value nodes without deleting their hidden labels. Flask stays in the bag sheet. The title snapshot remains intentional. CU-14/CU-15 concern the log. |
| U7 — fonts | Inspected **seven WOFF2 files**, the three CSS family chains and source/dist licenses. Forum's declared range and actual cmap cover ЄєЇїҐґІі and №. Removed faces have no current CSS references. Swap loading, uppercase/spacing and the 42px end title require visual acceptance. CU-19 identifies a binary/descriptor mismatch. |
| U8 — i18n | Parsed **110 static attributes across five channels** (75 text, 4 HTML, 3 placeholder, 14 title, 14 aria); every referenced key exists in all four locales. Key sets match at **334 × 4**. Map runtime refresh follows the static pass and relabels existing options. FR scan found no ordinary-space/apostrophe/guillemet candidates; all **95 non-leading** ?!;: occurrences have their specified preceding space. Three leading punctuation fragments require their join context. CU-18 concerns focus during language change. |
| U9 — July regressions | Revisited **four items: UI-01/02/05/08**. The old choice cap is intentionally superseded by the single reading flow; combat status/HP and visual-toggle CSS remain; contrast/tap tokens remain; spell counter, true disabled bounds and quantity focus restoration remain. No new finding against those four implementations. |

The four remaining <code>outline:none</code> resets are: <code>.btn</code> (specificity 0,1,0; shell line 82), <code>.cr-name input</code> (0,1,1; line 104), <code>.sb-notes textarea</code> (0,1,1; line 206), and <code>.add-item-input</code> (0,1,0; line 320). The later global rule at line 473 wins through higher specificity or equal specificity plus later source order. The import label also has its separate focus-within treatment.

**Commands executed for additional evidence** (generated scripts are outside the repository; paths below are relative to the workspace):

~~~sh
node audit_work/trackA_probes.js audit_source/Dungeons-of-the-Black-Castle-main
python3 audit_work/static_trackA.py audit_source/Dungeons-of-the-Black-Castle-main
~~~

The first script extracts production functions using the archive's vendored Acorn and supplies explicit DOM, geometry, focus and mutation/timer stubs. It completed **28 audit assertions, 0 failed**. Some assertions deliberately confirm defects; this is not a claim that 28 product acceptance checks passed. The second script parses shell/locales/GD, checks dist snippets and inspects WOFF2 metadata using existing fontTools and Node Brotli support. All eight selected source signatures for the residual CSS/controller paths also occur in the built HTML.

# 2. FINDINGS

All rows are hypotheses. “Execution” for a DOM case means the bounded production-function model described above; native browser consequences remain subject to maintainer verification. Locations refer to the audited archive. Proposed fixes are diagnostic suggestions; none was applied.

| id | block | severity | §§ / keys / selectors | evidence | suggested minimal fix |
|---|---|---|---|---|---|
| CU-13 | U5 | **P1** | §§67, 95, 435, 439, 992, 1113, 1131; .riddle-submit | **Verified by code reading.** Engine line 1415: <code>btn.className='choice-btn riddle-submit';</code>. Shell line 258: <code>.choice-btn{display:block;width:100%;</code>; line 422: <code>.riddle-input-row{display:flex;gap:10px;margin-bottom:12px;}</code>; line 430: <code>.riddle-submit{flex:0 0 auto;min-width:140px;text-align:center;margin-bottom:0;}</code>. The answer button takes the row's full width and cannot shrink, while the input and gap must also fit. There is no width override or mobile riddle rule. Overflow follows by CSS reading; clipping extent was not measured. CA-01 repaired the container, which exposes this independent sizing defect. | Override the submit width to auto; allow the input to shrink with min-width:0. Stack the row if a narrow-width layout still needs it. |
| CU-14 | U1/U6 | **P2** | Phone event-log open/close; game_logic.js:149, 161, 416, 417 | **Verified by execution and code reading.** Opening explicitly focuses the close button before MutationObserver captures the opener. The controller records an opener only under <code>!el.contains(prev)</code>, so none is recorded. Closing first focuses the HUD log button, then the controller's delayed fallback focuses a story choice. Model output: <code>immediate:"hud-log", settled:"choice-1"</code>; desktop control: <code>settled:"event-log-btn"</code>. CA-10 promises focus “returns to the FAB / HUD log button when it closes”; CU-03 adds controller ownership on phones. This is a residual phone interaction, not the closed fixed-FAB visibility defect. | Give phone log focus management one owner. Capture its opener before moving focus inside, or let the controller do initial focus; avoid a second fallback after a valid explicit return. |
| CU-15 | U1/U4/U6 | **P2** | Already-open event-log panel crossing 700px | **Verified by execution and code reading.** <code>_bcIsDialog</code> depends on current <code>isMobileHud()</code>; the media change listener at engine line 220 only closes a sheet and updates the FAB. Desktop→phone probe: recognized=true, top=null, aria-modal absent. Phone→desktop: recognized=false but top remains event-log-panel and aria-modal remains true. A resize does not toggle the panel's class, and the controller's fallback query omits it. CU-03 specifies: “on desktop it remains the non-modal side panel of CA-10.” | Reconcile an already-open panel when the media query changes: register/focus it on entering phone mode; remove modal stack/ARIA state on leaving, preserving an appropriate focus destination. |
| CU-16 | U1 | **P2** | §1175, luck nested inside combat | **Verified by execution and code reading.** Engine line 2048: <code>afterClose:()=>resumeCanonCombat()</code>. Resume calls <code>clearCombatExtraButtons()</code>, removing the recorded luck opener. The close fallback at line 161 then executes <code>if(_bcTopDialog()) return;</code> because combat remains open. The actual prompt→roll→Continue→resume chain produced openerConnected=false, top=modal-combat, focusInsideTop=false in the model. CA-03 explicitly says “unless another dialog is still open”; this is the uncovered nested-return case, not a request to focus the background. Native focus fixup was not measured. | If the saved opener is gone and a parent dialog remains, focus an appropriate enabled control in that dialog, such as the restored combat-round button. Keep background fallback for the no-dialog case. |
| CU-17 | U2 | **P2** | Closed #event-log-panel; shell:365, 368, 753, 754 | **Verified by code reading; native Tab impact suspected.** Closed CSS uses <code>right:-420px</code>, with <code>.event-log-panel.on{right:0;}</code>; phone CSS uses right:-100%. The clear and close buttons remain enabled native buttons. Neither markup nor toggleEventLog marks the closed subtree inert/hidden or removes its controls from tab order. Moving a fixed panel offscreen does not express an inactive keyboard state. The explicit geometry model also returns both controls from _bcFocusables; it is not a browser Tab test. | Make the closed panel inert, removing inert before open/focus. Preserve the slide transition without leaving closed controls keyboard-reachable. |
| CU-18 | U2/U8 | **P2** | Language select, especially #lang-pick-menu-select | **Verified by execution and code reading.** Engine line 666: <code>c.innerHTML='';</code>. Line 690 calls <code>setLanguage(code); renderAllLangPickers();</code>; setLanguage already reaches renderAllLangPickers through repaintAfterLangSwitch at line 631. The focused select is destroyed and recreated twice without focus restoration. With actual picker/language functions and the picker portion of repaint, the model reports oldConnected=false, newConnected=true, focus=body while the menu stays open. Its next Tab is recaptured, but the current position is lost. | Update the existing select/options in place, or restore focus to its replacement after one rebuild. Remove the duplicate rebuild in onchange. |
| CU-19 | U7 | **P2** | fonts.css:36; CinzelDecorative-lat.woff2; --font-title | **Verified by execution for metadata and code reading for CSS; visual consequence suspected.** The face declares <code>font-weight: 400 700;</code>. The bundled binary identifies subfamily Bold, OS/2 weight 700 and has no fvar table. It supplies a static bold face for a declared interval including 400. This is distinct from the closed Forum heading-weight fixes. The nominal regular Latin title face therefore has no corresponding regular outlines in this asset; visual severity was not measured. | Declare the static face as 700. If regular Latin ornamental titles are intended, provide an actual 400 face rather than advertising the bold file as that range. |

For CU-14, reproduce on a phone-width game screen with an ordinary choice present: open the log from the HUD, close it, then inspect focus after the queued observer and timer. For CU-15, keep that panel open while crossing the breakpoint in both directions. For CU-16, complete the first-orc milestone in §1175, take the optional luck check and activate «Продолжить». These sequences isolate the new interactions without reopening the previous adjudications.

# 3. COUNTS

| Severity | New hypotheses |
|---|---:|
| P0 | 0 |
| P1 | 1 |
| P2 | 6 |
| **Total** | **7** |

**Highest-confidence finding: CU-14.** The production-function execution captures both focus transfers in order, with a passing desktop comparison; the source explains why the phone controller has no saved opener. Its practical browser effect still needs the maintainer's live check.

P2 grades for the limited focus/log residuals follow the existing CA-10/CU-03/SM-01 adjudications. No permanent keyboard lock was demonstrated. The seven hypotheses are additional to the **35 inspected UI resolutions**; the repository battery remains green.

# 4. NOT-CHECKED

- **Browser and assistive technology:** no installed browser executable was available. Actual Tab order, screen-reader announcements, the persistent body-level notification region during modal interaction, same-tick announcement coalescing, focus fixup after hiding/removal and native select/file-picker behavior are **not determinable from provided files** alone.
- **Rendered geometry:** no screenshot or device run was performed. Exact 360px HUD height, riddle clipping, 1366×768 sidebar fit, non-zero notch/home-indicator geometry, zoom/reflow, focus obscuration by sticky headers, font-swap shifts and title/button metrics remain unmeasured. The CSS traces are not pixel acceptance.
- **Manual smoke:** the archive records a maintainer run of 24 live checks. That is historical evidence, not a run performed in this audit. No C14–C19 visual or device pass is claimed here.
- **Performance:** the observer subscription/filtering was read, but mutation cost and combat frame timing were not profiled. No animationend or transitionend dependency was found in game_logic.js; reduced-motion behavior was not visually exercised.
- **Track B/C:** the full mechanics/canon reverse search, engine interaction census and external-standards research are outside this Track A report. The Node battery ran, but that does not constitute a new Track B audit. No web source was used.
- **Identity and scope:** the exact Git commit is **not determinable from provided files**; the archive SHA-256 pins the reviewed material. UI-12, art quality, intentional sheet-title snapshots, deliberate Escape gating and adjudicated mechanics were not reopened.
