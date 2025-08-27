// Security utilities for input validation, sanitization, and rate limiting
import DOMPurify from "dompurify";
import Cookies from "js-cookie";

// Input sanitization using DOMPurify (falls back to basic sanitization)
export const sanitizeInput = input => {
  if (typeof input !== "string") return input;

  try {
    return DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
  } catch {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim();
  }
};

// File validation
export const validateFile = file => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/ogg"];

  if (!file) {
    throw new Error("No file selected");
  }

  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 10MB");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not allowed. Only images and videos are supported");
  }

  return true;
};

// Rate limiting utility
class RateLimiter {
  constructor(limit = 10, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  checkLimit(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    const validRequests = userRequests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true;
  }

  reset(userId) {
    this.requests.delete(userId);
  }
}

export const loginRateLimiter = new RateLimiter(10, 300000); // 10 login attempts per 5 minutes

// Password validation
export const validatePassword = password => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!hasNumbers) {
    errors.push("Password must contain at least one number");
  }
  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Email validation
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// URL validation for links
export const validateUrl = url => {
  try {
    const urlObj = new URL(url);
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Session management
export const createSession = (userId, expiresIn = 24 * 60 * 60 * 1000) => {
  const session = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + expiresIn,
    token: Math.random().toString(36).substring(2) + Date.now().toString(36),
  };

  Cookies.set("session", JSON.stringify(session), {
    expires: new Date(session.expiresAt),
    sameSite: "Lax",
    secure: location.protocol === "https:",
  });
  return session;
};

export const getSession = () => {
  try {
    const cookie = Cookies.get("session");
    if (!cookie) return null;
    const session = JSON.parse(cookie);
    if (Date.now() > session.expiresAt) {
      Cookies.remove("session");
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  Cookies.remove("session");
};
