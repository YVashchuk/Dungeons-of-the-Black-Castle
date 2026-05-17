# Letter-Riddle Engine Design Brief

**Status:** Design task. New engine mechanic needed.

**Audience:** Generic extended thinking LLM (ChatGPT 5.5 Plus thinking mode OR Gemini 3.1 Pro extended thinking — either works, Deep Research mode NOT needed).

**Goal:** Propose 2-3 design options with trade-offs for implementing the canonical letter-sum riddle mechanic from FB2 §1131 and §992 in the Dungeons of the Black Castle remake.

---

## Project context

Single-file HTML PWA gamebook (Russian, 1991 «Подземелья Чёрного замка», D. Braslavsky, 1221 paragraphs).

Repository: <https://github.com/YVashchuk/Dungeons-of-the-Black-Castle>

Engine: vanilla JavaScript in single file `src/game_logic.js`. State stored in global `S` object, persisted via localStorage. UI rendered into `#game-content` and surrounding panels.

Current engine has working mechanisms for:
- Inventory-conditional choices (`inventory_condition` field)
- Item consumption on choice click (`consume_on_use` field)
- Gold cost / gold gating
- Luck rolls (`has_luck` flag, `luck_type:"lucky"|"unlucky"`)
- Combat (paragraph-level `enemies` array)
- Spell casting (`spell:"<ID>"` field decrements spell budget)
- Multi-item pickups via `auto_items.items[]`

None of these fit the riddle mechanic, hence this brief.

---

## Canonical riddle mechanic (FB2)

### Riddle 1 — §1131

> «Стоит село — заселено, но петухи там не поют, и люди не встают.
> Если ты знаешь ответ, то к **сумме порядковых номеров букв алфавита** в правильном ответе прибавьте 916. На том параграфе мы и встретимся. Если же ответа не знаешь, то…»

Answer: **«кладбище»** (cemetery)
- К=12, Л=13, А=1, Д=5, Б=2, И=10, Щ=27, Е=6
- Sum = 76
- 76 + 916 = **§992** (canonical success)
- Wrong answer → §1190 (canonical death narrative)

### Riddle 2 — chained from §992

§992 narrative starts with «Да, молодец, странник! Конечно, это кладбище» and then poses a SECOND riddle:

> «Стоит столб, этого столба никому не перейти, не переехать, хлебом не отманить, деньгами не закупить. К ответу прибавьте 825…»

