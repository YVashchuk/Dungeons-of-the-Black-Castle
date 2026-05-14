# Engine extract for group_6 audit

Extracted from src/game_logic.js (1607 lines). Only
group_6-relevant helpers and the renderGame dead-end fix
region. Line numbers reference the live HEAD = fe72347.

---

## passesInventoryCheck

```js
function passesInventoryCheck(ch){
  if(!ch||!ch.inventory_condition) return true;
  if(!S||!S.inventory) return false;
  const cond=ch.inventory_condition;
  if(Array.isArray(cond)) return cond.some(name=>S.inventory.includes(name));
  return S.inventory.includes(cond);
}
```

## passesGoldCheck

```js
function passesGoldCheck(ch){
  if(!ch||ch.gold_condition===undefined||ch.gold_condition===null) return true;
  if(!S) return false;
  return (S.gold||0) >= ch.gold_condition;
}
```

## applyChoiceAcquires

```js
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
```

## applyChoiceGoldCost

```js
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
```

## makePurchaseBtn

```js
function makePurchaseBtn(ch, choiceIndex){
  const btn=document.createElement('button');
  btn.className='choice-btn purchase-btn';
  const cost=ch.gold_cost||0;
  const grantsItems=Array.isArray(ch.grants_items)?ch.grants_items:(ch.grants_items?[ch.grants_items]:[]);
  const grantsStamina=ch.grants_stamina||0;
  // Auto-append price to label if not already mentioned
  let displayLabel=ch.label||'';
  if(!/\d\s*золот/i.test(displayLabel)){
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
  const wouldOverflow=(grantsItems.length>0)&&((S.inventory?S.inventory.length:0)+grantsItems.filter(n=>!S.inventory.includes(n)).length>7);
  let disabled=false;
  let tooltip='';
  if(isBought){
    disabled=true;tooltip='Уже куплено';
    btn.textContent='✓ '+displayLabel;
  } else if(!canAfford){
    disabled=true;tooltip='Не хватает золота ('+S.gold+'/'+cost+')';
  } else if(wouldOverflow){
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
```

## completePurchase

```js
function completePurchase(ch, choiceIndex, grantsItems, grantsStamina, cost){
  if(!S)return;
  // Deduct gold first so any subsequent rerender shows the correct balance.
  S.gold=Math.max(0,S.gold-cost);
  const notifs=['− '+cost+' золотых'];
  logEvent('loss','− '+cost+' золотых','Покупка (§'+S.section+'). Осталось: '+S.gold);
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
    if(S.inventory.length<7){
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
  playSound('item');
  showItemNotification(notifs,'💰 Покупка');
  updateHUD();saveGame();
  // Re-render the current paragraph to refresh shop-button states (bought
  // greys out, no-longer-affordable greys out, etc). Use renderChoices
  // not renderGame to avoid retriggering auto_items.
  const sec=GD[String(S.section)];
  if(sec)renderChoices(sec);
}
```

## renderGame() dead-end check region (commit 9c037b3 engine fix)

Around line 502:

```js
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
  const visibleChoices=sec.choices.filter(ch=>passesInventoryCheck(ch)&&passesGoldCheck(ch));
  if(!inCombatOrLuck&&visibleChoices.length===0&&S.section!==617){
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
```

## auto_items application code

First occurrence around line 417:

```js
  renderChoices(sec);
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
```

## acquires application code (post-choice item grant)

First occurrence around line 655:

```js
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
```

## Inventory de-duplication (relevant for items granted multiple times)

Around line 304:

```js
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

```
