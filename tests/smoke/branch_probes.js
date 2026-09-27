// branch_probes.js - deterministic probes of the dice / deadline branches that live runs rarely hit (group_99 follow-up, 2026-09-27).
// Covers the gaps left by the Astra run of 2026-09-27: A6 overtime (#43 -> 1016), A7 overtime (#261 -> 8, #737 -> 182 with the
// wounded goblin carried over), A9 door (#725 success on a double, death at 0 stamina, Golden Whistle gate), A11 (#582 first
// collection with a full bag, persistence after reload). Grey-box: the tester hero is prepared through S and d6() is replaced
// by a scripted sequence; every observation is read from the rendered UI or the game state after real button clicks.
// Usage (server on 8001 from the repo root): node tests/smoke/branch_probes.js [url]  ->  tests/smoke/out/BRANCH_PROBES_REPORT.md
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const URL = process.argv[2] || 'http://localhost:8001/dist/dungeons-of-the-black-castle.html';
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const rows = []; const rec = (id, verdict, obs) => { rows.push({ id, verdict, obs }); console.log(verdict.padEnd(8) + id + ' - ' + obs.replace(/[^\x20-\x7E]/g, '?').slice(0, 190)); };
const TAG = "(function(){ if(window.__tagged) return; window.__tagged=true; const orig=makeChoiceBtn; makeChoiceBtn=function(ch,dc,idx){ const b=orig(ch,dc,idx); try{ if(b&&b.dataset) b.dataset.target=String(ch.target); }catch(e){} return b; }; })();";
const view = () => ({ sec: S.section, st: S.stamina, death: !!document.getElementById('end-death') && document.getElementById('end-death').classList.contains('on'), inv: S.inventory.map(i => typeof i === 'string' ? i : i.id), carry: S.carryOver || null, log: (document.getElementById('combat-log') || { textContent: '' }).textContent.replace(/\s+/g, ' ').slice(-160), targets: [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null).map(b => b.dataset.target || b.textContent.trim().slice(0, 24)), round: (typeof combatState !== 'undefined' && combatState) ? combatState.round : null });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  async function probe(id, sec, setup, act, judge) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ru-RU' }); const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    try {
      await page.goto('about:blank'); await page.goto(URL + '#' + sec, { waitUntil: 'load' });
      await page.waitForFunction(() => document.getElementById('scr-game')?.classList.contains('on'), null, { timeout: 15000 });
      await page.evaluate(TAG);
      await page.evaluate(() => { document.querySelectorAll('.modal-overlay.on').forEach(m => { if (m.id !== 'modal-combat') m.classList.remove('on'); }); });
      if (setup) await page.evaluate(setup);
      await page.evaluate(() => { try { renderGame({ repaint: true }); } catch (e) {} }); await page.waitForTimeout(250);
      const extra = act ? await act(page) : null;
      const v = await page.evaluate(view);
      await page.screenshot({ path: path.join(OUT, 'branch-' + id + '.png') });
      const r = judge(v, extra); rec(id, r.ok ? 'PASS' : 'FAIL', r.obs + (errs.length ? ' | pageerrors: ' + errs.join(';') : ''));
    } catch (e) { rec(id, 'UNCLEAR', 'runner error: ' + String(e.message || e).split('\n')[0].slice(0, 150)); }
    await ctx.close();
  }
  const startFight = page => page.evaluate(() => { const b = [...document.querySelectorAll('#c-list button')].find(x => /Вступить в бой/.test(x.textContent)); if (b) b.click(); return !!b; });
  async function strikeUntilLeave(page, max, perClick) { const from = await page.evaluate(() => S.section); let n = 0; for (; n < max; n++) { if (perClick) await page.evaluate(perClick, n); await page.evaluate(() => document.getElementById('btn-combat-round').click()); await page.waitForTimeout(80); const s = await page.evaluate(() => ({ sec: S.section, death: document.getElementById('end-death').classList.contains('on') })); if (s.sec !== from || s.death) break; } await page.waitForTimeout(300); return n + 1; }
  const hero = (skill, st) => `S.skill=${skill}; if('skillMax' in S) S.skillMax=Math.max(S.skillMax||0,${skill}); S.staminaMax=${st}; S.stamina=${st}; S.inventory=[]; saveGame();`;
  const dice = seq => `window.__dq=${JSON.stringify(seq)}; d6=function(){ return window.__dq.length>1 ? window.__dq.shift() : window.__dq[0]; };`;

  // A6 overtime: #43, hero skill = first orc (8), every roll 4 -> draws; the 11th round start routes to 1016
  await probe('A6-overtime-43', 43, new Function(hero(8, 30) + dice([4])), async page => { await startFight(page); await page.waitForTimeout(250); return strikeUntilLeave(page, 16); },
    (v, clicks) => ({ ok: v.sec === 1016 && v.death, obs: 'after ' + clicks + ' clicks sec=' + v.sec + ' (terminal ending: death overlay expected) death=' + v.death + ' log="…' + v.log.slice(-90) + '"' }));

  // A7 overtime: #261, goblin 9 -> draws; the 4th round start routes to 8
  await probe('A7-overtime-261', 261, new Function(hero(9, 30) + dice([4])), async page => { await startFight(page); await page.waitForTimeout(250); return strikeUntilLeave(page, 8); },
    (v, clicks) => ({ ok: v.sec === 8, obs: 'after ' + clicks + ' clicks sec=' + v.sec + ' log="…' + v.log.slice(-80) + '"' }));

  // A7 overtime with carry-over: #737, wound the goblin twice (skill 9), then draws (skill 7); round 6 routes to 182 with hp 6;
  // in #182 the fight starts with the first goblin at 6/10 and the big goblin waiting
  await probe('A7-carry-737-182', 737, new Function(hero(9, 30) + dice([4])), async page => {
    await startFight(page); await page.waitForTimeout(250);
    const clicks = await strikeUntilLeave(page, 12, n => { if (n === 2) { S.skill = 7; } });
    const after = await page.evaluate(() => ({ sec: S.section, carry: S.carryOver ? JSON.stringify(S.carryOver) : null }));
    await page.evaluate(() => { document.querySelectorAll('.modal-overlay.on').forEach(m => m.classList.remove('on')); });
    await page.evaluate(() => { const b = [...document.querySelectorAll('#c-list button')].find(x => /Вступить в бой/.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(300);
    const cs = await page.evaluate(() => (typeof combatState !== 'undefined' && combatState) ? combatState.enemies.map(e => ({ n: e.name, hp: e.hp, max: e.stamina, active: e.active !== false })) : null);
    return { clicks, after, cs };
  }, (v, x) => ({ ok: x.after.sec === 182 && /"hp":6/.test(x.after.carry || '') && x.cs && x.cs[0].hp === 6 && x.cs[1] && x.cs[1].active === false && v.carry === null, obs: 'clicks ' + x.clicks + ', arrived sec ' + x.after.sec + ' carry ' + x.after.carry + '; fight in 182: ' + JSON.stringify(x.cs) + '; carryOver after start: ' + JSON.stringify(v.carry) }));

  // A9 door: success on a double 1 -> 1215 (one stamina spent)
  await probe('A9-door-success-725', 725, new Function(hero(10, 20) + dice([1])), async page => { const st0 = await page.evaluate(() => S.stamina); await page.evaluate(() => { const b = [...document.querySelectorAll('#c-list button')].find(x => /плечом/i.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(300); return st0; },
    (v, st0) => ({ ok: v.sec === 1215 && v.st === st0 - 1, obs: 'sec ' + v.sec + ', stamina ' + st0 + ' -> ' + v.st }));
  // A9 door: death when the last stamina point is spent on a non-double
  await probe('A9-door-death-725', 725, new Function(hero(10, 1) + dice([2, 3])), async page => { await page.evaluate(() => { const b = [...document.querySelectorAll('#c-list button')].find(x => /плечом/i.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(400); return null; },
    v => ({ ok: v.death && v.st === 0 && v.sec === 725, obs: 'death overlay ' + v.death + ', stamina ' + v.st + ', sec ' + v.sec }));
  // A9 door: the Golden Whistle gate -> 142 appears only with the whistle
  await probe('A9-whistle-gate-725', 725, new Function(hero(10, 20) + "S.inventory.push('gold_whistle'); saveGame();"), null,
    v => ({ ok: v.targets.includes('142'), obs: 'with the whistle, choices: ' + v.targets.join(',') }));

  // A11: #582 first collection with a full bag -> nothing taken, «✓ Собрано», persists after reload
  await probe('A11-full-bag-582', 582, new Function(hero(10, 20) + "S.inventory=['rope','candle','diamond','fox_pelt','candlestick','gold_arrow','white_arrow']; S.batchPicked={}; saveGame();"), async page => {
    const used0 = await page.evaluate(() => getBagUsed() + '/' + getBagSize());
    await page.evaluate(() => { const b = document.querySelector('#c-list button'); if (b) b.click(); }); await page.waitForTimeout(400);
    const a = await page.evaluate(() => ({ inv: S.inventory.length, txt: document.querySelector('#c-list button').textContent.trim().slice(0, 30), dis: document.querySelector('#c-list button').disabled, note: (document.body.innerText.match(/мешок полон[^\n]{0,40}/i) || [''])[0] }));
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(700);
    const b = await page.evaluate(() => ({ sec: S.section, txt: document.querySelector('#c-list button').textContent.trim().slice(0, 30), dis: document.querySelector('#c-list button').disabled }));
    return { used0, a, b };
  }, (v, x) => ({ ok: x.used0 === '7/7' && x.a.inv === 7 && /✓/.test(x.a.txt) && x.a.dis && x.b.sec === 582 && /✓/.test(x.b.txt) && x.b.dis, obs: 'bag ' + x.used0 + '; after collecting: items ' + x.a.inv + ', button «' + x.a.txt + '» disabled=' + x.a.dis + ', notice «' + x.a.note + '»; after reload: «' + x.b.txt + '» disabled=' + x.b.dis }));

  await browser.close();
  const counts = rows.reduce((m, r) => { m[r.verdict] = (m[r.verdict] || 0) + 1; return m; }, {});
  const md = ['# BRANCH_PROBES_REPORT.md - deterministic probes of the dice / deadline branches', '', '- URL: ' + URL + ' - ' + new Date().toISOString(), '- Method: tester hero via hash entry, state prepared through S, d6() replaced by a scripted sequence; real clicks on the fight / door / collect buttons; observations from the rendered UI and the game state.', '', '| id | verdict | observation |', '|---|---|---|', ...rows.map(r => '| ' + r.id + ' | ' + r.verdict + ' | ' + r.obs.replace(/\|/g, '\\|') + ' |'), '', '## Counts', '', Object.entries(counts).map(([k, v]) => '- ' + k + ': ' + v).join('\n'), ''].join('\n');
  fs.writeFileSync(path.join(OUT, 'BRANCH_PROBES_REPORT.md'), md, 'utf8');
  console.log('REPORT: ' + path.join(OUT, 'BRANCH_PROBES_REPORT.md') + ' | ' + JSON.stringify(counts));
})().catch(e => { console.error('PROBES FAILED: ' + e.stack); process.exit(1); });
