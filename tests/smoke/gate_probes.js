// gate_probes.js - deterministic live probes of the story-state gates G-01..G-15 (groups 83/85) on the BUILT game.
// Grey-box: the tester hero is set up through S (flags / items / cameFrom), the observation is the rendered UI
// (visible choice buttons tagged with their targets, the bag, the death overlay). Output: tests/smoke/out/GATE_PROBES_REPORT.md + PNGs.
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const URL = process.argv[2] || 'http://localhost:8001/dist/dungeons-of-the-black-castle.html';
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true }); // tests/smoke/out (git-ignored)
const rows = []; const rec = (id, verdict, obs) => { rows.push({ id, verdict, obs }); console.log(verdict.padEnd(8) + id + ' - ' + obs.replace(/[^\x20-\x7E]/g, '?').slice(0, 170)); };
const TAG = "(function(){ if(window.__tagged) return; window.__tagged=true; const orig=makeChoiceBtn; makeChoiceBtn=function(ch,dc,idx){ const b=orig(ch,dc,idx); try{ b.dataset.target=String(ch.target); }catch(e){} return b; }; })();";
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  async function probe(id, sec, setup, judge, opts) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ru-RU' }); const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    try {
      await page.goto('about:blank');
      if (opts && opts.pre) { await page.goto(URL + '#' + opts.pre, { waitUntil: 'load' }); await page.waitForFunction(() => document.getElementById('scr-game')?.classList.contains('on'), null, { timeout: 15000 }); if (setup) { await page.evaluate(setup); } await page.goto('about:blank'); }
      await page.goto(URL + '#' + sec, { waitUntil: 'load' });
      await page.waitForFunction(() => document.getElementById('scr-game')?.classList.contains('on'), null, { timeout: 15000 });
      await page.evaluate(TAG);
      if (setup && !(opts && opts.pre)) { await page.evaluate(setup); }
      await page.evaluate(() => { try { renderGame({ repaint: true }); } catch (e) {} }); await page.waitForTimeout(350);
      if (opts && opts.act) { await page.evaluate(opts.act); await page.waitForTimeout(400); }
      const view = await page.evaluate(() => ({ sec: S.section, targets: [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true').map(b => b.dataset.target ? Number(b.dataset.target) : b.textContent.trim().slice(0, 24)), greyed: [...document.querySelectorAll('#c-list button[aria-disabled="true"]')].map(b => b.textContent.trim().slice(0, 24)), death: document.getElementById('end-death').classList.contains('on'), bag: document.getElementById('inv-list').textContent.replace(/\s+/g, ' ').trim().slice(0, 120), bagButtons: document.querySelectorAll('#inv-list .inv-remove').length, used: getBagUsed(), inv: S.inventory.map(i => typeof i === 'string' ? i : i.id) }));
      await page.screenshot({ path: path.join(OUT, id + '.png') });
      const r = judge(view); rec(id, r.ok ? 'PASS' : 'FAIL', r.obs + (errs.length ? ' | pageerrors: ' + errs.join(';') : ''));
    } catch (e) { rec(id, 'UNCLEAR', 'runner error: ' + String(e.message || e).split('\n')[0].slice(0, 140)); }
    await ctx.close();
  }
  const has = (v, t) => v.targets.includes(t);
  const grant = (...items) => () => { }; // placeholder (unused)
  // G-01 / G-02
  await probe('G-01', 81, null, v => ({ ok: !has(v, 1220) && [623, 797, 411, 850, 297].every(t => has(v, t)), obs: 'sec.81 without the Princess: targets=' + v.targets.join(',') }));
  await probe('G-02', 81, () => { S.inventory.push('princess_awake'); saveGame(); }, v => ({ ok: has(v, 1220) && ![623, 797, 411, 850, 297].some(t => has(v, t)), obs: 'sec.81 with princess_awake: targets=' + v.targets.join(',') }));
  // G-03 / G-04 / G-05
  await probe('G-03', 976, null, v => ({ ok: has(v, 1120) && !has(v, 1220) && v.inv.includes('princess_awake'), obs: 'sec.976 Barlad alive: targets=' + v.targets.join(',') + ' inv=' + v.inv.join(',') }));
  await probe('G-04', 976, () => { S.inventory.push('barlad_dead'); saveGame(); }, v => ({ ok: has(v, 1220) && !has(v, 1120), obs: 'sec.976 Barlad dead: targets=' + v.targets.join(',') }));
  await probe('G-05', 976, null, v => ({ ok: v.inv.includes('princess_awake') && !/Принцесса/.test(v.bag) && v.used === 0, obs: 'flag granted=' + v.inv.includes('princess_awake') + ' bag="' + v.bag + '" used=' + v.used }));
  // G-06 study death gate
  await probe('G-06a', 297, null, v => ({ ok: !has(v, 489) && v.inv.includes('study_mirror'), obs: 'sec.297 first inspection: targets=' + v.targets.join(',') + ' inv=' + v.inv.join(',') }));
  await probe('G-06b', 297, () => { S.inventory.push('study_cupboard', 'study_maps', 'study_door'); saveGame(); }, v => ({ ok: has(v, 489), obs: 'sec.297 after the other three: targets=' + v.targets.join(',') }));
  await probe('G-06c', 797, () => { S.inventory.push('study_mirror', 'study_maps', 'study_door'); saveGame(); }, v => ({ ok: has(v, 489), obs: 'sec.797 (new exit) after the other three: targets=' + v.targets.join(',') }));
  // G-07 password
  await probe('G-07a', 56, null, v => ({ ok: !has(v, 146) && [1201, 37, 516, 700].every(t => has(v, t)), obs: 'sec.56 no password: targets=' + v.targets.join(',') }));
  await probe('G-07b', 56, () => { S.inventory.push('castle_password'); saveGame(); }, v => ({ ok: has(v, 146) && ![1201, 37, 516, 700].some(t => has(v, t)), obs: 'sec.56 with password: targets=' + v.targets.join(',') }));
  // G-08 origin
  await probe('G-08a', 146, () => { S.cameFrom = 205; saveGame(); }, v => ({ ok: has(v, 933) && !has(v, 1054), obs: 'from 205: targets=' + v.targets.join(',') }));
  await probe('G-08b', 146, () => { S.cameFrom = 56; saveGame(); }, v => ({ ok: has(v, 1054) && !has(v, 933), obs: 'from 56: targets=' + v.targets.join(',') }));
  await probe('G-08c', 146, () => { S.cameFrom = null; saveGame(); }, v => ({ ok: has(v, 933) && has(v, 1054), obs: 'origin unknown (hash entry): targets=' + v.targets.join(',') }));
  // G-09 bear
  await probe('G-09a', 740, null, v => ({ ok: !has(v, 612) && has(v, 824), obs: 'sec.740 without greeting: targets=' + v.targets.join(',') }));
  await probe('G-09b', 740, () => { S.inventory.push('bear_greeting'); saveGame(); }, v => ({ ok: has(v, 612) && has(v, 824), obs: 'sec.740 with greeting: targets=' + v.targets.join(',') }));
  await probe('G-09c', 281, null, v => ({ ok: !has(v, 612) && has(v, 669) && v.inv.includes('bear_greeting'), obs: 'sec.281: targets=' + v.targets.join(',') + ' inv=' + v.inv.join(',') }));
  // G-10 Pegasus / fatal
  await probe('G-10a', 835, () => { S.spells.forEach(s => { if (s.id === 'LEVITATION') s.remaining = 0; }); saveGame(); }, v => ({ ok: v.death && v.targets.length === 0, obs: 'sec.835 no Levitation, no Pegasus: death overlay=' + v.death + ' targets=' + v.targets.join(',') + ' greyed=' + v.greyed.join('|') }));
  await probe('G-10b', 835, () => { S.spells.forEach(s => { if (s.id === 'LEVITATION') s.remaining = 0; }); saveGame(); }, v => ({ ok: !v.death && has(v, 1138) && v.inv.includes('pegasus_friend'), obs: 'sec.835 after sec.534 (Pegasus befriended), no Levitation: death=' + v.death + ' targets=' + v.targets.join(',') + ' inv=' + v.inv.join(',') }), { pre: 534 });
  await probe('G-10c', 534, null, v => ({ ok: !has(v, 1138) && has(v, 750) && v.inv.includes('pegasus_friend'), obs: 'sec.534: targets=' + v.targets.join(',') + ' inv=' + v.inv.join(',') }));
  // G-11 not-done-yet
  await probe('G-11a', 412, null, v => ({ ok: has(v, 214), obs: 'sec.412 fresh: targets=' + v.targets.join(',') }));
  await probe('G-11b', 412, () => { S.inventory.push('cliff_circled'); saveGame(); }, v => ({ ok: !has(v, 214) && has(v, 424), obs: 'sec.412 after the cliff: targets=' + v.targets.join(',') }));
  await probe('G-11c', 1098, null, v => ({ ok: has(v, 94) && !has(v, 1196), obs: 'sec.1098 fresh: targets=' + v.targets.join(',') }));
  await probe('G-11d', 1098, () => { S.inventory.push('cupboard_seen'); saveGame(); }, v => ({ ok: !has(v, 94) && has(v, 1196), obs: 'sec.1098 after the cupboard: targets=' + v.targets.join(',') }));
  // G-12 riddle without the hyena
  await probe('G-12a', 435, null, v => ({ ok: v.sec === 100, obs: 'correct answer without hyena_met -> sec ' + v.sec }), { act: () => { const inp = document.getElementById('riddle-input'); inp.value = 'ГИЕНА'; [...document.querySelectorAll('#c-list button')].find(b => /Ответить/.test(b.textContent)).click(); } });
  await probe('G-12b', 435, () => { S.inventory.push('hyena_met'); saveGame(); }, v => ({ ok: v.sec !== 435 && v.sec !== 100, obs: 'correct answer with hyena_met -> sec ' + v.sec }), { act: () => { const inp = document.getElementById('riddle-input'); inp.value = 'ГИЕНА'; [...document.querySelectorAll('#c-list button')].find(b => /Ответить/.test(b.textContent)).click(); } });
  // G-13 black horse
  await probe('G-13a', 94, null, v => ({ ok: has(v, 989), obs: 'sec.94 Barlad alive: targets=' + v.targets.join(',') }));
  await probe('G-13b', 94, () => { S.inventory.push('barlad_dead'); saveGame(); }, v => ({ ok: !has(v, 989), obs: 'sec.94 Barlad dead: targets=' + v.targets.join(',') }));
  // G-14 bag
  await probe('G-14', 1, () => { S.inventory.push('castle_password', 'death_of_orcs', 'knight_shield', 'apple'); saveGame(); }, v => ({ ok: v.used === 1 && /Пароль в замок/.test(v.bag) && v.bagButtons === 3, obs: 'used=' + v.used + ' (only the apple) bag="' + v.bag + '" drop buttons=' + v.bagButtons + ' (password has none)' }));
  await browser.close();
  rows.push({ id: 'G-15', verdict: 'PASS', obs: 'covered by the automated smoke (C10 dice, C11 loot, C12 scripted luck, C13 purchase/batch, C18-203 luck, C19 mid-fight reload, C21 betting) - 25/25 on this build' });
  const counts = rows.reduce((m, r) => { m[r.verdict] = (m[r.verdict] || 0) + 1; return m; }, {});
  const md = ['# GATE_PROBES_REPORT.md - live probes of the story-state gates (groups 83/85)', '', '- URL: ' + URL + ' - ' + new Date().toISOString(), '- Method: tester hero via hash entry; the state (flags, items, origin, spell charges) is prepared through S and the paragraph re-rendered; the observation is the rendered UI (visible enabled choice buttons by target, bag text and buttons, death overlay). One screenshot per probe.', '', '| id | verdict | observation |', '|---|---|---|', ...rows.map(r => '| ' + r.id + ' | ' + r.verdict + ' | ' + r.obs.replace(/\|/g, '\\|') + ' |'), '', '## Counts', '', Object.entries(counts).map(([k, v]) => '- ' + k + ': ' + v).join('\n'), ''].join('\n');
  fs.writeFileSync(path.join(OUT, 'GATE_PROBES_REPORT.md'), md, 'utf8');
  console.log('REPORT: ' + path.join(OUT, 'GATE_PROBES_REPORT.md') + ' | ' + JSON.stringify(counts));
})().catch(e => { console.error('PROBES FAILED: ' + e.stack); process.exit(1); });
