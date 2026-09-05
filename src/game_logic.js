// ── Spells ──
const SPELLS=[{"id":"LEVITATION","icon":"🌬️"},{"id":"FIRE","icon":"🔥"},{"id":"ILLUSION","icon":"🌀"},{"id":"FORCE","icon":"💪"},{"id":"WEAKNESS","icon":"🫀"},{"id":"COPY","icon":"👤"},{"id":"HEALING","icon":"💚"},{"id":"SWIMMING","icon":"🌊"}];

// ── Combat summons (item-triggered allies) ──
// Distinct ally actors with their OWN Skill/Stamina (NOT copies of the player or enemy).
// They fight "по тем же правилам, по которым сражается Копия" — a self-contained side-fight
// (СИЛА УДАРА = Мастерство + 2d6 each side, ±2 Выносливость per round) — but parameterised
// by the ally's own stats. Held as items; usable ONCE per whole journey (S.summonsUsed),
// the item itself is NOT consumed (canon keeps the bell/amulet in the bag).
//   §612 bell → Медведь  Мастерство 11 / Выносливость 9  — works ANYWHERE incl. the castle.
//   §84 amulet → Медведица Мастерство 8 / Выносливость 10 — only OUTSIDE the Black castle
//                ("в любом бою, но за пределами Чёрного замка. Там амулет бессилен.")
const COMBAT_ALLIES={"magic_bell":{"skill":11,"stamina":9,"scope":"anywhere","icon":"🐻"},"bear_amulet":{"skill":8,"stamina":10,"scope":"outside_castle","icon":"🐻"}};

// Curated set of combat paragraphs INSIDE the Black castle (Option 2, June 2026).
// The castle is a dense maze with no thin neck and no clean graph partition (75/76 combat
// paragraphs are forest-phase-reachable), so an accurate "inside" predicate requires this
// hand-verified list rather than a runtime flag. Used only to disable the bear-fur amulet
// (the bell works inside by canon). See audit_cycles/combat_summon_june_2026/.
const CASTLE_SECTIONS=new Set([43,96,131,174,388,455,481,588,618,628,684,722,742,760,788,790,805,823,915,950,1050,1096,1099,1150,1163,1177]);
function isInsideCastle(section){ return CASTLE_SECTIONS.has(section); }

// ── Preface Text ──
function prefaceText(){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null; return (A&&A.preface)||((typeof LOCALE_RU!=='undefined'&&LOCALE_RU.preface)||''); }

function pregameText(){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null; return (A&&A.pregame)||((typeof LOCALE_RU!=='undefined'&&LOCALE_RU.pregame)||''); }
const SAVE_KEY='podzch_v6';

// ── State ──
let S=null;

// Bridge: top-level `let` does not create window.S in browsers, but
// src/map_module.js reads/writes window.S in 16+ places. Without this
// bridge the map module silently no-ops everywhere because window.S is
// permanently undefined. The defineProperty wires window.S to the live
// closure-scoped S so both layers see the same state.
Object.defineProperty(window, 'S', {
  get(){ return S; },
  set(v){ S = v; },
  configurable: false
});

function initState(n,sk,st,lu,sp){
  return{name:n||t('geroy'),section:1,skill:sk,skillMax:sk,stamina:st,staminaMax:st,
    luck:lu,luckMax:lu,gold:15,flask:2,bagSize:7,
    inventory:[],spells:sp,notes:'',visited:[],startTime:Date.now(),pending_combat_buff:null,bet_stake:null,summonsUsed:[],v:5};
}

// ── RNG ──
function d6(){const a=new Uint32Array(1);crypto.getRandomValues(a);return(a[0]%6)+1;}

// ── Save/Load ──
var lastAutosaveAt=null; // UI-10 (group_79): timestamp of the last successful autosave, shown in the menu
function saveGame(){if(!S)return;localStorage.setItem(SAVE_KEY,JSON.stringify(S));lastAutosaveAt=Date.now();renderAutosaveNote();}
// UI-10 (group_79): "Autosaved: sec.N - HH:MM" line in the menu overlay. Reads the
// persisted timestamp (not "now"), so an unsaved session shows nothing.
function renderAutosaveNote(){ try{ var el=document.getElementById('autosave-note'); if(!el) return; if(!S||!lastAutosaveAt){ el.textContent=''; return; } var d=new Date(lastAutosaveAt); var hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0'); el.textContent=t('ui_autosave_note')+' \u00a7'+S.section+' \u00b7 '+hh+':'+mm; }catch(e){} }
// Defensive structural normalization for any loaded save (localStorage,
// imported file, or deep-link). Every read site in the engine is already
// individually guarded, but normalizing once at load time guarantees a
// well-formed shape regardless of the save's vintage or hand-editing:
//   - core array/string fields that pre-date a field always exist
//   - runtime-only fields (eventLog, shopBought, riddle_attempts) added in
//     later sessions are backfilled so old saves match current structure
// Mutates and returns the same object. Safe to call on null (returns null).
function normalizeSave(s){
  if(!s||typeof s!=='object') return s;
  // Core fields from initState() — backfill if missing or wrong type.
  if(!Array.isArray(s.inventory)) s.inventory=[];
  // group_82 CB-05: a pre-slug raw «Арбуз» string is the sec.300 ITEM (the sec.389 food is a structured object).
  s.inventory=s.inventory.map(it=>(typeof it==='string'&&it.trim()===SLUG_TO_RU['melon'] /* the legacy RU name */)?'watermelon':it);
  if(!Array.isArray(s.spells))    s.spells=[];
  if(!Array.isArray(s.visited))   s.visited=[];
  if(typeof s.notes!=='string')   s.notes='';
  if(typeof s.gold!=='number')    s.gold=0;
  if(typeof s.flask!=='number')   s.flask=0;
  if(typeof s.bagSize!=='number'||s.bagSize<7) s.bagSize=7; // §132: 9-slot bag upgrade (default 7)
  if(typeof s.section!=='number') s.section=1;
  // Numeric stats - backfill so hand-edited saves cannot NaN combat math.
  const num=(v)=>typeof v==='number'&&isFinite(v);
  if(!num(s.skillMax))   s.skillMax=9;
  if(!num(s.staminaMax)) s.staminaMax=18;
  if(!num(s.luckMax))    s.luckMax=9;
  if(!num(s.skill))   s.skill=s.skillMax;
  if(!num(s.stamina)) s.stamina=s.staminaMax;
  if(!num(s.luck))    s.luck=s.luckMax;
  // Runtime-only fields added in later sessions.
  if(!Array.isArray(s.eventLog))  s.eventLog=[];
  if(typeof s.shopBought!=='object'||s.shopBought===null||Array.isArray(s.shopBought)) s.shopBought={};
  // group_80 R-01 legacy-save migration: a lost choice index used to
  // serialize as [null] (shopBought) / ':undefined' keys (batchPicked).
  // Such markers can never match a real index again - prune them so the
  // one-shot state stays canonical. Lenient by design: the affected offer
  // unlocks again (symmetric pay-and-receive) instead of locking forever.
  for(const k of Object.keys(s.shopBought)){
    if(!Array.isArray(s.shopBought[k])){ delete s.shopBought[k]; continue; }
    s.shopBought[k]=s.shopBought[k].filter(n=>typeof n==='number'&&isFinite(n));
  }
  if(typeof s.batchPicked!=='object'||s.batchPicked===null||Array.isArray(s.batchPicked)) s.batchPicked={};
  for(const k of Object.keys(s.batchPicked)){ if(!/^\d+:\d+$/.test(k)) delete s.batchPicked[k]; }
  if(typeof s.luckChecks!=='object'||s.luckChecks===null||Array.isArray(s.luckChecks)) s.luckChecks={}; // group_81 B-07: persisted luck rolls
  if(typeof s.riddle_attempts!=='number') s.riddle_attempts=0;
  if(typeof s.sec436_force!=='boolean') s.sec436_force=false; // §436 Force-on-tree round-trip flag
  if(s.bet_stake===undefined) s.bet_stake=null; // betting Phase B2 — current wager (gold/item) or null
  if(!Array.isArray(s.summonsUsed)) s.summonsUsed=[]; // combat-summon items already spent (once per journey)
  return s;
}
function loadGame(){try{const r=localStorage.getItem(SAVE_KEY);if(!r)return null;const s=JSON.parse(r);return (typeof s.v==='number'&&s.v>=4&&s.v<=7)?normalizeSave(s):null;}catch{return null;}}
function exportSave(){saveGame();const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='podzch-save.json';a.click();closeModal('overlay-menu');}
function importSave(e){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const s=JSON.parse(t);
  if(s.v!==5&&s.v!==4){alert(t('nesovmestimyy_format'));return;}
  if(s.v===4){s.v=5;s.luckMax=s.luck;delete s.luckBoxes;}// upgrade v4→v5
  normalizeSave(s);
  S=s;saveGame();showScr('game');renderGame();closeModal('overlay-menu');}catch{alert(t('oshibka_zagruzki'));}});e.target.value='';}

// ── Screens ──
function showScr(id){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));document.getElementById('scr-'+id).classList.add('on');const elb=document.getElementById('event-log-btn');if(elb)elb.style.display=(id==='game'&&!isMobileHud())?'block':'none';}
function closeModal(id){document.getElementById(id).classList.remove('on');if(id==='overlay-sheet')returnSheetSection();}
function openMenu(){renderAutosaveNote();document.getElementById('overlay-menu').classList.add('on');}

// >>> BC_A11Y_DIALOGS (UI-04, group_79): shared dialog controller >>>
// Every overlay toggled through the 'on' class (.modal-overlay / .end-overlay,
// static or created at runtime) gets dialog semantics, an accessible name from
// its first heading, initial focus, focus return on close, Escape (only when the
// dialog offers an explicit closeModal control) and a Tab trap. Observing class
// mutations keeps every existing open/close call site untouched.
var _bcDialogOpener=new WeakMap();
var _bcDialogStack=[]; // UA-01 (group_81): open-order stack - paint order == Escape/Tab order
function _bcIsDialog(el){ return !!(el&&el.classList&&(el.classList.contains('modal-overlay')||el.classList.contains('end-overlay')||(el.id==='event-log-panel'&&typeof isMobileHud==='function'&&isMobileHud()))); } // group_82 CU-03: the phone-width event-log panel is a dialog too
// group_82 SM-01: offsetParent is null for position:fixed elements (the event-log FAB, the dock), so it is not a
// visibility test; a rendered box that is not visibility:hidden is.
function _bcVisible(el){ return !!(el&&el.getClientRects&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden'); }
function _bcFocusables(root){ return Array.prototype.filter.call(root.querySelectorAll('button,select,input,textarea,a[href],[tabindex]'), function(el){ return !el.disabled&&el.tabIndex>=0&&el.getAttribute('aria-hidden')!=='true'&&_bcVisible(el); }); }
function _bcTopDialog(){
  for(var i=_bcDialogStack.length-1;i>=0;i--){ var d=_bcDialogStack[i]; if(d&&d.classList&&d.classList.contains('on')&&document.body.contains(d)) return d; }
  var all=document.querySelectorAll('.modal-overlay.on,.end-overlay.on'); return all.length?all[all.length-1]:null;
}
function _bcDialogOpened(el){
  if(!el.getAttribute('role')) el.setAttribute('role','dialog');
  el.setAttribute('aria-modal','true');
  var si=_bcDialogStack.indexOf(el); if(si>=0) _bcDialogStack.splice(si,1); _bcDialogStack.push(el);
  if(el.classList.contains('modal-overlay')) el.style.zIndex=String(100+_bcDialogStack.length);
  if(!el.hasAttribute('aria-labelledby')&&!el.hasAttribute('aria-label')){
    var h=el.querySelector('h1,h2,h3,.modal-title,.map-title,.end-title');
    if(h){ if(!h.id) h.id=(el.id||'bc-dialog')+'-title'; el.setAttribute('aria-labelledby',h.id); }
  }
  var prev=document.activeElement;
  if(prev&&prev!==document.body&&!el.contains(prev)) _bcDialogOpener.set(el,prev);
  var f=_bcFocusables(el), target=f.length?f[0]:el;
  if(target===el&&!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1');
  setTimeout(function(){ try{ if(el.classList.contains('on')&&!el.contains(document.activeElement)) target.focus({preventScroll:true}); }catch(e){} },0);
}
function _bcDialogClosed(el){
  var prev=_bcDialogOpener.get(el); _bcDialogOpener.delete(el);
  var si=_bcDialogStack.indexOf(el); if(si>=0) _bcDialogStack.splice(si,1);
  if(el.classList.contains('modal-overlay')) el.style.zIndex='';
  if(prev&&document.body.contains(prev)&&_bcVisible(prev)){ try{ prev.focus({preventScroll:true}); }catch(e){} return; }
  // group_81 CA-03: the opener is often destroyed by the re-render that closed the
  // dialog (combat / luck -> renderGame). Land on the first choice, else the story.
  setTimeout(function(){ try{ if(_bcTopDialog()) return; var b=document.querySelector('#c-list button:not([disabled])'); if(b&&_bcVisible(b)){ b.focus({preventScroll:true}); return; } var sa=document.getElementById('s-area'); if(sa){ if(!sa.hasAttribute('tabindex')) sa.setAttribute('tabindex','-1'); sa.focus({preventScroll:true}); } }catch(e){} },0);
}
function _bcCloseTopDialog(){
  var top=_bcTopDialog(); if(!top) return false;
  if(top.id==='event-log-panel'){ if(typeof toggleEventLog==='function') toggleEventLog(); return true; } // group_82 CU-03
  var closer=top.querySelector('[onclick*="closeModal("]'); if(!closer) return false;
  closer.click(); return true;
}
(function(){
  if(typeof MutationObserver==='undefined'||!document.body) return;
  var was=new WeakMap();
  new MutationObserver(function(recs){
    for(var i=0;i<recs.length;i++){
      var el=recs[i].target; if(!_bcIsDialog(el)) continue;
      var on=el.classList.contains('on'), before=!!was.get(el);
      if(on&&!before) _bcDialogOpened(el); else if(!on&&before) _bcDialogClosed(el);
      was.set(el,on);
    }
  }).observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
  document.addEventListener('keydown',function(ev){
    var top=_bcTopDialog();
    if(!top){ if(ev.key==='Escape'){ var lp=document.getElementById('event-log-panel'); if(lp&&lp.classList.contains('on')&&typeof toggleEventLog==='function'){ toggleEventLog(); ev.preventDefault(); } } return; } // group_81 CA-10: Escape also closes the event-log panel
    if(ev.key==='Escape'){ if(_bcCloseTopDialog()) ev.preventDefault(); return; }
    if(ev.key!=='Tab') return;
    var f=_bcFocusables(top); if(!f.length){ ev.preventDefault(); return; }
    var first=f[0], last=f[f.length-1], a=document.activeElement;
    if(ev.shiftKey){ if(a===first||!top.contains(a)){ last.focus(); ev.preventDefault(); } }
    else if(a===last||!top.contains(a)){ first.focus(); ev.preventDefault(); }
  });
})();
// <<< BC_A11Y_DIALOGS <<<

// >>> BC_MOBILE_SHEETS (UI-03 A, group_79): phone HUD bar + bottom sheets >>>
// On viewports <=700px the sidebar is hidden; the HUD bar mirrors the stat
// cells and opens sidebar sections inside a bottom sheet by MOVING the live
// DOM nodes (no duplicated rendering - updateHUD, inventory, spells and notes
// keep writing to the same ids). Closing the sheet returns the nodes home.
var HUD_MQ=(typeof matchMedia==='function')?matchMedia('(max-width:700px)'):null;
function isMobileHud(){ return !!(HUD_MQ&&HUD_MQ.matches); }
var _bcSheetHome=[];
var SHEET_SECTIONS={spells:['sb-spells'],inv:['sb-flask','sb-inv'],notes:['sb-notes']};
function syncHudBar(){ try{ [['sb-name','hb-name'],['sb-skill','hb-skill'],['sb-stamina','hb-stamina'],['sb-luck','hb-luck'],['sb-gold','hb-gold']].forEach(function(p){ var a=document.getElementById(p[0]), b=document.getElementById(p[1]); if(a&&b) b.textContent=a.textContent; }); }catch(e){} }
function openSheet(kind){
  var ids=SHEET_SECTIONS[kind]; if(!ids) return;
  var ov=document.getElementById('overlay-sheet'), body=document.getElementById('sheet-body'), ttl=document.getElementById('sheet-title');
  if(!ov||!body||!ttl) return;
  returnSheetSection();
  var title='';
  ids.forEach(function(id){ var n=document.getElementById(id); if(!n) return; _bcSheetHome.push({node:n,parent:n.parentNode,next:n.nextSibling}); var t=n.querySelector('.sb-section-title'); if(t&&!title) title=t.textContent.replace(/\s+/g,' ').trim(); body.appendChild(n); });
  ttl.textContent=title; ov.classList.add('on');
}
function returnSheetSection(){
  var home=_bcSheetHome; _bcSheetHome=[];
  // group_81 CA-13: restore in reverse order of removal so a recorded next sibling that was
  // itself moved is already back in place when its predecessor returns.
  home.slice().reverse().forEach(function(h){ if(!h.parent) return; var ref=(h.next&&h.next.parentNode===h.parent)?h.next:null; h.parent.insertBefore(h.node,ref); });
}
(function(){
  if(typeof updateHUD==='function'){ var _o=updateHUD; updateHUD=function(){ var r=_o.apply(this,arguments); syncHudBar(); return r; }; }
  if(HUD_MQ&&HUD_MQ.addEventListener){ HUD_MQ.addEventListener('change',function(){
    var ov=document.getElementById('overlay-sheet'); if(!HUD_MQ.matches&&ov&&ov.classList.contains('on')) closeModal('overlay-sheet');
    var elb=document.getElementById('event-log-btn'), sg=document.getElementById('scr-game');
    if(elb&&sg&&sg.classList.contains('on')) elb.style.display=HUD_MQ.matches?'none':'block';
  }); }
})();
// <<< BC_MOBILE_SHEETS <<<

// >>> BC_COMBAT_STATUS (UA-03, group_81): screen-reader combat-round status >>>
// #combat-log is rebuilt with innerHTML+= on every append (51 sites), so it
// cannot be a live region without re-announcing the whole history. This
// mirror observes the log and announces only the children appended since the
// last mutation into a visually hidden role=status region.
(function(){
  if(typeof MutationObserver==='undefined') return;
  var log=document.getElementById('combat-log'), st=document.getElementById('combat-round-status');
  if(!log||!st) return;
  var seen=0;
  window._bcCombatStatusReset=function(){ seen=0; st.textContent=''; }; // CA-06: startCombat clears the log synchronously - a count-only heuristic misses equal-length intros
  new MutationObserver(function(){
    var kids=log.children, n=kids.length;
    if(n<seen) seen=0;
    var parts=[];
    for(var i=seen;i<n;i++){ var tx=(kids[i].textContent||'').replace(/\s+/g,' ').trim(); if(tx) parts.push(tx); }
    seen=n;
    if(parts.length){ st.textContent=''; setTimeout(function(){ st.textContent=parts.join(' \u00b7 '); },0); }
  }).observe(log,{childList:true});
})();
// <<< BC_COMBAT_STATUS <<<

// ── Title ──
function initTitle(){
  const sv=loadGame();const bl=document.getElementById('btn-load');
  if(sv){bl.style.display='inline-block';bl.onclick=()=>{S=sv;showScr('game');renderGame();};}
  document.getElementById('btn-new').onclick=()=>showScr('create');
  // Title art
  // Inline styles deliberately do NOT set width/height/max-* — those are
  // handled by CSS (.t-rider-col img and .t-text-col #title-lettering img)
  // so the two-column title layout stays in sync with the responsive grid.
  if(typeof TITLE_RIDER!=='undefined'){
    document.getElementById('title-rider').innerHTML=`<img src="${TITLE_RIDER}" alt="">`;
  }
  if(typeof TITLE_ART!=='undefined'){
    document.getElementById('title-lettering').innerHTML=`<img src="${TITLE_ART}" alt="${t('alt_title_lettering')}">`;
  } else {
    document.getElementById('title-lettering').innerHTML=t('podzemelya_chernogo_zamka');
  }
}

// ── Creation (ONE-TIME ROLL) ──
let cVals={skill:null,stamina:null,luck:null};
let diceRolled=false;

function rollAnim(id,val){
  const el=document.getElementById(id);
  el.classList.add('rolling');
  // Quick number shuffle animation
  let count=0;
  const interval=setInterval(()=>{
    el.textContent=Math.floor(Math.random()*12)+1;
    count++;
    if(count>=8){
      clearInterval(interval);
      el.textContent=val;
      el.classList.remove('rolling');
      el.classList.add('rolled');
    }
  },60);
}

document.getElementById('btn-roll-all').onclick=()=>{
  if(diceRolled)return;
  diceRolled=true;
  playSound('dice');cVals.skill=d6()+6; cVals.stamina=d6()+d6()+12; cVals.luck=d6()+6;
  rollAnim('v-skill',cVals.skill);rollAnim('v-stamina',cVals.stamina);rollAnim('v-luck',cVals.luck);
  document.getElementById('btn-roll-all').classList.add('dice-locked');
  document.getElementById('btn-roll-all').textContent=t('sudba_opredelena');
  document.getElementById('btn-to-spells').style.display='inline-block';
};
document.getElementById('btn-to-spells').onclick=()=>{if(!diceRolled)return;showScr('spells');renderSpellSel();};
document.getElementById('btn-back-cr').onclick=()=>showScr('create');

// ── Spell Selection ──
let spQty={};SPELLS.forEach(s=>spQty[s.id]=0);
const MAX_SP=10;
function totSp(){return Object.values(spQty).reduce((a,b)=>a+b,0);}

// Split a multi-sentence Russian description into separate lines so each
// sentence reads as its own beat. Splits on '. ', '! ', '? ' followed by a
// Cyrillic capital letter so abbreviations / mid-sentence ellipses are
// preserved. Single-sentence descriptions pass through unchanged because
// no boundary matches. HTML-escaping happens first so any literal &/</>
// in source data cannot break out of the description container; the <br>
// tags are inserted after escaping so they remain live HTML.
function _spellDescHtml(text){
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(/([.!?])\s+(?=[А-Я])/g, '$1<br>');
}

function renderSpellSel(){
  const bar=document.getElementById('slots-bar');bar.innerHTML='';const tot=totSp(); const chip=document.getElementById('spell-counter-chip'); if(chip) chip.textContent=tot+t('iz')+MAX_SP+t('vybrano');
  for(let i=0;i<MAX_SP;i++){const d=document.createElement('div');d.className='slot-pip'+(i<tot?' on':'');d.textContent=i<tot?'✦':'·';bar.appendChild(d);}
  const grid=document.getElementById('spell-grid');grid.innerHTML='';
  SPELLS.forEach(sp=>{const q=spQty[sp.id];const c=document.createElement('div');
    c.className='sp-card'+(q>0?' sel':'')+(tot>=MAX_SP&&q===0?' maxed':'');
    c.style.cssText='display:flex;align-items:flex-start;gap:14px;padding:18px 20px;';
    c.innerHTML=`<div class="sp-icon" style="font-size:32px;min-width:38px;text-align:center;margin-top:2px;">${sp.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="sp-name" style="font-size:21px;margin-bottom:6px;font-weight:500;">${spellText(sp.id).name}</div>
        <div class="sp-desc" style="font-size:17px;color:rgba(232,220,196,.78);line-height:1.55;">${_spellDescHtml(spellText(sp.id).full)}</div>
      </div>
      <div class="sp-qty" style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <button class="qty-btn" data-id="${sp.id}" data-d="-1" aria-label="${t('aria_ubrat')}${spellText(sp.id).name}" ${q<=0?'disabled':''} style="font-size:20px;width:44px;height:44px;">−</button>
        <span class="qty-num" style="font-size:22px;min-width:30px;text-align:center;">${q}</span>
        <button class="qty-btn" data-id="${sp.id}" data-d="1" aria-label="${t('aria_dobavit')}${spellText(sp.id).name}" ${(tot>=MAX_SP)?'disabled':''} style="font-size:20px;width:44px;height:44px;">+</button>
      </div>`;
    grid.appendChild(c);
  });
  grid.querySelectorAll('.qty-btn').forEach(b=>b.onclick=()=>{
    const id=b.dataset.id,delta=parseInt(b.dataset.d);
    if(delta>0&&totSp()>=MAX_SP)return;if(delta<0&&spQty[id]<=0)return;
    spQty[id]+=delta;renderSpellSel();
    // group_81 CA-09: the grid was rebuilt - refocus the same (or the sibling) qty button.
    const nb=grid.querySelector('.qty-btn[data-id="'+id+'"][data-d="'+delta+'"]:not([disabled])')||grid.querySelector('.qty-btn[data-id="'+id+'"]:not([disabled])'); if(nb) nb.focus({preventScroll:true});
  });
  // Update start button state
  const startBtn=document.getElementById('btn-start');
  const startBtn2=document.getElementById('btn-start-from-preface');
  if(tot===MAX_SP){
    startBtn.disabled=false;startBtn.style.opacity='1';
    if(startBtn2){startBtn2.disabled=false;startBtn2.style.opacity='1';}
  }else{
    startBtn.disabled=true;startBtn.style.opacity='.4';
    if(startBtn2){startBtn2.disabled=true;startBtn2.style.opacity='.4';}
  }
}

function startGame(){
  if(totSp()!==MAX_SP){alert(t('vyberite_rovno_10_zaklyatiy'));return;}
  const name=document.getElementById('hero-name').value.trim()||t('geroy');
  if(!diceRolled){cVals.skill=d6()+6;cVals.stamina=d6()+d6()+12;cVals.luck=d6()+6;diceRolled=true;}
  const sp=[];SPELLS.forEach(s=>{if(spQty[s.id]>0)sp.push({id:s.id,remaining:spQty[s.id]});});
  S=initState(name,cVals.skill,cVals.stamina,cVals.luck,sp);saveGame();
  // Show pregame narrative
  renderPregameText();
  showScr('pregame');
}
document.getElementById('btn-start').onclick=startGame;
document.getElementById('btn-start-from-preface').onclick=startGame;
document.getElementById('btn-enter-forest').onclick=()=>{showScr('game');renderGame();};

// Preface
document.getElementById('btn-preface')&&(document.getElementById('btn-preface').onclick=()=>{
  renderPrefaceText();
  showScr('preface');
});

// ── Event Log ──
function logEvent(type, main, detail){
  if(!S)return;
  if(!S.eventLog)S.eventLog=[];
  S.eventLog.push({
    para:S.section,
    type:type,
    main:main,
    detail:detail||'',
    time:Date.now()
  });
  if(S.eventLog.length>500)S.eventLog.shift();// cap history
  renderEventLog();
}

function renderEventLog(){
  const list=document.getElementById('event-log-list');
  if(!list||!S||!S.eventLog)return;
  if(S.eventLog.length===0){
    list.innerHTML=t('zhurnal_pust');
    return;
  }
  // Render newest first
  list.innerHTML=[...S.eventLog].reverse().map(ev=>
    `<div class="event-entry ev-${ev.type}">
      <div class="ev-para">§ ${ev.para}</div>
      <div class="ev-main">${ev.main}</div>
      ${ev.detail?`<div class="ev-detail">${ev.detail}</div>`:''}
    </div>`
  ).join('');
}

function toggleEventLog(){
  const panel=document.getElementById('event-log-panel');
  panel.classList.toggle('on');
  // group_81 CA-10: the panel behaves like a dialog - focus in on open, back to the log button on close.
  if(panel.classList.contains('on')){ renderEventLog(); const cb=panel.querySelector('.event-log-close'); if(cb) cb.focus({preventScroll:true}); }
  else { const fab=document.getElementById('event-log-btn'); const hb=document.querySelector('.hud-btn[onclick="toggleEventLog()"]'); const back=(fab&&_bcVisible(fab))?fab:((hb&&_bcVisible(hb))?hb:null); if(back) back.focus({preventScroll:true}); }
}

function clearEventLog(){
  if(!S)return;
  if(confirm(t('ochistit_zhurnal'))){S.eventLog=[];saveGame();renderEventLog();}
}

// ── Item Notification ──
// group_81 CA-04/CA-05: one persistent live region (#bc-notif-live, shell) - assistive
// tech announces CHANGES to an existing region, not a pre-filled node inserted afresh.
function bcAnnounce(text){ try{ const live=document.getElementById('bc-notif-live'); if(!live) return; live.textContent=''; setTimeout(function(){ live.textContent=text; },0); }catch(e){} }
function showItemNotification(items, title){
  const el=document.createElement('div');el.className='item-notification';
  el.innerHTML=`<div class="notif-title">${title||t('meshok')}</div>`+
    items.map(i=>`<div class="notif-item${i.startsWith('−')?' loss':''}">${i}</div>`).join('');
  document.body.appendChild(el);
  bcAnnounce([title||t('meshok')].concat(items).map(x=>String(x).replace(/<[^>]+>/g,'').trim()).filter(Boolean).join(' \u00b7 '));
  setTimeout(()=>{el.style.animation='fadeOut .5s ease-out forwards';
    setTimeout(()=>el.remove(),500);},3000);
}

// ── Inventory Modal (for item pickup with overflow) ──
let pendingItems=[];
function showInventoryModal(newItems, extraNotifs){
  pendingItems=newItems.slice();
  const modal=document.getElementById('modal-inventory');
  const freeSlots=getBagSize()-getBagUsed();
  
  // Text
  const txt=document.getElementById('inv-modal-text');
  const incomingSize=newItems.reduce((s,it)=>s+getItemSize(it),0);
  if(freeSlots<incomingSize){
    txt.innerHTML=`${t('naydeno_2')}${newItems.length}${t('predmetov_zanimayut')}${incomingSize}${t('mest_no_v_meshke_tolko')}${freeSlots}${t('svobodnyh_iz')}${getBagSize()}.<br>${t('vyberite_chto_vzyat_ili_vybroste')}`;
  } else {
    txt.innerHTML=`${t('naydeno_2')}${newItems.length}${t('predmetov_svobodnyh_mest')}${freeSlots}.`;
  }
  
  // Found items — each with "Взять" button
  const found=document.getElementById('inv-modal-found');
  found.innerHTML=t('naydeno');
  newItems.forEach((item,i)=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);';
    row.id='inv-found-'+i;
    const isFood=item&&typeof item==='object'&&item.kind==='food';
    const eatNow=isFood?`<button class="btn btn-s inv-eatnow-btn" id="inv-eatnow-${i}" style="font-size:13px;padding:4px 10px;margin-right:6px;border-color:#2a8;color:#3c9;" onclick="eatFoundItem(${i})">🍴 ${t('syest_srazu')}</button>`:'';
    row.innerHTML=`<span style="font-size:16px;color:var(--parchment);">${invDisplay(item)}</span>
      <span style="flex-shrink:0;display:flex;align-items:center;">${eatNow}<button class="btn btn-s inv-take-btn" style="font-size:13px;padding:4px 12px;" onclick="takeItem(${i})">${t('vzyat')}</button></span>`;
    found.appendChild(row);
  });
  
  // Current inventory — with remove buttons
  renderInvModalCurrent();
  
  // Show gold notifications if any
  if(extraNotifs&&extraNotifs.length>0){
    playSound('item');showItemNotification(extraNotifs);
  }
  
  modal.classList.add('on');
}

function renderInvModalCurrent(){
  const cur=document.getElementById('inv-modal-current');
  cur.innerHTML='<div style="font-size:14px;color:var(--gold);margin-bottom:6px;letter-spacing:.08em;">'+t('v_meshke_lbl')+' ('+getBagUsed()+'/'+getBagSize()+'):</div>';
  if(S.inventory.length===0){
    cur.innerHTML+=t('pusto');
  } else {
    S.inventory.forEach((item,i)=>{
      if(STORY_FLAGS.has(canonItem(item))) return; // group_83 PT-01
      const row=document.createElement('div');
      row.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);';
      row.innerHTML=`<span style="font-size:15px;color:var(--parchment);">${invDisplay(item)}</span>
        <button style="background:none;border:none;color:#c44;cursor:pointer;font-size:14px;padding:2px 6px;" onclick="dropItemModal(${i})" aria-label="${t('vybrosit')}: ${invDisplay(item)}" title="${t('vybrosit')}">\uD83D\uDDD1</button>`;
      cur.appendChild(row);
    });
  }
  // Update found items buttons
  pendingItems.forEach((item,i)=>{
    const row=document.getElementById('inv-found-'+i);
    if(!row)return;
    const btn=row.querySelector('.inv-take-btn')||row.querySelector('button');
    if(!btn)return;
    if(item&&item._eaten){
      const eb=document.getElementById('inv-eatnow-'+i);
      if(eb){eb.disabled=true;eb.style.opacity='.4';}
      btn.textContent='🍴';btn.disabled=true;btn.style.opacity='.4';
      return;
    }
    if(S.inventory.some(it=>canonItem(it)===canonItem(item))){
      btn.textContent=t('v_meshke_2');btn.disabled=true;btn.style.opacity='.4';
      const eb2=document.getElementById('inv-eatnow-'+i); if(eb2){eb2.disabled=true;eb2.style.opacity='.4';} // group_81 B-02: carried food is eaten from the bag
    } else if(getBagUsed()+getItemSize(item)>getBagSize()){
      btn.textContent=getItemSize(item)>1?(t('nuzhno')+getItemSize(item)+t('mest')):t('meshok_polon');btn.disabled=true;btn.style.opacity='.4';
    } else {
      btn.textContent=t('vzyat');btn.disabled=false;btn.style.opacity='1';
    }
  });
}

