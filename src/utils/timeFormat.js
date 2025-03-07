export const getTimeFormat = (timestamp) => {
  const date = new Date(timestamp);

  const options = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).toUpperCase();
};

export const getLastLoginTimeFormat = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options).replace(",", "");

  return `Last login on ${formattedDate}`;
};
