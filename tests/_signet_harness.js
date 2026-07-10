const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
const fn=gl.match(/function passesInventoryCheck\([\s\S]*?\n\}/)[0];
const canonItem=x=>x;
let S=null;
eval(fn);
const CH={inventory_condition:['black_castle_key','signet']};
let pass=0,fail=0;
const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL: '+m);} };
S={inventory:['signet']};                 ok(passesInventoryCheck(CH)===true,  'signet-only opens');
S={inventory:['black_castle_key']};       ok(passesInventoryCheck(CH)===true,  'black-key-only opens');
S={inventory:['black_castle_key','signet']}; ok(passesInventoryCheck(CH)===true,'both open');
S={inventory:['copper_key']};             ok(passesInventoryCheck(CH)===false, 'wrong key blocked');
S={inventory:[]};                         ok(passesInventoryCheck(CH)===false, 'empty blocked');
S={inventory:['signet']};                 ok(passesInventoryCheck({inventory_condition:'black_castle_key'})===false, 'string cond unaffected');
// live GD: the 4 doors have array conds; 851/881 untouched strings
const src=fs.readFileSync(REPO+'\\src\\game_structure.js','utf8');
const GD=(new Function('window',src+'\n; return (typeof GD!=="undefined")?GD:(window&&window.GD);'))({});
[[91,131],[687,727],[694,734],[768,808]].forEach(([p,t])=>{
  const c=GD[String(p)].choices[0];
  ok(Array.isArray(c.inventory_condition)&&c.inventory_condition.join(',')==='black_castle_key,signet'&&c.target===t,'GD '+p+' cond/target');
});
[[851,891],[881,921]].forEach(([p,t])=>{
  const c=GD[String(p)].choices[0];
  ok(c.inventory_condition==='copper_key'&&c.target===t,'GD '+p+' copper untouched');
});
console.log('SIGNET HARNESS: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
