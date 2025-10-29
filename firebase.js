// firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn9xJKLtl_Bh-_ARpCdSQxjwKCHl601N4",
  authDomain: "smart-track-3a146.firebaseapp.com",
  projectId: "smart-track-3a146",
  storageBucket: "smart-track-3a146.firebasestorage.app",
  messagingSenderId: "752368569955",
  appId: "1:752368569955:web:71eb659b47595a6bb53256",
  measurementId: "G-BBKZLZFC90"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;