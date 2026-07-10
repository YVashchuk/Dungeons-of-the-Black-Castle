// 6e-1 harness — map titles slugged in source; resolve-at-load loop restores RU; dev notes untouched.
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const mapSrc=fs.readFileSync(REPO+'\\src\\map_module.js','utf8');
const localeSrc=fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8');
const mapLoc=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6e1_map.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const CYR=/[\u0400-\u04FF]/;

globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
// extract BC_MAP_DEF (brace match) from new source
const ds=mapSrc.indexOf('const BC_MAP_DEF = '); const bs=mapSrc.indexOf('{',ds); let d=0,be=bs;
for(;be<mapSrc.length;be++){ if(mapSrc[be]==='{')d++; else if(mapSrc[be]==='}'){d--; if(d===0){be++;break;}} }
const defText=mapSrc.slice(bs,be);
globalThis.BC_MAP_DEF=JSON.parse(defText);

// 1. LOCALE_RU.map complete
ck('LOCALE_RU.map has all 43 keys with exact values', Object.keys(mapLoc).every(k=>LOCALE_RU.map[k]===mapLoc[k]) && Object.keys(LOCALE_RU.map).length===43);

// 2. source titles are slugs (Latin, in LOCALE_RU.map), no Cyrillic
let cyrTitle=0, badSlug=0;
Object.values(BC_MAP_DEF.layers).forEach(o=>{ if(CYR.test(o.title))cyrTitle++; if(!(o.title in LOCALE_RU.map))badSlug++; });
BC_MAP_DEF.nodes.forEach(o=>{ if(CYR.test(o.title))cyrTitle++; if(!(o.title in LOCALE_RU.map))badSlug++; });
(BC_MAP_DEF.encounters||[]).forEach(o=>{ if(CYR.test(o.title))cyrTitle++; if(!(o.title in LOCALE_RU.map))badSlug++; });
ck('all titles in source are Cyrillic-free slugs', cyrTitle===0);
ck('every source title slug is in LOCALE_RU.map', badSlug===0);

// 3. resolve-loop present + functional
const ls=mapSrc.indexOf('(function(){ if(typeof LOCALE_RU'); const le=mapSrc.indexOf('})();', ls)+5;
ck('resolve-at-load loop present', ls>=0);
const loopSrc=mapSrc.slice(ls,le);
// before: a known title is a slug
const beforeOw=BC_MAP_DEF.layers.overworld.title;
eval(loopSrc); // mutates BC_MAP_DEF titles -> RU, sets titleKey
ck('before loop overworld title was slug', beforeOw==='vneshniy_mir');
ck('after loop overworld title is RU', BC_MAP_DEF.layers.overworld.title==='\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u043c\u0438\u0440');
ck('after loop overworld titleKey is slug', BC_MAP_DEF.layers.overworld.titleKey==='vneshniy_mir');
// every node/layer/encounter: title===map[titleKey], titleKey in map
let resBad=0;
function chk(o){ if(!o.titleKey||!(o.titleKey in LOCALE_RU.map)||o.title!==LOCALE_RU.map[o.titleKey]) resBad++; }
Object.values(BC_MAP_DEF.layers).forEach(chk); BC_MAP_DEF.nodes.forEach(chk); (BC_MAP_DEF.encounters||[]).forEach(chk);
ck('after loop every title===LOCALE_RU.map[titleKey] (bad '+resBad+')', resBad===0);

// 4. dev notes left untouched (still Cyrillic) — not user-facing
ck('meta.notes still Cyrillic (dev metadata left)', CYR.test(BC_MAP_DEF.meta.notes.join(' ')) && BC_MAP_DEF.meta.notes.length===3);

// 5. spot
ck("map slug pokoi_princessy -> Покои Принцессы", LOCALE_RU.map['pokoi_princessy']==='\u041f\u043e\u043a\u043e\u0438 \u041f\u0440\u0438\u043d\u0446\u0435\u0441\u0441\u044b');

console.log(`\n6e-1 HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
