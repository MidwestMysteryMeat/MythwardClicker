// ============================================================
// UI — sidebar tabs, dialogue, shops, services
// ============================================================

// ---------- sidebar ----------
function showTab(t, btn){
  GS.currentTab = t;
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  if(btn) btn.classList.add('active');
  else document.querySelector('.tab[data-tab="'+t+'"]')?.classList.add('active');
  renderSidebar();
}

function renderSidebar(){
  const tc = document.getElementById('tab-content');
  tc.innerHTML = '';
  if(GS.currentTab === 'inv') renderInventoryTab(tc);
  if(GS.currentTab === 'equip') renderEquipTab(tc);
  if(GS.currentTab === 'quests') renderQuestsTab(tc);
  if(GS.currentTab === 'magic') renderMagicTab(tc);
}

function renderInventoryTab(tc){
  for(const slot of GS.player.inventory){
    const item = ITEMS[slot.id]; if(!item) continue;
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.title = (item.desc || item.name) + ' · weight '+(item.w||1);
    row.innerHTML = '<img src="'+item.img+'" onerror="this.removeAttribute(\'src\')">'+
      '<div class="iname">'+esc(item.name)+(item.illegal?'<span style="color:#e05a5a;font-size:9px"> !</span>':'')+'</div>'+
      '<div class="iqty">x'+slot.qty+'</div>';
    row.addEventListener('click', ()=>{ useOrEquipItem(slot.id); });
    tc.appendChild(row);
  }
  if(!GS.player.inventory.length){
    tc.innerHTML = '<div style="color:#4a4a6a;padding:8px">Inventory empty.</div>';
  }
  const wt = document.createElement('div');
  wt.style.cssText = 'margin-top:8px;font-size:11px;color:'+(isOverloaded()?'#e05a5a':'#6a6080');
  wt.textContent = 'Carry: '+carryWeight()+' / '+maxCarry()+(isOverloaded()?' — OVERLOADED (harder to flee, slower reflexes)':'');
  tc.appendChild(wt);
}

function renderEquipTab(tc){
  for(const s of EQUIP_SLOTS){
    const iid = GS.player.equip[s];
    const item = iid ? ITEMS[iid] : null;
    const enc = GS.player.enchants[s];
    const row = document.createElement('div');
    row.className = 'equip-slot';
    if(item){
      row.innerHTML = '<img src="'+item.img+'" onerror="this.removeAttribute(\'src\')">'+
        '<div><div class="slot-name">'+SLOT_NAMES[s]+'</div><div class="slot-item">'+esc(item.name)+(enc?' <span style="color:#b07ae0">+'+enc.bonus+'</span>':'')+'</div></div>'+
        '<button class="shop-btn" style="margin-left:auto" onclick="unequip(\''+s+'\')">Remove</button>';
    } else {
      row.innerHTML = '<div style="width:28px;height:28px;background:#0d0b15;border:1px solid #2a2035"></div>'+
        '<div><div class="slot-name">'+SLOT_NAMES[s]+'</div><div class="slot-item" style="color:#3a3050">— empty —</div></div>';
    }
    tc.appendChild(row);
  }
  const p = GS.player;
  const stats = document.createElement('div');
  stats.style.cssText = 'margin-top:10px;font-size:11px;color:#6a6080;padding:6px;background:#1a1828;border-radius:3px;line-height:1.6';
  stats.innerHTML = 'ATK: '+playerAtk()+' | DEF: '+playerDef()+'<br>'+
    'STR:'+p.str+' DEX:'+p.dex+' INT:'+p.intl+' CON:'+p.con+'<br>'+
    'Alchemy:'+p.skills.alchemy+' Stealth:'+stealthSkill()+' Persuasion:'+p.skills.persuasion+' Sleight:'+p.skills.sleight+'<br>'+
    'Reputation — Dominion:'+GS.rep.dominion+' Guild:'+GS.rep.guild+' Elves:'+GS.rep.elf+'<br>'+
    'Wanted: '+GS.wantedLevel+' — '+WANTED_DESC[GS.wantedLevel]+
    (p.blessed>0?'<br><span style="color:#e0d080">✚ Blessed for next '+p.blessed+' fight(s)</span>':'');
  tc.appendChild(stats);
}

