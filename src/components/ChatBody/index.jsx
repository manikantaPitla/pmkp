import React, { useEffect, useRef, useState } from "react";
import { getUserChats } from "../../services/firebaseFunctions";
import {
  LoaderWrapper,
  MessageContainer,
  MessageItem,
  MessageTime,
  ReplyViewContainer,
} from "./styled-component";
import useLoading from "../../hooks/useLoading";
import { SquareLoader } from "../../utils/loader";
import ChatInput from "../ChatInput";
import { useSelector } from "react-redux";
import useMessage from "../../hooks/useMessage";
import { getTimeFormat } from "../../utils/timeFormat";
import { minimizeText } from "../../utils/textUtil";
import { pId } from "../../utils/userIdentity";
import { Send as SendIcon } from "lucide-react";

function ChatBody({ userId }) {
  const messageList = useSelector((state) => state.messages.messageList);

  const [replyTo, setReplyTo] = useState(null);

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
        const unsubscribe = await getUserChats(
          userId,
          setMessages,
          startLoading,
          stopLoading
        );
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error(error.message);
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
            const { message, senderId, messageId, timestamp, replyTo, status } =
              messageItem;
            return (
              <MessageItem key={messageId} $sender={userId === senderId}>
                <div className="message-main-container">
                  {replyTo && (
                    <ReplyViewContainer
                      onClick={() => {
                        const replyElement = document.getElementById(
                          replyTo.messageId
                        );
                        if (replyElement)
                          replyElement.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <p className="reply-to-user-message">
                        {userId === senderId
                          ? "You"
                          : replyTo.senderId === pId
                          ? "Pranu"
                          : "Mani"}
                      </p>
                      <p>{minimizeText(replyTo.message)}</p>
                    </ReplyViewContainer>
                  )}
                  <div
                    className="message-items-container"
                    onClick={() => setReplyTo({ messageId, message, senderId })}
                  >
                    <p id={messageId}>{message}</p>
                    <MessageTime>{getTimeFormat(timestamp)}</MessageTime>
                  </div>
                </div>
                {status && userId === senderId && status === "sending" && (
                  <SendIcon className="status-icon" size={12} />
                )}
              </MessageItem>
            );
          })
        ) : (
          <p className="no-messages">No Messages</p>
        )}
      </MessageContainer>
      <ChatInput replyTo={replyTo} setReplyTo={setReplyTo} />
    </>
  );
}

export default ChatBody;
