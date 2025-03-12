import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  writeBatch,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/dbConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { mId, pId } from "../utils/userIdentity";

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  await signOut(auth);
};

export const getUserProfileData = async (userId) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) return docSnap.data();
  throw new Error("Couldn't find user");
};

export const updateLastLogin = async (userId) => {
  await updateDoc(doc(db, "users", userId), { lastLogin: serverTimestamp() });
};

const sendMessageUtility = async (
  isAuthMessage,
  senderId,
  receiverId,
  message,
  addNewMessage,
  updateMessage,
  replyTo
) => {
  const messageObj = {
    messageId: `${senderId}_${Date.now()}`,
    senderId,
    receiverId,
    message,
    timestamp: Date.now(),
    media: null,
    ...(replyTo && { replyTo: { ...replyTo } }),
  };

  if (isAuthMessage) addNewMessage({ ...messageObj, status: "sending" });

  const batch = writeBatch(db);
  batch.set(
    doc(db, "messages", senderId),
    { messageList: arrayUnion(messageObj) },
    { merge: true }
  );
  batch.set(
    doc(db, "messages", receiverId),
    { messageList: arrayUnion(messageObj) },
    { merge: true }
  );

  await batch.commit();
  if (isAuthMessage)
    updateMessage({ messageId: messageObj.messageId, status: "sent" });
};

export const sendDirectMessage = async (uniqueId, message) => {
  const senderId = uniqueId === "0928" ? pId : mId;
  const receiverId = uniqueId === "0928" ? mId : pId;
  await sendMessageUtility(
    false,
    senderId,
    receiverId,
    message,
    () => {},
    () => {},
    null
  );
};

export const sendAuthUserMessage = async (
  senderId,
  message,
  addNewMessage,
  updateMessage,
  replyTo
) => {
  const receiverId = senderId === pId ? mId : pId;
  await sendMessageUtility(
    true,
    senderId,
    receiverId,
    message,
    addNewMessage,
    updateMessage,
    replyTo
  );
};

export const getUserChats = async (
  userId,
  setMessages,
  startLoading,
  stopLoading
) => {
  startLoading();
  try {
    const userChatDocSnap = await getDoc(doc(db, "messages", userId));
    setMessages(
      userChatDocSnap.exists() ? userChatDocSnap.data().messageList || [] : []
    );
  } catch (error) {
    console.error("Error fetching user chats:", error);
  } finally {
    stopLoading();
  }
};

export const getOlderMessages = async (userId, lastTimestamp) => {
  try {
    const userChatDocSnap = await getDoc(doc(db, "messages", userId));
    if (!userChatDocSnap.exists()) return [];

    return userChatDocSnap
      .data()
      .messageList.filter((msg) => msg.timestamp < lastTimestamp)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
  } catch (error) {
    console.error("Error fetching older messages:", error);
    return [];
  }
};

export const clearChat = async (userId) => {
  await updateDoc(doc(db, "messages", userId), { messageList: [] });
};
