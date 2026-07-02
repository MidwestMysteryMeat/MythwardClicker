// ============================================================
// SHOPS
// faction: rep-based discounts apply (see economy.js); illegal: crime check on buy in Dominion territory
// ============================================================
const SHOPS = {
  forge_shop:  { name:"Dorvak's Forge",   npc:'dorvak', stock:['sword_01','sword_10','axe_01','dagger_01','bow_01','buckler','kite_shield','iron_helm','gambeson','mail_chest','leather_boots','plate_boots','leather_gloves','hauler_belt','iron_bar','coal'], buys:true },
  inn_shop:    { name:"Bright Hearth",    npc:'aleva', stock:['bread','steak','beer','heal_sm','heal_md','empty_flask'], buys:false },
  temple_shop: { name:"Temple of Helios", npc:'mirela', stock:['heal_sm','heal_md','heal_lg','mana_sm','sleep_scroll','holy_scroll'], buys:false, faction:'dominion' },
  herb_shop:   { name:"Helena's Herbs",   npc:'helena', stock:['herbs_heal','stinky_mushroom','raptor_herb','empty_flask','bread'], buys:true },
  goblin_shop: { name:"Snix's Stall",     npc:'snix', stock:['dagger_01','herbs_heal','heal_sm','poison_vial','herbs_poison','leather_mat','rune_stone','shadow_cloak'], buys:true, illegal:true },
  black_market:{ name:"Kerris's Cellar",  npc:'kerris', stock:['poison_vial','herbs_poison','enchant_scroll','magic_dust','rune_stone','fire_scroll','shadow_scroll','amplify_reagent'], buys:true, illegal:true, fence:true },
  elf_shop:    { name:"Shade's Cache",    npc:'shade', stock:['rune_stone','magic_dust','enchant_scroll','fire_scroll','ice_scroll','sleep_scroll','mana_sm','energy_potion','wand','staff_1','silver_ring','amplify_reagent','extend_reagent','aoe_reagent'], buys:true },
  poison_shop: { name:"Nyx's Bench",      npc:'nyx', stock:['poison_vial','plague_flask','herbs_poison','stinky_mushroom','empty_flask','extend_reagent'], buys:true, illegal:true },
};

