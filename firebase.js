// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBn9xJKLtl_Bh-_ARpCdSQxjwKCHl601N4",
  authDomain: "smart-track-3a146.firebaseapp.com",
  projectId: "smart-track-3a146",
  storageBucket: "smart-track-3a146.firebasestorage.app",
  messagingSenderId: "752368569955",
  appId: "1:752368569955:web:71eb659b47595a6bb53256",
  measurementId: "G-BBKZLZFC90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);