function renderQuestsTab(tc){
  if(!GS.activeQuests.length && !GS.completedQuests.length){
    tc.innerHTML = '<div style="color:#4a4a6a;padding:8px">No active quests. Talk to NPCs — the Mayor, the Guild, the Temple.</div>';
    return;
  }
  for(const q of GS.activeQuests){
    const ready = isQuestReady(q);
    const qd = document.createElement('div');
    qd.style.cssText = 'border:1px solid '+(ready?'#3a6a3a':'#2a3050')+';border-radius:3px;padding:6px;margin-bottom:6px';
    qd.innerHTML = '<div style="color:#c8a84b;font-size:12px">'+esc(q.name)+(ready?' <span style="color:#7ac87a">✓ ready</span>':'')+'</div>'+
      '<div style="color:#6a6080;font-size:11px;margin:2px 0">'+esc(q.desc)+'</div>'+
      q.objectives.map(o=>'<div style="color:'+(o.current>=o.count?'#7ac87a':'#d4c5a0')+';font-size:11px">• '+esc(objectiveLabel(o))+'</div>').join('')+
      (ready?'<div style="color:#7ac87a;font-size:10px;margin-top:2px">Return to '+esc(NPCS[turninNpc(q)]?.name || turninNpc(q))+'</div>':'');
    tc.appendChild(qd);
  }
  if(GS.completedQuests.length){
    const cd = document.createElement('div');
    cd.style.cssText = 'color:#3a6a3a;font-size:11px;margin-top:8px';
    cd.textContent = 'Completed: '+GS.completedQuests.map(id=>QUESTS[id]?.name || id).join(', ');
    tc.appendChild(cd);
  }
}

function renderMagicTab(tc){
  tc.innerHTML = '<div style="color:#6a6080;font-size:11px;margin-bottom:6px">Crafted spells (permanent)</div>';
  if(!GS.player.spells.length){
    tc.innerHTML += '<div style="color:#4a4a6a;font-size:11px;margin-bottom:8px">None yet. Bind spells at a Spirit Altar (Goblin Haven, Calidar Ruins).</div>';
  }
  for(const sp of GS.player.spells){
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.innerHTML = '<div style="width:32px;text-align:center;font-size:18px">✴</div>'+
      '<div class="iname">'+esc(sp.name)+(sp.illegal?'<span style="color:#e05a5a;font-size:9px"> !</span>':'')+'</div>'+
      '<div class="iqty">'+sp.mpCost+' MP</div>';
    row.title = (sp.dmg?sp.dmg+' dmg ':'')+(sp.stun?'stun '+sp.stun+' ':'')+(sp.heal?'heal '+sp.heal+' ':'')+(sp.burn?'burns':'');
    tc.appendChild(row);
  }
  tc.innerHTML += '<div style="color:#6a6080;font-size:11px;margin:8px 0 4px">Scrolls (single use)</div>';
  const scrolls = GS.player.inventory.filter(x=>ITEMS[x.id]?.type === 'scroll');
  if(!scrolls.length) tc.innerHTML += '<div style="color:#4a4a6a;font-size:11px">No scrolls in inventory.</div>';
  for(const slot of scrolls){
    const item = ITEMS[slot.id];
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.innerHTML = '<img src="'+item.img+'" onerror="this.removeAttribute(\'src\')">'+
      '<div class="iname">'+esc(item.name)+'</div><div class="iqty">x'+slot.qty+'</div>';
    tc.appendChild(row);
  }
  tc.innerHTML += '<hr style="border-color:#1a1828;margin:8px 0"><div style="color:#6a6080;font-size:11px;line-height:1.6">'+
    'Stations:<br>⚗ Alchemy — Inn, Dark Elf Quarter<br>✦ Enchanting — Forge, Calidar Ruins<br>✴ Spellmaking — Goblin Haven, Calidar Ruins</div>';
}