function eatFoundItem(idx){
  if(!S)return;
  const item=pendingItems[idx];
  if(!item||typeof item!=='object'||item.kind!=='food'||item._eaten)return;
  if(S.inventory.some(it=>canonItem(it)===canonItem(item)))return; // group_81 B-02: already carried - one serving, from the bag
  if(S.stamina>=S.staminaMax){showItemNotification([t('vynoslivost_uzhe_polnaya')]);return;}
  const before=S.stamina;
  S.stamina=Math.min(S.staminaMax,S.stamina+item.stamina);
  const actual=S.stamina-before;
  item._eaten=true;
  logEvent('gain',t('sedeno')+itemName(item.id),'+'+actual+t('vynoslivosti'));
  playSound('item');
  showItemNotification(['🍴 '+itemName(item.id)+': +'+actual+t('vyn')]);
  renderInvModalCurrent();
  updateHUD();saveGame();
}

function takeItem(idx){
  if(!S)return;
  const item=pendingItems[idx];
  if(!item||item._eaten||S.inventory.some(it=>canonItem(it)===canonItem(item)))return;
  if(getBagUsed()+getItemSize(item)>getBagSize())return;
  S.inventory.push(item);
  logEvent('gain','+ '+invDisplay(item),t('v_meshok'));
  playSound('item');
  renderInvModalCurrent();
  updateHUD();saveGame();
}

function dropItemModal(idx){
  if(!S)return;
  const itm=S.inventory[idx];logEvent('loss','− '+invDisplay(itm),t('vybrosheno_iz_meshka'));
  S.inventory.splice(idx,1);
  renderInvModalCurrent();
  updateHUD();saveGame();
  try{ const cur=document.getElementById('inv-modal-current'); const bs=cur?cur.querySelectorAll('button'):[]; const nb=bs.length?bs[Math.min(idx,bs.length-1)]:null; if(nb) nb.focus({preventScroll:true}); else { const fb=document.querySelector('#modal-inventory button:not([disabled])'); if(fb) fb.focus({preventScroll:true}); } }catch(e){} // group_81 CA-09
}

function closeInvModal(){
  document.getElementById('modal-inventory').classList.remove('on');
  updateHUD();saveGame();
}

// ── Death Overlay ──
// Renders the #end-death overlay. Earlier versions truncated the paragraph
// text to its last 200 characters, which mid-sentence-cut almost every
// dead-end longer than 200 chars (48 of 59 paragraphs in the book), so e.g.
// §352 displayed "м по воздуху крылатого… дракона!" instead of the full
// dragon scene. Now shows the entire text and, if MJ_MAP has an art for
// this paragraph, places the illustration above the text. Calling without
// arguments (combat death) resets to the default "Ваше путешествие
// окончено" line and hides any leftover image from a previous death.
function showDeathOverlay(opts){
  const overlay=document.getElementById('end-death');
  const txt=document.getElementById('death-text');
  let img=document.getElementById('death-img');
  // Lazily create the illustration slot the first time it is needed,
  // immediately after the death title and before the death-text paragraph.
  if(!img){
    img=document.createElement('img');
    img.id='death-img';
    img.alt='';
    img.style.cssText='display:none;max-width:min(560px,86%);max-height:48vh;'+
      'margin:0 auto 22px;border:1px solid var(--border);'+
      'box-shadow:0 8px 30px rgba(0,0,0,.55);object-fit:contain;';
    txt.parentNode.insertBefore(img,txt);
  }
  if(opts&&opts.sec){
    txt.textContent=opts.sec.text;
    let artUrl=null;
    if(typeof MJ_MAP!=='undefined'&&typeof MJ_DATA!=='undefined'){
      const artId=MJ_MAP[opts.secKey];
      if(artId&&MJ_DATA[artId])artUrl=MJ_DATA[artId];
    }
    if(artUrl){
      img.src=artUrl;
      img.style.display='block';
    } else {
      img.removeAttribute('src');
      img.style.display='none';
    }
  } else {
    // Combat / stamina-zero death: keep the generic line, hide any image.
    txt.textContent=t('vashe_puteshestvie_okoncheno_zac');
    img.removeAttribute('src');
    img.style.display='none';
  }
  overlay.classList.add('on');
}

// ── Locale resolvers (Phase 1 item 6a): paragraph text + choice labels live in
// LOCALE_RU (locale.ru.js), keyed by paragraph number. locSec(n) returns the
// structural paragraph hydrated with its localized text + per-choice labels, so
// all downstream render code reads sec.text / ch.label unchanged.
// ── i18n locale registry (Phase 2): ACTIVE_LOCALE = current language object; LOCALE_RU = hard fallback. ──
// To add a language: create src/locale.<code>.js defining LOCALE_<CODE> (same shape as LOCALE_RU), register it
// in LOCALES below, and add it to build.sh. Any key missing from the active locale falls back to RU, then to the raw key.
const LOCALES = {};
(function(){ if(typeof LOCALE_RU!=='undefined') LOCALES.ru=LOCALE_RU; if(typeof LOCALE_EN!=='undefined') LOCALES.en=LOCALE_EN; if(typeof LOCALE_FR!=='undefined') LOCALES.fr=LOCALE_FR; if(typeof LOCALE_UK!=='undefined') LOCALES.uk=LOCALE_UK; })();
const DEFAULT_LANG = 'ru';
let activeLang = DEFAULT_LANG;
let ACTIVE_LOCALE = LOCALES[DEFAULT_LANG] || (typeof LOCALE_RU!=='undefined'?LOCALE_RU:{});
function availableLangs(){ return Object.keys(LOCALES); }
function getLang(){ return activeLang; }

// >>> BC_I18N_2B (Phase 2b: language switching, persistence, live re-render) >>>
const LANG_KEY='blackcastle-lang';
function getLangName(code){ return (LOCALES[code]&&LOCALES[code].langName)||code; }
function loadSavedLang(){ try{ var c=localStorage.getItem(LANG_KEY); if(c&&LOCALES[c]) return c; }catch(e){} return DEFAULT_LANG; }
function renderPregameText(){ var el=document.getElementById('pregame-text'); if(el) el.innerHTML=pregameText().split('\n\n').map(function(p){return '<p style="margin-bottom:16px;">'+p+'</p>';}).join(''); }
function renderPrefaceText(){ var el=document.getElementById('preface-text'); if(el) el.innerHTML=prefaceText().split('\n\n').map(function(p){return '<p style="margin-bottom:16px;">'+p+'</p>';}).join(''); }
function repaintAfterLangSwitch(){
  try{ renderPregameText(); }catch(e){}
  try{ renderPrefaceText(); }catch(e){}
  try{ renderAllLangPickers(); }catch(e){}
  try{ applyStaticI18n(); }catch(e){}
  // UI-09 (group_79): the map refresh runs AFTER the static shell pass so the
  // localized topbar placeholder is overwritten by the live layer line when
  // the map overlay is open during a language switch.
  try{ if(window.bcRefreshMapLanguage) window.bcRefreshMapLanguage(ACTIVE_LOCALE); }catch(e){}
  var sg=document.getElementById('scr-game');
  var inGame=!!(S && sg && sg.classList && sg.classList.contains('on'));
  if(inGame){ try{ renderGame({repaint:true}); }catch(e){} }
  else { try{ updateHUD(); }catch(e){} }
}
function applyLang(code, opts){
  if(!LOCALES[code]) code=DEFAULT_LANG;
  activeLang=code;
  ACTIVE_LOCALE=LOCALES[code]||LOCALES[DEFAULT_LANG]||(typeof LOCALE_RU!=='undefined'?LOCALE_RU:{});
  if(opts&&opts.silent){ try{ if(window.bcRefreshMapLanguage) window.bcRefreshMapLanguage(ACTIVE_LOCALE); }catch(e){} }
  else { repaintAfterLangSwitch(); }
}
function setLanguage(code){
  if(!LOCALES[code]) return false;
  applyLang(code,{});
  try{ localStorage.setItem(LANG_KEY,code); }catch(e){}
  return true;
}
window.setLanguage=setLanguage;
window.availableLangs=availableLangs;
window.getLang=getLang;
window.getLangName=getLangName;
// <<< BC_I18N_2B <<<

// >>> BC_I18N_2C (language picker: accessible native-select dropdown; group_68 closed 2026-07-12) >>>
function renderLangPicker(containerId){
  var c=document.getElementById(containerId);
  if(!c) return;
  var langs=availableLangs(), cur=getLang();
  c.innerHTML='';
  var lbl=t('yazyk'); if(lbl==='yazyk') lbl='Language';
  var label=document.createElement('label');
  label.setAttribute('for',containerId+'-select');
  label.style.cssText='display:inline-flex;align-items:center;gap:7px;cursor:pointer;';
  var g=document.createElement('span');
  g.textContent='\ud83c\udf10';
  g.setAttribute('aria-hidden','true');
  g.style.cssText='font-size:14px;opacity:.55;';
  var sr=document.createElement('span');
  sr.textContent=lbl;
  sr.style.cssText='position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;';
  var sel=document.createElement('select');
  sel.id=containerId+'-select';
  sel.setAttribute('data-lang-picker','1');
  sel.title=lbl;
  sel.style.cssText='font-family:var(--font-ui);font-size:12px;letter-spacing:.06em;cursor:pointer;padding:6px 12px;border-radius:2px;background:var(--bg2);border:1px solid var(--border2);color:var(--gold2);transition:border-color .2s,box-shadow .2s;';
  langs.forEach(function(code){
    var o=document.createElement('option');
    o.value=code;
    o.textContent=getLangName(code);
    if(code===cur) o.selected=true;
    sel.appendChild(o);
  });
  sel.onchange=function(){ var code=sel.value; if(code!==getLang()){ setLanguage(code); renderAllLangPickers(); } };
  sel.onfocus=function(){ sel.style.borderColor='var(--gold)'; sel.style.boxShadow='0 0 0 2px var(--glow)'; };
  sel.onblur=function(){ sel.style.borderColor='var(--border2)'; sel.style.boxShadow='none'; };
  label.appendChild(g); label.appendChild(sr); label.appendChild(sel);
  c.appendChild(label);
}
function renderAllLangPickers(){ renderLangPicker('lang-pick-title'); renderLangPicker('lang-pick-menu'); }
window.renderLangPicker=renderLangPicker;
window.renderAllLangPickers=renderAllLangPickers;
// <<< BC_I18N_2C <<<

// >>> BC_I18N_2C_SHELL (static UI chrome i18n via data-i18n attributes) >>>
function applyStaticI18n(){
  try{
    document.querySelectorAll('[data-i18n]').forEach(function(el){ var k=el.getAttribute('data-i18n'), v=t(k); if(v!==k) el.textContent=v; });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){ var k=el.getAttribute('data-i18n-html'), v=t(k); if(v!==k) el.innerHTML=v; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ var k=el.getAttribute('data-i18n-ph'), v=t(k); if(v!==k) el.setAttribute('placeholder',v); });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){ var k=el.getAttribute('data-i18n-title'), v=t(k); if(v!==k) el.setAttribute('title',v); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){ var k=el.getAttribute('data-i18n-aria'), v=t(k); if(v!==k) el.setAttribute('aria-label',v); });
    var dt=t('ui_doc_title'); if(dt!=='ui_doc_title') document.title=dt;
    if(document.documentElement) document.documentElement.setAttribute('lang', getLang());
  }catch(e){}
}
window.applyStaticI18n=applyStaticI18n;
// <<< BC_I18N_2C_SHELL <<<

function pText(n){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; var e=(A&&A.p)?A.p[String(n)]:null; if(e&&typeof e.t==='string')return e.t; e=(F&&F.p)?F.p[String(n)]:null; return (e&&typeof e.t==='string')?e.t:''; }
function label(n,i){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; var e=(A&&A.p)?A.p[String(n)]:null; if(e&&e.c&&e.c[i]!=null)return e.c[i]; e=(F&&F.p)?F.p[String(n)]:null; return (e&&e.c&&e.c[i]!=null)?e.c[i]:''; }
function locSec(n){ const s=GD[String(n)]; if(!s) return s; const out=Object.assign({},s,{text:pText(n)}); if(Array.isArray(s.choices)) out.choices=s.choices.map((c,i)=>Object.assign({},c,{label:label(n,i)})); if(s.riddle){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; var Lp=(A&&A.p)?A.p[String(n)]:null, rfl=(Lp&&Lp.rfl!==undefined)?Lp.rfl:undefined; if(rfl===undefined){ Lp=(F&&F.p)?F.p[String(n)]:null; if(Lp&&Lp.rfl!==undefined) rfl=Lp.rfl; } if(rfl!==undefined) out.riddle=Object.assign({},s.riddle,{fail_target_label:rfl}); } return out; }

// ── Locale resolvers (6b): spell + ally display text live in LOCALE_RU.spells / .allies.
function spellText(id){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; var e=(A&&A.spells&&A.spells[id])||(F&&F.spells&&F.spells[id])||null; return e||{name:'',full:''}; }
function allyText(key){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; var e=(A&&A.allies&&A.allies[key])||(F&&F.allies&&F.allies[key])||null; return e||{name:'',verb:''}; }
function t(k){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; if(A&&A.ui&&A.ui[k]!==undefined)return A.ui[k]; if(F&&F.ui&&F.ui[k]!==undefined)return F.ui[k]; return k; }
function enemyName(k){ var A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null, F=(typeof LOCALE_RU!=='undefined')?LOCALE_RU:null; if(A&&A.enemies&&A.enemies[k]!==undefined)return A.enemies[k]; if(F&&F.enemies&&F.enemies[k]!==undefined)return F.enemies[k]; return k; }

