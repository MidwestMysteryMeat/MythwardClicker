// ============================================================
// QUEST SYSTEM — accept, track, turn in, endings
// ============================================================
function questAvailable(qid){
  const q = QUESTS[qid];
  if(!q) return false;
  if(GS.completedQuests.includes(qid)) return false;
  if(GS.activeQuests.some(x=>x.id===qid)) return false;
  if(q.requires && !checkRequires(q.requires)) return false;
  return true;
}

function acceptQuest(qid){
  const q = QUESTS[qid];
  if(!questAvailable(qid)) return;
  GS.activeQuests.push(JSON.parse(JSON.stringify(q)));
  for(const [iid, qty] of (q.giveItems || [])) addItem(iid, qty);
  log('Quest accepted: '+q.name, 'info');
  questProgressItem();
  renderSidebar();
}

function objectiveLabel(o){
  return o.label + ' ('+Math.min(o.current, o.count)+'/'+o.count+')';
}

// kill objectives — called from combat victory
function questProgressKill(enemyId){
  for(const q of GS.activeQuests){
    for(const o of q.objectives){
      if(o.type==='kill' && o.target===enemyId && o.current < o.count){
        o.current++;
        log('Quest: '+objectiveLabel(o), 'info');
      }
    }
  }
  renderSidebar();
}

// item objectives — recounted live from inventory whenever items change
function questProgressItem(){
  for(const q of GS.activeQuests){
    for(const o of q.objectives){
      if(o.type==='item' || o.type==='deliver') o.current = countItem(o.target);
    }
  }
}

// craft objectives — called from crafting success
function questProgressCraft(itemId){
  for(const q of GS.activeQuests){
    for(const o of q.objectives){
      if(o.type==='craft' && o.target===itemId && o.current < o.count){
        o.current++;
        log('Quest: '+objectiveLabel(o), 'info');
      }
    }
  }
  renderSidebar();
}

function isQuestReady(q){ return q.objectives.every(o=>o.current >= o.count); }
function turninNpc(q){ return q.turnin || q.giver; }

// quests this NPC can hand out or accept turn-in for right now
function npcQuestOffers(npcId){
  return Object.values(QUESTS).filter(q=>q.giver===npcId && questAvailable(q.id));
}
function npcQuestTurnins(npcId){
  return GS.activeQuests.filter(q=>turninNpc(q)===npcId && isQuestReady(q));
}

function turnInQuest(qid){
  const q = GS.activeQuests.find(x=>x.id===qid);
  if(!q || !isQuestReady(q)) return;
  for(const [iid, qty] of (q.takeItems || [])) removeItem(iid, qty);
  log('★ Quest complete: '+q.name, 'info');
  const r = q.reward || {};
  if(r.gold) addGold(r.gold);
  if(r.xp) addXP(r.xp);
  for(const iid of (r.items||[])) addItem(iid, 1);
  if(r.rep) addRep(r.rep);
  if(q.complete_flag) GS.flags[q.complete_flag] = true;
  GS.activeQuests = GS.activeQuests.filter(x=>x.id!==qid);
  GS.completedQuests.push(qid);
  questProgressItem();
  updateStats(); renderSidebar();
  autosave();
}

// ============================================================
// RIFT GATE FINALE
// ============================================================
function riftFinaleReady(){
  return GS.flags.mines_cleared && GS.flags.vael_dead;
}

function openRiftFinale(){
  const box = document.getElementById('overlay-box');
  if(!riftFinaleReady()){
    const need = [];
    if(!GS.flags.mines_cleared) need.push('• Clear the Salt Mines (the Risen Foreman feeds the tear)');
    if(!GS.flags.vael_dead) need.push('• Destroy Lich Lord Vael beneath Calidar');
    box.innerHTML = '<h2>The Rift Gate</h2><div class="dlg-text">The tear howls with power far beyond you. Something anchors it to this world:\n\n'+esc(need.join('\n'))+'</div>'+
      '<div class="dlg-options"><button class="dlg-btn" onclick="closeOverlay()">Step back</button></div>';
    document.getElementById('overlay').classList.add('active');
    return;
  }
  let html = '<h2>The Rift Gate</h2><div class="dlg-text">With Vael destroyed and the mines silent, the Rift wavers — anchorless, vulnerable. Whatever walks out of it next will decide Fortuna\'s fate. Choose how this ends.</div><div class="dlg-options">';
  for(const end of Object.values(ENDINGS)){
    if(end.require()){
      html += '<button class="dlg-btn quest-ready" onclick="startFinale(\''+end.id+'\')">'+esc(end.choice)+'</button>';
    } else {
      html += '<button class="dlg-btn" disabled>'+esc(end.choice)+' — requires '+esc(end.reqText)+'</button>';
    }
  }
  html += '<button class="dlg-btn" onclick="closeOverlay()">Not yet</button></div>';
  box.innerHTML = html;
  document.getElementById('overlay').classList.add('active');
}

function startFinale(endingId){
  closeOverlay();
  GS.flags.chosen_ending = endingId;
  log('The Rift convulses — something vast steps through!', 'combat');
  startCombat('rift_avatar', { finale:true });
}

function showEnding(){
  const end = ENDINGS[GS.flags.chosen_ending] || ENDINGS.outcast;
  GS.flags.rift_closed = true;
  GS.gameOver = true;
  const box = document.getElementById('overlay-box');
  box.innerHTML = '<h2>'+esc(end.name)+'</h2><div class="dlg-text">'+esc(end.text)+'</div>'+
    '<div class="dlg-options">'+
    '<button class="dlg-btn" onclick="closeOverlay()">Keep wandering Fortuna</button>'+
    '<button class="dlg-btn" onclick="newGame()">Begin a new legend</button></div>';
  document.getElementById('overlay').classList.add('active');
  log('★★★ '+end.name+' — you have finished Mythward! ★★★', 'info');
  autosave();
}
