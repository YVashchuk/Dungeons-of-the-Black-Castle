// Verification battery runner. Usage: node tests/run_all.js
const {spawnSync}=require('child_process'); const path=require('path');
const T=__dirname;
const HARNESSES=["p2_2a_harness.js", "p2_2b_harness.js", "p2_2c_harness.js", "p2_shell_i18n_harness.js", "p1_6a_harness.js", "p1_6b_harness.js", "p1_6c1_harness.js", "p1_6c2_harness.js", "p1_6d_harness.js", "p1_6e1_harness.js", "p1_6e2_harness.js", "harness_groupB.js", "p1_items_5f_harness.js", "_signet_harness.js", "_hygiene_harness.js", "_riddle_i18n_harness.js"];
let fails=0;
for(const h of HARNESSES){
  const r=spawnSync(process.execPath,[path.join(T,h)],{encoding:'utf8'});
  const last=((r.stdout||'').trim().split('\n').pop())||'(no output)';
  const ok=r.status===0;
  console.log((ok?'PASS ':'FAIL ')+h.padEnd(30)+last);
  if(!ok){fails++; if(r.stderr)console.log(r.stderr.split('\n').slice(0,4).map(s=>'      '+s).join('\n'));}
}
// Built-artifact checks (group_79 stage B follow-up): the six _dist_*_check.js
// scripts used to be run by hand, so a stale or broken dist/ could pass the
// battery. They run after the source harnesses because they need a freshly
// built dist/ (bash build.sh).
const DIST_CHECKS=["_dist_ui_check.js", "_dist_meta_check.js", "_dist_art_check.js", "_dist_signet_check.js", "_dist_fr_check.js", "_dist_uk_check.js"];
for(const h of DIST_CHECKS){
  const r=spawnSync(process.execPath,[path.join(T,h)],{encoding:'utf8'});
  const last=((r.stdout||'').trim().split('\n').pop())||'(no output)';
  const ok=r.status===0;
  console.log((ok?'PASS ':'FAIL ')+h.padEnd(30)+last);
  if(!ok){fails++; const bad=(r.stdout||'').split('\n').filter(l=>/^FAIL/.test(l)).slice(0,4); if(bad.length)console.log(bad.map(s=>'      '+s).join('\n')); if(r.stderr)console.log(r.stderr.split('\n').slice(0,4).map(s=>'      '+s).join('\n'));}
}
let py=spawnSync('python',['-X','utf8',path.join(T,'verify_reach3.py')],{encoding:'utf8'});
if(py.error&&py.error.code==='ENOENT'){py=spawnSync('python3',['-X','utf8',path.join(T,'verify_reach3.py')],{encoding:'utf8'});}
const line=(((py.stdout||'')+(py.stderr||'')).split('\n').find(l=>/True|False/.test(l))||'(no output)').trim();
const okB=/True/.test(line);
console.log((okB?'PASS ':'FAIL ')+'verify_reach3.py'.padEnd(30)+line); if(!okB)fails++;
console.log(fails?('BATTERY: '+fails+' FAILURES'):'BATTERY: ALL GREEN ('+HARNESSES.length+' harnesses + '+DIST_CHECKS.length+' dist checks + baseline)');
process.exit(fails?1:0);
