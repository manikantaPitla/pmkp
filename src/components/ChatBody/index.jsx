import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { getUserChats, getOlderMessages } from "../../services";
import {
  LoaderWrapper,
  MessageContainer,
  MessageItem,
  MessageTime,
  ReplyViewContainer,
} from "./styled-component";
import { useLoading, useMessage } from "../../hooks";
import { SquareLoader, getTimeFormat, minimizeText, pId } from "../../utils";
import { ChatInput } from "../";
import { useSelector } from "react-redux";
import { Send as SendIcon } from "lucide-react";

function ChatBody() {
  const messageList = useSelector((state) => state.messages.messageList);
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?.id;

  const [replyTo, setReplyTo] = useState(null);
  const [oldestMessageId, setOldestMessageId] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);

  const messageContainerRef = useRef(null);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const { setMessages, addOlderMessages } = useMessage();

  useEffect(() => {
    if (
      messageList.length > 0 &&
      oldestMessageId !== messageList[0]?.messageId
    ) {
      setOldestMessageId(messageList[0]?.messageId);
    }
  }, [messageList, oldestMessageId]);

  useEffect(() => {
    let unsubscribe;
    const getChats = async () => {
      try {
        unsubscribe = await getUserChats(
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

  const handleScroll = useCallback(async () => {
    if (!messageList || !messageList.length) return;
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
  }, [
    messageList,
    oldestMessageId,
    loadingOlderMessages,
    hasMoreMessages,
    userId,
    addOlderMessages,
  ]);

  const renderMessages = useMemo(() => {
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
  }, [messageList, userId]);

  return (
    <>
      <MessageContainer ref={messageContainerRef} onScroll={handleScroll}>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 ? (
          renderMessages
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

export default React.memo(ChatBody);
