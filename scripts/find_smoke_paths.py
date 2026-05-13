"""Smoke-test path generator.

Reads src/remake_data.js (the GD object), builds a directed graph from
each paragraph's choices array, and computes BFS-shortest paths from §1
to a list of target paragraphs that need manual smoke-testing after the
recent backlog of commits.

Usage:
    python scripts/find_smoke_paths.py

Outputs a markdown file SMOKE_TEST_PATHS.md at repo root with one section
per smoke-test scenario. Each section lists the click-by-click sequence:
the player starts at §1, navigates through intermediate paragraphs, and
ends at the paragraph that needs verification.

Notes:
  - Some targets need TWO paths: one where the player has acquired a
    prerequisite item (e.g. visited §757 to get 'Целый меч'), and one
    where they have not. The script handles this via the
    'visit_required' field on each scenario.
  - Conditional choices (luck_type, combat_condition, inventory_condition,
    post_combat) are skipped when computing the basic graph — BFS treats
    only the unconditional choices as edges. Manual verification of
    conditional branches relies on the player following the basic
    navigation, then choosing the conditional option once at the target.
  - Paths are BFS-shortest, not necessarily 'canonical' — but they are
    valid in the graph sense and shorter than narrative routes.
"""
from __future__ import annotations

import json
import os
import re
import sys
from collections import deque
from typing import Optional


# ─────────────────────────────────────────────────────────────────────────────
# Parsing src/remake_data.js into a Python dict
# ─────────────────────────────────────────────────────────────────────────────

def load_gd(repo_root: str) -> dict:
    """Load the GD object from src/remake_data.js."""
    path = os.path.join(repo_root, 'src', 'remake_data.js')
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()
    m = re.search(r"const\s+GD\s*=\s*(\{.*\})\s*;?\s*$", src, re.DOTALL)
    if not m:
        raise RuntimeError("Could not extract GD object from src/remake_data.js")
    return json.loads(m.group(1))


# ─────────────────────────────────────────────────────────────────────────────
# Graph construction
# ─────────────────────────────────────────────────────────────────────────────

def build_basic_graph(gd: dict) -> dict[int, list[tuple[int, str]]]:
    """For each paragraph, return list of (target, label) edges that are
    *unconditional* — no luck_type, no combat_condition, no
    inventory_condition, no post_combat. These are the baseline navigation
    edges a player can always follow.

    Returns: dict[paragraph_id, list of (target, label_short)]
    """
    graph: dict[int, list[tuple[int, str]]] = {}
    for k, sec in gd.items():
        try:
            paragraph = int(k)
        except ValueError:
            continue
        edges: list[tuple[int, str]] = []
        for ch in sec.get('choices', []):
            if ch.get('luck_type'):
                continue
            if ch.get('combat_condition'):
                continue
            if ch.get('inventory_condition'):
                continue
            if ch.get('post_combat'):
                continue
            target = ch.get('target')
            if target is None:
                continue
            label = ch.get('label', '')
            short = label.split('(')[0].strip() or f"→ {target}"
            edges.append((int(target), short))
        graph[paragraph] = edges
    return graph


def build_full_graph(gd: dict) -> dict[int, list[tuple[int, str, dict]]]:
    """All edges including conditional ones, for fallback path search when
    basic graph fails to reach a target."""
    graph: dict[int, list[tuple[int, str, dict]]] = {}
    for k, sec in gd.items():
        try:
            paragraph = int(k)
        except ValueError:
            continue
        edges: list[tuple[int, str, dict]] = []
        for ch in sec.get('choices', []):
            target = ch.get('target')
            if target is None:
                continue
            label = ch.get('label', '')
            short = label.split('(')[0].strip() or f"→ {target}"
            cond = {k: v for k, v in ch.items() if k in (
                'luck_type', 'combat_condition', 'inventory_condition',
                'post_combat'
            )}
            edges.append((int(target), short, cond))
        graph[paragraph] = edges
    return graph


# ─────────────────────────────────────────────────────────────────────────────
# BFS
# ─────────────────────────────────────────────────────────────────────────────

def bfs(graph: dict, start: int, goal: int, must_visit: Optional[list[int]] = None) -> Optional[list[tuple[int, str]]]:
    """Find a shortest path from start to goal.

    If must_visit is given, the path is required to pass through ALL listed
    paragraphs (in any order) before reaching goal. Implemented by chaining
    BFS searches: start → must_visit[0] → must_visit[1] → … → goal.

    Returns a list of (target_paragraph, click_label) describing each click,
    or None if no path exists.
    """
    if must_visit:
        full: list[tuple[int, str]] = []
        cursor = start
        for waypoint in must_visit + [goal]:
            segment = _bfs_one(graph, cursor, waypoint)
            if segment is None:
                return None
            full.extend(segment)
            cursor = waypoint
        return full
    return _bfs_one(graph, start, goal)


