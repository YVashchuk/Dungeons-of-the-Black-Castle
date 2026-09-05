// 6d harness â€” enemy names + riddle labels resolve; game_structure.js fully Cyrillic-free.
const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const remakeSrc=fs.readFileSync(path.join(REPO,'src','game_structure.js'),'utf8');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const localeSrc=fs.readFileSync(path.join(REPO,'src','locale.ru.js'),'utf8');
const data=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6d_data.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const CYR=/[\u0400-\u04FF]/;

globalThis.GD=JSON.parse(remakeSrc.match(/^\s*const\s+GD\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)[1]);
globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
function brace(s){let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
function gfn(n){const s=gl.indexOf('function '+n+'(');return brace(s).replace('function '+n+'(','globalThis.'+n+'=function(');}
[gfn('pText'),gfn('label'),gfn('locSec'),gfn('enemyName')].forEach(c=>eval(c));

// 1. game_structure.js fully Cyrillic-free
ck('game_structure.js GD has ZERO Cyrillic', !CYR.test(JSON.stringify(GD)));

// 2. enemies locale complete + resolver
ck('LOCALE_RU.enemies has all 66 keys with exact values', Object.keys(data.enemies).every(k=>LOCALE_RU.enemies[k]===data.enemies[k]) && Object.keys(LOCALE_RU.enemies).length===66);
let emis=0; for(const k in data.enemies){ if(enemyName(k)!==data.enemies[k]) emis++; }
ck('enemyName(slug) reproduces all 66 names (mismatch '+emis+')', emis===0);
ck('enemyName(unknown) safe', enemyName('__no__')==='__no__');

// 3. every GD enemy slug resolves to a known RU name
let unresolved=[]; for(const pk in GD){ const es=GD[pk].enemies; if(Array.isArray(es)) for(const e of es){ if(e&&e.name){ if(!(e.name in LOCALE_RU.enemies)) unresolved.push(pk+':'+e.name); if(CYR.test(e.name)) unresolved.push(pk+':CYR:'+e.name); } } }
ck('every GD enemies[].name is a resolvable slug (unresolved '+unresolved.length+')', unresolved.length===0);

// 4. riddle.fail_target_label removed from GD; rfl in locale; locSec hydrates
let gdHasLabel=0; for(const pk in GD){ if(GD[pk].riddle&&GD[pk].riddle.fail_target_label!==undefined) gdHasLabel++; }
ck('no riddle.fail_target_label left in GD', gdHasLabel===0);
let rflBad=0; for(const pk in data.rfl){ if(!LOCALE_RU.p[pk]||LOCALE_RU.p[pk].rfl!==data.rfl[pk]) rflBad++; }
ck('LOCALE_RU.p[n].rfl present for all 6 riddle paragraphs', rflBad===0);
// locSec hydrates fail_target_label back onto sec.riddle
let hydBad=0; for(const pk in data.rfl){ const sec=locSec(+pk); if(!sec.riddle||sec.riddle.fail_target_label!==data.rfl[pk]) hydBad++; }
ck('locSec hydrates riddle.fail_target_label for all 6 (mismatch '+hydBad+')', hydBad===0);
// locSec does NOT mutate GD (riddle hydration uses a copy)
const before=JSON.stringify(GD['67'].riddle); locSec(67); const after=JSON.stringify(GD['67'].riddle);
ck('locSec does not mutate GD riddle object', before===after && JSON.parse(before).fail_target_label===undefined);

// 5. spot
ck("enemyName('goblin')==='Ð“ÐžÐ‘Ð›Ð˜Ð'", enemyName('goblin')==='\u0413\u041e\u0411\u041b\u0418\u041d');
ck('Â¶67 riddle exit label hydrated', locSec(67).riddle.fail_target_label===data.rfl['67']);

// 6. group_74 (ChatGPT 5.6 audit C-01/C-02): canonical combat rosters restored
ck('GD[100] five bandits incl. chetvertyy 8/6', GD['100'].enemies.length===5 && GD['100'].enemies.some(e=>e.name==='chetvertyy_razboynik'&&e.skill===8&&e.stamina===6));
ck('GD[131] goblin + waiting orel, staged script', GD['131'].enemies.length===2 && GD['131'].enemies[1].name==='orel' && GD['131'].enemies[1].skill===7 && GD['131'].enemies[1].stamina===7 && GD['131'].combat_script==='sec131_eagle_joins');
ck('ui sec131 staged keys present (RU)', typeof LOCALE_RU.ui['snachala_vy_srazhaetes_tolko_s_g']==='string' && typeof LOCALE_RU.ui['orel_chasovoy_vyletaet_iz_nishi']==='string');

// 7. group_75 spell-economy completion: canonical combat-spell bans + on-tree penalty
ck('GD[250]/[474] all combat spells banned (no time to cast)', JSON.stringify(GD['250'].combat_spells_allowed)==='[]' && JSON.stringify(GD['474'].combat_spells_allowed)==='[]');
ck('GD[260] Vodyanoy bans COPY only', JSON.stringify(GD['260'].combat_spells_allowed)==='["FORCE","WEAKNESS"]');
ck('GD[235] modal restricted to COPY, nav spells kept', JSON.stringify(GD['235'].combat_spells_allowed)==='["COPY"]' && GD['235'].choices.filter(c=>c.spell).length===3);
ck('GD[528] on-tree penalty modelled', GD['528'].player_attack_mod===-1);

// 8. group_76 stale-backlog sweep: one-sided luck paragraphs are a closed adjudicated set
// (203/289/377/418/421/1186 canonically fatal via the generic death-overlay handler; 436 scripted).
// If this fails, a new one-sided luck paragraph entered GD and needs FB2 adjudication.
const oneSidedLuck=Object.keys(GD).filter(k=>{const cs=(GD[k].choices||[]).filter(c=>c.luck_type);return cs.length>0&&(cs.every(c=>c.luck_type==='lucky')||cs.every(c=>c.luck_type==='unlucky'));}).map(Number).sort((a,b)=>a-b);
ck('one-sided luck set is exactly the adjudicated seven', JSON.stringify(oneSidedLuck)==='[203,289,377,418,421,436,1186]');

// 9t. group_84 (SA-01 / SA-03 / SA-04 / CU-13 / CU-17 / CU-18): dock i18n + placement, fight-bound bridge buffs, riddle row, inert log panel, single picker rebuild
(function(){
  ck('SA-01/SA-03 dock pills carry data-i18n and the dock lives in the story column', gl.includes('<span data-i18n="atmosfera">')&&gl.includes('<span data-i18n="illyustracii">')&&gl.includes("(document.querySelector('#scr-game .main')||document.body).appendChild(dock);"));
  ck('SA-04 bridge buff stored with its section and consumed only there', gl.includes('S.pending_combat_buff={mod:ch.combat_mod,section:ch.target};')&&gl.includes('(pb.section===S.section)?pb.mod:null'));
  ck('CU-17/CU-14 log panel inert toggling and controller-owned phone focus', gl.includes('panel.inert=!on;')&&gl.includes("const ownedByController=(typeof _bcIsDialog==='function'&&_bcIsDialog(panel));"));
  ck('CU-18 language select rebuilt once and refocused', !gl.includes('setLanguage(code); renderAllLangPickers();')&&gl.includes("var again=document.getElementById(id); try{ if(again&&typeof again.focus==='function') again.focus({preventScroll:true}); }catch(e){}"));
})();

// 9s. group_83 PT-01: victory gates - story flags, negative gate, weightless hidden flags
(function(){
  const s81=GD['81'], s627=GD['627'], s976=GD['976'];
  ck('PT-01 sec.81 -> 1220 gated by princess_awake and sec.81 grants barlad_dead', s81.choices[0].target===1220&&s81.choices[0].inventory_condition==='princess_awake'&&Array.isArray(s81.auto_items&&s81.auto_items.flags)&&s81.auto_items.flags.includes('barlad_dead'));
  ck('PT-01 sec.627/976: -> 1120 only while Barlad lives, -> 1220 needs barlad_dead, both grant princess_awake', [s627,s976].every(s=>s.choices[0].target===1120&&s.choices[0].inventory_missing==='barlad_dead'&&s.choices[1].target===1220&&s.choices[1].inventory_condition==='barlad_dead'&&s.auto_items&&s.auto_items.flags&&s.auto_items.flags.includes('princess_awake')));
  try{
    globalThis.canonItem=globalThis.canonItem||function(x){return x;};
    globalThis.S={inventory:['barlad_dead']};
    eval(gfn('passesInventoryCheck'));
    ck('PT-01 inventory_missing hides the choice once the flag exists; positive gate and unconditioned choice unaffected', passesInventoryCheck({inventory_missing:'barlad_dead'})===false&&passesInventoryCheck({inventory_missing:'princess_awake'})===true&&passesInventoryCheck({inventory_condition:'barlad_dead'})===true&&passesInventoryCheck({target:1})===true);
    eval(gl.match(/const STORY_FLAGS=new Set\([^\n]*\);/)[0].replace('const STORY_FLAGS','globalThis.STORY_FLAGS'));
    eval(gl.match(/const ITEM_SIZES=\{[^\n]*\};/)[0].replace('const ITEM_SIZES','globalThis.ITEM_SIZES'));
    eval(gfn('getItemSize'));
    ck('PT-01 story flags are weightless and hidden from the bag / offer lists', getItemSize('princess_awake')===0&&getItemSize('barlad_dead')===0&&(gl.split('if(STORY_FLAGS.has(canonItem(item))) return;').length-1)>=2);
  }catch(e){ ck('PT-01 eval: '+e.message,false); }
})();

// 9r. group_82 batch 6 (CB-05 / CU-03 / CU-05): legacy Arbuz migration, phone event-log panel as a dialog, status reset clears text
(function(){
  try{
    globalThis.SLUG_TO_RU=globalThis.SLUG_TO_RU||{melon:'Арбуз'}; // the legacy RU name used by the CB-05 migration
    eval(gfn('normalizeSave'));
    const mig=normalizeSave({v:5,inventory:['Арбуз',{kind:'food',id:'melon',stamina:4},'apple']});
    ck('CB-05 legacy raw Arbuz string becomes the sec.300 watermelon item, food object untouched', mig.inventory[0]==='watermelon'&&mig.inventory[1]&&mig.inventory[1].id==='melon'&&mig.inventory[2]==='apple');
  }catch(e){ ck('CB-05 migration eval: '+e.message,false); }
  ck('CU-03/CU-05 phone panel in the dialog controller, reset clears the status text', gl.includes("el.id==='event-log-panel'&&typeof isMobileHud==='function'&&isMobileHud()")&&gl.includes("if(top.id==='event-log-panel'){")&&gl.includes("window._bcCombatStatusReset=function(){ seen=0; st.textContent=''; };"));
})();

// 9q. group_82 batch 5 (CB-02 / CB-03 / CB-04 / CU-01 / CU-02 / CU-12): scripted luck persistence, summon save, hash luck clear, focus guards, riddle status
(function(){
  ck('CB-02 scripted luck persisted with prep and restored in getSectionPrep', gl.includes('scripted:true,prep:JSON.parse(JSON.stringify(prep))')&&gl.includes('rec&&rec.scripted&&rec.prep')&&gl.includes("S.luckChecks[String(S.section)].scripted){ luckDone[S.section]=true;"));
  ck('CB-03 summon commit is saved immediately', /S\.summonsUsed\.push\(allyKey\);\s*\n\s*saveGame\(\);/.test(gl));
  ck('CB-04 hash entry clears a stale luck record', gl.includes('if(S.section!==tgt)S.luckChecks={};'));
  ck('CU-01 riddle focus guarded by the dialog stack', gl.includes("if(inp.isConnected&&!(typeof _bcTopDialog==='function'&&_bcTopDialog())) inp.focus({preventScroll:true});"));
  ck('CU-02 paragraph marker focused on a genuine section change', gl.includes("sn.setAttribute('tabindex','-1'); sn.focus({preventScroll:true});")&&gl.includes('if(!(opts&&opts.repaint)){'));
  ck('CU-12 riddle feedback is a live status', gl.includes("fb.setAttribute('role','status');fb.setAttribute('aria-live','polite');")&&gl.includes('bcAnnounce((feedback.textContent'));
})();

// 9p. group_81 batch 4 (B-05): items.json legacyRu values are unique (a duplicate key silently collapses the RU_TO_SLUG literal)
(function(){
  try{
    const reg=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
    const entries=Array.isArray(reg)?reg:(reg.items||reg);
    const names=(Array.isArray(entries)?entries:Object.values(entries)).map(x=>x&&x.legacyRu);
    const dup=names.filter((n,i)=>n&&names.indexOf(n)!==i);
    ck('B-05 items.json legacyRu unique (dups: '+dup.length+')', dup.length===0);
  }catch(e){ ck('B-05 items.json parse: '+e.message,false); }
})();

// 9o. group_81 batch 2 (B-01 / B-03 / B-07 / CA-01): weightless armament, scripted joins after non-round kills, persisted luck rolls, riddle container
(function(){
  try{
    globalThis.canonItem=globalThis.canonItem||function(x){return x;};
    eval(gl.match(/const ITEM_SIZES=\{[^\n]*\};/)[0].replace('const ITEM_SIZES','globalThis.ITEM_SIZES'));
    eval(gfn('getItemSize'));
    ck('B-01 getItemSize returns 0 for the three weapons, 2/3 for suit/carpet, 1 otherwise', getItemSize('whole_sword')===0&&getItemSize('death_of_orcs')===0&&getItemSize('knight_shield')===0&&getItemSize('diving_suit')===2&&getItemSize('flying_carpet')===3&&getItemSize('apple')===1);
  }catch(e){ ck('B-01 getItemSize eval: '+e.message,false); }
  try{
    globalThis.document=globalThis.document||{getElementById:function(){return null;}};
    globalThis.t=globalThis.t||function(k){return k;};
    globalThis.updateCombatEnemyDisplay=function(){};
    globalThis.promptCanon1175Luck=function(){ globalThis._p1175=(globalThis._p1175||0)+1; };
    eval(gfn('activateStagedJoins'));
    const cs={round:1,enemies:[{hp:0,active:true},{hp:7,active:false}],special:{type:'sec131',reinforcementsJoined:false}};
    const j=activateStagedJoins(cs);
    ck('B-03 sec131: eagle wakes when the goblin is dead regardless of the kill path', j===true&&cs.enemies[1].active===true&&cs.special.reinforcementsJoined===true);
    const cs2={round:1,enemies:[{hp:0,active:true},{hp:9,active:false},{hp:9,active:false}],special:{type:'sec1175',reinforcementsJoined:false,firstDeathHandled:false,luckChecked:false}};
    activateStagedJoins(cs2);
    ck('B-03/CB-01 sec1175: orcs 2-3 wake, first death handled and the luck check offered immediately (once)', cs2.enemies[1].active===true&&cs2.enemies[2].active===true&&cs2.special.firstDeathHandled===true&&globalThis._p1175===1);
  }catch(e){ ck('B-03 activateStagedJoins eval: '+e.message,false); }
  ck('B-07 luck roll persisted at roll time and restored in renderChoices', gl.includes("S.luckChecks[String(S.section)]={a:roll1,b:roll2,lucky:lucky};")&&gl.includes("luckResult[S.section]=S.luckChecks[String(S.section)].lucky?'lucky':'unlucky';"));
  ck('CA-01 renderRiddle renders into #c-list (no dead #choices container)', !gl.includes("getElementById('choices')")&&/function renderRiddle\(sec\)\{[\s\S]{0,400}getElementById\('c-list'\)/.test(gl));
})();

// 9n. group_80 X-04/R-01/R-03: closing batch (atomic sec436 spend, index plumbing, label sync)
(function(){
  ck('X-04 sec436_force consumed only in the fight onclick',
    gl.split('S.sec436_force=false').length-1===1 &&
    gl.includes('fightF.onclick=()=>{ S.sec436_force=false; saveGame(); startCombat(sec.enemies,{...sec, player_attack_mod:1, combat_spells_allowed:[]}); };'));
  ck('R-01 index plumbing: no index-less makeChoiceBtn, withIdx map, 4 e.idx sites',
    !gl.includes('makeChoiceBtn(ch))') &&
    gl.includes('const withIdx=sec.choices.map((ch,idx)=>({ch,idx}));') &&
    gl.split('makeChoiceBtn(e.ch,false,e.idx)').length-1===4);
  try{
    eval(gfn('normalizeSave'));
    const sim=normalizeSave({v:5,shopBought:{'340':[null,2],'99':'junk'},batchPicked:{'585:undefined':true,'585:2':true,'bad':true}});
    ck('R-01 migration: [null] pruned, junk dropped, bad batch keys deleted, real markers kept',
      JSON.stringify(sim.shopBought['340'])==='[2]' && !('99' in sim.shopBought) &&
      sim.batchPicked['585:2']===true && !('585:undefined' in sim.batchPicked) && !('bad' in sim.batchPicked));
  }catch(e){ ck('R-01 migration eval: '+e.message, false); }
  (function(){
    const md=fs.readFileSync(path.join(REPO,'assets','GAME_RULES.md'),'utf8');
    const lbl=(md.match(/\*\*v(\d+\.\d+)\*\*/)||[])[1];
    const reg=JSON.parse(fs.readFileSync(path.join(REPO,'assets','text_corrections.json'),'utf8'));
    const ks=Object.keys(reg.version_history||{});
    const tgt=((ks[ks.length-1]||'').match(/->\s*v(\d+\.\d+)\s*$/)||[])[1];
    ck('R-03 GAME_RULES.md label equals last registry transition ('+lbl+' == '+tgt+')', !!lbl&&!!tgt&&lbl===tgt);
  })();
})();

// 9m. group_80 V-04: dice persistence
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  ck('V-04 dice persistence: check record + loot roll + refusal commit', glSrc.split('diceCheckDone').length-1>=3 && glSrc.split('diceLootRoll').length-1>=4 && glSrc.includes('leaving without picking commits the refusal'));
})();

