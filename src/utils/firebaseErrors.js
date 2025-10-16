const firebaseErrorMessages = {
  "auth/email-already-in-use": "This email is already in use.",
  "auth/invalid-email": "Invalid email format.",
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests": "Too many requests, please try again later.",
  "auth/network-request-failed": "Network error, check your connection.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/requires-recent-login": "Please log in again to perform this action.",
  "auth/operation-not-allowed": "This sign-in method is not allowed.",
  "auth/invalid-credential": "Invalid email and password.",
  "auth/missing-email": "Please provide an email address.",
  "auth/missing-password": "Please enter a password.",
  "auth/account-exists-with-different-credential": "An account already exists with the same email but different sign-in credentials.",
  "auth/provider-already-linked": "This provider is already linked to another account.",

  "permission-denied": "You do not have permission to perform this action.",
  "not-found": "Requested document does not exist.",
  "already-exists": "This document already exists.",
  "resource-exhausted": "Too many requests, please slow down.",
  "deadline-exceeded": "Request took too long to complete.",
  "failed-precondition": "Operation is not allowed in the current state.",
  aborted: "Operation was aborted, please try again.",
  internal: "An internal error occurred, please try again.",
  unavailable: "Service is currently unavailable, try again later.",
  "data-loss": "Data loss detected, contact support.",
  unimplemented: "This operation is not supported.",
  cancelled: "Request was cancelled.",
  "invalid-argument": "Invalid request parameter(s).",
  unauthenticated: "You must be signed in to perform this action.",
  "out-of-range": "The value provided is out of allowed range.",

  "storage/object-not-found": "File does not exist.",
  "storage/unauthorized": "You do not have permission to access this file.",
  "storage/canceled": "Upload or download canceled.",
  "storage/unknown": "Unknown storage error occurred.",

  "functions/invalid-argument": "Invalid input provided.",
  "functions/deadline-exceeded": "Function execution took too long.",
  "functions/not-found": "Requested resource not found.",
  "functions/internal": "An internal function error occurred.",
  "functions/unavailable": "Cloud function is unavailable right now.",
};

/**
 * Returns a user-friendly error message for Firebase errors.
 * @param {object|string} error - Firebase error object or string.
 * @returns {string} User-friendly error message.
 */
export function getFirebaseErrorMessage(error) {
  if (!error) return "An unknown error occurred.";
  const errorCode = typeof error === "string" ? error : error.code;
  return firebaseErrorMessages[errorCode] || "Something went wrong, please try again.";
}
