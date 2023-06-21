const url = 'https://openlibrary.org/search.json?q=';

const menu = document.getElementById('basic-addon2');
const form = document.getElementById('form');
const book = document.getElementsByClassName('book-container')[0];
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const booksContainer = document.getElementById('booksContainer');
const spinner = document.getElementById('spinner');
const alert = document.getElementById('alert');
const warning = document.getElementById('warning');
const warningDiv = document.getElementById('warningDiv');
const serverError = document.getElementById('serverError');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const menus = document.getElementById('menu-label');
const sidebar = document.getElementsByClassName('sidebar')[0];
const navBar = document.getElementsByClassName('navBar')[0];

menus.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
});
menus.addEventListener('click', function () {
  navBar.classList.toggle('hide');
});
menus.addEventListener('click', function () {
  book.classList.toggle('hide');
});

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

  docs.forEach(({ title, cover_i, author_name, first_publish_year, publisher }, i) => {
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('col-md-4', 'col-lg-3');

    const imageUrl = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : 'static/image/noimage.png';

    bookContainer.innerHTML = `

        
        <div class="card border rounded text-center shadow-lg" style="min-height: 100%;" id="card">
            <img src="${imageUrl}" class="card-img-top img-fluid" alt="Book Cover" style="height: 20rem;"> 
            
                <h5 class="card-title py-4 fw-bolder"><span class="text-color">Title:</span> ${title ? title : 'No Title Found For This Book'}</h5>
           
            
                <div class="text-start px-2">
                    <p class=" "><span class="fw-bold text-color">Author: </span> ${author_name ? author_name : 'No Author Name Found'}</p>
                    <p class=" "><span class="fw-bold text-color">First Published: </span> ${first_publish_year ? first_publish_year : 'No Publish Year Found'}</p>
                    <p class=" "><span class="fw-bold text-color">Publisher: </span> ${publisher ? publisher.slice(0, 2) : 'No Publisher Found'}</p>
                </div>
        </div>
    `;
    booksContainer.appendChild(bookContainer);
  });
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
