const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_AUTH_DOMAIN",
  databaseURL: "PASTE_DB_URL",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_BUCKET",
  messagingSenderId: "PASTE_MSG_ID",
  appId: "PASTE_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
