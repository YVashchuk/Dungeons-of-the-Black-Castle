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
const py=spawnSync('python',['-X','utf8',path.join(T,'verify_reach3.py')],{encoding:'utf8'});
const line=(((py.stdout||'')+(py.stderr||'')).split('\n').find(l=>/True|False/.test(l))||'(no output)').trim();
const okB=/True/.test(line);
console.log((okB?'PASS ':'FAIL ')+'verify_reach3.py'.padEnd(30)+line); if(!okB)fails++;
console.log(fails?('BATTERY: '+fails+' FAILURES'):'BATTERY: ALL GREEN ('+HARNESSES.length+' harnesses + baseline)');
process.exit(fails?1:0);
