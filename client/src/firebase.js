// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-6e32b.firebaseapp.com",
  projectId: "mern-estate-6e32b",
  storageBucket: "mern-estate-6e32b.appspot.com",
  messagingSenderId: "893745153058",
  appId: "1:893745153058:web:05cb515107b4a3f496367b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);