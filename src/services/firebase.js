export { doc, setDoc, getDoc, collection, query, orderBy, onSnapshot, getDocs, runTransaction, arrayUnion, serverTimestamp, where, limit, updateDoc } from "firebase/firestore";

export { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export { app, db, auth } from "../firebase/dbConfig";
