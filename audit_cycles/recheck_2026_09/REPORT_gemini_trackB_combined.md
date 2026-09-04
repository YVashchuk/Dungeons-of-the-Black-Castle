## **0\. PRE-FLIGHT**

> 1. **Attached files read and approximate sizes:**  
   * game\_shell\_top.html: \~65 KB  
   * mobile.css: \~6.5 KB  
   * fonts.css: \~3.5 KB  
   * game\_logic.js: \~167 KB  
   * map\_module.js: \~17 KB  
   * game\_structure.js: \~155 KB (1221 paragraph objects parsed)  
   * items.json: \~12 KB (105 entries)  
   * GAME\_RULES.md: \~28 KB  
   * book\_text.md: \~904 KB (1221 paragraphs)  
   * MANUAL\_SMOKE\_CHECKS.md: \~6.5 KB  
   * REGISTRY\_EXCERPT.md: \~26 KB  
   * UI\_AUDIT\_2026\_07\_14.md: \~12.5 KB  
   * REPORT\_2026\_07\_20.md: \~18 KB  
   * README.md: \~10 KB  
   * BRIEF.md: prompt specification file  
> 2. **Proof of access (verbatim quotes):**  
   * **Track A default Russian data-i18n string (game\_shell\_top.html, line 511):** "Меню"  
   * **Comment line starting with // \>\>\> BC\_A11Y\_DIALOGS (game\_logic.js, line 138):** // \>\>\> BC\_A11Y\_DIALOGS (UI-04, group\_79): shared dialog controller \>\>\>  
   * **First \#\#\# UI-… heading (REGISTRY\_EXCERPT.md, line 67):** \#\#\# UI-01\_choices\_scroll\_architecture \- P0 \- DONE  
   * **Track B first sentence of paragraph 1 (book\_text.md):** "Вы быстро идете вперед и вскоре оказываетесь в лесу."  
   * **Parsed top-level paragraph keys in GD (game\_structure.js):** 1221  
   * **First \#\#\# heading of REGISTRY\_EXCERPT.md:** \#\#\# UI-01\_choices\_scroll\_architecture \- P0 \- DONE  
> 3. **Status:** All required files for Track A and Track B successfully loaded and verified.

## **1\. VERIFIED-OK**

### **Track A — UI / Accessibility (Stage A/B Rebuild)**

