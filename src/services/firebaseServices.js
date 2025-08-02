import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  setDoc,
  onSnapshot,
  runTransaction,
} from "./firebase";
import { mId, p_uid, pId } from "../utils";
import { uploadToCloudinary } from "./cloudinaryServices";
import { createMediaObject } from ".";

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  await signOut(auth);
};

export const getUserProfileData = async userId => {
  if (!userId) return;

  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) return docSnap.data();
  throw new Error("Error finding user");
};

export const getUserProfileSnapShotData = (userId, callback) => {
  if (!userId || typeof callback !== "function") return;

  const userRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(
    userRef,
    docSnap => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        console.warn("User not found");
        callback(null);
      }
    },
    error => {
      console.error("Error listening to user data:", error);
    }
  );

  return unsubscribe;
};

export const updateLastLogin = async userId => {
  if (!userId) return;
  try {
    await updateDoc(doc(db, "users", userId), { lastLogin: serverTimestamp() });
  } catch (error) {
    throw new Error("Error updating last login");
  }
};

const sendMessageUtility = async (isAuthUser, senderId, receiverId, message, addNewMessage, updateMessage, replyTo, media) => {
  const timeStamp = Date.now();
  const messageId = `${senderId}_${timeStamp}`;

  const messageObj = {
    messageId,
    senderId,
    receiverId,
    message: message || null,
    timestamp: timeStamp,
    media: media || null,
    ...(replyTo && { replyTo: { ...replyTo } }),
  };

  try {
    const senderMessageRef = doc(db, "chats", senderId, "messages", messageId);
    const receiverMessageRef = doc(db, "chats", receiverId, "messages", messageId);

    let tempMedia = null;
    if (media) {
      tempMedia = await createMediaObject(media);
    }

    if (isAuthUser) {
      addNewMessage({
        ...messageObj,
        media: tempMedia,
        status: "sending",
      });
    }

    let cloudinaryObject = null;
    if (media) {
      cloudinaryObject = await uploadToCloudinary(
        media,
        progress => {
          updateMessage({
            messageId,
            progress,
          });
        },
        `${senderId}_${receiverId}`
      );
    }

    await setDoc(senderMessageRef, { ...messageObj, media: cloudinaryObject });
    await setDoc(receiverMessageRef, {
      ...messageObj,
      media: cloudinaryObject,
    });

    if (isAuthUser) updateMessage({ messageId, status: "sent" });
  } catch (error) {
    console.error("Error sending message:", error);
    if (isAuthUser) updateMessage({ messageId, status: "failed" });
  }
};

export const sendDirectMessage = async (uniqueId, message) => {
  const senderId = uniqueId === p_uid ? pId : mId;
  const receiverId = uniqueId === p_uid ? mId : pId;

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

export const sendAuthUserMessage = async (senderId, message, media, addNewMessage, updateMessage, replyTo) => {
  const receiverId = senderId === pId ? mId : pId;

  await sendMessageUtility(true, senderId, receiverId, message, addNewMessage, updateMessage, replyTo, media);
};

export const getUserMessages = (userId, setMessages, startLoading, stopLoading) => {
  if (!userId) return;

  startLoading();
  try {
    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const messages = querySnapshot.docs.map(doc => doc.data());
      setMessages(messages);
      stopLoading();
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching messages:", error);
    stopLoading();
  }
};

//currently not in use
export const getOlderMessages = async (userId, lastTimestamp) => {
  if (!userId || !lastTimestamp) return [];

  try {
    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, where("timestamp", "<", lastTimestamp), orderBy("timestamp", "desc"), limit(10));

    const querySnapshot = await getDocs(q);

    // ✅ Ensures all messages are fetched before returning
    return querySnapshot.docs.map(doc => doc.data()).reverse();
  } catch (error) {
    console.error("Error fetching older messages:", error);
    return [];
  }
};

export const clearChat = async userId => {
  if (!userId) return;

  try {
    const messagesRef = collection(db, "chats", userId, "messages");
    const messagesSnapshot = await getDocs(messagesRef);

    if (messagesSnapshot.empty) {
      throw new Error("No messages to delete");
    }

    const userChatRef = doc(db, "chats", userId);

    await runTransaction(db, async transaction => {
      messagesSnapshot.docs.forEach(msgDoc => transaction.delete(msgDoc.ref));

      transaction.update(userChatRef, {
        chatDeleteHistory: arrayUnion(Date.now()),
      });
    });
  } catch (error) {
    throw error;
  }
};
