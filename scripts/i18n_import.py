#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""i18n_import.py — validate translated @@-marker chunks and merge them into locale.<lang>.js (group_72).

Default run is VALIDATE-ONLY (prints a summary, writes _VALIDATION_REPORT.md and a
RU/target sample file for literary review). Add --write to merge passing units into
src/locale.<lang>.js (merge-based: existing sections such as a hand-translated ui
layer are preserved).

Usage:
    python -X utf8 scripts/i18n_import.py --lang en [--write]
        [--src _handoff/translate_2026_07/src_p] [--in _handoff/translate_2026_07/out_en]

Import policy: units failing coverage/number-integrity/Cyrillic-leak/empty checks are
SKIPPED (RU fallback keeps the game playable) and listed for re-issue; glossary and
paragraph-shape issues are warnings only (imported, listed for polish).
"""
import argparse, io, json, os, re, sys, glob
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UNIT_RE = re.compile(r'^@@(p\d+\.(?:t|c\d+))\s*$')
CTRL_RE = re.compile(r'^@@(CHUNK|ENDCHUNK)\b')
SAMPLE_UIDS = ['p1.t', 'p14.t', 'p203.t', 'p540.t', 'p688.t', 'p884.c2', 'p1203.t', 'p1220.t', 'p91.c0', 'p372.t']
GLOSS_BY_LANG = {
    'en': [('УДАЧ', 'LUCK'), ('МАСТЕРСТВ', 'SKILL'), ('ВЫНОСЛИВОСТ', 'STAMINA')],
    'fr': [('УДАЧ', 'CHANCE'), ('МАСТЕРСТВ', 'HABILET'), ('ВЫНОСЛИВОСТ', 'ENDURANCE')],
    'uk': [('УДАЧ', 'УДАЧ'), ('МАСТЕРСТВ', 'МАЙСТЕРН'), ('ВЫНОСЛИВОСТ', 'ВИТРИВАЛ')],
}

def parse_dir(d):
    units, order = {}, []
    for fp in sorted(glob.glob(os.path.join(d, 'chunk_*.txt'))):
        raw = io.open(fp, encoding='utf-8-sig', newline='').read().replace('\r\n', '\n')
        lines = [ln for ln in raw.split('\n') if ln.strip() != '```']
        cur, buf = None, []
        def flush():
            if cur is None: return
            txt = '\n'.join(buf)
            txt = re.sub(r'^\n+', '', re.sub(r'\n+$', '', txt))
            if cur in units: units[cur + '#DUP'] = txt
            else: units[cur] = txt; order.append(cur)
        for ln in lines:
            m = UNIT_RE.match(ln.strip())
            if m:
                flush(); cur = m.group(1); buf = []
            elif CTRL_RE.match(ln.strip()):
                flush(); cur = None; buf = []
            elif cur is not None:
                buf.append(ln)
        flush()
    return units, order

def nums(s): return Counter(re.findall(r'\d+', s))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lang', required=True)
    ap.add_argument('--src', default=os.path.join('_handoff', 'translate_2026_07', 'src_p'))
    ap.add_argument('--in', dest='indir', default=None)
    ap.add_argument('--write', action='store_true')
    a = ap.parse_args()
    lang = a.lang.lower()
    indir = a.indir or os.path.join('_handoff', 'translate_2026_07', 'out_' + lang)
    srcdir = a.src if os.path.isabs(a.src) else os.path.join(ROOT, a.src)
    indir = indir if os.path.isabs(indir) else os.path.join(ROOT, indir)
    ru, ru_order = parse_dir(srcdir)
    tr, _ = parse_dir(indir)
    dups = [k for k in tr if k.endswith('#DUP')]
    missing = [u for u in ru_order if u not in tr]
    extra = [u for u in tr if u not in ru and not u.endswith('#DUP')]
    bad_nums, cyr, empty, gloss_w, shape_w = [], [], [], [], []
    for u in ru_order:
        if u not in tr: continue
        s, t = ru[u], tr[u]
        if not t.strip(): empty.append(u); continue
        if re.search(r'[\u0400-\u04FF]', t) and lang not in ('uk', 'ru'): cyr.append(u)
        if nums(s) != nums(t): bad_nums.append(u)
        for rk, tk in GLOSS_BY_LANG.get(lang, []):
            if rk in s.upper() and tk not in t.upper(): gloss_w.append('%s (%s)' % (u, tk))
        if u.endswith('.t') and abs(s.count('\n\n') - t.count('\n\n')) > 1: shape_w.append(u)
    hard_fail = set(missing) | set(bad_nums) | set(cyr) | set(empty)
    ok = [u for u in ru_order if u in tr and u not in hard_fail]
    # ---- report ----
    rep = ['# Validation report — out_%s' % lang, '',
           'source units: %d · received: %d · importable: %d' % (len(ru_order), len([u for u in ru_order if u in tr]), len(ok)),
           'missing: %d · number-integrity fails: %d · cyrillic leaks: %d · empty: %d · dup markers: %d' % (len(missing), len(bad_nums), len(cyr), len(empty), len(dups)),
           'glossary warnings: %d · paragraph-shape warnings: %d' % (len(gloss_w), len(shape_w)), '']
    for tag, lst in (('MISSING', missing), ('NUMBER-INTEGRITY', bad_nums), ('CYRILLIC', cyr), ('EMPTY', empty), ('DUP', dups), ('GLOSSARY-WARN', gloss_w), ('SHAPE-WARN', shape_w)):
        if lst: rep += ['## %s (%d)' % (tag, len(lst))] + ['- ' + x for x in lst[:200]] + ['']
    io.open(os.path.join(indir, '_VALIDATION_REPORT.md'), 'w', encoding='utf-8', newline='').write('\n'.join(rep))
    # ---- sample for literary review ----
    smp = []
    for u in SAMPLE_UIDS:
        if u in ru and u in tr:
            smp += ['===== %s =====' % u, '--- RU ---', ru[u], '--- %s ---' % lang.upper(), tr[u], '']
    io.open(os.path.join(indir, '_SAMPLE_REVIEW.txt'), 'w', encoding='utf-8', newline='').write('\n'.join(smp))
    print('units: src=%d received=%d importable=%d | missing=%d badnums=%d cyr=%d empty=%d dup=%d | glossW=%d shapeW=%d'
          % (len(ru_order), len([u for u in ru_order if u in tr]), len(ok), len(missing), len(bad_nums), len(cyr), len(empty), len(dups), len(gloss_w), len(shape_w)))
    if not a.write:
        print('VALIDATE-ONLY (no --write). Report + sample written to %s' % indir); return
    # ---- merge into locale ----
    lp = os.path.join(ROOT, 'src', 'locale.%s.js' % lang)
    lsrc = io.open(lp, encoding='utf-8', newline='').read()
    m = re.search(r'const\s+LOCALE_[A-Z]+\s*=\s*(\{[\s\S]*\})\s*;', lsrc)
    L = json.loads(m.group(1))
    ru_loc = json.loads(re.search(r'const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$',
             io.open(os.path.join(ROOT, 'src', 'locale.ru.js'), encoding='utf-8').read()).group(1))
    L.setdefault('p', {})
    touched = set()
    for u in ok:
        pm = re.match(r'p(\d+)\.(t|c(\d+))', u)
        n = pm.group(1)
        ent = L['p'].setdefault(n, {})
        if pm.group(2) == 't': ent['t'] = tr[u]
        else:
            ln = len(ru_loc['p'][n].get('c', []))
            c = ent.get('c')
            if not isinstance(c, list) or len(c) != ln: c = [None] * ln; ent['c'] = c
            c[int(pm.group(3))] = tr[u]
        touched.add(n)
    var = re.search(r'const\s+(LOCALE_[A-Z]+)', lsrc).group(1)
    head = ('// %s \u2014 generated/merged by scripts/i18n_import.py (group_72). Do not hand-edit the const line;\n'
            '// missing keys are SAFE (resolvers fall back to RU). Shape mirrors LOCALE_RU.\n') % var
    out = head + 'const %s = %s;\n' % (var, json.dumps(L, ensure_ascii=False, separators=(',', ':')))
    io.open(lp, 'w', encoding='utf-8', newline='').write(out)
    full = sum(1 for n in touched if L['p'][n].get('t') and all(x for x in L['p'][n].get('c', [])))
    print('MERGED: %d units into %d paragraphs (%d fully complete) -> %s (%.1f KB)'
          % (len(ok), len(touched), full, lp, len(out.encode('utf-8')) / 1024.0))

if __name__ == '__main__':
    main()
