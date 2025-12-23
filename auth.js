let confirmationResult;
let currentUID;

/* reCAPTCHA */
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  'recaptcha',
  { size: 'invisible' }
);

function sendOTP() {
  const phone = document.getElementById("phone").value;

  if (!phone) {
    alert("Enter phone number");
    return;
  }

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      document.getElementById("otpSection").classList.remove("hidden");
      document.getElementById("sendOtpBtn").disabled = true;
    })
    .catch(err => {
      alert(err.message);
    });
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;

  confirmationResult.confirm(otp)
    .then(res => {
      currentUID = res.user.uid;

      db.ref("users/" + currentUID).once("value", snap => {
        if (snap.exists()) {
          redirectByRole(snap.val().role);
        } else {
          document.getElementById("registerSection").classList.remove("hidden");
        }
      });
    })
    .catch(() => alert("Invalid OTP"));
}

function registerUser() {
  const name = document.getElementById("name").value;

  if (!name) {
    alert("Enter your name");
    return;
  }

  db.ref("users/" + currentUID).set({
    name,
    role: "waiter",
    active: true
  });

  window.location.href = "waiter.html";
}

function redirectByRole(role) {
  if (role === "admin") location.href = "admin.html";
  else if (role === "kitchen") location.href = "kitchen.html";
  else location.href = "waiter.html";
}
