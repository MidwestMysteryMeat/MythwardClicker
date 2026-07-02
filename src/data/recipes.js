// ============================================================
// ALCHEMY RECIPES
// difficulty: rolled against alchemy skill (see crafting.js). illegal: brewing it in
// Dominion territory with authority nearby risks a wanted level.
// ============================================================
const RECIPES = [
  { id:'r_heal_sm',   name:'Small Healing Potion', out:'heal_sm',       ins:[['herbs_heal',2]],                        difficulty:5  },
  { id:'r_heal_md',   name:'Greater Healing',      out:'heal_md',       ins:[['herbs_heal',3],['silver_bar',1]],       difficulty:20 },
  { id:'r_poison',    name:'Poison Vial',          out:'poison_vial',   ins:[['herbs_poison',2],['empty_flask',1]],    difficulty:15, illegal:true },
  { id:'r_plague',    name:'Plague Flask',         out:'plague_flask',  ins:[['herbs_poison',3],['stinky_mushroom',1]],difficulty:35, illegal:true },
  { id:'r_energy',    name:'Energy Potion',        out:'energy_potion', ins:[['mana_flower',1],['coal',1]],            difficulty:25 },
  { id:'r_stamina',   name:'Stamina Potion',       out:'stamina_potion',ins:[['raptor_herb',1],['steak',1]],           difficulty:10 },
];

// ============================================================
// ENCHANTING TIERS — d20 + INT mod vs DC. Fail: dust lost. Nat 1: item destroyed.
// Enchants attach to the equipment SLOT's current item (tracked in GS.player.enchants).
// ============================================================
const ENCHANT_TIERS = [
  { level:1, dc:10, dust:1, bonus:2 },
  { level:2, dc:15, dust:2, bonus:4 },
  { level:3, dc:20, dust:3, bonus:6 },
];

// ============================================================
// SPELLMAKING
// base scroll + optional modifier reagent + rune stone -> permanent castable spell
// ============================================================
const SPELL_BASES = {
  fire_scroll:   { name:'Fire',   dmg:30, burn:true,  mpCost:15 },
  ice_scroll:    { name:'Frost',  dmg:20, stun:1,     mpCost:12 },
  shadow_scroll: { name:'Shadow', dmg:35,             mpCost:18, illegal:true },
  holy_scroll:   { name:'Holy',   dmg:25, heal:10,    mpCost:14 },
  sleep_scroll:  { name:'Sleep',  dmg:0,  stun:2,     mpCost:10 },
};
const SPELL_MODS = {
  none:            { name:'',          apply:s=>s },
  amplify_reagent: { name:'Greater ',  apply:s=>({ ...s, dmg:s.dmg*2, mpCost:Math.round(s.mpCost*1.6) }) },
  extend_reagent:  { name:'Enduring ', apply:s=>({ ...s, stun:(s.stun||0)+2, heal:(s.heal||0)*2, mpCost:Math.round(s.mpCost*1.4) }) },
  aoe_reagent:     { name:'Bursting ', apply:s=>({ ...s, dmg:Math.round(s.dmg*1.5), mpCost:Math.round(s.mpCost*1.3) }) },
};
const SPELL_SUFFIX = { fire_scroll:'Bolt', ice_scroll:'Lance', shadow_scroll:'Grasp', holy_scroll:'Smite', sleep_scroll:'Lullaby' };
