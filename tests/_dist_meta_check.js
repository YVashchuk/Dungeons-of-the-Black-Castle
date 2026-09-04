const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const d=fs.readFileSync(path.join(REPO,'dist','dungeons-of-the-black-castle.html'),'utf8');
let ok=0,bad=0;
[['ui_btn_new','"ui_btn_new":"New Game"'],
 ['enemy','"shestilapyy_zver":"SIX-PAWED BEAST"'],
 ['spell','"name":"Levitation"'],
 ['pokupka','"pokupka":"Purchase (\u00a7"'],
 ['map','"taverna":"The Tavern"'],
 ['intro tags','<b>10 times</b>'],
 ['ally','"verb":"you ring the bell, and an enormous bear emerges from the thicket"']
].forEach(([n,s])=>{ const c=d.split(s).length-1; if(c>=1){ok++;} else {bad++; console.log('FAIL '+n);} });
console.log('DIST META CHECK: '+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
