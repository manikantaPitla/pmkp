import { useState, useCallback } from "react";
import { validateFile } from "../utils/security";
import { toast } from "../utils";

/**
 * Custom hook for handling media file selection and preview
 * @param {Object} options - Media picker options
 * @returns {Object} Media state and handlers
 */
const useMediaPicker = (options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ["image/*", "video/*"],
    onMediaChange = null,
    onMediaRemove = null,
  } = options;

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleMediaChange = useCallback(
    e => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        validateFile(file);

        setMedia(file);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setMediaPreview(previewUrl);

        if (onMediaChange) {
          onMediaChange(file, previewUrl);
        }
      } catch (error) {
        toast.error(error.message);
        e.target.value = ""; // Reset file input
      }
    },
    [onMediaChange]
  );

  const removeMedia = useCallback(() => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMedia(null);
    setMediaPreview(null);

    if (onMediaRemove) {
      onMediaRemove();
    }
  }, [mediaPreview, onMediaRemove]);

  const getMediaType = useCallback(() => {
    if (!media) return null;
    return media.type.startsWith("image/") ? "image" : "video";
  }, [media]);

  const getMediaSize = useCallback(() => {
    if (!media) return 0;
    return media.size;
  }, [media]);

  const getMediaName = useCallback(() => {
    if (!media) return "";
    return media.name;
  }, [media]);

  // Cleanup preview URL on unmount
  const cleanup = useCallback(() => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
  }, [mediaPreview]);

  return {
    media,
    mediaPreview,
    handleMediaChange,
    removeMedia,
    getMediaType,
    getMediaSize,
    getMediaName,
    cleanup,
    hasMedia: !!media,
  };
};

export default useMediaPicker;
