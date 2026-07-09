#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""i18n_riddle_hash.py — riddle-answer hashing tool (group_72 riddle i18n).

The engine stores per-locale riddle answers ONLY as djb2 hashes of normalised
words, so the historical no-plaintext-answers property holds for every
language. This tool mirrors the engine normalisation EXACTLY:
    NFD -> strip combining marks (U+0300..U+036F) -> uppercase -> keep cased letters only
and djb2: h=5381; h=(h*33+codepoint) & 0xFFFFFFFF.

Modes:
  --sum WORD            RU letter-ordinal sum (canon verification)
  --hash WORD           print normalised form + hash
  --gen ANSWERS.json    read {lang:{pid:[words]}}, verify RU words against GD
                        riddle configs (sum+modifier == the single valid target),
                        emit _handoff/translate_2026_07/payload_riddles_<lang>.json
Answer word lists live OUTSIDE the repo history (_handoff, git-ignored).
"""
import argparse, io, json, os, re, sys, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHABET_RU = '*АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'

def riddle_norm(s):
    folded = ''.join(c for c in unicodedata.normalize('NFD', str(s)) if not ('\u0300' <= c <= '\u036f'))
    return ''.join(ch for ch in folded.upper() if ch.lower() != ch.upper())

def riddle_hash(s):
    h = 5381
    for ch in riddle_norm(s):
        h = (h * 33 + ord(ch)) & 0xFFFFFFFF
    return h

def ru_sum(word):
    s = 0
    for ch in word.upper():
        v = ALPHABET_RU.find(ch)
        if v > 0: s += v
    return s

def load_gd():
    src = io.open(os.path.join(ROOT, 'src', 'game_structure.js'), encoding='utf-8').read()
    return json.loads(re.search(r'const\s+GD\s*=\s*(\{[\s\S]*\})\s*;?\s*$', src).group(1))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sum'); ap.add_argument('--hash', dest='hsh'); ap.add_argument('--gen')
    a = ap.parse_args()
    if a.sum: print('%s -> RU sum %d' % (riddle_norm(a.sum), ru_sum(a.sum))); return
    if a.hsh: print('%s -> hash %d' % (riddle_norm(a.hsh), riddle_hash(a.hsh))); return
    if not a.gen: sys.exit('need --sum/--hash/--gen')
    ans = json.load(io.open(a.gen if os.path.isabs(a.gen) else os.path.join(ROOT, a.gen), encoding='utf-8'))
    GD = load_gd()
    # canon verification: RU words must satisfy sum+modifier == the single valid target
    fails = []
    for pid, words in ans.get('ru', {}).items():
        r = GD[pid]['riddle']
        assert len(r['valid_targets']) == 1, 'multi-target riddle %s' % pid
        tgt = r['valid_targets'][0]
        for w in words:
            got = ru_sum(w) + r['modifier']
            if got != tgt: fails.append('ru %s %s: sum+mod=%d != %d' % (pid, w, got, tgt))
    if fails:
        print('CANON VERIFICATION FAILED:'); [print('  -', f) for f in fails]; sys.exit(1)
    print('canon verification OK: all RU answers land on their valid targets')
    outdir = os.path.join(ROOT, '_handoff', 'translate_2026_07')
    for lang, table in ans.items():
        if lang == 'ru': continue  # RU uses the native letter-sum path
        payload = {'riddles': {}}
        for pid, words in table.items():
            tgt = GD[pid]['riddle']['valid_targets'][0]
            seen = set(); entries = []
            for w in words:
                h = riddle_hash(w)
                if h in seen: continue
                seen.add(h); entries.append({'h': h, 'target': tgt})
            payload['riddles'][pid] = entries
        p = os.path.join(outdir, 'payload_riddles_%s.json' % lang)
        io.open(p, 'w', encoding='utf-8', newline='').write(json.dumps(payload, ensure_ascii=False))
        print('%s: %d riddles, %d entries -> %s' % (lang, len(payload['riddles']),
              sum(len(v) for v in payload['riddles'].values()), os.path.basename(p)))

if __name__ == '__main__':
    main()
