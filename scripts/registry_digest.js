#!/usr/bin/env node
// registry_digest.js - one-line-per-item digest of assets/text_corrections.json for external reviewers whose context
// cannot hold the full registry (817 KB). Usage: node scripts/registry_digest.js [out.md]  (default: stdout)
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'text_corrections.json'), 'utf8'));
const cut = (s, n) => { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const paras = s => { const set = new Set(); for (const m of String(s).matchAll(/(?:sec\.?\s?|§\s?|section\s|par\.?\s?|paragraph\s)(\d{1,4})/gi)) { const n = +m[1]; if (n >= 1 && n <= 1221) set.add(n); } return [...set].sort((a, b) => a - b).slice(0, 14); };
const vh = Object.keys(REG.version_history || {}); const last = vh[vh.length - 1] || '?';
const out = ['# REGISTRY_DIGEST — assets/text_corrections.json', '', '- Generated ' + new Date().toISOString().slice(0, 10) + ' from the registry at `' + last + '` (last_updated ' + REG.last_updated + ').', '- One line per adjudicated item: `[STATUS] id (severity) §paragraphs — claim → resolution`. Statuses: OPEN, DONE, REJECTED, VERIFIED_RESOLVED (a stale claim re-checked and found already fixed). Full texts live in the registry itself.', ''];
let n = 0, m = 0;
function emitItem(it) { n++; const p = paras([it.id, it.hypothesis, it.resolution, it.note].join(' ')); out.push('- [' + it.status + '] ' + it.id + ' (' + (it.severity || '-') + ')' + (p.length ? ' §' + p.join(',') : '') + ' — ' + cut(it.hypothesis || it.detail || '', 210) + ' → ' + cut(it.resolution || it.note || it.author_decision || '', 230)); }
for (const key of ['corrections', 'external_corrections', 'removed_pending']) {
  const v = REG[key]; if (!v) continue;
  const entries = Array.isArray(v) ? v : Object.entries(v).map(([k, x]) => (x && typeof x === 'object' ? Object.assign({ _key: k }, x) : { _key: k, value: x }));
  if (!entries.length) continue;
  out.push('## ' + key + ' (' + entries.length + ' entries; canon-level text and data corrections applied on top of the fb2 source)');
  for (const e of entries) { if (e && typeof e.id === 'string' && typeof e.status === 'string') { emitItem(e); continue; } const s = JSON.stringify(e); const p = paras(s); out.push('- ' + (e._key ? e._key + ': ' : '') + (p.length ? '§' + p.join(',') + ' ' : '') + cut(s.replace(/^\{"_key":"[^"]*",?/, '{'), 230)); }
  out.push('');
}
const pc = REG.pending_corrections || {};
for (const g of Object.keys(pc)) { const grp = pc[g]; if (!grp || typeof grp !== 'object' || !Array.isArray(grp.items) || !grp.items.length) continue; out.push('## ' + g + ' — ' + cut(grp.comment || '', 260)); grp.items.forEach(it => { if (it && typeof it.id === 'string' && typeof it.status === 'string') emitItem(it); else { m++; const js = JSON.stringify(it); const pp = paras(js); out.push('- [legacy] ' + (pp.length ? '§' + pp.join(',') + ' ' : '') + cut(js, 240)); } }); out.push(''); }
const rno = REG.resolved_no_op; if (rno) { const arr = Array.isArray(rno) ? rno : (Array.isArray(rno.items) ? rno.items : Object.values(rno)); const items = arr.filter(x => x && typeof x === 'object'); if (items.length) { out.push('## resolved_no_op (' + items.length + ')'); items.forEach(x => (typeof x.id === 'string' && typeof x.status === 'string') ? emitItem(x) : out.push('- ' + cut(JSON.stringify(x), 230))); out.push(''); } }
out.push('END OF DIGEST — ' + n + ' items with id and status + ' + m + ' legacy entries, registry ' + last);
const text = out.join('\n') + '\n';
if (process.argv[2]) { fs.writeFileSync(process.argv[2], text, 'utf8'); console.log('written ' + process.argv[2] + ' (' + Math.round(text.length / 1024) + ' KB, ' + n + ' items)'); } else process.stdout.write(text);
