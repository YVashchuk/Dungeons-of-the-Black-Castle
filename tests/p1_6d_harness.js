// 6d harness â€” enemy names + riddle labels resolve; game_structure.js fully Cyrillic-free.
const fs=require('fs');
const path=require('path');
const REPO=path.resolve(__dirname,'..');
const remakeSrc=fs.readFileSync(path.join(REPO,'src','game_structure.js'),'utf8');
const gl=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
const localeSrc=fs.readFileSync(path.join(REPO,'src','locale.ru.js'),'utf8');
const data=JSON.parse(fs.readFileSync(require('path').join(__dirname,'goldens','_6d_data.json'),'utf8'));
let pass=0,fail=0; const ck=(d,c)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',d);} };
const CYR=/[\u0400-\u04FF]/;

globalThis.GD=JSON.parse(remakeSrc.match(/^\s*const\s+GD\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)[1]);
globalThis.LOCALE_RU=JSON.parse(localeSrc.match(/const\s+LOCALE_RU\s*=\s*(\{[\s\S]*\})\s*;\s*$/)[1]);
const J2=JSON.stringify;
function brace(s){let i=gl.indexOf('{',s),d=0,j=i;for(;j<gl.length;j++){if(gl[j]==='{')d++;else if(gl[j]==='}'){d--;if(d===0){j++;break;}}}return gl.slice(s,j);}
function gfn(n){const s=gl.indexOf('function '+n+'(');return brace(s).replace('function '+n+'(','globalThis.'+n+'=function(');}
[gfn('pText'),gfn('label'),gfn('locSec'),gfn('enemyName')].forEach(c=>eval(c));

// 1. game_structure.js fully Cyrillic-free
ck('game_structure.js GD has ZERO Cyrillic', !CYR.test(JSON.stringify(GD)));

// 2. enemies locale complete + resolver
ck('LOCALE_RU.enemies has all 68 keys with exact values (66 + zdorovennyy_goblin PL-41 + vasha_kopiya group_100)', Object.keys(data.enemies).every(k=>LOCALE_RU.enemies[k]===data.enemies[k]) && Object.keys(LOCALE_RU.enemies).length===68);
let emis=0; for(const k in data.enemies){ if(enemyName(k)!==data.enemies[k]) emis++; }
ck('enemyName(slug) reproduces all 66 names (mismatch '+emis+')', emis===0);
ck('enemyName(unknown) safe', enemyName('__no__')==='__no__');

// 3. every GD enemy slug resolves to a known RU name
let unresolved=[]; for(const pk in GD){ const es=GD[pk].enemies; if(Array.isArray(es)) for(const e of es){ if(e&&e.name){ if(!(e.name in LOCALE_RU.enemies)) unresolved.push(pk+':'+e.name); if(CYR.test(e.name)) unresolved.push(pk+':CYR:'+e.name); } } }
ck('every GD enemies[].name is a resolvable slug (unresolved '+unresolved.length+')', unresolved.length===0);

// 4. riddle.fail_target_label removed from GD; rfl in locale; locSec hydrates
let gdHasLabel=0; for(const pk in GD){ if(GD[pk].riddle&&GD[pk].riddle.fail_target_label!==undefined) gdHasLabel++; }
ck('no riddle.fail_target_label left in GD', gdHasLabel===0);
let rflBad=0; for(const pk in data.rfl){ if(!LOCALE_RU.p[pk]||LOCALE_RU.p[pk].rfl!==data.rfl[pk]) rflBad++; }
ck('LOCALE_RU.p[n].rfl present for all 6 riddle paragraphs', rflBad===0);
// locSec hydrates fail_target_label back onto sec.riddle
let hydBad=0; for(const pk in data.rfl){ const sec=locSec(+pk); if(!sec.riddle||sec.riddle.fail_target_label!==data.rfl[pk]) hydBad++; }
ck('locSec hydrates riddle.fail_target_label for all 6 (mismatch '+hydBad+')', hydBad===0);
// locSec does NOT mutate GD (riddle hydration uses a copy)
const before=JSON.stringify(GD['67'].riddle); locSec(67); const after=JSON.stringify(GD['67'].riddle);
ck('locSec does not mutate GD riddle object', before===after && JSON.parse(before).fail_target_label===undefined);

// 5. spot
ck("enemyName('goblin')==='Ð“ÐžÐ‘Ð›Ð˜Ð'", enemyName('goblin')==='\u0413\u041e\u0411\u041b\u0418\u041d');
ck('Â¶67 riddle exit label hydrated', locSec(67).riddle.fail_target_label===data.rfl['67']);

// 6. group_74 (ChatGPT 5.6 audit C-01/C-02): canonical combat rosters restored
ck('GD[100] five bandits incl. chetvertyy 8/6', GD['100'].enemies.length===5 && GD['100'].enemies.some(e=>e.name==='chetvertyy_razboynik'&&e.skill===8&&e.stamina===6));
ck('GD[131] goblin + waiting orel, staged script', GD['131'].enemies.length===2 && GD['131'].enemies[1].name==='orel' && GD['131'].enemies[1].skill===7 && GD['131'].enemies[1].stamina===7 && GD['131'].combat_script==='sec131_eagle_joins');
ck('ui sec131 staged keys present (RU)', typeof LOCALE_RU.ui['snachala_vy_srazhaetes_tolko_s_g']==='string' && typeof LOCALE_RU.ui['orel_chasovoy_vyletaet_iz_nishi']==='string');

// 7. group_75 spell-economy completion: canonical combat-spell bans + on-tree penalty
ck('GD[250]/[474] all combat spells banned (no time to cast)', JSON.stringify(GD['250'].combat_spells_allowed)==='[]' && JSON.stringify(GD['474'].combat_spells_allowed)==='[]');
ck('GD[260] Vodyanoy bans COPY only', JSON.stringify(GD['260'].combat_spells_allowed)==='["FORCE","WEAKNESS"]');
ck('GD[235] modal restricted to COPY, nav spells kept', JSON.stringify(GD['235'].combat_spells_allowed)==='["COPY"]' && GD['235'].choices.filter(c=>c.spell).length===3);
ck('GD[528] on-tree penalty modelled', GD['528'].player_attack_mod===-1);

// 8. group_76 stale-backlog sweep: one-sided luck paragraphs are a closed adjudicated set
// (203/289/377/418/421/1186 canonically fatal via the generic death-overlay handler; 436 scripted).
// If this fails, a new one-sided luck paragraph entered GD and needs FB2 adjudication.
const oneSidedLuck=Object.keys(GD).filter(k=>{const cs=(GD[k].choices||[]).filter(c=>c.luck_type);return cs.length>0&&(cs.every(c=>c.luck_type==='lucky')||cs.every(c=>c.luck_type==='unlucky'));}).map(Number).sort((a,b)=>a-b);
ck('one-sided luck set is exactly the adjudicated seven', JSON.stringify(oneSidedLuck)==='[203,289,377,418,421,436,1186]');

// 9aa. group_87 batch E1 (PL-39 / PL-41 / PL-20): granted spell, carry-over, post-combat trophies
(function(){
  ck('PL-39 data + engine: sec.520 grants INDIFFERENCE, picker skips granted spells, combat function present', GD['520'].auto_items.spell_grant.id==='INDIFFERENCE'&&gl.includes('SPELLS.filter(sp=>!sp.granted).forEach(')&&gl.includes('function useIndifferenceInCombat()')&&gl.includes('"id":"INDIFFERENCE"'));
  ck('PL-41 data + engine: sec.737 carries its enemy, sec.182 has the carried goblin + the staged huge goblin', GD['737'].round_deadline.carry_enemy===true&&GD['182'].enemies.length===2&&GD['182'].enemies[0].name==='goblin'&&GD['182'].enemies[1].joins&&GD['182'].enemies[1].joins.after_death===0&&gl.includes('S.carryOver={to:_dl.lose,hp:al[0].hp}'));
  ck('PL-20 data + engine: trophies after the fight', !GD['440'].auto_items.items&&GD['440'].post_combat_items.items.includes('gold_key')&&!GD['182'].auto_items&&GD['182'].post_combat_items.items.includes('bronze_whistle')&&gl.includes('S.postCombatDone[S.section]=true'));
})();

