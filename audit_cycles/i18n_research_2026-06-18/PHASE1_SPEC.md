# Phase 1 Migration Spec — RU-only, behavior-identical
**Date:** 2026-06-18 · **Status:** DRAFT FOR REVIEW — no code/data changes yet · See SYNTHESIS.md for the architecture.

## Goal of Phase 1
Introduce the **neutral-structure + inline-locale** layering and the **ID key space** **without translating anything and without changing gameplay**. At the end of Phase 1 the game is still 100 % Russian and must be **byte/behaviorally identical** (verified by golden smoke tests + the existing Node-harness pattern). This de-risks everything before any translation work.

Phase 1 = Phases 1-3 of the detailed study, folded into one RU-only milestone:
1. stand up `window.LOCALES['ru']` (paragraph text, choice labels, item/enemy/spell display names, UI catalog, preface) extracted mechanically from current `GD` + shell + engine;
2. add neutral key fields to `GD` (item slugs in conditions/grants; enemy keys; `spell` on every spell choice; `flee:true`; per-paragraph `scene`; structured food);
3. add the resolvers and replace the four Cyrillic couplings; delete `SPELL_KEYWORDS`/flee-regex/food-regex/scene-classifier once their neutral replacements are in;
4. `v6` save migration;
5. move RU text fully out of `GD` into `locale.ru.js`; rename `remake_data.js`->`game_structure.js`.

## A. Item ID table — DRAFT (needs canon spot-check on the ⚠ rows)
Authoritative item set, generated from the corrected extraction: **82 non-food + 16 food = 98**. Slugs are readable snake_case; every item keeps `legacyRu` forever for the save migration. Near-duplicates are disambiguated (whistles bronze/silver/gold; rings ring/gold_ring/silver_ring; signets signet/signet_ruby/signet_emerald; plaques eagle_plaque/ship_plaque; amulets bear_amulet/gold_amulet/talisman; keys gold_key/black_castle_key/copper_key/figured_key).

### Non-food (82)
| slug | legacyRu | notes |
|---|---|---|
| `arrows_5` | «Здесь 5 стрел» |  |
| `bear_amulet` | «Медвежий амулет» | ALLY: she-bear (skill 8, outside castle only) |
| `beaver_pelt` | «Шкурка бобра» |  |
| `birdcage` | «Клетка для птиц» |  |
| `black_arrows_5` | «Здесь 5 чёрных стрел» |  |
| `black_castle_key` | «Ключ Чёрного замка» |  |
| `black_pearl` | «Чёрная жемчужина» |  |
| `book` | «Книга» |  |
| `bronze_jug` | «Бронзовый кувшин» |  |
| `bronze_whistle` | «Бронзовый свисток» |  |
| `brooch` | «Красивая брошка» |  |
| `caged_bird` | «Птичка в клетке» |  |
| `candle` | «Свеча» |  |
| `candlestick` | «Подсвечник» |  |
| `cards` | «Карты» | ⚠ playing cards vs maps — confirm @97/625/658 |
| `castle_password` | «Пароль в замок» | ⚠ flag |
| `copper_bracelet` | «Медный браслет» |  |
| `copper_key` | «Медный ключик» |  |
| `crown` | «Корона» |  |
| `deer_hide` | «Шкура оленя» |  |
| `diamond` | «Прекрасный бриллиант» |  |
| `die` | «Игральная кость» | ⚠ single gambling die |
| `diving_suit` | «Водолазный костюм» | size 2 |
| `dragon_claw` | «Коготь дракона» |  |
| `eagle_plaque` | «Бляха с золотым орлом» |  |
| `figured_key` | «Фигурный ключ» |  |
| `fire_extinguisher` | «Огнетушитель» |  |
| `fish_help` | «Помощь рыбки» | ⚠ intangible ability-flag |
| `flint` | «Огниво» |  |
| `flying_carpet` | «Ковёр-самолёт» | size 3 |
| `fox_pelt` | «Шкура лисы» |  |
| `gold_amulet` | «Золотой амулет» |  |
| `gold_arrow` | «Золотая стрела» |  |
| `gold_key` | «Золотой ключ» |  |
| `gold_necklace` | «Золотое ожерелье» |  |
| `gold_oyster` | «Золотая устрица» |  |
| `gold_ring` | «Золотое кольцо» |  |
| `gold_whistle` | «Золотой свисток» |  |
| `golden_orange` | «Золотой апельсин» | ⚠ artifact, NOT the fruit «Апельсин» |
| `goldfish` | «Золотая рыбка» |  |
| `hand_mirror` | «Зеркальце» |  |
| `helmet` | «Шлем» |  |
| `horse_blanket` | «Попона для лошади» |  |
| `hourglass` | «Песочные часы» |  |
| `ivory_comb` | «Гребень из слоновой кости» | ⚠ size? appears in ITEM_SIZES? verify |
| `magic_bell` | «Волшебный колокольчик» | ALLY: bear (skill 11, anywhere) |
| `magic_belt` | «Волшебный пояс» |  |
| `manuscript` | «Рукопись» |  |
| `mirror_secret` | «Тайна зеркал» | ⚠ intangible knowledge-flag |
| `parchment_scroll` | «Пергаментный свиток» |  |
| `pass` | «Пропуск» |  |
| `password_evenlo` | «Пароль «Трое из Эвенло»» | ⚠ flag |
| `peacock_feather` | «Перо павлина» |  |
| `perfume_vial` | «Флакончик духов» |  |
| `prayer_beads` | «Чётки» |  |
| `ring` | «Кольцо» |  |
| `rope` | «Верёвка» |  |
| `rope_ladder` | «Верёвочная лесенка» |  |
| `rose` | «Роза» |  |
| `ruby_star` | «Рубиновая звезда» |  |
| `shiny_metal` | «Блестящий кусок металла» |  |
| `ship_plaque` | «Бляха с парусным корабликом» |  |
| `signet` | «Перстень» |  |
| `signet_emerald` | «Перстень с изумрудом» |  |
| `signet_ruby` | «Перстень с рубином» |  |
| `silver_bracelet` | «Серебряный браслет» |  |
| `silver_ring` | «Серебряное кольцо» |  |
| `silver_vessel` | «Серебряный сосуд» |  |
| `silver_whistle` | «Серебряный свисток» |  |
| `smoking_pipe` | «Курительная трубка» |  |
| `stone_centaur` | «Каменный Кентавр» |  |
| `stork_feather` | «Перо аиста» |  |
| `talisman` | «Оберег» |  |
| `thread_ball` | «Клубочек» |  |
| `throne_lore` | «Знание о троне» | ⚠ intangible knowledge-flag |
| `treasure_lore` | «Знание о кладе» | ⚠ intangible knowledge-flag |
| `water_flask` | «Фляга с водой» |  |
| `watermelon` | «Арбуз» | ⚠ item or food? granted via auto_items.items @300, not food |
| `whip` | «Кнут» |  |
| `white_arrow` | «Белая стрела» |  |
| `whole_sword` | «Целый меч» |  |
| `wood_piece` | «Красивый кусочек дерева» |  |

