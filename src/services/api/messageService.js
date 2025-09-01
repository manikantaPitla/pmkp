import { doc, setDoc, collection, query, orderBy, onSnapshot, getDocs, runTransaction, arrayUnion, serverTimestamp, where, limit, updateDoc, db } from "../firebase";
import { uploadToCloudinary } from "../cloudinaryServices";
import { createMediaObject } from "../utils.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/constants";
import { pId, mId, p_uid } from "../../utils/userIdentity";

class MessageService {
  constructor() {
    this.db = db;
    this.MESSAGES_PER_PAGE = 30;
    this.REALTIME_LIMIT = 50;
  }

  async sendDirectMessage(uniqueId, message) {
    const senderId = uniqueId === p_uid ? pId : mId;
    const receiverId = uniqueId === p_uid ? mId : pId;

    await this._sendMessage(
      false,
      senderId,
      receiverId,
      message,
      null,
      () => {},
      () => {},
      null
    );
  }

  async sendAuthUserMessage(senderId, message, media, addNewMessage, updateMessage, replyTo) {
    const receiverId = senderId === pId ? mId : pId;
    await this._sendMessage(true, senderId, receiverId, message, media, addNewMessage, updateMessage, replyTo);
  }

  async _sendMessage(isAuthUser, senderId, receiverId, message, media, addNewMessage, updateMessage, replyTo) {
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
      const senderMessageRef = doc(this.db, "chats", senderId, "messages", messageId);
      const receiverMessageRef = doc(this.db, "chats", receiverId, "messages", messageId);

      let tempMedia = null;
      if (media) {
        tempMedia = await createMediaObject(media);
      }

      addNewMessage({
        ...messageObj,
        media: tempMedia,
        status: "sending",
      });

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

      updateMessage({ messageId, status: "sent" });

      return { success: true, message: SUCCESS_MESSAGES.MESSAGE_SENT };
    } catch (error) {
      console.error("Error sending message:", error);
      updateMessage({ messageId, status: "failed" });
      throw new Error(error.message || ERROR_MESSAGES.NETWORK);
    }
  }

  getUserMessages(userId, setMessages, startLoading, stopLoading, options = {}) {
    if (!userId) {
      console.warn("No userId provided for getUserMessages");
      return;
    }

    const { enableRealtime = true, initialLoad = true } = options;
    startLoading();

    try {
      const messagesRef = collection(this.db, "chats", userId, "messages");

      const initialQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(this.MESSAGES_PER_PAGE));

      let unsubscribe = null;

      if (enableRealtime) {
        const realtimeQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(this.REALTIME_LIMIT));

        unsubscribe = onSnapshot(
          realtimeQuery,
          querySnapshot => {
            const messages = querySnapshot.docs.map(doc => doc.data());

            const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sortedMessages);
            stopLoading();
          },
          error => {
            console.error("Error fetching messages:", error);
            stopLoading();
          }
        );
      } else {
        getDocs(initialQuery)
          .then(querySnapshot => {
            const messages = querySnapshot.docs.map(doc => doc.data());
            const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sortedMessages);
            stopLoading();
          })
          .catch(error => {
            console.error("Error fetching initial messages:", error);
            stopLoading();
          });
      }

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up message listener:", error);
      stopLoading();
      throw new Error(ERROR_MESSAGES.NETWORK);
    }
  }

  async getOlderMessages(userId, oldestTimestamp, limitCount = 20) {
    if (!userId || !oldestTimestamp) {
      return [];
    }

    try {
      const messagesRef = collection(this.db, "chats", userId, "messages");
      const q = query(messagesRef, where("timestamp", "<", oldestTimestamp), orderBy("timestamp", "desc"), limit(limitCount));

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => doc.data());
      return messages.reverse(); // Return in ascending order
    } catch (error) {
      console.error("Error fetching older messages:", error);
      throw new Error(ERROR_MESSAGES.NETWORK);
    }
  }

  async getNewerMessages(userId, newestTimestamp, limitCount = 20) {
    if (!userId || !newestTimestamp) {
      return [];
    }

    try {
      const messagesRef = collection(this.db, "chats", userId, "messages");
      const q = query(messagesRef, where("timestamp", ">", newestTimestamp), orderBy("timestamp", "asc"), limit(limitCount));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error fetching newer messages:", error);
      throw new Error(ERROR_MESSAGES.NETWORK);
    }
  }

  async getMessageCount(userId) {
    if (!userId) return 0;

    try {
      const messagesRef = collection(this.db, "chats", userId, "messages");
      const snapshot = await getDocs(messagesRef);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting message count:", error);
      return 0;
    }
  }

  async clearChat(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const messagesRef = collection(this.db, "chats", userId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      if (messagesSnapshot.empty) {
        throw new Error("No messages to delete");
      }

      const userChatRef = doc(this.db, "chats", userId);

      await runTransaction(this.db, async transaction => {
        messagesSnapshot.docs.forEach(msgDoc => {
          transaction.delete(msgDoc.ref);
        });

        transaction.update(userChatRef, {
          chatDeleteHistory: arrayUnion(Date.now()),
        });
      });

      return { success: true, message: SUCCESS_MESSAGES.CHAT_CLEARED };
    } catch (error) {
      console.error("Error clearing chat:", error);
      throw new Error(error.message || ERROR_MESSAGES.NETWORK);
    }
  }

  async updateMessageStatus(messageId, userId, status) {
    if (!messageId || !userId) {
      throw new Error("Message ID and User ID are required");
    }

    try {
      const messageRef = doc(this.db, "chats", userId, "messages", messageId);
      await updateDoc(messageRef, { status });
      return { success: true };
    } catch (error) {
      console.error("Error updating message status:", error);
      throw new Error(ERROR_MESSAGES.NETWORK);
    }
  }

  async editMessage(messageId, userId, newMessage) {
    if (!messageId || !userId || !newMessage) {
      throw new Error("Message ID, User ID, and new message are required");
    }

    try {
      const messageRef = doc(this.db, "chats", userId, "messages", messageId);
      const messageDoc = await getDocs(query(collection(this.db, "chats", userId, "messages"), where("messageId", "==", messageId)));

      if (messageDoc.empty) {
        throw new Error("Message not found");
      }

      const messageData = messageDoc.docs[0].data();
      const receiverId = messageData.receiverId;
      const timeSinceSent = Date.now() - messageData.timestamp;

      // Check if message is within 15 minutes
      if (timeSinceSent > 15 * 60 * 1000) {
        throw new Error("Message can only be edited within 15 minutes of sending");
      }

      const senderMessageRef = doc(this.db, "chats", userId, "messages", messageId);
      const receiverMessageRef = doc(this.db, "chats", receiverId, "messages", messageId);

      const updateData = {
        message: newMessage,
        editedAt: Date.now(),
        isEdited: true,
      };

      await updateDoc(senderMessageRef, updateData);
      await updateDoc(receiverMessageRef, updateData);

      return { success: true, message: SUCCESS_MESSAGES.MESSAGE_EDITED };
    } catch (error) {
      console.error("Error editing message:", error);
      throw new Error(error.message || ERROR_MESSAGES.NETWORK);
    }
  }

  async deleteMessage(messageId, userId) {
    if (!messageId || !userId) {
      throw new Error("Message ID and User ID are required");
    }

    try {
      const messageDoc = await getDocs(query(collection(this.db, "chats", userId, "messages"), where("messageId", "==", messageId)));

      if (messageDoc.empty) {
        throw new Error("Message not found");
      }

      const messageData = messageDoc.docs[0].data();
      const receiverId = messageData.receiverId;

      const senderMessageRef = doc(this.db, "chats", userId, "messages", messageId);
      const receiverMessageRef = doc(this.db, "chats", receiverId, "messages", messageId);

      await runTransaction(this.db, async transaction => {
        transaction.delete(senderMessageRef);
        transaction.delete(receiverMessageRef);
      });

      return { success: true, message: SUCCESS_MESSAGES.MESSAGE_DELETED };
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new Error(error.message || ERROR_MESSAGES.NETWORK);
    }
  }

  async markMessageAsSeen(messageId, userId) {
    if (!messageId || !userId) {
      throw new Error("Message ID and User ID are required");
    }

    try {
      const messageRef = doc(this.db, "chats", userId, "messages", messageId);
      await updateDoc(messageRef, {
        isSeen: true,
        seenAt: Date.now(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error marking message as seen:", error);
      throw new Error(ERROR_MESSAGES.NETWORK);
    }
  }
}

export const messageService = new MessageService();
export default messageService;
