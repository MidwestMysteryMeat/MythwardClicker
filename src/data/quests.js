// ============================================================
// QUEST DATABASE
// Objective types:
//   kill    — defeat `count` of enemy `target`
//   item    — hold `count` of item `target` (checked live against inventory)
//   craft   — craft `count` of item `target` at a workbench
//   deliver — hand item `target` to NPC `to` (turn-in happens at that NPC)
// All quests are turned in at `turnin` (defaults to giver) once objectives are met.
// reward.rep: faction reputation changes. requires: flag gate before the quest is offered.
// ============================================================
const QUESTS = {
  // ---- Main chain ----
  clear_salt_mines: {
    id:'clear_salt_mines', name:'The Risen Dead', giver:'edric',
    desc:'Mayor Thornwall wants the undead cleared from the Salt Mines. Kill the walking dead and destroy whatever leads them.',
    objectives:[
      {type:'kill', target:'mine_zombie', count:3, current:0, label:'Kill Shambling Zombies'},
      {type:'kill', target:'risen_foreman', count:1, current:0, label:'Defeat the Risen Foreman'},
    ],
    reward:{ gold:150, xp:200, items:['heal_md'], rep:{dominion:1, guild:1} }, complete_flag:'mines_cleared',
  },
  find_mine_key: {
    id:'find_mine_key', name:"Foreman's Key", giver:'urgak',
    desc:'Urgak dropped the mine key fleeing the tunnels. Recover it from the depths.',
    objectives:[{type:'item', target:'mine_key', count:1, current:0, label:'Find the Mine Key'}],
    reward:{ gold:75, xp:100, rep:{guild:1} }, complete_flag:'mine_key_found', takeItems:[['mine_key',1]],
  },
  stolen_chalice: {
    id:'stolen_chalice', name:'The Stolen Chalice', giver:'mirela',
    desc:'Goblin raiders stole the Chalice of Helios from the temple. Sister Mirela begs for its return. Rumour says Chief Krax keeps his best plunder close.',
    objectives:[{type:'item', target:'stolen_chalice', count:1, current:0, label:'Recover the Chalice of Helios'}],
    reward:{ gold:120, xp:150, items:['holy_scroll'], rep:{dominion:2} }, complete_flag:'chalice_returned', takeItems:[['stolen_chalice',1]],
  },
  recover_relics: {
    id:'recover_relics', name:'Echoes of Calidar', giver:'curator',
    desc:'The Curator will pay handsomely for three intact elven relics from the catacombs.',
    objectives:[{type:'item', target:'elf_relic', count:3, current:0, label:'Recover Elven Relics'}],
    reward:{ gold:250, xp:300, items:['fire_scroll','mana_sm'], rep:{elf:1, guild:1} }, complete_flag:'relics_found', takeItems:[['elf_relic',3]],
  },
  find_manaflower: {
    id:'find_manaflower', name:'The Last Bloom', giver:'helena',
    desc:'Helena wants a rare mana flower. They only grow where old magic soaked the ground — the Calidar catacombs.',
    objectives:[{type:'item', target:'mana_flower', count:1, current:0, label:'Find a Mana Flower'}],
    reward:{ gold:90, xp:120, items:['energy_potion'] }, complete_flag:'manaflower_found', takeItems:[['mana_flower',1]],
  },
  master_poison: {
    id:'master_poison', name:"The Poisoner's Test", giver:'nyx',
    desc:'Nyx will only respect an alchemist who can brew a Plague Flask. Craft one at an alchemy bench and show her.',
    objectives:[{type:'craft', target:'plague_flask', count:1, current:0, label:'Brew a Plague Flask'}],
    reward:{ gold:150, xp:180, items:['extend_reagent'], rep:{elf:1} }, complete_flag:'nyx_test_passed',
  },
  rift_shards: {
    id:'rift_shards', name:'Heresy Made Manifest', giver:'inquisitor', requires:'flag:mines_cleared',
    desc:'Inquisitor Voss demands three Rift Shards for ritual destruction. They fall from rift-touched dead and litter the deep places.',
    objectives:[{type:'item', target:'rift_shard', count:3, current:0, label:'Collect Rift Shards'}],
    reward:{ gold:200, xp:250, items:['holy_scroll'], rep:{dominion:2} }, complete_flag:'shards_destroyed', takeItems:[['rift_shard',3]],
  },
  // ---- Guild bounty board (Marlowe) ----
  bounty_scouts: {
    id:'bounty_scouts', name:'Bounty: Goblin Scouts', giver:'marlowe',
    desc:'Goblin scouts are probing the town walls. Thin them out.',
    objectives:[{type:'kill', target:'goblin_scout', count:3, current:0, label:'Kill Goblin Scouts'}],
    reward:{ gold:60, xp:80, rep:{guild:1} },
  },
  bounty_spiders: {
    id:'bounty_spiders', name:'Bounty: Mine Spiders', giver:'marlowe',
    desc:'Giant spiders have webbed over the mine shafts. Burn them out.',
    objectives:[{type:'kill', target:'mine_spider', count:3, current:0, label:'Kill Giant Spiders'}],
    reward:{ gold:70, xp:90, rep:{guild:1} },
  },
  bounty_skeletons: {
    id:'bounty_skeletons', name:'Bounty: Restless Bones', giver:'marlowe',
    desc:'Skeletons wander the ruins by night. Put them back down.',
    objectives:[{type:'kill', target:'skeleton', count:4, current:0, label:'Destroy Skeletons'}],
    reward:{ gold:80, xp:100, rep:{guild:1} },
  },
  bounty_wraiths: {
    id:'bounty_wraiths', name:'Bounty: Dark Wraiths', giver:'marlowe',
    desc:'Dark elf wraiths haunt Calidar. The Guild pays double for spirits.',
    objectives:[{type:'kill', target:'dark_elf', count:3, current:0, label:'Banish Dark Elf Wraiths'}],
    reward:{ gold:120, xp:150, rep:{guild:1} },
  },
  bounty_cultists: {
    id:'bounty_cultists', name:'Bounty: Lich Cult', giver:'marlowe',
    desc:'Lich cultists feed the Rift. The Dominion pays the Guild; the Guild pays you.',
    objectives:[{type:'kill', target:'lich_cultist', count:3, current:0, label:'Kill Lich Cultists'}],
    reward:{ gold:150, xp:180, rep:{guild:2} },
  },
  // ---- Courier chain (Wren) ----
  courier_haven: {
    id:'courier_haven', name:'A Quiet Delivery', giver:'wren', turnin:'snix',
    desc:"Deliver Wren's sealed package to Snix at Goblin Haven. It is very much illegal. Don't get inspected.",
    objectives:[{type:'deliver', target:'wren_package', to:'snix', count:1, current:0, label:'Deliver the package to Snix'}],
    giveItems:[['wren_package',1]], takeItems:[['wren_package',1]],
    reward:{ gold:80, xp:100, rep:{guild:1} }, complete_flag:'courier_1_done',
  },
  courier_ruins: {
    id:'courier_ruins', name:'A Quieter Delivery', giver:'wren', turnin:'shade', requires:'flag:courier_1_done',
    desc:'Another package, this one for Shade in the Calidar Ruins. Wren swears this is the last one.',
    objectives:[{type:'deliver', target:'wren_package', to:'shade', count:1, current:0, label:'Deliver the package to Shade'}],
    giveItems:[['wren_package',1]], takeItems:[['wren_package',1]],
    reward:{ gold:120, xp:140, items:['shadow_cloak'], rep:{guild:1, elf:1} }, complete_flag:'courier_2_done',
  },
};

