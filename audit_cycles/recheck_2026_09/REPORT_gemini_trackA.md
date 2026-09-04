## **0\. PRE-FLIGHT**

> 1. **Attached files read and approximate sizes:**  
   * game\_shell\_top.html: \~65 KB  
   * mobile.css: \~6.5 KB  
   * fonts.css: \~3.5 KB  
   * game\_logic.js: \~67 KB  
   * map\_module.js: \~17 KB  
   * MANUAL\_SMOKE\_CHECKS.md: \~6.5 KB  
   * REGISTRY\_EXCERPT.md: \~26 KB  
   * UI\_AUDIT\_2026\_07\_14.md: \~12.5 KB  
   * README.md: \~10 KB  
   * BRIEF.md: prompt specification file  
   * LAUNCH\_CARDS.md: \~4 KB  
> 2. **Proof of access (verbatim quotes):**  
   * **Track A default Russian data-i18n string (game\_shell\_top.html line 511):** "Меню"

   * **Comment line starting with // \>\>\> BC\_A11Y\_DIALOGS (game\_logic.js line 138):** // \>\>\> BC\_A11Y\_DIALOGS (UI-04, group\_79): shared dialog controller \>\>\>

   * **First \#\#\# UI-… heading (REGISTRY\_EXCERPT.md line 67):** \#\#\# UI-01\_choices\_scroll\_architecture \- P0 \- DONE

> 3. **Status:** All required Track A files successfully loaded and verified.

## **1\. VERIFIED-OK**

