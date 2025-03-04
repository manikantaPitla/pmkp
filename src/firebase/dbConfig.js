// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "pmk0928-a1dc7.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: "pmk0928-a1dc7.firebasestorage.app",
  messagingSenderId: "1036932299570",
  appId: "1:1036932299570:web:8e49758451688f9638352b",
  measurementId: "G-9XPZML2NZQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
