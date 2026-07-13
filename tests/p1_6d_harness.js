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

console.log(`\n6d HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
