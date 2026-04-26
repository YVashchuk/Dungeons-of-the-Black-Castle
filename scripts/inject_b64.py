import json, re, os

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js_path  = os.path.join(base, 'src', 'mj_art.js')
b64_path = os.path.join(base, 'scripts', '_batch4_b64.json')

with open(b64_path, 'r') as f:
    b64 = json.load(f)

with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

arts = [
    ('art40_giant_spider_web',    'Giant spider descends from web trap',               'https://cdn.midjourney.com/7f611350-e63a-4206-91f4-79278a724bdd/0_0.png'),
    ('art41_green_knight_mounted','Mounted knight in dark blue cloak with sword',       'https://cdn.midjourney.com/5262d54e-b9f6-4da0-97e8-70cb7c9899a6/0_0.png'),
    ('art42_crypt_skeletons',     'Undead skeletons rising in a crypt',                 'https://cdn.midjourney.com/df9aed0f-a9a5-4aad-88b8-f109c17a6422/0_0.png'),
    ('art46_giant_snake',         'Giant snake with human-shaped head',                 'https://cdn.midjourney.com/b7217d53-ce7b-4e17-80db-c9465ed9531a/0_0.png'),
    ('art47_stone_rats',          'Swarm of petrified stone rats in dungeon',           'https://cdn.midjourney.com/08722381-b984-41fc-b55d-3e383ea15830/0_0.png'),
    ('art51_barlad_dert_boss',    'Final duel: Barlad Dert in his study',               'https://cdn.midjourney.com/97989923-bf4a-449c-8dd1-aaf55bbabf7a/0_0.png'),
    ('art52_princess_rescue',     'Victory: Princess is free',                          'https://cdn.midjourney.com/ac46cf3f-6f74-47d6-920d-5ce54292120e/0_0.png'),
]

data_entries = ''
for art_id, scene, ref_url in arts:
    if art_id not in b64:
        print(f'MISSING: {art_id}')
        continue
    data_entries += (
        f"  // {art_id} — {scene}\n"
        f"  //   Ref:    {ref_url}\n"
        f"  '{art_id}': '{b64[art_id]}',\n"
    )
    print(f'  Prepared: {art_id}')

# Insert before the final }; of MJ_DATA (just before "// Attach to window")
attach_pos = js.rfind('// Attach')
if attach_pos < 0:
    print('ERROR: // Attach anchor not found')
    exit(1)

# Find last }; before "// Attach"
close_pos = js.rfind('};', 0, attach_pos)
if close_pos < 0:
    print('ERROR: closing }; not found')
    exit(1)

js = js[:close_pos] + data_entries + js[close_pos:]
print(f'Inserted {len(arts)} DATA entries')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

sz = os.path.getsize(js_path) / 1024 / 1024
print(f'mj_art.js saved: {sz:.2f} MB')
