// ── Spells ──
const SPELLS=[
  {id:'LEVITATION',icon:'🌬️',name:'Левитация',
   full:'С его помощью вы сможете подняться в воздух и перелететь то препятствие, которое вам встретится. Но будьте осторожны: заклятие действует не слишком долго, и если вы не рассчитаете свои силы, то можете опуститься на землю раньше, чем препятствие или опасность будут позади.'},
  {id:'FIRE',icon:'🔥',name:'Огонь',
   full:'Поможет вам в нужный момент создать в воздухе огненный шар и направить его на врагов. Но в закрытых помещениях им надо пользоваться осмотрительно, чтобы не устроить пожар.'},
  {id:'ILLUSION',icon:'🌀',name:'Иллюзия',
   full:'Вы создадите у вашего врага необходимую иллюзию и сможете спастись в тех ситуациях, из которых другого выхода не будет. Но заклятие иллюзии — опасное колдовство: ведь иллюзия рассеивается, и враг понимает, что его одурачили.'},
  {id:'FORCE',icon:'💪',name:'Сила',
   full:'Прибавит вам силу и увеличит вашу СИЛУ УДАРА в бою.'},
  {id:'WEAKNESS',icon:'🫀',name:'Слабость',
   full:'Сделает вашего врага неуклюжим и неповоротливым, ослабит СИЛУ его УДАРА.'},
  {id:'COPY',icon:'👤',name:'Копия',
   full:'С его помощью вы сможете создать точную Копию вашего противника, которую вы будете контролировать. Ему придётся драться с собственной Копией. Если Копия сразит противника — заклятие теряет силу и Копия исчезает, а вы продолжаете путь.'},
  {id:'HEALING',icon:'💚',name:'Исцеление',
   full:'В любой момент (но не во время сражения) добавит вам 8 ВЫНОСЛИВОСТЕЙ.'},
  {id:'SWIMMING',icon:'🌊',name:'Плавание',
   full:'С помощью этого заклятия вы сможете переплыть любую водную преграду, которая вам встретится. Но будьте внимательны: как только вы ступите на землю, заклятие утратит свою силу.'},
];

// ── Preface Text ──
const PREFACE_TEXT='В самое обыкновенное сказочное королевство приходит беда. В тихом лесу, на его южных границах, появляется хитрый и коварный волшебник Барлад Дэрт, в совершенстве овладевший искусством черной магии. Никто не знает, из каких земель он пришел. Вскоре окрестные жители начинают сторониться леса, который темные колдовские силы сделали таинственным и непроходимым, с множеством беспощадных ловушек и мерзких глубоких болот. Лес наводнили Гоблины и Орки — уродливые и жестокие воины Барлада Дэрта. А в самом центре леса, который теперь называют не иначе как Зачарованный лес, волшебник воздвиг Черный замок, и никому еще не удалось достичь его и безнаказанно вернуться обратно.\n\nНо волшебник не успокаивается на этом. Узнав, что во дворце живет прекрасная Принцесса — единственная дочь Короля — он посылает к ее отцу черных послов, чтобы просить ее руки. Гордый Король отказывает им, послы появляются еще дважды.\n\nКаждый раз они спускаются с неба на могучих крылатых конях, и только Король может без страха смотреть им в глаза, столь большая и грозная сила исходит от них. Но Король непреклонен, хотя и понимает: Барлад Дэрт так просто не отказывается от своих намерений. И вот, когда послы в третий раз покидают дворец, Принцесса исчезает вместе с ними. Заклятие волшебника переносит ее в Черный замок, но она бесстрашно отказывается стать женой чародея, и тот не в силах сдержать свою злобу, погружает ее в волшебный сон.\n\nПо всему королевству герольды созывают смельчаков, обещая награду тому, кто освободит Принцессу. Один за другим покидают они столицу по Главному Южному тракту и исчезают в Зачарованном лесу. Но ни один не возвращается назад: Черный замок умеет беречь свои тайны.\n\nХотите попытаться миновать западни Зачарованного леса, сразиться с беспощадными воинами Барлада Дэрта, проникнуть в Черный замок и разрушить колдовские чары?\n\nЕсли да, то собирайтесь в путь — книга поможет вам перенестись в сказочное королевство…';

const PREGAME_TEXT='Майлин дает еще два совета. Во-первых, сориентироваться на запутанных лесных тропинках и в замке, если вы до него доберетесь, вам поможет карта. Рисуйте ее по мере продвижения. Во-вторых, для многих магических таинств необходимы волшебные предметы. Старайтесь в своем путешествии добыть их как можно больше, при случае они помогут вам, но будьте осторожны: коварство врага не знает границ, возможны любые ловушки.\n\nПосле беседы с астрологом вы вновь предстаете перед Королем. Никто не знает, что вам может понадобиться на пути к успеху, поэтому из дворца вы берете с собой только самое необходимое: меч, флягу, заплечный мешок и 15 золотых.\n\nКороль приказывает проводить вас до начала Зачарованного леса, чтобы в пути вы не испытывали нужды ни в еде, ни в питье. По дороге вы спрашиваете герольда, кто такие Гоблины и Орки, о которых вы много слышали во дворце. Он говорит, что Гоблины — это страшные и отвратительные злые духи ростом примерно с человека, которые верой и правдой служат волшебнику. Их мало кто видел. И совсем уж никто и никогда не видел Орков. Говорят только, что они повыше и посильнее. Но и с теми и с другими лучше не встречаться. В пути вы еще раз обдумываете последний совет Майлина: Барлад Дэрт достаточно могущественный волшебник, чтобы даже малой частицы его мастерства, переданной особо доверенным воинам, хватило не только на то, чтобы противостоять вашим заклятиям, но и наложить на вас свои, не менее быстрые и сильные. Будьте осмотрительны!\n\nНо вот королевским владениям приходит конец. Здесь надо спешиться: лес заколдован и не пустит всадника. Герольд прощается с вами, и вскоре лишь далекий стук копыт напоминает, что вы были не один. Черный, таинственный и неподвижный, Зачарованный лес ждет вас.\n\nЕсли вы готовы к тем неожиданностям, с которыми вам придется встретиться, переверните страницу.';
const SAVE_KEY='podzch_v5';

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
  return{name:n||'Герой',section:1,skill:sk,skillMax:sk,stamina:st,staminaMax:st,
    luck:lu,luckMax:lu,gold:15,flask:2,bagSize:7,
    inventory:[],spells:sp,notes:'',visited:[],startTime:Date.now(),pending_combat_buff:null,v:5};
}

// ── RNG ──
function d6(){const a=new Uint32Array(1);crypto.getRandomValues(a);return(a[0]%6)+1;}

// ── Save/Load ──
function saveGame(){if(!S)return;localStorage.setItem(SAVE_KEY,JSON.stringify(S));}
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
  if(!Array.isArray(s.spells))    s.spells=[];
  if(!Array.isArray(s.visited))   s.visited=[];
  if(typeof s.notes!=='string')   s.notes='';
  if(typeof s.gold!=='number')    s.gold=0;
  if(typeof s.flask!=='number')   s.flask=0;
  if(typeof s.bagSize!=='number'||s.bagSize<7) s.bagSize=7; // §132: 9-slot bag upgrade (default 7)
  if(typeof s.section!=='number') s.section=1;
  // Runtime-only fields added in later sessions.
  if(!Array.isArray(s.eventLog))  s.eventLog=[];
  if(typeof s.shopBought!=='object'||s.shopBought===null||Array.isArray(s.shopBought)) s.shopBought={};
  if(typeof s.riddle_attempts!=='number') s.riddle_attempts=0;
  if(typeof s.sec436_force!=='boolean') s.sec436_force=false; // §436 Force-on-tree round-trip flag
  return s;
}
function loadGame(){try{const r=localStorage.getItem(SAVE_KEY);if(!r)return null;const s=JSON.parse(r);return (s.v===5||s.v===4)?normalizeSave(s):null;}catch{return null;}}
function exportSave(){saveGame();const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='podzch-save.json';a.click();closeModal('overlay-menu');}
function importSave(e){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const s=JSON.parse(t);
  if(s.v!==5&&s.v!==4){alert('Несовместимый формат');return;}
  if(s.v===4){s.v=5;s.luckMax=s.luck;delete s.luckBoxes;}// upgrade v4→v5
  normalizeSave(s);
  S=s;saveGame();showScr('game');renderGame();closeModal('overlay-menu');}catch{alert('Ошибка загрузки');}});e.target.value='';}