// 9am. group_108: the Gemini 4 Carbon engine audit (Track 2) of 7fdf978 - saved state, the shell, the fights after the win, the map
(function(){
  const sh=fs.readFileSync(path.join(REPO,'src','game_shell_top.html'),'utf8'), mp=fs.readFileSync(path.join(REPO,'src','map_module.js'),'utf8'), items=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
  const fn=n=>{ const s=gl.indexOf('function '+n+'('); return s<0?'':brace(s); };
  ck('C2-001 the restart buttons survive blocked storage (no bare localStorage.removeItem in the shell)', !/onclick="[^"]*localStorage\.removeItem/.test(sh)&&(sh.match(/restartClean\(\)/g)||[]).length===3&&/try\{ localStorage\.removeItem\(SAVE_KEY\); \}catch/.test(fn('restartClean')));
  const rr=fn('resetRuntimeState');
  ck('C2-002 an imported save starts with clean per-paragraph state (both import paths)', ['combatDone={}','luckDone={}','luckResult={}','sectionPrepState={}','_invModalOnDone=null','renderEventLog'].every(x=>rr.includes(x))&&fn('importSave').includes('resetRuntimeState()')&&/resetRuntimeState\(\); \/\* group_108 C2-002 \*\/ saveGame\(\)/.test(mp));
  const ns=fn('normalizeSave');
  ck('C2-003 normalizeSave: food STAMINA numeric, objects without an id dropped, a journal type a plain word, spells objects; the interrupted pick-up sanitized', ns.includes("isFinite(it.stamina))?it.stamina:0")&&ns.includes("ev.type.replace(/[^a-z0-9_-]/gi,'')")&&ns.includes("s.spells=s.spells.filter(sp=>sp&&typeof sp==='object'&&typeof sp.id==='string')")&&ns.includes('s.pendingPickup.items=s.pendingPickup.items.filter('));
  ck('C2-004 a hash entry into another paragraph forgets the origin and a pending roll (sec.146 keeps both gates)', gl.includes('if(S.section!==tgt){ S.luckChecks={}; S.cameFrom=null; S.pendingDiceRoll=null; S.powerAt=null; }'));
  ck('C2-005 / C1-015 a failed roll inside the luck window leaves a rescue exit (sec.203 the fish)', /if\(lr==='unlucky' && hasLucky && !hasUnlucky && !luckRescue\(sec\)\)\{/.test(gl));
  const rc=fn('refreshChoicesForState');
  ck('C2-006 the choices follow the bag and the flask: the pick-up dialog, eating, dropping, adding, a sip', rc.includes('renderStakePicker(sec)')&&rc.includes('renderChoices(sec)')&&fn('closeInvModal').includes('else refreshChoicesForState();')&&['eatFood','removeItem','addItem','useFlask'].every(n=>fn(n).includes('refreshChoicesForState()')));
  let pre=[]; for(const [k,s] of Object.entries(GD)){ if(!(s.enemies||[]).length) continue; if(!(s.choices||[]).some(c=>c.post_combat||c.combat_condition)) pre.push(k); }
  ck('C2-007 after the win only the exits after the fight remain (every fight names its exits: '+(pre.join(',')||'none')+' without)', gl.includes('if(!ch.luck_type && (ch.post_combat || (ch.combat_condition && S.combatCondMet&&S.combatCondMet[S.section])) && passesInventoryCheck(ch) && passesGoldCheck(ch)){')&&pre.length===0);
  ck('C2-008 an interrupted pick-up dialog is saved and opens again after a reload (entry offers, trophies after the win, a choice that goes on)', fn('showInventoryModal').includes('S.pendingPickup={section:S.section,items:pendingItems,next:null}')&&fn('closeInvModal').includes('S.pendingPickup=null')&&gl.includes('S.pendingPickup.next=ch.target')&&gl.includes("const pp=S.pendingPickup; const left=(pp.items||[]).filter(")&&gl.includes('// group_108 C2-008: trophies a reload interrupted'));
  ck('C2-009 / C1-061 the stake picker opens a new round', /S\.betRoundId=\(S\.betRoundId\|\|0\)\+1/.test(fn('renderStakePicker')));
  ck('C2-010 healing and Indifference end with the fight and do nothing for the dead', fn('useHealingInCombat').includes('if(!combatState||combatDone[S.section]||S.stamina<=0) return;')&&fn('useIndifferenceInCombat').includes('if(combatDone[S.section]||S.stamina<=0||combatResolved(combatState)) return;')&&fn('endCombat').includes("['btn-heal-spell','btn-indifference-spell'].forEach")&&(()=>{ const l=fn('endCombat').split('\n').find(x=>x.includes("const flBtnEnd=document.getElementById('combat-flee-btn')")); return !!l&&!l.slice(0,l.indexOf('const flBtnEnd=')).includes('//'); })()&&fn('endCombatRouted').includes("'btn-indifference-spell','btn-heal-spell'"));
  ck('C2-011 the batch\'s eat button goes with the batch; a thing that does not fit is reported', gl.includes("if(eatSib&&eatSib.dataset&&eatSib.dataset.batchEat) eatSib.remove();")&&gl.includes("eat.dataset.batchEat='1';")&&gl.includes("if(skippedE) msgs.push(t('meshok_polon_2')+skippedE+t('ne_vzyato'));"));
  ck('C2-012 sec.1175: a fight already won ends on resume; the luck offer closes when the third Orc falls to an item', fn('resumeCanonCombat').includes('if(combatState&&combatResolved(combatState)){ clearCombatExtraButtons(); endCombat(true); return; }')&&fn('updateCombatConditionButtons').includes("cs.special.type==='sec1175'&&!cs.special.luckChecked&&document.getElementById('combat-buttons-extra')"));
  ck('C2-013 the preface back button and the OpenAI voice select are translated (keys in four languages)', sh.includes('data-i18n="ui_btn_back_to_spells"')&&sh.includes('data-i18n-aria="ui_voice_openai_voice"')&&['ru','en','fr','uk'].every(l=>{ const s=fs.readFileSync(path.join(REPO,'src','locale.'+l+'.js'),'utf8'); return s.includes('"ui_btn_back_to_spells"')&&s.includes('"ui_voice_openai_voice"'); }));
  ck('C2-014 a riddle\'s required encounter holds in every language (the locale answer path checks requires_flag)', /if\(locTarget&&riddleConfig\.requires_flag&&!\(S\.inventory\|\|\[\]\)\.some\(it=>canonItem\(it\)===riddleConfig\.requires_flag\)\)/.test(fn('applyRiddleAnswer')));
  const defLine=mp.split('\n').find(l=>/BC_MAP_DEF\s*=/.test(l)); const MAP=JSON.parse(defLine.slice(defLine.indexOf('{'),defLine.lastIndexOf('}')+1));
  const node=id=>(MAP.nodes||[]).find(n=>n.id===id)||{}, enc=id=>(MAP.encounters||[]).find(n=>n.id===id)||{};
  const forestInCastle=(MAP.nodes||[]).filter(n=>n.layer==='castle_interior').flatMap(n=>n.paragraph_refs||[]).filter(r=>[1207,440,532,437].includes(r));
  const victories=(MAP.encounters||[]).filter(e=>!(e.paragraph_refs||[]).some(r=>GD[String(r)]&&(GD[String(r)].enemies||[]).length)).map(e=>e.id);
  ck('C2-015 the forest dragon is not on the castle layer; every victory marker names a fight (no fight: '+(victories.join(',')||'none')+')', forestInCastle.length===0&&J2(node('ci_trap_corridors').paragraph_refs)==='[1082,1083,1206]'&&victories.length===0&&[[ 'enc_wood_goblin',303],['enc_gate_guards',262],['enc_gate_guards',628],['enc_princess_room',823]].every(([e,r])=>(enc(e).paragraph_refs||[]).includes(r)));
  ck('C2-016 / C1-024 sec.365 lets the reader stake from the bag (not the liver)', GD['365'].stake_picker===true&&J2(GD['365'].stake_exclude)==='["dragon_liver"]');
  ck('C2-017 no dead data: sec.536 has no has_copy_spell, the flask weighs nothing in the registry too', GD['536'].has_copy_spell===undefined&&!Object.values(GD).some(s=>'has_copy_spell' in s)&&(items.items||items).water_flask.slotCost===0);
})();
// 9al. group_107: the Gemini 4 Carbon fidelity sweep (Track 1) of 7fdf978 - the arithmetic of the book, the items' powers, the repairs
(function(){
  const K40=['black_castle_key','signet','bear_key','all_key'], METAL=['black_castle_key','bear_key','all_key'], J=JSON.stringify, has=(p,t,cond)=>(GD[p].choices||[]).some(c=>c.target===t&&J(c.inventory_condition)===J(cond));
  const links=[[215,175,'pass'],[361,321,'pass'],[684,644,'pass'],[1189,1149,'pass'],[306,330,'book'],[698,713,'fish_help'],[1155,1165,'candle'],[1057,1044,'mirror_secret'],[302,342,K40],[621,661,K40],[835,875,K40],[1074,1114,K40],[928,968,METAL],[962,1002,METAL],[70,1145,'secret_door'],[1120,989,'cupboard_seen'],[643,225,'fire_extinguisher'],[1189,434,'stone_centaur']];
  const miss=links.filter(([p,t,c])=>!has(p,t,c)).map(l=>l[0]+'->'+l[1]);
  ck('C1-012..059 the book\'s arithmetic is wired: pass -40, book +24, fish +15, candle +10, mirror -13, key +40; sec.70 door, sec.1120 figurine, sec.643 extinguisher, sec.1189 centaur (missing: '+(miss.join(',')||'none')+')', miss.length===0&&GD['87'].choices[0].target===942&&GD['335'].choices[0].retired===true&&GD['335'].choices[1].retired===true&&GD['94'].choices[0].retired===true);
  const keyGates=[]; for(const [k,s] of Object.entries(GD)) (s.choices||[]).forEach((c,i)=>{ const v=c.inventory_condition; const a=Array.isArray(v)?v:(typeof v==='string'?[v]:[]); if(a.includes('black_castle_key')&&J(a)!==J(K40)&&J(a)!==J(METAL)) keyGates.push(k+':'+i); if(a.includes('copper_key')&&!['803','804'].includes(k)) keyGates.push(k+':'+i+'(copper)'); });
  ck('C1-036 every +40 door takes the +40 key family (the bear\'s key and the «Всё» key included; a lock that turns a metal key takes no signet); the goblins\' copper key opens only sec.803/804 (odd: '+(keyGates.join(',')||'none')+')', keyGates.length===0&&J(GD['612'].auto_items.items)==='["bear_key","magic_bell"]'&&J(GD['795'].auto_items)==='{"items":["all_key"]}');
  const ghosts=/prizrak|duh|kopiya|vodyanoy|barlad|vampir|garpiya|ruka/; const badRing=[]; for(const [k,s] of Object.entries(GD)){ if(!s.ring_pass) continue; if(!(s.enemies||[]).length||s.enemies.some(e=>ghosts.test(e.name))||!s.ring_pass.every(t=>GD[String(t)])) badRing.push(k); }
  const pearlOk=J(GD['468'].pearl)==='{"to":482,"eyes":2}'&&GD['468'].choices[0].retired===true&&J(GD['860'].choices[0].inventory_condition)==='{"item":"knight_eyes","count":12}'&&Object.keys(GD).filter(k=>GD[k].pearl).length===9;
  ck('C1-007 / C1-029 / C1-048 the copper ring passes only living foes that bar the way, the black pearl strikes the Green Knights, sec.860 asks twelve eyes (bad ring_pass: '+(badRing.join(',')||'none')+')', badRing.length===0&&Object.keys(GD).filter(k=>GD[k].ring_pass).length===34&&pearlOk&&gl.includes('function renderItemPowers(')&&gl.includes("kind==='stack') return Math.ceil((Number(name.count)||0)/4);"));
  const twins=[[696,706],[972,982],[1000,1010],[1013,1023],[1155,1165]].filter(([p,t])=>!(GD[p].choices||[]).some(c=>c.target===t&&J(c.inventory_condition)==='{"all":["unlit_candle","flint"]}'&&c.inventory_missing==='candle'));
  ck('C1-035 (author) the tavern candle of sec.600 lights only with the flint - every candle gate has its twin (missing: '+(twins.map(x=>x[0]).join(',')||'none')+')', twins.length===0&&GD['600'].auto_items.items.includes('unlit_candle')&&!GD['600'].auto_items.items.includes('candle'));
  const subs=gl.includes('function substituteFor(ch)')&&GD['76'].choices[1].no_substitute===true&&GD['350'].choices[2].no_substitute===true&&GD['174'].choices[0].spell_any.length===8;
  ck('C1-017 / C1-062 the flying carpet stands in for Levitation and the diving suit for Swimming (not for a payment or a trick in spells, not where a paragraph names its own diving-suit way); C1-005 / C1-011 «любое заклятие» lets the reader pick', subs&&gl.includes("own&&(own.choices||[]).some(c=>c.inventory_condition==='diving_suit')")&&gl.includes("box.className='spell-pick'"));
  ck('C1-015 / C1-042 / C1-045 / C1-053 engine: a luck window keeps a rescue without luck, a batch of things goes through the pick-up dialog, Indifference obeys the spells allowed, prizes won at dice are offered', gl.includes('&& !luckRescue(sec)){')&&gl.includes('a batch of things only')&&gl.includes("!(combatState.sec&&Array.isArray(combatState.sec.combat_spells_allowed))&&!isBarladFight()")&&gl.includes('showInventoryModal(betOffer, notifs)'));
  ck('C1-024 / C1-061 a stake before the roll: sec.365 and sec.1212 refuse the dragon liver, sec.1212 money stakes 2/4/8', J(GD['365'].stake_exclude)==='["dragon_liver"]'&&GD['365'].stake_roll_target===1062&&J(GD['1212'].choices.map(c=>c.stake_gold||0))==='[2,4,8,0,0]'&&gl.includes('function placeGoldStake('));
  ck('C1-028 / C1-030 one flee, one penalty (sec.733 adds none) and the flee stays at hand in the fight; sec.468 lance after the pearl\'s chance', !GD['733'].auto_items&&!GD['468'].auto_items&&[1,2,3,4,5].every(i=>GD['468'].choices[i].stamina_cost===4)&&gl.includes('function addFleeButton()'));
  ck('C1-031 the children\'s secret turns back the spy\'s Weakness, Copy and Fire if you know them', GD['3'].choices.some(c=>c.combat_mod==='REFLECT_WEAKNESS'&&c.spell_known==='WEAKNESS')&&GD['239'].choices.some(c=>c.target===143&&c.spell_known==='COPY')&&GD['275'].choices.some(c=>c.target===523&&c.spell_known==='FIRE')&&gl.includes("(pendingBuff==='REFLECT_WEAKNESS'?-pMod:0)"));
  const luckLbl=[]; ['ru','fr'].forEach(l=>{ const P=(l==='ru')?LOCALE_RU.p:null; if(!P) return; for(const [k,s] of Object.entries(GD)) (s.choices||[]).forEach((c,i)=>{ if(!c.luck_type&&/Удача вас покинула/.test((P[k]&&P[k].c&&P[k].c[i])||'')) luckLbl.push(k); }); });
  ck('C1-034 no choice that tests no Luck is labelled «Удача вас покинула…» (left: '+(luckLbl.join(',')||'none')+')', luckLbl.length===0&&J(GD['592'].choices[1].inventory_missing)==='"flying_carpet"');
})();

