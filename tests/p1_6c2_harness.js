// 6c-2 harness — every quasi fragment resolves via t(); zero Cyrillic quasis remain.
const acorn=require('acorn'); const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const localeSrc=fs.readFileSync(path.join(REPO,'src','locale.ru.js'),'utf8');
const newKeys=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6c2_newkeys.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const CYR=/[\u0400-\u04FF]/;

globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
const tsrc=gl.match(/function t\(k\)\{[^\n]*\}/)[0].replace('function t(k)','globalThis.t=function(k)');
eval(tsrc);

// 1. new keys present + resolve
ck('all '+Object.keys(newKeys).length+' new (6c-2) keys present with exact values', Object.keys(newKeys).every(k=>LOCALE_RU.ui[k]===newKeys[k]));
let tmis=0; for(const k in newKeys){ if(t(k)!==newKeys[k]) tmis++; }
ck('t(key) reproduces all new quasi fragments (mismatch '+tmis+')', tmis===0);

// 2. re-parse: ZERO Cyrillic quasis remain (completeness)
const ast=acorn.parse(gl,{ecmaVersion:'latest',locations:true});
const leftQuasi=[];
(function walk(n){ if(!n||typeof n!=='object'||!n.type)return;
  if(n.type==='TemplateLiteral') n.quasis.forEach(q=>{ if(CYR.test(q.value.raw)) leftQuasi.push({line:q.loc.start.line,raw:q.value.raw}); });
  for(const k in n){ if(k==='loc')continue; const v=n[k]; if(Array.isArray(v))v.forEach(walk); else if(v&&typeof v==='object')walk(v); } })(ast);
if(leftQuasi.length) leftQuasi.slice(0,12).forEach(x=>console.log('   LEFTOVER QUASI L'+x.line+': '+JSON.stringify(x.raw.slice(0,80))));
ck('no Cyrillic quasis remain (found '+leftQuasi.length+')', leftQuasi.length===0);

// 3. spot: reused key from 6c-1 still works; a combat fragment resolves
ck("reused key ' зол.' resolves", t('zol')===' \u0437\u043e\u043b.');
const pobedaKey=Object.keys(newKeys).find(k=>newKeys[k].includes('\u041f\u043e\u0431\u0435\u0434\u0430')); // Победа
ck('a combat quasi fragment (Победа) is keyed', !!pobedaKey && t(pobedaKey).includes('\u041f\u043e\u0431\u0435\u0434\u0430'));

console.log(`\n6c-2 HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