// ── Screens ──
function showScr(id){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));document.getElementById('scr-'+id).classList.add('on');const elb=document.getElementById('event-log-btn');if(elb)elb.style.display=(id==='game')?'block':'none';}
function closeModal(id){document.getElementById(id).classList.remove('on');}
function openMenu(){document.getElementById('overlay-menu').classList.add('on');}

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
    document.getElementById('title-rider').innerHTML=`<img src="data:image/jpeg;base64,${TITLE_RIDER}" alt="">`;
  }
  if(typeof TITLE_ART!=='undefined'){
    document.getElementById('title-lettering').innerHTML=`<img src="data:image/png;base64,${TITLE_ART}" alt="Подземелья Чёрного замка">`;
  } else {
    document.getElementById('title-lettering').innerHTML='<div class="t-main">Подземелья<br>Чёрного замка</div>';
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
  document.getElementById('btn-roll-all').textContent='✓ Судьба определена';
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
  const bar=document.getElementById('slots-bar');bar.innerHTML='';const t=totSp(); const chip=document.getElementById('spell-counter-chip'); if(chip) chip.textContent=t+' из '+MAX_SP+' выбрано';
  for(let i=0;i<MAX_SP;i++){const d=document.createElement('div');d.className='slot-pip'+(i<t?' on':'');d.textContent=i<t?'✦':'·';bar.appendChild(d);}
  const grid=document.getElementById('spell-grid');grid.innerHTML='';
  SPELLS.forEach(sp=>{const q=spQty[sp.id];const c=document.createElement('div');
    c.className='sp-card'+(q>0?' sel':'')+(t>=MAX_SP&&q===0?' maxed':'');
    c.style.cssText='display:flex;align-items:flex-start;gap:14px;padding:18px 20px;';
    c.innerHTML=`<div class="sp-icon" style="font-size:32px;min-width:38px;text-align:center;margin-top:2px;">${sp.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="sp-name" style="font-size:21px;margin-bottom:6px;font-weight:500;">${sp.name}</div>
        <div class="sp-desc" style="font-size:17px;color:rgba(232,220,196,.78);line-height:1.55;">${_spellDescHtml(sp.full)}</div>
      </div>
      <div class="sp-qty" style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <button class="qty-btn" data-id="${sp.id}" data-d="-1" style="font-size:20px;width:36px;height:36px;">−</button>
        <span class="qty-num" style="font-size:22px;min-width:30px;text-align:center;">${q}</span>
        <button class="qty-btn" data-id="${sp.id}" data-d="1" style="font-size:20px;width:36px;height:36px;">+</button>
      </div>`;
    grid.appendChild(c);
  });
  grid.querySelectorAll('.qty-btn').forEach(b=>b.onclick=()=>{
    const id=b.dataset.id,delta=parseInt(b.dataset.d);
    if(delta>0&&totSp()>=MAX_SP)return;if(delta<0&&spQty[id]<=0)return;
    spQty[id]+=delta;renderSpellSel();
  });
  // Update start button state
  const startBtn=document.getElementById('btn-start');
  const startBtn2=document.getElementById('btn-start-from-preface');
  if(t===MAX_SP){
    startBtn.disabled=false;startBtn.style.opacity='1';
    if(startBtn2){startBtn2.disabled=false;startBtn2.style.opacity='1';}
  }else{
    startBtn.disabled=true;startBtn.style.opacity='.4';
    if(startBtn2){startBtn2.disabled=true;startBtn2.style.opacity='.4';}
  }
}

function startGame(){
  if(totSp()!==MAX_SP){alert('Выберите ровно 10 заклятий!');return;}
  const name=document.getElementById('hero-name').value.trim()||'Герой';
  if(!diceRolled){cVals.skill=d6()+6;cVals.stamina=d6()+d6()+12;cVals.luck=d6()+6;diceRolled=true;}
  const sp=[];SPELLS.forEach(s=>{if(spQty[s.id]>0)sp.push({id:s.id,remaining:spQty[s.id]});});
  S=initState(name,cVals.skill,cVals.stamina,cVals.luck,sp);saveGame();
  // Show pregame narrative
  document.getElementById('pregame-text').innerHTML=PREGAME_TEXT.split('\n\n').map(p=>'<p style="margin-bottom:16px;">'+p+'</p>').join('');
  showScr('pregame');
}
document.getElementById('btn-start').onclick=startGame;
document.getElementById('btn-start-from-preface').onclick=startGame;
document.getElementById('btn-enter-forest').onclick=()=>{showScr('game');renderGame();};

// Preface
document.getElementById('btn-preface')&&(document.getElementById('btn-preface').onclick=()=>{
  document.getElementById('preface-text').innerHTML=PREFACE_TEXT.split('\n\n').map(p=>'<p style="margin-bottom:16px;">'+p+'</p>').join('');
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
    list.innerHTML='<div style="color:var(--muted);opacity:.5;padding:20px 0;text-align:center;font-size:14px;">Журнал пуст</div>';
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
  if(panel.classList.contains('on'))renderEventLog();
}

function clearEventLog(){
  if(!S)return;
  if(confirm('Очистить журнал?')){S.eventLog=[];saveGame();renderEventLog();}
}

// ── Item Notification ──
function showItemNotification(items, title){
  const el=document.createElement('div');el.className='item-notification';
  el.innerHTML=`<div class="notif-title">${title||'🎒 Мешок'}</div>`+
    items.map(i=>`<div class="notif-item${i.startsWith('−')?' loss':''}">${i}</div>`).join('');
  document.body.appendChild(el);
  setTimeout(()=>{el.style.animation='fadeOut .5s ease-out forwards';
    setTimeout(()=>el.remove(),500);},3000);
}

// ── Inventory Modal (for item pickup with overflow) ──
let pendingItems=[];
function showInventoryModal(newItems, extraNotifs){
  pendingItems=newItems.slice();
  const modal=document.getElementById('modal-inventory');
  const freeSlots=getBagSize()-S.inventory.length;
  
  // Text
  const txt=document.getElementById('inv-modal-text');
  if(freeSlots<newItems.length){
    txt.innerHTML=`Найдено ${newItems.length} предметов, но в мешке только ${freeSlots} свободных мест из ${getBagSize()}.<br>Выберите что взять, или выбросьте ненужное.`;
  } else {
    txt.innerHTML=`Найдено ${newItems.length} предметов. Свободных мест: ${freeSlots}.`;
  }
  
  // Found items — each with "Взять" button
  const found=document.getElementById('inv-modal-found');
  found.innerHTML='<div style="font-size:14px;color:var(--gold);margin-bottom:6px;letter-spacing:.08em;">НАЙДЕНО:</div>';
  newItems.forEach((item,i)=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);';
    row.id='inv-found-'+i;
    row.innerHTML=`<span style="font-size:16px;color:var(--parchment);">${item}</span>
      <button class="btn btn-s" style="font-size:13px;padding:4px 12px;" onclick="takeItem(${i})">+ Взять</button>`;
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
  cur.innerHTML='<div style="font-size:14px;color:var(--gold);margin-bottom:6px;letter-spacing:.08em;">В МЕШКЕ ('+S.inventory.length+'/'+getBagSize()+'):</div>';
  if(S.inventory.length===0){
    cur.innerHTML+='<div style="font-size:14px;color:var(--muted);opacity:.5;">Пусто</div>';
  } else {
    S.inventory.forEach((item,i)=>{
      const row=document.createElement('div');
      row.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);';
      row.innerHTML=`<span style="font-size:15px;color:var(--parchment);">${item}</span>
        <button style="background:none;border:none;color:#c44;cursor:pointer;font-size:14px;padding:2px 6px;" onclick="dropItemModal(${i})" title="Выбросить">🗑</button>`;
      cur.appendChild(row);
    });
  }
  // Update found items buttons
  pendingItems.forEach((item,i)=>{
    const row=document.getElementById('inv-found-'+i);
    if(!row)return;
    const btn=row.querySelector('button');
    if(!btn)return;
    if(S.inventory.includes(item)){
      btn.textContent='✓ В мешке';btn.disabled=true;btn.style.opacity='.4';
    } else if(S.inventory.length>=getBagSize()){
      btn.textContent='Мешок полон';btn.disabled=true;btn.style.opacity='.4';
    } else {
      btn.textContent='+ Взять';btn.disabled=false;btn.style.opacity='1';
    }
  });
}

function takeItem(idx){
  if(!S||S.inventory.length>=getBagSize())return;
  const item=pendingItems[idx];
  if(!item||S.inventory.includes(item))return;
  S.inventory.push(item);
  logEvent('gain','+ '+item,'В мешок');
  playSound('item');
  renderInvModalCurrent();
  updateHUD();saveGame();
}

