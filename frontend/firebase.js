// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-439e2.firebaseapp.com",
  projectId: "realestate-439e2",
  storageBucket: "realestate-439e2.appspot.com",
  messagingSenderId: "759897946584",
  appId: "1:759897946584:web:a4f848c182e3ea17d21aad"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);