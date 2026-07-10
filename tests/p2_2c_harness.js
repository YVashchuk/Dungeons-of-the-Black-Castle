// 2c harness — language picker UI (renderLangPicker/renderAllLangPickers) + structural guards.
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const shell=fs.readFileSync(REPO+'\\src\\game_shell_top.html','utf8');
const reg=fs.readFileSync(REPO+'\\assets\\text_corrections.json','utf8');
const localeSrc=fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8');
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };

// ---- DOM stub that captures appended children ----
function makeEl(){
  const el={children:[], style:{}, _attrs:{}, _text:'', _html:'', onclick:null};
  Object.defineProperty(el,'textContent',{get(){return el._text;},set(v){el._text=v;}});
  Object.defineProperty(el,'innerHTML',{get(){return el._html;},set(v){el._html=v; if(v==='') el.children=[];}});
  el.style.cssText='';
  el.setAttribute=(k,v)=>{el._attrs[k]=v;};
  el.getAttribute=(k)=>el._attrs[k];
  el.appendChild=(c)=>{el.children.push(c); return c;};
  el.classList={add(){},remove(){},toggle(){},contains(){return false;}};
  return el;
}
const containers={};
globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
globalThis.S=null;
globalThis.window={};
globalThis.document={ getElementById:(id)=>{ if(id==='__null__') return null; if(!containers[id]) containers[id]=makeEl(); return containers[id]; }, createElement:()=>makeEl(), querySelectorAll:()=>[], addEventListener(){} };
(function(){ const m=new Map(); globalThis.localStorage={ getItem:k=>m.has(k)?m.get(k):null, setItem:(k,v)=>m.set(k,String(v)), removeItem:k=>m.delete(k) }; })();
globalThis.renderGame=()=>{}; globalThis.updateHUD=()=>{};

