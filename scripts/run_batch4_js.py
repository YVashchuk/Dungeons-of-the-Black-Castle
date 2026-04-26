"""
run_batch4_js.py — Batch 4 integration: download images, update mj_art.js

Arts:
  art40_giant_spider_web      — https://cdn.midjourney.com/7f611350-e63a-4206-91f4-79278a724bdd/0_0.png → [436, 448]
  art41_green_knight_mounted  — https://cdn.midjourney.com/5262d54e-b9f6-4da0-97e8-70cb7c9899a6/0_0.png → [656]
  art42_crypt_skeletons       — https://cdn.midjourney.com/df9aed0f-a9a5-4aad-88b8-f109c17a6422/0_0.png → [733, 811, 1108]
  art46_giant_snake           — https://cdn.midjourney.com/b7217d53-ce7b-4e17-80db-c9465ed9531a/0_0.png → [421, 528]
  art47_stone_rats            — https://cdn.midjourney.com/08722381-b984-41fc-b55d-3e383ea15830/0_0.png → [1003, 1110]
  art51_barlad_dert_boss      — https://cdn.midjourney.com/97989923-bf4a-449c-8dd1-aaf55bbabf7a/0_0.png → [823, 1096, 1164]
  art52_princess_rescue       — https://cdn.midjourney.com/ac46cf3f-6f74-47d6-920d-5ce54292120e/0_0.png → [1220]
"""

import os, sys, re, shutil, base64, io, urllib.request, urllib.error

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINALS = os.path.join(BASE, 'assets', 'illustrations', 'originals')
WEB       = os.path.join(BASE, 'assets', 'illustrations', 'web')
JS_PATH   = os.path.join(BASE, 'src', 'mj_art.js')

os.makedirs(ORIGINALS, exist_ok=True)
os.makedirs(WEB, exist_ok=True)

# ─── Batch 4 metadata ────────────────────────────────────────────────────────
ARTS = [
    {
        'id':       'art40_giant_spider_web',
        'url':      'https://cdn.midjourney.com/7f611350-e63a-4206-91f4-79278a724bdd/0_0.png',
        'scene':    'Giant spider descends from web trap',
        'prompt':   'monstrous giant black spider descending from thick white glowing webs in a dark dead forest, hooded hero in dark cloak trapped in a sticky rope-ladder-like web, struggling with a sword, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'remake':   [436, 448],
        'original': [],
    },
    {
        'id':       'art41_green_knight_mounted',
        'url':      'https://cdn.midjourney.com/5262d54e-b9f6-4da0-97e8-70cb7c9899a6/0_0.png',
        'scene':    'Mounted knight in dark blue cloak with sword',
        'prompt':   'towering menacing slavic knight in ornate deep green heavy plate armor with Eastern European medieval design wielding a massive lance, riding a black warhorse on misty forest road, black dragon silhouette on shield, hooded hero in dark cloak preparing to fight, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'remake':   [656],
        'original': [],
    },
    {
        'id':       'art42_crypt_skeletons',
        'url':      'https://cdn.midjourney.com/df9aed0f-a9a5-4aad-88b8-f109c17a6422/0_0.png',
        'scene':    'Undead skeletons rising in a crypt',
        'prompt':   'three terrifying undead skeletons in tattered medieval rags rising from ancient stone sarcophagi, glowing blue eyes, rusted swords, hooded hero in dark cloak holding a torch, underground crypt with burial chambers, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'remake':   [733, 811, 1108],
        'original': [],
    },
    {
        'id':       'art46_giant_snake',
        'url':      'https://cdn.midjourney.com/b7217d53-ce7b-4e17-80db-c9465ed9531a/0_0.png',
        'scene':    'Giant snake with strangely human-shaped head',
        'prompt':   'colossal venomous snake with shimmering green and black scales coiled around a dead twisted tree, the serpent head unsettlingly resembling a human hand, dripping fangs, hooded hero in dark cloak standing defensive with sword drawn, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'remake':   [421, 528],
        'original': [],
    },
    {
        'id':       'art47_stone_rats',
        'url':      'https://cdn.midjourney.com/08722381-b984-41fc-b55d-3e383ea15830/0_0.png',
        'scene':    'Swarm of petrified stone rats attacking in dungeon',
        'prompt':   'swarm of menacing stone-rat creatures with partially petrified bodies, cracked granite skin showing veins of muscle, glowing red eye-sockets, gnashing stone fangs scurrying over damp slate dungeon floor, hooded hero in dark cloak swinging a glowing pale-green steel sword to cut through them, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'remake':   [1003, 1110],
        'original': [],
    },
    {
        'id':       'art51_barlad_dert_boss',
        'url':      'https://cdn.midjourney.com/97989923-bf4a-449c-8dd1-aaf55bbabf7a/0_0.png',
        'scene':    'Final duel: Barlad Dert with glowing sword in his study',
        'prompt':   'two figures facing each other in gothic candlelit study, left: hooded dark-cloaked slavic hero with Slavic facial features sword drawn, right: ancient frail slavic sorcerer Barlad Dert with deeply wrinkled gaunt Eastern European face, long unkempt white beard, hollow burning eyes, skeletal hands crackling with dark magical energy, black robes, massive writing desk covered in maps and scrolls between them, crumbling castle interior, tall arched windows, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6',
        'remake':   [823, 1096, 1164],
        'original': [],
    },
    {
        'id':       'art52_princess_rescue',
        'url':      'https://cdn.midjourney.com/ac46cf3f-6f74-47d6-920d-5ce54292120e/0_0.png',
        'scene':    'Victory — Barlad Dert is slain, Princess is free',
        'prompt':   "hero in dark hooded cloak gently holding the hand of a beautiful slavic princess in a torn white folk gown, her long golden hair visible, she turns slightly toward viewer with tearful grateful eyes, soft dawn light breaking through gothic arched windows, crumbling castle hall strewn with autumn leaves, Barlad Dert's black robes collapsed on the floor, dark Slavic fantasy oil painting, Bilibin × Frazetta × Vasnetsov, muted earth tones, burnt sienna, deep forest green, oxblood red, gold leaf accents, candlelit gothic atmosphere, textured brushwork, no text, no UI, no borders, no watermark --cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png --style raw --ar 3:2 --stylize 250 --v 6",
        'remake':   [1220],
        'original': [617],
    },
]

