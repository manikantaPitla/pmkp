import React, { useEffect, useRef, useState } from "react";
import {
  getUserChats,
  getOlderMessages,
} from "../../services/firebaseFunctions";
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
  const { setMessages, addOlderMessages } = useMessage();

  const [oldestMessageId, setOldestMessageId] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);

  useEffect(() => {
    if (
      messageList.length > 0 &&
      oldestMessageId !== messageList[0]?.messageId
    ) {
      setOldestMessageId(messageList[0]?.messageId);
    }
  }, [messageList, oldestMessageId]);

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
  }, [userId, setMessages]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  const handleScroll = async () => {
    if (!messageList  || !messageList .length) return;

    if (
      !messageContainerRef.current ||
      loadingOlderMessages ||
      !hasMoreMessages
    )
      return;

    const { scrollTop } = messageContainerRef.current;

    if (scrollTop <= 10 && oldestMessageId) {
      setLoadingOlderMessages(true);
      try {
        const olderMessages = await getOlderMessages(userId, oldestMessageId);
        if (olderMessages?.length > 0) {
          addOlderMessages(olderMessages);
          setOldestMessageId(olderMessages[0]?.messageId);
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error("Error fetching older messages:", error);
      } finally {
        setLoadingOlderMessages(false);
      }
    }
  };

  const renderMessages = () => {
    return messageList.map((messageItem) => {
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
    });
  };

  return (
    <>
      <MessageContainer ref={messageContainerRef} onScroll={handleScroll}>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 ? (
          renderMessages()
        ) : (
          <p className="no-messages">No Messages</p>
        )}

        {loadingOlderMessages && (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        )}
      </MessageContainer>
      <ChatInput replyTo={replyTo} setReplyTo={setReplyTo} />
    </>
  );
}

export default ChatBody;
