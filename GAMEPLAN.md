# Mythward Clicker RPG — Full Implementation Plan
## For R720 LLM Agent Build

---

## World: Island of Fortuna

**Lore:** Year 500 Post-Atlas. The Heaven's Atlas device destroyed the elven capital Calidar.
The Rift — a spatial tear in the north — grows wider weekly. Undead hordes emerge from it.
The Holy Dominion (Helios theocracy) enforces a Magic Ban. The Adventure Guild operates in the grey.

---

## Locations & Connections

```
World Map
├── Ashford (starting town)
│   ├── Town Square (NPCs: Edric, Penn, Blind Tom)
│   ├── Inn — Bright Hearth (Aleva; cellar → Black Market/Kerris)
│   ├── Forge — Dorvak's (shop + blacksmithing)
│   ├── Temple of Helios (Mirela; healing + holy items)
│   └── Adventure Guild Hall (Marlowe; bounties)
├── Salt Mines (dungeon, 3 levels)
│   ├── Entrance (Foreman Urgak)
│   ├── Level 1 — spiders, zombies
│   ├── Level 2 — skeletons, lich cultists
│   └── Level 3 BOSS — Risen Foreman (drops mine key)
├── Goblin Haven (trading camp)
│   ├── Snix's Stall (illegal goods)
│   ├── Krix the Wise (teaches fire magic)
│   └── Warchief's Hall BOSS — Chief Krax
├── Calidar Ruins (ruined elf city)
│   ├── Ruins Plaza (Shade, The Curator)
│   ├── Dark Elf Quarter (Nyx the Poisoner)
│   └── Catacombs (3 floors) BOSS — Lich Lord Vael
└── Rift Outpost (unlocked after Salt Mines)
    ├── Inquisitor Voss (Dominion quests)
    ├── Templar Serah (paladin skills)
    └── Rift Gate (endgame — close the Rift)
```

---

## Full NPC Roster

### Ashford
| NPC | Role | Shop | Quests |
|-----|------|------|--------|
| Mayor Edric Thornwall | Quest giver | — | Clear Salt Mines |
| Aleva Brightwick | Innkeeper | Food, potions | — |
| Dorvak the Smith | Blacksmith | Weapons, armor | — |
| Sister Mirela | Healer/priest | Holy items | Retrieve stolen chalice |
| Guard Captain Penn | Law enforcement | — | Arrest wanted players |
| Blind Tom | Gossip/informant | — | Rumours unlock locations |
| Kerris (Fence) | Black market | Illegal goods | — |
| Marlowe | Guild master | Bounties | 5 bounty quests |
| Apprentice Wren | Runs errands | — | Courier quest chain |
| Helena (herbalist) | Sells herbs | Herbs | Find rare manaflower |

### Salt Mines
| Urgak | Foreman | — | Recover mine key |

### Goblin Haven
| Snix | Trader | Misc, illegal | — |
| Krix the Wise | Shaman teacher | — | Teach fire/poison magic |
| Chief Krax | Boss | — | Kill for bounty |

### Calidar Ruins
| Shade | Dark elf trader | Enchanting mats | — |
| The Curator | Scholar | Buys relics | Recover 3 elven relics |
| Nyx the Poisoner | Alchemist | Poisons | Craft master poison |

### Rift Outpost
| Inquisitor Voss | Dominion officer | Holy gear | Destroy rift shards |
| Templar Serah | Trainer | — | Teaches paladin skills |

---

## Systems Specification

### 1. NAVIGATION
- Scene-based click travel (world map → location → sub-location)
- Random encounters on travel (configurable % per zone)
- Locked areas require quest completion or items
- Day/night cycle affects NPC availability and encounter rates

