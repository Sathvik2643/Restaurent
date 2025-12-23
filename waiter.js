let menu = [], order = [], total = 0;

auth.onAuthStateChanged(user => {
  if (!user) location.href = "index.html";
  else checkRole(user.uid, "waiter");
});

function checkRole(uid, role) {
  db.ref("users/" + uid).once("value", snap => {
    if (snap.val().role !== role) location.href = "index.html";
  });
}

function logout() {
  auth.signOut();
  location.href = "index.html";
}

db.ref("menu").on("value", snap => {
  menu = [];
  snap.forEach(i => menu.push({ id: i.key, ...i.val() }));
  renderMenu(menu);
});

function renderMenu(list) {
  menuList.innerHTML = "";
  list.forEach(i => {
    menuList.innerHTML += `
      <div>
        ${i.name} - ₹${i.price}
        <button onclick="addItem('${i.name}',${i.price})">+</button>
      </div>`;
  });
}

function filterMenu() {
  const q = search.value.toLowerCase();
  renderMenu(menu.filter(i => i.name.toLowerCase().includes(q)));
}

function addItem(name, price) {
  order.push({ name, price });
  total += price;
  renderOrder();
}

function renderOrder() {
  orderList.innerHTML = "";
  order.forEach((i, idx) => {
    orderList.innerHTML += `
      <li>${i.name} ₹${i.price}
      <button onclick="removeItem(${idx})">❌</button></li>`;
  });
  totalSpan.innerText = total;
}

function removeItem(i) {
  total -= order[i].price;
  order.splice(i, 1);
  renderOrder();
}

function sendOrder() {
  if (!tableNo.value || order.length === 0) return alert("Missing data");

  db.ref("orders").push({
    table: tableNo.value,
    items: order,
    total,
    status: "pending",
    time: new Date().toLocaleTimeString()
  });

  order = [];
  total = 0;
  renderOrder();
}

