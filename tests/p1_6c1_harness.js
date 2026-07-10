// 6c-1 harness — every UI literal resolves via t(); only intended Cyrillic literals remain.
const acorn=require('acorn'); const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const localeSrc=fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8');
const keys=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6c1_keys.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const CYR=/[\u0400-\u04FF]/;
const ALPHABET="*\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042b\u042c\u042d\u042e\u042f";

globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
// t() resolver
function brace(s){let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
const tsrc=gl.match(/function t\(k\)\{[^\n]*\}/)[0].replace('function t(k)','globalThis.t=function(k)');
eval(tsrc);

// 1. ui completeness
ck('LOCALE_RU.ui present', LOCALE_RU.ui && typeof LOCALE_RU.ui==='object');
ck('ui has all 144 (6c-1) keys with exact values', Object.keys(keys).every(k=>LOCALE_RU.ui[k]===keys[k]));

// 2. t() reproduces every value; safe on miss
let tmis=0; for(const k in keys){ if(t(k)!==keys[k]) tmis++; }
ck('t(key) reproduces all '+Object.keys(keys).length+' values (mismatch '+tmis+')', tmis===0);
ck('t(miss) returns key', t('__no_such_key__')==='__no_such_key__');

// 3. re-parse NEW engine: only intended Cyrillic string literals remain
const ast=acorn.parse(gl,{ecmaVersion:'latest',locations:true});
let slugStart=-1,slugEnd=-1;
(function find(n){ if(!n||typeof n!=='object'||!n.type)return;
  if(n.type==='VariableDeclarator'&&n.id&&n.id.name==='SLUG_TO_RU'&&n.init){slugStart=n.init.start;slugEnd=n.init.end;}
  for(const k in n){if(k==='loc')continue;const v=n[k];if(Array.isArray(v))v.forEach(find);else if(v&&typeof v==='object')find(v);} })(ast);
const leftover=[];
(function walk(n,par){ if(!n||typeof n!=='object'||!n.type)return;
  if(n.type==='Literal'&&typeof n.value==='string'&&CYR.test(n.value)){
    const isPropKey=par&&par.type==='Property'&&par.key===n&&!par.computed;
    const inSlug=n.start>=slugStart&&n.end<=slugEnd;
    const isLogic=(n.value===ALPHABET)||(n.value==='\u0415');
    if(!isPropKey&&!inSlug&&!isLogic) leftover.push({line:n.loc.start.line,value:n.value});
  }
  for(const k in n){if(k==='loc')continue;const v=n[k];if(Array.isArray(v))v.forEach(c=>walk(c,n));else if(v&&typeof v==='object')walk(v,n);} })(ast,null);
if(leftover.length) leftover.slice(0,10).forEach(x=>console.log('   LEFTOVER L'+x.line+': '+JSON.stringify(x.value)));
ck('no unextracted Cyrillic string literals remain (found '+leftover.length+')', leftover.length===0);

// 4. spot-checks: specific known strings round-trip
ck("' золотых' resolves", t('zolotyh')===' \u0437\u043e\u043b\u043e\u0442\u044b\u0445');
ck("'Продолжить' resolves", t('prodolzhit')==='\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c');
ck("HTML-wrapped value kept whole", t('podzemelya_chernogo_zamka').includes('<div class="t-main">'));

console.log(`\n6c-1 HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
