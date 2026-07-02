// ============================================================
// SCENE RENDERING — canvas background + DOM layer (NPCs, exits, tools, loot)
// ============================================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const bgImageCache = {};

function resizeCanvas(){
  const area = document.getElementById('game-area');
  canvas.width = area.clientWidth;
  canvas.height = area.clientHeight;
  renderScene();
}
window.addEventListener('resize', resizeCanvas);

function renderScene(){
  const scene = SCENES[GS.scene];
  if(!scene) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if(GS.scene === 'world_map'){
    drawWorldMap(W, H);
  } else {
    ctx.fillStyle = scene.bg || '#1a1520';
    ctx.fillRect(0, 0, W, H);
    if(scene.bgImg){
      const img = bgImageCache[scene.bgImg] || (bgImageCache[scene.bgImg] = Object.assign(new Image(), { src: scene.bgImg }));
      if(img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, W, H);
      else img.onload = ()=>{ if(GS.scene === scene.id) renderScene(); };
    }
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, H-50, W, 50);
    ctx.fillStyle = '#8a7a5a';
    ctx.font = '12px Georgia';
    ctx.fillText(scene.desc || '', 10, H-20, W-20);
  }

  // night tint
  if(isNight()){
    ctx.fillStyle = 'rgba(10,10,45,0.35)';
    ctx.fillRect(0, 0, W, H);
  }

  // scene name band (world map draws its own title)
  if(GS.scene !== 'world_map'){
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, 30);
    ctx.fillStyle = '#c8a84b';
    ctx.font = 'bold 14px Georgia';
    ctx.fillText(scene.name + (isNight() ? '  🌙' : ''), 10, 20);
  }

  renderSceneLayer();
}

function drawWorldMap(W, H){
  const grd = ctx.createRadialGradient(W/2, H/2, 20, W/2, H/2, W/2);
  grd.addColorStop(0, '#1a3a15');
  grd.addColorStop(0.5, '#0d2010');
  grd.addColorStop(1, '#08100a');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#0a3060';
  ctx.lineWidth = 40;
  ctx.strokeRect(0, 0, W, H);
  ctx.fillStyle = '#1a4015';
  ctx.beginPath();
  ctx.ellipse(W*0.45, H*0.52, W*0.38, H*0.42, 0, 0, Math.PI*2);
  ctx.fill();
  // the Rift on the northern horizon
  ctx.fillStyle = 'rgba(140,60,220,0.5)';
  ctx.beginPath();
  ctx.ellipse(W*0.82, H*0.12, W*0.06, H*0.05, 0.4, 0, Math.PI*2);
  ctx.fill();
  // roads
  ctx.strokeStyle = '#3a3020'; ctx.lineWidth = 3; ctx.setLineDash([6,4]);
  ctx.beginPath(); ctx.moveTo(W*0.3, H*0.48); ctx.lineTo(W*0.55, H*0.32); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.3, H*0.48); ctx.lineTo(W*0.72, H*0.62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.3, H*0.48); ctx.lineTo(W*0.18, H*0.67); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.55, H*0.32); ctx.lineTo(W*0.82, H*0.22); ctx.stroke();
  ctx.setLineDash([]);
  // location markers
  for(const ex of (SCENES.world_map.exits||[])){
    if(ex.requires && !checkRequires(ex.requires)) continue;
    ctx.fillStyle = '#7ac87a';
    ctx.beginPath(); ctx.arc(ex.x*W, ex.y*H - 30, 8, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#c8a84b'; ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, 36);
  ctx.fillStyle = '#c8a84b'; ctx.font = 'bold 16px Georgia';
  ctx.fillText('Island of Fortuna — Year 500 Post-Atlas', 10, 22);
  ctx.fillStyle = '#6a6080'; ctx.font = '11px Georgia';
  ctx.fillText('The Rift glows on the northern horizon.', 10, H-8);
}

// DOM layer: NPC sprites, exit buttons, crafting stations, loot search
function renderSceneLayer(){
  const layer = document.getElementById('npc-layer');
  layer.innerHTML = '';
  const scene = SCENES[GS.scene];
  if(!scene) return;
  const W = canvas.width, H = canvas.height;

  // NPCs (respecting working hours)
  for(const npcId of (scene.npcs||[])){
    const npc = NPCS[npcId];
    if(!npc) continue;
    if(!npcPresent(npc)) continue;
    const el = document.createElement('div');
    el.className = 'npc-sprite';
    el.style.left = (npc.x * W) + 'px';
    el.style.top  = (npc.y * H) + 'px';
    const img = document.createElement('img');
    img.src = npc.img;
    img.onerror = ()=>{ img.removeAttribute('src'); };
    const label = document.createElement('div');
    label.className = 'npc-label';
    label.textContent = npc.name;
    el.appendChild(img);
    el.appendChild(label);
    el.addEventListener('click', ()=>{ openNPCDialogue(npcId); });
    layer.appendChild(el);
  }

  // Exits
  for(const ex of (scene.exits||[])){
    if(ex.requires && !checkRequires(ex.requires)) continue;
    addLayerButton(layer, ex.label, ex.x*W, ex.y*H, '', ()=>{ travelTo(ex.to); });
  }

  // Crafting stations
  const toolDefs = { alchemy:['⚗ Alchemy Bench', openAlchemy], enchanting:['✦ Enchanting Table', openEnchanting], spellmaking:['✴ Spirit Altar', openSpellmaking] };
  let ty = 0.30;
  for(const t of (scene.tools||[])){
    const [label, fn] = toolDefs[t] || [];
    if(!label) continue;
    addLayerButton(layer, label, W*0.22, H*ty, 'tool-btn', fn);
    ty += 0.12;
  }

  // Loot search (resets daily)
  if(scene.loot_pool && GS.sceneLooted[GS.scene] !== GS.time.day){
    addLayerButton(layer, '🎁 Search Area', W*0.5, H*0.75, 'loot-btn', lootArea);
  }

  // Rift Gate finale
  if(scene.finale && !GS.gameOver){
    addLayerButton(layer, '🌀 Approach the Rift', W*0.5, H*0.45, 'loot-btn', openRiftFinale);
  }
}

function addLayerButton(layer, label, x, y, extraClass, onclick){
  const btn = document.createElement('button');
  btn.className = 'exit-btn' + (extraClass ? ' '+extraClass : '');
  btn.textContent = label;
  btn.style.left = x+'px';
  btn.style.top = y+'px';
  btn.onclick = onclick;
  layer.appendChild(btn);
}
