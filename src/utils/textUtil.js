export const minimizeText = (message) => {
  return message.length > 45 ? message.substring(0, 45) + "..." : message;
};