function dropItemModal(idx){
  if(!S)return;
  const itm=S.inventory[idx];logEvent('loss','− '+itm,'Выброшено из мешка');
  S.inventory.splice(idx,1);
  renderInvModalCurrent();
  updateHUD();saveGame();
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
    txt.textContent='Ваше путешествие окончено. Зачарованный лес поглотил ещё одного смельчака…';
    img.removeAttribute('src');
    img.style.display='none';
  }
  overlay.classList.add('on');
}

// ── Game Rendering ──
function renderGame(){
  if(!S)return;updateHUD();
  const sec=GD[String(S.section)];
  if(!sec){goTo(1);return;}
  document.getElementById('s-num').textContent='§ Параграф '+S.section;
  // Render illustration — priority: Midjourney (color AI art) > legacy b/w scans.
  let illustHtml='';
  const secKey=String(S.section);
  // 1) Midjourney art (preferred — colored, in-style)
  if(typeof MJ_MAP!=='undefined'&&typeof MJ_DATA!=='undefined'){
    const artId=MJ_MAP[secKey];
    if(artId&&MJ_DATA[artId]){
      const meta=(typeof MJ_META!=='undefined')?MJ_META[artId]:null;
      const alt=meta?meta.scene.replace(/"/g,'&quot;'):'Иллюстрация';
      illustHtml=`<div class="illustration-container mj-art" data-art-id="${artId}"><img src="${MJ_DATA[artId]}" onload="this.classList.add('loaded')" alt="${alt}"/></div>`;
    }
  }
  // 2) Fallback: legacy black-and-white scan from the 1991 edition
  if(!illustHtml&&typeof ILLUST_MAP!=='undefined'&&typeof ILLUST_DATA!=='undefined'){
    const imgFile=ILLUST_MAP[secKey];
    if(imgFile&&ILLUST_DATA[imgFile]){
      illustHtml=`<div class="illustration-container legacy-scan"><img src="data:image/jpeg;base64,${ILLUST_DATA[imgFile]}" onload="this.classList.add('loaded')" alt="Иллюстрация"/></div>`;
    }
  }
  document.getElementById('s-text').innerHTML=illustHtml+fmtText(sec.text);
  document.getElementById('s-area').scrollTop=0;
  // Riddle mechanic dispatch: if paragraph has a riddle field, render the
  // text-input widget instead of standard choice buttons. Per group_18 design.
  if(sec.riddle){renderRiddle(sec);}else{renderChoices(sec);}
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
        notifications.push('− весь инвентарь ('+lostCount+')');
        logEvent('loss','− весь инвентарь','Предметов потеряно: '+lostCount);
      }
    }
    if(ai.gold_zero&&S.gold>0){
      const lostGold=S.gold;
      S.gold=0;
      notifications.push('− '+lostGold+' золотых');
      logEvent('loss','− '+lostGold+' золотых','Всего: 0');
    }
    // Gold (always auto-add)
    if(ai.gold&&ai.gold>0){
      S.gold+=ai.gold;
      notifications.push('+ '+ai.gold+' золотых');
      logEvent('gain','+ '+ai.gold+' золотых','Всего: '+S.gold);
    }
    if(ai.gold_sub&&ai.gold_sub>0){
      S.gold=Math.max(0,S.gold-ai.gold_sub);
      notifications.push('− '+ai.gold_sub+' золотых');
      logEvent('loss','− '+ai.gold_sub+' золотых','Всего: '+S.gold);
    }
    // Lose items
    if(ai.lose){
      ai.lose.forEach(item=>{
        const idx=S.inventory.findIndex(i=>i.toLowerCase().includes(item.toLowerCase().substring(0,5)));
        if(idx>=0){
          notifications.push('− '+S.inventory[idx]);
          S.inventory.splice(idx,1);
        }
      });
    }
    // Countable carried-food grant (group_38). Pushes `count` copies of a
    // self-describing food string «name (еда: +stamina)» into the bag,
    // bypassing the auto_items.items dedupe so identical food stacks (e.g.
    // 6 bananas). Bag-capped via getBagSize(); overflow is reported, not
    // forced. Runs before the items-modal so the modal sees the real free
    // space. Used by §75 (6 bananas), §471 (2 bananas+milk+honey), §1109 (6).
    if(ai.food&&ai.food.length>0){
      let added=0,overflow=0;
      ai.food.forEach(f=>{
        const str=f.name+' (еда: +'+f.stamina+')';
        for(let k=0;k<(f.count||1);k++){
          if(S.inventory.length<getBagSize()){S.inventory.push(str);added++;}
          else overflow++;
        }
      });
      if(added>0){
        notifications.push('+ еда ×'+added);
        logEvent('gain','+ еда ×'+added, overflow>0?('мешок полон, не взято: '+overflow):('в мешке: '+S.inventory.length+'/'+getBagSize()));
      }
      if(overflow>0) notifications.push('мешок полон: '+overflow+' не взято');
    }
    // Items — show modal if any found
    if(ai.items&&ai.items.length>0){
      const newItems=ai.items.filter(item=>!S.inventory.includes(item));
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
    if(ai.stamina_add){S.stamina=Math.min(S.staminaMax,S.stamina+ai.stamina_add);statNotifs.push('+ '+ai.stamina_add+' выносливости');logEvent('gain','+ '+ai.stamina_add+' выносливости','Теперь: '+S.stamina+'/'+S.staminaMax);}
    if(ai.stamina_sub){S.stamina=Math.max(0,S.stamina-ai.stamina_sub);statNotifs.push('− '+ai.stamina_sub+' выносливости');logEvent('loss','− '+ai.stamina_sub+' выносливости','Теперь: '+S.stamina+'/'+S.staminaMax);}
    if(ai.skill_add){S.skill=Math.min(S.skillMax,S.skill+ai.skill_add);statNotifs.push('+ '+ai.skill_add+' мастерства');}
    if(ai.skill_sub){S.skill=Math.max(1,S.skill-ai.skill_sub);statNotifs.push('− '+ai.skill_sub+' мастерства');}
    if(ai.luck_add){S.luck=Math.min(S.luckMax,S.luck+ai.luck_add);statNotifs.push('+ '+ai.luck_add+' удачи');}
    if(ai.luck_sub){S.luck=Math.max(0,S.luck-ai.luck_sub);statNotifs.push('− '+ai.luck_sub+' удачи');}
    if(statNotifs.length>0){updateHUD();saveGame();showItemNotification(statNotifs);}
  }
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
  const visibleChoices=sec.choices.filter(ch=>passesInventoryCheck(ch)&&passesGoldCheck(ch));
  if(!inCombatOrLuck&&!hasRiddle&&visibleChoices.length===0&&S.section!==617){
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
  if(luckBar)luckBar.innerHTML=`<div style="font-size:12px;color:var(--muted);opacity:.6;margin-top:2px;">Начальная: ${S.luckMax||S.luck}</div>`;
  // Spells
  const st=document.getElementById('spell-tags');st.innerHTML='';
  if(S.spells)S.spells.forEach(sp=>{if(sp.remaining>0){const def=SPELLS.find(s=>s.id===sp.id);
    if(def)st.innerHTML+=`<div class="spell-tag"><span class="st-icon">${def.icon}</span><span class="st-name">${def.name}</span><span class="st-count">×${sp.remaining}</span></div>`;}});
  // Healing button visibility
  const healBtn=document.getElementById('btn-heal');
  if(healBtn){
    const healRemaining=getSpellRemaining('HEALING');
    const inCombat=document.getElementById('modal-combat').classList.contains('on');
    healBtn.style.display=(healRemaining>0&&!inCombat&&S.stamina<S.staminaMax)?'block':'none';
    healBtn.textContent=`💚 Исцеление +8 вын. [${healRemaining}]`;
  }
  // Inventory
  const il=document.getElementById('inv-list');il.innerHTML='';
  if(S.inventory&&S.inventory.length>0){S.inventory.forEach((item,i)=>{
    const foodM=/\(еда:\s*\+(\d+)\)/.exec(item);
    const eatBtn=foodM?`<span class="inv-eat" onclick="eatFood(${i})" title="Съесть (+${foodM[1]} вын.)" style="color:#3c9;cursor:pointer;font-size:14px;padding:2px 6px;">🍴</span>`:'';
    il.innerHTML+=`<div class="inv-item"><span>${item}</span><span style="display:flex;gap:2px;align-items:center;">${eatBtn}<span class="inv-remove" onclick="removeItem(${i})" title="Выбросить">🗑</span></span></div>`;});}
  else{il.innerHTML='<div class="inv-empty">Мешок пуст</div>';}
  document.getElementById('inv-count').textContent=`(${S.inventory?S.inventory.length:0}/${getBagSize()})`;
  // Notes
  const nta=document.getElementById('notes-ta');if(nta&&S.notes!==undefined)nta.value=S.notes;
}

