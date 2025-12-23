let confirmationResult;
let currentUID;

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  'recaptcha',
  { size: 'invisible' }
);

function sendOTP() {
  const phone = document.getElementById("phone").value;
  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then(res => {
      confirmationResult = res;
      document.getElementById("otpBox").style.display = "block";
    })
    .catch(err => alert(err.message));
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;

  confirmationResult.confirm(otp).then(res => {
    currentUID = res.user.uid;

    db.ref("users/" + currentUID).once("value", snap => {
      if (!snap.exists()) {
        document.getElementById("regBox").style.display = "block";
      } else {
        redirectByRole(snap.val().role);
      }
    });
  }).catch(() => alert("Invalid OTP"));
}

function registerUser() {
  const name = document.getElementById("name").value;

  db.ref("users/" + currentUID).set({
    name,
    role: "waiter",      // 🔒 ALWAYS DEFAULT
    active: true
  });

  window.location.href = "waiter.html";
}

function redirectByRole(role) {
  if (role === "admin") location.href = "admin.html";
  else if (role === "kitchen") location.href = "kitchen.html";
  else location.href = "waiter.html";
}
