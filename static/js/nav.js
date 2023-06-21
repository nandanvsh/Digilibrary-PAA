const menu = document.getElementById('menu-label');
const menus = document.getElementById('basic-addon2');
const sidebar = document.getElementsByClassName('sidebar')[0];
const navBar = document.getElementsByClassName('navBar')[0];
const book = document.getElementsByClassName('book-container')[0];

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
