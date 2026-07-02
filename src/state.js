// ============================================================
// GAME STATE — singleton + player helpers
// ============================================================
const EQUIP_SLOTS = ['weapon','offhand','chest','helm','boots','gloves','ring','belt','cloak'];
const SLOT_NAMES = { weapon:'Weapon', offhand:'Off-hand', chest:'Chest', helm:'Helm', boots:'Boots', gloves:'Gloves', ring:'Ring', belt:'Belt', cloak:'Cloak' };

function freshState(){
  return {
    version: 2,
    scene: 'world_map',
    player: {
      name:'Adventurer', level:1, xp:0, xpNext:100,
      hp:100, maxHp:100, mp:50, maxMp:50, gold:50,
      str:8, dex:8, intl:8, con:8,
      equip: Object.fromEntries(EQUIP_SLOTS.map(s=>[s,null])),
      enchants: {},            // slot -> { level, bonus }
      inventory: [ {id:'sword_01', qty:1}, {id:'heal_sm', qty:2}, {id:'bread', qty:3} ],
      spells: [],              // crafted spells: { name, dmg, stun, heal, burn, mpCost, illegal }
      skills: { alchemy:10, stealth:5, sleight:5, persuasion:5 },
      blessed: 0,              // pre-combat blessing charges from the temple
    },
    activeQuests: [], completedQuests: [],
    flags: {}, wantedLevel: 0,
    rep: { dominion:0, guild:0, elf:0 },
    time: { day:1, hour:8 },
    haggled: {},               // npcId -> day of last haggle attempt
    sceneLooted: {},           // sceneId -> day it was last searched
    currentTab: 'inv',
    gameOver: false,
  };
}
let GS = freshState();

// ---------- inventory ----------
function hasItem(id, qty=1){ return countItem(id) >= qty; }
function countItem(id){ const s = GS.player.inventory.find(x=>x.id===id); return s ? s.qty : 0; }
function removeItem(id, qty=1){
  const slot = GS.player.inventory.find(x=>x.id===id);
  if(slot){ slot.qty -= qty; if(slot.qty<=0) GS.player.inventory = GS.player.inventory.filter(x=>x.id!==id); }
}
function addItem(id, qty=1, silent=false){
  if(!ITEMS[id]) return;
  const slot = GS.player.inventory.find(x=>x.id===id);
  if(slot) slot.qty += qty;
  else GS.player.inventory.push({id, qty});
  if(!silent) log('+ Got: ' + ITEMS[id].name + (qty>1?' x'+qty:''), 'loot');
  questProgressItem();
}
function carryWeight(){
  let w = 0;
  for(const s of GS.player.inventory){ w += (ITEMS[s.id]?.w || 1) * s.qty; }
  return Math.round(w*10)/10;
}
function maxCarry(){
  let cap = 30 + GS.player.str * 2;
  const belt = getEquippedItem('belt');
  if(belt && belt.carry) cap += belt.carry;
  return cap;
}
function isOverloaded(){ return carryWeight() > maxCarry(); }
function carryingIllegal(){ return GS.player.inventory.some(s=>ITEMS[s.id]?.illegal); }

// ---------- equipment & derived stats ----------
function getEquippedItem(slot){ const id = GS.player.equip[slot]; return id ? ITEMS[id] : null; }
function enchantBonus(slot){ return GS.player.enchants[slot]?.bonus || 0; }
function playerAtk(){
  const w = getEquippedItem('weapon');
  const mod = w && w.range ? statMod(GS.player.dex) : statMod(GS.player.str);
  return (w ? w.atk : 2) + mod + (w ? enchantBonus('weapon') : 0);
}
function playerDef(){
  let d = statMod(GS.player.con);
  for(const slot of EQUIP_SLOTS){
    if(slot === 'weapon') continue;
    const it = getEquippedItem(slot);
    if(it){ d += it.def || 0; d += enchantBonus(slot); }
  }
  return d;
}
function playerMaxMp(){
  let m = 50 + (GS.player.level-1)*8 + statMod(GS.player.intl)*5;
  for(const slot of EQUIP_SLOTS){ const it = getEquippedItem(slot); if(it && it.mpBonus) m += it.mpBonus; }
  return m;
}
function stealthSkill(){
  let s = GS.player.skills.stealth + statMod(GS.player.dex);
  const cloak = getEquippedItem('cloak');
  if(cloak && cloak.stealth) s += cloak.stealth;
  return s;
}

// ---------- gold / xp ----------
function addGold(n){ GS.player.gold += n; if(n>0) log('+ '+n+' gold', 'loot'); updateStats(); }
function addXP(n){
  GS.player.xp += n;
  log('+ '+n+' XP', 'info');
  while(GS.player.xp >= GS.player.xpNext){ levelUp(); }
  updateStats();
}
function levelUp(){
  GS.player.xp -= GS.player.xpNext;
  GS.player.level++;
  GS.player.xpNext = Math.floor(GS.player.xpNext * 1.5);
  GS.player.maxHp += 15; GS.player.hp = GS.player.maxHp;
  GS.player.maxMp = playerMaxMp(); GS.player.mp = GS.player.maxMp;
  GS.player.str++; GS.player.dex++; GS.player.intl++; GS.player.con++;
  GS.player.skills.stealth += 2; GS.player.skills.persuasion += 2; GS.player.skills.sleight += 2;
  log('★ LEVEL UP! Now level ' + GS.player.level, 'info');
}

// ---------- reputation ----------
function addRep(changes){
  for(const [fac, n] of Object.entries(changes || {})){
    if(GS.rep[fac] === undefined) continue;
    GS.rep[fac] += n;
    log((n>0?'+':'')+n+' '+fac+' reputation', 'info');
  }
}

// ---------- time & day/night ----------
function advanceTime(hours){
  GS.time.hour += hours;
  while(GS.time.hour >= 24){ GS.time.hour -= 24; GS.time.day++; }
}
function isNight(){ return GS.time.hour >= 20 || GS.time.hour < 6; }
function timeString(){
  const h = String(GS.time.hour).padStart(2,'0');
  return 'Day '+GS.time.day+' · '+h+':00'+(isNight()?' 🌙':' ☀');
}
function npcPresent(npc){
  if(!npc.hours) return true;
  const [open, close] = npc.hours, h = GS.time.hour;
  return open <= close ? (h >= open && h < close) : (h >= open || h < close);
}

// ---------- requirements ----------
function checkRequires(req){
  if(!req) return true;
  if(req.startsWith('flag:')) return !!GS.flags[req.slice(5)];
  if(req.startsWith('item:')) return hasItem(req.slice(5));
  return true;
}

// ---------- header HUD ----------
function updateStats(){
  const p = GS.player;
  document.getElementById('s-hp').textContent    = 'HP: '+p.hp+'/'+p.maxHp;
  document.getElementById('s-mp').textContent    = 'MP: '+p.mp+'/'+p.maxMp;
  document.getElementById('s-gold').textContent  = 'Gold: '+p.gold;
  document.getElementById('s-xp').textContent    = 'XP: '+p.xp+'/'+p.xpNext;
  document.getElementById('s-level').textContent = 'Lv.'+p.level;
  document.getElementById('s-time').textContent  = timeString();
  const wt = document.getElementById('s-weight');
  wt.textContent = '⚖ '+carryWeight()+'/'+maxCarry();
  wt.style.color = isOverloaded() ? '#e05a5a' : '#6a6080';
  const w = document.getElementById('s-wanted');
  w.style.display = GS.wantedLevel > 0 ? 'inline' : 'none';
  w.textContent = '⚠ WANTED '+'★'.repeat(GS.wantedLevel);
}