Answer: TBD (Claude's audit suggested «год» but verification was incomplete — final answer needs FB2 re-verification).
- Wrong answer → presumably another death path

### Russian alphabet ordering

```
А=1   Б=2   В=3   Г=4   Д=5   Е=6   Ё=7   Ж=8   З=9   И=10
Й=11  К=12  Л=13  М=14  Н=15  О=16  П=17  Р=18  С=19  Т=20
У=21  Ф=22  Х=23  Ц=24  Ч=25  Ш=26  Щ=27  Ъ=28  Ы=29  Ь=30
Э=31  Ю=32  Я=33
```

Note: «ё» is letter 7 (separate from «е»). Russian gamebooks typically treat «ё» as «е» — but answer key must match author's intent. Word «кладбище» doesn't contain ё so this doesn't matter for riddle 1, but riddle 2 answer (if it contains ё) may need clarification.

---

## Key engineering constraints

1. **No external dependencies** — single HTML file PWA, embed all assets, no library calls. Vanilla JS only.

2. **Russian-language input** — user types Russian text (Cyrillic). Need to handle:
   - Case insensitivity (КЛАДБИЩЕ = кладбище = Кладбище)
   - Whitespace trimming
   - Possibly common typos (player types «кладбищэ» with э instead of е at end)
   - «ё» / «е» equivalence (canonical Russian gamebook convention)
   - Possibly word stem matching («кладбища» / «кладбищем» / «кладбищу» — different cases)

3. **Failure UX** — if player gets it wrong, they shouldn't be able to brute-force by submitting all possible answers. Either:
   - Single attempt → wrong path
   - Limited attempts (2-3) → wrong path
   - Each wrong answer = death

4. **Mobile-friendly** — game targets mobile PWA. Cyrillic keyboard input is fine but should use existing input UI patterns, not custom virtual keyboard.

5. **Save game compatibility** — riddle state must work with the localStorage saves. Don't store the answer in state (cheaters can inspect localStorage); compute answer-hash if needed for verification.

6. **Future-proof** — design should support adding more riddles without engine changes. Data-driven via paragraph-level fields.

---

## Three proposal directions to consider

When generating design options, please evaluate ALL THREE:

### Option 1: Text-input UI

Player sees an input box, types their answer, presses submit. Engine computes letter-sum, adds the modifier (916 / 825), checks if it matches a known target paragraph in the data.

**Pros:** Maximum authenticity to gamebook — no spoilers. **Cons:** Many implementation details (input validation, case/ё handling, no-cheating mechanism, mobile keyboard handling).

### Option 2: Multiple-choice answer selection

Show 4-6 possible answers as buttons. Player picks one. Each maps to a pre-computed paragraph target.

**Pros:** Simple, mobile-friendly, no input parsing. **Cons:** Spoils the riddle by listing the answer; weakens the puzzle.

### Option 3: Hybrid — first-guess text-input, fallback multiple-choice

Player gets ONE free attempt via text input. Wrong → multiple-choice UI appears as a "hint" mode for second attempt. Three failures = death.

**Pros:** Preserves puzzle depth while giving accessibility. **Cons:** More UI surface, more code.

Plus any **Option 4** you think of.

---

## What to deliver

A single markdown document with:

### 1. Recommended option (with brief justification)

Pick one of the three (or invent a fourth) as your top recommendation. 1-2 paragraphs explaining why.

### 2. For recommended option: implementation sketch

- **Data schema**: what new fields appear on §1131-style paragraphs? Suggest field names like `riddle_modifier:916`, `riddle_correct_target:992`, `riddle_fail_target:1190`, `riddle_alphabet:"ru_with_yo_equivalence"`. Concrete proposal.
- **Engine handler**: pseudocode for the new function (e.g., `applyRiddleAnswer(input, riddleConfig)`). Show inputs, outputs, edge cases.
- **UI changes**: which DOM elements? Where does input go? What happens on submit? Show approximate HTML/CSS for the input widget.
- **Anti-cheat**: how does the implementation prevent localStorage inspection from revealing the answer?
- **Failure mode**: what does the wrong-answer UX look like? Animated shake + death narrative? Counter of remaining attempts?

### 3. Comparison table for all three options

Roughly 10 rows × 3 columns evaluating each option on:
- Implementation complexity (engine LoC estimate)
- UI complexity (mobile-friendliness)
- Puzzle authenticity (does it preserve the riddle feel?)
- Cheat resistance
- Future extensibility (adding more riddles)
- Code review surface
- Save-game compatibility
- Accessibility (can players who don't speak Russian fluently still play?)
- Localization (English version someday?)
- Other concerns you identify

### 4. Open questions / requested clarifications

- Riddle 2 answer needs FB2 re-verification — flag this.
- Should the engine support N-ary chains (riddle 1 → riddle 2 → riddle 3 → ...)?
- Multiple riddles per paragraph — possible per canonical text?
- Should incorrect answers always death, or sometimes just return to source paragraph for retry?

### 5. Risks and pitfalls

What could go wrong with each option? Specific Russian-language gotchas (ё/е, capitalization, plural forms). UI edge cases on mobile.

---

## After delivery

Paste the markdown into a new Claude chat. Claude will read it, possibly do an FB2 verification pass on riddle 2 answer, and either:
- Implement the recommended option as a new audit-and-implement cycle, OR
- Push back with concerns and request a revision.

This is design-only — no code, no commits expected from you.

---

## Why generic extended thinking instead of Deep Research mode

This is a **design task**, not an audit task. There's nothing to read systematically — just one mechanic to architect. Generic extended thinking will produce focused design proposals with trade-offs. Deep Research mode is overkill (no large corpus to traverse).

ChatGPT 5.5 thinking and Gemini 3.1 Pro extended thinking both work. Pick whichever you prefer; results will be comparable in quality. If you want second-opinion validation, run both and compare.
