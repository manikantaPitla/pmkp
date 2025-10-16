import { useMemo } from "react";
import { groupMessagesByDate } from "../../utils/messages";

const VirtualizedMessageList = ({ messages, userId, setReplyTo, onEditMessage, onDeleteMessage }) => {
  const groupedElements = useMemo(() => groupMessagesByDate(messages), [messages]);

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
            />
          );
        }
      })}
    </>
  );
};

export default VirtualizedMessageList;
