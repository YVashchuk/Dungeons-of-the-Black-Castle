// playthrough.js - automated end-to-end playthrough of the BUILT game (Playwright over the installed Chrome, headless).
// Strategy: hash-enter #1 as the tester hero, tag every rendered choice button with its target (wrapper around the game's own
// makeChoiceBtn), and always take the visible choice with the smallest weighted distance to sec.1220 (Dijkstra over GD with
// penalties for combat / luck / dice / riddles). Fights, luck rolls, dice, item offers and healing are handled through the UI.
// On death the run restores the last checkpoint (localStorage snapshot) and, after repeated deaths on the same edge, avoids it.
// Output: tests/smoke/out/PLAYTHROUGH_REPORT.md + screenshots. Usage: node tests/smoke/playthrough.js [url]
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const URL = process.argv[2] || 'http://localhost:8001/dist/dungeons-of-the-black-castle.html';
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const MAX_STEPS = Number(process.env.MAX_STEPS || 400), MAX_DEATHS = 60, T0 = Date.now();
const log = []; const L = m => { log.push(m); console.log(m.replace(/[^\x20-\x7E]/g, '?').slice(0, 170)); };

const TAGGER = `(function(){ if(window.__tagged) return; window.__tagged=true;
  const orig=makeChoiceBtn; makeChoiceBtn=function(ch,dc,idx){ const b=orig(ch,dc,idx); try{ b.dataset.target=String(ch.target); b.dataset.idx=String(idx); b.dataset.kind=ch.purchase?'purchase':(ch.pickup_batch?'batch':(ch.spell?'spell':(ch.flee?'flee':'plain'))); }catch(e){} return b; };
  // weighted reverse Dijkstra to 1220 over GD
  const FATAL=new Set([203,289,377,418,421,436,1186]);
  const cost=s=>{ if(!s) return 1; let c=1; if(s.enemies&&s.enemies.length) c+=4+2*s.enemies.length; if(s.has_luck) c+=3; if(FATAL.has(s.id)) c+=15; if(s.dice_check) c+=6; if(s.riddle) c+=40; if(s.round_deadline) c+=5; return c; };
  const usable=ch=>{ try{ if(ch.spell&&getSpellRemaining(ch.spell)<=0) return false; if(Array.isArray(ch.spell_any)&&!ch.spell_any.some(id=>getSpellRemaining(id)>0)) return false; }catch(e){} return true; };
  function buildRev(){ const rev={}; for(const k in GD){ for(const ch of (GD[k].choices||[])){ const t=Number(ch.target); if(!t||!usable(ch)) continue; (rev[t]=rev[t]||[]).push(Number(k)); } } return rev; }
  window.__distCache={}; window.__rebuild=function(){ window.__distCache={}; };
  window.__distTo=function(W){ if(window.__distCache[W]) return window.__distCache[W]; const rev=buildRev(); const d={}; d[W]=0; const q=[[0,W]]; while(q.length){ q.sort((a,b)=>a[0]-b[0]); const [dd,u]=q.shift(); if(dd>d[u]) continue; for(const p of (rev[u]||[])){ const nd=dd+cost(GD[String(p)]); if(d[p]===undefined||nd<d[p]){ d[p]=nd; q.push([nd,p]); } } } window.__distCache[W]=d; return d; };
  window.__dist=window.__distTo(1220); window.__deadEnd=k=>!(GD[String(k)]&&(GD[String(k)].choices||[]).some(c=>c.target));
})();`;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ru-RU' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message || e).slice(0, 160)));
  const ev = (fn, ...a) => page.evaluate(fn, ...a);
  const prep = async () => { await ev(TAGGER); await ev(() => { if (window.__rebuild) window.__rebuild(); }); await ev(() => { try { renderGame({ repaint: true }); } catch (e) {} }); await page.waitForTimeout(150); };
  const state = () => ev(() => ({ sec: S.section, st: S.stamina, stMax: S.staminaMax, luck: S.luck, gold: S.gold, inv: S.inventory.map(i => typeof i === 'string' ? i : i.id), spells: (S.spells || []).map(s => s.id + ':' + s.remaining).join(' '), flask: S.flask, death: document.getElementById('end-death').classList.contains('on'), win: document.getElementById('end-win').classList.contains('on') || S.section === 1220, combat: document.getElementById('modal-combat').classList.contains('on'), luckModal: document.getElementById('modal-luck').classList.contains('on'), offer: document.getElementById('modal-inventory').classList.contains('on') }));
  const snapshot = () => ev(() => localStorage.getItem(SAVE_KEY));
  const restore = async (snap) => { await ev((s) => localStorage.setItem(SAVE_KEY, s), snap); await page.goto('about:blank'); await page.goto(URL, { waitUntil: 'load' }); await ev(() => { const sv = loadGame(); S = sv; showScr('game'); renderGame(); }); await page.waitForTimeout(300); await prep(); };

  await page.goto('about:blank');
  const SNAP = path.join(OUT, 'play-save.json');
  let RESUMED = null; if (process.env.RESUME === '1' && fs.existsSync(SNAP)) { RESUMED = JSON.parse(fs.readFileSync(SNAP, 'utf8')); await page.goto(URL, { waitUntil: 'load' }); await ev((s) => localStorage.setItem(SAVE_KEY, s), RESUMED.save); await ev(() => { const sv = loadGame(); S = sv; showScr('game'); renderGame(); }); L('resumed from ' + SNAP); }
  else { await page.goto(URL + '#1', { waitUntil: 'load' }); }
  await page.waitForFunction(() => document.getElementById('scr-game')?.classList.contains('on'));
  if (process.env.TESTER_BOOST === '1' && process.env.RESUME !== '1') { await ev(() => { const have = new Set((S.spells || []).map(x => x.id)); (typeof SPELLS !== 'undefined' ? SPELLS : []).forEach(d => { if (!have.has(d.id)) S.spells.push({ id: d.id, remaining: 0 }); }); S.spells.forEach(x => { x.remaining = Math.max(x.remaining, 2); }); saveGame(); }); L('tester boost: every spell at 2 charges (engine validation run, not a sporting playthrough)'); }
  await prep();
  L('start: ' + JSON.stringify(await state()).slice(0, 200));
  const _s0 = await state(); const _cp0 = { sec: _s0.sec, snap: await snapshot() };

  const checkpoints = [_cp0];        // [{sec, snap}] - the start state is a checkpoint too (resumed chunks can retry a fight)
  const deaths = {};                 // 'from>to' -> count
  const avoid = new Set((RESUMED && RESUMED.avoid) || []);           // edges to avoid after repeated deaths
  const WAYPOINTS = (process.env.WAYPOINTS || '74,226,976,1120,823,81,1220').split(',').map(Number); let wpIdx = (RESUMED && RESUMED.wpIdx) || 0;
  const visitedOrder = []; const visits = {}; const noNav = {}; const avoidSec = new Set(); let steps = 0, deathCount = 0, fights = 0, lucks = 0, dice = 0, riddles = 0, restarts = 0;
  let lastChoice = null;             // {from,to}
  let outcome = 'unfinished';

  while (steps < MAX_STEPS) {
    steps++;
    let s = await state();
    while (s.sec === WAYPOINTS[wpIdx] && wpIdx < WAYPOINTS.length - 1) { wpIdx++; L('waypoint ' + s.sec + ' reached -> next ' + WAYPOINTS[wpIdx] + ' | items=' + s.inv.join(',')); }
    if (s.win) { wpIdx = WAYPOINTS.length - 1; outcome = 'VICTORY'; L('*** VICTORY at step ' + steps + ' sec ' + s.sec); break; }
    if (s.death) {
      deathCount++; const key = lastChoice ? (lastChoice.from + '>' + lastChoice.to) : ('?>' + s.sec);
      deaths[key] = (deaths[key] || 0) + 1; L('DEATH #' + deathCount + ' at sec ' + s.sec + ' via ' + key + ' (n=' + deaths[key] + ')');
      if (deathCount >= MAX_DEATHS) { outcome = 'gave up (deaths)'; break; }
      if (deaths[key] >= 3) avoid.add(key);
      const cp = checkpoints.length ? checkpoints.pop() : null;
      if (!cp) { outcome = 'died with no checkpoint'; break; }
      await restore(cp.snap); restarts++; lastChoice = null; continue;
    }
    if (s.offer) {   // item offer: take whatever fits, then close
      const took = await ev(() => { let n = 0; for (let i = 0; i < 8; i++) { const b = [...document.querySelectorAll('#modal-inventory button')].find(x => /Взять/.test(x.textContent) && !x.disabled && x.offsetParent !== null); if (!b) break; b.click(); n++; } const eat = [...document.querySelectorAll('#modal-inventory button')].filter(x => /Съесть сразу/.test(x.textContent) && !x.disabled && x.offsetParent !== null); if (S.stamina < S.staminaMax - 2) eat.forEach(b => b.click()); const cl = [...document.querySelectorAll('#modal-inventory button')].find(x => /^(OK|Закрыть|Готово|Продолжить)/.test(x.textContent.trim()) && x.offsetParent !== null); cl && cl.click(); return n; });
      await page.waitForTimeout(250); L('offer: took ' + took + ' item(s) at sec ' + s.sec);
      if (await ev(() => document.getElementById('modal-inventory').classList.contains('on'))) { await ev(() => closeModal('modal-inventory')); }
      continue;
    }
    if (s.luckModal) { const rolled = await ev(() => { const r = document.getElementById('btn-luck-roll'); if (r && r.offsetParent !== null) { r.click(); return 'rolled'; } const c = [...document.querySelectorAll('#modal-luck button')].find(b => b.offsetParent !== null && !/Проверить удачу/.test(b.textContent)); if (c) { c.click(); return 'continued: ' + c.textContent.trim().slice(0, 30); } return 'none'; }); await page.waitForTimeout(400); if (rolled === 'rolled') { lucks++; L('luck roll at sec ' + s.sec); } continue; }
    if (s.combat) {
      // fight: heal outside of combat is not possible here; just strike; use Force once if available and no restriction
      const r = await ev(() => { const btns = [...document.querySelectorAll('#modal-combat button')].filter(b => b.offsetParent !== null && !b.disabled); const force = btns.find(b => /Заклятие Силы/.test(b.textContent) && !combatState.forceBuff); if (force && combatState.enemies.length > 1) { force.click(); return 'force'; } const strike = document.getElementById('btn-combat-round'); if (strike && strike.offsetParent !== null && !strike.disabled) { strike.click(); return 'strike'; } const cont = btns.find(b => /^Продолжить$/.test(b.textContent.trim())); if (cont) { cont.click(); return 'continue'; } const other = btns.find(b => /^✦/.test(b.textContent.trim())); if (other) { other.click(); return 'special:' + other.textContent.trim().slice(0, 30); } return 'none:' + btns.map(b => b.textContent.trim().slice(0, 18)).join('|'); });
      await page.waitForTimeout(120);
      if (r === 'strike') continue;
      if (r === 'continue' || r.startsWith('special')) { fights++; L('fight done at sec ' + s.sec + ' (' + r + '), stamina ' + (await state()).st); await page.waitForTimeout(250); continue; }
      if (r === 'force') continue;
      L('combat stuck: ' + r); outcome = 'stuck in combat'; break;
    }
    // heal between paragraphs when weak
    const fightAhead = await ev(() => [...document.querySelectorAll('#c-list button')].some(b => /\u0412\u0441\u0442\u0443\u043f\u0438\u0442\u044c \u0432 \u0431\u043e\u0439/.test(b.textContent) && b.offsetParent !== null));
    if (s.st <= 8 || (fightAhead && s.st <= 12)) { const h = await ev(() => { const sp = (S.spells || []).find(x => x.id === 'HEALING' && x.remaining > 0); if (sp && typeof useHealing === 'function') { useHealing(); return 'heal'; } if (S.flask > 0 && typeof useFlask === 'function') { useFlask(); return 'flask'; } return null; }); if (h) { L(h + ' at sec ' + s.sec + ' -> stamina ' + (await state()).st); continue; } }
    // choices
    const choices = await ev((W) => { const list = [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true'); return list.map((b, i) => ({ i, t: b.textContent.trim().slice(0, 40), target: b.dataset.target ? Number(b.dataset.target) : null, kind: b.dataset.kind || (/Проверить удачу/.test(b.textContent) ? 'luck' : (/Бросить кубик/.test(b.textContent) ? 'dice' : (/Вступить в бой/.test(b.textContent) ? 'fight' : (/Ответить/.test(b.textContent) ? 'riddle' : (/Подобрать|Собрать/.test(b.textContent) ? 'batch' : 'other'))))), dist: b.dataset.target ? window.__distTo(W)[Number(b.dataset.target)] : undefined })); }, WAYPOINTS[wpIdx]);
    const sec = s.sec;
    if (!choices.length) { L('dead end at sec ' + sec + ' (no choices)'); const key = lastChoice ? (lastChoice.from + '>' + lastChoice.to) : ('?>' + sec); avoid.add(key); const cp = checkpoints.length ? checkpoints.pop() : null; if (!cp) { outcome = 'dead end, no checkpoint'; break; } await restore(cp.snap); restarts++; lastChoice = null; continue; }
    const fight = choices.find(c => c.kind === 'fight'); if (fight) { await ev((i) => [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true')[i].click(), fight.i); await page.waitForTimeout(300); continue; }
    const luck = choices.find(c => c.kind === 'luck'); if (luck && choices.every(c => c.target === null)) { await ev((i) => [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true')[i].click(), luck.i); await page.waitForTimeout(300); continue; }
    const diceB = choices.find(c => c.kind === 'dice'); if (diceB) { await ev((i) => [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true')[i].click(), diceB.i); dice++; await page.waitForTimeout(400); const pick = await ev(() => { const b = [...document.querySelectorAll('#c-list button')].find(x => /Подобрать личинок/.test(x.textContent) && x.offsetParent !== null); if (b) { b.click(); return true; } return false; }); if (pick) await page.waitForTimeout(250); L('dice at sec ' + sec + (pick ? ' + larvae' : '')); continue; }
    const riddle = choices.find(c => c.kind === 'riddle'); if (riddle) { riddles++; const ex = choices.find(c => c.kind === 'other' && c.target === null && !/Ответить/.test(c.t)); L('riddle at sec ' + sec + ' - taking the exit/fail path'); if (ex) { await ev((i) => [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true')[i].click(), ex.i); } else { for (let k = 0; k < 3; k++) { await ev(() => { const inp = document.getElementById('riddle-input'); if (inp) { inp.value = 'xyz'; } const b = [...document.querySelectorAll('#c-list button')].find(x => /Ответить/.test(x.textContent)); b && b.click(); }); await page.waitForTimeout(250); } } await page.waitForTimeout(300); continue; }
    // navigation: pick the best visible target
    const nav = choices.filter(c => c.target !== null && c.dist !== undefined && !avoid.has(sec + '>' + c.target) && !avoidSec.has(c.target) && c.kind !== 'purchase' && c.kind !== 'batch');
    const batch = choices.find(c => c.kind === 'batch'); if (batch && !s.inv.length) { /* collect once when the bag is empty */ await ev((i) => [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true')[i].click(), batch.i); await page.waitForTimeout(250); L('batch pickup at sec ' + sec); }
    if (!nav.length) { noNav[sec] = (noNav[sec] || 0) + 1; if (noNav[sec] >= 2) avoidSec.add(sec); L('no navigable choice at sec ' + sec + ' (x' + noNav[sec] + '): ' + choices.map(c => c.t + '->' + c.target + '(' + c.kind + ')').join(' | ')); const key = lastChoice ? (lastChoice.from + '>' + lastChoice.to) : ('?>' + sec); avoid.add(key); const cp = checkpoints.length ? checkpoints.pop() : null; if (!cp) { outcome = 'no navigable choice'; break; } await restore(cp.snap); restarts++; lastChoice = null; continue; }
    const score = c => c.dist + 3 * (visits[c.target] || 0) + (c.kind === 'spell' ? 2 : 0) + (c.kind === 'flee' ? 3 : 0) + (deaths[sec + '>' + c.target] || 0) * 6;
    nav.sort((a, b) => score(a) - score(b));
    const pick = nav[0];
    checkpoints.push({ sec, snap: await snapshot() }); if (checkpoints.length > 60) checkpoints.shift();
    visitedOrder.push(sec); visits[sec] = (visits[sec] || 0) + 1; if (visits[sec] > 14) { L('loop guard: sec ' + sec + ' visited ' + visits[sec] + ' times - avoiding the chosen edge'); avoid.add(sec + '>' + nav[0].target); }
    await ev((i) => [...document.querySelectorAll('#c-list button')].filter(b => b.offsetParent !== null && !b.disabled && b.getAttribute('aria-disabled') !== 'true')[i].click(), pick.i);
    lastChoice = { from: sec, to: pick.target };
    await page.waitForTimeout(200); await prep();
    const ns = await state();
    if (steps % 25 === 0) { await page.screenshot({ path: path.join(OUT, 'play-' + String(steps).padStart(3, '0') + '.png') }); }
    L('step ' + steps + ': ' + sec + ' -> ' + pick.target + ' ("' + pick.t + '", d=' + pick.dist + ') st=' + ns.st + '/' + ns.stMax + ' luck=' + ns.luck + ' gold=' + ns.gold + ' items=' + ns.inv.length);
  }
  try { fs.writeFileSync(path.join(OUT, 'play-save.json'), JSON.stringify({ save: await snapshot(), wpIdx, avoid: [...avoid] }), 'utf8'); } catch (e) {}
  const fin = await state();
  await page.screenshot({ path: path.join(OUT, 'play-final.png') });
  const report = ['# PLAYTHROUGH_REPORT.md - automated end-to-end run', '', '- URL: ' + URL, '- Date: ' + new Date().toISOString() + ', ' + Math.round((Date.now() - T0) / 1000) + ' s', '- Outcome: **' + outcome + '** at sec ' + fin.sec + ' after ' + steps + ' loop steps; paragraphs visited (nav): ' + visitedOrder.length + ' (' + new Set(visitedOrder).size + ' distinct)', '- Fights: ' + fights + ', luck rolls: ' + lucks + ', dice: ' + dice + ', riddles: ' + riddles + ', deaths: ' + deathCount + ', restores: ' + restarts, '- Final hero: stamina ' + fin.st + '/' + fin.stMax + ', luck ' + fin.luck + ', gold ' + fin.gold + ', items [' + fin.inv.join(', ') + '], spells ' + fin.spells, '- Waypoints: ' + WAYPOINTS.join(' > ') + ' (reached up to index ' + wpIdx + ')', '- Route: ' + visitedOrder.join(' > ') + (outcome === 'VICTORY' ? ' > 1220' : ''), '- Avoided edges (repeated deaths / dead ends): ' + [...avoid].join(', ') || 'none', '- Page errors: ' + (errors.length ? [...new Set(errors)].join(' | ') : 'none'), '', '## Log', '', ...log.map(l => '- ' + l), ''].join('\n');
  fs.writeFileSync(path.join(OUT, 'PLAYTHROUGH_REPORT.md'), report, 'utf8');
  console.log('OUTCOME: ' + outcome + ' | steps ' + steps + ' | fights ' + fights + ' | deaths ' + deathCount + ' | errors ' + errors.length + ' | report ' + path.join(OUT, 'PLAYTHROUGH_REPORT.md'));
  await browser.close();
})().catch(e => { console.error('PLAYER FAILED: ' + e.stack); process.exit(1); });
