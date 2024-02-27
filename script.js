const allPlayersTBody = document.querySelector('#allPlayers tbody');
const searchPlayer = document.getElementById('searchPlayer');
const allSortLinks = document.getElementsByClassName('bi');
const btnAdd = document.getElementById('btnAdd');
const closeDialog = document.getElementById('closeDialog');
const pager = document.getElementById('pager');

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
  currentPageNo = 1
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
};

closeDialog.addEventListener('click', async (ev) => {
  ev.preventDefault();
  let url = '';
  let method = '';
  var player = {
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
  }

  players = await fetchPlayers();
  refresh();
  MicroModal.close('modal-1');
});

btnAdd.addEventListener('click', () => {
  playerName.value = '';
  jersey.value = 0;
  position.value = '';
  team.value = '';
  editingPlayer = null;

  MicroModal.show('modal-1');
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
  //Paging behöver vi 20 posterna för aktuell sida
  // Totala antalet poster - count
  const players = await response.json();
  allPlayersTBody.innerHTML = '';
  players.result.forEach((player) => {
    const tr = document.createElement('tr');
    tr.appendChild(createTd(player.name));
    tr.appendChild(createTd(player.jersey));
    tr.appendChild(createTd(player.position));
    tr.appendChild(createTd(player.team));

       let td = document.createElement("td")
    let btn = document.createElement("button")
    btn.textContent = "EDIT"
        btn.dataset.playerid=player.id
        td.appendChild(btn)
        tr.appendChild(td)
    
        btn.addEventListener("click",onClickPlayer);
    

    allPlayersTBody.appendChild(tr);
  });
  createPager(players.total, currentPageNo, currentPageSize);

  // json
  //skapa ny trs tbody
}

await refresh();

// const updateTable = function async (){

//     // while(allPlayersTBody.firstChild)
//     //     allPlayersTBody.firstChild.remove()
//     allPlayersTBody.innerHTML = ""

//     // först ta bort alla children

// for(let i = 0; i < players.length; i++){
//     if(players[i].visible == false){
//         continue
//     }

//     tr.appendChild(createTableTdOrTh("th", players[i].name))
//     tr.appendChild(createTableTdOrTh("td", players[i].jersey ))
//     tr.appendChild(createTableTdOrTh("td", players[i].position ))
//     tr.appendChild(createTableTdOrTh("td", players[i].team ))

//     let td = document.createElement("td")
//     let btn = document.createElement("button")
//     btn.textContent = "EDIT"
//     btn.dataset.playerid=players[i].id
//     td.appendChild(btn)
//     tr.appendChild(td)

//     btn.addEventListener("click",onClickPlayer);

//     allPlayersTBody.appendChild(tr)
// }

// // players.forEach((player) => {
// //     if(player.visible == false){
// //         return
// //     }
// //     let tr = document.createElement("tr")

// //         tr.appendChild(createTableTdOrTh("th", player.name))
// //         tr.appendChild(createTableTdOrTh("td", player.jersey ))
// //         tr.appendChild(createTableTdOrTh("td", player.position ))
// //         tr.appendChild(createTableTdOrTh("td", player.team ))

// //         let td = document.createElement("td")
// //         let btn = document.createElement("button")
// //         btn.textContent = "EDIT"
// //         btn.dataset.playerid=player.id
// //         td.appendChild(btn)
// //         tr.appendChild(td)

// //         btn.addEventListener("click",onClickPlayer);

// //         // btn.addEventListener("click",function(){
// //         //       alert(player.name)
// //         //       //                      detta funkar fast med sk closures = magi vg
// //         // })

// //         allPlayersTBody.appendChild(tr)
// // });

//     // innerHTML och backticks `
//     // Problem - aldrig bra att bygga strängar som innehåller/kan innehålla html
//     //    injection
//     // for(let i = 0; i < players.length;i++) { // hrmmm you do foreach if you'd like, much nicer!
//     //                                         // I will show you in two weeks
//     //                                         //  or for player of players
//     //     let trText = `<tr><th scope="row">${players[i].name}</th><td>${players[i].jersey}</td><td>${players[i].position}</td><td>${players[i].team}</td></tr>`
//     //     allPlayersTBody.innerHTML += trText
//     // }
//     // createElement
// }

// updateTable()

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