# ─── Step 1: Download and convert images ─────────────────────────────────────
try:
    from PIL import Image
    PIL_OK = True
except ImportError:
    PIL_OK = False
    print("  Pillow not installed — installing...")
    os.system(f'"{sys.executable}" -m pip install Pillow -q')
    from PIL import Image
    PIL_OK = True

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
    'Referer': 'https://www.midjourney.com/',
}

base64_data = {}

print("\n" + "="*60)
print("STEP 1: Downloading and converting images")
print("="*60)

for art in ARTS:
    art_id  = art['id']
    url     = art['url']
    png_dst = os.path.join(ORIGINALS, f"{art_id}.png")
    jpg_dst = os.path.join(WEB, f"{art_id}.jpg")

    # Download PNG
    if os.path.exists(png_dst):
        print(f"  SKIP (exists): {art_id}.png")
    else:
        print(f"  Downloading: {art_id} ...", end=' ', flush=True)
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            with open(png_dst, 'wb') as f:
                f.write(data)
            print(f"OK ({len(data)//1024}KB)")
        except Exception as e:
            print(f"FAILED: {e}")
            continue

    # Convert to 900px JPEG
    print(f"  Converting: {art_id}.jpg ...", end=' ', flush=True)
    try:
        img = Image.open(png_dst).convert('RGB')
        w, h = img.size
        if w > 900:
            new_h = int(h * 900 / w)
            img = img.resize((900, new_h), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, 'JPEG', quality=82, optimize=True)
        jpg_bytes = buf.getvalue()
        with open(jpg_dst, 'wb') as f:
            f.write(jpg_bytes)
        b64 = base64.b64encode(jpg_bytes).decode('ascii')
        base64_data[art_id] = b64
        print(f"OK ({len(jpg_bytes)//1024}KB, b64={len(b64)//1024}KB)")
    except Exception as e:
        print(f"FAILED: {e}")

# ─── Step 2: Update mj_art.js ────────────────────────────────────────────────
print("\n" + "="*60)
print("STEP 2: Updating mj_art.js")
print("="*60)

if not base64_data:
    print("ERROR: No images converted, aborting mj_art.js update.")
    sys.exit(1)

with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Backup
bak = JS_PATH + '.batch4.bak'
if not os.path.exists(bak):
    shutil.copy2(JS_PATH, bak)
    print(f"  Backup: {os.path.basename(bak)}")

# 2a. Fix art09_sleeping_princess: remove 1220 from remakeParagraphs
old_art09 = "    remakeParagraphs: [1072, 1220],"
new_art09 = "    remakeParagraphs: [1072],"
if old_art09 in js:
    js = js.replace(old_art09, new_art09, 1)
    print("  Fixed art09 remakeParagraphs: [1072, 1220] → [1072]")
else:
    print("  WARN: art09 remakeParagraphs pattern not found")

# 2b. Insert 7 MJ_META entries before closing `};` of MJ_META
META_ANCHOR = "    originalParagraphs: [6]\n  },\n};"
if META_ANCHOR not in js:
    # Try with Windows line endings
    META_ANCHOR = "    originalParagraphs: [6]\r\n  },\r\n};"

new_meta_entries = ""
for art in ARTS:
    remake_str = '[' + ', '.join(str(p) for p in art['remake']) + ']'
    original_str = '[' + ', '.join(str(p) for p in art['original']) + ']'
    safe_prompt = art['prompt'].replace("'", "\\'")
    new_meta_entries += f"""  '{art['id']}': {{
    scene: '{art['scene']}',
    prompt: '{safe_prompt}',
    refUrl: '{art['url']}',
    remakeParagraphs: {remake_str},
    originalParagraphs: {original_str}
  }},\n"""

