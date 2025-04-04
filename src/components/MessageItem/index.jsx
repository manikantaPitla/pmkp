import React from "react";
import {
  MessageCard,
  MessageContainer,
  MessageInnerCard,
  MessageTime,
  ReplyViewContainer,
} from "./styled-component";
import { Send as SendIcon, CircleX as ErrorIcon } from "lucide-react";
import { getTimeFormat, minimizeText } from "../../utils";
import MediaView from "../MediaView";

function MessageItem({ messageData, userId, setReplyTo }) {
  const { senderId, message, messageId, timestamp, replyTo, status, media } =
    messageData;

  return (
    <MessageContainer key={messageId} $sender={userId === senderId}>
      <MessageCard $sender={userId === senderId}>
        {replyTo && (
          <ReplyViewContainer
            onClick={() => {
              const replyElement = document.getElementById(replyTo.messageId);
              if (replyElement)
                replyElement.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <p className="reply-to-user-message">
              {replyTo.senderId === userId ? "You" : "Anonymous"}
            </p>

            {replyTo && replyTo?.media && (
              <MediaView media={replyTo?.media} isReplyMsg={true} />
            )}
            <p>{minimizeText(replyTo.message, 120)}</p>
          </ReplyViewContainer>
        )}
        <MessageInnerCard
          $sender={userId === senderId}
          onClick={() =>
            setReplyTo({
              message,
              messageId,
              timestamp,
              media,
              senderId,
            })
          }
        >
          {media && <MediaView media={media} />}
          <p id={messageId}>{message}</p>
          <MessageTime>{getTimeFormat(timestamp)}</MessageTime>
        </MessageInnerCard>
      </MessageCard>
      {status && userId === senderId && status === "sending" ? (
        <SendIcon className="status-icon" size={12} />
      ) : (
        status === "failed" && (
          <ErrorIcon color="red" className="status-icon" size={12} />
        )
      )}
    </MessageContainer>
  );
}

export default React.memo(MessageItem);
