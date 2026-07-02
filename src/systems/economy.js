// ============================================================
// ECONOMY — pricing, faction reputation, haggling
// ============================================================
function buyPrice(item, shop){
  let p = item.val * 1.2;
  if(GS.wantedLevel >= 1) p *= 1.1;                                    // suspicion tax
  if(shop.faction === 'dominion' && GS.rep.dominion >= 2) p *= 0.9;    // temple discount
  if(GS.rep.guild >= 2) p *= 0.95;                                     // guild member discount
  if(GS.haggleDeal && GS.haggleDeal.shop === currentShopId() && GS.haggleDeal.day === GS.time.day) p *= (1 - GS.haggleDeal.pct);
  return Math.max(1, Math.round(p));
}

function sellPrice(item, shop){
  let p = item.val * 0.6;
  if(shop && shop.fence && item.illegal) p = item.val * 0.8;           // fences pay more for hot goods
  return Math.max(1, Math.round(p));
}

function shopRefusesService(shop){
  if(shop.illegal) return false;                                       // criminals welcome
  return GS.wantedLevel >= 2;
}

// Haggling mini-game: Persuasion roll vs merchant willpower. Once per merchant per day.
function haggle(shopId){
  const shop = SHOPS[shopId];
  if(!shop) return;
  const npc = NPCS[shop.npc];
  const key = shop.npc || shopId;
  if(GS.haggled[key] === GS.time.day){ log('The merchant refuses to haggle again today.', 'warn'); return; }
  GS.haggled[key] = GS.time.day;
  const r = d20() + Math.floor(GS.player.skills.persuasion / 3) + statMod(GS.player.intl);
  const dc = 10 + (npc?.willpower || 5);
  if(r >= dc + 5){
    GS.haggleDeal = { shop: shopId, day: GS.time.day, pct: 0.2 };
    GS.player.skills.persuasion += 1;
    log('Masterful haggling! 20% off today. ('+r+' vs DC '+dc+')', 'info');
  } else if(r >= dc){
    GS.haggleDeal = { shop: shopId, day: GS.time.day, pct: 0.1 };
    GS.player.skills.persuasion += 1;
    log('You talk the prices down 10%. ('+r+' vs DC '+dc+')', 'info');
  } else if(r <= dc - 8){
    GS.haggleDeal = { shop: shopId, day: GS.time.day, pct: -0.05 };
    log('Critical insult! The merchant raises prices 5%. ('+r+' vs DC '+dc+')', 'warn');
  } else {
    log('The merchant is offended. No deal, and no more haggling today. ('+r+' vs DC '+dc+')', 'warn');
  }
  refreshShop();
}
