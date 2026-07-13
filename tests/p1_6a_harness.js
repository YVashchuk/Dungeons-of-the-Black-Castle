// PHASE 1 / Increment 6a harness — locale resolvers reproduce original text + labels exactly.
const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const localeSrc=fs.readFileSync(path.join(REPO,'src','locale.ru.js'),'utf8');
const dataSrc=fs.readFileSync(path.join(REPO,'src','game_structure.js'),'utf8');
const orig=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6a_orig.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };

globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
globalThis.GD=JSON.parse(dataSrc.match(/const\s+GD\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)[1]);
function brace(s){let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
function gfn(n){const s=gl.indexOf('function '+n+'(');return brace(s).replace('function '+n+'(','globalThis.'+n+'=function(');}
[gfn('pText'),gfn('label'),gfn('locSec')].forEach(c=>eval(c));

// keys line up
ck('LOCALE_RU.p keys === data keys', JSON.stringify(Object.keys(LOCALE_RU.p).sort())===JSON.stringify(Object.keys(GD).sort()));
ck('data has no text field', Object.values(GD).every(d=>!('text' in d)));
ck('data has no choice label field', Object.values(GD).every(d=>(d.choices||[]).every(c=>!('label' in c))));

// resolvers reproduce originals across ALL paragraphs + labels
let textMis=0, labMis=0, locMis=0, structMis=0, nLab=0;
for(const k of Object.keys(orig)){
  const n=+k;
  if(pText(n)!==orig[k].t) textMis++;
  const ls=locSec(n);
  if(!ls||ls.text!==orig[k].t) locMis++;
  for(let i=0;i<orig[k].c.length;i++){
    nLab++;
    if(label(n,i)!==orig[k].c[i]) labMis++;
    if(!ls.choices||ls.choices[i].label!==orig[k].c[i]) locMis++;
  }
  // structural preservation: targets, scene, enemies survive hydration
  const gd=GD[k];
  if((gd.choices||[]).some((c,i)=>ls.choices[i].target!==c.target)) structMis++;
  if(gd.scene!==ls.scene) structMis++;
  if(gd.enemies!==ls.enemies) structMis++;       // same ref (shallow merge)
}
ck(`pText reproduces all ${Object.keys(orig).length} paragraph texts (mismatches ${textMis})`, textMis===0);
ck(`label reproduces all ${nLab} choice labels (mismatches ${labMis})`, labMis===0);
ck(`locSec reproduces text+labels (mismatches ${locMis})`, locMis===0);
ck(`locSec preserves structural fields target/scene/enemies (mismatches ${structMis})`, structMis===0);

// spot-check a known paragraph round-trips
const s1=locSec(1);
ck('§1 hydrated text non-empty + equals orig', s1.text===orig['1'].t && s1.text.length>0);
ck('§1 hydrated labels equal orig', JSON.stringify(s1.choices.map(c=>c.label))===JSON.stringify(orig['1'].c));
ck('missing paragraph -> pText empty string (no crash)', pText(99999)==='' && label(99999,0)==='');

console.log(`\n6a HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
