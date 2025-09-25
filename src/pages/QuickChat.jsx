import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { Button, Input } from "../components/ui";
import { useLoading } from "../hooks";
import { Divider, getFirebaseErrorMessage, m_uid, MainLayout, p_uid, toast, TEXT } from "../utils";
import { sendDirectMessage } from "../services";
import { Link } from "react-router-dom";
import { FormContainer } from "../styles";
import { smsIcon, userIcon } from "../assets/icons/svg";

function QuickChat() {
  const [formData, setFormData] = useState({ uniqueId: "", message: "" });
  const [errors, setErrors] = useState({ uniqueId: "", message: "" });

  const messageInputRef = useRef(null);
  const { loading, startLoading, stopLoading } = useLoading();

  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const { uniqueId, message } = formData;
    const newErrors = { uniqueId: "", message: "" };
    let isValid = true;

    if (!uniqueId) {
      newErrors.uniqueId = "Please enter unique ID";
      isValid = false;
    } else if (![p_uid, m_uid].includes(uniqueId)) {
      newErrors.uniqueId = "Please enter valid unique ID";
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = "Please enter message";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      startLoading();

      await toast.promise(sendDirectMessage(formData.uniqueId, formData.message.trim()), {
        loading: "Sending...",
        success: "Message sent successfully",
        error: error => getFirebaseErrorMessage(error),
      });
      setFormData(prev => ({ ...prev, message: "" }));
      messageInputRef.current?.focus();
    } catch (error) {
      // Error handled by toast.promise
    } finally {
      stopLoading();
    }
  };

  return (
    <MainLayout>
      <HeaderBlock>
        <Title>{TEXT.QUICK_CHAT.TITLE}</Title>
        <Description>{TEXT.QUICK_CHAT.DESCRIPTION}</Description>
      </HeaderBlock>
      <FormContainer onSubmit={handleSubmit}>
        <div>
          <Input
            iconSrc={userIcon}
            type="text"
            placeholder="Sender Unique ID"
            name="uniqueId"
            onChange={handleInputChange}
            value={formData.uniqueId}
            error={!!errors.uniqueId}
            label="Unique ID"
            id="default-uniqueId"
          />
          {errors.uniqueId && <div style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px", marginLeft: "4px" }}>{errors.uniqueId}</div>}
        </div>
        <div>
          <Input
            iconSrc={smsIcon}
            type="text"
            placeholder="Message"
            name="message"
            onChange={handleInputChange}
            value={formData.message}
            ref={messageInputRef}
            error={!!errors.message}
            label="Message"
            id="default-message"
          />
          {errors.message && <div style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px", marginLeft: "4px" }}>{errors.message}</div>}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid #000",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          ) : (
            "Send"
          )}
        </Button>
      </FormContainer>
      <Divider>OR</Divider>
      <Link to="/login">
        <Button type="button" disabled={loading}>
          Login
        </Button>
      </Link>
    </MainLayout>
  );
}

export default QuickChat;

const HeaderBlock = styled.div`
  text-align: center;
`;

const Title = styled.h3`
  font-size: 18px;
`;

const Description = styled.p`
  font-size: var(--fs-xl);
`;