// §132: bag capacity is stateful (7 default, upgradeable to 9). getBagSize()
// is the single source of truth — every inventory-cap site reads it.
function getBagSize(){return (S&&typeof S.bagSize==='number'&&S.bagSize>0)?S.bagSize:7;}
// §132: eat a carried-food string («Название (еда: +N)») from the bag. Restores
// N ВЫНОСЛИВОСТЬ (capped), removes the item. Refuses at full stamina so the
// provision isn't wasted.
function eatFood(i){
  if(!S||!S.inventory)return;
  const item=S.inventory[i];
  if(!item)return;
  const m=/\(еда:\s*\+(\d+)\)/.exec(item);
  if(!m)return;
  if(S.stamina>=S.staminaMax){showItemNotification(['Выносливость уже полная']);return;}
  const amt=parseInt(m[1],10);
  const before=S.stamina;
  S.stamina=Math.min(S.staminaMax,S.stamina+amt);
  const actual=S.stamina-before;
  const clean=item.replace(/\s*\(еда:.*?\)/,'');
  S.inventory.splice(i,1);
  logEvent('gain','🍴 Съедено: '+clean,'+'+actual+' выносливости');
  playSound('item');
  showItemNotification(['🍴 '+clean+': +'+actual+' вын.']);
  updateHUD();saveGame();
}
function useFlask(){if(!S||S.flask<=0)return;S.flask--;S.stamina=Math.min(S.staminaMax,S.stamina+2);logEvent('gain','🥤 Глоток из фляги','+2 выносливости (осталось глотков: '+S.flask+')');updateHUD();saveGame();}
function useHealing(){
  if(!S)return;
  const remaining=getSpellRemaining('HEALING');
  if(remaining<=0){return;}
  useSpell('HEALING');
  S.stamina=Math.min(S.staminaMax,S.stamina+8);
  logEvent('gain','💚 Заклятие Исцеления','+8 выносливости');
  updateHUD();saveGame();
  showItemNotification(['💚 Исцеление: +8 выносливости']);
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
    if(log)log.innerHTML+=`<div style="color:var(--muted);margin:4px 0;">Выносливость уже полная — Исцеление не требуется.</div>`;
    return;
  }
  useSpell('HEALING');
  S.stamina=Math.min(S.staminaMax,S.stamina+8);
  if(log)log.innerHTML+=`<div style="color:var(--green2);margin:4px 0;">💚 Заклятие Исцеления: +8 выносливости (стало ${S.stamina}/${S.staminaMax}).</div>`;
  logEvent('gain','💚 Заклятие Исцеления','+8 выносливости (в бою)');
  const hb=document.getElementById('btn-heal-spell');
  const r2=getSpellRemaining('HEALING');
  if(hb){ if(r2>0){ hb.textContent='💚 Заклятие Исцеления +8 ['+r2+']'; } else { hb.style.display='none'; } }
  updateHUD();saveGame();
}
function toggleAddItem(){const a=document.getElementById('add-item-area');a.style.display=a.style.display==='none'?'block':'none';}
function addItem(){if(!S)return;const inp=document.getElementById('add-item-input');const v=inp.value.trim();
  if(!v)return;if(S.inventory.length>=getBagSize()){alert('Мешок полон ('+getBagSize()+' предметов)');return;}
  S.inventory.push(v);inp.value='';updateHUD();saveGame();}
function removeItem(i){if(!S)return;const itm=S.inventory[i];logEvent('loss','− '+itm,'Выброшено из мешка');S.inventory.splice(i,1);updateHUD();saveGame();}

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
const SPELL_KEYWORDS={'огн':'FIRE','плав':'SWIMMING','левит':'LEVITATION',
  'иллюз':'ILLUSION','сил':'FORCE','слаб':'WEAKNESS','копи':'COPY','исцел':'HEALING'};

function getSpellId(ch){
  // Use data tag if present
  if(ch.spell)return ch.spell;
  // Fallback: detect from label
  const lo=ch.label.toLowerCase();
  if(!/заклят|заклин/.test(lo))return null;
  for(const[key,id] of Object.entries(SPELL_KEYWORDS)){
    if(lo.includes(key))return id;
  }
  return null;
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
  if(!ch||!ch.inventory_condition) return true;
  if(!S||!S.inventory) return false;
  const cond=ch.inventory_condition;
  // Food-aware match: carried food has a (eda: +N) suffix (see eatFood / para 132),
  // so an exact compare misses it. Match the exact string OR the base name with
  // the food suffix stripped, so inventory_condition:'Banan' matches a carried
  // 'Banan (eda: +3)'. Non-food items are unaffected (the strip is a no-op).
  const baseEq=(it,name)=>it===name||it.replace(/\s*\(еда:.*?\)/,'')===name;
  const has=name=>S.inventory.some(it=>baseEq(it,name));
  // Count form {item:'Banan', count:4} (group_38): require >= count matching
  // items (food base-name aware). Used by the para 12 / para 625 banana sinks.
  if(cond&&typeof cond==='object'&&!Array.isArray(cond)&&cond.item){
    return S.inventory.filter(it=>baseEq(it,cond.item)).length>=(cond.count||1);
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
  if(sp&&sp.remaining>0){sp.remaining--;const def=SPELLS.find(s=>s.id===spellId);logEvent('gain',def.icon+' Заклятие '+def.name,'Осталось: '+sp.remaining);updateHUD();saveGame();}
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
  const newItems=list.filter(name=>!S.inventory.includes(name));
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
  logEvent('loss','− '+cost+' золотых','Заплачено за выбор. Осталось: '+S.gold);
  playSound('item');
  showItemNotification(['− '+cost+' золотых']);
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
    if(idx<0) idx=S.inventory.findIndex(it=>it.replace(/\s*\(еда:.*?\)/,'')===name);
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
    logEvent('loss','− '+name,'Предмет израсходован.');
  }
  playSound('item');
  showItemNotification(removed.map(n=>'− '+n));
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

function applyRiddleAnswer(input,riddleConfig){
  if(!input||!riddleConfig)return;
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
    logEvent('gain','✓ Загадка разгадана','Параграф: '+targetId);
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
    logEvent('loss','✗ Загадка не разгадана','Параграф: '+riddleConfig.fail_target);
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
    }
    saveGame();
  }
}

