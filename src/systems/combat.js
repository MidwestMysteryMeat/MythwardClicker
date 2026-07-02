// ============================================================
// COMBAT SYSTEM — turn-based with initiative, status effects,
// enemy AI (melee/ranged/magic), and 3-phase bosses.
// ============================================================
let CB = null;

function newEffects(){ return { poison:0, burn:0, stun:0, curse:0, bless:0 }; }

function startCombat(enemyId, opts = {}){
  const t = ENEMIES[enemyId];
  if(!t){ log('No enemy found: '+enemyId, 'warn'); return; }
  CB = {
    enemy: { ...t, hp: t.hp, maxHp: t.hp },
    eff: { p: newEffects(), e: newEffects() },
    phase: 1,
    defending: false,
    busy: false,
    active: true,
    finale: !!opts.finale,
    usedIllegalMagic: false,
  };
  // temple blessing carries into the fight
  if(GS.player.blessed > 0){
    GS.player.blessed--;
    CB.eff.p.bless = 3;
    log('The blessing of Helios shields you. (+4 to rolls, 3 turns)', 'magic');
  }
  log('⚔ Combat! ' + CB.enemy.name + (t.boss ? ' — BOSS!' : '') + ' attacks!', 'combat');
  cuiOpen(CB.enemy);
  // initiative: d20 + DEX mod vs d20
  const pInit = d20() + statMod(GS.player.dex) - (isOverloaded() ? 4 : 0);
  const eInit = d20();
  if(eInit > pInit){
    cuiLog('<i>'+esc(CB.enemy.name)+' wins initiative! ('+eInit+' vs '+pInit+')</i>');
    CB.busy = true; cuiSetButtons(false); cuiSetTurn(CB.enemy.name+"'s Turn");
    setTimeout(()=>{ enemyTurn(); }, 700);
  } else {
    cuiLog('<i>You win initiative. ('+pInit+' vs '+eInit+')</i>');
    cuiSetButtons(true); cuiSetTurn('Your Turn');
  }
}

function rollBonus(eff){ return (eff.bless>0 ? 4 : 0) - (eff.curse>0 ? 4 : 0); }

// dots + duration ticks at the start of a side's turn; returns true if that side died
function tickEffects(eff, who, isPlayer){
  if(eff.poison > 0){ damageSide(isPlayer, 5); eff.poison--; cuiLog('☠ '+who+' takes 5 poison damage.'); }
  if(eff.burn > 0){ damageSide(isPlayer, 8); eff.burn--; cuiLog('🔥 '+who+' takes 8 burn damage.'); }
  if(eff.curse > 0) eff.curse--;
  if(eff.bless > 0) eff.bless--;
  cuiUpdate();
  return isPlayer ? GS.player.hp <= 0 : CB.enemy.hp <= 0;
}
function damageSide(isPlayer, n){
  if(isPlayer) GS.player.hp -= n; else CB.enemy.hp -= n;
}

// ============================================================
// PLAYER TURN
// ============================================================
function combatAction(action){
  if(!CB || !CB.active || CB.busy) return;
  cuiHidePicker();

  // start-of-turn effects on the player
  if(tickEffects(CB.eff.p, 'You', true)){ playerDeath(); return; }
  if(CB.eff.p.stun > 0){
    CB.eff.p.stun--;
    cuiLog('✦ You are stunned and lose your turn!');
    endPlayerTurn();
    return;
  }

  const p = GS.player, e = CB.enemy;
  switch(action){
    case 'attack': {
      const w = getEquippedItem('weapon');
      const mod = (w && w.range ? statMod(p.dex) : statMod(p.str)) + rollBonus(CB.eff.p);
      const raw = d20();
      const hit = raw + mod;
      const ac = 10 + e.def;
      if(raw === 20){
        const dmg = Math.max(1, (playerAtk() + rnd(0,3)) * 2 - e.def);
        e.hp -= dmg;
        cuiLog('CRITICAL! You strike for <b style="color:#e09050">'+dmg+'</b> damage!');
      } else if(hit >= ac){
        const dmg = Math.max(1, playerAtk() + rnd(0,3) - e.def);
        e.hp -= dmg;
        cuiLog('You attack for <b style="color:#e09050">'+dmg+'</b> damage. ('+hit+' vs AC '+ac+')');
      } else {
        cuiLog('Your attack misses! ('+hit+' vs AC '+ac+')');
      }
      break;
    }
    case 'defend':
      CB.defending = true;
      cuiLog('You take a defensive stance. (+4 defense this turn)');
      break;
    case 'flee': {
      const target = 10 + (isOverloaded() ? 4 : 0);
      const r = d20() + statMod(p.dex) + rollBonus(CB.eff.p);
      if(r >= target){
        CB.active = false;
        cuiClose(); CB = null;
        log('You flee from combat!', 'warn');
        travelTo('world_map', { skipEncounters:true });
        return;
      }
      cuiLog('You fail to escape! ('+r+' vs '+target+')'+(isOverloaded()?' Your pack weighs you down.':''));
      break;
    }
    case 'item': return openItemPicker();
    case 'skill': return openSkillPicker();
  }

  if(e.hp <= 0){ combatVictory(); return; }
  endPlayerTurn();
}