function useOrEquipItem(iid){
  const item = ITEMS[iid]; if(!item) return;
  if(item.slot){
    const prev = GS.player.equip[item.slot];
    if(prev) addItem(prev, 1, true);
    GS.player.equip[item.slot] = iid;
    removeItem(iid, 1);
    delete GS.player.enchants[item.slot];   // enchants bind to the specific worn item
    GS.player.maxMp = playerMaxMp();
    GS.player.mp = Math.min(GS.player.mp, GS.player.maxMp);
    log('Equipped: '+item.name, 'info');
  } else if(item.hp || item.mp){
    if(item.hp) GS.player.hp = Math.min(GS.player.maxHp, GS.player.hp + item.hp);
    if(item.mp) GS.player.mp = Math.min(GS.player.maxMp, GS.player.mp + item.mp);
    removeItem(iid, 1);
    log('Used '+item.name+'.', 'info');
  } else {
    log(item.name+': '+(item.desc || '(no immediate use)'), 'info');
  }
  updateStats(); renderSidebar();
}

function unequip(slot){
  const iid = GS.player.equip[slot];
  if(iid){
    GS.player.equip[slot] = null;
    delete GS.player.enchants[slot];
    addItem(iid, 1, true);
    GS.player.maxMp = playerMaxMp();
    GS.player.mp = Math.min(GS.player.mp, GS.player.maxMp);
    log('Removed: '+ITEMS[iid]?.name, 'info');
  }
  updateStats(); renderSidebar();
}

// ---------- dialogue ----------
function openNPCDialogue(npcId){
  const npc = NPCS[npcId];
  if(!npc) return;

  if(npc.hostile_if_wanted && GS.wantedLevel >= 3){
    const lines = npc.dialogue.wanted || ["You're under arrest!"];
    showDialogue(npc, lines[0], [
      {label:'⚔ Fight!', action:()=>{ closeOverlay(); startCombat('guard'); }},
      {label:'💨 Flee to the world map', action:()=>{ closeOverlay(); travelTo('world_map', { skipEncounters:true }); }},
      {label:'💰 Bribe ('+bribeCost()+'g)', action:bribePenn},
    ]);
    return;
  }

  const lines = npc.dialogue.default || [];
  const line = lines[rnd(0, lines.length-1)] || '...';
  const opts = [];

  // quest turn-ins first (highlighted)
  for(const q of npcQuestTurnins(npcId)){
    opts.push({label:'✓ Turn in: '+q.name, cls:'quest-ready', action:()=>{ closeOverlay(); turnInQuest(q.id); }});
  }
  // quest offers
  for(const q of npcQuestOffers(npcId)){
    opts.push({label:'❔ About work: '+q.name, action:()=>{ closeOverlay(); openQuestOffer(q.id, npcId); }});
  }

  if(npc.shop){
    const shop = SHOPS[npc.shop];
    if(shop && shopRefusesService(shop)) opts.push({label:'🛒 Browse goods (refused — you\'re wanted)', disabled:true});
    else opts.push({label:'🛒 Browse goods', action:()=>{ closeOverlay(); openShop(npc.shop); }});
  }
  if(npc.service === 'rest') opts.push({label:'🛏 Rest until morning (10g — full heal)', action:()=>{ closeOverlay(); serviceRest(); }});
  if(npc.service === 'heal'){
    opts.push({label:'✚ Heal me (20g)', action:()=>{ closeOverlay(); serviceHeal(); }});
    opts.push({label:'✚ Blessing of Helios (15g — +4 rolls next fight)', action:()=>{ closeOverlay(); serviceBless(); }});
  }
  if(npc.service === 'bribe' && GS.wantedLevel > 0){
    opts.push({label:'💰 "About those charges..." ('+bribeCost()+'g)', action:bribePenn});
  }
  if(npc.teaches){
    const gate = npc.teachRequires;
    if(gate && GS.rep[gate.rep] < gate.min) opts.push({label:'✨ Training (requires '+gate.rep+' reputation '+gate.min+'+)', disabled:true});
    else opts.push({label:'✨ Learn a skill', action:()=>{ closeOverlay(); openTeaching(npcId); }});
  }
  if(GS.scene === 'ashford_inn' && npcId === 'aleva'){
    opts.push({label:'👁 Ask about the cellar...', action:()=>{ closeOverlay(); log('You find a hidden door behind a shelf.', 'info'); travelTo('ashford_cellar'); }});
  }
  // crime: pickpocket anyone who isn't watching too hard
  opts.push({label:'🖐 Pickpocket (Sleight check)', action:()=>{ pickpocket(npcId); }});
  opts.push({label:'Leave', action:closeOverlay});
  showDialogue(npc, line, opts);
}

