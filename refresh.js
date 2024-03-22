import { createResponseMessage404, noPlayersFound } from './messages.js';
import {
  currentPageNo,
  currentPageSize,
  currentSortCol,
  currentSortOrder,
  currentQ,
  allPlayersTBody,
  createTd,
  onClickPlayer,
} from './script.js';
import { createPager } from './script.js';

export async function refresh() {
  let offset = (currentPageNo - 1) * currentPageSize;
  let url =
    'http://localhost:3000/api/players?sortCol=' +
    currentSortCol +
    '&sortOrder=' +
    currentSortOrder +
    '&q=' +
    currentQ +
    '&limit=' +
    currentPageSize +
    '&offset=' +
    offset;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });
  noPlayersFound.innerHTML = '';
  noPlayersFound.style.display = 'none';

  if (response.status == 404) {
    allPlayersTBody.innerHTML = '';
    createPager(response.total, currentPageNo, currentPageSize);
    createResponseMessage404();
  } else {
    const players = await response.json();

    allPlayersTBody.innerHTML = '';

    players.result.forEach((player) => {
      const tr = document.createElement('tr');
      tr.appendChild(createTd(player.name));
      tr.appendChild(createTd(player.jersey));
      tr.appendChild(createTd(player.position));
      tr.appendChild(createTd(player.team));

      const td = document.createElement('td');
      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-secondary', 'btn-sm');
      btn.textContent = 'EDIT';
      btn.dataset.playerid = player.id;
      td.appendChild(btn);
      tr.appendChild(td);

      btn.addEventListener('click', onClickPlayer);

      allPlayersTBody.appendChild(tr);
    });
    createPager(players.total, currentPageNo, currentPageSize);
  }
}