function endPlayerTurn(){
  if(!CB || !CB.active) return;
  cuiUpdate(); updateStats();
  CB.busy = true;
  cuiSetButtons(false);
  cuiSetTurn(CB.enemy.name+"'s Turn");
  setTimeout(()=>{ enemyTurn(); }, 650);
}

// ---------- pickers ----------
function openItemPicker(){
  const entries = [];
  for(const slot of GS.player.inventory){
    const it = ITEMS[slot.id];
    if(!it) continue;
    if(it.hp || it.mp || (it.combat && it.type==='potion')){
      entries.push({ label: it.name+' x'+slot.qty, onclick: ()=>{ cuiHidePicker(); useCombatItem(slot.id); } });
    }
  }
  if(!entries.length){ cuiLog('No usable items!'); return; }
  cuiShowPicker(entries);
}

function useCombatItem(iid){
  const it = ITEMS[iid];
  if(!it || !hasItem(iid)) return;
  removeItem(iid, 1);
  if(it.hp){ GS.player.hp = Math.min(GS.player.maxHp, GS.player.hp + it.hp); cuiLog('Used '+esc(it.name)+': <b style="color:#7ac87a">+'+it.hp+' HP</b>'); }
  if(it.mp){ GS.player.mp = Math.min(GS.player.maxMp, GS.player.mp + it.mp); cuiLog('Used '+esc(it.name)+': <b style="color:#5a8ae0">+'+it.mp+' MP</b>'); }
  if(it.dot){ CB.eff.e.poison = Math.max(CB.eff.e.poison, it.dotTurns || 3); cuiLog(esc(it.name)+': the enemy is poisoned!'); if(it.illegal) CB.usedIllegalMagic = true; }
  updateStats(); renderSidebar();
  if(CB.enemy.hp <= 0){ combatVictory(); return; }
  endPlayerTurn();
}

function openSkillPicker(){
  const entries = [];
  for(const sp of GS.player.spells){
    entries.push({ label:'✴ '+sp.name+' ('+sp.mpCost+' MP)', onclick: ()=>{ cuiHidePicker(); castSpell(sp, false); } });
  }
  for(const slot of GS.player.inventory){
    const it = ITEMS[slot.id];
    if(it && it.type==='scroll' && it.combat){
      entries.push({ label:'📜 '+it.name+' x'+slot.qty+' ('+it.mpCost+' MP)', onclick: ()=>{ cuiHidePicker(); castSpell(it, true); } });
    }
  }
  if(!entries.length){ cuiLog('No spells or scrolls!'); return; }
  cuiShowPicker(entries);
}

function castSpell(sp, isScroll){
  const p = GS.player;
  if(p.mp < sp.mpCost){ cuiLog('Not enough MP! ('+p.mp+'/'+sp.mpCost+')'); cuiSetButtons(true); return; }
  p.mp -= sp.mpCost;
  if(isScroll) removeItem(sp.id, 1);
  const e = CB.enemy;
  if(sp.dmg){
    const dmg = Math.max(1, sp.dmg + statMod(p.intl) - Math.floor(e.def/2));
    e.hp -= dmg;
    cuiLog(esc(sp.name)+': <b style="color:#c84bc8">'+dmg+'</b> magic damage!');
  }
  if(sp.stun){ CB.eff.e.stun += sp.stun; cuiLog(esc(sp.name)+': enemy stunned for '+sp.stun+' turn(s)!'); }
  if(sp.burn){ CB.eff.e.burn = Math.max(CB.eff.e.burn, 2); cuiLog('The enemy catches fire!'); }
  if(sp.heal){ p.hp = Math.min(p.maxHp, p.hp + sp.heal); cuiLog('Holy light restores <b style="color:#7ac87a">'+sp.heal+' HP</b>.'); }
  if(sp.illegal) CB.usedIllegalMagic = true;
  updateStats(); renderSidebar();
  if(e.hp <= 0){ combatVictory(); return; }
  endPlayerTurn();
}

// ============================================================
// ENEMY TURN — AI + boss phases
// ============================================================
function phaseMultiplier(){ return CB.phase === 3 ? 2 : CB.phase === 2 ? 1.5 : 1; }

function checkBossPhase(){
  const e = CB.enemy;
  if(!e.boss) return;
  const pct = e.hp / e.maxHp;
  if(CB.phase === 1 && pct <= 0.5){
    CB.phase = 2;
    cuiLog('<b style="color:#e09050">'+esc(e.name)+' becomes ENRAGED!</b>');
  } else if(CB.phase === 2 && pct <= 0.2){
    CB.phase = 3;
    const heal = Math.floor(e.maxHp * 0.1);
    e.hp += heal;
    cuiLog('<b style="color:#e05a5a">'+esc(e.name)+' enters its FINAL FORM and knits its wounds! (+'+heal+' HP)</b>');
  }
}

