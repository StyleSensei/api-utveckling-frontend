// import { createPager } from './createPager.js';
import { createResponseMessageModal } from './messages.js';
import { refresh } from './refresh.js';
import { searchPlayerOnInput } from './searchPlayerOnInput.js';
import './validators.js';
import { checkIfEmpty } from './validators.js';

export const allPlayersTBody = document.querySelector('#allPlayers tbody');
export const searchPlayer = document.getElementById('searchPlayer');
const searchForm = document.getElementById('search-form');
const allSortLinks = document.getElementsByClassName('bi');
const playerName = document.getElementById('playerName');
const jersey = document.getElementById('jersey');
const position = document.getElementById('position');
const team = document.getElementById('team');
export const overlay = document.createElement('div');

const btnAdd = document.getElementById('btnAdd');
const savePlayer = document.getElementById('save');
const responseMessageContainer = document.createElement('div');
const responseMessage = document.createElement('p');

overlay.classList.add('overlay');
responseMessageContainer.classList.add('response-message');

document.body.appendChild(overlay);
responseMessageContainer.appendChild(responseMessage);
document.body.appendChild(responseMessageContainer);

let editingPlayer = null;
export let currentSortCol = '';
export let currentSortOrder = '';
export let currentQ = '';
export let currentPageSize = 6;
export let currentPageNo = 1;

Object.values(allSortLinks).forEach((link) => {
  link.addEventListener('click', () => {
    currentSortCol = link.dataset.sortcol;
    currentSortOrder = link.dataset.sortorder;
    refresh();
  });
});

export function createTd(data) {
  let element = document.createElement('td');
  element.innerText = data;
  return element;
}

function debounce(cb, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
export function createPager(count, pageNo, currentPageSize) {
  const pager = document.getElementById('pager');

  pager.innerHTML = '';
  let totalPages = Math.ceil(count / currentPageSize);
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (i == pageNo) {
      li.classList.add('active');
    }
    const a = document.createElement('a');
    a.href = '#';
    a.innerText = i;
    a.classList.add('page-link');
    li.appendChild(a);
    a.addEventListener('click', (e) => {
      // document.getElementsByClassName('container')[1].scrollIntoView();
      e.preventDefault();
      currentPageNo = i;
      refresh();
    });
    pager.appendChild(li);
  }
}
async function fetchPlayers() {
  return await (await fetch('http://localhost:3000/api/players')).json();
}
export let players = await fetchPlayers();

export const updateQuery = debounce((query) => {
  currentQ = query;
  currentPageNo = 1;
  refresh();
  overlay.style.display = 'none';
}, 500);

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchPlayer.blur();
});

searchPlayer.addEventListener('focus', () => (overlay.style.display = 'flex'));

searchPlayer.addEventListener('blur', () => (overlay.style.display = 'none'));

searchPlayer.addEventListener('input', (e) => searchPlayerOnInput(e));

export const onClickPlayer = function (event) {
  const clickedElement = event.target;
  const player = players.result.find(
    (player) => player.id == clickedElement.dataset.playerid
  );
  playerName.value = player.name;
  jersey.value = player.jersey;
  position.value = player.position;
  team.value = player.team;
  editingPlayer = player;

  MicroModal.show('modal-1');
  checkIfEmpty();
};

savePlayer.addEventListener('click', async (ev) => {
  ev.preventDefault();
  let url = '';
  let method = '';
  const player = {
    name: playerName.value,
    jersey: jersey.value,
    position: position.value,
    team: team.value,
  };

  if (editingPlayer != null) {
    player.id = editingPlayer.id;
    url = 'http://localhost:3000/api/players/' + player.id;
    method = 'PUT';
  } else {
    url = 'http://localhost:3000/api/players';
    method = 'POST';
  }

  let response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: method,
    body: JSON.stringify(player),
  });
  if (response.status == 201) {
    let json = await response.json();
    createResponseMessageModal(
      'Player created!',
      'The player is successfully created in the database.'
    );
  }
  if (response.status == 204) {
    createResponseMessageModal(
      'Player updated!',
      'The player is successfully updated in the database.'
    );
  }
  if (response.status == 409) {
    createResponseMessageModal(
      'Player exists already',
      'The player you tried to create already exists in the database.'
    );
  }

  players = await fetchPlayers();
  refresh();
  MicroModal.close('modal-1');
  return player;
});

btnAdd.addEventListener('click', () => {
  playerName.value = null;
  jersey.value = 99;
  position.value = 'Choose a position';
  team.value = null;
  editingPlayer = null;

  MicroModal.show('modal-1');
  checkIfEmpty();
});

await refresh();

MicroModal.init({
  onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
  onClose: (modal) => console.info(`${modal.id} is hidden`), // [2]

  openTrigger: 'data-custom-open', // [3]
  closeTrigger: 'data-custom-close', // [4]
  openClass: 'is-open', // [5]
  disableScroll: true, // [6]
  disableFocus: false, // [7]
  awaitOpenAnimation: false, // [8]
  awaitCloseAnimation: false, // [9]
  debugMode: true, // [10]
});
