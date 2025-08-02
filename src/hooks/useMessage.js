import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setChatMessages, addChatMessage, updateChatMessage, removeChatMessages } from "../app/features/messageReducer";

const useMessage = () => {
  const dispatch = useDispatch();

  const setMessages = useCallback(messageList => dispatch(setChatMessages(messageList)), [dispatch]);

  const addNewMessage = message => dispatch(addChatMessage(message));
  const clearMessages = () => dispatch(removeChatMessages());
  const updateMessage = message => dispatch(updateChatMessage(message));

  return {
    setMessages,
    addNewMessage,
    clearMessages,
    updateMessage,
  };
};

export default useMessage;