// ============================================================
// ENDINGS — chosen at the Rift Gate finale
// ============================================================
const ENDINGS = {
  dominion: {
    id:'dominion', name:'The Light of Helios',
    require: () => GS.rep.dominion >= 3 && GS.wantedLevel === 0,
    reqText: 'Dominion reputation 3+ and a clean record',
    choice: 'Seal the Rift with the Rites of Helios (Dominion ending)',
    text: 'Inquisitor Voss chants the Rites of Helios as you hold the line. The Rift screams, contracts, and closes like a healing wound.\n\nThe Dominion proclaims you Champion of the Light. Your name is read in every temple on Fortuna. The Magic Ban tightens — but for one golden season, nobody dies in the north.\n\nTHE END — Dominion Ending',
  },
  guild: {
    id:'guild', name:'The Guild Ascendant',
    require: () => GS.rep.guild >= 3,
    reqText: 'Guild reputation 3+',
    choice: 'Bind the Rift with guild-craft and split the profit (Guild ending)',
    text: "Marlowe's people arrive with wagons of rune stones and dubious paperwork. Together you bind the Rift — not closed, but contained, metered, taxed.\n\nThe Adventure Guild now owns the only gate to another world, and you own a tenth of the Guild. The Dominion is furious. The Guild has never been richer.\n\nTHE END — Guild Ending",
  },
  outcast: {
    id:'outcast', name:'The Outcast Crown',
    require: () => true,
    reqText: 'always available',
    choice: 'Seize the Rift’s power for yourself (Outcast ending)',
    text: 'You reach into the tear and take what the Dominion feared and the Guild coveted. The Rift does not close. It kneels.\n\nThey will send templars. They will send bounty hunters. It will not matter. The north belongs to you now, and the dead walk only where you permit.\n\nTHE END — Outcast Ending',
  },
};
