import React, { useEffect, useState } from "react";
import { getUserMessages, editMessage, deleteMessage, markMessageAsSeen } from "../../services";
import { ChatInputContainer, LoaderWrapper, MessageContainer } from "./styled-component";
import { useLoading, useMessage, useAutoScroll, usePagination } from "../../hooks";
import { SquareLoader } from "../../utils";
import { ChatInput, VirtualizedMessageList } from "../";
import { useSelector } from "react-redux";

function ChatBody() {
  const messageList = useSelector(state => state.messages.messageList);
  const { pagination } = useSelector(state => state.messages);
  const currentUser = useSelector(state => state.auth.user);
  const userId = currentUser?.id;

  const [replyTo, setReplyTo] = useState(null);

  const { loading, startLoading, stopLoading } = useLoading(true);
  const { setMessages, updateMessage, deleteMessage: deleteMessageFromStore } = useMessage();

  const { checkAndLoadMore, hasMore, isLoadingMore } = usePagination(userId);

  const { containerRef: messageContainerRef } = useAutoScroll(
    [messageList],
    {
      autoScrollOnNewMessages: true,
      isLoadingOlderMessages: isLoadingMore,
    },
    checkAndLoadMore
  );

  const handleEditMessage = async (messageId, newMessage) => {
    try {
      await editMessage(messageId, userId, newMessage);
      updateMessage({ messageId, message: newMessage, isEdited: true, editedAt: Date.now() });
    } catch (error) {}
  };

  const handleDeleteMessage = async messageId => {
    try {
      await deleteMessage(messageId, userId);
      deleteMessageFromStore(messageId);
    } catch (error) {}
  };

  const handleMarkAsSeen = async messageId => {
    try {
      await markMessageAsSeen(messageId, userId);
      updateMessage({ messageId, isSeen: true, seenAt: Date.now() });
    } catch (error) {}
  };

  useEffect(() => {
    let unsubscribe;
    const getChats = () => {
      try {
        unsubscribe = getUserMessages(userId, setMessages, startLoading, stopLoading, {
          enableRealtime: true,
          initialLoad: true,
        });
      } catch (error) {}
    };
    getChats();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, setMessages, startLoading, stopLoading]);

  return (
    <>
      <MessageContainer ref={messageContainerRef} data-message-container>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 ? (
          <>
            {/* Loading indicator for older messages */}
            {isLoadingMore && hasMore && <div style={{ textAlign: "center", padding: "10px", color: "var(--text-light-shaded)" }}></div>}

            {/* End of messages indicator */}
            {!hasMore && messageList.length > 0 && (
              <div style={{ textAlign: "center", padding: "10px", color: "var(--text-light-shaded)", fontSize: "var(--fs-s)" }}>
                You've reached the beginning of the conversation
              </div>
            )}

            <VirtualizedMessageList
              messages={messageList}
              userId={userId}
              setReplyTo={setReplyTo}
              containerRef={messageContainerRef}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onMarkAsSeen={handleMarkAsSeen}
            />
          </>
        ) : (
          <p className="no-messages">No Messages</p>
        )}
      </MessageContainer>
      <ChatInputContainer>
        <ChatInput replyTo={replyTo} setReplyTo={setReplyTo} />
      </ChatInputContainer>
    </>
  );
}

export default React.memo(ChatBody);
