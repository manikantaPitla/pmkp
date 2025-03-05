import React, { useState } from "react";
import { InputWrapper } from "./styled-component";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { SendHorizontal } from "lucide-react";
import { sendAuthUserMessage } from "../../services/firebaseFunctions";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useMessage from "../../hooks/useMessage";
import useLoading from "../../hooks/useLoading";

function ChatInput() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const { addNewMessage, updateMessage } = useMessage();
  const { loading, startLoading, stopLoading } = useLoading(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    startLoading();
    try {
      await sendAuthUserMessage(
        user?.id,
        message,
        addNewMessage,
        updateMessage
      );
      setMessage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <InputWrapper onSubmit={handleSendMessage}>
      <Input
        type="text"
        placeholder="Type message..."
        value={message}
        name="message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        <SendHorizontal strokeWidth={1.5} size={22} />
      </Button>
    </InputWrapper>
  );
}

export default ChatInput;
