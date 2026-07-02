// ============================================================
// NPC DATABASE
// hours: [open, close) in 24h — outside these the NPC is absent from the scene.
// alertness: pickpocket difficulty modifier; willpower: haggle resistance.
// hostile_if_wanted: attacks/arrests at wanted level >= 3.
// ============================================================
const NPCS = {
  // ---- Ashford ----
  edric: { id:'edric', name:'Mayor Edric Thornwall', img:A+'characters/Human/Men_Human/Duke.PNG', scene:'ashford_square', x:0.55, y:0.42, hours:[8,18], alertness:4, willpower:6,
    dialogue:{ default:["The Rift grows wider every week. We need brave souls.", "Speak to Marlowe at the Guild Hall if you're looking for honest bounty work.", "Clear the Salt Mines of the risen dead — you'll be well compensated."],
      quest_done:["You've done Ashford a great service. The Dominion will hear of it."] },
    quests:['clear_salt_mines'] },

  aleva: { id:'aleva', name:'Aleva Brightwick', img:A+'characters/Human/Women_Human/Old_woman.PNG', scene:'ashford_inn', x:0.45, y:0.5, alertness:3, willpower:5,
    dialogue:{ default:["Welcome to the Bright Hearth! Rest costs 10 gold — heals you fully and the night passes.", "Heard strange lights near the Salt Mines last night.", "Old Blind Tom knows more than he lets on, I'll tell you that."] },
    shop:'inn_shop', service:'rest' },

  dorvak: { id:'dorvak', name:'Dorvak the Smith', img:A+'characters/Human/Men_Human/researcher.PNG', scene:'ashford_forge', x:0.55, y:0.5, hours:[6,20], alertness:5, willpower:8,
    dialogue:{ default:["Good steel, fair coin. What'll it be?", "That enchanting table in the corner? Took it in trade from an elf. Use it if you've the scrolls and dust.", "The goblins stole the temple chalice in the last raid. Sister Mirela is beside herself."] },
    shop:'forge_shop' },

  mirela: { id:'mirela', name:'Sister Mirela', img:A+'characters/Human/Women_Human/Witch.PNG', scene:'ashford_temple', x:0.5, y:0.4, hours:[6,20], alertness:3, willpower:7,
    dialogue:{ default:["Helios lights our path. May His grace protect you.", "The goblins took our sacred chalice. I would give anything to see it returned.", "I can heal your wounds for a tithe to the temple — 20 gold. I can also bless you before battle."] },
    shop:'temple_shop', service:'heal', quests:['stolen_chalice'] },

  blind_tom: { id:'blind_tom', name:'Blind Tom', img:A+'characters/Human/Men_Human/Leper.PNG', scene:'ashford_square', x:0.24, y:0.6, alertness:8, willpower:3,
    dialogue:{ default:["*sniffs* You smell of iron and bad decisions.", "They say Goblin Snix at the Haven trades in things the Dominion would burn you for.", "There's a cellar under the Inn. Aleva doesn't like people knowing about it.", "The Curator in the ruins pays good coin for ancient elven relics.", "Below Calidar, they whisper, the Lich Lord Vael holds court with the elven dead."] } },

  penn: { id:'penn', name:'Guard Captain Penn', img:A+'characters/Human/Men_Human/Guard.PNG', scene:'ashford_square', x:0.78, y:0.42, alertness:9, willpower:9,
    dialogue:{ default:["Keep the peace or answer to me.", "Three raids this month. Goblins from the northern warrens.", "Carrying cursed or illegal goods in Ashford will get you arrested."],
      wanted:["You're a wanted criminal. Drop your weapons — NOW."] },
    hostile_if_wanted:true, service:'bribe' },

  kerris: { id:'kerris', name:'Kerris (Fence)', img:A+'characters/Human/Men_Human/Robber.PNG', scene:'ashford_cellar', x:0.5, y:0.5, alertness:8, willpower:6,
    dialogue:{ default:["Keep your voice down, would you?", "I don't ask where things come from. Same courtesy expected in return.", "Poison, scrolls, stolen goods — I've got what the temple won't sell."] },
    shop:'black_market' },

  marlowe: { id:'marlowe', name:'Guildmaster Marlowe', img:A+'characters/Human/Men_Human/BoldWarrior.PNG', scene:'ashford_guild', x:0.45, y:0.45, hours:[7,22], alertness:7, willpower:8,
    dialogue:{ default:["The Guild takes all comers — coin doesn't care about your past.", "Bounty board's open. Kill what needs killing, get paid.", "The Dominion tolerates us because we do what their templars won't."] },
    quests:['bounty_scouts','bounty_spiders','bounty_skeletons','bounty_wraiths','bounty_cultists'] },

  wren: { id:'wren', name:'Apprentice Wren', img:A+'characters/Human/Women_Human/Human_07_girl.PNG', scene:'ashford_guild', x:0.65, y:0.52, hours:[7,22], alertness:2, willpower:3,
    dialogue:{ default:["Marlowe keeps me running errands sunup to sundown.", "Could you... maybe deliver something for me? Quietly?", "Don't shake the package. Please."] },
    quests:['courier_haven','courier_ruins'] },

  helena: { id:'helena', name:'Helena the Herbalist', img:A+'characters/Human/Women_Human/Human_15_woman.PNG', scene:'ashford_square', x:0.40, y:0.62, hours:[8,18], alertness:4, willpower:5,
    dialogue:{ default:["Fresh herbs! Healleaves, mushrooms, all gathered by dawn.", "A mana flower... I'd pay dearly for one. They only grow where old magic soaked the ground.", "The catacombs under Calidar. That's where the last manaflowers bloom. If you dare."] },
    shop:'herb_shop', quests:['find_manaflower'] },

  // ---- Salt Mines ----
  urgak: { id:'urgak', name:'Foreman Urgak', img:A+'characters/Human/Men_Human/Human_28_thug.PNG', scene:'mines_entrance', x:0.5, y:0.52, alertness:5, willpower:6,
    dialogue:{ default:["Work's stopped. Three men dead, something's in the tunnels.", "I dropped the mine key fleeing from... whatever those things are.", "Clear those tunnels and bring back my key. I'll pay."] },
    quests:['find_mine_key'] },

  // ---- Goblin Haven ----
  snix: { id:'snix', name:'Snix the Trader', img:A+'characters/Goblin/Goblin Males/goblin_01.PNG', scene:'goblin_haven', x:0.4, y:0.52, alertness:7, willpower:4,
    dialogue:{ default:["Snix has the best goods! Very quality! Not stolen!", "No questions, yes? Snix not ask where you got it.", "You want poison? Shadow scrolls? Snix can arrange."] },
    shop:'goblin_shop' },

  krix: { id:'krix', name:'Krix the Wise', img:A+'characters/Goblin/Goblin Males/goblin_02.PNG', scene:'goblin_haven', x:0.62, y:0.52, alertness:6, willpower:7,
    dialogue:{ default:["Krix sees things in the Rift-glow. Not good things.", "You want to learn fire-calling? Krix teaches. Small price.", "The spirit altar here — bring scroll, reagent, rune stone. Bind your own magic."] },
    teaches:['fire_scroll','ice_scroll'] },

  // ---- Calidar Ruins ----
  shade: { id:'shade', name:'Shade', img:A+'characters/ELF/Men_ELF/ElfWarrior.PNG', scene:'calidar_ruins', x:0.45, y:0.45, alertness:9, willpower:8,
    dialogue:{ default:["What do you want, human?", "Calidar fell. We endured. That is all.", "The Dominion would see us all burned. Don't lead them here.", "The old enchanting stones still hold power. Use them, for a price of dust."] },
    shop:'elf_shop' },

  curator: { id:'curator', name:'The Curator', img:A+'characters/Human/Men_Human/researcher.PNG', scene:'calidar_ruins', x:0.62, y:0.48, alertness:2, willpower:4,
    dialogue:{ default:["Remarkable — the stonework predates the Atlas detonation by four centuries!", "Bring me three intact elven relics and I will make you wealthy AND educated.", "The lower halls are dangerous. The undead there still remember being elven."] },
    quests:['recover_relics'] },

  nyx: { id:'nyx', name:'Nyx the Poisoner', img:A+'characters/ELF/Women_Elf/Elf_02.PNG', scene:'dark_elf_quarter', x:0.5, y:0.48, alertness:8, willpower:7,
    dialogue:{ default:["Careful where you step. Half my stock kills on contact.", "Poison is just alchemy without the hypocrisy.", "Brew me a Plague Flask at my bench and I'll know you're worth teaching."] },
    shop:'poison_shop', quests:['master_poison'] },

  // ---- Rift Outpost ----
  inquisitor: { id:'inquisitor', name:'Inquisitor Voss', img:A+'characters/Human/Men_Human/OldCultist.PNG', scene:'rift_outpost', x:0.42, y:0.45, alertness:9, willpower:9,
    dialogue:{ default:["The Rift is a heresy made manifest. We will close it.", "Anyone trading with the undead is an enemy of Helios.", "Bring me three Rift Shards for destruction. The Dominion rewards obedience."] },
    quests:['rift_shards'], faction:'dominion', hostile_if_wanted:true },

  serah: { id:'serah', name:'Templar Serah', img:A+'characters/Human/Women_Human/Human_05_woman_knight.PNG', scene:'rift_outpost', x:0.62, y:0.48, alertness:8, willpower:8,
    dialogue:{ default:["Faith is a shield. Steel is another. Carry both.", "Prove yourself to the Dominion and I will teach you the smite.", "The Rift Gate is death to the unprepared. Vael's fall would weaken it — so the scholars say."] },
    teaches:['holy_scroll'], teachRequires:{ rep:'dominion', min:2 }, faction:'dominion' },
};
