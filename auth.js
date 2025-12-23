// js/auth.js

let confirmationResult;
let currentUserUID = null;

// reCAPTCHA
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  'recaptcha',
  { size: 'invisible' }
);

function sendOTP() {
  const phone = document.getElementById("phone").value;

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      document.getElementById("otpSection").style.display = "block";
    })
    .catch(err => alert(err.message));
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;

  confirmationResult.confirm(otp).then(res => {
    currentUserUID = res.user.uid;

   db.ref("users/" + currentUserUID).once("value", snap => {
  if (!snap.exists()) {
    // First time user → register as waiter
    document.getElementById("registerSection").style.display = "block";
  } else {
    redirectByRole(snap.val().role);
  }
});

  }).catch(err => alert("Invalid OTP"));
}

function completeRegister() {
  const name = document.getElementById("name").value;

  db.ref("users/" + currentUserUID).set({
    name: name,
    role: "waiter",
    active: true,
    createdAt: new Date().toISOString()
  });

  window.location.href = "waiter.html";
}