if META_ANCHOR in js:
    js = js.replace(META_ANCHOR,
        "    originalParagraphs: [6]\n  },\n" + new_meta_entries + "};")
    print(f"  Inserted {len(ARTS)} MJ_META entries")
else:
    print("  WARN: MJ_META anchor not found — check file encoding/line endings")

# 2c. Update MJ_MAP
# Fix "1220": art09 → art52
js = re.sub(r'"1220":\s*"art09_sleeping_princess"',
            '"1220": "art52_princess_rescue"', js)
print('  Fixed MJ_MAP "1220": art09 → art52')

# New MJ_MAP entries
new_map = {
    '421':  'art46_giant_snake',
    '436':  'art40_giant_spider_web',
    '448':  'art40_giant_spider_web',
    '528':  'art46_giant_snake',
    '656':  'art41_green_knight_mounted',
    '733':  'art42_crypt_skeletons',
    '811':  'art42_crypt_skeletons',
    '823':  'art51_barlad_dert_boss',
    '1003': 'art47_stone_rats',
    '1096': 'art51_barlad_dert_boss',
    '1108': 'art42_crypt_skeletons',
    '1110': 'art47_stone_rats',
    '1164': 'art51_barlad_dert_boss',
}
map_insert = ''.join(f'  "{k}": "{v}",\n' for k, v in new_map.items())

MAP_CLOSE = '  "247": "art37_lumberjacks"\n};'
if MAP_CLOSE in js:
    js = js.replace(MAP_CLOSE,
        '  "247": "art37_lumberjacks",\n' + map_insert + '};')
    print(f"  Inserted {len(new_map)} MJ_MAP entries")
else:
    print("  WARN: MJ_MAP close anchor not found")

# 2d. Insert MJ_DATA base64 entries before closing `};`
# The MJ_DATA section ends with:  /9k=',\n};\n
DATA_CLOSE_PATTERN = r"(/9k='[^}]*\n\};\n)"

def make_data_entries(arts_list, b64_dict):
    out = ""
    for art in arts_list:
        aid = art['id']
        if aid not in b64_dict:
            print(f"  WARN: no base64 for {aid}, skipping DATA entry")
            continue
        b64 = b64_dict[aid]
        scene_short = art['scene'][:60]
        prompt_short = art['prompt'][:80] + '...'
        url = art['url']
        out += (
            f"  // {aid} — {scene_short}\n"
            f"  //   Prompt: {prompt_short}\n"
            f"  //   Ref:    {url}\n"
            f"  '{aid}': '{b64}',\n"
        )
    return out

data_entries = make_data_entries(ARTS, base64_data)

# Find last art entry end: ends with "',\n};\n"
# We look for the pattern ending with /9k=',
m = re.search(r"(/9k='[,]?\n)\};\n\n// Attach", js)
if m:
    insert_pos = m.end(1)
    js = js[:insert_pos] + data_entries + "};\n\n// Attach" + js[m.end():]
    print(f"  Inserted {len(base64_data)} MJ_DATA base64 entries")
else:
    print("  WARN: MJ_DATA close anchor not found, appending before last '};'")
    last_close = js.rfind("};")
    if last_close > 0:
        js = js[:last_close] + data_entries + "};\n"
        print("  Inserted MJ_DATA entries (fallback)")

# 2e. Update header comment: 36 → 43 arts
js = re.sub(r'(\d+) AI illustrations', '43 AI illustrations', js)
print("  Updated header comment: 36 → 43 arts")

# Write updated file
with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

new_size = os.path.getsize(JS_PATH)
print(f"\n  mj_art.js updated: {new_size/1024/1024:.2f} MB")

# ─── Step 3: Verification ─────────────────────────────────────────────────────
print("\n" + "="*60)
print("STEP 3: Verification")
print("="*60)

with open(JS_PATH, 'r', encoding='utf-8') as f:
    final = f.read()

for art in ARTS:
    aid = art['id']
    meta_ok = f"'{aid}'" in final and 'remakeParagraphs' in final
    data_ok = f"  '{aid}': '" in final
    print(f"  {aid}: META={'✓' if meta_ok else '✗'}  DATA={'✓' if data_ok else '✗'}")

map_checks = ['421', '436', '656', '733', '823', '1003', '1108', '1220']
print("\n  MJ_MAP paragraph coverage:")
for p in map_checks:
    ok = f'"{p}"' in final
    print(f"    §{p}: {'✓' if ok else '✗'}")

art09_fixed = '[1072, 1220]' not in final
print(f"\n  art09 fix (no 1220 in remake): {'✓' if art09_fixed else '✗'}")

print("\n✓ Done! Run build.sh to rebuild the game HTML.")