// ── Game Rendering ──
function renderGame(opts){
  if(!S)return;updateHUD();
  const sec=locSec(S.section);
  if(!sec){goTo(1);return;}
  document.getElementById('s-num').textContent=t('paragraf')+S.section;
  // Render illustration — priority: Midjourney (color AI art) > legacy b/w scans.
  let illustHtml='';
  const secKey=String(S.section);
  // 1) Midjourney art (preferred — colored, in-style)
  if(typeof MJ_MAP!=='undefined'&&typeof MJ_DATA!=='undefined'){
    const artId=MJ_MAP[secKey];
    if(artId&&MJ_DATA[artId]){
      const meta=(typeof MJ_META!=='undefined')?MJ_META[artId]:null;
      const alt=meta?meta.scene.replace(/"/g,'&quot;'):t('illyustraciya');
      illustHtml=`<div class="illustration-container mj-art" data-art-id="${artId}"><img src="${MJ_DATA[artId]}" onload="this.classList.add('loaded')" alt="${alt}"/></div>`;
    }
  }
  // 2) Fallback: legacy black-and-white scan from the 1991 edition
  if(!illustHtml&&typeof ILLUST_MAP!=='undefined'&&typeof ILLUST_DATA!=='undefined'){
    const imgFile=ILLUST_MAP[secKey];
    if(imgFile&&ILLUST_DATA[imgFile]){
      illustHtml=`<div class="illustration-container legacy-scan"><img src="${ILLUST_DATA[imgFile]}" onload="this.classList.add('loaded')" alt="${t('illyustraciya')}"/></div>`;
    }
  }
  document.getElementById('s-text').innerHTML=illustHtml+fmtText(sec.text);
  if(!(opts&&opts.repaint)){
    document.getElementById('s-area').scrollTop=0; // group_82 CU-11: a locale repaint keeps the reader's position
    // group_82 CU-02: a keyboard-driven paragraph change destroys the activated choice - land on the
    // paragraph marker (never over an open dialog; dialogs opened later in this render take focus themselves).
    try{ const sn=document.getElementById('s-num'); if(sn&&!(typeof _bcTopDialog==='function'&&_bcTopDialog())){ if(!sn.hasAttribute('tabindex')) sn.setAttribute('tabindex','-1'); sn.focus({preventScroll:true}); } }catch(e){}
  }
  // Riddle mechanic dispatch: if paragraph has a riddle field, render the
  // text-input widget instead of standard choice buttons. Per group_18 design.
  if(sec.riddle){renderRiddle(sec);}else if(sec.dice_roll){renderDiceRoll(sec);}else if(sec.dice_check){renderDiceCheck(sec);}else if(sec.dice_loot){renderDiceLoot(sec);}else if(sec.stake_picker){renderStakePicker(sec);}else{renderChoices(sec);}
  // Track visited
  const firstVisit=!S.visited.includes(S.section);
  if(firstVisit)S.visited.push(S.section);
  // Auto-inventory on first visit
  if(firstVisit&&sec.auto_items){
    const ai=sec.auto_items;
    let notifications=[];
    // Wholesale loss (e.g. Vodyanoy paradox §642 — «Vash zaplechnyj meshok
    // i den'gi ischezli»). Apply BEFORE every other mutation in this
    // paragraph so any other effect on the same auto_items operates on
    // the cleared state. clear_inventory empties S.inventory; gold_zero
    // resets S.gold to 0.
    if(ai.clear_inventory){
      const lostCount=S.inventory.length;
      if(lostCount>0){
        S.inventory=[];
        notifications.push(t('ves_inventar')+lostCount+')');
        logEvent('loss',t('ves_inventar_2'),t('predmetov_poteryano')+lostCount);
      }
    }
    if(ai.gold_zero&&S.gold>0){
      const lostGold=S.gold;
      S.gold=0;
      notifications.push('− '+lostGold+t('zolotyh'));
      logEvent('loss','− '+lostGold+t('zolotyh'),t('vsego_0'));
    }
    // Gold (always auto-add)
    if(ai.gold&&ai.gold>0){
      S.gold+=ai.gold;
      notifications.push('+ '+ai.gold+t('zolotyh'));
      logEvent('gain','+ '+ai.gold+t('zolotyh'),t('vsego')+S.gold);
    }
    if(ai.gold_sub&&ai.gold_sub>0){
      S.gold=Math.max(0,S.gold-ai.gold_sub);
      notifications.push('− '+ai.gold_sub+t('zolotyh'));
      logEvent('loss','− '+ai.gold_sub+t('zolotyh'),t('vsego')+S.gold);
    }
    // Lose items
    if(ai.lose){
      ai.lose.forEach(item=>{
        const idx=S.inventory.findIndex(it=>canonItem(it)===canonItem(item)); // (auto_items.lose: currently unused in data)
        if(idx>=0){
          notifications.push('− '+invDisplay(S.inventory[idx]));
          S.inventory.splice(idx,1);
        }
      });
    }
    // Countable carried-food grant (group_38). Pushes `count` copies of a
    // food object {id, kind:'food', stamina} into the bag,
    // bypassing the auto_items.items dedupe so identical food stacks (e.g.
    // 6 bananas). Bag-capped via getBagSize(); overflow is reported, not
    // forced. Runs before the items-modal so the modal sees the real free
    // space. Used by §75 (6 bananas), §471 (2 bananas+milk+honey), §1109 (6).
    if(ai.food&&ai.food.length>0){
      let added=0,overflow=0;
      ai.food.forEach(f=>{
        for(let k=0;k<(f.count||1);k++){
          const obj={id:f.name,kind:'food',stamina:f.stamina};
          if(getBagUsed()+getItemSize(obj)<=getBagSize()){S.inventory.push(obj);added++;}
          else overflow++;
        }
      });
      if(added>0){
        notifications.push(t('eda')+added);
        logEvent('gain',t('eda')+added, overflow>0?(t('meshok_polon_ne_vzyato')+overflow):(t('v_meshke_3')+getBagUsed()+'/'+getBagSize()));
      }
      if(overflow>0) notifications.push(t('meshok_polon_2')+overflow+t('ne_vzyato'));
    }
    // group_80 V-02: mandatory equip/swap - imperative canon grants bypass the voluntary offer modal.
    if(ai.equip){
      const eq=ai.equip;
      if(eq.swap_out){
        const oi=S.inventory.findIndex(it=>canonItem(it)===eq.swap_out);
        if(oi>=0){
          const old=S.inventory.splice(oi,1)[0];
          notifications.push('− '+invDisplay(old)+t('ostavlen_vzamen'));
          logEvent('loss','− '+invDisplay(old),t('ostavlen_vzamen_2'));
        }
      }
      if(!S.inventory.some(it=>canonItem(it)===eq.item)){
        S.inventory.push(eq.item);
        notifications.push('+ '+itemName(eq.item));
        logEvent('gain','+ '+itemName(eq.item),t('vzyato_v_ruki'));
      }
    }
    // group_83 PT-01: story flags - mandatory and silent (no offer modal, no notification).
    if(ai.flags&&ai.flags.length){ ai.flags.forEach(f=>{ if(!S.inventory.some(it=>canonItem(it)===f)) S.inventory.push(f); }); saveGame(); }
    // Items — show modal if any found
    if(ai.items&&ai.items.length>0){
      const offered=ai.items.map(v=>(v&&typeof v==='object'&&v.food)?{kind:'food',id:v.food,stamina:v.stamina}:v);
      const newItems=offered.filter(item=>!S.inventory.some(it=>canonItem(it)===canonItem(item)));
      if(newItems.length>0){
        showInventoryModal(newItems, notifications);
      } else if(notifications.length>0){
        updateHUD();saveGame();
        playSound('item');showItemNotification(notifications);
      }
    } else if(notifications.length>0){
      updateHUD();saveGame();
      playSound('item');showItemNotification(notifications);
    }
    // Stat changes (auto-apply, no modal needed)
    let statNotifs=[];
    if(ai.stamina_add){S.stamina=Math.min(S.staminaMax,S.stamina+ai.stamina_add);statNotifs.push('+ '+ai.stamina_add+t('vynoslivosti'));logEvent('gain','+ '+ai.stamina_add+t('vynoslivosti'),t('teper')+S.stamina+'/'+S.staminaMax);}
    if(ai.stamina_sub){S.stamina=Math.max(0,S.stamina-ai.stamina_sub);statNotifs.push('− '+ai.stamina_sub+t('vynoslivosti'));logEvent('loss','− '+ai.stamina_sub+t('vynoslivosti'),t('teper')+S.stamina+'/'+S.staminaMax);}
    if(ai.skill_add){S.skill=Math.min(S.skillMax,S.skill+ai.skill_add);statNotifs.push('+ '+ai.skill_add+t('masterstva'));}
    if(ai.skill_sub){S.skill=Math.max(1,S.skill-ai.skill_sub);statNotifs.push('− '+ai.skill_sub+t('masterstva'));}
    if(ai.luck_add){S.luck=Math.min(S.luckMax,S.luck+ai.luck_add);statNotifs.push('+ '+ai.luck_add+t('udachi'));}
    if(ai.dragon_strength){S.dragonKillsLeft=3;statNotifs.push('+ 5'+t('masterstva')+' ('+t('sila_drakona')+')');logEvent('gain','+ 5'+t('masterstva'),t('sila_drakona'));}
    if(ai.luck_sub){S.luck=Math.max(0,S.luck-ai.luck_sub);statNotifs.push('− '+ai.luck_sub+t('udachi'));}
    if(statNotifs.length>0){updateHUD();saveGame();showItemNotification(statNotifs);}
  }
  // Betting stake-commit + payout (group_41). Runs EVERY visit (not first-visit
  // auto_items) because the gambling loop is re-entrant — each round must deduct
  // the stake and pay out again on revisited commit/outcome paragraphs.
  if(!(opts&&opts.repaint)) applyBetting(sec);
  // Check death
  if(S.stamina<=0){
    showDeathOverlay();
    return;
  }
  // Check win
  if(S.section===1220){playSound('victory');document.getElementById('end-win').classList.add('on');return;}
  // Check dead-end. Two cases covered:
  //  (a) raw 0 choices — original narrative dead-ends like the §32
  //      drowning paragraph in its pre-group_6 state.
  //  (b) all choices filtered out by inventory_condition or
  //      gold_condition — group_6 case where the only escape from a
  //      drowning / falling / lost paragraph is gated by a token the
  //      player may not possess (e.g. «Помощь рыбки» at §32 / §699).
  //      Without this generalisation, raw count > 0 but visible count
  //      === 0 produces an empty choice list and a UI hang.
  // Combat paragraphs (sec.enemies) and pending-luck paragraphs
  // (sec.has_luck) generate their own action buttons inside
  // renderChoices and must not be short-circuited here even when no
  // ordinary navigation choice is visible.
  const inCombatOrLuck=(sec.enemies&&sec.enemies.length>0)||sec.has_luck;
  const hasRiddle=!!sec.riddle;
  const hasDice=!!sec.dice_roll||!!sec.dice_check||!!sec.dice_loot;
  const hasPicker=!!sec.stake_picker;
  const visibleChoices=sec.choices.filter(ch=>passesInventoryCheck(ch)&&passesGoldCheck(ch));
  if(!inCombatOrLuck&&!hasRiddle&&!hasDice&&!hasPicker&&visibleChoices.length===0){
    playSound('death');
    showDeathOverlay({sec:sec,secKey:secKey});
    return;
  }
  // Generate scene image
  generateSceneImage(sec.text);
  saveGame();
}

function fmtText(text){
  if(!text)return'';
  const div=document.createElement('div');div.textContent=text;let h=div.innerHTML;
  h=h.replace(/\[\[(.*?)\]\]/g,'<span class="enemy-block">$1</span>');
  h=h.replace(/\((\d+)\)/g,'<span style="opacity:.4;font-size:.85em">($1)</span>');
  h=h.replace(/\n\n/g,'</p><p style="margin-top:14px">');
  h='<p>'+h+'</p>';h=h.replace(/\n/g,'<br>');return h;
}

function updateHUD(){
  if(!S)return;
  document.getElementById('sb-name').textContent=S.name;
  document.getElementById('sb-para').textContent='§ '+S.section;
  document.getElementById('sb-skill').textContent=S.skill+'/'+S.skillMax;
  document.getElementById('sb-stamina').textContent=S.stamina+'/'+S.staminaMax;
  document.getElementById('sb-luck').textContent=S.luck;
  document.getElementById('bar-skill').style.width=(S.skill/S.skillMax*100)+'%';
  document.getElementById('bar-stamina').style.width=(S.stamina/S.staminaMax*100)+'%';
  document.getElementById('sb-gold').textContent=S.gold;
  // Flask
  document.getElementById('fp0').className='flask-pip'+(S.flask>=1?' full':'');
  document.getElementById('fp1').className='flask-pip'+(S.flask>=2?' full':'');
  document.getElementById('flask-use').disabled=S.flask<=0;
  // Luck - show current value
  document.getElementById('sb-luck').textContent=S.luck;
  const luckBar=document.getElementById('luck-boxes');
  if(luckBar)luckBar.innerHTML=`<div style="font-size:12px;color:var(--muted);opacity:.6;margin-top:2px;">${t('nachalnaya')}${S.luckMax||S.luck}</div>`;
  // Spells
  const st=document.getElementById('spell-tags');st.innerHTML='';
  if(S.spells)S.spells.forEach(sp=>{if(sp.remaining>0){const def=SPELLS.find(s=>s.id===sp.id);
    if(def)st.innerHTML+=`<div class="spell-tag"><span class="st-icon">${def.icon}</span><span class="st-name">${spellText(def.id).name}</span><span class="st-count">×${sp.remaining}</span></div>`;}});
  // Healing button visibility
  const healBtn=document.getElementById('btn-heal');
  if(healBtn){
    const healRemaining=getSpellRemaining('HEALING');
    const inCombat=document.getElementById('modal-combat').classList.contains('on');
    healBtn.style.display=(healRemaining>0&&!inCombat&&S.stamina<S.staminaMax)?'block':'none';
    healBtn.textContent=`${t('iscelenie_8_vyn')}${healRemaining}]`;
  }
  // Inventory
  const il=document.getElementById('inv-list');il.innerHTML='';
  if(S.inventory&&S.inventory.length>0){S.inventory.forEach((item,i)=>{
    if(STORY_FLAGS.has(canonItem(item))) return; // group_83 PT-01
    const isFood=item&&typeof item==='object'&&item.kind==='food';
    const eatBtn=isFood?`<button type="button" class="inv-eat" onclick="eatFood(${i})" aria-label="${t('syest')}: ${itemName(item.id)} (+${item.stamina}${t('vyn')})" title="${t('syest')} (+${item.stamina}${t('vyn')})" style="color:#3c9;cursor:pointer;font-size:14px;padding:2px 6px;">\uD83C\uDF74</button>`:'';
    il.innerHTML+=`<div class="inv-item"><span>${invDisplay(item)}</span><span style="display:flex;gap:2px;align-items:center;">${eatBtn}<button type="button" class="inv-remove" onclick="removeItem(${i})" aria-label="${t('vybrosit')}: ${invDisplay(item)}" title="${t('vybrosit')}">\uD83D\uDDD1</button></span></div>`;});}
  else{il.innerHTML=t('meshok_pust');}
  document.getElementById('inv-count').textContent=`(${getBagUsed()}/${getBagSize()})`;
  // Notes
  const nta=document.getElementById('notes-ta');if(nta&&S.notes!==undefined)nta.value=S.notes;
}

// §132: bag capacity is stateful (7 default, upgradeable to 9). getBagSize()
// is the single source of truth — every inventory-cap site reads it.
function getBagSize(){return (S&&typeof S.bagSize==='number'&&S.bagSize>0)?S.bagSize:7;}
// Multi-slot inventory occupancy (group_42). Most items occupy ONE bag slot,
// but two canonical items are bulky: the diving suit (§1214 «костюм займет два
// места») takes 2 and the flying carpet (§227 «займет… целых три места», also
// §193/§302) takes 3. getItemSize() returns an item's slot footprint (default 1);
// getBagUsed() is the summed occupancy that every capacity check uses in place
// of S.inventory.length. Food entries are objects {id, kind:'food', stamina}, matched by id
// so the lookup is robust (no food item is multi-slot, so this is a no-op there).
// ── Item registry (i18n transition; canonical id space: src/registries/items.json) ──
// canonItem(): a Russian display name, a slug, or a food object {kind:'food',id} -> its slug,
// idempotent on slugs, so Russian-named and slug-keyed values compare interchangeably during the
// RU->slug migration (phase1.5b-5f). itemName(): slug -> Russian display name (passthrough for
// unknown / hand-typed strings). invDisplay(): an inventory entry -> display string (resolves the
// slug, preserves any food suffix). RU_TO_SLUG/SLUG_TO_RU are generated from items.json.
const RU_TO_SLUG={"Личинка паука":"spider_larva","Меч «Смерть Орков»":"death_of_orcs","Рыцарский щит":"knight_shield","Арбуз":"melon","Кокос":"coconut","Булочка":"bun","Немного еды":"provisions",
  "Яблоко":"apple","Здесь 5 стрел":"arrows_5","Банан":"banana","Медвежий амулет":"bear_amulet",
  "Шкурка бобра":"beaver_pelt","Клетка для птиц":"birdcage","Здесь 5 чёрных стрел":"black_arrows_5",
  "Ключ Чёрного замка":"black_castle_key","Чёрная жемчужина":"black_pearl","Книга":"book","Хлеб":"bread",
  "Бронзовый кувшин":"bronze_jug","Бронзовый свисток":"bronze_whistle","Красивая брошка":"brooch",
  "Птичка в клетке":"caged_bird","Свеча":"candle","Подсвечник":"candlestick","Карты":"card_deck",
  "Пароль в замок":"castle_password","Принцесса разбужена":"princess_awake","Барлад Дэрт повержен":"barlad_dead","Сыр":"cheese","Медный браслет":"copper_bracelet",
  "Медный ключик":"copper_key","Корона":"crown","Шкура оленя":"deer_hide","Прекрасный бриллиант":"diamond",
  "Игральная кость":"die","Водолазный костюм":"diving_suit","Коготь дракона":"dragon_claw",
  "Печень дракона":"dragon_liver","Бляха с золотым орлом":"eagle_plaque","Фигурный ключ":"figured_key",
  "Огнетушитель":"fire_extinguisher","Помощь рыбки":"fish_help","Огниво":"flint",
  "Ковёр-самолёт":"flying_carpet","Шкура лисы":"fox_pelt","Золотой амулет":"gold_amulet",
  "Золотая стрела":"gold_arrow","Золотой ключ":"gold_key","Золотое ожерелье":"gold_necklace",
  "Золотая устрица":"gold_oyster","Золотое кольцо":"gold_ring","Золотой свисток":"gold_whistle",
  "Золотой апельсин":"golden_orange","Золотая рыбка":"goldfish","Зеркальце":"hand_mirror","Шлем":"helmet",
  "Мёд":"honey","Попона для лошади":"horse_blanket","Песочные часы":"hourglass",
  "Гребень из слоновой кости":"ivory_comb","Лимон":"lemon","Волшебный колокольчик":"magic_bell",
  "Волшебный пояс":"magic_belt","Рукопись":"manuscript","Мясо":"meat","Молоко":"milk",
  "Тайна зеркал":"mirror_secret","Мускатное печенье":"nutmeg_biscuit","Апельсин":"orange",
  "Пергаментный свиток":"parchment_scroll","Пропуск":"pass","Пароль «Трое из Эвенло»":"password_evenlo",
  "Перо павлина":"peacock_feather","Груша":"pear","Флакончик духов":"perfume_vial","Ананас":"pineapple",
  "Чётки":"prayer_beads","Кольцо":"ring","Верёвка":"rope","Верёвочная лесенка":"rope_ladder","Роза":"rose",
  "Рубиновая звезда":"ruby_star","Колбаса":"sausage","Блестящий кусок металла":"shiny_metal",
  "Бляха с парусным корабликом":"ship_plaque","Перстень":"signet","Перстень с изумрудом":"signet_emerald",
  "Перстень с рубином":"signet_ruby","Серебряный браслет":"silver_bracelet",
  "Серебряное кольцо":"silver_ring","Серебряный сосуд":"silver_vessel",
  "Серебряный свисток":"silver_whistle","Курительная трубка":"smoking_pipe",
  "Каменный Кентавр":"stone_centaur","Перо аиста":"stork_feather","Оберег":"talisman",
  "Мандарин":"tangerine","Клубочек":"thread_ball","Знание о троне":"throne_lore",
  "Знание о кладе":"treasure_lore","Фляга с водой":"water_flask","Арбуз с бахчи":"watermelon","Кнут":"whip",
  "Белая стрела":"white_arrow","Целый меч":"whole_sword","Бутылка вина":"wine_bottle",
  "Красивый кусочек дерева":"wood_piece",
};
const SLUG_TO_RU={spider_larva:"Личинка паука",death_of_orcs:"Меч «Смерть Орков»",knight_shield:"Рыцарский щит",melon:"Арбуз",coconut:"Кокос",bun:"Булочка",provisions:"Немного еды",
  "apple":"Яблоко","arrows_5":"Здесь 5 стрел","banana":"Банан","bear_amulet":"Медвежий амулет",
  "beaver_pelt":"Шкурка бобра","birdcage":"Клетка для птиц","black_arrows_5":"Здесь 5 чёрных стрел",
  "black_castle_key":"Ключ Чёрного замка","black_pearl":"Чёрная жемчужина","book":"Книга","bread":"Хлеб",
  "bronze_jug":"Бронзовый кувшин","bronze_whistle":"Бронзовый свисток","brooch":"Красивая брошка",
  "caged_bird":"Птичка в клетке","candle":"Свеча","candlestick":"Подсвечник","card_deck":"Карты",
  "castle_password":"Пароль в замок","princess_awake":"Принцесса разбужена","barlad_dead":"Барлад Дэрт повержен","cheese":"Сыр","copper_bracelet":"Медный браслет",
  "copper_key":"Медный ключик","crown":"Корона","deer_hide":"Шкура оленя","diamond":"Прекрасный бриллиант",
  "die":"Игральная кость","diving_suit":"Водолазный костюм","dragon_claw":"Коготь дракона",
  "dragon_liver":"Печень дракона","eagle_plaque":"Бляха с золотым орлом","figured_key":"Фигурный ключ",
  "fire_extinguisher":"Огнетушитель","fish_help":"Помощь рыбки","flint":"Огниво",
  "flying_carpet":"Ковёр-самолёт","fox_pelt":"Шкура лисы","gold_amulet":"Золотой амулет",
  "gold_arrow":"Золотая стрела","gold_key":"Золотой ключ","gold_necklace":"Золотое ожерелье",
  "gold_oyster":"Золотая устрица","gold_ring":"Золотое кольцо","gold_whistle":"Золотой свисток",
  "golden_orange":"Золотой апельсин","goldfish":"Золотая рыбка","hand_mirror":"Зеркальце","helmet":"Шлем",
  "honey":"Мёд","horse_blanket":"Попона для лошади","hourglass":"Песочные часы",
  "ivory_comb":"Гребень из слоновой кости","lemon":"Лимон","magic_bell":"Волшебный колокольчик",
  "magic_belt":"Волшебный пояс","manuscript":"Рукопись","meat":"Мясо","milk":"Молоко",
  "mirror_secret":"Тайна зеркал","nutmeg_biscuit":"Мускатное печенье","orange":"Апельсин",
  "parchment_scroll":"Пергаментный свиток","pass":"Пропуск","password_evenlo":"Пароль «Трое из Эвенло»",
  "peacock_feather":"Перо павлина","pear":"Груша","perfume_vial":"Флакончик духов","pineapple":"Ананас",
  "prayer_beads":"Чётки","ring":"Кольцо","rope":"Верёвка","rope_ladder":"Верёвочная лесенка","rose":"Роза",
  "ruby_star":"Рубиновая звезда","sausage":"Колбаса","shiny_metal":"Блестящий кусок металла",
  "ship_plaque":"Бляха с парусным корабликом","signet":"Перстень","signet_emerald":"Перстень с изумрудом",
  "signet_ruby":"Перстень с рубином","silver_bracelet":"Серебряный браслет",
  "silver_ring":"Серебряное кольцо","silver_vessel":"Серебряный сосуд",
  "silver_whistle":"Серебряный свисток","smoking_pipe":"Курительная трубка",
  "stone_centaur":"Каменный Кентавр","stork_feather":"Перо аиста","talisman":"Оберег",
  "tangerine":"Мандарин","thread_ball":"Клубочек","throne_lore":"Знание о троне",
  "treasure_lore":"Знание о кладе","water_flask":"Фляга с водой","watermelon":"Арбуз с бахчи","whip":"Кнут",
  "white_arrow":"Белая стрела","whole_sword":"Целый меч","wine_bottle":"Бутылка вина",
  "wood_piece":"Красивый кусочек дерева",
};
function canonItem(x){if(x&&typeof x==='object'&&x.kind==='food')return x.id;return RU_TO_SLUG[x]||x;}
function itemName(x){return SLUG_TO_RU[x]||x;}
function invDisplay(entry){if(entry&&typeof entry==='object'&&entry.kind==='food')return itemName(entry.id)+t('eda_2')+entry.stamina+')';return itemName(entry);}
const ITEM_SIZES={diving_suit:2,flying_carpet:3,whole_sword:0,death_of_orcs:0,knight_shield:0};
// group_83 PT-01: story flags - hidden, weightless, undroppable state markers kept in the inventory so the
// inventory_condition / inventory_missing gates work unchanged (princess awakened, Barlad Dert slain).
const STORY_FLAGS=new Set(['princess_awake','barlad_dead']);
function getItemSize(name){
  if(!name) return 1;
  if(typeof STORY_FLAGS!=='undefined'&&STORY_FLAGS.has(canonItem(name))) return 0; // group_83 PT-01 (typeof: harnesses eval this function in isolation)
  // group_81 B-01: numeric-typed lookup - `||1` turned the slotCost:0 armament
  // entries into 1 and quietly re-weighted the swords and the shield.
  const v=ITEM_SIZES[canonItem(name)];
  return (typeof v==='number')?v:1;
}
function getBagUsed(){
  return (S&&Array.isArray(S.inventory)?S.inventory:[]).reduce((sum,it)=>sum+getItemSize(it),0);
}
// §132: eat a carried food object {kind:'food', stamina} from the bag. Restores
// N ВЫНОСЛИВОСТЬ (capped), removes the item. Refuses at full stamina so the
// provision isn't wasted.
function eatFood(i){
  if(!S||!S.inventory)return;
  const item=S.inventory[i];
  if(!item||typeof item!=='object'||item.kind!=='food')return;
  if(S.stamina>=S.staminaMax){showItemNotification([t('vynoslivost_uzhe_polnaya')]);return;}
  const amt=item.stamina;
  const before=S.stamina;
  S.stamina=Math.min(S.staminaMax,S.stamina+amt);
  const actual=S.stamina-before;
  const clean=item.id;
  S.inventory.splice(i,1);
  logEvent('gain',t('sedeno')+itemName(clean),'+'+actual+t('vynoslivosti'));
  playSound('item');
  showItemNotification(['🍴 '+itemName(clean)+': +'+actual+t('vyn')]);
  updateHUD();saveGame();
  focusInventoryRow(i); // group_81 CA-09
}
function useFlask(){if(!S||S.flask<=0)return;S.flask--;S.stamina=Math.min(S.staminaMax,S.stamina+2);logEvent('gain',t('glotok_iz_flyagi'),t('2_vynoslivosti_ostalos_glotkov')+S.flask+')');updateHUD();saveGame();}
function useHealing(){
  if(!S)return;
  const remaining=getSpellRemaining('HEALING');
  if(remaining<=0){return;}
  useSpell('HEALING');
  S.stamina=Math.min(S.staminaMax,S.stamina+8);
  logEvent('gain',t('zaklyatie_isceleniya'),t('8_vynoslivosti'));
  updateHUD();saveGame();
  showItemNotification([t('iscelenie_8_vynoslivosti')]);
}
// §950: Healing cast DURING combat (the HUD heal button is hidden behind the
// combat overlay). Rendered as a combat-modal button when the section's
// combat_spells_allowed includes 'HEALING'. Caps at staminaMax; refuses at full.
function useHealingInCombat(){
  if(!S)return;
  const remaining=getSpellRemaining('HEALING');
  if(remaining<=0)return;
  const log=document.getElementById('combat-log');
  if(S.stamina>=S.staminaMax){
    if(log)log.innerHTML+=`<div style="color:var(--muted);margin:4px 0;">${t('vynoslivost_uzhe_polnaya_iscelen')}</div>`;
    return;
  }
  useSpell('HEALING');
  S.stamina=Math.min(S.staminaMax,S.stamina+8);
  if(log)log.innerHTML+=`<div style="color:var(--green2);margin:4px 0;">${t('zaklyatie_isceleniya_8_vynoslivo')}${S.stamina}/${S.staminaMax}).</div>`;
  logEvent('gain',t('zaklyatie_isceleniya'),t('8_vynoslivosti_v_boyu'));
  const hb=document.getElementById('btn-heal-spell');
  const r2=getSpellRemaining('HEALING');
  if(hb){ if(r2>0){ hb.textContent=t('zaklyatie_isceleniya_8')+r2+']'; } else { hb.style.display='none'; } }
  updateHUD();saveGame();
}
function toggleAddItem(){const a=document.getElementById('add-item-area');a.style.display=a.style.display==='none'?'block':'none';}
function addItem(){if(!S)return;const inp=document.getElementById('add-item-input');const v=inp.value.trim();
  if(!v)return;if(getBagUsed()+getItemSize(v)>getBagSize()){alert(t('meshok_polon_3')+getBagSize()+t('mest_2'));return;}
  S.inventory.push(v);inp.value='';updateHUD();saveGame();}
// group_81 CA-09: updateHUD rebuilds #inv-list, destroying the activated button -
// land on the equivalent row (or the add-item control) so keyboard users keep their place.
function focusInventoryRow(i){ try{ const rows=document.querySelectorAll('#inv-list .inv-item'); const row=rows.length?rows[Math.min(i,rows.length-1)]:null; const b=row&&row.querySelector('button'); if(b){ b.focus({preventScroll:true}); return; } const add=document.getElementById('inv-add-btn'); if(add) add.focus({preventScroll:true}); }catch(e){} }
function removeItem(i){if(!S)return;const itm=S.inventory[i];logEvent('loss','− '+invDisplay(itm),t('vybrosheno_iz_meshka'));S.inventory.splice(i,1);updateHUD();saveGame();focusInventoryRow(i);}

// ── Choices ──
// Spell detection and styling
const SPELL_STYLE_BY_ID={
  'FIRE':{icon:'🔥',border:'#b33',color:'#e44',bg:'rgba(180,30,30,.12)'},
  'SWIMMING':{icon:'🌊',border:'#2888b8',color:'#3ac',bg:'rgba(40,130,200,.12)'},
  'LEVITATION':{icon:'🌬️',border:'#888',color:'#aaa',bg:'rgba(160,160,160,.12)'},
  'ILLUSION':{icon:'🌀',border:'#8a4dbd',color:'#b070e0',bg:'rgba(140,70,200,.12)'},
  'FORCE':{icon:'💪',border:'#b88820',color:'#daa520',bg:'rgba(200,150,30,.12)'},
  'WEAKNESS':{icon:'🫀',border:'#6a5',color:'#8c7',bg:'rgba(100,170,80,.12)'},
  'COPY':{icon:'👤',border:'#666',color:'#999',bg:'rgba(120,120,120,.12)'},
  'HEALING':{icon:'💚',border:'#2a8',color:'#3c9',bg:'rgba(40,180,100,.12)'},
};
function getSpellId(ch){
  // Spell is declared explicitly on the choice (data-driven; no label parsing).
  return ch.spell||null;
}

function getSpellRemaining(spellId){
  if(!S||!S.spells)return 0;
  const sp=S.spells.find(s=>s.id===spellId);
  return sp?sp.remaining:0;
}

// Inventory-conditional choice gating. A choice may carry
// `inventory_condition: "Item Name"` (string) or an array of acceptable
// names. The choice button is rendered only if S.inventory contains a
// matching item. Used by the §166 stone-rats branch (requires "Целый
// меч") and the §1085 gold-key door branch (requires "Золотой ключ").
// Without an inventory_condition the choice is always visible — this is
// the default and matches all pre-existing data.
function passesInventoryCheck(ch){
  if(!ch) return true;
  // group_83 PT-01: negative gate - the choice is offered only while the item / flag is ABSENT
  // (sec.627/976 «если волшебник жив» -> 1120 disappears once barlad_dead exists).
  if(ch.inventory_missing){ if(!S||!S.inventory) return false; const miss=ch.inventory_missing; if(S.inventory.some(it=>canonItem(it)===canonItem(miss))) return false; }
  if(!ch.inventory_condition) return true;
  if(!S||!S.inventory) return false;
  const cond=ch.inventory_condition;
  // Food-aware match: carried food has a (eda: +N) suffix (see eatFood / para 132),
  // so an exact compare misses it. Match the exact string OR the base name with
  // the food suffix stripped, so inventory_condition:'Banan' matches a carried
  // 'Banan (eda: +3)'. Non-food items are unaffected (the strip is a no-op).
  const baseEq=(it,name)=>canonItem(it)===canonItem(name);
  const has=name=>S.inventory.some(it=>baseEq(it,name));
  // Object forms: {all:['A','B']} requires ALL present (group_39 AND-gate,
  // para 12 two-whistles); {item:'X',count:N} requires >= N matches (group_38
  // count-gate). Both are food base-name aware via baseEq/has.
  if(cond&&typeof cond==='object'&&!Array.isArray(cond)){
    if(Array.isArray(cond.all)) return cond.all.every(has);
    if(cond.item) return S.inventory.filter(it=>baseEq(it,cond.item)).length>=(cond.count||1);
  }
  if(Array.isArray(cond)) return cond.some(has);
  return has(cond);
}

// Gold-conditional choice gating (group_16). A choice may carry
// `gold_condition: N` and the button is rendered only when S.gold >= N.
// Used at §774 for the «если 1 золотой» / «если 5 золотых» branches
// where the canon expects the player to be able to spend coins to
// open a hatch. Without a gold_condition the choice is always visible.
function passesGoldCheck(ch){
  if(!ch||ch.gold_condition===undefined||ch.gold_condition===null) return true;
  if(!S) return false;
  return (S.gold||0) >= ch.gold_condition;
}

function useSpell(spellId){
  if(!S||!S.spells)return;
  const sp=S.spells.find(s=>s.id===spellId);
  if(sp&&sp.remaining>0){sp.remaining--;const def=SPELLS.find(s=>s.id===spellId);logEvent('gain',def.icon+t('zaklyatie')+spellText(def.id).name,t('ostalos')+sp.remaining);updateHUD();saveGame();}
}

// Per-choice item grant. A choice may carry `acquires: "Item Name"`
// (string) or an array of names. When the player clicks the button,
// the named items are deposited into S.inventory before navigation.
// Used for the post-combat 'kill enemy, take their item' pattern
// (group_15) where auto_items.items would fire too early (on first
// paragraph entry, before combat resolves). Defensive against null
// S/S.inventory; silently ignores already-owned items so a re-visit
// to the same paragraph doesn't duplicate stacks. If inventory is
// full or any item is new, hands off to the existing showInventoryModal
// (with overflow / drop UI) before completing navigation.
function applyChoiceAcquires(ch, onDone){
  if(!ch||!ch.acquires||!S){if(onDone)onDone();return;}
  if(!S.inventory)S.inventory=[];
  const list=Array.isArray(ch.acquires)?ch.acquires:[ch.acquires];
  const newItems=list.filter(name=>!S.inventory.some(it=>canonItem(it)===canonItem(name)));
  if(newItems.length===0){if(onDone)onDone();return;}
  // Hand off to the standard pickup modal so 7-slot overflow logic
  // is shared with auto_items. The modal's Continue button closes
  // itself; we wire navigation onto the close-handler via a one-shot.
  showInventoryModal(newItems, []);
  const modal=document.getElementById('modal-inventory');
  const closeBtn=modal.querySelector('.btn-primary')||modal.querySelector('button');
  if(closeBtn&&onDone){
    const originalOnClick=closeBtn.onclick;
    closeBtn.onclick=(e)=>{
      if(originalOnClick)originalOnClick.call(closeBtn,e);
      else closeInvModal();
      onDone();
    };
  }
}

// Per-choice gold deduction (group_16). A choice may carry `gold_cost: N`
// (number). On click the engine subtracts N from S.gold (clamped to 0)
// before navigation. Logs the cost to the event log and shows a quick
// notification. Composes with acquires: a single choice can both spend
// gold and grant items (not currently used in data but supported for
// future paragraphs). Composes with inventory_condition / gold_condition
// which gate visibility.
function applyChoiceGoldCost(ch){
  if(!ch||!ch.gold_cost||!S) return;
  const cost=ch.gold_cost;
  if(cost<=0) return;
  S.gold=Math.max(0,(S.gold||0)-cost);
  logEvent('loss','− '+cost+t('zolotyh'),t('zaplacheno_za_vybor_ostalos')+S.gold);
  playSound('item');
  showItemNotification(['− '+cost+t('zolotyh')]);
  updateHUD();saveGame();
}

// Per-choice inventory consumption (group_6 post-audit, Gemini findings).
// A choice may carry `consume_on_use: "Item name"` (string) or
// `consume_on_use: ["A","B"]` (array). On click the engine removes each
// named item from S.inventory if present (one occurrence each), logs the
// loss to the event log, and shows a quick notification. Mirrors the
// applyChoiceGoldCost pattern: state mutation happens before navigation.
// Used for canonical single-use items where the FB2 narrative explicitly
// destroys or expends the item (e.g. sec.891 "ключ обламывается",
// sec.976 "разрезаете апельсин"). Items not in inventory at click time
// are silently skipped — gating via inventory_condition guarantees
// possession in well-formed data, but a defensive check is cheap.
function applyChoiceConsume(ch){
  if(!ch||!ch.consume_on_use||!S||!S.inventory) return;
  const cu=ch.consume_on_use;
  const removed=[];
  // Food-aware single removal: exact match first, then base-name fallback so
  // consume_on_use:'Banan' removes a carried 'Banan (eda: +3)' (monkey at 154).
  const removeOne=name=>{
    let idx=S.inventory.indexOf(name);
    if(idx<0) idx=S.inventory.findIndex(it=>canonItem(it)===canonItem(name));
    if(idx>=0){ S.inventory.splice(idx,1); removed.push(name); return true; }
    return false;
  };
  // Count form {item:'Banan', count:4} (group_38): remove N matches (para 12 /
  // para 625 banana sinks). Stops early if fewer than N are present.
  if(cu&&typeof cu==='object'&&!Array.isArray(cu)&&cu.item){
    for(let k=0;k<(cu.count||1);k++){ if(!removeOne(cu.item)) break; }
  } else {
    const list=Array.isArray(cu)?cu:[cu];
    for(const name of list){ removeOne(name); }
  }
  if(removed.length===0) return;
  for(const name of removed){
    logEvent('loss','− '+invDisplay(name),t('predmet_izrashodovan'));
  }
  playSound('item');
  showItemNotification(removed.map(n=>'− '+invDisplay(n)));
  updateHUD();saveGame();
}

// Letter-sum riddle mechanic (group_18, May 2026).
// Two canonical riddles in the FB2: sec.1131 (cemetery riddle, +916 → sec.992)
// and sec.992 (spider's column riddle, +825 → sec.932). Player types Russian
// answer; engine computes letter-ordinal sum and adds the modifier. Anti-cheat
// by design — answer string is never stored in code or data. Math sum is
// one-way; modifier + valid_targets reveal nothing about the answer (76
// could be "кладбище" or thousands of other 76-summing strings).
//
// Russian alphabet: А=1, Б=2 ... Ё=7 ... Я=33. The "*" prefix below makes
// indexOf return the correct 1-based position for letters.
const ALPHABET_RU='*АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

// ── Riddle i18n (group_72) ──
// Per-locale answer lists store ONLY djb2 hashes of normalised words, so the
// no-plaintext-answers property above holds for every language. Adding a new
// language: pick answer words, run scripts/i18n_riddle_hash.py --gen, merge the
// payload via scripts/i18n_merge_meta.py (see TRANSLATION_GUIDE). Normalisation
// must match the tool exactly: NFD -> strip combining marks -> uppercase ->
// keep cased letters only. The classic Cyrillic letter-sum below stays as the
// universal fallback, so Russian answers keep working in every locale.
function riddleNorm(s){
  const folded=String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  let out='';
  for(const ch of folded){ if(ch.toLowerCase()!==ch.toUpperCase()) out+=ch; }
  return out;
}
function riddleHash(s){
  let h=5381;
  for(const ch of riddleNorm(s)){ h=(((h<<5)+h)+ch.codePointAt(0))>>>0; }
  return h;
}
function localeRiddleTarget(input){
  const pid=String(S.section);
  const A=(typeof ACTIVE_LOCALE!=='undefined'&&ACTIVE_LOCALE)||null;
  const list=(A&&A.riddles&&A.riddles[pid])||(typeof LOCALE_RU!=='undefined'&&LOCALE_RU.riddles&&LOCALE_RU.riddles[pid])||null;
  if(!list)return null;
  const h=riddleHash(input);
  for(const e of list){ if(e&&e.h===h&&GD[String(e.target)])return e.target; }
  return null;
}

function applyRiddleAnswer(input,riddleConfig){
  if(!input||!riddleConfig)return;
  // Locale answer-list path (any language) — checked before the classic sum.
  const locTarget=localeRiddleTarget(input);
  if(locTarget){
    S.riddle_attempts=0;
    logEvent('gain',t('zagadka_razgadana'),t('paragraf_2')+locTarget);
    playSound('item');
    goTo(locTarget);
    return;
  }
  // Normalise: uppercase, strip everything except Cyrillic letters.
  let cleaned=input.toUpperCase().replace(/[^А-ЯЁ]/g,'');
  // Optional ё→е equivalence (per-riddle config). When alphabet_mode is
  // "ru_yo_eq", treat ё as е for the sum. Default ("ru_standard") uses
  // canonical 33-letter alphabet with Ё=7.
  if(riddleConfig.alphabet_mode==='ru_yo_eq'){
    cleaned=cleaned.replace(/Ё/g,'Е');
  }
  // Compute letter-ordinal sum.
  let sum=0;
  for(const ch of cleaned){
    const val=ALPHABET_RU.indexOf(ch);
    if(val>0)sum+=val;
  }
  const targetId=sum+riddleConfig.modifier;
  // Validate: target must be in the valid_targets allow-list AND must
  // exist in GD. The allow-list prevents random navigation to unintended
  // paragraphs that happen to have the right offset.
  const valid=(riddleConfig.valid_targets||[]).includes(targetId);
  if(valid&&GD[String(targetId)]){
    S.riddle_attempts=0;
    logEvent('gain',t('zagadka_razgadana'),t('paragraf_2')+targetId);
    playSound('item');
    goTo(targetId);
  }else{
    handleRiddleFail(riddleConfig);
  }
}

function handleRiddleFail(riddleConfig){
  S.riddle_attempts=(S.riddle_attempts||0)+1;
  const maxAttempts=riddleConfig.max_attempts||3;
  const remaining=maxAttempts-S.riddle_attempts;
  if(remaining<=0){
    S.riddle_attempts=0;
    logEvent('loss',t('zagadka_ne_razgadana'),t('paragraf_2')+riddleConfig.fail_target);
    playSound('death');
    goTo(riddleConfig.fail_target);
  }else{
    // Visual feedback: shake animation + attempts counter.
    const input=document.getElementById('riddle-input');
    const feedback=document.getElementById('riddle-feedback');
    const remEl=document.getElementById('riddle-attempts');
    if(input){
      input.classList.remove('shake');
      void input.offsetWidth; // restart animation
      input.classList.add('shake');
      input.value='';
      input.focus();
    }
    if(feedback&&remEl){
      remEl.textContent=remaining;
      feedback.classList.remove('hidden');
      if(typeof bcAnnounce==='function') bcAnnounce((feedback.textContent||'').replace(/\s+/g,' ').trim()); // group_82 CU-12
    }
    saveGame();
  }
}

function renderRiddle(sec){
  // Replaces renderChoices when sec.riddle is present. Renders a Cyrillic
  // text input + submit button + feedback row showing remaining attempts.
  // group_81 CA-01: the widget lives in the reading column like every other renderer.
  const cont=document.getElementById('c-list');
  if(!cont)return;
  cont.innerHTML='';
  const maxAttempts=sec.riddle.max_attempts||3;
  const used=S.riddle_attempts||0;
  const remaining=Math.max(0,maxAttempts-used);
  // Build UI
  const wrap=document.createElement('div');
  wrap.className='riddle-container';
  // Input row
  const inputRow=document.createElement('div');
  inputRow.className='riddle-input-row';
  const inp=document.createElement('input');
  inp.type='text';
  inp.id='riddle-input';
  inp.placeholder=t('vash_otvet_im_padezh_ed_ch');
  inp.autocomplete='off';
  inp.autocorrect='off';
  inp.spellcheck=false;
  inp.maxLength=40;
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){e.preventDefault();submit();}
  });
  const btn=document.createElement('button');
  btn.className='choice-btn riddle-submit';
  btn.textContent=t('otvetit');
  function submit(){
    const val=inp.value;
    if(!val||!val.trim())return;
    applyRiddleAnswer(val,sec.riddle);
  }
  btn.addEventListener('click',submit);
  inputRow.appendChild(inp);
  inputRow.appendChild(btn);
  wrap.appendChild(inputRow);
  // Feedback line (initially shown only if attempts already used)
  const fb=document.createElement('div');
  fb.id='riddle-feedback';fb.setAttribute('role','status');fb.setAttribute('aria-live','polite'); // group_82 CU-12
  fb.className=used>0?'riddle-feedback':'riddle-feedback hidden';
  fb.innerHTML=t('neverno_ostalos')+'<span id="riddle-attempts">'+remaining+'</span>';
  wrap.appendChild(fb);
  // Optional fail-target manual exit (canon-compliant for sec.992 where
  // the spider explicitly says "если не знаете ответа, уходите — 1123").
  // Only show when riddle.fail_target_label is set (per-riddle config).
  if(sec.riddle.fail_target_label){
    const exitBtn=document.createElement('button');
    exitBtn.className='choice-btn riddle-exit';
    exitBtn.textContent=sec.riddle.fail_target_label;
    exitBtn.addEventListener('click',function(){
      S.riddle_attempts=0;
      goTo(sec.riddle.fail_target);
    });
    wrap.appendChild(exitBtn);
  }
  cont.appendChild(wrap);
  // Focus input after render (slight delay so DOM is ready).
  setTimeout(function(){ if(inp.isConnected&&!(typeof _bcTopDialog==='function'&&_bcTopDialog())) inp.focus({preventScroll:true}); },50); // group_82 CU-01: never pull focus behind an open dialog
}

