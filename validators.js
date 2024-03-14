
const nameInput = document.getElementById('playerName');
const jerseyInput = document.getElementById('jersey');
const positionInput = document.getElementById('position');
const teamInput = document.getElementById('team');
const savePlayer = document.getElementById('save');
const error = document.getElementById('jersey-error');

error.innerText = '';

nameInput.addEventListener('input', () => checkIfEmpty());
jerseyInput.addEventListener('input', () => {
  checkIfEmpty();
  if (jerseyInput.value < 0 || jerseyInput.value === '-0') {
    error.style.display = 'unset';
    error.innerText = 'Why so negative? :(';
    disableButton();
  } else {
    error.style.display = 'none';
  }
});
positionInput.addEventListener('input', () => checkIfEmpty());
teamInput.addEventListener('input', () => checkIfEmpty());

function checkIfEmpty() {
  if (
    nameInput.value === '' ||
    jerseyInput.value === '' ||
    positionInput.value === '' ||
    positionInput.value === 'Choose a position' ||
    teamInput.value === ''
  ) {
    disableButton();
  } else {
    enableButton();
  }
}


function disableButton() {
  savePlayer.disabled = true;
}
function enableButton() {
  savePlayer.disabled = false;
}

export {
  nameInput,
  jerseyInput,
  positionInput,
  teamInput,
  savePlayer,
  disableButton,
  enableButton,
  checkIfEmpty,
};
