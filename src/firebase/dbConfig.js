import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  //   apiKey: "AIzaSyCm-0snHN0D2tVBqJpP1Qej1woghJYbX2k",
  //   authDomain: "dj-01-2965c.firebaseapp.com",
  //   projectId: "dj-01-2965c",
  //   storageBucket: "dj-01-2965c.firebasestorage.app",
  //   messagingSenderId: "296718059888",
  //   appId: "1:296718059888:web:235235b3840a88153527b5",
  //   measurementId: "G-Y5J12W7T10",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
