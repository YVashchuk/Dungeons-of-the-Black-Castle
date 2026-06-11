# PROJECT CONTEXT (for the researcher)

**The project.** A faithful, source-critical PWA remake of «Подземелья Чёрного замка» (Дмитрий Браславский, 1991 — the first Russian gamebook). The working canon is a modern remastered re-edition (FB2, 1221 paragraphs). The engine is data-driven: every paragraph, choice, item gate, riddle and dice table lives in a JSON database extracted from that FB2.

**The verification pipeline (why the output format matters).** Every external claim goes through canon-first verification: claim → checked against the FB2 → only then applied to the data, with a registry entry. LLM research outputs are non-deterministic and have produced both true and confabulated findings before; we therefore verify **per claim**. A finding without a URL + verbatim quote cannot enter the pipeline.

**The renumbering hazard.** The remaster renumbered paragraphs (1221 total). Cross-edition number matching has already produced false leads; scene-text matching is mandatory.

**Current state of the three cases (decisions already made — your findings may confirm or overturn them):**
- **CASE 1 (the dice face-6 anomaly):** kept FB2-faithful for now (documented anomaly, option «A»); a lead repair exists if the original proves the remaster misprinted.
- **CASE 2 (amulets):** the remake now distinguishes the bear-fur «Амулет» from the «Золотой амулет»; the debt payment was re-gated strictly to the golden one per the remaster's wording «золотым амулетом». The original's wording would confirm or refute this.
- **CASE 3 (fugitives' friend):** the ONLY two hidden-arithmetic mechanics still unimplemented in the remake («вычтете 35»; «прибавьте 30 к сумме букв имени»), because the remaster text never identifies the friend, the meeting site, or the name.

**Book conventions (needed for CASE 3).** Hidden arithmetic: paragraphs instruct «прибавьте/вычтите N к номеру параграфа». Letter-sum riddles: порядковые номера букв русского алфавита, **А=1 … Я=33, including Ё (7) and Й (11)** — this mapping is verified against the remaster's own riddle answers.

**Stats glossary:** МАСТЕРСТВО (skill), ВЫНОСЛИВОСТЬ (stamina), УДАЧА (luck); «золотые» — gold coins.
