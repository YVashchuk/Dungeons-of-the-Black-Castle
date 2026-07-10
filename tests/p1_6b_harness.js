// PHASE 1 / Increment 6b harness — spell/ally/preface/pregame text reproduced from LOCALE_RU.
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const localeSrc=fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8');
const orig=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6b_orig.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };

globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
function litAfter(src,decl,open,close){const s=src.indexOf(decl);const i=src.indexOf(open,s);let d=0;for(let j=i;j<src.length;j++){if(src[j]===open)d++;else if(src[j]===close){d--;if(d===0)return src.slice(i,j+1);}}}
const SPELLS=JSON.parse(litAfter(gl,'const SPELLS=','[',']'));
const COMBAT_ALLIES=JSON.parse(litAfter(gl,'const COMBAT_ALLIES=','{','}'));
function brace(s){let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
function gfn(n){const s=gl.indexOf('function '+n+'(');return brace(s).replace('function '+n+'(','globalThis.'+n+'=function(');}
[gfn('spellText'),gfn('allyText'),gfn('prefaceText'),gfn('pregameText')].forEach(c=>eval(c));
const PREFACE_TEXT=prefaceText();
const PREGAME_TEXT=pregameText();

// slim consts preserve structural fields exactly
ck('SPELLS slimmed to [{id,icon}] x8 (matches orig structural)', JSON.stringify(SPELLS)===JSON.stringify(orig.spells_new));
ck('COMBAT_ALLIES slimmed to {skill,stamina,scope,icon} (matches orig structural)', JSON.stringify(COMBAT_ALLIES)===JSON.stringify(orig.allies_new));
ck('SPELLS has no name/full now', SPELLS.every(s=>!('name' in s)&&!('full' in s)));
ck('COMBAT_ALLIES has no name/verb now', Object.values(COMBAT_ALLIES).every(a=>!('name' in a)&&!('verb' in a)));

// icons + stats preserved vs original
let iconMis=0; orig.spells.forEach((s,i)=>{ if(SPELLS[i].id!==s.id||SPELLS[i].icon!==s.icon) iconMis++; });
ck('spell id+icon order/values preserved', iconMis===0);
let allyStructMis=0; for(const k in orig.allies){const o=orig.allies[k],n=COMBAT_ALLIES[k]; if(!n||n.skill!==o.skill||n.stamina!==o.stamina||n.scope!==o.scope||n.icon!==o.icon) allyStructMis++;}
ck('ally skill/stamina/scope/icon preserved', allyStructMis===0);

// resolvers reproduce text exactly
let snMis=0,sfMis=0; orig.spells.forEach(s=>{ if(spellText(s.id).name!==s.name) snMis++; if(spellText(s.id).full!==s.full) sfMis++; });
ck(`spellText reproduces all 8 spell names (mismatches ${snMis})`, snMis===0);
ck(`spellText reproduces all 8 spell full-descriptions (mismatches ${sfMis})`, sfMis===0);
let anMis=0,avMis=0; for(const k in orig.allies){ if(allyText(k).name!==orig.allies[k].name) anMis++; if(allyText(k).verb!==orig.allies[k].verb) avMis++; }
ck(`allyText reproduces ally names (mismatches ${anMis})`, anMis===0);
ck(`allyText reproduces ally verbs (mismatches ${avMis})`, avMis===0);

// preface/pregame consts resolve from locale to the originals
ck('PREFACE_TEXT (locale-sourced) === original', PREFACE_TEXT===orig.preface && PREFACE_TEXT.length>50);
ck('PREGAME_TEXT (locale-sourced) === original', PREGAME_TEXT===orig.pregame && PREGAME_TEXT.length>50);

// safety on unknown keys
ck('spellText(unknown) safe', spellText('NOPE').name===''&&spellText('NOPE').full==='');
ck('allyText(unknown) safe', allyText('nope').name===''&&allyText('nope').verb==='');

// spot: a specific known value round-trips
ck('FORCE name=Сила via resolver', spellText('FORCE').name==='Сила');
ck('magic_bell name=Медведь via resolver', allyText('magic_bell').name==='Медведь');

console.log(`\n6b HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