// Shop / buy-choice mechanism (group_14). A choice with purchase:true is
// a transaction button rather than a navigation button. It costs N gold
// (gold_cost), grants items (grants_items) and/or restores stamina
// (grants_stamina), and re-renders the same paragraph after completion
// so the player can keep shopping. Bought items are tracked in
// S.shopBought[paragraph]=[choice_index,...] so the same item can't be
// bought twice from one shop. Food (grants_stamina without grants_items)
// is considered consumable — not tracked, can be re-purchased any
// number of times until gold runs out. The choice's `target` field is
// the paragraph to re-render (typically the shop itself) and is unused
// for the transaction logic.
function makePurchaseBtn(ch, choiceIndex){
  const btn=document.createElement('button');
  btn.className='choice-btn purchase-btn';
  const cost=ch.gold_cost||0;
  const grantsItems=Array.isArray(ch.grants_items)?ch.grants_items:(ch.grants_items?[ch.grants_items]:[]);
  const grantsStamina=ch.grants_stamina||0;
  // Auto-append price if the label doesn't already mention the exact amount
  // (language-neutral digit check; skip for free items).
  let displayLabel=ch.label||'';
  if(cost>0&&!(new RegExp('\\b'+cost+'\\b').test(displayLabel))){
    displayLabel+=` — ${cost}${t('zol')}`;
  }
  btn.textContent=`💰 ${displayLabel}`;
  btn.style.borderColor='var(--gold)';
  btn.style.color='var(--gold)';
  btn.style.background='rgba(212,175,55,.08)';
  // State checks: already bought? not enough gold? inventory full?
  if(!S.shopBought)S.shopBought={};
  const paraKey=String(S.section);
  const bought=S.shopBought[paraKey]||[];
  const isBought=(grantsItems.length>0)&&bought.includes(choiceIndex);
  const canAfford=S.gold>=cost;
  // §132 sub-features:
  //  • grants_bag_size — one-time bag upgrade (disabled once bagSize already >=).
  //  • flask_fill      — disabled when the flask is already full (max 2).
  //  • grants_food     — carried food string; counts against bag like an item.
  const bagMaxed=ch.grants_bag_size&&getBagSize()>=ch.grants_bag_size;
  const flaskFull=ch.flask_fill&&((S.flask||0)>=2);
  const foodOverflow=ch.grants_food&&(getBagUsed()+1>getBagSize());
  const wouldOverflow=(grantsItems.length>0)&&(getBagUsed()+grantsItems.filter(n=>!S.inventory.some(it=>canonItem(it)===canonItem(n))).reduce((s,n)=>s+getItemSize(n),0)>getBagSize());
  let disabled=false;
  let tooltip='';
  if(isBought){
    disabled=true;tooltip=t('uzhe_kupleno');
    btn.textContent='✓ '+displayLabel;
  } else if(bagMaxed){
    disabled=true;tooltip=t('meshok_uzhe_kuplen');
    btn.textContent='✓ '+displayLabel;
  } else if(flaskFull){
    disabled=true;tooltip=t('flyaga_uzhe_polna');
  } else if(!canAfford){
    disabled=true;tooltip=t('ne_hvataet_zolota')+S.gold+'/'+cost+')';
  } else if(wouldOverflow||foodOverflow){
    disabled=true;tooltip=t('meshok_polon');
  }
  if(disabled){
    btn.style.opacity='.4';btn.style.cursor='not-allowed';
    btn.style.borderStyle='dashed';
    btn.title=tooltip;
    btn.onclick=(e)=>{e.preventDefault();};
  } else {
    btn.onclick=()=>completePurchase(ch,choiceIndex,grantsItems,grantsStamina,cost);
  }
  return btn;
}

