// 6e-2 harness — map UI strings resolve via t(); only dev-note Cyrillic remains in map_module.js.
const acorn=require('acorn'); const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const mapSrc=fs.readFileSync(path.join(REPO,'src','map_module.js'),'utf8');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const localeSrc=fs.readFileSync(path.join(REPO,'src','locale.ru.js'),'utf8');
const newKeys=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6e2_newkeys.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const CYR=/[\u0400-\u04FF]/;

globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
const tsrc=gl.match(/function t\(k\)\{[^\n]*\}/)[0].replace('function t(k)','globalThis.t=function(k)');
eval(tsrc);

// 1. new keys + resolve
ck('all '+Object.keys(newKeys).length+' new map-UI keys present', Object.keys(newKeys).every(k=>LOCALE_RU.ui[k]===newKeys[k]));
let tmis=0; for(const k in newKeys){ if(t(k)!==newKeys[k]) tmis++; }
ck('t(key) reproduces all new map-UI strings (mismatch '+tmis+')', tmis===0);
// reused literal keys resolve
ck("reused 'Герой' resolves", t('geroy')==='\u0413\u0435\u0440\u043e\u0439');
ck("reused 'Несовместимый формат' resolves", t('nesovmestimyy_format')==='\u041d\u0435\u0441\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u043c\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442');
ck("reused 'Ошибка загрузки' resolves", t('oshibka_zagruzki')==='\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438');

// 2. re-parse: only dev-note Cyrillic remains (inside data consts); no quasis
const ast=acorn.parse(mapSrc,{ecmaVersion:'latest',locations:true});
let excl=[];
(function find(n){ if(!n||typeof n!=='object'||!n.type)return;
  if(n.type==='VariableDeclarator'&&n.id&&(n.id.name==='BC_MAP_DEF'||n.id.name==='BC_MAP_STATE_TEMPLATE')&&n.init) excl.push([n.init.start,n.init.end]);
  for(const k in n){ if(k==='loc')continue; const v=n[k]; if(Array.isArray(v))v.forEach(find); else if(v&&typeof v==='object')find(v); } })(ast);
const inExcl=(s,e)=>excl.some(([a,b])=>s>=a&&e<=b);
const leftLit=[], leftQuasi=[];
(function walk(n,par){ if(!n||typeof n!=='object'||!n.type)return;
  if(n.type==='Literal'&&typeof n.value==='string'&&CYR.test(n.value)){
    const isPropKey=par&&par.type==='Property'&&par.key===n&&!par.computed;
    if(!isPropKey&&!inExcl(n.start,n.end)) leftLit.push({line:n.loc.start.line,v:n.value});
  }
  if(n.type==='TemplateLiteral') n.quasis.forEach(q=>{ if(CYR.test(q.value.raw)) leftQuasi.push({line:q.loc.start.line,raw:q.value.raw}); });
  for(const k in n){ if(k==='loc')continue; const v=n[k]; if(Array.isArray(v))v.forEach(c=>walk(c,n)); else if(v&&typeof v==='object')walk(v,n); } })(ast,null);
if(leftLit.length) leftLit.slice(0,8).forEach(x=>console.log('   LEFT LIT L'+x.line+': '+JSON.stringify(x.v)));
if(leftQuasi.length) leftQuasi.slice(0,8).forEach(x=>console.log('   LEFT QUASI L'+x.line+': '+JSON.stringify(x.raw.slice(0,60))));
ck('no Cyrillic UI string literals remain outside data consts (found '+leftLit.length+')', leftLit.length===0);
ck('no Cyrillic quasis remain (found '+leftQuasi.length+')', leftQuasi.length===0);

// 3. dev notes still present inside data consts (Cyrillic) — left intentionally
let defObj=null; { const ds=mapSrc.indexOf('const BC_MAP_DEF = '); const bs=mapSrc.indexOf('{',ds); let d=0,be=bs; for(;be<mapSrc.length;be++){ if(mapSrc[be]==='{')d++; else if(mapSrc[be]==='}'){d--; if(d===0){be++;break;}} } defObj=JSON.parse(mapSrc.slice(bs,be)); }
ck('dev notes (meta.notes) still Cyrillic in data', CYR.test(defObj.meta.notes.join(' ')));

// 4. spot: map uses t() interpolation + reused literal
ck("map uses ${t('sloy')} interpolation", mapSrc.includes("${t('sloy')}"));
ck("map uses t('geroy') for player fallback", mapSrc.includes("t('geroy')"));

console.log(`\n6e-2 HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
