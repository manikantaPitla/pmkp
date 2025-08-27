import { getFormattedDateLabel } from "./index";

/**
 * Groups messages by date for display with date dividers
 * @param {Array} messageList - Array of message objects
 * @returns {Array} Array of grouped messages with date dividers
 */
export const groupMessagesByDate = messageList => {
  const grouped = {};

  messageList.forEach(msg => {
    const dateLabel = getFormattedDateLabel(msg.timestamp);
    if (!grouped[dateLabel]) grouped[dateLabel] = [];
    grouped[dateLabel].push(msg);
  });

  const elements = [];
  Object.entries(grouped).forEach(([date, messages]) => {
    elements.push({ type: "date", date });
    messages.forEach(msg => {
      elements.push({ type: "message", message: msg });
    });
  });

  return elements;
};

/**
 * Sorts messages by timestamp in ascending order
 * @param {Array} messages - Array of message objects
 * @returns {Array} Sorted messages
 */
export const sortMessagesByTimestamp = messages => {
  return [...messages].sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Filters messages by sender or content
 * @param {Array} messages - Array of message objects
 * @param {string} filter - Filter string
 * @param {string} userId - Current user ID
 * @returns {Array} Filtered messages
 */
export const filterMessages = (messages, filter, userId) => {
  if (!filter) return messages;

  const lowerFilter = filter.toLowerCase();
  return messages.filter(msg => {
    const isOwnMessage = msg.senderId === userId;
    const messageText = msg.message?.toLowerCase() || "";
    const senderLabel = isOwnMessage ? "you" : "anonymous";

    return messageText.includes(lowerFilter) || senderLabel.includes(lowerFilter);
  });
};

/**
 * Gets the latest message timestamp
 * @param {Array} messages - Array of message objects
 * @returns {number|null} Latest timestamp or null if no messages
 */
export const getLatestMessageTimestamp = messages => {
  if (!messages.length) return null;
  return Math.max(...messages.map(msg => msg.timestamp));
};

/**
 * Checks if a message is from the current user
 * @param {Object} message - Message object
 * @param {string} userId - Current user ID
 * @returns {boolean} True if message is from current user
 */
export const isOwnMessage = (message, userId) => {
  return message.senderId === userId;
};

/**
 * Gets message status for display
 * @param {Object} message - Message object
 * @param {string} userId - Current user ID
 * @returns {string|null} Status string or null
 */
export const getMessageStatus = (message, userId) => {
  if (!isOwnMessage(message, userId)) return null;
  return message.status || null;
};