function renderRiddle(sec){
  // Replaces renderChoices when sec.riddle is present. Renders a Cyrillic
  // text input + submit button + feedback row showing remaining attempts.
  const cont=document.getElementById('choices');
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
  inp.placeholder='Ваш ответ (им. падеж, ед. ч.)';
  inp.autocomplete='off';
  inp.autocorrect='off';
  inp.spellcheck=false;
  inp.maxLength=40;
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){e.preventDefault();submit();}
  });
  const btn=document.createElement('button');
  btn.className='choice-btn riddle-submit';
  btn.textContent='Ответить';
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
  fb.id='riddle-feedback';
  fb.className=used>0?'riddle-feedback':'riddle-feedback hidden';
  fb.innerHTML='Неверно. Осталось попыток: <span id="riddle-attempts">'+remaining+'</span>';
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
  setTimeout(function(){inp.focus();},50);
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
  // Auto-append price to label if not already mentioned (skip for free items).
  let displayLabel=ch.label||'';
  if(cost>0&&!/\d\s*золот/i.test(displayLabel)){
    displayLabel+=` — ${cost} зол.`;
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
  const foodOverflow=ch.grants_food&&((S.inventory?S.inventory.length:0)>=getBagSize());
  const wouldOverflow=(grantsItems.length>0)&&((S.inventory?S.inventory.length:0)+grantsItems.filter(n=>!S.inventory.includes(n)).length>getBagSize());
  let disabled=false;
  let tooltip='';
  if(isBought){
    disabled=true;tooltip='Уже куплено';
    btn.textContent='✓ '+displayLabel;
  } else if(bagMaxed){
    disabled=true;tooltip='Мешок уже куплен';
    btn.textContent='✓ '+displayLabel;
  } else if(flaskFull){
    disabled=true;tooltip='Фляга уже полна';
  } else if(!canAfford){
    disabled=true;tooltip='Не хватает золота ('+S.gold+'/'+cost+')';
  } else if(wouldOverflow||foodOverflow){
    disabled=true;tooltip='Мешок полон';
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
    notifs.push('− '+cost+' золотых');
    logEvent('loss','− '+cost+' золотых','Покупка (§'+S.section+'). Осталось: '+S.gold);
  }
  // Stamina grant (food). Capped at staminaMax.
  if(grantsStamina>0){
    const before=S.stamina;
    S.stamina=Math.min(S.staminaMax,S.stamina+grantsStamina);
    const actual=S.stamina-before;
    if(actual>0){
      notifs.push('+ '+actual+' выносливости');
      logEvent('gain','+ '+actual+' выносливости','Теперь: '+S.stamina+'/'+S.staminaMax);
    }
  }
  // Items grant. Only items not already owned are deposited; bought-list is
  // marked once the item enters the inventory so a re-buy is blocked even
  // if the player drops the item later.
  const newItems=grantsItems.filter(n=>!S.inventory.includes(n));
  newItems.forEach(name=>{
    if(S.inventory.length<getBagSize()){
      S.inventory.push(name);
      notifs.push('+ '+name);
      logEvent('gain','+ '+name,'Куплено (§'+S.section+')');
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
    notifs.push('+ заплечный мешок ('+ch.grants_bag_size+' мест)');
    logEvent('gain','+ заплечный мешок','Вместимость теперь: '+ch.grants_bag_size);
  }
  // §132 flask refill — 'full'/'water' top to max (2), 'half' adds one sip.
  if(ch.flask_fill){
    const beforeF=S.flask||0;
    if(ch.flask_fill==='half'){ S.flask=Math.min(2,beforeF+1); }
    else { S.flask=2; }
    const addedF=S.flask-beforeF;
    if(addedF>0){
      notifs.push('+ фляга ('+S.flask+'/2)');
      logEvent('gain','🥤 Фляга наполнена','Глотков: '+S.flask+'/2');
    }
  }
  // §132 carried food — deposit a self-describing food string (repeatable,
  // counts against bag capacity, eaten later via eatFood()).
  if(ch.grants_food&&S.inventory.length<getBagSize()){
    const f=ch.grants_food;
    const foodStr=f.name+' (еда: +'+f.stamina+')';
    S.inventory.push(foodStr);
    notifs.push('+ '+foodStr);
    logEvent('gain','+ '+foodStr,'Куплено, взято с собой (§'+S.section+')');
  }
  playSound('item');
  showItemNotification(notifs,'💰 Покупка');
  updateHUD();saveGame();
  // Re-render the current paragraph to refresh shop-button states (bought
  // greys out, no-longer-affordable greys out, etc). Use renderChoices
  // not renderGame to avoid retriggering auto_items.
  const sec=GD[String(S.section)];
  if(sec)renderChoices(sec);
}

function makeChoiceBtn(ch, duringCombat, choiceIndex){
  // Purchase choice (group_14 shop engine) — render as transaction
  // button via makePurchaseBtn instead of navigation button. The shop
  // path lives entirely in that helper.
  if(ch&&ch.purchase===true){
    return makePurchaseBtn(ch, choiceIndex);
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
      btn.title='Заклятие недоступно';
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
      btn.title='Заклятие недоступно';
      btn.onclick=(e)=>{e.preventDefault();};
    } else {
      btn.onclick=()=>{useSpell(spellId);applyChoiceGoldCost(ch);applyChoiceConsume(ch);applyChoiceAcquires(ch,()=>goTo(ch.target));};
    }
  } else {
    btn.textContent=ch.label;
    // Flee penalty: if clicking a non-spell choice during active combat, apply -2 stamina
    const isFleeChoice=duringCombat&&/убежать|бежать|отступить|покинуть|сбежать|спастись бегством|бегство/i.test(ch.label);
    if(isFleeChoice){
      btn.onclick=()=>{
        S.stamina=Math.max(0,S.stamina-2);
        updateHUD();saveGame();
        showItemNotification(['− 2 выносливости (бегство из боя)']);
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
  if(!sectionPrepState[sectionId]) sectionPrepState[sectionId]={};
  return sectionPrepState[sectionId];
}

function clearCombatExtraButtons(){
  const extra=document.getElementById('combat-buttons-extra');
  if(extra) extra.remove();
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

function updateCombatEnemyDisplay(cs){
  if(!cs) return;
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
    let status='в бою';
    let stateClass='state-active';
    if(e.fled){ status='убежал'; stateClass='state-fled'; }
    else if(e.hp<=0){ status='повержен'; stateClass='state-dead'; }
    else if(e.active===false){ status='ожидает'; stateClass='state-waiting'; }
    if(statusEl){
      statusEl.textContent=status;
      statusEl.className='ce-status ce-status-pill '+stateClass;
    }
    card.style.opacity=(e.active===false && !e.fled && e.hp>0)?'0.55':'1';
  });
}

function resumeCanonCombat(){
  clearCombatExtraButtons();
  const roundBtn=document.getElementById('btn-combat-round');
  if(roundBtn){
    roundBtn.style.display='inline-block';
    roundBtn.textContent='Удар!';
    roundBtn.onclick=combatRound;
  }
  const copyBtn=document.getElementById('btn-copy-spell');
  if(copyBtn && combatState){
    const remaining=getSpellRemaining('COPY');
    if(remaining>0 && getAliveCombatEnemies(combatState).length>0){
      copyBtn.style.display='inline-block';
      copyBtn.textContent='👤 Заклятие Копии ['+remaining+']';
    }
  }
  updateCombatEnemyDisplay(combatState);
}

function startScriptedLuckCheck(opts){
  scriptedLuckContext=opts||{};
  document.getElementById('luck-result').innerHTML='';
  document.getElementById('luck-choices').innerHTML='';
  const header=opts&&opts.promptHtml?opts.promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">Бросьте два кубика. Если результат ≤ вашей Удачи (${S.luck}) — вам повезло!<br><span style="font-size:16px;opacity:.7">После проверки Удача уменьшится на 1.</span></p>`;
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
    logEvent('luck','🎲 Проверка Удачи: '+roll+' ≤ '+needed,'Удачно! Удача теперь: '+S.luck);
  } else {
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,false, opts.failHtml?`<div style="color:var(--muted);line-height:1.7">${opts.failHtml}</div>`:'');
    if(typeof opts.onUnlucky==='function') opts.onUnlucky();
    logEvent('luck','🎲 Проверка Удачи: '+roll+' > '+needed,'Неудача. Удача теперь: '+S.luck);
  }
  document.getElementById('btn-luck-roll').style.display='none';
  updateHUD();saveGame();
  const ch=document.getElementById('luck-choices');
  const btn=document.createElement('button');
  btn.className='btn btn-s';
  btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
  btn.textContent=opts.continueText||'Продолжить';
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
      btn.innerHTML='🎲 Проверить удачу';
      btn.onclick=()=>startScriptedLuckCheck({
        promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">Сначала нужно проверить Удачу: если повезёт, вы сразу перерубите нить и будете драться без штрафа. Если нет — придётся сражаться, вися в воздухе, с штрафом −2 к СИЛЕ УДАРА.<br><span style="font-size:16px;opacity:.7">После проверки Удача уменьшится на 1.</span></p>`,
        successHtml:'Вы мгновенно перерубаете нить и становитесь на землю. В бою штрафа к СИЛЕ УДАРА не будет.',
        failHtml:'Нить не поддалась сразу. Сражаться придётся, вися в воздухе, со штрафом −2 к СИЛЕ УДАРА.',
        onLucky:()=>{ sectionPrepState[sec.id]={luckResolved:true, playerMod:0}; },
        onUnlucky:()=>{ sectionPrepState[sec.id]={luckResolved:true, playerMod:-2}; },
        afterClose:()=>renderGame()
      });
      list.appendChild(btn);
      return true;
    }
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML='⚔ Вступить в бой';
    btn.onclick=()=>startCombat(sec.enemies,{...sec, player_attack_mod:(st.playerMod??-2)});
    list.appendChild(btn);
    return true;
  }
  if(sec.combat_script==='sec368_optional_pre_luck'){
    if(!st.modeSelected){
      const ground=document.createElement('button');ground.className='choice-btn';
      ground.style.borderColor='var(--red)';ground.style.color='var(--red2)';ground.style.background='rgba(180,30,30,.12)';
      ground.innerHTML='⚔ Драться стоя на земле';
      ground.onclick=()=>{ sectionPrepState[sec.id]={modeSelected:true, playerMod:-1}; renderGame(); };
      list.appendChild(ground);
      const luck=document.createElement('button');luck.className='choice-btn';
      luck.style.borderColor='var(--green)';luck.style.color='var(--green2)';luck.style.background='rgba(40,180,100,.12)';
      luck.innerHTML='🎲 Проверить удачу и попытаться оседлать коня';
      luck.onclick=()=>startScriptedLuckCheck({
        promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">Можно драться стоя на земле со штрафом −1 к СИЛЕ УДАРА, а можно попытаться оседлать коня павшего рыцаря. Если повезёт — будете сражаться на равных, если нет — всё равно придётся драться на земле со штрафом −1.<br><span style="font-size:16px;opacity:.7">После проверки Удача уменьшится на 1.</span></p>`,
        successHtml:'Вам удаётся оседлать коня. В бою штрафа к СИЛЕ УДАРА не будет.',
        failHtml:'Оседлать коня не удалось. Сражаться придётся стоя на земле со штрафом −1 к СИЛЕ УДАРА.',
        onLucky:()=>{ sectionPrepState[sec.id]={modeSelected:true, playerMod:0}; },
        onUnlucky:()=>{ sectionPrepState[sec.id]={modeSelected:true, playerMod:-1}; },
        afterClose:()=>renderGame()
      });
      list.appendChild(luck);
      return true;
    }
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML='⚔ Вступить в бой';
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
      S.sec436_force=false; saveGame();
      const fightF=document.createElement('button');fightF.className='choice-btn';
      fightF.style.borderColor='var(--gold)';fightF.style.color='var(--gold)';fightF.style.background='rgba(212,175,55,.12)';
      fightF.innerHTML='⚔ Драться (заклятие Силы: +1 к СИЛЕ УДАРА)';
      fightF.onclick=()=>startCombat(sec.enemies,{...sec, player_attack_mod:1, combat_spells_allowed:[]});
      list.appendChild(fightF);
      return true;
    }
    if(!st.luckResolved){
      const btn=document.createElement('button');
      btn.className='choice-btn';
      btn.style.borderColor='var(--green)';btn.style.color='var(--green2)';btn.style.background='rgba(40,180,100,.12)';
      btn.innerHTML='🎲 Проверить удачу';
      btn.onclick=()=>startScriptedLuckCheck({
        promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">Паук тянет вас к себе. Если повезёт — успеете перерубить лестницу и спрыгнуть на землю, где будете драться на равных. Если нет — паук затянет вас на дерево, и в бою придётся вычитать 1 из СИЛЫ УДАРА.<br><span style="font-size:16px;opacity:.7">После проверки Удача уменьшится на 1.</span></p>`,
        successHtml:'Вы перерубаете лестницу и спрыгиваете на землю — теперь будете драться на равных.',
        failHtml:'Паук затягивает вас на дерево. В бою вычитайте 1 из СИЛЫ УДАРА.',
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
    fight.innerHTML='⚔ Драться с пауком на дереве';
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
        if(rem<=0){ fb.style.opacity='.35';fb.style.cursor='not-allowed';fb.style.borderStyle='dashed';fb.title='Заклятие недоступно';fb.onclick=(e)=>{e.preventDefault();}; }
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
    log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">✦ Через три раунда два остальных Орка бросаются на помощь предводителю!</div>`;
    updateCombatEnemyDisplay(cs);
  }
  if(first.hp<=0 && !cs.special.firstDeathHandled){
    cs.special.firstDeathHandled=true;
    if(!cs.special.reinforcementsJoined){
      cs.enemies[1].active=true;
      cs.enemies[2].active=true;
      cs.special.reinforcementsJoined=true;
      log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">✦ Первый Орк повержен. Теперь вам придётся сражаться с двумя оставшимися.</div>`;
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
  log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">✦ Можете проверить Удачу: если повезёт, третий Орк убежит в лес и останется только один противник.</div>`;
  setCombatExtraButtons([
    {text:'🎲 Проверить удачу', className:'btn btn-g', onClick:()=>startScriptedLuckCheck({
      promptHtml:`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">Первый Орк уже повержен. Если Удача с вами, третий Орк не захочет умирать, защищая ворота, и убежит. Если нет — придётся продолжать бой со всеми оставшимися.<br><span style="font-size:16px;opacity:.7">После проверки Удача уменьшится на 1.</span></p>`,
      successHtml:'Третий Орк предпочитает спастись бегством. Вам остаётся только один противник.',
      failHtml:'Третий Орк не дрогнул. Бой продолжается со всеми оставшимися врагами.',
      onLucky:()=>{ cs.special.luckChecked=true; cs.enemies[2].active=false; cs.enemies[2].fled=true; updateCombatEnemyDisplay(cs); },
      onUnlucky:()=>{ cs.special.luckChecked=true; },
      afterClose:()=>resumeCanonCombat()
    })},
    {text:'⚔ Продолжить бой без проверки', className:'btn btn-p', onClick:()=>{ cs.special.luckChecked=true; resumeCanonCombat(); }}
  ]);
}

function renderChoices(sec){
  const list=document.getElementById('c-list');list.innerHTML='';
  const hasPendingCombat=sec.enemies&&sec.enemies.length>0&&!combatDone[S.section];
  const combatWon=sec.enemies&&sec.enemies.length>0&&combatDone[S.section];
  const hasPendingLuck=sec.has_luck&&!luckDone[S.section];
  const spellChoiceRe=/заклят|заклин/i;

  if(hasPendingCombat){
    if(renderCanonCombatChoices(sec,list)) return;
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';
    btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML='⚔ Вступить в бой';
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
      if(!spellChoiceRe.test(ch.label) && !ch.luck_type && !ch.combat_condition && passesInventoryCheck(ch) && passesGoldCheck(ch)){
        list.appendChild(makeChoiceBtn(ch, false, idx));
      }
    });
    return;
  }

  if(hasPendingLuck){
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--green)';btn.style.color='var(--green2)';
    btn.style.background='rgba(40,180,100,.12)';
    btn.innerHTML='🎲 Проверить удачу';
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
  const luckyChoices=sec.choices.filter(ch=>ch.luck_type==='lucky' && passesInventoryCheck(ch) && passesGoldCheck(ch));
  const unluckyChoices=sec.choices.filter(ch=>ch.luck_type==='unlucky' && passesInventoryCheck(ch) && passesGoldCheck(ch));
  const nonLuckChoices=sec.choices.filter(ch=>!ch.luck_type && passesInventoryCheck(ch) && passesGoldCheck(ch));

  if(lr==='lucky' && luckyChoices.length){
    luckyChoices.forEach(ch=>list.appendChild(makeChoiceBtn(ch)));
    return;
  }

  if(lr==='unlucky'){
    if(unluckyChoices.length){
      unluckyChoices.forEach(ch=>list.appendChild(makeChoiceBtn(ch)));
      return;
    }
    if(nonLuckChoices.length){
      nonLuckChoices.forEach(ch=>list.appendChild(makeChoiceBtn(ch)));
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

  nonLuckChoices.forEach(ch=>list.appendChild(makeChoiceBtn(ch)));
}

function goTo(id){
  if(!S)return;S.section=id;
  combatDone={};luckDone={};luckResult={};sectionPrepState={};
  renderGame();
}


// ── Combat ──
let combatDone={};
let combatState=null;

function startCombat(enemies,sec){
  clearCombatExtraButtons();
  logEvent('combat','⚔ Бой начался','Враги: '+enemies.map(e=>e.name).join(', '));
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
    enemies:enemies.map((e,idx)=>({...e,hp:e.stamina,dmg:e.damage||2,active:!(script==='sec1175_canon_orcs' && idx>0),fled:false})),
    round:0,
    wounds:0,
    sec:sec,
    playerMod:pModInit,
    forceBuff:(pendingBuff==='FORCE'),  // group_19 FORCE whole-combat +2; R2-3 may pre-set via bridge
    weaknessDebuff:false,  // group_19: WEAKNESS spell active for whole combat (-2 enemy attack)
    enemyAttackMod:(pendingBuff==='ENEMY_PLUS2'?2:0),  // R2-3 §865 Force-backfire: enemy +2 whole combat
    special:script==='sec1175_canon_orcs'?{type:'sec1175',reinforcementsJoined:false,firstDeathHandled:false,luckChecked:false}:null
  };
  const ce=document.getElementById('combat-enemies');ce.innerHTML='';
  combatState.enemies.forEach(e=>{
    const dmgNote=e.dmg!==2?` <span style="color:var(--red2);font-size:14px;">(урон: ${e.dmg})</span>`:'';
    const hpWidth=Math.max(0, Math.min(100, (e.hp/e.stamina)*100));
    ce.innerHTML+=`<div class="combat-enemy">
      <div class="combat-enemy-head">
        <div>
          <div class="combat-enemy-name">${e.name}</div>
          <div class="combat-status-line"><span class="ce-status ce-status-pill state-active">в бою</span></div>
        </div>
        <div class="combat-enemy-icon">☠</div>
      </div>
      <div class="combat-stats">
        <div class="combat-stat-pill">Мастерство: <b>${e.skill}</b></div>
        <div class="combat-stat-pill">Выносливость: <b><span class="ce-hp">${e.hp}</span>/${e.stamina}</b>${dmgNote}</div>
      </div>
      <div class="combat-hp-wrap">
        <div class="combat-hp-head"><span>Состояние</span><span class="ce-hp-head">${e.hp}/${e.stamina}</span></div>
        <div class="combat-hp-track"><div class="combat-hp-fill" style="width:${hpWidth}%"></div></div>
      </div>
    </div>`;
  });
  document.getElementById('combat-log').innerHTML='';
  if(pModInit!==0){
    document.getElementById('combat-log').innerHTML=`<div style="color:var(--gold);margin-bottom:8px;">⚠ Модификатор Силы Удара: ${pModInit>0?'+':''}${pModInit}</div>`;
  }
  if(combatState.forceBuff){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--gold);margin-bottom:8px;">💪 Заклятие Силы действует: СИЛА УДАРА +2 до конца боя.</div>`;
  }
  if(combatState.enemyAttackMod){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--red2);margin-bottom:8px;">⚠ Заклятие обратилось против вас: СИЛА УДАРА врага +${combatState.enemyAttackMod} до конца боя.</div>`;
  }
  if(script==='sec1175_canon_orcs'){
    document.getElementById('combat-log').innerHTML+=`<div style="color:var(--gold);margin-bottom:8px;">✦ Сначала вы сражаетесь только с Первым Орком. Остальные вступят в бой позже, если он продержится три раунда.</div>`;
  }
  document.getElementById('btn-combat-round').style.display='inline-block';
  document.getElementById('btn-combat-round').textContent='Удар!';
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
      copyBtn.textContent='👤 Заклятие Копии ['+copyRemaining+']';
    } else {
      copyBtn.style.display='none';
    }
  }
  const forceBtn=document.getElementById('btn-force-spell');
  const forceRemaining=getSpellRemaining('FORCE');
  if(forceBtn){
    if(combatState.forceBuff){
      forceBtn.style.display='none';  // R2-3: Force already pre-cast via a bridge — no re-cast
    } else if(allowedSpells.includes('FORCE')&&forceRemaining>0){
      forceBtn.style.display='inline-block';
      forceBtn.textContent='💪 Заклятие Силы ['+forceRemaining+']';
    } else {
      forceBtn.style.display='none';
    }
  }
  const weakBtn=document.getElementById('btn-weakness-spell');
  const weakRemaining=getSpellRemaining('WEAKNESS');
  if(weakBtn){
    if(allowedSpells.includes('WEAKNESS')&&weakRemaining>0){
      weakBtn.style.display='inline-block';
      weakBtn.textContent='🫀 Заклятие Слабости ['+weakRemaining+']';
    } else {
      weakBtn.style.display='none';
    }
  }
  // §950: HEALING usable in combat where canon permits (self-cast, invisible).
  // Shown whenever the allowlist includes HEALING and a charge remains; the
  // handler caps at staminaMax. The HUD heal button stays hidden (overlay).
  const healSpellBtn=document.getElementById('btn-heal-spell');
  const healSpellRemaining=getSpellRemaining('HEALING');
  if(healSpellBtn){
    if(allowedSpells.includes('HEALING')&&healSpellRemaining>0){
      healSpellBtn.style.display='inline-block';
      healSpellBtn.textContent='💚 Заклятие Исцеления +8 ['+healSpellRemaining+']';
    } else {
      healSpellBtn.style.display='none';
    }
  }
  updateCombatEnemyDisplay(combatState);
  document.getElementById('modal-combat').classList.add('on');
}

