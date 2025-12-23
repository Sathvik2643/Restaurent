/********* FIREBASE CONFIG *********/
const firebaseConfig = {
  apiKey: "PASTE_YOUR_KEY",
  authDomain: "PASTE_YOUR_DOMAIN",
  databaseURL: "PASTE_YOUR_DB_URL",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_BUCKET",
  messagingSenderId: "PASTE_ID",
  appId: "PASTE_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/********* ORDER LOGIC *********/
let currentOrder = [];
let total = 0;

function addItem() {
  const item = document.getElementById("item").value;
  const price = Number(document.getElementById("price").value);
  const qty = Number(document.getElementById("qty").value);

  if (!item || !price || !qty) {
    alert("Enter item details");
    return;
  }

  currentOrder.push({ item, price, qty });
  total += price * qty;
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("orderList");
  list.innerHTML = "";

  currentOrder.forEach(i => {
    list.innerHTML += `<li>${i.item} x ${i.qty}</li>`;
  });

  document.getElementById("total").innerText = total;
}

function sendToKitchen() {
  const table = document.getElementById("table").value;
  const waiter = document.getElementById("waiter").value;

  if (!table || !waiter || currentOrder.length === 0) {
    alert("Fill all details");
    return;
  }

  const orderId = "order_" + Date.now();

  db.ref("orders/" + orderId).set({
    table,
    waiter,
    items: currentOrder,
    total,
    status: "pending",
    time: new Date().toLocaleTimeString()
  });

  currentOrder = [];
  total = 0;
  renderOrder();

  alert("Order sent to kitchen");
}

/********* COUNTER LIVE STATUS *********/
db.ref("orders").on("value", snapshot => {
  const data = snapshot.val();
  const list = document.getElementById("liveOrders");
  if (!list || !data) return;

  list.innerHTML = "";

  for (let id in data) {
    list.innerHTML += `
      <li>
        <b>Table ${data[id].table}</b><br>
        Status: ${data[id].status}<br>
        Total: ₹${data[id].total}
      </li>`;
  }
});

/********* KITCHEN SCREEN *********/
function loadKitchen() {
  const list = document.getElementById("kitchenOrders");

  db.ref("orders").on("value", snapshot => {
    const data = snapshot.val();
    list.innerHTML = "";

    for (let id in data) {
      if (data[id].status === "pending") {
        list.innerHTML += `
          <li>
            <b>Table ${data[id].table}</b><br>
            ${data[id].items.map(i => `${i.item} x ${i.qty}`).join("<br>")}
            <br><br>
            <button onclick="markPrepared('${id}')">Prepared</button>
          </li>`;
      }
    }
  });
}

function markPrepared(id) {
  db.ref("orders/" + id + "/status").set("done");
}
