const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
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
// live GD (group_107 C1-036): every +40 door takes the +40 key family; a lock that turns a metal key (sec.851/881) takes no signet
const src=fs.readFileSync(path.join(REPO,'src','game_structure.js'),'utf8');
const GD=(new Function('window',src+'\n; return (typeof GD!=="undefined")?GD:(window&&window.GD);'))({});
[[91,131],[687,727],[694,734],[768,808]].forEach(([p,t])=>{
  const c=GD[String(p)].choices[0];
  ok(Array.isArray(c.inventory_condition)&&c.inventory_condition.join(',')==='black_castle_key,signet,bear_key,all_key'&&c.target===t,'GD '+p+' cond/target');
});
[[851,891],[881,921]].forEach(([p,t])=>{
  const c=GD[String(p)].choices[0];
  ok(Array.isArray(c.inventory_condition)&&c.inventory_condition.join(',')==='black_castle_key,bear_key,all_key'&&c.target===t,'GD '+p+' metal keys');
});
S={inventory:['bear_key']}; ok(passesInventoryCheck(GD['851'].choices[0])===true,'the bear\'s key opens sec.851');
S={inventory:['signet']}; ok(passesInventoryCheck(GD['851'].choices[0])===false,'the signet does not turn in sec.851');
S={inventory:['copper_key']}; ok(passesInventoryCheck(GD['91'].choices[0])===false,'the goblins\' copper key is no +40 key');
console.log('SIGNET HARNESS: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