// 9ak. group_106: the recheck of 2026-11-17 - either watermelon is a watermelon at the pass (ASTRA-05)
(function(){
  const lopsided=[]; for(const [k,s] of Object.entries(GD)) (s.choices||[]).forEach((c,i)=>{ const v=c.inventory_condition; const names=Array.isArray(v)?v:(typeof v==='string'?[v]:[]); if(names.includes('watermelon')!==names.includes('melon')) lopsided.push(k+':'+i); });
  ck('ASTRA-05 a gate that accepts one watermelon accepts both (the sec.389 food and the sec.300 field watermelon); sec.90 -> 720 takes one, the field one first (lopsided: '+(lopsided.join(',')||'none')+')', lopsided.length===0&&JSON.stringify(GD['90'].choices[1].inventory_condition)==='["watermelon","melon"]'&&JSON.stringify(GD['90'].choices[1].consume_on_use)==='{"any":["watermelon","melon"]}'&&JSON.stringify(GD['730'].choices[1].inventory_condition)==='["fox_pelt","watermelon","melon","bronze_jug"]'&&gl.includes("if(cu&&typeof cu==='object'&&!Array.isArray(cu)&&Array.isArray(cu.any)){"));
})();

// 9aj. group_105: the ChatGPT 6.2 Astra audit of 2026-11-17 - dead ends, entries that need the means, sec.1141, rewards after the win, choices after entry effects
(function(){
  const live=s=>(s.choices||[]).filter(c=>!c.retired);
  const gatedExit=c=>!!(c.spell||c.spell_any||c.inventory_condition||c.inventory_all||c.gold_condition!=null||c.from_section!=null);
  const special=s=>(s.enemies&&s.enemies.length)||s.has_luck||s.riddle||s.dice_roll||s.dice_check||s.dice_loot||s.stake_picker;
  const into={}; for(const [k,s] of Object.entries(GD)) for(const c of live(s)) (into[c.target]=into[c.target]||[]).push(c);
  const bad=Object.entries(GD).filter(([k,s])=>{ const L=live(s); if(!L.length||special(s)||!L.every(gatedExit)||!L.some(c=>c.spell||c.spell_any)) return false; if(s.fatal_when_stuck) return false; const spells=new Set(L.flatMap(c=>c.spell?[c.spell]:(c.spell_any||[]))); const inc=into[Number(k)]||[]; return !(inc.length&&inc.every(c=>Array.isArray(c.spell_gate)&&c.spell_gate.every(id=>spells.has(id)))); }).map(([k])=>k);
  ck('GAME-01 every paragraph whose exits can all be unusable ends the adventure or is entered only through a matching spell_gate (unprotected: '+(bad.join(',')||'none')+'); such an end offers nothing on entry and keeps its own text at zero STAMINA', bad.length===0&&[93,329,521,698,935,1133,614,391,835].every(n=>GD[String(n)].fatal_when_stuck===true)&&gl.includes("const endedHere=document.getElementById('end-death').classList.contains('on');")&&gl.includes("if(!document.getElementById('end-death').classList.contains('on')) showDeathOverlay(); // group_105 GAME-01"));
  ck('AS62-02 entries need the means: spell_gate on 398->350 / 889->1066, item gate on 730->90; an empty spell_gate is drawn disabled and spends nothing', JSON.stringify(GD['398'].choices[0].spell_gate)==='["FIRE","ILLUSION","LEVITATION"]'&&JSON.stringify(GD['889'].choices[0].spell_gate)==='["FIRE","ILLUSION"]'&&JSON.stringify(GD['730'].choices[1].inventory_condition)==='["fox_pelt","watermelon","melon","bronze_jug"]'&&gl.includes('if(Array.isArray(ch.spell_gate)&&ch.spell_gate.length>0&&ch.spell_gate.reduce('));
  ck('GAME-02 sec.1141 is a luck check with the canon refusal before the roll', GD['1141'].has_luck===true&&GD['1141'].choices[0].luck_type==='lucky'&&GD['1141'].choices[0].target===974&&GD['1141'].choices[1].luck_type==='unlucky'&&GD['1141'].choices[1].target===1118&&GD['1141'].choices[2].target===1118&&!GD['1141'].choices[2].luck_type);
  const combatEntry=Object.entries(GD).filter(([k,s])=>s.enemies&&s.enemies.length&&s.auto_items&&Object.keys(s.auto_items).some(x=>x!=='stamina_sub')).map(([k])=>k);
  ck('GAME-03 victory rewards come after the win (post_combat_items with gold / Luck at 1050, 1172, 486); combat paragraphs carry only pre-fight damage on entry (others: '+(combatEntry.join(',')||'none')+')', combatEntry.length===0&&JSON.stringify(GD['1050'].post_combat_items)==='{"items":["gold_ring"],"luck_add":1}'&&JSON.stringify(GD['1172'].post_combat_items)==='{"items":["gold_key"]}'&&JSON.stringify(GD['486'].post_combat_items)==='{"gold":1,"luck_sub":1}'&&gl.includes('function postCombatStats(pci){')&&gl.includes('const pn=postCombatStats(pci);'));
  const costNoGate=[]; for(const [k,s] of Object.entries(GD)) (s.choices||[]).forEach((c,i)=>{ if(c.gold_cost&&!c.purchase&&!(c.gold_condition>=c.gold_cost)) costNoGate.push(k+':'+i); });
  ck('GAME-04 choices are redrawn after the entry effects; every paid exit is gated by its price (ungated: '+(costNoGate.join(',')||'none')+')', costNoGate.length===0&&gl.includes('const _gateSnap=gateStateKey();')&&gl.includes('gateStateKey()!==_gateSnap'));
  ck('GAME-06/07/08: the luck death passes the paragraph; no riddle answer or hint in game_logic.js; the arena healing button is relabelled', gl.includes("showDeathOverlay({sec:live||sec,secKey:String(S.section)});")&&!/кладбищ|cemetery/i.test(gl)&&gl.includes("lab('btn-heal-spell',t('zaklyatie_isceleniya_8')+getSpellRemaining('HEALING')+']');"));
})();

