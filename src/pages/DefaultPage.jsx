import React, { useEffect, useState, useRef, useCallback } from "react";
import MainLayout from "../components/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import { sendDirectMessage } from "../services/firebaseFunctions";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/dbConfig";
import { Divider, FormContainer } from "../styles/customStyles";

function DefaultPage() {
  const [formData, setFormData] = useState({ uniqueId: "", message: "" });
  const navigate = useNavigate();
  const messageInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate(`/profile/${user.uid}`);
    });
    return unsubscribe;
  }, [navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const { uniqueId, message } = formData;
    if (!uniqueId || !["0928", "0830"].includes(uniqueId)) {
      toast.error("Please enter a valid unique ID");
      return false;
    }
    if (!message) {
      toast.error("Please enter a message");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await toast.promise(
        sendDirectMessage(formData.uniqueId, formData.message),
        {
          loading: "Sending...",
          success: "Message sent successfully",
          error: (err) => err.message,
        }
      );

      setFormData((prev) => ({ ...prev, message: "" }));
      messageInputRef.current?.focus();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <MainLayout>
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Sender Unique ID"
          name="uniqueId"
          onChange={handleInputChange}
          value={formData.uniqueId}
        />
        <Input
          type="text"
          placeholder="Message..."
          name="message"
          onChange={handleInputChange}
          value={formData.message}
          ref={messageInputRef}
        />
        <Button type="submit">Send</Button>
      </FormContainer>
      <Divider>
        <hr />
        OR
        <hr />
      </Divider>
      <Link to="/login">
        <Button type="button">Login</Button>
      </Link>
    </MainLayout>
  );
}

export default React.memo(DefaultPage);
