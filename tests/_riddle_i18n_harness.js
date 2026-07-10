const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
let pass=0,fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL: '+m);} };
const gl=fs.readFileSync(REPO+'\\src\\game_logic.js','utf8');
// extract helpers and eval
const normSrc=gl.match(/function riddleNorm\(s\)\{[\s\S]*?\n\}/)[0];
const hashSrc=gl.match(/function riddleHash\(s\)\{[\s\S]*?\n\}/)[0];
eval(normSrc); eval(hashSrc);
// locales
const load=(f,v)=>JSON.parse(fs.readFileSync(REPO+'\\src\\'+f,'utf8').match(new RegExp('const\\s+'+v+'\\s*=\\s*(\\{[\\s\\S]*\\})\\s*;'))[1]);
const EN=load('locale.en.js','LOCALE_EN'), FR=load('locale.fr.js','LOCALE_FR'), UK=load('locale.uk.js','LOCALE_UK');
const gsrc=fs.readFileSync(REPO+'\\src\\game_structure.js','utf8');
const GD=(new Function('window',gsrc+'\n; return (typeof GD!=="undefined")?GD:(window&&window.GD);'))({});
const hasWord=(L,pid,word)=>{ const h=riddleHash(word); return (L.riddles[pid]||[]).some(e=>e.h===h); };
// structural
ok(gl.includes('const locTarget=localeRiddleTarget(input);'),'locale path wired into applyRiddleAnswer');
ok(gl.indexOf('localeRiddleTarget')<gl.indexOf('function applyRiddleAnswer'),'helpers precede handler');
// normalisation semantics
ok(riddleNorm('  Mot de Passe! ')==='MOTDEPASSE','norm strips spaces/punct, uppercases');
ok(riddleHash('h\u00e9risson')===riddleHash('herisson'),'diacritic folding (FR)');
ok(riddleHash('\u0407\u0416\u0410\u041a')===riddleHash('\u0457\u0436\u0430\u043a'),'UK case+fold consistent');
// EN answers
ok(hasWord(EN,'67','Password'),'EN p67 password');
ok(hasWord(EN,'1131','graveyard')&&hasWord(EN,'1131','Cemetery'),'EN p1131 two synonyms');
ok(hasWord(EN,'992','death'),'EN p992 death');
// FR answers
ok(hasWord(FR,'67','mot de passe')&&hasWord(FR,'67','MotDePasse'),'FR p67 mot de passe');
ok(hasWord(FR,'435','h\u00e9risson')&&hasWord(FR,'435','herisson'),'FR p435 herisson w/o accent too');
// UK answers
ok(hasWord(UK,'435','\u0457\u0436\u0430\u043a'),'UK p435 yizhak');
ok(hasWord(UK,'1131','\u0446\u0432\u0438\u043d\u0442\u0430\u0440'),'UK p1131 tsvyntar');
// negative + integrity
ok(!hasWord(EN,'67','dragon'),'wrong word does not match');
let allOk=true;
for(const L of [EN,FR,UK]) for(const pid in L.riddles){
  if(!GD[pid]||!GD[pid].riddle){allOk=false;break;}
  const tgt=GD[pid].riddle.valid_targets[0];
  for(const e of L.riddles[pid]) if(e.target!==tgt||!GD[String(e.target)]) allOk=false;
  const hs=L.riddles[pid].map(e=>e.h);
  if(new Set(hs).size!==hs.length) allOk=false;
}
ok(allOk,'all entries: pid has riddle, target==valid_target, exists in GD, hashes unique');
ok(Object.keys(EN.riddles).length===7&&Object.keys(FR.riddles).length===7&&Object.keys(UK.riddles).length===7,'7 riddles per locale');
console.log('RIDDLE-I18N HARNESS: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
