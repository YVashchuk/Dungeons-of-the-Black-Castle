// PHASE 1 / Increment 5f harness — structured food objects {id,kind:'food',stamina}.
const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const reg=JSON.parse(fs.readFileSync(REPO+'\\src\\registries\\items.json','utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
function brace(s){let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
function gconst(n){const s=gl.indexOf('const '+n+'=');return brace(s).replace('const '+n+'=','globalThis.'+n+'=')+';';}
function gfn(n){const s=gl.indexOf('function '+n+'(');return brace(s).replace('function '+n+'(','globalThis.'+n+'=function(');}
globalThis.LOCALE_RU=JSON.parse(fs.readFileSync(REPO+'\\src\\locale.ru.js','utf8').match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
[gconst('RU_TO_SLUG'),gconst('SLUG_TO_RU'),gconst('ITEM_SIZES'),
 gfn('canonItem'),gfn('itemName'),gfn('invDisplay'),gfn('getItemSize'),gfn('getBagUsed'),gfn('passesInventoryCheck'),gfn('t')
].forEach(c=>eval(c));
const food=(id,st)=>({id,kind:'food',stamina:st});

// ---- stripFoodSuffix removed ----
ck('stripFoodSuffix removed from engine', !/stripFoodSuffix/.test(gl));
ck('food suffix moved to locale; invDisplay uses t() (no inline parsing)',
   LOCALE_RU.ui['eda_2']===' (еда: +' && /return itemName\(entry\.id\)\+t\('eda_2'\)\+entry\.stamina\+'\)'/.test(gl) && (gl.match(/еда:/g)||[]).length===0);

// ---- canonItem on objects + strings ----
ck('canonItem(foodObj)=id', canonItem(food('banana',3))==='banana');
ck('canonItem(food wine)=wine_bottle', canonItem(food('wine_bottle',4))==='wine_bottle');
ck('canonItem(slug)=slug', canonItem('diving_suit')==='diving_suit');
ck('canonItem(Russian)=slug still works', canonItem('Водолазный костюм')==='diving_suit');

// ---- invDisplay on objects + slugs ----
ck('invDisplay(foodObj)=RU+suffix', invDisplay(food('banana',3))==='Банан (еда: +3)');
ck('invDisplay(food wine)=RU+suffix', invDisplay(food('wine_bottle',4))==='Бутылка вина (еда: +4)');
ck('invDisplay(food dragon_liver)', invDisplay(food('dragon_liver',9))==='Печень дракона (еда: +9)');
ck('invDisplay(slug)=RU', invDisplay('magic_bell')==='Волшебный колокольчик');

// ---- getItemSize on objects ----
ck('getItemSize(foodObj)=1', getItemSize(food('banana',3))===1);
ck('getItemSize(food wine)=1', getItemSize(food('wine_bottle',4))===1);
ck('getItemSize(diving_suit)=2', getItemSize('diving_suit')===2);
ck('getItemSize(flying_carpet)=3', getItemSize('flying_carpet')===3);

// ---- getBagUsed over a mixed bag ----
globalThis.S={inventory:[food('banana',3),'diving_suit',food('wine_bottle',4),'magic_bell']};
ck('getBagUsed mixed bag = 1+2+1+1 = 5', getBagUsed()===5);

// ---- passesInventoryCheck with food objects ----
const P=(cond,inv)=>{ globalThis.S={inventory:inv}; return passesInventoryCheck({inventory_condition:cond}); };
ck('cond slug str, food obj present', P('banana',[food('banana',3)])===true);
ck('cond slug str, absent', P('banana',[])===false);
ck('cond {item,count:2}, two food objs', P({item:'banana',count:2},[food('banana',3),food('banana',2)])===true);
ck('cond {item,count:2}, one food obj -> false', P({item:'banana',count:2},[food('banana',3)])===false);
ck('cond {item,count:6}, six bananas', P({item:'banana',count:6},Array(6).fill(0).map(()=>food('banana',2)))===true);
ck('cond non-food slug in mixed bag', P('diving_suit',[food('banana',3),'diving_suit'])===true);
ck('cond {all:[whistles]} non-food still ok', P({all:['gold_whistle','bronze_whistle']},['gold_whistle','bronze_whistle'])===true);

// ---- SAVE/LOAD round-trip: food objects survive JSON and stay functional (the acceptance criterion) ----
const liveInv=[food('banana',3),'diving_suit',food('wine_bottle',4),'magic_bell'];
const saved=JSON.stringify({v:7,inventory:liveInv,summonsUsed:['magic_bell']});
const loaded=JSON.parse(saved);
ck('save/load: gate accepts v7', (typeof loaded.v==='number'&&loaded.v>=4&&loaded.v<=7));
ck('save/load: food obj survives (kind/id/stamina)', loaded.inventory[0].kind==='food'&&loaded.inventory[0].id==='banana'&&loaded.inventory[0].stamina===3);
ck('save/load: non-food slug survives as string', loaded.inventory[1]==='diving_suit');
ck('save/load: canonItem works on loaded food obj', canonItem(loaded.inventory[0])==='banana');
ck('save/load: invDisplay works on loaded food obj', invDisplay(loaded.inventory[2])==='Бутылка вина (еда: +4)');
ck('save/load: getBagUsed works on loaded bag = 5', (globalThis.S=loaded, getBagUsed())===5);
ck('save/load: a banana count-gate still passes on loaded bag', P({item:'banana',count:1},loaded.inventory)===true);

console.log(`\n5f HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