function showDialogue(npc, text, options){
  const box = document.getElementById('overlay-box');
  box.innerHTML = '<h2>'+esc(npc.name)+'</h2>'+
    '<div class="dlg-portrait"><img src="'+npc.img+'" onerror="this.removeAttribute(\'src\')">'+
    '<div class="dlg-text">'+esc(text)+'</div></div>'+
    '<div class="dlg-options"></div>';
  const opts = box.querySelector('.dlg-options');
  for(const o of options){
    const btn = document.createElement('button');
    btn.className = 'dlg-btn' + (o.cls ? ' '+o.cls : '');
    btn.textContent = o.label;
    if(o.disabled) btn.disabled = true;
    else btn.onclick = o.action;
    opts.appendChild(btn);
  }
  document.getElementById('overlay').classList.add('active');
}

function closeOverlay(){
  document.getElementById('overlay').classList.remove('active');
}

function openQuestOffer(qid, npcId){
  const q = QUESTS[qid]; if(!q) return;
  const npc = NPCS[npcId];
  const r = q.reward || {};
  const rewardText = [r.gold ? r.gold+'g' : '', r.xp ? r.xp+' XP' : '', ...(r.items||[]).map(i=>ITEMS[i]?.name)].filter(Boolean).join(', ');
  showDialogue(npc, q.desc + '\n\nReward: ' + rewardText, [
    {label:'✓ Accept quest', action:()=>{ closeOverlay(); acceptQuest(qid); }},
    {label:'Not now', action:closeOverlay},
  ]);
}

function openTeaching(npcId){
  const npc = NPCS[npcId];
  const opts = [];
  for(const tid of (npc.teaches||[])){
    const it = ITEMS[tid];
    if(!it) continue;
    const cost = it.val * 2;
    opts.push({label:'Learn '+it.name+' ('+cost+'g)', action:()=>{
      if(GS.player.gold < cost){ log('Not enough gold.', 'warn'); closeOverlay(); return; }
      GS.player.gold -= cost;
      addItem(tid, 1);
      log('Learned: '+it.name, 'info');
      closeOverlay(); updateStats(); renderSidebar();
    }});
  }
  opts.push({label:'Not today', action:closeOverlay});
  showDialogue(npc, 'What would you like to learn?', opts);
}

// ---------- services ----------
function serviceRest(){
  if(GS.player.gold < 10){ log('Not enough gold to rest.', 'warn'); return; }
  GS.player.gold -= 10;
  GS.player.hp = GS.player.maxHp;
  GS.player.mp = GS.player.maxMp;
  // sleep until 8:00 next morning
  GS.time.day++; GS.time.hour = 8;
  restWantedDecay();
  GS.haggleDeal = null;
  log('You rest until morning and recover fully. (-10g)', 'info');
  updateStats(); renderScene(); renderSidebar();
  autosave();
}
function serviceHeal(){
  if(GS.player.gold < 20){ log('Not enough gold for healing.', 'warn'); return; }
  GS.player.gold -= 20;
  GS.player.hp = GS.player.maxHp;
  log("Sister Mirela's light heals your wounds. (-20g)", 'info');
  updateStats();
}
function serviceBless(){
  if(GS.player.gold < 15){ log('Not enough gold for a blessing.', 'warn'); return; }
  GS.player.gold -= 15;
  GS.player.blessed++;
  log('✚ Helios watches over you. (+4 to rolls for your next fight)', 'magic');
  updateStats(); renderSidebar();
}

