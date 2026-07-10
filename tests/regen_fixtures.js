// Regenerate the 4 battery goldens (deleted by the housekeeping sweep) from CURRENT verified sources,
// and drop a protective _BATTERY_README so this never happens again. Run:  node _handoff/_regen_fixtures.js
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const A=require('path').join(__dirname,'goldens');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const mapSrc=fs.readFileSync(REPO+'\\src\\map_module.js','utf8');
const L=JSON.parse(fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8').match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
function litAfter(src,decl,open,close){const s=src.indexOf(decl);const i=src.indexOf(open,s);let d=0;for(let j=i;j<src.length;j++){if(src[j]===open)d++;else if(src[j]===close){d--;if(d===0)return src.slice(i,j+1);}}}
// ---- 6b ----
const SPELLS=JSON.parse(litAfter(gl,'const SPELLS=','[',']'));
const ALLIES=JSON.parse(litAfter(gl,'const COMBAT_ALLIES=','{','}'));
const orig={
  spells_new:SPELLS,
  allies_new:ALLIES,
  spells:SPELLS.map(s=>({id:s.id,icon:s.icon,name:L.spells[s.id].name,full:L.spells[s.id].full})),
  allies:Object.fromEntries(Object.entries(ALLIES).map(([k,v])=>[k,Object.assign({},v,{name:L.allies[k].name,verb:L.allies[k].verb})])),
  preface:L.preface,
  pregame:L.pregame
};
fs.writeFileSync(A+'\\_6b_orig.json',JSON.stringify(orig),'utf8');
// ---- 6d ----
const rfl={};
for(const n in L.p){ if(L.p[n].rfl!==undefined) rfl[n]=L.p[n].rfl; }
fs.writeFileSync(A+'\\_6d_data.json',JSON.stringify({enemies:L.enemies,rfl:rfl}),'utf8');
// ---- 6e1 ----
fs.writeFileSync(A+'\\_6e1_map.json',JSON.stringify(L.map),'utf8');
// ---- 6e2 ----
const keys={};
for(const m of mapSrc.matchAll(/\bt\('([a-z0-9_]+)'\)/g)){ const k=m[1]; if(L.ui[k]!==undefined) keys[k]=L.ui[k]; }
fs.writeFileSync(A+'\\_6e2_newkeys.json',JSON.stringify(keys),'utf8');
console.log('regenerated: _6b_orig (spells '+SPELLS.length+', allies '+Object.keys(ALLIES).length+', preface '+L.preface.length+' ch), '+
 '_6d_data (enemies '+Object.keys(L.enemies).length+', rfl '+Object.keys(rfl).length+'), '+
 '_6e1_map ('+Object.keys(L.map).length+'), _6e2_newkeys ('+Object.keys(keys).length+')');
