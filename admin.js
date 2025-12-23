/* 🔐 AUTH GUARD */
firebase.auth().onAuthStateChanged(user => {
  if (!user) window.location.href = "index.html";
});

/* 🚪 LOGOUT */
function logout() {
  firebase.auth().signOut();
  window.location.href = "index.html";
}

/* 👨‍🍳 WAITERS */
function addWaiter() {
  const name = document.getElementById("waiterName").value;
  if (!name) return;

  db.ref("waiters").push({ name, active: true });
  document.getElementById("waiterName").value = "";
}

db.ref("waiters").on("value", snap => {
  const ul = document.getElementById("waiterList");
  ul.innerHTML = "";
  snap.forEach(w => {
    ul.innerHTML += `
      <li>${w.val().name}
        <button onclick="removeWaiter('${w.key}')">❌</button>
      </li>`;
  });
});

function removeWaiter(id) {
  db.ref("waiters/" + id).remove();
}

/* 🍽 MENU */
function addMenu() {
  const name = document.getElementById("menuName").value;
  const price = document.getElementById("menuPrice").value;
  if (!name || !price) return;

  db.ref("menu").push({ name, price });
  document.getElementById("menuName").value = "";
  document.getElementById("menuPrice").value = "";
}

db.ref("menu").on("value", snap => {
  const ul = document.getElementById("menuList");
  ul.innerHTML = "";
  snap.forEach(m => {
    ul.innerHTML += `
      <li>${m.val().name} - ₹${m.val().price}
        <button onclick="removeMenu('${m.key}')">❌</button>
      </li>`;
  });
});

function removeMenu(id) {
  db.ref("menu/" + id).remove();
}

/* 📊 ORDERS */
db.ref("orders").on("value", snap => {
  const div = document.getElementById("ordersList");
  div.innerHTML = "";

  snap.forEach(o => {
    const order = o.val();
    div.innerHTML += `
      <div style="margin-bottom:10px">
        <b>Table ${order.table}</b><br>
        Status: ${order.status}<br>
        Items: ${order.items.map(i => i.name).join(", ")}
      </div>`;
  });
});