// ============================================================
// SCENES
// dominion: Dominion law applies (illegal-goods checks, guard inspections)
// guards: authority present — witnesses for crime checks, arrest at wanted >= 3
// tools: crafting stations available here ('alchemy' | 'enchanting' | 'spellmaking')
// encounter_chance / encounter_pool: random fight on entry (night adds +0.15)
// boss_encounter + boss_flag: one-time boss fight on entry
// ============================================================
const SCENES = {
  world_map: {
    id:'world_map', name:'Island of Fortuna',
    npcs:[],
    exits:[
      {label:'Ashford',       x:0.30, y:0.48, to:'ashford_square', desc:'A walled market town'},
      {label:'Salt Mines',    x:0.55, y:0.32, to:'mines_entrance', desc:'Abandoned mines'},
      {label:'Goblin Haven',  x:0.72, y:0.62, to:'goblin_haven',   desc:'Goblin trading camp'},
      {label:'Calidar Ruins', x:0.18, y:0.67, to:'calidar_ruins',  desc:'Ruined elven city'},
      {label:'Rift Outpost',  x:0.82, y:0.22, to:'rift_outpost',   desc:'Dominion military camp', requires:'flag:mines_cleared'},
    ],
    music: A+'music/05_Misty_Lands_ExplorationTrack.WAV',
    desc:'The island of Fortuna. The Rift glows on the northern horizon.',
  },
  // ---- Ashford ----
  ashford_square: {
    id:'ashford_square', name:'Ashford — Town Square',
    bg:'#8B7355', dominion:true, guards:true,
    npcs:['edric','blind_tom','penn','helena'],
    exits:[
      {label:'⬅ World Map', x:0.06, y:0.08, to:'world_map'},
      {label:'Inn →',        x:0.90, y:0.22, to:'ashford_inn'},
      {label:'Forge →',      x:0.90, y:0.40, to:'ashford_forge'},
      {label:'Temple →',     x:0.90, y:0.58, to:'ashford_temple'},
      {label:'Guild Hall →', x:0.90, y:0.76, to:'ashford_guild'},
    ],
    music: A+'music/SW_Town_1.WAV',
    desc:'The central square of Ashford. A stone well stands at the centre. Market stalls flank the lanes.',
  },
  ashford_inn: {
    id:'ashford_inn', name:'Bright Hearth Inn',
    bg:'#3d2210', dominion:true,
    npcs:['aleva'], tools:['alchemy'],
    exits:[{label:'⬅ Square', x:0.06, y:0.08, to:'ashford_square'}],
    music: A+'music/SW_Town_1.WAV',
    desc:'A warm inn, smelling of roasted meat and pine smoke. A battered alchemy bench sits by the hearth.',
    has_cellar: true,
  },
  ashford_forge: {
    id:'ashford_forge', name:"Dorvak's Forge",
    bg:'#2a1a0a', bgImg: A+'Explore/ForgeBackgroundart.png', dominion:true,
    npcs:['dorvak'], tools:['enchanting'],
    exits:[{label:'⬅ Square', x:0.06, y:0.08, to:'ashford_square'}],
    music: A+'music/SW_Town_1.WAV',
    desc:'Heat radiates from the forge. An elven enchanting table hums quietly in the corner.',
  },
  ashford_temple: {
    id:'ashford_temple', name:'Temple of Helios',
    bg:'#c8b870', dominion:true,
    npcs:['mirela'],
    exits:[{label:'⬅ Square', x:0.06, y:0.08, to:'ashford_square'}],
    music: A+'music/SW_Town_1.WAV',
    desc:'White stone columns and incense smoke. A golden sunburst dominates the altar.',
  },
  ashford_guild: {
    id:'ashford_guild', name:'Adventure Guild Hall',
    bg:'#3a2c18', dominion:true,
    npcs:['marlowe','wren'],
    exits:[{label:'⬅ Square', x:0.06, y:0.08, to:'ashford_square'}],
    music: A+'music/SW_Town_1.WAV',
    desc:'Trophies and old contracts paper the walls. The bounty board bristles with notices.',
  },
  ashford_cellar: {
    id:'ashford_cellar', name:'Inn Cellar — Black Market',
    bg:'#080810',
    npcs:['kerris'],
    exits:[{label:'↑ Back up', x:0.06, y:0.08, to:'ashford_inn'}],
    hidden:true,
    desc:'A damp cellar lit by a single lantern. Crates of questionable goods line the walls.',
  },
  // ---- Salt Mines ----
  mines_entrance: {
    id:'mines_entrance', name:'Salt Mines — Entrance',
    bg:'#303030',
    npcs:['urgak'],
    exits:[
      {label:'⬅ World Map',   x:0.06, y:0.08, to:'world_map'},
      {label:'Enter Mines →', x:0.88, y:0.50, to:'mines_l1'},
    ],
    encounter_chance:0.35, encounter_pool:['goblin_scout','goblin_scout'],
    music: A+'music/09_The_Journey_Begins__ExplorationTrack.WAV',
    desc:'A rough-hewn opening in the cliffside. Cart tracks lead into darkness.',
  },
  mines_l1: {
    id:'mines_l1', name:'Salt Mines — Level 1',
    bg:'#1a1a28', npcs:[], dark:true,
    exits:[
      {label:'⬅ Exit',   x:0.06, y:0.08, to:'mines_entrance'},
      {label:'Deeper ↓', x:0.88, y:0.50, to:'mines_l2'},
    ],
    encounter_chance:0.7, encounter_pool:['mine_spider','mine_zombie'],
    loot_pool:[['heal_sm',0.7],['iron_bar',0.6],['leather_mat',0.5],['herbs_heal',0.4],['stinky_mushroom',0.3]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'Narrow tunnels lit by guttering torches. Cobwebs fill every corner. Something moves in the dark.',
  },
  mines_l2: {
    id:'mines_l2', name:'Salt Mines — Level 2',
    bg:'#141422', npcs:[], dark:true,
    exits:[
      {label:'⬅ Back',   x:0.06, y:0.08, to:'mines_l1'},
      {label:'Deeper ↓', x:0.88, y:0.50, to:'mines_l3'},
    ],
    encounter_chance:0.8, encounter_pool:['skeleton','skel_archer','lich_cultist'],
    loot_pool:[['rune_stone',0.5],['silver_bar',0.5],['heal_md',0.4],['magic_dust',0.3]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'Bone piles and cold braziers. Cultist chants echo from somewhere below.',
  },
  mines_l3: {
    id:'mines_l3', name:'Salt Mines — Deep Level',
    bg:'#100a1a', npcs:[], dark:true,
    exits:[{label:'⬅ Back', x:0.06, y:0.08, to:'mines_l2'}],
    boss_encounter:'risen_foreman', boss_flag:'risen_foreman_dead',
    encounter_chance:0.6, encounter_pool:['mine_zombie','skel_archer'],
    loot_pool:[['rune_stone',0.6],['magic_dust',0.4],['rift_shard',0.35],['heal_md',0.5],['silver_bar',0.5]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'The deepest level. Ancient salt crystals glow faintly blue. A figure lurches from the shadows.',
  },
  // ---- Goblin Haven ----
  goblin_haven: {
    id:'goblin_haven', name:'Goblin Haven',
    bg:'#2a4015',
    npcs:['snix','krix'], tools:['spellmaking'],
    exits:[
      {label:'⬅ World Map',       x:0.06, y:0.08, to:'world_map'},
      {label:"Warchief's Hall →", x:0.88, y:0.50, to:'goblin_hall'},
    ],
    encounter_chance:0.15, encounter_pool:['goblin_scout','goblin_warrior'],
    music: A+'music/SW_Exploration_6.WAV',
    desc:'A chaotic camp of tents and stolen goods. A crude spirit altar smoulders behind the stalls.',
  },
  goblin_hall: {
    id:'goblin_hall', name:"Goblin Warchief's Hall",
    bg:'#1a2a0a', npcs:[],
    exits:[{label:'⬅ Haven', x:0.06, y:0.08, to:'goblin_haven'}],
    boss_encounter:'chief_krax', boss_flag:'chief_krax_dead',
    encounter_chance:0.8, encounter_pool:['goblin_warrior','goblin_warrior'],
    loot_pool:[['axe_01',0.4],['heal_md',0.3],['leather_mat',0.6]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'A large tent decorated with trophies. Chief Krax sits on a throne of crates.',
  },
  // ---- Calidar Ruins ----
  calidar_ruins: {
    id:'calidar_ruins', name:'Calidar Ruins',
    bg:'#1a2535',
    npcs:['shade','curator'], tools:['enchanting','spellmaking'],
    exits:[
      {label:'⬅ World Map',       x:0.06, y:0.08, to:'world_map'},
      {label:'Dark Elf Quarter →',x:0.88, y:0.32, to:'dark_elf_quarter'},
      {label:'Catacombs ↓',       x:0.88, y:0.62, to:'catacombs_f1'},
    ],
    encounter_chance:0.35, encounter_pool:['skeleton','dark_elf'],
    music: A+'music/07_Mountain_Halls__ExplorationTrack.WAV',
    desc:'Crumbling elven spires claw at a grey sky. Ancient runes pulse faintly on the stonework.',
  },
  dark_elf_quarter: {
    id:'dark_elf_quarter', name:'Dark Elf Quarter',
    bg:'#151025',
    npcs:['nyx'], tools:['alchemy'],
    exits:[{label:'⬅ Ruins', x:0.06, y:0.08, to:'calidar_ruins'}],
    encounter_chance:0.2, encounter_pool:['dark_elf'],
    music: A+'music/07_Mountain_Halls__ExplorationTrack.WAV',
    desc:'Shrouded doorways and violet lanterns. The surviving dark elves watch you pass in silence.',
  },
  catacombs_f1: {
    id:'catacombs_f1', name:'Calidar Catacombs — Floor 1',
    bg:'#0a0515', npcs:[], dark:true,
    exits:[
      {label:'⬅ Ruins',  x:0.06, y:0.08, to:'calidar_ruins'},
      {label:'Deeper ↓', x:0.88, y:0.50, to:'catacombs_f2'},
    ],
    encounter_chance:0.7, encounter_pool:['mine_zombie','skeleton','skel_archer'],
    loot_pool:[['rune_stone',0.6],['magic_dust',0.5],['elf_relic',0.35],['herbs_poison',0.4]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'Ancient elven burial halls stretch into darkness. The dead do not sleep here.',
  },
  catacombs_f2: {
    id:'catacombs_f2', name:'Calidar Catacombs — Floor 2',
    bg:'#080410', npcs:[], dark:true,
    exits:[
      {label:'⬅ Back',   x:0.06, y:0.08, to:'catacombs_f1'},
      {label:'Deeper ↓', x:0.88, y:0.50, to:'catacombs_f3'},
    ],
    encounter_chance:0.85, encounter_pool:['skel_archer','dark_elf','lich_cultist'],
    loot_pool:[['elf_relic',0.4],['mana_flower',0.35],['fire_scroll',0.3],['magic_dust',0.5]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'Sarcophagi carved with elven faces, every one of them open and empty.',
  },
  catacombs_f3: {
    id:'catacombs_f3', name:'Calidar Catacombs — Throne of Vael',
    bg:'#05020c', npcs:[], dark:true,
    exits:[{label:'⬅ Back', x:0.06, y:0.08, to:'catacombs_f2'}],
    boss_encounter:'lich_lord_vael', boss_flag:'vael_dead',
    encounter_chance:0.6, encounter_pool:['lich_cultist','dark_elf'],
    loot_pool:[['elf_relic',0.5],['mana_flower',0.3],['rift_shard',0.4],['shadow_scroll',0.3]],
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'A vaulted throne room of black stone. Lich Lord Vael waits upon a seat of bone.',
  },
  // ---- Rift ----
  rift_outpost: {
    id:'rift_outpost', name:'Rift Outpost',
    bg:'#1a1a3a', dominion:true, guards:true,
    npcs:['inquisitor','serah'],
    exits:[
      {label:'⬅ World Map', x:0.06, y:0.08, to:'world_map'},
      {label:'Rift Gate →',  x:0.88, y:0.50, to:'rift_gate'},
    ],
    requires:'flag:mines_cleared',
    music: A+'music/SW_Town_1.WAV',
    desc:'A Dominion military camp at the edge of the Rift tear. Purple light pulses on the horizon.',
  },
  rift_gate: {
    id:'rift_gate', name:'The Rift Gate',
    bg:'#241040', npcs:[], dark:true,
    exits:[{label:'⬅ Outpost', x:0.06, y:0.08, to:'rift_outpost'}],
    encounter_chance:0.5, encounter_pool:['rift_spawn','rift_spawn'],
    loot_pool:[['rift_shard',0.5],['magic_dust',0.4]],
    finale:true,
    music: A+'music/01_Horns_Of_War_BattleTrack.WAV',
    desc:'The tear itself: a wound in the sky spilling violet light. The dead walk out of it.',
  },
};
