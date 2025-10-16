import React, { useEffect, useState } from "react";
import { getUserMessages, editMessage, deleteMessage, markMessageAsSeen } from "../../services";
import { useLoading, useMessage, useAutoScroll, usePagination } from "../../hooks";
import { useSelector } from "react-redux";

function ChatBody() {
  const messageList = useSelector(state => state.messages.messageList);
  // removed unused pagination
  // const { pagination } = useSelector(state => state.messages);
  const currentUser = useSelector(state => state.auth.user);
  const userId = currentUser?.id;

  const [replyTo, setReplyTo] = useState(null);

  const { loading, startLoading, stopLoading } = useLoading(true);
  const { setMessages, updateMessage } = useMessage();

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
    } catch {}
  };

  const handleDeleteMessage = async messageId => {
    try {
      await deleteMessage(messageId, userId);
      updateMessage({ messageId, isDeleted: true, deletedAt: Date.now() });
    } catch {}
  };

  useEffect(() => {
    if (!userId || !messageContainerRef?.current) return;

    const candidates = messageList.filter(m => m.senderId !== userId && !m.isSeen && !m.isDeleted);

    if (candidates.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(async entry => {
          if (entry.isIntersecting && document.visibilityState === "visible" && document.hasFocus()) {
            const id = entry.target.getAttribute("id");
            if (!id) return;
            observer.unobserve(entry.target);
            try {
              await markMessageAsSeen(id, userId);
              updateMessage({ messageId: id, isSeen: true, seenAt: Date.now() });
            } catch {}
          }
        });
      },
      { root: messageContainerRef.current, threshold: 0.6 }
    );

    candidates.forEach(m => {
      const el = document.getElementById(m.messageId);
      if (el) observer.observe(el);
    });

    const onFocusOrVisibility = () => {
      // Re-trigger observer when returning to the tab
      candidates.forEach(m => {
        const el = document.getElementById(m.messageId);
        if (el) observer.observe(el);
      });
    };

    window.addEventListener("focus", onFocusOrVisibility);
    document.addEventListener("visibilitychange", onFocusOrVisibility);

    return () => {
      try {
        observer.disconnect();
      } catch {}
      window.removeEventListener("focus", onFocusOrVisibility);
      document.removeEventListener("visibilitychange", onFocusOrVisibility);
    };
  }, [messageList, userId, messageContainerRef, updateMessage]);

  useEffect(() => {
    if (!userId) return;
    let unsubscribe;
    try {
      unsubscribe = getUserMessages(userId, setMessages, startLoading, stopLoading, {
        enableRealtime: true,
        initialLoad: true,
      });
    } catch {}

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, setMessages, startLoading, stopLoading]);

  const allDeleted = messageList.length > 0 && messageList.every(msg => msg.isDeleted === true);

  return (
    <>
      <MessageContainer ref={messageContainerRef} data-message-container>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 && !allDeleted ? (
          <>
            {/* Loading indicator for older messages */}
            {isLoadingMore && hasMore && (
              <InlineInfo>
                <SquareLoader />
              </InlineInfo>
            )}

            {/* End of messages indicator */}
            {!hasMore && messageList.length > 0 && <EndInfo>You've reached the beginning of the conversation</EndInfo>}

            <VirtualizedMessageList
              messages={messageList}
              userId={userId}
              setReplyTo={setReplyTo}
              containerRef={messageContainerRef}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
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
