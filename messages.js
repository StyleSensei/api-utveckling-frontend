const modaltitle = document.getElementById('modal-2-title');
const modaltext = document.getElementById('modal-2-content');
export const noPlayersFound = document.createElement('p');
export const pagerContainer = document.getElementById('pager');

export function createResponseMessageModal(title, description) {
  modaltitle.innerText = title;
  modaltext.innerHTML = `<p>${description}</p>`;
  MicroModal.show('modal-2');
  setTimeout(() => {
    MicroModal.close('modal-2');
  }, 3000);
}

export function createResponseMessage404() {
  noPlayersFound.style.display = 'block';
  noPlayersFound.innerHTML = 'No players found. Please try something else.';
  pagerContainer.appendChild(noPlayersFound);
  noPlayersFound.classList.add('no-players-found');
}