// 9l. group_80 V-03: weak-pick may target staged waiters
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  ck('V-03 staged weak-pick: pickable waiters + weakPickIdx consumption', glSrc.includes('const isPickable=(cs.pendingWeakPick&&e.hp>0&&!e.fled)') && glSrc.split('weakPickIdx').length-1>=4 && glSrc.includes('cs.enemies[cs.weakPickIdx]:tgtEnemy'));
})();

// 9k. group_80 X-01/X-02/X-03: combat lifecycle cluster
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  const resolved=glSrc.includes('function combatResolved')&&glSrc.split('combatResolved(').length-1>=7;
  const condBtn=glSrc.includes('function updateCombatConditionButtons')&&glSrc.includes("const cond=document.getElementById('combat-condition-btn')");
  const metFix=glSrc.includes('if(ch.combat_condition&&!ch.flee){')&&!glSrc.includes('&&!ch.flee&&combatCondMet(');
  const joinsEverywhere=glSrc.split('activateStagedJoins(cs);').length-1>=5;
  ck('X-01/02/03 lifecycle: resolved+condBtn+metFix+joins', resolved&&condBtn&&metFix&&joinsEverywhere);
})();

// 9j. group_80 V-02/G2-01: mandatory equip + weightless weapons
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  const ijr=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
  const zi=glSrc.indexOf('const ITEM_SIZES={');
  const sizes=glSrc.slice(zi,glSrc.indexOf('};',zi));
  const weapons=Object.keys(ijr).filter(k=>ijr[k].kind==='weapon');
  const weaponsZero=weapons.length===3 && weapons.every(k=>ijr[k].slotCost===0 && sizes.includes(k+':0'));
  ck('V-02/G2-01 equip shapes + weightless weapons parity', JSON.stringify(GD['71'].auto_items)==='{"equip":{"item":"death_of_orcs","swap_out":"whole_sword"}}' && JSON.stringify(GD['1213'].auto_items)==='{"equip":{"item":"knight_shield"}}' && weaponsZero && glSrc.includes('if(ai.equip){'));
})();