### 2. COMBAT (Turn-Based)
```
Turn order: player → enemy (initiative dice roll at start)
Player actions:
  - Attack: d20 + STR/DEX mod vs enemy AC → damage = weapon.atk + mod - enemy.def
  - Defend: +4 def this turn, skip attack
  - Skill: use equipped scroll/spell (costs MP)
  - Use Item: potion/food (costs action)
  - Flee: d20 + DEX vs 10; fail = lose half turn

Enemy AI:
  - Melee: attack player
  - Ranged (archers): attack with range bonus if player no shield
  - Magic (cultists): random from [drain, curse, dark blast]
  - Boss patterns: 3-phase (normal → enraged at 50% HP → final form at 20%)

Status effects:
  - Poisoned: 5 dmg/turn for 3 turns
  - Stunned: skip N turns
  - Burning: 8 dmg/turn for 2 turns  
  - Cursed: -4 to all rolls for 3 turns
  - Blessed: +4 to all rolls for 3 turns (from temple)
```

### 3. INVENTORY & EQUIPMENT
```
Slots: weapon, off-hand/shield, chest, helm, boots, gloves, ring, belt, cloak
Weight system: each item has weight; over limit = speed penalty
Stacking: consumables stack; equipment does not
Quick-use slots: 4 hotkeys for consumables in combat
```

### 4. STEALTH / CRIME SYSTEM
```
Wanted Level: 0 (clean) → 5 (shoot on sight)
  - Using illegal items in public: roll Stealth vs 12; fail = +1 wanted
  - Picking pockets: roll Sleight vs NPC alertness
  - Hiding body: roll Stealth vs 14; witnesses increase difficulty
    - Check: d20 + DEX mod + Stealth skill vs DC
    - Witnesses nearby: +2 DC per NPC in scene
    - Poor light: -4 DC (easier to hide)
    - Guards in scene: +4 DC
  - Corpse discovered: +2 wanted level
  
Wanted Level Effects:
  0 = Normal, NPCs friendly
  1 = Guards suspicious, shop prices +10%
  2 = Guards hostile, some shops refuse service
  3 = Arrest on sight, bounty hunters spawn
  4 = Combat on sight from all guards
  5 = Entire Dominion hostile

Reduce wanted:
  - Bribe Penn (costs gold * wanted_level * 50)
  - Complete Dominion quests (-1 per major quest)
  - Time passage (sleep at inn = -1 wanted level per rest)
```

### 5. ALCHEMY
```
Workbench required (inn, alchemist, or portable kit)
Recipes:
  - Healing Potion: Healleaves x2 → Small Healing Potion
  - Greater Healing: Healleaves x3 + Silver bar → Greater Healing
  - Poison Vial: Poison Herb x2 + Empty Flask → Poison Vial [ILLEGAL]
  - Plague Flask: Poison Herb x3 + Stinkymushroom → Plague Flask [ILLEGAL]
  - Energy Potion: Mana Flower + Coal → Energy Potion
  - Stamina Potion: Raptor Herb + Meat → Stamina Potion
  
Alchemy Skill (1-100):
  - Low skill: chance of failure (destroys materials)
  - High skill: chance of extra product, upgraded quality
```

### 6. ENCHANTING
```
Enchanting Table required
Process:
  1. Choose item to enchant
  2. Choose enchantment scroll
  3. Add magic dust (quantity scales enchant level)
  4. Roll: d20 + INT mod vs DC (10/15/20 for +1/+2/+3)
  5. Fail: dust consumed, no enchant
  6. Critical fail: item destroyed
  7. Success: item gains bonus (e.g., +2 ATK, fire damage, +HP regen)

Max enchant level per item: +3 (legendary: +5)
Enchantments can be removed at high cost
```

### 7. SPELLMAKING
```
Spell components: 
  - Base scroll (fire/ice/shadow/holy)
  - Modifier reagents: amplify/extend/AOE/silence
  - Binding: rune stone locks the spell

Examples:
  fire_scroll + amplify_reagent + rune → Inferno Bolt (2x damage)
  sleep_scroll + extend_reagent → Deep Sleep (stun 4 turns)
  shadow_scroll + AOE → Shadow Burst (hits all enemies)
  
Spell legality:
  - Shadow/death spells: ILLEGAL in Dominion territory
  - Holy spells: FREE to use; Dominion approves
  - Curse spells: ILLEGAL everywhere
```

### 8. ECONOMY
```
Gold: standard currency
Faction reputation affects prices:
  - Dominion friendly: temple/guards give 10% discount
  - Guild member: shops give 5% discount
  - Outcast: some shops refuse service

Haggling mini-game:
  - Roll Persuasion vs merchant Willpower
  - Success: 10-20% discount
  - Fail: merchant offended, no further haggling today
  - Critical fail: +5% price
```

