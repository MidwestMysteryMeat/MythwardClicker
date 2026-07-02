# Mythward — Island of Fortuna

A single-player, click-to-play RPG in plain HTML/JS. No build step, no dependencies:
open `index.html` in a browser and play. Progress autosaves to `localStorage`.

**Lore:** Year 500 Post-Atlas. The Heaven's Atlas device destroyed the elven capital
Calidar. The Rift — a spatial tear in the north — grows wider weekly, and undead
walk out of it. The Holy Dominion enforces a Magic Ban; the Adventure Guild operates
in the grey. You are an adventurer with a rusty sword and three loaves of bread.

## How to play

- Click map locations / exit buttons to travel (each trip advances the clock 1 hour).
- Click NPCs to talk, trade, take quests, or pick their pockets.
- Combat is turn-based: Attack / Defend / Skill / Item / Flee. Keys **1–4** quick-use potions.
- Rest at the Bright Hearth Inn (10g) to heal fully, skip to morning, and cool one wanted star.
- Blue buttons in scenes are crafting stations (alchemy bench, enchanting table, spirit altar).
- Finish the game at the **Rift Gate** — three endings (Dominion / Guild / Outcast) gated by
  reputation, after clearing the Salt Mines and destroying Lich Lord Vael.

## Systems

| System | Where |
|---|---|
| Turn-based combat: initiative, d20 to-hit, crits, status effects (poison/burn/stun/curse/bless), melee/ranged/magic enemy AI, 3-phase bosses | `src/systems/combat.js` |
| Crime & stealth: wanted levels 0–5, contraband inspections, pickpocketing, bribing Captain Penn, night/darkness modifiers | `src/systems/stealth.js` |
| Economy: faction-reputation pricing, fence pays more for hot goods, haggling mini-game (once per merchant per day) | `src/systems/economy.js` |
| Alchemy (skill 1–100, failures, bonus brews), enchanting (+1/+2/+3, nat-1 destroys the item), spellmaking (base scroll + reagent + rune stone) | `src/systems/crafting.js` |
| Quests: kill / fetch / craft / deliver, giver turn-ins, faction rep rewards, 3-ending finale | `src/systems/quest.js`, `src/data/quests.js` |
| Day/night cycle: NPC working hours, +encounter rate at night, easier stealth in the dark | `src/state.js`, `src/render/scene.js` |
| Save/load: autosave on travel, manual save/load/new in the header | `save.js` |

## File layout

```
index.html            markup + CSS, loads scripts in dependency order
save.js               localStorage save/load
src/
  utils.js            dice, rng, log, asset base path (A)
  state.js            GS singleton, inventory/equip/derived stats, time
  data/               items, enemies, npcs, scenes(+shops), quests(+endings), recipes
  systems/            combat, stealth, economy, crafting, quest
  render/             scene (canvas + DOM layer), ui (sidebar/dialogue/shop), combat_ui
game.html             original single-file prototype (reference implementation)
GAMEPLAN.md           design document this build implements
```

## Assets

Art and music load from `C:\Users\user\OneDrive\Desktop\Projects\assets\`
(the `A` constant at the top of `src/utils.js`). Every referenced path has been
verified against that library; if an image is missing the UI degrades to
placeholder boxes rather than broken-image icons. Audio starts after the first
click (browser autoplay policy).

## Testing

A headless smoke suite (17 checks: data referential integrity, full combat, boss
phases, quest flows, crafting, stealth, economy, save/load, finale) runs under
Node with DOM stubs — no browser needed. It lives in the dev scratchpad, not the
repo, and passed 17/17 at commit time.