// 9i. group_80 V-01/R-02: food pipeline + slug map parity
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  const ijr=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
  const a=glSrc.indexOf('const SLUG_TO_RU={');
  const s2r=glSrc.slice(a,glSrc.indexOf('};',a));
  const b=glSrc.indexOf('const RU_TO_SLUG={');
  const r2s=glSrc.slice(b,glSrc.indexOf('};',b));
  const keysOk=Object.keys(ijr).every(k=>s2r.includes(k+':')||s2r.includes('"'+k+'":'));
  const namesOk=Object.keys(ijr).every(k=>r2s.includes(JSON.stringify(ijr[k].legacyRu)));
  ck('V-01/R-02 registry==runtime slug maps + normalization + eat-now', keysOk && namesOk && glSrc.includes("v.food)?{kind:'food',id:v.food,stamina:v.stamina}") && glSrc.includes('function eatFoundItem'));
})();

// 9h. group_78 G-13: gold and loot
ck('G-13 shapes exact', JSON.stringify(GD['486'].auto_items)==='{"gold":1,"luck_sub":1}' && JSON.stringify(GD['510'].auto_items)==='{"gold":85}' && JSON.stringify(GD['812'].choices[1])==='{"target":675,"gold_condition":2}' && JSON.stringify(GD['770'].auto_items)==='{"gold":4}' && JSON.stringify(GD['873'].choices[1])==='{"target":922,"gold_condition":1,"gold_cost":1}' && JSON.stringify(GD['922'].auto_items)==='{"stamina_add":2}');

