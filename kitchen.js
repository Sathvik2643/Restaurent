const container = document.getElementById("ordersContainer");

/* 🔥 LISTEN TO LIVE ORDERS */
db.ref("orders").on("value", snapshot => {
  container.innerHTML = "";

  snapshot.forEach(orderSnap => {
    const order = orderSnap.val();
    const id = orderSnap.key;

    if (order.status === "pending" || order.status === "cooking") {
      renderOrder(id, order);
    }
  });
});

/* 🧾 RENDER ORDER CARD */
function renderOrder(id, order) {
  const card = document.createElement("div");
  card.className = "order-card";

  let itemsHTML = "";
  order.items.forEach(i => {
    itemsHTML += `${i.name} x ${i.qty || 1}<br>`;
  });

  let btnHTML = "";
  if (order.status === "pending") {
    btnHTML = `<button class="cook" onclick="updateStatus('${id}','cooking')">Start Cooking</button>`;
  } else if (order.status === "cooking") {
    btnHTML = `<button class="ready" onclick="updateStatus('${id}','ready')">Mark Ready</button>`;
  }

  card.innerHTML = `
    <h3>Table ${order.table}</h3>
    <div class="items">${itemsHTML}</div>
    ${btnHTML}
  `;

  container.appendChild(card);
}

/* 🔄 UPDATE STATUS */
function updateStatus(id, status) {
  db.ref("orders/" + id + "/status").set(status);
}