function combatRound(){
  if(!combatState)return;
  clearCombatExtraButtons();
  const cs=combatState;cs.round++;
  const log=document.getElementById('combat-log');

  if(cs.special&&cs.special.type==='sec1175'){
    const first=cs.enemies[0];
    if(cs.round===4 && first.hp>0 && !cs.special.reinforcementsJoined){
      cs.enemies[1].active=true;
      cs.enemies[2].active=true;
      cs.special.reinforcementsJoined=true;
      log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">✦ Через три раунда два остальных Орка бросаются на помощь предводителю!</div>`;
      updateCombatEnemyDisplay(cs);
    }
  }

  const alive=getAliveCombatEnemies(cs);
  if(alive.length===0){endCombat(true);return;}
  // group_19: FORCE spell adds +2 to player attack for whole combat duration.
  // playerMod already accumulates external modifiers from sec.player_attack_mod
  // (e.g. fatigue penalties from §1154/§1182); FORCE stacks additively.
  const pMod=(cs.playerMod||0)+(cs.forceBuff?2:0);
  const pd=d6()+d6();const pStr=pd+S.skill+pMod;
  log.innerHTML+=`<div>— Раунд ${cs.round} —</div>`;
  if(pMod!==0){
    log.innerHTML+=`<div>Вы: 2к6(${pd}) + ${S.skill} ${pMod>0?'+':''}${pMod} = <b>${pStr}</b></div>`;
  } else {
    log.innerHTML+=`<div>Вы: 2к6(${pd}) + ${S.skill} = <b>${pStr}</b></div>`;
  }

  // group_19: WEAKNESS spell subtracts 2 from each enemy's attack for whole combat.
  const enemyMod=(cs.weaknessDebuff?-2:0)+(cs.enemyAttackMod||0);
  alive.forEach((e,i)=>{
    const ed=d6()+d6();const eStr=ed+e.skill+enemyMod;
    if(enemyMod!==0){
      log.innerHTML+=`<div>${e.name}: 2к6(${ed}) + ${e.skill} ${enemyMod>0?'+':''}${enemyMod} = <b>${eStr}</b></div>`;
    } else {
      log.innerHTML+=`<div>${e.name}: 2к6(${ed}) + ${e.skill} = <b>${eStr}</b></div>`;
    }
    if(i===0){
      if(pStr>eStr){playSound('hit');e.hp-=2;cs.wounds++;log.innerHTML+=`<div class="hit">→ Вы ранили ${e.name} (−2 вын., осталось ${Math.max(0,e.hp)})</div>`;}
      else if(eStr>pStr){playSound('hurt');const d=e.dmg||2;S.stamina-=d;log.innerHTML+=`<div class="miss">→ ${e.name} ранил вас (−${d} вын., осталось ${Math.max(0,S.stamina)})</div>`;}
      else{log.innerHTML+=`<div class="draw">→ Ничья с ${e.name}</div>`;}
    } else {
      if(eStr>pStr){playSound('hurt');const d=e.dmg||2;S.stamina-=d;log.innerHTML+=`<div class="miss">→ ${e.name} тоже ранил вас (−${d} вын., осталось ${Math.max(0,S.stamina)})</div>`;}
      else{log.innerHTML+=`<div class="draw">→ ${e.name} не смог вас ранить</div>`;}
    }
  });

  updateHUD();
  updateCombatEnemyDisplay(cs);
  log.scrollTop=log.scrollHeight;

  if(S.stamina<=0){endCombat(false);return;}

  if(cs.special&&cs.special.type==='sec1175'){
    const first=cs.enemies[0];
    if(first.hp<=0 && !cs.special.firstDeathHandled){
      cs.special.firstDeathHandled=true;
      if(!cs.special.reinforcementsJoined){
        cs.enemies[1].active=true;
        cs.enemies[2].active=true;
        cs.special.reinforcementsJoined=true;
        log.innerHTML+=`<div style="color:var(--gold);margin-top:6px;">✦ Первый Орк повержен. Теперь вам придётся сражаться с двумя оставшимися.</div>`;
        updateCombatEnemyDisplay(cs);
      }
      if(!cs.special.luckChecked && cs.enemies[2].hp>0 && !cs.enemies[2].fled){
        promptCanon1175Luck();
        return;
      }
    }
  }

  if(getAliveCombatEnemies(cs).length===0){endCombat(true);return;}

  if(cs.sec&&cs.sec.choices){
    cs.sec.choices.forEach(ch=>{
      if(ch.combat_condition==='wound_2'&&cs.wounds>=2){
        const existing=document.getElementById('combat-condition-btn');
        if(!existing){
          const btn=document.createElement('button');btn.id='combat-condition-btn';
          btn.className='btn btn-g';btn.style.cssText='margin-top:10px;font-size:17px;';
          btn.textContent='✦ '+ch.label;
          btn.onclick=()=>{
            document.getElementById('modal-combat').classList.remove('on');
            combatDone[S.section]=true;
            goTo(ch.target);
          };
          document.getElementById('btn-combat-round').parentElement.appendChild(btn);
          log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">✦ Вы ранили врага дважды! Можете перейти к ${ch.target}.</div>`;
        }
      }
    });
  }
}

