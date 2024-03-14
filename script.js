// import MicroModal from 'micromodal';
import './validators.js';
import { checkIfEmpty } from './validators.js';

const allPlayersTBody = document.querySelector('#allPlayers tbody');
const searchPlayer = document.getElementById('searchPlayer');
const allSortLinks = document.getElementsByClassName('bi');
const btnAdd = document.getElementById('btnAdd');
const savePlayer = document.getElementById('save');
const pager = document.getElementById('pager');
const responseMessageContainer = document.createElement('div')
const responseMessage = document.createElement('p')
const modaltitle = document.getElementById('modal-2-title')
const modaltext = document.getElementById('modal-2-content')



responseMessageContainer.classList.add('response-message')

responseMessageContainer.appendChild(responseMessage)
document.body.appendChild(responseMessageContainer)



let currentSortCol = '';
let currentSortOrder = '';
let currentQ = '';
let currentPageNo = 1;
let currentPageSize = 4;

Object.values(allSortLinks).forEach((link) => {
  link.addEventListener('click', () => {
    currentSortCol = link.dataset.sortcol;
    currentSortOrder = link.dataset.sortorder;
    refresh();
  });
});

function debounce(cb, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

const updateQuery = debounce((query) => {
  currentQ = query;
  currentPageNo = 1;
  refresh();
}, 500);

function createPager(count, pageNo, currentPageSize) {
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
    a.addEventListener('click', () => {
      currentPageNo = i;
      refresh();
    });
    pager.appendChild(li);
  }
}

searchPlayer.addEventListener('input', (e) => {
  updateQuery(e.target.value);
});

function Player(id, name, jersey, team, position) {
  this.id = id;
  this.name = name;
  this.jersey = jersey;
  this.team = team;
  this.position = position;
  this.visible = true;
  this.matches = function (searchFor) {
    return (
      this.name.toLowerCase().includes(searchFor) ||
      this.position.toLowerCase().includes(searchFor) ||
      this.team.toLowerCase().includes(searchFor) ||
      this.jersey.includes(searchFor)
    );
  };
}

async function fetchPlayers() {
  return await (await fetch('http://localhost:3000/api/players')).json();
}
 let players = await fetchPlayers();

searchPlayer.addEventListener('input', function () {
  const searchFor = searchPlayer.value.toLowerCase();
  for (let i = 0; i < players.length; i++) {
    // TODO add a matches function
    if (players[i].matches(searchFor)) {
      players[i].visible = true;
    } else {
      players[i].visible = false;
    }
  }
  refresh();
});

const createTableTdOrTh = function (elementType, innerText) {
  let element = document.createElement(elementType);
  element.textContent = innerText;
  return element;
};

const playerName = document.getElementById('playerName');
const jersey = document.getElementById('jersey');
const position = document.getElementById('position');
const team = document.getElementById('team');

let editingPlayer = null;

const onClickPlayer = function (event) {
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
  checkIfEmpty()

};
let player = {
  name: playerName.value,
  jersey: jersey.value,
  position: position.value,
  team: team.value,
};

savePlayer.addEventListener('click', async (ev) => {
  ev.preventDefault();
  let url = '';
  let method = '';
   player = {
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
    modaltitle.innerText = 'Player created!'
    modaltext.innerHTML = '<p>The player is successfully created in the database.</p>'
    MicroModal.show('modal-2')
    setTimeout(() => {
  MicroModal.close('modal-2');
      
    }, 3000);
  }
  if (response.status == 204) {
    modaltitle.innerText = 'Player updated!'
    modaltext.innerHTML = '<p>The player is successfully updated in the database.</p>'
    MicroModal.show('modal-2')
    setTimeout(() => {
  MicroModal.close('modal-2');
      
    }, 3000);
  }
  if(response.status == 409) {
    modaltitle.innerText = 'Player exists already'
    modaltext.innerHTML = '<p>The player you tried to create already exists in the database.</p>'
    MicroModal.show('modal-2')
    setTimeout(() => {
  MicroModal.close('modal-2');
      
    }, 3000);
  }

  players = await fetchPlayers();
  refresh();
  MicroModal.close('modal-1');
  return player
});

btnAdd.addEventListener('click', () => {
  playerName.value = null;
  jersey.value = 99;
  position.value = "Choose a position";
  team.value = null;
  editingPlayer = null;

  MicroModal.show('modal-1');
  checkIfEmpty()
});

function createTd(data) {
  let element = document.createElement('td');
  element.innerText = data;
  return element;
}

async function refresh() {
  let offset = (currentPageNo - 1) * currentPageSize;
  //fetch!
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
    btn.textContent = 'EDIT';
    btn.dataset.playerid = player.id;
    td.appendChild(btn);
    tr.appendChild(td);

    btn.addEventListener('click', onClickPlayer);

    allPlayersTBody.appendChild(tr);
  });
  createPager(players.total, currentPageNo, currentPageSize);

}

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