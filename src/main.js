// ============================================================
// MAIN — travel, encounters, loot, hotkeys, init
// ============================================================
let currentAudio = null;
let currentTrack = null;

function travelTo(sceneId, opts = {}){
  const scene = SCENES[sceneId];
  if(!scene){ log('Cannot go there.', 'warn'); return; }
  if(scene.requires && !checkRequires(scene.requires)){ log('The way is not yet open.', 'warn'); return; }

  const changed = GS.scene !== sceneId;
  GS.scene = sceneId;
  if(changed){
    log('→ '+scene.name, 'info');
    advanceTime(1);
  }

  playSceneMusic(scene);
  renderScene();
  renderSidebar();
  updateStats();

  if(!opts.skipEncounters && changed){
    // Dominion law: arrests, patrols, contraband inspections
    const lawFight = sceneEntryLawCheck(scene);
    if(lawFight){ setTimeout(()=>startCombat(lawFight), 400); autosave(); return; }

    // bounty hunters stalk the wanted
    if(GS.wantedLevel >= 3 && sceneId === 'world_map' && Math.random() < 0.3){
      log('⚠ A bounty hunter has tracked you down!', 'warn');
      setTimeout(()=>startCombat('bounty_hunter'), 400);
      autosave(); return;
    }

    // one-time boss on entry
    if(scene.boss_encounter && !GS.flags[scene.boss_flag]){
      setTimeout(()=>startCombat(scene.boss_encounter), 400);
      autosave(); return;
    }

    // random encounters (night makes the wilds meaner)
    let chance = scene.encounter_chance || 0;
    if(chance > 0 && isNight()) chance += 0.15;
    if(chance > 0 && Math.random() < chance && (scene.encounter_pool||[]).length){
      const pool = scene.encounter_pool;
      setTimeout(()=>startCombat(pool[rnd(0, pool.length-1)]), 400);
    }
  }
  autosave();
}

function playSceneMusic(scene){
  if(!scene.music || scene.music === currentTrack) return;
  if(currentAudio){ currentAudio.pause(); }
  currentTrack = scene.music;
  currentAudio = new Audio(scene.music);
  currentAudio.loop = true;
  currentAudio.volume = 0.35;
  currentAudio.play().catch(()=>{ /* browsers block autoplay until first click */ });
}

function lootArea(){
  const scene = SCENES[GS.scene];
  if(!scene.loot_pool || GS.sceneLooted[GS.scene] === GS.time.day) return;
  GS.sceneLooted[GS.scene] = GS.time.day;
  log('You search the area...', 'info');
  let found = false;
  for(const [id, chance] of scene.loot_pool){
    if(Math.random() < chance && ITEMS[id]){ addItem(id, 1); found = true; }
  }
  if(!found) log('Nothing of value here.', 'warn');
  advanceTime(1);
  renderScene(); renderSidebar(); updateStats();
}

// hotkeys: 1-4 quick-use consumables in combat, Esc closes overlays
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){
    if(document.getElementById('overlay').classList.contains('active')) closeOverlay();
    return;
  }
  if(CB && CB.active && !CB.busy && ['1','2','3','4'].includes(e.key)){
    const consumables = GS.player.inventory.filter(x=>{ const it = ITEMS[x.id]; return it && (it.hp || it.mp); });
    const pick = consumables[Number(e.key)-1];
    if(pick){ cuiHidePicker(); useCombatItem(pick.id); }
  }
});

// ============================================================
// INIT
// ============================================================
function init(){
  resizeCanvas();
  const loaded = loadGame(false);
  if(loaded){
    log('Welcome back to Mythward. ('+timeString()+')', 'info');
    travelTo(GS.scene, { skipEncounters:true });
  } else {
    travelTo('world_map', { skipEncounters:true });
    log('Welcome to Mythward — Island of Fortuna.', 'info');
    log('Year 500 Post-Atlas. The Rift tears wider every day.', 'info');
    log('Click the map to travel. Click NPCs to talk. Keys 1-4 quick-use potions in combat.', 'info');
  }
  updateStats();
  renderSidebar();
}

document.addEventListener('DOMContentLoaded', init);
