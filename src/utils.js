// ============================================================
// UTILS — dice, rng, logging, asset base path
// ============================================================
const A = 'file:///C:/Users/user/OneDrive/Desktop/Projects/assets/';
const PLAYER_IMG = A + 'characters/Human/Men_Human/Human_01_archer.PNG';

function rnd(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function d20(){ return rnd(1, 20); }
function roll(dice, sides, bonus = 0){ let t = 0; for(let i = 0; i < dice; i++) t += rnd(1, sides); return t + bonus; }
function statMod(v){ return Math.floor((v - 8) / 2); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function log(msg, cls = ''){
  const div = document.createElement('div');
  div.className = 'log-line ' + cls;
  div.textContent = msg;
  const l = document.getElementById('log');
  l.appendChild(div);
  while(l.children.length > 200) l.removeChild(l.firstChild);
  l.scrollTop = l.scrollHeight;
}
