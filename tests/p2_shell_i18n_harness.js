const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const shell=fs.readFileSync(path.join(REPO,'src','game_shell_top.html'),'utf8');
const locSrc=fs.readFileSync(path.join(REPO,'src','locale.ru.js'),'utf8');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const LOCALE_RU=JSON.parse(locSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
const ui=LOCALE_RU.ui;
let pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }

// 1. extract shell keys per attr ('data-i18n="' won't match 'data-i18n-html="' since next char is '-')
function keys(attr){ const re=new RegExp(attr+'="([^"]+)"','g'); const s=new Set(); let m; while(m=re.exec(shell)) s.add(m[1]); return s; }
const kText=keys('data-i18n'), kHtml=keys('data-i18n-html'), kPh=keys('data-i18n-ph'), kTitle=keys('data-i18n-title');
const kAria=keys('data-i18n-aria'); // UI-09 (group_79): aria-label channel
console.log('  shell keys: text='+kText.size+' html='+kHtml.size+' ph='+kPh.size+' title='+kTitle.size+' aria='+kAria.size);

// 2. coverage: every shell key exists in LOCALE_RU.ui
[['data-i18n',kText],['data-i18n-html',kHtml],['data-i18n-ph',kPh],['data-i18n-title',kTitle],['data-i18n-aria',kAria]].forEach(function(p){
  p[1].forEach(function(k){ ok(ui[k]!==undefined, p[0]+' key missing in ui: '+k); });
});
ok(ui['ui_doc_title']!==undefined,'ui_doc_title missing in ui');

// 3. structural: def + window export + onload hook + repaint hook
ok(/function\s+applyStaticI18n\s*\(\)\{/.test(gl),'applyStaticI18n def missing');
ok(gl.indexOf('window.applyStaticI18n=applyStaticI18n')!==-1,'window.applyStaticI18n export missing');
ok(gl.indexOf('renderSpellSel();renderAllLangPickers();applyStaticI18n();')!==-1,'onload hook missing');
ok(/try\{ renderAllLangPickers\(\); \}catch\(e\)\{\}\s*\n\s*try\{ applyStaticI18n\(\); \}catch\(e\)\{\}/.test(gl),'repaint hook missing');

// 4. round-trip: eval the REAL applyStaticI18n against DOM stubs, faithful RU t()
const block=gl.match(/function applyStaticI18n\(\)\{[\s\S]*?\n\}/)[0];
function mk(attr,k){ return { a:{}, _k:k, textContent:'<unset>', innerHTML:'<unset>',
  getAttribute:function(x){ return x===attr?k:null; }, setAttribute:function(x,v){ this.a[x]=v; } }; }
const elText=[...kText].map(function(k){return mk('data-i18n',k);});
const elHtml=[...kHtml].map(function(k){return mk('data-i18n-html',k);});
const elPh=[...kPh].map(function(k){return mk('data-i18n-ph',k);});
const elTitle=[...kTitle].map(function(k){return mk('data-i18n-title',k);});
const elAria=[...kAria].map(function(k){return mk('data-i18n-aria',k);});
const t=function(k){ return ui[k]!==undefined?ui[k]:k; };
const getLang=function(){ return 'ru'; };
const document={ _t:'', set title(v){this._t=v;}, get title(){return this._t;},
  documentElement:{ setAttribute:function(x,v){ this[x]=v; } },
  querySelectorAll:function(sel){
    if(sel==='[data-i18n]') return elText;
    if(sel==='[data-i18n-html]') return elHtml;
    if(sel==='[data-i18n-ph]') return elPh;
    if(sel==='[data-i18n-title]') return elTitle;
    if(sel==='[data-i18n-aria]') return elAria;
    return [];
  } };
eval(block+'\napplyStaticI18n();');
elText.forEach(function(e){ ok(e.textContent===ui[e._k], 'text roundtrip '+e._k); });
elHtml.forEach(function(e){ ok(e.innerHTML===ui[e._k], 'html roundtrip '+e._k); });
elPh.forEach(function(e){ ok(e.a.placeholder===ui[e._k], 'ph roundtrip '+e._k); });
elTitle.forEach(function(e){ ok(e.a.title===ui[e._k], 'title roundtrip '+e._k); });
elAria.forEach(function(e){ ok(e.a['aria-label']===ui[e._k], 'aria roundtrip '+e._k); });
ok(document.title===ui['ui_doc_title'],'document.title set');
ok(document.documentElement.lang==='ru','documentElement.lang set');

console.log('2C-SHELL HARNESS: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
