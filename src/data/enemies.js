// ============================================================
// ENEMY DATABASE
// ai: 'melee' (default) | 'ranged' (+2 atk if player has no shield) | 'magic' (drain/curse/dark blast)
// boss: 3-phase fight (normal -> enraged at 50% HP -> final form at 20%)
// gold: [min,max]; loot: [[itemId, chance], ...]
// ============================================================
const ENEMIES = {
  goblin_scout:   { id:'goblin_scout',   name:'Goblin Scout',    img:A+'characters/Goblin/Goblin Males/goblin_03.PNG',        hp:25, atk:4,  def:1, xp:20,  gold:[2,8],   ai:'melee',  loot:[['dagger_01',0.15],['heal_sm',0.1]] },
  goblin_warrior: { id:'goblin_warrior', name:'Goblin Warrior',  img:A+'characters/Goblin/Goblin Males/goblin_05.PNG',        hp:45, atk:7,  def:2, xp:35,  gold:[5,15],  ai:'melee',  loot:[['leather_mat',0.3],['axe_01',0.1]] },
  mine_spider:    { id:'mine_spider',    name:'Giant Spider',    img:A+'characters/Monsters/Monster_Spider.PNG',              hp:35, atk:6,  def:1, xp:30,  gold:[0,4],   ai:'melee',  poison:true, loot:[['herbs_poison',0.25]] },
  mine_zombie:    { id:'mine_zombie',    name:'Shambling Zombie',img:A+'characters/Monsters/Undead/Undead_06_zombie.PNG',     hp:45, atk:8,  def:3, xp:40,  gold:[0,8],   ai:'melee',  loot:[['rune_stone',0.05]] },
  skeleton:       { id:'skeleton',       name:'Skeleton',        img:A+'characters/Monsters/Undead/Undead_05_skeleton.PNG',   hp:30, atk:7,  def:1, xp:30,  gold:[0,5],   ai:'melee',  loot:[['iron_bar',0.2]] },
  skel_archer:    { id:'skel_archer',    name:'Skeleton Archer', img:A+'characters/Monsters/Undead/Undead_01_archer.PNG',     hp:28, atk:9,  def:1, xp:35,  gold:[0,6],   ai:'ranged', loot:[['bow_01',0.1]] },
  lich_cultist:   { id:'lich_cultist',   name:'Lich Cultist',    img:A+'characters/Monsters/Undead/Monster_SkeletonMage2.PNG', hp:60, atk:12, def:4, xp:80,  gold:[10,25], ai:'magic',  loot:[['fire_scroll',0.25],['rune_stone',0.15]] },
  dark_elf:       { id:'dark_elf',       name:'Dark Elf Wraith', img:A+'characters/ELF/Men_ELF/Elf_07.PNG',                  hp:55, atk:11, def:3, xp:65,  gold:[8,20],  ai:'magic',  loot:[['rune_stone',0.2],['magic_dust',0.2]] },
  guard:          { id:'guard',          name:'Dominion Guard',  img:A+'characters/Human/Men_Human/Guard.PNG',                hp:55, atk:9,  def:5, xp:50,  gold:[5,20],  ai:'melee',  faction:'dominion' },
  bounty_hunter:  { id:'bounty_hunter',  name:'Bounty Hunter',   img:A+'characters/Human/Men_Human/Human_28_thug.PNG',        hp:70, atk:11, def:4, xp:90,  gold:[15,40], ai:'ranged', loot:[['heal_md',0.3],['bow_01',0.15]] },
  rift_spawn:     { id:'rift_spawn',     name:'Rift Spawn',      img:A+'characters/Monsters/Undead/Monster_GhostKnight.PNG',hp:65, atk:13, def:4, xp:95,  gold:[0,10],  ai:'melee',  loot:[['rift_shard',0.4],['magic_dust',0.3]] },
  // ---- Bosses ----
  risen_foreman:  { id:'risen_foreman',  name:'Risen Foreman',   img:A+'characters/Monsters/Undead/Undead_04_warrior.PNG',    hp:120, atk:14, def:6, xp:200, gold:[20,50],  ai:'melee', boss:true, loot:[['mine_key',1.0],['sword_10',0.2],['heal_md',0.5]] },
  chief_krax:     { id:'chief_krax',     name:'Chief Krax',      img:A+'characters/Goblin/Goblin Males/goblin_02.PNG',        hp:90,  atk:11, def:3, xp:130, gold:[25,60],  ai:'melee', boss:true, loot:[['stolen_chalice',1.0],['axe_01',0.3],['heal_md',0.3]] },
  lich_lord_vael: { id:'lich_lord_vael', name:'Lich Lord Vael',  img:A+'characters/Monsters/Undead/LICH.PNG', hp:180, atk:16, def:7, xp:400, gold:[60,120], ai:'magic', boss:true, loot:[['elf_relic',1.0],['shadow_scroll',0.6],['rift_shard',0.8],['magic_dust',0.8]] },
  rift_avatar:    { id:'rift_avatar',    name:'Avatar of the Rift', img:A+'characters/Monsters/Undead/Monster_WarDragon.PNG', hp:260, atk:18, def:8, xp:1000, gold:[100,250], ai:'magic', boss:true, loot:[] },
};
