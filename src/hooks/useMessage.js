import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  setChatMessages,
  addChatMessage,
  prependOlderMessages,
  appendNewerMessages,
  updateChatMessage,
  removeChatMessages,
  setPaginationState,
  setLoadingMore,
  setHasMore,
  deleteChatMessage,
} from "../app/features/messageReducer";

const useMessage = () => {
  const dispatch = useDispatch();

  const setMessages = useCallback(messageList => dispatch(setChatMessages(messageList)), [dispatch]);
  const addNewMessage = useCallback(message => dispatch(addChatMessage(message)), [dispatch]);
  const clearMessages = useCallback(() => dispatch(removeChatMessages()), [dispatch]);
  const updateMessage = useCallback(message => dispatch(updateChatMessage(message)), [dispatch]);
  const deleteMessage = useCallback(messageId => dispatch(deleteChatMessage(messageId)), [dispatch]);

  const addOlderMessages = useCallback(messages => dispatch(prependOlderMessages(messages)), [dispatch]);
  const addNewerMessages = useCallback(messages => dispatch(appendNewerMessages(messages)), [dispatch]);
  const setPagination = useCallback(pagination => dispatch(setPaginationState(pagination)), [dispatch]);
  const setLoadingMoreMessages = useCallback(loading => dispatch(setLoadingMore(loading)), [dispatch]);
  const setHasMoreMessages = useCallback(hasMore => dispatch(setHasMore(hasMore)), [dispatch]);

  return {
    setMessages,
    addNewMessage,
    addOlderMessages,
    addNewerMessages,
    clearMessages,
    updateMessage,
    deleteMessage,
    setPagination,
    setLoadingMoreMessages,
    setHasMoreMessages,
  };
};

export default useMessage;
