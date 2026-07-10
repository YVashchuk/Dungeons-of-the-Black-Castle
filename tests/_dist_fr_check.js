const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const d=fs.readFileSync(REPO+'\\dist\\podzemelye-chyornogo-zamka-remake.html','utf8');
let ok=0,bad=0;
[['ui_btn_new','"ui_btn_new":"Nouvelle partie"'],
 ['enemy','"shestilapyy_zver":"B\u00caTE \u00c0 SIX PATTES"'],
 ['spell','"name":"L\u00e9vitation"'],
 ['pokupka','"pokupka":"Achat (\u00a7"'],
 ['map','"taverna":"La Taverne"'],
 ['intro tags','<b>10 fois</b>'],
 ['ally','"verb":"vous sonnez la clochette, et un ours \u00e9norme surgit du fourr\u00e9"'],
 ['preface','Barlad Dert appara\u00eet'],
 ['riddles kept','"riddles":{"']
].forEach(([n,s])=>{ const c=d.split(s).length-1; if(c>=1){ok++;} else {bad++; console.log('FAIL '+n);} });
console.log('DIST FR CHECK: '+ok+' passed, '+bad+' failed');
