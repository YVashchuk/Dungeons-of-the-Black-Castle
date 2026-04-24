# Graph & UX Audit — Dungeons of the Black Castle

Source: Gemini 3.1 Pro analysis (task G-2), verified against `src/remake_data.js` (1221 paragraphs).

**Verification summary:**

| Gemini's claim | Reality | Verdict |
|---|---|---|
| 4 orphans | All 4 confirmed — plus they share a pattern (bird-guide hints) | ✅ Confirmed |
| 13 dead-ends | All 13 have empty `choices` | ✅ Confirmed |
| broken target §1830 | Not in `choices` — only in text of §849 | ⚠ Re-classified: text typo, not graph break |
| duplicates in §849 | 2×"На второй", 2×"На третий" | ✅ Real UX bug |
| ellipsis-cut in 7 paragraphs | 4 of 7 in stale source (§10, 15, 42, 44); already fixed in dist | ⚠ Partially confirmed, already resolved |
| §974 label = 95 chars | Actual length 51 chars | ❌ Overstated |
| §13 fish +15 dynamic | Confirmed | ✅ |
| §95 password +50 | No — password is static §146 | ❌ Misread |
| §140 Gold key +30 | Confirmed | ✅ |
| §166 stone rats need green sword | Confirmed | ✅ |
| §532 Dragon `wound_2` | Text confirms, JSON has no flag | ✅ Gap in data |

---

## I. Graph issues

### 1. Orphans (4 paragraphs, all bird-guide hints)

These paragraphs have zero incoming references but contain meaningful hints:

| § | Text |
|---|---|
| 106 | «Птичка желает лететь направо.» |
| 151 | «Злой дух велит птичке указать вам путь направо.» |
| 178 | «Птичка рвется из клетки наружу в ту сторону, куда отходит левая дорожка.» |
| 277 | «Похоже, птичка указывает путь направо.» |

**Root cause:** in the printed gamebook these were reached via bird-in-cage item mechanics — the rules say something like "when the bird points, go to §X". The remake's FB2 parser didn't capture the trigger logic.

**Fix options:**
- Leave as-is (player will never see them — harmless)
- Integrate into bird-item inventory logic: when player has bird and reaches certain paragraphs, offer a "ask the bird" choice that navigates to 106/151/178/277 as informational stops, then returns to parent
- Delete them entirely from `remake_data.js` (cleanest)

**Recommendation:** leave as-is for now, document the intent. Full bird mechanic is low-priority.

### 2. Dead-ends — 13 paragraphs with no choices

Split into two categories:

**Death/Game-Over scenes (9)** — expected dead-ends, but the UI currently shows no choices at all (player looks stuck):

| § | Cause of death |
|---|---|
| 32 | Drowning in lake (Levitation spell exhausted) |
| 114 | Eagle-guard from castle kills player |
| 117 | Trapped in open field, forest repels |
| 124 | Broke leg, picked up by Barlad Dert's cavalry |
| 125 | Path ends, player gets lost |
| 134 | Killed goblins with fire, stuck in cage forever |
| 204 | Mind-wipe spell from enemy |
| 236 | Ambushed by 20 goblins |
| 275 | Burnt by fireball while fleeing |

**Fix:** `game_logic.js` should detect `choices.length === 0 && enemies.length === 0` and automatically render a **"Начать заново"** button that resets save state and jumps to §1. Currently the engine does this partially — verify.

**Orphan hints (4)** — §106, 151, 178, 277 (already covered above).

### 3. "Broken target" §1830 — not a graph break

**Gemini report:** paragraph 849 has target 1830 in text, but only 830 exists.

**Verification:** In `choices` the target is correctly `830`. The typo was only in the `text` field:
> «На второй — **1830**, на третий — 1068.»

Player saw wrong number on screen (1830) but the button navigated correctly.

**Fix:** ✅ applied. Text typo corrected in `src/remake_data.js` and `dist/*.html`.

### 4. Duplicate labels in §849 (elevator UX)

**Confirmed.** The elevator paragraph §849 presented an ambiguous list of choices where "На второй" and "На третий" each appeared twice.

**Root cause:** source text formats the elevator buttons as two parallel columns "Вверх: / Вниз:" but the parser flattens them. The two "На второй" lead to different paragraphs because one is *going up to 2nd floor from somewhere* and the other is *going down to 2nd floor from somewhere*.

**Fix:** ✅ applied. Labels now disambiguated with `↑` / `↓` arrows:
- `На второй ↑ (1040)` / `На второй ↓ (830)`
- `На третий ↑ (1068)` / `На третий ↓ (869)`

---

## II. Label UX issues

### 5. Ellipsis-cut labels — already resolved in `dist/*.html`

**Verification outcome:** when this audit was started, `src/remake_data.js` held an older revision with 6 ellipsis-cut labels:

| § | Target | Old label (with …) |
|---|---|---|
| 10  | 48  | «Довериться старику и скажете, что вы идете в… (48)» |
| 10  | 428 | «Попытаться осторожно выведать у него что-нибудь… (428)» |
| 15  | 453 | «Идти достаточно долго, пока не наступает ночь.… (453)» |
| 15  | 407 | «Решите, что лес слишком опасен для этого и… (407)» |
| 42  | 884 | «Попадаете в маленькую проходную комнатку и… (884)» |
| 44  | 468 | «Остаться на дороге, чтобы узнать, кто едет вам… (468)» |