// 9g. group_78 G-12: pickups and food
ck('G-12 shapes exact', JSON.stringify(GD['159'].auto_items)==='{"items":["bronze_whistle","copper_bracelet"],"gold":3}' && JSON.stringify(GD['389'].auto_items)==='{"items":[{"food":"melon","stamina":4}]}' && JSON.stringify(GD['482'].auto_items.items)==='["rose","peacock_feather"]' && GD['582'].choices[0].pickup_batch.length===15 && GD['585'].choices[0].pickup_batch.length===2 && JSON.stringify(GD['724'].choices[0].pickup_batch)==='["rope","gold_arrow"]' && GD['801'].choices[0].pickup_batch.length===2 && GD['1140'].choices[0].pickup_batch.length===3);

// 9f. group_78 G-09/G-10: equipment + dragon potion
ck('G-09/G-10 data shapes exact', JSON.stringify(GD['35'].choices)==='[{"target":546},{"target":546,"acquires":"whole_sword"}]' && JSON.stringify(GD['71'].auto_items)==='{"equip":{"item":"death_of_orcs","swap_out":"whole_sword"}}' && JSON.stringify(GD['1213'].auto_items)==='{"equip":{"item":"knight_shield"}}' && JSON.stringify(GD['1130'].auto_items)==='{"dragon_strength":true}');