* **U1 Dialog controller (BC\_A11Y\_DIALOGS):** Verified by code reading. The MutationObserver watches .modal-overlay and .end-overlay class changes (attributes: true, attributeFilter: \['class'\]). On opening, it assigns role="dialog", aria-modal="true", derives aria-labelledby from the first heading element, shifts initial focus to the first focusable control inside the dialog via \_bcFocusables, and captures document.activeElement into \_bcDialogOpener. On close, focus returns to the opener element. The global keydown trap traps Tab / Shift+Tab within the active dialog and gates Escape dismissals via \_bcCloseTopDialog() requiring an explicit \[onclick\*="closeModal("\] control (preventing accidental Escape closing of combat, luck, and death modals).  
* **U2 Keyboard reachability and focus visibility:** Verified by code reading. The global :focus-visible rule (button:focus-visible, .btn:focus-visible, .choice-btn:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible, \[tabindex\]:focus-visible) applies a 2px gold ring (--gold2) with 3px offset, overriding outline:none resets when navigating via keyboard. Interactive controls such as \#inv-add-btn and .map-mini-card carry role="button", tabindex="0", and onkeydown Enter/Space triggers. HUD controls, sheet close buttons, map controls, riddle submit buttons, dice widgets, and visual dock pills are native \<button\> or \<select\> elements.  
* **U3 Live regions:** Verified by code reading. Item and gold notifications created by showItemNotification carry role="status" and aria-live="polite". The luck check outcome (\#luck-result), spell selection counter chip (\#spell-counter-chip), and menu autosave timestamp (\#autosave-note) all carry aria-live="polite".  
* **U4 Responsive & safe area:** Verified by code reading. The viewport meta tag contains viewport-fit=cover. Insets (--safe-top, \--safe-right, \--safe-left) are applied to .scr, .modal-overlay, and .end-overlay. Toast notifications and floating controls (.event-log-btn, .visual-dock) apply env(safe-area-inset-bottom) and env(safe-area-inset-top) offsets. Viewport height caps utilize 100dvh / 82dvh / 52dvh with vh fallbacks. Short viewports (max-height: 600px) center title content with auto-margins and scrollable flex column layout. The breakpoint taxonomy cleanly separates phone viewports (≤700px), landscape tablet viewports (701–900px landscape), portrait tablet viewports (701–900px portrait), and desktop (\>900px).  
* **U5 Reading flow (UI-11 A):** Verified by code reading. The .reader wrapper inside .story-area sets max-width: 72ch on the 25px Cormorant Garamond body face. The choices container (.choices-area) sits inside .reader directly beneath \#s-text under the ui\_your\_choice heading ("Ваш выбор"), removing separate scroll caps and unifying text, art, and choices into a single vertical scroll container. Paragraph transitions reset .story-area.scrollTop \= 0\. The body.hide-inline-art class correctly hides .illustration-container.  
* **U6 Phone HUD & bottom sheets (UI-03 A):** Verified by code reading. On viewports ≤700px, the sidebar is hidden and replaced by \#hud-bar (\~70px height) featuring stat/gold chips and six 36px icon buttons. Sidebar sections (\#sb-spells, \#sb-flask, \#sb-inv, \#sb-notes) are reparented into \#sheet-body on openSheet(kind) and returned to their exact original DOM position via returnSheetSection() on close. syncHudBar() wraps updateHUD(). A matchMedia('(max-width:700px)') listener closes open sheets and restores floating FAB visibility when exiting phone viewports.  
* **U7 Fonts (UI-07 B):** Verified by code reading. Forum-cyr.woff2 is bundled and declared for Cyrillic unicode ranges (U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116), providing full Cyrillic display coverage for Russian and Ukrainian (including є, ї, ґ, №). Font stacks (--font-title, \--font-ui) order glyph fallback: Cinzel / Cinzel Decorative \-\> Forum \-\> Cormorant Garamond \-\> serif. All @font-face rules specify font-display: swap. Unused font faces (Veles Redone, Cyrillic Old Face) are absent from fonts.css.  
* **U8 i18n channels:** Verified by code reading. applyStaticI18n() handles five channels: data-i18n (textContent), data-i18n-html (innerHTML), data-i18n-ph (placeholder), data-i18n-title (title), and data-i18n-aria (aria-label), setting \<html lang="..."\>. Language switching (setLanguage) re-executes static localization, updates HUD, and refreshes the map overlay.  
* **U9 Regression of July stage-A items:** Verified by code reading. UI-01 (single scroll flow), UI-02 (styled combat status pills, HP tracks, visual dock), UI-05 (--muted:\#8a7a9e, \--red2:\#d6574b, \--tap:44px), and UI-08 (spell selection counter chip, bounds disabled states) remain intact and functioning as specified.

**Checked Volume:** 9 of 9 blocks evaluated; 25 structural sub-features verified OK against REGISTRY\_EXCERPT.md.

## **2\. FINDINGS**

| ID | Block | Severity | Selector / Key / Code Location | Evidence (exact code or Russian quote) | Suggested Minimal Fix |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **UA-01** | U1 | **P1** | game\_logic.js line 147 (\_bcTopDialog), game\_shell\_top.html lines 529 (\#overlay-map), 565 (\#overlay-sheet) | **Code reading finding:** \_bcTopDialog() evaluates all\[all.length \- 1\] where all \= document.querySelectorAll('.modal-overlay.on, .end-overlay.on'). Because \#overlay-sheet is located at line 565 of game\_shell\_top.html (after \#overlay-map at line 529), opening \#overlay-map while a bottom sheet is open results in \_bcTopDialog() returning \#overlay-sheet instead of \#overlay-map. Consequently, Escape key handling and Tab focus trapping operate on the underlying sheet rather than the newly opened map dialog. | Maintain an explicit dialog stack array (\_bcActiveDialogs \= \[\]). Push dialog elements on opening (\_bcDialogOpened), pop on closing (\_bcDialogClosed), and return \_bcActiveDialogs\[\_bcActiveDialogs.length \- 1\] in \_bcTopDialog(). |
| **UA-02** | U2 | **P1** | game\_logic.js lines 346–347 (renderGame \-\> \#inv-list) | **Code reading finding:** In \#inv-list, eat food (.inv-eat) and drop item (.inv-remove) actions are rendered as \<span class="inv-eat" onclick="..."\> and \<span class="inv-remove" onclick="..."\>. Neither element carries tabindex="0", role="button", or a keydown listener. Keyboard and screen-reader users navigating the sidebar inventory cannot focus or activate item eating or removal. | Render .inv-eat and .inv-remove as \<button type="button" class="inv-eat" ...\> or add \`role="button" tabindex="0" onkeydown="if(event.key==='Enter' |
| **UA-03** | U3 | **P2** | game\_logic.js line 802 (combatRound \-\> \#combat-log) | **Code reading finding:** While \#combat-log deliberately omits aria-live to avoid re-announcing full log history on innerHTML rebuilds (per UI-04 spec), no supplementary live status message (role="status" aria-live="polite") is emitted when a combat round completes. Screen-reader users receive no immediate auditory notification of round dice rolls and updated health values. | Add a visually hidden status region (\<div id="combat-round-status" role="status" aria-live="polite" class="sr-only"\>\</div\>) and populate it with a concise round summary (e.g., "Раунд N: Вы ранили Орк на 2 выносливости") after each round execution. |
| **UA-04** | U8 | **P2** | game\_shell\_top.html lines 407–409 (data-i18n-aria="ui\_lbl\_map", ui\_btn\_log, ui\_btn\_menu) | **Code reading finding:** HUD icon buttons reuse content keys for data-i18n-aria (ui\_lbl\_map \= "🗺 Карта", ui\_btn\_log \= "📜 Журнал", ui\_btn\_menu \= "☰ Меню"). Screen readers announce the leading emoji glyph string alongside the text label (e.g., *"world map emoji, Карта"*). | Add dedicated aria keys without leading emoji symbols in locale.ru.js (e.g., ui\_aria\_map, ui\_aria\_log, ui\_aria\_menu) and update the data-i18n-aria attributes in game\_shell\_top.html. |

## **3\. COUNTS**

* **P0 Findings:** 0  
* **P1 Findings:** 2 (UA-01: \_bcTopDialog stack determination by DOM order vs opening order; UA-02: keyboard unreachability of .inv-eat and .inv-remove spans)  
* **P2 Findings:** 2 (UA-03: missing concise live status channel for combat round outcomes; UA-04: emoji characters in data-i18n-aria HUD button labels)

**Highest-confidence finding:** **UA-02** (P1). In game\_logic.js lines 346–347, sidebar inventory items generate span.inv-eat and span.inv-remove controls with inline onclick handlers but without tabindex, role="button", or keyboard handlers. This directly violates WCAG 2.1 / 2.2 Criterion 2.1.1 (Keyboard) on a primary gameplay flow.

## **4\. NOT-CHECKED**

> 1. **WOFF2 Font Binary Rendering:** Exact pixel-level glyph shaping and kerning of Forum-cyr.woff2 and Cinzel-lat.woff2 could not be rendered visually due to read-only text file inspection mode.  
> 2. **Audio Web API Playback:** Audio element cloning and volume balancing (playSoundKey) were evaluated purely by code inspection.  
> 3. **PWA Standalone Display:** Service Worker registration and Web App Manifest installation behavior in native mobile OS shells require runtime execution and were not checked.
