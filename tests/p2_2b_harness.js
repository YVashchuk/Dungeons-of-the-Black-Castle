// 2b harness — language switching, persistence, fallback, startup, structural guards.
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const mp=fs.readFileSync(REPO+'\\src\\map_module.js','utf8');
const localeSrc=fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8');
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };

// ---- stubs ----
globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
globalThis.S=null;
globalThis.window={};
globalThis.document={ getElementById:()=>null, querySelectorAll:()=>[], createElement:()=>({style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},appendChild(){},setAttribute(){}}), addEventListener(){} };
(function(){ const m=new Map(); globalThis.localStorage={ getItem:k=>m.has(k)?m.get(k):null, setItem:(k,v)=>m.set(k,String(v)), removeItem:k=>m.delete(k), _m:m }; })();
globalThis.renderGame=()=>{ globalThis.__renderGameCalled=(globalThis.__renderGameCalled||0)+1; };
globalThis.updateHUD=()=>{ globalThis.__updateHUDCalled=(globalThis.__updateHUDCalled||0)+1; };

// ---- slice + extract from source ----
function sliceInc(s,a,b){ const i=s.indexOf(a); const j=s.indexOf(b,i); if(i<0||j<0) throw new Error('slice not found: '+a); return s.slice(i,j+b.length); }
function extract(name){const s=gl.indexOf('function '+name+'(');let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
const regBlock=sliceInc(gl,'const LOCALES = {};','function getLang(){ return activeLang; }');
const block2b=sliceInc(gl,'// >>> BC_I18N_2B','// <<< BC_I18N_2B <<<');
const EXPOSE="globalThis.setLanguage=setLanguage;globalThis.applyLang=applyLang;globalThis.loadSavedLang=loadSavedLang;globalThis.availableLangs=availableLangs;globalThis.getLang=getLang;globalThis.getLangName=getLangName;globalThis.prefaceText=prefaceText;globalThis.pregameText=pregameText;globalThis.LOCALES=LOCALES;globalThis.__active=function(){return ACTIVE_LOCALE;};globalThis.t=t;";
eval(regBlock+"\n"+extract('prefaceText')+"\n"+extract('pregameText')+"\n"+extract('t')+"\n"+block2b+"\n"+EXPOSE);

const RU=globalThis.LOCALE_RU;
const ENDONYM_RU='\u0420\u0443\u0441\u0441\u043a\u0438\u0439'; // Русский

// ---- 1. registry/default state ----
ck("availableLangs() === ['ru']", JSON.stringify(availableLangs())===JSON.stringify(['ru']));
ck("getLang() === 'ru'", getLang()==='ru');
ck('ACTIVE_LOCALE === LOCALE_RU initially', __active()===RU);

// ---- 2. setLanguage validity + persistence ----
ck("setLanguage('ru') returns true", setLanguage('ru')===true);
ck("localStorage persisted lang='ru'", localStorage.getItem('blackcastle-lang')==='ru');
ck("setLanguage('xx') returns false (unregistered)", setLanguage('xx')===false);
ck("localStorage NOT overwritten by invalid", localStorage.getItem('blackcastle-lang')==='ru');

// ---- 3. loadSavedLang ----
localStorage.setItem('blackcastle-lang','ru'); ck("loadSavedLang() reads 'ru'", loadSavedLang()==='ru');
localStorage.setItem('blackcastle-lang','zz'); ck("loadSavedLang() falls back to 'ru' for unregistered", loadSavedLang()==='ru');
localStorage.removeItem('blackcastle-lang'); ck("loadSavedLang() default when unset", loadSavedLang()==='ru');

// ---- 4. switch to a synthetic registered locale (with its own langName endonym) ----
LOCALES.test={langName:'TestLang', ui:{__k:'TVAL'}, preface:'PREF_T', pregame:'PRE_T', p:{}, spells:{}, allies:{}, enemies:{}, map:{}};
ck("availableLangs() now includes 'test'", availableLangs().indexOf('test')>=0);
ck("setLanguage('test') true", setLanguage('test')===true);
ck("getLang()==='test'", getLang()==='test');
ck('ACTIVE_LOCALE === LOCALES.test', __active()===LOCALES.test);
ck("t('__k') resolves to active ('TVAL')", t('__k')==='TVAL');
ck("prefaceText() returns active preface", prefaceText()==='PREF_T');
ck("pregameText() returns active pregame", pregameText()==='PRE_T');
ck("getLangName('test') from locale langName", getLangName('test')==='TestLang');
ck("localStorage persisted 'test'", localStorage.getItem('blackcastle-lang')==='test');

// ---- 5. fallback: partial locale (no preface/pregame, missing ui key, no langName) ----
LOCALES.bare={ui:{}};
setLanguage('bare');
ck('prefaceText() falls back to RU', prefaceText()===RU.preface);
ck('pregameText() falls back to RU', pregameText()===RU.pregame);
ck('t() missing key falls back to RU', t(Object.keys(RU.ui)[0])===RU.ui[Object.keys(RU.ui)[0]]);
ck("getLangName('bare') passthrough when no langName", getLangName('bare')==='bare');

// ---- 6. reset to ru ----
setLanguage('ru');
ck('reset: getLang ru', getLang()==='ru');
ck('reset: prefaceText === RU.preface', prefaceText()===RU.preface);
ck('reset: ACTIVE_LOCALE === LOCALE_RU', __active()===RU);

// ---- 7. lang names (endonym from LOCALE_RU.langName; unregistered codes pass through) ----
ck("getLangName('ru') === RU.langName (Русский)", getLangName('ru')===RU.langName && getLangName('ru')===ENDONYM_RU);
ck("getLangName('en') passthrough (unregistered)", getLangName('en')==='en');
ck("getLangName(unknown) passthrough", getLangName('zz')==='zz');

// ---- 8. window exposures ----
ck('window.setLanguage is fn', typeof window.setLanguage==='function');
ck('window.availableLangs is fn', typeof window.availableLangs==='function');
ck('window.getLang is fn', typeof window.getLang==='function');
ck('window.getLangName is fn', typeof window.getLangName==='function');

// ---- 9. repaint dispatch (headless: not in game -> updateHUD; map helper guarded) ----
globalThis.__updateHUDCalled=0;
setLanguage('ru');
ck('repaintAfterLangSwitch calls updateHUD when not in game', globalThis.__updateHUDCalled>0);

// ---- 10. structural guards ----
ck('renderGame has repaint guard for applyBetting', gl.indexOf('if(!(opts&&opts.repaint)) applyBetting(sec);')!==-1);
ck('renderGame signature takes opts', gl.indexOf('function renderGame(opts){')!==-1);
ck('onload loads saved language first', /window\.onload=\(\)=>\{\s*applyLang\(loadSavedLang\(\),\{silent:true\}\);/.test(gl));
ck('map_module has window.bcRefreshMapLanguage', mp.indexOf('window.bcRefreshMapLanguage = function(activeLocale)')!==-1);
ck('map helper re-resolves via titleKey', mp.indexOf('if(o&&o.titleKey!==undefined) o.title=pick(o.titleKey);')!==-1);
ck('PREFACE/PREGAME consts removed (now functions)', gl.indexOf('const PREFACE_TEXT=')===-1 && gl.indexOf('const PREGAME_TEXT=')===-1);
ck('pregame/preface sites call helpers', gl.indexOf('renderPregameText();')!==-1 && gl.indexOf('renderPrefaceText();')!==-1);
ck('no hardcoded LANG_NAMES map in engine', gl.indexOf('LANG_NAMES')===-1);
ck('langName endonym present in LOCALE_RU (data file)', RU.langName===ENDONYM_RU && localeSrc.indexOf('"langName"')!==-1);
ck('getLangName reads LOCALES[code].langName', gl.indexOf('(LOCALES[code]&&LOCALES[code].langName)||code')!==-1);

console.log(`\n2b HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
