export const minimizeText = (message, length = 45) => {
  return message?.length > length
    ? message?.substring(0, length) + "..."
    : message;
};


