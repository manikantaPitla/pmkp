import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getOlderMessages, getNewerMessages } from "../services/api";
import { useMessage } from "./index";
import { toast } from "../utils";

const usePagination = userId => {
  const { addOlderMessages, addNewerMessages, setLoadingMoreMessages, setHasMoreMessages, setPagination } = useMessage();

  const { pagination, messageList } = useSelector(state => state.messages);
  const loadingRef = useRef(false);

  const loadOlderMessages = useCallback(async () => {
    if (!userId || !pagination.hasMore || pagination.isLoadingMore || loadingRef.current || !pagination.oldestTimestamp) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoadingMoreMessages(true);

      const startTime = Date.now();
      const olderMessages = await getOlderMessages(userId, pagination.oldestTimestamp, 20);
      const loadTime = Date.now() - startTime;

      const minLoadingTime = 800;
      const remainingTime = Math.max(0, minLoadingTime - loadTime);

      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (olderMessages.length > 0) {
        const container = document.querySelector("[data-message-container]");
        const oldHeight = container ? container.scrollHeight : 0;

        addOlderMessages(olderMessages);
        setPagination({
          oldestTimestamp: olderMessages[0].timestamp,
          hasMore: olderMessages.length === 20,
        });

        if (oldHeight > 0) {
          setTimeout(() => {
            const newHeight = container ? container.scrollHeight : 0;
            const heightDifference = newHeight - oldHeight;
            if (container && heightDifference > 0) {
              container.scrollTop += heightDifference;
            }
          }, 50);
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

  const loadNewerMessages = useCallback(async () => {
    if (!userId || !pagination.newestTimestamp || loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoadingMoreMessages(true);

      const startTime = Date.now();
      const newerMessages = await getNewerMessages(userId, pagination.newestTimestamp, 20);
      const loadTime = Date.now() - startTime;

      const minLoadingTime = 600;
      const remainingTime = Math.max(0, minLoadingTime - loadTime);

      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (newerMessages.length > 0) {
        addNewerMessages(newerMessages);

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

  const checkAndLoadMore = useCallback(
    (scrollTop, scrollHeight, clientHeight) => {
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
