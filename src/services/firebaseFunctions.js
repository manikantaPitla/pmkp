import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase/dbConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

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

export const updateLastLogin = async (userId) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    lastLogin: serverTimestamp(),
  });
};

const sendMessageUtitlity = async (
  isAuthMessage = false,
  senderId,
  receiverId,
  message,
  addNewMessage,
  updateMessage
) => {
  const messageObj = {
    messageId: `${senderId}_${Date.now()}`,
    senderId,
    receiverId,
    message,
    timestamp: Date.now(),
    media: null,
  };

  if (isAuthMessage) {
    const localMessageObj = {
      ...messageObj,
      status: "sending",
    };

    addNewMessage(localMessageObj);
  }

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

  if (isAuthMessage) {
    updateMessage({ messageId: messageObj.messageId, status: "sent" });
  }
};

export const sendDirectMessage = async (uniqueId, message) => {
  const p_id = "E2TQeZUj6KPn8soR5w8dxU0kIaG2";
  const m_id = "ciYFmIKAXZhlFXvmgxLvbVOtvmv2";

  const senderId = uniqueId === "0928" ? p_id : m_id;
  const receiverId = uniqueId === "0928" ? m_id : p_id;

  await sendMessageUtitlity(senderId, receiverId, message);
};

export const sendAuthUserMessage = async (
  senderId,
  message,
  addNewMessage,
  updateMessage
) => {
  const receiverId =
    senderId === "E2TQeZUj6KPn8soR5w8dxU0kIaG2"
      ? "ciYFmIKAXZhlFXvmgxLvbVOtvmv2"
      : "E2TQeZUj6KPn8soR5w8dxU0kIaG2";

  await sendMessageUtitlity(
    true,
    senderId,
    receiverId,
    message,
    addNewMessage,
    updateMessage
  );
};

export const getUserChats = async (
  userId,
  setMessages,
  startLoading,
  stopLoading
) => {
  startLoading();
  const userChatDocRef = doc(db, "messages", userId);

  const unsubscribe = onSnapshot(userChatDocRef, (messagesData) => {
    if (messagesData.exists()) {
      setMessages(messagesData.data().messageList);
    }

    stopLoading();
  });
  return unsubscribe;
};

export const clearChat = async (userId) => {
  const userChatDocRef = doc(db, "messages", userId);

  await updateDoc(userChatDocRef, {
    messageList: [],
  });
};