function completePurchase(ch, choiceIndex, grantsItems, grantsStamina, cost){
  if(!S)return;
  // Deduct gold first so any subsequent rerender shows the correct balance.
  S.gold=Math.max(0,S.gold-cost);
  const notifs=[];
  if(cost>0){
    notifs.push('− '+cost+t('zolotyh'));
    logEvent('loss','− '+cost+t('zolotyh'),t('pokupka')+S.section+t('ostalos_2')+S.gold);
  }
  // Stamina grant (food). Capped at staminaMax.
  if(grantsStamina>0){
    const before=S.stamina;
    S.stamina=Math.min(S.staminaMax,S.stamina+grantsStamina);
    const actual=S.stamina-before;
    if(actual>0){
      notifs.push('+ '+actual+t('vynoslivosti'));
      logEvent('gain','+ '+actual+t('vynoslivosti'),t('teper')+S.stamina+'/'+S.staminaMax);
    }
  }
  // Items grant. Only items not already owned are deposited; bought-list is
  // marked once the item enters the inventory so a re-buy is blocked even
  // if the player drops the item later.
  const newItems=grantsItems.filter(n=>!S.inventory.some(it=>canonItem(it)===canonItem(n)));
  newItems.forEach(name=>{
    if(getBagUsed()+getItemSize(name)<=getBagSize()){
      S.inventory.push(name);
      notifs.push('+ '+invDisplay(name));
      logEvent('gain','+ '+invDisplay(name),t('kupleno')+S.section+')');
    }
  });
  // Track bought (only for item-grant choices; consumable food unlimited).
  if(grantsItems.length>0){
    if(!S.shopBought)S.shopBought={};
    const paraKey=String(S.section);
    if(!S.shopBought[paraKey])S.shopBought[paraKey]=[];
    if(!S.shopBought[paraKey].includes(choiceIndex)){
      S.shopBought[paraKey].push(choiceIndex);
    }
  }
  // §132 bag upgrade — raise capacity (one-time; guarded by the >= check).
  if(ch.grants_bag_size&&getBagSize()<ch.grants_bag_size){
    S.bagSize=ch.grants_bag_size;
    notifs.push(t('zaplechnyy_meshok')+ch.grants_bag_size+t('mest_2'));
    logEvent('gain',t('zaplechnyy_meshok_2'),t('vmestimost_teper')+ch.grants_bag_size);
  }
  // §132 flask refill — 'full'/'water' top to max (2), 'half' adds one sip.
  if(ch.flask_fill){
    const beforeF=S.flask||0;
    if(ch.flask_fill==='half'){ S.flask=Math.min(2,beforeF+1); }
    else { S.flask=2; }
    const addedF=S.flask-beforeF;
    if(addedF>0){
      notifs.push(t('flyaga')+S.flask+'/2)');
      logEvent('gain',t('flyaga_napolnena'),t('glotkov')+S.flask+'/2');
    }
  }
  // §132 carried food — deposit a self-describing food string (repeatable,
  // counts against bag capacity, eaten later via eatFood()).
  if(ch.grants_food&&getBagUsed()+1<=getBagSize()){
    const f=ch.grants_food;
    const foodObj={id:f.name,kind:'food',stamina:f.stamina};
    S.inventory.push(foodObj);
    notifs.push('+ '+invDisplay(foodObj));
    logEvent('gain','+ '+invDisplay(foodObj),t('kupleno_vzyato_s_soboy')+S.section+')');
  }
  playSound('item');
  showItemNotification(notifs,t('pokupka_2'));
  updateHUD();saveGame();
  // Re-render the current paragraph to refresh shop-button states (bought
  // greys out, no-longer-affordable greys out, etc). Use renderChoices
  // not renderGame to avoid retriggering auto_items.
  const sec=locSec(S.section);
  if(sec)renderChoices(sec);
}

function makeBatchBtn(ch, choiceIndex){
  const key=S.section+':'+choiceIndex;
  const done=S.batchPicked&&S.batchPicked[key];
  const btn=document.createElement('button');btn.className='choice-btn';
  if(done){btn.disabled=true;btn.style.opacity='0.5';btn.innerHTML='\u2713 '+t('sobrano');return btn;}
  btn.style.borderColor='var(--gold)';btn.style.color='var(--gold)';
  btn.innerHTML=ch.label;
  btn.onclick=()=>{
    let free=getBagSize()-getBagUsed();
    const taken=[];let skipped=0;
    (ch.pickup_batch||[]).forEach(ent=>{
      const v=(typeof ent==='object'&&ent.food)?{kind:'food',id:ent.food,stamina:ent.stamina}:ent;
      if(free>=getItemSize(v)){S.inventory.push(v);free-=getItemSize(v);taken.push('+ '+invDisplay(v));}
      else skipped++;
    });
    S.batchPicked=S.batchPicked||{};S.batchPicked[key]=true;
    const msgs=taken.length?taken.slice():[t('meshok_polon_2')+(ch.pickup_batch||[]).length+t('ne_vzyato')];
    if(skipped&&taken.length)msgs.push(t('meshok_polon_2')+skipped+t('ne_vzyato'));
    logEvent('gain',t('sobrano')+' ('+taken.length+')','');
    playSound('item');showItemNotification(msgs);updateHUD();saveGame();
    btn.disabled=true;btn.style.opacity='0.5';btn.innerHTML='\u2713 '+t('sobrano');
  };
  return btn;
}

function makeBashBtn(ch){
  const btn=document.createElement('button');btn.className='choice-btn';
  btn.style.borderColor='var(--gold)';btn.style.color='var(--gold)';
  btn.innerHTML=t('vylomat_dver_plechom');
  btn.onclick=()=>{
    playSound('dice');
    const a=d6(),b=d6();
    S.stamina=Math.max(0,S.stamina-((ch.dice_bash&&ch.dice_bash.cost_stamina)||1));
    logEvent('loss','\u2212 1'+t('vynoslivosti'),'\ud83c\udfb2 '+a+'\u00b7'+b);
    updateHUD();saveGame();
    if(S.stamina<=0){showDeathOverlay();return;}
    if(a===b&&(a===1||a===6)){ goTo(ch.target); return; }
    btn.innerHTML='\ud83c\udfb2 '+a+'\u00b7'+b+' \u2014 '+t('dver_ne_poddayotsya');
  };
  return btn;
}

function makeChoiceBtn(ch, duringCombat, choiceIndex){
  // Purchase choice (group_14 shop engine) — render as transaction
  // button via makePurchaseBtn instead of navigation button. The shop
  // path lives entirely in that helper.
  if(ch&&ch.purchase===true){
    return makePurchaseBtn(ch, choiceIndex);
  }
  if(ch&&ch.dice_bash){
    return makeBashBtn(ch);
  }
  if(ch&&ch.pickup_batch){
    return makeBatchBtn(ch, choiceIndex);
  }
  const btn=document.createElement('button');btn.className='choice-btn';
  // spell_any: one destination reachable by ANY of several spells (canon
  // "заклятие X или Y" → single target). Enabled if any listed spell has a
  // charge; on click, spend ONE charge from the first listed spell that has
  // one. Mirrors the single-spell branch's styling/greying exactly.
  if(Array.isArray(ch.spell_any)&&ch.spell_any.length>0){
    const ids=ch.spell_any;
    const totalRemaining=ids.reduce((sum,id)=>sum+getSpellRemaining(id),0);
    const style=SPELL_STYLE_BY_ID[ids[0]]||{icon:'✨',border:'#8a4dbd',color:'#b070e0',bg:'rgba(140,70,200,.12)'};
    btn.style.borderColor=style.border;btn.style.color=style.color;
    btn.style.background=style.bg;
    btn.innerHTML=style.icon+' '+ch.label+(totalRemaining>0?' <span style="opacity:.6;font-size:14px">['+totalRemaining+']</span>':'');
    if(totalRemaining<=0){
      btn.style.opacity='.35';btn.style.cursor='not-allowed';
      btn.style.borderStyle='dashed';
      btn.title=t('zaklyatie_nedostupno');btn.setAttribute('aria-disabled','true');
      btn.onclick=(e)=>{e.preventDefault();};
    } else {
      btn.onclick=()=>{const pick=ids.find(id=>getSpellRemaining(id)>0);useSpell(pick);applyChoiceGoldCost(ch);applyChoiceConsume(ch);applyChoiceAcquires(ch,()=>goTo(ch.target));};
    }
    return btn;
  }
  // R2-3: combat_mod choices are pre-cast "buff bridges" leading into a combat.
  // The spell charge was already spent at the SOURCE cast, so this navigation
  // spends NOTHING; it only queues the whole-fight modifier (consumed by
  // startCombat). This replaces the old erroneous double-spend spell tag.
  if(ch.combat_mod){
    btn.innerHTML=ch.label;
    btn.onclick=()=>{if(S)S.pending_combat_buff=ch.combat_mod;applyChoiceGoldCost(ch);applyChoiceConsume(ch);applyChoiceAcquires(ch,()=>goTo(ch.target));};
    return btn;
  }
  const spellId=getSpellId(ch);
  if(spellId){
    const style=SPELL_STYLE_BY_ID[spellId]||{icon:'✨',border:'#8a4dbd',color:'#b070e0',bg:'rgba(140,70,200,.12)'};
    const remaining=getSpellRemaining(spellId);
    btn.style.borderColor=style.border;btn.style.color=style.color;
    btn.style.background=style.bg;
    btn.innerHTML=style.icon+' '+ch.label+(remaining>0?' <span style="opacity:.6;font-size:14px">['+remaining+']</span>':'');
    if(remaining<=0){
      btn.style.opacity='.35';btn.style.cursor='not-allowed';
      btn.style.borderStyle='dashed';
      btn.title=t('zaklyatie_nedostupno');btn.setAttribute('aria-disabled','true');
      btn.onclick=(e)=>{e.preventDefault();};
    } else {
      btn.onclick=()=>{useSpell(spellId);applyChoiceGoldCost(ch);applyChoiceConsume(ch);applyChoiceAcquires(ch,()=>goTo(ch.target));};
    }
  } else {
    btn.textContent=ch.label;
    // Flee penalty: choices tagged flee:true incur -2 stamina when clicked during active combat
    const isFleeChoice=duringCombat&&ch.flee===true;
    if(isFleeChoice){
      btn.onclick=()=>{
        S.stamina=Math.max(0,S.stamina-2);
        updateHUD();saveGame();
        showItemNotification([t('2_vynoslivosti_begstvo_iz_boya')]);
        applyChoiceGoldCost(ch);
        applyChoiceConsume(ch);
        applyChoiceAcquires(ch,()=>goTo(ch.target));
      };
    } else {
      btn.onclick=()=>{applyChoiceGoldCost(ch);applyChoiceConsume(ch);applyChoiceAcquires(ch,()=>goTo(ch.target));};
    }
  }
  return btn;
}


let sectionPrepState={};
let scriptedLuckContext=null;

function getSectionPrep(sectionId){
  if(!sectionPrepState[sectionId]){
    // group_82 CB-02: a persisted scripted-luck outcome (S.luckChecks[...].prep) restores the runtime
    // prep state after a reload; goTo clears the record when the paragraph is left.
    const rec=(typeof S!=='undefined'&&S&&S.luckChecks)?S.luckChecks[String(sectionId)]:null;
    sectionPrepState[sectionId]=(rec&&rec.scripted&&rec.prep&&typeof rec.prep==='object')?Object.assign({},rec.prep):{};
  }
  return sectionPrepState[sectionId];
}

function clearCombatExtraButtons(){
  const extra=document.getElementById('combat-buttons-extra');
  if(extra) extra.remove();
  const cond=document.getElementById('combat-condition-btn');
  if(cond) cond.remove();
}

function setCombatExtraButtons(buttons){
  clearCombatExtraButtons();
  const host=document.getElementById('combat-buttons');
  if(!host||!buttons||!buttons.length) return;
  const wrap=document.createElement('div');
  wrap.id='combat-buttons-extra';
  wrap.style.cssText='display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px;';
  buttons.forEach(cfg=>{
    const btn=document.createElement('button');
    btn.className=cfg.className||'btn btn-s';
    btn.textContent=cfg.text;
    btn.onclick=cfg.onClick;
    if(cfg.style) btn.style.cssText=cfg.style;
    wrap.appendChild(btn);
  });
  host.parentElement.appendChild(wrap);
}

function getAliveCombatEnemies(cs){
  if(!cs||!cs.enemies) return [];
  return cs.enemies.filter(e=>e.hp>0 && e.active!==false && !e.fled);
}

function getCombatTarget(cs){
  if(!cs)return null;
  const alive=getAliveCombatEnemies(cs);
  if(alive.length===0)return null;
  const sel=(cs.targetIdx!==undefined&&cs.targetIdx!==null)?cs.enemies[cs.targetIdx]:null;
  if(sel&&sel.hp>0&&sel.active!==false&&!sel.fled)return sel;
  cs.targetIdx=cs.enemies.indexOf(alive[0]);
  return alive[0];
}

function updateCombatEnemyDisplay(cs){
  if(!cs) return;
  getCombatTarget(cs);
  const multiTarget=getAliveCombatEnemies(cs).length>1;
  const cards=document.querySelectorAll('.combat-enemy');
  cs.enemies.forEach((e,i)=>{
    const card=cards[i];
    if(!card) return;
    const hpEl=card.querySelector('.ce-hp');
    if(hpEl) hpEl.textContent=Math.max(0,e.hp);
    const hpHead=card.querySelector('.ce-hp-head');
    if(hpHead) hpHead.textContent=Math.max(0,e.hp)+'/'+e.stamina;
    const hpFill=card.querySelector('.combat-hp-fill');
    if(hpFill) hpFill.style.width=Math.max(0, Math.min(100, (Math.max(0,e.hp)/e.stamina)*100))+'%';
    const statusEl=card.querySelector('.ce-status');
    let status=t('v_boyu');
    let stateClass='state-active';
    if(e.fled){ status=t('ubezhal'); stateClass='state-fled'; }
    else if(e.hp<=0){ status=t('poverzhen'); stateClass='state-dead'; }
    else if(e.active===false){ status=t('ozhidaet'); stateClass='state-waiting'; }
    if(statusEl){
      statusEl.textContent=status;
      statusEl.className='ce-status ce-status-pill '+stateClass;
    }
    card.style.opacity=(e.active===false && !e.fled && e.hp>0)?'0.55':'1';
    const isTargetable=(e.hp>0&&e.active!==false&&!e.fled);
    // group_80 V-03: during the pre-round-1 Weakness pick window ALL alive cards
    // (incl. staged waiters) are selectable for the debuff - canon 'lyubogo iz nih'.
    const isPickable=(cs.pendingWeakPick&&e.hp>0&&!e.fled);
    const isSel=(cs.targetIdx===i)&&isTargetable&&multiTarget;
    const isWeakSel=(cs.pendingWeakPick&&cs.weakPickIdx===i);
    // group_81 CA-02: selection rides box-shadow (outline stays free for :focus-visible);
    // clickable cards are keyboard-operable buttons with a pressed state.
    card.style.boxShadow=isWeakSel?'0 0 0 2px var(--red2)':(isSel?'0 0 0 2px var(--gold)':'none');
    card.style.outline='';card.style.outlineOffset='';
    const clickable=((isTargetable&&multiTarget)||isPickable);
    card.style.cursor=clickable?'pointer':'default';
    card.onclick=clickable?()=>{
      if(cs.pendingWeakPick)cs.weakPickIdx=i;
      if(e.hp>0&&e.active!==false&&!e.fled)cs.targetIdx=i;
      updateCombatEnemyDisplay(cs);
    }:null;
    if(clickable){ card.setAttribute('role','button'); card.tabIndex=0; card.setAttribute('aria-pressed',(isSel||isWeakSel)?'true':'false'); card.setAttribute('aria-label',e.name+', '+status); card.onkeydown=(ev)=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); if(card.onclick)card.onclick(); } }; }
    else { card.removeAttribute('role'); card.removeAttribute('tabindex'); card.removeAttribute('aria-pressed'); card.removeAttribute('aria-label'); card.onkeydown=null; }
  });
}

function resumeCanonCombat(){
  clearCombatExtraButtons();
  const roundBtn=document.getElementById('btn-combat-round');
  if(roundBtn){
    roundBtn.style.display='inline-block';
    roundBtn.textContent=t('udar');
    roundBtn.onclick=combatRound;
  }
  const copyBtn=document.getElementById('btn-copy-spell');
  if(copyBtn && combatState){
    const remaining=getSpellRemaining('COPY');
    if(remaining>0 && getAliveCombatEnemies(combatState).length>0){
      copyBtn.style.display='inline-block';
      copyBtn.textContent=t('zaklyatie_kopii')+remaining+']';
    }
  }
  updateCombatEnemyDisplay(combatState);
}

function startScriptedLuckCheck(opts){
  scriptedLuckContext=opts||{};
  document.getElementById('luck-result').innerHTML='';
  document.getElementById('luck-choices').innerHTML='';
  const header=opts&&opts.promptHtml?opts.promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">${t('broste_dva_kubika_esli_rezultat')}${S.luck}${t('vam_povezlo')}<br><span style="font-size:16px;opacity:.7">${t('posle_proverki_udacha_umenshitsy')}</span></p>`;
  document.getElementById('luck-info').innerHTML=header;
  document.getElementById('btn-luck-roll').style.display='inline-block';
  document.getElementById('btn-luck-roll').onclick=doScriptedLuckCheck;
  document.getElementById('modal-luck').classList.add('on');
}

function doScriptedLuckCheck(){
  const opts=scriptedLuckContext||{};
  playSound('dice');
  const roll1=d6(),roll2=d6(),roll=roll1+roll2;
  const lucky=roll<=S.luck;
  S.luck=Math.max(0,S.luck-1);
  const res=document.getElementById('luck-result');
  const needed=S.luck+1;
  if(lucky){
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,true, opts.successHtml?`<div style="color:var(--muted);line-height:1.7">${opts.successHtml}</div>`:'');
    if(typeof opts.onLucky==='function') opts.onLucky();
    logEvent('luck',t('proverka_udachi')+roll+' ≤ '+needed,t('udachno_udacha_teper')+S.luck);
  } else {
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,false, opts.failHtml?`<div style="color:var(--muted);line-height:1.7">${opts.failHtml}</div>`:'');
    if(typeof opts.onUnlucky==='function') opts.onUnlucky();
    logEvent('luck',t('proverka_udachi')+roll+' > '+needed,t('neudacha_udacha_teper')+S.luck);
  }
  // group_82 CB-02: persist the scripted outcome (sec.21/368/436 prep state) at roll time so an F5
  // cannot reroll it; mid-combat prompts (sec.1175) touch no prep state and stay under B-08.
  try{ const prep=sectionPrepState[S.section]; if(prep&&typeof prep==='object'){ S.luckChecks=S.luckChecks||{}; S.luckChecks[String(S.section)]={a:roll1,b:roll2,lucky:lucky,scripted:true,prep:JSON.parse(JSON.stringify(prep))}; } }catch(e){}
  document.getElementById('btn-luck-roll').style.display='none';
  updateHUD();saveGame();
  const ch=document.getElementById('luck-choices');
  const btn=document.createElement('button');
  btn.className='btn btn-s';
  btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
  btn.textContent=opts.continueText||t('prodolzhit');
  btn.onclick=()=>{
    document.getElementById('modal-luck').classList.remove('on');
    if(typeof opts.afterClose==='function') opts.afterClose();
    else renderGame();
    scriptedLuckContext=null;
  };
  ch.appendChild(btn);
}

function renderCanonCombatChoices(sec,list){
  const st=getSectionPrep(sec.id);
  if(sec.combat_script==='sec21_pre_luck'){
    if(!st.luckResolved){
      const btn=document.createElement('button');
      btn.className='choice-btn';
      btn.style.borderColor='var(--green)';btn.style.color='var(--green2)';btn.style.background='rgba(40,180,100,.12)';
      btn.innerHTML=t('proverit_udachu');
      btn.onclick=()=>startScriptedLuckCheck({
        promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">${t('snachala_nuzhno_proverit_udachu')}<br><span style="font-size:16px;opacity:.7">${t('posle_proverki_udacha_umenshitsy')}</span></p>`,
        successHtml:t('vy_mgnovenno_pererubaete_nit_i_s'),
        failHtml:t('nit_ne_poddalas_srazu_srazhatsya'),
        onLucky:()=>{ sectionPrepState[sec.id]={luckResolved:true, playerMod:0}; },
        onUnlucky:()=>{ sectionPrepState[sec.id]={luckResolved:true, playerMod:-2}; },
        afterClose:()=>renderGame()
      });
      list.appendChild(btn);
      return true;
    }
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML=t('vstupit_v_boy');
    btn.onclick=()=>startCombat(sec.enemies,{...sec, player_attack_mod:(st.playerMod??-2)});
    list.appendChild(btn);
    return true;
  }
  if(sec.combat_script==='sec368_optional_pre_luck'){
    if(!st.modeSelected){
      const ground=document.createElement('button');ground.className='choice-btn';
      ground.style.borderColor='var(--red)';ground.style.color='var(--red2)';ground.style.background='rgba(180,30,30,.12)';
      ground.innerHTML=t('dratsya_stoya_na_zemle');
      ground.onclick=()=>{ sectionPrepState[sec.id]={modeSelected:true, playerMod:-1}; renderGame(); };
      list.appendChild(ground);
      const luck=document.createElement('button');luck.className='choice-btn';
      luck.style.borderColor='var(--green)';luck.style.color='var(--green2)';luck.style.background='rgba(40,180,100,.12)';
      luck.innerHTML=t('proverit_udachu_i_popytatsya_ose');
      luck.onclick=()=>startScriptedLuckCheck({
        promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">${t('mozhno_dratsya_stoya_na_zemle_so')}<br><span style="font-size:16px;opacity:.7">${t('posle_proverki_udacha_umenshitsy')}</span></p>`,
        successHtml:t('vam_udaetsya_osedlat_konya_v_boy'),
        failHtml:t('osedlat_konya_ne_udalos_srazhats'),
        onLucky:()=>{ sectionPrepState[sec.id]={modeSelected:true, playerMod:0}; },
        onUnlucky:()=>{ sectionPrepState[sec.id]={modeSelected:true, playerMod:-1}; },
        afterClose:()=>renderGame()
      });
      list.appendChild(luck);
      return true;
    }
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML=t('vstupit_v_boy');
    btn.onclick=()=>startCombat(sec.enemies,{...sec, player_attack_mod:(st.playerMod??-1)});
    list.appendChild(btn);
    return true;
  }
  if(sec.combat_script==='sec436_pre_luck'){
    // §436 spider-on-the-tree. Canon flow:
    //  • Roll luck. Lucky → §456 (cut ladder, drop to ground, equal-terms
    //    fight handled by §456). Unlucky → forced tree fight at −1 СИЛА УДАРА.
    //  • On the unlucky branch the player may cast Force (→§526) or Weakness
    //    (→§448) as NAVIGATION choices (combat_spells_allowed:[]; Copy is
    //    forbidden — "Копии негде поместиться").
    //  • Force round-trip: §436→(cast Force once)→§526→§436. Because goTo()
    //    resets sectionPrepState, the Force flag must live on S (the save
    //    state), like shopBought/riddle_attempts. On Force-return we skip the
    //    luck roll and fight at +1 (canon §526: "не вычитать, а прибавлять 1").
    if(S.sec436_force){
      // Returning from §526 after a successful Force cast: fight at +1, once.
      // group_80 X-04: the paid Force is consumed ATOMICALLY in the fight
      // onclick, not at render - an F5 between render and the Fight click
      // reloads back onto this same +1 branch with the flag intact.
      const fightF=document.createElement('button');fightF.className='choice-btn';
      fightF.style.borderColor='var(--gold)';fightF.style.color='var(--gold)';fightF.style.background='rgba(212,175,55,.12)';
      fightF.innerHTML=t('dratsya_zaklyatie_sily_1_k_sile');
      fightF.onclick=()=>{ S.sec436_force=false; saveGame(); startCombat(sec.enemies,{...sec, player_attack_mod:1, combat_spells_allowed:[]}); };
      list.appendChild(fightF);
      return true;
    }
    if(!st.luckResolved){
      const btn=document.createElement('button');
      btn.className='choice-btn';
      btn.style.borderColor='var(--green)';btn.style.color='var(--green2)';btn.style.background='rgba(40,180,100,.12)';
      btn.innerHTML=t('proverit_udachu');
      btn.onclick=()=>startScriptedLuckCheck({
        promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">${t('pauk_tyanet_vas_k_sebe_esli_pove')}<br><span style="font-size:16px;opacity:.7">${t('posle_proverki_udacha_umenshitsy')}</span></p>`,
        successHtml:t('vy_pererubaete_lestnicu_i_sprygi'),
        failHtml:t('pauk_zatyagivaet_vas_na_derevo_v'),
        onLucky:()=>{ sectionPrepState[sec.id]={luckResolved:true, escaped:true}; },
        onUnlucky:()=>{ sectionPrepState[sec.id]={luckResolved:true, escaped:false}; },
        afterClose:()=>{ const s=getSectionPrep(sec.id); if(s.escaped){ goTo(456); } else { renderGame(); } }
      });
      list.appendChild(btn);
      return true;
    }
    if(st.escaped){ goTo(456); return true; }
    // Unlucky branch: forced tree fight with −1 (player_attack_mod:-1 in data).
    const fight=document.createElement('button');fight.className='choice-btn';
    fight.style.borderColor='var(--red)';fight.style.color='var(--red2)';fight.style.background='rgba(180,30,30,.12)';
    fight.innerHTML=t('dratsya_s_paukom_na_dereve');
    fight.onclick=()=>startCombat(sec.enemies,sec);
    list.appendChild(fight);
    // Canonical navigation spell choices, shown only after the unlucky roll.
    sec.choices.forEach((ch,idx)=>{
      if(!ch.only_after_unlucky || !passesInventoryCheck(ch) || !passesGoldCheck(ch)) return;
      if(ch.spell==='FORCE'){
        // Force: cast once here, set the persistent round-trip flag, go to §526.
        // (§526's return choice is plain navigation — no second cast.)
        const rem=getSpellRemaining('FORCE');
        const fb=document.createElement('button');fb.className='choice-btn';
        const stl=SPELL_STYLE_BY_ID['FORCE']||{icon:'✨',border:'#8a4dbd',color:'#b070e0',bg:'rgba(140,70,200,.12)'};
        fb.style.borderColor=stl.border;fb.style.color=stl.color;fb.style.background=stl.bg;
        fb.innerHTML=stl.icon+' '+ch.label+(rem>0?' <span style="opacity:.6;font-size:14px">['+rem+']</span>':'');
        if(rem<=0){ fb.style.opacity='.35';fb.style.cursor='not-allowed';fb.style.borderStyle='dashed';fb.title=t('zaklyatie_nedostupno');fb.setAttribute('aria-disabled','true');fb.onclick=(e)=>{e.preventDefault();}; }
        else { fb.onclick=()=>{ useSpell('FORCE'); S.sec436_force=true; saveGame(); goTo(ch.target); }; }
        list.appendChild(fb);
      } else {
        // Weakness (→§448) and any other: standard spell-navigation button.
        list.appendChild(makeChoiceBtn(ch,false,idx));
      }
    });
    return true;
  }
  return false;
}

