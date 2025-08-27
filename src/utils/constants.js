// Application constants and configuration

export const APP_CONFIG = {
  NAME: "PMKP",
  VERSION: "1.0.0",
  DESCRIPTION: "Private Message Keeper",
};

export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    VIDEOS: ["video/mp4", "video/webm", "video/ogg"],
  },
  FOLDER_NAME: "PMKP",
};

export const RATE_LIMITS = {
  LOGIN: {
    LIMIT: 3,
    WINDOW: 300000, // 5 minutes
  },
  EMAIL: {
    LIMIT: 2,
    WINDOW: 600000, // 10 minutes
  },
};

export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  UNIQUE_ID: {
    LENGTH: 4,
    PATTERN: /^\d{4}$/,
  },
};

export const UI_CONFIG = {
  TOAST: {
    POSITION: "top-center",
    DURATION: 4000,
    STYLE: {
      padding: "6px 10px",
      fontSize: "12px",
      textAlign: "center",
      borderRadius: "20px",
    },
  },
  SCROLL: {
    BEHAVIOR: "smooth",
    OFFSET: 100,
  },
};

export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
  FILE_TOO_LARGE: "File size too large. Maximum size is 10MB.",
  INVALID_FILE_TYPE: "File type not allowed. Only images and videos are supported.",
  INVALID_EMAIL: "Please enter a valid email address.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password.",
};

export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful",
  LOGOUT: "Logged out successfully",
  MESSAGE_SENT: "Message sent successfully",
  MESSAGE_EDITED: "Message edited successfully",
  MESSAGE_DELETED: "Message deleted successfully",
  CHAT_CLEARED: "Chat cleared successfully",
  EMAIL_SENT: "Email notification sent successfully",
  PROFILE_UPDATED: "Profile updated successfully",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTRATION: "/one-time-registration",
  PROFILE: "/profile/:userId",
  NOT_FOUND: "*",
};

export const STORAGE_KEYS = {
  SESSION: "session",
  THEME: "theme",
  LANGUAGE: "language",
  SETTINGS: "settings",
};

export const API_ENDPOINTS = {
  CLOUDINARY: "https://api.cloudinary.com/v1_1",
  EMAILJS: "https://api.emailjs.com/api/v1.0/email/send",
};

export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};
