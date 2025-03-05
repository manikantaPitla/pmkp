import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import Header from "../../components/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Form } from "./styled-component";
import toast from "react-hot-toast";
import { sendDirectMessage } from "../../services/firebaseFunctions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/dbConfig";

function DefaultPage() {
  const [formData, setFormData] = useState({ uniqueId: "", message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(`/profile/${user.uid}`);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { uniqueId, message } = formData;

    if (!uniqueId || (uniqueId !== "0928" && uniqueId !== "0830")) {
      toast.error("Please enter a valid unique ID");
      return false;
    }

    if (!message) {
      toast.error("Please enter a message");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        const { uniqueId, message } = formData;

        await toast.promise(sendDirectMessage(uniqueId, message), {
          loading: "Sending...",
          success: "Message sent successfully",
          error: (err) => err.message,
        });

        setFormData((prev) => ({ ...prev, message: "" }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <Header />
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Sender Unique ID"
          name="id"
          onChange={handleInputChange}
          value={formData.uniqueId}
        />
        <Input
          type="text"
          placeholder="Message..."
          name="message"
          onChange={handleInputChange}
          value={formData.message}
        />

        <Button type="submit">Send</Button>
      </Form>
    </MainLayout>
  );
}

export default DefaultPage;
