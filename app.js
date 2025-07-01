
const defaultCategories = ['Consumables', 'Essentials', 'Cooking', 'Miscellaneous'];
const defaultLocations = ['Storage', '1037', '1098', '1121/22', '630'];
const LOW_STOCK_THRESHOLD = 4;

let items = JSON.parse(localStorage.getItem('items')) || [];

function saveItems() {
  localStorage.setItem('items', JSON.stringify(items));
  renderInventory();
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (Array.isArray(imported)) {
        items = imported;
        saveItems();
      } else {
        alert("Invalid format.");
      }
    } catch (e) {
      alert("Invalid JSON.");
    }
  };
  reader.readAsText(file);
}

function showAddItemForm() {
  document.getElementById('formSection').style.display = 'block';
}

function submitNewItem() {
  const name = document.getElementById('newName').value;
  const description = document.getElementById('newDescription').value;
  const category = document.getElementById('newCategory').value;
  const location = document.getElementById('newLocation').value;
  const quantity = parseInt(document.getElementById('newQuantity').value);

  if (!name || !category || !location || isNaN(quantity)) return alert("Please fill all fields.");

  const newItem = {
    id: "id-" + Date.now(),
    name, description, category,
    locations: [{ location, quantity }]
  };
  items.push(newItem);
  saveItems();
}

function adjustQuantity(itemId, locName, delta) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  const loc = item.locations.find(l => l.location === locName);
  if (loc) {
    loc.quantity = Math.max(0, loc.quantity + delta);
    saveItems();
  }
}

function renderInventory() {
  const container = document.getElementById('inventoryList');
  if (!items.length) return container.innerHTML = "<p>No items yet.</p>";
  let html = "";
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  for (const cat in grouped) {
    html += `<h3>${cat}</h3><ul>`;
    grouped[cat].forEach(item => {
      html += `<li><strong>${item.name}</strong> — ${item.description || ""}<br>`;
      item.locations.forEach(loc => {
        const warning = loc.quantity < LOW_STOCK_THRESHOLD ? "⚠️" : "";
        html += `${loc.location}: ${loc.quantity} ${warning} <button onclick="adjustQuantity('${item.id}', '${loc.location}', 1)">+</button> <button onclick="adjustQuantity('${item.id}', '${loc.location}', -1)">-</button><br>`;
      });
      html += `</li>`;
    });
    html += "</ul>";
  }
  container.innerHTML = html;
}

document.getElementById("importInput").addEventListener("change", (e) => {
  if (e.target.files[0]) importJSON(e.target.files[0]);
});

renderInventory();
