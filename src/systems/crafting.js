// ============================================================
// CRAFTING — alchemy, enchanting, spellmaking
// Each requires the matching station in the current scene (scene.tools).
// ============================================================

// ---------- ALCHEMY ----------
function openAlchemy(){
  const box = document.getElementById('overlay-box');
  let html = '<h2>⚗ Alchemy Bench</h2><div style="color:#8a7a5a;font-size:11px;margin-bottom:8px">Alchemy skill: '+GS.player.skills.alchemy+' / 100</div>';
  for(const r of RECIPES){
    const canMake = r.ins.every(([iid,q])=>hasItem(iid,q));
    html += '<div class="recipe-row"><div class="rname">'+esc(r.name)+(r.illegal?' <span style="color:#e05a5a;font-size:10px">[ILLEGAL]</span>':'')+'</div>'+
      '<div class="rins">'+r.ins.map(([iid,q])=>'<span class="'+(hasItem(iid,q)?'have':'miss')+'">'+esc(ITEMS[iid].name)+' x'+q+' ('+countItem(iid)+')</span>').join(' + ')+'</div>'+
      '<button class="shop-btn" '+(canMake?'':'disabled style="opacity:0.4"')+' onclick="craftAlchemy(\''+r.id+'\')">Brew ('+alchemyChance(r)+'% success)</button></div>';
  }
  html += '<button class="dlg-btn" style="margin-top:8px" onclick="closeOverlay()">Step away</button>';
  box.innerHTML = html;
  document.getElementById('overlay').classList.add('active');
}

function alchemyChance(r){
  return clamp(55 + GS.player.skills.alchemy - r.difficulty, 5, 95);
}

function craftAlchemy(recipeId){
  const r = RECIPES.find(x=>x.id===recipeId);
  if(!r || !r.ins.every(([iid,q])=>hasItem(iid,q))) return;
  for(const [iid,q] of r.ins) removeItem(iid, q);
  const chance = alchemyChance(r);
  if(rnd(1,100) <= chance){
    addItem(r.out, 1);
    // high skill: chance of a bonus product
    if(rnd(1,100) <= Math.floor(GS.player.skills.alchemy / 4)){
      addItem(r.out, 1);
      log('Exceptional brew — you bottle a second '+ITEMS[r.out].name+'!', 'info');
    }
    GS.player.skills.alchemy = Math.min(100, GS.player.skills.alchemy + rnd(1,3));
    questProgressCraft(r.out);
    if(r.illegal) illegalActCheck('brew contraband');
  } else {
    log('The mixture curdles and is ruined. Materials lost.', 'warn');
    GS.player.skills.alchemy = Math.min(100, GS.player.skills.alchemy + 1);
  }
  openAlchemy(); renderSidebar(); updateStats();
}

// ---------- ENCHANTING ----------
function openEnchanting(){
  const box = document.getElementById('overlay-box');
  let html = '<h2>✦ Enchanting Table</h2>'+
    '<div style="color:#8a7a5a;font-size:11px;margin-bottom:8px">Needs: 1 Enchant Scroll ('+countItem('enchant_scroll')+') + Magic Dust ('+countItem('magic_dust')+'). Roll d20 + INT mod vs DC. A natural 1 destroys the item!</div>';
  let any = false;
  for(const slot of EQUIP_SLOTS){
    const it = getEquippedItem(slot);
    if(!it) continue;
    any = true;
    const cur = GS.player.enchants[slot];
    const curLv = cur ? cur.level : 0;
    html += '<div class="recipe-row"><div class="rname">'+esc(SLOT_NAMES[slot])+': '+esc(it.name)+(curLv?' <span style="color:#b07ae0">+'+cur.bonus+' (Lv '+curLv+')</span>':'')+'</div>';
    if(curLv >= ENCHANT_TIERS.length){
      html += '<div class="rins">Fully enchanted.</div>';
    } else {
      const tier = ENCHANT_TIERS[curLv];
      const ok = hasItem('enchant_scroll') && hasItem('magic_dust', tier.dust);
      html += '<div class="rins">Next: +'+tier.bonus+' '+(slot==='weapon'?'ATK':'DEF')+' — DC '+tier.dc+', '+tier.dust+' dust</div>'+
        '<button class="shop-btn" '+(ok?'':'disabled style="opacity:0.4"')+' onclick="doEnchant(\''+slot+'\')">Enchant</button>';
    }
    html += '</div>';
  }
  if(!any) html += '<div style="color:#6a6080">Equip an item first — enchantments bind to worn gear.</div>';
  html += '<button class="dlg-btn" style="margin-top:8px" onclick="closeOverlay()">Step away</button>';
  box.innerHTML = html;
  document.getElementById('overlay').classList.add('active');
}

