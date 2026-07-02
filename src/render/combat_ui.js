// ============================================================
// COMBAT UI — DOM updates for the combat overlay
// ============================================================
function cuiOpen(enemy){
  document.getElementById('c-enemy-img').src = enemy.img;
  document.getElementById('c-enemy-name').textContent = enemy.name;
  document.getElementById('c-player-img').src = PLAYER_IMG;
  document.getElementById('c-player-name').textContent = GS.player.name;
  document.getElementById('combat-log').innerHTML = '';
  cuiHidePicker();
  document.getElementById('combat-overlay').classList.add('active');
  cuiUpdate();
}

function cuiClose(){
  document.getElementById('combat-overlay').classList.remove('active');
  cuiHidePicker();
}

function cuiUpdate(){
  if(!CB) return;
  const p = GS.player, e = CB.enemy;
  const php = clamp(p.hp / p.maxHp * 100, 0, 100);
  const ehp = clamp(e.hp / e.maxHp * 100, 0, 100);
  const pb = document.getElementById('c-player-hp');
  pb.style.width = php+'%'; pb.className = 'hp-bar'+(php<25?' low':'');
  document.getElementById('c-player-hp-text').textContent = Math.max(0,p.hp)+'/'+p.maxHp+' · MP '+p.mp;
  const eb = document.getElementById('c-enemy-hp');
  eb.style.width = ehp+'%'; eb.className = 'hp-bar'+(ehp<25?' low':'');
  document.getElementById('c-enemy-hp-text').textContent = Math.max(0,e.hp)+'/'+e.maxHp;
  document.getElementById('c-player-status').innerHTML = cuiStatusIcons(CB.eff.p);
  document.getElementById('c-enemy-status').innerHTML = cuiStatusIcons(CB.eff.e) + (CB.phase>1 ? (CB.phase===3?' <span style="color:#e05a5a">FINAL FORM</span>':' <span style="color:#e09050">ENRAGED</span>') : '');
}

function cuiStatusIcons(eff){
  const parts = [];
  if(eff.poison>0) parts.push('<span title="Poisoned" style="color:#7ac87a">☠'+eff.poison+'</span>');
  if(eff.burn>0)   parts.push('<span title="Burning" style="color:#e09050">🔥'+eff.burn+'</span>');
  if(eff.stun>0)   parts.push('<span title="Stunned" style="color:#e0d050">✦'+eff.stun+'</span>');
  if(eff.curse>0)  parts.push('<span title="Cursed: -4 to rolls" style="color:#b07ae0">☾'+eff.curse+'</span>');
  if(eff.bless>0)  parts.push('<span title="Blessed: +4 to rolls" style="color:#e0d080">✚'+eff.bless+'</span>');
  return parts.join(' ');
}

function cuiLog(msg){
  const cl = document.getElementById('combat-log');
  cl.innerHTML += msg + '<br>';
  cl.scrollTop = cl.scrollHeight;
}

function cuiSetTurn(label){ document.getElementById('combat-turn-label').textContent = label; }

function cuiSetButtons(enabled){
  document.querySelectorAll('#combat-actions .combat-btn').forEach(b=>b.disabled = !enabled);
  if(enabled){
    const hasSkills = GS.player.spells.length > 0 || GS.player.inventory.some(x=>{ const it = ITEMS[x.id]; return it && it.type==='scroll' && it.combat; });
    document.getElementById('combat-skill-btn').disabled = !hasSkills;
  }
}

// picker: list of { label, onclick } rendered as buttons above the action bar
function cuiShowPicker(entries, cancelLabel){
  const pk = document.getElementById('combat-picker');
  pk.innerHTML = '';
  for(const en of entries){
    const btn = document.createElement('button');
    btn.className = 'dlg-btn';
    btn.textContent = en.label;
    btn.onclick = en.onclick;
    pk.appendChild(btn);
  }
  const cancel = document.createElement('button');
  cancel.className = 'dlg-btn';
  cancel.textContent = cancelLabel || '✖ Cancel';
  cancel.onclick = ()=>{ cuiHidePicker(); cuiSetButtons(true); };
  pk.appendChild(cancel);
  pk.style.display = 'flex';
}

function cuiHidePicker(){
  const pk = document.getElementById('combat-picker');
  pk.style.display = 'none';
  pk.innerHTML = '';
}
