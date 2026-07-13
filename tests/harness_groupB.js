// Group B harness — real passesInventoryCheck + getSpellRemaining from game_logic.js.
// Item-identity assertions compare via canonItem so they are robust to the RU->slug data flip (5d).
const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const GD=JSON.parse(fs.readFileSync(path.join(REPO,'src','game_structure.js'),'utf8').replace(/^\s*const GD\s*=\s*/,'').replace(/;\s*$/,''));
function extract(name){const s=gl.indexOf('function '+name+'(');let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
function extractConst(name){const s=gl.indexOf('const '+name+'=');let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j)+';';}
var S=null;
eval(extractConst('RU_TO_SLUG')+'\n'+extractConst('SLUG_TO_RU')+'\n'+extract('canonItem')+'\n'+extract('passesInventoryCheck')+'\n'+extract('getSpellRemaining'));

const g=(p,t)=>GD[String(p)].choices.find(c=>c.target===t);
let pass=0,fail=0; const check=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const inv=(...x)=>{S={inventory:x,spells:(S&&S.spells)||[]};};
const spells=(...ids)=>{S={inventory:(S&&S.inventory)||[],spells:ids.map(id=>({id,remaining:1}))};};
const ci=x=>x==null?x:canonItem(x);                       // canon-normalize one item ref
const ciArr=a=>JSON.stringify((a||[]).map(canonItem));    // canon-normalize an items[] array

console.log('# Pearl §457/§468');
check('§457 grants Чёрная жемчужина (auto_items)', ciArr(GD['457'].auto_items.items)===ciArr(['Чёрная жемчужина']));
inv(); check('§468->482 hidden w/o pearl', passesInventoryCheck(g(468,482))===false);
inv('Чёрная жемчужина'); check('§468->482 shown w/ pearl', passesInventoryCheck(g(468,482))===true);
check('§468->482 NOT consumed (reusable death-ray)', !g(468,482).consume_on_use);
inv(); check('§468->46 (fight fallback) always visible', passesInventoryCheck(g(468,46))===true);
inv(); check('§468->368 (FIRE fallback) always visible', passesInventoryCheck(g(468,368))===true);
check('§457->156 unconditional', passesInventoryCheck(g(457,156))===true);

console.log('# Plaque §662/§1196/§604 + arrow consume');
check('§662 grants Бляха с золотым орлом (auto_items)', ciArr(GD['662'].auto_items.items)===ciArr(['Бляха с золотым орлом']));
inv(); check('§1196->604 hidden w/o plaque', passesInventoryCheck(g(1196,604))===false);
inv('Бляха с золотым орлом'); check('§1196->604 shown w/ plaque', passesInventoryCheck(g(1196,604))===true);
check('§1196->604 consumes plaque', ci(g(1196,604).consume_on_use)===ci('Бляха с золотым орлом'));
check('§1196->871 still gated on Белая стрела', ci(g(1196,871).inventory_condition)===ci('Белая стрела'));
check('§1196->871 NOW consumes Белая стрела (parallel fix)', ci(g(1196,871).consume_on_use)===ci('Белая стрела'));
inv(); check('§1196->995/266/886 plain doors always visible',
  passesInventoryCheck(g(1196,995))&&passesInventoryCheck(g(1196,266))&&passesInventoryCheck(g(1196,886)));
check('§604 sole inbound is §1196 (consume-at-use correct)',
  Object.entries(GD).filter(([k,d])=>d.choices&&d.choices.some(c=>c.target===604)).map(([k])=>+k).join(',')==='1196');

console.log('# §76 spell_any');
const c487=g(76,487);
check('§76->487 spell_any = all 8 spells',
  JSON.stringify(c487.spell_any)===JSON.stringify(['LEVITATION','FIRE','ILLUSION','FORCE','WEAKNESS','COPY','HEALING','SWIMMING']));
check('§76->487 no plain spell field', !('spell' in c487));
S={inventory:[],spells:[]};
let totalNone=c487.spell_any.reduce((s,id)=>s+getSpellRemaining(id),0);
check('spell_any greyed out (disabled) with 0 spells', totalNone===0);
spells('FORCE','HEALING');
let totalSome=c487.spell_any.reduce((s,id)=>s+getSpellRemaining(id),0);
const pick=c487.spell_any.find(id=>getSpellRemaining(id)>0);
check('spell_any enabled with spells', totalSome>0);
check('spell_any picks first available in list order (FORCE before HEALING)', pick==='FORCE');
check('§76->1145 and §76->560 remain (no softlock for spell-less player)',
  GD['76'].choices.some(c=>c.target===1145)&&GD['76'].choices.some(c=>c.target===560));

console.log(`\nHARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
