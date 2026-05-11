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
