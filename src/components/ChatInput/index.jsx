import React, { useRef, useState } from "react";
import { sendAuthUserMessage } from "../../services";
import { useSelector } from "react-redux";
import { useMessage, useLoading, useMediaPicker } from "../../hooks";
import { getTimeFormat, minimizeText, toast, sanitizeInput } from "../../utils";

function ChatInput({ replyTo, setReplyTo }) {
  const [message, setMessage] = useState("");
  const user = useSelector(state => state.auth.user);

  const { addNewMessage, updateMessage } = useMessage();
  const { loading, startLoading, stopLoading } = useLoading(false);
  const inputRef = useRef(null);

  const { media, mediaPreview, handleMediaChange, removeMedia, getMediaType } = useMediaPicker();

  const handleSendMessage = async e => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage && !media) return;

    startLoading();
    try {
      const sanitizedMessage = sanitizeInput(trimmedMessage);
      const tempMessage = sanitizedMessage;
      const tempReplyTo = replyTo;

      setMessage("");
      removeMedia();
      setReplyTo(null);
      inputRef.current?.focus();

      await sendAuthUserMessage(user?.id, tempMessage, media, addNewMessage, updateMessage, tempReplyTo);
    } catch (error) {
      toast.error(error.message);
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
              Replying to {user?.id === replyTo.senderId ? "yourself" : "Anonymous"}
              {" . "}
              <span>{getTimeFormat(replyTo.timestamp)}</span>
            </p>
            <ReplyMessageItem>
              {replyTo.message && !replyTo.media && <p>{minimizeText(replyTo.message, 120)}</p>}
              {replyTo.media && <MediaView media={replyTo.media} isReplyMsg={true} />}
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
            {getMediaType() === "image" ? (
              <img src={mediaPreview} alt="media" />
            ) : (
              <video width="100%" height="auto" controls>
                <source src={mediaPreview} type={media.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="button-wrapper">
            <Button type="button" onClick={removeMedia}>
              Remove
            </Button>
            <Button as="label" htmlFor="fileInput">
              Change
            </Button>
          </div>
        </MediaPreview>
      )}

      <FormInput ref={inputRef} autoComplete="off" type="text" placeholder="Message..." value={message} name="message" onChange={e => setMessage(e.target.value)} />

      {message.trim().length === 0 && (
        <FormButton type="button">
          <input className="file-input" id="fileInput" type="file" accept="image/*, video/*" onChange={handleMediaChange} />
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
