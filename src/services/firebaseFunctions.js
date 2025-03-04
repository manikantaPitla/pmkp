import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase/dbConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const loginUser = async (email, password) => {
  const userData = await signInWithEmailAndPassword(auth, email, password);
  return userData;
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

export const getUserProfileData = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Couldn't find user");
  }
};

export const sendDirectMessage = async (uniqueId, message) => {
  const p_id = "E2TQeZUj6KPn8soR5w8dxU0kIaG2";
  const m_id = "ciYFmIKAXZhlFXvmgxLvbVOtvmv2";

  const senderId = uniqueId === "0928" ? p_id : m_id;
  const receiverId = uniqueId === "0928" ? m_id : p_id;

  const messageObj = {
    messageId: `${senderId}_${Date.now()}`,
    senderId,
    receiverId,
    message,
    timestamp: Date.now(),
    media: null,
  };

  const senderMessagesDocRef = doc(db, "messages", senderId);
  const receiverMessagesDocRef = doc(db, "messages", receiverId);

  const batch = writeBatch(db);

  batch.update(
    senderMessagesDocRef,
    {
      messageList: arrayUnion(messageObj),
    },
    { merge: true }
  );

  batch.update(
    receiverMessagesDocRef,
    {
      messageList: arrayUnion(messageObj),
    },
    { merge: true }
  );

  await batch.commit();
};

export const getUserByUniqueId = async (uniqueId) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uniqueId", "==", uniqueId));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data(); // Return the first matching user
  } else {
    return null; // No user found
  }
};
