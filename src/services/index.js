export * from "./emailService";
export * from "./firebaseServices";

export const getMediaFileSrc = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileSrc = reader.result;
      resolve(fileSrc);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
    sizes[i]
  }`;
};

export const reduceContent = (text, contentLength = 10) => {
  if (text.length > contentLength) {
    return text.substring(0, contentLength) + " ...";
  }
  return text;
};

export const createMediaObject = async (file) => {
  const [type, format] = file.type.split("/");

  return {
    name: file.name,
    type,
    format,
    size: file.size,
    url: await getMediaFileSrc(file),
  };
};
