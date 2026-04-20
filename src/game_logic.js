
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

const PREGAME_TEXT='Майлин дает еще два совета. Во-первых, сориентироваться на запутанных лесных тропинках и в замке, если вы до него доберетесь, вам поможет карта. Рисуйте ее по мере продвижения. Во-вторых, для многих магических таинств необходимы волшебные предметы. Старайтесь в своем путешествии добыть их как можно больше, при случае они помогут вам, но будьте осторожны: коварство врага не знает границ, возможны любые ловушки.\n\nПосле беседы с астрологом вы вновь предстаете перед Королем. Никто не знает, что вам может понадобиться на пути к успеху, поэтому из дворца вы берете с собой только самое необходимое: меч, флягу, заплечный мешок и 15 золотых.\n\nКороль приказывает проводить вас до начала Зачарованного леса, чтобы в пути вы не испытывали нужды ни в еде, ни в питье. По дороге вы спрашиваете герольда, кто Такие Гоблины и Орки, о которых вы много слышали во дворце. Он говорит, что Гоблины — это страшные и отвратительные злые духи ростом примерно с человека, которые верой и правдой служат волшебнику. Из мало кто видел. И совсем уж никто и никогда не видел Орков. Говорят только, что они повыше и посильнее. Но и с теми и с другими лучше не встречаться. В пути вы еще раз обдумываете последний совет Майлина: Барлад Дэрт достаточно могущественный волшебник, чтобы даже малой частицы его мастерства, переданной особо доверенным воинам, хватило не только на то, чтобы противостоятьвашим заклятиям, но и наложить на вас свои, не менее быстрые и сильные. Будьте осмотрительны!\n\nНо вот королевским владениям приходит конец. Здесь надо спешиться: лес заколдован и не пустит всадника. Герольд прощается с вами, и вскоре лишь далекий стук копыт напоминает, что вы были не один. Черный, таинственный и неподвижный, Зачарованный лес ждет вас.\n\nЕсли вы готовы к тем неожиданностям, с которыми вам придется встретиться, переверните страницу.';
const SAVE_KEY='podzch_v5';

// ── State ──
let S=null;
// Expose S globally for map module
Object.defineProperty(window,'S',{get:()=>S,set:(v)=>{S=v;},configurable:true});
function initState(n,sk,st,lu,sp){
  return{name:n||'Герой',section:1,skill:sk,skillMax:sk,stamina:st,staminaMax:st,
    luck:lu,luckMax:lu,gold:15,flask:2,
    inventory:[],spells:sp,notes:'',visited:[],startTime:Date.now(),v:5};
}

// ── RNG ──
function d6(){const a=new Uint32Array(1);crypto.getRandomValues(a);return(a[0]%6)+1;}

// ── Save/Load ──
function saveGame(){if(!S)return;localStorage.setItem(SAVE_KEY,JSON.stringify(S));}
function loadGame(){try{const r=localStorage.getItem(SAVE_KEY);if(!r)return null;const s=JSON.parse(r);return s.v===5||s.v===4?s:null;}catch{return null;}}
function exportSave(){saveGame();const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='podzch-save.json';a.click();closeModal('overlay-menu');}
function importSave(e){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const s=JSON.parse(t);
  if(s.v!==5&&s.v!==4){alert('Несовместимый формат');return;}
  if(s.v===4){s.v=5;s.luckMax=s.luck;delete s.luckBoxes;}// upgrade v4→v5
  S=s;saveGame();showScr('game');renderGame();closeModal('overlay-menu');}catch{alert('Ошибка загрузки');}});e.target.value='';}

// ── Screens ──
function showScr(id){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));document.getElementById('scr-'+id).classList.add('on');const elb=document.getElementById('event-log-btn');if(elb)elb.style.display=(id==='game')?'block':'none';const sbm=document.getElementById('sb-map');if(sbm)sbm.style.display=(id==='game')?'block':'none';}
function closeModal(id){document.getElementById(id).classList.remove('on');}
function openMenu(){document.getElementById('overlay-menu').classList.add('on');}