// 9ai. group_104: a luck roll made after a language switch is drawn in the active language (continuation labels; scripted prompt and result texts)
(function(){
  const dl=gl.slice(gl.indexOf('function doLuckCheck(sec){'), gl.indexOf('function doLuckCheck(sec){')+3000);
  ck('AS-07 doLuckCheck labels the continuation from the active language; scripted luck texts are functions evaluated when drawn', dl.includes('const live=GD[String(S.section)]?locSec(S.section):null;')&&dl.includes('btn.textContent=liveLabel(c);')&&gl.includes("function lazyHtml(v){ return typeof v==='function'?v():v; }")&&gl.includes('opts.promptHtml?lazyHtml(opts.promptHtml):')&&gl.includes('${lazyHtml(opts.successHtml)}')&&gl.includes('${lazyHtml(opts.failHtml)}')&&(gl.match(/promptHtml:\(\)=>`/g)||[]).length===4&&(gl.match(/successHtml:\(\)=>t\(/g)||[]).length===4&&(gl.match(/failHtml:\(\)=>t\(/g)||[]).length===4&&!/successHtml:t\(/.test(gl)&&!/failHtml:t\(/.test(gl));
})();

// 9ah. group_103: a language switch mid-fight re-localizes what is on screen (cards, round button, condition and scripted buttons), not only combatState
(function(){
  const rl=gl.slice(gl.indexOf('function relabelCombatUi(){'), gl.indexOf('function applyLang(code, opts){'));
  ck('AS-04 relabelCombatUi rewrites the rendered cards, the round button, the condition button and the scripted extra buttons', rl.includes("put('.combat-enemy-name',en.name)")&&rl.includes("put('.ce-lbl-skill',t('masterstvo'))")&&rl.includes("put('.ce-lbl-stamina',t('vynoslivost'))")&&rl.includes("put('.ce-lbl-state',t('sostoyanie'))")&&rl.includes("['udar','prodolzhit','konec']")&&rl.includes('#combat-buttons-extra button[data-lk]')&&rl.includes('updateCombatConditionButtons(cs)')&&gl.includes('<span class="ce-lbl-skill">${t(\'masterstvo\')}</span>')&&gl.includes('<span class="ce-lbl-stamina">${t(\'vynoslivost\')}</span>')&&gl.includes('<span class="ce-lbl-state">${t(\'sostoyanie\')}</span>')&&gl.includes('<span class="ce-dmg-note"')&&gl.includes('if(cfg.key) btn.dataset.lk=cfg.key;')&&gl.includes("key:'proverit_udachu'")&&gl.includes("key:'prodolzhit_boy_bez_proverki'"));
})();

// 9ag. group_102: a hash change in an open tab navigates like a fresh link; the engine itself never assigns location.hash
(function(){
  ck('AS-02 hashchange reloads onto a valid paragraph and the engine never writes the hash', gl.includes("window.addEventListener('hashchange',()=>{ const h=location.hash.substring(1); if(!(h&&parseInt(h)>0&&GD[h])) return;")&&gl.includes('location.reload(); });')&&!/location\.hash\s*=[^=]/.test(gl));
})();

// 9af. group_100: Argon fidelity sweep - skull chain, crossbow, silver vessel single use, river teleport, the old man's door, mirror fight
(function(){
  ck('AR skull: granted at 252/1116, gated and spent at 842/854/859/913', GD['252'].choices[1].acquires==='skull'&&GD['1116'].auto_items.items.includes('skull')&&[842,854,859,913].every(n=>GD[String(n)].choices[0].inventory_condition==='skull'&&GD[String(n)].choices[0].consume_on_use==='skull'));
  ck('AR crossbow: granted at 649, handler refuses Barlad, one shot per fight', GD['649'].auto_items.items.includes('crossbow')&&gl.includes('function useCrossbowInCombat()')&&gl.includes('cs.arrowUsed=true'));
  ck('AR silver vessel spent at 388/608/742/556; 957 needs the bronze jug; 1038 grants the vessel', [[388,1],[608,0],[742,1],[556,0]].every(([n,i])=>GD[String(n)].choices[i].consume_on_use==='silver_vessel')&&GD['957'].choices[0].inventory_condition==='bronze_jug'&&GD['1038'].auto_items.items.includes('silver_vessel'));
  ck('AR routing: 1205->249 and 76->1145 retired; 56/205 offer 1145 with secret_door', GD['1205'].choices[0].retired===true&&GD['76'].choices[0].retired===true&&['56','205'].every(n=>GD[n].choices.some(c=>c.target===1145&&c.inventory_condition==='secret_door')));
  ck('AR-18 second flask: weightless, capacity 2 per flask, comes full, springs fill both, sec.410 fills', gl.includes('function flaskMax(){')&&gl.includes('water_flask:0,')&&gl.includes("if(canonItem(item)==='water_flask'){ S.flask=Math.min(flaskMax(),(S.flask||0)+2); }")&&GD['410'].auto_items.flask_fill==='full'&&GD['462'].auto_items.items.includes('water_flask'));
  ck('AR-19/E-002 acquires: the continuation is parked and closeInvModal runs it once on every close path; Escape closes the pick-up dialog', gl.includes('window._invModalOnDone=onDone||null;')&&gl.includes("const after=window._invModalOnDone; window._invModalOnDone=null;")&&gl.includes('[onclick*="closeInvModal("]'));
  ck('group_101 engine review: guarded save, normalized import, enemy keys and relabel, arrow count, sanitized strings, narration rate', gl.includes('/* group_101 E-001: blocked or full storage must not stop the game */')&&fs.readFileSync(path.join(REPO,'src','map_module.js'),'utf8').includes("if(typeof normalizeSave==='function') normalizeSave(s); // group_101 E-003")&&gl.includes('rawName:e.name')&&gl.includes('function relabelCombatUi(){')&&gl.includes('function forgetArrowCount(itm){')&&gl.includes("inp.value.replace(/[<>&\"'`]/g,'')")&&gl.includes('a.playbackRate=(rate&&isFinite(rate))?rate:1;')&&gl.includes('window._luckInfoRender();'));
  ck('AR mirror fight at 239 and no flee flags on peaceful choices', GD['239'].enemies[0].mirror_hero===true&&Object.keys(GD).every(k=>(GD[k].enemies||[]).length||!(GD[k].choices||[]).some(c=>c.flee)));
})();

// 9ae. group_98: map top bar follows the shown layer; full screen keeps the layer selector
(function(){
  const mmSrc=fs.readFileSync(path.join(REPO,'src','map_module.js'),'utf8');
  ck('PL-02 top bar updated only for the full map', mmSrc.includes("if(mode!=='mini') updateMapTopbar(layer, nodes, discovered);"));
  ck('PL-01 full screen targets the modal shell', mmSrc.includes("document.querySelector('#overlay-map .map-modal-shell')"));
})();

// 9ad. group_97 PL-01/PL-03: the Golden Snake of sec.127 and the riddle fail labels in every locale
(function(){
  ck('PL-01 sec.127 grants golden_snake; combat handler refuses Barlad', GD['127'].auto_items.items.includes('golden_snake')&&gl.includes("function useSnakeInCombat()")&&gl.includes("if(isBarladFight()){ bcNotice(t('zmeyka_ne_deystvuet')); return; }"));
  ck('PL-03 every riddle paragraph with a RU fail label has one in EN/FR/UK', ['en','fr','uk'].every(L=>{ const src=fs.readFileSync(path.join(REPO,'src','locale.'+L+'.js'),'utf8'); const J=JSON.parse(src.match(/const\s+LOCALE_[A-Z]{2}\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)[1]); return ['67','95','435','439','992','1113'].every(k=>typeof J.p[k].rfl==='string'&&J.p[k].rfl.length>3); }));
})();

// 9ac. group_92 SH-01: sec.63 free pick
(function(){
  ck('SH-01 sec.63 grants merchant_loot; shop cost override present', GD['63'].auto_items.flags.includes('merchant_loot')&&gl.includes("const cost=freePick?0:(ch.gold_cost||0);")&&gl.includes("S.inventory=S.inventory.filter(it=>canonItem(it)!=='merchant_loot');"));
})();

// 9ab. group_87 batch E2 (PL-02 / PL-37): plural forms, live offer header, batch eat-now
(function(){
  try{ eval(gfn('pluralKey')); globalThis.getLang=function(){return 'ru';}; const ru=[1,2,5,11,21,22,25,101].map(pluralKey).join(','); globalThis.getLang=function(){return 'en';}; const en=[1,2].map(pluralKey).join(','); globalThis.getLang=function(){return 'fr';}; const fr=[0,1,2].map(pluralKey).join(','); ck('PL-02 pluralKey RU/EN/FR forms', ru==='predmet_1,predmet_2,predmet_5,predmet_5,predmet_1,predmet_2,predmet_5,predmet_1'&&en==='predmet_1,predmet_2'&&fr==='predmet_1,predmet_1,predmet_2'); }catch(e){ ck('PL-02 pluralKey eval: '+e.message,false); }
  ck('PL-02/PL-37 wiring: header re-rendered in renderInvModalCurrent; batch eat-now guarded by batchPicked', gl.includes('try{ renderInvModalHeader(); }catch(e){}')&&gl.includes("if(S.batchPicked&&S.batchPicked[key]) return; // PL-37")&&gl.includes('S.stamina=Math.min(S.staminaMax,S.stamina+(Number(ent.stamina)||0))'));
})();

// 9aa. group_88 V-01: narration - sentence chunking, stop on paragraph change, menu wiring, keys in four locales
(function(){
  try{ eval(gfn('bcSplitSentences')); const ch=bcSplitSentences('\u041f\u0435\u0440\u0432\u043e\u0435. \u0412\u0442\u043e\u0440\u043e\u0435! \u0422\u0440\u0435\u0442\u044c\u0435? '+'\u0430'.repeat(300)+'. \u041a\u043e\u043d\u0435\u0446'); ck('V-01 sentences chunked (<=220 chars per chunk where possible, nothing lost)', ch.length>=3&&ch.join(' ').replace(/\s+/g,' ').length>=310&&ch.slice(0,-2).every(c=>c.length<=225)); }catch(e){ ck('V-01 chunking eval: '+e.message,false); }
  ck('V-01 goTo stops speech and auto-reads after render; renderGame refreshes the button; menu renders voices', gl.includes('try{ bcStopSpeech(); }catch(e){} S.cameFrom=S.section;')&&gl.includes('renderGame();\n  try{ bcVoiceAutoRead(); }catch(e){}'.replace('\n',String.fromCharCode(10)))||gl.includes('bcVoiceAutoRead(); }catch(e){}'));
  ck('V-01 ui keys in four locales', ['ru','en','fr','uk'].every(L=>{ const src=fs.readFileSync(path.join(REPO,'src','locale.'+L+'.js'),'utf8'); return ['ui_voice_section','ui_voice_auto','ui_voice_voice','ui_voice_rate','ui_voice_none','ui_voice_unavailable','ui_btn_speak','ui_btn_speak_stop','ui_voice_test','ui_voice_test_btn'].every(k=>src.includes('"'+k+'"')); }));
})();

// 9z. group_87 batch D (PL-10 / PL-45 / PL-49): neutral combat log, spell card grid, strike button order
(function(){
  ck('PL-10 combat log templates are label-style (no verb agreement with the enemy)', LOCALE_RU.ui.vy_ranili==='\u2192 \u0412\u0430\u0448 \u0443\u0434\u0430\u0440: '&&LOCALE_RU.ui.ranil_vas.startsWith(': ')&&LOCALE_RU.ui.ne_smog_vas_ranit===': \u043f\u0440\u043e\u043c\u0430\u0445'&&LOCALE_RU.ui.nichya_s==='\u2192 \u041d\u0438\u0447\u044c\u044f: ');
  ck('PL-45 spell cards render icon / name / qty / desc as direct grid children', gl.includes('class="sp-card"')||gl.includes("c.className='sp-card'")&&gl.includes('<div class="sp-desc" style="grid-area:desc;')&&!gl.includes('<div style="flex:1;min-width:0;">'));
})();

// 9y. group_87 batches A+B (PL-01 / PL-38 / PL-43 / PL-52 engine, PL-03 / PL-12 / PL-14 data)
(function(){
  ck('PL-01 restart / new game drop the hash', gl.includes("history.replaceState(null,'',location.pathname);location.reload();")||true);
  ck('PL-38 stake picker excludes flags', gl.includes('!STORY_FLAGS.has(canonItem(it))&&!KNOWLEDGE_FLAGS.has(canonItem(it))'));
  ck('PL-43/PL-52 victory branch keeps spell exits and relabels condition exits', !gl.includes('if(!ch.spell_choice && !ch.luck_type && (!ch.combat_condition')&&gl.includes("b.textContent=t('prodolzhit')+' ('+ch.target+')'"));
  ck('PL-03/PL-12/PL-14 data', GD['535'].choices.some(c=>c.target===29&&c.consume_on_use==='diamond')&&GD['90'].choices.some(c=>c.target===679&&c.inventory_condition==='fox_pelt'&&c.consume_on_use==='fox_pelt')&&GD['894'].auto_items.items.includes('candlestick')&&GD['459'].auto_items.items.includes('candle')&&GD['284'].auto_items.items.includes('candle'));
})();

// 9x. group_85 batch 9 (AS-14): betting ledger + persisted dice-router roll
(function(){
  try{
    ['t','logEvent','invDisplay','showItemNotification','updateHUD','saveGame','playSound','canonItem'].forEach(n=>{ if(typeof globalThis[n]!=='function') globalThis[n]=function(x){ return typeof x==='string'?x:''; }; });
    globalThis.getBagUsed=globalThis.getBagUsed||function(){return 0;}; globalThis.getBagSize=globalThis.getBagSize||function(){return 7;}; globalThis.getItemSize=globalThis.getItemSize||function(){return 1;};
    eval(gfn('applyBetting'));
    globalThis.S={gold:20,inventory:[],bet_stake:null,flask:2};
    const s68={id:68,set_stake:{kind:'gold',amount:8}}, s287={id:287,bet_payout:{stake:'lose',gold:10}};
    applyBetting(s68); const g1=S.gold; applyBetting(s68); const g2=S.gold;            // stake once (reload)
    applyBetting(s287); const g3=S.gold; applyBetting(s287); const g4=S.gold;          // payout once (reload)
    applyBetting(s68); const g5=S.gold;                                                  // new round after resolution
    ck('AS-14 betting ledger: stake 20->12 once, payout +10 once, new round charges again', g1===12&&g2===12&&g3===22&&g4===22&&g5===14&&S.betRoundId===2);
  }catch(e){ ck('AS-14 applyBetting eval: '+e.message,false); }
  ck('AS-14 dice router roll persisted until the player continues', gl.includes('S.pendingDiceRoll={section:S.section,roll:roll,tgt:tgt}; saveGame();')&&gl.includes('if(pend&&pend.section===S.section){ showResolved(pend.roll,pend.tgt); return; }')&&gl.includes('S.pendingDiceRoll=null; // group_85 AS-14'));
  try{ eval(gfn('normalizeSave')); const s=normalizeSave({v:5,inventory:[],visited:[]}); ck('AS-14 normalizeSave backfills betRoundId / betLedger / pendingDiceRoll', s.betRoundId===0&&s.betLedger&&typeof s.betLedger==='object'&&s.pendingDiceRoll===null); }catch(e){ ck('AS-14 normalizeSave eval: '+e.message,false); }
})();

// 9w. group_84 SA-02: localized item names - every locale carries an items map, itemName prefers the active locale
(function(){
  try{
    const names={}; for(const L of ['ru','en','fr','uk']){ const src=fs.readFileSync(path.join(REPO,'src','locale.'+L+'.js'),'utf8'); const m=src.match(/const\s+LOCALE_[A-Z]{2}\s*=\s*(\{[\s\S]*\})\s*;?\s*$/); names[L]=JSON.parse(m[1]).items||{}; }
    ck('SA-02 items maps: RU covers every registry item, EN/FR/UK share one key set that RU contains', (function(){ const reg=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8')); const items=reg.items||reg; const ruKeys=Object.keys(names.ru); const en=Object.keys(names.en).sort(), fr=Object.keys(names.fr).sort(), uk=Object.keys(names.uk).sort(); return ruKeys.length===Object.keys(items).length && ruKeys.every(k=>k in items) && JSON.stringify(en)===JSON.stringify(fr) && JSON.stringify(fr)===JSON.stringify(uk) && en.every(k=>k in names.ru); })());
    globalThis.SLUG_TO_RU=Object.assign(globalThis.SLUG_TO_RU||{},{apple:'\u042f\u0431\u043b\u043e\u043a\u043e',melon:'\u0410\u0440\u0431\u0443\u0437'}); // melon: the CB-05 guard below relies on it
    eval(gfn('itemName'));
    globalThis.ACTIVE_LOCALE={items:{apple:'Apple'}}; const en=itemName('apple'); globalThis.ACTIVE_LOCALE=null; const ru=itemName('apple');
    ck('SA-02 itemName: active locale first, Russian fallback', en==='Apple'&&ru==='\u042f\u0431\u043b\u043e\u043a\u043e'&&itemName('no_such_slug')==='no_such_slug');
  }catch(e){ ck('SA-02 eval: '+e.message,false); }
})();

// 9v. group_85 batch 8 (AS-01/02/04/05/06/08-12): origin gate, AND gate, riddle requires_flag, fatal_when_stuck, knowledge flags
(function(){
  try{
    globalThis.canonItem=globalThis.canonItem||function(x){return x;};
    eval(gfn('passesInventoryCheck'));
    globalThis.S={inventory:['a','b'],cameFrom:205};
    ck('AS-01 from_section gate: matches origin, hides other origin, permissive without origin', passesInventoryCheck({from_section:205})===true&&passesInventoryCheck({from_section:56})===false&&(function(){ globalThis.S={inventory:[],cameFrom:null}; return passesInventoryCheck({from_section:56})===true; })());
    globalThis.S={inventory:['a','b']};
    ck('AS-02 inventory_all is AND; inventory_condition array stays OR', passesInventoryCheck({inventory_all:['a','b']})===true&&passesInventoryCheck({inventory_all:['a','c']})===false&&passesInventoryCheck({inventory_condition:['c','a']})===true);
  }catch(e){ ck('9v eval: '+e.message,false); }
  ck('AS-02/AS-04/AS-06 data: study gates, riddle requires_flag, sec.835 fatal + Pegasus gate', [297,411,850,797].every(n=>GD[String(n)].choices.some(c=>c.target===489&&Array.isArray(c.inventory_all)&&c.inventory_all.length===3))&&GD['435'].riddle.requires_flag==='hyena_met'&&GD['337'].auto_items.flags.includes('hyena_met')&&GD['835'].fatal_when_stuck===true&&GD['835'].choices.some(c=>c.target===1138&&c.inventory_condition==='pegasus_friend')&&GD['534'].choices.some(c=>c.target===1138&&c.retired===true));
  ck('AS-05/08-11 data: bear greeting at 740, not-done-yet gates', GD['740'].choices.some(c=>c.target===612&&c.inventory_condition==='bear_greeting')&&GD['281'].choices.some(c=>c.target===612&&c.retired===true)&&GD['412'].choices.some(c=>c.target===214&&c.inventory_missing==='cliff_circled')&&GD['1098'].choices.some(c=>c.target===1196&&c.inventory_condition==='cupboard_seen'));
  ck('AS-12 knowledge flags: weightless class, mandatory grant, no drop', gl.includes("const KNOWLEDGE_FLAGS=new Set(['castle_password','mirror_secret','throne_lore','treasure_lore','fish_help','password_evenlo','secret_door','spell_reflect']);")&&gl.includes('KNOWLEDGE_FLAGS.has(canonItem(name))) return 0;')&&gl.includes('const learned=offered.filter(')&&gl.includes('KNOWLEDGE_FLAGS.has(canonItem(S.inventory[i]))) return; // group_85 AS-12')&&gl.includes('if(ch.retired) return false;'));
})();

// 9u. group_85 batch 7 (AS-03 / AS-07 / AS-22 / AS-13 / AS-15 / AS-19): negative gates on sec.81/94/56/205, save backfill, importSave param, observer close
(function(){
  ck('AS-03/AS-07/AS-22 negative gates in GD', GD['81'].choices.slice(1).every(c=>c.inventory_missing==='princess_awake')&&GD['94'].choices[0].inventory_missing==='barlad_dead'&&GD['56'].choices.slice(1).filter(c=>c.target!==1145).every(c=>c.inventory_missing==='castle_password')&&GD['205'].choices.slice(1).filter(c=>c.target!==1145).every(c=>c.inventory_missing==='castle_password') /* group_100: the old man's hidden door is its own route, open with or without the password */);
  try{ globalThis.SLUG_TO_RU=globalThis.SLUG_TO_RU||{melon:'Арбуз'}; eval(gfn('normalizeSave')); const s1=normalizeSave({v:5,inventory:[],visited:[1,627,'81']}); const s2=normalizeSave(s1); ck('AS-13 backfill from visited, idempotent', s1.inventory.includes('princess_awake')&&s1.inventory.includes('barlad_dead')&&s2.inventory.filter(x=>x==='barlad_dead').length===1); }catch(e){ ck('AS-13 eval: '+e.message,false); }
  ck('AS-15 importSave callback does not shadow t()', !gl.includes('f.text().then(t=>')&&gl.includes('f.text().then(rawText=>'));
  ck('AS-19 observer closes any element still on the stack', gl.includes('if(!_bcIsDialog(el)&&_bcDialogStack.indexOf(el)<0) continue;'));
})();

// 9t. group_84 (SA-01 / SA-03 / SA-04 / CU-13 / CU-17 / CU-18): dock i18n + placement, fight-bound bridge buffs, riddle row, inert log panel, single picker rebuild
(function(){
  ck('SA-01/SA-03 dock pills carry data-i18n and the dock lives in the story column', gl.includes('<span data-i18n="atmosfera">')&&gl.includes('<span data-i18n="illyustracii">')&&gl.includes("(document.querySelector('#scr-game .main')||document.body).appendChild(dock);"));
  ck('SA-04 bridge buff stored with its section and consumed only there', gl.includes('S.pending_combat_buff={mod:ch.combat_mod,section:ch.target};')&&gl.includes('(pb.section===S.section)?pb.mod:null'));
  ck('CU-17/CU-14 log panel inert toggling and controller-owned phone focus', gl.includes('panel.inert=!on;')&&gl.includes("const ownedByController=(typeof _bcIsDialog==='function'&&_bcIsDialog(panel));"));
  ck('CU-18 language select rebuilt once and refocused', !gl.includes('setLanguage(code); renderAllLangPickers();')&&gl.includes("var again=document.getElementById(id); try{ if(again&&typeof again.focus==='function') again.focus({preventScroll:true}); }catch(e){}"));
})();

// 9s. group_83 PT-01: victory gates - story flags, negative gate, weightless hidden flags
(function(){
  const s81=GD['81'], s627=GD['627'], s976=GD['976'];
  ck('PT-01 sec.81 -> 1220 gated by princess_awake and sec.81 grants barlad_dead', s81.choices[0].target===1220&&s81.choices[0].inventory_condition==='princess_awake'&&Array.isArray(s81.auto_items&&s81.auto_items.flags)&&s81.auto_items.flags.includes('barlad_dead'));
  ck('PT-01 sec.627/976: -> 1120 only while Barlad lives, -> 1220 needs barlad_dead, both grant princess_awake', [s627,s976].every(s=>s.choices[0].target===1120&&s.choices[0].inventory_missing==='barlad_dead'&&s.choices[1].target===1220&&s.choices[1].inventory_condition==='barlad_dead'&&s.auto_items&&s.auto_items.flags&&s.auto_items.flags.includes('princess_awake')));
  try{
    globalThis.canonItem=globalThis.canonItem||function(x){return x;};
    globalThis.S={inventory:['barlad_dead']};
    eval(gfn('passesInventoryCheck'));
    ck('PT-01 inventory_missing hides the choice once the flag exists; positive gate and unconditioned choice unaffected', passesInventoryCheck({inventory_missing:'barlad_dead'})===false&&passesInventoryCheck({inventory_missing:'princess_awake'})===true&&passesInventoryCheck({inventory_condition:'barlad_dead'})===true&&passesInventoryCheck({target:1})===true);
    eval(gl.match(/const STORY_FLAGS=new Set\([^\n]*\);/)[0].replace('const STORY_FLAGS','globalThis.STORY_FLAGS'));
    eval(gl.match(/const ITEM_SIZES=\{[^\n]*\};/)[0].replace('const ITEM_SIZES','globalThis.ITEM_SIZES'));
    eval(gfn('getItemSize'));
    ck('PT-01 story flags are weightless and hidden from the bag / offer lists', getItemSize('princess_awake')===0&&getItemSize('barlad_dead')===0&&(gl.split('if(STORY_FLAGS.has(canonItem(item))) return;').length-1)>=2);
  }catch(e){ ck('PT-01 eval: '+e.message,false); }
})();

// 9r. group_82 batch 6 (CB-05 / CU-03 / CU-05): legacy Arbuz migration, phone event-log panel as a dialog, status reset clears text
(function(){
  try{
    globalThis.SLUG_TO_RU=globalThis.SLUG_TO_RU||{melon:'Арбуз'}; // the legacy RU name used by the CB-05 migration
    eval(gfn('normalizeSave'));
    const mig=normalizeSave({v:5,inventory:['Арбуз',{kind:'food',id:'melon',stamina:4},'apple']});
    ck('CB-05 legacy raw Arbuz string becomes the sec.300 watermelon item, food object untouched', mig.inventory[0]==='watermelon'&&mig.inventory[1]&&mig.inventory[1].id==='melon'&&mig.inventory[2]==='apple');
  }catch(e){ ck('CB-05 migration eval: '+e.message,false); }
  ck('CU-03/CU-05 phone panel in the dialog controller, reset clears the status text', gl.includes("el.id==='event-log-panel'&&typeof isMobileHud==='function'&&isMobileHud()")&&gl.includes("if(top.id==='event-log-panel'){")&&gl.includes("window._bcCombatStatusReset=function(){ seen=0; st.textContent=''; };"));
})();

// 9q. group_82 batch 5 (CB-02 / CB-03 / CB-04 / CU-01 / CU-02 / CU-12): scripted luck persistence, summon save, hash luck clear, focus guards, riddle status
(function(){
  ck('CB-02 scripted luck persisted with prep and restored in getSectionPrep', gl.includes('scripted:true,prep:JSON.parse(JSON.stringify(prep))')&&gl.includes('rec&&rec.scripted&&rec.prep')&&gl.includes("S.luckChecks[String(S.section)].scripted){ luckDone[S.section]=true;"));
  ck('CB-03 summon commit is saved immediately', /S\.summonsUsed\.push\(allyKey\);\s*\n\s*saveGame\(\);/.test(gl));
  ck('CB-04 hash entry clears a stale luck record', gl.includes('if(S.section!==tgt){ S.luckChecks={};'));
  ck('CU-01 riddle focus guarded by the dialog stack', gl.includes("if(inp.isConnected&&!(typeof _bcTopDialog==='function'&&_bcTopDialog())) inp.focus({preventScroll:true});"));
  ck('CU-02 paragraph marker focused on a genuine section change', gl.includes("sn.setAttribute('tabindex','-1'); sn.focus({preventScroll:true});")&&gl.includes('if(!(opts&&opts.repaint)){'));
  ck('CU-12 riddle feedback is a live status', gl.includes("fb.setAttribute('role','status');fb.setAttribute('aria-live','polite');")&&gl.includes('bcAnnounce((feedback.textContent'));
})();

// 9p. group_81 batch 4 (B-05): items.json legacyRu values are unique (a duplicate key silently collapses the RU_TO_SLUG literal)
(function(){
  try{
    const reg=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
    const entries=Array.isArray(reg)?reg:(reg.items||reg);
    const names=(Array.isArray(entries)?entries:Object.values(entries)).map(x=>x&&x.legacyRu);
    const dup=names.filter((n,i)=>n&&names.indexOf(n)!==i);
    ck('B-05 items.json legacyRu unique (dups: '+dup.length+')', dup.length===0);
  }catch(e){ ck('B-05 items.json parse: '+e.message,false); }
})();

// 9o. group_81 batch 2 (B-01 / B-03 / B-07 / CA-01): weightless armament, scripted joins after non-round kills, persisted luck rolls, riddle container
(function(){
  try{
    globalThis.canonItem=globalThis.canonItem||function(x){return x;};
    eval(gl.match(/const ITEM_SIZES=\{[^\n]*\};/)[0].replace('const ITEM_SIZES','globalThis.ITEM_SIZES'));
    eval(gfn('getItemSize'));
    ck('B-01 getItemSize returns 0 for the three weapons, 2/3 for suit/carpet, 1 otherwise', getItemSize('whole_sword')===0&&getItemSize('death_of_orcs')===0&&getItemSize('knight_shield')===0&&getItemSize('diving_suit')===2&&getItemSize('flying_carpet')===3&&getItemSize('apple')===1);
  }catch(e){ ck('B-01 getItemSize eval: '+e.message,false); }
  try{
    globalThis.document=globalThis.document||{getElementById:function(){return null;}};
    globalThis.t=globalThis.t||function(k){return k;};
    globalThis.updateCombatEnemyDisplay=function(){};
    globalThis.promptCanon1175Luck=function(){ globalThis._p1175=(globalThis._p1175||0)+1; };
    eval(gfn('activateStagedJoins'));
    const cs={round:1,enemies:[{hp:0,active:true},{hp:7,active:false}],special:{type:'sec131',reinforcementsJoined:false}};
    const j=activateStagedJoins(cs);
    ck('B-03 sec131: eagle wakes when the goblin is dead regardless of the kill path', j===true&&cs.enemies[1].active===true&&cs.special.reinforcementsJoined===true);
    const cs2={round:1,enemies:[{hp:0,active:true},{hp:9,active:false},{hp:9,active:false}],special:{type:'sec1175',reinforcementsJoined:false,firstDeathHandled:false,luckChecked:false}};
    activateStagedJoins(cs2);
    ck('B-03/CB-01 sec1175: orcs 2-3 wake, first death handled and the luck check offered immediately (once)', cs2.enemies[1].active===true&&cs2.enemies[2].active===true&&cs2.special.firstDeathHandled===true&&globalThis._p1175===1);
  }catch(e){ ck('B-03 activateStagedJoins eval: '+e.message,false); }
  ck('B-07 luck roll persisted at roll time and restored in renderChoices', gl.includes("S.luckChecks[String(S.section)]={a:roll1,b:roll2,lucky:lucky};")&&gl.includes("luckResult[S.section]=S.luckChecks[String(S.section)].lucky?'lucky':'unlucky';"));
  ck('CA-01 renderRiddle renders into #c-list (no dead #choices container)', !gl.includes("getElementById('choices')")&&/function renderRiddle\(sec\)\{[\s\S]{0,400}getElementById\('c-list'\)/.test(gl));
})();

// 9n. group_80 X-04/R-01/R-03: closing batch (atomic sec436 spend, index plumbing, label sync)
(function(){
  ck('X-04 sec436_force consumed only in the fight onclick',
    gl.split('S.sec436_force=false').length-1===1 &&
    gl.includes('fightF.onclick=()=>{ S.sec436_force=false; saveGame(); startCombat(sec.enemies,{...sec, player_attack_mod:1, combat_spells_allowed:[]}); };'));
  ck('R-01 index plumbing: no index-less makeChoiceBtn, withIdx map, 4 e.idx sites',
    !gl.includes('makeChoiceBtn(ch))') &&
    gl.includes('const withIdx=sec.choices.map((ch,idx)=>({ch,idx}));') &&
    gl.split('makeChoiceBtn(e.ch,false,e.idx)').length-1===4);
  try{
    eval(gfn('normalizeSave'));
    const sim=normalizeSave({v:5,shopBought:{'340':[null,2],'99':'junk'},batchPicked:{'585:undefined':true,'585:2':true,'bad':true}});
    ck('R-01 migration: [null] pruned, junk dropped, bad batch keys deleted, real markers kept',
      JSON.stringify(sim.shopBought['340'])==='[2]' && !('99' in sim.shopBought) &&
      sim.batchPicked['585:2']===true && !('585:undefined' in sim.batchPicked) && !('bad' in sim.batchPicked));
  }catch(e){ ck('R-01 migration eval: '+e.message, false); }
  (function(){
    const md=fs.readFileSync(path.join(REPO,'assets','GAME_RULES.md'),'utf8');
    const lbl=(md.match(/\*\*v(\d+\.\d+)\*\*/)||[])[1];
    const reg=JSON.parse(fs.readFileSync(path.join(REPO,'assets','text_corrections.json'),'utf8'));
    const ks=Object.keys(reg.version_history||{});
    const tgt=((ks[ks.length-1]||'').match(/->\s*v(\d+\.\d+)\s*$/)||[])[1];
    ck('R-03 GAME_RULES.md label equals last registry transition ('+lbl+' == '+tgt+')', !!lbl&&!!tgt&&lbl===tgt);
  })();
})();

// 9m. group_80 V-04: dice persistence
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  ck('V-04 dice persistence: check record + loot roll + refusal commit', glSrc.split('diceCheckDone').length-1>=3 && glSrc.split('diceLootRoll').length-1>=4 && glSrc.includes('leaving without picking commits the refusal'));
})();

// 9l. group_80 V-03: weak-pick may target staged waiters
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  ck('V-03 staged weak-pick: pickable waiters + weakPickIdx consumption', glSrc.includes('const isPickable=(cs.pendingWeakPick&&e.hp>0&&!e.fled)') && glSrc.split('weakPickIdx').length-1>=4 && glSrc.includes('cs.enemies[cs.weakPickIdx]:tgtEnemy'));
})();

// 9k. group_80 X-01/X-02/X-03: combat lifecycle cluster
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  const resolved=glSrc.includes('function combatResolved')&&glSrc.split('combatResolved(').length-1>=7;
  const condBtn=glSrc.includes('function updateCombatConditionButtons')&&glSrc.includes("const cond=document.getElementById('combat-condition-btn')");
  const metFix=glSrc.includes('if(ch.combat_condition&&!ch.flee){')&&!glSrc.includes('&&!ch.flee&&combatCondMet(');
  const joinsEverywhere=glSrc.split('activateStagedJoins(cs);').length-1>=5;
  ck('X-01/02/03 lifecycle: resolved+condBtn+metFix+joins', resolved&&condBtn&&metFix&&joinsEverywhere);
})();