### Food (16)
| slug | legacyRu | stamina |
|---|---|---|
| `apple` | «Яблоко» | 2 |
| `banana` | «Банан» | 2,3 |
| `bread` | «Хлеб» | 4 |
| `cheese` | «Сыр» | 4 |
| `dragon_liver` | «Печень дракона (еда: +9)» | (from «(еда:+N)» suffix) |
| `honey` | «Мёд» | 3 |
| `lemon` | «Лимон» | 2 |
| `meat` | «Мясо» | 6 |
| `milk` | «Молоко» | 4 |
| `nutmeg_biscuit` | «Мускатное печенье» | 2 |
| `orange` | «Апельсин» | 2 |
| `pear` | «Груша» | 2 |
| `pineapple` | «Ананас» | 3 |
| `sausage` | «Колбаса» | 5 |
| `tangerine` | «Мандарин» | 3 |
| `wine_bottle` | «Бутылка вина (еда: +4)» | (from «(еда:+N)» suffix) |

**Two suffixed food strings** carry the value in the name itself and are granted via `auto_items.items` (not `grants_food`): «Бутылка вина (еда: +4)»->`wine_bottle` (4), «Печень дракона (еда: +9)»->`dragon_liver` (9). The migration must convert these to structured food `{item, stamina}`.

**Engine-side keys to re-key with the same slugs:** `ITEM_SIZES` (`diving_suit`:2, `flying_carpet`:3) and `COMBAT_ALLIES` (`magic_bell`, `bear_amulet`).

**⚠ rows = confirm against `fb2_remake.fb2` before freezing the slug:** `watermelon` (item vs food), `cards` (playing-cards vs maps), `golden_orange` (artifact, not the fruit), and the four intangible knowledge/flag pseudo-items (`treasure_lore`, `throne_lore`, `mirror_secret`, `fish_help`) + the two passwords.

## B. `items.json` registry (shape)
```json
{
  "silver_whistle": { "legacyRu": "Серебряный свисток", "kind": "item" },
  "diving_suit":    { "legacyRu": "Водолазный костюм", "kind": "item", "size": 2 },
  "flying_carpet":  { "legacyRu": "Ковёр-самолёт", "kind": "item", "size": 3 },
  "magic_bell":     { "legacyRu": "Волшебный колокольчик", "kind": "item", "ally": "bear" },
  "banana":         { "legacyRu": "Банан", "kind": "food", "defaultStamina": 2 },
  "wine_bottle":    { "legacyRu": "Бутылка вина", "kind": "food", "defaultStamina": 4 }
}
```
`legacyRu` is 1:1 with the current display string, so the inverse map (`RU_ITEM_TO_ID`) is exact and drives the save migration.