// ── Title ──
function initTitle(){
  const sv=loadGame();const bl=document.getElementById('btn-load');
  if(sv){bl.style.display='inline-block';bl.onclick=()=>{S=sv;showScr('game');renderGame();};}
  document.getElementById('btn-new').onclick=()=>showScr('create');
  // Title art
  if(typeof TITLE_RIDER!=='undefined'){
    document.getElementById('title-rider').innerHTML=`<img src="data:image/png;base64,${TITLE_RIDER}" style="max-height:350px;filter:drop-shadow(0 0 20px rgba(200,150,50,.3));" alt="">`;
  }
  if(typeof TITLE_ART!=='undefined'){
    document.getElementById('title-lettering').innerHTML=`<img src="data:image/png;base64,${TITLE_ART}" style="max-width:380px;filter:drop-shadow(0 0 15px rgba(200,150,50,.2));" alt="Подземелья Чёрного замка">`;
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

function renderSpellSel(){
  const bar=document.getElementById('slots-bar');bar.innerHTML='';const t=totSp();
  for(let i=0;i<MAX_SP;i++){const d=document.createElement('div');d.className='slot-pip'+(i<t?' on':'');d.textContent=i<t?'✦':'·';bar.appendChild(d);}
  const grid=document.getElementById('spell-grid');grid.innerHTML='';
  SPELLS.forEach(sp=>{const q=spQty[sp.id];const c=document.createElement('div');
    c.className='sp-card'+(q>0?' sel':'')+(t>=MAX_SP&&q===0?' maxed':'');
    c.style.cssText='display:flex;align-items:flex-start;gap:12px;padding:12px 14px;';
    c.innerHTML=`<div class="sp-icon" style="font-size:28px;min-width:34px;text-align:center;margin-top:2px;">${sp.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="sp-name" style="font-size:19px;margin-bottom:3px;font-weight:500;">${sp.name}</div>
        <div class="sp-desc" style="font-size:14px;color:rgba(232,220,196,.65);line-height:1.5;">${sp.full}</div>
      </div>
      <div class="sp-qty" style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
        <button class="qty-btn" data-id="${sp.id}" data-d="-1" style="font-size:18px;width:32px;height:32px;">−</button>
        <span class="qty-num" style="font-size:20px;min-width:26px;text-align:center;">${q}</span>
        <button class="qty-btn" data-id="${sp.id}" data-d="1" style="font-size:18px;width:32px;height:32px;">+</button>
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
  const freeSlots=7-S.inventory.length;
  
  // Text
  const txt=document.getElementById('inv-modal-text');
  if(freeSlots<newItems.length){
    txt.innerHTML=`Найдено ${newItems.length} предметов, но в мешке только ${freeSlots} свободных мест из 7.<br>Выберите что взять, или выбросьте ненужное.`;
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
  cur.innerHTML='<div style="font-size:14px;color:var(--gold);margin-bottom:6px;letter-spacing:.08em;">В МЕШКЕ ('+S.inventory.length+'/7):</div>';
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
    } else if(S.inventory.length>=7){
      btn.textContent='Мешок полон';btn.disabled=true;btn.style.opacity='.4';
    } else {
      btn.textContent='+ Взять';btn.disabled=false;btn.style.opacity='1';
    }
  });
}

function takeItem(idx){
  if(!S||S.inventory.length>=7)return;
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

// ── Game Rendering ──
function renderGame(){
  if(!S)return;updateHUD();
  const sec=GD[String(S.section)];
  if(!sec){goTo(1);return;}
  document.getElementById('s-num').textContent='§ Параграф '+S.section;
  // Render illustration if available
  let illustHtml='';
  if(typeof ILLUST_MAP!=='undefined'&&typeof ILLUST_DATA!=='undefined'){
    const imgFile=ILLUST_MAP[String(S.section)];
    if(imgFile&&ILLUST_DATA[imgFile]){
      illustHtml=`<div class="illustration-container"><img src="data:image/jpeg;base64,${ILLUST_DATA[imgFile]}" onload="this.classList.add('loaded')" alt="Иллюстрация"/></div>`;
    }
  }
  document.getElementById('s-text').innerHTML=illustHtml+fmtText(sec.text);
  document.getElementById('s-area').scrollTop=0;
  renderChoices(sec);
  // Track visited
  const firstVisit=!S.visited.includes(S.section);
  if(firstVisit)S.visited.push(S.section);
  // Auto-inventory on first visit
  if(firstVisit&&sec.auto_items){
    const ai=sec.auto_items;
    let notifications=[];
    // Gold (always auto-add)
    if(ai.gold&&ai.gold>0){
      S.gold+=ai.gold;
      notifications.push('+ '+ai.gold+' золотых');
      logEvent('gain','+ '+ai.gold+' золотых','Всего: '+S.gold);
    }
    if(ai.gold_sub&&ai.gold_sub>0){
      const spent=Math.min(S.gold,ai.gold_sub);
      S.gold-=spent;
      notifications.push('− '+spent+' золотых');
      logEvent('loss','− '+spent+' золотых','Всего: '+S.gold);
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
    if(ai.luck_add){S.luck+=ai.luck_add;statNotifs.push('+ '+ai.luck_add+' удачи');logEvent('gain','+ '+ai.luck_add+' удачи','Теперь: '+S.luck);}
    if(statNotifs.length>0){updateHUD();saveGame();showItemNotification(statNotifs);}
  }
  // Check death
  if(S.stamina<=0){document.getElementById('end-death').classList.add('on');return;}
  // Check win
  if(S.section===1220){playSound('victory');document.getElementById('end-win').classList.add('on');return;}
  // Check dead-end (no choices and not win/death screen)
  if(sec.choices.length===0&&S.section!==617){
    playSound('death');document.getElementById('death-text').textContent=sec.text.substring(sec.text.length-200);
    document.getElementById('end-death').classList.add('on');return;
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
    il.innerHTML+=`<div class="inv-item"><span>${item}</span><span class="inv-remove" onclick="removeItem(${i})" title="Выбросить">🗑</span></div>`;});}
  else{il.innerHTML='<div class="inv-empty">Мешок пуст</div>';}
  document.getElementById('inv-count').textContent=`(${S.inventory?S.inventory.length:0}/7)`;
  // Notes
  const nta=document.getElementById('notes-ta');if(nta&&S.notes!==undefined)nta.value=S.notes;
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
function toggleAddItem(){const a=document.getElementById('add-item-area');a.style.display=a.style.display==='none'?'block':'none';}
function addItem(){if(!S)return;const inp=document.getElementById('add-item-input');const v=inp.value.trim();
  if(!v)return;if(S.inventory.length>=7){alert('Мешок полон (7 предметов)');return;}
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

function useSpell(spellId){
  if(!S||!S.spells)return;
  const sp=S.spells.find(s=>s.id===spellId);
  if(sp&&sp.remaining>0){sp.remaining--;const def=SPELLS.find(s=>s.id===spellId);logEvent('gain',def.icon+' Заклятие '+def.name,'Осталось: '+sp.remaining);updateHUD();saveGame();}
}

function makeChoiceBtn(ch, duringCombat){
  const btn=document.createElement('button');btn.className='choice-btn';
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
      btn.onclick=()=>{useSpell(spellId);goTo(ch.target);};
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
        goTo(ch.target);
      };
    } else {
      btn.onclick=()=>goTo(ch.target);
    }
  }
  return btn;
}

function renderChoices(sec){
  const list=document.getElementById('c-list');list.innerHTML='';
  const hasPendingCombat=sec.enemies&&sec.enemies.length>0&&!combatDone[S.section];
  const combatWon=sec.enemies&&sec.enemies.length>0&&combatDone[S.section];
  const hasPendingLuck=sec.has_luck&&!luckDone[S.section];
  const spellChoiceRe=/заклят|заклин/i;

  if(hasPendingCombat){
    const btn=document.createElement('button');btn.className='choice-btn';
    btn.style.borderColor='var(--red)';btn.style.color='var(--red2)';
    btn.style.background='rgba(180,30,30,.12)';
    btn.innerHTML='⚔ Вступить в бой';
    btn.onclick=()=>startCombat(sec.enemies,sec);list.appendChild(btn);
    // Show pre-combat choices but NOT post-combat, luck-result, or combat conditions
    sec.choices.forEach(ch=>{
      if(!ch.post_combat && !ch.luck_type && !ch.combat_condition){
        list.appendChild(makeChoiceBtn(ch, true));
      }
    });
    return;
  }

  if(combatWon){
    // After winning: show post-combat + non-spell, hide spell/luck/combat-condition
    sec.choices.forEach(ch=>{
      if(!spellChoiceRe.test(ch.label) && !ch.luck_type && !ch.combat_condition){
        list.appendChild(makeChoiceBtn(ch));
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
    // Show ONLY non-luck choices (spells, combat alternatives)
    // Hide choices marked only_after_unlucky until luck check resolves
    sec.choices.forEach(ch=>{
      if(!ch.luck_type && !ch.only_after_unlucky){
        list.appendChild(makeChoiceBtn(ch));
      }
    });
    return;
  }

  // After luck check: show correct luck outcome + non-luck choices
  // luckResult stores the result: 'lucky' or 'unlucky'
  const lr=luckResult[S.section];
  sec.choices.forEach(ch=>{
    if(ch.luck_type){
      // Only show if matches the luck result
      if(ch.luck_type===lr){
        list.appendChild(makeChoiceBtn(ch));
      }
    } else if(ch.only_after_unlucky){
      // Only show after unlucky result
      if(lr==='unlucky'){
        list.appendChild(makeChoiceBtn(ch));
      }
    } else {
      list.appendChild(makeChoiceBtn(ch));
    }
  });
}

function goTo(id){
  if(!S)return;S.section=id;
  combatDone={};luckDone={};luckResult={};
  renderGame();
}

// ── Combat ──
let combatDone={};
let combatState=null;

function startCombat(enemies,sec){
  logEvent('combat','⚔ Бой начался','Враги: '+enemies.map(e=>e.name).join(', '));
  const pMod=sec.player_attack_mod||0;
  combatState={enemies:enemies.map(e=>({...e,hp:e.stamina,dmg:e.damage||2})),round:0,wounds:0,sec:sec,playerMod:pMod};
  const ce=document.getElementById('combat-enemies');ce.innerHTML='';
  combatState.enemies.forEach(e=>{
    const dmgNote=e.dmg!==2?` <span style="color:var(--red2);font-size:14px;">(урон: ${e.dmg})</span>`:'';
    ce.innerHTML+=`<div class="combat-enemy"><div class="combat-enemy-name">${e.name}</div>
      <div class="combat-stats"><span>Мастерство: ${e.skill}</span><span>Выносливость: <span class="ce-hp">${e.hp}</span>/${e.stamina}${dmgNote}</span></div></div>`;
  });
  document.getElementById('combat-log').innerHTML='';
  if(pMod!==0){
    document.getElementById('combat-log').innerHTML=`<div style="color:var(--gold);margin-bottom:8px;">⚠ Модификатор Силы Удара: ${pMod>0?'+':''}${pMod}</div>`;
  }
  document.getElementById('btn-combat-round').textContent='Удар!';
  document.getElementById('btn-combat-round').onclick=combatRound;
  // Show Copy spell button if available
  const copyBtn=document.getElementById('btn-copy-spell');
  const copyRemaining=getSpellRemaining('COPY');
  if(copyBtn){
    if(copyRemaining>0){
      copyBtn.style.display='inline-block';
      copyBtn.textContent='👤 Заклятие Копии ['+copyRemaining+']';
    } else {
      copyBtn.style.display='none';
    }
  }
  document.getElementById('modal-combat').classList.add('on');
}

function combatRound(){
  if(!combatState)return;
  const cs=combatState;cs.round++;
  const log=document.getElementById('combat-log');
  const alive=cs.enemies.filter(e=>e.hp>0);
  if(alive.length===0){endCombat(true);return;}
  
  // Player attack strength (with modifier from paragraph)
  const pMod=cs.playerMod||0;
  const pd=d6()+d6();const pStr=pd+S.skill+pMod;
  log.innerHTML+=`<div>— Раунд ${cs.round} —</div>`;
  if(pMod!==0){
    log.innerHTML+=`<div>Вы: 2к6(${pd}) + ${S.skill} ${pMod>0?'+':''}${pMod} = <b>${pStr}</b></div>`;
  } else {
    log.innerHTML+=`<div>Вы: 2к6(${pd}) + ${S.skill} = <b>${pStr}</b></div>`;
  }
  
  // Multi-enemy rules: player can only wound the FIRST alive enemy (target)
  // But ALL enemies with higher attack can wound the player
  const target=alive[0];
  
  alive.forEach((e,i)=>{
    const ed=d6()+d6();const eStr=ed+e.skill;
    log.innerHTML+=`<div>${e.name}: 2к6(${ed}) + ${e.skill} = <b>${eStr}</b></div>`;
    
    if(i===0){
      // This is the target — normal combat
      if(pStr>eStr){playSound('hit');e.hp-=2;cs.wounds++;log.innerHTML+=`<div class="hit">→ Вы ранили ${e.name} (−2 вын., осталось ${Math.max(0,e.hp)})</div>`;}
      else if(eStr>pStr){playSound('hurt');const d=e.dmg||2;S.stamina-=d;log.innerHTML+=`<div class="miss">→ ${e.name} ранил вас (−${d} вын., осталось ${Math.max(0,S.stamina)})</div>`;}
      else{log.innerHTML+=`<div class="draw">→ Ничья с ${e.name}</div>`;}
    } else {
      // Other enemies — can only wound player, player cannot wound them
      if(eStr>pStr){playSound('hurt');const d=e.dmg||2;S.stamina-=d;log.innerHTML+=`<div class="miss">→ ${e.name} тоже ранил вас (−${d} вын., осталось ${Math.max(0,S.stamina)})</div>`;}
      else{log.innerHTML+=`<div class="draw">→ ${e.name} не смог вас ранить</div>`;}
    }
  });
  
  updateHUD();log.scrollTop=log.scrollHeight;
  
  // Update enemy display
  const ceEls=document.querySelectorAll('.ce-hp');
  cs.enemies.forEach((e,i)=>{if(ceEls[i])ceEls[i].textContent=Math.max(0,e.hp);});
  
  if(S.stamina<=0){endCombat(false);return;}
  if(cs.enemies.filter(e=>e.hp>0).length===0){endCombat(true);return;}
  
  // Check combat conditions (e.g. "wound dragon twice")
  if(cs.sec&&cs.sec.choices){
    cs.sec.choices.forEach(ch=>{
      if(ch.combat_condition==='wound_2'&&cs.wounds>=2){
        // Show mid-combat escape button
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
  const log=document.getElementById('combat-log');
  const copyBtn=document.getElementById('btn-copy-spell');
  if(copyBtn)copyBtn.style.display='none';
  const rounds=combatState?combatState.round:0;
  if(won){
    playSound('victory');logEvent('combat','✦ Победа в бою','Раундов: '+rounds);log.innerHTML+=`<div style="color:var(--gold);font-weight:bold;margin-top:8px">✦ Победа!</div>`;
    document.getElementById('btn-combat-round').textContent='Продолжить';
    document.getElementById('btn-combat-round').onclick=()=>{
      document.getElementById('modal-combat').classList.remove('on');renderGame();
    };
  }else{
    playSound('death');log.innerHTML+=`<div style="color:var(--red2);font-weight:bold;margin-top:8px">† Вы погибли в бою…</div>`;
    document.getElementById('btn-combat-round').textContent='Конец';
    document.getElementById('btn-combat-round').onclick=()=>{
      document.getElementById('modal-combat').classList.remove('on');
      document.getElementById('end-death').classList.add('on');
    };
  }
}

// ── Copy Spell in Combat ──
function useCopyInCombat(){
  if(!combatState||!S)return;
  const copyRemaining=getSpellRemaining('COPY');
  if(copyRemaining<=0)return;
  
  const cs=combatState;
  const alive=cs.enemies.filter(e=>e.hp>0);
  if(alive.length===0)return;
  
  // Pick strongest alive enemy (highest skill*hp product)
  alive.sort((a,b)=>(b.skill*b.hp)-(a.skill*a.hp));
  const target=alive[0];
  
  useSpell('COPY');
  const log=document.getElementById('combat-log');
  log.innerHTML+=`<div style="color:#999;font-weight:bold;margin-top:8px">👤 Заклятие Копии на ${target.name}!</div>`;
  log.innerHTML+=`<div style="color:#999;font-size:14px;">Копия: Мастерство ${target.skill}, Выносливость ${target.hp}</div>`;
  
  // Simulate copy vs enemy fight
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
    // Copy won - enemy is dead
    target.hp=0;
    log.innerHTML+=`<div class="hit" style="margin-top:4px">👤 Копия победила ${target.name}! Враг повержен.</div>`;
  } else {
    // Enemy won - but weakened
    target.hp=Math.max(1,enemyHp);
    log.innerHTML+=`<div class="miss" style="margin-top:4px">👤 ${target.name} победил свою Копию, но ослаблен (выносливость: ${target.hp}).</div>`;
  }
  
  // Update display
  const ceEls=document.querySelectorAll('.ce-hp');
  cs.enemies.forEach((e,i)=>{if(ceEls[i])ceEls[i].textContent=Math.max(0,e.hp);});
  
  // Update copy button
  const copyBtn=document.getElementById('btn-copy-spell');
  const newRemaining=getSpellRemaining('COPY');
  if(newRemaining>0&&cs.enemies.filter(e=>e.hp>0).length>0){
    copyBtn.textContent='👤 Заклятие Копии ['+newRemaining+']';
  } else {
    copyBtn.style.display='none';
  }
  
  // Check if all enemies dead
  if(cs.enemies.filter(e=>e.hp>0).length===0){
    endCombat(true);
  }
  
  updateHUD();
  log.scrollTop=log.scrollHeight;
}

// ── Luck Check ──
let luckDone={};
let luckResult={};

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
  res.innerHTML=`<div style="font-size:56px;margin:10px 0">🎲 ${roll1} + ${roll2} = ${roll}</div>`;
  res.innerHTML+=`<div style="font-size:16px;color:var(--muted);margin-bottom:8px;">Нужно было ≤ ${S.luck+1} (Удача теперь ${S.luck})</div>`;
  if(lucky){
    res.innerHTML+=`<div class="luck-success" style="font-size:28px">Удача с вами! ✦</div>`;
    luckResult[S.section]='lucky';logEvent('luck','🎲 Проверка Удачи: '+roll+' ≤ '+(S.luck+1),'Удачно! Удача теперь: '+S.luck);
  }else{
    res.innerHTML+=`<div class="luck-fail" style="font-size:28px">Удача вас покинула… †</div>`;
    luckResult[S.section]='unlucky';logEvent('luck','🎲 Проверка Удачи: '+roll+' > '+(S.luck+1),'Неудача. Удача теперь: '+S.luck);
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
      // No tagged luck choices — close modal and show in main view
      const btn=document.createElement('button');btn.className='btn btn-s';
      btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
      btn.textContent='Продолжить';
      btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');renderGame();};
      ch.appendChild(btn);
    }
  } else {
    const btn=document.createElement('button');btn.className='btn btn-s';
    btn.style.cssText='margin:8px;font-size:18px;padding:12px 24px;';
    btn.textContent='Продолжить';btn.onclick=()=>{document.getElementById('modal-luck').classList.remove('on');renderGame();};
    ch.appendChild(btn);
  }
}

// ── AI Scene Image Generation ──
let lastImageSection=null;
async function generateSceneImage(text){
  if(!text||S.section===lastImageSection)return;
  lastImageSection=S.section;
  
  const bg=document.getElementById('scene-bg');
  const loader=document.getElementById('img-loading');
  
  try{
    loader.classList.add('on');
    // Extract key scene elements from text (first 200 chars)
    const sceneDesc=text.substring(0,300).replace(/\n/g,' ');
    
    const response=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:200,
        system:'You are an art director. Given a scene description from a fantasy gamebook, output ONLY a short (30-40 word) image generation prompt in English for a dark fantasy illustration. Style: medieval fantasy, oil painting, atmospheric, moody lighting. No characters, focus on environment/mood. Output only the prompt, nothing else.',
        messages:[{role:'user',content:'Scene: '+sceneDesc}]
      })
    });
    
    if(!response.ok){loader.classList.remove('on');return;}
    const data=await response.json();
    const prompt=data.content?.[0]?.text;
    if(!prompt){loader.classList.remove('on');return;}
    
    // Use the prompt to set a CSS gradient-based atmospheric background
    // (Since we can't generate actual images in this environment, we create atmospheric CSS)
    setAtmosphericBg(text);
    loader.classList.remove('on');
  }catch(e){
    console.log('Image gen skipped:',e);
    loader.classList.remove('on');
    setAtmosphericBg(text);
  }
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

// ── Sound Effects (Web Audio API) ──
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx=null;
function getAudio(){if(!audioCtx)audioCtx=new AudioCtx();return audioCtx;}

function playSound(type){
  try{
    const ctx=getAudio();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    
    switch(type){
      case 'dice':
        osc.frequency.setValueAtTime(800,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200,ctx.currentTime+0.15);
        gain.gain.setValueAtTime(0.15,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.15);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.15);
        break;
      case 'hit':
        osc.type='sawtooth';
        osc.frequency.setValueAtTime(150,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+0.2);
        gain.gain.setValueAtTime(0.2,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.2);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.2);
        break;
      case 'hurt':
        osc.type='square';
        osc.frequency.setValueAtTime(400,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100,ctx.currentTime+0.3);
        gain.gain.setValueAtTime(0.15,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.3);
        break;
      case 'victory':
        [523,659,784].forEach((f,i)=>{
          const o=ctx.createOscillator();const g=ctx.createGain();
          o.connect(g);g.connect(ctx.destination);
          o.frequency.setValueAtTime(f,ctx.currentTime+i*0.15);
          g.gain.setValueAtTime(0.12,ctx.currentTime+i*0.15);
          g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+i*0.15+0.4);
          o.start(ctx.currentTime+i*0.15);o.stop(ctx.currentTime+i*0.15+0.4);
        });
        break;
      case 'death':
        osc.type='sawtooth';
        osc.frequency.setValueAtTime(300,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+0.8);
        gain.gain.setValueAtTime(0.15,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.8);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.8);
        break;
      case 'item':
        osc.frequency.setValueAtTime(600,ctx.currentTime);
        osc.frequency.setValueAtTime(900,ctx.currentTime+0.08);
        gain.gain.setValueAtTime(0.1,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.2);
        osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.2);
        break;
    }
  }catch(e){}
}