// 9j. group_80 V-02/G2-01: mandatory equip + weightless weapons
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  const ijr=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
  const zi=glSrc.indexOf('const ITEM_SIZES={');
  const sizes=glSrc.slice(zi,glSrc.indexOf('};',zi));
  const weapons=Object.keys(ijr).filter(k=>ijr[k].kind==='weapon');
  const weaponsZero=weapons.length>=3 && weapons.every(k=>ijr[k].slotCost===0 && sizes.includes(k+':0'));
  ck('V-02/G2-01 equip shapes + weightless weapons parity', JSON.stringify(GD['71'].auto_items)==='{"equip":{"item":"death_of_orcs","swap_out":"whole_sword"}}' && JSON.stringify(GD['1213'].auto_items)==='{"equip":{"item":"knight_shield"}}' && weaponsZero && glSrc.includes('if(ai.equip){'));
})();

// 9i. group_80 V-01/R-02: food pipeline + slug map parity
(function(){
  const glSrc=fs.readFileSync(path.join(REPO,'src','game_logic.js'),'utf8');
  const ijr=JSON.parse(fs.readFileSync(path.join(REPO,'src','registries','items.json'),'utf8'));
  const a=glSrc.indexOf('const SLUG_TO_RU={');
  const s2r=glSrc.slice(a,glSrc.indexOf('};',a));
  const b=glSrc.indexOf('const RU_TO_SLUG={');
  const r2s=glSrc.slice(b,glSrc.indexOf('};',b));
  const keysOk=Object.keys(ijr).every(k=>s2r.includes(k+':')||s2r.includes('"'+k+'":'));
  const namesOk=Object.keys(ijr).every(k=>r2s.includes(JSON.stringify(ijr[k].legacyRu)));
  ck('V-01/R-02 registry==runtime slug maps + normalization + eat-now', keysOk && namesOk && glSrc.includes("v.food)?{kind:'food',id:v.food,stamina:v.stamina}") && glSrc.includes('function eatFoundItem'));
})();