// 9e. group_78 G-08: sixteen stat effects (auto_items)
ck('G-08 sixteen auto_items exact', JSON.stringify(GD['123'].auto_items)==='{"stamina_sub":5}' && JSON.stringify(GD['199'].auto_items)==='{"stamina_sub":9}' && JSON.stringify(GD['219'].auto_items)==='{"stamina_sub":2}' && JSON.stringify(GD['230'].auto_items)==='{"stamina_sub":8}' && JSON.stringify(GD['254'].auto_items)==='{"stamina_add":8}' && JSON.stringify(GD['273'].auto_items)==='{"stamina_sub":4}' && JSON.stringify(GD['278'].auto_items)==='{"stamina_sub":2}' && JSON.stringify(GD['522'].auto_items)==='{"luck_add":1}' && JSON.stringify(GD['525'].auto_items)==='{"stamina_sub":1}' && JSON.stringify(GD['561'].auto_items)==='{"stamina_sub":1}' && JSON.stringify(GD['606'].auto_items)==='{"stamina_add":6}' && JSON.stringify(GD['864'].auto_items)==='{"luck_add":1}' && JSON.stringify(GD['959'].auto_items)==='{"stamina_add":3}' && JSON.stringify(GD['981'].auto_items)==='{"stamina_add":7}' && JSON.stringify(GD['1036'].auto_items)==='{"skill_sub":1,"stamina_sub":2}' && JSON.stringify(GD['1061'].auto_items)==='{"stamina_add":7}');