// ---------- shop ----------
let _openShopId = null;
function currentShopId(){ return _openShopId; }

function openShop(shopId){
  const shop = SHOPS[shopId]; if(!shop) return;
  _openShopId = shopId;
  refreshShop();
  document.getElementById('overlay').classList.add('active');
}

function refreshShop(){
  const shop = SHOPS[_openShopId]; if(!shop) return;
  const box = document.getElementById('overlay-box');
  let html = '<h2>🛒 '+esc(shop.name)+'</h2>'+
    '<div style="color:#8a7a5a;font-size:11px;margin-bottom:8px">Your gold: <span style="color:#c8a84b">'+GS.player.gold+'</span>'+
    (shop.illegal?' · <span style="color:#e05a5a">black-market stall</span>':'')+'</div><div id="shop-list">';
  for(const iid of shop.stock){
    const item = ITEMS[iid]; if(!item) continue;
    const price = buyPrice(item, shop);
    html += '<div class="shop-item"><img src="'+item.img+'" onerror="this.removeAttribute(\'src\')">'+
      '<div class="sname">'+esc(item.name)+(item.illegal?'<span style="color:#e05a5a;font-size:10px"> [ILLEGAL]</span>':'')+'</div>'+
      '<div class="sprice">'+price+'g</div>'+
      '<button class="shop-btn" onclick="buyItem(\''+iid+'\')">Buy</button></div>';
  }
  html += '</div>';
  if(shop.buys){
    html += '<hr style="border-color:#2a2035;margin:8px 0"><h3>Sell items</h3><div id="sell-list">';
    for(const slot of GS.player.inventory){
      const item = ITEMS[slot.id];
      if(!item || item.val === 0) continue;
      const sp = sellPrice(item, shop);
      html += '<div class="shop-item"><img src="'+item.img+'" onerror="this.removeAttribute(\'src\')">'+
        '<div class="sname">'+esc(item.name)+' (x'+slot.qty+')</div>'+
        '<div class="sprice">'+sp+'g</div>'+
        '<button class="shop-btn" onclick="sellItem(\''+slot.id+'\')">Sell</button></div>';
    }
    html += '</div>';
  }
  html += '<div style="display:flex;gap:8px;margin-top:10px">'+
    '<button class="dlg-btn" style="flex:1" onclick="haggle(\''+_openShopId+'\')">🎲 Haggle (Persuasion)</button>'+
    '<button class="dlg-btn" style="flex:1" onclick="closeShop()">Leave shop</button></div>';
  box.innerHTML = html;
}

function closeShop(){ _openShopId = null; closeOverlay(); }

function buyItem(iid){
  const shop = SHOPS[_openShopId];
  const item = ITEMS[iid];
  if(!shop || !item) return;
  const price = buyPrice(item, shop);
  if(GS.player.gold < price){ log('Not enough gold.', 'warn'); return; }
  if(item.illegal && !illegalActCheck('buy contraband')){ refreshShop(); return; }
  GS.player.gold -= price;
  addItem(iid, 1);
  refreshShop(); updateStats(); renderSidebar();
}

function sellItem(iid){
  const shop = SHOPS[_openShopId];
  if(!shop || !hasItem(iid)) return;
  const price = sellPrice(ITEMS[iid], shop);
  removeItem(iid, 1);
  questProgressItem();
  addGold(price);
  log('Sold: '+ITEMS[iid]?.name+' for '+price+'g', 'loot');
  refreshShop(); updateStats(); renderSidebar();
}
