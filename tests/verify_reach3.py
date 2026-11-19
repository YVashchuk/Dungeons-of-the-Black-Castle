# -*- coding: utf-8 -*-
import io, sys, json, re, os
from collections import deque, defaultdict
sys.stdout.reconfigure(encoding='utf-8')
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = io.open(os.path.join(REPO, "src", "game_structure.js"), encoding="utf-8").read()
GD = json.loads(re.match(r"\s*const\s+GD\s*=\s*(\{.*\})\s*;?\s*$", raw, re.S).group(1))
V = set(int(k) for k in GD)
edges = defaultdict(set)
for k,d in GD.items():
    u=int(k)
    for c in d.get('choices',[]):
        t=c.get('target')
        if t is not None: edges[u].add(t)
    r = d.get('riddle')
    if isinstance(r, dict):
        if r.get('fail_target'): edges[u].add(r['fail_target'])
        vt = r.get('valid_targets')
        if isinstance(vt, list):
            for t in vt:
                if isinstance(t,int): edges[u].add(t)
        elif isinstance(vt, dict):
            for t in vt.values():
                if isinstance(t,int): edges[u].add(t)
seen={1}; q=deque([1])
while q:
    u=q.popleft()
    for v in edges.get(u,()):
        if v in V and v not in seen: seen.add(v); q.append(v)
unreach=sorted(V-seen)
print("reachable WITH valid_targets:", len(seen), "| unreachable:", len(unreach))
print("unreachable set:", unreach)
print("\nMatches handoff claim of 1219 reachable:", len(seen)==1219)
# classify remaining unreachable vs audit Tiers
tierB={650}   # group_107: a key door of the 1991 numbering - no paragraph of the remake adds up to it
tierC={736}   # group_107: the golden horseshoe - remake text that no paragraph leads to
other=set(unreach)-tierB-tierC
print("\nremaining unreachable breakdown:")
print("  Tier B (documented, need 1991 confirm):", sorted(set(unreach)&tierB))
print("  Tier C (documented, manual 1991 xref):", sorted(set(unreach)&tierC))
print("  other:", sorted(other))
