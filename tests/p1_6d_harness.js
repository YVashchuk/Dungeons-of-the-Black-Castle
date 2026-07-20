// 6d harness — enemy names + riddle labels resolve; game_structure.js fully Cyrillic-free.
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
ck("enemyName('goblin')==='ГОБЛИН'", enemyName('goblin')==='\u0413\u041e\u0411\u041b\u0418\u041d');
ck('¶67 riddle exit label hydrated', locSec(67).riddle.fail_target_label===data.rfl['67']);

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

// 9g. group_78 G-12: pickups and food
ck('G-12 shapes exact', JSON.stringify(GD['159'].auto_items)==='{"items":["bronze_whistle","copper_bracelet"],"gold":3}' && JSON.stringify(GD['389'].auto_items)==='{"items":[{"food":"melon","stamina":4}]}' && JSON.stringify(GD['482'].auto_items.items)==='["rose","peacock_feather"]' && GD['582'].choices[0].pickup_batch.length===15 && GD['585'].choices[0].pickup_batch.length===2 && JSON.stringify(GD['724'].choices[0].pickup_batch)==='["rope","gold_arrow"]' && GD['801'].choices[0].pickup_batch.length===2 && GD['1140'].choices[0].pickup_batch.length===3);

// 9f. group_78 G-09/G-10: equipment + dragon potion
ck('G-09/G-10 data shapes exact', JSON.stringify(GD['35'].choices)==='[{"target":546},{"target":546,"acquires":"whole_sword"}]' && JSON.stringify(GD['71'].auto_items)==='{"items":["death_of_orcs"]}' && JSON.stringify(GD['1213'].auto_items)==='{"items":["knight_shield"]}' && JSON.stringify(GD['1130'].auto_items)==='{"dragon_strength":true}');

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
