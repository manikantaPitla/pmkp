import React, { useEffect, useRef } from "react";
import { getUserChats } from "../../services/firebaseFunctions";
import {
  LoaderWrapper,
  MessageContainer,
  MessageItem,
} from "./styled-component";
import useLoading from "../../hooks/useLoading";
import { SquareLoader } from "../../utils/loader";
import ChatInput from "../ChatInput";
import { useSelector } from "react-redux";
import useMessage from "../../hooks/useMessage";

function ChatBody({ userId }) {
  const messageList = useSelector((state) => state.messages.messageList);
  const messageContainerRef = useRef(null);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const { setMessages } = useMessage();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messageList]);

  useEffect(() => {
    const getChats = async () => {
      try {
        startLoading();
        const unsubscribe = await getUserChats(userId, setMessages);

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error(error.message);
      } finally {
        stopLoading();
      }
    };
    getChats();
  }, [setMessages]);

  return (
    <>
      <MessageContainer ref={messageContainerRef}>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 ? (
          messageList.map((messageItem) => {
            const { message, senderId, messageId } = messageItem;
            return (
              <MessageItem key={messageId} $sender={userId === senderId}>
                <p>{message}</p>
              </MessageItem>
            );
          })
        ) : (
          <p className="no-messages">No Messages</p>
        )}
      </MessageContainer>
      <ChatInput />
    </>
  );
}

export default ChatBody;
