// Re-export Firebase services with specific imports
export { doc, setDoc, collection, query, orderBy, onSnapshot, getDocs, runTransaction, arrayUnion, serverTimestamp, where, limit, updateDoc } from "firebase/firestore";

export { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Re-export Firebase app instances
export { app, db, auth } from "../firebase/dbConfig";