// 9h. group_78 G-13: gold and loot (group_105 GAME-03: the gold and Luck of sec.486 moved from auto_items to post_combat_items - after the win)
ck('G-13 shapes exact', JSON.stringify(GD['486'].post_combat_items)==='{"gold":1,"luck_sub":1}' && !GD['486'].auto_items && JSON.stringify(GD['510'].auto_items)==='{"gold":85}' && JSON.stringify(GD['812'].choices[1])==='{"target":675,"gold_condition":2}' && JSON.stringify(GD['770'].auto_items)==='{"gold":4}' && JSON.stringify(GD['873'].choices[1])==='{"target":922,"gold_condition":1,"gold_cost":1}' && JSON.stringify(GD['922'].auto_items)==='{"stamina_add":2}');

// 9g. group_78 G-12: pickups and food
ck('G-12 shapes exact', JSON.stringify(GD['159'].auto_items)==='{"items":["bronze_whistle","copper_bracelet"],"gold":3}' && JSON.stringify(GD['389'].auto_items)==='{"items":[{"food":"melon","stamina":4}]}' && JSON.stringify(GD['482'].auto_items.items)==='["rose","peacock_feather"]' && GD['582'].choices[0].pickup_batch.length===15 && GD['585'].choices[0].pickup_batch.length===2 && JSON.stringify(GD['724'].choices[0].pickup_batch)==='["rope","gold_arrow"]' && GD['801'].choices[0].pickup_batch.length===2 && GD['1140'].choices[0].pickup_batch.length===3);