Inspection of `dist/podzemelye-chyornogo-zamka-remake.html` revealed that **the distributed build contained a newer, already-proofread GD** — 289 of 1221 paragraphs had their labels improved (presumably in a previous ChatGPT polish pass). Example: `§10 → §48` was already `"Сказать старику, что вы идёте в Чёрный замок сражаться с волшебником (48)"`, which is far better than Gemini's (or any regenerated) version.

**Fix:** ✅ applied. `src/remake_data.js` has been re-synced from the canonical GD baked into `dist/*.html`, which recovered all 289 improved labels as well as an extra choice on §18 (which was missing in the stale src).

### 6. §974 label "too long" — not critical

Gemini reported 95 characters; actual length is **51 characters**: `«Теперь можете оставить карту здесь и уходите… (809)»`. Fits on Pixel 7a viewport (412 CSS px). The ellipsis at the end is cosmetic; in dist it has already been rewritten.

### 7. Labels contain target ID in parentheses — by design

Almost every choice has `(NNN)` appended. Gemini flagged as visual noise, but this is **intentional**: book-game convention lets the player cross-reference map markers and external notes. Retained.

---

## III. Combat and state-management gaps

### 8. Special combat conditions missing from JSON

| § | Spec in text | Current `enemies` | Missing flag |
|---|---|---|---|
| 532 | «Если удалось дважды ранить Дракона, то 437» — victory at 2 wounds, not 0 stamina | `[{ДРАКОН, skill:12, stamina:8}]` | `combat_condition: "wound_2"` |

**Fix (pending):** add `combat_condition` field to enemies schema, update `game_logic.js` to recognize `wound_2` and route to §437 when player has hit the dragon twice (regardless of dragon's remaining stamina).

Other special-combat cases likely exist; a full sweep of every `enemies` paragraph against its text would find them. Out-of-scope for this audit.

### 9. §166 — stone rats require specific weapon

Text: *"Только мечом Зеленого рыцаря можно победить каменных крыс"*.

The paragraph itself is already an instruction (moves to §1101 automatically), so no combat flag needed *here*. But at §135, §633, §1003, §1110 — where the combat *actually* happens — the engine should:
- check inventory for "меч Зеленого рыцаря"
- if absent, block the `Атаковать` button OR route combat to certain-death branch (§633 already does this in text)

**Fix:** scoped to whichever paragraphs initiate stone-rat combat. Low-priority — current behaviour (player dies if they attack without the sword) matches the book.

### 10. Dynamic-arithmetic paragraphs (the real headache)

Three mechanics where the book tells the player to do mental math:

| Trigger | Rule | Parser state |
|---|---|---|
| **§13** Fish in water | "Call the fish: current-paragraph + 15 = rescue paragraph" | Choice goes to §639 normally. No `+15` logic anywhere |
| **§95** Castle password | "Password is §146. Use when asked." | Static paragraph 146. Parser handles this fine |
| **§140** Gold key | "Add 30 to the paragraph of the door opened by Gold Key." | No `+30` logic |

**Fix options:**
- Add three new inventory items (`fish_gift`, `castle_password`, `gold_key`) and wire them into specific paragraphs that depend on these mechanics. This requires identifying every "water peril" paragraph (for fish +15) and every "gold door" paragraph (for key +30).
- Simpler: intercept all navigation with `hasItem('fish') && ...` checks at runtime.

Low priority — deferred to future work. Player loses access to some optional escape routes, but none are critical path.

---

## IV. Fixes applied

1. **§849 text typo:** "1830" → "830" ✅ (in src and dist)
2. **§849 duplicate labels:** ↑/↓ arrows added to disambiguate ✅ (in src and dist)
3. **`src/remake_data.js` re-synced** from `dist/*.html` ✅ — recovered 289 proofread labels and an extra choice on §18 that had been lost in a regression

See commit: `Fix §849 elevator labels, sync src with proofread dist GD, add graph audit`.

---

## V. Recommended engine-level work (`src/game_logic.js`)

Beyond data fixes, the engine should gain:

1. **Death-screen handler:** if a paragraph has no choices and no enemies, render Game Over + «Начать заново» button.
2. **Visited-paragraph tracker:** to prevent infinite loops in maze sections. Already partial (`S.visited`) — verify completeness.
3. **Global spell counter:** the book caps total spell uses at 10 (Milin's rules). Currently enforced via charge pool — verify.
4. **Luck auto-decrement:** every successful Luck check decrements Luck by 1 per book rules. Check `has_luck` code path.
5. **Paragraph-math dynamic nav:** optional, for §13 fish / §140 gold key mechanics (see section III-10).
6. **Custom combat conditions:** `wound_2` for §532 Dragon, possibly others.

---

## Appendix: paragraphs verified safe

- No graph cycles detected (beyond legitimate revisit-same-scene mechanics).
- All `choice.target` values point to valid existing paragraphs (except the §1830 text typo, which was *not* in choices and has been fixed).
- No paragraph has `choices.length > 10` (UI can always render).
- All 1221 paragraphs reachable from §1 via BFS **except** the 4 bird orphans.