function handleCanonCombatMilestones(cs){
  if(!cs||!cs.special||cs.special.type!=='sec1175') return false;
  const log=document.getElementById('combat-log');
  const first=cs.enemies[0];
  if(cs.round===4 && first.hp>0 && !cs.special.reinforcementsJoined){
    cs.enemies[1].active=true;
    cs.enemies[2].active=true;
    cs.special.reinforcementsJoined=true;
    log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">${t('cherez_tri_raunda_dva_ostalnyh_o')}</div>`;
    updateCombatEnemyDisplay(cs);
  }
  if(first.hp<=0 && !cs.special.firstDeathHandled){
    cs.special.firstDeathHandled=true;
    if(!cs.special.reinforcementsJoined){
      cs.enemies[1].active=true;
      cs.enemies[2].active=true;
      cs.special.reinforcementsJoined=true;
      log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">${t('pervyy_ork_poverzhen_teper_vam_p')}</div>`;
      updateCombatEnemyDisplay(cs);
    }
    if(!cs.special.luckChecked && cs.enemies[2].hp>0 && !cs.enemies[2].fled){
      promptCanon1175Luck();
      return true;
    }
  }
  return false;
}

function promptCanon1175Luck(){
  const cs=combatState;
  if(!cs||!cs.special||cs.special.type!=='sec1175') return;
  const log=document.getElementById('combat-log');
  const roundBtn=document.getElementById('btn-combat-round');
  const copyBtn=document.getElementById('btn-copy-spell');
  if(roundBtn) roundBtn.style.display='none';
  if(copyBtn) copyBtn.style.display='none';
  log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">${t('mozhete_proverit_udachu_esli_pov')}</div>`;
  setCombatExtraButtons([
    {text:t('proverit_udachu'), className:'btn btn-g', onClick:()=>startScriptedLuckCheck({
      promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">${t('pervyy_ork_uzhe_poverzhen_esli_u')}<br><span style="font-size:16px;opacity:.7">${t('posle_proverki_udacha_umenshitsy')}</span></p>`,
      successHtml:t('tretiy_ork_predpochitaet_spastis'),
      failHtml:t('tretiy_ork_ne_drognul_boy_prodol'),
      onLucky:()=>{ cs.special.luckChecked=true; cs.enemies[2].active=false; cs.enemies[2].fled=true; updateCombatEnemyDisplay(cs); },
      onUnlucky:()=>{ cs.special.luckChecked=true; },
      afterClose:()=>resumeCanonCombat()
    })},
    {text:t('prodolzhit_boy_bez_proverki'), className:'btn btn-p', onClick:()=>{ cs.special.luckChecked=true; resumeCanonCombat(); }}
  ]);
}

// Betting dice roll (group_40, Phase B1). The four gambling routers
// (§793/§887/§910/§1187) carry dice_roll:true and tag each choice with a
// die_face (1–6). Instead of letting the player pick which face "came up"
// (the old behaviour — pure cheating), this rolls a real d6 and routes to the
// matching outcome. §1008 ("die slipped — re-roll") just targets §910 again,
// which re-renders this widget for a fresh roll. bettingDieTarget is the pure
// face→target lookup (unit-tested); the forced arg is for tests only —
// production always rolls via d6().
function bettingDieTarget(sec, roll){
  const ch=((sec&&sec.choices)||[]).find(c=>c.die_face===roll);
  return ch?ch.target:null;
}
function renderDiceRoll(sec){
  const list=document.getElementById('c-list'); if(!list) return;
  list.innerHTML='';
  const btn=document.createElement('button');
  btn.className='choice-btn';
  btn.style.borderColor='var(--gold)';btn.style.color='var(--gold)';btn.style.background='rgba(212,175,55,.12)';
  btn.innerHTML=t('brosit_kubik');
  btn.onclick=()=>{
    playSound('dice');
    const roll=d6();
    const tgt=bettingDieTarget(sec,roll);
    logEvent('luck',t('kubik_vypalo')+roll, tgt?(t('paragraf_3')+tgt):'');
    list.innerHTML='';
    const res=document.createElement('div');
    res.style.cssText='text-align:center;font-size:30px;color:var(--gold);margin:14px 0;font-weight:bold;';
    res.innerHTML='🎲 '+roll;
    list.appendChild(res);
    const cont=document.createElement('button');
    cont.className='choice-btn';
    cont.textContent=t('prodolzhit');
    cont.onclick=()=>{ if(tgt!==null&&tgt!==undefined) goTo(tgt); };
    list.appendChild(cont);
    bcAnnounce(t('kubik_vypalo')+roll); cont.focus({preventScroll:true}); // group_81 CA-05
  };
  list.appendChild(btn);
}

function renderDiceCheck(sec){
  const list=document.getElementById('c-list'); if(!list) return;
  list.innerHTML='';
  const dc=sec.dice_check;
  // group_80 V-04: the roll is committed BEFORE its outcome is shown and survives
  // reload/revisit - a mandatory check cannot be rerolled to success.
  const showResolved=(a,b,ok,tgt)=>{
    const res=document.createElement('div');
    res.style.cssText='text-align:center;font-size:30px;color:'+(ok?'var(--gold)':'var(--red2)')+';margin:14px 0;font-weight:bold;';
    res.innerHTML='\ud83c\udfb2 '+a+' + '+b+' = '+(a+b);
    list.appendChild(res);
    const cont=document.createElement('button');
    cont.className='choice-btn';
    cont.textContent=t('prodolzhit');
    cont.onclick=()=>{ goTo(tgt); };
    list.appendChild(cont);
  };
  const rec=S.diceCheckDone&&S.diceCheckDone[S.section];
  if(rec){ showResolved(rec.a,rec.b,rec.ok,rec.tgt); return; }
  const btn=document.createElement('button');
  btn.className='choice-btn';
  btn.style.borderColor='var(--gold)';btn.style.color='var(--gold)';btn.style.background='rgba(212,175,55,.12)';
  btn.innerHTML=t('brosit_kubik');
  btn.onclick=()=>{
    playSound('dice');
    const a=d6(),b=d6(),sum=a+b;
    const ok=sum>=dc.gte;
    const tgt=ok?dc.win:dc.lose;
    S.diceCheckDone=S.diceCheckDone||{};S.diceCheckDone[S.section]={a:a,b:b,ok:ok,tgt:tgt};
    saveGame();
    logEvent('luck',t('kubik_vypalo')+a+'+'+b+'='+sum,t('paragraf_3')+tgt);
    list.innerHTML='';
    showResolved(a,b,ok,tgt);
    bcAnnounce(t('kubik_vypalo')+a+'+'+b+'='+sum); const cb=list.querySelector('button'); if(cb) cb.focus({preventScroll:true}); // group_81 CA-05
  };
  list.appendChild(btn);
}

function renderDiceLoot(sec){
  const list=document.getElementById('c-list'); if(!list) return;
  list.innerHTML='';
  const dl=sec.dice_loot;
  const renderExit=()=>{
    const cont=document.createElement('button');
    cont.className='choice-btn';
    cont.textContent=t('prodolzhit');
    cont.onclick=()=>{
      // group_80 V-04: leaving without picking commits the refusal.
      if(S.diceLootRoll&&S.diceLootRoll[S.section]&&!(S.diceLootDone&&S.diceLootDone[S.section])){
        S.diceLootDone=S.diceLootDone||{};S.diceLootDone[S.section]=true;saveGame();
      }
      goTo(dl.target);
    };
    list.appendChild(cont);
  };
  if(S.diceLootDone&&S.diceLootDone[S.section]){ renderExit(); return; }
  // group_80 V-04: the roll is committed at roll time; reload/revisit restores the
  // same n and the unfinished pickup instead of offering a fresh roll.
  const showRolled=(n)=>{
    list.innerHTML='';
    const res=document.createElement('div');
    res.style.cssText='text-align:center;font-size:30px;color:var(--gold);margin:14px 0;font-weight:bold;';
    res.innerHTML='\ud83c\udfb2 '+n;
    list.appendChild(res);
    const pick=document.createElement('button');
    pick.className='choice-btn';
    pick.textContent=t('podobrat_lichinok')+n+')';
    pick.onclick=()=>{
      const free=getBagSize()-getBagUsed();
      const take=Math.max(0,Math.min(n,free));
      for(let i=0;i<take;i++)S.inventory.push(dl.item);
      S.diceLootDone=S.diceLootDone||{};S.diceLootDone[S.section]=true;
      const msgs=['+ '+take+' \u00d7 '+itemName(dl.item)];
      if(take<n)msgs.push(t('meshok_polon_2')+(n-take)+t('ne_vzyato'));
      logEvent('gain',msgs[0],msgs[1]||'');
      updateHUD();saveGame();playSound('item');showItemNotification(msgs);
      pick.remove();
      const cb2=list.querySelector('button'); if(cb2) cb2.focus({preventScroll:true}); // group_82 CU-04
    };
    list.appendChild(pick);
    renderExit();
  };
  const rolled=S.diceLootRoll&&S.diceLootRoll[S.section];
  if(rolled){ showRolled(rolled.n); return; }
  const btn=document.createElement('button');
  btn.className='choice-btn';
  btn.style.borderColor='var(--gold)';btn.style.color='var(--gold)';btn.style.background='rgba(212,175,55,.12)';
  btn.innerHTML=t('brosit_kubik');
  btn.onclick=()=>{
    playSound('dice');
    const n=d6();
    S.diceLootRoll=S.diceLootRoll||{};S.diceLootRoll[S.section]={n:n};
    saveGame();
    logEvent('luck',t('kubik_vypalo')+n,'');
    showRolled(n);
    bcAnnounce(t('kubik_vypalo')+n); const pb=list.querySelector('button'); if(pb) pb.focus({preventScroll:true}); // group_81 CA-05
  };
  list.appendChild(btn);
}

// Betting Phase B2 (group_41). Stake commit + payout resolution. Runs on EVERY
// visit (see renderGame) because the gambling loop is re-entrant.
//   sec.set_stake  = {kind:'gold', amount:N}  -> deduct N gold, remember stake
//                  | {kind:'item', name:'X'}   -> remove X from bag, remember stake
//   sec.bet_payout = { stake:'lose'|'keep'|'half'|{multiply:N},
//                      gold:N, items:[...], food:[{name,stamina,count}], flask_zero:true }
// Stake resolution (documented interpretation — tweakable per outcome):
//   lose        -> forfeit (gold already deducted at commit; item already removed)
//   keep        -> returned (refund gold / put the item back in the bag)
//   half        -> half the gold stake refunded (floor); item stakes never use this
//   {multiply:N}-> winnings of N× the gold stake added (stake itself consumed)
function applyBetting(sec){
  if(!S||!sec) return;
  const notifs=[];
  // 1) Stake commit
  if(sec.set_stake){
    const st=sec.set_stake;
    if(st.kind==='gold'){
      const amt=st.amount||0;
      S.gold=Math.max(0,S.gold-amt);
      S.bet_stake={kind:'gold',amount:amt};
      notifs.push(t('stavka')+amt+t('zolotyh'));
      logEvent('loss',t('stavka_2')+amt+t('zolotyh'),t('na_konu_ostalos')+S.gold);
    } else if(st.kind==='item'){
      const idx=S.inventory.findIndex(it=>canonItem(it)===canonItem(st.name));
      if(idx>=0){
        S.inventory.splice(idx,1);
        S.bet_stake={kind:'item',name:st.name};
        notifs.push(t('stavka')+invDisplay(st.name));
        logEvent('loss',t('stavka_2')+invDisplay(st.name),t('na_konu'));
      } // defensive: no phantom stake when the item is absent (unreachable today - set_stake entries are gated)
    }
  }
  // 2) Payout + stake resolution
  if(sec.bet_payout){
    const bp=sec.bet_payout;
    const stake=S.bet_stake;
    if(bp.stake!==undefined){
      if(bp.stake==='keep'){
        if(stake&&stake.kind==='gold'){ S.gold+=stake.amount; notifs.push(t('stavka_vozvraschena')+stake.amount+t('zol')); logEvent('gain',t('stavka_vozvraschena_2'),'+'+stake.amount+t('zolotyh')); }
        else if(stake&&stake.kind==='item'){ if(getBagUsed()+getItemSize(stake.name)<=getBagSize()){ S.inventory.push(stake.name); } notifs.push(t('stavka_vozvraschena_3')+invDisplay(stake.name)); logEvent('gain',t('stavka_vozvraschena_2'),invDisplay(stake.name)); }
      } else if(bp.stake==='half'){
        if(stake&&stake.kind==='gold'){ const back=Math.floor(stake.amount/2); S.gold+=back; notifs.push(t('vozvrat_poloviny_stavki')+back+t('zol')); logEvent('gain',t('polovina_stavki'),'+'+back+t('zolotyh')); }
      } else if(bp.stake&&typeof bp.stake==='object'&&bp.stake.multiply){
        if(stake&&stake.kind==='gold'){ const win=bp.stake.multiply*stake.amount; S.gold+=win; notifs.push(t('vyigrysh')+bp.stake.multiply+t('stavki')+win+t('zol')); logEvent('gain',t('vyigrysh_2')+bp.stake.multiply+t('stavki_2'),'+'+win+t('zolotyh')); }
      } else if(bp.stake==='lose'){
        notifs.push(t('stavka_proigrana')); logEvent('loss',t('stavka_proigrana_2'),'');
      }
      S.bet_stake=null;
    }
    if(bp.gold){ S.gold+=bp.gold; notifs.push('+ '+bp.gold+t('zolotyh')); logEvent('gain','+ '+bp.gold+t('zolotyh'),t('vyigrysh_vsego')+S.gold); }
    if(bp.items){ bp.items.forEach(it=>{ if(!S.inventory.some(x=>canonItem(x)===canonItem(it))&&getBagUsed()+getItemSize(it)<=getBagSize()){ S.inventory.push(it); notifs.push('+ '+invDisplay(it)); logEvent('gain','+ '+invDisplay(it),t('vyigrysh_3')); } }); }
    if(bp.food){ let f2=0; bp.food.forEach(f=>{ for(let k=0;k<(f.count||1);k++){ const obj={id:f.name,kind:'food',stamina:f.stamina}; if(getBagUsed()+getItemSize(obj)<=getBagSize()){ S.inventory.push(obj); f2++; } } }); if(f2>0){ notifs.push(t('eda')+f2); logEvent('gain',t('eda')+f2,t('vyigrysh_3')); } }
    if(bp.flask_zero){ if((S.flask||0)>0){ S.flask=0; notifs.push(t('flyaga_poteryana')); logEvent('loss',t('flyaga_poteryana_2'),t('proigrana_v_igre')); } }
  }
  if(notifs.length>0){ playSound('item'); showItemNotification(notifs,t('igra_v_kosti')); updateHUD(); saveGame(); }
}

// §1212 stake-any-item picker (group_41). A general inventory-select primitive:
// any paragraph with stake_picker:true lists each bag item with a wager button.
// Picking an item records an item stake (S.bet_stake), removes it from the bag,
// and routes to the item-dice router (stake_roll_target, default §910). The
// paragraph's own non-roll choices (stake money / leave) render underneath.
function renderStakePicker(sec){
  const list=document.getElementById('c-list'); if(!list) return;
  list.innerHTML='';
  const items=(S&&S.inventory)?S.inventory:[];
  const rollTarget=sec.stake_roll_target||910;
  const hint=document.createElement('div');
  hint.style.cssText='font-size:14px;color:var(--gold);margin:4px 0 8px;letter-spacing:.06em;';
  hint.textContent=items.length>0?t('vyberite_vesch_dlya_stavki'):t('v_meshke_net_veschey_dlya_stavki');
  list.appendChild(hint);
  items.forEach(item=>{
    const b=document.createElement('button'); b.className='choice-btn';
    b.style.borderColor='var(--gold)';b.style.color='var(--gold)';b.style.background='rgba(212,175,55,.10)';
    b.textContent=t('postavit')+invDisplay(item);
    b.onclick=()=>{
      S.bet_stake={kind:'item',name:item};
      const idx=S.inventory.findIndex(it=>canonItem(it)===canonItem(item));
      if(idx>=0) S.inventory.splice(idx,1);
      logEvent('loss',t('stavka_2')+invDisplay(item),t('na_konu'));
      updateHUD();saveGame();
      goTo(rollTarget);
    };
    list.appendChild(b);
  });
  (sec.choices||[]).forEach((ch,idx)=>{
    if(ch.target===rollTarget) return; // the roll path is the picker's job
    if(!passesInventoryCheck(ch)||!passesGoldCheck(ch)) return;
    list.appendChild(makeChoiceBtn(ch,false,idx));
  });
}

function renderChoices(sec){
  const list=document.getElementById('c-list');list.innerHTML='';
  // group_81 B-07: a resolved luck roll is persisted (S.luckChecks) so an F5 before
  // choosing cannot reroll it - restore it into the runtime maps before the branches.
  if(sec.has_luck&&!luckDone[S.section]&&S.luckChecks&&S.luckChecks[String(S.section)]&&!S.luckChecks[String(S.section)].scripted){ luckDone[S.section]=true; luckResult[S.section]=S.luckChecks[String(S.section)].lucky?'lucky':'unlucky'; }
  const hasPendingCombat=sec.enemies&&sec.enemies.length>0&&!combatDone[S.section];
  const combatWon=sec.enemies&&sec.enemies.length>0&&combatDone[S.section];
  const hasPendingLuck=sec.has_luck&&!luckDone[S.section];

  if(hasPendingCombat){
    if(renderCanonCombatChoices(sec,list)) return;
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';
    btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML=t('vstupit_v_boy');
    btn.onclick=()=>startCombat(sec.enemies,sec);list.appendChild(btn);
    // Show pre-combat choices but NOT post-combat, luck-result, or combat conditions
    sec.choices.forEach((ch,idx)=>{
      if(!ch.post_combat && !ch.luck_type && !ch.combat_condition && passesInventoryCheck(ch) && passesGoldCheck(ch)){
        list.appendChild(makeChoiceBtn(ch, true, idx));
      }
    });
    return;
  }

  if(combatWon){
    // After winning: show post-combat + non-spell, hide spell/luck/combat-condition
    sec.choices.forEach((ch,idx)=>{
      if(!ch.spell_choice && !ch.luck_type && (!ch.combat_condition || (S.combatCondMet&&S.combatCondMet[S.section])) && passesInventoryCheck(ch) && passesGoldCheck(ch)){
        list.appendChild(makeChoiceBtn(ch, false, idx));
      }
    });
    return;
  }

  if(hasPendingLuck){
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--green)';btn.style.color='var(--green2)';
    btn.style.background='rgba(40,180,100,.12)';
    btn.innerHTML=t('proverit_udachu');
    btn.onclick=()=>startLuckCheck(sec);list.appendChild(btn);
    // Show only true pre-luck alternatives; keep some choices hidden until unlucky combat starts.
    sec.choices.forEach((ch,idx)=>{
      if(!ch.luck_type && !ch.post_combat && !ch.only_after_unlucky && passesInventoryCheck(ch) && passesGoldCheck(ch)){
        list.appendChild(makeChoiceBtn(ch, false, idx));
      }
    });
    return;
  }

  const lr=luckResult[S.section];
  // group_80 R-01: keep the ORIGINAL sec.choices index through the luck
  // filters - makePurchaseBtn/makeBatchBtn key one-shot state (shopBought,
  // batchPicked) by that index. A lost index serialized as [null] /
  // ':undefined' and broke once-only semantics across reload.
  const withIdx=sec.choices.map((ch,idx)=>({ch,idx}));
  const luckyChoices=withIdx.filter(e=>e.ch.luck_type==='lucky' && passesInventoryCheck(e.ch) && passesGoldCheck(e.ch));
  const unluckyChoices=withIdx.filter(e=>e.ch.luck_type==='unlucky' && passesInventoryCheck(e.ch) && passesGoldCheck(e.ch));
  const nonLuckChoices=withIdx.filter(e=>!e.ch.luck_type && passesInventoryCheck(e.ch) && passesGoldCheck(e.ch));

  if(lr==='lucky' && luckyChoices.length){
    luckyChoices.forEach(e=>list.appendChild(makeChoiceBtn(e.ch,false,e.idx)));
    return;
  }

  if(lr==='unlucky'){
    if(unluckyChoices.length){
      unluckyChoices.forEach(e=>list.appendChild(makeChoiceBtn(e.ch,false,e.idx)));
      return;
    }
    if(nonLuckChoices.length){
      nonLuckChoices.forEach(e=>list.appendChild(makeChoiceBtn(e.ch,false,e.idx)));
      return;
    }
    // Fatal-unlucky: paragraph has only lucky-tagged choices and the player
    // failed the luck roll. With no unlucky branch and no non-luck fallback,
    // c-list would otherwise stay empty and the UI would hang on a screen
    // with no actionable buttons. Affects §203 (drowning), §289 (falling
    // tree), §377 (broken back), and any other paragraph where a failed
    // luck roll is canonically fatal but only the lucky escape was encoded
    // as a choice. Route directly to the death overlay (which exists from
    // commit ca50bbd and renders the full paragraph text plus illustration
    // if MJ_MAP has one for this section).
    showDeathOverlay({sec:sec, secKey:String(S.section)});
    return;
  }

  nonLuckChoices.forEach(e=>list.appendChild(makeChoiceBtn(e.ch,false,e.idx)));
}

function goTo(id){
  if(!S)return;S.section=id;
  combatDone={};luckDone={};luckResult={};sectionPrepState={};
  S.luckChecks={}; // group_81 B-07: a persisted luck roll belongs to the paragraph being left
  renderGame();
}


// ── Combat ──
let combatDone={};
let combatState=null;

