// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4SS9KZgs5QklIonorUc-dhgUs6zZ9uUc",
  authDomain: "portfolio-fe5b2.firebaseapp.com",
  projectId: "portfolio-fe5b2",
  storageBucket: "portfolio-fe5b2.appspot.com",
  messagingSenderId: "8771157772",
  appId: "1:8771157772:web:699f94dc377694f239d329",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
