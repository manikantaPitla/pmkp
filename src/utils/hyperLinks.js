export const makeLinksClickable = text => {
  if (!text) return "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => {
    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return url; // Return as plain text if not http/https
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline;">${url}</a>`;
    } catch {
      return url; // Return as plain text if invalid URL
    }
  });
};