function startCombat(enemies,sec){
  clearCombatExtraButtons();
  logEvent('combat',t('boy_nachalsya'),t('vragi')+enemies.map(e=>enemyName(e.name)).join(', '));
  const pMod=sec.player_attack_mod||0;
  const script=sec.combat_script||null;
  // R2-3: a pre-cast "buff bridge" may have queued a whole-fight modifier in
  // S.pending_combat_buff (the spell charge was already spent at the SOURCE
  // cast). Consume it here, one-shot, and fold it into the initial state:
  //   FORCE         -> player +2 (via forceBuff, identical to the modal cast)
  //   PLAYER_MINUS2 -> Weakness reflected back onto the player (§39 backfire)
  //   ENEMY_PLUS2   -> Force reflected onto the enemy (§865 Green Knight)
  const pendingBuff=(S&&S.pending_combat_buff)||null;
  if(S)S.pending_combat_buff=null;
  const pModInit=pMod+(pendingBuff==='PLAYER_MINUS2'?-2:0);
  combatState={
    enemies:enemies.map((e,idx)=>({...e,name:enemyName(e.name),hp:e.stamina,dmg:e.damage||2,active:!(((script==='sec1175_canon_orcs'||script==='sec131_eagle_joins') && idx>0) || e.joins!==undefined),fled:false})),
    round:0,
    wounds:0,
    sec:sec,
    playerMod:pModInit,
    forceBuff:(pendingBuff==='FORCE'),  // group_19 FORCE whole-combat +2; R2-3 may pre-set via bridge
    weaknessDebuff:false,  // group_19: WEAKNESS spell active for whole combat (-2 enemy attack)
    enemyAttackMod:(pendingBuff==='ENEMY_PLUS2'?2:0),  // R2-3 §865 Force-backfire: enemy +2 whole combat
    pendingWeakPick:(pendingBuff==='ENEMY_WEAK_PICK'),  // G-06: targeted -2, lands on the selected enemy at round 1
    special:script==='sec1175_canon_orcs'?{type:'sec1175',reinforcementsJoined:false,firstDeathHandled:false,luckChecked:false}:(script==='sec131_eagle_joins'?{type:'sec131',reinforcementsJoined:false}:null)
  };
  const ce=document.getElementById('combat-enemies');ce.innerHTML='';
  combatState.enemies.forEach(e=>{
    const dmgNote=e.dmg!==2?` <span style="color:var(--red2);font-size:14px;">${t('uron')}${e.dmg})</span>`:'';
    const hpWidth=Math.max(0, Math.min(100, (e.hp/e.stamina)*100));
    ce.innerHTML+=`<div class="combat-enemy">
      <div class="combat-enemy-head">
        <div>
          <div class="combat-enemy-name">${e.name}</div>
          <div class="combat-status-line"><span class="ce-status ce-status-pill state-active">${t('v_boyu')}</span></div>
        </div>
        <div class="combat-enemy-icon">☠</div>
      </div>
      <div class="combat-stats">
        <div class="combat-stat-pill">${t('masterstvo')}<b>${e.skill}</b></div>
        <div class="combat-stat-pill">${t('vynoslivost')}<b><span class="ce-hp">${e.hp}</span>/${e.stamina}</b>${dmgNote}</div>
      </div>
      <div class="combat-hp-wrap">
        <div class="combat-hp-head"><span>${t('sostoyanie')}</span><span class="ce-hp-head">${e.hp}/${e.stamina}</span></div>
        <div class="combat-hp-track"><div class="combat-hp-fill" style="width:${hpWidth}%"></div></div>
      </div>
    </div>`;
  });
  document.getElementById('combat-log').innerHTML=''; if(window._bcCombatStatusReset)window._bcCombatStatusReset();
  if(pModInit!==0){
    document.getElementById('combat-log').innerHTML=`<div style="color:var(--gold);margin-bottom:8px;">${t('modifikator_sily_udara')}${pModInit>0?'+':''}${pModInit}</div>`;
  }
  if(combatState.forceBuff){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--gold);margin-bottom:8px;">${t('zaklyatie_sily_deystvuet_sila_ud')}</div>`;
  }
  if(combatState.enemyAttackMod){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--red2);margin-bottom:8px;">${t('zaklyatie_obratilos_protiv_vas_s')}${combatState.enemyAttackMod}${t('do_konca_boya')}</div>`;
  }
  if(script==='sec1175_canon_orcs'){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--gold);margin-bottom:8px;">${t('snachala_vy_srazhaetes_tolko_s_p')}</div>`;
  }
  if(script==='sec131_eagle_joins'){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--gold);margin-bottom:8px;">${t('snachala_vy_srazhaetes_tolko_s_g')}</div>`;
  }
  document.getElementById('btn-combat-round').style.display='inline-block';
  document.getElementById('btn-combat-round').textContent=t('udar');
  document.getElementById('btn-combat-round').onclick=combatRound;
  // group_19: per-paragraph allowlist controls which spell buttons appear.
  // If sec.combat_spells_allowed is set, only listed spell IDs get buttons.
  // If absent (default), all three combat spells (COPY/FORCE/WEAKNESS) are
  // available subject to spell-budget availability.
  const allowedSpells=sec.combat_spells_allowed||['COPY','FORCE','WEAKNESS'];
  const copyBtn=document.getElementById('btn-copy-spell');
  const copyRemaining=getSpellRemaining('COPY');
  if(copyBtn){
    if(allowedSpells.includes('COPY')&&copyRemaining>0){
      copyBtn.style.display='inline-block';
      copyBtn.textContent=t('zaklyatie_kopii')+copyRemaining+']';
    } else {
      copyBtn.style.display='none';
    }
  }
  // Combat-summon ally buttons (item-triggered; group: combat_summon). One button PER
  // available summon the player holds and can use here, so holding BOTH the bell and the
  // amulet outside the castle lets the player choose which once-per-journey ally to spend.
  // Reset the per-fight guard each time combat starts; opt-out via sec.summon_allowed===false
  // (e.g. scripted fights where Copy is also barred). Bell works anywhere; amulet only outside.
  combatState.allyUsedThisFight=false;
  const allyBtnIds=['btn-summon-ally','btn-summon-ally2'];
  allyBtnIds.forEach(id=>{const b=document.getElementById(id); if(b) b.style.display='none';});
  if(sec.summon_allowed!==false){
    let slot=0;
    for(const key in COMBAT_ALLIES){
      if(slot>=allyBtnIds.length) break;
      if(!summonAllyAvailable(key)) continue;
      const b=document.getElementById(allyBtnIds[slot]);
      if(b){
        const a=COMBAT_ALLIES[key];
        b.style.display='inline-block';
        b.textContent=`${a.icon}${t('pozvat')}${allyText(key).name}`;
        b.onclick=()=>useAllyInCombat(key);
        slot++;
      }
    }
  }
  const forceBtn=document.getElementById('btn-force-spell');
  const forceRemaining=getSpellRemaining('FORCE');
  if(forceBtn){
    if(combatState.forceBuff){
      forceBtn.style.display='none';  // R2-3: Force already pre-cast via a bridge — no re-cast
    } else if(allowedSpells.includes('FORCE')&&forceRemaining>0){
      forceBtn.style.display='inline-block';
      forceBtn.textContent=t('zaklyatie_sily')+forceRemaining+']';
    } else {
      forceBtn.style.display='none';
    }
  }
  const weakBtn=document.getElementById('btn-weakness-spell');
  const weakRemaining=getSpellRemaining('WEAKNESS');
  if(weakBtn){
    if(allowedSpells.includes('WEAKNESS')&&weakRemaining>0){
      weakBtn.style.display='inline-block';
      weakBtn.textContent=t('zaklyatie_slabosti')+weakRemaining+']';
    } else {
      weakBtn.style.display='none';
    }
  }
  const larvaBtn=document.getElementById('btn-larva');
  if(larvaBtn){
    const larvaCount=(S&&S.inventory?S.inventory.filter(it=>canonItem(it)==='spider_larva').length:0);
    if(larvaCount>0){larvaBtn.style.display='inline-block';larvaBtn.textContent=t('razlomit_lichinku')+larvaCount+']';}
    else larvaBtn.style.display='none';
  }
  // §950: HEALING usable in combat where canon permits (self-cast, invisible).
  // Shown whenever the allowlist includes HEALING and a charge remains; the
  // handler caps at staminaMax. The HUD heal button stays hidden (overlay).
  const healSpellBtn=document.getElementById('btn-heal-spell');
  const healSpellRemaining=getSpellRemaining('HEALING');
  if(healSpellBtn){
    if(allowedSpells.includes('HEALING')&&healSpellRemaining>0){
      healSpellBtn.style.display='inline-block';
      healSpellBtn.textContent=t('zaklyatie_isceleniya_8')+healSpellRemaining+']';
    } else {
      healSpellBtn.style.display='none';
    }
  }
  if(S&&S.inventory&&S.inventory.some(it=>canonItem(it)==='death_of_orcs')){
    const orkIdx=enemies.findIndex((e,i2)=>/ork/.test(e.name)&&combatState.enemies[i2].active!==false&&combatState.enemies[i2].hp>0);
    if(orkIdx>=0){
      const victim=combatState.enemies[orkIdx];
      victim.hp=0;
      const log=document.getElementById('combat-log');
      if(log)log.innerHTML+=`<div style="color:var(--gold);font-weight:bold">${t('mech_smert_orkov_srabatyvaet')}${victim.name}${t('padaet_zamertvo')}</div>`;
      dragonKillTick();
      activateStagedJoins(combatState);
      updateCombatConditionButtons(combatState);
      if(combatResolved(combatState)){
        updateCombatEnemyDisplay(combatState);
        document.getElementById('modal-combat').classList.add('on');
        endCombat(true);
        return;
      }
    }
  }
  updateCombatEnemyDisplay(combatState);
  document.getElementById('modal-combat').classList.add('on');
}

function playerEquipMod(){
  let m=0;
  if(S&&S.inventory){
    if(S.inventory.some(it=>canonItem(it)==='whole_sword'))m+=1;
    if(S.inventory.some(it=>canonItem(it)==='knight_shield'))m+=1;
  }
  if(S&&S.dragonKillsLeft>0)m+=5;
  return m;
}

function dragonKillTick(){
  if(!S||!(S.dragonKillsLeft>0))return;
  S.dragonKillsLeft--;
  if(S.dragonKillsLeft===0){
    const log=document.getElementById('combat-log');
    if(log)log.innerHTML+=`<div style="color:var(--muted)">${t('zele_poteryalo_silu')}</div>`;
    showItemNotification([t('zele_poteryalo_silu')]);
  }
  updateHUD();
}

function updateCombatConditionButtons(cs){
  const old=document.getElementById('combat-condition-btn');
  if(old)old.remove();
  if(!cs||!combatState||cs!==combatState)return;
  if(combatResolved(cs))return;
  if(!cs.sec||!cs.sec.choices)return;
  const log=document.getElementById('combat-log');
  cs.sec.choices.forEach(ch=>{
    if(ch.combat_condition&&combatCondMet(ch.combat_condition,cs)){
      if(document.getElementById('combat-condition-btn'))return;
      const btn=document.createElement('button');btn.id='combat-condition-btn';
      btn.className='btn btn-g';btn.style.cssText='margin-top:10px;font-size:17px;';
      btn.textContent='✦ '+ch.label;
      const _bsec=S.section,_bcs=cs;
      btn.onclick=()=>{
        if(S.section!==_bsec||combatState!==_bcs)return;
        if(ch.flee){S.stamina=Math.max(0,S.stamina-2);updateHUD();saveGame();showItemNotification([t('2_vynoslivosti_begstvo_iz_boya')]);}
        document.getElementById('modal-combat').classList.remove('on');
        combatDone[S.section]=true;
        goTo(ch.target);
      };
      document.getElementById('btn-combat-round').parentElement.appendChild(btn);
      if(!cs.condMsgShown)cs.condMsgShown={};
      const _condMsgKey=(ch.combat_condition==='wound_2')?'vy_ranili_vraga_dvazhdy_mozhete':(ch.combat_condition==='enemy_defeated_1'?'vy_srazili_odnogo_protivnika':null);
      if(_condMsgKey&&!cs.condMsgShown[ch.combat_condition]&&log){cs.condMsgShown[ch.combat_condition]=true;log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">${t(_condMsgKey)}${ch.target}.</div>`;}
    }
  });
}

function combatRound(){
  if(!combatState)return;
  clearCombatExtraButtons();
  const cs=combatState;cs.round++;
  const log=document.getElementById('combat-log');

  const _dl=GD[S.section]&&GD[S.section].round_deadline;
  if(_dl && cs.round>_dl.rounds && getAliveCombatEnemies(cs).length>0){
    if(_dl.lose==='death'){
      log.innerHTML+=`<div style="color:var(--red2);font-weight:bold;margin-top:8px">${t('vremya_vyshlo_boy_zatyanulsya')}</div>`;
      endCombat(false);
      return;
    }
    endCombatRouted(_dl.lose,'vremya_vyshlo_boy_zatyanulsya');
    return;
  }

  if(cs.special&&cs.special.type==='sec1175'){
    const first=cs.enemies[0];
    if(cs.round===4 && first.hp>0 && !cs.special.reinforcementsJoined){
      cs.enemies[1].active=true;
      cs.enemies[2].active=true;
      cs.special.reinforcementsJoined=true;
      log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">${t('cherez_tri_raunda_dva_ostalnyh_o')}</div>`;
      updateCombatEnemyDisplay(cs);
    }
  }

  if(cs.special&&cs.special.type==='sec131'){
    const first=cs.enemies[0];
    if(cs.round===5 && first.hp>0 && !cs.special.reinforcementsJoined){
      cs.enemies[1].active=true;
      cs.special.reinforcementsJoined=true;
      log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">${t('orel_chasovoy_vyletaet_iz_nishi')}</div>`;
      updateCombatEnemyDisplay(cs);
    }
  }

  activateStagedJoins(cs);
  const alive=getAliveCombatEnemies(cs);
  if(alive.length===0){
    if(combatResolved(cs)){endCombat(true);}
    else{
      log.innerHTML+=`<div style="color:var(--muted);margin-top:6px">${t('protivniki_vyzhidayut')}</div>`;
      updateCombatEnemyDisplay(cs);
    }
    return;
  }
  // group_19: FORCE spell adds +2 to player attack for whole combat duration.
  // playerMod already accumulates external modifiers from sec.player_attack_mod
  // (e.g. fatigue penalties from §1154/§1182); FORCE stacks additively.
  const pMod=(cs.playerMod||0)+(cs.forceBuff?2:0)+playerEquipMod();
  const pd=d6()+d6();const pStr=pd+S.skill+pMod;
  log.innerHTML+=`<div>${t('raund')}${cs.round} —</div>`;
  if(pMod!==0){
    log.innerHTML+=`<div>${t('vy_2k6')}${pd}) + ${S.skill} ${pMod>0?'+':''}${pMod} = <b>${pStr}</b></div>`;
  } else {
    log.innerHTML+=`<div>${t('vy_2k6')}${pd}) + ${S.skill} = <b>${pStr}</b></div>`;
  }

  const tgtEnemy=getCombatTarget(cs);
  if(alive.length>1&&tgtEnemy){log.innerHTML+=`<div style="color:var(--gold);opacity:.85">${t('cel_boya')}${tgtEnemy.name}</div>`;}
  if(cs.pendingWeakPick){
    const wp=(cs.weakPickIdx!==undefined&&cs.enemies[cs.weakPickIdx]&&cs.enemies[cs.weakPickIdx].hp>0&&!cs.enemies[cs.weakPickIdx].fled)?cs.enemies[cs.weakPickIdx]:tgtEnemy;
    if(wp){
      wp.weakDebuff=-2;cs.pendingWeakPick=false;
      log.innerHTML+=`<div style="color:var(--gold);font-weight:bold">${t('zaklyatie_slabosti_cel')}${wp.name} (−2)</div>`;
      updateCombatEnemyDisplay(cs);
    }
  }
  // group_19: WEAKNESS spell subtracts 2 from each enemy's attack for whole combat.
  const enemyMod=(cs.weaknessDebuff?-2:0)+(cs.enemyAttackMod||0);
  alive.forEach((e,i)=>{
    const perMod=enemyMod+(e.weakDebuff||0);
    const ed=d6()+d6();const eStr=ed+e.skill+perMod;
    if(perMod!==0){
      log.innerHTML+=`<div>${e.name}${t('2k6')}${ed}) + ${e.skill} ${perMod>0?'+':''}${perMod} = <b>${eStr}</b></div>`;
    } else {
      log.innerHTML+=`<div>${e.name}${t('2k6')}${ed}) + ${e.skill} = <b>${eStr}</b></div>`;
    }
    if(e===tgtEnemy){
      if(pStr>eStr){playSound('hit');e.hp-=2;cs.wounds++;log.innerHTML+=`<div class="hit">${t('vy_ranili')}${e.name}${t('2_vyn_ostalos')}${Math.max(0,e.hp)})</div>`;if(e.hp<=0)dragonKillTick();}
      else if(eStr>pStr){playSound('hurt');const d=e.dmg||2;S.stamina-=d;log.innerHTML+=`<div class="miss">→ ${e.name}${t('ranil_vas')}${d}${t('vyn_ostalos')}${Math.max(0,S.stamina)})</div>`;}
      else{log.innerHTML+=`<div class="draw">${t('nichya_s')}${e.name}</div>`;}
    } else {
      if(eStr>pStr){playSound('hurt');const d=e.dmg||2;S.stamina-=d;log.innerHTML+=`<div class="miss">→ ${e.name}${t('tozhe_ranil_vas')}${d}${t('vyn_ostalos')}${Math.max(0,S.stamina)})</div>`;}
      else{log.innerHTML+=`<div class="draw">→ ${e.name}${t('ne_smog_vas_ranit')}</div>`;}
    }
  });

  updateHUD();
  updateCombatEnemyDisplay(cs);
  log.scrollTop=log.scrollHeight;

  if(S.stamina<=0){endCombat(false);return;}

  if(cs.special&&cs.special.type==='sec131'){
    const first=cs.enemies[0];
    if(first.hp<=0 && !cs.special.reinforcementsJoined){
      cs.enemies[1].active=true;
      cs.special.reinforcementsJoined=true;
      log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">${t('orel_chasovoy_vyletaet_iz_nishi')}</div>`;
      updateCombatEnemyDisplay(cs);
    }
  }

  if(cs.special&&cs.special.type==='sec1175'){
    const first=cs.enemies[0];
    if(first.hp<=0 && !cs.special.firstDeathHandled){
      cs.special.firstDeathHandled=true;
      if(!cs.special.reinforcementsJoined){
        cs.enemies[1].active=true;
        cs.enemies[2].active=true;
        cs.special.reinforcementsJoined=true;
        log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">${t('pervyy_ork_poverzhen_teper_vam_p')}</div>`;
        updateCombatEnemyDisplay(cs);
      }
      if(!cs.special.luckChecked && cs.enemies[2].hp>0 && !cs.enemies[2].fled){
        promptCanon1175Luck();
        return;
      }
    }
  }

  activateStagedJoins(cs);
  if(getAliveCombatEnemies(cs).length===0){
    if(combatResolved(cs)){endCombat(true);return;}
    log.innerHTML+=`<div style="color:var(--muted);margin-top:6px">${t('protivniki_vyzhidayut')}</div>`;
    updateCombatEnemyDisplay(cs);
    updateCombatConditionButtons(cs);
    return;
  }

  updateCombatConditionButtons(cs);
}

function endCombat(won){
  combatDone[S.section]=true;
  clearCombatExtraButtons();
  const log=document.getElementById('combat-log');
  const copyBtn=document.getElementById('btn-copy-spell');
  if(copyBtn)copyBtn.style.display='none';
  const allyBtn=document.getElementById('btn-summon-ally');
  if(allyBtn)allyBtn.style.display='none';
  const allyBtn2=document.getElementById('btn-summon-ally2');
  if(allyBtn2)allyBtn2.style.display='none';
  const forceBtn=document.getElementById('btn-force-spell');
  if(forceBtn)forceBtn.style.display='none';
  const weakBtn=document.getElementById('btn-weakness-spell');
  if(weakBtn)weakBtn.style.display='none';
  const larvaBtnEnd=document.getElementById('btn-larva');
  if(larvaBtnEnd)larvaBtnEnd.style.display='none';
  if(won){
    playSound('victory');
    const _csec=GD[S.section];
    if(_csec&&_csec.choices&&combatState){
      _csec.choices.forEach(ch=>{
        if(ch.combat_condition&&!ch.flee){
          S.combatCondMet=S.combatCondMet||{};S.combatCondMet[S.section]=true;
        }
      });
    }
    logEvent('combat',t('pobeda_v_boyu'),t('raundov')+(combatState?combatState.round:0));
    log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">${t('pobeda')}</div>`;
    document.getElementById('btn-combat-round').style.display='inline-block';
    document.getElementById('btn-combat-round').textContent=t('prodolzhit');
    const _dl=GD[S.section]&&GD[S.section].round_deadline;
    if(_dl){
      const met=combatState&&combatState.round<=_dl.rounds;
      const tgt=met?_dl.win:_dl.lose;
      log.innerHTML+=`<div style="color:${met?'var(--gold)':'var(--red2)'};margin-top:4px">${t(met?'vy_ulozhilis_v_otvedennye_raund':'vremya_vyshlo_boy_zatyanulsya')}</div>`;
      document.getElementById('btn-combat-round').onclick=()=>{
        document.getElementById('modal-combat').classList.remove('on');
        if(tgt==='death'){ showDeathOverlay(); } else { goTo(tgt); }
      };
    } else {
      document.getElementById('btn-combat-round').onclick=()=>{
        document.getElementById('modal-combat').classList.remove('on');renderGame();
      };
    }
  }else{
    playSound('death');log.innerHTML+=`<div style="color:var(--red2);font-weight:bold;margin-top:8px">${t('vy_pogibli_v_boyu')}</div>`;
    document.getElementById('btn-combat-round').style.display='inline-block';
    document.getElementById('btn-combat-round').textContent=t('konec');
    document.getElementById('btn-combat-round').onclick=()=>{
      document.getElementById('modal-combat').classList.remove('on');
      showDeathOverlay();
    };
  }
}

function activateStagedJoins(cs){
  if(!cs||!cs.enemies)return false;
  let joined=false;
  // group_81 B-03: script-managed reinforcements (sec.131 eagle, sec.1175 orcs 2-3)
  // must also wake after NON-round kills (Copy, larva, ally, Death of Orcs) -
  // otherwise the waiting branch spins forever and the fight can neither be won
  // nor left. combatRound's own blocks stay as idempotent fallbacks; the sec.1175
  // luck prompt is offered immediately here (group_82 CB-01); combatRound's and useCopyInCombat's
  // own sec.1175 blocks stay as idempotent fallbacks.
  if(cs.special&&(cs.special.type==='sec131'||cs.special.type==='sec1175')&&!cs.special.reinforcementsJoined){
    const first=cs.enemies[0];
    if(first&&first.hp<=0){
      for(let i=1;i<cs.enemies.length;i++){ const w=cs.enemies[i]; if(w&&w.hp>0&&!w.fled) w.active=true; }
      cs.special.reinforcementsJoined=true; joined=true;
      const slog=document.getElementById('combat-log');
      if(slog)slog.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">${t(cs.special.type==='sec131'?'orel_chasovoy_vyletaet_iz_nishi':'pervyy_ork_poverzhen_teper_vam_p')}</div>`;
      // group_82 CB-01: sec.1175's luck check is canonically IMMEDIATE («После того, как первый Орк
      // все же будет повержен, если хотите, ПРОВЕРЬТЕ СВОЮ УДАЧУ») - offer it now, not one round later.
      if(cs.special.type==='sec1175'){ cs.special.firstDeathHandled=true; if(!cs.special.luckChecked&&typeof promptCanon1175Luck==='function'){ if(typeof updateCombatEnemyDisplay==='function') updateCombatEnemyDisplay(cs); promptCanon1175Luck(); } }
    }
  }
  const deadCount=cs.enemies.filter(x=>x.hp<=0).length;
  cs.enemies.forEach(e=>{
    if(e.active!==false||e.fled||e.hp<=0||!e.joins)return;
    const j=e.joins;
    const byRound=(j.round!==undefined)&&cs.round>=j.round;
    const byDeath=(j.after_death!==undefined)&&cs.enemies[j.after_death]&&cs.enemies[j.after_death].hp<=0;
    const byCount=(j.after_deaths!==undefined)&&deadCount>=j.after_deaths;
    if(byRound||byDeath||byCount){
      e.active=true;joined=true;
      const log=document.getElementById('combat-log');
      if(log)log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">${t('v_boy_vstupaet')}${e.name}!</div>`;
    }
  });
  if(joined)updateCombatEnemyDisplay(cs);
  return joined;
}

function combatResolved(cs){
  return !!(cs&&cs.enemies&&cs.enemies.length&&cs.enemies.every(e=>e.hp<=0||e.fled));
}

function combatCondMet(cond,cs){
  if(!cs)return false;
  if(cond==='wound_2')return cs.wounds>=2;
  if(cond==='enemy_defeated_1')return cs.enemies.filter(e=>e.hp<=0).length>=1;
  if(cond==='enemy_active_1')return !!(cs.enemies[1]&&cs.enemies[1].active===true&&cs.enemies[1].hp>0&&!cs.enemies[1].fled);
  return false;
}

function endCombatRouted(target,msgKey){
  combatDone[S.section]=true;
  clearCombatExtraButtons();
  const log=document.getElementById('combat-log');
  ['btn-copy-spell','btn-summon-ally','btn-summon-ally2','btn-force-spell','btn-weakness-spell','btn-larva'].forEach(id=>{const b=document.getElementById(id);if(b)b.style.display='none';});
  log.innerHTML+=`<div style="color:var(--red2);font-weight:bold;margin-top:8px">${t(msgKey)}</div>`;
  logEvent('combat',t(msgKey),t('raundov')+(combatState?combatState.round:0));
  const b=document.getElementById('btn-combat-round');
  b.style.display='inline-block';
  b.textContent=t('prodolzhit');
  b.onclick=()=>{ document.getElementById('modal-combat').classList.remove('on'); goTo(target); };
}

function useLarvaInCombat(){
  if(!combatState||!S)return;
  const idx=(S.inventory||[]).findIndex(it=>canonItem(it)==='spider_larva');
  if(idx<0)return;
  const cs=combatState;
  const alive=getAliveCombatEnemies(cs);
  if(alive.length===0)return;
  const target=getCombatTarget(cs)||alive[0];
  S.inventory.splice(idx,1);
  target.hp=0;
  dragonKillTick();
  playSound('combat_death_enemy');
  const log=document.getElementById('combat-log');
  log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">${t('vy_razlamyvaete_lichinku')}${target.name}${t('padaet_zamertvo')}</div>`;
  logEvent('combat',t('vy_razlamyvaete_lichinku')+target.name,t('padaet_zamertvo'));
  updateHUD();updateCombatEnemyDisplay(cs);saveGame();
  const btn=document.getElementById('btn-larva');
  const left=(S.inventory||[]).filter(it=>canonItem(it)==='spider_larva').length;
  if(btn){ if(left>0){btn.textContent=t('razlomit_lichinku')+left+']';} else {btn.style.display='none';} }
  activateStagedJoins(cs);
  if(combatResolved(cs)){ endCombat(true); }
  else { updateCombatConditionButtons(cs); }
}

// ── Copy Spell in Combat ──
function useCopyInCombat(){
  if(!combatState||!S)return;
  const copyRemaining=getSpellRemaining('COPY');
  if(copyRemaining<=0)return;
  const cs=combatState;
  const alive=getAliveCombatEnemies(cs);
  if(alive.length===0)return;
  alive.sort((a,b)=>(b.skill*b.hp)-(a.skill*a.hp));
  const target=alive[0];
  useSpell('COPY');
  const log=document.getElementById('combat-log');
  log.innerHTML+=`<div style="color:#999;font-weight:bold;margin-top:8px">${t('zaklyatie_kopii_na')}${target.name}!</div>`;
  log.innerHTML+=`<div style="color:#999;font-size:14px;">${t('kopiya_masterstvo')}${target.skill}${t('vynoslivost_2')}${target.hp}</div>`;
  let copyHp=target.hp;
  let enemyHp=target.hp;
  let round=0;
  while(copyHp>0&&enemyHp>0&&round<50){
    round++;
    const copyAtk=d6()+d6()+target.skill;
    const enemyAtk=d6()+d6()+target.skill;
    if(copyAtk>enemyAtk){enemyHp-=2;}
    else if(enemyAtk>copyAtk){copyHp-=2;}
  }
  if(enemyHp<=0){
    target.hp=0;
    log.innerHTML+=`<div class="hit" style="margin-top:4px">${t('kopiya_pobedila')}${target.name}${t('vrag_poverzhen')}</div>`;
  } else {
    target.hp=Math.max(1,enemyHp);
    log.innerHTML+=`<div class="miss" style="margin-top:4px">👤 ${target.name}${t('pobedil_svoyu_kopiyu_no_oslablen')}${target.hp}).</div>`;
  }
  updateCombatEnemyDisplay(cs);
  const copyBtn=document.getElementById('btn-copy-spell');
  const newRemaining=getSpellRemaining('COPY');
  if(copyBtn){
    if(newRemaining>0&&getAliveCombatEnemies(cs).length>0){
      copyBtn.textContent=t('zaklyatie_kopii')+newRemaining+']';
    } else {
      copyBtn.style.display='none';
    }
  }
  if(cs.special&&cs.special.type==='sec1175'){
    const first=cs.enemies[0];
    if(first.hp<=0 && !cs.special.firstDeathHandled){
      cs.special.firstDeathHandled=true;
      if(!cs.special.reinforcementsJoined){
        cs.enemies[1].active=true;
        cs.enemies[2].active=true;
        cs.special.reinforcementsJoined=true;
        log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">${t('pervyy_ork_poverzhen_teper_vam_p')}</div>`;
        updateCombatEnemyDisplay(cs);
      }
      if(!cs.special.luckChecked && cs.enemies[2].hp>0 && !cs.enemies[2].fled){
        promptCanon1175Luck();
        updateHUD();
        log.scrollTop=log.scrollHeight;
        return;
      }
    }
  }
  activateStagedJoins(cs);
  if(combatResolved(cs)){
    endCombat(true);
  } else {
    if(getAliveCombatEnemies(cs).length===0){
      log.innerHTML+=`<div style="color:var(--muted);margin-top:6px">${t('protivniki_vyzhidayut')}</div>`;
    }
    updateCombatEnemyDisplay(cs);
    updateCombatConditionButtons(cs);
  }
  updateHUD();
  log.scrollTop=log.scrollHeight;
}

// ── Combat summons in combat (item-triggered ally) ──
// Models useCopyInCombat: a self-contained side-fight against the strongest alive enemy,
// but the ally rolls 2d6 + ITS OWN skill and has ITS OWN stamina as HP (Copy borrowed the
// enemy's). Usable once per journey (S.summonsUsed); the item is NOT consumed. The bear-fur
// amulet's ally (Медведица) is powerless inside the Black castle; the bell's (Медведь) works
// anywhere. allyKey is the inventory item name (a key of COMBAT_ALLIES).
function summonAllyAvailable(allyKey){
  if(!combatState||!S) return false;
  const a=COMBAT_ALLIES[allyKey];
  if(!a) return false;
  if(!Array.isArray(S.inventory)||!S.inventory.some(it=>canonItem(it)===allyKey)) return false;
  if(Array.isArray(S.summonsUsed)&&S.summonsUsed.some(k=>canonItem(k)===allyKey)) return false;
  if(combatState.allyUsedThisFight) return false;
  if(a.scope==='outside_castle'&&isInsideCastle(S.section)) return false;
  if(getAliveCombatEnemies(combatState).length===0) return false;
  return true;
}
function useAllyInCombat(allyKey){
  if(!summonAllyAvailable(allyKey)) return;
  const a=COMBAT_ALLIES[allyKey];
  const cs=combatState;
  const alive=getAliveCombatEnemies(cs);
  alive.sort((x,y)=>(y.skill*y.hp)-(x.skill*x.hp));
  const target=alive[0];
  // mark spent immediately (one summon per fight; once per journey) — item stays in the bag
  cs.allyUsedThisFight=true;
  if(!Array.isArray(S.summonsUsed)) S.summonsUsed=[];
  if(!S.summonsUsed.some(k=>canonItem(k)===allyKey)) S.summonsUsed.push(allyKey);
  saveGame(); // group_82 CB-03: the once-per-journey commit must survive an F5 mid-fight (B-08 side-effect rule)
  cs.ally={name:allyText(allyKey).name,skill:a.skill,stamina:a.stamina};
  const log=document.getElementById('combat-log');
  log.innerHTML+=`<div style="color:#b8860b;font-weight:bold;margin-top:8px">${a.icon}${t('vy')}${allyText(allyKey).verb}!</div>`;
  log.innerHTML+=`<div style="color:#b8860b;font-size:14px;">${allyText(allyKey).name}${t('masterstvo_2')}${a.skill}${t('vynoslivost_2')}${a.stamina}${t('betsya_s')}${target.name}.</div>`;
  let allyHp=a.stamina;
  let enemyHp=target.hp;
  let round=0;
  while(allyHp>0&&enemyHp>0&&round<50){
    round++;
    const allyAtk=d6()+d6()+a.skill;
    const enemyAtk=d6()+d6()+target.skill;
    if(allyAtk>enemyAtk){enemyHp-=2;}
    else if(enemyAtk>allyAtk){allyHp-=2;}
  }
  if(enemyHp<=0){
    target.hp=0;
    log.innerHTML+=`<div class="hit" style="margin-top:4px">${a.icon} ${a.name}${t('povergaet')}${target.name}!</div>`;
  } else {
    target.hp=Math.max(1,enemyHp);
    log.innerHTML+=`<div class="miss" style="margin-top:4px">${a.icon} ${target.name}${t('odolel')}${a.name}${t('no_oslablen_vynoslivost')}${target.hp}).</div>`;
  }
  updateCombatEnemyDisplay(cs);
  const allyBtn=document.getElementById('btn-summon-ally');
  if(allyBtn) allyBtn.style.display='none'; // single use per fight
  const allyBtn2=document.getElementById('btn-summon-ally2');
  if(allyBtn2) allyBtn2.style.display='none'; // hide the other summon too (one ally per fight)
  // §1175 milestone re-check (mirror useCopyInCombat)
  if(cs.special&&cs.special.type==='sec1175'){
    const first=cs.enemies[0];
    if(first.hp<=0 && !cs.special.firstDeathHandled){
      cs.special.firstDeathHandled=true;
      if(!cs.special.reinforcementsJoined){
        cs.enemies[1].active=true;
        cs.enemies[2].active=true;
        cs.special.reinforcementsJoined=true;
        log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">${t('pervyy_ork_poverzhen_teper_vam_p')}</div>`;
        updateCombatEnemyDisplay(cs);
      }
      if(!cs.special.luckChecked && cs.enemies[2].hp>0 && !cs.enemies[2].fled){
        promptCanon1175Luck();
        updateHUD();
        log.scrollTop=log.scrollHeight;
        return;
      }
    }
  }
  activateStagedJoins(cs);
  if(combatResolved(cs)){
    endCombat(true);
  } else {
    if(getAliveCombatEnemies(cs).length===0){
      log.innerHTML+=`<div style="color:var(--muted);margin-top:6px">${t('protivniki_vyzhidayut')}</div>`;
    }
    updateCombatEnemyDisplay(cs);
    updateCombatConditionButtons(cs);
  }
  updateHUD();
  log.scrollTop=log.scrollHeight;
}


// ── Force Spell in Combat (group_19) ──
// FORCE adds +2 to player СИЛА УДАРА for the whole combat duration.
// Per canon: "Прибавит вам силу и увеличит вашу СИЛУ УДАРА в бою."
// Persistent buff; one-shot cast (doesn't re-trigger per round).
function useForceInCombat(){
  if(!combatState||!S)return;
  if(combatState.forceBuff)return; // already active, don't double-spend
  const remaining=getSpellRemaining('FORCE');
  if(remaining<=0)return;
  useSpell('FORCE');
  combatState.forceBuff=true;
  const log=document.getElementById('combat-log');
  log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">${t('zaklyatie_sily_sila_udara_2_do_k')}</div>`;
  log.scrollTop=log.scrollHeight;
  // Hide the button — single-cast for this combat
  const forceBtn=document.getElementById('btn-force-spell');
  if(forceBtn)forceBtn.style.display='none';
}

// ── Weakness Spell in Combat (group_19) ──
// WEAKNESS subtracts 2 from each enemy's attack for the whole combat duration.
// Per canon: "Сделает вашего врага неуклюжим и неповоротливым, ослабит
// СИЛУ его УДАРА." Persistent debuff; one-shot cast.
// FB2 canonical phrasing varies between "ослабит СИЛУ УДАРА медведицы"
// (single enemy) and "уменьшите на 2 СИЛУ УДАРА любого из Гоблинов"
// (one of several). Engine applies -2 globally to all active enemies
// because the per-round attack math doesn't track which single enemy
// was targeted; this is slightly more generous than canon for multi-enemy
// fights but matches the spirit of "ослабляет врага в этом бою".
function useWeaknessInCombat(){
  if(!combatState||!S)return;
  if(combatState.weaknessDebuff)return;
  const remaining=getSpellRemaining('WEAKNESS');
  if(remaining<=0)return;
  useSpell('WEAKNESS');
  combatState.weaknessDebuff=true;
  const log=document.getElementById('combat-log');
  log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">${t('zaklyatie_slabosti_ataka_vragov')}</div>`;
  log.scrollTop=log.scrollHeight;
  const weakBtn=document.getElementById('btn-weakness-spell');
  if(weakBtn)weakBtn.style.display='none';
}



// ── Luck Check ──
let luckDone={};
let luckResult={};

function formatLuckPanel(roll1,roll2,roll,needed,lucky,extraHtml){
  return `<div class="luck-panel ${lucky?'success':'fail'}">
    <div class="luck-dice-row">
      <div class="luck-die">${roll1}</div>
      <div class="luck-die">${roll2}</div>
    </div>
    <div class="luck-total">${t('summa_broska')}${roll}</div>
    <div class="luck-target-note">${t('nuzhno_bylo')}${needed}${t('udacha_posle_broska')}${S.luck}</div>
    <div class="${lucky?'luck-success':'luck-fail'}" style="font-size:30px">${lucky?t('udacha_s_vami'):t('udacha_vas_pokinula')}</div>
    ${extraHtml||''}
  </div>`;
}

function startLuckCheck(sec){
  document.getElementById('luck-result').innerHTML='';
  document.getElementById('luck-choices').innerHTML='';
  document.getElementById('luck-info').innerHTML=`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">${t('broste_dva_kubika_esli_rezultat')}${S.luck}${t('vam_povezlo')}<br><span style="font-size:16px;opacity:.7">${t('posle_proverki_udacha_umenshitsy')}</span></p>`;
  document.getElementById('btn-luck-roll').style.display='inline-block';
  document.getElementById('btn-luck-roll').onclick=()=>doLuckCheck(sec);
  document.getElementById('modal-luck').classList.add('on');
}

function doLuckCheck(sec){
  playSound('dice');const roll1=d6(),roll2=d6(),roll=roll1+roll2;
  const lucky=roll<=S.luck;
  S.luck=Math.max(0,S.luck-1);// decrease luck by 1 after each check
  // group_81 B-07: persist the resolved roll before anything renders (written by the saveGame below).
  S.luckChecks=S.luckChecks||{}; S.luckChecks[String(S.section)]={a:roll1,b:roll2,lucky:lucky};
  
  const res=document.getElementById('luck-result');
  const needed=S.luck+1;
  if(lucky){
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,true);
    luckResult[S.section]='lucky';logEvent('luck',t('proverka_udachi')+roll+' ≤ '+needed,t('udachno_udacha_teper')+S.luck);
  }else{
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,false);
    luckResult[S.section]='unlucky';logEvent('luck',t('proverka_udachi')+roll+' > '+needed,t('neudacha_udacha_teper')+S.luck);
  }
  document.getElementById('btn-luck-roll').style.display='none';
  luckDone[S.section]=true;
  updateHUD();saveGame();
  
  // Show ONLY the matching luck choice
  const ch=document.getElementById('luck-choices');
  const lr=luckResult[S.section];
  if(sec&&sec.choices){
    const luckChoices=sec.choices.filter(c=>c.luck_type===lr);
    if(luckChoices.length>0){
      luckChoices.forEach(c=>{
        const btn=document.createElement('button');btn.className='btn btn-s';
        btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
        btn.textContent=c.label;
        btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');goTo(c.target);};
        ch.appendChild(btn);
      });
    } else {
      const hasLucky=sec.choices.some(c=>c.luck_type==='lucky');
      const hasUnlucky=sec.choices.some(c=>c.luck_type==='unlucky');
      // Pure luck-to-death sections often only encode the lucky escape paragraph.
      if(lr==='unlucky' && hasLucky && !hasUnlucky){
        const btn=document.createElement('button');btn.className='btn btn-s';
        btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
        btn.textContent=t('konec_priklyucheniya');
        btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');showDeathOverlay();};
        ch.appendChild(btn);
      } else {
        // No tagged luck choices — close modal and show in main view
        const btn=document.createElement('button');btn.className='btn btn-s';
        btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
        btn.textContent=t('prodolzhit');
        btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');renderGame();};
        ch.appendChild(btn);
      }
    }
  } else {
    const btn=document.createElement('button');btn.className='btn btn-s';
    btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
    btn.textContent=t('prodolzhit');btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');renderGame();};
    ch.appendChild(btn);
  }
}

