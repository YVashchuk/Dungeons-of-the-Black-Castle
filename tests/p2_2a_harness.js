// 2a harness — ACTIVE_LOCALE indirection: RU-default identity + per-key RU fallback.
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const gsSrc=fs.readFileSync(REPO+'\\src\\game_structure.js','utf8');
const localeSrc=fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8');
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };

globalThis.GD=JSON.parse(gsSrc.match(/const\s+GD\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);

// extract registry block + all 7 resolvers as one contiguous slice, eval together, expose to globalThis
globalThis.window={};globalThis.document={getElementById:()=>null,querySelectorAll:()=>[],createElement:()=>({style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},appendChild(){},setAttribute(){}}),addEventListener(){}};globalThis.localStorage=(function(){const m=new Map();return{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};})();globalThis.renderGame=()=>{};globalThis.updateHUD=()=>{};globalThis.S=null;
const block=gl.match(/const LOCALES = \{\};[\s\S]*?function enemyName\(k\)\{[^\n]*\}/)[0];
eval(block + "\n" + "globalThis.pText=pText;globalThis.label=label;globalThis.locSec=locSec;globalThis.spellText=spellText;globalThis.allyText=allyText;globalThis.t=t;globalThis.enemyName=enemyName;globalThis.availableLangs=availableLangs;globalThis.getLang=getLang;globalThis.__setActive=function(o,l){ACTIVE_LOCALE=o;activeLang=l;};globalThis.__getActive=function(){return ACTIVE_LOCALE;};");

const RU=globalThis.LOCALE_RU;
const someUi=Object.keys(RU.ui)[0];
const someAlly=Object.keys(RU.allies)[0];
const someEnemy=Object.keys(RU.enemies)[0];
// a riddle paragraph with rfl
const rflN=Object.keys(RU.p).find(k=>RU.p[k] && RU.p[k].rfl!==undefined);

// ---- 1. default state ----
ck('ACTIVE_LOCALE === LOCALE_RU by default', __getActive()===RU);
ck("getLang() === 'ru'", getLang()==='ru');
ck("availableLangs() === ['ru']", JSON.stringify(availableLangs())===JSON.stringify(['ru']));

// ---- 2. RU-default identity vs direct LOCALE_RU reads ----
ck('pText(1) matches LOCALE_RU', pText(1)===(RU.p['1']?RU.p['1'].t:''));
ck('pText(1220) matches LOCALE_RU', pText(1220)===(RU.p['1220']?RU.p['1220'].t:''));
ck('label(1,0) matches LOCALE_RU', label(1,0)===((RU.p['1']&&RU.p['1'].c&&RU.p['1'].c[0]!=null)?RU.p['1'].c[0]:''));
ck('locSec(1).text === pText(1)', locSec(1).text===pText(1));
let s1=locSec(1); ck('locSec(1) choice labels match label()', !s1.choices || s1.choices.every((c,i)=>c.label===label(1,i)));
ck('riddle locSec rfl matches LOCALE_RU ('+rflN+')', rflN ? (locSec(+rflN).riddle.fail_target_label===RU.p[rflN].rfl) : true);
ck('spellText(FIRE) matches LOCALE_RU', JSON.stringify(spellText('FIRE'))===JSON.stringify(RU.spells['FIRE']));
ck('allyText('+someAlly+') matches LOCALE_RU', JSON.stringify(allyText(someAlly))===JSON.stringify(RU.allies[someAlly]));
ck('t('+someUi+') matches LOCALE_RU', t(someUi)===RU.ui[someUi]);
ck("t('__nope__') returns key (miss)", t('__nope__')==='__nope__');
ck('enemyName('+someEnemy+') matches LOCALE_RU', enemyName(someEnemy)===RU.enemies[someEnemy]);
ck("enemyName('__nope__') returns key (miss)", enemyName('__nope__')==='__nope__');

// ---- 3. per-key fallback with a synthetic partial locale ----
__setActive({ui:{__t1:'XX'}, p:{}, spells:{}, allies:{}, enemies:{}}, 'xx');
ck("active ui key resolves to active value (t('__t1')==='XX')", t('__t1')==='XX');
ck('missing ui key falls back to RU', t(someUi)===RU.ui[someUi]);
ck('missing paragraph text falls back to RU', pText(1)===(RU.p['1']?RU.p['1'].t:''));
ck('missing enemy falls back to RU', enemyName(someEnemy)===RU.enemies[someEnemy]);
ck('missing spell falls back to RU', JSON.stringify(spellText('FIRE'))===JSON.stringify(RU.spells['FIRE']));
ck('missing ally falls back to RU', JSON.stringify(allyText(someAlly))===JSON.stringify(RU.allies[someAlly]));
ck("availableLangs() still ['ru'] (xx not registered)", JSON.stringify(availableLangs())===JSON.stringify(['ru']));
ck("getLang() === 'xx' after switch", getLang()==='xx');

// ---- 4. reset ----
__setActive(RU,'ru');
ck('reset: t() back to RU', t(someUi)===RU.ui[someUi]);
ck('reset: getLang() ru', getLang()==='ru');

console.log(`\n2a HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
