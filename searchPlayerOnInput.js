import { overlay, updateQuery, searchPlayer, players } from './script.js';

export function searchPlayerOnInput(e) {
  overlay.style.display = 'flex';
  clearTimeout();
  updateQuery(e.target.value);
  const searchFor = searchPlayer.value.toLowerCase();
  for (let i = 0; i < players.length; i++) {
    if (players[i].matches(searchFor)) {
      players[i].visible = true;
    } else {
      players[i].visible = false;
    }
  }
}
