import React, { useEffect, useState } from "react";
import { getUserChats } from "../../services/firebaseFunctions";
import { MessageContainer, MessageItem } from "./styled-component";

function ChatBody({ userId }) {
  const [messageList, setMessageList] = useState([]);
  //   console.log(messageList);

  useEffect(() => {
    const getChats = async () => {
      const chatMessages = await getUserChats(userId);
      setMessageList(chatMessages.messageList);
    };
    getChats();
  }, []);

  return (
    <MessageContainer>
      {messageList.length > 0
        ? messageList.map((messageItem) => {
            const { message, senderId, messageId } = messageItem;
            return (
              <MessageItem key={messageId} $sender={userId === senderId}>
                <p>{message}</p>
              </MessageItem>
            );
          })
        : "chat data"}
    </MessageContainer>
  );
}

export default ChatBody;
