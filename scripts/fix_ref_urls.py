import re
import os

# group_85 AS-21: resolve relative to this script instead of a personal checkout path
file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'art-pack', 'metadata', 'art_catalog.py')

with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

urls = {
    'art40_giant_spider_web':     'https://cdn.midjourney.com/7f611350-e63a-4206-91f4-79278a724bdd/0_0.png',
    'art41_green_knight_mounted': 'https://cdn.midjourney.com/5262d54e-b9f6-4da0-97e8-70cb7c9899a6/0_0.png',
    'art42_crypt_skeletons':      'https://cdn.midjourney.com/df9aed0f-a9a5-4aad-88b8-f109c17a6422/0_0.png',
    'art46_giant_snake':          'https://cdn.midjourney.com/b7217d53-ce7b-4e17-80db-c9465ed9531a/0_0.png',
    'art47_stone_rats':           'https://cdn.midjourney.com/08722381-b984-41fc-b55d-3e383ea15830/0_0.png',
}

for art_id, url in urls.items():
    pattern = r"('" + art_id + r"'.*?'ref_url':\s*)None"
    replacement = r"\g<1>'" + url + r"'"
    new_c = re.sub(pattern, replacement, c, flags=re.DOTALL)
    if new_c != c:
        print(f'Fixed: {art_id}')
        c = new_c
    else:
        print(f'NOT FOUND: {art_id}')

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