// ---- slice + extract ----
function sliceInc(s,a,b){ const i=s.indexOf(a); const j=s.indexOf(b,i); if(i<0||j<0) throw new Error('slice not found: '+a); return s.slice(i,j+b.length); }
function extract(name){const s=gl.indexOf('function '+name+'(');let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
const regBlock=sliceInc(gl,'const LOCALES = {};','function getLang(){ return activeLang; }');
const block2b=sliceInc(gl,'// >>> BC_I18N_2B','// <<< BC_I18N_2B <<<');
const block2c=sliceInc(gl,'// >>> BC_I18N_2C','// <<< BC_I18N_2C <<<');
const EXPOSE="globalThis.setLanguage=setLanguage;globalThis.availableLangs=availableLangs;globalThis.getLang=getLang;globalThis.getLangName=getLangName;globalThis.renderLangPicker=renderLangPicker;globalThis.renderAllLangPickers=renderAllLangPickers;globalThis.LOCALES=LOCALES;";
eval(regBlock+"\n"+extract('prefaceText')+"\n"+extract('pregameText')+"\n"+extract('t')+"\n"+block2b+"\n"+block2c+"\n"+EXPOSE);

const RU=globalThis.LOCALE_RU;
const ENDONYM_RU='\u0420\u0443\u0441\u0441\u043a\u0438\u0439'; // Русский
const GLOBE='\ud83c\udf10';
const btns=el=>el.children.filter(c=>c._attrs && c._attrs['data-lang']!==undefined);

// ---- 1. default (ru only): globe + one endonym button, highlighted ----
setLanguage('ru');
renderLangPicker('lang-pick-title');
const t1=containers['lang-pick-title'];
ck('title picker: globe + 1 button (2 children)', t1.children.length===2);
ck('first child is globe marker', t1.children[0]._text===GLOBE);
ck('lang button text is RU endonym', btns(t1)[0]._text===ENDONYM_RU);
ck('current lang button highlighted (gold border)', /var\(--gold\)/.test(btns(t1)[0].style.cssText));
ck("button carries data-lang='ru'", btns(t1)[0]._attrs['data-lang']==='ru');

// ---- 2. two locales: both buttons, only current highlighted ----
LOCALES.en={langName:'English', ui:{}, p:{}, spells:{}, allies:{}, enemies:{}, map:{}};
renderAllLangPickers();
const t2=containers['lang-pick-title'], m2=containers['lang-pick-menu'];
ck('title picker now has 2 lang buttons', btns(t2).length===2);
ck('menu picker also rendered (2 lang buttons)', btns(m2).length===2);
const ruBtn=btns(t2).find(b=>b._attrs['data-lang']==='ru');
const enBtn=btns(t2).find(b=>b._attrs['data-lang']==='en');
ck('ru button present with endonym', ruBtn && ruBtn._text===ENDONYM_RU);
ck('en button present with endonym', enBtn && enBtn._text==='English');
ck('current (ru) highlighted', /var\(--gold\)/.test(ruBtn.style.cssText));
ck('non-current (en) NOT highlighted', !/border:1px solid var\(--gold\)/.test(enBtn.style.cssText));

// ---- 3. click en button -> switches language + re-highlights ----
enBtn.onclick();
ck("click en -> getLang()==='en'", getLang()==='en');
ck('localStorage persisted en', localStorage.getItem('blackcastle-lang')==='en');
const t3=containers['lang-pick-title'];
const enBtn3=btns(t3).find(b=>b._attrs['data-lang']==='en');
const ruBtn3=btns(t3).find(b=>b._attrs['data-lang']==='ru');
ck('after click: en now highlighted', /var\(--gold\)/.test(enBtn3.style.cssText));
ck('after click: ru no longer highlighted', !/border:1px solid var\(--gold\)/.test(ruBtn3.style.cssText));

// ---- 4. missing container is a no-op (guard) ----
let threw=false; try{ renderLangPicker('__null__'); }catch(e){ threw=true; }
ck('renderLangPicker on missing container does not throw', !threw);

// reset
setLanguage('ru'); delete LOCALES.en;

// ---- 5. structural guards ----
ck('2c block present in gl', gl.indexOf('BC_I18N_2C')!==-1);
ck('renderLangPicker + renderAllLangPickers defined', gl.indexOf('function renderLangPicker(')!==-1 && gl.indexOf('function renderAllLangPickers(')!==-1);
ck('onload renders pickers', gl.indexOf('initTitle();renderSpellSel();renderAllLangPickers();')!==-1);
ck('repaint refreshes pickers', /renderPrefaceText\(\); \}catch\(e\)\{\}\s*\n\s*try\{ renderAllLangPickers\(\); \}catch\(e\)\{\}/.test(gl));
ck('picker exposed on window', gl.indexOf('window.renderLangPicker=renderLangPicker;')!==-1 && gl.indexOf('window.renderAllLangPickers=renderAllLangPickers;')!==-1);
ck('shell has #lang-pick-title', shell.indexOf('id="lang-pick-title"')!==-1);
ck('shell has #lang-pick-menu', shell.indexOf('id="lang-pick-menu"')!==-1);
ck('title picker placed before .t-author', shell.indexOf('id="lang-pick-title"') < shell.indexOf('class="t-author"'));
ck('menu picker placed before export button', shell.indexOf('id="lang-pick-menu"') < shell.indexOf('onclick="exportSave()"'));
ck('registry group_68 added', reg.indexOf('group_68_2026_06_18_i18n_phase2c_picker_and_shell')!==-1);
ck('registry group_68 has picker_functional_rework TODO', reg.indexOf('"picker_functional_rework"')!==-1);
ck('registry group_68 has shell_chrome_i18n_gap TODO', reg.indexOf('"shell_chrome_i18n_gap"')!==-1);
ck('registry still valid JSON', (()=>{try{JSON.parse(reg);return true;}catch(e){return false;}})());
ck('registry last_updated bumped', (function(){ var m=reg.match(/"last_updated": "(\d{4}-\d{2}-\d{2})"/); return !!m && m[1]>='2026-06-18'; })());

console.log(`\n2c HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