### 9. QUEST SYSTEM
```
Quest types:
  - Kill: defeat N enemies
  - Fetch: retrieve item and return
  - Deliver: carry item to destination (crime check if illegal item)
  - Escort: keep NPC alive through encounters
  - Investigate: talk to NPCs, gather clues

Quest flags unlock:
  - New areas (Rift Outpost after Mines cleared)
  - New NPCs appear
  - Dialogue changes
  - Endings: 3 possible (Dominion/Guild/Outcast)
```

---

## File Structure (for server build)

```
mythward-clicker/
├── index.html
├── src/
│   ├── main.js           — init, game loop
│   ├── state.js          — GameState singleton
│   ├── data/
│   │   ├── items.js
│   │   ├── enemies.js
│   │   ├── npcs.js
│   │   ├── scenes.js
│   │   ├── quests.js
│   │   └── recipes.js    — alchemy/enchanting/spellmaking
│   ├── systems/
│   │   ├── combat.js
│   │   ├── stealth.js
│   │   ├── economy.js
│   │   ├── crafting.js
│   │   └── quest.js
│   ├── render/
│   │   ├── scene.js      — world/scene drawing
│   │   ├── ui.js         — HUD, panels, overlays
│   │   └── combat_ui.js
│   └── utils.js          — dice, rng, helpers
├── assets/               — symlink or path to OneDrive assets
└── save.js               — localStorage save/load
```

---

## Asset Usage Map

| Asset folder | Used for |
|---|---|
| `characters/Human/` | NPCs portraits, player |
| `characters/Monsters/` | Enemy sprites in combat |
| `characters/Goblin/`, `/ORC/`, `/ELF/`, etc | Race-specific NPCs |
| `icons/weapons/` | Inventory weapon icons |
| `icons/armor/` | Inventory armor icons |
| `icons/loot/` | Drop/loot icons |
| `icons/professions/Alchemy/` | Potion icons |
| `icons/professions/Herbalism/` | Herb icons |
| `icons/professions/Enchantment/` | Enchanting material icons |
| `icons/professions/Engineering/` | Gnomish gadget icons |
| `icons/professions/Cooking_fishing/` | Food icons |
| `icons/resourcesandfood/` | Currency, materials, food |
| `icons/skills/` | Skill action icons in combat UI |
| `icons/tech/` | Tech-tree / research icons |
| `icons/quest/` | Quest item icons |
| `icons/buildingmaterialicons/` | Crafting/build materials |
| `Explore/ForgeBackgroundart.png` | Blacksmith scene background |
| `Explore/MarketBuy.png` | Market scene background |
| `Explore/Slots.png` | Tavern gambling minigame |
| `Explore/Hunt*.png` | Wilderness encounter backgrounds |
| `Explore/StallMarketSelling.png` | Market stall scene |
| `Explore/Petsim.png` | Farm/pet scene |
| `music/01_Horns_Of_War_*.WAV` | Combat music |
| `music/05_Misty_Lands_*.WAV` | World map / exploration |
| `music/07_Mountain_Halls_*.WAV` | Dungeon / ruins |
| `music/SW_Town_1.WAV` | Town ambient |
| `music/SW_Exploration_6.WAV` | Goblin haven / camp |

---

## Priority Build Order

1. **Core loop**: scene navigation + NPC dialogue + shop ✓ (done in game.html)
2. **Combat**: full turn-based with status effects
3. **Save/Load**: localStorage
4. **Crafting**: alchemy workbench UI
5. **Stealth system**: dice checks + wanted level full implementation
6. **Enchanting + spellmaking**
7. **Day/night cycle**
8. **Bounty/faction system**
9. **Multiple endings**

---

*Reviewer note: The local `game.html` at F:\MythwardClicker\game.html is a working single-file prototype
covering navigation, dialogue, shops, turn-based combat, inventory, and basic quest tracking.
Use it as the reference implementation. The server build should expand this data-driven pattern
into the modular file structure above, adding the crafting/stealth/faction systems not yet in the prototype.*
