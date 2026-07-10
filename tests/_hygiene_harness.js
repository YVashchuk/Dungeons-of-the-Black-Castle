const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
let pass=0,fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL: '+m);} };
// structural
ok(gl.includes("new RegExp('\\\\b'+cost+'\\\\b')"),'price digit check present');
ok(gl.indexOf('\\d\\s*\u0437\u043e\u043b\u043e\u0442')===-1,'RU price regex gone from code');
ok(!gl.includes('S.section!==617'),'617 vestige gone');
ok(gl.includes('const num=(v)=>typeof v===\'number\'&&isFinite(v);'),'normalize backfill present');
ok(gl.includes('// defensive: no phantom stake'),'betting guard present');
// functional: normalizeSave via eval
const fnSrc=gl.match(/function normalizeSave\([\s\S]*?\n\}/)[0];
eval(fnSrc);
const s1=normalizeSave({v:5,skill:'x',stamina:NaN,luck:undefined,skillMax:11,staminaMax:'?',gold:3});
ok(s1.skill===11,'skill backfilled from skillMax');
ok(s1.staminaMax===18&&s1.stamina===18,'stamina backfilled to default 18');
ok(s1.luckMax===9&&s1.luck===9,'luck backfilled to default 9');
ok(s1.gold===3,'valid gold untouched');
const s2=normalizeSave({v:5,skill:8,skillMax:10,stamina:15,staminaMax:20,luck:7,luckMax:12});
ok(s2.skill===8&&s2.stamina===15&&s2.luck===7&&s2.skillMax===10,'valid stats untouched');
// functional: price check logic replicated
const priceNeeds=(cost,label)=>cost>0&&!(new RegExp('\\b'+cost+'\\b').test(label));
ok(priceNeeds(4,'Kupit mech (299)')===true,'appends when amount absent');
ok(priceNeeds(4,'Kupit za 4 zolotyh (299)')===false,'skips when amount present');
ok(priceNeeds(3,'Zaplatit (345)')===true,'no false hit on digit inside target number');
console.log('HYGIENE HARNESS: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
