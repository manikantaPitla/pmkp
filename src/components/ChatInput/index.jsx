import React, { useRef, useState } from "react";
import { InputWrapper, ReplyPreview } from "./styled-component";
import { SendHorizontal, X } from "lucide-react";
import { sendAuthUserMessage } from "../../services";
import { useSelector } from "react-redux";
import { useMessage, useLoading } from "../../hooks";
import { minimizeText, toast } from "../../utils";

function ChatInput({ replyTo, setReplyTo }) {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);

  const { addNewMessage, updateMessage } = useMessage();
  const { loading, startLoading, stopLoading } = useLoading(false);
  const inputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    startLoading();
    try {
      const tempMessage = trimmedMessage;
      const tempReplyTo = replyTo;

      setMessage("");
      setReplyTo(null);
      inputRef.current?.focus();

      await sendAuthUserMessage(
        user?.id,
        tempMessage,
        addNewMessage,
        updateMessage,
        tempReplyTo
      );
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
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
              {user?.id === replyTo.senderId ? "yourself" : "Anonymous"}
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

      {message.length > 0 && message.trim().length > 0 && (
        <button type="submit" disabled={loading}>
          <SendHorizontal strokeWidth={1.5} size={22} />
        </button>
      )}
    </InputWrapper>
  );
}

export default React.memo(ChatInput);