def _bfs_one(graph: dict, start: int, goal: int) -> Optional[list[tuple[int, str]]]:
    if start == goal:
        return []
    seen = {start}
    parent: dict[int, tuple[int, str]] = {}
    queue: deque[int] = deque([start])
    while queue:
        node = queue.popleft()
        for edge in graph.get(node, []):
            target, label = edge[0], edge[1]
            if target in seen:
                continue
            seen.add(target)
            parent[target] = (node, label)
            if target == goal:
                # Reconstruct
                path: list[tuple[int, str]] = []
                cur = goal
                while cur != start:
                    prev, lab = parent[cur]
                    path.append((cur, lab))
                    cur = prev
                path.reverse()
                return path
            queue.append(target)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Smoke-test scenarios
# ─────────────────────────────────────────────────────────────────────────────

# Each scenario:
#   id: short slug for the section header
#   target: paragraph to reach
#   what_to_check: human-readable description
#   must_visit: optional list of waypoint paragraphs the path must include
#   commit: which commit introduced the change being verified

SCENARIOS = [
    # ── Illustrations ────────────────────────────────────────────────────
    {
        "id": "art54_cold_open",
        "target": 1,
        "what_to_check": "Cold-open art54_forest_path renders above paragraph text on game start.",
        "commit": "a88a0c6",
    },
    {
        "id": "art01_preserved_at_§14",
        "target": 14,
        "what_to_check": "The original art01_enchanted_forest_start still renders at §14 (was preserved when §1 routing moved to art54).",
        "commit": "a88a0c6",
    },
    {
        "id": "art53_after_six_legged_beast",
        "target": 311,
        "what_to_check": "art53_six_legged_beast renders. Hero kneels by a six-legged corpse with a leather pouch containing a gold whistle and diamond.",
        "commit": "a88a0c6",
    },

    # ── Group 5 (P0): fatal-unlucky death overlay ─────────────────────────
    {
        "id": "fatal_unlucky_§203_drowning",
        "target": 203,
        "what_to_check": "On entering §203 a luck modal appears. Choose 'unlucky' (or fail the dice). Engine should route directly to the death overlay with the full §203 paragraph text and a 'Начать заново' button — NOT a blank screen.",
        "commit": "7a294e5",
    },
    {
        "id": "fatal_unlucky_§289_falling_tree",
        "target": 289,
        "what_to_check": "Same as §203: failed luck → death overlay, not blank UI.",
        "commit": "7a294e5",
    },
    {
        "id": "fatal_unlucky_§377",
        "target": 377,
        "what_to_check": "Same as §203: failed luck → death overlay, not blank UI.",
        "commit": "7a294e5",
    },

    # ── Group 3.1: §166 Green Sword conditional gating ────────────────────
    {
        "id": "sword_gate_§1003_NO_sword",
        "target": 1003,
        "what_to_check": "Without 'Целый меч' in inventory, the §1003 screen should show three buttons: 'Слабость' (spell), 'Огонь' (spell), and 'Обнажить меч и сразиться (633)'. The button 'Если у вас есть меч Зеленого рыцаря (166)' must be HIDDEN.",
        "commit": "1fd8e6a",
    },
    {
        "id": "sword_gate_§1003_WITH_sword",
        "target": 1003,
        "must_visit": [757],
        "what_to_check": "After visiting §757 (where the sword is granted via auto_items), §1003 should show all four buttons including the conditional one to §166. Click §166 to confirm it leads to §1101.",
        "commit": "1fd8e6a + cce1a1f",
    },
    {
        "id": "sword_gate_§135_NO_sword",
        "target": 135,
        "what_to_check": "Without 'Целый меч', §135 hides the §166 branch. Only the §633 (death) fallback remains.",
        "commit": "1fd8e6a",
    },
    {
        "id": "sword_gate_§135_WITH_sword",
        "target": 135,
        "must_visit": [757],
        "what_to_check": "With 'Целый меч' in inventory, §135 shows the §166 branch in addition to the §633 fallback.",
        "commit": "1fd8e6a",
    },

    # ── Group 3.2: §1085 Gold Key conditional door ────────────────────────
    {
        "id": "gold_key_§1085_NO_key",
        "target": 1085,
        "what_to_check": "Without 'Золотой ключ' in inventory, §1085 shows ONLY the fallback 'Идти в другую дверь (459)'. The success branch 'Открыть дверь Золотым ключом (1115)' is hidden.",
        "commit": "9b2f60b",
    },
    {
        "id": "gold_key_§1085_WITH_key_via_§440",
        "target": 1085,
        "must_visit": [440],
        "what_to_check": "After visiting §440 (which grants 'Золотой ключ' via auto_items), §1085 shows BOTH buttons. Choose the gold-key option to confirm it leads to §1115.",
        "commit": "9b2f60b",
    },
    {
        "id": "gold_key_sec1085_WITH_key_via_sec1172",
        "target": 1085,
        "must_visit": [1172],
        "what_to_check": "Alternate acquisition path: sec.1172 grants 'Zolotoj kljuch' via auto_items after the dragon-route victory (different graph subtree from sec.440). After visiting sec.1172, sec.1085 should show BOTH the gold-key button (target 1115) and the fallback (target 459). Click the gold-key option to confirm canonical sec.1115 routing. Catches a regression in which sec.1172 grant breaks while sec.440 still works.",
        "commit": "group_6_gold_key (verification)",
    },

    # ── Group 6: Vodyanoy paradox ─────────────────────────────────────────
    {
        "id": "vodyanoy_paradox_§642",
        "target": 642,
        "must_visit": [873, 767],
        "what_to_check": "Carry several items + 10+ gold into §873. Drink water (→§767, costs 2g). Wake at §642: notification should show '− весь инвентарь (N)' AND '− N золотых'. Open inventory: empty. HUD gold counter: 0. Then continue to §438.",
        "commit": "8a2b448",
    },

    # ── Group 1.4 + extension: White Arrow chain ─────────────────────────
    {
        "id": "white_arrow_acq_§688",
        "target": 688,
        "what_to_check": "On entering §688 the hero finds a white-fletched arrow in the throne's secret compartment. auto_items notification should display 'Белая стрела'. Open inventory: 'Белая стрела' present.",
        "commit": "87a58d2",
    },
    {
        "id": "white_arrow_offer_§535_NO_arrow",
        "target": 535,
        "what_to_check": "Without any of the four items in inventory, §535 should ONLY show 'Если у вас ничего нет (354)'. The three offer buttons (Белая стрела, Бриллиант, Золотой свисток) must be hidden.",
        "commit": "87a58d2",
    },
    {
        "id": "white_arrow_offer_§535_WITH_arrow",
        "target": 535,
        "must_visit": [688],
        "what_to_check": "After §688 (white arrow grant), §535 shows the 'Белую стрелу (2)' offer button.",
        "commit": "87a58d2",
    },
    {
        "id": "white_arrow_door_§1196",
        "target": 1196,
        "must_visit": [688],
        "what_to_check": "With white arrow in inventory, §1196 shows 'Открыть дверь с белой стрелой (871)' option. Without it, only the unconditional alternatives are visible.",
        "commit": "87a58d2",
    },

    # ── Group 8: §570 black arrows ────────────────────────────────────────
    {
        "id": "black_arrows_§570",
        "target": 570,
        "what_to_check": "On entering §570, auto_items grants 'Здесь 5 чёрных стрел' as a single inventory entry. Open inventory after entering to confirm.",
        "commit": "41a7e6a",
    },

    # ── Group 1.4: missing item acquisitions ─────────────────────────────
    {
        "id": "sword_acq_§757",
        "target": 757,
        "what_to_check": "On entering §757 the player gains 'Целый меч' AND a +1 МАСТЕРСТВО bonus. Both notifications should appear; HUD skill counter should tick up by 1.",
        "commit": "cce1a1f",
    },
    {
        "id": "gold_key_acq_§1172",
        "target": 1172,
        "what_to_check": "On entering §1172 (alternate dragon-route victory) the player gains 'Золотой ключ'. Inventory should show it after.",
        "commit": "cce1a1f",
    },

    # ── Group 12 (partial): Bronze whistle gates ──────────────────────────
    {
        "id": "bronze_whistle_§810_offer",
        "target": 810,
        "what_to_check": "Without 'Бронзовый свисток' in inventory, §810 hides the 'Бронзовый свисток (395)' branch. With it, button is visible.",
        "commit": "7e00452",
    },

    # ── Group 16: gold_condition gating + gold_cost deduction ──────────
    {
        "id": "gold_gate_§774_NO_gold",
        "target": 774,
        "what_to_check": "With 0 gold, §774 hides both 'Если есть 1 золотой (686)' and 'Если есть 5 золотых (299)' buttons. Remaining choices: §1132 (wood-piece fallback), §251 (figurine key, gated), §1084 (silver vessel), §848 (glass vessel), §1003 (exit).",
        "commit": "group_16",
    },
    {
        "id": "gold_gate_§774_WITH_1g_only",
        "target": 774,
        "what_to_check": "With 1–4 gold, the 1-gold button is visible but the 5-gold button stays hidden. Click 1-gold button — §686 deducts 1 gold via auto_items.",
        "commit": "group_16",
    },
    {
        "id": "gold_gate_§774_WITH_5g",
        "target": 774,
        "what_to_check": "With 5+ gold, both gold buttons visible. Click 5-gold button — 5 gold deducted via gold_cost, navigation to §299. After arriving at §299 (hatch opens), gold balance shows the 5g deduction.",
        "commit": "group_16",
    },
    {
        "id": "gold_gate_§686_to_§299_4g_more",
        "target": 686,
        "what_to_check": "After entering §686 via the 1-gold branch (already lost 1g), the 'Сделаете это — кинуть ещё 4 золотых (299)' button is hidden if gold<4, visible otherwise. Click it: 4 gold deducted, navigate to §299.",
        "commit": "group_16",
    },
    {
        "id": "figurine_key_gate_§774_NO_key",
        "target": 774,
        "what_to_check": "Without 'Фигурный ключ' in inventory, §774 hides ch[1] 'Если фигурный ключ (251)'. With it (via §340 shop purchase 2g), button visible. This is the second usage of the key after §1208 from commit ab5e585.",
        "commit": "group_16",
    },
    {
        "id": "wood_piece_gate_§774_NO_wood",
        "target": 774,
        "what_to_check": "Without 'Красивый кусочек дерева' in inventory, §774 hides ch[0] 'Если есть красивый кусочек дерева — попробовать им (1132)'. With it (via §340 shop purchase 1g), button visible. After click → §1132 narrates that the wood piece does not fit and routes back to §774, so it's a deliberate dead-end option in the canon.",
        "commit": "group_18",
    },

    # ── Conditional gating regressions (user smoke-test 2026-05-11) ──────
    {
        "id": "rope_gate_§412_NO_rope",
        "target": 412,
        "what_to_check": "Without 'Верёвка' in inventory, §412 hides the 'Если есть верёвка — взобраться на скалу (375)' button. Remaining choices: обойти скалу (214), вернуться на развилку (424), и Левитация (405) — последняя disabled если 0 заклятий.",
        "commit": "user_smoke_test_2026_05_11",
    },
    {
        "id": "rope_gate_§412_WITH_rope",
        "target": 412,
        "must_visit": [1193],
        "what_to_check": "After visiting §1193 (which grants 'Верёвка'), §412 shows the rope-climb button. Click to verify navigation to §375.",
        "commit": "user_smoke_test_2026_05_11",
    },
    {
        "id": "rope_gate_§464_NO_rope",
        "target": 464,
        "what_to_check": "Without 'Верёвка' in inventory, §464 hides the 'Если есть веревка (530)' button.",
        "commit": "user_smoke_test_2026_05_11",
    },
    {
        "id": "gold_whistle_gate_§725_NO_whistle",
        "target": 725,
        "what_to_check": "Without 'Золотой свисток' in inventory, §725 hides the 'если есть Золотой свисток (142)' button.",
        "commit": "user_smoke_test_2026_05_11",
    },

    # ── Group 14: shop / buy-choice engine ──────────────────────────
    {
        "id": "shop_§340_food_purchase",
        "target": 340,
        "what_to_check": "On entering §340 the peasant shop renders 9 purchase buttons (3 food + 6 items) above 3 navigation buttons. Each purchase shows a gold-coin icon and a cost. Click 'Купить ананас' — 2 gold deducted, stamina +3, button stays available (food is consumable, unlimited buys until gold runs out).",
        "commit": "group_14",
    },
    {
        "id": "shop_§340_item_purchase_bracelet",
        "target": 340,
        "what_to_check": "Click 'Купить серебряный браслет' — 4 gold deducted, 'Серебряный браслет' added to inventory, button greys out with '✓ Купить...' label so it can't be re-bought.",
        "commit": "group_14",
    },
    {
        "id": "shop_§340_disabled_when_broke",
        "target": 340,
        "what_to_check": "With low gold (e.g. 2g remaining), expensive items (золотая устрица 8g, попона 5g, браслет 4g) render greyed out with tooltip 'Не хватает золота (2/N)'. Affordable items remain active.",
        "commit": "group_14",
    },

    # ── Group 11 + group 17: unblocked consumers ─────────────────────────
    {
        "id": "bracelet_gate_§1090_WITH_bracelet",
        "target": 1090,
        "must_visit": [340],
        "what_to_check": "After buying 'Серебряный браслет' at §340, §1090 ch[1] 'Подарить серебряный браслет (874)' becomes visible. Without it, button is hidden (this branch was unreachable until shop landed).",
        "commit": "group_14 (unblocks group_11)",
    },
    {
        "id": "figurine_key_gate_§1208_WITH_key",
        "target": 1208,
        "must_visit": [340],
        "what_to_check": "After buying 'Фигурный ключ' at §340, §1208 ch[0] 'Если у вас есть фигурный ключ — открыть средний сундук (984)' becomes visible.",
        "commit": "group_14 (unblocks group_17)",
    },

    # ── Group 15: post-combat item grants via `acquires` field ────────────
    {
        "id": "acquires_§58_whistle_after_goblin",
        "target": 58,
        "what_to_check": "On entering §58 a single Goblin combat starts. After winning, click 'Взять бронзовый свисток...'. The choice should grant 'Бронзовый свисток' via the new acquires field (deposited into inventory before navigation to §580). Open inventory after to confirm.",
        "commit": "group_15",
    },
    {
        "id": "acquires_§69_whistle_and_key_after_two_goblins",
        "target": 69,
        "what_to_check": "On entering §69 two-Goblin combat starts. After winning, the (relabelled) 'Забрать бронзовый свисток и медный ключик...' choice grants BOTH items via acquires array. Inventory should gain 2 entries.",
        "commit": "group_15",
    },
    {
        "id": "acquires_§233_whistle_and_key_post_combat_added",
        "target": 233,
        "what_to_check": "§233 had a descriptive label about taking whistle + key but no post_combat flag before this commit. Now the choice appears only after combat resolution and grants both items.",
        "commit": "group_15",
    },
    {
        "id": "acquires_§250_whistle_after_two_goblins",
        "target": 250,
        "what_to_check": "On entering §250 two-Goblin combat starts. After winning, the 'Взять бронзовый свисток и идти по дороге вдоль реки' choice grants 'Бронзовый свисток'.",
        "commit": "group_15",
    },
    {
        "id": "acquires_§567_whistle_and_key_post_combat_added",
        "target": 567,
        "what_to_check": "§567 had no post_combat flag before this commit. Now after winning the two-Goblin fight, the choice grants both whistle and key.",
        "commit": "group_15",
    },
    {
        "id": "acquires_§717_whistle_after_two_goblins",
        "target": 717,
        "what_to_check": "On entering §717 two-Goblin combat starts. After winning, 'Взять бронзовый свисток и идти дальше в лес' grants 'Бронзовый свисток'.",
        "commit": "group_15",
    },
    # ── Group 6: fish_help (item 1 of 13) — paragraph-arithmetic via inventory_condition ─
    {
        "id": "fish_help_acq_sec13",
        "target": 13,
        "what_to_check": "On entering sec.13 the only choice 'Теперь обратите внимание на местность (639)' should grant 'Помощь рыбки' via the acquires field (group_15 mechanism reused). Click it: notification 'Помощь рыбки' appears, inventory shows the token. Note: sec.195 (put fish in bag) is the alternative acquisition path and must NOT grant the help token.",
        "commit": "group_6_fish_help",
    },
    {
        "id": "fish_help_sec32_NO_token",
        "target": 32,
        "what_to_check": "Without 'Помощь рыбки' in inventory, entering sec.32 should trigger the death overlay (canonical drowning). The filtered-choices dead-end fix routes raw-1 / visible-0 paragraphs to showDeathOverlay correctly.",
        "commit": "group_6_fish_help",
    },
    {
        "id": "fish_help_sec32_WITH_token",
        "target": 32,
        "must_visit": [13],
        "what_to_check": "After visiting sec.13 (where 'Помощь рыбки' is granted on click of the navigation choice), sec.32 should show one button: 'Позвать на помощь Золотую рыбку (47)'. Click → sec.47 → sec.717 rescue.",
        "commit": "group_6_fish_help",
    },
    {
        "id": "fish_help_sec203_NO_token",
        "target": 203,
        "what_to_check": "Without 'Помощь рыбки', sec.203 should show only the luck-roll button (existing fatal_unlucky route preserved). Failed luck → death overlay.",
        "commit": "group_6_fish_help",
    },
    {
        "id": "fish_help_sec203_WITH_token",
        "target": 203,
        "must_visit": [13],
        "what_to_check": "With 'Помощь рыбки', sec.203 should show TWO buttons: 'Проверить удачу' AND 'Позвать на помощь Золотую рыбку (218)'. Player can bypass the luck check entirely. Click the fish button → sec.218 → sec.62.",
        "commit": "group_6_fish_help",
    },
    {
        "id": "fish_help_sec699_WITH_token",
        "target": 699,
        "must_visit": [13],
        "what_to_check": "With 'Помощь рыбки', sec.699 (carnivorous fish lake) should show 'Позвать на помощь Золотую рыбку (714)'. Click → sec.714 → sec.58.",
        "commit": "group_6_fish_help",
    },
    # ── Group 6: candle_lamp (item 3 of 13) — +10 light-source mechanic ─
    {
        "id": "candle_lamp_acq_sec929",
        "target": 929,
        "what_to_check": "On entering sec.929 (buried chest), gold +10 already applies via auto_items. After click of the single nav choice to sec.167, the new acquires field should also deposit 'Свеча' into S.inventory. Open inventory after to confirm both gold delta and the new token.",
        "commit": "group_6_candle_lamp",
    },
    {
        "id": "candle_lamp_sec696_NO_token",
        "target": 696,
        "what_to_check": "Without 'Свеча' in inventory, sec.696 (tunnel-of-darkness hatch) should show ONLY the two darkness-fallback buttons (right wall sec.1091 / left wall sec.909). The +10 light-source success button 'Зажечь свечу или светильник (706)' must be hidden.",
        "commit": "group_6_candle_lamp",
    },
    {
        "id": "candle_lamp_sec696_WITH_token",
        "target": 696,
        "must_visit": [600],
        "what_to_check": "After visiting sec.600 (Vodyanoi taverna chest auto-grant 'Свеча' + 'Огниво' + 'Белая стрела'), sec.696 should show THREE buttons: the new 'Зажечь свечу или светильник (706)' light-source branch ALONGSIDE the two fallback darkness branches. Click the light button — should navigate to sec.706 with the 'у вас есть свой источник света' narrative.",
        "commit": "group_6_candle_lamp",
    },
    {
        "id": "candle_lamp_sec1000_NO_token",
        "target": 1000,
        "what_to_check": "Without 'Свеча' in inventory, sec.1000 (post-Goblins darkness) shows ONLY the two darkness fallbacks (right wall sec.924 / left wall sec.726). Light button hidden.",
        "commit": "group_6_candle_lamp",
    },
    {
        "id": "candle_lamp_sec1000_WITH_token",
        "target": 1000,
        "must_visit": [600],
        "what_to_check": "With 'Свеча' in inventory, sec.1000 shows THREE buttons including the new 'Зажечь свечу или светильник (1010)'. Click → sec.1010 darkness-rescue narrative.",
        "commit": "group_6_candle_lamp",
    },
    # ── Group 6: figured_key (item 4 of 13) — shop-purchase gating regression fix ─
    {
        "id": "figured_key_sec804_NO_key",
        "target": 804,
        "what_to_check": "Without 'Фигурный ключ' in inventory, sec.804 (locked hatch, item-offer prompt) should show THREE buttons: медный ключик (1064), кусок металла (1184), and the no-key exit (590). The 'Фигурный ключ (895)' button must be HIDDEN — this was a pre-fix regression where the figured-key button appeared without the key and led the player to a misleading dead-narrative.",
        "commit": "group_6_figured_key",
    },
    {
        "id": "figured_key_sec804_WITH_key",
        "target": 804,
        "must_visit": [340],
        "what_to_check": "After buying 'Фигурный ключ' at sec.340 (2 gold), sec.804 should show FOUR buttons including the new 'Фигурный ключ (895)' option. Click it: routes to sec.895 size-fail narrative, then sec.590 exit. This is the third figured-key consumer wired (after sec.774 / sec.1208 in earlier groups).",
        "commit": "group_6_figured_key",
    },
    # ── Group 6: castle_key (item 5 of 13) — +40 consumer doors via inventory_condition ─
    {
        "id": "castle_key_acq_sec471",
        "target": 471,
        "what_to_check": "sec.471 grants 'Ключ Чёрного замка' (plus 8 gold and 'Медный браслет') via existing auto_items on entry — this acquisition was shipped earlier and is the upstream for all four consumer-door scenarios below. Open inventory after entering: 'Ключ Чёрного замка' present.",
        "commit": "group_6_castle_key (acquisition reused)",
    },
    {
        "id": "castle_key_sec91_NO_key",
        "target": 91,
        "what_to_check": "Without 'Ключ Чёрного замка' in inventory, sec.91 (corridor locked door) shows ONLY the corridor-continue fallback (sec.671). The new 'Отпереть дверь Ключом Чёрного замка (131)' button must be HIDDEN.",
        "commit": "group_6_castle_key",
    },
    {
        "id": "castle_key_sec91_WITH_key",
        "target": 91,
        "must_visit": [471],
        "what_to_check": "After visiting sec.471 (acquisition), sec.91 should show BOTH buttons: the new gated 'Отпереть дверь Ключом Чёрного замка (131)' AND the existing fallback (sec.671). Click the key option → sec.131 sentry-tower battle narrative ('Вы достаете ключ. Он легко поворачивается').",
        "commit": "group_6_castle_key",
    },
    {
        "id": "castle_key_sec687_WITH_key",
        "target": 687,
        "must_visit": [471],
        "what_to_check": "With the castle key, sec.687 shows 'Отпереть дверь Ключом Чёрного замка (727)' alongside the existing fallback to sec.1009. Click the key → sec.727 stairwell narrative.",
        "commit": "group_6_castle_key",
    },
    {
        "id": "castle_key_sec694_WITH_key",
        "target": 694,
        "must_visit": [471],
        "what_to_check": "With the castle key, sec.694 shows 'Отпереть дверь Ключом Чёрного замка (734)' alongside the existing fallback to sec.1046. Click the key → sec.734 'Достав ключ, вы отпираете дверь' narrative leading to sec.671.",
        "commit": "group_6_castle_key",
    },
    {
        "id": "castle_key_sec768_WITH_key",
        "target": 768,
        "must_visit": [471],
        "what_to_check": "With the castle key, sec.768 shows 'Отпереть дверь Ключом Чёрного замка (808)' alongside the existing fallback to sec.362. Click the key → sec.808 'Вы находите в заплечном мешке ключ' narrative leading to sec.1150.",
        "commit": "group_6_castle_key",
    },
    # ── Group 6: bear_key (item 6 of 13) — +40 castle doors, "Медный ключик" unified ─
    {
        "id": "bear_key_acq_sec612",
        "target": 612,
        "what_to_check": "sec.612 (bear gift after rescuing the cub) now grants 'Медный ключик' via auto_items (was previously the anonymous 'Ключ' — name unification). Click the only nav choice to sec.1106. Open inventory: 'Медный ключик' should be present, alongside the magical bell.",
        "commit": "group_6_bear_key",
    },
    {
        "id": "bear_key_sec803_NO_key",
        "target": 803,
        "what_to_check": "Without 'Медный ключик' in inventory, sec.803 shows ONLY two fallback buttons (window sec.323, back-door sec.607). The success branch 'Есть медный ключик, то достаньте его (1035)' must be HIDDEN — regression fix.",
        "commit": "group_6_bear_key",
    },
    {
        "id": "bear_key_sec803_WITH_key",
        "target": 803,
        "must_visit": [612],
        "what_to_check": "After visiting sec.612 (bear gift), sec.803 should show THREE buttons including the gated 'Есть медный ключик, то достаньте его (1035)'. Click it to confirm the storeroom narrative (sec.1035 with sword/shield/potion).",
        "commit": "group_6_bear_key",
    },
    {
        "id": "bear_key_sec804_NO_key",
        "target": 804,
        "what_to_check": "Without 'Медный ключик' in inventory, sec.804 shows THREE buttons (кусок металла sec.1184, the figured-key option ONLY if player owns it, and the exit-to-sec.590). The fail-narrative 'Может быть, есть медный ключик (1064)' must be HIDDEN — regression fix parallel to the figured-key sec.895 fix.",
        "commit": "group_6_bear_key",
    },
    {
        "id": "bear_key_sec851_WITH_key",
        "target": 851,
        "must_visit": [612],
        "what_to_check": "After visiting sec.612, sec.851 (long polutemniy corridor with a door) should show 'Отпереть дверь Медным ключиком (891)' alongside the existing fallback (sec.881). Click the key option → sec.891 jamming-narrative.",
        "commit": "group_6_bear_key",
    },
    {
        "id": "bear_key_sec881_WITH_key",
        "target": 881,
        "must_visit": [612],
        "what_to_check": "After visiting sec.612, sec.881 (corridor branching from sec.851) should show 'Отпереть дверь Медным ключиком (921)' alongside the existing fallback (sec.1123). Click the key option → sec.921 tomb-entrance narrative. This restores an orphan-target — sec.921 was unreachable in remake prior to this commit.",
        "commit": "group_6_bear_key",
    },
    # ── Group 6: thread_ball (item 8 of 13) — Klubochek crossroads +50 mechanic ─
    {
        "id": "thread_ball_acq_sec198",
        "target": 198,
        "what_to_check": "sec.198 (Лесовичок encounter) should now grant 'Клубочек' on click of the only nav choice to sec.54. Open inventory after entering sec.54: 'Клубочек' present. The narrative explicitly establishes the +50-crossroads mechanic in the paragraph text.",
        "commit": "group_6_thread_ball",
    },
    {
        "id": "thread_ball_sec108_NO_klubochek",
        "target": 108,
        "what_to_check": "Without 'Клубочек' in inventory, sec.108 (first forest crossroads) shows TWO manual-direction buttons: sec.485 (направо) and sec.64 (налево). The klubochek-follow button must be HIDDEN.",
        "commit": "group_6_thread_ball",
    },
    {
        "id": "thread_ball_sec108_WITH_klubochek",
        "target": 108,
        "must_visit": [198],
        "what_to_check": "After visiting sec.198, sec.108 shows THREE buttons: the new gated 'Идти за клубочком (158)' AND the two existing manual-direction options. Click the klubochek option → sec.158 'Клубочек сворачивает на тропинку, ведущую налево'. This canonically follows Лесовичок\'s 'налево первый перекресток' directive.",
        "commit": "group_6_thread_ball",
    },
    {
        "id": "thread_ball_sec366_WITH_klubochek",
        "target": 366,
        "must_visit": [198],
        "what_to_check": "After visiting sec.198, sec.366 (three-way fork) shows FOUR buttons: the new gated 'Идти за клубочком (416)' AND the three existing manual choices. Click klubochek → sec.416 'Клубочек катится прямо. Вернитесь на sec.366'.",
        "commit": "group_6_thread_ball",
    },
    {
        "id": "thread_ball_sec401_WITH_klubochek",
        "target": 401,
        "must_visit": [198],
        "what_to_check": "After visiting sec.198, sec.401 shows THREE buttons: the new gated 'Идти за клубочком (451)' AND the two existing manual choices. Click klubochek → sec.451 'Клубочек катится прямо, а вы можете вернуться на sec.401'.",
        "commit": "group_6_thread_ball",
    },
    # ── Group 6: ruby_ring (item 9 of 13) — canonical Princess wake-up via +401 ─
    {
        "id": "ruby_ring_acq_sec1071",
        "target": 1071,
        "what_to_check": "sec.1071 (post-magician cabinet, ring selection) should now grant 'Перстень с рубином' via auto_items on entry. Open inventory after entering sec.1071: the ruby ring is present. The four cabinet inspection options (sec.797 / sec.411 / sec.850 / sec.297) remain unchanged.",
        "commit": "group_6_ruby_ring",
    },
    {
        "id": "ruby_ring_sec226_NO_ring",
        "target": 226,
        "what_to_check": "Without 'Перстень с рубином' in inventory, sec.226 (Princess bed) shows ONLY the two no-progress fallbacks (sec.1057 mirror / sec.860 candle-tables). The new gated 'Использовать Перстень с рубином (627)' button must be HIDDEN. This is the canonical fail-state where the Princess cannot be woken.",
        "commit": "group_6_ruby_ring",
    },
    {
        "id": "ruby_ring_sec226_WITH_ring",
        "target": 226,
        "must_visit": [1071],
        "what_to_check": "After visiting sec.1071, sec.226 should show THREE buttons including the new gated 'Использовать Перстень с рубином (627)'. Click it → sec.627 canonical Princess wake-up narrative ('свет свечи падает на рубин перстня, и камень оживает'). sec.627 then routes to sec.1120 (Barlad alive) or sec.1220 (Barlad dead, victory). This is the canonical centerpiece of the game victory route, previously unreachable.",
        "commit": "group_6_ruby_ring",
    },







]


