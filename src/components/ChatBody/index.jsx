import React, { useEffect, useRef, useState, useMemo } from "react";
import { getUserMessages } from "../../services";
import { LoaderWrapper, MessageContainer } from "./styled-component";
import { useLoading, useMessage } from "../../hooks";
import { SquareLoader } from "../../utils";
import { ChatInput } from "../";
import { useSelector } from "react-redux";
import MessageItem from "../MessageItem";

function ChatBody() {
  const messageList = useSelector((state) => state.messages.messageList);
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?.id;

  const [replyTo, setReplyTo] = useState(null);

  const messageContainerRef = useRef(null);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const { setMessages } = useMessage();

  useEffect(() => {
    let unsubscribe;
    const getChats = () => {
      try {
        unsubscribe = getUserMessages(
          userId,
          setMessages,
          startLoading,
          stopLoading
        );
      } catch (error) {
        console.error(error.message);
      }
    };
    getChats();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, setMessages]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  const renderMessages = useMemo(() => {
    return messageList.map((messageItem) => (
      <MessageItem
        key={messageItem.messageId}
        messageData={{ ...messageItem }}
        userId={userId}
        setReplyTo={setReplyTo}
      />
    ));
  }, [messageList, userId]);

  return (
    <>
      <MessageContainer ref={messageContainerRef}>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 ? (
          renderMessages
        ) : (
          <p className="no-messages">No Messages</p>
        )}
      </MessageContainer>
      <ChatInput replyTo={replyTo} setReplyTo={setReplyTo} />
    </>
  );
}

export default React.memo(ChatBody);