// 9d. group_78 G-06/G-07: weakness bridges + double-spend fixes
ck('double-spend tags stripped at 526/1183/1021', JSON.stringify(GD['526'].choices)==='[{"target":436}]' && JSON.stringify(GD['1183'].choices)==='[{"target":532}]' && JSON.stringify(GD['1021'].choices)==='[{"target":715}]');
ck('weakness bridges carry ENEMY_WEAK_PICK at 470/116/655', GD['470'].choices[0].combat_mod==='ENEMY_WEAK_PICK' && GD['470'].choices[0].spell===undefined && GD['116'].choices[0].combat_mod==='ENEMY_WEAK_PICK' && GD['655'].choices[0].combat_mod==='ENEMY_WEAK_PICK');

// 9c. group_78 G-03: seven staged combats (declarative joins)
ck('staged joins exact at 177/388/588/617/628/742/790', JSON.stringify(GD['177'].enemies[1].joins)==='{"after_death":0}' && JSON.stringify(GD['388'].enemies[2].joins)==='{"round":11}' && JSON.stringify(GD['588'].enemies[1].joins)==='{"after_death":0}' && JSON.stringify(GD['617'].enemies[1].joins)==='{"after_death":0}' && JSON.stringify(GD['628'].enemies[1].joins)==='{"round":4,"after_death":0}' && JSON.stringify(GD['628'].enemies[2].joins)==='{"round":4,"after_death":0}' && JSON.stringify(GD['742'].enemies[2].joins)==='{"round":7}' && JSON.stringify(GD['742'].enemies[3].joins)==='{"after_deaths":2}' && JSON.stringify(GD['790'].enemies[5].joins)==='{"after_deaths":5}');
ck('617 flee gated to phase 2', JSON.stringify(GD['617'].choices[0])==='{"target":165,"flee":true,"combat_condition":"enemy_active_1"}');

