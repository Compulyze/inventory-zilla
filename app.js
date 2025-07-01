const defaultCategories = ['Consumables', 'Essentials', 'Cooking', 'Miscellaneous'];
const defaultLocations = ['Storage', '1037', '1098', '1121/22', '630'];

let items = JSON.parse(localStorage.getItem('items')) || [];

function saveItems() {
  localStorage.setItem('items', JSON.stringify(items));
}

function addItem(item) {
  items.push(item);
  saveItems();
}

function renderApp() {
  document.getElementById("app").innerHTML = '<p>Inventory will be rendered here.</p>';
}

renderApp();
