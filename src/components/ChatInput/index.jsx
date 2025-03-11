import React, { useRef, useState } from "react";
import { InputWrapper, ReplyPreview } from "./styled-component";
import { SendHorizontal, X } from "lucide-react";
import { sendAuthUserMessage } from "../../services/firebaseFunctions";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useMessage from "../../hooks/useMessage";
import useLoading from "../../hooks/useLoading";
import { minimizeText } from "../../utils/textUtil";
import { pId } from "../../utils/userIdentity";

function ChatInput({ replyTo, setReplyTo }) {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const { addNewMessage, updateMessage } = useMessage();
  const { loading, startLoading, stopLoading } = useLoading(false);
  const inputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    startLoading();
    try {
      const tempMessage = message;
      setMessage("");
      inputRef.current?.focus();

      await sendAuthUserMessage(
        user?.id,
        tempMessage,
        addNewMessage,
        updateMessage,
        replyTo
      );
      setReplyTo(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <InputWrapper onSubmit={handleSendMessage}>
      {replyTo && (
        <ReplyPreview>
          <div>
            <p className="user-reply-text">
              Replying to{" "}
              {user?.id === replyTo.senderId
                ? "yourself"
                : replyTo.senderId === pId
                ? "Pranu"
                : "Mani"}
            </p>
            <p>{minimizeText(replyTo.message)}</p>
          </div>
          <button onClick={() => setReplyTo(null)}>
            <X size={16} />
          </button>
        </ReplyPreview>
      )}
      <input
        ref={inputRef}
        autoComplete="off"
        type="text"
        placeholder="Message..."
        value={message}
        name="message"
        onChange={(e) => setMessage(e.target.value)}
      />
      {message.length > 0 && (
        <button type="submit" disabled={loading}>
          <SendHorizontal strokeWidth={1.5} size={22} />
        </button>
      )}
    </InputWrapper>
  );
}

export default ChatInput;
