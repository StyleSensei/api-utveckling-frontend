// import { refresh } from './script.js';
// let currentPageNo = 1;
// function setCurrentPageNo(newPageNo) {
//   currentPageNo = newPageNo;
// }

// function createPager(count, pageNo, currentPageSize) {
//   const pager = document.getElementById('pager');

//   pager.innerHTML = '';
//    let totalPages = Math.ceil(count / currentPageSize);
//   for (let i = 1; i <= totalPages; i++) {
//     const li = document.createElement('li');
//     li.classList.add('page-item');
//     if (i == pageNo) {
//       li.classList.add('active');
//     }
//     const a = document.createElement('a');
//     a.href = '#';
//     a.innerText = i;
//     a.classList.add('page-link');
//     li.appendChild(a);
//     a.addEventListener('click', (e) => {
//       // document.getElementsByClassName('container')[1].scrollIntoView();
//       e.preventDefault();
//       currentPageNo = i;
//       refresh();
//     });
//     pager.appendChild(li);
//   }
// }
// export { createPager, setCurrentPageNo}