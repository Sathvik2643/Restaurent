auth.onAuthStateChanged(user => {
  if (!user) location.href = "index.html";
  else checkAdmin(user.uid);
});

function checkAdmin(uid) {
  db.ref("users/" + uid).once("value", snap => {
    if (snap.val().role !== "admin") location.href = "index.html";
  });
}

function logout() {
  auth.signOut();
  location.href = "index.html";
}

db.ref("users").on("value", snap => {
  userList.innerHTML = "";
  snap.forEach(u => {
    const user = u.val();
    if (user.role === "admin") return;

    userList.innerHTML += `
      <li>
        ${user.name}
        <select onchange="changeRole('${u.key}',this.value)">
          <option value="waiter" ${user.role==="waiter"?"selected":""}>Waiter</option>
          <option value="kitchen" ${user.role==="kitchen"?"selected":""}>Kitchen</option>
        </select>
      </li>`;
  });
});

function changeRole(uid, role) {
  db.ref("users/" + uid + "/role").set(role);
}

function addMenu() {
  db.ref("menu").push({
    name: item.value,
    price: Number(price.value)
  });
}