# ─────────────────────────────────────────────────────────────────────────────
# Output rendering
# ─────────────────────────────────────────────────────────────────────────────

def render_path(start: int, path: list[tuple[int, str]]) -> str:
    """Render a path as a numbered click-list."""
    if not path:
        return f"  (already at §{start} — no clicks needed)"
    lines = [f"  Start at §{start}."]
    cursor = start
    for i, (target, label) in enumerate(path, 1):
        lines.append(f"    {i:>2}. From §{cursor}: click '{label} → §{target}'")
        cursor = target
    return '\n'.join(lines)


def main() -> int:
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Repo root: {repo_root}", file=sys.stderr)

    gd = load_gd(repo_root)
    print(f"Loaded GD: {len(gd)} paragraphs", file=sys.stderr)

    basic_graph = build_basic_graph(gd)
    full_graph = build_full_graph(gd)
    print(f"Basic graph: {sum(len(v) for v in basic_graph.values())} edges from {len(basic_graph)} paragraphs", file=sys.stderr)

    out_lines = [
        "# Smoke-test paths",
        "",
        "Auto-generated by `scripts/find_smoke_paths.py`. Lists the click-by-click",
        "sequence to reach each paragraph that needs manual verification after the",
        "recent series of audit-driven commits. Run after Ctrl+Shift+R hard refresh",
        "of `dist/podzemelye-chyornogo-zamka-remake.html`.",
        "",
        "Conventions:",
        "  - Paths are BFS-shortest in the unconditional choice graph (luck-rolls,",
        "    combat-conditions, inventory-conditions, and post-combat choices are",
        "    skipped when finding intermediate routes — those are the very things",
        "    the smoke test verifies, so we don't pre-commit to taking them).",
        "  - 'must_visit' scenarios chain BFS through specific waypoints so the",
        "    player has the right inventory state by the time they reach the",
        "    target paragraph.",
        "  - Some target paragraphs need the player to engage in a fight or fail",
        "    a luck roll to reach the verification state — those steps are",
        "    described in the 'what to check' line, not in the click list.",
        "",
    ]

    failures: list[str] = []
    success_count = 0

    for sc in SCENARIOS:
        sid = sc["id"]
        target = sc["target"]
        check = sc["what_to_check"]
        must_visit = sc.get("must_visit")
        commit = sc.get("commit", "?")

        path = bfs(basic_graph, 1, target, must_visit=must_visit)
        graph_used = "basic"
        if path is None:
            path = bfs(full_graph, 1, target, must_visit=must_visit)
            graph_used = "full"

        out_lines.append(f"## {sid}")
        out_lines.append("")
        out_lines.append(f"**Target:** §{target}")
        out_lines.append("")
        out_lines.append(f"**Commit:** `{commit}`")
        out_lines.append("")
        if must_visit:
            out_lines.append(f"**Must visit first:** {', '.join('§' + str(w) for w in must_visit)}")
            out_lines.append("")
        out_lines.append(f"**What to check:** {check}")
        out_lines.append("")
        out_lines.append("**Path:**")
        out_lines.append("")
        if path is None:
            out_lines.append(f"  ❌ NO PATH FOUND from §1 to §{target}" + (
                f" via " + ", ".join(f"§{w}" for w in must_visit) if must_visit else ""))
            failures.append(f"{sid}: §1 → §{target}" + (
                f" via {must_visit}" if must_visit else ""))
        else:
            out_lines.append("```")
            out_lines.append(render_path(1, path))
            out_lines.append("```")
            out_lines.append(f"  ({len(path)} clicks total, graph: {graph_used})")
            success_count += 1
        out_lines.append("")
        out_lines.append("---")
        out_lines.append("")

    out_lines.append("")
    out_lines.append("## Summary")
    out_lines.append("")
    out_lines.append(f"- Scenarios with paths found: **{success_count} / {len(SCENARIOS)}**")
    out_lines.append(f"- Scenarios needing manual route discovery: **{len(failures)}**")
    if failures:
        out_lines.append("")
        out_lines.append("### Manual routing required for:")
        out_lines.append("")
        for f in failures:
            out_lines.append(f"  - {f}")
        out_lines.append("")
        out_lines.append(
            "These targets are unreachable from §1 via BFS through ordinary "
            "(non-luck, non-combat-conditional, non-inventory-conditional, "
            "non-post-combat) choices. They typically need either: combat "
            "victory at an intermediate paragraph, a successful luck roll, or "
            "passage through a paragraph-arithmetic branch (the §13 fish, §140 "
            "key, etc. — see group_6 in text_corrections.json). Manual route "
            "discovery via the FB2 source is needed for these."
        )

    out_path = os.path.join(repo_root, 'SMOKE_TEST_PATHS.md')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))

    print(f"\nWrote {out_path}", file=sys.stderr)
    print(f"  Scenarios: {len(SCENARIOS)}", file=sys.stderr)
    print(f"  Paths found: {success_count}", file=sys.stderr)
    print(f"  Manual routing required: {len(failures)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
