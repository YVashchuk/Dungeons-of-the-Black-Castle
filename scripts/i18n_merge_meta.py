#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""i18n_merge_meta.py — merge a translated meta-layer payload (JSON) into locale.<lang>.js (group_72).

Payload shape: {"ui":{...},"enemies":{...},"map":{...},"spells":{id:{name,full}},"allies":{id:{name,verb}},
optionally "preface":"...","pregame":"..."}. Validation before write:
  - every key must exist in LOCALE_RU (no unknown keys);
  - markup keys must carry the exact same <tag> sequence as RU;
  - per-key parentheses/§/[ ] counts must match RU (composed fragments!);
  - leading/trailing spaces of RU values are preserved (concatenation safety).

Usage: python -X utf8 scripts/i18n_merge_meta.py --lang en --payload _handoff/translate_2026_07/meta_en.json [--write]
"""
import argparse, io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_locale(path, var_re=r'const\s+(LOCALE_[A-Z]+)\s*=\s*(\{[\s\S]*\})\s*;'):
    src = io.open(path, encoding='utf-8', newline='').read()
    m = re.search(var_re, src)
    return m.group(1), json.loads(m.group(2))

def tags(s): return re.findall(r'<[^>]+>', s)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lang', required=True)
    ap.add_argument('--payload', required=True)
    ap.add_argument('--write', action='store_true')
    a = ap.parse_args()
    lang = a.lang.lower()
    _, RU = load_locale(os.path.join(ROOT, 'src', 'locale.ru.js'))
    lp = os.path.join(ROOT, 'src', 'locale.%s.js' % lang)
    var, L = load_locale(lp)
    pay = json.load(io.open(a.payload if os.path.isabs(a.payload) else os.path.join(ROOT, a.payload), encoding='utf-8'))
    errs, warns = [], []
    def check_str(sec, k, ru_v, tr_v):
        if not isinstance(tr_v, str) or not tr_v: errs.append('%s.%s: empty/non-string' % (sec, k)); return
        if tags(ru_v) != tags(tr_v): errs.append('%s.%s: HTML tag sequence differs' % (sec, k))
        for ch in '()[]§':
            if ru_v.count(ch) != tr_v.count(ch): errs.append('%s.%s: %r count %d != %d' % (sec, k, ch, ru_v.count(ch), tr_v.count(ch)))
        if ru_v.startswith(' ') != tr_v.startswith(' '): errs.append('%s.%s: leading-space mismatch' % (sec, k))
        if ru_v.endswith(' ') != tr_v.endswith(' '): errs.append('%s.%s: trailing-space mismatch' % (sec, k))
        if re.search(r'[\u0400-\u04FF]', tr_v) and lang not in ('uk', 'ru'):
            wl = 'CYRILLIC in %s.%s' % (sec, k)
            (errs if sec != 'ui' or k != 'vash_otvet_im_padezh_ed_ch' else warns).append(wl)
    for sec in ('ui', 'enemies', 'map'):
        for k, v in pay.get(sec, {}).items():
            if k not in RU[sec]: errs.append('%s.%s: unknown key' % (sec, k)); continue
            check_str(sec, k, RU[sec][k], v)
    for sec, fields in (('spells', ('name', 'full')), ('allies', ('name', 'verb'))):
        for k, v in pay.get(sec, {}).items():
            if k not in RU[sec]: errs.append('%s.%s: unknown id' % (sec, k)); continue
            for f in fields:
                if f in v: check_str(sec, k + '.' + f, RU[sec][k].get(f, ''), v[f])
    for k in ('preface', 'pregame'):
        if k in pay: check_str('root', k, RU.get(k, ''), pay[k])
    for k, v in pay.get('riddles', {}).items():
        if not re.match(r'^\d+$', k): errs.append('riddles.%s: pid not numeric' % k)
        if not isinstance(v, list) or not v: errs.append('riddles.%s: empty' % k); continue
        for e in v:
            if not (isinstance(e, dict) and isinstance(e.get('h'), int) and isinstance(e.get('target'), int)):
                errs.append('riddles.%s: bad entry' % k)
    if errs:
        print('VALIDATION FAILED (%d):' % len(errs)); [print('  -', e) for e in errs[:60]]; sys.exit(1)
    for w in warns: print('  warn:', w)
    cov = []
    for sec in ('ui', 'enemies', 'map', 'spells', 'allies'):
        cov.append('%s %d/%d' % (sec, len(pay.get(sec, {})), len(RU[sec])))
    cov.append('riddles %d' % len(pay.get('riddles', {})))
    cov.append('preface %s' % ('yes' if 'preface' in pay else 'no'))
    cov.append('pregame %s' % ('yes' if 'pregame' in pay else 'no'))
    print('validation OK · coverage: ' + ' · '.join(cov))
    if not a.write: print('VALIDATE-ONLY (no --write).'); return
    for sec in ('ui', 'enemies', 'map'):
        L.setdefault(sec, {}).update(pay.get(sec, {}))
    for sec in ('spells', 'allies'):
        for k, v in pay.get(sec, {}).items():
            L.setdefault(sec, {}).setdefault(k, {}).update(v)
    for k in ('preface', 'pregame'):
        if k in pay: L[k] = pay[k]
    for k, v in pay.get('riddles', {}).items():
        L.setdefault('riddles', {})[k] = v
    head = ('// %s \u2014 generated/merged by scripts/i18n_import.py + i18n_merge_meta.py (group_72).\n'
            '// Do not hand-edit the const line; missing keys are SAFE (resolvers fall back to RU).\n') % var
    out = head + 'const %s = %s;\n' % (var, json.dumps(L, ensure_ascii=False, separators=(',', ':')))
    io.open(lp, 'w', encoding='utf-8', newline='').write(out)
    print('MERGED -> %s (%.1f KB)' % (lp, len(out.encode('utf-8')) / 1024.0))

if __name__ == '__main__':
    main()
