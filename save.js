// ============================================================
// SAVE / LOAD — localStorage persistence
// ============================================================
const SAVE_KEY = 'mythward_save_v2';

function saveGame(announce){
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify(GS));
    if(announce) log('💾 Game saved.', 'info');
    return true;
  }catch(e){
    log('Save failed: '+e.message, 'warn');
    return false;
  }
}

function autosave(){ saveGame(false); }

function loadGame(announce){
  const raw = localStorage.getItem(SAVE_KEY);
  if(!raw){ if(announce) log('No save found.', 'warn'); return false; }
  try{
    const data = JSON.parse(raw);
    if(!data.player || !data.scene) throw new Error('corrupt save');
    // merge onto a fresh state so new fields added by updates get defaults
    const fresh = freshState();
    GS = { ...fresh, ...data, player: { ...fresh.player, ...data.player, skills: { ...fresh.player.skills, ...(data.player.skills||{}) }, equip: { ...fresh.player.equip, ...(data.player.equip||{}) } }, rep: { ...fresh.rep, ...(data.rep||{}) }, time: { ...fresh.time, ...(data.time||{}) } };
    if(!SCENES[GS.scene]) GS.scene = 'world_map';
    if(announce) log('📂 Game loaded — '+timeString()+', '+SCENES[GS.scene].name, 'info');
    updateStats(); renderScene(); renderSidebar();
    return true;
  }catch(e){
    log('Load failed: '+e.message, 'warn');
    return false;
  }
}

function newGame(){
  closeOverlay();
  GS = freshState();
  localStorage.removeItem(SAVE_KEY);
  log('✦ A new legend begins.', 'info');
  travelTo('world_map', { skipEncounters:true });
  updateStats(); renderSidebar();
}

function confirmNewGame(){
  const box = document.getElementById('overlay-box');
  box.innerHTML = '<h2>Start a new game?</h2><div class="dlg-text">Your current progress and save will be erased.</div>'+
    '<div class="dlg-options">'+
    '<button class="dlg-btn" onclick="newGame()">Yes — wipe it and start over</button>'+
    '<button class="dlg-btn" onclick="closeOverlay()">Cancel</button></div>';
  document.getElementById('overlay').classList.add('active');
}