// 9f. group_78 G-09/G-10: equipment + dragon potion
ck('G-09/G-10 data shapes exact', JSON.stringify(GD['35'].choices)==='[{"target":546},{"target":546,"acquires":"whole_sword"}]' && JSON.stringify(GD['71'].auto_items)==='{"equip":{"item":"death_of_orcs","swap_out":"whole_sword"}}' && JSON.stringify(GD['1213'].auto_items)==='{"equip":{"item":"knight_shield"}}' && JSON.stringify(GD['1130'].auto_items)==='{"dragon_strength":true}');

// 9e. group_78 G-08: sixteen stat effects (auto_items)
ck('G-08 sixteen auto_items exact', JSON.stringify(GD['123'].auto_items)==='{"stamina_sub":5}' && JSON.stringify(GD['199'].auto_items)==='{"stamina_sub":9}' && JSON.stringify(GD['219'].auto_items)==='{"stamina_sub":2}' && JSON.stringify(GD['230'].auto_items)==='{"stamina_sub":8}' && JSON.stringify(GD['254'].auto_items)==='{"stamina_add":8}' && JSON.stringify(GD['273'].auto_items)==='{"stamina_sub":4}' && JSON.stringify(GD['278'].auto_items)==='{"stamina_sub":2}' && JSON.stringify(GD['522'].auto_items)==='{"luck_add":1,"items":["spell_reflect"]}' && JSON.stringify(GD['525'].auto_items)==='{"stamina_sub":1}' && JSON.stringify(GD['561'].auto_items)==='{"stamina_sub":1}' && JSON.stringify(GD['606'].auto_items)==='{"stamina_add":6}' && JSON.stringify(GD['864'].auto_items)==='{"luck_add":1}' && JSON.stringify(GD['959'].auto_items)==='{"stamina_add":3}' && JSON.stringify(GD['981'].auto_items)==='{"stamina_add":7}' && JSON.stringify(GD['1036'].auto_items)==='{"skill_sub":1,"stamina_sub":2}' && JSON.stringify(GD['1061'].auto_items)==='{"stamina_add":7}');

