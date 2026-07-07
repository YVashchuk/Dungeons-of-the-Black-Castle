#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""i18n_export.py — export RU translation units into @@-marker chunk files (group_72).

Emits the paragraph prose + choice labels of LOCALE_RU as numbered chunks for
external translators (ChatGPT / Gemini). Units are never split across chunks;
markers are machine-parseable so the returned translations can be validated
and spliced into locale.<lang>.js automatically.

Usage:
    python -X utf8 scripts/i18n_export.py [--chunk-chars 8000] [--out _handoff/translate_2026_07/src_p]

Format of a chunk file:
    @@CHUNK 007/110
    @@p61.t
    <paragraph prose (may contain \\n\\n blank lines)>
    @@p61.c0
    <choice label>
    ...
    @@ENDCHUNK 007 units=38 first=p61.t last=p73.c1
"""
import argparse, io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_locale():
    src = io.open(os.path.join(ROOT, 'src', 'locale.ru.js'), encoding='utf-8').read()
    m = re.search(r'const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$', src)
    return json.loads(m.group(1))

def build_units(L):
    units = []
    for n in sorted(L['p'], key=int):
        e = L['p'][n]
        t = e.get('t', '')
        if t: units.append(('p%s.t' % n, t))
        for i, c in enumerate(e.get('c', [])):
            units.append(('p%s.c%d' % (n, i), c))
    return units

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--chunk-chars', type=int, default=8000)
    ap.add_argument('--out', default=os.path.join('_handoff', 'translate_2026_07', 'src_p'))
    a = ap.parse_args()
    outdir = os.path.join(ROOT, a.out) if not os.path.isabs(a.out) else a.out
    os.makedirs(outdir, exist_ok=True)
    units = build_units(load_locale())
    # pack into chunks (unit never split)
    packs, cur, size = [], [], 0
    for uid, txt in units:
        u = len(txt) + len(uid) + 6
        if cur and size + u > a.chunk_chars:
            packs.append(cur); cur = []; size = 0
        cur.append((uid, txt)); size += u
    if cur: packs.append(cur)
    total = len(packs)
    index = []
    for i, pack in enumerate(packs, 1):
        body = []
        for uid, txt in pack:
            body.append('@@' + uid)
            body.append(txt)
        head = '@@CHUNK %03d/%03d' % (i, total)
        foot = '@@ENDCHUNK %03d units=%d first=%s last=%s' % (i, len(pack), pack[0][0], pack[-1][0])
        content = head + '\n' + '\n'.join(body) + '\n' + foot + '\n'
        name = 'chunk_%03d.txt' % i
        io.open(os.path.join(outdir, name), 'w', encoding='utf-8', newline='').write(content)
        index.append('| %s | %d | %s | %s | %d |' % (name, len(pack), pack[0][0], pack[-1][0], len(content)))
    idx = ('# Source chunks (RU) — paragraph prose + choice labels\n'
           'Total units: %d · chunks: %d · chunk target: %d chars\n\n'
           '| file | units | first | last | chars |\n|---|---|---|---|---|\n%s\n') % (
           len(units), total, a.chunk_chars, '\n'.join(index))
    io.open(os.path.join(outdir, 'INDEX.md'), 'w', encoding='utf-8', newline='').write(idx)
    print('exported %d units into %d chunks -> %s' % (len(units), total, outdir))

if __name__ == '__main__':
    main()
