const menu = document.getElementById('menu-label');
const menus = document.getElementById('basic-addon2');
const sidebar = document.getElementsByClassName('sidebar')[0];
const navBar = document.getElementsByClassName('navBar')[0];
const book = document.getElementsByClassName('book-container')[0];
const url = 'https://openlibrary.org/search.json?q=';
const form = document.getElementById('form');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const booksContainer = document.getElementById('booksContainer');
const spinner = document.getElementById('spinner');
const alert = document.getElementById('alert');
const warning = document.getElementById('warning');
const warningDiv = document.getElementById('warningDiv');
const serverError = document.getElementById('serverError');
const loadMoreContainer = document.getElementById('loadMoreContainer');

let pageNumber = 2;
let searchTerm = '';
let books = {};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  pageNumber = 2;
  searchTerm = searchInput.value.trim();
  searchInput.value = '';
  alert.classList.add('d-none');
  warning.classList.add('d-none');
  serverError.classList.add('d-none');
  loadMoreContainer.classList.add('d-none');

  if (searchTerm.length === 0) {
    alert.classList.remove('d-none');
    warning.classList.add('d-none');

    booksContainer.textContent = '';

    return;
  }

  try {
    spinner.classList.remove('d-none');
    booksContainer.textContent = '';

    const response = await fetch(`${url}${searchTerm}`);
    const data = await response.json();

    if (data.numFound === 0 || data.docs.length === 0) {
      warning.classList.remove('d-none');
      warningDiv.innerHTML = `No data matched with the keyword <span class="text-decoration-line-through">${searchTerm}</span>`;
      spinner.classList.add('d-none');
    } else {
      books = { ...books, ...data };
      renderBooks(books);
    }
  } catch (error) {
    serverError.classList.remove('d-none');
    spinner.classList.add('d-none');
  }
});

const renderBooks = ({ numFound, docs }) => {
  if (docs.length === numFound) {
    loadMoreContainer.classList.add('d-none');
  } else {
    loadMoreContainer.classList.remove('d-none');
  }
  spinner.classList.add('d-none');
  booksContainer.classList.remove('d-none');

  showResultCount(docs.length, numFound);

  const numBooksPerRow = 4; // Jumlah buku per baris
  const numRows = Math.ceil(docs.length / numBooksPerRow); // Jumlah baris yang diperlukan
  const booksToShow = docs.slice(0, numBooksPerRow * numRows); // Mengambil jumlah buku yang sesuai dengan jumlah baris

  for (let i = 0; i < numRows; i++) {
    const bookRow = document.createElement('div');
    bookRow.classList.add('row', 'justify-content-center');

    for (let j = 0; j < numBooksPerRow; j++) {
      const index = i * numBooksPerRow + j;
      if (index >= booksToShow.length) break;

      const { title, cover_i, author_name, first_publish_year, publisher } = booksToShow[index];

      const bookContainer = document.createElement('div');
      bookContainer.classList.add('col-md-1', 'book-container');

      // Tambahkan gaya pada elemen bookContainer
      bookContainer.style.width = '5px';
      bookContainer.style.marginRight = '120px';
      bookContainer.style.marginLeft = '80px';

      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');

      // Tambahkan gaya pada elemen bookCard
      bookCard.style.width = '240px';
      bookCard.style.padding = '20px';
      bookCard.style.height = '520px';
      bookCard.style.border = '2px solid #ddd';
      bookCard.style.borderRadius = '5px';
      bookCard.style.textAlign = 'center';
      bookCard.style.transition = 'all ease-in 0.3s';
      bookCard.style.position = 'relative';

      const imageUrl = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : 'static/image/noimage.png';

      bookCard.innerHTML = `
        <img src="${imageUrl}" alt="Book Cover">
        <h4>${title ? title : 'No Title Found For This Book'}</h4>
        <p>${author_name ? author_name : 'No Author Name Found'}</p>
        <p>${first_publish_year ? first_publish_year : 'No Publish Year Found'}</p>
        <p>${publisher ? publisher.slice(0, 2) : 'No Publisher Found'}</p>
    
      `;

      bookRow.appendChild(bookContainer); // Ubah urutan penambahan elemen
      bookContainer.appendChild(bookCard);
    }

    booksContainer.appendChild(bookRow);
  }

  booksContainer.style.overflowX = 'auto';
};

const showResultCount = (showCount, totalResult) => {
  const div = document.createElement('div');
  div.classList.add('row', 'my-4');
  div.innerHTML = `
    <div class="col-md-6">
     <p class="fw-bold">Showing ${showCount} of ${totalResult} books</p>  
    </div>
  `;
  booksContainer.appendChild(div);
};

loadMoreBtn.addEventListener('click', async (e) => {
  if (Object.keys(books).length !== 0) {
    loadMoreContainer.classList.add('d-none');
    spinner.classList.remove('d-none');
    const response = await fetch(`${url}${searchTerm}&page=${pageNumber}`);
    const data = await response.json();
    books.docs = [...books.docs, ...data.docs];
    booksContainer.textContent = '';
    renderBooks(books);
    pageNumber++;
  } else {
    return;
  }
});

menu.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
});
menu.addEventListener('click', function () {
  navBar.classList.toggle('hide');
});
menu.addEventListener('click', function () {
  book.classList.toggle('hide');
});
menus.addEventListener('click', function () {
  book.classList.toggle('hides');
});