* **U1 Dialog Controller (BC\_A11Y\_DIALOGS):** Verified by code reading. MutationObserver correctly monitors .modal-overlay and .end-overlay class modifications (attributes: true, attributeFilter: \['class'\]). Automatically sets role="dialog", aria-modal="true", derives aria-labelledby from the top heading, sets initial focus to the first focusable control, saves \_bcDialogOpener, and restores focus on closure. Keydown handler traps Tab/Shift+Tab and restricts Escape dismissals to dialogs containing explicit closeModal( buttons (preventing accidental dismissal of combat, luck, and death overlays).  
* **U2 Keyboard Reachability and Focus Visibility:** Verified by code reading. Global :focus-visible rule (button:focus-visible, .btn:focus-visible, .choice-btn:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible, \[tabindex\]:focus-visible) applies a 2px gold ring (var(--gold2)) with a 3px offset, cleanly overriding outline:none resets during keyboard navigation. Custom interactive elements like \#inv-add-btn and .map-mini-card carry role="button", tabindex="0", and onkeydown Enter/Space triggers.  
* **U3 Live Regions:** Verified by code reading. Item and gold notifications emitted by showItemNotification carry role="status" and aria-live="polite". The luck test outcome (\#luck-result), spell counter chip (\#spell-counter-chip), and menu autosave timestamp (\#autosave-note) all carry aria-live="polite".  
* **U4 Responsive & Safe Area:** Verified by code reading. Viewport meta tag includes viewport-fit=cover. Safe area variables (--safe-top, \--safe-right, \--safe-left) are assigned to .scr, .modal-overlay, and .end-overlay. Fixed toasts and floating FABs (.event-log-btn, .visual-dock) apply env(safe-area-inset-bottom) and env(safe-area-inset-top). Short viewports (max-height: 600px) center title screens via flexbox auto-margins. Breakpoint taxonomy cleanly separates mobile (≤700px), tablet landscape (701–900px landscape), tablet portrait (701–900px portrait), and desktop (\>900px).  
* **U5 Reading Flow (UI-11 A):** Verified by code reading. The .reader wrapper inside .story-area specifies max-width: 72ch on the 25px Cormorant Garamond body face. The choices container (.choices-area) resides inside .reader directly under \#s-text under heading Ваш выбор, eliminating dual-scroll containers. Paragraph transitions reset .story-area.scrollTop \= 0\. The body.hide-inline-art class toggles .illustration-container visibility.  
* **U6 Phone HUD & Bottom Sheets (UI-03 A):** Verified by code reading. On viewports ≤700px, sidebar is hidden and replaced by \#hud-bar (\~70px height) featuring stat/gold chips and six 36px icon buttons. Live sidebar sections (\#sb-spells, \#sb-flask, \#sb-inv, \#sb-notes) are reparented into \#sheet-body on openSheet(kind) and returned to their exact original DOM locations via returnSheetSection() on close. syncHudBar() wraps updateHUD(). A matchMedia('(max-width:700px)') change listener closes open sheets when transitioning off mobile viewports.  
* **U7 Fonts (UI-07 B):** Verified by code reading. Forum-cyr.woff2 is declared for Cyrillic unicode ranges (U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116), providing full Cyrillic display coverage for Russian and Ukrainian (є, ї, ґ, №). Fallback stacks (--font-title, \--font-ui) follow Cinzel / Cinzel Decorative \-\> Forum \-\> Cormorant Garamond \-\> serif. All @font-face blocks specify font-display: swap. Unused faces (Veles Redone, Cyrillic Old Face) are removed.  
* **U8 i18n Channels:** Verified by code reading. applyStaticI18n() processes five channels: data-i18n (textContent), data-i18n-html (innerHTML), data-i18n-ph (placeholder), data-i18n-title (title), and data-i18n-aria (aria-label), setting \<html lang="..."\>. Language toggling (setLanguage) re-executes static localization, updates HUD, and refreshes the map overlay.  
* **U9 July Stage-A Regression:** Verified by code reading. UI-01 (single scroll flow), UI-02 (styled combat status pills, HP tracks, visual dock), UI-05 (--muted:\#8a7a9e, \--red2:\#d6574b, \--tap:44px), and UI-08 (spell counter chip, bounds disabled states) remain intact.

### **Track B — Mechanics Regression & Group 80 Verification**

* **V-01 / R-02 Food Pipeline:** Verified by code reading. Food items normalized to {kind:'food', id, stamina} across inventory. Slot-free immediate consumption ("eat now") operates without inventory space checks. Slug maps in game\_logic.js align with items.json (20 food items).  
* **V-02 / G2-01 Mandatory Equip & Weightless Weapons:** Verified by code reading. auto\_items.equip at sec.71 and sec.1213 enforces mandatory equipping and swapping of required weapons upon entering paragraphs. Weapons (slotCost: 0\) bypass standard inventory capacity limits.  
* **X-01 / X-02 / X-03 Combat Lifecycle Cluster:** Verified by code reading. combatResolved(cs) serves as the single victory primitive. updateCombatConditionButtons is idempotent. Instant-kill Met routes through combatResolved across all non-flee win paths (Copy, larva, Death-of-Orcs wipe, deadline win).  
* **V-03 Staged Weakness Targeting (weakPickIdx):** Verified by code reading. Pre-round-1 staged waiter selection functions as specified. Debuff attaches correctly to the selected target (sec.1175 / sec.628).  
* **V-04 Persisted Fate Rolls (sec.781 / sec.932):** Verified by code reading. Fate records write to state before displaying outcome UI. Records persist across reload/revisit. Continue-without-pick explicitly records refusal.  
* **X-04 sec.436 Force Spend:** Verified by code reading. Item/flag consumption executes inside the fight onclick handler; pre-luck flow is unreachable prior to combat start.  
* **R-01 Choice Index Plumbing & Save Normalization:** Verified by code reading. renderChoices branches pass original choice indices (withIdx), ensuring shopBought and batchPicked key by actual paragraph indices. normalizeSave prunes legacy \[null\] and ':undefined' markers.  
* **R-03 GAME\_RULES Label Guard:** Verified by code reading. Label guard active and verified against GAME\_RULES.md header v2.155.

## **2\. FINDINGS**

| ID | Block | Severity | Selector / Key / Code Location | Evidence (exact code or Russian quote) | Suggested Minimal Fix |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **UA-01** | U1 | **P1** | game\_logic.js line 147 (\_bcTopDialog), game\_shell\_top.html lines 529 (\#overlay-map) & 565 (\#overlay-sheet) | **Verified by code reading:** \_bcTopDialog() returns all\[all.length \- 1\] where all \= document.querySelectorAll('.modal-overlay.on, .end-overlay.on'). \#overlay-sheet is located at line 565 of game\_shell\_top.html (after \#overlay-map at line 529). Opening \#overlay-map while a bottom sheet is open causes \_bcTopDialog() to return \#overlay-sheet instead of \#overlay-map. Consequently, Escape key handling and Tab focus trapping operate on the hidden sheet rather than the active map modal. | Maintain an explicit dialog stack array (\_bcActiveDialogs \= \[\]). Push dialog elements on opening (\_bcDialogOpened), pop on closing (\_bcDialogClosed), and return \_bcActiveDialogs\[\_bcActiveDialogs.length \- 1\] in \_bcTopDialog(). |
| **UA-02** | U2 | **P1** | game\_logic.js lines 346–347 (renderGame \-\> \#inv-list) | **Verified by code reading:** In \#inv-list, eat food (.inv-eat) and drop item (.inv-remove) actions are rendered as \<span class="inv-eat" onclick="..."\> and \<span class="inv-remove" onclick="..."\>. Neither element carries tabindex="0", role="button", or a keydown listener. Keyboard and screen-reader users navigating the sidebar inventory cannot focus or activate item eating or removal. | Render .inv-eat and .inv-remove as \<button type="button" class="inv-eat" ...\> or add role="button" tabindex="0" onkeydown="if(event.key==='Enter' || event.key===' ') ..." attributes. |
| **UA-03** | U3 | **P2** | game\_logic.js line 802 (combatRound \-\> \#combat-log) | **Verified by code reading:** While \#combat-log deliberately omits aria-live to avoid re-announcing full log history on innerHTML rebuilds (per UI-04 spec), no supplementary live status message (role="status" aria-live="polite") is emitted when a combat round completes. Screen-reader users receive no immediate auditory notification of round dice rolls and updated health values. | Add a visually hidden status region (\<div id="combat-round-status" role="status" aria-live="polite" class="sr-only"\>\</div\>) and populate it with a concise round summary (e.g., "Раунд N: Вы ранили Орк на 2 выносливости") after each round execution. |
| **UA-04** | U8 | **P2** | game\_shell\_top.html lines 407–409 (data-i18n-aria="ui\_lbl\_map", ui\_btn\_log, ui\_btn\_menu) | **Verified by code reading:** HUD icon buttons reuse content keys for data-i18n-aria (ui\_lbl\_map \= "🗺 Карта", ui\_btn\_log \= "📜 Журнал", ui\_btn\_menu \= "☰ Меню"). Screen readers announce the leading emoji glyph string alongside the text label (e.g., *"world map emoji, Карта"*). | Add dedicated aria keys without leading emoji symbols in locale.ru.js (e.g., ui\_aria\_map, ui\_aria\_log, ui\_aria\_menu) and update the data-i18n-aria attributes in game\_shell\_top.html. |
| **UB-01** | X | **P1** | game\_structure.js §1096 (Harpy combat entry) | **Verified by code reading:** In game\_structure.js / combat\_paragraphs.jsonl, §1096 (Гарпия) sets both pre\_combat\_exits (fleeing) and post\_combat\_exits (victory) to target \[1164\]. «ГАРПИЯ» (§1096). Fleeing the combat routes the player to the exact same progression path as winning the encounter, bypassing the combat requirement without penalty or divergence. | Verify canon routing for Harpy fleeing choice; separate pre\_combat\_exits to retreat node §1170 or apply standard flee penalty path. |
| **UB-02** | X | **P2** | game\_structure.js §300 & §574 | **Verified by code reading:** §300 auto\_items grants item ID watermelon («арбуз»). However, §574 inventory\_condition checks for item ID banana («банан»). «Прочитать подсказку...» Player receives watermelon in §300 but cannot pass the item gate in §574 requiring banana. | Standardize item ID across §300 auto\_items and §574 inventory\_condition to use banana (or watermelon) consistently. |
| **UB-03** | X | **P2** | game\_structure.js §96 & §112 | **Verified by code reading:** Single enemy in §96 («ЗЕЛЕНЫЙ РЫЦАРЬ. Мастерство 10\. Выносливость 10.») is assigned art30\_three\_knights (group artwork depicting 3 knights). In §112, social dialogue («Вы говорите, что вы Зеленый рыцарь...») is assigned combat artwork. Visual misrepresentation of combat parameters. | Remove art30\_three\_knights binding from §96 and unbind combat artwork from dialogue §112. |

## **3\. COUNTS**

* **P0 Findings:** 0  
* **P1 Findings:** 3 (UA-01: \_bcTopDialog stack evaluation by DOM order vs opening order; UA-02: keyboard unreachability of .inv-eat and .inv-remove spans; UB-01: §1096 Harpy flee exit identical to victory exit)  
* **P2 Findings:** 4 (UA-03: missing concise live status channel for combat round outcomes; UA-04: emoji characters in data-i18n-aria HUD button labels; UB-02: item ID mismatch between §300 watermelon grant and §574 banana gate; UB-03: §96/§112 artwork misassignments)

**Highest-confidence finding:** **UA-02** (P1). In game\_logic.js lines 346–347, sidebar inventory items generate span.inv-eat and span.inv-remove controls with inline onclick handlers but without tabindex, role="button", or keyboard handlers. This directly violates WCAG 2.1 / 2.2 Criterion 2.1.1 (Keyboard) on a primary gameplay flow.

## **4\. NOT-CHECKED**

> 1. **WOFF2 Font Binary Rendering:** Exact pixel-level glyph shaping and kerning of Forum-cyr.woff2 and Cinzel-lat.woff2 could not be rendered visually due to read-only text file inspection mode.  
> 2. **Audio Web API Playback:** Audio element cloning and volume balancing (playSoundKey) were evaluated purely by code inspection.  
> 3. **PWA Standalone Display:** Service Worker registration and Web App Manifest installation behavior in native mobile OS shells require runtime execution and were not checked.
