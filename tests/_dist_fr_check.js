const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const d=fs.readFileSync(path.join(REPO,'dist','dungeons-of-the-black-castle.html'),'utf8');
let ok=0,bad=0;
[['ui_btn_new','"ui_btn_new":"Nouvelle partie"'],
 ['enemy','"shestilapyy_zver":"B\u00caTE \u00c0 SIX PATTES"'],
 ['spell','"name":"L\u00e9vitation"'],
 ['pokupka','"pokupka":"Achat (\u00a7"'],
 ['map','"taverna":"La Taverne"'],
 ['intro tags','<b>10 fois</b>'],
 ['ally','"verb":"sonnez la clochette, et un ours \u00e9norme surgit du fourr\u00e9\u202f"'], // group_91: the engine prepends ? Vous ?; NNBSP before the runtime ?!?
 ['preface','appara\u00eet un magicien rus\u00e9 et perfide, Barlad Dert'],
 ['riddles kept','"riddles":{"']
].forEach(([n,s])=>{ const c=d.split(s).length-1; if(c>=1){ok++;} else {bad++; console.log('FAIL '+n);} });
console.log('DIST FR CHECK: '+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
