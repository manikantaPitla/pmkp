import React, { useState, useRef, useCallback } from "react";
import { Button, Input } from "../components/ui";
import { useLoading } from "../hooks";
import { Divider, getFirebaseErrorMessage, m_uid, MainLayout, p_uid, toast } from "../utils";
import { sendDirectMessage } from "../services";
import { Link } from "react-router-dom";
import { FormContainer } from "../styles";
import { smsIcon, userIcon } from "../assets/icons/svg";

function DefaultPage() {
  const [formData, setFormData] = useState({ uniqueId: "", message: "" });

  const messageInputRef = useRef(null);
  const { loading, startLoading, stopLoading } = useLoading();

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const { uniqueId, message } = formData;
    if (!uniqueId || ![p_uid, m_uid].includes(uniqueId)) {
      toast.error("Please enter valid unique ID");
      return false;
    }

    if (!message.trim()) {
      toast.error("Please enter message");
      return false;
    }
    return true;
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
      <FormContainer onSubmit={handleSubmit}>
        <Input iconSrc={userIcon} type="text" placeholder="Sender Unique ID" name="uniqueId" onChange={handleInputChange} value={formData.uniqueId} />
        <Input iconSrc={smsIcon} type="text" placeholder="Message" name="message" onChange={handleInputChange} value={formData.message} ref={messageInputRef} />
        <Button type="submit">Send</Button>
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

export default DefaultPage;
