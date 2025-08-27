import { useState, useCallback } from "react";
import { validateEmail, validatePassword } from "../utils/security";
import { VALIDATION, ERROR_MESSAGES } from "../utils/constants";

const useFormValidation = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!validateEmail(value)) return ERROR_MESSAGES.INVALID_EMAIL;
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < VALIDATION.PASSWORD.MIN_LENGTH) {
          return `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`;
        }
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          return passwordValidation.errors[0];
        }
        return "";

      case "username":
        if (!value) return "Username is required";
        if (value.length < VALIDATION.USERNAME.MIN_LENGTH) {
          return `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters long`;
        }
        if (value.length > VALIDATION.USERNAME.MAX_LENGTH) {
          return `Username must be no more than ${VALIDATION.USERNAME.MAX_LENGTH} characters long`;
        }
        if (!VALIDATION.USERNAME.PATTERN.test(value)) {
          return "Username can only contain letters, numbers, and underscores";
        }
        return "";

      case "uniqueId":
        if (!value) return "Unique ID is required";
        if (!VALIDATION.UNIQUE_ID.PATTERN.test(value)) {
          return `Unique ID must be exactly ${VALIDATION.UNIQUE_ID.LENGTH} digits`;
        }
        return "";

      case "message":
        if (!value || !value.trim()) return "Message cannot be empty";
        if (value.length > 1000) return "Message is too long (max 1000 characters)";
        return "";

      default:
        return "";
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  const clearFieldError = useCallback(fieldName => {
    setErrors(prev => ({ ...prev, [fieldName]: "" }));
  }, []);

  return {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    setFieldError,
    clearFieldError,
    setFormData,
  };
};

export default useFormValidation;