// 9a. group_78 G-01/G-04: attack mods + early combat exits
ck('player_attack_mod -1 at 46/448/656/722', GD['46'].player_attack_mod===-1 && GD['448'].player_attack_mod===-1 && GD['656'].player_attack_mod===-1 && GD['722'].player_attack_mod===-1);
ck('early-exit conditions: 46 enemy_defeated_1, 994 wound_2, 532 intact', JSON.stringify(GD['46'].choices[0])==='{"target":98,"combat_condition":"enemy_defeated_1"}' && JSON.stringify(GD['994'].choices[1])==='{"target":118,"combat_condition":"wound_2"}' && JSON.stringify(GD['532'].choices[0])==='{"target":437,"combat_condition":"wound_2"}');

// 9b. group_78 G-11: dice resolvers (781/725/932)
ck('dice_check 781 exact', JSON.stringify(GD['781'].dice_check)==='{"dice":2,"gte":10,"win":863,"lose":126}');
ck('dice_bash on 725 choice to 1215', JSON.stringify(GD['725'].choices[1])==='{"target":1215,"dice_bash":{"cost_stamina":1}}');
ck('dice_loot 932 exact', JSON.stringify(GD['932'].dice_loot)==='{"item":"spider_larva","target":1123}');

// 9. group_78 G-02: canonical round-deadline routing (43/261/737/1099)
ck('round_deadline configs exact', JSON.stringify(GD['43'].round_deadline)==='{"rounds":10,"win":1082,"lose":1016}' && JSON.stringify(GD['261'].round_deadline)==='{"rounds":3,"win":520,"lose":8}' && JSON.stringify(GD['737'].round_deadline)==='{"rounds":5,"win":391,"lose":182}' && JSON.stringify(GD['1099'].round_deadline)==='{"rounds":3,"win":894,"lose":"death"}');

console.log(`\n6d HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
