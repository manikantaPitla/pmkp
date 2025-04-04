import React, { useRef, useState } from "react";
import {
  FormButton,
  FormInput,
  InputWrapper,
  MediaPreview,
  ReplyMessageInnerContainer,
  ReplyMessageItem,
  ReplyPreview,
} from "./styled-component";
import { Image, SendHorizontal, X } from "lucide-react";
import { sendAuthUserMessage } from "../../services";
import { useSelector } from "react-redux";
import { useMessage, useLoading } from "../../hooks";
import { getTimeFormat, minimizeText, toast } from "../../utils";
import Button from "../ui/Button";
import MediaView from "../MediaView";

function ChatInput({ replyTo, setReplyTo }) {
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const { addNewMessage, updateMessage } = useMessage();
  const { loading, startLoading, stopLoading } = useLoading(false);
  const inputRef = useRef(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Only images and videos are allowed");
      return;
    }

    setMedia(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage && !media) return;

    startLoading();
    try {
      const tempMessage = trimmedMessage;
      const tempReplyTo = replyTo;

      setMessage("");
      setMedia(null);
      setReplyTo(null);
      setMedia(null);
      inputRef.current?.focus();

      await sendAuthUserMessage(
        user?.id,
        tempMessage,
        media,
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
      {/* show preview of reply message */}
      {replyTo && (
        <ReplyPreview>
          <ReplyMessageInnerContainer>
            <p className="user-reply-text">
              Replying to{" "}
              {user?.id === replyTo.senderId ? "yourself" : "Anonymous"}
              {" . "}
              <span>{getTimeFormat(replyTo.timestamp)}</span>
            </p>
            <ReplyMessageItem>
              {replyTo.message && !replyTo.media && (
                <p>{minimizeText(replyTo.message, 120)}</p>
              )}
              {replyTo.media && (
                <MediaView media={replyTo.media} isReplyMsg={true} />
              )}
            </ReplyMessageItem>
          </ReplyMessageInnerContainer>
          <button onClick={() => setReplyTo(null)}>
            <X size={16} />
          </button>
        </ReplyPreview>
      )}
      {/* show media preview when it is a available */}
      {media && (
        <MediaPreview>
          <div>
            {media.type.startsWith("image/") ? (
              <img src={URL.createObjectURL(media)} alt="media" />
            ) : (
              <video width="100%" height="auto" controls>
                <source src={URL.createObjectURL(media)} type={media.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="button-wrapper">
            <Button type="button" onClick={() => setMedia(null)}>
              Remove
            </Button>
            <Button as="label" htmlFor="fileInput">
              Change
            </Button>
          </div>
        </MediaPreview>
      )}

      <FormInput
        ref={inputRef}
        autoComplete="off"
        type="text"
        placeholder="Message..."
        value={message}
        name="message"
        onChange={(e) => setMessage(e.target.value)}
      />

      {message.trim().length === 0 && (
        <FormButton type="button">
          <input
            className="file-input"
            id="fileInput"
            type="file"
            accept="image/*, video/*"
            onChange={handleMediaChange}
          />
          <label htmlFor="fileInput">
            <Image />
          </label>
        </FormButton>
      )}

      {(media || message.trim().length > 0) && (
        <FormButton type="submit" disabled={loading}>
          <SendHorizontal strokeWidth={1.5} size={22} />
        </FormButton>
      )}
    </InputWrapper>
  );
}

export default React.memo(ChatInput);