function doEnchant(slot){
  const it = getEquippedItem(slot);
  if(!it) return;
  const curLv = GS.player.enchants[slot]?.level || 0;
  if(curLv >= ENCHANT_TIERS.length) return;
  const tier = ENCHANT_TIERS[curLv];
  if(!hasItem('enchant_scroll') || !hasItem('magic_dust', tier.dust)) return;
  removeItem('enchant_scroll', 1);
  removeItem('magic_dust', tier.dust);
  const raw = d20();
  const r = raw + statMod(GS.player.intl);
  if(raw === 1){
    log('☠ CRITICAL FAILURE — the '+it.name+' shatters into dust!', 'warn');
    GS.player.equip[slot] = null;
    delete GS.player.enchants[slot];
  } else if(r >= tier.dc){
    GS.player.enchants[slot] = { level: tier.level, bonus: tier.bonus };
    log('✦ The '+it.name+' glows with power! +'+tier.bonus+' '+(slot==='weapon'?'ATK':'DEF')+' ('+r+' vs DC '+tier.dc+')', 'magic');
  } else {
    log('The enchantment fizzles. Dust consumed. ('+r+' vs DC '+tier.dc+')', 'warn');
  }
  openEnchanting(); renderSidebar(); updateStats();
}

// ---------- SPELLMAKING ----------
function openSpellmaking(){
  const box = document.getElementById('overlay-box');
  let html = '<h2>✴ Spirit Altar — Spellmaking</h2>'+
    '<div style="color:#8a7a5a;font-size:11px;margin-bottom:8px">Bind a base scroll + optional reagent + 1 Rune Stone ('+countItem('rune_stone')+') into a permanent spell. Shadow spells are ILLEGAL in Dominion territory.</div>';
  for(const [baseId, base] of Object.entries(SPELL_BASES)){
    if(!hasItem(baseId)) continue;
    for(const [modId, mod] of Object.entries(SPELL_MODS)){
      if(modId !== 'none' && !hasItem(modId)) continue;
      const s = mod.apply({ ...base });
      const name = mod.name + base.name + ' ' + SPELL_SUFFIX[baseId];
      const ok = hasItem('rune_stone');
      html += '<div class="recipe-row"><div class="rname">'+esc(name)+(base.illegal?' <span style="color:#e05a5a;font-size:10px">[ILLEGAL]</span>':'')+'</div>'+
        '<div class="rins">'+esc(ITEMS[baseId].name)+(modId!=='none'?' + '+esc(ITEMS[modId].name):'')+' + Rune Stone — '+
        (s.dmg?s.dmg+' dmg ':'')+(s.stun?'stun '+s.stun+' ':'')+(s.heal?'heal '+s.heal+' ':'')+(s.burn?'burns ':'')+'· '+s.mpCost+' MP</div>'+
        '<button class="shop-btn" '+(ok?'':'disabled style="opacity:0.4"')+' onclick="craftSpell(\''+baseId+'\',\''+modId+'\')">Bind Spell</button></div>';
    }
  }
  if(!Object.keys(SPELL_BASES).some(b=>hasItem(b))) html += '<div style="color:#6a6080">You need at least one base scroll (fire, ice, shadow, holy, or sleep).</div>';
  html += '<button class="dlg-btn" style="margin-top:8px" onclick="closeOverlay()">Step away</button>';
  box.innerHTML = html;
  document.getElementById('overlay').classList.add('active');
}

function craftSpell(baseId, modId){
  const base = SPELL_BASES[baseId], mod = SPELL_MODS[modId];
  if(!base || !mod || !hasItem(baseId) || !hasItem('rune_stone')) return;
  if(modId !== 'none' && !hasItem(modId)) return;
  removeItem(baseId, 1);
  removeItem('rune_stone', 1);
  if(modId !== 'none') removeItem(modId, 1);
  const s = mod.apply({ ...base });
  const spell = {
    name: mod.name + base.name + ' ' + SPELL_SUFFIX[baseId],
    dmg: s.dmg || 0, stun: s.stun || 0, heal: s.heal || 0, burn: !!s.burn,
    mpCost: s.mpCost, illegal: !!base.illegal,
  };
  GS.player.spells.push(spell);
  log('✴ Spell bound: '+spell.name+' ('+spell.mpCost+' MP)', 'magic');
  openSpellmaking(); renderSidebar();
}
