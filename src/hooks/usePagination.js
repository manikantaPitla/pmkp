import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getOlderMessages, getNewerMessages } from "../services/api";
import { useMessage } from "./index";
import { toast } from "../utils";

const usePagination = userId => {
  const { addOlderMessages, addNewerMessages, setLoadingMoreMessages, setHasMoreMessages, setPagination } = useMessage();

  const { pagination, messageList } = useSelector(state => state.messages);
  const loadingRef = useRef(false);

  // Load older messages when scrolling to top
  const loadOlderMessages = useCallback(async () => {
    if (!userId || !pagination.hasMore || pagination.isLoadingMore || loadingRef.current || !pagination.oldestTimestamp) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoadingMoreMessages(true);

      const olderMessages = await getOlderMessages(userId, pagination.oldestTimestamp, 20);

      if (olderMessages.length > 0) {
        // Store the current scroll height before adding messages
        const container = document.querySelector("[data-message-container]");
        const oldHeight = container ? container.scrollHeight : 0;

        addOlderMessages(olderMessages);

        // Update pagination state
        setPagination({
          oldestTimestamp: olderMessages[0].timestamp,
          hasMore: olderMessages.length === 20, // If we got less than 20, we've reached the end
        });

        // Maintain scroll position after adding older messages
        if (oldHeight > 0) {
          setTimeout(() => {
            const newHeight = container ? container.scrollHeight : 0;
            const heightDifference = newHeight - oldHeight;
            if (container && heightDifference > 0) {
              container.scrollTop += heightDifference;
            }
          }, 50); // Increased delay to ensure DOM has updated
        }
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      toast.error("Failed to load older messages");
    } finally {
      setLoadingMoreMessages(false);
      loadingRef.current = false;
    }
  }, [userId, pagination.hasMore, pagination.isLoadingMore, pagination.oldestTimestamp, addOlderMessages, setLoadingMoreMessages, setHasMoreMessages, setPagination]);

  // Load newer messages (for catching up when user returns)
  const loadNewerMessages = useCallback(async () => {
    if (!userId || !pagination.newestTimestamp || loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoadingMoreMessages(true);

      const newerMessages = await getNewerMessages(userId, pagination.newestTimestamp, 20);

      if (newerMessages.length > 0) {
        addNewerMessages(newerMessages);

        // Update pagination state
        setPagination({
          newestTimestamp: newerMessages[newerMessages.length - 1].timestamp,
        });
      }
    } catch (error) {
      toast.error("Failed to load newer messages");
    } finally {
      setLoadingMoreMessages(false);
      loadingRef.current = false;
    }
  }, [userId, pagination.newestTimestamp, addNewerMessages, setLoadingMoreMessages, setPagination]);

  // Check if we need to load more messages
  const checkAndLoadMore = useCallback(
    (scrollTop, scrollHeight, clientHeight) => {
      // Load older messages when near top (within 100px)
      if (scrollTop < 100 && pagination.hasMore && !pagination.isLoadingMore && pagination.oldestTimestamp) {
        loadOlderMessages();
      }
    },
    [pagination.hasMore, pagination.isLoadingMore, pagination.oldestTimestamp, loadOlderMessages]
  );

  return {
    loadOlderMessages,
    loadNewerMessages,
    checkAndLoadMore,
    hasMore: pagination.hasMore,
    isLoadingMore: pagination.isLoadingMore,
    messageCount: messageList.length,
  };
};

export default usePagination;
