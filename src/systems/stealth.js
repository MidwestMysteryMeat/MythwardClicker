// ============================================================
// STEALTH / CRIME SYSTEM
// Wanted level 0 (clean) -> 5 (entire Dominion hostile)
// ============================================================
const WANTED_DESC = [
  'Clean record.',
  'Guards are suspicious. Shop prices +10%.',
  'Guards hostile. Legal shops refuse you service.',
  'Arrest on sight. Bounty hunters are tracking you.',
  'Dominion guards attack on sight.',
  'The entire Dominion is hostile.',
];

function addWanted(n = 1){
  GS.wantedLevel = clamp(GS.wantedLevel + n, 0, 5);
  if(n > 0) log('⚠ Wanted level: '+GS.wantedLevel+' — '+WANTED_DESC[GS.wantedLevel], 'warn');
  else if(GS.wantedLevel === 0) log('Your record is clean again.', 'info');
  else log('Wanted level reduced to '+GS.wantedLevel+'.', 'info');
  updateStats();
}

// Core stealth check: d20 + DEX mod + stealth skill vs DC (modified per spec)
function stealthCheck(baseDC, opts = {}){
  let dc = baseDC;
  const scene = SCENES[GS.scene] || {};
  const witnesses = opts.witnesses !== undefined ? opts.witnesses : (scene.npcs||[]).filter(id=>NPCS[id] && npcPresent(NPCS[id])).length;
  dc += witnesses * 2;
  if(scene.guards) dc += 4;
  if(isNight() || scene.dark) dc -= 4;   // poor light: easier to act unseen
  const r = d20() + stealthSkill();
  return { success: r >= dc, roll: r, dc };
}

function hasNearbyAuthority(){
  const s = SCENES[GS.scene] || {};
  if(s.guards) return true;
  return (s.npcs||[]).some(id=>{ const n = NPCS[id]; return n && n.hostile_if_wanted && npcPresent(n); });
}

// Buying/using illegal goods in Dominion territory with authority around
function illegalActCheck(what){
  const scene = SCENES[GS.scene] || {};
  if(!scene.dominion || !hasNearbyAuthority()) return true;
  const res = stealthCheck(12);
  if(res.success){
    log('You '+what+' unnoticed. ('+res.roll+' vs DC '+res.dc+')', 'warn');
    return true;
  }
  addWanted(1);
  log('⚠ Caught: '+what+'! ('+res.roll+' vs DC '+res.dc+')', 'warn');
  return false;
}

// ---------- pickpocketing ----------
function pickpocket(npcId){
  const npc = NPCS[npcId];
  if(!npc) return;
  closeOverlay();
  const res = stealthCheck(10 + (npc.alertness || 5), { witnesses: 1 });
  if(res.success){
    const take = rnd(5, 15 + (npc.willpower || 5) * 3);
    addGold(take);
    GS.player.skills.sleight += 1;
    log('You lift '+take+' gold from '+npc.name+'. ('+res.roll+' vs DC '+res.dc+')', 'warn');
  } else {
    log(npc.name+' catches your hand in their purse! ('+res.roll+' vs DC '+res.dc+')', 'warn');
    addWanted(1);
    if(GS.wantedLevel >= 3 && hasNearbyAuthority()){
      startCombat('guard');
    }
  }
}

// ---------- bribes & cooling off ----------
function bribeCost(){ return GS.wantedLevel * 50; }
function bribePenn(){
  closeOverlay();
  if(GS.wantedLevel === 0){ log('Captain Penn: "Your record is clean. Keep it that way."', 'info'); return; }
  const cost = bribeCost();
  if(GS.player.gold < cost){ log('You need '+cost+' gold to make this go away.', 'warn'); return; }
  GS.player.gold -= cost;
  GS.wantedLevel = 0;
  log('Captain Penn pockets '+cost+' gold. "What charges? I see no charges."', 'warn');
  updateStats();
}

// sleeping at the inn cools one wanted level
function restWantedDecay(){
  if(GS.wantedLevel > 0){
    GS.wantedLevel--;
    log('The heat dies down while you sleep. Wanted level: '+GS.wantedLevel, 'info');
  }
}

// ---------- entry checks when travelling into a scene ----------
function sceneEntryLawCheck(scene){
  if(!scene.dominion) return null;
  // wanted 3+: guards attack in guarded scenes
  if(scene.guards && GS.wantedLevel >= 3){
    log('⚠ "There! The outlaw!" Guards move to arrest you!', 'warn');
    return 'guard';
  }
  if(GS.wantedLevel >= 4){
    log('⚠ A Dominion patrol attacks on sight!', 'warn');
    return 'guard';
  }
  // random contraband inspection in guarded scenes
  if(scene.guards && carryingIllegal() && Math.random() < 0.25){
    log('A guard waves you over for an inspection...', 'warn');
    const res = stealthCheck(12);
    if(res.success){
      log('You palm the contraband past the search. ('+res.roll+' vs DC '+res.dc+')', 'warn');
    } else {
      const seized = GS.player.inventory.filter(s=>ITEMS[s.id]?.illegal);
      for(const s of seized) removeItem(s.id, s.qty);
      addWanted(1);
      log('⚠ Contraband seized! ('+res.roll+' vs DC '+res.dc+')', 'warn');
    }
  }
  return null;
}