function endCombat(won){
  combatDone[S.section]=true;
  clearCombatExtraButtons();
  const log=document.getElementById('combat-log');
  const copyBtn=document.getElementById('btn-copy-spell');
  if(copyBtn)copyBtn.style.display='none';
  const forceBtn=document.getElementById('btn-force-spell');
  if(forceBtn)forceBtn.style.display='none';
  const weakBtn=document.getElementById('btn-weakness-spell');
  if(weakBtn)weakBtn.style.display='none';
  if(won){
    playSound('victory');
    logEvent('combat','✦ Победа в бою','Раундов: '+(combatState?combatState.round:0));
    log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">✦ Победа!</div>`;
    document.getElementById('btn-combat-round').style.display='inline-block';
    document.getElementById('btn-combat-round').textContent='Продолжить';
    document.getElementById('btn-combat-round').onclick=()=>{
      document.getElementById('modal-combat').classList.remove('on');renderGame();
    };
  }else{
    playSound('death');log.innerHTML+=`<div style="color:var(--red2);font-weight:bold;margin-top:8px">† Вы погибли в бою…</div>`;
    document.getElementById('btn-combat-round').style.display='inline-block';
    document.getElementById('btn-combat-round').textContent='Конец';
    document.getElementById('btn-combat-round').onclick=()=>{
      document.getElementById('modal-combat').classList.remove('on');
      showDeathOverlay();
    };
  }
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
  log.innerHTML+=`<div style="color:#999;font-weight:bold;margin-top:8px">👤 Заклятие Копии на ${target.name}!</div>`;
  log.innerHTML+=`<div style="color:#999;font-size:14px;">Копия: Мастерство ${target.skill}, Выносливость ${target.hp}</div>`;
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
    log.innerHTML+=`<div class="hit" style="margin-top:4px">👤 Копия победила ${target.name}! Враг повержен.</div>`;
  } else {
    target.hp=Math.max(1,enemyHp);
    log.innerHTML+=`<div class="miss" style="margin-top:4px">👤 ${target.name} победил свою Копию, но ослаблен (выносливость: ${target.hp}).</div>`;
  }
  updateCombatEnemyDisplay(cs);
  const copyBtn=document.getElementById('btn-copy-spell');
  const newRemaining=getSpellRemaining('COPY');
  if(copyBtn){
    if(newRemaining>0&&getAliveCombatEnemies(cs).length>0){
      copyBtn.textContent='👤 Заклятие Копии ['+newRemaining+']';
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
        log.innerHTML+=`<div style="color:var(--gold);margin-top:6px">✦ Первый Орк повержен. Теперь вам придётся сражаться с двумя оставшимися.</div>`;
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
  if(getAliveCombatEnemies(cs).length===0){
    endCombat(true);
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
  log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">💪 Заклятие Силы! СИЛА УДАРА +2 до конца боя.</div>`;
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
  log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">🫀 Заклятие Слабости! Атака врагов −2 до конца боя.</div>`;
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
    <div class="luck-total">сумма броска: ${roll}</div>
    <div class="luck-target-note">Нужно было ≤ ${needed} · Удача после броска: ${S.luck}</div>
    <div class="${lucky?'luck-success':'luck-fail'}" style="font-size:30px">${lucky?'Удача с вами! ✦':'Удача вас покинула… †'}</div>
    ${extraHtml||''}
  </div>`;
}

function startLuckCheck(sec){
  document.getElementById('luck-result').innerHTML='';
  document.getElementById('luck-choices').innerHTML='';
  document.getElementById('luck-info').innerHTML=`<p style="color:var(--muted);font-size:20px;line-height:1.6;margin-bottom:16px">Бросьте два кубика. Если результат ≤ вашей Удачи (${S.luck}) — вам повезло!<br><span style="font-size:16px;opacity:.7">После проверки Удача уменьшится на 1.</span></p>`;
  document.getElementById('btn-luck-roll').style.display='inline-block';
  document.getElementById('btn-luck-roll').onclick=()=>doLuckCheck(sec);
  document.getElementById('modal-luck').classList.add('on');
}

function doLuckCheck(sec){
  playSound('dice');const roll1=d6(),roll2=d6(),roll=roll1+roll2;
  const lucky=roll<=S.luck;
  S.luck=Math.max(0,S.luck-1);// decrease luck by 1 after each check
  
  const res=document.getElementById('luck-result');
  const needed=S.luck+1;
  if(lucky){
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,true);
    luckResult[S.section]='lucky';logEvent('luck','🎲 Проверка Удачи: '+roll+' ≤ '+needed,'Удачно! Удача теперь: '+S.luck);
  }else{
    res.innerHTML=formatLuckPanel(roll1,roll2,roll,needed,false);
    luckResult[S.section]='unlucky';logEvent('luck','🎲 Проверка Удачи: '+roll+' > '+needed,'Неудача. Удача теперь: '+S.luck);
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
        btn.textContent='Конец приключения';
        btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');showDeathOverlay();};
        ch.appendChild(btn);
      } else {
        // No tagged luck choices — close modal and show in main view
        const btn=document.createElement('button');btn.className='btn btn-s';
        btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
        btn.textContent='Продолжить';
        btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');renderGame();};
        ch.appendChild(btn);
      }
    }
  } else {
    const btn=document.createElement('button');btn.className='btn btn-s';
    btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
    btn.textContent='Продолжить';btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');renderGame();};
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
  setAtmosphericBg(text);
}

function setAtmosphericBg(text){
  const bg=document.getElementById('scene-bg');
  const t=text.toLowerCase();
  let gradient;
  
  if(t.includes('лес')||t.includes('дерев')||t.includes('тропинк')){
    gradient='radial-gradient(ellipse at 40% 60%,#0a1a0a 0%,#061208 40%,#040a06 100%)';
  }else if(t.includes('замок')||t.includes('замка')||t.includes('башн')||t.includes('ворот')){
    gradient='radial-gradient(ellipse at 50% 30%,#1a1020 0%,#0a0816 40%,#060410 100%)';
  }else if(t.includes('река')||t.includes('озер')||t.includes('вод')||t.includes('мост')){
    gradient='radial-gradient(ellipse at 50% 70%,#0a1520 0%,#060e18 40%,#040810 100%)';
  }else if(t.includes('бой')||t.includes('драть')||t.includes('меч')||t.includes('атак')){
    gradient='radial-gradient(ellipse at 50% 50%,#1a0a0a 0%,#100608 40%,#0a0406 100%)';
  }else if(t.includes('подземел')||t.includes('коридор')||t.includes('дверь')||t.includes('лестниц')){
    gradient='radial-gradient(ellipse at 50% 50%,#121018 0%,#0a0a12 40%,#06060a 100%)';
  }else if(t.includes('поля')||t.includes('полян')||t.includes('солнц')){
    gradient='radial-gradient(ellipse at 50% 40%,#1a1a0a 0%,#121208 40%,#0a0a06 100%)';
  }else if(t.includes('ночь')||t.includes('темн')||t.includes('ноч')){
    gradient='radial-gradient(ellipse at 50% 50%,#0a0a14 0%,#060610 40%,#04040a 100%)';
  }else{
    gradient='radial-gradient(ellipse at 50% 50%,#10101a 0%,#0a0a12 40%,#06060a 100%)';
  }
  
  bg.style.background=gradient;
  bg.style.opacity='.25';
}

// ── Init ──
window.onload=()=>{
  initTitle();renderSpellSel();
  const h=location.hash.substring(1);
  if(h&&parseInt(h)>0&&GD[h]){
    const sv=loadGame();
    if(sv){S=sv;S.section=parseInt(h);showScr('game');renderGame();}
    else{S=initState('Тестер',12,24,12,[{id:'FIRE',remaining:2},{id:'HEALING',remaining:2},{id:'FORCE',remaining:2},{id:'WEAKNESS',remaining:2},{id:'COPY',remaining:1},{id:'SWIMMING',remaining:1}]);S.section=parseInt(h);showScr('game');renderGame();}
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
    <button class="visual-pill" id="vp-amb" type="button">🌫 <span>Атмосфера</span></button>
    <button class="visual-pill" id="vp-art" type="button">🖼 <span>Иллюстрации</span></button>`;
  document.body.appendChild(dock);
  document.getElementById('vp-amb').onclick=toggleAmbience;
  document.getElementById('vp-art').onclick=toggleInlineArt;
  syncVisualControls();
}
function syncVisualControls(){
  const amb=document.getElementById('vp-amb');
  const art=document.getElementById('vp-art');
  if(amb) amb.classList.toggle('on', !!VISUAL.ambience);
  if(art) art.classList.toggle('on', !!VISUAL.inlineArt);
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

