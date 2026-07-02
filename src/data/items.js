// ============================================================
// ITEM DATABASE
// w = weight, val = base value, illegal = crime check when bought/carried in Dominion territory
// slots: weapon, offhand, chest, helm, boots, gloves, ring, belt, cloak
// ============================================================
const ITEMS = {
  // ---- Weapons ----
  sword_01:    { id:'sword_01',    name:'Iron Sword',      type:'weapon', slot:'weapon', img:A+'icons/weapons/Sword_01.PNG',   atk:5,  w:4, val:80  },
  sword_10:    { id:'sword_10',    name:'Knight Sword',    type:'weapon', slot:'weapon', img:A+'icons/weapons/Sword_10.PNG',   atk:9,  w:5, val:180 },
  dagger_01:   { id:'dagger_01',   name:'Dagger',          type:'weapon', slot:'weapon', img:A+'icons/weapons/Dagger_01.PNG',  atk:3,  w:1, val:40  },
  axe_01:      { id:'axe_01',      name:'Axe',             type:'weapon', slot:'weapon', img:A+'icons/weapons/Axe_01.PNG',     atk:4,  w:4, val:55  },
  bow_01:      { id:'bow_01',      name:'Hunting Bow',     type:'weapon', slot:'weapon', img:A+'icons/weapons/Bow_01.PNG',     atk:4,  w:2, val:65, range:true },
  staff_1:     { id:'staff_1',     name:'Mage Staff',      type:'weapon', slot:'weapon', img:A+'icons/weapons/staff_1.PNG',    atk:3,  w:3, val:70, mpBonus:10 },
  wand:        { id:'wand',        name:'Wand',            type:'weapon', slot:'weapon', img:A+'icons/weapons/Wand.PNG',       atk:2,  w:1, val:50, mpBonus:5 },
  // ---- Off-hand ----
  buckler:     { id:'buckler',     name:'Buckler',         type:'armor', slot:'offhand', img:A+'icons/weapons/shield_01.PNG',  def:2, w:3, val:45, shield:true },
  kite_shield: { id:'kite_shield', name:'Kite Shield',     type:'armor', slot:'offhand', img:A+'icons/weapons/shield_10.PNG',  def:4, w:6, val:120, shield:true },
  // ---- Armor ----
  leather_chest:{ id:'leather_chest', name:'Leather Vest', type:'armor', slot:'chest', img:A+'icons/armor/LeatherVest.PNG',   def:3, w:5, val:60  },
  gambeson:    { id:'gambeson',    name:'Gambeson',        type:'armor', slot:'chest', img:A+'icons/armor/Gambesons.PNG',      def:4, w:6, val:75  },
  mail_chest:  { id:'mail_chest',  name:'Chain Mail',      type:'armor', slot:'chest', img:A+'icons/armor/MailChest.PNG',      def:7, w:10, val:150 },
  iron_helm:   { id:'iron_helm',   name:'Iron Helm',       type:'armor', slot:'helm',  img:A+'icons/armor/MetalHelmet.PNG',    def:2, w:3, val:45  },
  basic_helm:  { id:'basic_helm',  name:'Basic Helm',      type:'armor', slot:'helm',  img:A+'icons/armor/BasicHelm.PNG',      def:1, w:2, val:25  },
  leather_boots:{ id:'leather_boots', name:'Leather Boots', type:'armor', slot:'boots', img:A+'icons/armor/LeatherBoots.PNG', def:1, w:2, val:30 },
  plate_boots: { id:'plate_boots', name:'Plate Boots',     type:'armor', slot:'boots', img:A+'icons/armor/PlateBoots.PNG',     def:3, w:5, val:90  },
  leather_gloves:{ id:'leather_gloves', name:'Leather Gloves', type:'armor', slot:'gloves', img:A+'icons/armor/Gloves_01.PNG', def:1, w:1, val:25 },
  wool_cloak:  { id:'wool_cloak',  name:'Wool Cloak',      type:'armor', slot:'cloak', img:A+'icons/armor/Back_01.PNG',          def:1, w:2, val:35 },
  shadow_cloak:{ id:'shadow_cloak',name:'Shadow Cloak',    type:'armor', slot:'cloak', img:A+'icons/armor/Back_09.PNG',          def:1, w:1, val:140, stealth:3, desc:'Woven from Calidar dusk-thread. +3 Stealth.' },
  silver_ring: { id:'silver_ring', name:'Silver Ring',     type:'armor', slot:'ring',  img:A+'icons/loot/Loot_27_rune.PNG',    w:0, val:70, mpBonus:10, desc:'+10 max MP.' },
  hauler_belt: { id:'hauler_belt', name:"Hauler's Belt",   type:'armor', slot:'belt',  img:A+'icons/armor/Belt_01.PNG',           w:1, val:60, carry:12, desc:'+12 carry capacity.' },
  // ---- Potions / consumables ----
  heal_sm:     { id:'heal_sm',     name:'Healing Potion',  type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_13_heal_potion.PNG',      hp:30,  w:0.5, val:25 },
  heal_md:     { id:'heal_md',     name:'Greater Healing', type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_46_middleheal_flask.PNG',  hp:60,  w:0.5, val:50 },
  heal_lg:     { id:'heal_lg',     name:'Full Restore',    type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_54_hugeheal_flask.PNG',    hp:999, w:0.5, val:100 },
  mana_sm:     { id:'mana_sm',     name:'Mana Potion',     type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_20_littlemana_flask.PNG',  mp:25,  w:0.5, val:25 },
  energy_potion:{ id:'energy_potion', name:'Energy Potion', type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_24_energy_potion.PNG',    mp:60,  w:0.5, val:55 },
  stamina_potion:{ id:'stamina_potion', name:'Stamina Potion', type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_25_stamina_potion.PNG',         hp:25, mp:10, w:0.5, val:45 },
  poison_vial: { id:'poison_vial', name:'Vial of Poison',  type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_05_poison.PNG',            dot:5, dotTurns:3, w:0.5, val:35, illegal:true, combat:true, desc:'Poisons an enemy: 5 dmg/turn for 3 turns. ILLEGAL.' },
  plague_flask:{ id:'plague_flask',name:'Plague Flask',    type:'potion', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_50_plague_flask.PNG',            dot:12, dotTurns:3, w:0.5, val:110, illegal:true, combat:true, desc:'Virulent brew: 12 dmg/turn for 3 turns. HIGHLY ILLEGAL.' },
  // ---- Scrolls (usable in combat, and spellmaking bases) ----
  fire_scroll: { id:'fire_scroll', name:'Fire Scroll',     type:'scroll', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Scroll_fire.PNG',    spell:'fireball',  mpCost:15, dmg:30, burn:true, w:0.2, val:40, combat:true },
  ice_scroll:  { id:'ice_scroll',  name:'Ice Scroll',      type:'scroll', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_25_bluescroll.PNG',     spell:'frostbolt', mpCost:12, dmg:20, stun:1, w:0.2, val:38, combat:true },
  shadow_scroll:{ id:'shadow_scroll', name:'Shadow Scroll', type:'scroll', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_38_shadow_scroll.PNG', spell:'darkbolt',  mpCost:18, dmg:35, w:0.2, val:60, combat:true, illegal:true },
  holy_scroll: { id:'holy_scroll', name:'Holy Scroll',     type:'scroll', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_35_order_scroll.PNG',    spell:'smite',     mpCost:14, dmg:25, heal:10, w:0.2, val:45, combat:true },
  sleep_scroll:{ id:'sleep_scroll',name:'Sleep Scroll',    type:'scroll', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_24_purplescroll.PNG',   spell:'sleep',     mpCost:10, stun:2, w:0.2, val:30, combat:true },
  enchant_scroll:{ id:'enchant_scroll', name:'Enchant Scroll', type:'scroll', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Scroll_enchant.PNG', w:0.2, val:50, desc:'Required for enchanting gear at an enchanting table.' },
  // ---- Spellmaking reagents ----
  amplify_reagent:{ id:'amplify_reagent', name:'Amplify Reagent', type:'reagent', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_11_magicsubstance.PNG', w:0.2, val:45, desc:'Spellmaking: doubles spell damage.' },
  extend_reagent:{ id:'extend_reagent', name:'Extend Reagent', type:'reagent', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_13_magicsubstance.PNG',    w:0.2, val:40, desc:'Spellmaking: lengthens spell effects.' },
  aoe_reagent: { id:'aoe_reagent', name:'Burst Reagent',   type:'reagent', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_19_shadowsubstance.PNG',        w:0.2, val:42, desc:'Spellmaking: unstable burst, +50% damage.' },
  // ---- Materials ----
  iron_bar:    { id:'iron_bar',    name:'Iron Bar',        type:'material', img:A+'icons/resourcesandfood/Res_07_ironbar.PNG',   w:3, val:15 },
  silver_bar:  { id:'silver_bar',  name:'Silver Bar',      type:'material', img:A+'icons/resourcesandfood/Res_01_silverbar.PNG', w:3, val:40 },
  leather_mat: { id:'leather_mat', name:'Leather',         type:'material', img:A+'icons/loot/Loot_112_leather.PNG',             w:1, val:8  },
  rune_stone:  { id:'rune_stone',  name:'Rune Stone',      type:'material', img:A+'icons/loot/Loot_27_rune.PNG',                 w:1, val:20, desc:'Binds crafted spells. Used in spellmaking.' },
  magic_dust:  { id:'magic_dust',  name:'Magic Dust',      type:'material', img:A+'icons/professions/ProfessionAndCraftIcons/Enchantment/Enchantment_04_magicdust.PNG', w:0.2, val:15, desc:'Fuel for enchanting.' },
  coal:        { id:'coal',        name:'Coal',            type:'material', img:A+'icons/resourcesandfood/Coal.PNG',             w:1, val:5  },
  empty_flask: { id:'empty_flask', name:'Empty Flask',     type:'material', img:A+'icons/professions/ProfessionAndCraftIcons/Alchemy/Alchemy_03_flask.PNG', w:0.3, val:4 },
  // ---- Herbs ----
  herbs_heal:  { id:'herbs_heal',  name:'Healleaves',      type:'herb', img:A+'icons/professions/ProfessionAndCraftIcons/Herbalism/Herbalism_43_healleaves.PNG',     w:0.2, val:5  },
  herbs_poison:{ id:'herbs_poison',name:'Poison Herb',     type:'herb', img:A+'icons/professions/ProfessionAndCraftIcons/Herbalism/Herbalism_21_poisonous_mushroom.PNG', w:0.2, val:8, illegal:true },
  stinky_mushroom:{ id:'stinky_mushroom', name:'Stinky Mushroom', type:'herb', img:A+'icons/professions/ProfessionAndCraftIcons/Herbalism/Herbalism_24_stinkymushroom.PNG', w:0.2, val:6 },
  mana_flower: { id:'mana_flower', name:'Mana Flower',     type:'herb', img:A+'icons/professions/ProfessionAndCraftIcons/Herbalism/Herbalism_04_manaflower.PNG',          w:0.2, val:30, desc:'A rare bloom humming with arcane energy.' },
  raptor_herb: { id:'raptor_herb', name:'Raptor Herb',     type:'herb', img:A+'icons/professions/ProfessionAndCraftIcons/Herbalism/Herbalism_09_raptorherb.PNG',           w:0.2, val:12 },
  // ---- Food ----
  bread:       { id:'bread',       name:'Bread',           type:'food', img:A+'icons/resourcesandfood/Bread.PNG',   hp:5,  w:0.5, val:3  },
  steak:       { id:'steak',       name:'Steak',           type:'food', img:A+'icons/loot/Loot_89_steak.PNG',       hp:15, w:0.5, val:8  },
  beer:        { id:'beer',        name:'Ale',             type:'food', img:A+'icons/professions/ProfessionAndCraftIcons/Cooking_fishing/Cooking_50_beer.PNG', hp:5, mp:5, w:0.5, val:5 },
  // ---- Keys & quest items ----
  mine_key:    { id:'mine_key',    name:'Mine Key',        type:'key',   img:A+'icons/loot/Loot_54_key.PNG',        w:0.1, val:0 },
  stolen_chalice:{ id:'stolen_chalice', name:'Chalice of Helios', type:'quest', img:A+'icons/loot/Silvergoblet.PNG', w:1, val:0, desc:'The temple chalice, stolen in the goblin raids.' },
  wren_package:{ id:'wren_package',name:'Sealed Package',  type:'quest', img:A+'icons/resourcesandfood/BlackBag.PNG',  w:2, val:0, illegal:true, desc:"Wren's package. It clinks. Best not to ask." },
  rift_shard:  { id:'rift_shard',  name:'Rift Shard',      type:'quest', img:A+'icons/loot/WaterCrystal.PNG',   w:1, val:100, desc:'A crackling fragment of the Rift tear. Dangerous.' },
  elf_relic:   { id:'elf_relic',   name:'Elven Relic',     type:'quest', img:A+'icons/loot/Loot_186_ancient.PNG',   w:1, val:0 },
};