function enemyTurn(){
  if(!CB || !CB.active) return;
  const e = CB.enemy, p = GS.player;

  if(tickEffects(CB.eff.e, e.name, false)){ combatVictory(); return; }
  checkBossPhase();

  if(CB.eff.e.stun > 0){
    CB.eff.e.stun--;
    cuiLog('✦ '+esc(e.name)+' is stunned!');
    return endEnemyTurn();
  }

  const mul = phaseMultiplier();
  const ai = e.ai || 'melee';

  if(ai === 'magic' && Math.random() < 0.6){
    const pick = rnd(1, 3);
    if(pick === 1){ // drain
      const dmg = Math.max(1, Math.round(e.atk * 0.7 * mul) - Math.floor(playerDef()/2));
      const mpSteal = Math.min(p.mp, 8);
      p.hp -= dmg; p.mp -= mpSteal;
      cuiLog(esc(e.name)+' drains your life: <b style="color:#b07ae0">'+dmg+'</b> damage and '+mpSteal+' MP!');
    } else if(pick === 2){ // curse
      CB.eff.p.curse = Math.max(CB.eff.p.curse, 3);
      cuiLog(esc(e.name)+' hisses a curse! (-4 to your rolls, 3 turns)');
    } else { // dark blast
      let dmg = Math.max(1, Math.round(e.atk * 1.5 * mul) + rnd(-2,2) - playerDef());
      if(CB.defending){ dmg = Math.max(0, dmg - 4); }
      p.hp -= dmg;
      cuiLog(esc(e.name)+' unleashes a dark blast: <b style="color:#e05a5a">'+dmg+'</b> damage!');
    }
  } else {
    // melee / ranged attack
    let atkBonus = 0;
    if(ai === 'ranged'){
      const shield = getEquippedItem('offhand');
      if(!shield || !shield.shield) atkBonus = 2;
    }
    const raw = d20();
    const ac = 9 + Math.floor(playerDef()/3) + (CB.defending ? 4 : 0);
    if(raw + 2 + atkBonus >= ac){
      let dmg = Math.max(1, Math.round(e.atk * mul) + atkBonus + rnd(-2,2) - playerDef());
      if(CB.defending) dmg = Math.max(0, dmg - 4);
      p.hp -= dmg;
      cuiLog(esc(e.name)+' hits for <b style="color:#e05a5a">'+dmg+'</b> damage.');
      if(e.poison && Math.random() < 0.3){
        CB.eff.p.poison = Math.max(CB.eff.p.poison, 3);
        cuiLog('☠ Venom courses through you! (Poisoned, 3 turns)');
      }
    } else {
      cuiLog(esc(e.name)+"'s attack misses you!");
    }
  }

  CB.defending = false;
  updateStats();
  if(p.hp <= 0){ playerDeath(); return; }
  endEnemyTurn();
}

function endEnemyTurn(){
  if(!CB || !CB.active) return;
  CB.busy = false;
  cuiUpdate();
  cuiSetTurn('Your Turn');
  cuiSetButtons(true);
}

// ============================================================
// RESOLUTION
// ============================================================
function combatVictory(){
  if(!CB) return;
  CB.active = false;
  const e = CB.enemy;
  cuiLog('<b style="color:#7ac87a">'+esc(e.name)+' is defeated!</b>');
  log('Victory! Defeated '+e.name, 'info');

  const finale = CB.finale;
  const usedIllegal = CB.usedIllegalMagic;

  const goldAmt = rnd(e.gold[0], e.gold[1]);
  if(goldAmt > 0) addGold(goldAmt);
  addXP(e.xp);
  for(const [iid, chance] of (e.loot||[])){
    if(Math.random() < chance && ITEMS[iid]) addItem(iid, 1);
  }
  questProgressKill(e.id);

  // killing a Dominion guard is a serious crime
  if(e.faction === 'dominion') addWanted(2);

  const scene = SCENES[GS.scene];
  if(scene && scene.boss_encounter === e.id && scene.boss_flag){
    GS.flags[scene.boss_flag] = true;
  }

  setTimeout(()=>{
    cuiClose();
    CB = null;
    // illegal magic seen in Dominion territory
    if(usedIllegal && scene && scene.dominion && hasNearbyAuthority()){
      illegalActCheck('sling forbidden magic');
    }
    if(finale){ showEnding(); }
    renderSidebar(); renderScene(); updateStats();
    autosave();
  }, 1100);
}

function playerDeath(){
  if(!CB) return;
  CB.active = false;
  cuiLog('<b style="color:#e05a5a">You have been defeated!</b>');
  setTimeout(()=>{
    cuiClose();
    CB = null;
    GS.player.hp = Math.floor(GS.player.maxHp * 0.5);
    const lost = GS.player.gold - Math.floor(GS.player.gold * 0.8);
    GS.player.gold -= lost;
    log('You wake in Ashford. '+(lost>0 ? lost+' gold is missing.' : ''), 'warn');
    advanceTime(8);
    travelTo('ashford_square', { skipEncounters:true });
    updateStats(); renderSidebar();
  }, 1400);
}