## C. Neutral-structure field additions (replacing the 4 Cyrillic couplings)
- **Spell:** make `spell:"FIRE"` (or `spell_any:[...]`) universal on every spell choice (already on 103). Delete `SPELL_KEYWORDS` + the `getSpellId()` `/заклят|заклин/` fallback.
- **Flee:** add `flee:true` to the combat-escape choices currently detected by `/убежать|бежать|.../`. Delete the regex; `isFlee = duringCombat && ch.flee===true`.
- **Food:** replace the `«name (еда: +N)»` string with `grants_food:{item:"banana", stamina:3}` (most sites already use this) and structured inventory entries; delete the `/\(еда:…\)/` parsing at ~12 sites.
- **Scene (the coupling the other reports missed):** add `scene:"forest"|"castle"|"river"|"combat"|"dungeon"|"field"|"night"|...` to each paragraph, derived ONCE (offline, by the current classifier over the RU text) and then frozen as data. Replace the L2336-2348 text-scan with a direct read of `GD[n].scene`.

## D. Save migration v5 -> v6
- New `SAVE_KEY` stays `podzch_v6`; keep `podzch_v5` as backup; reuse the existing `normalizeSave()` hook.
- `S.inventory`: map each Russian string via `RU_ITEM_TO_ID` (inverse of `items.json.legacyRu`); convert food strings (incl. the two `(еда:+N)` ones) to structured `{id, kind:'food', stamina}`; unknown/hand-typed strings -> `{id:'custom', customName}`.
- `S.summonsUsed`: map Russian ally keys to slugs.
- **Reconcile the version split:** `game_logic.js` `loadGame()` accepts v4/v5 and `SAVE_KEY='podzch_v5'`; `map_module.js` accepts `v∈{4,5,6,7}` and bumps to 7. Confirm at implementation whether these touch the SAME save object; the v6 migration must satisfy both modules (likely: game save -> v6; map-state version handled separately).
- **Test:** unit-test the migration over a synthetic v5 save containing all 82 non-food + all 16 food items + a hand-typed custom item, asserting a clean round-trip.

## E. `extract_i18n.py` (design)
- Read `src/remake_data.js` UTF-8; parse with `GD = json.loads(re.match(...))` (never grep the single line).
- Emit `src/game_structure.js` (neutral GD: targets/flags/conditions with **slugs**, enemy keys, riddle config, `spell`/`flee`/`scene`, structured food) and `src/locales/locale.ru.js` (`window.LOCALES['ru'] = { p, labels, items, enemies, spells, ui, riddles, preface, title }`), plus `reports/i18n_extraction_report.md`.
- Generate stable per-choice label ids (`"<para>#<index>"`, e.g. `"166#0"`); the id moves with the choice on future edits (never blind-regenerate).
- Write everything with `python -X utf8`, `encoding='utf-8'`, `newline='\n'`, pretty-printed one-key-per-line (diff-friendly — a concrete improvement over today's 1 MB single line).

## F. Resolvers (engine)
`t(key)`, `pText(n)`, `label(id)`, `itemName(slug)`, `enemyName(key)`, `spellText(id,'name'|'full')`, with fallback chain active-locale -> base (`ru`) -> the key itself. `S.inventory` holds **slugs**; every former Russian-string print goes through `itemName()`. No engine branch reads Cyrillic after the four couplings are replaced.

## G. build.sh changes
- Insert the chosen `locale.*.js` + `locale_manifest.js` into the concatenation **after** `game_structure.js`, **before** `game_logic.js`.
- Parameterize locales + output name: `--single-file ru` (`…-ru.html`), `--single-file ru,en` (`…-multi.html`), plus the legacy passthrough until cutover.
- Keep `python -X utf8 scripts/build_shell.py`; keep the `<script>`-balance and no-live-`@import` sanity checks. (PWA manifest/SW wiring + art externalization are Phase 5, not Phase 1.)

## H. Verification gate (must pass before cutover)
- **Golden render:** for a fixed path set (reuse SMOKE_TEST_PATHS.md), the v6/i18n RU build produces the **same** paragraph text, choices, HUD, inventory names, combat banners, riddle behavior, and §1220 victory as the current build.
- **Node harness:** the existing `passesInventoryCheck` / spell / consume harness re-run against `game_structure.js` + `locale.ru.js` (slugs resolve to the same gates).
- **Structural baseline unchanged:** 1221 / 1205 reachable / 0 dangling / 76 combat / 116 post_combat.
- **Lint:** no Cyrillic outside `locales/ru/**` (+ comments during transition).

## What Phase 1 does NOT include
Translation, a 2nd language, the language dropdown / instant-switch UI, served-PWA activation, and art externalization. Those are Phases 4-5 once the RU-only ID/locale split is proven.
