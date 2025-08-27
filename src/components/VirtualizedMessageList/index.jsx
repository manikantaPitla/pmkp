import React, { useMemo } from "react";
import { groupMessagesByDate } from "../../utils/messages";
import MessageItem from "../MessageItem";
import DateDivider from "../DateDivider";

const VirtualizedMessageList = ({
  messages,
  userId,
  setReplyTo,
  containerRef, // Keep for future virtualization
  itemHeight = 80, // Keep for future virtualization
  overscan = 5, // Keep for future virtualization
  onEditMessage,
  onDeleteMessage,
  onMarkAsSeen,
}) => {
  const groupedElements = useMemo(() => groupMessagesByDate(messages), [messages]);

  // For now, let's render all messages normally to avoid complexity
  // We can implement virtualization later if needed for performance
  return (
    <>
      {groupedElements.map((element, index) => {
        if (element.type === "date") {
          return <DateDivider key={`divider-${element.date}-${index}`} date={element.date} />;
        } else {
          return (
            <MessageItem
              key={`message-${element.message.messageId}-${index}`}
              messageData={element.message}
              userId={userId}
              setReplyTo={setReplyTo}
              onEditMessage={onEditMessage}
              onDeleteMessage={onDeleteMessage}
              onMarkAsSeen={onMarkAsSeen}
            />
          );
        }
      })}
    </>
  );
};

export default VirtualizedMessageList;