// ── Atmospheric Scene Background ──
// Earlier versions of this function called https://api.anthropic.com/v1/messages
// to ask a model for an art-direction prompt before painting the background.
// That call could never work from a file:// origin (CORS blocks it) and its
// return value was discarded anyway — setAtmosphericBg(text) was always
// invoked with the local Russian text in both the success and the catch
// branch. Removed to silence the recurring console error and keep the PWA
// fully offline. The atmospheric tint still works — setAtmosphericBg below
// picks a gradient from local keywords (lake / castle / forest / dungeon
// / battle / night / open field / fallback).
let lastImageSection=null;
function generateSceneImage(text){
  if(!text||S.section===lastImageSection)return;
  lastImageSection=S.section;
  setAtmosphericBg((GD[S.section]&&GD[S.section].scene)||'default');
}

const SCENE_GRADIENTS={
  forest:'radial-gradient(ellipse at 40% 60%,#0a1a0a 0%,#061208 40%,#040a06 100%)',
  castle:'radial-gradient(ellipse at 50% 30%,#1a1020 0%,#0a0816 40%,#060410 100%)',
  river:'radial-gradient(ellipse at 50% 70%,#0a1520 0%,#060e18 40%,#040810 100%)',
  combat:'radial-gradient(ellipse at 50% 50%,#1a0a0a 0%,#100608 40%,#0a0406 100%)',
  dungeon:'radial-gradient(ellipse at 50% 50%,#121018 0%,#0a0a12 40%,#06060a 100%)',
  field:'radial-gradient(ellipse at 50% 40%,#1a1a0a 0%,#121208 40%,#0a0a06 100%)',
  night:'radial-gradient(ellipse at 50% 50%,#0a0a14 0%,#060610 40%,#04040a 100%)',
  default:'radial-gradient(ellipse at 50% 50%,#10101a 0%,#0a0a12 40%,#06060a 100%)'
};

function setAtmosphericBg(scene){
  const bg=document.getElementById('scene-bg');
  bg.style.background=SCENE_GRADIENTS[scene]||SCENE_GRADIENTS.default;
  bg.style.opacity='.25';
}

// ── Init ──
window.onload=()=>{
  applyLang(loadSavedLang(),{silent:true});
  initTitle();renderSpellSel();renderAllLangPickers();applyStaticI18n();
  const h=location.hash.substring(1);
  if(h&&parseInt(h)>0&&GD[h]){
    const sv=loadGame();
    if(sv){S=sv;const tgt=parseInt(h);if(S.section!==tgt)S.luckChecks={}; /* group_82 CB-04: a luck record belongs to the paragraph it was rolled on */ S.section=tgt;showScr('game');renderGame();}
    else{S=initState(t('tester'),12,24,12,[{id:'FIRE',remaining:2},{id:'HEALING',remaining:2},{id:'FORCE',remaining:2},{id:'WEAKNESS',remaining:2},{id:'COPY',remaining:1},{id:'SWIMMING',remaining:1}]);S.section=parseInt(h);showScr('game');renderGame();}
  }
};

// ── Sound Effects (real OGG files via <audio>) ──
// Maps semantic event names used throughout game_logic.js to OGG files in
// dist/sounds/{ui,combat,spells,ambience,events}/. The 20 keys below mirror
// dist/sounds/sounds_manifest.json. Earlier versions used Web Audio
// oscillators; that placeholder layer is removed.
//
// Files are referenced via relative paths so they resolve correctly when
// the dist HTML is opened directly via file:// from the dist/ folder.

const SOUND_PATHS={
  ui_click:           'sounds/ui/ui_click.ogg',
  ui_hover:           'sounds/ui/ui_hover.ogg',
  ui_page_turn:       'sounds/ui/ui_page_turn.ogg',
  combat_sword_hit:   'sounds/combat/combat_sword_hit.ogg',
  combat_sword_miss:  'sounds/combat/combat_sword_miss.ogg',
  combat_death_enemy: 'sounds/combat/combat_death_enemy.ogg',
  combat_dice_roll:   'sounds/combat/combat_dice_roll.ogg',
  spell_fire:         'sounds/spells/spell_fire.ogg',
  spell_heal:         'sounds/spells/spell_heal.ogg',
  spell_force:        'sounds/spells/spell_force.ogg',
  spell_illusion:     'sounds/spells/spell_illusion.ogg',
  spell_levitation:   'sounds/spells/spell_levitation.ogg',
  amb_forest:         'sounds/ambience/amb_forest.ogg',
  amb_castle:         'sounds/ambience/amb_castle.ogg',
  amb_dungeon:        'sounds/ambience/amb_dungeon.ogg',
  event_luck_success: 'sounds/events/event_luck_success.ogg',
  event_luck_fail:    'sounds/events/event_luck_fail.ogg',
  event_item_pickup:  'sounds/events/event_item_pickup.ogg',
  event_victory:      'sounds/events/event_victory.ogg',
  event_death:        'sounds/events/event_death.ogg'
};

// Per-key default volume. Tuned conservatively (0.2 — 0.7).
const SOUND_VOLUMES={
  ui_click:0.35, ui_hover:0.20, ui_page_turn:0.50,
  combat_sword_hit:0.65, combat_sword_miss:0.55,
  combat_dice_roll:0.55, combat_death_enemy:0.65,
  spell_fire:0.55, spell_heal:0.55, spell_force:0.55,
  spell_illusion:0.55, spell_levitation:0.55,
  event_victory:0.65, event_death:0.65,
  event_item_pickup:0.50,
  event_luck_success:0.50, event_luck_fail:0.50
};

// Pre-create one Audio template per key. cloneNode() is used per-play so
// overlapping triggers don’t cut each other off.
const SOUNDS={};
(function preloadSounds(){
  for(const k in SOUND_PATHS){
    try{
      const a=new Audio(SOUND_PATHS[k]);
      a.preload='auto';
      SOUNDS[k]=a;
    }catch(e){}
  }
})();

// Legacy semantic-name → manifest-key map. Preserves all existing call sites
// (playSound('dice'), playSound('hit'), etc.) without touching them.
const SOUND_LEGACY_MAP={
  dice:    'combat_dice_roll',
  hit:     'combat_sword_hit',
  hurt:    'combat_sword_miss',
  victory: 'event_victory',
  death:   'event_death',
  item:    'event_item_pickup'
};

let SOUND_ENABLED=true;
function playSoundKey(key){
  if(!SOUND_ENABLED) return;
  const tmpl=SOUNDS[key];
  if(!tmpl) return;
  try{
    const inst=tmpl.cloneNode();
    inst.volume=(SOUND_VOLUMES[key]!==undefined)?SOUND_VOLUMES[key]:0.5;
    inst.play().catch(()=>{});
  }catch(e){}
}
function playSound(type){
  const key=SOUND_LEGACY_MAP[type];
  if(key) playSoundKey(key);
}

// Web Audio API stub kept for any future code that might still want a live
// AudioContext (e.g. a custom equaliser). Currently unused.
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx=null;
function getAudio(){if(!audioCtx&&AudioCtx)audioCtx=new AudioCtx();return audioCtx;}



// ── Visual & Multimedia Polish V1 ──
const VISUAL_SETTINGS_KEY='blackcastle-visual-v1';
let VISUAL={ambience:false,inlineArt:true};
let ambienceAudio=null;
function loadVisualSettings(){
  try{const raw=localStorage.getItem(VISUAL_SETTINGS_KEY); if(raw) VISUAL=Object.assign(VISUAL, JSON.parse(raw));}catch(e){}
}
function saveVisualSettings(){
  try{localStorage.setItem(VISUAL_SETTINGS_KEY,JSON.stringify(VISUAL));}catch(e){}
}
function ensureVisualDock(){
  if(document.getElementById('visual-dock')) return;
  const dock=document.createElement('div');
  dock.id='visual-dock';dock.className='visual-dock';
  dock.innerHTML=`
    <button class="visual-pill" id="vp-amb" type="button">🌫 <span>${t('atmosfera')}</span></button>
    <button class="visual-pill" id="vp-art" type="button">🖼 <span>${t('illyustracii')}</span></button>`;
  document.body.appendChild(dock);
  document.getElementById('vp-amb').onclick=toggleAmbience;
  document.getElementById('vp-art').onclick=toggleInlineArt;
  syncVisualControls();
}
function syncVisualControls(){
  const amb=document.getElementById('vp-amb');
  const art=document.getElementById('vp-art');
  if(amb){ amb.classList.toggle('on', !!VISUAL.ambience); amb.setAttribute('aria-pressed', VISUAL.ambience?'true':'false'); }
  if(art){ art.classList.toggle('on', !!VISUAL.inlineArt); art.setAttribute('aria-pressed', VISUAL.inlineArt?'true':'false'); }
  document.body.classList.toggle('hide-inline-art', !VISUAL.inlineArt);
}
function toggleInlineArt(){
  VISUAL.inlineArt=!VISUAL.inlineArt; saveVisualSettings(); syncVisualControls();
}
// Looping ambience track. Using amb_dungeon as the default — most of the
// game takes place underground; a future refinement could swap tracks per
// section (forest → castle → dungeon).
function stopAmbience(){
  if(!ambienceAudio) return;
  try{ambienceAudio.pause(); ambienceAudio.currentTime=0;}catch(e){}
  ambienceAudio=null;
}
function startAmbience(){
  try{
    stopAmbience();
    const a=new Audio(SOUND_PATHS.amb_dungeon);
    a.loop=true;
    a.volume=0.22;
    a.play().catch(()=>{});
    ambienceAudio=a;
  }catch(e){}
}
function toggleAmbience(){
  VISUAL.ambience=!VISUAL.ambience; saveVisualSettings();
  if(VISUAL.ambience) startAmbience(); else stopAmbience();
  syncVisualControls();
}
function playUiClick(){ playSoundKey('ui_click'); }
function initVisualPolishV1(){
  loadVisualSettings();
  ensureVisualDock();
  syncVisualControls();
  if(VISUAL.ambience) startAmbience();
  document.addEventListener('click',function(ev){
    const btn=ev.target.closest('.choice-btn, .btn, .visual-pill, .event-log-btn');
    if(btn) playUiClick();
  }, true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) stopAmbience(); else if(VISUAL.ambience) startAmbience();});
}
const __bc_old_onload_vpolish=window.onload;
window.onload=()=>{ if(__bc_old_onload_vpolish) __bc_old_onload_vpolish(); initVisualPolishV1(); };

