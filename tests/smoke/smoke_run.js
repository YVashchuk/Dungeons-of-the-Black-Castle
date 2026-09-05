// smoke_run.js - automated live smoke of the built game via Playwright on the installed Chrome (headless).
// Output: SMOKE_REPORT.md + <id>.png in tests/smoke/out/ (git-ignored). See tests/smoke/README.md. Grey-box: clicks real buttons,
// asserts through the DOM and (where a UI path is impractical) through the game's own globals (S, combatState).
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const URL = process.argv[2] || 'http://localhost:8001/dist/dungeons-of-the-black-castle.html';
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const anomalies = [];
function rec(id, verdict, obs) { results.push({ id, verdict, obs }); console.log(verdict.padEnd(8) + id + ' - ' + obs.replace(/[^\x20-\x7E]/g, '?').slice(0, 160)); }
async function shot(page, id) { try { await page.screenshot({ path: path.join(OUT, id + '.png'), fullPage: false }); } catch (e) {} }
async function open(page, hash) {
  await page.goto('about:blank');
  await page.goto(URL + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  if (hash) await page.waitForFunction(() => { const g = document.getElementById('scr-game'); return g && g.classList.contains('on'); }, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.waitForTimeout(400);
}
async function reload(page) { await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(500); }
async function clickText(page, re, within) {
  const loc = (within ? page.locator(within) : page).locator('button', { hasText: re }).first();
  let done = false;
  try { await loc.waitFor({ state: 'visible', timeout: 2000 }); await loc.click(); done = true; } catch (e) {}
  if (!done) { const hit = await page.evaluate(({ src, flags, w }) => { const re2 = new RegExp(src, flags); const b = [...document.querySelectorAll((w || 'body') + ' button')].find(x => x.offsetParent !== null && re2.test(x.textContent)); if (b) { b.click(); return b.textContent.trim().slice(0, 40); } return null; }, { src: re.source, flags: re.flags, w: within }); if (!hit) { const dbg = await page.evaluate((w) => [...document.querySelectorAll((w || '#c-list') + ' button, #modal-inventory button')].map(b => b.textContent.trim().slice(0, 28) + (b.offsetParent === null ? '[hidden]' : '')).join(' / ').slice(0, 300), within); throw new Error('no visible button ' + re + ' ; buttons: ' + dbg); } }
  await page.waitForTimeout(350);
}
const ev = (page, fn, ...a) => page.evaluate(fn, ...a);
async function rollLuck(page) { await clickText(page, /Проверить удачу/); await page.locator('#btn-luck-roll').click(); await page.waitForTimeout(500); }
async function withCtx(browser, opts, fn) {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1440, height: 900 }, locale: 'ru-RU' }, opts || {}));
  const page = await ctx.newPage();
  page.on('pageerror', e => anomalies.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') anomalies.push('console.error: ' + m.text().slice(0, 200)); });
  try { await fn(page); } finally { await ctx.close(); }
}
async function check(id, browser, opts, fn) {
  try { await withCtx(browser, opts, async page => { await fn(page); }); }
  catch (e) { rec(id, 'UNCLEAR', 'runner error: ' + String(e.message || e).split('\n')[0].slice(0, 160)); }
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const t0 = Date.now();

  // ---- S0..S3: build signatures ----
  await check('S0', browser, null, async page => {
    await page.goto(URL, { waitUntil: 'load' }); await page.waitForTimeout(600);
    const on = await ev(page, () => document.getElementById('scr-title')?.classList.contains('on'));
    await shot(page, 'S0'); rec('S0', on ? 'PASS' : 'FAIL', 'title screen ' + (on ? 'rendered' : 'not on') + ', document.title=' + await page.title());
  });
  await check('S1', browser, null, async page => {
    await open(page, 1131);
    const r = await ev(page, () => ({ inp: !!document.getElementById('riddle-input') && document.getElementById('riddle-input').offsetParent !== null, btn: [...document.querySelectorAll('#c-list button')].some(b => /Ответить/.test(b.textContent)), head: document.querySelector('.choices-title')?.textContent.trim(), tester: document.getElementById('sb-name')?.textContent.trim() }));
    await shot(page, 'S1'); rec('S1', (r.inp && r.btn) ? 'PASS' : 'FAIL', '#1131 riddle input=' + r.inp + ' answer button=' + r.btn + ' heading=' + r.head + ' hero=' + r.tester);
  });
  await check('S2', browser, null, async page => {
    await open(page, 1);
    const r = await ev(page, () => { const m = document.getElementById('sb-map'); const b = m && [...m.querySelectorAll('button')].find(x => /Открыть/.test(x.textContent)); return { visible: !!m && m.offsetParent !== null, btn: !!b && b.offsetParent !== null, svg: !!document.querySelector('#map-mini-svg svg, #map-mini-svg *') }; });
    await shot(page, 'S2'); rec('S2', (r.visible && r.btn) ? 'PASS' : 'FAIL', '#1 sidebar mini-map visible=' + r.visible + ' open-button=' + r.btn + ' svg=' + r.svg);
  });
  await check('S3', browser, null, async page => {
    await open(page, 1); await ev(page, () => openMenu()); await page.waitForTimeout(300);
    const r = await ev(page, () => ({ on: document.getElementById('overlay-menu').classList.contains('on'), note: document.getElementById('autosave-note')?.textContent.trim(), z: document.getElementById('overlay-menu').style.zIndex, role: document.getElementById('overlay-menu').getAttribute('role') }));
    await shot(page, 'S3'); rec('S3', (r.on && /Автосохранение: §1/.test(r.note)) ? 'PASS' : 'FAIL', 'menu on=' + r.on + ' note="' + r.note + '" z=' + r.z + ' role=' + r.role);
  });

  // ---- C14 fonts ----
  await check('C14', browser, null, async page => {
    await open(page, 1); await ev(page, () => openMenu()); await page.waitForTimeout(300);
    const r = await ev(page, async () => { await document.fonts.ready; const forum = document.fonts.check('16px Forum'); const cinzel = document.fonts.check('16px Cinzel'); const corm = document.fonts.check('16px "Cormorant Garamond"'); const h = document.getElementById('menu-modal-title'); const cs = getComputedStyle(h); const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family); return { forum, cinzel, corm, family: cs.fontFamily, weight: cs.fontWeight, loaded: [...new Set(loaded)].join(', ') }; });
    await shot(page, 'C14');
    rec('C14', (r.forum && r.cinzel && /Forum/.test(r.family) && r.weight === '400') ? 'PASS' : 'FAIL', 'Forum loaded=' + r.forum + ' Cinzel=' + r.cinzel + ' Cormorant=' + r.corm + ' menu h2 family=' + r.family + ' weight=' + r.weight + ' loaded=' + r.loaded);
  });

  // ---- C15 reading flow / B1 ----
  for (const sec of [132, 340]) {
    await check('C15-' + sec, browser, null, async page => {
      await open(page, sec);
      const r = await ev(page, () => { const rd = document.querySelector('.reader'); const sa = document.getElementById('s-area'); const rb = rd.getBoundingClientRect(), sb = sa.getBoundingClientRect(); const btns = [...document.querySelectorAll('#c-list button')]; const last = btns[btns.length - 1]; last && last.scrollIntoView({ block: 'end' }); const lb = last ? last.getBoundingClientRect() : null; return { readerW: Math.round(rb.width), leftGap: Math.round(rb.left - sb.left), rightGap: Math.round(sb.right - rb.right), count: btns.length, head: document.querySelector('.choices-title')?.textContent.trim(), inFlow: !!document.getElementById('c-area').closest('#s-area'), lastVisible: lb ? (lb.bottom <= sb.bottom + 1 && lb.top >= sb.top - 1) : false }; });
      await shot(page, 'C15-' + sec);
      const ok = r.readerW <= 920 && Math.abs(r.leftGap - r.rightGap) < 40 && r.inFlow && r.head === 'Ваш выбор' && r.count >= (sec === 132 ? 20 : 10) && r.lastVisible;
      rec('C15-' + sec, ok ? 'PASS' : 'FAIL', 'reader ' + r.readerW + 'px, gaps ' + r.leftGap + '/' + r.rightGap + ', choices=' + r.count + ' heading=' + r.head + ' inFlow=' + r.inFlow + ' lastReachable=' + r.lastVisible);
    });
  }

  // ---- C16 phone HUD + sheets; C17 phone part; B5 tap targets ----
  const phone = { viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  await check('C16', browser, phone, async page => {
    await open(page, 1);
    const a = await ev(page, () => ({ hud: document.getElementById('hud-bar').offsetParent !== null, hudH: Math.round(document.getElementById('hud-bar').getBoundingClientRect().height), sidebar: document.querySelector('.sidebar').offsetParent !== null, fab: document.getElementById('event-log-btn')?.offsetParent !== null, btns: document.querySelectorAll('.hud-btn').length }));
    await shot(page, 'C16-hud');
    await page.locator('.hud-btn[onclick="openSheet(\'inv\')"]').click(); await page.waitForTimeout(400);
    const b = await ev(page, () => ({ sheet: document.getElementById('overlay-sheet').classList.contains('on'), invInSheet: !!document.querySelector('#sheet-body #sb-inv'), flaskInSheet: !!document.querySelector('#sheet-body #sb-flask'), title: document.getElementById('sheet-title').textContent.trim(), z: document.getElementById('overlay-sheet').style.zIndex }));
    await shot(page, 'C16-sheet');
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    const c = await ev(page, () => ({ sheetOff: !document.getElementById('overlay-sheet').classList.contains('on'), invHome: !!document.querySelector('.sidebar #sb-inv') && !!document.querySelector('.sidebar #sb-flask'), order: [...document.querySelectorAll('.sidebar > *')].map(x => x.id || x.className).slice(0, 12).join('>') }));
    await page.setViewportSize({ width: 915, height: 412 }); await page.waitForTimeout(400);
    const d = await ev(page, () => ({ hud: document.getElementById('hud-bar').offsetParent !== null, sidebar: document.querySelector('.sidebar').offsetParent !== null, sbW: Math.round(document.querySelector('.sidebar').getBoundingClientRect().width) }));
    await shot(page, 'C16-landscape');
    const ok = a.hud && !a.sidebar && !a.fab && a.btns === 6 && b.sheet && b.invInSheet && b.flaskInSheet && c.sheetOff && c.invHome && !d.hud && d.sidebar;
    rec('C16', ok ? 'PASS' : 'FAIL', 'portrait: hud=' + a.hud + ' (' + a.hudH + 'px) sidebar=' + a.sidebar + ' fab=' + a.fab + ' btns=' + a.btns + '; sheet=' + b.sheet + ' inv+flask=' + (b.invInSheet && b.flaskInSheet) + ' title="' + b.title + '"; after Esc: closed=' + c.sheetOff + ' nodesHome=' + c.invHome + '; landscape 915: hud=' + d.hud + ' sidebar=' + d.sidebar + ' (' + d.sbW + 'px)');
    await check('C17-phone', browser, phone, async p2 => {
      await open(p2, 1); await p2.locator('.hud-btn[onclick="openSheet(\'inv\')"]').click(); await p2.waitForTimeout(300);
      await p2.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', code: 'KeyM', bubbles: true }))); await p2.waitForTimeout(300);
      const r1 = await ev(p2, () => ({ map: document.getElementById('overlay-map').classList.contains('on'), zMap: document.getElementById('overlay-map').style.zIndex, zSheet: document.getElementById('overlay-sheet').style.zIndex }));
      await shot(p2, 'C17-map-over-sheet');
      await p2.keyboard.press('Escape'); await p2.waitForTimeout(250);
      const r2 = await ev(p2, () => ({ map: document.getElementById('overlay-map').classList.contains('on'), sheet: document.getElementById('overlay-sheet').classList.contains('on') }));
      await p2.keyboard.press('Escape'); await p2.waitForTimeout(250);
      const r3 = await ev(p2, () => document.getElementById('overlay-sheet').classList.contains('on'));
      await p2.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', code: 'KeyM', bubbles: true }))); await p2.waitForTimeout(300);
      const r4 = await ev(p2, () => document.getElementById('overlay-map').classList.contains('on'));
      await p2.keyboard.press('Escape'); await p2.waitForTimeout(250);
      const r5 = await ev(p2, () => document.getElementById('overlay-map').classList.contains('on'));
      const ok2 = !r1.map && !r2.sheet && r4 && !r5;
      rec('C17-phone', ok2 ? 'PASS' : 'FAIL', 'CA-17 gate: M over an open sheet opens the map=' + r1.map + ' (expected false); Esc closes the sheet=' + !r2.sheet + '; then M opens the map=' + r4 + '; Esc closes it=' + !r5);
    });
    await check('B5', browser, phone, async p3 => {
      await open(p3, 1); await p3.evaluate(() => { S.inventory.push({ kind: 'food', id: 'apple', stamina: 2 }); updateHUD(); saveGame(); });
      await p3.locator('.hud-btn[onclick="openSheet(\'inv\')"]').click(); await p3.waitForTimeout(300);
      const r = await ev(p3, () => { const e = document.querySelector('.inv-eat'), d = document.querySelector('.inv-remove'); const b1 = e.getBoundingClientRect(), b2 = d.getBoundingClientRect(); return { eat: [Math.round(b1.width), Math.round(b1.height)], drop: [Math.round(b2.width), Math.round(b2.height)], tag: e.tagName + '/' + d.tagName, aria: d.getAttribute('aria-label') }; });
      await shot(p3, 'B5'); rec('B5', (r.eat[0] >= 44 && r.eat[1] >= 44 && r.drop[0] >= 44 && r.drop[1] >= 44) ? 'PASS' : 'FAIL', 'tap targets eat=' + r.eat.join('x') + ' drop=' + r.drop.join('x') + ' tags=' + r.tag + ' aria="' + r.aria + '"');
    });
  });

  // ---- C17 desktop keyboard part ----
  await check('C17-keyboard', browser, null, async page => {
    await open(page, 1); await page.evaluate(() => { S.inventory.push({ kind: 'food', id: 'apple', stamina: 2 }, 'rope'); updateHUD(); saveGame(); });
    let found = null; for (let i = 0; i < 80; i++) { await page.keyboard.press('Tab'); found = await ev(page, () => { const a = document.activeElement; return a && a.classList.contains('inv-remove') ? { tag: a.tagName, aria: a.getAttribute('aria-label'), fv: a.matches(':focus-visible'), outline: getComputedStyle(a).outlineStyle + ' ' + getComputedStyle(a).outlineWidth } : null; }); if (found) break; }
    const before = await ev(page, () => S.inventory.length);
    if (found) { await page.keyboard.press('Enter'); await page.waitForTimeout(300); }
    const after = await ev(page, () => ({ len: S.inventory.length, focus: document.activeElement && (document.activeElement.id || document.activeElement.className) }));
    await shot(page, 'C17-keyboard');
    rec('C17-keyboard', (found && after.len === before - 1) ? 'PASS' : 'FAIL', 'tabbed to ' + (found ? found.tag + ' aria="' + found.aria + '" focus-visible=' + found.fv + ' outline=' + found.outline : 'nothing') + '; Enter dropped item: ' + before + '->' + after.len + ' focus now=' + after.focus);
  });

  // ---- C19 desktop: fight + F5, Russian-layout M, journal Esc ----
  await check('C19', browser, null, async page => {
    await open(page, 131); await clickText(page, /Вступить в бой/); await page.waitForTimeout(400);
    await page.locator('#btn-combat-round').click(); await page.waitForTimeout(400);
    const mid = await ev(page, () => ({ open: document.getElementById('modal-combat').classList.contains('on'), hp: combatState.enemies[0].hp, max: combatState.enemies[0].maxHp || combatState.enemies[0].stamina, round: combatState.round, status: document.getElementById('combat-round-status').textContent.slice(0, 80) }));
    await reload(page);
    const post = await ev(page, () => ({ open: document.getElementById('modal-combat').classList.contains('on'), section: S.section }));
    await clickText(page, /Вступить в бой/); await page.waitForTimeout(300);
    const again = await ev(page, () => ({ hp: combatState.enemies[0].hp, round: combatState.round }));
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    const escCombat = await ev(page, () => document.getElementById('modal-combat').classList.contains('on'));
    await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ь', code: 'KeyM', bubbles: true }))); await page.waitForTimeout(300);
    const mapOverCombat = await ev(page, () => document.getElementById('overlay-map').classList.contains('on'));
    await page.evaluate(() => { const b = document.getElementById('modal-combat'); b.classList.remove('on'); }); await page.waitForTimeout(200);
    await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ь', code: 'KeyM', bubbles: true }))); await page.waitForTimeout(300);
    const mapRu = await ev(page, () => document.getElementById('overlay-map').classList.contains('on'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    await page.locator('#event-log-btn').click(); await page.waitForTimeout(300);
    const log = await ev(page, () => ({ on: document.getElementById('event-log-panel').classList.contains('on'), focus: document.activeElement && document.activeElement.className }));
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    const logAfter = await ev(page, () => ({ on: document.getElementById('event-log-panel').classList.contains('on'), focus: document.activeElement && (document.activeElement.id || document.activeElement.className) }));
    await shot(page, 'C19');
    const ok = mid.open && !post.open && post.section === 131 && again.hp === mid.max && again.round === 0 && escCombat && !mapOverCombat && mapRu && log.on && /event-log-close/.test(log.focus) && !logAfter.on && /event-log-btn|hud-btn/.test(logAfter.focus);
    rec('C19', ok ? 'PASS' : 'FAIL', 'F5 mid-fight (hp ' + mid.hp + '/' + mid.max + ', round ' + mid.round + ') -> modal open=' + post.open + ', re-enter hp=' + again.hp + ' round=' + again.round + '; Esc keeps combat=' + escCombat + '; M blocked over combat=' + !mapOverCombat + '; RU-layout M opens map=' + mapRu + '; log: open=' + log.on + ' focus=' + log.focus + ' -> Esc closed=' + !logAfter.on + ' focus=' + logAfter.focus + '; SR status="' + mid.status + '"');
  });

  // ---- C18: #1131 (S1), #131 Copy -> eagle, #203 luck + F5 ----
  await check('C18-131', browser, null, async page => {
    let outcome = null;
    for (let attempt = 1; attempt <= 8 && !outcome; attempt++) {
      await open(page, 131); await clickText(page, /Вступить в бой/); await page.waitForTimeout(300);
      await clickText(page, /Заклятие Копии/, '#modal-combat'); await page.waitForTimeout(500);
      const r = await ev(page, () => ({ goblin: combatState.enemies[0].hp, eagle: combatState.enemies[1].active, joined: combatState.special && combatState.special.reinforcementsJoined, waiting: /выжидают/.test(document.getElementById('combat-log').textContent), log: document.getElementById('combat-log').textContent.slice(-160) }));
      if (r.goblin <= 0) outcome = r; else { await page.context().clearCookies(); await page.evaluate(() => localStorage.clear()); }
    }
    await shot(page, 'C18-131');
    if (!outcome) rec('C18-131', 'UNCLEAR', 'the Copy never killed the goblin in 8 attempts (dice) - eagle path not exercised');
    else rec('C18-131', (outcome.eagle === true && outcome.joined && !outcome.waiting) ? 'PASS' : 'FAIL', 'goblin killed by Copy -> eagle active=' + outcome.eagle + ' joined=' + outcome.joined + ' waiting-branch=' + outcome.waiting + ' log tail="' + outcome.log.replace(/\s+/g, ' ') + '"');
  });
  await check('C18-203', browser, null, async page => {
    await open(page, 203); await rollLuck(page);
    const roll = await ev(page, () => ({ rec: S.luckChecks && S.luckChecks['203'], luckOn: document.getElementById('modal-luck').classList.contains('on'), res: document.getElementById('luck-result').textContent.replace(/\s+/g, ' ').slice(0, 80) }));
    await reload(page);
    const after = await ev(page, () => ({ rec: S.luckChecks && S.luckChecks['203'], luckBtn: [...document.querySelectorAll('#c-list button')].some(b => /Проверить удачу/.test(b.textContent)), death: document.getElementById('end-death').classList.contains('on'), choices: document.querySelectorAll('#c-list button').length }));
    await shot(page, 'C18-203');
    const same = roll.rec && after.rec && roll.rec.a === after.rec.a && roll.rec.b === after.rec.b && roll.rec.lucky === after.rec.lucky;
    rec('C18-203', (roll.rec && same && !after.luckBtn) ? 'PASS' : 'FAIL', 'roll ' + JSON.stringify(roll.rec) + ' (luck dialog=' + roll.luckOn + '); after F5 record=' + JSON.stringify(after.rec) + ' luck button offered again=' + after.luckBtn + ' death overlay=' + after.death + ' choices=' + after.choices);
  });

  // ---- C10 / C11 dice persistence ----
  await check('C10', browser, null, async page => {
    await open(page, 781); await clickText(page, /Бросить кубик/); await page.waitForTimeout(400);
    const a = await ev(page, () => ({ rec: S.diceCheckDone && S.diceCheckDone['781'], txt: document.getElementById('c-list').textContent.replace(/\s+/g, ' ').trim().slice(0, 60) }));
    await reload(page);
    const b = await ev(page, () => ({ rec: S.diceCheckDone && S.diceCheckDone['781'], txt: document.getElementById('c-list').textContent.replace(/\s+/g, ' ').trim().slice(0, 60), rollBtn: [...document.querySelectorAll('#c-list button')].some(x => /Бросить кубик/.test(x.textContent)), cont: [...document.querySelectorAll('#c-list button')].some(x => /Продолжить/.test(x.textContent)) }));
    await shot(page, 'C10'); rec('C10', (a.rec && b.rec && a.rec.a === b.rec.a && a.rec.b === b.rec.b && !b.rollBtn && b.cont) ? 'PASS' : 'FAIL', 'roll ' + JSON.stringify(a.rec) + ' -> after F5 ' + JSON.stringify(b.rec) + ' roll button=' + b.rollBtn + ' continue=' + b.cont + ' text="' + b.txt + '"');
  });
  await check('C11', browser, null, async page => {
    await open(page, 932); await clickText(page, /Бросить кубик/); await page.waitForTimeout(400);
    const a = await ev(page, () => ({ n: S.diceLootRoll && S.diceLootRoll['932'] && S.diceLootRoll['932'].n }));
    await reload(page);
    const b = await ev(page, () => ({ n: S.diceLootRoll && S.diceLootRoll['932'] && S.diceLootRoll['932'].n, pick: [...document.querySelectorAll('#c-list button')].some(x => /Подобрать личинок/.test(x.textContent)), rollBtn: [...document.querySelectorAll('#c-list button')].some(x => /Бросить кубик/.test(x.textContent)) }));
    await clickText(page, /^Продолжить$/); await page.waitForTimeout(300);
    await open(page, 932);
    const c = await ev(page, () => ({ done: S.diceLootDone && S.diceLootDone['932'], pick: [...document.querySelectorAll('#c-list button')].some(x => /Подобрать личинок/.test(x.textContent)), cont: [...document.querySelectorAll('#c-list button')].some(x => /Продолжить/.test(x.textContent)) }));
    await shot(page, 'C11'); rec('C11', (a.n && a.n === b.n && b.pick && !b.rollBtn && c.done && !c.pick && c.cont) ? 'PASS' : 'FAIL', 'n=' + a.n + ' after F5 n=' + b.n + ' pickup offered=' + b.pick + ' reroll=' + b.rollBtn + '; refused -> revisit: done=' + c.done + ' pickup=' + c.pick + ' continue=' + c.cont);
  });

  // ---- C12 sec.436 Force round-trip ----
  await check('C12', browser, null, async page => {
    await open(page, 436); const diag = await ev(page, () => ({ prep: JSON.stringify(sectionPrepState['436'] || null), rec: JSON.stringify(S.luckChecks), luck: S.luck, force: S.sec436_force, btns: [...document.querySelectorAll('#c-list button')].map(b => b.textContent.trim().slice(0, 22)).join(' / ') })); console.log('C12 diag: ' + JSON.stringify(diag).replace(/[^\x20-\x7E]/g, '?')); await page.evaluate(() => { S.luck = 0; saveGame(); });
    await rollLuck(page);
    const r0 = await ev(page, () => ({ rec: S.luckChecks && S.luckChecks['436'], luckOn: document.getElementById('modal-luck').classList.contains('on') }));
    await page.evaluate(() => { const b = [...document.querySelectorAll('#luck-choices button, #modal-luck button')].find(x => x.offsetParent !== null); b && b.click(); }); await page.waitForTimeout(400);
    const r1 = await ev(page, () => ({ btns: [...document.querySelectorAll('#c-list button')].map(b => b.textContent.trim()).join(' | ') }));
    await reload(page);
    const r2 = await ev(page, () => ({ btns: [...document.querySelectorAll('#c-list button')].map(b => b.textContent.trim()).join(' | '), luckBtn: [...document.querySelectorAll('#c-list button')].some(b => /Проверить удачу/.test(b.textContent)) }));
    const forceLabel = await page.evaluate(() => { const btns = [...document.querySelectorAll('#c-list button')]; const b = btns[1]; const t = b ? b.textContent.trim() : null; b && b.click(); return t; }); await page.waitForTimeout(400);
    const r3 = await ev(page, () => ({ section: S.section, force: S.sec436_force }));
    await page.evaluate(() => goTo(436)); await page.waitForTimeout(300);
    await reload(page);
    const r4 = await ev(page, () => ({ force: S.sec436_force, fightF: [...document.querySelectorAll('#c-list button')].some(b => /Драться \(заклятие Силы/.test(b.textContent)), luckBtn: [...document.querySelectorAll('#c-list button')].some(b => /Проверить удачу/.test(b.textContent)) }));
    await shot(page, 'C12');
    const ok = r0.rec && r0.rec.scripted && !r2.luckBtn && /Драться с пауком/.test(r2.btns) && r3.force === true && r4.force === true && r4.fightF && !r4.luckBtn;
    rec('C12', ok ? 'PASS' : 'FAIL', 'unlucky roll persisted=' + !!(r0.rec && r0.rec.scripted) + '; F5 after roll: reroll offered=' + r2.luckBtn + ' choices="' + r2.btns.slice(0, 90) + '"; clicked "' + forceLabel + '" -> section=' + r3.section + ' flag=' + r3.force + '; back on 436 + F5: flag=' + r4.force + ' fight+1 button=' + r4.fightF + ' reroll=' + r4.luckBtn);
  });

  // ---- C13 one-shot purchase + batch across F5 ----
  await check('C13', browser, null, async page => {
    await open(page, 340); await page.evaluate(() => { S.gold = 50; saveGame(); }); await page.evaluate(() => renderChoices(locSec(340)));
    const bought = await page.evaluate(() => { const idx = GD['340'].choices.findIndex(c => c.purchase && c.grants_items === 'wood_piece'); const btns = [...document.querySelectorAll('#c-list button')]; const b = btns[idx]; const g0 = S.gold; b && b.click(); return { g0, g1: S.gold, sb: JSON.stringify(S.shopBought), idx, label: b ? b.textContent.trim().slice(0, 60) : ('no button at index ' + idx) }; });
    await page.waitForTimeout(300); await open(page, 340);
    const after = await ev(page, () => ({ g: S.gold, sb: JSON.stringify(S.shopBought), bought: [...document.querySelectorAll('#c-list button')].filter(b => /^\u2713/.test(b.textContent.trim())).map(b => b.textContent.trim().slice(0, 40)).join(' | ') }));
    await open(page, 585); const batchBtn = await ev(page, () => { const ch = GD['585'].choices.find(c => c.pickup_batch); const key = ch ? String(ch.label || ch.text || '').slice(0, 12) : ''; const b = [...document.querySelectorAll('#c-list button')].find(x => key && x.textContent.includes(key)) || [...document.querySelectorAll('#c-list button')].find(x => /Собр|кокос/i.test(x.textContent)); if (!b) return null; const t = b.textContent.trim(); b.click(); return t; }); await page.waitForTimeout(300);
    await open(page, 585); const batchAfter = await ev(page, () => ({ bp: JSON.stringify(S.batchPicked), done: [...document.querySelectorAll('#c-list button')].some(b => /Собрано/.test(b.textContent) && b.disabled), bag: S.inventory.map(i => typeof i === 'string' ? i : i.id).join(',') }));
    await shot(page, 'C13');
    const okBuy = bought.label && bought.g1 === bought.g0 - 1 && after.g === bought.g1 && /"340":\[[^\]]*6/.test(after.sb) && after.bought.length > 0;
    const okBatch = batchBtn && batchAfter.done && /"585:\d+"/.test(batchAfter.bp);
    rec('C13', (okBuy && okBatch) ? 'PASS' : 'FAIL', 'buy "' + bought.label + '" gold ' + bought.g0 + '->' + bought.g1 + ', after F5 gold=' + after.g + ' shopBought=' + after.sb + ' disabled="' + after.bought + '"; batch "' + batchBtn + '" -> after F5 batchPicked=' + batchAfter.bp + ' done=' + batchAfter.done + ' bag=' + batchAfter.bag);
  });

  // ---- C1 offer modal, C2 names, C3/A2 armament, C8 DoO immediate flee ----
  await check('C1', browser, null, async page => {
    await open(page, 389); await page.waitForTimeout(300);
    const a = await ev(page, () => ({ modal: document.getElementById('modal-inventory').classList.contains('on'), found: document.getElementById('inv-modal-found')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 80), eatNow: [...document.querySelectorAll('#modal-inventory button')].some(b => /Съесть сразу/.test(b.textContent)), objectObject: /object Object/.test(document.getElementById('modal-inventory').textContent) }));
    await clickText(page, /Съесть сразу/, '#modal-inventory'); await page.waitForTimeout(300);
    const b = await ev(page, () => ({ stamina: S.stamina, live: document.getElementById('bc-notif-live').textContent, toast: document.querySelector('.item-notification')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) }));
    await page.evaluate(() => { S.stamina = 10; updateHUD(); }); await clickText(page, /Съесть сразу/, '#modal-inventory'); await page.waitForTimeout(300);
    const c = await ev(page, () => ({ stamina: S.stamina, takeDisabled: ![...document.querySelectorAll('#modal-inventory button')].some(x => /Взять/.test(x.textContent) && !x.disabled), eaten: document.getElementById('inv-modal-found')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) }));
    await shot(page, 'C1');
    rec('C1', (a.modal && /Арбуз \(еда: \+4\)/.test(a.found) && a.eatNow && !a.objectObject && b.stamina === 24 && c.stamina === 14 && c.takeDisabled) ? 'PASS' : 'FAIL', 'modal=' + a.modal + ' found="' + a.found + '" eatNow=' + a.eatNow + '; full stamina -> ' + b.stamina + ' notice="' + (b.toast || b.live) + '"; at 10 -> ' + c.stamina + ' take disabled=' + c.takeDisabled);
  });
  await check('C2', browser, null, async page => {
    await open(page, 585); await page.evaluate(() => { const b = [...document.querySelectorAll('#c-list button')].find(x => /Собр|кокос/i.test(x.textContent)); b && b.click(); }); await page.waitForTimeout(300);
    const r = await ev(page, () => ({ inv: document.getElementById('inv-list').textContent.replace(/\s+/g, ' ').trim().slice(0, 80), slugs: /coconut|bun|food/.test(document.getElementById('inv-list').textContent) }));
    await shot(page, 'C2'); rec('C2', (/Кокос/.test(r.inv) && !r.slugs) ? 'PASS' : 'FAIL', 'bag="' + r.inv + '" slugs visible=' + r.slugs);
  });
  await check('C3-A2-C8', browser, null, async page => {
    await open(page, 553); await page.evaluate(() => { document.querySelector('#c-list button').click(); }); await page.waitForTimeout(500); await page.evaluate(() => { const t = [...document.querySelectorAll('#modal-inventory button')].find(b => /Взять/.test(b.textContent) && !b.disabled && b.offsetParent !== null); t && t.click(); }); await page.waitForTimeout(300);
    const s1 = await ev(page, () => ({ inv: S.inventory.map(i => typeof i === 'string' ? i : i.id).join(','), used: getBagUsed(), section: S.section }));
    await open(page, 71); await page.waitForTimeout(400);
    const s2 = await ev(page, () => ({ inv: S.inventory.map(i => typeof i === 'string' ? i : i.id).join(','), used: getBagUsed(), modal: document.getElementById('modal-inventory').classList.contains('on'), live: document.getElementById('bc-notif-live').textContent }));
    await open(page, 1213); await page.waitForTimeout(400);
    const s3 = await ev(page, () => ({ inv: S.inventory.map(i => typeof i === 'string' ? i : i.id).join(','), used: getBagUsed(), modal: document.getElementById('modal-inventory').classList.contains('on') }));
    await open(page, 617); await clickText(page, /Вступить в бой/); await page.waitForTimeout(500);
    const s4 = await ev(page, () => ({ orc: combatState.enemies[0].hp, goblin: combatState.enemies[1].active, flee: [...document.querySelectorAll('#modal-combat button')].filter(b => b.offsetParent !== null && /^✦/.test(b.textContent.trim())).map(b => b.textContent.trim()).join(' | '), log: document.getElementById('combat-log').textContent.replace(/\s+/g, ' ').slice(0, 140) }));
    await shot(page, 'C3-A2-C8');
    const ok = /whole_sword/.test(s1.inv) && /death_of_orcs/.test(s2.inv) && !/whole_sword/.test(s2.inv) && !s2.modal && /knight_shield/.test(s3.inv) && !s3.modal && s3.used === 0 && s4.orc <= 0 && s4.goblin === true && s4.flee.length > 0;
    rec('C3-A2-C8', ok ? 'PASS' : 'FAIL', '553 take: inv=' + s1.inv + ' used=' + s1.used + '; 71: inv=' + s2.inv + ' used=' + s2.used + ' modal=' + s2.modal + ' notice="' + s2.live.slice(0, 70) + '"; 1213: inv=' + s3.inv + ' used=' + s3.used + ' modal=' + s3.modal + '; 617 with DoO: orc hp=' + s4.orc + ' goblin active=' + s4.goblin + ' flee buttons="' + s4.flee + '"');
  });

  // ---- B2 pills / B3 art toggle / C4 copy joins ----
  await check('B2', browser, null, async page => {
    await open(page, 628); await clickText(page, /Вступить в бой/); await page.waitForTimeout(400);
    const r = await ev(page, () => ({ waiting: /ожидает/.test(document.querySelector('#modal-combat').textContent), cards: document.querySelectorAll('.combat-enemy').length, bars: document.querySelectorAll('#modal-combat .hp-bar, #modal-combat .hp-track, #modal-combat [class*="hp"]').length, pressed: [...document.querySelectorAll('.combat-enemy[role="button"]')].map(c => c.getAttribute('aria-pressed')).join(',') }));
    await shot(page, 'B2'); rec('B2', (r.waiting && r.cards >= 3 && r.bars > 0) ? 'PASS' : 'FAIL', 'cards=' + r.cards + ' waiting pill=' + r.waiting + ' hp elements=' + r.bars + ' aria-pressed=' + r.pressed);
  });
  await check('B3', browser, null, async page => {
    await open(page, 38);
    const a = await ev(page, () => ({ img: !!document.querySelector('.illustration-container img'), shown: (() => { const c = document.querySelector('.illustration-container'); return c && c.offsetParent !== null; })(), pressed: document.getElementById('vp-art')?.getAttribute('aria-pressed') }));
    await page.locator('#vp-art').click(); await page.waitForTimeout(300);
    const b = await ev(page, () => ({ hidden: document.body.classList.contains('hide-inline-art') && document.querySelector('.illustration-container').offsetParent === null, pressed: document.getElementById('vp-art')?.getAttribute('aria-pressed') }));
    await shot(page, 'B3'); rec('B3', (a.img && a.shown && b.hidden && a.pressed === 'true' && b.pressed === 'false') ? 'PASS' : 'FAIL', 'art shown=' + a.shown + ' pressed=' + a.pressed + ' -> toggled hidden=' + b.hidden + ' pressed=' + b.pressed);
  });
  await check('C4', browser, null, async page => {
    let outcome = null;
    for (let attempt = 1; attempt <= 4 && !outcome; attempt++) {
      await open(page, 177); await clickText(page, /Вступить в бой/); await page.waitForTimeout(300);
      const copyBtn = page.locator('#modal-combat button', { hasText: /Заклятие Копии/ }).first(); if (!(await copyBtn.isVisible())) { const dbg = await ev(page, () => [...document.querySelectorAll('#modal-combat button')].map(b => b.textContent.trim().slice(0, 30) + (b.offsetParent === null ? '[hidden]' : '')).join(' / ')); rec('C4', 'BLOCKED', 'Copy button not visible at #177: ' + dbg); return; } await copyBtn.click(); await page.waitForTimeout(500);
      const r = await ev(page, () => ({ lion: combatState.enemies[0].hp, lioness: combatState.enemies[1].active, cont: [...document.querySelectorAll('#modal-combat button')].some(b => b.offsetParent !== null && /^Продолжить$/.test(b.textContent.trim())), joinedLine: /В бой вступает/.test(document.getElementById('combat-log').textContent) }));
      if (r.lion <= 0) outcome = r; else await page.evaluate(() => localStorage.clear());
    }
    await shot(page, 'C4');
    if (!outcome) rec('C4', 'UNCLEAR', 'the Copy never killed the lion in 4 attempts (dice)');
    else rec('C4', (outcome.lioness === true && !outcome.cont) ? 'PASS' : 'FAIL', 'lion killed by Copy -> lioness active=' + outcome.lioness + ' join line=' + outcome.joinedLine + ' premature Continue=' + outcome.cont);
  });

  await check('C22', browser, null, async page => {
    await open(page, 1); await ev(page, () => openMenu()); await page.waitForTimeout(300);
    await clickText(page, /Новая игра/, '#overlay-menu'); await page.waitForTimeout(300);
    const a = await ev(page, () => ({ on: document.getElementById('overlay-confirm').classList.contains('on'), title: document.getElementById('confirm-title').textContent.trim(), focus: document.activeElement && document.activeElement.id, native: false }));
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    const b = await ev(page, () => ({ off: !document.getElementById('overlay-confirm').classList.contains('on'), save: !!localStorage.getItem(SAVE_KEY), menuOn: document.getElementById('overlay-menu').classList.contains('on') }));
    await clickText(page, /Новая игра/, '#overlay-menu'); await page.waitForTimeout(300); await ev(page, () => history.replaceState(null, '', location.pathname)); await page.locator('#btn-confirm-yes').click(); await page.waitForTimeout(800);
    const c = await ev(page, () => ({ title: document.getElementById('scr-title')?.classList.contains('on'), save: !!localStorage.getItem(SAVE_KEY) }));
    await shot(page, 'C22'); rec('C22', (a.on && /Начать новую игру/.test(a.title) && a.focus === 'btn-confirm-yes' && b.off && b.save && b.menuOn && c.title && !c.save) ? 'PASS' : 'FAIL', 'confirm on=' + a.on + ' title="' + a.title + '" focus=' + a.focus + '; Esc: closed=' + b.off + ' save kept=' + b.save + ' menu still on=' + b.menuOn + '; Yes: title screen=' + c.title + ' save wiped=' + !c.save);
  });
  await browser.close();
  // ---- report ----
  const counts = results.reduce((m, r) => { m[r.verdict] = (m[r.verdict] || 0) + 1; return m; }, {});
  const md = ['# SMOKE_REPORT.md - automated live smoke (Playwright over the installed Chrome, headless)', '', '- URL: ' + URL, '- Date: ' + new Date().toISOString() + ' - run time ' + Math.round((Date.now() - t0) / 1000) + ' s', '- Viewports: desktop 1440x900; phone 412x915 (isMobile, touch); landscape 915x412', '- Mode: grey-box - real buttons/keys/F5 through the DOM, assertions through the DOM and the game globals (S, combatState); screenshots <id>.png next to this file', '', '| id | verdict | observation |', '|---|---|---|', ...results.map(r => '| ' + r.id + ' | ' + r.verdict + ' | ' + r.obs.replace(/\|/g, '\\|') + ' |'), '', '## Counts', '', Object.entries(counts).map(([k, v]) => '- ' + k + ': ' + v).join('\n'), '', '## Anomalies (page errors / console errors during the run)', '', anomalies.length ? [...new Set(anomalies)].map(a => '- ' + a).join('\n') : '- none', ''].join('\n');
  fs.writeFileSync(path.join(OUT, 'SMOKE_REPORT.md'), md, 'utf8');
  console.log('REPORT: ' + path.join(OUT, 'SMOKE_REPORT.md') + ' | ' + JSON.stringify(counts) + ' | anomalies=' + anomalies.length);
})().catch(e => { console.error('RUNNER FAILED: ' + e.stack); process.exit(1); });
