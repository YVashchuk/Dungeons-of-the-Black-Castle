const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const d=fs.readFileSync(path.join(REPO,'dist','podzemelye-chyornogo-zamka-remake.html'),'utf8');
let ok=0,bad=0;
[['ui_btn_new','"ui_btn_new":"\u041d\u043e\u0432\u0430 \u0433\u0440\u0430"'],
 ['enemy','"shestilapyy_zver":"\u0428\u0415\u0421\u0422\u0418\u041b\u0410\u041f\u0418\u0419 \u0417\u0412\u0406\u0420"'],
 ['spell','"name":"\u041b\u0435\u0432\u0456\u0442\u0430\u0446\u0456\u044f"'],
 ['map','"taverna":"\u0422\u0430\u0432\u0435\u0440\u043d\u0430"'],
 ['intro','<b>10 \u0440\u0430\u0437\u0456\u0432</b>'],
 ['title div','\u041f\u0456\u0434\u0437\u0435\u043c\u0435\u043b\u043b\u044f<br>\u0427\u043e\u0440\u043d\u043e\u0433\u043e \u0437\u0430\u043c\u043a\u0443'],
 ['kazhan','"pervaya_letuchaya_mysh":"\u041f\u0415\u0420\u0428\u0418\u0419 \u041a\u0410\u0416\u0410\u041d"']
].forEach(([n,s])=>{ const c=d.split(s).length-1; if(c>=1){ok++;} else {bad++; console.log('FAIL '+n);} });
console.log('DIST UK CHECK: '+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
