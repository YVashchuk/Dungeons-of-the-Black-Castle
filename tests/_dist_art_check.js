const fs=require('fs');
const REPO=require('path').resolve(__dirname,'..');
const H=REPO+'\\dist\\podzemelye-chyornogo-zamka-remake.html';
const d=fs.readFileSync(H,'utf8');
let ok=0,bad=0; const ck=(c,m)=>{ if(c)ok++; else {bad++; console.log('  FAIL: '+m);} };
console.log('dist html size: '+(fs.statSync(H).size/1048576).toFixed(2)+' MB');
const big=(d.match(/data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]{2000,}/g)||[]).length;
ck(big===0,'big embedded images remain: '+big);
ck((d.match(/'art\/mj\//g)||[]).length===45,'art/mj/ path count');
ck((d.match(/"art\/legacy\//g)||[]).length===28,'art/legacy/ path count');
ck((d.match(/"art\/title\//g)||[]).length===2,'art/title/ path count');
ck(d.indexOf('src="${MJ_DATA[artId]}"')!==-1 || d.indexOf('src="${MJ_DATA[artId]}')!==-1,'MJ template present');
ck(d.indexOf('src="data:image/jpeg;base64,${ILLUST_DATA')===-1,'legacy data-prefix gone');
ck(d.indexOf('src="data:image/png;base64,${TITLE_ART')===-1,'title data-prefix gone');
// dist/art tree + byte-compares
function walk(p,out){ fs.readdirSync(p).forEach(x=>{ const fp=p+'\\'+x; const st=fs.statSync(fp); if(st.isDirectory())walk(fp,out); else out.push(fp); }); }
const files=[]; walk(REPO+'\\dist\\art',files);
ck(files.length===75,'dist/art file count='+files.length);
let total=0; files.forEach(f=>total+=fs.statSync(f).size);
console.log('dist/art: '+files.length+' files, '+(total/1048576).toFixed(2)+' MB');
['mj\\art01_enchanted_forest_start.jpg','legacy\\395419_3.jpeg','title\\lettering.png'].forEach(rel=>{
  const a=fs.readFileSync(REPO+'\\assets\\art\\'+rel), b=fs.readFileSync(REPO+'\\dist\\art\\'+rel);
  ck(Buffer.compare(a,b)===0,'byte-compare '+rel);
});
console.log('DIST ART CHECK: '+ok+' passed, '+bad+' failed');
process.exit(bad?1:0);
