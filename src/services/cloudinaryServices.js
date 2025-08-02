export const uploadToCloudinary = (file, setProgress, folderName = "PMKP") => {
  return new Promise((resolve, reject) => {
    if (!file) return reject({ error: "No file selected" });

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folderName);

    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, true);

    // Track upload progress
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const { secure_url, resource_type, format, bytes, original_filename } = JSON.parse(xhr.responseText);

        const resObject = {
          name: original_filename,
          url: secure_url,
          type: resource_type,
          format,
          size: bytes,
        };
        resolve(resObject);
      } else {
        reject({ error: "Upload failed", details: xhr.responseText });
      }
    };

    xhr.onerror = () => reject({ error: "Upload error", details: xhr.responseText });

    xhr.send(formData);
  });
};
