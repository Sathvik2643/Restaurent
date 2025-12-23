const firebaseConfig = {
  apiKey: "AIzaSyBiergZw0qe1zn8WS9vKRqw0JpV_5AeNjw",
  authDomain: "restaurent-2643.firebaseapp.com",
  databaseURL: "https://restaurent-2643-default-rtdb.firebaseio.com",
  projectId: "restaurent-2643",
  storageBucket: "restaurent-2643.firebasestorage.app",
  messagingSenderId: "199318631048",
  appId: "1:199318631048:web:ebd6114b7110159043a53d",
  measurementId: "G-T5T11XBEDG"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