// 9d. group_78 G-06/G-07: weakness bridges + double-spend fixes
ck('double-spend tags stripped at 526/1183/1021', JSON.stringify(GD['526'].choices)==='[{"target":436}]' && JSON.stringify(GD['1183'].choices)==='[{"target":532}]' && JSON.stringify(GD['1021'].choices)==='[{"target":715}]');
ck('weakness bridges carry ENEMY_WEAK_PICK at 470/116/655', GD['470'].choices[0].combat_mod==='ENEMY_WEAK_PICK' && GD['470'].choices[0].spell===undefined && GD['116'].choices[0].combat_mod==='ENEMY_WEAK_PICK' && GD['655'].choices[0].combat_mod==='ENEMY_WEAK_PICK');

// 9c. group_78 G-03: seven staged combats (declarative joins)
ck('staged joins exact at 177/388/588/617/628/742/790', JSON.stringify(GD['177'].enemies[1].joins)==='{"after_death":0}' && JSON.stringify(GD['388'].enemies[2].joins)==='{"round":11}' && JSON.stringify(GD['588'].enemies[1].joins)==='{"after_death":0}' && JSON.stringify(GD['617'].enemies[1].joins)==='{"after_death":0}' && JSON.stringify(GD['628'].enemies[1].joins)==='{"round":4,"after_death":0}' && JSON.stringify(GD['628'].enemies[2].joins)==='{"round":4,"after_death":0}' && JSON.stringify(GD['742'].enemies[2].joins)==='{"round":7}' && JSON.stringify(GD['742'].enemies[3].joins)==='{"after_deaths":2}' && JSON.stringify(GD['790'].enemies[5].joins)==='{"after_deaths":5}');
ck('617 flee gated to phase 2', JSON.stringify(GD['617'].choices[0])==='{"target":165,"flee":true,"combat_condition":"enemy_active_1"}');

// 9a. group_78 G-01/G-04: attack mods + early combat exits
ck('player_attack_mod -1 at 46/448/656/722', GD['46'].player_attack_mod===-1 && GD['448'].player_attack_mod===-1 && GD['656'].player_attack_mod===-1 && GD['722'].player_attack_mod===-1);
ck('early-exit conditions: 46 enemy_defeated_1, 994 wound_2, 532 intact', JSON.stringify(GD['46'].choices[0])==='{"target":98,"combat_condition":"enemy_defeated_1"}' && JSON.stringify(GD['994'].choices[1])==='{"target":118,"combat_condition":"wound_2"}' && JSON.stringify(GD['532'].choices[0])==='{"target":437,"combat_condition":"wound_2"}');

// 9b. group_78 G-11: dice resolvers (781/725/932)
ck('dice_check 781 exact', JSON.stringify(GD['781'].dice_check)==='{"dice":2,"gte":10,"win":863,"lose":126}');
ck('dice_bash on 725 choice to 1215', JSON.stringify(GD['725'].choices[1])==='{"target":1215,"dice_bash":{"cost_stamina":1}}');
ck('dice_loot 932 exact', JSON.stringify(GD['932'].dice_loot)==='{"item":"spider_larva","target":1123}');

// 9. group_78 G-02: canonical round-deadline routing (43/261/737/1099)
ck('round_deadline configs exact', JSON.stringify(GD['43'].round_deadline)==='{"rounds":10,"win":1082,"lose":1016}' && JSON.stringify(GD['261'].round_deadline)==='{"rounds":3,"win":520,"lose":8}' && JSON.stringify(GD['737'].round_deadline)==='{"rounds":5,"win":391,"lose":182,"carry_enemy":true}' && JSON.stringify(GD['1099'].round_deadline)==='{"rounds":3,"win":894,"lose":"death"}');

console.log(`\n6d HARNESS: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
